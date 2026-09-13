/* KIROV3 Orchestrator — Popup UI */

const PIPELINE_STEPS_UI = [
  { id: 0, label: "Métadonnées projet", doc: "00_PROJECT_META.md", phase: "intake" },
  { id: 1, label: "Exigences produit (PRD)", doc: "01_PRD.md", phase: "spec" },
  { id: 2, label: "Architecture technique", doc: "02_ARCHITECTURE.md", phase: "spec" },
  { id: 3, label: "Définition des skills", doc: "03_SKILLS.yaml", phase: "spec" },
  { id: 4, label: "Découpage des tâches", doc: "04_TASKS.md", phase: "plan" },
  { id: 5, label: "Arborescence fichiers", doc: "05_FILE_TREE.md", phase: "plan" },
  { id: 6, label: "Workflow des prompts", doc: "06_PROMPT_WORKFLOW.md", phase: "plan" },
  { id: 7, label: "Règles de validation", doc: "07_VALIDATION_RULES.md", phase: "gate" },
  { id: 8, label: "Ordres d'exécution", doc: "08_ORDERS.md", phase: "gate" },
  { id: 9, label: "Génération du code", doc: null, phase: "code" },
  { id: 10, label: "Écriture disque", doc: null, phase: "write" },
];

const PROVIDERS_UI = {
  deepseek: { label: "DeepSeek", apiKeyLabel: "Clé API DeepSeek", placeholder: "sk-...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  openai: { label: "OpenAI (GPT)", apiKeyLabel: "Clé API OpenAI", placeholder: "sk-...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  claude: { label: "Claude (Anthropic)", apiKeyLabel: "Clé API Anthropic", placeholder: "sk-ant-...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  gemini: { label: "Gemini (Google)", apiKeyLabel: "Clé API Google AI", placeholder: "AIza...", needsKey: true, hint: "Clé stockée localement. Auto-détecte gemini-2.5-flash, etc." },
  mistral: { label: "Mistral AI", apiKeyLabel: "Clé API Mistral", placeholder: "...", needsKey: true, hint: "Clé stockée localement dans le navigateur." },
  gemma: { label: "Gemma 2 (Local)", apiKeyLabel: "Clé locale (optionnel)", placeholder: "ollama (laisser vide)", needsKey: false, hint: "Ollama local (ollama serve + ollama pull gemma2). Aucune clé requise." },
};

const $ = (id) => document.getElementById(id);

const els = {
  settingsToggle: $("settingsToggle"),
  settingsPanel: $("settingsPanel"),
  statusDot: $("statusDot"),
  statusText: $("statusText"),
  modeBadge: $("modeBadge"),

  execModeGrid: $("execModeGrid"),
  webAiGroup: $("webAiGroup"),
  webAiSelect: $("webAiSelect"),
  openWebAiBtn: $("openWebAiBtn"),
  apiProviderGroup: $("apiProviderGroup"),
  providerSelect: $("providerSelect"),
  apiKeyGroup: $("apiKeyGroup"),
  apiKeyLabel: $("apiKeyLabel"),
  apiKeyInput: $("apiKeyInput"),
  apiKeyHint: $("apiKeyHint"),
  toggleKeyBtn: $("toggleKeyBtn"),
  saveApiKey: $("saveApiKey"),
  saveFeedback: $("saveFeedback"),
  modelGroup: $("modelGroup"),
  modelSelect: $("modelSelect"),
  refreshModels: $("refreshModels"),
  modelHint: $("modelHint"),

  noProjectView: $("noProjectView"),
  projectView: $("projectView"),
  projectName: $("projectName"),
  projectDescription: $("projectDescription"),
  folderName: $("folderName"),
  pickFolderBtn: $("pickFolderBtn"),
  createProjectBtn: $("createProjectBtn"),

  activeProjectName: $("activeProjectName"),
  activeProjectDesc: $("activeProjectDesc"),
  activeFolderName: $("activeFolderName"),
  stepCounter: $("stepCounter"),
  progressFill: $("progressFill"),
  stepList: $("stepList"),
  currentStepPanel: $("currentStepPanel"),
  currentStepLabel: $("currentStepLabel"),
  currentStepDoc: $("currentStepDoc"),
  stepStatus: $("stepStatus"),
  artifactPreview: $("artifactPreview"),
  artifactContent: $("artifactContent"),

  runStepBtn: $("runStepBtn"),
  advanceBtn: $("advanceBtn"),
  runAllBtn: $("runAllBtn"),
  writeArtifactsBtn: $("writeArtifactsBtn"),
  openAiTabBtn: $("openAiTabBtn"),
  logContainer: $("logContainer"),
  clearLog: $("clearLog"),
  resetBtn: $("resetBtn"),

  // Tabs
  tabBtns: document.querySelectorAll(".tab-btn"),
  tabContents: document.querySelectorAll(".tab-content"),

  // Inject
  injectPrompt: $("injectPrompt"),
  injectSilence: $("injectSilence"),
  btnInjectOnly: $("btnInjectOnly"),
  btnInjectCapture: $("btnInjectCapture"),
  injectLog: $("injectLog"),

  // GitHub
  githubToken: $("githubToken"),
  githubRepo: $("githubRepo"),
  saveGithubBtn: $("saveGithubBtn"),
  pushFilesBtn: $("pushFilesBtn"),

  folderModal: $("folderModal"),
  folderModalBackdrop: $("folderModalBackdrop"),
  modalFolderName: $("modalFolderName"),
  modalPathPreview: $("modalPathPreview"),
  modalCancelBtn: $("modalCancelBtn"),
  modalConfirmBtn: $("modalConfirmBtn"),
};

let currentExecMode = "web";
let pendingCreate = null; // { name, desc } waiting for folder confirm

/* ── Helpers ── */

function sendMessage(message) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, message: chrome.runtime.lastError.message });
        } else {
          resolve(response || { success: false, message: "No response" });
        }
      });
    } catch (e) {
      resolve({ success: false, message: e.message });
    }
  });
}

