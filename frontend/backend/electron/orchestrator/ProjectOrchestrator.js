const { BatchStateMachine } = require("./BatchStateMachine");

class ProjectOrchestrator {
  constructor({ workspace, manifestStore, staticValidator, buildRunner, runtimeTest, repairManager, promotionManager, artifactWriter }) {
    this.workspace = workspace;
    this.manifestStore = manifestStore;
    this.staticValidator = staticValidator;
    this.buildRunner = buildRunner;
    this.runtimeTest = runtimeTest;
    this.repairManager = repairManager;
    this.promotionManager = promotionManager;
    this.artifactWriter = artifactWriter;
  }

  async executePhase({ phase, batch, stateMachine, operation }) {
    try {
      return await operation();
    } catch (error) {
      await stateMachine.fail(error, { phase, batchId: batch.id });
      await this.repairManager.create({ batchId: batch.id, phase, error: { code: error.code || "PHASE_FAILED", message: error.message } });
      throw error;
    }
  }

  async processBatch(batch, aiGenerator) {
    const stateMachine = new BatchStateMachine({
      batchId: batch.id,
      projectId: batch.projectId || (this.workspace.projectRoot ? this.workspace.projectRoot.split(/[/\\]/).pop() : "unknown_project"),
      store: this.manifestStore
    });

    try {
      await stateMachine.transition("generating", { attempt: batch.attempt || 1 });
      
      // 1. Generation IA (Mock pour l'orchestrateur abstrait)
      const aiResponseFiles = await aiGenerator.generate(batch);
      await stateMachine.transition("response_validated");

      // 2. Ecriture en Staging via ArtifactWriter (Correction 6)
      if (this.artifactWriter && Array.isArray(aiResponseFiles)) {
        this.artifactWriter.writeBatch({
          batchId: batch.id,
          files: aiResponseFiles,
          scope: batch.files || [],
          preserve: batch.preserve || []
        });
      }
      await stateMachine.transition("staged");

      // 3. Validation Statique
      const staticResult = await this.staticValidator.validateBatch(batch, aiResponseFiles);
      if (!staticResult.isValid) {
         throw { code: staticResult.issues[0].code, message: staticResult.issues[0].message };
      }
      await stateMachine.transition("static_validated");

      // 4. Validation Build
      const buildResult = await this.buildRunner.validateBuild();
      if (buildResult.status !== "executed_passed") {
         throw { code: "BUILD_FAILED", message: buildResult.error ? buildResult.error.message : "READY_REQUIRES_REAL_BUILD" };
      }
      await stateMachine.transition("build_validated");

      // 5. Validation Runtime
      const runtimeResult = await this.runtimeTest.validateRuntime(["/"]); // Par défaut on test la racine
      if (runtimeResult.status !== "passed") {
         const details = runtimeResult.error || JSON.stringify(runtimeResult.rawResults || runtimeResult.runtime, null, 2);
         throw { code: "RUNTIME_FAILED", message: `Le test Playwright a remonté des erreurs:\n${details}` };
      }
      await stateMachine.transition("runtime_validated");

      // Si on arrive ici, le lot entier est 100% validé.
      // La promotion finale (vers active) se fait au niveau global du projet.
      return { status: "validated", batchId: batch.id };

    } catch (error) {
      await this.repairManager.handleFailure({ batch, stateMachine, error });
      throw error;
    }
  }

  async runProject(batches, aiGenerator) {
    const report = { issues: [], batches: [], build: null, runtime: null, pages: [] };
    const stateMachineFake = { 
        fail: async (err) => console.error("Project Phase Failed:", err.message) 
    };

    // 1. Génération et Validation par lots
    for (const batch of batches) {
      try {
         const result = await this.processBatch(batch, aiGenerator);
         report.batches.push({ status: "promoted", id: batch.id });
      } catch (err) {
         return { status: "repair_required", batchId: batch.id, error: err };
      }
    }

    // 2. STAGING RUNTIME TEST (1ère validation)
    try {
      const stagingRuntime = await this.executePhase({
        phase: "staging_runtime",
        batch: { id: "global-project" },
        stateMachine: stateMachineFake,
        operation: () => this.runtimeTest.validateRuntime(["/"])
      });
      if (stagingRuntime.status !== "passed") throw { code: "RUNTIME_FAILED", message: "Staging runtime échoué." };
      report.runtime = { status: "passed" };
    } catch (e) {
      return { status: "repair_required", phase: "staging_runtime", error: e };
    }

    report.build = { status: "executed_passed" };
    report.canPromote = true; 

    // 3. PROMOTION ATOMIQUE
    let promotionResult;
    try {
      promotionResult = await this.promotionManager.promote(report);
    } catch (e) {
      return { status: "blocked", phase: "promotion", error: e };
    }

    // 4. ACTIVE RUNTIME TEST (Double Validation)
    try {
       console.log(`[ORCHESTRATOR] 🔎 Double Validation sur la version active (CURRENT)...`);
       // On doit recréer temporairement un chemin vers le Active pour le test
       const originalPaths = this.workspace.paths;
       this.workspace.paths.workspace = promotionResult.activePath; // Pointing to the new version dir
       
       const activeRuntime = await this.runtimeTest.validateRuntime(["/"]);
       
       // Restore original staging workspace path just in case
       this.workspace.paths.workspace = originalPaths.workspace;

       if (activeRuntime.status !== "passed") {
          throw new Error("Active version failed the runtime smoke test!");
       }
    } catch (e) {
       console.error(`[ORCHESTRATOR] ❌ Echec critique de la release active ! Rollback en cours...`, e);
       await this.promotionManager.rollbackToVersion(promotionResult.versionId);
       return { status: "rolled_back", phase: "active_runtime", error: e };
    }

    return { 
       status: "ready", 
       activeVersion: promotionResult.versionId,
       validation: { stagingRuntime: "passed", activeRuntime: "passed", build: "executed_passed" }
    };
  }
}

module.exports = { ProjectOrchestrator };
