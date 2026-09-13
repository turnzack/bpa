'use strict';

/**
 * V0ImprovementService.js
 * Point d'entrée Phase 3 — Orchestrateur d'amélioration
 */

const path = require('path');
const { ImprovementStateMachine } = require('./ImprovementStateMachine');
const SnapshotManager = require('./SnapshotManager');
const ImprovementPlanner = require('./ImprovementPlanner');
const DagBuilder = require('./DagBuilder');
const DagExecutor = require('./DagExecutor');
const PatchPlanner = require('./PatchPlanner');
const PatchApplier = require('./PatchApplier');
const GateRunner = require('../gates/GateRunner');
const ImprovementReport = require('./ImprovementReport');

// Registre en mémoire des améliorations actives
const _activeImprovements = new Map();

async function start({ projectId, request, packs = [], improvementTypes = [], strategy = 'minimal-patch', baseVersionId = null, targetFiles = [], targetRoutes = [] }) {
  const improvementId = `impr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const runId = `run-${Date.now()}`;

  const sm = new ImprovementStateMachine(improvementId);
  const report = new ImprovementReport(improvementId, projectId);

  _activeImprovements.set(improvementId, { sm, report, projectId, startedAt: new Date().toISOString() });

  // Lance le pipeline de manière asynchrone
  _runPipeline({ improvementId, projectId, request, packs, improvementTypes, strategy, baseVersionId, targetFiles, targetRoutes, sm, report })
    .catch(err => {
      console.error(`[IMPROVEMENT] ❌ Pipeline échoué [${improvementId}]:`, err.message);
      sm.transition('repair_required');
      report.addError('pipeline', err.message);
    });

  return { status: 'requested', improvementId, runId };
}

async function _runPipeline({ improvementId, projectId, request, packs, improvementTypes, strategy, baseVersionId, targetFiles, targetRoutes, sm, report }) {
  // 1. SNAPSHOT
  sm.transition('analyzing');
  console.log(`[IMPROVEMENT] 📸 Snapshot du projet ${projectId}...`);
  const snapshot = await SnapshotManager.take(projectId, baseVersionId);
  report.setSnapshot(snapshot);

  // 2. PLAN
  const plan = await ImprovementPlanner.plan({ projectId, request, packs, improvementTypes, strategy, targetFiles, targetRoutes, snapshot });
  sm.transition('plan_ready');
  report.setPlan(plan);

  // 3. DAG
  const dag = DagBuilder.build(plan);
  report.setDag(dag);

  // 4. EXECUTION DAG (génération patches)
  sm.transition('patching_staging');
  const patchSet = await DagExecutor.execute(dag, { projectId, snapshot, plan });

  // 5. APPLICATION DES PATCHES
  const applyResult = await PatchApplier.apply(patchSet, { projectId, snapshot });
  report.setPatchResult(applyResult);

  // 6. 15 GATES
  sm.transition('static_validated');
  const gateResult = await GateRunner.run(projectId, report, { snapshot, strategy });
  report.setGates(gateResult);

  const allPassed = gateResult.required.every(g => g.status === 'passed');
  if (!allPassed) {
    sm.transition('repair_required');
    report.finalize('repair_required');
    return;
  }

  // 7. PROMOTION
  sm.transition('promotable');
  const promotionResult = await SnapshotManager.promote(projectId, snapshot, report);
  report.setPromotion(promotionResult);
  sm.transition('promoted');
  report.finalize('promoted');
  console.log(`[IMPROVEMENT] ✅ Amélioration ${improvementId} promue avec succès !`);
}

function get(improvementId) {
  return _activeImprovements.get(improvementId) || null;
}

function list(projectId) {
  const all = [..._activeImprovements.values()];
  return projectId ? all.filter(i => i.projectId === projectId) : all;
}

module.exports = { start, get, list };
