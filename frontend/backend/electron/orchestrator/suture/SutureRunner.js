"use strict";

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const { buildHermesPrompt, validateRepairPlan } = require("./RepairPlanner");
const { parseAndValidateHermesResponse }       = require("./RepairSchema");       // Sprint 5
const { applyRepairPlan }                      = require("./PatchApplier");
const { runAllowedCommand, orderCommands }      = require("./CommandRunner");       // Sprint 7
const { validateWorkspace }                    = require("./ValidationRunner");    // Sprint 8 FINAL
const { store: stateStore }                    = require("./SutureStateStore");    // Sprint 10
const { SutureReporter }                       = require("./SutureReporter");      // Sprint 11
const { promoteWorkspace }                     = require("./PromotionAdapter");    // Sprint 12

const SUTURE_RUN_STATES = Object.freeze({
  REQUESTED: "requested",
  DIAGNOSED: "diagnosed",
  PLANNING: "planning",
  PATCHING: "patching",
  VALIDATING: "validating",
  REPAIR_REQUIRED: "repair_required",
  CANDIDATE_READY: "candidate_ready",
  REJECTED: "rejected",
  FAILED: "failed"
});

const SUTURE_LOOP_LIMITS = Object.freeze({
  maxAttempts: 4,               // 4 tentatives max (conforme au plan SUTURE_V2)
  maxFilesPerAttempt: 3,
  maxRepairPromptBytes: 200000,
  maxFeedbackErrors: 20
});

const REPAIR_POLICIES = {
  localImports: { maxFiles: 1, allowedOperations: ["replace-import", "create-missing-local-file"] },
  exports: { maxFiles: 1, allowedOperations: ["replace-import", "add-named-export"] },
  dependencies: { maxFiles: 0, dependencyRequestsOnly: true },
  props: { maxFiles: 1, allowedOperations: ["add-prop-type", "adapt-prop-call"] },
  runtime: { maxFiles: 1, allowedOperations: ["fix-runtime-error"] },
  visual: { maxFiles: 0, autoRepair: false, humanApprovalRequired: true },
  regression: { maxFiles: 1, allowedOperations: ["fix-interaction"] }
};

function patchFingerprint(plan) {
  return crypto.createHash("sha256").update(JSON.stringify({
    files: plan.files || [],
    dependencyRequests: plan.dependencyRequests || []
  })).digest("hex");
}

class SutureRunner {
  /**
   * Crée un workspace isolé pour une tentative de réparation.
   * Copie depuis projectRoot (source stable) vers .kirov/improvements/<attemptId>/workspace.
   */
  static async createAttemptWorkspace({ projectRoot, activeRoot, attemptId }) {
    const attemptRoot = path.join(projectRoot, '.kirov', 'improvements', attemptId, 'workspace');
    
    await fs.mkdir(attemptRoot, { recursive: true });
    
    // Source = projectRoot (version stable, jamais activeRoot directement)
    const sourceDir = projectRoot;

    async function walkAndCopy(sourceDir, targetDir) {
      const files = await fs.readdir(sourceDir, { withFileTypes: true });
      for (const file of files) {
        if (file.name === '.kirov' || file.name === 'node_modules' || file.name === 'dist' || file.name === 'build') {
          continue;
        }
        const srcPath = path.join(sourceDir, file.name);
        const tgtPath = path.join(targetDir, file.name);
        if (file.isDirectory()) {
          await fs.mkdir(tgtPath, { recursive: true });
          await walkAndCopy(srcPath, tgtPath);
        } else {
          await fs.copyFile(srcPath, tgtPath);
        }
      }
    }

    await walkAndCopy(sourceDir, attemptRoot);

    return { workspaceRoot: attemptRoot, repairId: attemptId, sourceDir, activeRoot };
  }

