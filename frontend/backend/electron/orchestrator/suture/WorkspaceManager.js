const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const { PROJECTS_ROOT } = require('./SutureConfig');

const COPY_EXCLUDES = new Set([
  "node_modules",
  "dist",
  "build",
  ".kirov",
  ".git"
]);

function generateRepairId() {
  return `repair-${Date.now()}-${crypto.randomUUID ? crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 8)}`;
}

function hashFileContent(content) {
  return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');
}

function hashFileSync(filePath) {
  const content = fs.readFileSync(filePath); // Always read as Buffer for accurate binary/text hashing
  return hashFileContent(content);
}

function normalizeRoot(value) {
  return path
    .resolve(String(value))
    .replace(/[\\/]+$/, "")
    .toLowerCase();
}

function assertWorkspaceChain({ previousRoot, sourceRoot, activeRoot }) {
  const source = normalizeRoot(sourceRoot);
  const previous = previousRoot ? normalizeRoot(previousRoot) : null;
  const active = normalizeRoot(activeRoot);

  if (previous && source !== previous) {
    throw Object.assign(
      new Error("La source du workspace ne correspond pas au workspace précédent."),
      {
        code: "WORKSPACE_CHAIN_BROKEN",
        previousRoot,
        sourceRoot
      }
    );
  }

  if (source === active && previous) {
    throw Object.assign(
      new Error("Retour interdit vers activeRoot."),
      {
        code: "STAGING_CHAIN_REVERTED_TO_ACTIVE",
        sourceRoot,
        activeRoot
      }
    );
  }
}

async function createFileSnapshot(root) {
  const snapshot = {};
  
  async function walk(currentDir) {
    const entries = await fsPromises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (COPY_EXCLUDES.has(entry.name)) continue;
      
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      
      if (entry.isFile()) {
        const relativePath = path.relative(root, absolutePath).replace(/\\/g, "/");
        const content = await fsPromises.readFile(absolutePath);
        snapshot[relativePath] = hashFileContent(content);
      }
    }
  }

  await walk(root);
  return snapshot;
}

async function createScopedSnapshot(root, scopedPaths = []) {
  const snapshot = {};
  
  async function walk(currentDir) {
    const entries = await fsPromises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (COPY_EXCLUDES.has(entry.name)) continue;
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (entry.isFile()) {
        const relativePath = path.relative(root, absolutePath).replace(/\\/g, "/");
        const content = await fsPromises.readFile(absolutePath);
        snapshot[relativePath] = hashFileContent(content);
      }
    }
  }

  for (const relPath of scopedPaths) {
    const fullPath = path.join(root, relPath);
    if (!fs.existsSync(fullPath)) continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await walk(fullPath);
    } else if (stat.isFile()) {
      const relativePath = path.relative(root, fullPath).replace(/\\/g, "/");
      const content = await fsPromises.readFile(fullPath);
      snapshot[relativePath] = hashFileContent(content);
    }
  }
  return snapshot;
}

function compareSnapshots(before, after) {
  const paths = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {})
  ]);

  const changed = [];

  for (const filePath of paths) {
    if (before[filePath] !== after[filePath]) {
      changed.push({
        path: filePath,
        before: before[filePath] || null,
        after: after[filePath] || null
      });
    }
  }

  return changed;
}

function copyProjectToWorkspace(sourceDir, targetDir, relativeBase = "") {
  const baseVersionFiles = {};

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    if (COPY_EXCLUDES.has(entry.name)) continue;

    const srcPath = path.join(sourceDir, entry.name);
    const destPath = path.join(targetDir, entry.name);
    const relPath = path.join(relativeBase, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      const subFiles = copyProjectToWorkspace(srcPath, destPath, relPath);
      Object.assign(baseVersionFiles, subFiles);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      baseVersionFiles[relPath] = {
        hash: hashFileSync(srcPath),
        bytes: fs.statSync(srcPath).size
      };
    }
  }

  return baseVersionFiles;
}

function copyStitchContract(sourceRoot, workspaceRoot) {
  const source = path.join(sourceRoot, ".kirov", "design-contract");
  const target = path.join(workspaceRoot, ".kirov", "design-contract");

  if (!fs.existsSync(source)) {
    return false;
  }

  fs.mkdirSync(target, { recursive: true });
  fs.cpSync(source, target, { recursive: true });
  return true;
}

