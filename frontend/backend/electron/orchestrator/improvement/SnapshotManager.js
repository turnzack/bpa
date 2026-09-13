'use strict';
/**
 * SnapshotManager.js — Phase 3
 * Fige l'état de la version active avant toute modification
 * Architecture : active/CURRENT + active/versions/version-XXX/
 */
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const PROJECTS_DIR = path.join(__dirname, '..', '..', '..', '..', 'v0saveprojets');

function _hashFile(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    return 'sha256:' + crypto.createHash('sha256').update(buf).digest('hex');
  } catch { return null; }
}

function _buildFileHashes(dir, baseDir = dir, result = {}) {
  if (!fs.existsSync(dir)) return result;
  const skip = ['node_modules', '.git', '.kirov', 'dist', 'build', '.next'];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      _buildFileHashes(full, baseDir, result);
    } else {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      result[rel] = _hashFile(full);
    }
  }
  return result;
}

async function take(projectId, baseVersionId = null) {
  const projectDir = path.join(PROJECTS_DIR, projectId);
  if (!fs.existsSync(projectDir)) throw new Error(`Projet introuvable : ${projectId}`);

  // Lire CURRENT si existant
  const currentFile = path.join(projectDir, 'active', 'CURRENT');
  let currentVersionId = null;
  try { currentVersionId = fs.readFileSync(currentFile, 'utf-8').trim(); } catch {}

  // Vérification baseVersion
  if (baseVersionId && currentVersionId && baseVersionId !== currentVersionId) {
    const err = new Error(`ACTIVE_VERSION_CHANGED: requestedVersionId (${baseVersionId}) !== currentVersionId (${currentVersionId})`);
    err.code = 'ACTIVE_VERSION_CHANGED';
    throw err;
  }

  // Construire le snapshot
  const files = _buildFileHashes(path.join(projectDir, 'src'), path.join(projectDir, 'src'));
  const snapshot = {
    projectId,
    activeVersionId: currentVersionId || baseVersionId || 'v0',
    blueprintHash: 'sha256:' + crypto.createHash('sha256').update(JSON.stringify(files)).digest('hex'),
    files,
    createdAt: new Date().toISOString(),
    snapshotId: `snap-${Date.now()}`,
  };

  // Persister le snapshot
  const snapDir = path.join(projectDir, '.kirov', 'snapshots');
  fs.mkdirSync(snapDir, { recursive: true });
  fs.writeFileSync(path.join(snapDir, `${snapshot.snapshotId}.json`), JSON.stringify(snapshot, null, 2));
  console.log(`[SNAPSHOT] ✅ Snapshot ${snapshot.snapshotId} créé pour ${projectId}`);
  return snapshot;
}

async function promote(projectId, snapshot, report) {
  const projectDir = path.join(PROJECTS_DIR, projectId);
  const activeDir  = path.join(projectDir, 'active');
  const versionsDir = path.join(activeDir, 'versions');
  const currentFile = path.join(activeDir, 'CURRENT');
  const currentTmp  = path.join(activeDir, 'CURRENT.tmp');

  // Lire CURRENT
  let previousVersionId = null;
  try { previousVersionId = fs.readFileSync(currentFile, 'utf-8').trim(); } catch {}

  // Calculer le prochain numéro de version
  let nextNum = 1;
  if (previousVersionId && previousVersionId.startsWith('version-')) {
    const n = parseInt(previousVersionId.split('-')[1], 10);
    if (!isNaN(n)) nextNum = n + 1;
  }
  const nextVersionId = `version-${String(nextNum).padStart(3, '0')}`;
  const nextVersionDir = path.join(versionsDir, nextVersionId);

  // Copier staging → versions/version-next
  const stagingDir = path.join(projectDir, '.kirov', 'staging');
  if (fs.existsSync(stagingDir)) {
    fs.mkdirSync(nextVersionDir, { recursive: true });
    _copyDir(stagingDir, nextVersionDir);
  }

  // Écriture atomique CURRENT.tmp → CURRENT
  fs.mkdirSync(activeDir, { recursive: true });
  fs.writeFileSync(currentTmp, nextVersionId, 'utf-8');
  fs.renameSync(currentTmp, currentFile);
  console.log(`[PROMOTION] ✅ CURRENT → ${nextVersionId} (atomique)`);

  return { previousVersionId, nextVersionId, currentFile, promotedAt: new Date().toISOString() };
}

async function rollback(projectId, targetVersionId) {
  const projectDir = path.join(PROJECTS_DIR, projectId);
  const currentFile = path.join(projectDir, 'active', 'CURRENT');
  const currentTmp  = path.join(projectDir, 'active', 'CURRENT.tmp');
  fs.writeFileSync(currentTmp, targetVersionId, 'utf-8');
  fs.renameSync(currentTmp, currentFile);
  console.log(`[ROLLBACK] ↩️ CURRENT → ${targetVersionId}`);
  return { rolledBackTo: targetVersionId, at: new Date().toISOString() };
}

function _copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) _copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

module.exports = { take, promote, rollback };
