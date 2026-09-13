'use strict';

/**
 * CloudflareQuotaTracker.js — Grade Gold v3.1
 *
 * Améliorations v3.1 :
 *  - Suivi par `reservationId` exact (évite les collisions lors d'appels concourants ou retries sur le même lot)
 *  - Échec strict si _persistAtomic() échoue (lève QUOTA_PERSISTENCE_FAILED)
 *  - Mutex + write atomique tmp→rename
 *  - Réservations avec expiration TTL (crash Electron ne bloque plus le quota)
 *  - Récupération automatique des réservations expirées
 */

const fs   = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

const TMP_DIR = path.resolve(
  process.env.ELECTRON_APP_DATA || path.join(process.cwd(), '.tmp')
);
const QUOTA_FILE     = path.join(TMP_DIR, 'cloudflare_quota.json');
const QUOTA_FILE_TMP = QUOTA_FILE + '.tmp';

const DAILY_LIMIT        = 10000;  // Neurons estimés par jour (allocation gratuite CF)
const RATE_LIMIT_PER_MIN = 30;     // Appels max par minute (protection locale)
const RESERVATION_TTL_MS = 120000; // 120 secondes TTL pour réservation inerte

// Mutex mémoire — protège les races dans le même processus Node
let _lock = false;
const _lockQueue = [];

function _acquireLock() {
  return new Promise(resolve => {
    if (!_lock) { _lock = true; resolve(); }
    else        { _lockQueue.push(resolve); }
  });
}