function linkNodeModules(sourceRoot, targetRoot) {
  const sourceNM = path.join(sourceRoot, "node_modules");
  const targetNM = path.join(targetRoot, "node_modules");
  if (fs.existsSync(sourceNM)) {
    try {
      fs.symlinkSync(sourceNM, targetNM, "junction");
    } catch (e) {
      console.warn(`[KIROV5] Impossible de lier node_modules : ${e.message}`);
    }
  }
}

function unlinkWorkspaceNodeModules(workspaceRoot) {
  const target = path.join(workspaceRoot, "node_modules");
  if (fs.existsSync(target)) {
    try {
      fs.rmSync(target, { recursive: true, force: true });
    } catch (e) {
      console.warn(`[KIROV5] Échec de la déconnexion de node_modules : ${e.message}`);
    }
  }
}

async function createRepairWorkspace({ projectId, projectRoot, activeRoot, previousRoot, diagnostic }) {
  const sourceRoot = projectRoot || activeRoot;

  assertWorkspaceChain({ previousRoot, sourceRoot, activeRoot });

  const repairId = generateRepairId();
  const repairRoot = path.resolve(sourceRoot, ".kirov", "improvements", repairId);
  const workspaceRoot = path.resolve(repairRoot, "workspace");

  fs.mkdirSync(workspaceRoot, { recursive: true });

  fs.writeFileSync(
    path.join(repairRoot, "diagnostic.json"),
    JSON.stringify(diagnostic, null, 2)
  );

  const baseVersionFiles = copyProjectToWorkspace(sourceRoot, workspaceRoot);
  const hasStitchContract = copyStitchContract(sourceRoot, workspaceRoot);
  linkNodeModules(sourceRoot, workspaceRoot);

  const stitchManifestPath = path.join(workspaceRoot, ".kirov", "design-contract", "stitch-manifest.json");

  if (hasStitchContract) {
    if (!fs.existsSync(stitchManifestPath)) {
      throw Object.assign(
        new Error("Le contrat Stitch n'a pas été copié."),
        { code: "STITCH_CONTRACT_MISSING_IN_WORKSPACE" }
      );
    }

    try {
      const checksumsPath = path.join(workspaceRoot, ".kirov", "design-contract", "checksums.json");
      let expectedHash = null;
      if (fs.existsSync(checksumsPath)) {
        const checksums = JSON.parse(fs.readFileSync(checksumsPath, "utf8"));
        expectedHash = checksums["stitch-manifest.json"];
      } else {
        const manifest = JSON.parse(fs.readFileSync(stitchManifestPath, "utf8"));
        expectedHash = manifest.checksums?.["stitch-manifest.json"];
      }

      if (expectedHash) {
        const actualHash = hashFileSync(stitchManifestPath);
        if (expectedHash !== actualHash) {
          throw Object.assign(
            new Error("Le contrat Stitch a été altéré."),
            { code: "STITCH_CONTRACT_HASH_MISMATCH" }
          );
        }
      }
    } catch (e) {
      if (e.code === "STITCH_CONTRACT_HASH_MISMATCH") throw e;
    }
  }

  const sourceSnapshot = await createFileSnapshot(sourceRoot);
  const workspaceSnapshot = await createFileSnapshot(workspaceRoot);
  const copyDiff = compareSnapshots(sourceSnapshot, workspaceSnapshot);

  if (copyDiff.length > 0) {
    throw Object.assign(new Error("Le workspace ne correspond pas à la base source."), { 
      code: "WORKSPACE_COPY_MISMATCH", 
      changed: copyDiff 
    });
  }

  const baseSnapshot = {
    projectId,
    baseRoot: sourceRoot,
    previousRoot: previousRoot || null,
    activeRoot,
    createdAt: new Date().toISOString(),
    files: baseVersionFiles
  };

  fs.writeFileSync(
    path.join(repairRoot, "base-version.json"),
    JSON.stringify(baseSnapshot, null, 2)
  );

  return {
    repairId,
    repairRoot,
    workspaceRoot,
    baseSnapshot,
    hasStitchContract,
    designContract: hasStitchContract ? stitchManifestPath : null
  };
}

module.exports = {
  createRepairWorkspace,
  createFileSnapshot,
  createScopedSnapshot,
  compareSnapshots,
  generateRepairId,
  unlinkWorkspaceNodeModules,
  assertWorkspaceChain,
  hashFileSync,
  hashFileContent
};
