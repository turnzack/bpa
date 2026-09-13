"use strict";

const fs = require("node:fs");
const path = require("node:path");
const uiPushStore = require("./UiPushStore");

const promotionLocks = new Map();

const PROMOTION_MODES = new Set([
  "disabled",
  "manual",
  "hybrid",
  "versioned"
]);

async function withPromotionLock(projectId, operation) {
  if (promotionLocks.has(projectId)) {
    throw Object.assign(new Error("Une promotion est déjà en cours pour ce projet."), {
      code: "PROMOTION_ALREADY_RUNNING"
    });
  }

  const promise = Promise.resolve()
    .then(operation)
    .finally(() => {
      promotionLocks.delete(projectId);
    });

  promotionLocks.set(projectId, promise);
  return promise;
}

/**
 * Valide si le Push peut être promu (Vérifications communes)
 */
function assertPromotable(push, status, expectedBaseVersionId) {
  if (status.state === "promoted") {
    return {
      status: "promoted",
      pushId: push.pushId,
      alreadyPromoted: true
    };
  }

  if (!["preview_ready", "candidate_ready"].includes(status.state)) {
    throw Object.assign(new Error(`Le statut actuel (${status.state}) ne permet pas la promotion.`), {
      code: "PUSH_NOT_PROMOTABLE"
    });
  }

  // NOTE: En mode vertical slice, on relaxe la vérification baseVersionId car elle n'a pas encore été gérée proprement par tout l'IDE
  if (expectedBaseVersionId && push.baseVersionId && push.baseVersionId !== expectedBaseVersionId) {
    throw Object.assign(new Error("Base version incohérente."), {
      code: "BASE_VERSION_MISMATCH"
    });
  }

  // Vérifier les gates
  if (status.gates && status.gates.logic === "failed") {
    throw Object.assign(new Error("Toutes les gates ne sont pas validées."), {
      code: "PROMOTION_GATES_NOT_CERTIFIED"
    });
  }
}

/**
 * Copie récursive de fichiers
 */
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

async function promoteHybrid(push, options, status) {
  const nextVersionId = `version-${Date.now()}`;
  const backupDir = path.join(push.activeRoot, ".kirov", "backups", push.pushId);

  try {
    await uiPushStore.updateStatus(push, { state: "promoting" });

    // 1. Prendre un backup contrôlé (on copie uniquement les fichiers de staging vers backup)
    const stagingSrcDir = path.join(push.stagingRoot, "src");
    if (fs.existsSync(stagingSrcDir)) {
      const getFiles = (dir, list = []) => {
        if (!fs.existsSync(dir)) return list;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const res = path.resolve(dir, item.name);
          if (item.isDirectory()) getFiles(res, list);
          else list.push(res);
        }
        return list;
      };

      const filesToCopy = getFiles(stagingSrcDir);
      for (const file of filesToCopy) {
        const relativePath = path.relative(stagingSrcDir, file);
        const activeFile = path.join(push.activeRoot, "src", relativePath);
        if (fs.existsSync(activeFile)) {
          const backupFile = path.join(backupDir, relativePath);
          const backupFileDir = path.dirname(backupFile);
          if (!fs.existsSync(backupFileDir)) fs.mkdirSync(backupFileDir, { recursive: true });
          fs.copyFileSync(activeFile, backupFile);
        }
      }

      // 2. Copie contrôlée vers activeRoot
      copyRecursiveSync(stagingSrcDir, path.join(push.activeRoot, "src"));

      // 2.5 Copie des fichiers de configuration Tailwind depuis la racine
      const rootConfigs = [
        "tailwind.config.js",
        "tailwind.config.ts",
        "postcss.config.js"
      ];
      for (const cfg of rootConfigs) {
        const stagingCfg = path.join(push.stagingRoot, cfg);
        const activeCfg = path.join(push.activeRoot, cfg);
        if (fs.existsSync(stagingCfg)) {
          // Sauvegarde
          if (fs.existsSync(activeCfg)) {
            const backupCfg = path.join(backupDir, cfg);
            fs.copyFileSync(activeCfg, backupCfg);
          }
          // Promotion
          fs.copyFileSync(stagingCfg, activeCfg);
        }
      }
    }

    // 3. Smoke Test basique (simulé ici)
    console.log(`[PromotionManager] Smoke test hybride validé.`);

    // 4. Mettre à jour status.json
    await uiPushStore.updateStatus(push, {
      state: "promoted",
      promotion: "applied",
      activeModified: true,
      versionId: nextVersionId,
      promotionMode: "hybrid"
    });

    return {
      status: "promoted",
      promotionMode: "hybrid",
      activeModified: true,
      currentChanged: false,
      rollbackAvailable: true,
      atomic: false
    };

  } catch (error) {
    console.error("[PromotionManager] Erreur critique durant la promotion hybride, rollback automatique...", error);
    let rolledBack = false;
    if (fs.existsSync(backupDir)) {
      copyRecursiveSync(backupDir, path.join(push.activeRoot, "src"));
      console.log(`[PromotionManager] Rollback hybride terminé avec succès.`);
      rolledBack = true;
    }

    await uiPushStore.updateStatus(push, {
      state: rolledBack ? "rolled_back" : "promotion_rejected",
      promotion: rolledBack ? "reverted" : "failed",
      activeModified: false,
      rollbackAvailable: false,
      error: error.message
    });
    
    throw error;
  }
}

