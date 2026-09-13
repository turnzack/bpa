'use strict';

/**
 * CloudflareAuditService.js — Grade Gold v3
 *
 * Corrections v3 :
 *  1. await reserveQuota/consumeQuota/releaseQuota (étaient manquants)
 *  2. validateWorkerEnvelope() exige strictement missionId ET lotId dans la réponse
 *  3. estimateNeurons() remplace NEURONS_PER_CALL=1
 *  4. consume après HTTP 200 (même si contenu invalide — l'inférence a eu lieu)
 *  5. requireJson = true par défaut
 *  6. degraded=true uniquement si le réseau/quota est en cause ; false si réponse invalide
 */

const fs   = require('fs');
const path = require('path');
const CloudflareQuotaTracker = require('./CloudflareQuotaTracker');

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

const WORKER_URL         = 'https://kirov-worker.v0reponses.workers.dev';
const REQUEST_TIMEOUT_MS = 30000;
const MAX_RESPONSE_CHARS = 16000;

// ─────────────────────────────────────────────────────────────────────────────
// Estimation des Neurons (Correction 3)
// Basée sur la tarification publique Workers AI :
// input  : ~4625 Neurons par 1M tokens d'entrée
// output : ~30475 Neurons par 1M tokens de sortie
// ─────────────────────────────────────────────────────────────────────────────

function estimateNeurons({ prompt, maxOutputTokens = 384 }) {
  const inputTokens   = Math.ceil(prompt.length / 4);
  const inputNeurons  = inputTokens  * 4625  / 1_000_000;
  const outputNeurons = maxOutputTokens * 30475 / 1_000_000;
  return Math.max(1, Math.ceil(inputNeurons + outputNeurons));
}

// ─────────────────────────────────────────────────────────────────────────────
// Secret loading — jamais gravé en dur, jamais loggé
// ─────────────────────────────────────────────────────────────────────────────

function _loadSecret() {
  if (process.env.KIROV_WORKER_SECRET) {
    return process.env.KIROV_WORKER_SECRET.trim();
  }
  const candidateFiles = [
    process.env.KIROV_WORKER_SECRET_FILE,
    'E:\\v0reponses\\.kirov_secret.txt',
    path.resolve(__dirname, '..', '..', '..', '.kirov_secret.txt'),
    path.resolve(process.cwd(), '.kirov_secret.txt')
  ].filter(Boolean);

  for (const f of candidateFiles) {
    try {
      if (fs.existsSync(f)) {
        const raw = fs.readFileSync(f, 'utf8').trim();
        if (raw.length > 10) return raw;
      }
    } catch (_) {}
  }
  return null;
}

function _loadWorkerUrl() {
  try {
    const cfgPath = path.resolve(
      process.env.KIROV_CONFIG_PATH || 'e:\\v0reponses\\kirov_config.json'
    );
    if (fs.existsSync(cfgPath)) {
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
      if (cfg.cloudflareWorkerUrl) return cfg.cloudflareWorkerUrl;
    }
  } catch {}
  return WORKER_URL;
}

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 1 : Validation de l'enveloppe HTTP Worker (Correction 2)
// missionId et lotId sont maintenant OBLIGATOIRES — pas de vérification conditionnelle
// ─────────────────────────────────────────────────────────────────────────────

function validateWorkerEnvelope(payload, expectedMissionId, expectedLotId) {
  if (!payload || payload.status !== 'ok' || typeof payload.response !== 'string') {
    const err = new Error('Réponse Worker invalide (status !== ok ou response absent).');
    err.code  = 'WORKER_RESPONSE_INVALID';
    throw err;
  }

  if (payload.response.length > MAX_RESPONSE_CHARS) {
    const err = new Error(`Réponse Worker trop longue (${payload.response.length} > ${MAX_RESPONSE_CHARS}).`);
    err.code  = 'WORKER_RESPONSE_TOO_LARGE';
    throw err;
  }

  // Vérification STRICTE (pas de condition optionnelle) — Correction 2
  if (payload.missionId !== expectedMissionId) {
    const err = new Error(`missionId absent ou incohérent. Reçu="${payload.missionId}", attendu="${expectedMissionId}"`);
    err.code  = 'MISSION_ID_MISMATCH';
    throw err;
  }

  if (payload.lotId !== expectedLotId) {
    const err = new Error(`lotId absent ou incohérent. Reçu="${payload.lotId}", attendu="${expectedLotId}"`);
    err.code  = 'LOT_ID_MISMATCH';
    throw err;
  }

  return payload.response;
}

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 2 : Validation JSON (réponses structurées)
// Rejet des répétitions "Answer: OKAnswer: OK..."
// ─────────────────────────────────────────────────────────────────────────────

