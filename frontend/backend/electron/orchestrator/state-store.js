'use strict';
/**
 * StateStore - Machine à état Singleton pour l'orchestration Multi-Batch KIROV5
 * Gère la file d'attente des lots de fichiers à envoyer à DeepSeek via Hermes.
 *
 * ZERO TRUST — v2 :
 *  - Chaque session porte un sessionId UUID, un contractHash et completedBatchIds.
 *  - advanceBatch() vérifie sessionId + batchId + contractHash avant d'avancer.
 *  - Les sessions sont persistées sur disque (source de vérité) ; la Map est un cache.
 */

const path     = require('path');
const fs       = require('fs');
const fsPromises = require('fs/promises');
const crypto   = require('crypto');

// Racine de persistance par défaut — surchargeable au démarrage via StateStore.init()
let SESSIONS_ROOT = path.join(process.cwd(), '.kirov', 'sessions');

class StateStore {
  constructor() {
    this.jobs    = new Map();   // Jobs Hermes classiques
    this.batches = new Map();   // Sessions Multi-Batch (ZIP)
  }

  // ─── Initialisation ──────────────────────────────────────────────────────────

  /**
   * Définit la racine de persistance et recharge les sessions depuis le disque.
   * À appeler au démarrage du serveur (main.js).
   */
  async init(sessionsRoot) {
    if (sessionsRoot) SESSIONS_ROOT = sessionsRoot;
    fs.mkdirSync(SESSIONS_ROOT, { recursive: true });
    await this.hydrateSessions();
    console.log(`[STATE_STORE] Initialisé. Racine sessions : ${SESSIONS_ROOT}`);
  }

  // ─── Jobs Hermes (legacy, inchangé) ──────────────────────────────────────────

  async load(jobId) {
    if (!this.jobs.has(jobId)) {
      this.jobs.set(jobId, {
        jobId,
        projectId: 'electron-session',
        status: 'running',
        currentPhase: 1,
        iterations: 0
      });
    }
    return this.jobs.get(jobId);
  }

  async complete(jobId, reason) {
    const state = await this.load(jobId);
    state.status = 'completed';
    state.reason = reason;
    this.jobs.set(jobId, state);
    console.log(`[STATE] Job ${jobId} terminé: ${reason}`);
    return state;
  }

  async block(jobId, reason) {
    const state = await this.load(jobId);
    state.status = 'blocked';
    state.reason = reason;
    this.jobs.set(jobId, state);
    console.log(`[STATE] Job ${jobId} bloqué: ${reason}`);
    return state;
  }

  // ─── Sessions Multi-Batch (KIROV5) ───────────────────────────────────────────

  /**
   * Initialise une session multi-batch pour un projet.
   */
  initBatchSession(projectId, batchList, targetAi, userPrompt, autoPilot = true, modeFilter = 'all') {
    const sessionId    = crypto.randomUUID();
    const contractHash = crypto.createHash('sha256')
      .update(JSON.stringify(batchList))
      .digest('hex');

    const firstBatchId = Array.isArray(batchList) && batchList[0]
      ? (batchList[0].id || `batch-0`)
      : 'batch-0';

    const session = {
      projectId,
      sessionId,
      contractHash,
      currentBatchId:    firstBatchId,
      completedBatchIds: [],
      processedCaptures: [],
      targetAi:          targetAi || 'deepseek',
      userPrompt:        userPrompt || "Génère l'application.",
      batches:           batchList,
      currentBatch:      0,
      totalBatches:      batchList.length,
      autoPilot:         autoPilot !== false,
      modeFilter:        modeFilter || 'all',
      status:            'running',
      createdAt:         Date.now()
    };

    this.batches.set(projectId, session);
    console.log(`[BATCH_STATE] Session initialisée pour "${projectId}" : ${batchList.length} lots | sessionId=${sessionId}`);
    return session;
  }

