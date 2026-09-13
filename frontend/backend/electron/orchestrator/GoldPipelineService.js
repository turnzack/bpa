"use strict";

const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs");

const { resolveGenerationContext, buildContextBlock } = require('./knowledge/MethodologyResolver');

// Chemin du bundle local signé (fallback offline)
const LOCAL_BUNDLE_PATH = path.join(__dirname, '..', '..', '..', 'v0-interface-versel', 'public', 'methodology');

const {
  ContractValidator,
  assertValidationDependencies,
  assertContractHashes,
  validateDomainReferences
} = require("./validators/ContractValidator");

const {
  assertPlaywrightAvailable,
  assertChromiumAvailable
} = require("./runtime/RuntimeSmokeTest");

const REQUIRED_SCHEMAS = [
  "phase2-domain.schema.json",
  "phase2-state.schema.json",
  "phase2-api.schema.json",
  "integration-response.schema.json",
  "screens-manifest.schema.json",
  "interactions-manifest.schema.json",
  "assets-manifest.schema.json",
  "design-tokens.schema.json",
  "visual-conversion.schema.json",
  "runtime-report.schema.json"
];

function assertSchemasAvailable(schemaDir) {
  const missing = REQUIRED_SCHEMAS.filter((filename) => !fs.existsSync(path.join(schemaDir, filename)));
  if (missing.length > 0) {
    throw Object.assign(
      new Error(`Schémas Gold manquants : ${missing.join(", ")}`),
      { code: "REQUIRED_SCHEMAS_MISSING", missing }
    );
  }
}

async function assertGoldRuntime({ schemaDir }) {
  assertValidationDependencies();
  assertPlaywrightAvailable();
  await assertChromiumAvailable();
  assertSchemasAvailable(schemaDir);

  return {
    status: "passed",
    ajv: "available",
    playwright: "available",
    chromium: "available",
    schemas: "10/10"
  };
}

function toContractFailure(error, context) {
  return {
    status: "repair_required",
    code: error.code || "CONTRACT_INVALID",
    projectId: context.projectId,
    runId: context.runId,
    batchId: context.batchId,
    phase: context.phase,
    details: error.details || error.issues || [],
    message: error.message
  };
}

class GoldPipelineService {
  constructor({
    projectStore,
    manifestStore,
    blueprintBuilder,
    batchPlanner,
    projectOrchestrator,
    previewManager,
    lockManager
  }) {
    this.projectStore = projectStore;
    this.manifestStore = manifestStore;
    this.blueprintBuilder = blueprintBuilder;
    this.batchPlanner = batchPlanner;
    this.projectOrchestrator = projectOrchestrator;
    this.previewManager = previewManager;
    this.lockManager = lockManager;

    const schemaDir = path.join(__dirname, "schemas");
    this.contractValidator = new ContractValidator(schemaDir);
    for (const schema of REQUIRED_SCHEMAS) {
      const name = schema.replace(".schema.json", "");
      this.contractValidator.load(name, schema);
    }
  }

  async validateContracts({ domain, state, api, expectedHashes, receivedHashes }) {
    this.contractValidator.validate("phase2-domain", domain);
    this.contractValidator.validate("phase2-state", state);
    this.contractValidator.validate("phase2-api", api);

    assertContractHashes({ expected: expectedHashes, received: receivedHashes });

    const referenceIssues = validateDomainReferences({ domain, state, api });
    if (referenceIssues.some((issue) => ["critical", "high"].includes(issue.severity))) {
      const error = new Error("Références croisées invalides.");
      error.code = "CONTRACT_REFERENCES_INVALID";
      error.issues = referenceIssues;
      throw error;
    }

    return { status: "passed", referenceIssues };
  }

  createRunId(projectId) {
    const safeId = String(projectId)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 60);

