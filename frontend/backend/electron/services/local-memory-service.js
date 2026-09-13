'use strict';
/**
 * TIGER-034 — LocalMemoryService
 * electron/services/local-memory-service.js
 *
 * Mémoire persistante 100% locale : SQLite + embeddings Ollama.
 * Fallback JSON sur disque si SQLite non disponible.
 *
 * API :
 *   save(projectId, type, content, opts?) → entry
 *   search(projectId, query, limit?)      → entries[]
 *   listDecisions(projectId)              → decisions[]
 *   getProjectContext(projectId)          → context{}
 *   getPreviousErrors(projectId)          → errors[]
 *   saveDecision(projectId, phase, decision, reason, toolUsed, outcome)
 *   logEvent(projectId, eventType, payload)
 */

const crypto = require('crypto');
const { getDb, nanoid } = require('./db');
const { embed, cosineSimilarity } = require('./ollama-embeddings');

// Fallback : stockage JSON si SQLite absent
const path = require('path');
const fs   = require('fs');
const os   = require('os');
const FALLBACK_DIR = path.join(os.homedir(), 'AppData', 'Roaming', 'TigerIA', 'memory-fallback');
if (!fs.existsSync(FALLBACK_DIR)) fs.mkdirSync(FALLBACK_DIR, { recursive: true });

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// ─── Helpers JSON fallback ────────────────────────────────────────────────────
function fbFile(projectId) { return path.join(FALLBACK_DIR, `${projectId}.json`); }
function fbLoad(projectId) {
  try { return JSON.parse(fs.readFileSync(fbFile(projectId), 'utf-8')); }
  catch { return { memories: [], decisions: [], events: [] }; }
}
function fbSave(projectId, data) {
  fs.writeFileSync(fbFile(projectId), JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Embeddings en mémoire (cache léger) ─────────────────────────────────────
// Structure : { [id]: number[] }
const _embeddingCache = {};

// ─── SERVICE ─────────────────────────────────────────────────────────────────

/**
 * Sauvegarde une entrée mémoire + embedding Ollama.
 * @param {string} projectId
 * @param {string} type         Ex: 'decision', 'error', 'spec', 'fix'
 * @param {string} content      Contenu textuel à indexer
 * @param {object} opts         { source?, tags?, metadata? }
 * @returns {object} entry
 */
async function save(projectId, type, content, opts = {}) {
  const id       = nanoid();
  const now      = Date.now();
  const source   = opts.source   || 'system';
  const tags     = JSON.stringify(opts.tags     || []);
  const metadata = JSON.stringify(opts.metadata || {});

  const entry = { id, projectId, type, content, source, tags: opts.tags || [], metadata: opts.metadata || {}, createdAt: now };

  const db = getDb();
  if (db) {
    try {
      db.prepare(`
        INSERT INTO memories (id, project_id, type, content, source, tags, metadata, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, projectId, type, content, source, tags, metadata, now, now);
    } catch (e) {
      console.error('[MEMORY] Erreur INSERT memories:', e.message);
    }
  } else {
    // JSON fallback
    const data = fbLoad(projectId);
    data.memories.push(entry);
    if (data.memories.length > 500) data.memories = data.memories.slice(-500);
    fbSave(projectId, data);
  }

  // Générer et cacher l'embedding
  const embedding = await embed(`${type}: ${content}`);
  if (embedding) _embeddingCache[id] = embedding;

  return entry;
}

/**
 * Recherche sémantique dans la mémoire d'un projet.
 * @param {string} projectId
 * @param {string} query
 * @param {number} limit
 * @returns {Promise<object[]>}
 */
async function search(projectId, query, limit = 8) {
  const queryEmbed = await embed(query);
  const db = getDb();

  let memories = [];

  if (db) {
    try {
      memories = db.prepare('SELECT * FROM memories WHERE project_id = ? ORDER BY created_at DESC LIMIT 200').all(projectId)
        .map(r => ({ ...r, tags: JSON.parse(r.tags || '[]'), metadata: JSON.parse(r.metadata || '{}') }));
    } catch (e) {
      console.error('[MEMORY] Erreur SELECT memories:', e.message);
    }
  } else {
    memories = fbLoad(projectId).memories || [];
  }

  if (!queryEmbed || memories.length === 0) {
    // Fallback texte simple
    const q = query.toLowerCase();
    return memories.filter(m => m.content.toLowerCase().includes(q)).slice(0, limit);
  }

  // Tri par similarité cosinus
  const scored = memories.map(m => ({
    ...m,
    score: _embeddingCache[m.id] ? cosineSimilarity(queryEmbed, _embeddingCache[m.id]) : 0,
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Liste les décisions d'un projet.
 * @param {string} projectId
 * @returns {object[]}
 */
function listDecisions(projectId) {
  const db = getDb();
  if (db) {
    try {
      return db.prepare('SELECT * FROM decisions WHERE project_id = ? ORDER BY created_at DESC').all(projectId);
    } catch {}
  }
  return (fbLoad(projectId).decisions || []);
}

/**
 * Retourne le contexte global du projet (dernières mémoires de chaque type).
 * @param {string} projectId
 * @returns {object}
 */
function getProjectContext(projectId) {
  const db = getDb();
  let memories = [];

  if (db) {
    try {
      memories = db.prepare('SELECT * FROM memories WHERE project_id = ? ORDER BY created_at DESC LIMIT 50').all(projectId);
    } catch {}
  } else {
    memories = (fbLoad(projectId).memories || []).slice(-50);
  }

  // Grouper par type
  const byType = {};
  for (const m of memories) {
    if (!byType[m.type]) byType[m.type] = [];
    byType[m.type].push(m.content);
  }

  return {
    projectId,
    totalEntries: memories.length,
    byType,
    latestDecisions: listDecisions(projectId).slice(0, 5),
  };
}

/**
 * Récupère les erreurs précédentes d'un projet.
 * @param {string} projectId
 * @returns {object[]}
 */
function getPreviousErrors(projectId) {
  const db = getDb();
  if (db) {
    try {
      return db.prepare(`SELECT * FROM memories WHERE project_id = ? AND type IN ('error', 'typecheck_error', 'lint_error', 'repair') ORDER BY created_at DESC LIMIT 20`).all(projectId);
    } catch {}
  }
  return (fbLoad(projectId).memories || []).filter(m => ['error','typecheck_error','lint_error','repair'].includes(m.type)).slice(-20);
}

/**
 * Sauvegarde une décision Hermes.
 */
function saveDecision(projectId, phase, decision, reason = '', toolUsed = '', outcome = '') {
  const db  = getDb();
  const id  = nanoid();
  const now = Date.now();

  if (db) {
    try {
      db.prepare('INSERT INTO decisions (id, project_id, phase, decision, reason, tool_used, outcome, created_at) VALUES (?,?,?,?,?,?,?,?)')
        .run(id, projectId, phase, decision, reason, toolUsed, outcome, now);
    } catch (e) { console.error('[MEMORY] Erreur INSERT decisions:', e.message); }
  } else {
    const data = fbLoad(projectId);
    data.decisions.push({ id, projectId, phase, decision, reason, toolUsed, outcome, createdAt: now });
    fbSave(projectId, data);
  }

  return { id, projectId, phase, decision, reason, toolUsed, outcome, createdAt: now };
}

/**
 * Journalise un événement de job.
 */
function logEvent(projectId, eventType, payload = {}) {
  const db  = getDb();
  const id  = nanoid();
  const now = Date.now();
  const pl  = JSON.stringify(payload);

  if (db) {
    try {
      db.prepare('INSERT INTO job_events (id, project_id, event_type, payload, created_at) VALUES (?,?,?,?,?)')
        .run(id, projectId, eventType, pl, now);
    } catch (e) { console.error('[MEMORY] Erreur INSERT job_events:', e.message); }
  } else {
    const data = fbLoad(projectId);
    data.events.push({ id, projectId, eventType, payload, createdAt: now });
    if (data.events.length > 1000) data.events = data.events.slice(-1000);
    fbSave(projectId, data);
  }

  return { id, projectId, eventType, payload, createdAt: now };
}

/**
 * Récupère les événements récents d'un projet.
 */
function getEvents(projectId, limit = 50, eventType = null) {
  const db = getDb();
  if (db) {
    try {
      const q = eventType
        ? db.prepare('SELECT * FROM job_events WHERE project_id = ? AND event_type = ? ORDER BY created_at DESC LIMIT ?').all(projectId, eventType, limit)
        : db.prepare('SELECT * FROM job_events WHERE project_id = ? ORDER BY created_at DESC LIMIT ?').all(projectId, limit);
      return q.map(r => ({ ...r, payload: JSON.parse(r.payload || '{}') }));
    } catch {}
  }
  let events = (fbLoad(projectId).events || []);
  if (eventType) events = events.filter(e => e.eventType === eventType);
  return events.slice(-limit);
}

/**
 * Supprime toute la mémoire d'un projet.
 */
function clearProject(projectId) {
  const db = getDb();
  if (db) {
    try {
      db.transaction(() => {
        db.prepare('DELETE FROM memories  WHERE project_id = ?').run(projectId);
        db.prepare('DELETE FROM decisions WHERE project_id = ?').run(projectId);
        db.prepare('DELETE FROM job_events WHERE project_id = ?').run(projectId);
        db.prepare('DELETE FROM documents WHERE project_id = ?').run(projectId);
      })();
    } catch (e) { console.error('[MEMORY] Erreur clearProject:', e.message); }
  }

  // Nettoyage fallback JSON
  const f = fbFile(projectId);
  if (fs.existsSync(f)) fs.unlinkSync(f);

  // Nettoyage cache embeddings
  for (const k of Object.keys(_embeddingCache)) {
    if (k.startsWith(projectId)) delete _embeddingCache[k];
  }
}

module.exports = { save, search, listDecisions, getProjectContext, getPreviousErrors, saveDecision, logEvent, getEvents, clearProject };