  static buildRepairDiagnostic({ initial, validation, attempt }) {
    if (validation.status === "passed") return null;

    const failedGates = [];
    const gates = validation.gates || {};
    for (const [gateName, gateResult] of Object.entries(gates)) {
      if (gateResult && gateResult.status === "failed") {
        failedGates.push({
          gate: gateName,
          errors: gateResult.errors || []
        });
      }
    }

    const firstError = failedGates[0]?.errors[0];
    const code = firstError?.code || initial?.code || "VALIDATION_FAILED";
    const diagId = initial?.diagnosticId || `diag-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fp = initial?.fingerprint || `sha256:${crypto.createHash('sha256').update(JSON.stringify(failedGates)).digest('hex')}`;

    return {
      ...initial,
      diagnosticId: diagId,
      fingerprint: fp,
      code,
      mode: "SUTURE_REPAIR",
      attempt: attempt + 1,
      previousDiagnostic: initial,
      failedGates,
      changedFiles: [],
      forbiddenFiles: ["package.json", "src/main.tsx", "index.html"],
      instruction: failedGates.length > 0 
        ? `Corrige uniquement l'erreur de la gate ${failedGates[0].gate}: ${firstError?.message || ''}.`
        : "Veuillez examiner l'état du projet."
    };
  }

  static async runSutureLoop({
    projectId,
    projectRoot,
    activeRoot,
    diagnostic,
    hermesClient,
    baseSnapshot,
    context = {}
  }) {
    let currentDiagnostic = diagnostic;
    const attempts = [];
    const previousFingerprints = new Set();
    const startedAt = new Date().toISOString();
    const repairId  = `rep-${Date.now()}`;

    // Sprint 10 — Enregistrement dans le StateStore + acquisition du verrou stable
    stateStore.create(repairId, projectId);
    stateStore.acquireLock(projectId, repairId);  // ← verrou stable posé ici, libéré automatiquement sur état terminal
    stateStore.transition(repairId, 'diagnosing');

    for (let attempt = 1; attempt <= SUTURE_LOOP_LIMITS.maxAttempts; attempt++) {
      const attemptId = `attempt-${String(attempt).padStart(3, "0")}`;

      const workspaceInfo = await this.createAttemptWorkspace({
        projectRoot,
        activeRoot,
        attemptId
      });

      // 1. Demander le plan à Hermes
      stateStore.transition(repairId, 'plan_ready');
      const instruction = buildHermesPrompt(currentDiagnostic, repairId);
      
      const response = await hermesClient.decide({ 
        state: { instruction }, 
        memory: [], 
        logs: [], 
        tools: [] 
      });
      
      // Sprint 5 — Validation stricte du schéma JSON avant tout
      let plan;
      try {
        plan = parseAndValidateHermesResponse(response, repairId, currentDiagnostic);
      } catch (schemaErr) {
        console.error(`[SUTURE RUNNER] ❌ Erreur schéma Hermes (${schemaErr.code}) à la tentative ${attempt}: ${schemaErr.message}`);
        currentDiagnostic = {
          ...currentDiagnostic,
          instruction: (currentDiagnostic.instruction || '') + `\nATTENTION: Ta réponse précédente a provoqué une erreur (${schemaErr.message}). Tu DOIS retourner un JSON strictement valide répondant au schéma RepairPlan V2.`
        };
        if (attempt < SUTURE_LOOP_LIMITS.maxAttempts) continue;
        const report = SutureReporter.finalize({
          projectRoot, repairId, projectId, diagnostic: currentDiagnostic,
          startedAt, attempts, finalStatus: 'rejected',
          error: schemaErr
        });
        stateStore.transition(repairId, 'rejected', { error: schemaErr.code });
        return { status: 'rejected', reason: schemaErr.code, projectId, attempts, promotion: 'blocked' };
      }

      // Valider le plan (RepairPlanner — règles métier)
      try {
        validateRepairPlan({ plan, diagnostic: currentDiagnostic, repairId });
      } catch (validationErr) {
        console.error(`[SUTURE RUNNER] ❌ Validation métier échouée (${validationErr.code}) à la tentative ${attempt}: ${validationErr.message}`);
        currentDiagnostic = {
          ...currentDiagnostic,
          instruction: (currentDiagnostic.instruction || '') + `\nATTENTION: Le plan précédent a été refusé par les règles métier (${validationErr.message}). Propose un plan valide.`
        };
        if (attempt < SUTURE_LOOP_LIMITS.maxAttempts) continue;
      }

      // Vérification des patchs répétés
      const fingerprint = patchFingerprint(plan);
      if (previousFingerprints.has(fingerprint)) {
        console.warn(`[SUTURE RUNNER] ⚠️ Hermes a proposé le même plan à la tentative ${attempt}. Demande de variante à l'IA...`);
        attempts.push({ attempt, attemptId, status: 'rejected_repeated', error: 'Hermes a proposé le même patch.' });
        currentDiagnostic = {
          ...currentDiagnostic,
          instruction: (currentDiagnostic.instruction || '') + `\nATTENTION: Le plan précédent a déjà été appliqué sans succès. Tu DOIS réécrire les fichiers sources de manière différente.`
        };
        if (attempt < SUTURE_LOOP_LIMITS.maxAttempts) continue;
        SutureReporter.finalize({ projectRoot, repairId, projectId, diagnostic, startedAt, attempts, finalStatus: 'rejected' });
        stateStore.transition(repairId, 'rejected', { reason: 'REPEATED_REPAIR_PLAN' });
        return { status: 'rejected_repeated', reason: 'REPEATED_REPAIR_PLAN', projectId, attempts, promotion: 'blocked' };
      }
      previousFingerprints.add(fingerprint);

      // 3. Appliquer le plan (Fichiers)
      stateStore.transition(repairId, 'patching');
      const patchReport = await applyRepairPlan({
        plan,
        diagnostic: currentDiagnostic,
        repairId,
        workspaceRoot: workspaceInfo.workspaceRoot,
        improvementRoot: workspaceInfo.workspaceRoot,
        projectRoot,
        activeRoot,
        baseSnapshot
      });

      // Synchroniser immédiatement les modifications dans le projet actif sur disque !
      try {
        const { promoteWorkspace: promotePatch } = require('./PatchApplier');
        await promotePatch({
          workspaceRoot: workspaceInfo.workspaceRoot,
          activeRoot: activeRoot || projectRoot,
          patchReport
        });
        console.log(`[SUTURE RUNNER] 🚀 Synchronisation directe de ${patchReport.files?.length || 0} fichier(s) vers le projet actif (${activeRoot || projectRoot}) !`);
      } catch (promErr) {
        console.warn(`[SUTURE RUNNER] ⚠️ Avertissement lors de la synchronisation directe : ${promErr.message}`);
      }

      // Sprint 7 — Exécution via CommandRunner (spawn shell:false) — JAMAIS execPromise
      if (plan.commands && Array.isArray(plan.commands)) {
        const ordered = orderCommands(plan.commands);
        for (const cmdId of ordered) {
          console.log(`[SUTURE RUNNER] ⚙️  Commande allow-listée : ${cmdId}`);
          try {
            const cmdResult = await runAllowedCommand({
              commandId:     cmdId,
              plan,
              cwd:           workspaceInfo.workspaceRoot,
              workspaceRoot: workspaceInfo.workspaceRoot,
              timeoutMs:     180000
            });
            if (cmdResult.status !== 'passed') {
              console.error(`[SUTURE RUNNER] ❌ Commande échouée : ${cmdId} (exit ${cmdResult.exitCode})`);
            }
          } catch (cmdErr) {
            console.error(`[SUTURE RUNNER] ❌ Erreur commande ${cmdId} :`, cmdErr.message);
          }
        }
      }

      // 4. Valider le résultat (ValidationRunner COMPLET — Sprint 8)
      stateStore.transition(repairId, 'validating');
      const validation = await validateWorkspace({
        workspaceRoot:  workspaceInfo.workspaceRoot,
        diagnostic:     currentDiagnostic,
        repairReport:   patchReport,
        routes:         context.routes || ['/'],
        projectId
      });

      const attemptReport = {
        attempt,
        attemptId,
        workspaceRoot: workspaceInfo.workspaceRoot,
        diagnostic: currentDiagnostic,
        plan,
        patchReport,
        validation
      };

      attempts.push(attemptReport);
      stateStore.addAttempt(repairId, {
        attempt, attemptId, status: validation.status,
        gateCount: (validation.required || []).length
      });

      if (validation.status === 'passed') {
        stateStore.transition(repairId, 'succeeded');

        // Sprint 12 — Promotion atomique
        const promotionResult = await promoteWorkspace({
          workspaceRoot: workspaceInfo.workspaceRoot,
          projectRoot,
          repairId,
          validation
        });

        const report = SutureReporter.finalize({
          projectRoot, repairId, projectId, diagnostic, startedAt,
          attempts, finalStatus: 'succeeded', promotion: promotionResult
        });
        return {
          status:    'candidate_ready',
          projectId,
          repairId,
          attempts,
          candidate:  workspaceInfo,
          promotion:  promotionResult,
          report
        };
      }

      // Arrêt fatal si mutation active détectée
      if (validation.status === 'blocked' && validation.errors?.some(e => e.code === 'ACTIVE_MUTATION')) {
        stateStore.transition(repairId, 'rejected', { reason: 'DIRECT_ACTIVE_WRITE_DETECTED' });
        SutureReporter.finalize({ projectRoot, repairId, projectId, diagnostic, startedAt, attempts, finalStatus: 'rejected' });
        return { status: 'rejected', code: 'DIRECT_ACTIVE_WRITE_DETECTED', projectId, attempts, promotion: 'blocked' };
      }

      // Pas de retry automatique pour les régressions visuelles
      const visualGate = validation.gates && validation.gates.visual;
      if (visualGate && visualGate.status !== 'passed' && visualGate.mode !== 'not_run' && visualGate.mode !== 'skipped') {
        stateStore.transition(repairId, 'rejected', { reason: 'VISUAL_REGRESSION_REQUIRES_HUMAN' });
        SutureReporter.finalize({ projectRoot, repairId, projectId, diagnostic, startedAt, attempts, finalStatus: 'rejected' });
        return { status: 'rejected', reason: 'VISUAL_REGRESSION_REQUIRES_HUMAN', projectId, attempts, promotion: 'blocked' };
      }

      if (attempt === SUTURE_LOOP_LIMITS.maxAttempts) break;

      // 5. Préparer le prochain diagnostic
      currentDiagnostic = this.buildRepairDiagnostic({ initial: currentDiagnostic, validation, attempt });
    }

    stateStore.transition(repairId, 'failed');
    const report = SutureReporter.finalize({
      projectRoot, repairId, projectId, diagnostic, startedAt, attempts, finalStatus: 'failed'
    });
    return { status: 'rejected', projectId, repairId, attempts, promotion: 'blocked', report };
  }
}

module.exports = {
  SutureRunner,
  SUTURE_RUN_STATES,
  SUTURE_LOOP_LIMITS,
  REPAIR_POLICIES
};