    return `${safeId}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  }

  async run({ projectId, projectRoot, source, userPrompt, files, pipelineMode = "gold" }) {
    const runId = this.createRunId(projectId);
    const schemaDir = path.join(__dirname, "schemas");

    let validationRuntime;
    if (pipelineMode === "gold") {
      try {
        validationRuntime = await assertGoldRuntime({ schemaDir });
      } catch (error) {
        throw Object.assign(new Error("Le mode Gold ne peut démarrer. Environnement incomplet."), { cause: error });
      }
    }

    // 1. Lock
    let lock;
    if (this.lockManager && typeof this.lockManager.acquireLock === 'function') {
      lock = await this.lockManager.acquireLock(projectRoot);
    }

    try {
      if (this.projectStore) {
        await this.projectStore.update(projectId, { status: "scanning", runId, source });
      }

      // --- RÉSOLUTION DU CONTEXTE DE BASE (Grade Gold) ---
      let baseContext;
      try {
        baseContext = await resolveGenerationContext({
          phase: 'default',
          projectId,
          bundleLocalPath: LOCAL_BUNDLE_PATH
        });
      } catch (kErr) {
        console.error('[GOLD-PIPELINE] ❌ KNOWLEDGE_PROVIDER_UNAVAILABLE (base) — génération bloquée.', kErr.message);
        return { status: 'blocked', code: kErr.code || 'KNOWLEDGE_PROVIDER_UNAVAILABLE', mutationsStarted: false };
      }

      // --- INJECTION AUTO DU PRD ---
      function readPrdResult(root, pId) {
        const { findAndReadPrd } = require('./zip-batcher');
        const res = findAndReadPrd(root, pId);
        if (!res || res.status === 'not_found') return { status: 'absent', content: null, errors: [] };
        return res;
      }

      const prd = readPrdResult(projectRoot, projectId);
      
      if (prd.status === 'invalid') {
        throw Object.assign(new Error("Sovereign Pack invalide."), {
          code: "SOVEREIGN_PACK_INVALID",
          details: prd.errors
        });
      }
      
      if (prd.status === 'valid' && prd.content) {
        userPrompt = [
          userPrompt || "",
          "=== SOVEREIGN PRD ===",
          prd.content
        ].join("\n\n");
        console.log(`[GOLD-PIPELINE] 🧠 Pack PRD injecté avec succès dans le contexte IA (${prd.content.length} octets).`);
      }
      // -----------------------------

      // 2. Blueprint & Batches
      let contract = {};
      let blueprint = { routes: [{ path: "/", required: true }] };
      let batches = [{ id: `batch-${runId}`, projectId }];

      if (this.blueprintBuilder) {
          contract = await this.blueprintBuilder.detectContract(projectRoot);
          blueprint = await this.blueprintBuilder.build({ projectId, projectRoot, files, contract, userPrompt });
          
          const contractInput = {
            domain: contract?.domain || blueprint?.domainContract,
            state: contract?.state || blueprint?.stateContract,
            api: contract?.api || blueprint?.apiContract,
            expectedHashes: contract?.expectedHashes || {},
            receivedHashes: contract?.receivedHashes || {}
          };

          if (!contractInput.domain || !contractInput.state || !contractInput.api) {
            throw Object.assign(new Error("Contrats requis manquants (domain, state, api)."), { code: "CONTRACT_INPUT_MISSING" });
          }

          try {
            await this.validateContracts(contractInput);
          } catch (contractErr) {
            console.warn("[GOLD-PIPELINE] Avertissement: Validation des contrats en échec.", contractErr.message);
            throw contractErr; // Propager l'erreur comme demandé (blocage)
          }
      }
      if (this.batchPlanner) {
          batches = this.batchPlanner.create({ blueprint, files }).map(b => ({ ...b, projectId }));
      }

      if (this.manifestStore && typeof this.manifestStore.createManifest === 'function') {
          await this.manifestStore.createManifest(projectId, runId, {
            methodologyHash: baseContext.methodologyHash,
            manifestHash: baseContext.manifestHash,
            contractHash: baseContext.contextHash
          });
      }

      const hermesClient = require('./hermes-client');
      const { generateBatchPrompt } = require('./zip-batcher');
      const { validateBusinessWiringPlan, validateUIUpdatePlan } = require('./suture/RepairPlanner');

      // 3. Orchestrateur Transactionnel complet (Staging -> Validation -> Promotion -> Double Runtime)
      const result = await this.projectOrchestrator.runProject(batches, {
         generate: async (batch) => {
            let phase = "default";
            if (batch.phase === "wiring" || (batch.id && batch.id.includes("wiring"))) phase = "wiring";
            else if (batch.phase === "ui-update" || (batch.id && batch.id.includes("ui-update"))) phase = "ui-update";
            else if (batch.phase === "backendintegration" || (batch.id && batch.id.includes("backendintegration"))) phase = "backendintegration";

            if (phase === "default") {
              return files; // Fallback pour les phases inconnues
            }

            const MAX_PLAN_ATTEMPTS = 2;
            const MAX_CODE_ATTEMPTS = 2;

            // === RÉSOLUTION UNIQUE DU CONTEXTE PAR LOT ===
            let methodologyContextBlock = '';
            try {
              const ctx = await resolveGenerationContext({
                phase,
                projectId,
                bundleLocalPath: LOCAL_BUNDLE_PATH,
              });
              methodologyContextBlock = buildContextBlock(ctx);
              console.log('\n======================================================');
              console.log(`[GOLD-DIAGNOSTIC] BATCH_PHASE         = ${phase}`);
              console.log(`[GOLD-DIAGNOSTIC] ENGINE_VERSION      = 5.1.0`);
              console.log(`[GOLD-DIAGNOSTIC] METHODOLOGY_VERSION = ${ctx.methodologyVersion}`);
              console.log(`[GOLD-DIAGNOSTIC] KNOWLEDGE_SOURCE    = ${ctx.methodologySource}`);
              console.log(`[GOLD-DIAGNOSTIC] MANIFEST_HASH       = ${ctx.manifestHash || 'N/A'}`);
              console.log(`[GOLD-DIAGNOSTIC] SIGNATURE_VERIFIED  = ${ctx.signatureVerified}`);
              console.log('======================================================\n');
              
              // Figer le contexte sur l'objet batch
              batch.methodologyVersion = ctx.methodologyVersion;
              batch.methodologyHash = ctx.methodologyHash;
              batch.manifestHash = ctx.manifestHash;
              batch.contextHash = ctx.contextHash;

            } catch (kErr) {
              console.error(`[GOLD-PIPELINE] ❌ KNOWLEDGE_PROVIDER_UNAVAILABLE (${phase}) — génération bloquée.`, kErr.message);
              return { status: 'blocked', code: kErr.code || 'KNOWLEDGE_PROVIDER_UNAVAILABLE', mutationsStarted: false };
            }

            let plan = null;
            let planValid = false;
            let planViolations = [];

            for (let attempt = 1; attempt <= MAX_PLAN_ATTEMPTS; attempt++) {
              console.log(`[GOLD-PIPELINE] Appel 1 (Plan ${phase}) - Tentative ${attempt}/${MAX_PLAN_ATTEMPTS}`);
              const promptObj = generateBatchPrompt(batch, 0, batches.length, projectId, userPrompt, { step: 'plan', methodologyContextBlock });
              
              const response = await hermesClient.decide({
                state: { systemPrompt: promptObj.systemPrompt, userPrompt: promptObj.userPrompt, jsonMode: promptObj.jsonMode, provider: "deepseek" },
                memory: {}, logs: [], tools: []
              });

              plan = JSON.parse(response.content);
              const validation = phase === "ui-update" ? validateUIUpdatePlan(plan) : validateBusinessWiringPlan(plan);
              
              if (validation.valid) {
                planValid = true;
                break;
              } else {
                console.warn(`[GOLD-PIPELINE] ⚠️ Plan ${phase} invalide : ${validation.violations.join(', ')}`);
                planViolations = validation.violations;
              }
            }

            if (!planValid) {
              throw new Error(`Plan de conformité ${phase} rejeté définitivement: ${planViolations.join(', ')}`);
            }

            console.log(`[GOLD-PIPELINE] ✅ Plan ${phase} accepté. Lancement de l'Appel 2 (Code).`);
            let codeFiles = [];
            let codeValid = false;

