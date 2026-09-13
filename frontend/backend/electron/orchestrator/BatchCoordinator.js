'use strict';
/**
 * BatchCoordinator — Point d'entrée UNIQUE pour accepter une capture de lot.
 *
 * ZERO TRUST :
 *  - Toute route qui souhaite avancer la file DOIT passer par BatchCoordinator.acceptCapture().
 *  - Le module vérifie sessionId, batchId, contractHash, et captureId (idempotence).
 *  - Les fichiers sont écrits en staging AVANT l'avancement de la queue.
 *  - La session est persistée sur disque APRÈS chaque avancement réussi.
 *
 * Usage :
 *   const batchCoordinator = require('./BatchCoordinator');
 *   const result = await batchCoordinator.acceptCapture({ projectId, sessionId, batchId, contractHash, files, captureId });
 */

const crypto      = require('crypto');
const stateStore  = require('./state-store');

class BatchCoordinator {
  constructor() {}

  /**
   * Accepte une capture de lot, écrit les fichiers en staging, avance la queue.
   *
   * @param {object} opts
   * @param {string}   opts.projectId
   * @param {string}   opts.sessionId
   * @param {string}   opts.batchId
   * @param {string}   opts.contractHash
   * @param {string}   [opts.captureId]    — Identifiant de capture unique (idempotence)
   * @param {function} [opts.writeFn]       — Fonction(files) qui écrit les fichiers en staging
   * @param {object[]} [opts.files]         — Tableau de fichiers à écrire ({ path, content })
   * @returns {Promise<{ accepted, duplicate, advanced, saved, promoted, activeModified, status }>}
   */
  async acceptCapture({ projectId, sessionId, batchId, contractHash, captureId, writeFn, files }) {
    // Générer un captureId si non fourni
    const resolvedCaptureId = captureId || `${sessionId}:${batchId}:${Date.now()}`;

    // 1. Vérification des paramètres obligatoires
    if (!projectId || !sessionId || !batchId || !contractHash) {
      throw Object.assign(
        new Error('CAPTURE_PARAMS_MISSING : projectId, sessionId, batchId et contractHash sont obligatoires.'),
        { code: 'CAPTURE_PARAMS_MISSING' }
      );
    }

    // 2. Vérifier la session AVANT toute écriture
    const session = stateStore.getBatchSession(projectId);
    if (!session) {
      throw Object.assign(new Error(`BATCH_SESSION_NOT_FOUND : ${projectId}`), { code: 'BATCH_SESSION_NOT_FOUND' });
    }

    if (session.sessionId !== sessionId) {
      throw Object.assign(
        new Error('STALE_SESSION'),
        { code: 'STALE_SESSION', expected: session.sessionId, received: sessionId }
      );
    }

    if (session.contractHash !== contractHash) {
      throw Object.assign(new Error('CONTRACT_HASH_MISMATCH'), { code: 'CONTRACT_HASH_MISMATCH' });
    }

    // 3. Idempotence : capture ou lot déjà traité ?
    if (session.processedCaptures?.includes(resolvedCaptureId) || session.completedBatchIds?.includes(batchId)) {
      console.log(`[BATCH_COORDINATOR] 🔁 Capture dupliquée ignorée : ${resolvedCaptureId}`);
      return { accepted: true, duplicate: true, advanced: false, saved: 0, promoted: 0, activeModified: false, status: 'staged' };
    }

    // 4. Écriture en staging AVANT l'avancement
    let saved = 0;
    if (typeof writeFn === 'function' && files?.length > 0) {
      try {
        saved = await writeFn(files);
      } catch (writeError) {
        throw Object.assign(
          new Error(`STAGING_WRITE_FAILED : ${writeError.message}`),
          { code: 'STAGING_WRITE_FAILED', cause: writeError }
        );
      }
    }

    // 5. Avancement atomique de la queue (APRÈS l'écriture réussie)
    const result = stateStore.advanceBatch({ projectId, sessionId, batchId, contractHash, captureId: resolvedCaptureId });

    // 6. Persistance disque de la session mise à jour
    try {
      await stateStore.persistSession(projectId, stateStore.getBatchSession(projectId));
    } catch (persistError) {
      console.warn(`[BATCH_COORDINATOR] ⚠️ Persistance session échouée (non bloquant) : ${persistError.message}`);
    }

    console.log(`[BATCH_COORDINATOR] ✅ Capture acceptée | project=${projectId} batch=${batchId} saved=${saved} advanced=${result.advanced}`);

    return {
      accepted:      true,
      duplicate:     false,
      advanced:      result.advanced,
      completed:     result.completed || false,
      saved,
      promoted:      0,           // ← Jamais 1 ici : promotion = PromotionManager uniquement
      activeModified: false,      // ← activeRoot est intouchable
      status:        'staged'     // ← Jamais 'promoted' ici
    };
  }

  /**
   * Avancement manuel (debug uniquement).
   * En mode Gold, ce chemin est refusé.
   *
   * @param {object} opts
   * @param {string} opts.projectId
   * @param {string} opts.reason
   * @param {string} [opts.authorization] — Token debug optionnel
   * @param {boolean} [opts.goldMode]    — Si true, refuse
   */
  async advanceManually({ projectId, reason, authorization, goldMode }) {
    if (goldMode) {
      throw Object.assign(
        new Error('MANUAL_ADVANCE_FORBIDDEN_IN_GOLD_MODE'),
        { code: 'MANUAL_ADVANCE_FORBIDDEN_IN_GOLD_MODE' }
      );
    }

    const session = stateStore.getBatchSession(projectId);
    if (!session) throw Object.assign(new Error('BATCH_SESSION_NOT_FOUND'), { code: 'BATCH_SESSION_NOT_FOUND' });

    console.warn(`[BATCH_COORDINATOR] ⚠️ Avancement manuel autorisé (debug) | project=${projectId} reason=${reason}`);

    // Utilise le chemin legacy sans vérification de contrat
    const next = stateStore.advanceBatchLegacy(projectId);
    return { advanced: true, next, reason, manual: true };
  }

  /**
   * Génère un captureId unique pour une capture donnée.
   */
  makeCaptureId(sessionId, batchId, attempt = 1) {
    return `${sessionId}:${batchId}:${attempt}`;
  }
}

module.exports = new BatchCoordinator();
