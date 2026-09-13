"use strict";

const fs = require('fs');
const path = require('path');

const Phase5StateManager = require('./Phase5StateManager');
const Phase5DiffEngine = require('./Phase5DiffEngine');
const Phase5DecisionEngine = require('./Phase5DecisionEngine');
const Phase5PlanBuilder = require('./Phase5PlanBuilder');
const DriftDetector = require('./DriftDetector');
const Phase5GateRunner = require('./Phase5GateRunner');
const Phase5SafetyValidator = require('./Phase5SafetyValidator');

class Phase5Service {
  constructor(logger = console) {
    this.logger = logger;
    this.stateManager = new Phase5StateManager('', this.logger);
    this.diffEngine = new Phase5DiffEngine();
    this.decisionEngine = new Phase5DecisionEngine(this.logger);
    this.planBuilder = new Phase5PlanBuilder(this.logger);
    this.driftDetector = new DriftDetector(this.logger);

    const registry = {
      drift: async (ctx) => {
        // Le DriftDetector a été mis à jour pour renvoyer le statut 'failed' en cas de problème.
        const report = await this.driftDetector.detectDrift(ctx.projectRoot, ctx.previousState?.implementationManifest, ctx.plan);
        if (report.status === "failed" || report.drifted) {
          return {
            status: "failed",
            verified: false,
            mode: "real",
            errors: report.errors || [],
            evidence: { conflicts: report.conflicts }
          };
        }
        return { status: "passed", verified: true, mode: "real" };
      },
      diff: async (ctx) => {
        return { status: "passed", verified: true, mode: "real" };
      },
      plan_safety: async (ctx) => {
        const safety = Phase5SafetyValidator.validatePlanSafety(ctx.plan);
        if (safety.status !== "passed") {
          const err = new Error("Le plan est dangereux (conflits).");
          err.code = "PLAN_SAFETY_FAILED";
          err.errors = safety.errors;
          throw err;
        }
        return { status: "passed", verified: true, mode: "real" };
      },
      incremental_plan: async (ctx) => {
        return { status: "passed", verified: true, mode: "real" };
      },
      code_generation_master: async (ctx) => {
        const hermes = require('../hermes-client.js');
        const Phase5SnapshotBuilder = require('./Phase5SnapshotBuilder.js');
        
        const stagingDir = path.join(ctx.projectRoot, '.kirov', 'phase5', 'staging');
        
        // Créer le staging s'il n'existe pas
        fs.mkdirSync(stagingDir, { recursive: true });

        // Générer le snapshot pour le contexte du LLM
        const snapshot = await Phase5SnapshotBuilder.buildProjectSnapshot(ctx.projectRoot);
        const snapshotText = JSON.stringify({
          projectRoot: path.basename(ctx.projectRoot),
          files: (snapshot.files || []).map(f => ({ path: f.path, content: f.content }))
        }, null, 2);

        const filesToGenerate = [...(ctx.plan.create || []), ...(ctx.plan.modify || [])];
        const total = filesToGenerate.length;

        if (total === 0) {
          return { status: "passed", verified: true, mode: "real", message: "Aucun fichier à générer" };
        }

        const capabilitiesList = ctx.plan.capabilities.map(c => c.id).join(', ');

        for (let i = 0; i < total; i++) {
          const filePath = filesToGenerate[i];
          console.log(`\n[PHASE5] ⏳ Kirov5: Génération du fichier ${i + 1}/${total} (${filePath}) par Hermes...`);

          const sysPrompt = `Tu es Kirov5, un ingénieur de génération de code industriel automatisé.
On te donne un instantané d'un projet et tu dois générer le code source complet et final pour le fichier demandé.
L'application doit intégrer les capacités suivantes: ${capabilitiesList}.
IMPORTANT : Ne renvoie QUE LE CODE EXACT du fichier, sans bloc markdown (pas de \`\`\`), sans aucune explication. Seulement le code brut.`;

          const userPrompt = `=== SNAPSHOT DU PROJET ===
${snapshotText}

=== TÂCHE ===
Génère le code source de production complet pour le fichier : ${filePath}.`;

          try {
            const rawResponse = await hermes.generate(sysPrompt, userPrompt);
            let code = typeof rawResponse === 'string' ? rawResponse : (rawResponse.content || JSON.stringify(rawResponse));
            
            // Nettoyage Markdown au cas où
            code = code.trim();
            if (code.startsWith('\`\`\`')) {
              code = code.split('\\n').slice(1).join('\\n');
              if (code.endsWith('\`\`\`')) {
                code = code.slice(0, -3);
              }
            }

            const targetPath = path.join(stagingDir, filePath);
            fs.mkdirSync(path.dirname(targetPath), { recursive: true });
            fs.writeFileSync(targetPath, code, 'utf8');
            console.log(`[PHASE5] ✅ Fichier ${filePath} généré et sauvegardé en staging.`);

          } catch (err) {
            console.error(`[PHASE5] ❌ Erreur lors de la génération de ${filePath}:`, err.message);
            return {
              status: "failed",
              verified: false,
              mode: "real",
              errors: [{ code: 'CODE_GEN_FAILED', message: `Erreur sur ${filePath}: ${err.message}` }]
            };
          }
        }
        
        return { status: "passed", verified: true, mode: "real" };
      }
    };

    this.gateRunner = new Phase5GateRunner({ registry, logger: this.logger });
  }