function parseJsonResponse(responseText) {
  try {
    return JSON.parse(responseText);
  } catch {
    const err = new Error('Sortie modèle non-JSON (répétitions ou texte libre).');
    err.code  = 'MODEL_OUTPUT_INVALID';
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 3 : Validation métier (extensible)
// ─────────────────────────────────────────────────────────────────────────────

const AUDIT_STATUSES = new Set([
  'acceptable',
  'unacceptable',
  'insufficient_evidence'
]);

function validateAuditContent(auditObj) {
  if (!auditObj || typeof auditObj !== 'object' || Array.isArray(auditObj)) {
    const err = new Error('Contenu audit invalide : objet JSON attendu.');
    err.code  = 'AUDIT_CONTENT_INVALID';
    throw err;
  }
  // Schéma strict métier d'audit (exclut 'ok' réservé aux pings healthcheck)
  if (auditObj.status !== undefined) {
    if (!AUDIT_STATUSES.has(auditObj.status)) {
      const err = new Error(`Statut d'audit métier invalide: "${auditObj.status}". Attendu: ${Array.from(AUDIT_STATUSES).join(', ')}`);
      err.code  = 'AUDIT_CONTENT_INVALID';
      throw err;
    }
  }
  if (auditObj.issues !== undefined && !Array.isArray(auditObj.issues)) {
    const err = new Error('La propriété "issues" doit être un tableau.');
    err.code  = 'AUDIT_CONTENT_INVALID';
    throw err;
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// CloudflareAuditService
// ─────────────────────────────────────────────────────────────────────────────

const CloudflareAuditService = {

  /**
   * Envoie un prompt d'audit au Worker Cloudflare Edge sécurisé.
   *
   * @param {object}  params
   * @param {string}  params.missionId
   * @param {string}  params.lotId
   * @param {string}  params.prompt         - max 24 000 caractères
   * @param {string}  [params.purpose]      - 'plan' | 'audit' | 'repair'
   * @param {boolean} [params.requireJson]  - true par défaut
   * @param {boolean} [params.allowPlainText] - true seulement si texte libre autorisé
   */
  async audit({
    missionId,
    lotId,
    prompt,
    purpose       = 'audit',
    requireJson   = true,
    allowPlainText = false
  }) {

    // ── Garde 1 : Contexte de mission
    if (!missionId || typeof missionId !== 'string') {
      return { ok: false, error: 'missionId requis.', errorCode: 'MISSION_CONTEXT_REQUIRED', degraded: false };
    }
    if (!lotId || typeof lotId !== 'string') {
      return { ok: false, error: 'lotId requis.', errorCode: 'MISSION_CONTEXT_REQUIRED', degraded: false };
    }

    // ── Garde 2 : Prompt valide
    const cleanPrompt = (prompt || '').trim();
    if (!cleanPrompt || cleanPrompt.length > 24000) {
      return { ok: false, error: 'Prompt vide ou trop long (> 24 000 car.).', errorCode: 'PROMPT_INVALID', degraded: false };
    }

    // Protection Politique : Texte libre UNIQUEMENT avec allowPlainText: true
    if (allowPlainText !== true && requireJson !== true) {
      return {
        ok: false,
        error: 'JSON obligatoire sauf autorisation explicite via allowPlainText: true.',
        errorCode: 'OUTPUT_POLICY_INVALID',
        degraded: false
      };
    }
    const jsonRequired = allowPlainText !== true;

    // ── Garde 3 : Secret
    const secret = _loadSecret();
    if (!secret) {
      console.warn('[CLOUDFLARE AUDIT] ⚠️ Secret absent → mode dégradé.');
      return { ok: false, error: 'Secret non configuré.', errorCode: 'SECRET_NOT_CONFIGURED', degraded: true };
    }

    // ── Garde 4 : Estimation des Neurons et réservation du quota
    const neurons   = estimateNeurons({ prompt: cleanPrompt, maxOutputTokens: 384 });
    const quotaCheck = await CloudflareQuotaTracker.reserveQuota(missionId, lotId, neurons);
    if (!quotaCheck.reserved) {
      console.warn(`[CLOUDFLARE AUDIT] ⛔ Quota bloqué: ${quotaCheck.reason}`);
      return { ok: false, error: quotaCheck.reason, errorCode: quotaCheck.reason, degraded: true };
    }

    // ── Appel HTTP
    const workerUrl  = _loadWorkerUrl();
    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      await CloudflareQuotaTracker.markSent(quotaCheck.reservationId);

      const res = await fetch(workerUrl, {
        method:  'POST',
        headers: {
          'Content-Type':   'application/json',
          'X-Kirov-Secret': secret   // jamais loggé
        },
        body:   JSON.stringify({ missionId, lotId, purpose, prompt: cleanPrompt }),
        signal: controller.signal
      });

      clearTimeout(timer);

      // ── Erreurs HTTP avant inférence → libérer
      if (!res.ok) {
        const body    = await res.json().catch(() => ({}));
        const errCode = body.error || `HTTP_${res.status}`;

        // 429 et 4xx : pas d'inférence → release avec reservationId
        await CloudflareQuotaTracker.releaseQuota(quotaCheck.reservationId, lotId);

        if (res.status === 429) {
          return { ok: false, error: 'Quota Cloudflare épuisé (HTTP 429).', errorCode: 'CLOUDFLARE_QUOTA_EXHAUSTED', degraded: true };
        }

        console.error(`[CLOUDFLARE AUDIT] ❌ HTTP ${res.status} → ${errCode}`);
        return {
          ok: false,
          error: errCode,
          errorCode: errCode,
          degraded: res.status >= 500  // 5xx = réseau/infra dégradé
        };
      }

      // ── HTTP 200 : l'inférence a eu lieu → CONSUME avec reservationId
      let payload;
      try {
        payload = await res.json();
      } catch (jsonErr) {
        // En cas de corps malformé après HTTP 200, l'inférence s'est produite → on consomme quand même
        await CloudflareQuotaTracker.consumeQuota(quotaCheck.reservationId, lotId);
        return {
          ok: false,
          error: 'Réponse Worker non JSON (corps de réponse corrompu).',
          errorCode: 'WORKER_RESPONSE_INVALID',
          degraded: false
        };
      }

      await CloudflareQuotaTracker.consumeQuota(quotaCheck.reservationId, lotId);

      // ── Niveau 1 : Enveloppe + cohérence stricte des IDs
      let responseText;
      try {
        responseText = validateWorkerEnvelope(payload, missionId, lotId);
      } catch (envErr) {
        console.error(`[CLOUDFLARE AUDIT] ❌ Enveloppe invalide: ${envErr.code}`);
        return { ok: false, error: envErr.message, errorCode: envErr.code, degraded: false };
      }

      // ── Niveau 2 + 3 : Validation JSON & Métier
      let parsedResult = responseText;
      if (jsonRequired) {
        try {
          parsedResult = parseJsonResponse(responseText);
          validateAuditContent(parsedResult);
        } catch (parseErr) {
          console.error(`[CLOUDFLARE AUDIT] ❌ Contenu invalide: ${parseErr.code}`);
          return { ok: false, error: parseErr.message, errorCode: parseErr.code, degraded: false };
        }
      }

      console.log(`[CLOUDFLARE AUDIT] ✅ ${missionId}/${lotId} | model=${payload.modelUsed} | ~${neurons}N estimés`);
      return {
        ok:        true,
        response:  parsedResult,
        modelUsed: payload.modelUsed,
        missionId,
        lotId,
        estimatedNeurons: neurons
      };

    } catch (err) {
      // Erreur réseau ou timeout → inférence non exécutée → release avec reservationId
      clearTimeout(timer);
      await CloudflareQuotaTracker.releaseQuota(quotaCheck.reservationId, lotId);
      console.error('[CLOUDFLARE AUDIT] ❌ Erreur réseau/timeout:', err.message);
      return { ok: false, error: 'Inférence échouée (réseau ou timeout).', errorCode: 'AI_INFERENCE_FAILED', degraded: true };
    }
  },

  getQuotaStatus() {
    return CloudflareQuotaTracker.getStatus();
  },

  // Exposé pour les tests unitaires
  _estimateNeurons: estimateNeurons
};

module.exports = CloudflareAuditService;
