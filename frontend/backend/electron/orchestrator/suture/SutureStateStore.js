'use strict';

/**
 * SutureStateStore.js
 * ─────────────────────────────────────────────────────────────────
 * Sprint 10 — Gestion d'état des réparations en cours.
 *
 * Garantit :
 *  - Un seul job de réparation actif par projet (anti double-clic).
 *  - Traçabilité complète des états selon SUTURE_STATES.
 *  - Un historique consultable par repairId.
 *  - Nettoyage automatique des entrées terminées.
 *
 * Les états suivent la machine d'états définie dans PLAN_SUTURE_V2.md :
 *   requested → diagnosing → plan_ready → patching → validating
 *   → succeeded | failed | rejected | rolled_back
 * ─────────────────────────────────────────────────────────────────
 */

const { SUTURE_STATES } = require('./SutureConfig');

// États considérés comme "terminaux" (libèrent le verrou projet)
const TERMINAL_STATES = new Set([
  SUTURE_STATES.SUCCEEDED,
  SUTURE_STATES.FAILED,
  SUTURE_STATES.REJECTED,
  SUTURE_STATES.ROLLED_BACK
]);

// Délai de nettoyage automatique des entrées terminées (5 min)
const CLEANUP_DELAY_MS = 5 * 60 * 1000;

class SutureStateStore {
  constructor() {
    // Map<projectId, repairId> — verrou projet
    this._locks = new Map();

    // Map<repairId, StateEntry> — état complet par réparation
    this._repairs = new Map();

    // Map<repairId, TimeoutHandle> — nettoyage auto
    this._cleanupTimers = new Map();
  }

  // ─── Verrou projet ────────────────────────────────────────────

  /**
   * Tente d'acquérir le verrou pour un projet.
   * @param {string} projectId
   * @param {string} repairId
   * @throws si une réparation est déjà en cours
   */
  acquireLock(projectId, repairId) {
    if (this._locks.has(projectId)) {
      const existing = this._locks.get(projectId);
      throw Object.assign(
        new Error(`[SutureStateStore] Réparation déjà en cours pour "${projectId}" (repairId: ${existing}).`),
        { code: 'SUTURE_ALREADY_RUNNING', projectId, existingRepairId: existing }
      );
    }
    this._locks.set(projectId, repairId);
    console.log(`[STATE-STORE] 🔒 Verrou acquis : ${projectId} → ${repairId}`);
  }

  /**
   * Libère le verrou projet.
   * @param {string} projectId
   * @param {string} repairId - Doit correspondre au verrou actif
   */
  releaseLock(projectId, repairId) {
    const active = this._locks.get(projectId);
    if (active === repairId) {
      this._locks.delete(projectId);
      console.log(`[STATE-STORE] 🔓 Verrou libéré : ${projectId}`);
    }
  }

  /**
   * Vérifie si un projet est verrouillé.
   * @returns {string|null} repairId actif ou null
   */
  getActiveLock(projectId) {
    return this._locks.get(projectId) || null;
  }

  // ─── Cycle de vie d'une réparation ───────────────────────────

  /**
   * Initialise une nouvelle entrée de réparation.
   */
  create(repairId, projectId) {
    if (this._repairs.has(repairId)) {
      throw Object.assign(
        new Error(`[SutureStateStore] repairId déjà enregistré : ${repairId}`),
        { code: 'REPAIR_ID_CONFLICT', repairId }
      );
    }

    const entry = {
      repairId,
      projectId,
      state:     SUTURE_STATES.REQUESTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attempts:  [],
      events:    [{ state: SUTURE_STATES.REQUESTED, at: new Date().toISOString() }],
      result:    null,
      error:     null
    };

    this._repairs.set(repairId, entry);
    console.log(`[STATE-STORE] 📋 Réparation créée : ${repairId} (projet: ${projectId})`);
    return entry;
  }