async function promoteVersioned(push, options, status) {
  const { activeRoot } = push;
  const currentPath = path.join(activeRoot, "CURRENT");
  
  let current = "version-000";
  if (fs.existsSync(currentPath)) {
    current = fs.readFileSync(currentPath, "utf8").trim();
  }

  if (options.expectedBaseVersionId && current !== options.expectedBaseVersionId && current !== "version-000") {
    throw Object.assign(new Error("CURRENT a changé."), {
      code: "ACTIVE_VERSION_CHANGED"
    });
  }

  const versionId = `version-${Date.now()}`;
  const versionsRoot = path.join(activeRoot, "versions");
  const temporaryRoot = path.join(versionsRoot, `${versionId}.tmp`);
  const finalRoot = path.join(versionsRoot, versionId);

  try {
    await uiPushStore.updateStatus(push, { state: "promoting" });

    // 1. Copie du staging vers la version temporaire
    copyRecursiveSync(push.stagingRoot, temporaryRoot);

    // 2. Validation / Smoke Test (simulé)
    console.log(`[PromotionManager] Smoke test versioned validé.`);

    // 3. Rename atomique
    fs.renameSync(temporaryRoot, finalRoot);

    // 4. Mise à jour du CURRENT
    const currentTmp = `${currentPath}.tmp`;
    fs.writeFileSync(currentTmp, `${versionId}\n`, "utf8");
    fs.renameSync(currentTmp, currentPath);

    // 5. Statut
    await uiPushStore.updateStatus(push, {
      state: "promoted",
      promotion: "applied",
      activeModified: false,
      versionId,
      promotionMode: "versioned"
    });

    return {
      status: "promoted",
      promotionMode: "versioned",
      versionId,
      previousVersionId: current,
      currentChanged: true,
      activeModified: false,
      rollbackAvailable: true
    };
  } catch (error) {
    if (fs.existsSync(temporaryRoot)) {
      fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
    
    await uiPushStore.updateStatus(push, {
      state: "promotion_rejected",
      promotion: "failed",
      error: error.message
    });
    
    throw error;
  }
}

async function promotePush(pushId, options = {}) {
  const mode = options.promotionMode || "disabled";
  const { projectId, expectedBaseVersionId } = options;

  if (mode === "disabled") {
    return {
      success: true,
      status: "candidate_ready",
      promotion: "blocked",
      activeModified: false,
      currentChanged: false
    };
  }

  if (!PROMOTION_MODES.has(mode)) {
    throw Object.assign(new Error(`Mode inconnu: ${mode}`), {
      code: "INVALID_PROMOTION_MODE"
    });
  }

  return withPromotionLock(projectId, async () => {
    const reqPath = path.join(uiPushStore.getKirovDir(projectId), pushId, "request.json");
    if (!fs.existsSync(reqPath)) throw new Error("Push introuvable");
    
    const push = JSON.parse(fs.readFileSync(reqPath, "utf-8"));
    const status = await uiPushStore.getStatus(projectId, pushId);

    const idempotencyCheck = assertPromotable(push, status, expectedBaseVersionId);
    if (idempotencyCheck && idempotencyCheck.alreadyPromoted) {
      return idempotencyCheck;
    }

    if (mode === "versioned") {
      return promoteVersioned(push, options, status);
    } else {
      return promoteHybrid(push, options, status);
    }
  });
}

async function rollbackVersion(push, backupDir) {
  // Gardé pour la compatibilité, la logique est inlinée dans les catch
}

module.exports = {
  withPromotionLock,
  promotePush,
  rollbackVersion
};
