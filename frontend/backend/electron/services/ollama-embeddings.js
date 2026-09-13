'use strict';
/**
 * TIGER-033 — Service d'embeddings via Ollama local
 * electron/services/ollama-embeddings.js
 *
 * Modèle : nomic-embed-text (768 dimensions)
 * Endpoint local : http://127.0.0.1:11434/api/embeddings
 * Fallback gracieux si Ollama n'est pas disponible.
 */

const OLLAMA_URL   = 'http://127.0.0.1:11434/api/embeddings';
const EMBED_MODEL  = 'nomic-embed-text';
const EMBED_DIM    = 768;
const TIMEOUT_MS   = 30_000;

let _ollamaAvailable = null; // null = pas encore testé

/**
 * Vérifie la disponibilité d'Ollama.
 * @returns {Promise<boolean>}
 */
async function checkOllamaAvailable() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5_000);
    const res = await fetch('http://127.0.0.1:11434/api/tags', { signal: ctrl.signal });
    clearTimeout(t);
    _ollamaAvailable = res.ok;
    if (!_ollamaAvailable) console.warn('[EMBED] Ollama non disponible (statut non-OK).');
    return _ollamaAvailable;
  } catch {
    _ollamaAvailable = false;
    console.warn('[EMBED] Ollama non disponible sur 127.0.0.1:11434 — mode sans embeddings.');
    return false;
  }
}

/**
 * Génère un embedding pour un texte.
 * Retourne null si Ollama n'est pas disponible (fallback gracieux).
 * @param {string} text
 * @returns {Promise<number[]|null>}
 */
async function embed(text) {
  if (!text || typeof text !== 'string') return null;

  // Tronquer si texte trop long (Ollama a une limite de contexte)
  const input = text.slice(0, 8000);

  try {
    const ctrl = new AbortController();
    const t    = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    const res = await fetch(OLLAMA_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ model: EMBED_MODEL, prompt: input }),
      signal:  ctrl.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      console.warn(`[EMBED] Ollama erreur ${res.status} — embedding ignoré.`);
      return null;
    }

    const data = await res.json();
    const embedding = data.embedding;

    if (!Array.isArray(embedding) || embedding.length !== EMBED_DIM) {
      console.warn(`[EMBED] Embedding dimension inattendue : ${embedding?.length} (attendu ${EMBED_DIM})`);
      return null;
    }

    return embedding;
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('[EMBED] Erreur Ollama:', e.message);
    return null;
  }
}

/**
 * Calcule la similarité cosinus entre deux vecteurs.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number} score entre -1 et 1
 */
function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

module.exports = { embed, checkOllamaAvailable, cosineSimilarity, EMBED_DIM, EMBED_MODEL };