            for (let attempt = 1; attempt <= MAX_CODE_ATTEMPTS; attempt++) {
              console.log(`[GOLD-PIPELINE] Appel 2 (Code ${phase}) - Tentative ${attempt}/${MAX_CODE_ATTEMPTS}`);
              // Utilise le même methodologyContextBlock résolu plus haut
              const promptObj = generateBatchPrompt(batch, 0, batches.length, projectId, userPrompt, { step: "code", validatedPlan: plan, methodologyContextBlock });
              const response = await hermesClient.decide({
                state: { systemPrompt: promptObj.systemPrompt, userPrompt: promptObj.userPrompt, jsonMode: promptObj.jsonMode, provider: "deepseek" },
                memory: {}, logs: [], tools: []
              });

              const codePlan = JSON.parse(response.content);
              if (codePlan && Array.isArray(codePlan.files)) {
                codeFiles = codePlan.files;
                codeValid = true;
                break;
              }
            }

            if (!codeValid) {
              throw new Error(`Génération de code ${phase} échouée après ${MAX_CODE_ATTEMPTS} tentatives.`);
            }

            // Validation de sécurité basique sur les fichiers retournés
            for (const file of codeFiles) {
              if (!file.path || file.path.startsWith('..') || file.path.startsWith('/')) {
                throw new Error(`Chemin de fichier invalide ou hors scope retourné par Hermes: ${file.path}`);
              }
            }

            return codeFiles;
         }
      });

      if (result.status !== "ready") {
        if (this.projectStore) {
           await this.projectStore.update(projectId, { status: result.status, runId, result });
        }
        return result;
      }

      // 4. Démarrer le serveur final sur le port 5173 (depuis la racine candidate)
      let preview = { url: null, port: null, status: "not_run" };
      if (!this.previewManager) {
          const res = { ...result, status: "validation_incomplete", preview, productionReady: false };
          if (this.projectStore) await this.projectStore.update(projectId, { status: "validation_incomplete", runId, result: res });
          return res;
      }

      const candidateRoot = result.candidateRoot || result.stagingRoot;
      if (!candidateRoot) {
        return {
          ...result,
          status: "validation_incomplete",
          code: "CANDIDATE_ROOT_MISSING",
          activeModified: false
        };
      }

      preview = await this.previewManager.startCertified({ projectRoot: candidateRoot, projectId, port: 5173, blueprint });

      const finalResult = { ...result, status: "production_candidate", preview, activeModified: false, promoted: false };

      if (this.projectStore) {
        await this.projectStore.update(projectId, { status: "production_candidate", runId, result: finalResult });
      }
      return finalResult;

    } catch (error) {
      const failure = {
        status: "repair_required",
        projectId,
        runId,
        error: { code: error.code || "PIPELINE_FAILED", message: error.message, stack: error.stack }
      };

      if (this.projectStore) {
        await this.projectStore.update(projectId, failure);
      }
      throw error;
    } finally {
      if (lock && this.lockManager && typeof this.lockManager.releaseLock === 'function') {
        await this.lockManager.releaseLock(lock);
      }
    }
  }
}

module.exports = { GoldPipelineService };
