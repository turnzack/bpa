const fsSync = require("node:fs");
const fsPromises = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

async function hashFile(filePath) {
  const content = await fsPromises.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function writeAtomicDurably(filePath, content) {
  const directory = path.dirname(filePath);
  if (!fsSync.existsSync(directory)) {
      await fsPromises.mkdir(directory, { recursive: true });
  }
  
  const temporaryPath = path.join(directory, `.${path.basename(filePath)}.${process.pid}.tmp`);
  
  // Durabilité Disque (Fsync)
  const handle = await fsPromises.open(temporaryPath, "w");
  try {
    await handle.writeFile(content, "utf8");
    await handle.sync(); // Force flush vers le disque physique (anti coupure de courant)
  } finally {
    await handle.close();
  }

  const written = await fsPromises.readFile(temporaryPath, "utf8");
  if (written !== content) {
    await fsPromises.rm(temporaryPath, { force: true });
    throw new Error(`[KIROV_GUARD] Vérification d'écriture échouée : ${filePath}`);
  }

  await fsPromises.rename(temporaryPath, filePath);
}

function assertSameFilesystem(pathA, pathB) {
  try {
    const deviceA = fsSync.statSync(pathA).dev;
    const deviceB = fsSync.statSync(pathB).dev;
    if (deviceA !== deviceB) {
      throw new Error("STAGING_ACTIVE_DIFFERENT_FILESYSTEM : Impossible de garantir un renommage atomique inter-volumes.");
    }
  } catch (err) {
    console.warn("[KIROV_WARN] Impossible de vérifier le système de fichiers (dossier manquant ?)", err.message);
  }
}

function hashReleaseManifest(manifest) {
  return crypto.createHash("sha256")
    .update(JSON.stringify({
        versionId: manifest.versionId,
        blueprintHash: manifest.blueprintHash,
        files: manifest.files
    })).digest("hex");
}

async function assertCurrentVersion({ activeRoot, expectedVersionId }) {
  const currentPath = path.join(activeRoot, "CURRENT");
  const value = await fsPromises.readFile(currentPath, "utf8");
  const current = value.trim();

  if (current !== expectedVersionId) {
    throw new Error(`[KIROV_GUARD] CURRENT pointe vers ${current}, attendu ${expectedVersionId}`);
  }

  const versionPath = path.join(activeRoot, "versions", current);
  const stat = await fsPromises.stat(versionPath);
  if (!stat.isDirectory()) {
    throw new Error(`[KIROV_GUARD] Version active invalide : ${versionPath}`);
  }

  return versionPath;
}

const { assertPromotionAllowed } = require("./validators/VisualReleaseGate");
const { canPromotePlatinum } = require("./validators/ContractValidator");

class PromotionManager {
  constructor(workspaceManager) {
    this.workspace = workspaceManager;
  }

  async promote(report) {
    if (!report) {
      throw new Error("Promotion refusée : Rapport manquant.");
    }

    // Nouvelle Gate Visual Release : Bloque si les contrats et la conversion ne sont pas prouvés.
    assertPromotionAllowed(report);

    // Double vérification pour éviter tout contournement par l'IA
    if (report.visualGate && !report.visualGate.passed) {
      throw Object.assign(
        new Error("Promotion refusée : gate visuelle non validée."),
        { code: "VISUAL_GATE_NOT_PASSED" }
      );
    }

    // Ultime Gate Platine
    if (!canPromotePlatinum(report, report.capabilities || {})) {
      throw Object.assign(
        new Error("Gate Platine refusée : les contrats finaux, les tests métier ou les métriques sont incomplets."),
        { code: "PLATINUM_GATE_FAILED", report }
      );
    }

    // Vérification stricte des préconditions physiques
    if (report.build?.status !== "executed_passed" || report.runtime?.status !== "passed") {
        throw new Error("PROMOTION_BLOCKED_NOT_VALIDATED");
    }

    // Vérification du volume disque pour garantir le rename()
    assertSameFilesystem(this.workspace.paths.workspace, this.workspace.paths.active);

    const versionId = `version-${Date.now()}`;
    const versionsRoot = path.join(this.workspace.paths.active, "versions");
    
    await fsPromises.mkdir(versionsRoot, { recursive: true });
    await fsPromises.mkdir(this.workspace.paths.backups, { recursive: true });

    const destination = path.join(versionsRoot, versionId);

    if (fsSync.existsSync(destination)) {
      throw new Error(`Version déjà existante : ${versionId}`);
    }

    // 1. Déplace le staging validé vers le dossier de version immuable
    await fsPromises.rename(this.workspace.paths.workspace, destination);

    // 2. Bascule du pointeur CURRENT (Atomique & Durable)
    const currentPath = path.join(this.workspace.paths.active, "CURRENT");
    await writeAtomicDurably(currentPath, `${versionId}\n`);
    
    // 3. Vérification du pointeur et du hash
    await assertCurrentVersion({ activeRoot: this.workspace.paths.active, expectedVersionId: versionId });

    // 4. (NOUVEAU) Export NotebookLM Automatique post-promotion
    try {
      const NotebookLmExporter = require("./notebooklm/NotebookLmExporter");
      const projectId = path.basename(this.workspace.paths.workspace);
      // Ne pas bloquer la promotion si l'export échoue
      NotebookLmExporter.exportProjectKnowledge(projectId, this.workspace.paths.active)
        .catch(err => console.error("[PromotionManager] Echec de l'export NotebookLM:", err));
    } catch (e) {
      console.warn("[PromotionManager] NotebookLmExporter introuvable ou erreur:", e);
    }

    return {
      versionId,
      activePath: destination,
      pointer: currentPath
    };
  }

  async rollbackToVersion(versionId) {
    const versionsRoot = path.join(this.workspace.paths.active, "versions");
    const target = path.join(versionsRoot, versionId);

    if (!fsSync.existsSync(target)) {
      throw new Error(`Version introuvable pour rollback : ${versionId}`);
    }

    const currentPath = path.join(this.workspace.paths.active, "CURRENT");
    await writeAtomicDurably(currentPath, `${versionId}\n`);

    // Validation du Rollback (Le pointeur pointe-t-il bien vers l'ancienne version ?)
    await assertCurrentVersion({ activeRoot: this.workspace.paths.active, expectedVersionId: versionId });

    return {
      status: "rolled_back",
      versionId
    };
  }
}

module.exports = { PromotionManager, writeAtomicDurably, assertCurrentVersion, hashFile, hashReleaseManifest, assertSameFilesystem };
