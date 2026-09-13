'use strict';
/**
 * MobileMemory — Sprint 5
 * Mémoire persistante des projets mobiles (JSON disque).
 * Stocke : StitchSpec, corrections, routes, composants, artefacts.
 */
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const MEMORY_DIR = path.join(os.homedir(), 'AppData', 'Roaming', 'v0-moteur', 'mobile', 'memory');
if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR, { recursive: true });

function memFile(projectId) {
  return path.join(MEMORY_DIR, `${projectId}.json`);
}

function load(projectId) {
  const f = memFile(projectId);
  if (!fs.existsSync(f)) return { projectId, entries: [], createdAt: Date.now() };
  try { return JSON.parse(fs.readFileSync(f, 'utf-8')); }
  catch { return { projectId, entries: [], createdAt: Date.now() }; }
}

function save(mem) {
  fs.writeFileSync(memFile(mem.projectId), JSON.stringify(mem, null, 2), 'utf-8');
}

/** Ajoute une entrée de mémoire typée. */
function addEntry(projectId, type, payload) {
  const mem   = load(projectId);
  const entry = { id: `${type}-${Date.now()}`, type, payload, at: Date.now() };
  mem.entries.push(entry);
  if (mem.entries.length > 200) mem.entries = mem.entries.slice(-200); // cap
  save(mem);
  return entry;
}

/** Récupère les N dernières entrées (optionnellement filtrées par type). */
function recent(projectId, limit = 10, type = null) {
  const mem = load(projectId);
  let   arr = mem.entries || [];
  if (type) arr = arr.filter(e => e.type === type);
  return arr.slice(-limit);
}

/** Récupère toute la mémoire d'un projet. */
function full(projectId) {
  return load(projectId);
}

/** Sauvegarde la StitchSpec dans la mémoire. */
function saveSpec(projectId, spec) {
  return addEntry(projectId, 'stitch_spec', { screensCount: spec.screens?.length, navigation: spec.navigation?.type, tokens: spec.designTokens, features: spec.features });
}

/** Sauvegarde les fichiers scaffoldés. */
function saveScaffold(projectId, files) {
  return addEntry(projectId, 'scaffold', { fileCount: files.length, files: files.slice(0, 50) });
}

/** Sauvegarde les résultats de validation. */
function saveValidation(projectId, result) {
  return addEntry(projectId, 'validation', { valid: result.valid, passed: result.passed, failed: result.failed, errors: (result.allErrors || []).slice(0, 20) });
}

/** Sauvegarde un résultat de repair. */
function saveRepair(projectId, repairCount, result) {
  return addEntry(projectId, 'repair', { repairCount, saved: result.saved, refused: result.refused });
}

/** Sauvegarde la complétion du projet. */
function saveCompletion(projectId, meta) {
  return addEntry(projectId, 'completed', meta);
}

/** Supprime la mémoire d'un projet. */
function clear(projectId) {
  const f = memFile(projectId);
  if (fs.existsSync(f)) fs.unlinkSync(f);
}

module.exports = { addEntry, recent, full, saveSpec, saveScaffold, saveValidation, saveRepair, saveCompletion, clear, MEMORY_DIR };