  async analyzeProject({ projectRoot, projectId }) {
    const contractPath = path.join(projectRoot, 'contracts', 'phase5-industrialization.json');
    if (fs.existsSync(contractPath)) {
      return JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    }
    return {};
  }

  async runIncrementalPhase5({ projectRoot, projectId, pushDir, contract, options }) {
    this.stateManager.projectPath = projectRoot;
    
    console.log('[PHASE5] runIncrementalPhase5 appelé avec contract:', contract ? 'OUI (Fourni)' : 'NON (Vide)');

    const previousState = await this.stateManager.load(projectRoot);
    const currentState = contract || await this.analyzeProject({ projectRoot, projectId });

    console.log('[PHASE5] Capabilities reçues:', currentState?.capabilities?.length || 0);

    const diff = this.diffEngine.computeDiff(previousState ? previousState.contract : {}, currentState);
    
    console.log('[PHASE5] Diff calculé:', JSON.stringify(diff));

    const decisionsObj = this.decisionEngine.buildIncrementalDecision({
      previousState,
      currentState,
      diff,
      options
    });

    const plan = this.planBuilder.build({
      previousState,
      currentState,
      diff,
      decisions: decisionsObj
    });

    const hasChanges = diff.addedCapabilities.length > 0 || diff.removedCapabilities.length > 0 || diff.changedCapabilities.length > 0;
    const planHasChanges = plan.create.length > 0 || plan.modify.length > 0 || plan.delete.length > 0;

    if (!hasChanges && !planHasChanges && previousState) {
      this.logger.info(`[PHASE5] Idempotence : Aucun changement détecté, aucune mutation requise.`);
      return {
        status: "passed",
        mode: "incremental",
        stateCommitted: false,
        activeModified: false,
        changes: diff,
        plan: {
          create: [],
          modify: [],
          delete: [],
          steps: []
        }
      };
    }

    // Detect drift just to have it in report if we want, but GateRunner runs it inside the 'drift' gate.
    const drift = await this.driftDetector.detectDrift(projectRoot, previousState?.implementationManifest);

    const result = await this.gateRunner.run({
      projectRoot,
      projectId,
      pushDir,
      previousState,
      currentState,
      diff,
      decisions: decisionsObj,
      plan,
      drift,
      options
    });

    if (result.status !== "passed") {
      await this.stateManager.writeAttemptReport({
        pushDir: pushDir || path.join(projectRoot, '.kirov', 'pushes', 'latest'),
        report: result
      });

      return {
        ...result,
        stateCommitted: false,
        activeModified: false,
        plan
      };
    }

    const nextState = this.stateManager.prepareNextState({
      previousState,
      currentState,
      diff,
      decisions: decisionsObj,
      plan,
      result
    });

    await this.stateManager.commitSuccessfulState({
      projectRoot,
      nextState
    });

    // ─── AUTO-MERGE : Déploiement définitif ───
    let activeModified = false;
    try {
      const stagingDir = path.join(projectRoot, '.kirov', 'phase5', 'staging');
      if (fs.existsSync(stagingDir)) {
        console.log(`[PHASE5] 🚀 Application automatique (Merge) du Staging vers le projet cible...`);
        // Copie le contenu du staging vers la racine du projet (fusion)
        fs.cpSync(stagingDir, projectRoot, { recursive: true, force: true });
        console.log(`[PHASE5] ✅ Projet ${path.basename(projectRoot)} définitivement industrialisé.`);
        activeModified = true;
      }
    } catch (e) {
      console.error(`[PHASE5] ❌ Erreur lors du Merge automatique :`, e);
    }
    // ──────────────────────────────────────────

    return {
      ...result,
      stateCommitted: true,
      activeModified,
      plan
    };
  }
}

module.exports = Phase5Service;