  /**
   * Injecte ou met à jour directement l'objet session pour un projet
   * (utilisé par le Trombone après génération des lots).
   */
  setBatchSession(projectId, sessionData) {
    // Garantir les champs Zero Trust si absents
    if (!sessionData.sessionId)    sessionData.sessionId    = crypto.randomUUID();
    if (!sessionData.contractHash) sessionData.contractHash = crypto.createHash('sha256')
      .update(JSON.stringify(sessionData.batches || []))
      .digest('hex');
    if (!Array.isArray(sessionData.completedBatchIds)) sessionData.completedBatchIds = [];
    if (!Array.isArray(sessionData.processedCaptures)) sessionData.processedCaptures = [];
    if (!sessionData.currentBatchId && sessionData.batches?.[0]) {
      sessionData.currentBatchId = sessionData.batches[0].id || 'batch-0';
    }

    this.batches.set(projectId, sessionData);
    console.log(`[BATCH_STATE] Session injectée (setBatchSession) pour "${projectId}" : ${sessionData.totalBatches} lots | sessionId=${sessionData.sessionId}`);
  }

  getBatchSession(projectId) {
    return this.batches.get(projectId) || null;
  }

  // ─── advanceBatch SÉCURISÉ ───────────────────────────────────────────────────

  /**
   * Avance au lot suivant de façon atomique et idempotente.
   * Vérifie sessionId + batchId + contractHash avant tout avancement.
   *
   * @param {object} opts
   * @param {string} opts.projectId
   * @param {string} opts.sessionId   — doit correspondre à session.sessionId
   * @param {string} opts.batchId     — doit correspondre à session.currentBatchId
   * @param {string} opts.contractHash — doit correspondre à session.contractHash
   * @param {string} [opts.captureId] — identifiant unique de la capture (idempotence)
   * @returns {{ accepted, duplicate, advanced, session }}
   */
  advanceBatch({ projectId, sessionId, batchId, contractHash, captureId }) {
    const session = this.batches.get(projectId);

    if (!session) {
      throw Object.assign(new Error(`BATCH_SESSION_NOT_FOUND : ${projectId}`), { code: 'BATCH_SESSION_NOT_FOUND' });
    }

    // 1. Vérification du sessionId (session périmée)
    if (session.sessionId !== sessionId) {
      throw Object.assign(new Error('STALE_SESSION'), { code: 'STALE_SESSION', expected: session.sessionId, received: sessionId });
    }

    // 2. Vérification du contractHash (intégrité)
    if (session.contractHash !== contractHash) {
      throw Object.assign(new Error('CONTRACT_HASH_MISMATCH'), { code: 'CONTRACT_HASH_MISMATCH' });
    }

    // 3. Idempotence : capture déjà traitée ?
    if (captureId && session.processedCaptures.includes(captureId)) {
      return { accepted: true, duplicate: true, advanced: false, session };
    }

    // 4. Idempotence : lot déjà complété ?
    if (session.completedBatchIds.includes(batchId)) {
      return { accepted: true, duplicate: true, advanced: false, session };
    }

    // 5. Vérification du batchId courant
    if (session.currentBatchId !== batchId) {
      throw Object.assign(
        new Error(`UNEXPECTED_BATCH : attendu ${session.currentBatchId}, reçu ${batchId}`),
        { code: 'UNEXPECTED_BATCH', expected: session.currentBatchId, received: batchId }
      );
    }

    // 6. Enregistrement de la capture et avancement
    if (captureId) session.processedCaptures.push(captureId);
    session.completedBatchIds.push(batchId);
    session.currentBatch++;

    if (session.currentBatch >= session.totalBatches) {
      // ── Tous les lots traités ────────────────────────────────────────────────
      session.status = 'completed';
      this.batches.set(projectId, session);
      console.log(`[BATCH_STATE] ✅ Projet "${projectId}" : TOUS LES LOTS ont été traités !`);

      // Auto-chaînage Phase 5 — AUDIT UNIQUEMENT (mutate:false obligatoire)
      if (session.autoPilot && session.startPhase !== 5 && !session.phase5AutoTriggered) {
        session.phase5AutoTriggered   = true;
        session.phase5TriggeredAt     = new Date().toISOString();
        this.batches.set(projectId, session);

        console.log(`[BATCH_STATE] 🚀 AutoPilot activé : Lancement automatique Phase 5 (audit_only, mutate:false)...`);
        fetch('http://localhost:5006/api/bridge/trombone', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            target_project:      projectId,
            target_ai:           session.targetAi || 'deepseek',
            start_index:         1,
            zip_mode:            true,
            start_phase:         5,
            auto_pilot:          true,
            mode:                'audit_only',   // ← ZERO TRUST : audit uniquement
            mutate:              false,          // ← INTERDIT de muter sans confirmation
            phase5AutoTriggered: true
          })
        }).catch(e => console.error('[BATCH_STATE] Erreur déclenchement Phase 5:', e));
      }

      return { accepted: true, duplicate: false, advanced: true, completed: true, session };
    }

    // Lot suivant
    const nextBatch = session.batches[session.currentBatch];
    session.currentBatchId = nextBatch ? (nextBatch.id || `batch-${session.currentBatch}`) : null;
    this.batches.set(projectId, session);
    console.log(`[BATCH_STATE] ➡️  Projet "${projectId}" : avancement au Lot ${session.currentBatch + 1}/${session.totalBatches}`);

    return { accepted: true, duplicate: false, advanced: true, completed: false, session };
  }

  /**
   * @deprecated — Utiliser advanceBatch({ projectId, sessionId, batchId, contractHash }) à la place.
   * Gardé uniquement pour compatibilité des anciennes routes, lève une erreur explicite si sessionId manque.
   */
  advanceBatchLegacy(projectId) {
    const session = this.batches.get(projectId);
    if (!session) return null;

    console.warn(`[BATCH_STATE] ⚠️  advanceBatchLegacy() appelé pour "${projectId}" — migrez vers advanceBatch({ projectId, sessionId, batchId, contractHash })`);

    // Avancement simple (legacy path — sans contrôle)
    session.currentBatch++;
    if (session.currentBatch >= session.totalBatches) {
      session.status = 'completed';
      this.batches.set(projectId, session);
      return null;
    }
    const nextBatch = session.batches[session.currentBatch];
    session.currentBatchId = nextBatch ? (nextBatch.id || `batch-${session.currentBatch}`) : null;
    this.batches.set(projectId, session);
    return nextBatch;
  }

  getCurrentBatch(projectId) {
    const session = this.batches.get(projectId);
    if (!session) return null;
    return session.batches[session.currentBatch];
  }

  clearBatchSession(projectId) {
    this.batches.delete(projectId);
    console.log(`[BATCH_STATE] 🧹 Session multi-batch pour "${projectId}" supprimée.`);
  }

  // ─── Persistance Disque ───────────────────────────────────────────────────────

  /**
   * Écrit la session sur le disque de façon atomique (tmp → rename).
   */
  async persistSession(projectId, session) {
    const sessionDir = path.join(SESSIONS_ROOT, projectId);
    await fsPromises.mkdir(sessionDir, { recursive: true });

    const target  = path.join(sessionDir, `${session.sessionId}.json`);
    const tmp     = `${target}.${process.pid}.tmp`;

    await fsPromises.writeFile(tmp, JSON.stringify(session, null, 2), 'utf8');
    await fsPromises.rename(tmp, target);
    console.log(`[STATE_STORE] 💾 Session persistée : ${target}`);
  }

  /**
   * Recharge toutes les sessions depuis le disque au démarrage.
   */
  async hydrateSessions() {
    if (!fs.existsSync(SESSIONS_ROOT)) return;

    const projects = await fsPromises.readdir(SESSIONS_ROOT, { withFileTypes: true });
    let count = 0;

    for (const project of projects) {
      if (!project.isDirectory()) continue;
      const dir   = path.join(SESSIONS_ROOT, project.name);
      const files = await fsPromises.readdir(dir);

      let latestSession = null;
      let latestTime    = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        try {
          const raw     = await fsPromises.readFile(path.join(dir, file), 'utf8');
          const session = JSON.parse(raw);
          if ((session.createdAt || 0) > latestTime) {
            latestTime    = session.createdAt || 0;
            latestSession = session;
          }
        } catch { /* fichier corrompu ignoré */ }
      }

      if (latestSession && latestSession.status === 'running') {
        this.batches.set(latestSession.projectId, latestSession);
        count++;
        console.log(`[STATE_STORE] 🔄 Session restaurée : ${latestSession.projectId} (lot ${latestSession.currentBatch + 1}/${latestSession.totalBatches})`);
      }
    }

    if (count > 0) console.log(`[STATE_STORE] ✅ ${count} session(s) restaurée(s) depuis le disque.`);
  }
}

module.exports = new StateStore();
