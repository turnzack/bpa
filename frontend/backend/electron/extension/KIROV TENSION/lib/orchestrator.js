/* Orchestrator — 4-layer pipeline core loop
   Intake → Pack → Blind-bag release → Step-by-step + Web inject/capture */

class Orchestrator {
  static async createProject(projectName, projectDescription, options = {}) {
    if (!projectName || !String(projectName).trim()) {
      return { success: false, message: "Le nom du projet est requis." };
    }
    if (!projectDescription || !String(projectDescription).trim()) {
      return { success: false, message: "La description du projet est requise." };
    }

    const folderName =
      options.folderName ||
      String(projectName).trim().replace(/[^a-zA-Z0-9_-]/g, "_");

    const pack = PackBuilder.build(String(projectName).trim(), String(projectDescription).trim(), {
      folderName,
      execMode: options.execMode || "web",
      webAi: options.webAi || "deepseek",
    });

    await PackRegistry.savePack(pack);
    await PackRegistry.setFolderName(folderName);

    // Persist exec preferences
    await chrome.storage.local.set({
      [STORAGE_KEYS.EXEC_MODE]: options.execMode || "web",
      [STORAGE_KEYS.WEB_AI]: options.webAi || "deepseek",
      [STORAGE_KEYS.FOLDER_NAME]: folderName,
    });

    return { success: true, pack, folderName };
  }

  static async getPack() {
    return PackRegistry.getPack();
  }

  static async getCurrentStepInfo() {
    const pack = await PackRegistry.getPack();
    if (!pack) return null;
    const step = PIPELINE_STEPS[pack.state.currentStep];
    const available = await PackRegistry.getAvailableDocuments();
    return {
      step,
      completedSteps: pack.state.completedSteps,
      lockedSteps: pack.state.lockedSteps,
      availableDocuments: available,
      status: pack.state.status,
      totalSteps: PIPELINE_STEPS.length,
      folderName: pack.state.folderName,
      execMode: pack.state.execMode,
      webAi: pack.state.webAi,
      codeFileCount: (pack.state.codeFiles || []).length,
      artifactCount: Object.keys(pack.state.artifacts || {}).length,
    };
  }

  /* ── Provider / API key / models ── */

  static async setApiKey(key, providerId) {
    const provider = providerId || (await CommandRouter.getProviderId());
    await CommandRouter.setApiKey(key, provider);
    return { success: true };
  }

  static async hasApiKey(providerId) {
    const providerObj = providerId ? PROVIDERS[providerId] : await CommandRouter.getProvider();
    const key = await CommandRouter.getApiKey(providerObj.id);
    return providerObj.needsKey ? !!key : true;
  }

  static async setProvider(providerId) {
    if (!PROVIDERS[providerId]) {
      return { success: false, message: `Provider inconnu: ${providerId}` };
    }
    await CommandRouter.setProviderId(providerId);
    return { success: true, provider: PROVIDERS[providerId] };
  }

  static async getProvider() {
    return CommandRouter.getProvider();
  }

  static async getConfigStatus() {
    const provider = await CommandRouter.getProvider();
    const key = await CommandRouter.getApiKey(provider.id);
    const storedModel = await CommandRouter.getModel(provider.id);
    const model =
      storedModel && storedModel.providerId === provider.id
        ? storedModel.model
        : provider.model;
    const execMode = await this.getExecMode();
    const webAi = await this.getWebAi();
    const folderName = await PackRegistry.getFolderName();
    return {
      provider,
      hasKey: !!key,
      ready: provider.needsKey ? !!key : true,
      model,
      execMode,
      webAi,
      folderName,
    };
  }

  static async detectModels() {
    const provider = await CommandRouter.getProvider();
    const apiKey = await CommandRouter.getApiKey(provider.id);
    const result = await CommandRouter.listModels(provider.id, apiKey);
    if (!result.success) return result;

    const storedModelObj = await CommandRouter.getModel(provider.id);
    const existingModel = storedModelObj ? storedModelObj.model : null;

    let selected = null;
    if (existingModel && result.models.some((m) => m.id === existingModel)) {
      selected = existingModel;
    } else {
      const prefs = MODEL_PREFERENCES[provider.id] || [];
      for (const pref of prefs) {
        const found = result.models.find((m) => m.id === pref || m.id.startsWith(pref));
        if (found) {
          selected = found.id;
          break;
        }
      }
      if (!selected && result.models.length > 0) {
        const flash = result.models.find((m) => /flash/i.test(m.id));
        selected = flash ? flash.id : result.models[0].id;
      }
    }

    if (selected) await CommandRouter.setModel(selected, provider.id);
    return {
      success: true,
      models: result.models,
      selectedModel: selected,
      provider,
      warning: result.warning,
    };
  }

