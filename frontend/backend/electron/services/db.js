'use strict';
/**
 * TIGER-030 / 031 — SQLite local + migrations
 * electron/services/db.js
 *
 * Utilise better-sqlite3 (synchrone, compatible Electron, natif x64).
 * Stockage dans %APPDATA%/TigerIA/database/tiger-ia.sqlite
 */

const path = require('path');
const fs   = require('fs');
const os   = require('os');

// ─── Résolution du chemin ────────────────────────────────────────────────────
const APP_DATA_DIR = path.join(os.homedir(), 'AppData', 'Roaming', 'TigerIA');
const DB_DIR       = path.join(APP_DATA_DIR, 'database');
const DB_PATH      = path.join(DB_DIR, 'tiger-ia.sqlite');

// Créer les dossiers si absents
const REQUIRED_DIRS = [
  DB_DIR,
  path.join(APP_DATA_DIR, 'projects'),
  path.join(APP_DATA_DIR, 'mcp'),
  path.join(APP_DATA_DIR, 'logs'),
  path.join(APP_DATA_DIR, 'embeddings'),
  path.join(APP_DATA_DIR, 'settings'),
];
for (const d of REQUIRED_DIRS) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

// ─── Chargement de better-sqlite3 ────────────────────────────────────────────
let Database;
try {
  Database = require('better-sqlite3');
} catch {
  // Fallback: module non installé — mode dégradé avec stockage JSON
  console.warn('[DB] better-sqlite3 non disponible — mode JSON fallback actif.');
  Database = null;
}

// ─── Instance singleton ──────────────────────────────────────────────────────
let _db = null;

function getDb() {
  if (_db) return _db;
  if (!Database) return null;

  try {
    _db = new Database(DB_PATH, { verbose: null });
    _db.pragma('journal_mode = WAL');
    _db.pragma('synchronous = NORMAL');
    _db.pragma('foreign_keys = ON');
    runMigrations(_db);
    console.log(`[DB] SQLite connecté : ${DB_PATH}`);
    return _db;
  } catch (e) {
    console.error('[DB] Erreur connexion SQLite:', e.message);
    return null;
  }
}

// ─── TIGER-031 — Migrations ──────────────────────────────────────────────────
const MIGRATIONS = [
  {
    version: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS memories (
        id          TEXT    PRIMARY KEY,
        project_id  TEXT    NOT NULL,
        type        TEXT    NOT NULL,
        content     TEXT    NOT NULL,
        source      TEXT    DEFAULT 'system',
        tags        TEXT    DEFAULT '[]',
        metadata    TEXT    DEFAULT '{}',
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
      CREATE INDEX IF NOT EXISTS idx_memories_type    ON memories(project_id, type);

      CREATE TABLE IF NOT EXISTS documents (
        id          TEXT    PRIMARY KEY,
        project_id  TEXT    NOT NULL,
        file_path   TEXT    NOT NULL,
        content     TEXT    NOT NULL,
        hash        TEXT    NOT NULL,
        created_at  INTEGER NOT NULL,
        updated_at  INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);

      CREATE TABLE IF NOT EXISTS decisions (
        id          TEXT    PRIMARY KEY,
        project_id  TEXT    NOT NULL,
        phase       TEXT    NOT NULL,
        decision    TEXT    NOT NULL,
        reason      TEXT    DEFAULT '',
        tool_used   TEXT    DEFAULT '',
        outcome     TEXT    DEFAULT '',
        created_at  INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_decisions_project ON decisions(project_id);

      CREATE TABLE IF NOT EXISTS job_events (
        id          TEXT    PRIMARY KEY,
        project_id  TEXT    NOT NULL,
        event_type  TEXT    NOT NULL,
        payload     TEXT    DEFAULT '{}',
        created_at  INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_events_project ON job_events(project_id);
      CREATE INDEX IF NOT EXISTS idx_events_type    ON job_events(project_id, event_type);

      CREATE TABLE IF NOT EXISTS schema_migrations (
        version     INTEGER PRIMARY KEY,
        applied_at  INTEGER NOT NULL
      );
    `,
  },
];

function runMigrations(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at INTEGER NOT NULL)`);
  const applied = new Set(db.prepare('SELECT version FROM schema_migrations').all().map(r => r.version));

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.version)) continue;
    db.transaction(() => {
      db.exec(migration.sql);
      db.prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)').run(migration.version, Date.now());
    })();
    console.log(`[DB] Migration v${migration.version} appliquée.`);
  }
}

// ─── Helpers génériques ──────────────────────────────────────────────────────
function nanoid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = { getDb, DB_PATH, APP_DATA_DIR, nanoid };