  /**
   * Fait progresser l'état d'une réparation.
   * @param {string} repairId
   * @param {string} newState - Doit être une valeur de SUTURE_STATES
   * @param {object} [meta] - Données supplémentaires à fusionner dans l'entrée
   */
  transition(repairId, newState, meta = {}) {
    const entry = this._getOrThrow(repairId);

    if (!Object.values(SUTURE_STATES).includes(newState)) {
      throw Object.assign(
        new Error(`[SutureStateStore] État invalide : "${newState}"`),
        { code: 'INVALID_SUTURE_STATE', state: newState }
      );
    }

    entry.state     = newState;
    entry.updatedAt = new Date().toISOString();
    entry.events.push({ state: newState, at: entry.updatedAt, ...meta });
    Object.assign(entry, meta);

    console.log(`[STATE-STORE] ↗ ${repairId} → ${newState}`);

    // Libération automatique du verrou sur état terminal
    if (TERMINAL_STATES.has(newState)) {
      this.releaseLock(entry.projectId, repairId);
      this._scheduleCleanup(repairId);
    }

    return entry;
  }

  /**
   * Enregistre un résultat final (succès ou échec).
   */
  setResult(repairId, result) {
    const entry = this._getOrThrow(repairId);
    entry.result = result;
    entry.updatedAt = new Date().toISOString();
    return entry;
  }

  /**
   * Enregistre une erreur terminale.
   */
  setError(repairId, error) {
    const entry = this._getOrThrow(repairId);
    entry.error = {
      code:    error.code || 'UNKNOWN_ERROR',
      message: error.message || String(error),
      at:      new Date().toISOString()
    };
    entry.updatedAt = new Date().toISOString();
    return entry;
  }

  /**
   * Ajoute un rapport de tentative.
   */
  addAttempt(repairId, attemptReport) {
    const entry = this._getOrThrow(repairId);
    entry.attempts.push({
      ...attemptReport,
      recordedAt: new Date().toISOString()
    });
    return entry;
  }

  // ─── Consultation ─────────────────────────────────────────────

  /**
   * Retourne l'état actuel d'une réparation.
   */
  get(repairId) {
    return this._repairs.get(repairId) || null;
  }

  /**
   * Retourne toutes les réparations actives (non terminales).
   */
  getActive() {
    const active = [];
    for (const entry of this._repairs.values()) {
      if (!TERMINAL_STATES.has(entry.state)) {
        active.push(entry);
      }
    }
    return active;
  }

  /**
   * Retourne un snapshot de l'état public (pour SSE/UI).
   */
  getPublicSnapshot(repairId) {
    const entry = this.get(repairId);
    if (!entry) return null;
    return {
      repairId:  entry.repairId,
      projectId: entry.projectId,
      state:     entry.state,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      attempts:  entry.attempts.length,
      error:     entry.error
    };
  }

  // ─── Nettoyage ────────────────────────────────────────────────

  _scheduleCleanup(repairId) {
    if (this._cleanupTimers.has(repairId)) return;
    const timer = setTimeout(() => {
      this._repairs.delete(repairId);
      this._cleanupTimers.delete(repairId);
      console.log(`[STATE-STORE] 🧹 Entrée nettoyée : ${repairId}`);
    }, CLEANUP_DELAY_MS);
    // Permet à Node.js de quitter même si le timer est actif
    if (timer.unref) timer.unref();
    this._cleanupTimers.set(repairId, timer);
  }

  // ─── Interne ──────────────────────────────────────────────────

  _getOrThrow(repairId) {
    const entry = this._repairs.get(repairId);
    if (!entry) {
      throw Object.assign(
        new Error(`[SutureStateStore] repairId inconnu : ${repairId}`),
        { code: 'REPAIR_NOT_FOUND', repairId }
      );
    }
    return entry;
  }
}

// Singleton partagé par toute l'application
const store = new SutureStateStore();

module.exports = { SutureStateStore, store };