  static async setModel(model, providerId) {
    const providerObj = providerId ? PROVIDERS[providerId] : await CommandRouter.getProvider();
    await CommandRouter.setModel(model, providerObj.id);
    return { success: true, model, provider: providerObj };
  }

  static async getModel(providerId) {
    const providerObj = providerId ? PROVIDERS[providerId] : await CommandRouter.getProvider();
    const stored = await CommandRouter.getModel(providerObj.id);
    const model =
      stored && stored.providerId === providerObj.id ? stored.model : providerObj.model;
    return { success: true, model, provider: providerObj };
  }

  static async getExecMode() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.EXEC_MODE], (r) => {
        resolve(r[STORAGE_KEYS.EXEC_MODE] || "web");
      });
    });
  }

  static async setExecMode(mode) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.EXEC_MODE]: mode }, resolve);
    });
  }

  static async getWebAi() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.WEB_AI], (r) => {
        resolve(r[STORAGE_KEYS.WEB_AI] || "deepseek");
      });
    });
  }

  static async setWebAi(id) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEYS.WEB_AI]: id }, resolve);
    });
  }

  /* ── Run current step ── */

  static async runCurrentStep(options = {}) {
    const pack = await PackRegistry.getPack();
    if (!pack) return { success: false, message: "Aucun projet actif." };

    const step = PIPELINE_STEPS[pack.state.currentStep];
    if (!step) return { success: false, message: "Étape invalide." };

    // Finalize → write to disk
    if (step.order === "finalize") {
      const result = await ArtifactWriter.writeAll({
        folderName: pack.state.folderName,
        saveAs: !!options.saveAs,
      });
      if (result.success) {
        await PackRegistry.markStepCompleted(step.id);
      }
      return {
        success: result.success,
        message: result.message,
        step,
        results: result.results,
        finalized: true,
        folderName: result.folderName,
      };
    }

    // Gatekeeper
    const access = await Gatekeeper.checkAccess(step.order, step.document);
    if (!access.allowed) {
      return {
        success: false,
        message: access.message,
        step,
        errorResponse: Gatekeeper.buildErrorResponse(
          access.errorType,
          access.message,
          access.availableDocuments
        ),
      };
    }

    await PackRegistry.logAccess({
      action: step.order,
      document: step.document,
      stepId: step.id,
      granted: true,
    });

    const execMode = options.execMode || pack.state.execMode || (await this.getExecMode());

    // WEB mode: inject into chat tab + capture
    if (execMode === "web" || (execMode === "hybrid" && step.order === "codegen")) {
      return await this.runStepViaWeb(pack, step, options);
    }

    // API mode
    return await this.runStepViaApi(pack, step);
  }

  static async runStepViaApi(pack, step) {
    const documentContent = step.document ? pack.documents[step.document] || "" : "";
    // Enrich create steps with previous artifacts
    let enriched = documentContent;
    if (step.order === "create" || step.order === "codegen") {
      const prev = Object.entries(pack.state.artifacts || {})
        .map(([k, v]) => `### ${k}\n${(v || "").slice(0, 2000)}`)
        .join("\n\n");
      if (prev) enriched = `${documentContent}\n\n--- Previous artifacts ---\n${prev}`;
    }

    const history = this.buildConversationHistory(pack);
    const llmResponse = await CommandRouter.sendCommand(
      step.order,
      step.document,
      enriched,
      history
    );

    if (llmResponse.status === "error") {
      await PackRegistry.logAccess({
        action: step.order,
        document: step.document,
        stepId: step.id,
        granted: true,
        result: "error",
        error: llmResponse.message,
      });
      return {
        success: false,
        message: llmResponse.message || "Erreur LLM",
        step,
        llmResponse,
      };
    }

    return await this.persistStepResult(pack, step, llmResponse);
  }

  static async runStepViaWeb(pack, step, options = {}) {
    const webAi = options.webAi || pack.state.webAi || (await this.getWebAi());
    const target = WEB_AI_TARGETS[webAi] || WEB_AI_TARGETS.deepseek;

    const documentContent = step.document ? pack.documents[step.document] || "" : "";
    // Enrich with previous artifacts for context
    let contextContent = documentContent;
    if (step.order === "create" || step.order === "codegen") {
      const arts = pack.state.artifacts || {};
      const prev = Object.entries(arts)
        .map(([k, v]) => `### ${k}\n${(v || "").slice(0, 2500)}`)
        .join("\n\n");
      if (prev) contextContent = `${documentContent}\n\n--- Specs précédentes ---\n${prev}`;
    }

    const prompt = CommandRouter.buildWebPrompt(step.order, step.document, contextContent, pack);

    // Ensure AI tab is open
    const tabId = await this.ensureWebAiTab(target);
    if (!tabId) {
      return {
        success: false,
        message: `Impossible d'ouvrir l'onglet ${target.label}. Ouvrez ${target.url} manuellement.`,
        step,
      };
    }

    // Wait for content script ready
    await this.sleep(1500);

    // Send inject+capture command to content script
    let captureResult;
    try {
      captureResult = await this.sendToTab(tabId, {
        type: "KIROV_INJECT_AND_CAPTURE",
        prompt,
        stepId: step.id,
        action: step.order,
        document: step.document,
        minLength: step.order === "codegen" ? 500 : 200,
        minFiles: step.order === "codegen" ? 2 : 0,
        timeout: CAPTURE_CONFIG.TIMEOUT,
      });
    } catch (err) {
      return {
        success: false,
        message: `Injection échouée: ${err.message}. Rechargez l'onglet ${target.label} et réessayez.`,
        step,
      };
    }

    if (!captureResult || !captureResult.success) {
      return {
        success: false,
        message: captureResult?.message || "Capture échouée — aucune réponse.",
        step,
        captureResult,
      };
    }

    const captured = captureResult.content || "";
    // Parse into structured response
    const llmResponse = CommandRouter.parseAssistantResponse(captured, step.document || "CODE");

    if (llmResponse.status === "error" && captured.length >= 50) {
      // Accept raw capture as content
      llmResponse.status = "ok";
      llmResponse.content = captured;
      llmResponse.ready = true;
      llmResponse.document = step.document || "CODE";
    }

    if (llmResponse.status === "error") {
      return {
        success: false,
        message: llmResponse.message || "Réponse non valide",
        step,
        llmResponse,
        raw: captured.slice(0, 300),
      };
    }

    return await this.persistStepResult(pack, step, llmResponse);
  }

  static async runDirectWebAction(prompt, webAi = "deepseek") {
    const target = WEB_AI_TARGETS[webAi] || WEB_AI_TARGETS.deepseek;
    const tabId = await this.ensureWebAiTab(target);
    if (!tabId) {
      return { success: false, message: `Impossible d'ouvrir l'onglet ${target.label}.` };
    }

    await this.sleep(2000);

    try {
      const captureResult = await this.sendToTab(tabId, {
        type: "KIROV_INJECT_AND_CAPTURE",
        prompt,
        targetAi: webAi,
        minLength: 500,
        timeout: CAPTURE_CONFIG.TIMEOUT,
      });

      if (!captureResult || !captureResult.success) {
        return { success: false, message: captureResult?.message || "Capture échouée" };
      }

      const captured = captureResult.content || "";
      const files = ArtifactWriter.parseCodeFiles(captured);
      
      return { success: true, content: captured, files };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  static async persistStepResult(pack, step, llmResponse) {
    const validation = this.validateArtifact(step, llmResponse);
    if (!validation.valid) {
      await PackRegistry.logAccess({
        action: step.order,
        document: step.document,
        stepId: step.id,
        granted: true,
        result: "validation_failed",
        error: validation.message,
      });
      return {
        success: false,
        message: `Validation échouée: ${validation.message}`,
        step,
        llmResponse,
        validationError: validation.message,
      };
    }

    const artifactContent = llmResponse.content || "";

    if (step.order === "codegen") {
      const files = ArtifactWriter.parseCodeFiles(artifactContent);
      if (files.length) {
        // Apply known fixes
        const fixed = this.applyKnownFixes(files);
        await PackRegistry.storeCodeFiles(fixed);
        await PackRegistry.storeArtifact("CODE_GENERATION.json", JSON.stringify({ files: fixed }, null, 2));
      } else {
        await PackRegistry.storeArtifact("CODE_GENERATION.raw.md", artifactContent);
      }
    } else if (step.document) {
      await PackRegistry.storeArtifact(step.document, artifactContent);
    }

    await PackRegistry.markStepCompleted(step.id);
    await PackRegistry.logAccess({
      action: step.order,
      document: step.document,
      stepId: step.id,
      granted: true,
      result: "success",
    });

    const codeFiles = step.order === "codegen" ? ArtifactWriter.parseCodeFiles(artifactContent) : [];

    return {
      success: true,
      step,
      artifact: artifactContent,
      llmResponse,
      codeFileCount: codeFiles.length,
    };
  }

  /* ── Advance ── */

  static async advanceStep() {
    const pack = await PackRegistry.getPack();
    if (!pack) return { success: false, message: "Aucun projet actif." };

    const currentStep = PIPELINE_STEPS[pack.state.currentStep];
    if (!pack.state.completedSteps.includes(currentStep.id)) {
      return {
        success: false,
        message: `L'étape (${currentStep.label}) doit être terminée avant d'avancer.`,
      };
    }

    const nextStepId = pack.state.currentStep + 1;
    if (nextStepId >= PIPELINE_STEPS.length) {
      return { success: false, message: "Déjà à la dernière étape." };
    }

    await PackRegistry.setCurrentStep(nextStepId);
    return { success: true, nextStep: PIPELINE_STEPS[nextStepId] };
  }

  /* ── Full pipeline ── */

  static async runFullPipeline(onProgress, options = {}) {
    const pack = await PackRegistry.getPack();
    if (!pack) return { success: false, message: "Aucun projet actif." };

    await chrome.storage.local.set({ [STORAGE_KEYS.PIPELINE_RUNNING]: true });

    const results = [];
    let safety = 0;
    const MAX_RETRIES = 2;

    try {
      while (pack.state.currentStep < PIPELINE_STEPS.length && safety < 60) {
        safety++;
        const fresh = await PackRegistry.getPack();
        if (!fresh) break;
        pack.state = fresh.state;

        const step = PIPELINE_STEPS[pack.state.currentStep];
        if (onProgress) {
          onProgress({
            step,
            stepIndex: pack.state.currentStep,
            totalSteps: PIPELINE_STEPS.length,
            phase: "running",
          });
        }

        // Skip already completed
        if (pack.state.completedSteps.includes(step.id) && step.order !== "finalize") {
          const adv = await this.advanceStep();
          if (!adv.success) break;
          pack.state = (await PackRegistry.getPack()).state;
          continue;
        }

        let result = await this.runCurrentStep(options);
        let retries = 0;
        while (!result.success && retries < MAX_RETRIES && !result.finalized) {
          retries++;
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "retry",
              retryCount: retries,
              message: result.message,
            });
          }
          await this.sleep(2000);
          result = await this.runCurrentStep(options);
        }

        results.push({ step, result, retries });

        if (!result.success) {
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "failed",
              message: result.message,
            });
          }
          return {
            success: false,
            message: `Pipeline stoppé à l'étape ${pack.state.currentStep} (${step.label}): ${result.message}`,
            results,
          };
        }

        if (result.finalized) {
          if (onProgress) {
            onProgress({
              step,
              stepIndex: pack.state.currentStep,
              totalSteps: PIPELINE_STEPS.length,
              phase: "complete",
            });
          }
          return { success: true, results, finalized: true, folderName: result.folderName };
        }

        const adv = await this.advanceStep();
        if (!adv.success) {
          return { success: false, message: adv.message, results };
        }
        pack.state = (await PackRegistry.getPack()).state;

        // Brief pause between steps
        await this.sleep(800);
      }

      return { success: true, results };
    } finally {
      await chrome.storage.local.set({ [STORAGE_KEYS.PIPELINE_RUNNING]: false });
    }
  }

  /* ── Helpers ── */

  static buildConversationHistory(pack) {
    const history = [];
    for (const stepId of pack.state.completedSteps) {
      const step = PIPELINE_STEPS[stepId];
      if (!step || !step.document) continue;
      const artifact = pack.state.artifacts[step.document];
      if (!artifact) continue;
      history.push({
        role: "user",
        content: JSON.stringify({ action: step.order, document: step.document }),
      });
      history.push({
        role: "assistant",
        content: JSON.stringify({
          status: "ok",
          document: step.document,
          content: artifact.slice(0, 4000),
          ready: true,
        }),
      });
    }
    return history;
  }

  static validateArtifact(step, llmResponse) {
    if (!llmResponse || llmResponse.status !== "ok") {
      return { valid: false, message: "Status LLM n'est pas 'ok'." };
    }
    const content = llmResponse.content || "";
    if (!content || !content.trim()) {
      return { valid: false, message: "Contenu d'artifact vide." };
    }
    if (content.trim().length < 40) {
      return { valid: false, message: "Contenu trop court pour être significatif." };
    }
    if (step.order === "codegen") {
      const files = ArtifactWriter.parseCodeFiles(content);
      if (!files.length && !content.includes("path")) {
        // Accept if long enough raw content
        if (content.length < 200) {
          return { valid: false, message: "Aucun fichier code détecté dans la réponse." };
        }
      }
      return { valid: true };
    }
    if (step.document && step.document.endsWith(".md")) {
      if (!/^#{1,6}\s/m.test(content) && content.length < 100) {
        return { valid: false, message: "Markdown doit contenir au moins un titre." };
      }
    }
    if (step.document && step.document.endsWith(".yaml")) {
      if (!/^[a-zA-Z0-9_-]+:/m.test(content) && content.length < 80) {
        return { valid: false, message: "YAML doit contenir des paires clé-valeur." };
      }
    }
    return { valid: true };
  }

  static applyKnownFixes(files) {
    const fixed = [];
    const seen = new Set();
    const FORBIDDEN = new Set(["package.js", "tsconfig.js", "tsconfig.node.js", "App.ts", "main.js"]);
    for (const file of files) {
      let path = file.path;
      let content = file.content || "";
      const basename = (path || "").split("/").pop() || path;
      if (basename === "Index.html") path = path.replace(/Index\.html$/, "index.html");
      if (basename === "package.js" && String(content).trim().startsWith("{")) {
        path = path.replace(/package\.js$/, "package.json");
      }
      if (basename === "App.ts" && /<[A-Z]|<div|<span/i.test(content)) {
        path = path.replace(/App\.ts$/, "App.tsx");
      }
      if (path.endsWith(".vue")) continue;
      if (FORBIDDEN.has(basename)) continue;
      const firstLine = String(content).split("\n")[0] || "";
      if (/^(html|javascript|typescript|tsx|jsx|css)\s*$/i.test(firstLine.trim())) {
        content = String(content).split("\n").slice(1).join("\n");
      }
      if ((path.endsWith(".tsx") || path.endsWith(".jsx")) && content.includes("BrowserRouter")) {
        content = content.replace(/BrowserRouter/g, "HashRouter");
      }
      if (path === "package.json" || path.endsWith("/package.json")) {
        try {
          const pkg = JSON.parse(content);
          if (pkg.type !== "module") pkg.type = "module";
          if (!pkg.scripts) pkg.scripts = {};
          if (!pkg.scripts.build || String(pkg.scripts.build).includes("tsc")) {
            pkg.scripts.build = "vite build";
          }
          content = JSON.stringify(pkg, null, 2);
        } catch (_) {}
      }
      if (!seen.has(path)) {
        seen.add(path);
        fixed.push({ ...file, path, content });
      }
    }
    return fixed;
  }

  static async ensureWebAiTab(target) {
    return new Promise((resolve) => {
      chrome.tabs.query({ url: target.match }, (tabs) => {
        if (tabs && tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true }, (tab) => {
            resolve(tab?.id || tabs[0].id);
          });
        } else {
          chrome.tabs.create({ url: target.url, active: true }, (tab) => {
            // Wait for load
            const listener = (tabId, info) => {
              if (tabId === tab.id && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve(tab.id);
              }
            };
            chrome.tabs.onUpdated.addListener(listener);
            // Fallback timeout
            setTimeout(() => {
              chrome.tabs.onUpdated.removeListener(listener);
              resolve(tab?.id || null);
            }, 15000);
          });
        }
      });
    });
  }

  static sendToTab(tabId, message) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout content script (pas de réponse)"));
      }, (message.timeout || 300000) + 10000);

      chrome.tabs.sendMessage(tabId, message, (response) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          // Try inject content script then retry once
          chrome.scripting.executeScript(
            { target: { tabId }, files: ["content.js"] },
            () => {
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, message, (resp2) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                  } else {
                    resolve(resp2);
                  }
                });
              }, 1000);
            }
          );
        } else {
          resolve(response);
        }
      });
    });
  }

  static async resetProject() {
    await PackRegistry.clearPack();
    return { success: true };
  }

  static sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