function _releaseLock() {
  if (_lockQueue.length > 0) { const next = _lockQueue.shift(); next(); }
  else                       { _lock = false; }
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistance atomique avec échec strict
// ─────────────────────────────────────────────────────────────────────────────

function _getToday() {
  return new Date().toISOString().slice(0, 10);
}

function _freshState() {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return {
    date:               _getToday(),
    dailyLimit:         DAILY_LIMIT,
    usedEstimated:      0,
    reserved:           0,
    remainingEstimated: DAILY_LIMIT,
    resetAt:            tomorrow.toISOString(),
    callsThisMinute:    0,
    minuteStart:        Date.now(),
    reservations:       [],
    history:            []
  };
}

function _recoverExpiredReservations(state) {
  const now     = Date.now();
  const expired = (state.reservations || []).filter(r => {
    // Si la requête est en-vol (sent), on n'expire pas avant 180s in-flight timeout
    if (r.status === 'sent') {
      const sentTs = r.requestStartedAt || r.expiresAt;
      return (now - sentTs) > 180000;
    }
    return r.expiresAt < now;
  });

  if (expired.length > 0) {
    const freed = expired.reduce((s, r) => s + (r.neurons || 0), 0);
    state.reserved        = Math.max(0, (state.reserved || 0) - freed);
    state.usedEstimated   = Math.max(0, state.usedEstimated - freed);
    state.remainingEstimated = Math.max(0, state.dailyLimit - state.usedEstimated);
    const expiredIds = new Set(expired.map(r => r.reservationId));
    state.reservations    = state.reservations.filter(r => !expiredIds.has(r.reservationId));
    console.log(`[QUOTA] RESERVED_EXPIRED: ${expired.length} reservation(s) expiree(s) -> +${freed} Neurons liberes`);
  }
  return state;
}

function _loadOrInit() {
  try {
    if (fs.existsSync(QUOTA_FILE)) {
      const stored = JSON.parse(fs.readFileSync(QUOTA_FILE, 'utf8'));
      if (stored.date === _getToday()) {
        stored.reservations = stored.reservations || [];
        stored.history      = stored.history || [];
        return _recoverExpiredReservations(stored);
      }
    }
  } catch {}
  return _freshState();
}

function _persistAtomic(state) {
  try {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
    fs.writeFileSync(QUOTA_FILE_TMP, JSON.stringify(state, null, 2), 'utf8');
    fs.renameSync(QUOTA_FILE_TMP, QUOTA_FILE);  // atomique
  } catch (error) {
    console.error('[QUOTA] ERROR: Persistance atomique echouee:', error.message);
    throw Object.assign(
      new Error('QUOTA_PERSISTENCE_FAILED'),
      {
        code: 'QUOTA_PERSISTENCE_FAILED',
        cause: error
      }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API publique
// ─────────────────────────────────────────────────────────────────────────────

const CloudflareQuotaTracker = {

  canCall() {
    const state = _loadOrInit();
    const now   = Date.now();
    if (state.usedEstimated >= state.dailyLimit) {
      return { allowed: false, reason: 'CLOUDFLARE_QUOTA_EXHAUSTED' };
    }
    const elapsed = now - state.minuteStart;
    if (elapsed <= 60000 && state.callsThisMinute >= RATE_LIMIT_PER_MIN) {
      return { allowed: false, reason: 'RATE_LIMIT_EXCEEDED' };
    }
    return { allowed: true };
  },

  /**
   * Réserve `neurons` Neurons estimés avant l'appel HTTP (état 'reserved').
   */
  async reserveQuota(missionId, lotId, neurons = 50) {
    await _acquireLock();
    try {
      let cleanNeurons = Number(neurons);
      if (!Number.isFinite(cleanNeurons) || cleanNeurons <= 0) {
        return { reserved: false, reason: 'INVALID_NEURON_ESTIMATE' };
      }
      cleanNeurons = Math.ceil(cleanNeurons);

      const state = _loadOrInit();
      const now   = Date.now();

      if (state.usedEstimated + cleanNeurons > state.dailyLimit) {
        return { reserved: false, reason: 'CLOUDFLARE_QUOTA_EXHAUSTED' };
      }

      if (now - state.minuteStart > 60000) {
        state.callsThisMinute = 0;
        state.minuteStart     = now;
      }

      if (state.callsThisMinute >= RATE_LIMIT_PER_MIN) {
        return { reserved: false, reason: 'RATE_LIMIT_EXCEEDED' };
      }

      const reservationId = `res_${missionId}_${lotId}_${now}_${Math.random().toString(36).substring(2, 6)}`;
      state.reservations.push({
        reservationId,
        missionId,
        lotId,
        neurons: cleanNeurons,
        status: 'reserved',
        createdAt:        new Date(now).toISOString(),
        expiresAt:        now + RESERVATION_TTL_MS,
        requestStartedAt: null
      });
      state.callsThisMinute   += 1;
      state.usedEstimated     += cleanNeurons;
      state.reserved          += cleanNeurons;
      state.remainingEstimated = Math.max(0, state.dailyLimit - state.usedEstimated);

      state.history.push({ ts: now, missionId, lotId, action: 'reserve', neurons: cleanNeurons, reservationId });
      if (state.history.length > 300) state.history.splice(0, state.history.length - 300);

      _persistAtomic(state);
      console.log(`[QUOTA] RESERVED: ${cleanNeurons}N (${reservationId}) [mission=${missionId}][lot=${lotId}] | used~=${state.usedEstimated}/${state.dailyLimit}`);
      return { reserved: true, reservationId };
    } finally {
      _releaseLock();
    }
  },

  /**
   * Marque la réservation comme envoyée (état 'sent').
   */
  async markSent(reservationId) {
    if (!reservationId) return;
    await _acquireLock();
    try {
      const state = _loadOrInit();
      const res = state.reservations.find(r => r.reservationId === reservationId);
      if (res) {
        res.status = 'sent';
        res.requestStartedAt = Date.now();
        _persistAtomic(state);
        console.log(`[QUOTA] SENT: (${reservationId}) [mission=${res.missionId}][lot=${res.lotId}]`);
      }
    } finally {
      _releaseLock();
    }
  },

  /**
   * Confirme la consommation après réponse HTTP 200 via `reservationId` (état 'consumed').
   */
  async consumeQuota(reservationIdOrMissionId, lotId) {
    await _acquireLock();
    try {
      const state = _loadOrInit();
      let idx = -1;
      if (reservationIdOrMissionId && reservationIdOrMissionId.startsWith('res_')) {
        idx = state.reservations.findIndex(r => r.reservationId === reservationIdOrMissionId);
      } else {
        idx = state.reservations.findIndex(r => r.missionId === reservationIdOrMissionId && r.lotId === lotId);
      }

      if (idx === -1) {
        console.warn(`[QUOTA] RESERVATION_NOT_FOUND: Reservation introuvable pour consommation (${reservationIdOrMissionId})`);
      } else {
        state.reserved = Math.max(0, state.reserved - state.reservations[idx].neurons);
        state.reservations.splice(idx, 1);
      }
      state.history.push({ ts: Date.now(), reservationId: reservationIdOrMissionId, lotId, action: 'consume' });
      _persistAtomic(state);
      console.log(`[QUOTA] CONSUMED: (${reservationIdOrMissionId}) | used~=${state.usedEstimated}/${state.dailyLimit}`);
    } finally {
      _releaseLock();
    }
  },

  /**
   * Libère la réservation via `reservationId` si l'inférence a échoué avant l'envoi HTTP.
   */
  async releaseQuota(reservationIdOrMissionId, lotId) {
    await _acquireLock();
    try {
      const state = _loadOrInit();
      let idx = -1;
      if (reservationIdOrMissionId && reservationIdOrMissionId.startsWith('res_')) {
        idx = state.reservations.findIndex(r => r.reservationId === reservationIdOrMissionId);
      } else {
        idx = state.reservations.findIndex(r => r.missionId === reservationIdOrMissionId && r.lotId === lotId);
      }

      if (idx !== -1) {
        const neurons = state.reservations[idx].neurons;
        state.reservations.splice(idx, 1);
        state.reserved        = Math.max(0, state.reserved - neurons);
        state.usedEstimated   = Math.max(0, state.usedEstimated - neurons);
        state.remainingEstimated = Math.max(0, state.dailyLimit - state.usedEstimated);
      }
      state.history.push({ ts: Date.now(), reservationId: reservationIdOrMissionId, lotId, action: 'release' });
      _persistAtomic(state);
      console.log(`[QUOTA] RELEASED: (${reservationIdOrMissionId}) | used~=${state.usedEstimated}/${state.dailyLimit}`);
    } finally {
      _releaseLock();
    }
  },

  getStatus() {
    const state = _loadOrInit();
    return {
      date:               state.date,
      dailyLimit:         state.dailyLimit,
      usedEstimated:      state.usedEstimated,
      reserved:           state.reserved,
      remainingEstimated: state.remainingEstimated,
      resetAt:            state.resetAt,
      callsThisMinute:    state.callsThisMinute,
      rateLimit:          RATE_LIMIT_PER_MIN,
      exhausted:          state.usedEstimated >= state.dailyLimit,
      activeReservations: (state.reservations || []).length
    };
  }
};

module.exports = CloudflareQuotaTracker;
