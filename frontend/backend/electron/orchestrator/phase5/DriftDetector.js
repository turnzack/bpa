"use strict";

const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

class DriftDetector {
  constructor(logger = console) {
    this.logger = logger;
  }

  async detectDrift(projectRoot, implementationManifest, plan = { preserve: [], modify: [], delete: [] }) {
    if (!implementationManifest) {
      return { status: "passed", verified: true, mode: "real", drifted: false, conflicts: [] };
    }

    const conflicts = [];
    const entries = this.normalizeEntries(implementationManifest);

    for (const entry of entries) {
      const relativePath = this.normalizeRelativePath(entry.path);
      const fullPath = this.safeResolve(projectRoot, relativePath);

      let actualHash;
      try {
        const buffer = await fs.readFile(fullPath);
        actualHash = `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
      } catch (error) {
        conflicts.push({
          code: "MANAGED_FILE_MISSING",
          path: relativePath,
          expectedHash: entry.sha256 || entry.hash,
          actualHash: null
        });
        continue;
      }

      const expectedHash = entry.sha256 || entry.hash;

      if (actualHash !== expectedHash) {
        conflicts.push({
          code: "DRIFT_DETECTED",
          path: relativePath,
          expectedHash,
          actualHash
        });
      }
    }

    return {
      status: conflicts.length > 0 ? "failed" : "passed",
      verified: conflicts.length === 0,
      mode: "real",
      drifted: conflicts.length > 0,
      conflicts,
      errors: conflicts
    };
  }

  normalizeEntries(manifest) {
    const entries = manifest.files || manifest.managedFiles || manifest.entries || [];
    return entries.map((entry) => ({
      path: entry.path || entry.relativePath,
      sha256: entry.sha256 || entry.hash || entry.implementationHash
    }));
  }

  safeResolve(root, relativePath) {
    const resolved = path.resolve(root, relativePath);
    const relative = path.relative(path.resolve(root), resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw Object.assign(new Error(`Chemin hors projet : ${relativePath}`), { code: "PATH_OUTSIDE_PROJECT" });
    }
    return resolved;
  }

  normalizeRelativePath(value) {
    return String(value).replace(/\\/g, "/").replace(/^\.\/+/, "");
  }
}

module.exports = DriftDetector;
