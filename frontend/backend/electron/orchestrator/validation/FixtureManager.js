"use strict";

const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const FIXTURE_ROOT = path.resolve(__dirname, "fixtures");

async function copyFixture(name) {
  const source = path.join(FIXTURE_ROOT, name);
  const tmpBase = path.resolve(__dirname, "..", "..", "..", ".tmp");
  
  try {
    await fs.mkdir(tmpBase, { recursive: true });
  } catch(e) {}
  
  const target = await fs.mkdtemp(path.join(tmpBase, `pipeline-${name}-`));

  await fs.cp(source, target, {
    recursive: true,
    filter: (sourcePath) => {
      return !["node_modules", "dist", "build", ".kirov/reports", ".kirov/staging"].some((excluded) =>
        sourcePath.split(path.sep).includes(excluded)
      );
    }
  });

  const { execSync } = require("child_process");
  try {
    execSync("pnpm install", { cwd: target, stdio: "ignore" });
  } catch (e) {
    console.warn(`[FIXTURE-MANAGER] pnpm install a échoué dans ${target} : ${e.message}`);
  }

  return target;
}

const crypto = require("crypto");

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function createFileSnapshot(root) {
  const snapshot = {};

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (["node_modules", "dist", "build", ".git"].includes(entry.name)) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      const content = await fs.readFile(fullPath);
      const relative = path.relative(root, fullPath).replace(/\\/g, "/");
      snapshot[relative] = hashContent(content);
    }
  }

  await walk(root);
  return snapshot;
}

function compareSnapshots(before, after) {
  const paths = new Set([
    ...Object.keys(before),
    ...Object.keys(after)
  ]);

  return [...paths]
    .filter((file) => before[file] !== after[file])
    .map((file) => ({
      path: file,
      before: before[file] || null,
      after: after[file] || null
    }));
}

module.exports = { copyFixture, createFileSnapshot, compareSnapshots };
