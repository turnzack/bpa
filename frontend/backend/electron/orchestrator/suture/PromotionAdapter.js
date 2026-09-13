'use strict';

/**
 * PromotionAdapter.js
 * ─────────────────────────────────────────────────────────────────
 * Sprint 12 — Adaptateur Suture V2 → PromotionManager.
 *
 * Fournit une interface simplifiée pour que SutureRunner puisse
 * déclencher la promotion atomique sans connaître l'ancienne API
 * de WorkspaceManager.
 *
 * Le PromotionManager existant attend un { workspace } avec des
 * paths structurés. Cet adaptateur construit ce contexte depuis
 * les paramètres Suture (workspaceRoot, activeRoot).
 * ─────────────────────────────────────────────────────────────────
 */

const path = require('path');
const fsSync = require('fs');
const { PromotionManager, writeAtomicDurably, hashFile } = require('../PromotionManager');

/**
 * Construit un objet workspace-compatible attendu par PromotionManager.
 */
function buildWorkspaceContext({ workspaceRoot, projectRoot, repairId }) {
  const activeRoot    = projectRoot;
  const versionsRoot  = path.join(activeRoot, '.kirov', 'versions');
  const backupsRoot   = path.join(activeRoot, '.kirov', 'backups');

  return {
    paths: {
      workspace: workspaceRoot,
      active:    versionsRoot,
      backups:   backupsRoot
    }
  };
}

/**
 * Construit un rapport simplifié compatible avec PromotionManager.promote().
 *
 * Note : Le PromotionManager original vérifie report.build.status et
 * report.runtime.status. On les mappe depuis la validation Suture V2.
 */
function buildPromotionReport(validation) {
  return {
    build: {
      status:  validation.gates?.build?.status === 'passed' ? 'executed_passed' : 'failed'
    },
    runtime: {
      status: validation.gates?.runtime?.status === 'passed' ? 'passed' : 'failed'
    },
    // Désactiver les gates Platinum/Visual (non pertinentes pour Suture V2)
    visualGate: { passed: true },
    capabilities: { platinum: false }
  };
}

/**
 * Exécute la promotion atomique du workspace Suture vers .kirov/versions/.
 *
 * @param {object} params
 * @param {string}   params.workspaceRoot   - Workspace validé
 * @param {string}   params.projectRoot     - Racine du projet actif
 * @param {string}   params.repairId        - ID de la réparation
 * @param {object}   params.validation      - Rapport de validation complet
 * @returns {object} Résultat de promotion { status, versionId, path }
 */
async function promoteWorkspace({ workspaceRoot, projectRoot, repairId, validation }) {
  console.log(`[PROMOTION-ADAPTER] 🚀 Démarrage de la promotion atomique pour ${repairId}`);

  const wsContext  = buildWorkspaceContext({ workspaceRoot, projectRoot, repairId });
  const promReport = buildPromotionReport(validation);

  // S'assurer que les dossiers de versions/backups existent
  for (const dir of [wsContext.paths.active, wsContext.paths.backups]) {
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
    }
  }

  const manager = new PromotionManager(wsContext);

  try {
    const result = await manager.promote(promReport);
    console.log(`[PROMOTION-ADAPTER] ✅ Promotion réussie → version ${result.versionId}`);
    return {
      status:    'promoted',
      versionId: result.versionId,
      path:      result.activePath,
      pointer:   result.pointer,
      repairId
    };
  } catch (err) {
    console.error(`[PROMOTION-ADAPTER] ❌ Promotion échouée : [${err.code || 'ERR'}] ${err.message}`);
    return {
      status:  'promotion_failed',
      error:   { code: err.code || 'PROMOTION_ERROR', message: err.message },
      repairId
    };
  }
}

/**
 * Rollback vers une version précédente.
 */
async function rollbackVersion({ projectRoot, versionId }) {
  console.log(`[PROMOTION-ADAPTER] ⏪ Rollback vers ${versionId}`);

  const wsContext = buildWorkspaceContext({
    workspaceRoot: path.join(projectRoot, '.kirov', 'versions', versionId),
    projectRoot,
    repairId: 'rollback'
  });

  const manager = new PromotionManager(wsContext);
  return manager.rollbackToVersion(versionId);
}

module.exports = { promoteWorkspace, rollbackVersion };