function addLog(message, type = "info", container = els.logContainer) {
  if (!container) return;
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

function setStatus(text, state = "online") {
  els.statusText.textContent = text;
  els.statusDot.className = `dot ${state}`;
}

function setButtonLoading(btn, loading, originalText) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<span class="loading"></span> ...';
    btn.disabled = true;
  } else {
    btn.textContent = originalText || btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}

function showStepStatus(message, type) {
  els.stepStatus.className = `step-status ${type}`;
  els.stepStatus.textContent = message;
  els.stepStatus.classList.remove("hidden");
}

function hideStepStatus() {
  els.stepStatus.classList.add("hidden");
}

function showArtifact(content) {
  const preview = String(content || "").slice(0, 2000);
  els.artifactContent.textContent = preview + (content && content.length > 2000 ? "\n…" : "");
  els.artifactPreview.classList.remove("hidden");
}

function hideArtifact() {
  els.artifactPreview.classList.add("hidden");
}

function slugify(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "kirov_project";
}

/* ── Exec mode UI ── */

function setExecModeUI(mode) {
  currentExecMode = mode || "web";
  els.modeBadge.textContent = currentExecMode.toUpperCase();
  els.execModeGrid.querySelectorAll(".mode-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.mode === currentExecMode);
  });
  // Web targets visible for web/hybrid
  const showWeb = currentExecMode === "web" || currentExecMode === "hybrid";
  const showApi = currentExecMode === "api" || currentExecMode === "hybrid";
  els.webAiGroup.classList.toggle("hidden", !showWeb);
  els.apiProviderGroup.classList.toggle("hidden", !showApi);
  els.apiKeyGroup.classList.toggle("hidden", !showApi);
  els.modelGroup.classList.toggle("hidden", !showApi);
}

/* ── Provider / models ── */

function updateProviderUI(providerId) {
  const p = PROVIDERS_UI[providerId];
  if (!p) return;
  els.apiKeyLabel.textContent = p.apiKeyLabel;
  els.apiKeyInput.placeholder = p.placeholder;
  els.apiKeyHint.textContent = p.hint;
  els.apiKeyInput.parentElement.style.opacity = p.needsKey ? "1" : "0.65";
}

