/**
 * KIROV3 Orchestrator — Background Service Worker
 * Message hub between popup ↔ orchestrator ↔ content scripts
 */

importScripts(
  "lib/constants.js",
  "lib/pack-registry.js",
  "lib/pack-builder.js",
  "lib/gatekeeper.js",
  "lib/command-router.js",
  "lib/artifact-writer.js",
  "lib/orchestrator.js",
  "lib/github_pusher.js",
  "lib/bridge_polling.js"
);

chrome.runtime.onInstalled.addListener(() => {
  console.log("[KIROV5] Orchestrator v16+KIROV4 installé.");
});

// Initialisation du Bridge Polling
const bridge = new BridgePolling(Orchestrator);
bridge.start();

// Progress fan-out to popup
function broadcastProgress(progress) {
  try {
    chrome.runtime.sendMessage({ type: "PIPELINE_PROGRESS", progress }).catch(() => {});
  } catch (_) {}
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        /* ── Project lifecycle ── */
        case "CREATE_PROJECT": {
          const result = await Orchestrator.createProject(
            message.projectName,
            message.projectDescription,
            {
              folderName: message.folderName,
              execMode: message.execMode,
              webAi: message.webAi,
            }
          );
          sendResponse(result);
          break;
        }

        case "GET_PACK": {
          const pack = await Orchestrator.getPack();
          sendResponse({ success: true, pack });
          break;
        }

        case "GET_STEP_INFO": {
          const info = await Orchestrator.getCurrentStepInfo();
          sendResponse({ success: true, stepInfo: info });
          break;
        }

        case "RESET_PROJECT": {
          const result = await Orchestrator.resetProject();
          sendResponse(result);
          break;
        }

        /* ── Provider / models ── */
        case "SET_API_KEY": {
          const result = await Orchestrator.setApiKey(message.apiKey, message.providerId);
          sendResponse(result);
          break;
        }

        case "GET_API_KEY": {
          const key = await CommandRouter.getApiKey(message.providerId);
          sendResponse({ success: true, apiKey: key });
          break;
        }

        case "HAS_API_KEY": {
          const has = await Orchestrator.hasApiKey(message.providerId);
          sendResponse({ success: true, hasApiKey: has });
          break;
        }

        case "SET_PROVIDER": {
          const result = await Orchestrator.setProvider(message.providerId);
          sendResponse(result);
          break;
        }

        case "GET_PROVIDER": {
          const provider = await Orchestrator.getProvider();
          sendResponse({ success: true, provider });
          break;
        }

        case "GET_CONFIG_STATUS": {
          const status = await Orchestrator.getConfigStatus();
          sendResponse({ success: true, ...status });
          break;
        }

        case "DETECT_MODELS": {
          // Optionally set provider first
          if (message.providerId) {
            await Orchestrator.setProvider(message.providerId);
          }
          if (message.apiKey) {
            await Orchestrator.setApiKey(message.apiKey, message.providerId);
          }
          const result = await Orchestrator.detectModels();
          sendResponse(result);
          break;
        }

        case "SET_MODEL": {
          const result = await Orchestrator.setModel(message.model, message.providerId);
          sendResponse(result);
          break;
        }

        case "GET_MODEL": {
          const result = await Orchestrator.getModel(message.providerId);
          sendResponse(result);
          break;
        }

        case "SET_EXEC_MODE": {
          await Orchestrator.setExecMode(message.mode);
          sendResponse({ success: true, mode: message.mode });
          break;
        }

        case "SET_WEB_AI": {
          await Orchestrator.setWebAi(message.webAi);
          sendResponse({ success: true, webAi: message.webAi });
          break;
        }

        case "GET_PROVIDERS_LIST": {
          sendResponse({
            success: true,
            providers: Object.values(PROVIDERS),
            webTargets: Object.values(WEB_AI_TARGETS),
            steps: PIPELINE_STEPS,
          });
          break;
        }

        /* ── Pipeline ── */
        case "RUN_STEP": {
          const result = await Orchestrator.runCurrentStep({
            execMode: message.execMode,
            webAi: message.webAi,
            saveAs: message.saveAs,
          });
          sendResponse(result);
          break;
        }

        case "ADVANCE_STEP": {
          const result = await Orchestrator.advanceStep();
          sendResponse(result);
          break;
        }

        case "RUN_FULL_PIPELINE": {
          const result = await Orchestrator.runFullPipeline(broadcastProgress, {
            execMode: message.execMode,
            webAi: message.webAi,
            saveAs: message.saveAs,
          });
          sendResponse(result);
          break;
        }

        case "WRITE_ARTIFACTS": {
          const result = await ArtifactWriter.writeAll({
            folderName: message.folderName,
            saveAs: !!message.saveAs,
          });
          sendResponse(result);
          break;
        }

        case "WRITE_FILES": {
          const result = await ArtifactWriter.writeFiles(
            message.files || [],
            message.folderName,
            !!message.saveAs
          );
          sendResponse(result);
          break;
        }

        /* ── Folder name ── */
        case "SET_FOLDER_NAME": {
          await PackRegistry.setFolderName(message.folderName);
          const pack = await PackRegistry.getPack();
          if (pack) {
            pack.state.folderName = message.folderName;
            await PackRegistry.savePack(pack);
          }
          sendResponse({ success: true, folderName: message.folderName });
          break;
        }

        case "GET_FOLDER_NAME": {
          const name = await PackRegistry.getFolderName();
          sendResponse({ success: true, folderName: name });
          break;
        }

        /* ── Open AI tab ── */
        case "OPEN_WEB_AI": {
          const target = WEB_AI_TARGETS[message.webAi] || WEB_AI_TARGETS.deepseek;
          const tabId = await Orchestrator.ensureWebAiTab(target);
          sendResponse({ success: !!tabId, tabId, url: target.url });
          break;
        }

        /* ── Ping content script ── */
        case "PING_CONTENT": {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tabs[0]) {
            sendResponse({ success: false, message: "Aucun onglet actif" });
            break;
          }
          try {
            const resp = await chrome.tabs.sendMessage(tabs[0].id, { type: "KIROV_PING" });
            sendResponse(resp || { success: false });
          } catch (e) {
            sendResponse({ success: false, message: e.message });
          }
          break;
        }

        /* ── GitHub config ── */
        case "SET_GITHUB": {
          await chrome.storage.local.set({
            [STORAGE_KEYS.GITHUB_TOKEN]: message.token || "",
            [STORAGE_KEYS.GITHUB_REPO]: message.repo || "",
          });
          sendResponse({ success: true });
          break;
        }

        case "GET_GITHUB": {
          const r = await chrome.storage.local.get([
            STORAGE_KEYS.GITHUB_TOKEN,
            STORAGE_KEYS.GITHUB_REPO,
          ]);
          sendResponse({
            success: true,
            token: r[STORAGE_KEYS.GITHUB_TOKEN] || "",
            repo: r[STORAGE_KEYS.GITHUB_REPO] || "",
          });
          break;
        }

        case "PUSH_GITHUB": {
          const result = await GitHubPusher.push(message.files || [], message.branch);
          sendResponse(result);
          break;
        }

        /* ── Proxy fetch (avoid mixed content from CS) ── */
        case "FETCH": {
          try {
            const res = await fetch(message.url, message.options || {});
            const text = await res.text();
            let data = null;
            try {
              data = JSON.parse(text);
            } catch (_) {}
            sendResponse({
              success: true,
              result: { ok: res.ok, status: res.status, text, data },
            });
          } catch (e) {
            sendResponse({ success: false, error: e.message });
          }
          break;
        }

        default:
          sendResponse({
            success: false,
            message: `Type de message inconnu: ${message.type}`,
          });
      }
    } catch (err) {
      console.error("[KIROV3] BG error:", err);
      sendResponse({ success: false, message: err.message || String(err) });
    }
  })();

  return true; // keep channel open for async
});
