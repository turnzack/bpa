'use strict';

/**
 * SutureController.js
 * Point d'entrée unique pour démarrer une réparation Suture V2.
 * Sprint 10 — Protection anti-double-clic via SutureStateStore.
 */

const path = require('path');
const { PROJECTS_ROOT } = require('./SutureConfig');
const { resolveDiagnostic } = require('./DiagnosticResolver');


async function startSuture({ projectId, activeFile, rawError, promptText, hermesClient }) {
  const projectRoot = path.resolve(PROJECTS_ROOT, projectId);
  const activeRoot  = projectRoot;

  // Sprint 10 — Vérification anti-double-clic AVANT tout traitement
  const activeLock = stateStore.getActiveLock(projectId);
  if (activeLock) {
    throw Object.assign(
      new Error(`Une réparation est déjà en cours pour "${projectId}" (${activeLock}).`),
      { code: 'SUTURE_ALREADY_RUNNING', projectId, existingRepairId: activeLock }
    );
  }

  const diagnostic = resolveDiagnostic({
    projectId,
    projectRoot,
    activeFile,
    rawError,
    source: 'vite'
  });

  // Snapshot de la version active avant toute modification (lecture seule)
  const { createFileSnapshot } = require('../validation/FixtureManager');
  const baseSnapshot = await createFileSnapshot(activeRoot);

  // SutureRunner acquiert lui-même le verrou via son repairId stable
  const { SutureRunner } = require('./SutureRunner');
  const result = await SutureRunner.runSutureLoop({
    projectId,
    projectRoot,
    activeRoot,
    baseSnapshot,
    diagnostic,
    hermesClient,
    context: { promptText }
  });

  return result;

}

module.exports = { startSuture };