function populateModelSelect(models, selectedModel) {
  els.modelSelect.innerHTML = "";
  if (!models || !models.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Aucun modèle trouvé";
    els.modelSelect.appendChild(opt);
    els.modelSelect.disabled = true;
    return;
  }
  for (const m of models) {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label || m.id;
    if (m.id === selectedModel) opt.selected = true;
    els.modelSelect.appendChild(opt);
  }
  els.modelSelect.disabled = false;
  els.refreshModels.disabled = false;
}

async function loadAndDetectModels(providerId) {
  const modelResp = await sendMessage({ type: "GET_MODEL", providerId });
  const savedModel = modelResp.success ? modelResp.model : null;
  const detectResp = await sendMessage({ type: "DETECT_MODELS" });
  if (detectResp.success && detectResp.models?.length) {
    populateModelSelect(detectResp.models, detectResp.selectedModel || savedModel);
    if (detectResp.warning) addLog(detectResp.warning, "warning");
  } else if (savedModel) {
    populateModelSelect([{ id: savedModel, label: savedModel }], savedModel);
  } else {
    const defaults = {
      gemini: [
        { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
        { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
        { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
        { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
      ],
      deepseek: [
        { id: "deepseek-chat", label: "DeepSeek Chat" },
        { id: "deepseek-coder", label: "DeepSeek Coder" },
      ],
      openai: [
        { id: "gpt-4o", label: "GPT-4o" },
        { id: "gpt-4o-mini", label: "GPT-4o Mini" },
      ],
      claude: [
        { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
        { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
      ],
      mistral: [{ id: "mistral-large-latest", label: "Mistral Large" }],
      gemma: [
        { id: "gemma2", label: "Gemma 2" },
        { id: "gemma2:9b", label: "Gemma 2 9B" },
      ],
    };
    const list = defaults[providerId] || [];
    populateModelSelect(list, list[0]?.id || "");
  }
}

/* ── Pipeline render ── */

function renderPipeline(stepInfo) {
  if (!stepInfo) {
    els.stepCounter.textContent = "Étape 0/0";
    els.stepList.innerHTML = "";
    els.progressFill.style.width = "0%";
    return;
  }

  const currentId = stepInfo.step ? stepInfo.step.id : 0;
  const total = stepInfo.totalSteps || PIPELINE_STEPS_UI.length;
  const done = (stepInfo.completedSteps || []).length;
  els.stepCounter.textContent = `Étape ${currentId + 1}/${total}`;
  els.progressFill.style.width = `${Math.round((done / total) * 100)}%`;

  els.stepList.innerHTML = "";
  for (const step of PIPELINE_STEPS_UI) {
    const item = document.createElement("div");
    let cls = "step-item";
    let icon = "○";
    if ((stepInfo.completedSteps || []).includes(step.id)) {
      cls += " completed";
      icon = "✓";
    } else if (step.id === currentId) {
      cls += " current";
      icon = "▶";
    } else {
      cls += " pending";
    }
    item.className = cls;
    item.innerHTML = `<span class="step-icon">${icon}</span><span>${step.label}</span><span class="step-phase">${step.phase}</span>`;
    els.stepList.appendChild(item);
  }

  if (stepInfo.step) {
    els.currentStepLabel.textContent = stepInfo.step.label;
    els.currentStepDoc.textContent = stepInfo.step.document || `(${stepInfo.step.order})`;
    els.currentStepPanel.classList.remove("hidden");
  }

  const currentCompleted = (stepInfo.completedSteps || []).includes(currentId);
  els.runStepBtn.disabled = currentCompleted && stepInfo.step?.order !== "finalize";
  els.advanceBtn.disabled = !currentCompleted || currentId >= total - 1;

  if (stepInfo.status === "complete" || done >= total - 1) {
    els.writeArtifactsBtn.classList.remove("hidden");
  }
}

async function refreshProjectView() {
  const response = await sendMessage({ type: "GET_PACK" });
  if (!response.success || !response.pack) {
    els.noProjectView.classList.remove("hidden");
    els.projectView.classList.add("hidden");
    setStatus("Prêt — créez un projet", "online");
    return;
  }

  els.noProjectView.classList.add("hidden");
  els.projectView.classList.remove("hidden");

  const pack = response.pack;
  els.activeProjectName.textContent = pack.projectName;
  els.activeProjectDesc.textContent = pack.projectDescription;
  els.activeFolderName.textContent = pack.state?.folderName || "—";

  if (pack.state?.execMode) setExecModeUI(pack.state.execMode);
  if (pack.state?.webAi) els.webAiSelect.value = pack.state.webAi;

  const stepResponse = await sendMessage({ type: "GET_STEP_INFO" });
  if (stepResponse.success) renderPipeline(stepResponse.stepInfo);

  const currentStep = stepResponse.stepInfo?.step;
  if (currentStep?.document && pack.state.artifacts?.[currentStep.document]) {
    showArtifact(pack.state.artifacts[currentStep.document]);
  } else if (pack.state.codeFiles?.length) {
    showArtifact(JSON.stringify({ files: pack.state.codeFiles.slice(0, 3).map((f) => f.path) }, null, 2));
  } else {
    hideArtifact();
  }

  if (pack.state.status === "complete") {
    showStepStatus("Pipeline terminé. Fichiers prêts sur le disque.", "success");
    setStatus("Terminé ✅", "online");
  } else {
    setStatus(`Projet actif — étape ${(pack.state.currentStep || 0) + 1}`, "online");
  }
}

/* ── Folder modal ── */

function openFolderModal(defaultName) {
  els.modalFolderName.value = defaultName || slugify(els.projectName.value);
  els.modalPathPreview.textContent = els.modalFolderName.value || "mon_projet";
  els.folderModal.classList.remove("hidden");
  els.modalFolderName.focus();
  els.modalFolderName.select();
}

function closeFolderModal() {
  els.folderModal.classList.add("hidden");
  pendingCreate = null;
}

async function confirmCreateWithFolder() {
  const folder = slugify(els.modalFolderName.value || els.projectName.value);
  if (!folder) {
    addLog("Nom de dossier invalide.", "error");
    return;
  }
  const name = pendingCreate?.name || els.projectName.value.trim();
  const desc = pendingCreate?.desc || els.projectDescription.value.trim();
  if (!name || !desc) {
    closeFolderModal();
    return;
  }

  // For web mode, ensure AI tab exists
  if (currentExecMode === "web" || currentExecMode === "hybrid") {
    // ok — orchestrator opens tab when needed
  } else {
    const hasKey = await sendMessage({ type: "HAS_API_KEY", providerId: els.providerSelect.value });
    if (!hasKey.hasApiKey) {
      addLog("Configurez votre clé API d'abord (mode API).", "warning");
      els.settingsPanel.classList.remove("hidden");
      closeFolderModal();
      return;
    }
  }

  setButtonLoading(els.modalConfirmBtn, true);
  setStatus("Création du pack…", "busy");

  const response = await sendMessage({
    type: "CREATE_PROJECT",
    projectName: name,
    projectDescription: desc,
    folderName: folder,
    execMode: currentExecMode,
    webAi: els.webAiSelect.value,
  });

  setButtonLoading(els.modalConfirmBtn, false, "Confirmer & Créer");
  closeFolderModal();

  if (response.success) {
    addLog(`Projet « ${name} » créé. Dossier: Downloads/${folder}/`, "success");
    addLog("Pack d'instructions généré (pochette surprise). DeepSeek ne le voit pas en entier.", "info");
    els.folderName.value = folder;
    await refreshProjectView();

    // Auto-open AI tab in web mode
    if (currentExecMode === "web" || currentExecMode === "hybrid") {
      await sendMessage({ type: "OPEN_WEB_AI", webAi: els.webAiSelect.value });
      addLog(`Onglet ${els.webAiSelect.selectedOptions[0]?.text || "IA"} ouvert pour injection.`, "info");
    }
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
    setStatus("Erreur création", "offline");
  }
}

/* ── Events ── */

els.settingsToggle.addEventListener("click", () => {
  els.settingsPanel.classList.toggle("hidden");
});

els.execModeGrid.addEventListener("click", async (e) => {
  const card = e.target.closest(".mode-card");
  if (!card) return;
  setExecModeUI(card.dataset.mode);
  await sendMessage({ type: "SET_EXEC_MODE", mode: currentExecMode });
  addLog(`Mode d'exécution: ${currentExecMode}`, "info");
});

els.webAiSelect.addEventListener("change", async () => {
  await sendMessage({ type: "SET_WEB_AI", webAi: els.webAiSelect.value });
  addLog(`Assistant web: ${els.webAiSelect.selectedOptions[0].text}`, "info");
});

els.openWebAiBtn.addEventListener("click", async () => {
  const r = await sendMessage({ type: "OPEN_WEB_AI", webAi: els.webAiSelect.value });
  if (r.success) addLog("Onglet IA ouvert.", "success");
  else addLog("Impossible d'ouvrir l'onglet: " + (r.message || ""), "error");
});

els.openAiTabBtn?.addEventListener("click", async () => {
  const r = await sendMessage({ type: "OPEN_WEB_AI", webAi: els.webAiSelect.value });
  addLog(r.success ? "Onglet IA ouvert." : "Échec ouverture onglet", r.success ? "success" : "error");
});

if (els.toggleKeyBtn) {
  els.toggleKeyBtn.addEventListener("click", () => {
    if (els.apiKeyInput.type === "password") {
      els.apiKeyInput.type = "text";
      els.toggleKeyBtn.textContent = "🙈";
    } else {
      els.apiKeyInput.type = "password";
      els.toggleKeyBtn.textContent = "👁";
    }
  });
}

els.saveApiKey.addEventListener("click", async () => {
  const key = els.apiKeyInput.value.trim();
  const providerId = els.providerSelect.value;
  const provider = PROVIDERS_UI[providerId];
  if (provider.needsKey && !key) {
    addLog("Veuillez entrer une clé API.", "error");
    return;
  }
  setButtonLoading(els.saveApiKey, true);
  await sendMessage({ type: "SET_PROVIDER", providerId });
  const response = await sendMessage({ type: "SET_API_KEY", apiKey: key, providerId });
  if (response.success) {
    addLog(`${provider.label} — clé enregistrée.`, "success");
    els.saveFeedback.classList.remove("hidden");
    addLog("Détection automatique des modèles…", "info");
    const detectResp = await sendMessage({ type: "DETECT_MODELS", providerId, apiKey: key });
    if (detectResp.success && detectResp.models) {
      populateModelSelect(detectResp.models, detectResp.selectedModel);
      addLog(`${detectResp.models.length} modèles. Sélectionné: ${detectResp.selectedModel}`, "success");
      if (detectResp.warning) addLog(detectResp.warning, "warning");
    } else {
      addLog("Détection échouée: " + (detectResp.message || "erreur"), "warning");
      await loadAndDetectModels(providerId);
    }
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
  }
  setButtonLoading(els.saveApiKey, false, "💾 Enregistrer + Détecter");
});

els.providerSelect.addEventListener("change", async () => {
  const providerId = els.providerSelect.value;
  updateProviderUI(providerId);
  await sendMessage({ type: "SET_PROVIDER", providerId });
  const keyResp = await sendMessage({ type: "GET_API_KEY", providerId });
  if (keyResp.success && keyResp.apiKey) {
    els.apiKeyInput.value = keyResp.apiKey;
    els.saveFeedback.classList.remove("hidden");
  } else {
    els.apiKeyInput.value = "";
    els.saveFeedback.classList.add("hidden");
  }
  await loadAndDetectModels(providerId);
});

els.refreshModels.addEventListener("click", async () => {
  els.refreshModels.disabled = true;
  els.refreshModels.textContent = "…";
  addLog("Rafraîchissement des modèles…", "info");
  const resp = await sendMessage({ type: "DETECT_MODELS" });
  els.refreshModels.disabled = false;
  els.refreshModels.textContent = "🔄";
  if (resp.success && resp.models) {
    populateModelSelect(resp.models, resp.selectedModel);
    addLog(`${resp.models.length} modèles. Sélectionné: ${resp.selectedModel}`, "success");
  } else {
    addLog("Détection échouée: " + (resp.message || "erreur"), "error");
  }
});

els.modelSelect.addEventListener("change", async () => {
  const model = els.modelSelect.value;
  if (!model) return;
  const resp = await sendMessage({
    type: "SET_MODEL",
    model,
    providerId: els.providerSelect.value,
  });
  addLog(resp.success ? `Modèle: ${model}` : "Erreur modèle", resp.success ? "success" : "error");
});

function validateCreateForm() {
  const name = els.projectName.value.trim();
  const desc = els.projectDescription.value.trim();
  els.createProjectBtn.disabled = !(name && desc);
  if (name && !els.folderName.value) {
    els.folderName.placeholder = slugify(name);
  }
}

els.projectName.addEventListener("input", validateCreateForm);
els.projectDescription.addEventListener("input", validateCreateForm);

let folderModalMode = "create"; // "create" | "pick"

els.pickFolderBtn.addEventListener("click", () => {
  folderModalMode = "pick";
  pendingCreate = null;
  const suggested = els.folderName.value || slugify(els.projectName.value) || "mon_projet";
  els.modalConfirmBtn.textContent = "Utiliser ce dossier";
  openFolderModal(suggested);
});

els.createProjectBtn.addEventListener("click", () => {
  const name = els.projectName.value.trim();
  const desc = els.projectDescription.value.trim();
  if (!name || !desc) return;

  folderModalMode = "create";
  pendingCreate = { name, desc };
  const suggested = els.folderName.value || slugify(name);
  els.modalConfirmBtn.textContent = "Confirmer & Créer";
  openFolderModal(suggested);
});

els.modalFolderName.addEventListener("input", () => {
  els.modalPathPreview.textContent = slugify(els.modalFolderName.value) || "mon_projet";
});

els.modalCancelBtn.addEventListener("click", closeFolderModal);
els.folderModalBackdrop.addEventListener("click", closeFolderModal);

els.modalConfirmBtn.addEventListener("click", async () => {
  if (folderModalMode === "pick") {
    els.folderName.value = slugify(els.modalFolderName.value);
    closeFolderModal();
    addLog(`Dossier cible: Downloads/${els.folderName.value}/`, "info");
    return;
  }
  await confirmCreateWithFolder();
});

els.modalFolderName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    els.modalConfirmBtn.click();
  }
});

/* ── Pipeline actions ── */

els.runStepBtn.addEventListener("click", async () => {
  hideStepStatus();
  hideArtifact();
  setButtonLoading(els.runStepBtn, true);
  els.advanceBtn.disabled = true;
  els.runAllBtn.disabled = true;
  setStatus("Exécution étape…", "busy");
  addLog("Exécution de l'étape courante…", "info");

  const response = await sendMessage({
    type: "RUN_STEP",
    execMode: currentExecMode,
    webAi: els.webAiSelect.value,
  });

  setButtonLoading(els.runStepBtn, false, "▶ Exécuter l'étape");
  els.runAllBtn.disabled = false;

  if (response.success) {
    showStepStatus("Étape complétée ✅", "success");
    if (response.artifact) {
      showArtifact(response.artifact);
      addLog(`Artefact: ${response.step?.document || response.step?.label}`, "success");
    }
    if (response.codeFileCount) {
      addLog(`${response.codeFileCount} fichiers code capturés.`, "success");
    }
    if (response.finalized) {
      addLog(`Pipeline terminé. Dossier: Downloads/${response.folderName}/`, "success");
      showStepStatus(`Fichiers écrits → Downloads/${response.folderName}/`, "success");
    }
    setStatus("Étape OK", "online");
    await refreshProjectView();
  } else {
    showStepStatus(response.message || "Échec", "error");
    addLog("Échec: " + (response.message || "erreur"), "error");
    if (response.raw) addLog("Brut: " + String(response.raw).slice(0, 150), "warning");
    setStatus("Erreur étape", "offline");
    await refreshProjectView();
  }
});

els.advanceBtn.addEventListener("click", async () => {
  const response = await sendMessage({ type: "ADVANCE_STEP" });
  if (response.success) {
    addLog(`→ ${response.nextStep.label}`, "info");
    hideStepStatus();
    hideArtifact();
    await refreshProjectView();
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
  }
});

els.runAllBtn.addEventListener("click", async () => {
  hideStepStatus();
  hideArtifact();
  setButtonLoading(els.runAllBtn, true);
  els.runStepBtn.disabled = true;
  els.advanceBtn.disabled = true;
  setStatus("Pipeline en cours…", "busy");
  addLog("⚡ Démarrage pipeline complet (injection + capture auto)…", "info");

  const response = await sendMessage({
    type: "RUN_FULL_PIPELINE",
    execMode: currentExecMode,
    webAi: els.webAiSelect.value,
  });

  setButtonLoading(els.runAllBtn, false, "⚡ Tout exécuter");
  els.runStepBtn.disabled = false;

  if (response.success) {
    if (response.finalized) {
      addLog(`Pipeline COMPLET. Fichiers → Downloads/${response.folderName}/`, "success");
      showStepStatus(`Terminé → Downloads/${response.folderName}/`, "success");
    } else {
      addLog("Pipeline terminé.", "success");
    }
    setStatus("Pipeline terminé ✅", "online");
  } else {
    showStepStatus(response.message || "Pipeline arrêté", "error");
    addLog("Pipeline arrêté: " + (response.message || "erreur"), "error");
    setStatus("Pipeline stoppé", "offline");
  }
  await refreshProjectView();
});

els.writeArtifactsBtn.addEventListener("click", async () => {
  setButtonLoading(els.writeArtifactsBtn, true);
  addLog("Écriture des fichiers sur disque…", "info");
  const folder = els.activeFolderName.textContent || els.folderName.value || undefined;
  const response = await sendMessage({
    type: "WRITE_ARTIFACTS",
    folderName: folder,
    saveAs: false,
  });
  setButtonLoading(els.writeArtifactsBtn, false, "💾 Écrire sur disque");
  if (response.success) {
    addLog(response.message || "Fichiers écrits.", "success");
    showStepStatus(response.message || "OK", "success");
  } else {
    addLog("Erreur: " + (response.message || "échec"), "error");
  }
});

els.resetBtn.addEventListener("click", async () => {
  if (!confirm("Supprimer le projet actuel ? Les fichiers déjà téléchargés restent sur le disque.")) return;
  const response = await sendMessage({ type: "RESET_PROJECT" });
  if (response.success) {
    addLog("Projet supprimé.", "info");
    hideStepStatus();
    hideArtifact();
    els.projectName.value = "";
    els.projectDescription.value = "";
    els.folderName.value = "";
    validateCreateForm();
    await refreshProjectView();
  }
});

els.clearLog.addEventListener("click", () => {
  els.logContainer.innerHTML = "";
});

/* Progress from background */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "PIPELINE_PROGRESS") {
    const p = message.progress;
    if (p.phase === "running") {
      addLog(`Étape ${p.stepIndex + 1}/${p.totalSteps}: ${p.step?.label}…`, "info");
      setStatus(`${p.step?.label || "…"}`, "busy");
      // live update pipeline highlight
      sendMessage({ type: "GET_STEP_INFO" }).then((r) => {
        if (r.success) renderPipeline(r.stepInfo);
      });
    } else if (p.phase === "retry") {
      addLog(`Réessai ${p.retryCount}: ${p.message}`, "warning");
    } else if (p.phase === "failed") {
      addLog(`Échec étape ${p.stepIndex + 1}: ${p.message}`, "error");
    } else if (p.phase === "complete") {
      addLog("Pipeline complété !", "success");
      setStatus("Terminé ✅", "online");
    }
  }
});

  /* ── Tabs ── */

  els.tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      els.tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
      els.tabContents.forEach((c) => c.classList.toggle("active", c.id === `tab-${tabId}`));
    });
  });

  /* ── Injection Directe ── */

  const SILENCE_ABSOLU = `\nSILENCE ABSOLU — RÈGLE S1:\n- UNIQUEMENT du JSON valide {"files":[{"path":"...","content":"...","language":"..."}]}\n- Aucun texte conversationnel, aucune explication\n`;

  els.btnInjectOnly.addEventListener("click", async () => {
    let prompt = els.injectPrompt.value.trim();
    if (!prompt) return;
    if (els.injectSilence.checked) prompt = SILENCE_ABSOLU + "\n\n---\n\n" + prompt;

    addLog("Injection du prompt...", "info", els.injectLog);
    const webAi = els.webAiSelect.value;
    const response = await sendMessage({ type: "OPEN_WEB_AI", webAi });
    
    if (response.success) {
      // Small delay to ensure tab is ready
      setTimeout(async () => {
        const injectResp = await sendMessage({ 
          type: "PING_CONTENT" // This is just to check if content script is there
        });
        
        // Use a generic inject message
        chrome.tabs.sendMessage(response.tabId, { 
          type: "KIROV_INJECT_AND_CAPTURE", 
          prompt,
          targetAi: webAi,
          minLength: 10 // Just inject, don't wait for long response
        }, (r) => {
          if (chrome.runtime.lastError) {
             addLog("Erreur: " + chrome.runtime.lastError.message, "error", els.injectLog);
          } else {
             addLog("Prompt injecté !", "success", els.injectLog);
          }
        });
      }, 1500);
    }
  });

  els.btnInjectCapture.addEventListener("click", async () => {
    let prompt = els.injectPrompt.value.trim();
    if (!prompt) return;
    if (els.injectSilence.checked) prompt = SILENCE_ABSOLU + "\n\n---\n\n" + prompt;

    setButtonLoading(els.btnInjectCapture, true);
    addLog("Injection + Capture...", "info", els.injectLog);
    
    const webAi = els.webAiSelect.value;
    const target = { id: webAi }; // Simplified
    
    // We can use a direct background fetch or orchestrator method
    const response = await sendMessage({ 
      type: "RUN_STEP", // We can hijack RUN_STEP or add a new one
      execMode: "web",
      webAi: webAi,
      customPrompt: prompt // Background needs to handle this
    });

    setButtonLoading(els.btnInjectCapture, false, "⚡ Injecter + Capturer");
    if (response.success) {
      addLog(`Capture réussie ! (${response.content?.length || 0} chars)`, "success", els.injectLog);
    } else {
      addLog("Échec: " + response.message, "error", els.injectLog);
    }
  });

  /* ── GitHub ── */

  els.saveGithubBtn.addEventListener("click", async () => {
    const token = els.githubToken.value.trim();
    const repo = els.githubRepo.value.trim();
    const resp = await sendMessage({ type: "SET_GITHUB", token, repo });
    if (resp.success) {
      addLog("Configuration GitHub enregistrée", "success");
    }
  });

  els.pushFilesBtn.addEventListener("click", async () => {
    addLog("Préparation du push GitHub...", "info");
    const packResp = await sendMessage({ type: "GET_PACK" });
    if (!packResp.success || !packResp.pack) {
      addLog("Aucun projet actif", "error");
      return;
    }
    
    const files = packResp.pack.state.codeFiles || [];
    if (files.length === 0) {
      addLog("Aucun fichier à pusher", "warning");
      return;
    }

    setButtonLoading(els.pushFilesBtn, true);
    const pushResp = await sendMessage({ type: "PUSH_GITHUB", files });
    setButtonLoading(els.pushFilesBtn, false, "🐙 Push fichiers capturés");
    
    if (pushResp.success) {
      addLog("✅ Push GitHub réussi !", "success");
    } else {
      addLog("❌ Échec: " + pushResp.error, "error");
    }
  });

  /* ── Init ── */

  async function init() {
    // Load GitHub config
    const gh = await sendMessage({ type: "GET_GITHUB" });
    if (gh.success) {
      els.githubToken.value = gh.token;
      els.githubRepo.value = gh.repo;
    }

  setExecModeUI("web");
  updateProviderUI("deepseek");

  const cfg = await sendMessage({ type: "GET_CONFIG_STATUS" });
  if (cfg.success) {
    if (cfg.provider?.id) {
      els.providerSelect.value = cfg.provider.id;
      updateProviderUI(cfg.provider.id);
    }
    if (cfg.execMode) setExecModeUI(cfg.execMode);
    if (cfg.webAi) els.webAiSelect.value = cfg.webAi;
    if (cfg.folderName) els.folderName.value = cfg.folderName;
    if (cfg.hasKey) {
      const keyResp = await sendMessage({ type: "GET_API_KEY", providerId: cfg.provider?.id });
      if (keyResp.apiKey) {
        els.apiKeyInput.value = keyResp.apiKey;
        els.saveFeedback.classList.remove("hidden");
      }
      if (cfg.model) {
        populateModelSelect([{ id: cfg.model, label: cfg.model }], cfg.model);
        // background detect
        loadAndDetectModels(cfg.provider?.id || "deepseek");
      }
    }
  }

  await refreshProjectView();
  addLog("KIROV3 Orchestrator v16 prêt.", "info");
  addLog("Mode WEB = injection dans le chat + capture auto → disque.", "info");
}

init();
