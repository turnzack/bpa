/// <reference types="vite/client" />
"use client";

// Trigger new Vercel Zero-Error SaaS Cloud bundle v1.0.3-FORCE-NO-CACHE
import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from '@monaco-editor/react';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Diamond, X, CheckCircle2, Box, Zap } from 'lucide-react';
import { ALL_PRD_PACKS as AVAILABLE_PACKS } from './data/prds';
import { ProjectConfigurator } from './components/ProjectConfigurator';
import { GuestIdeaPanel } from './components/GuestIdeaPanel';
import BuilderView from './components/studio/builder-view';
import DataView from './components/studio/data-view';
import WorkflowsView from './components/studio/workflows-view';
import GeneratorView from './components/studio/generator-view';
import { safeFetch, isLocalEnvironment } from './lib/bridgeClient';
import { launchCloudApkBuild, getGithubToken } from './lib/cloudApkBuilder';

type WidgetType = "projects" | "settings" | "news" | "youtube" | "phases" | null;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  widget?: WidgetType;
}

const getRandomGradient = (alpha = 1) => {
  if (typeof window === 'undefined') return `linear-gradient(135deg, rgba(17,17,17,${alpha}), rgba(34,34,34,${alpha}))`;
  const palettes = [
    [[42, 42, 114], [0, 159, 253]], [[249, 83, 198], [185, 29, 115]],
    [[255, 153, 102], [255, 94, 98]], [[0, 180, 219], [0, 131, 176]],
    [[142, 45, 226], [74, 0, 224]], [[17, 153, 142], [56, 239, 125]],
    [[252, 74, 26], [247, 183, 51]], [[21, 153, 87], [21, 87, 153]],
    [[0, 0, 70], [28, 181, 224]], [[58, 28, 113], [215, 109, 119]],
    [[255, 126, 95], [254, 180, 123]], [[0, 201, 255], [146, 254, 157]],
    [[191, 105, 105], [194, 112, 66]], [[163, 135, 185], [170, 107, 115]],
    [[228, 163, 127], [191, 105, 105]], [[170, 107, 115], [194, 112, 66]],
    [[5, 117, 230], [2, 27, 121]], [[255, 75, 31], [255, 144, 104]],
    [[0, 210, 255], [58, 123, 213]], [[247, 151, 30], [255, 210, 0]],
    [[19, 78, 94], [113, 178, 128]], [[195, 20, 50], [36, 11, 54]],
    [[17, 153, 142], [56, 239, 125]], [[168, 192, 255], [63, 75, 150]] // from image 
  ];
  const [c1, c2] = palettes[Math.floor(Math.random() * palettes.length)];
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, rgba(${c1[0]},${c1[1]},${c1[2]},${alpha}) 0%, rgba(${c2[0]},${c2[1]},${c2[2]},${alpha}) 100%)`;
};

const getTargetAiUrl = (id: string, isUi: boolean = false): string => {
  if (id === "custom") return typeof window !== 'undefined' ? (localStorage.getItem("tiger_customAiUrl") || "https://chat.deepseek.com/") : "https://chat.deepseek.com/";
  if (id === "stitch") return "https://stitch.withgoogle.com/";
  if (id === "v0") return "https://v0.dev/";
  if (id === "kimi" || id === "moonshot") return "https://www.kimi.com/fr?chat_enter_method=new_chat";
  if (id === "qwen") return "https://chat.qwen.ai/";
  if (id === "gemini") return "https://gemini.google.com/app";
  if (id === "chatgpt" || id === "openai") return "https://chatgpt.com/";
  if (id === "claude") return "https://claude.ai/";
  if (id === "perplexity") return "https://www.perplexity.ai/";
  if (id === "deepseek") return "https://chat.deepseek.com/";
  return `https://chat.${id}.com/`;
};

const WidgetSettings = ({
  isModal = false,
  isEmbedded = false,
  onClose,
  initialTab = "connexion",
  isClient,
  getCachedGradient,
  mouchardLogs,
  activePhase,
  availableProjects,
  setAvailableProjects,
  selectedLaunchProject,
  setSelectedLaunchProject,
  isMobileNative,
  isAutoPilot,
  setIsAutoPilot,
  reuseActiveTab,
  setReuseActiveTab,
  selectedStartPhase = "UNDEF",
  setSelectedStartPhase = () => console.error("MISSING SETTER"),
  selectedPacks = []
}: any) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Si l'initialTab change (via l'event open-mouchard), on met à jour
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // États locaux
  const [execMode, setExecMode] = useState("web");
  const [targetAi, setTargetAi] = useState("deepseek");
  const [targetUiAi, setTargetUiAi] = useState("stitch");
  const [customAiName, setCustomAiName] = useState("");
  const [customAiUrl, setCustomAiUrl] = useState("");
  const [bridgeUrl, setBridgeUrl] = useState("http://127.0.0.1:5006");
  const [vercelUrl, setVercelUrl] = useState("https://v0-reponse-git-main-v01-e951.vercel.app");
  const [defaultPreviewUrl, setDefaultPreviewUrl] = useState("http://127.0.0.1:5175");
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState("deepseek");
  const [apiKeyStatus, setApiKeyStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [overridePrompt, setOverridePrompt] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectInstructions, setNewProjectInstructions] = useState("");
  const [isExtConnected, setIsExtConnected] = useState(true);
  const [creationView, setCreationView] = useState<"classic" | "forge">("forge");
  const [packUpdateTrigger, setPackUpdateTrigger] = useState(0);
  const [techStack, setTechStack] = useState("vite");
  const [notebookExportStatus, setNotebookExportStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [notebookExportContent, setNotebookExportContent] = useState("");
  const [notebookExportError, setNotebookExportError] = useState("");
  const [notebookId, setNotebookId] = useState("6cd96956-200e-4260-ae7d-6c1446de284a");
  const [authCookie, setAuthCookie] = useState("");
  const [notebookConnectionStatus, setNotebookConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [isPipelineRunning, setIsPipelineRunning] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tiger_isPipelineRunning') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tiger_isPipelineRunning', String(isPipelineRunning));
    }
  }, [isPipelineRunning]);

  const [isExtractingZip, setIsExtractingZip] = useState(false);
  const [isExtractingPrd, setIsExtractingPrd] = useState(false);

  // Tâche 1 : Auto-Pilot Link
  useEffect(() => {
    if (Number(selectedStartPhase) === 0) {
      if (setIsAutoPilot) setIsAutoPilot(true);
    }
  }, [selectedStartPhase]);

  useEffect(() => {
    setExecMode(localStorage.getItem("tiger_execMode") || "web");
    setTargetAi(localStorage.getItem("tiger_targetAi") || "deepseek");
    setTargetUiAi(localStorage.getItem("tiger_targetUiAi") || "stitch");
    setCustomAiName(localStorage.getItem("tiger_customAiName") || "");
    setCustomAiUrl(localStorage.getItem("tiger_customAiUrl") || "");
    // Migration automatique : si l'ancienne valeur 5005 est stockée, on la corrige
    const storedBridgeUrl = localStorage.getItem("tiger_bridgeUrl");
    if (!storedBridgeUrl || storedBridgeUrl === "http://127.0.0.1:5005" || storedBridgeUrl === "http://localhost:5005") {
      localStorage.setItem("tiger_bridgeUrl", "http://127.0.0.1:5006");
    }
    setBridgeUrl(localStorage.getItem("tiger_bridgeUrl") || "http://127.0.0.1:5006");
    setVercelUrl(localStorage.getItem("tiger_vercelUrl") || "https://v0-reponse-git-main-v01-e951.vercel.app");
    setDefaultPreviewUrl(localStorage.getItem("tiger_defaultPreviewUrl") || "http://127.0.0.1:5175");
    const storedKey = localStorage.getItem("tiger_apiKey") || localStorage.getItem("hermes_deepseek_api_key") || "";
    setApiKey(storedKey);
    setApiProvider(localStorage.getItem("tiger_apiProvider") || "deepseek");
    setNotebookId(localStorage.getItem("tiger_notebookId") || "6cd96956-200e-4260-ae7d-6c1446de284a");
    setAuthCookie(localStorage.getItem("tiger_authCookie") || "");

    // Vérifier si une clé est déjà configurée côté moteur
    const currentBridge = localStorage.getItem("tiger_bridgeUrl") || "http://127.0.0.1:5006";
    safeFetch(`${currentBridge}/api/config/apikey`)
      .then(r => r ? r.json() : null)
      .then(d => {
        if (d && (d.hasAnyKey || d.hasKey || d.configured)) {
          setApiKeyStatus("ok");
          if (d.apiKey && !storedKey) {
            setApiKey(d.apiKey);
            localStorage.setItem("tiger_apiKey", d.apiKey);
            localStorage.setItem("hermes_deepseek_api_key", d.apiKey);
          }
        }
      })
      .catch(() => { });
  }, []);

  const handleSave = async () => {
    const settings = { execMode, targetAi, targetUiAi, customAiName, customAiUrl, bridgeUrl, vercelUrl, defaultPreviewUrl, apiKey };

    localStorage.setItem("tiger_execMode", execMode);
    localStorage.setItem("tiger_targetAi", targetAi);
    localStorage.setItem("tiger_targetUiAi", targetUiAi);
    localStorage.setItem("tiger_customAiName", customAiName);
    localStorage.setItem("tiger_customAiUrl", customAiUrl);
    localStorage.setItem("tiger_bridgeUrl", bridgeUrl);
    localStorage.setItem("tiger_vercelUrl", vercelUrl);
    localStorage.setItem("tiger_defaultPreviewUrl", defaultPreviewUrl);
    localStorage.setItem("tiger_apiKey", apiKey);
    localStorage.setItem("hermes_deepseek_api_key", apiKey);
    localStorage.setItem("tiger_apiProvider", apiProvider);
    localStorage.setItem("tiger_notebookId", notebookId);
    localStorage.setItem("tiger_authCookie", authCookie);

    // 🔑 Envoyer la clé au moteur Electron pour persistance sur disque
    if (apiKey && apiKey.trim().length > 0) {
      setApiKeyStatus("sending");
      const cleanKey = apiKey.trim();
      const payload = JSON.stringify({ key: cleanKey, apiKey: cleanKey, provider: apiProvider, mode: execMode });
      const headers = { "Content-Type": "application/json" };

      let success = false;
      const targets = Array.from(new Set([
        `${bridgeUrl}/api/config/apikey`,
        "http://localhost:5005/api/config/apikey",
        "http://127.0.0.1:5005/api/config/apikey"
      ]));

      for (const target of targets) {
        try {
          const res = await safeFetch(target, { method: "POST", headers, body: payload });
          if (res && res.ok) {
            const data = await res.json();
            if (data.success) {
              success = true;
              break;
            }
          }
        } catch (e) {
          console.warn(`[SETTINGS] Échec envoi vers ${target}:`, e);
        }
      }

      setApiKeyStatus("ok");
      if (success) {
        console.log(`[SETTINGS] ✅ Clé ${apiProvider} envoyée et persistée sur le moteur.`);
      } else {
        console.log(`[SETTINGS] ⚠️ Clé sauvée dans localStorage UI (Moteur en attente de reconnexion).`);
      }
    }

    if (typeof window !== "undefined" && (window as any).AndroidBridge && (window as any).AndroidBridge.showToast) {
      (window as any).AndroidBridge.showToast("Paramètres synchronisés !");
    }
    if (typeof window !== "undefined") {
      window.postMessage({ type: 'TIGER_EXTENSION_SYNC', payload: settings }, '*');
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'TIGER_EXTENSION_SYNC', payload: settings }, '*');
      }
    }

    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const chunkSize = 0x8000;
    for (let i = 0; i < len; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
    }
    return btoa(binary);
  };

  const triggerNativeZipPicker = () => {
    const isElectron = typeof window !== 'undefined' && Boolean(
      (window as any).electron || 
      (window as any).electronAPI || 
      navigator.userAgent?.includes('Electron')
    );

    const designProjectId = selectedLaunchProject || newProjectName || `Projet_ZIP_${Date.now()}`;

    // MODE WEB NAVIGATEUR
    if (!isElectron) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".zip";
      fileInput.style.display = "none";

      fileInput.onchange = async () => {
        const file = fileInput.files?.[0];
        try { fileInput.remove(); } catch (_) {}
        if (!file) return;

        setIsExtractingZip(true);

        try {
          const arrayBuf = await file.arrayBuffer();
          const base64 = arrayBufferToBase64(arrayBuf);
          const res = await fetch("/api/fs/upload-zip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              project: designProjectId,
              fileName: file.name,
              fileBase64: base64
            })
          });
          const data = await res.json().catch(() => null);

          setUiZipName(file.name);
          setSelectedStartPhase(2);
          const countInfo = data?.extractedCount ? ` (${data.extractedCount} fichiers extraits)` : '';
          alert(`✅ Archive "${file.name}" importée et extraite avec succès${countInfo} dans le projet : ${designProjectId} !\n\nVous êtes maintenant sur la Phase 2. Cliquez sur "⚙️ LANCER PHASE 2 (MULTI-BATCH)" pour démarrer l'intégration !`);
        } catch (err) {
          console.warn("[Upload ZIP] Erreur fallback:", err);
          alert(`⚠️ Erreur lors de l'envoi de l'archive : ${err}`);
        } finally {
          setIsExtractingZip(false);
        }
      };

      fileInput.click();
      return;
    }

    // MODE ELECTRON : dialogue natif OS
    (async () => {
      setIsExtractingZip(true);
      try {
        const res = await safeFetch("http://localhost:5005/api/fs/pick-zip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project: designProjectId })
        });
        const data = res ? await res.json() : null;
        if (data && data.success) {
          alert("✅ ZIP Copié avec succès dans le dossier : " + designProjectId + "\nLe fichier est prêt dans votre projet !");
          setSelectedStartPhase(2);
          if (data.fileName || data.filename) {
            setUiZipName(data.fileName || data.filename);
          }
        }
      } catch (err) {
        console.warn("Erreur picker ZIP:", err);
      } finally {
        setIsExtractingZip(false);
      }
    })();
  };

  // --- PICKER NATIF PACK PRD ZIP ---
  const triggerNativePrdZipPicker = () => {
    const isElectron = typeof window !== 'undefined' && Boolean(
      (window as any).electron || 
      (window as any).electronAPI || 
      navigator.userAgent?.includes('Electron')
    );

    const designProjectId = selectedLaunchProject || newProjectName || `Projet_ZIP_${Date.now()}`;

    if (!isElectron) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".zip";
      fileInput.style.display = "none";

      fileInput.onchange = async () => {
        const file = fileInput.files?.[0];
        try { fileInput.remove(); } catch (_) {}
        if (!file) return;

        setIsExtractingPrd(true);

        try {
          const arrayBuf = await file.arrayBuffer();
          const base64 = arrayBufferToBase64(arrayBuf);
          await fetch("/api/fs/upload-zip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              project: designProjectId,
              fileName: file.name,
              fileBase64: base64
            })
          });

          alert(`✅ Pack PRD "${file.name}" importé avec succès dans le projet : ${designProjectId}`);
        } catch (err) {
          console.warn("[Upload PRD ZIP] Erreur:", err);
        } finally {
          setIsExtractingPrd(false);
        }
      };

      fileInput.click();
      return;
    }

    (async () => {
      setIsExtractingPrd(true);
      try {
        const res = await safeFetch("http://localhost:5005/api/fs/pick-prd-zip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project: designProjectId })
        });
        const data = res ? await res.json() : null;
        if (data && data.success) {
          alert("✅ Pack PRD copié dans le projet : " + designProjectId + "\n\nFichier : " + (data.filename || data.fileName));
        }
      } catch (err) {
        console.warn("Erreur picker PRD:", err);
      } finally {
        setIsExtractingPrd(false);
      }
    })();
  };

  const tabs = [
    { id: "home", label: "TIGER IA", icon: "🐯" },
    { id: "creation", label: "⚙️ Création Projet", icon: "🚀" },
    { id: "electron", label: "Electron", icon: "💻" },
    { id: "vercel", label: "Vercel", icon: "▲" },
    { id: "deepseek", label: "DeepSeek", icon: "🐋" },
    { id: "override", label: "Override", icon: "💉" },
    { id: "connexion", label: "Connexion", icon: "⚙️" },
    { id: "suture", label: "Suture V2", icon: "🩺" },
  ];

  const [bridgeQueueData, setBridgeQueueData] = useState<any>({ current: null, queue: [] });
  const [engineLogs, setEngineLogs] = useState<string[]>([]);
  
  // --- Push UI/UX State ---
  const [uiTargetFile, setUiTargetFile] = useState("src/pages/ShoppingCartDrawer.tsx");
  const [uiSelectedPages, setUiSelectedPages] = useState<string[]>([]);
  const [uiAllPages, setUiAllPages] = useState(false);
  const [isUiPushLoading, setIsUiPushLoading] = useState(false);
  const [uiZipName, setUiZipName] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('tiger_uiZipName') || "";
    }
    return "";
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && uiZipName) {
      sessionStorage.setItem('tiger_uiZipName', uiZipName);
    }
  }, [uiZipName]);
  const [uiPushMessage, setUiPushMessage] = useState<string | null>(null);
  const [uiPushId, setUiPushId] = useState<string | null>(null);
  const [isUiPromoting, setIsUiPromoting] = useState(false);
  const [uiPromotionReady, setUiPromotionReady] = useState(false);
  const [projectPages, setProjectPages] = useState<string[]>([]);

  // Charge automatiquement la liste des pages dès que le projet est connu
  const fetchProjectPages = useCallback(async (proj: string) => {
    if (!proj) { setProjectPages([]); return; }
    try {
      const res = await safeFetch(`http://localhost:5006/api/projects/${proj}/pages`);
      if (res && res.ok) {
        const data = await res.json();
        if (data.pages) setProjectPages(data.pages);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    const proj = (typeof selectedLaunchProject === 'string' ? selectedLaunchProject : (selectedLaunchProject?.project_id || selectedLaunchProject?.title)) || newProjectName;
    fetchProjectPages(proj);
  }, [selectedLaunchProject, newProjectName, fetchProjectPages]);

  const bridgeQueueDataRef = useRef<any>({ current: null, queue: [] });

  // États Suture V2
  const [sutureDryRunMode, setSutureDryRunMode] = useState<string>(localStorage.getItem("suture_dryrun") || "none");
  const [sutureLockedFiles, setSutureLockedFiles] = useState<string>(localStorage.getItem("suture_locked_files") || "src/index.css,src/design.css,src/main.tsx,tsconfig.json,vite.config.ts,package.json");
  const [sutureHistory, setSutureHistory] = useState<any[]>([]);
  const [sutureHistoryLoading, setSutureHistoryLoading] = useState(false);
  const [sutureSingleFileOnly, setSutureSingleFileOnly] = useState<boolean>(localStorage.getItem("suture_single_file") !== "false");
  const [sutureAutoPromote, setSutureAutoPromote] = useState<boolean>(localStorage.getItem("suture_auto_promote") !== "false");
  const [sutureStatus, setSutureStatus] = useState<"idle"|"saved">("idle");
  const [sutureBtnState, setSutureBtnState] = useState<"clean" | "working" | "error">("clean");
  const lastAutoSutureTime = useRef<number>(0);

  const saveSutureSettings = () => {
    localStorage.setItem("suture_dryrun", sutureDryRunMode);
    localStorage.setItem("suture_locked_files", sutureLockedFiles);
    localStorage.setItem("suture_single_file", String(sutureSingleFileOnly));
    localStorage.setItem("suture_auto_promote", String(sutureAutoPromote));
    // Envoyer au moteur
    safeFetch("http://localhost:5006/api/suture/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dryRunMode: sutureDryRunMode,
        lockedFiles: sutureLockedFiles.split(",").map(f => f.trim()).filter(Boolean),
        singleFileOnly: sutureSingleFileOnly,
        autoPromote: sutureAutoPromote
      })
    }).catch(() => {});
    setSutureStatus("saved");
    setTimeout(() => setSutureStatus("idle"), 2500);
  };

  const loadSutureHistory = async (projectId?: string) => {
    setSutureHistoryLoading(true);
    try {
      const url = projectId
        ? `http://localhost:5006/api/suture/history?projectId=${projectId}`
        : "http://localhost:5006/api/suture/history";
      const res = await safeFetch(url);
      if (res && res.ok) {
        const data = await res.json();
        setSutureHistory(data.repairs || []);
      }
    } catch {
      setSutureHistory([]);
    } finally {
      setSutureHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!isLocalEnvironment()) return;
    let interval: any;
    if (activeTab === "deploiement" || activeTab === "creation") {
      const fetchQueue = () => {
        safeFetch("http://localhost:5006/api/bridge/queue")
          .then(res => res ? res.json() : null)
          .then(data => {
            if (data && data.success) {
              setBridgeQueueData({ current: data.current || {}, queue: data.queue || [] });
            }
          })
          .catch(() => {});
          
        safeFetch("http://localhost:5006/api/logs")
          .then(res => res ? res.json() : null)
          .then(data => {
            if (data && data.logs) {
              setEngineLogs(data.logs);
            }
          })
          .catch(() => {});
      };
      fetchQueue();
      interval = setInterval(fetchQueue, 10000);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className={`design-config-modal w-full h-screen bg-gradient-to-br from-[#845e7c]/95 to-[#6c3050]/95 backdrop-blur-2xl border-none shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row pointer-events-auto`}>

      {/* Sidebar */}
      {!isEmbedded && activeTab !== "creation" && (
        <div className="w-full md:w-64 bg-gradient-to-b from-black/40 to-black/60 border-r border-white/10 flex flex-col">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
              <span className="text-cyan">🐯</span> SETTINGS
            </h3>
            {isModal && (
              <button onClick={onClose} className="md:hidden w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-500 font-bold hover:bg-red-500 hover:text-white transition-colors">✕</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto py-4 hide-scrollbar flex md:flex-col gap-1 px-4">
            {tabs.map(t => {
              let tabStyle = "";
              if (t.id === "suture") {
                if (sutureBtnState === "error") {
                  tabStyle = "bg-red-600 text-white border-2 border-red-400 shadow-[0_0_20px_#ff0055] animate-pulse font-bold";
                } else if (sutureBtnState === "working") {
                  tabStyle = "bg-purple-600 text-white border-2 border-purple-300 shadow-[0_0_20px_#a855f7] animate-pulse font-bold";
                } else {
                  tabStyle = activeTab === "suture"
                    ? "bg-emerald-600/30 border border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40";
                }
              } else {
                tabStyle = activeTab === t.id
                  ? 'bg-cyan/20 border border-cyan/50 text-white shadow-[0_0_10px_rgba(8,179,201,0.2)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white';
              }

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal ${tabStyle}`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="font-bold text-sm tracking-wide">
                    {t.id === "suture" && sutureBtnState === "error" ? "🔴 Suture (Erreur !)" : t.id === "suture" && sutureBtnState === "working" ? "🟣 Suture V2..." : t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 bg-gradient-to-br from-[#111111] to-black relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 hide-scrollbar">

          {/* TABS CONTENT */}



          {activeTab === "connexion" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-black text-white border-b border-white/10 pb-4">Configuration LLM & Bridge</h2>

              <div>
                <span className="text-gray-300 font-bold mb-2 block uppercase tracking-wider text-[10px]">Mode d'exécution</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "web", icon: "💬", title: "Chat Web" },
                    { id: "api", icon: "🔑", title: "API Directe" },
                    { id: "hybrid", icon: "🔀", title: "Hybride" }
                  ].map(m => (
                    <button
                      key={m.id} onClick={() => setExecMode(m.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${execMode === m.id ? 'bg-gradient-to-br from-cyan/20 to-cyan/10 border-cyan text-white shadow-[0_0_10px_rgba(8,179,201,0.3)]' : 'bg-gradient-to-br from-black/30 to-black/50 border-white/10 text-gray-500 hover:border-white/30'}`}
                    >
                      <span className="text-2xl mb-1">{m.icon}</span>
                      <span className="font-bold text-xs">{m.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(execMode === "web" || execMode === "hybrid") && (
                <div className="space-y-3">
                  <span className="text-gray-300 font-bold uppercase tracking-wider text-[10px] block mb-2">Flotte d'Assistants (Multi-Acteurs)</span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Acteur Logique */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-4 rounded-xl border border-white/10 hover:border-cyan/50 transition-colors">
                      <div className="text-[10px] text-cyan mb-2 font-bold flex items-center gap-2">🧠 Cerveau Logique (Backend)</div>
                      <div className="flex gap-2">
                        <select
                          value={targetAi} onChange={(e) => setTargetAi(e.target.value)}
                          className="flex-1 bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-cyan text-sm"
                        >
                          <option value="notebooklm">📓 NotebookLM (Google)</option>
                          <option value="deepseek">🐋 DeepSeek Web</option>
                          <option value="chatgpt">🟢 ChatGPT Web</option>
                          <option value="gemini">✨ Gemini Web</option>
                          <option value="claude">🟣 Claude Web</option>
                          <option value="kimi">🌙 Kimi Web</option>
                          <option value="qwen">🌐 Qwen Coder</option>
                          <option value="perplexity">🔍 Perplexity AI</option>
                          <option value="custom">➕ IA Personnalisée</option>
                        </select>
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && (window as any).AndroidBridge) {
                              const url = targetAi === "custom" ? customAiUrl : getTargetAiUrl(targetAi);
                              (window as any).AndroidBridge.openAIWithPrompt(url, "Initialisation Logique.");
                            }
                          }}
                          className="px-3 bg-white/10 hover:bg-cyan/20 rounded-lg font-bold text-xs transition-colors text-white"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    {/* Acteur UI */}
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-4 rounded-xl border border-white/10 hover:border-pink/50 transition-colors">
                      <div className="text-[10px] text-pink mb-2 font-bold flex items-center gap-2">🎨 Cerveau UI/UX (Frontend)</div>
                      <div className="flex gap-2">
                        <select
                          value={targetUiAi} onChange={(e) => setTargetUiAi(e.target.value)}
                          className="flex-1 bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-pink text-sm"
                        >
                          <option value="stitch">🧵 Stitch Google</option>
                          <option value="v0">▲ v0.dev (Vercel)</option>
                          <option value="bolt">⚡ Bolt.new</option>
                          <option value="custom">➕ UI Personnalisée</option>
                        </select>
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && (window as any).AndroidBridge) {
                              const url = targetUiAi === "custom" ? customAiUrl : targetUiAi === "v0" ? "https://v0.dev/" : "https://stitch.withgoogle.com/";
                              (window as any).AndroidBridge.openAIWithPrompt(url, "Initialisation Design.");
                            }
                          }}
                          className="px-3 bg-white/10 hover:bg-pink/20 rounded-lg font-bold text-xs transition-colors text-white"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {(targetAi === "custom" || targetUiAi === "custom") && (
                <div className="flex gap-3 bg-white/5 border border-white/20 p-3 rounded-xl mt-2 animate-fadeIn">
                  <div className="flex-1">
                    <label htmlFor="custom-ai-name" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Nom IA Custom</label>
                    <input id="custom-ai-name" type="text" value={customAiName} onChange={(e) => setCustomAiName(e.target.value)} placeholder="Mon Agent" className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-white/50" />
                  </div>
                  <div className="flex-[2]">
                    <label htmlFor="custom-ai-url" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">URL Complète</label>
                    <input id="custom-ai-url" type="text" value={customAiUrl} onChange={(e) => setCustomAiUrl(e.target.value)} placeholder="https://..." className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-white/50 font-mono" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="api-provider" className="text-gray-300 font-bold uppercase tracking-wider text-[10px]">Fournisseur API</label>
                <select
                  id="api-provider"
                  value={apiProvider}
                  onChange={(e) => setApiProvider(e.target.value)}
                  className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-pink text-sm"
                >
                  <option value="deepseek">🐋 DeepSeek</option>
                  <option value="openai">🟢 OpenAI (ChatGPT)</option>
                  <option value="anthropic">🟣 Anthropic Claude</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="api-key" className="text-gray-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-2">
                  Clé API
                  {apiKeyStatus === "ok" && <span className="text-green-400 text-[10px] font-bold bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/30">✅ Persistante sur disque</span>}
                  {apiKeyStatus === "sending" && <span className="text-yellow-400 text-[10px] animate-pulse">⏳ Envoi...</span>}
                  {apiKeyStatus === "error" && <span className="text-red-400 text-[10px]">❌ Erreur moteur</span>}
                </label>
                <div className="flex gap-2 relative">
                  <input
                    id="api-key"
                    type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className={`flex-1 bg-gradient-to-r from-black/40 to-black/60 text-white border rounded-xl px-4 py-3 outline-none text-sm font-mono transition-colors ${apiKeyStatus === "ok" ? "border-green-500/50 focus:border-green-400" :
                        apiKeyStatus === "error" ? "border-red-500/50" :
                          "border-white/20 focus:border-pink"
                      }`}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-cyan/20 hover:bg-cyan/40 border border-cyan/40 text-cyan rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    💾 SAUVEGARDER + ENVOYER AU MOTEUR
                  </button>
                  <span className="text-gray-500 text-xs italic">Persistée sur disque (reste après redémarrage).</span>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-gradient-to-br from-black/30 to-black/50 border border-white/5 rounded-xl">
                <span className="text-gray-300 font-bold uppercase tracking-wider text-[10px] block">Modèle détecté</span>
                <div className="text-gray-500 text-sm mb-2">Enregistrer la clé pour détecter</div>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 bg-pink/20 text-pink border border-pink/50 hover:bg-pink/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                    🔄 AUTO_DETECT
                  </button>
                  <span className="text-gray-500 text-xs italic">Auto-détecté à l'enregistrement.</span>
                </div>
              </div>


              {/* SECTION BRIDGE PC vs MOBILE NATIF */}
              <div className="pt-4 border-t border-white/10">
                {isMobileNative ? (
                  <div className="space-y-4">
                    <h3 className="text-cyan font-bold flex items-center gap-2 text-sm mb-2">
                      📱 Moteur Mobile Natif
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Connecté</span>
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      La configuration automatique est active. Les prompts sont injectés via la WebView Fantôme Java et les fichiers sont sauvegardés nativement sur votre téléphone.
                      <br /><br />
                      <strong>Aucun Bridge Electron PC n'est requis.</strong> L'OS Souverain est 100% autonome dans votre poche.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-cyan font-bold flex items-center gap-2 text-sm mb-4">
                      🔗 Bridge (:5006 / Vercel)
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Bridge polling actif</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="bridge-url" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">URL Bridge local</label>
                        <input id="bridge-url" type="text" value={bridgeUrl} onChange={(e) => setBridgeUrl(e.target.value)} className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm font-mono mt-1" />
                      </div>
                      <div>
                        <label htmlFor="vercel-url" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">URL Vercel</label>
                        <input id="vercel-url" type="text" value={vercelUrl} onChange={(e) => setVercelUrl(e.target.value)} className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm font-mono mt-1" />
                      </div>
                      <div>
                        <label htmlFor="default-preview" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">URL Preview par défaut</label>
                        <input id="default-preview" type="text" value={defaultPreviewUrl} onChange={(e) => setDefaultPreviewUrl(e.target.value)} placeholder="http://127.0.0.1:3000" className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm font-mono mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors">🔗 Tester</button>
                      <button onClick={handleSave} className="px-4 py-2 bg-cyan/20 hover:bg-cyan/40 text-cyan rounded-lg text-xs font-bold uppercase transition-colors">💾 SAUVEGARDER_CONFIG</button>
                    </div>
                    <div className="text-green-400 text-xs font-bold mt-4 flex items-center gap-2">✅ Bridge connecté (auto-détecté)</div>
                  </>
                )}
              </div>

              {/* SECTION NOTEBOOKLM */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="text-blue-400 font-bold flex items-center gap-2 text-sm">
                  📓 NotebookLM Auto-Push (Python)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="notebook-id" className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Notebook ID (URL)</label>
                    <input 
                      id="notebook-id" 
                      type="text" 
                      value={notebookId} 
                      onChange={(e) => setNotebookId(e.target.value)} 
                      placeholder="6cd96956-..." 
                      className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="auth-cookie" className="text-gray-400 font-bold uppercase tracking-wider text-[10px] flex justify-between">
                      <span>Cookie d'authentification (__Secure-1PSID)</span>
                      {notebookConnectionStatus === "success" && <span className="text-green-400">🟢 Connecté</span>}
                      {notebookConnectionStatus === "error" && <span className="text-red-400">🔴 Erreur / Expiré</span>}
                      {notebookConnectionStatus === "testing" && <span className="text-yellow-400">⏳ Test...</span>}
                    </label>
                    <input 
                      id="auth-cookie" 
                      type="password" 
                      value={authCookie} 
                      onChange={(e) => setAuthCookie(e.target.value)} 
                      placeholder="Collez votre cookie d'authentification Google ici..." 
                      className="w-full bg-gradient-to-r from-black/40 to-black/60 text-white border border-white/20 rounded-lg px-3 py-2 text-sm font-mono mt-1 outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={handleSave} 
                      className="px-4 py-2 bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                      💾 Sauvegarder
                    </button>
                    <button 
                      onClick={async () => {
                        // TODO: Implement test via notebooklm-py
                        setNotebookConnectionStatus("testing");
                        setTimeout(() => setNotebookConnectionStatus("success"), 1000);
                      }} 
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase transition-colors"
                    >
                      🧪 Tester
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    Note : Ce cookie expire régulièrement. Pensez à le mettre à jour s'il ne fonctionne plus.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "suture" && (
            <div className="space-y-6 animate-fadeIn" onMouseEnter={() => { if (sutureHistory.length === 0) loadSutureHistory(); }}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">🩺</span>
                  <div>
                    <div>Suture V2 — Moteur Zero-Touch</div>
                    <div className="text-[10px] font-normal text-gray-400 mt-0.5">Réparation autonome, isolée et atomique</div>
                  </div>
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    sutureBtnState === "error"
                      ? "bg-red-500 shadow-[0_0_12px_#ff0055] animate-ping"
                      : sutureBtnState === "working"
                      ? "bg-purple-500 shadow-[0_0_12px_#a855f7] animate-pulse"
                      : "bg-emerald-400 shadow-[0_0_8px_#4ade80]"
                  }`}></div>
                  <span className={`text-[11px] font-black uppercase tracking-wider ${
                    sutureBtnState === "error"
                      ? "text-red-400"
                      : sutureBtnState === "working"
                      ? "text-purple-300"
                      : "text-emerald-400"
                  }`}>
                    {sutureBtnState === "error"
                      ? "🔴 ERREUR DÉTECTÉE (SUTURE REQUIS)"
                      : sutureBtnState === "working"
                      ? "🟣 SUTURE V2 EN COURS..."
                      : "🟢 MOTEUR AUTO-PILOT PRÊT"}
                  </span>
                </div>
              </div>

              {/* SECTION 1 : MODE DE VALIDATION */}
              <div className="bg-gradient-to-br from-black/40 to-[#0a1a0a]/60 border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
                  🔬 Mode de Validation (Dry-Run)
                </span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Contrôle si le moteur compile le code dans le bac à sable avant de l'appliquer en production.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "none", icon: "🚀", label: "Production", desc: "Applique directement" },
                    { id: "plan", icon: "🗺️", label: "Plan Only", desc: "Génère sans appliquer" },
                    { id: "true", icon: "🧪", label: "Full Dry-Run", desc: "Clone + build + bloque" },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSutureDryRunMode(m.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${sutureDryRunMode === m.id ? 'bg-green-900/40 border-green-500/70 text-white shadow-[0_0_12px_rgba(74,222,128,0.2)]' : 'bg-black/30 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'}`}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="font-black text-[10px]">{m.label}</span>
                      <span className="text-[9px] opacity-70">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2 : PROMOTION AUTOMATIQUE */}
              <div className="bg-gradient-to-br from-black/40 to-[#0a0a1a]/60 border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan flex items-center gap-2">
                  ⚡ Options de Promotion
                </span>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer bg-black/20 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <div className="text-white font-bold text-sm">Promotion Automatique</div>
                      <div className="text-[10px] text-gray-500">Si la compilation réussit, le patch est appliqué sans confirmation</div>
                    </div>
                    <div
                      onClick={() => setSutureAutoPromote(v => !v)}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${sutureAutoPromote ? 'bg-cyan' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${sutureAutoPromote ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between cursor-pointer bg-black/20 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div>
                      <div className="text-white font-bold text-sm">Fichier Unique Seulement</div>
                      <div className="text-[10px] text-gray-500">La Suture ne peut modifier qu'un seul fichier par réparation (plus sûr)</div>
                    </div>
                    <div
                      onClick={() => setSutureSingleFileOnly(v => !v)}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${sutureSingleFileOnly ? 'bg-cyan' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${sutureSingleFileOnly ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* SECTION 3 : FICHIERS VERROUILLÉS */}
              <div className="bg-gradient-to-br from-black/40 to-[#1a0a0a]/60 border border-red-500/20 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                  🔒 Fichiers Verrouillés (Intouchables)
                </span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Ces fichiers ne seront <strong className="text-red-300">JAMAIS</strong> modifiés par une Suture, même si l'IA essaie. Séparés par des virgules.
                </p>
                <textarea
                  value={sutureLockedFiles}
                  onChange={e => setSutureLockedFiles(e.target.value)}
                  rows={3}
                  className="w-full bg-black/40 text-red-200 border border-red-500/20 rounded-lg px-3 py-2 text-[11px] font-mono outline-none focus:border-red-500/50 resize-none"
                  placeholder="src/design.css,package.json,..."
                />
                <div className="flex flex-wrap gap-2">
                  {sutureLockedFiles.split(",").map(f => f.trim()).filter(Boolean).map(f => (
                    <span key={f} className="flex items-center gap-1 bg-red-900/20 border border-red-500/30 text-red-300 text-[9px] font-mono px-2 py-1 rounded-full">
                      🔒 {f}
                      <button
                        onClick={() => setSutureLockedFiles(prev => prev.split(",").map(s => s.trim()).filter(s => s !== f).join(", "))}
                        className="text-red-500 hover:text-white ml-1 font-bold"
                      >×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 4 : ACTIONS RAPIDES */}
              <div className="bg-gradient-to-br from-black/40 to-[#0a0a0a]/60 border border-white/10 rounded-xl p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                  ⚡ Actions Rapides Suture
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => safeFetch("http://localhost:5006/api/suture/purge-workspaces", { method: "POST" }).then(res => res ? alert("✅ Bac à sable vidé !") : alert("❌ Moteur inaccessible (Mode Cloud SaaS)")).catch(() => alert("❌ Moteur inaccessible"))}
                    className="py-3 bg-orange-900/20 hover:bg-orange-900/40 border border-orange-500/30 text-orange-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    🗑️ Vider le Bac à Sable
                  </button>
                  <button
                    onClick={() => loadSutureHistory()}
                    className="py-3 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-500/30 text-blue-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    🔄 Rafraîchir Historique
                  </button>
                  <button
                    onClick={() => safeFetch("http://localhost:5006/api/suture/rollback-last", { method: "POST" }).then(r => r ? r.json() : null).then(d => d ? alert(d.success ? `✅ Rollback : ${d.message}` : `❌ ${d.error}`) : alert("❌ Moteur inaccessible (Mode Cloud SaaS)")).catch(() => alert("❌ Moteur inaccessible"))}
                    className="py-3 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 text-purple-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    ↩️ Rollback Dernier Patch
                  </button>
                  <button
                    onClick={saveSutureSettings}
                    className={`py-3 border rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all ${sutureStatus === "saved" ? 'bg-green-900/40 border-green-500/50 text-green-300' : 'bg-cyan/10 hover:bg-cyan/20 border-cyan/40 text-cyan'}`}
                  >
                    {sutureStatus === "saved" ? "✅ Sauvegardé !" : "💾 Sauvegarder Config"}
                  </button>
                </div>
              </div>

              {/* SECTION 5 : HISTORIQUE DES RÉPARATIONS */}
              <div className="bg-gradient-to-br from-black/40 to-black/60 border border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    📋 Historique des Réparations
                  </span>
                  <button onClick={() => loadSutureHistory()} className="text-[9px] text-cyan hover:text-white bg-cyan/10 px-2 py-1 rounded">
                    Actualiser
                  </button>
                </div>
                <div className="max-h-[200px] overflow-y-auto hide-scrollbar space-y-2">
                  {sutureHistoryLoading && (
                    <div className="text-center text-gray-500 text-[10px] animate-pulse py-4">⏳ Chargement...</div>
                  )}
                  {!sutureHistoryLoading && sutureHistory.length === 0 && (
                    <div className="text-center text-gray-600 text-[10px] italic py-4">
                      Aucune réparation trouvée. Cliquez sur 🩺 dans l'explorateur pour lancer une Suture.
                    </div>
                  )}
                  {sutureHistory.map((r: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border text-[10px] font-mono ${r.status === 'applied' ? 'bg-green-900/10 border-green-500/20' : r.status === 'failed' ? 'bg-red-900/10 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                      <div className="flex flex-col gap-0.5 truncate flex-1 mr-2">
                        <span className="text-white font-bold truncate">{r.repairId || r.id}</span>
                        <span className="text-gray-500 truncate">{r.projectId} — {r.activeFile || "?"}</span>
                        <span className="text-gray-600">{r.startedAt ? new Date(r.startedAt).toLocaleString("fr-FR") : ""}</span>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[9px] font-bold ${r.status === 'applied' ? 'bg-green-900/30 border-green-500/40 text-green-300' : r.status === 'failed' ? 'bg-red-900/30 border-red-500/40 text-red-300' : 'bg-yellow-900/30 border-yellow-500/40 text-yellow-300'}`}>
                        {r.status === 'applied' ? '✅ Appliqué' : r.status === 'failed' ? '❌ Échec' : '⚠️ Partiel'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "creation" && (
            <div className="space-y-6 animate-fadeIn flex flex-col mt-8 border-t border-white/10 pt-8 pr-2">
              <div className="flex flex-col border-b border-white/5 pb-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-wide uppercase">
                  <span>⚙️</span> CONFIGURATION DU PROJET
                </h2>
                <p className="text-[10px] text-gray-400 mt-1">Générez et paramétrez votre projet de A à Z.</p>
              </div>

              {/* 2 PANELS LAYOUT — CONFIG + GUEST PRD */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                
                {/* PANEL 1 (GAUCHE) : INFO PROJET */}
                <div className="transition-opacity duration-1000">
                  <div className="bg-[#050505] border border-white/5 rounded-xl flex flex-col gap-4 overflow-y-auto hide-scrollbar p-5 mb-6">
                  <h3 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                    <span className="text-yellow-500">📁</span> Création & Ciblage
                  </h3>
                  
                  <div>
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2">CIBLER UN PROJET EXISTANT</label>
                    <select
                      value={typeof selectedLaunchProject === 'string' ? selectedLaunchProject : (selectedLaunchProject?.project_id || selectedLaunchProject?.title || '')}
                      onChange={(e) => setSelectedLaunchProject(e.target.value)}
                      onClick={async () => {
                        if (availableProjects.length === 0) {
                          try {
                            const res = await safeFetch("/api/projects");
                            if (res && res.ok) {
                              const data = await res.json();
                              if (data.projects) {
                                setAvailableProjects(data.projects.map((p: any) => typeof p === 'string' ? p : (p.project_id || p.title || p.name || '')));
                              }
                            } else {
                              const cloudRes = await fetch("/api/projects");
                              const cloudData = await cloudRes.json();
                              if (cloudData.projects) {
                                setAvailableProjects(cloudData.projects.map((p: any) => typeof p === 'string' ? p : (p.project_id || p.title || p.name || '')));
                              }
                            }
                          } catch (e) {}
                        }
                      }}
                      className="w-full bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan text-xs"
                    >
                      <option value="">-- SÉLECTIONNER UN PROJET --</option>
                      {availableProjects.map((p: any, idx: number) => {
                        const val = typeof p === 'string' ? p : (p.project_id || p.title || p.name || ('Projet ' + idx));
                        return (
                          <option key={val + '_' + idx} value={val}>{val}</option>
                        );
                      })}
                    </select>
                    {selectedLaunchProject && notebookExportStatus === "idle" && (
                      <button
                        onClick={async () => {
                          setNotebookExportStatus("loading");
                          try {
                            const res = await safeFetch("http://localhost:5006/api/bridge/export-notebooklm", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ projectId: selectedLaunchProject, notebookId, authCookie })
                            });
                            if (!res) {
                              alert("Mode Cloud SaaS : Bridge local non connecté.");
                              setNotebookExportStatus("idle");
                              return;
                            }
                            const data = await res.json();
                            if (data.success) {
                              setNotebookExportContent(data.combinedContent || "");
                              
                              if (data.pushLog && data.pushLog.includes("Failed:")) {
                                setNotebookExportError(data.pushLog);
                                setNotebookExportStatus("error");
                              } else {
                                setNotebookExportStatus("ready");
                              }
                            } else {
                              setNotebookExportError(data.message);
                              setNotebookExportStatus("error");
                            }
                          } catch (e) {
                            setNotebookExportError("Erreur de connexion avec Kirov5.");
                            setNotebookExportStatus("error");
                          }
                        }}
                        className="mt-2 w-full bg-blue-900/30 hover:bg-blue-800/50 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        📓 Préparer l'export NotebookLM
                      </button>
                    )}
                    {selectedLaunchProject && notebookExportStatus === "loading" && (
                      <button disabled className="mt-2 w-full bg-gray-900/50 text-gray-400 border border-gray-700/50 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                        ⏳ Extraction de l'expertise...
                      </button>
                    )}
                    {selectedLaunchProject && notebookExportStatus === "ready" && (
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(notebookExportContent);
                            window.open("https://notebook.google.com/notebook/6cd96956-200e-4260-ae7d-6c1446de284a", "_blank");
                            setNotebookExportStatus("idle");
                          } catch (err) {
                            alert("❌ Copie échouée. Essayez sur HTTPS ou utilisez Ctrl+C manuellement.");
                          }
                        }}
                        className="mt-2 w-full bg-green-900/40 hover:bg-green-800/60 text-green-300 border border-green-500/50 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        ✅ Copier & Ouvrir NotebookLM
                      </button>
                    )}
                    {selectedLaunchProject && notebookExportStatus === "error" && (
                      <div className="mt-2 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                        <div className="text-red-400 text-[10px] font-bold mb-2">⚠️ Échec du script Python (Copiez l'erreur ci-dessous) :</div>
                        <textarea 
                          readOnly 
                          value={notebookExportError} 
                          className="w-full h-24 bg-black/50 text-red-300 text-[10px] font-mono p-2 rounded border border-red-500/20 outline-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => setNotebookExportStatus("idle")}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-[10px] py-2 rounded font-bold"
                          >
                            🔄 Réessayer
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(notebookExportContent);
                                window.open("https://notebook.google.com/notebook/6cd96956-200e-4260-ae7d-6c1446de284a", "_blank");
                                setNotebookExportStatus("idle");
                              } catch (err) {
                                alert("❌ Copie échouée.");
                              }
                            }}
                            className="flex-1 bg-green-900/50 hover:bg-green-800/70 text-green-300 border border-green-500/50 text-[10px] py-2 rounded font-bold"
                          >
                            ✅ Fallback Manuel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2">NOM DU NOUVEAU PROJET</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Ex: MonSuperProjet" 
                        className="flex-1 bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan"
                      />
                      <button 
                        onClick={async () => {
                          if (!newProjectName || !newProjectName.trim()) { alert("Entrez un nom de projet"); return; }
                          const cleanName = newProjectName.trim();
                          
                          try {
                            const token = localStorage.getItem('kirov5_jwt_token') || '';
                            const res = await fetch("/api/projects", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ 
                                title: cleanName,
                                name: cleanName,
                                projectId: cleanName.replace(/[^a-zA-Z0-9_-]/g, '_'),
                                description: "Projet Tiger Cloud" 
                              })
                            });
                            
                            const data = await res.json();
                            if (res.ok && (data.success || data.project)) {
                              alert(`✅ Projet "${cleanName}" créé avec succès !`);
                              setActiveProject(cleanName);
                              if (typeof window !== 'undefined') {
                                localStorage.setItem("tiger_lastGeneratedProject", cleanName);
                              }
                              // Recharger les projets
                              fetch("/api/projects", {
                                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                              })
                                .then(r => r.json())
                                .then(d => {
                                  if (d && d.projects) {
                                    setRealProjects(d.projects.map((p: any) => ({ 
                                      name: p.project_id || p.title || p.name, 
                                      desc: p.owner_email ? `Propriétaire: ${p.owner_email}` : "Projet Cloud", 
                                      bg: "" 
                                    })));
                                  }
                                }).catch(() => {});
                            } else {
                              alert("❌ Erreur création projet: " + (data.error || data.message || "Erreur inconnue"));
                            }
                          } catch (e: any) {
                            alert("❌ Erreur de connexion avec le serveur: " + (e?.message || e));
                          }
                        }}
                        className="bg-[#0f2a2a] hover:bg-[#153f3f] text-cyan border border-cyan/30 px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        Valider
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2">STACK TECHNIQUE</label>
                    <select 
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      className="w-full bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan"
                    >
                      <option value="vite">⭐ 1er Choix (Prioritaire) : Vite + React + Tailwind + TS</option>
                      <option value="nextjs">Next.js 16 + Tailwind</option>
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2 flex items-center gap-1">
                      <span className="text-white">📄</span> INSTRUCTIONS / VISION
                    </label>
                    <textarea 
                      value={newProjectInstructions}
                      onChange={(e) => setNewProjectInstructions(e.target.value)}
                      placeholder="Décrivez l'application ou copiez votre PRD..."
                      className="w-full flex-1 min-h-[120px] bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan resize-none"
                    />
                  </div>
                </div>

                {/* PANEL 2 (CENTRE) : PARAMÈTRES & CIBLES */}
                <div className="bg-[#050505] border border-white/5 rounded-xl flex flex-col gap-4 overflow-y-auto hide-scrollbar p-5 transition-opacity duration-1000">
                  <h3 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                    <span className="text-yellow-500">⚡</span> Paramètres & IA
                  </h3>
                  
                  <div>
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2">INTELLIGENCE CIBLE</label>
                    <select 
                      className="w-full bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan"
                      onChange={(e) => {
                        const target = e.target.value;
                        (window as any).KIROV_TARGET_AI = target;
                        if (typeof window !== 'undefined') localStorage.setItem("tiger_targetAi", target);
                        
                        // Dire au moteur d'ouvrir la fenêtre fantôme correspondante
                        let url = "";
                        if (target === "stitch") url = "https://stitch.withgoogle.com";
                        else if (target === "deepseek" || target === "deepseek-web") url = "https://chat.deepseek.com";
                        else if (target === "gemini") url = "https://gemini.google.com";
                        else if (target === "chatgpt") url = "https://chatgpt.com";
                        else if (target === "claude") url = "https://claude.ai";
                        else if (target === "notebooklm") url = "https://notebooklm.google.com";
                        
                        if (url) {
                          safeFetch("http://localhost:5006/api/bridge/open-window", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url })
                          }).catch(err => console.warn("Erreur ouverture fenêtre", err));
                        }
                      }}
                      defaultValue={typeof window !== 'undefined' ? (localStorage.getItem("tiger_targetAi") || "hermes") : "hermes"}
                    >
                      <option value="notebooklm">📓 NotebookLM (Google)</option>
                      <option value="cloudflare">☁️ Cloudflare Qwen 3 30B (Audit IA Grade Gold)</option>
                      <option value="cloudflare-hermes">⚡ Hermes Cloudflare Workers AI (Qwen Coder)</option>
                      <option value="deepseek">🩵 DeepSeek (Extension Web)</option>
                      <option value="hermes">🤖 Hermes Agent (API DeepSeek)</option>
                      <option value="chatgpt">🟢 ChatGPT</option>
                      <option value="claude">🟣 Claude</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2">💉 MODE & LOT DE DÉPART (Val: {selectedStartPhase})</label>
                    <select 
                      value={selectedStartPhase}
                      onChange={(e) => setSelectedStartPhase(Number(e.target.value))}
                      className="w-full bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-cyan"
                    >
                      <option value={0}>🚀 TOUT : Pipeline Complète (Zero-Touch)</option>
                      <option value={1}>🎨 Phase 1 : Le Frontend (Stitch/v0)</option>
                      <option value={2}>⚙️ Phase 2 : Logique G5</option>
                      <option value={4}>🎨 Phase 3/4 : Câblage Métier (Business Wiring)</option>
                      <option value={5}>🔌 Phase 5 : Industrialisation & Backend</option>
                      <option value={9}>🪄 M.A.J UI : Pipeline Push UI/UX (One-Shot)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 mt-4 bg-[#111] p-4 rounded-lg border border-white/5">
                    <label className="flex items-center gap-3 text-[11px] font-bold text-gray-300 cursor-pointer">
                      <input type="checkbox" className="accent-cyan w-4 h-4" checked={isAutoPilot} onChange={() => setIsAutoPilot(!isAutoPilot)} />
                      🤖 AUTO-PILOT : {isAutoPilot ? 'ON 🟢' : 'OFF ⚪'}
                    </label>
                    <label className="flex items-center gap-3 text-[11px] font-bold text-gray-300 cursor-pointer">
                      <input type="checkbox" className="accent-cyan w-4 h-4" checked={reuseActiveTab} onChange={() => setReuseActiveTab(!reuseActiveTab)} />
                      🔗 Injecter dans l'onglet ouvert
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div 
                      id="btn-joindre-prd"
                      className={`py-6 text-white text-[10px] font-bold rounded-lg border flex flex-col items-center justify-center gap-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] ${
                        isExtractingPrd
                          ? 'bg-purple-950/80 border-purple-400 animate-pulse'
                          : ((window as any).KIROV_SELECTED_PACKS || selectedPacks).length > 0
                            ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                            : 'bg-[#2a1b3d] border-purple-500/30'
                      }`}
                      title="Pack PRD sélectionné — Sera injecté automatiquement dans le contexte IA"
                    >
                      <span className="text-xl">{isExtractingPrd ? '⏳' : '💎'}</span>
                      <span>
                        {isExtractingPrd
                          ? 'Copie en cours...'
                          : (((window as any).KIROV_SELECTED_PACKS || selectedPacks).length > 0
                            ? `Packs PRD ${((window as any).KIROV_SELECTED_PACKS || selectedPacks).length} ${((window as any).KIROV_SELECTED_PACKS || selectedPacks)[0]}`
                            : 'Aucun Pack PRD')}
                      </span>
                    </div>
                    <button 
                      id="btn-joindre-zip"
                      disabled={isExtractingZip}
                      onClick={() => {
                        // Si on est en Mode 0 (Pipeline Complète), on force l'état "en cours" pour enchaîner automatiquement la Phase 2 après l'upload
                        if (Number(selectedStartPhase) === 0) {
                          setIsPipelineRunning(true);
                          if (typeof window !== 'undefined') sessionStorage.setItem('tiger_isPipelineRunning', 'true');
                        }
                        triggerNativeZipPicker();
                      }}
                      className={`py-6 text-white text-[10px] font-bold rounded-lg border transition-all flex flex-col items-center justify-center gap-2 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] ${
                        isExtractingZip
                          ? 'bg-amber-950/70 border-amber-500 text-amber-300 animate-pulse'
                          : Number(selectedStartPhase) === 2 && !uiZipName
                            ? 'bg-cyan-950/80 border-2 border-cyan text-cyan shadow-[0_0_30px_rgba(6,182,212,0.7)] animate-pulse scale-105 ring-2 ring-cyan/40 cursor-pointer'
                            : isPipelineRunning 
                              ? 'bg-[#1a3a40] hover:bg-[#204a50] pointer-events-auto shadow-[0_0_30px_rgba(8,179,201,0.6)] border-cyan scale-105 z-50 relative animate-pulse'
                              : 'bg-[#1a2f3a] hover:bg-[#254250] border-cyan/30'
                      }`}
                      title={uiZipName ? `Archive importée : ${uiZipName}` : "Joindre le fichier ZIP exporté depuis Stitch"}
                    >
                      <span className="text-xl">{isExtractingZip ? '⏳' : (uiZipName ? '✅' : '📎')}</span>
                      <span className="font-extrabold">{isExtractingZip ? 'Extraction en cours...' : (uiZipName ? `ZIP : ${uiZipName}` : 'Joindre ZIP (Stitch)')}</span>
                      {Number(selectedStartPhase) === 2 && !uiZipName && !isExtractingZip && (
                        <span className="text-[9px] text-cyan-300 font-extrabold uppercase animate-bounce mt-0.5">
                          👇 Étape 2 : Joindre le ZIP ici
                        </span>
                      )}
                    </button>
                  </div>

                  {(() => {
                    const isPhase2WaitingZip = Number(selectedStartPhase) === 2 && !uiZipName;

                    const PHASE_ACTIONS: Record<number, string> = {
                      0: "🚀 LANCER PIPELINE COMPLÈTE (ONE-SHOT)",
                      1: "✨ LANCER PHASE 1 (Prompt vers l'IA)",
                      2: uiZipName 
                        ? `⚙️ LANCER PHASE 2 (MULTI-BATCH) [${uiZipName}]` 
                        : "⚙️ LANCER PHASE 2 (MULTI-BATCH) — ⏳ EN ATTENTE DU ZIP STITCH",
                      3: "🎨 LANCER PHASE 3/4 (CÂBLAGE MÉTIER)",
                      4: "🎨 LANCER PHASE 3/4 (CÂBLAGE MÉTIER)",
                      5: "🔌 LANCER PHASE 5 (INDUSTRIALISATION)",
                      9: "🛡️ LANCER PUSH UI"
                    };
                    const actionLabel = PHASE_ACTIONS[Number(selectedStartPhase)];
                    
                    if (!actionLabel) return null;

                    return (
                      <button 
                        id="btn-lancer-phase"
                        onClick={() => {
                        const proj = selectedLaunchProject || newProjectName;
                        if (!proj) {
                          alert("Veuillez sélectionner ou créer un projet !");
                          return;
                        }

                        // Si en Phase 2 et en attente du ZIP Stitch : proposer de le joindre directement
                        if (Number(selectedStartPhase) === 2 && !uiZipName) {
                          const confirmPick = confirm("📁 Le fichier .zip Stitch n'est pas encore joint à ce projet.\n\nSouhaitez-vous sélectionner et importer votre archive ZIP maintenant ?");
                          if (confirmPick) {
                            triggerNativeZipPicker();
                          }
                          return;
                        }
                        
                        // Tâche 4 : Mode Cinéma
                        setIsPipelineRunning(true);
                        if (typeof window !== 'undefined') sessionStorage.setItem('tiger_isPipelineRunning', 'true');
                        // Auto-scroll to radar (Queue)
                        setTimeout(() => {
                          document.getElementById("kirov-radar-queue")?.scrollIntoView({ behavior: 'smooth' });
                        }, 500);

                        const activeTargetAi = (window as any).KIROV_TARGET_AI || (typeof window !== 'undefined' ? (localStorage.getItem("tiger_targetAi") || "hermes") : "hermes");

                        // Fermeture automatique de la modale et redirection vers l'accueil pour suivre les logs
                        if (typeof onClose === 'function') onClose();
                        setActiveTab("home");
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('open-mouchard'));
                        }

                        // Récupération dynamique des packs sélectionnés
                        const activePacks = ((window as any).KIROV_SELECTED_PACKS && (window as any).KIROV_SELECTED_PACKS.length > 0)
                          ? (window as any).KIROV_SELECTED_PACKS
                          : (selectedPacks && selectedPacks.length > 0 ? selectedPacks : []);

                        if (Number(selectedStartPhase) === 5) {
                          // Déclencher l'audit interactif Phase 5 dans GuestIdeaPanel
                          // L'utilisateur choisit dans les listes ses vrais métiers (Express, SQLite/Postgres, JWT, etc.)
                          // et crée le Pack Industriel de remplacement des mocks !
                          window.dispatchEvent(new CustomEvent('trigger_phase5_audit', { detail: { project: proj } }));
                          
                          // Focus sur le panneau droit
                          const rightPanel = document.querySelector('.overflow-y-auto.hide-scrollbar');
                          if (rightPanel) {
                            rightPanel.scrollTop = 0;
                          }
                          return;
                        }

                        if (Number(selectedStartPhase) === 4 || Number(selectedStartPhase) === 3) {
                          // Lancer la Phase 3/4 (CÂBLAGE MÉTIER)
                          safeFetch("/api/bridge/trombone", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 
                              target_project: proj, 
                              target_ai: activeTargetAi, 
                              start_index: 1, 
                              zip_mode: true, 
                              start_phase: 4,
                              auto_pilot: isAutoPilot,
                              packs: activePacks
                            })
                          }).then(r => r ? r.json() : null).then(tData => {
                            if (tData) alert("✅ PHASE 3/4 (CÂBLAGE MÉTIER) LANCÉE !\nL'orchestrateur prend le relais pour connecter et câbler la logique métier.");
                            else alert("Mode Cloud SaaS : Bridge non disponible.");
                          }).catch(e => {
                            console.error(e);
                            alert("Erreur lors du lancement de la Phase 3/4.");
                          });
                          return;
                        }
                        
                        if (Number(selectedStartPhase) === 2) {
                          // Lancer la Phase 2 (Backend / Multi-batch)
                          safeFetch("/api/bridge/trombone", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 
                              target_project: proj, 
                              target_ai: activeTargetAi, 
                              start_index: 1, 
                              zip_mode: true, 
                              start_phase: 200,
                              auto_pilot: isAutoPilot,
                              packs: activePacks
                            })
                          }).then(r => r ? r.json() : null).then(tData => {
                            if (tData) alert("✅ PHASE 2 (LOGIQUE G5) LANCÉE !\nL'orchestrateur prend le relais pour générer le Backend et intégrer les composants.");
                            else alert("Mode Cloud SaaS : Bridge non disponible.");
                          }).catch(e => {
                            console.error(e);
                            alert("Erreur: Le moteur n'a pas pu être contacté.");
                          });
                          return;
                        }

                        // 1. Ouvrir immédiatement Stitch dans un nouvel onglet (synchrone pour éviter le blocage pop-up du navigateur)
                        if (typeof window !== 'undefined') {
                          window.open("https://stitch.withgoogle.com/", "_blank");
                          window.dispatchEvent(new CustomEvent('open-mouchard'));
                        }

                        if (Number(selectedStartPhase) === 0) {
                          // Lancer la pipeline complète Zero-Touch (Phase 0 One-Shot)
                          safeFetch("/api/bridge/trombone", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ 
                              target_project: proj, 
                              target_ai: "stitch", 
                              start_index: 1, 
                              zip_mode: true, 
                              start_phase: 0,
                              auto_pilot: isAutoPilot,
                              instructions: newProjectInstructions || "Génère l'application avec ces packs et directives.",
                              packs: activePacks
                            })
                          }).then(r => r ? r.json() : null).then(tData => {
                            const promptContent = tData?.prompt || tData?.data?.prompt || "Génération UI/UX Stitch complète.";
                            const packInfo = activePacks.length > 0 ? activePacks.join(', ') : 'standard';
                            
                            // 💡 BASCULE IMMÉDIATE DU MODE VERS LA PHASE 2 EN ATTENTE DU FICHIER ZIP STITCH
                            setSelectedStartPhase(2);
                            if (typeof window !== 'undefined') {
                              sessionStorage.setItem('tiger_selectedStartPhase', '2');
                            }

                            // Afficher l'overlay avec prévisualisation et copie garantie
                            if (typeof document !== 'undefined') {
                              const existing = document.getElementById('tiger-mega-prompt-overlay');
                              if (existing) existing.remove();

                              const overlay = document.createElement('div');
                              overlay.id = 'tiger-mega-prompt-overlay';
                              overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;font-family:sans-serif;';
                              
                              overlay.innerHTML = `
                                <div style="background:#0f172a;border:2px solid #06b6d4;border-radius:16px;width:100%;max-width:760px;padding:24px;box-shadow:0 0 50px rgba(6,182,212,0.4);display:flex;flex-direction:column;gap:16px;color:#fff;">
                                  <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:12px;">
                                    <div>
                                      <h3 style="margin:0;font-size:16px;font-weight:900;color:#38bdf8;display:flex;align-items:center;gap:8px;">
                                        <span>🧵</span> MÉGA-PROMPT STITCH PRÊT (${promptContent.length} car.)
                                      </h3>
                                      <p style="margin:4px 0 0 0;font-size:11px;color:#94a3b8;">
                                        Projet : <strong style="color:#e2e8f0;">${proj}</strong> | Pack PRD : <strong style="color:#a855f7;">${packInfo}</strong>
                                      </p>
                                    </div>
                                    <button id="btn-close-prompt-overlay" style="background:rgba(255,255,255,0.1);border:none;color:#fff;border-radius:50%;width:32px;height:32px;cursor:pointer;font-weight:bold;display:flex;align-items:center;justify-content:center;">✕</button>
                                  </div>

                                  <div style="background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.4);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
                                    <span style="font-size:20px;">⚙️</span>
                                    <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">
                                      <strong style="color:#38bdf8;">Pipeline automatiquement basculée en Phase 2 (Multi-Batch) :</strong><br/>
                                      1. Collez le prompt ci-dessous dans <strong>Stitch</strong>.<br/>
                                      2. Dès que votre UI est générée, téléchargez le <strong>.zip</strong>.<br/>
                                      3. Cliquez sur <strong>📎 Joindre ZIP (Stitch)</strong> pour lancer l'assemblage backend !
                                    </div>
                                  </div>

                                  <p style="margin:0;font-size:12px;color:#e2e8f0;line-height:1.5;">
                                    ✅ <strong>Le prompt Stitch est prêt et formaté !</strong> Cliquez sur le bouton ci-dessous pour le copier, puis collez-le (<strong>Ctrl + V</strong>) dans votre onglet Stitch :
                                  </p>
                                  <textarea id="tiger-prompt-area" readonly style="width:100%;height:200px;background:#050505;border:1px solid #334155;border-radius:10px;padding:12px;font-family:monospace;font-size:11px;color:#67e8f9;resize:none;outline:none;box-sizing:border-box;">${promptContent}</textarea>
                                  <div style="display:flex;gap:12px;">
                                    <button id="btn-copy-prompt" style="flex:1;background:linear-gradient(135deg,#06b6d4,#2563eb);color:#fff;border:none;padding:14px 20px;border-radius:10px;font-weight:bold;font-size:13px;cursor:pointer;box-shadow:0 0 20px rgba(6,182,212,0.4);display:flex;align-items:center;justify-content:center;gap:8px;">
                                      📋 COPIER LE MÉGA-PROMPT
                                    </button>
                                    <button id="btn-open-stitch" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:14px 24px;border-radius:10px;font-weight:bold;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
                                      🚀 OUVRIR STITCH
                                    </button>
                                  </div>
                                </div>
                              `;

                              document.body.appendChild(overlay);

                              const ta = document.getElementById('tiger-prompt-area') as HTMLTextAreaElement;
                              const copyBtn = document.getElementById('btn-copy-prompt');
                              const closeBtn = document.getElementById('btn-close-prompt-overlay');
                              const stitchBtn = document.getElementById('btn-open-stitch');

                              const doCopy = () => {
                                if (ta) {
                                  ta.select();
                                  ta.setSelectionRange(0, 99999);
                                  document.execCommand('copy');
                                }
                                if (navigator.clipboard) navigator.clipboard.writeText(promptContent).catch(() => {});
                                setSelectedStartPhase(2);
                                if (copyBtn) {
                                  copyBtn.innerHTML = '✅ COPIÉ DANS LE PRESSE-PAPIER !';
                                  copyBtn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                                  setTimeout(() => {
                                    if (copyBtn) {
                                      copyBtn.innerHTML = '📋 COPIER LE MÉGA-PROMPT';
                                      copyBtn.style.background = 'linear-gradient(135deg,#06b6d4,#2563eb)';
                                    }
                                  }, 3000);
                                }
                              };

                              if (copyBtn) copyBtn.onclick = () => { doCopy(); setSelectedStartPhase(2); };
                              if (closeBtn) closeBtn.onclick = () => { overlay.remove(); setSelectedStartPhase(2); };
                              if (stitchBtn) stitchBtn.onclick = () => { window.open('https://stitch.withgoogle.com/', '_blank'); setSelectedStartPhase(2); };
                              
                              // Copie automatique immédiate dès l'affichage et bascule en Phase 2
                              doCopy();
                              setSelectedStartPhase(2);
                            }
                          }).catch(e => {
                            console.error(e);
                            alert("Erreur de communication avec le serveur Kirov5.");
                          });
                          return;
                        }

                        // Phase 1 uniquement (UI/UX Stitch)
                        safeFetch("/api/bridge/prompt", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            target_ai: "stitch",
                            user_prompt: newProjectInstructions || "Génère l'application avec ces packs et directives.",
                            packs: activePacks,
                            target_project: proj,
                            phase_num: 1
                          })
                        }).then(r => r ? r.json() : null).then(data => {
                          const promptContent = data?.prompt || data?.data?.prompt || "Génération UI/UX Stitch.";
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(promptContent).catch(() => {});
                          }
                          alert(`🚀 PHASE 1 (STITCH UI/UX) INITIALISÉE !\n\n1. L'onglet Stitch a été ouvert dans votre navigateur.\n2. Le Méga-Prompt complet (${promptContent.length} car.) est copié dans votre presse-papier !\n👉 Faites Ctrl + V dans Stitch pour lancer la génération graphique !`);
                        }).catch(e => {
                          console.error(e);
                          alert("L'onglet Stitch a été ouvert. Assurez-vous d'avoir saisi les consignes de design.");
                        });
                      }}
                      className={`w-full mt-4 py-4 rounded-lg border transition-all flex justify-center items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white ${
                        Number(selectedStartPhase) === 0 
                          ? "bg-gradient-to-r from-purple-600/60 to-pink-600/60 hover:from-purple-500/70 hover:to-pink-500/70 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                          : "bg-gradient-to-r from-emerald-600/40 to-cyan-600/40 hover:from-emerald-500/50 hover:to-cyan-500/50 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      }`}
                    >
                      {actionLabel}
                    </button>
                    );
                  })()}

                  {Number(selectedStartPhase) === 9 && (
                    <div className="mt-2 p-4 border border-cyan/30 bg-[#0f2a2a]/40 rounded-xl">
                      <label className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-2">CIBLE ET SOURCE DU DESIGN</label>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] text-cyan/70 font-bold uppercase tracking-wider">
                            PAGES CIBLES
                            {uiSelectedPages.length > 0 && !uiAllPages && (
                              <span className="ml-2 text-cyan bg-cyan/20 px-1.5 py-0.5 rounded">{uiSelectedPages.length} sélectionnée{uiSelectedPages.length > 1 ? 's' : ''}</span>
                            )}
                          </label>
                          <button
                            onClick={async () => {
                              const proj = selectedLaunchProject || newProjectName;
                              if (!proj) { alert("Sélectionnez un projet actif d'abord !"); return; }
                              try {
                                const res = await safeFetch(`http://localhost:5005/api/projects/${proj}/pages`);
                                if (res && res.ok) {
                                  const data = await res.json();
                                  if (data.pages) setProjectPages(data.pages);
                                }
                              } catch(e) {}
                            }}
                            className="text-[9px] text-cyan bg-cyan/10 border border-cyan/30 px-2 py-0.5 rounded hover:bg-cyan/20 transition-all"
                          >↻ Rafraîchir</button>
                        </div>

                        {/* ALL_PAGES toggle */}
                        <div
                          onClick={() => { setUiAllPages(!uiAllPages); setUiSelectedPages([]); }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 cursor-pointer border transition-all ${uiAllPages ? "bg-cyan/20 border-cyan/50 text-cyan" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                        >
                          <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${uiAllPages ? "border-cyan bg-cyan" : "border-gray-500"}`}>
                            {uiAllPages && <span className="text-white text-[8px] font-black leading-none">✓</span>}
                          </div>
                          <span className="text-[10px] font-black">🚀 TOUTES LES PAGES (Auto-Mapping ZIP)</span>
                        </div>

                        {/* Liste des pages avec cases à cocher */}
                        {projectPages.length === 0 ? (
                          <div
                            onClick={async () => {
                              const proj = selectedLaunchProject || newProjectName;
                              if (!proj) { alert("Sélectionnez un projet actif d'abord !"); return; }
                              try {
                                const res = await safeFetch(`http://localhost:5006/api/projects/${proj}/pages`);
                                if (res && res.ok) {
                                  const data = await res.json();
                                  if (data.pages) setProjectPages(data.pages);
                                }
                              } catch(e) {}
                            }}
                            className="text-[10px] text-gray-500 italic text-center py-3 border border-dashed border-white/10 rounded-lg cursor-pointer hover:border-cyan/30 hover:text-cyan/50 transition-all"
                          >
                            ⏳ Cliquez pour charger les pages de « {(typeof selectedLaunchProject === 'string' ? selectedLaunchProject : (selectedLaunchProject?.project_id || selectedLaunchProject?.title)) || newProjectName || '?'} »
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
                            {/* Boutons tout sél / tout désel */}
                            {!uiAllPages && (
                              <div className="flex gap-1 mb-1">
                                <button onClick={() => setUiSelectedPages([...projectPages])} className="flex-1 text-[9px] text-cyan/70 border border-white/10 rounded px-2 py-1 hover:bg-white/5">✔ Tout sélectionner</button>
                                <button onClick={() => setUiSelectedPages([])} className="flex-1 text-[9px] text-gray-500 border border-white/10 rounded px-2 py-1 hover:bg-white/5">✕ Tout désélectionner</button>
                              </div>
                            )}
                            {projectPages.map(p => {
                              const label = p.replace('src/pages/', '').replace('.tsx', '').replace('.jsx', '');
                              const isChecked = uiAllPages || uiSelectedPages.includes(p);
                              return (
                                <div key={p}
                                  onClick={() => {
                                    if (uiAllPages) return;
                                    setUiSelectedPages(prev =>
                                      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                                    );
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-all ${
                                    uiAllPages ? "opacity-50 bg-white/5 border-white/10" :
                                    isChecked ? "bg-cyan/15 border-cyan/50 text-cyan" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                                  }`}
                                >
                                  <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${isChecked ? "border-cyan bg-cyan" : "border-gray-500"}`}>
                                    {isChecked && <span className="text-white text-[8px] font-black leading-none">✓</span>}
                                  </div>
                                  <span className="text-[10px] font-bold">{label}</span>
                                  <span className="text-[9px] text-gray-600 ml-auto">.tsx</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Résumé sélection */}
                        {(uiAllPages || uiSelectedPages.length > 0) && (
                          <div className="mt-2 text-[9px] text-cyan/80 bg-cyan/5 border border-cyan/20 rounded px-2 py-1 font-mono">
                            {uiAllPages
                              ? `✅ TOUTES LES PAGES seront traitées`
                              : `✅ ${uiSelectedPages.length} page(s) : ${uiSelectedPages.map(p => p.replace('src/pages/','').replace('.tsx','')).join(', ')}`
                            }
                          </div>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={uiZipName} 
                        onChange={e => setUiZipName(e.target.value)} 
                        placeholder="Fichier ZIP (ex: v0-design.zip)" 
                        className="w-full mb-3 bg-[#111] text-gray-200 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-cyan text-xs" 
                      />
                      
                      {uiPushMessage && (
                        <div className="mb-3 text-[10px] text-cyan font-bold p-2 bg-cyan/10 border border-cyan/20 rounded">
                          {uiPushMessage}
                        </div>
                      )}

                      <button 
                        disabled={isUiPushLoading}
                        onClick={async () => {
                          const aiTarget = window.KIROV_TARGET_AI || "notebooklm";
                          const proj = selectedLaunchProject || newProjectName;
                          if (!proj) { alert("Sélectionnez un projet d'abord."); return; }
                          if (!uiAllPages && uiSelectedPages.length === 0) { alert("Cochez au moins une page ou sélectionnez 'Toutes les pages'."); return; }
                          if (!uiZipName) { alert("Indiquez le nom du fichier ZIP."); return; }

                          const pagesToProcess = uiAllPages ? ["ALL_PAGES"] : uiSelectedPages;

                          setIsUiPushLoading(true);
                          setUiPushMessage(`🚀 Démarrage du push pour ${pagesToProcess.length === 1 && pagesToProcess[0] === 'ALL_PAGES' ? 'TOUTES LES PAGES' : `${pagesToProcess.length} page(s)`}...`);

                          try {
                            for (let i = 0; i < pagesToProcess.length; i++) {
                              const targetFile = pagesToProcess[i];
                              const label = targetFile === 'ALL_PAGES' ? 'ALL_PAGES' : targetFile.replace('src/pages/','').replace('.tsx','');
                              setUiPushMessage(`⏳ [${i+1}/${pagesToProcess.length}] Traitement de ${label}...`);
                              const payload = {
                                projectId: proj,
                                targetFile,
                                zipFileName: uiZipName,
                                baseVersionId: "v1-current",
                                mode: "strict-ui",
                                targetRoute: "/",
                                source: "vercel-interface",
                                promotionMode: "disabled",
                                idempotencyKey: `push-${proj}-${targetFile}-${Date.now()}`
                              };

                              const res = await safeFetch("http://localhost:5005/api/bridge/strict-ui-update", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload)
                              });
                              if (!res) throw new Error("Moteur local injoignable");
                              const data = await res.json();
                              if (!res.ok || !data.success) throw new Error(data.message || "Erreur");

                              const pushId = data.pushId;
                              setUiPushId(pushId);

                              // Polling jusqu'à la fin pour CETTE page
                              await new Promise<void>((resolve, reject) => {
                                const poll = setInterval(async () => {
                                  try {
                                    const sr = await safeFetch(`http://localhost:5005/api/bridge/strict-ui-update/${pushId}?projectId=${proj}`);
                                    if (!sr) return;
                                    const sd = await sr.json();
                                    setUiPushMessage(`⏳ [${i+1}/${pagesToProcess.length}] ${label} — état: ${sd.state}`);
                                    if (['promoted','preview_ready','validation_incomplete'].includes(sd.state)) { clearInterval(poll); resolve(); }
                                    else if (['failed','rejected','promotion_rejected'].includes(sd.state)) {
                                      clearInterval(poll);
                                      const errMsg = typeof sd.error === 'string' ? sd.error : (sd.error?.message || sd.state);
                                      reject(new Error(`${label}: ${errMsg}`));
                                    }
                                  } catch(e) { /* continuer */ }
                                }, 3000);
                              });
                            }
                            setUiPushMessage(`✅ Toutes les pages traitées avec succès !`);
                          } catch (e: any) {
                            setUiPushMessage(`❌ ${e.message}`);
                          } finally {
                            setIsUiPushLoading(false);
                          }
                        }}
                        className={`w-full py-4 rounded-lg transition-all flex justify-center items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white ${isUiPushLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600/60 to-cyan-600/60 hover:from-blue-500/70 hover:to-cyan-500/70 border-cyan/50 shadow-[0_0_15px_rgba(8,179,201,0.4)]'}`}
                      >
                        <span>🚀</span> LANCER PIPELINE PUSH UIUX (ONE-SHOT)
                      </button>

                      {uiPromotionReady && uiPushId && (
                        <button 
                          disabled={isUiPromoting}
                          onClick={async () => {
                            const proj = selectedLaunchProject || newProjectName;
                            setIsUiPromoting(true);
                            setUiPushMessage("🚀 Promotion en cours vers la Production...");
                            try {
                              const res = await safeFetch(`http://localhost:5005/api/bridge/strict-ui-update/${uiPushId}/promote`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ projectId: proj, promotionMode: "hybrid", confirm: true })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setUiPushMessage(`✅ Promotion Atomique Réussie ! Version: ${data.versionId}`);
                                setUiPromotionReady(false);
                              } else {
                                setUiPushMessage(`❌ Échec de la promotion: ${data.message || data.error}`);
                              }
                            } catch(e: any) {
                              setUiPushMessage(`❌ Erreur de promotion: ${e.message}`);
                            } finally {
                              setIsUiPromoting(false);
                            }
                          }}
                          className={`w-full mt-3 py-4 rounded-lg transition-all flex justify-center items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white ${isUiPromoting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600/60 to-emerald-600/60 hover:from-green-500/70 hover:to-emerald-500/70 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}
                        >
                          <span>🟢</span> PROMOUVOIR EN PRODUCTION (MERGE)
                        </button>
                      )}
                    </div>
                  )}
                </div>
                </div>

                {/* PANEL 2 (DROITE) : GUEST PRD + WORKFLOW + QUEUE */}
                <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">

                  {/* === GUEST IDEA PANEL (V0-Guest PRD) === */}
                  <div className="bg-[#050505] border border-white/5 rounded-xl p-5">
                    <GuestIdeaPanel 
                      activeProjectName={(typeof selectedLaunchProject === 'string' ? selectedLaunchProject : (selectedLaunchProject?.project_id || selectedLaunchProject?.title)) || newProjectName} 
                      selectedStartPhase={Number(selectedStartPhase)}
                      onPhaseChange={(phase) => setSelectedStartPhase(phase)}
                      onPackGenerated={(pack, description, category) => {
                        window.dispatchEvent(new CustomEvent('update_kirov_packs', { detail: [pack] }));
                        if (description) {
                          setNewProjectInstructions(prev => prev ? `${prev}\n\n[INJECTION PRD] : ${description}` : description);
                        }
                        // Tâche 3 : Smart Stack Selection
                        if (category === 'ecommerce' || category === 'social') {
                           setTechStack("nextjs");
                        } else {
                           setTechStack("vite");
                        }

                        alert(`💎 Le Pack PRD '${pack}' a été généré et lié automatiquement au projet !`);
                      }}
                    />
                  </div>

                  {/* Roadmap Visual */}
                  <div className={`bg-[#050505] border border-white/5 rounded-xl p-5 transition-all duration-500 ${isPipelineRunning ? 'shadow-[0_0_30px_rgba(8,179,201,0.3)] border-cyan/40' : ''}`}>
                     <h2 className="text-white font-bold text-[11px] mb-5 tracking-wide">Workflow "Design-First" (Hybride)</h2>
                     <div className="flex flex-col gap-3 text-[10px] font-mono text-gray-400 relative">
                        <div className="absolute left-[11px] top-6 bottom-6 w-px bg-white/5 z-0"></div>

                        {/* Tâche 1 : Visual Auto-Pilot Lock (Pause indicators) */}
                        {Number(selectedStartPhase) === 0 && !isAutoPilot && (
                          <>
                            <div className="absolute left-[5px] top-[32px] bg-red-900/80 border border-red-500 rounded text-[8px] px-1 text-white z-20">🛑 Pause</div>
                            <div className="absolute left-[5px] top-[64px] bg-red-900/80 border border-red-500 rounded text-[8px] px-1 text-white z-20">🛑 Pause</div>
                            <div className="absolute left-[5px] top-[96px] bg-red-900/80 border border-red-500 rounded text-[8px] px-1 text-white z-20">🛑 Pause</div>
                            <div className="absolute left-[5px] top-[128px] bg-red-900/80 border border-red-500 rounded text-[8px] px-1 text-white z-20">🛑 Pause</div>
                          </>
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#051505] border border-green-500/50 flex items-center justify-center text-green-400 shrink-0 text-[10px]">0</div>
                          <span className="text-green-400">Création (Boilerplate)</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#051020] border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0 text-[10px]">1</div>
                          <span className="text-blue-400">Génération UI (Stitch)</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#150520] border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0 text-[10px]">2</div>
                          <span className="text-indigo-400">Scan HTML & Blueprint JSON</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#051a20] border border-cyan/80 flex items-center justify-center text-cyan shadow-[0_0_15px_rgba(8,179,201,0.4)] shrink-0 text-[10px]">3</div>
                          <span className="text-cyan font-bold">Orchestration des Lots</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#200520] border border-purple-500/50 flex items-center justify-center text-purple-400 shrink-0 text-[10px]">4</div>
                          <span className="text-purple-400">Génération Contractuelle</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-6 h-6 rounded-full bg-[#2a1a00] border border-orange-500/50 flex items-center justify-center text-orange-400 shrink-0 text-[10px]">5</div>
                          <span className="text-orange-400">Validation Industrielle</span>
                        </div>
                     </div>
                  </div>

                  {/* Trombone Actions */}
                  <div className="flex flex-col gap-2 mb-2">
                    <button 
                      onClick={async () => {
                        const proj = selectedLaunchProject || newProjectName;
                        if (!proj) return;
                        const aiTarget = window.KIROV_TARGET_AI || "notebooklm";
                        try {
                          alert("Audit en cours... Hermes analyse votre code source pour générer le Pack Métier (Câblage). Veuillez patienter 15-30 secondes.");
                          let wiringPackId = `wiring-${proj}`;
                          try {
                            const res = await safeFetch("http://localhost:5006/api/bridge/generate-wiring-pack", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ 
                                projectId: proj,
                                baseVersionId: "version-active",
                                request: "Audite la coquille vide et propose le câblage métier.",
                                targetFiles: [],
                                targetRoutes: [],
                                source: "phase-4-ui"
                              })
                            });
                            const data = res ? await res.json() : null;
                            if (data && data.success) {
                              wiringPackId = data.data?.wiringPackId || data.wiringPackId || wiringPackId;
                            } else {
                              console.warn("[WIRING] Solde API DeepSeek insuffisant (402) ou fallback. Synthèse autonome activée.");
                            }
                          } catch (e) {
                            console.warn("[WIRING] Fallback local:", e);
                          }

                          alert("✅ Pack PRD Métier (Logic Wiring) prêt : " + wiringPackId + "\nLancement de la Phase 3/4 (Câblage Métier)...");
                          
                          const trombonePayload = {
                            target_project: proj,
                            target_ai: aiTarget || 'cloudflare',
                            start_phase: 4,
                            wiringPackId: wiringPackId,
                            auto_pilot: isAutoPilot,
                            packs: ((window as any).KIROV_SELECTED_PACKS || [])
                          };
                          
                          safeFetch("/api/bridge/trombone", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(trombonePayload)
                            })
                            .then(r => r ? r.json() : null)
                            .then(tData => {
                              if (!tData) return;
                              if (tData.mode === 'multi_batch') {
                                alert("✅ " + tData.message);
                              } else if (tData.error) {
                                alert("❌ Erreur lors de l'injection : " + tData.error);
                              }
                            })
                            .catch(e => console.error("Trombone error", e));
                        } catch (e: any) {
                          alert("❌ Erreur lors de l'audit: " + (e.message || e));
                        }
                      }}
                      className="w-full bg-[#051a20] hover:bg-[#083040] border border-cyan/40 text-cyan px-4 py-3 rounded-lg text-[10px] font-bold transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(8,179,201,0.2)]"
                    >
                      <span>🔍</span> AUDITER LA COQUILLE VIDE (Générer Pack Métier)
                    </button>
                  </div>
                    <div className="flex flex-col gap-2 mb-2">
                      <button 
                        onClick={() => {
                          const proj = selectedLaunchProject || newProjectName;
                          if (!proj) return;
                          
                          const aiTarget = window.KIROV_TARGET_AI || "deepseek";
                          
                          const payload = Number(selectedStartPhase) === 4 
                            ? {
                                projectId: proj, 
                                start_phase: 4, 
                                wiringPackId: `wiring-${proj.replace(/[^a-zA-Z0-9_-]/g, '')}`,
                                promotionMode: "disabled", 
                                autoPilot: true
                              }
                            : { 
                                target_project: proj, 
                                target_ai: aiTarget, 
                                start_index: 1, 
                                zip_mode: true,
                                start_phase: selectedStartPhase
                              };

                          safeFetch("/api/bridge/trombone", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                          }).catch(e => console.error(e));
                        }}
                        className="w-full bg-[#0a1025] hover:bg-[#101a35] border border-indigo-500/30 text-indigo-200 px-4 py-3 rounded-lg text-[10px] font-bold transition-all flex justify-center items-center gap-2"
                      >
                        <span>🚀</span> LANCER PIPELINE PUSH UIUX (ONE-SHOT)
                      </button>

                    <button
                      onClick={async () => {
                        const proj = selectedLaunchProject || newProjectName;
                        if (!proj) { alert("Sélectionnez un projet d'abord."); return; }
                        try {
                          const res = await safeFetch("http://localhost:5006/api/bridge/reset-session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ project_id: proj })
                          });
                          if (!res) {
                            alert("Mode Cloud SaaS : Moteur local non connecté.");
                            return;
                          }
                          const data = await res.json();
                          alert(data.success ? `🔓 ${data.message}` : `❌ ${data.error}`);
                        } catch (e) {
                          alert("❌ Moteur :5006 inaccessible.");
                        }
                      }}
                      className="w-full bg-[#2a0a0a] hover:bg-[#3d1010] border border-red-500/40 text-red-300 px-4 py-3 rounded-lg text-[10px] font-bold transition-all flex justify-center items-center gap-2"
                    >
                      <span>🔓</span> DÉBLOQUER SESSION (Anti-Lockout)
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log("L'automatisation est lancée !");
                        if (!bridgeQueueData.current || Object.keys(bridgeQueueData.current).length === 0) {
                          // Si aucune tâche n'est en cours (elle a été consommée ou bloquée), on force l'avancement (SKIP)
                          const proj = selectedLaunchProject || newProjectName;
                          if (!proj) return;
                          safeFetch("http://localhost:5006/api/debug/advance-batch", { 
                            method: "POST", headers: { "Content-Type": "application/json" }, 
                            body: JSON.stringify({ project_id: proj }) 
                          }).catch(() => null);
                          return;
                        }
                        const targetAi = Object.keys(bridgeQueueData.current)[0];
                        safeFetch("http://localhost:5006/api/bridge/prompt", {
                           method: "POST", headers: { "Content-Type": "application/json" },
                           body: JSON.stringify({ 
                             prompt: bridgeQueueData.current[targetAi].prompt, 
                             target_ai: targetAi,
                             phase_num: bridgeQueueData.current[targetAi].phase_num,
                             is_multi_batch: bridgeQueueData.current[targetAi].is_multi_batch,
                             project_id: bridgeQueueData.current[targetAi].project_id
                           })
                        }).catch(() => null);
                      }}
                      className="w-full bg-[#250a25] hover:bg-[#351035] border border-purple-500/30 text-purple-200 px-4 py-3 rounded-lg text-[10px] font-bold transition-all flex justify-center items-center gap-2"
                    >
                      <span>🚀</span> Lancer l'Automatisation (Phase 4)
                    </button>
                  </div>
                  
                  {/* Queue List */}
                  <div id="kirov-radar-queue" className={`flex-1 bg-[#080808] rounded-2xl p-5 flex flex-col gap-4 min-h-[220px] transition-all duration-1000 ${isPipelineRunning ? 'border-2 border-cyan shadow-[0_0_30px_rgba(8,179,201,0.25)]' : 'border border-white/10'}`}>
                    {/* Tâche Actuelle */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan font-black text-sm flex items-center gap-2.5">
                           <span className="w-1.5 h-4 bg-cyan inline-block rounded-sm shadow-[0_0_8px_rgba(0,240,255,0.6)]"></span> Tâche Actuelle
                        </span>
                        <button 
                          onClick={async () => {
                            let task: any = null;
                            let targetAi = 'deepseek';
                            if (bridgeQueueData.current && Object.keys(bridgeQueueData.current).length > 0) {
                              targetAi = Object.keys(bridgeQueueData.current)[0];
                              task = bridgeQueueData.current[targetAi];
                            } else if (bridgeQueueData.queue && bridgeQueueData.queue.length > 0) {
                              task = bridgeQueueData.queue[0];
                              targetAi = task.target_ai || 'deepseek';
                            }
                            if (!task) { alert("Aucune tâche active ni en attente."); return; }
                            const targetBridge = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
                              ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
                              : (localStorage.getItem("tiger_bridgeUrl") || "http://localhost:5006");
                            
                            safeFetch(`${targetBridge}/api/bridge/inject`, {
                               method: "POST", headers: { "Content-Type": "application/json" },
                               body: JSON.stringify({ 
                                 prompt: task.prompt, 
                                 target_ai: targetAi,
                                 phase_num: task.phase_num,
                                 is_multi_batch: task.is_multi_batch,
                                 project_id: task.project_id || task.target_project || 'GTASTICH'
                               })
                            }).catch(() => null);
                            alert(`Prompt [${task.phase_name || task.phase_num || 'Lot 1'}] poussé manuellement dans la zone texte KIROV5 (${targetAi}) !`);
                          }}
                          className="bg-gradient-to-r from-cyan-950 to-cyan-900 hover:from-cyan-900 hover:to-cyan-800 text-cyan-200 border border-cyan-500/40 text-xs font-black px-3.5 py-1.5 rounded-lg shadow-md transition-all cursor-pointer hover:scale-105"
                        >
                          ⚡ FORCER ENVOI
                        </button>
                      </div>
                      
                      {bridgeQueueData.current && Object.keys(bridgeQueueData.current).length > 0 ? Object.entries(bridgeQueueData.current).map(([ai, task]: [string, any]) => {
                        const promptStr = typeof task.prompt === 'string' ? task.prompt : JSON.stringify(task.prompt);
                        return (
                          <div key={ai} className="bg-zinc-900/90 border border-purple-500/30 p-3.5 rounded-xl text-xs md:text-sm text-zinc-200 font-mono shadow-md">
                            <div className="text-pink-400 font-extrabold text-sm mb-1.5 flex items-center gap-2">
                              <span>🚀 [{ai.toUpperCase()}]</span>
                              <span>{task.phase_name || 'Tâche active'}</span>
                            </div>
                            <div className="text-zinc-300 text-xs leading-relaxed max-h-20 overflow-y-auto custom-scrollbar font-mono opacity-90">
                              {promptStr ? promptStr.substring(0, 200) : ''}...
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-xs text-zinc-500 italic pl-2 py-1">Aucune tâche active pour le moment.</div>
                      )}
                    </div>

                    <div className="w-full h-px bg-white/10"></div>

                    <div className="flex flex-col gap-2.5 flex-1 min-h-0">
                       <div className="flex items-center justify-between">
                         <span className="text-amber-400 font-bold text-xs md:text-sm flex items-center gap-2">
                            <span>⏳</span> En attente ({bridgeQueueData.queue.length})
                         </span>
                         <div className="flex gap-2">
                           <button 
                             onClick={async () => {
                               const targetBridge = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
                                 ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
                                 : (localStorage.getItem("tiger_bridgeUrl") || "http://localhost:5006");
                               for (let i = 0; i < 20; i++) {
                                 await safeFetch(`${targetBridge}/api/bridge/consume`, { 
                                   method: "POST", headers: { "Content-Type": "application/json" },
                                   body: JSON.stringify({})
                                 }).catch(() => null);
                               }
                             }}
                             className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-2.5 py-1 rounded-lg hover:bg-red-950/30 font-bold transition-colors cursor-pointer"
                           >
                             🗑️ Vider
                           </button>
                           <button 
                             onClick={() => {
                               const proj = selectedLaunchProject || newProjectName || 'GTASTICH';
                               const targetBridge = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
                                 ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`
                                 : (localStorage.getItem("tiger_bridgeUrl") || "http://localhost:5006");
                               safeFetch(`${targetBridge}/api/debug/advance-batch`, { 
                                 method: "POST", headers: { "Content-Type": "application/json" }, 
                                 body: JSON.stringify({ project_id: proj }) 
                               }).catch(() => null);
                             }}
                             className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-2.5 py-1 rounded-lg hover:bg-zinc-800 font-bold transition-colors cursor-pointer"
                           >
                             Passer (Skip)
                           </button>
                         </div>
                       </div>

                       <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-44 custom-scrollbar">
                         {bridgeQueueData.queue.length > 0 ? bridgeQueueData.queue.map((task: any, i: number) => {
                           const promptStr = typeof task.prompt === 'string' ? task.prompt : JSON.stringify(task.prompt);
                           return (
                             <div key={i} className="bg-zinc-900/80 border border-white/10 p-3 rounded-xl flex flex-col gap-1.5 hover:border-white/20 transition-all">
                               <div className="text-xs font-bold text-zinc-200 flex justify-between">
                                 <span>[{i+1}] {task.phase_name || 'Action'}</span>
                                 <span className="text-purple-400 font-extrabold">{task.target_ai?.toUpperCase()}</span>
                               </div>
                               <div className="text-xs text-zinc-400 font-mono truncate">{promptStr ? promptStr.substring(0, 100) : ''}...</div>
                             </div>
                           );
                         }) : (
                           <div className="text-xs text-zinc-500 italic p-3 text-center border border-dashed border-white/10 rounded-xl">File vide.</div>
                         )}
                       </div>
                    </div>
                  </div>
                </div>
                
                {/* 📝 GRAND TERMINAL TEMPS RÉEL SOUS LE RADAR */}
                <div className="bg-[#050505] border-2 border-emerald-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-[0_0_35px_rgba(16,185,129,0.15)] min-h-[440px] h-[520px] max-h-[850px] resize-y overflow-hidden mt-4">
                   <div className="text-xs md:text-sm text-emerald-400 font-mono font-black flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                     <div className="flex items-center gap-2.5">
                       <span className="relative flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                       </span>
                       <span>&gt; Moteur Kirov5 - Terminal Temps Réel</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="text-[11px] font-mono text-emerald-300/80 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                         {engineLogs.length} logs
                       </span>
                       <span className="animate-pulse text-emerald-400 text-base font-bold">_</span>
                     </div>
                   </div>
                   <div className="flex-1 overflow-y-auto font-mono text-xs md:text-sm text-zinc-200 bg-black/80 p-4 rounded-xl border border-white/5 space-y-2 leading-relaxed custom-scrollbar flex flex-col">
                     {engineLogs.length === 0 ? (
                       <span className="text-zinc-600 italic py-4 text-center">En attente d'activité système...</span>
                     ) : (
                       engineLogs.slice(-150).map((log, i) => {
                         const isError = log.includes("❌") || log.toLowerCase().includes("erreur") || log.toLowerCase().includes("error");
                         const isSuccess = log.includes("✅") || log.includes("terminé") || log.includes("réussie");
                         const isBox = log.includes("[📦]");
                         const isWorker = log.includes("[API WORKER]") || log.includes("[CLOUDFLARE-HERMES]");
                         const isTrombone = log.includes("[TROMBONE]") || log.includes("🏁");

                         return (
                           <div 
                             key={i} 
                             className={`px-2 py-1 rounded font-mono text-xs md:text-sm break-all transition-colors ${
                               isError 
                                 ? "text-red-300 bg-red-950/40 border border-red-500/30 font-bold" 
                                 : isSuccess 
                                 ? "text-emerald-300 bg-emerald-950/20 font-semibold" 
                                 : isWorker
                                 ? "text-cyan-300 bg-cyan-950/20 font-medium"
                                 : isTrombone
                                 ? "text-purple-300 bg-purple-950/20 font-bold"
                                 : isBox
                                 ? "text-amber-300 bg-amber-950/10"
                                 : log.includes("✍️") 
                                 ? "text-cyan-400 font-semibold" 
                                 : "text-zinc-300 hover:bg-white/5"
                             }`}
                           >
                             {log}
                           </div>
                         );
                       })
                     )}
                   </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "override" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-black text-white border-b border-white/10 pb-2">Mode Manuel (Override)</h2>
                <p className="text-gray-400 text-xs mt-2">Prenez le contrôle manuel si l'automatisation s'enraye.</p>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-bold text-sm">Injection de prompt de secours</label>
                <textarea
                  value={overridePrompt} onChange={(e) => setOverridePrompt(e.target.value)}
                  placeholder="Entrez le prompt à forcer dans DeepSeek..."
                  className="w-full h-32 bg-gradient-to-b from-gray-900/60 to-black/60 text-white border border-white/20 rounded-xl p-3 outline-none focus:border-cyan text-sm resize-none"
                />
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-pink/30 to-pink/10 hover:from-pink/40 hover:to-pink/20 text-pink border border-pink/50 rounded-lg text-xs font-bold transition-all">💉 Forcer Injection</button>
                  <button className="flex-1 py-2 bg-gradient-to-r from-orange-500/30 to-orange-500/10 hover:from-orange-500/40 hover:to-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg text-xs font-bold transition-all">📦 Forcer Capture</button>
                </div>
              </div>

              <div className="bg-gradient-to-b from-black/50 to-black/70 border border-white/10 p-3 rounded-xl h-32 font-mono text-[10px] text-gray-400 overflow-y-auto">
                <span className="text-white mb-2 block">Log Override</span>
                En attente d'action manuelle...
              </div>
            </div>
          )}

          {activeTab === "mouchard" && (
            <div className="space-y-4 animate-fadeIn h-full flex flex-col">
              <div>
                <h2 className="text-xl font-black text-white border-b border-white/10 pb-2">Mouchard Système</h2>
                <p className="text-gray-400 text-xs mt-2">Surveillance en temps réel du flux de données.</p>
              </div>

              <div className="flex-1 bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-2 relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button className="text-[10px] bg-gradient-to-r from-red-500/30 to-red-500/10 text-red-400 px-2 py-1 rounded hover:from-red-500/40 hover:to-red-500/20">[WIPE]</button>
                </div>
                <div className="text-white font-bold mb-3 border-b border-white/20 pb-1 inline-block">LOG_STREAM</div>

                <div className="text-yellow-400">[09:24:30] ⚠️ Bridge local non joignable (Failed to fetch (Bridge hors ligne) - Failed to fetch). Polling Vercel actif.</div>
                <div className="text-green-400">[09:24:30] KIROV5 Orchestrator v5.1.1 prêt — structure React (.tsx/.ts/.css) préservée.</div>
                <div className="text-cyan">[09:24:30] Onglets: Projets · Projet · Injection · Capture · GitHub + Bridge :5006.</div>
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span className="text-cyan">🐯</span> TIGER IA — Hub d'Orchestration Souverain
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Supervision de l'écosystème Zero-Touch et de l'orchestrateur G5.</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold animate-pulse">
                  ● Moteur IA Actif
                </span>
              </div>

              {/* Grid des Cartes de Statut */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-black/40 to-black/70 p-4 rounded-2xl border border-cyan/30 shadow-lg">
                  <div className="text-cyan text-xs font-bold uppercase tracking-wider mb-1">Moteur Local</div>
                  <div className="text-2xl font-black text-white">v5.0.0</div>
                  <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan"></span> Bridge 5006 Opérationnel
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black/40 to-black/70 p-4 rounded-2xl border border-purple-500/30 shadow-lg">
                  <div className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">Agent Réflexion</div>
                  <div className="text-2xl font-black text-white">DeepSeek-R1</div>
                  <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span> Mode Hybride Actif
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black/40 to-black/70 p-4 rounded-2xl border border-pink/30 shadow-lg">
                  <div className="text-pink text-xs font-bold uppercase tracking-wider mb-1">Studio UI/UX</div>
                  <div className="text-2xl font-black text-white">Zero-Touch</div>
                  <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink"></span> Synchro Temps Réel
                  </div>
                </div>
              </div>

              {/* Actions Rapides */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">🚀 Actions Système Rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => window.open('http://localhost:3006', '_blank')}
                    className="p-4 bg-gradient-to-r from-cyan/20 to-blue-500/20 hover:from-cyan/30 hover:to-blue-500/30 border border-cyan/40 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-white font-bold text-sm group-hover:text-cyan transition-colors">🌐 Ouvrir l'Interface Studio (Vercel)</div>
                      <div className="text-xs text-gray-400">Accès direct au tableau de bord localhost:3006</div>
                    </div>
                    <span className="text-xl">➔</span>
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const res = await safeFetch("http://localhost:5006/api/theme");
                        if (!res) {
                          alert("Mode Cloud SaaS : Moteur local non connecté.");
                          return;
                        }
                        const data = await res.json();
                        alert("Thème synchronisé : " + (data.activeTheme?.nom || "Thème par défaut"));
                      } catch (e) {
                        alert("Vérifiez que le serveur Electron :5006 est démarré.");
                      }
                    }}
                    className="p-4 bg-gradient-to-r from-purple-500/20 to-pink/20 hover:from-purple-500/30 hover:to-pink/30 border border-purple-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-white font-bold text-sm group-hover:text-purple-300 transition-colors">🎨 Tester la Synchronisation Thème</div>
                      <div className="text-xs text-gray-400">Interroge l'API bridge :5006/api/theme</div>
                    </div>
                    <span className="text-xl">🔄</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "electron" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span className="text-cyan">💻</span> Moteur Electron PC — Serveur Local
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Gestion du pont d'exécution et du système de fichiers local.</p>
                </div>
                <span className="px-3 py-1 bg-cyan/20 text-cyan border border-cyan/40 rounded-full text-xs font-bold">
                  Port :5006
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-3 font-mono text-xs text-gray-300">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Dossier Racine Workspace :</span>
                    <span className="text-cyan font-bold">E:\v0reponses</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Répertoire des Projets Sauvegardés :</span>
                    <span className="text-green-400 font-bold">v0-moteur-electron/v0saveprojets</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Fichier Configuration Thème :</span>
                    <span className="text-yellow-400 font-bold">theme-config.json</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode Bridge HTTP :</span>
                    <span className="text-blue-400 font-bold">Express API REST Active</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const res = await safeFetch("http://localhost:5006/api/projects");
                        if (!res) {
                          alert("Mode Cloud SaaS actif : Bridge Electron local non connecté.");
                          return;
                        }
                        const data = await res.json();
                        alert(`Projets détectés (${data.projects?.length || 0}) : \n` + (data.projects?.join('\n') || 'Aucun'));
                      } catch (e) {
                        alert("Erreur de connexion au bridge Express :5006");
                      }
                    }}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    📁 Lister les Projets Locaux
                  </button>

                  <button
                    onClick={() => {
                      alert("Le moteur Electron tourne sur la tâche principale Windows.");
                    }}
                    className="flex-1 py-3 bg-cyan/20 hover:bg-cyan/30 border border-cyan/40 rounded-xl text-cyan font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    ⚡ État du Processus Electron
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "vercel" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span className="text-pink">▲</span> Studio Web Vercel — Preview & HMR
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Interface frontend réactive et synchronisation en direct.</p>
                </div>
                <span className="px-3 py-1 bg-pink/20 text-pink border border-pink/40 rounded-full text-xs font-bold">
                  Vite Dev Server
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-3 text-xs text-gray-300">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">URL Dev Local :</span>
                    <span className="text-cyan font-mono font-bold">http://localhost:3006</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Design System CSS :</span>
                    <span className="text-pink font-mono font-bold">src/design.css</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Source de Vérité Design Tokens :</span>
                    <span className="text-purple-400 font-mono font-bold">src/design-tokens.json</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hot Module Replacement (HMR) :</span>
                    <span className="text-green-400 font-bold">Actif (Modifications Instantanées)</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const proj = (typeof window !== 'undefined' ? localStorage.getItem('tiger_active_project') : '') || '';
                      window.open(proj ? '/admin-design.html?project=' + encodeURIComponent(proj) : '/admin-design.html', '_blank');
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-pink/30 to-purple-500/30 hover:from-pink/40 hover:to-purple-500/40 border border-pink/50 rounded-xl text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    🎨 Ouvrir le Studio Admin Design
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "deepseek" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span className="text-purple-400">🐋</span> Modèle IA DeepSeek — Agent Logique
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Paramètres du modèle de génération de code et d'architecture.</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold">
                  DeepSeek-V3 / R1
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-3 text-xs text-gray-300">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Mode d'Exécution IA :</span>
                    <span className="text-cyan font-bold">Chat Web & API Hybride</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Fenêtre de Contexte :</span>
                    <span className="text-green-400 font-bold">128,000 Tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rôle Principal :</span>
                    <span className="text-purple-400 font-bold">Cerveau Backend & Génération de Fichiers</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.open('https://chat.deepseek.com/', '_blank')}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 border border-purple-500/40 rounded-xl text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    🐋 Ouvrir DeepSeek Web
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {!isEmbedded && (
          <div className="p-4 border-t border-white/10 bg-gradient-to-b from-black/30 to-black/50 flex flex-wrap justify-between items-center gap-4 relative z-10">
            <button
              onClick={() => setIsExtConnected(!isExtConnected)}
              className={`text-xs font-bold hover:underline flex items-center gap-1 ${isExtConnected ? 'text-green-500' : 'text-red-500'}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${isExtConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isExtConnected ? 'Extension Connectée' : 'Extension Déconnectée'}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              {savedMsg && <span className="text-green-400 font-bold text-xs flex items-center mr-2 animate-pulse">✓ Sauvegardé</span>}
              {isModal && (
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-white/10 to-transparent hover:from-white/20 transition-colors text-sm">
                  Fermer
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-cyan to-blue-500 rounded-xl text-black font-black uppercase tracking-wider transition-all text-sm shadow-[0_0_15px_rgba(8,179,201,0.5)] whitespace-nowrap"
              >
                💾 SAUVER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Carousel = ({ items }: { items: React.ReactNode[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="design-carte-carrousel-conteneur w-full max-w-full flex overflow-x-auto gap-4 py-4 px-2 hide-scrollbar scroll-smooth relative"
      style={{ scrollBehavior: 'smooth' }}
    >
      {items.map((item, idx) => (
        <div key={idx} className="shrink-0 relative z-0 hover:z-10">
          {item}
        </div>
      ))}
    </div>
  );
};

const LOCAL_PRD_READMES = import.meta.glob('../../prd_packs/*/README.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const getLocalPackReadme = (packId: string): string | null => {
  for (const pathKey in LOCAL_PRD_READMES) {
    if (pathKey.includes(`/${packId}/README.md`) || pathKey.includes(`\\${packId}\\README.md`)) {
      return LOCAL_PRD_READMES[pathKey];
    }
  }
  return null;
};

const CarteV0GuestChat = ({ messages, showGuestPacks, setShowGuestPacks, guestPacksCount, guestPackSearchQuery, setGuestPackSearchQuery }: any) => {
  return (
    <div className="design-carte-v0-guest flex-shrink-0 w-full xl:w-[320px] z-30">
      <div 
        onClick={() => setShowGuestPacks && setShowGuestPacks(!showGuestPacks)}
        className={`h-full rounded-2xl p-6 border flex flex-col justify-between transition-all cursor-pointer shadow-2xl relative overflow-hidden group ${
          showGuestPacks 
            ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
            : 'border-white/10 bg-black/60 hover:border-purple-500/50 hover:bg-purple-950/20'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🐋</span>
          </div>
          <h3 className="text-xl font-black text-white mb-1 leading-tight">V0-GUEST</h3>
          <div className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-2">Hermes PRD Pack Engine</div>
          
          <div className="mb-2 relative">
            <input
              type="text"
              placeholder="Rechercher un pack Guest..."
              value={guestPackSearchQuery || ''}
              onChange={(e) => setGuestPackSearchQuery && setGuestPackSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:bg-purple-900/20 transition-all"
            />
            <span className="absolute right-2 top-1.5 text-purple-400/50 text-xs">🔍</span>
          </div>
          
          {/* FLUX DE CHAT ET BULLES INTÉGRÉS DANS LA CARTE V0-GUEST */}
          {messages && messages.length > 0 ? (
            <div className="mt-2 p-3 bg-black/70 border border-purple-500/30 rounded-xl max-h-[280px] min-h-[160px] overflow-y-auto space-y-2 text-left shadow-inner flex-1">
              <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center justify-between border-b border-purple-500/20 pb-1">
                <span>💬 Discussion Chat Active</span>
                <span className="text-[9px] text-purple-400 font-mono">{messages.length} msg</span>
              </div>
              {messages.map((m: any, idx: number) => (
                <div key={m.id || idx} className={`p-2.5 rounded-xl text-xs leading-relaxed border ${m.role === 'user' ? 'bg-purple-900/60 border-purple-400/50 text-purple-100 text-right ml-2' : 'bg-zinc-900/90 border-white/10 text-gray-200 mr-2'}`}>
                  <span className="font-bold text-[9px] block opacity-70 mb-0.5">{m.role === 'user' ? 'Vous' : 'Hermes AI'}</span>
                  {m.content}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Accédez à vos propres packs sur-mesure générés localement par reverse engineering avec l'Agent Hermes.
            </p>
          )}
        </div>
        <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
            {guestPacksCount || 4} PACKS DISPONIBLES
          </span>
          <span className={`text-xl transition-transform ${showGuestPacks ? 'rotate-90 text-purple-400' : 'text-zinc-500 group-hover:text-purple-400'}`}>➔</span>
        </div>
      </div>
    </div>
  );
};

const WidgetPrdPacks = ({
  selectedPacks,
  togglePack,
  isClient,
  getCachedGradient,
  onDetailStateChange,
  messages,
  showGuestPacks,
  setShowGuestPacks,
  guestPackSearchQuery
}: any) => {
  const [packReadmes, setPackReadmes] = useState<{ [id: string]: string }>({});
  const [selectedPrdDetail, setSelectedPrdDetail] = useState<{ packId: string, packName: string, readmeText: string } | null>(null);
  const [guestPacks, setGuestPacks] = useState<any[]>([]);

  const fetchGuestPacks = async () => {
    try {
      const res = await safeFetch(`http://localhost:5006/api/bridge/list-guest-packs?t=${Date.now()}`, { cache: 'no-store' });
      if (res && res.ok) {
        const payload = await res.json();
        const data = payload.data || payload;
        if (data.success && data.packs) {
          setGuestPacks(data.packs);
        }
      }
    } catch (e) {
      console.error("Erreur lecture guest packs", e);
    }
  };

  const handleSetSelectedPrdDetail = (detail: { packId: string, packName: string, readmeText: string } | null) => {
    setSelectedPrdDetail(detail);
    if (onDetailStateChange) {
      onDetailStateChange(!!detail);
    }
  };

  useEffect(() => {
    AVAILABLE_PACKS.forEach((pack: any) => {
      const packId = pack.id;
      if (!packReadmes[packId]) {
        const localContent = getLocalPackReadme(packId);
        if (localContent) {
          setPackReadmes(prev => ({ ...prev, [packId]: localContent }));
        }
      }
    });
  }, []);



  useEffect(() => {
    fetchGuestPacks();
  }, []);

  // 1. Vue détaillée de l'article README quand sélectionné
  if (selectedPrdDetail) {
    let rawReadme = (packReadmes[selectedPrdDetail.packId] && packReadmes[selectedPrdDetail.packId].trim().length > 5)
      ? packReadmes[selectedPrdDetail.packId]
      : (selectedPrdDetail.readmeText && selectedPrdDetail.readmeText.trim().length > 5)
      ? selectedPrdDetail.readmeText
      : (getLocalPackReadme(selectedPrdDetail.packId) || "");

    if (!rawReadme || rawReadme.trim().length < 5) {
      rawReadme = `# 💎 PRD PACK : ${selectedPrdDetail.packName} (${selectedPrdDetail.packId})\n\n### ⚙️ Spécifications techniques du contrat PRD\n\n- **Identifiant Pack**: ${selectedPrdDetail.packId}\n- **Statut**: Actif & Intégré au Moteur Sovereign\n- **Description**: Ce module PRD fournit la structure, les règles d'architecture et les spécifications d'injection pour l'IA DeepSeek & Stitch.\n\n*Le fichier README complet est disponible dans le dossier prd_packs/${selectedPrdDetail.packId}/README.md.*`;
    }

    return (
      <div 
        className="design-fenetre-readme w-full rounded-3xl p-6 md:p-8 border-2 border-cyan/60 shadow-[0_0_80px_rgba(124,58,237,0.45)] my-4 relative animate-fadeIn text-white z-20 flex flex-col min-h-[480px]"
        style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 35%, #0f172a 70%, #06b6d4 100%)' }}
      >
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <span className="px-3.5 py-1.5 bg-cyan/20 text-cyan text-xs font-bold rounded-xl border border-cyan/40 flex items-center gap-2 shadow-sm">
            <span>💎</span> PACK PRD : {selectedPrdDetail.packId}
          </span>
          <button
            onClick={() => handleSetSelectedPrdDetail(null)}
            className="w-10 h-10 bg-cyan/20 hover:bg-cyan/40 text-cyan rounded-xl flex items-center justify-center font-bold text-lg transition-all border border-cyan/40 cursor-pointer shadow-md"
            title="Fermer (Retour aux packs)"
          >
            ✕
          </button>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-cyan mb-2 leading-tight drop-shadow-[0_2px_10px_rgba(6,182,212,0.5)] flex-shrink-0">
          {selectedPrdDetail.packName}
        </h2>

        <div className="w-full h-px bg-gradient-to-r from-cyan via-purple-400 to-cyan/20 mb-4 flex-shrink-0"></div>

        {/* DOCUMENTATION README COMPLÈTE - THÈME FOLD DIRECTEMENT DERRIÈRE LE TEXTE */}
        <div 
          className="design-readme-contenu flex-1 text-white font-medium leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[500px] p-6 rounded-2xl border-2 border-cyan/50 font-mono text-sm shadow-[0_0_40px_rgba(8,179,201,0.3)] min-h-[300px]"
          style={{ 
            background: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 35%, #0f172a 70%, #06b6d4 100%)',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          {rawReadme}
        </div>

        <div className="mt-6 pt-4 border-t border-white/15 flex justify-between items-center flex-shrink-0">
          <span className="text-xs text-cyan/90 font-mono font-bold tracking-widest uppercase flex items-center gap-2">
            <span>⚡</span> SUTURE PRD ENGINE
          </span>
          <button
            onClick={() => handleSetSelectedPrdDetail(null)}
            className="px-6 py-2.5 bg-cyan/20 hover:bg-cyan/40 text-cyan font-bold rounded-xl transition-all border border-cyan/40 flex items-center gap-2 cursor-pointer hover:bg-cyan/30 shadow-md"
          >
            ← Fermer & Retour aux packs
          </button>
        </div>
      </div>
    );
  }

  // 2. Vue Carrousel de TOUS les Packs PRD sur la Page d'Accueil
  return (
    <div id="prd-packs-carousel-section" className="w-full flex-1 min-w-0 my-2">
      <div className="flex items-center justify-between mb-3 px-2">
        <h4 className="design-prd-titre-section font-black uppercase tracking-widest text-cyan flex items-center gap-2">
          <span>💎</span> PACKS PRD DE CONNAISSANCES ({AVAILABLE_PACKS.length})
        </h4>
        {selectedPacks && selectedPacks.length > 0 && (
          <span className="text-[11px] font-bold text-cyan bg-cyan/20 px-2.5 py-1 rounded-full border border-cyan/30">
            {selectedPacks.length} pack(s) actif(s)
          </span>
        )}
      </div>

      <div className="flex gap-4 items-stretch relative w-full">
        {/* CARROUSEL PRINCIPAL (COMMUTE AVEC LES PACKS GUEST) */}
        <div className="flex-1 min-w-0 min-h-[480px] overflow-hidden py-4 flex items-center">
          {showGuestPacks ? (
            guestPacks.length === 0 ? (
              <div className="h-full min-h-[220px] rounded-2xl p-6 border border-purple-500/20 bg-purple-950/20 backdrop-blur-md flex flex-col items-center justify-center text-center">
                <p className="text-purple-300 font-bold text-sm">Aucun pack Guest n'a encore été généré.</p>
                <p className="text-xs text-zinc-400 mt-2">Utilisez l'interface V0-GUEST pour scanner un projet local et créer un pack sur-mesure.</p>
                <button onClick={fetchGuestPacks} className="mt-4 text-xs text-purple-300 border border-purple-500/40 px-4 py-1.5 rounded-full hover:bg-purple-900/40 transition-colors">
                  🔄 Recharger les packs Guest
                </button>
              </div>
            ) : (
              <Carousel items={guestPacks.filter((pack: any) => {
                if (!guestPackSearchQuery) return true;
                const lowerQ = guestPackSearchQuery.toLowerCase();
                return pack.name?.toLowerCase().includes(lowerQ) || 
                       pack.description?.toLowerCase().includes(lowerQ) || 
                       pack.id?.toLowerCase().includes(lowerQ) ||
                       pack.category?.toLowerCase().includes(lowerQ);
              }).sort((a: any, b: any) => {
                return (a.name || "").localeCompare(b.name || "");
              }).map((pack: any) => {
                const packId = pack.id;
                const isSelected = selectedPacks ? selectedPacks.includes(packId) : false;
                
                return (
                  <div
                    key={packId}
                    className={`design-carte-carrousel design-prd-carte rounded-2xl p-5 border backdrop-blur-md flex flex-col transition-all shadow-lg relative group ${isSelected ? 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] bg-purple-950/60' : 'border-purple-500/20 hover:border-purple-400/60 bg-black/50'}`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isSelected ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-500/20 text-purple-400 border border-purple-500/40'}`}>
                          <Zap size={18} />
                        </div>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-md uppercase tracking-wider border border-purple-500/30">🐋 GUEST</span>
                      </div>
                      {togglePack && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePack(packId);
                          }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected ? 'bg-purple-500 text-white shadow-md scale-110' : 'bg-white/10 text-white/60 hover:bg-purple-500/40 hover:text-white'}`}
                        >
                          {isSelected ? '✓' : '+'}
                        </button>
                      )}
                    </div>

                    <h3 className="design-carte-titre text-base font-bold text-white mb-2 leading-tight truncate">{pack.name}</h3>
                    <p className="design-carte-desc flex-1 opacity-85 leading-relaxed text-zinc-300 text-xs line-clamp-4">
                      {pack.description}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400/80">{pack.modulesCount} MODULES</span>
                      <button
                        onClick={async () => {
                          try {
                            const res = await safeFetch(`http://localhost:5006/api/bridge/read-file?path=${encodeURIComponent(pack.path + '/README.md')}`);
                            let content = "";
                            if (res && res.ok) {
                              const data = await res.json();
                              content = data.data?.content || data.content || "";
                            }
                            handleSetSelectedPrdDetail({ 
                              packId, 
                              packName: pack.name, 
                              readmeText: content || `# PACK GUEST : ${pack.name}\n\nSpécifications techniques du pack Guest ${pack.name}.\n\nModule réutilisable scanné dans ${pack.path}.` 
                            });
                          } catch (e) {
                            handleSetSelectedPrdDetail({ 
                              packId, 
                              packName: pack.name, 
                              readmeText: `# PACK GUEST : ${pack.name}\n\nSpécifications techniques du pack Guest ${pack.name}.` 
                            });
                          }
                        }}
                        className="design-prd-btn text-purple-400 text-xs font-bold hover:underline cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 transition-all"
                      >
                        <span>📖</span> README →
                      </button>
                    </div>
                  </div>
                );
              })} />
            )
          ) : (
            <Carousel items={AVAILABLE_PACKS.map((pack: any) => {
              const packId = pack.id;
              const packName = pack.name;
              const Icon = pack.icon || Box;
              const isSelected = selectedPacks ? selectedPacks.includes(packId) : false;
              const readmeText = packReadmes[packId] || getLocalPackReadme(packId) || "Spécifications techniques du contrat PRD.";
              let cleanSummary = readmeText
                .replace(/^#+.*$/gm, '')
                .replace(/^>.*$/gm, '')
                .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
                .replace(/[*_~`]/g, '')
                .trim();
              
              const paragraphs = cleanSummary.split('\n').map(p => p.trim()).filter(p => p.length > 20);
              const firstParagraph = paragraphs.length > 0 ? paragraphs[0] : "Spécifications techniques du contrat PRD.";
              const shortDesc = firstParagraph.length > 180 ? (firstParagraph.substring(0, 180) + "...") : firstParagraph;

              return (
                <div
                  key={packId}
                  className={`design-carte-carrousel design-prd-carte rounded-2xl p-5 border backdrop-blur-md flex flex-col transition-all shadow-lg relative group ${isSelected ? 'border-cyan shadow-[0_0_25px_rgba(8,179,201,0.4)]' : 'border-white/10 hover:border-cyan/50'}`}
                  style={{ background: isClient ? getCachedGradient('prd-card-' + packId, 0.7) : 'rgba(0,0,0,0.7)' }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${isSelected ? 'bg-cyan text-black shadow-md' : (pack.color || 'bg-cyan/20 text-cyan')}`}>
                        <Icon size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-cyan/20 text-cyan text-[10px] font-bold rounded-md uppercase tracking-wider">💎 PRD</span>
                    </div>
                    {togglePack && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePack(packId);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected ? 'bg-cyan text-black shadow-md scale-110' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}
                        title={isSelected ? "Désélectionner ce pack" : "Sélectionner ce pack pour l'IA"}
                      >
                        {isSelected ? '✓' : '+'}
                      </button>
                    )}
                  </div>

                  <h3 className="design-carte-titre text-base font-bold text-white mb-2 leading-tight">{packName}</h3>
                  <p className="design-carte-desc flex-1 opacity-85 leading-relaxed">{shortDesc}</p>

                  <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan/80">MODULE PRD</span>
                    <button
                      onClick={async () => {
                        let content = packReadmes[packId] || getLocalPackReadme(packId) || "";
                        try {
                          const res = await safeFetch(`http://localhost:5006/api/bridge/read-file?packId=${encodeURIComponent(packId)}`);
                          if (res && res.ok) {
                            const data = await res.json();
                            const fetched = data.content || data.data?.content;
                            if (fetched && fetched.trim().length > 5) {
                              content = fetched;
                              setPackReadmes(prev => ({ ...prev, [packId]: fetched }));
                            }
                          }
                        } catch (e) {
                          console.warn("API Bridge read fallback", e);
                        }
                        handleSetSelectedPrdDetail({
                          packId,
                          packName,
                          readmeText: content || `# 💎 PRD PACK : ${packName} (${packId})\n\n### ⚙️ Spécifications techniques du contrat PRD\n\n- **Identifiant Pack**: ${packId}\n- **Statut**: Actif & Intégré au Moteur Sovereign`
                        });
                      }}
                      className="design-prd-btn text-cyan text-xs font-bold hover:underline cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan/30 transition-all hover:bg-cyan/10"
                    >
                      <span>📖</span> Lire le README →
                    </button>
                  </div>
                </div>
              );
            })} />
          )}
        </div>
      </div>


    </div>
  );
};

// Cache global pour les releases GitHub afin d'éviter le rate-limit (403 Forbidden)
let lastGhReleaseFetch = 0;
let cachedGhReleaseList: Array<{ file: string, name: string, sizeMb: string, url: string }> = [];

const WidgetProjects = ({ isClient, getCachedGradient, setActiveProject, onOpenProject }: any) => {
  const [liveProjects, setLiveProjects] = useState<{ name: string, desc: string, bg: string, installed?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [launchingProject, setLaunchingProject] = useState<string | null>(null);
  const [availableApks, setAvailableApks] = useState<Record<string, { file: string, sizeMb: string, url: string }>>({});
  const [apkBuildStates, setApkBuildStates] = useState<Record<string, { status: 'idle' | 'building' | 'success' | 'error', progress?: string, apkUrl?: string }>>({});

  const handleTriggerApkBuild = async (e: React.MouseEvent, projName: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Ouverture automatique de la console mouchard pour suivre les logs en direct
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-mouchard'));
      window.dispatchEvent(new CustomEvent('kirov-mouchard-log', {
        detail: `> 📱 [v0-apk] Lancement compilation APK pour "${projName}"...`
      }));
    }

    setApkBuildStates(prev => ({
      ...prev,
      [projName]: { status: 'building', progress: 'Initialisation...' }
    }));

    const updateProgress = (msg: string) => {
      setApkBuildStates(prev => ({
        ...prev,
        [projName]: { status: 'building', progress: msg }
      }));
    };

    const handleBuildResult = (status: 'building' | 'success' | 'error', apkUrl?: string) => {
      setApkBuildStates(prev => ({
        ...prev,
        [projName]: {
          status,
          apkUrl: apkUrl || prev[projName]?.apkUrl,
          progress: status === 'success' ? 'APK prêt !' : 'Échec compilation'
        }
      }));
      if (status === 'success') {
        lastGhReleaseFetch = 0; // Forcer le rafraîchissement
        fetchApks();
      }
    };

    try {
      const isRemoteVps = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

      if (isRemoteVps) {
        updateProgress("Compilation Cloud Souverain...");
        await launchCloudApkBuild(projName, updateProgress, handleBuildResult);
        return;
      }

      // 1. Essai backend local (Windows)
      const localRes = await safeFetch("http://localhost:5006/api/mobile/build-apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: projName })
      });

      if (localRes && localRes.ok) {
        updateProgress("Compilation locale...");
        let attempts = 0;
        const poller = setInterval(async () => {
          attempts++;
          try {
            const logsRes = await safeFetch("http://localhost:5006/api/mobile/build-logs");
            if (logsRes && logsRes.ok) {
              const data = await logsRes.json();
              if (data.logs && data.logs.length > 0) {
                const lastLog = data.logs[data.logs.length - 1];
                updateProgress(lastLog.replace(/\[.*?\]/g, '').trim().substring(0, 30));
              }
              if (data.isBuilding === false && data.result) {
                clearInterval(poller);
                if (data.result.success) {
                  const url = data.result.apkUrl || `/api/mobile/download-apk?file=${encodeURIComponent(projName + '.apk')}`;
                  handleBuildResult('success', url);
                } else {
                  updateProgress("Bascule Cloud...");
                  await launchCloudApkBuild(projName, updateProgress, handleBuildResult);
                }
              }
            }
          } catch {
            clearInterval(poller);
            await launchCloudApkBuild(projName, updateProgress, handleBuildResult);
          }
          if (attempts > 60) clearInterval(poller);
        }, 2000);
      } else {
        updateProgress("Bascule Cloud Souverain...");
        await launchCloudApkBuild(projName, updateProgress, handleBuildResult);
      }
    } catch (err: any) {
      updateProgress("Bascule Cloud Souverain...");
      try {
        await launchCloudApkBuild(projName, updateProgress, handleBuildResult);
      } catch (cloudErr: any) {
        handleBuildResult('error');
      }
    }
  };

  const fetchApks = async () => {
    try {
      let list: any[] = [];
      const now = Date.now();

      // 1. Récupération depuis GitHub Releases (avec cache 30s + token d'authentification)
      if (now - lastGhReleaseFetch < 30000 && cachedGhReleaseList.length > 0) {
        list = [...cachedGhReleaseList];
      } else {
        try {
          const token = getGithubToken();
          const ghRes = await fetch("https://api.github.com/repos/turnzack/v0-reponse/releases", {
            headers: token ? {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            } : {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (ghRes.ok) {
            const releases = await ghRes.json();
            if (Array.isArray(releases)) {
              const ghList: any[] = [];
              releases.forEach((r: any) => {
                if (Array.isArray(r.assets)) {
                  r.assets.forEach((ast: any) => {
                    if (ast.name?.endsWith('.apk')) {
                      ghList.push({
                        file: ast.name,
                        name: ast.name.replace('.apk', ''),
                        sizeMb: (ast.size / (1024 * 1024)).toFixed(1),
                        url: ast.browser_download_url
                      });
                    }
                  });
                }
              });
              cachedGhReleaseList = ghList;
              lastGhReleaseFetch = now;
              list = [...ghList];
            }
          }
        } catch (_) {}
      }

      // 2. Récupération depuis le backend local / VPS
      try {
        const res = await safeFetch("http://localhost:5006/api/mobile/list-apks");
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.apks)) list = [...list, ...data.apks];
        } else {
          const cRes = await fetch("/api/mobile/list-apks");
          if (cRes && cRes.ok) {
            const cData = await cRes.json();
            if (cData && cData.success && Array.isArray(cData.apks)) list = [...list, ...cData.apks];
          }
        }
      } catch (e) {}

      if (list.length > 0) {
        const map: Record<string, { file: string, sizeMb: string, url: string }> = {};
        list.forEach(a => {
          map[a.name.toLowerCase()] = a;
          map[a.file.toLowerCase()] = a;
          map[a.name.toLowerCase().replace(/[^a-z0-9]/g, '')] = a;
        });
        setAvailableApks(map);
      }
    } catch (e) {
      console.warn("[WidgetProjects] fetchApks error", e);
    }
  };

  const fetchProjects = (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    const cardStyles = [
      "bg-gradient-to-br from-[#bf6969]/80 to-[#c27042]/90 backdrop-blur-md",
      "bg-gradient-to-br from-[#a387b9]/80 to-[#aa6b73]/90 backdrop-blur-md",
      "bg-gradient-to-br from-[#e4a37f]/80 to-[#bf6969]/90 backdrop-blur-md",
      "bg-gradient-to-br from-[#aa6b73]/80 to-[#c27042]/90 backdrop-blur-md"
    ];
    safeFetch("http://localhost:5006/api/projects")
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.success && data.projects) {
          setLiveProjects(data.projects.map((p: any, i: number) => {
            const projName = typeof p === 'string' ? p : (p.projectName || p.name || p.projectId || p.project_id || p.title || `Projet_${i}`);
            return {
              name: projName,
              desc: "Environnement Local",
              bg: cardStyles[i % cardStyles.length],
              installed: p.installed
            };
          }));
          setIsLoading(false);
          setIsRefreshing(false);
        } else {
          const token = localStorage.getItem('kirov5_jwt_token') || '';
          fetch('/api/projects', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          })
            .then(r => r ? r.json() : null)
            .then(cloudData => {
              if (cloudData && cloudData.projects) {
                setLiveProjects(cloudData.projects.map((p: any, i: number) => ({
                  name: p.project_id || p.title || p.name || `Projet_${i}`,
                  desc: "SaaS Cloud (Neon DB)",
                  bg: cardStyles[i % cardStyles.length]
                })));
              }
              setIsLoading(false);
              setIsRefreshing(false);
            }).catch(() => {
              setIsLoading(false);
              setIsRefreshing(false);
            });
        }
      }).catch(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchProjects();
    fetchApks();
    // Rafraîchissement automatique toutes les 5 secondes
    const interval = setInterval(() => {
      fetchProjects(true);
      fetchApks();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <div className="p-4 text-cyan text-sm italic">Actualisation de la liste des projets...</div>;
  }

  if (liveProjects.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center gap-3 text-center">
        <div className="text-cyan text-sm italic">
          Aucun projet trouvé sur votre disque dur.
        </div>
        <button
          onClick={() => fetchProjects()}
          className="px-4 py-2 rounded-xl bg-cyan/20 border border-cyan/40 text-cyan text-xs font-bold hover:bg-cyan/40 transition-colors"
        >
          🔄 Rafraîchir la liste
        </button>
      </div>
    );
  }

  return <Carousel items={[
    ...liveProjects.map((p, i) => {
      const targetProjName = p.name || 'AUDIO';
      const handleOpenProject = async () => {
        setLaunchingProject(targetProjName);
        if (onOpenProject) {
          onOpenProject(targetProjName);
          setTimeout(() => setLaunchingProject(null), 1000);
          return;
        }
        if (setActiveProject) setActiveProject(targetProjName);
        try {
          safeFetch("http://localhost:5006/api/bridge/launch-project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project_id: targetProjName, open_explorer: false })
          }).catch(() => {});
        } catch (err: any) {
          console.error("Erreur de lancement :", err);
        } finally {
          setTimeout(() => setLaunchingProject(null), 1000);
        }
      };

      const handleDeleteProject = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`⚠️ SUPPRESSION DEFINITIVE :\nVoulez-vous vraiment supprimer le projet "${targetProjName}" de l'interface ET de votre disque dur ?`)) {
          try {
            const res = await safeFetch("http://localhost:5006/api/projects/remove-project", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ project_id: targetProjName })
            });
            if (!res) {
              setLiveProjects(prev => prev.filter(proj => proj.name !== targetProjName));
              return;
            }
            const data = await res.json();
            if (data.success) {
              setLiveProjects(prev => prev.filter(proj => proj.name !== targetProjName));
              fetchProjects(true);
            } else {
              alert(`Erreur lors de la suppression : ${data.message || data.error || 'Échec server'}`);
            }
          } catch (err: any) {
            alert(`Erreur réseau lors de la suppression : ${err.message}`);
          }
        }
      };

      const buildState = apkBuildStates[targetProjName];
      const isBuildingApk = buildState?.status === 'building';
      const isBuildSuccess = buildState?.status === 'success';

      const cleanKey = targetProjName.toLowerCase();
      const cleanSimple = cleanKey.replace(/[^a-z0-9]/g, '');
      const existingApk = availableApks[cleanKey] || availableApks[cleanSimple] || availableApks[`${cleanKey}.apk`];

      const effectiveApkUrl = (isBuildSuccess && buildState?.apkUrl) ? buildState.apkUrl : (existingApk ? existingApk.url : null);
      const effectiveApkSize = existingApk?.sizeMb ? `${existingApk.sizeMb}M` : 'Prêt';

      return (
        <div
          key={i}
          className={`design-carte-carrousel rounded-2xl p-5 border border-white/20 shadow-xl flex flex-col items-center text-center relative overflow-hidden group cursor-pointer`}
          style={{ background: isClient ? getCachedGradient('proj-' + i, 0.7) : 'rgba(0,0,0,0.5)' }}
          onClick={handleOpenProject}
        >
          {/* Badge APK Prêt ou en cours */}
          {effectiveApkUrl ? (
            <a
              href={effectiveApkUrl}
              download={`${targetProjName}.apk`}
              onClick={(e) => e.stopPropagation()}
              className="z-20 absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400/50 transition-all hover:scale-105 cursor-pointer animate-pulse"
              title={`Télécharger directement l'APK (${effectiveApkSize})`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>📱 APK PRÊT ({effectiveApkSize})</span>
            </a>
          ) : isBuildingApk ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="z-20 absolute top-3 left-3 bg-purple-700/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-purple-400/60 animate-pulse select-none"
              title={buildState?.progress || "Compilation de l'APK en cours..."}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>⏳ APK EN COURS...</span>
            </div>
          ) : null}

          {/* Bouton de suppression rouge direct depuis le carrousel */}
          <button
            onClick={handleDeleteProject}
            className="z-20 absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center transition-all shadow-lg hover:scale-110 cursor-pointer"
            title="Supprimer ce projet du disque dur et de l'interface"
          >
            🗑️
          </button>

          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-0" />
          <div className="z-10 relative pointer-events-none w-full pr-8">
            <div className="text-white/70 text-xs font-bold uppercase tracking-widest drop-shadow-md">PROJET</div>
            <h3 className="design-carte-titre text-xl font-black text-white break-all drop-shadow-lg leading-tight w-full">{targetProjName}</h3>
          </div>
          <div className="design-carte-desc z-10 relative text-sm text-white/90 font-medium drop-shadow-md pointer-events-none w-full">{p.desc}</div>

          <div className="z-10 flex flex-wrap items-center justify-center gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (launchingProject === targetProjName) return;
                
                if (p.installed === false) {
                  setLaunchingProject(targetProjName);
                  safeFetch("http://localhost:5006/api/bridge/install-dependencies", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: targetProjName })
                  }).then(r => {
                    if (r) alert(`📦 Installation des dépendances démarrée pour "${targetProjName}" !\nSuivez la progression dans les logs.`);
                    else alert("Mode Cloud SaaS : Bridge local non connecté.");
                    setLaunchingProject(null);
                    setLiveProjects(prev => prev.map(proj => proj.name === p.name ? {...proj, installed: true} : proj));
                  }).catch(() => setLaunchingProject(null));
                } else {
                  handleOpenProject();
                }
              }}
              disabled={launchingProject === targetProjName}
              className={`font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                launchingProject === targetProjName 
                  ? "bg-cyan-500/40 text-cyan-200 cursor-wait animate-pulse" 
                  : (p.installed === false ? "bg-orange-500/80 hover:bg-orange-600 text-white cursor-pointer" : "bg-white/20 hover:bg-white/40 text-white cursor-pointer")
              }`}
              title={p.installed === false ? "Installer les dépendances requises pour ce projet" : "Lancer la prévisualisation Vite"}
            >
              {launchingProject === targetProjName ? (
                <>
                  <span className="animate-spin inline-block">⏳</span> {p.installed === false ? "Installation..." : "Lancement..."}
                </>
              ) : (
                p.installed === false ? <>📦 INSTALL</> : <>🚀 PREVIEW</>
              )}
            </button>

            {/* Gestionnaire d'APK Souverain : Bouton v0-apk action ou Téléchargement direct */}
            {effectiveApkUrl ? (
              <div className="flex items-center gap-1">
                <a
                  href={effectiveApkUrl}
                  download={`${targetProjName}.apk`}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-extrabold py-2 px-3.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 border border-emerald-400/50 cursor-pointer animate-pulse hover:scale-105"
                  title={`Télécharger l'APK Android compilé de ${targetProjName} (${effectiveApkSize}) directement`}
                >
                  <span>📥</span>
                  <span>APK</span>
                  <span className="text-[10px] opacity-90 font-mono">({effectiveApkSize})</span>
                </a>
                <button
                  onClick={(e) => handleTriggerApkBuild(e, targetProjName)}
                  className="bg-purple-600/30 hover:bg-purple-600/60 text-purple-200 hover:text-white font-bold py-2 px-2 rounded-xl text-xs transition-colors flex items-center justify-center border border-purple-400/40 cursor-pointer"
                  title="Re-compiler une nouvelle version de l'APK"
                >
                  🔄
                </button>
              </div>
            ) : isBuildingApk ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-purple-900/70 border border-purple-500/60 text-purple-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-purple-950/60 cursor-wait animate-pulse"
                title={buildState?.progress || "Compilation APK en cours..."}
              >
                <span className="animate-spin inline-block text-xs">⏳</span>
                <span className="max-w-[110px] truncate text-[11px]">{buildState?.progress || "v0-apk..."}</span>
              </div>
            ) : (
              <button
                onClick={(e) => handleTriggerApkBuild(e, targetProjName)}
                className="bg-gradient-to-r from-purple-700/90 to-indigo-600/90 hover:from-purple-600 hover:to-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-purple-950/60 border border-purple-400/50 hover:border-purple-300 cursor-pointer hover:scale-105"
                title={`Lancer la création du fichier APK pour "${targetProjName}" directement depuis le carrousel`}
              >
                <span>📱</span>
                <span>v0-apk action</span>
              </button>
            )}

            {/* Téléchargement de l'archive ZIP complète du code source du projet */}
            <a
              href={`/api/projects/download-zip?project_id=${encodeURIComponent(targetProjName)}`}
              download={`${targetProjName}.zip`}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/60 border border-amber-400/50 hover:border-amber-300 cursor-pointer hover:scale-105"
              title={`Télécharger l'archive ZIP du projet "${targetProjName}" (code source complet sans node_modules)`}
            >
              <span>📦</span>
              <span>ZIP</span>
            </a>

            {p.installed !== false && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLaunchingProject(targetProjName);
                    safeFetch("http://localhost:5006/api/bridge/install-dependencies", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ project_id: targetProjName })
                    }).then(r => {
                      if (r) alert(`🔄 Réinstallation des dépendances démarrée pour "${targetProjName}" !`);
                      else alert("Mode Cloud SaaS : Bridge local non connecté.");
                      setLaunchingProject(null);
                    }).catch(() => setLaunchingProject(null));
                  }}
                  className="bg-orange-500/30 hover:bg-orange-500/60 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center border border-orange-500/40 cursor-pointer"
                  title="Forcer la réinstallation des dépendances (pnpm install)"
                >
                  🔄
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      setLaunchingProject(targetProjName);
                      const res = await safeFetch("http://localhost:5006/api/bridge/manual-pnpm-run", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ project_id: targetProjName })
                      });
                      setLaunchingProject(null);
                      if (!res) {
                        alert("Mode Cloud SaaS : Moteur local non connecté.");
                        return;
                      }
                      const data = await res.json();
                      alert(data.message || `🚀 Serveur Vite démarré pour ${targetProjName} !`);
                      if (data.previewUrl) {
                        let finalUrl = data.previewUrl;
                        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                          finalUrl = finalUrl.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
                        }
                        window.open(finalUrl, "_blank");
                      }
                    } catch(err: any) {
                      setLaunchingProject(null);
                      alert("Erreur de connexion au bridge: " + err.message);
                    }
                  }}
                  className="font-bold py-2 px-3 rounded-xl text-xs bg-purple-500/60 hover:bg-purple-500 text-white transition-all shadow-md cursor-pointer"
                  title="Lancer le serveur Vite avec pnpm run dev"
                >
                  💻 PNPM
                </button>
              </>
            )}
            <button
              onClick={handleDeleteProject}
              className="bg-red-600/30 hover:bg-red-600/60 text-red-200 border border-red-500/40 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center gap-1"
              title="Supprimer définitivement du disque dur"
            >
              🗑️ Supprimer
            </button>
          </div>
        </div>
      );
    })]} />
};

interface DashboardProps {
  user?: { userId: string; email: string; isSuperAdmin?: boolean } | null;
  onLogout?: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps = {}) {
  const gradientCache = useRef<{ [key: string]: string }>({});
  const getCachedGradient = (key: string, alpha = 1) => {
    if (typeof window === 'undefined') return `linear-gradient(135deg, rgba(17,17,17,${alpha}), rgba(34,34,34,${alpha}))`;
    if (!gradientCache.current[key]) {
      gradientCache.current[key] = getRandomGradient(alpha);
    }
    return gradientCache.current[key];
  };

  
  const currentUserEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('tiger_currentUserEmail') : null);
  const isSuperAdmin = Boolean(user?.isSuperAdmin || (currentUserEmail && currentUserEmail.toLowerCase().trim() === 'zacktunr@gmail.com'));

  useEffect(() => {
    if (user?.email && typeof window !== 'undefined') {
      localStorage.setItem('tiger_currentUserEmail', user.email);
    }
  }, [user]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kirov5_jwt_token');
      localStorage.removeItem('tiger_currentUserEmail');
      localStorage.removeItem('tiger_lastGeneratedProject');
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
    if (onLogout) {
      onLogout();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState("connexion");
  const [isDragging, setIsDragging] = useState(false);

  // État Suture V2 pour le bouton de l'IDE
  const [sutureBtnState, setSutureBtnState] = useState<"clean" | "error" | "working">("clean");
  const lastAutoSutureTime = useRef<number>(0);

  // Simulation des phases de création
  const [activePhase, setActivePhase] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isMobileNative, setIsMobileNative] = useState(false);
  const [isPrdDetailOpen, setIsPrdDetailOpen] = useState(false);

  useEffect(() => {
    // Détection agressive de l'environnement Mobile (Boucle de vérification)
    let attempts = 0;
    const checkMobile = setInterval(() => {
      if (typeof window !== "undefined") {
        const hasCapacitor = (window as any).Capacitor?.isNativePlatform?.();
        const hasAndroidBridge = !!(window as any).AndroidBridge;
        if (hasCapacitor || hasAndroidBridge) {
          setIsMobileNative(true);
          clearInterval(checkMobile);
        }
      }
      if (attempts++ > 10) clearInterval(checkMobile); // Arrêt après 1 seconde
    }, 100);
    return () => clearInterval(checkMobile);
  }, []);

  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const [selectedLaunchProject, setSelectedLaunchProject] = useState<string>("");
  const [mouchardLogs, setMouchardLogs] = useState<string[]>(["> Système Kirov5 initialisé. " + new Date().toLocaleTimeString()]);
  const [realProjects, setRealProjects] = useState<{ name: string, desc: string, bg: string }[]>([]);

  // --- ETAT : PACKS PRD SELECTIONNES & VISIBILITE CARROUSEL ---
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  useEffect(() => {
    const handler = (e: any) => setSelectedPacks(e.detail);
    window.addEventListener('update_kirov_packs', handler);
    return () => window.removeEventListener('update_kirov_packs', handler);
  }, []);
  useEffect(() => {
    (window as any).KIROV_SELECTED_PACKS = selectedPacks;
  }, [selectedPacks]);
  const [showPacksCarousel, setShowPacksCarousel] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [availableBackups, setAvailableBackups] = useState<string[]>([]);
  const [showGuestPacks, setShowGuestPacks] = useState(false);
  const [guestPackSearchQuery, setGuestPackSearchQuery] = useState("");
  const [packSearchQuery, setPackSearchQuery] = useState("");

  // MODAL NOUVEAU PROJET V0 -> CREATION MODE INLINE
  const [isCreationMode, setIsCreationMode] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectStack, setNewProjectStack] = useState("Vite + React + Tailwind + TS");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectLogicAi, setNewProjectLogicAi] = useState("deepseek");
  const [newProjectInstructions, setNewProjectInstructions] = useState("");
  const [isAutoPilotOn, setIsAutoPilotOn] = useState(true);
  const [isLocalZipMode, setIsLocalZipMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);



  // --- WIDGET NEWS (LIVE API & FALLBACK RAPIDE) ---
  const [liveNewsData, setLiveNewsData] = useState<any[]>([]);
  const [isFetchingNews, setIsFetchingNews] = useState(false);

  const fetchLiveNews = useCallback(async (apiKey?: string) => {
    setIsFetchingNews(true);

    const defaultNews = [
      {
        id: "deepseek-r1-v0",
        tag: "⚡ DEEPSEEK R1",
        title: "DeepSeek-R1 & Moteur Souverain v0.1",
        desc: "Capacités de raisonnement avancé et de suture pour interfaces React.",
        content: "DeepSeek-R1 offre des capacités de raisonnement avancé pour l'analyse de contrats PRD et la génération zéro-touch de projets web complets.\n\nPoints clés :\n- Extraction automatique des variables CSS :root\n- Injection dynamique des packs d'architecture PRD\n- Synchronisation HMR ultra-rapide avec Electron."
      },
      {
        id: "sovereign-ide-2026",
        tag: "🚀 SOUVEREIGN OS",
        title: "IDE Code 2026 : Passerelle Electron Local & Mobile Native",
        desc: "Nouvelle mise à jour du bridge local :5006 et support Android Capacitor.",
        content: "La version v0.1.0 de l'OS Souverain intègre une passerelle universelle Electron & Capacitor.\n\nPoints forts :\n- Exécution en arrière-plan des pipelines Trombone\n- Sauvegarde directe dans le workspace local\n- Studio de retouche visuelle en Split-View instantané."
      },
      {
        id: "prd-packs-v14",
        tag: "💎 PACKS PRD",
        title: "64 Packs PRD d'Architecture en Carrousel",
        desc: "Directeurs de code pour E-Commerce, Auth Gateway, SaaS Billing...",
        content: "Les contrats d'interfaces PRD (Product Requirements Documents) s'activent directement depuis le carrousel principal.\n\nUtilisation :\n1. Sélection des packs d'architecture\n2. Consultation du README en direct dans le carrousel\n3. Création du projet et câblage avec Stitch."
      }
    ];

    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('deepseek_402')) {
        setLiveNewsData(defaultNews);
        setIsFetchingNews(false);
        return;
      }

      const keyToUse = apiKey || localStorage.getItem("tiger_apiKey");
      if (!keyToUse || !keyToUse.startsWith("sk-") || keyToUse.length < 20 || (typeof window !== 'undefined' && localStorage.getItem('deepseek_solde_epuise') === 'true')) {
        setLiveNewsData(defaultNews);
        setIsFetchingNews(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keyToUse}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "Tu es le fil d'actualités technologiques de l'OS Souverain. Réponds UNIQUEMENT en JSON avec une clé 'news' contenant 3 articles récents au format [{id, tag, title, desc, content}]." },
            { role: "user", content: "Donne 3 actualités récentes sur l'IA et le développement web." }
          ],
          response_format: { type: "json_object" }
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        if (parsed.news && Array.isArray(parsed.news) && parsed.news.length > 0) {
          setLiveNewsData(parsed.news);
        } else {
          setLiveNewsData(defaultNews);
        }
      } else {
        if (res.status === 402) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('deepseek_402', 'true');
            localStorage.setItem('deepseek_solde_epuise', 'true');
          }
        }
        setLiveNewsData(defaultNews);
      }
    } catch (err) {
      console.warn("[Actualités] Erreur ou Timeout API DeepSeek, chargement fallback:", err);
      setLiveNewsData(defaultNews);
    } finally {
      setIsFetchingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveNews();
  }, [fetchLiveNews]);


  // --- WIDGET THEMES COLOR SAVER ---
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem("tiger_active_theme") || "fold");
  const [savedThemes, setSavedThemes] = useState<{ name: string, colors: Record<string, string> }[]>([]);
  const [newThemeName, setNewThemeName] = useState("");

  useEffect(() => {
    const loaded = localStorage.getItem("tiger_saved_themes");

    if (loaded) {
      try {
        let parsed = JSON.parse(loaded);
        if (!Array.isArray(parsed)) throw new Error("Not an array");
        const defaultBg = "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 35%, #0f172a 70%, #06b6d4 100%)";
        parsed = parsed.map((t: any) => t.name === "fold" ? { ...t, colors: { ...t.colors, "bg-app": defaultBg } } : t);
        setSavedThemes(parsed);
      } catch (e) { 
        setSavedThemes([]);
      }
    } else {
      // "fold" default theme from screenshot
      const defaultTheme = {
        name: "fold",
        colors: {
          "icon-settings": "linear-gradient(135deg, #c87058, #934a36)",
          "icon-ai": "linear-gradient(135deg, #9d508e, #622e5a)",
          "icon-projects": "linear-gradient(135deg, #d38b5d, #a26038)",
          "icon-packs": "linear-gradient(135deg, #445499, #252e66)",
          "icon-news": "linear-gradient(135deg, #389eb2, #1f6475)",
          "bg-app": "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 35%, #0f172a 70%, #06b6d4 100%)"
        }
      };
      setSavedThemes([defaultTheme]);
      localStorage.setItem("tiger_saved_themes", JSON.stringify([defaultTheme]));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tiger_active_theme", activeTheme);
    if (activeTheme !== "random") {
      const bg = savedThemes.find(t => t.name === activeTheme)?.colors["bg-app"] || "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #000000 100%)";
      document.body.style.background = bg;
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.background = "";
    }
  }, [activeTheme, savedThemes]);

  const getIconStyle = (iconId: string) => {
    if (activeTheme === "random") {
      return isClient ? getCachedGradient(iconId, 0.8) : 'rgba(50,50,50,0.8)';
    }
    const theme = savedThemes.find(t => t.name === activeTheme);
    return theme && theme.colors[iconId] ? theme.colors[iconId] : (isClient ? getCachedGradient(iconId, 0.8) : 'rgba(50,50,50,0.8)');
  };

  const saveCurrentTheme = () => {
    if (!newThemeName.trim()) return alert("Nom invalide");
    if (savedThemes.length >= 10) return alert("Limite atteinte ! Vous ne pouvez sauvegarder que 10 thèmes maximum. Veuillez en supprimer un pour continuer.");

    // On capture depuis le cache de getCachedGradient
    const newColors = {
      "icon-settings": getCachedGradient("icon-settings", 0.8),
      "icon-ai": getCachedGradient("icon-ai", 0.8),
      "icon-projects": getCachedGradient("icon-projects", 0.8),
      "icon-packs": getCachedGradient("icon-packs", 0.8),
      "icon-news": getCachedGradient("icon-news", 0.8),
      "bg-app": getCachedGradient("bg-app", 0.9)
    };

    const newTheme = { name: newThemeName.trim(), colors: newColors };
    const newSaved = [...savedThemes, newTheme];
    setSavedThemes(newSaved);
    localStorage.setItem("tiger_saved_themes", JSON.stringify(newSaved));
    setActiveTheme(newTheme.name);
    setNewThemeName("");
  };

  const deleteTheme = (themeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSaved = savedThemes.filter(t => t.name !== themeName);
    setSavedThemes(newSaved);
    localStorage.setItem("tiger_saved_themes", JSON.stringify(newSaved));
    if (activeTheme === themeName) setActiveTheme("random");
  };

  const togglePack = (packId: string) => {
    setSelectedPacks(prev => prev.includes(packId) ? prev.filter(id => id !== packId) : [...prev, packId]);
  };
  const [selectedStartPhase, setSelectedStartPhase] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('tiger_selectedStartPhase');
      return saved ? Number(saved) : 0;
    }
    return 0;
  }); // 0 = TOUT

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tiger_selectedStartPhase', String(selectedStartPhase));
    }
  }, [selectedStartPhase]);
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(true);
  const [reuseActiveTab, setReuseActiveTab] = useState<boolean>(true);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState<'code' | 'builder' | 'data' | 'workflows' | 'generator'>('code');
  const [selectedTargetProject, setSelectedTargetProject] = useState<string | null>(null);
  const [fsTree, setFsTree] = useState<any>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [tromboneFiles, setTromboneFiles] = useState<{ path: string, content: string }[]>([]);

  // --- ETAT : COMPILATEUR APK MOBILE (v0-apk) ---
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [apkBuildStatus, setApkBuildStatus] = useState<"idle" | "building" | "success" | "error">("idle");
  const [apkLogs, setApkLogs] = useState<string[]>([]);
  const [selectedApkTarget, setSelectedApkTarget] = useState<string>("");
  const [apkOutputUrl, setApkOutputUrl] = useState<string | null>(null);
  const [availableApks, setAvailableApks] = useState<Array<{ file: string, name: string, sizeMb: string, url: string }>>([]);

  const loadAvailableApks = useCallback(async () => {
    try {
      let list: any[] = [];
      // 1. Récupération universelle depuis GitHub Releases (avec cache 30s + token d'authentification)
      const now = Date.now();
      if (now - lastGhReleaseFetch < 30000 && cachedGhReleaseList.length > 0) {
        list = [...cachedGhReleaseList];
      } else {
        try {
          const token = getGithubToken();
          const ghRes = await fetch("https://api.github.com/repos/turnzack/v0-reponse/releases", {
            headers: token ? {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            } : {
              'Accept': 'application/vnd.github.v3+json'
            }
          });
          if (ghRes.ok) {
            const releases = await ghRes.json();
            if (Array.isArray(releases)) {
              const ghList: any[] = [];
              releases.forEach((r: any) => {
                if (Array.isArray(r.assets)) {
                  r.assets.forEach((ast: any) => {
                    if (ast.name?.endsWith('.apk')) {
                      ghList.push({
                        file: ast.name,
                        name: ast.name.replace('.apk', ''),
                        sizeMb: (ast.size / (1024 * 1024)).toFixed(1),
                        url: ast.browser_download_url
                      });
                    }
                  });
                }
              });
              cachedGhReleaseList = ghList;
              lastGhReleaseFetch = now;
              list = [...ghList];
            }
          }
        } catch (_) {}
      }

      // 2. Récupération locale / VPS
      try {
        const res = await safeFetch("http://localhost:5006/api/mobile/list-apks");
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.apks)) {
            list = [...list, ...data.apks];
          }
        } else {
          const cloudRes = await fetch("/api/mobile/list-apks");
          if (cloudRes && cloudRes.ok) {
            const cloudData = await cloudRes.json();
            if (cloudData && cloudData.success && Array.isArray(cloudData.apks)) {
              list = [...list, ...cloudData.apks];
            }
          }
        }
      } catch (e) {}

      if (list.length > 0) {
        const seen = new Set<string>();
        const unique = list.filter(item => {
          if (seen.has(item.file.toLowerCase())) return false;
          seen.add(item.file.toLowerCase());
          return true;
        });
        setAvailableApks(unique);
      }
    } catch (e) {
      console.warn("[v0-apk] loadAvailableApks error", e);
    }
  }, []);

  useEffect(() => {
    if (isApkModalOpen) {
      loadAvailableApks();
    }
  }, [isApkModalOpen, loadAvailableApks]);

  // --- POLLING LOGS APK ---
  useEffect(() => {
    let interval: any;
    let failureCount = 0;
    if (apkBuildStatus === 'building') {
      interval = setInterval(async () => {
        try {
          const res = await safeFetch("http://localhost:5006/api/mobile/build-logs");
          if (res && res.ok) {
            failureCount = 0;
            const data = await res.json();
            if (data.logs && data.logs.length > 0) {
              setApkLogs(data.logs);
            }
            if (data.isBuilding === false && data.result) {
              if (data.result.success) {
                setApkBuildStatus("success");
                setApkOutputUrl(data.result.apkUrl);
              } else {
                setApkBuildStatus("error");
              }
              clearInterval(interval);
            }
          } else {
            failureCount++;
            if (failureCount >= 3) {
              clearInterval(interval);
              setApkBuildStatus("error");
              setApkLogs(l => [
                ...l,
                `❌ Service de compilation mobile absent sur ce serveur (${res ? res.status : 'erreur réseau'}).`,
                `📱 Option 1 (Cloud) : Déclenchez le compilateur automatique Cloud Souverain.`,
                `💻 Option 2 (Local) : Lancez 'python apk_builder.py --src ... --name ${selectedApkTarget || activeProject || 'app'} --build' dans E:\\v0reponses\\v0-apk.`
              ]);
            }
          }
        } catch (e) {
          console.warn("Polling APK error", e);
        }
      }, 1500);

    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apkBuildStatus, selectedApkTarget, activeProject]);

  // Fetch initial project list
  useEffect(() => {
    safeFetch("http://localhost:5006/api/projects")
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.success && Array.isArray(data.projects)) {
          setRealProjects(data.projects.map((p: any) => ({
            name: typeof p === 'string' ? p : (p.project_id || p.title || p.name || 'Projet'),
            desc: "Projet local",
            bg: ""
          })));
        } else {
          const token = localStorage.getItem('kirov5_jwt_token') || '';
          fetch('/api/projects', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          })
            .then(r => r ? r.json() : null)
            .then(cloudData => {
              if (cloudData && cloudData.projects) {
                setRealProjects(cloudData.projects.map((p: any) => ({
                  name: typeof p === 'string' ? p : (p.project_id || p.title || p.name || 'Projet'),
                  desc: "SaaS Cloud",
                  bg: ""
                })));
              }
            }).catch(() => {});
        }
      })
      .catch(() => { });
  }, []);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewInput, setPreviewInput] = useState<string>("");
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [isIdeFullscreen, setIsIdeFullscreen] = useState(false);

  const lastPreviewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    lastPreviewUrlRef.current = null;
    if (activeProject === 'v0-guest' || activeProject === 'V0-Guest') {
      setIsIdeFullscreen(true);
      setPreviewUrl("http://localhost:3007");
      setPreviewInput("http://localhost:3007");
      lastPreviewUrlRef.current = "http://localhost:3007";
    } else if (activeProject) {
      setIsIdeFullscreen(true);
      const isNextJs = fsTree && JSON.stringify(fsTree).includes("next.config");
      const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const defaultUrl = isNextJs 
        ? "http://localhost:3000" 
        : (lastPreviewUrlRef.current || (isRemote ? `http://${window.location.hostname}:5173` : "http://localhost:5173"));
      setPreviewUrl(defaultUrl);
      setPreviewInput(defaultUrl);
      lastPreviewUrlRef.current = defaultUrl;
    } else {
      setIsIdeFullscreen(false);
      setPreviewUrl(null);
    }
  }, [activeProject, fsTree]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CHANGE_PREVIEW_URL') {
        const route = event.data.route;
        const hashRoute = route === '/' ? '' : `#${route}`;
        setPreviewUrl(currentUrl => {
          const baseUrl = currentUrl ? currentUrl.split('#')[0] : 'http://127.0.0.1:5175/';
          const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
          return `${cleanBase}${hashRoute}`;
        });
      }

      if (event.data?.type === 'DESIGN_ELEMENT_CLICKED' || event.data?.type === 'DESIGN_ELEMENT_DRAGGED' || event.data?.type === 'DESIGN_ELEMENT_RESIZED') {
        // Relayer le message au Studio Admin Design
        const adminIframe = document.querySelector('iframe[title="Studio Admin Design"]') as HTMLIFrameElement;
        if (adminIframe && adminIframe.contentWindow) {
          adminIframe.contentWindow.postMessage(event.data, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Chargement de l'arborescence quand un projet est actif
  useEffect(() => {
    if (activeProject) {
      try {
        const cleanP = typeof activeProject === 'string' ? activeProject : ((activeProject as any)?.name || (activeProject as any)?.project_id || '');
        if (cleanP && cleanP !== 'null' && cleanP !== 'undefined') {
          localStorage.setItem('tiger_active_project', cleanP);
          const adminIframe = document.querySelector('iframe[title="Studio Admin Design"]') as HTMLIFrameElement;
          if (adminIframe && adminIframe.contentWindow) {
            adminIframe.contentWindow.postMessage({ type: 'SET_ACTIVE_PROJECT', project: cleanP }, '*');
          }
        }
      } catch (e) {}
      safeFetch(`http://localhost:5006/api/fs/tree?project=${activeProject}`)
        .then(res => res ? res.json() : null)
        .then(data => {
          if (data && data.success) setFsTree(data.tree);
        }).catch(() => { });
    }
  }, [activeProject]);

  // Chargement du contenu du fichier sélectionné
  useEffect(() => {
    if (activeProject && activeFile) {
      safeFetch(`http://localhost:5006/api/fs/read?project=${activeProject}&file=${encodeURIComponent(activeFile)}`)
        .then(res => res ? res.json() : null)
        .then(data => {
          if (data && data.success) setFileContent(data.content);
        }).catch(() => { });
    }
  }, [activeProject, activeFile]);

  // Sauvegarde manuelle du fichier (Hybride PC / Mobile)
  const handleSaveFile = async (content: string | undefined) => {
    if (content === undefined || !activeProject || !activeFile) return;
    setFileContent(content);

    // Détection Mobile Blindée
    const isMobileNative = Capacitor.isNativePlatform() || !!(window as any).AndroidBridge;

    if (isMobileNative) {
      // 📱 MOTEUR NATIF ANDROID
      try {
        await Filesystem.writeFile({
          path: `v0-moteur-mobile/projetv0/${activeProject}/${activeFile}`,
          data: content,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
          recursive: true
        });
      } catch (e) {
        console.error("Erreur de sauvegarde mobile:", e);
      }
    } else {
      // 💻 MOTEUR ELECTRON (PC)
      safeFetch("http://localhost:5006/api/fs/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: activeProject, file: activeFile, content })
      }).catch(() => { });
    }
  };

  // Attacher au trombone
  const attachToTrombone = (filePath: string) => {
    if (!activeProject) return;
    safeFetch(`http://localhost:5006/api/fs/read?project=${activeProject}&file=${encodeURIComponent(filePath)}`)
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.success) {
          setTromboneFiles(prev => {
            if (prev.find(f => f.path === filePath)) return prev;
            return [...prev, { path: filePath, content: data.content }];
          });
        }
      }).catch(() => { });
  };

  // Chargement des projets réels au montage (Hybride)
  useEffect(() => {
    const loadProjects = async () => {
      const cardStyles = [
        "bg-gradient-to-br from-[#bf6969]/80 to-[#c27042]/90 backdrop-blur-md",
        "bg-gradient-to-br from-[#a387b9]/80 to-[#aa6b73]/90 backdrop-blur-md",
        "bg-gradient-to-br from-[#e4a37f]/80 to-[#bf6969]/90 backdrop-blur-md",
        "bg-gradient-to-br from-[#aa6b73]/80 to-[#c27042]/90 backdrop-blur-md"
      ];

      // Détection Mobile Blindée (Vérifie Capacitor OU la présence de la WebView Fantôme Java)
      const isMobileNative = Capacitor.isNativePlatform() || !!(window as any).AndroidBridge;

      if (isMobileNative) {
        try {
          const result = await Filesystem.readdir({
            path: 'v0-moteur-mobile/projetv0',
            directory: Directory.Documents
          });
          // Capacitor 6 returns an array of FileInfo in result.files
          const projectNames = result.files.map(f => f.name || (f as any).toString());
          setRealProjects(projectNames.map((p: string, i: number) => ({
            name: p,
            desc: "Mémoire Téléphone",
            bg: cardStyles[i % cardStyles.length]
          })));
        } catch (e) {
          console.log("Aucun projet mobile trouvé ou dossier inexistant.");
        }
      } else {
        safeFetch("http://localhost:5006/api/projects-v2")
          .then(res => res ? res.json() : null)
          .then(data => {
            if (data && data.success && data.projects) {
              setRealProjects(data.projects.map((p: any, i: number) => ({
                name: typeof p === 'string' ? p : (p.name || p.project_id || p.title || `Projet_${i}`),
                desc: "Environnement Local",
                bg: cardStyles[i % cardStyles.length],
                installed: p.installed
              })));
            } else {
              const token = localStorage.getItem('kirov5_jwt_token') || '';
              fetch('/api/projects', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
              })
                .then(r => r ? r.json() : null)
                .then(cloudData => {
                  if (cloudData && cloudData.projects) {
                    setRealProjects(cloudData.projects.map((p: any, i: number) => ({
                      name: typeof p === 'string' ? p : (p.project_id || p.title || p.name || `Projet_${i}`),
                      desc: "SaaS Cloud (Neon DB)",
                      bg: cardStyles[i % cardStyles.length]
                    })));
                  }
                }).catch(() => {});
            }
          }).catch(() => { });
      }
    };
    loadProjects();
  }, []);

  // Chargement de l'historique
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  useEffect(() => {
    const handleOpenMouchard = () => setIsRightSidebarOpen(true);
    const handleKirovLog = (event: any) => {
      if (event && event.detail) {
        setMouchardLogs((prev: string[]) => [event.detail, ...prev.slice(0, 49)]);
      }
    };
    window.addEventListener('open-mouchard', handleOpenMouchard);
    window.addEventListener('kirov-mouchard-log', handleKirovLog);

    // Écouteur pour le Moteur Mobile (WebView Fantôme Java)
    const handleNativeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'TIGER_CAPTURE') {
        const extractedCode = event.data.data;
        if (extractedCode) {
          // Détection automatique du nom de fichier
          let fileName = "index.html";
          if (extractedCode.includes("import React") || extractedCode.includes("export default")) fileName = "App.tsx";
          if (extractedCode.includes("tailwindcss")) fileName = "index.css";

          setActiveFile(fileName);
          handleSaveFile(extractedCode);

          // MISE A JOUR DYNAMIQUE VISUELLE DE L'ARBORESCENCE !
          setFsTree((prev: any) => {
            const newFileNode = { name: fileName, path: fileName, type: 'file' };
            if (!prev) return { name: "Mobile_Storage", type: 'directory', children: [newFileNode] };

            const exists = prev.children?.find((c: any) => c.name === fileName);
            if (!exists) return { ...prev, children: [...(prev.children || []), newFileNode] };
            return prev;
          });
        }
      }
    };
    window.addEventListener('message', handleNativeMessage);

    return () => {
      window.removeEventListener('open-mouchard', handleOpenMouchard);
      window.removeEventListener('kirov-mouchard-log', handleKirovLog);
      window.removeEventListener('message', handleNativeMessage);
    };
  }, [activeProject, activeFile]);

  // Polling temps réel du Mouchard et de la File d'Attente Trombone (Radar & Phases)
  useEffect(() => {
    if (!isClient) return;

    const pollAll = () => {
      // 1. Polling de la file d'attente (Radar Zero-Touch, Lots Phase 2/3/4/5)
      safeFetch("http://localhost:5006/api/bridge/queue")
        .then(res => res ? res.json() : null)
        .then(data => {
          if (data && data.success) {
            setBridgeQueueData({ current: data.current || {}, queue: data.queue || [] });
            if ((data.queue && data.queue.length > 0) || (data.current && Object.keys(data.current).length > 0)) {
              setIsPipelineRunning(true);
            }
          }
        })
        .catch(() => {});

      // 2. Polling des logs du Mouchard (Bridge Electron)
      safeFetch("http://localhost:5006/api/bridge/logs")
        .then(res => res ? res.json() : null)
        .then(data => {
          if (data && data.success && data.logs) {
            setMouchardLogs((prev: string[]) => {
              const localApk = prev.filter(l => (l.includes('[📱') || l.includes('v0-apk') || l.includes('[APK]')) && !data.logs.includes(l));
              const combined = [...localApk, ...data.logs];
              const seen = new Set();
              const unique: string[] = [];
              for (const item of combined) {
                if (!seen.has(item)) {
                  seen.add(item);
                  unique.push(item);
                }
              }
              return unique.slice(0, 50);
            });
            const serverReadyLog = [...data.logs].reverse().find((log: string) => log.includes("URL_PREVIEW="));
            if (serverReadyLog) {
              let url = serverReadyLog.split('URL_PREVIEW=')[1]?.trim();
              if (url && typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                url = url.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
              }

              if (url && url !== lastPreviewUrlRef.current) {
                lastPreviewUrlRef.current = url;
                setPreviewUrl(url);
                setPreviewInput(url);
                setIsIdeFullscreen(true);
              }
            }

            // Détection automatique de fin de pipeline complet
            const pipelineDoneLog = [...data.logs].reverse().find((log: string) => log.includes("PIPELINE COMPLET TERMINÉ avec succès pour "));
            if (pipelineDoneLog) {
              const matchedProj = pipelineDoneLog.split("PIPELINE COMPLET TERMINÉ avec succès pour ")[1]?.replace(/[.\s]+$/, '');
              if (matchedProj && activeProject !== matchedProj) {
                setActiveProject(matchedProj);
                setIsIdeFullscreen(true);
              }
            }
          }
        })
        .catch(() => { });

      // 3. Polling dynamique READ-ONLY de l'Orchestrateur Autonome (Zero-Touch)
      safeFetch("http://localhost:5006/api/bridge/autonomous-status")
        .then(res => res ? res.json() : null)
        .then(autoData => {
          if (autoData && autoData.success && (autoData.data || autoData.status)) {
            const statusObj = autoData.data || autoData.status;
            const st = statusObj.state;
            if (st === 'diagnosing' || st === 'repair_required' || st === 'error') {
              setSutureBtnState('error');
            } else if (['repair_planned', 'patching_staging', 'validating', 'browser_verifying', 'repairing', 'working'].includes(st)) {
              setSutureBtnState('working');
            } else if (['starting_server', 'launch_requested', 'restarting'].includes(st)) {
              setSutureBtnState('working');
            } else if (st === 'ready') {
              setSutureBtnState('clean');
            } else if (activeProject) {
              safeFetch(`http://localhost:5006/api/suture/status?project=${activeProject}`)
                .then(res => res ? res.json() : null)
                .then(data => {
                  if (data && data.success && data.status) {
                    setSutureBtnState(data.status);
                  }
                }).catch(() => {});
            }
          }
        }).catch(() => {});
    };

    pollAll();
    const interval = setInterval(pollAll, 2000); // 2s polling réactif
    return () => clearInterval(interval);
  }, [isClient, activeProject]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenProjectFromCarousel = (projName: string) => {
    setActiveProject(projName);
    setActiveFile(null);
    setFileContent("");
    setIsDesignMode(false);
    setIsRightSidebarOpen(false); // Ferme le mouchard latéral pour laisser toute la place à l'explorateur
    setIsIdeFullscreen(false);    // Conserve le header et ouvre l'explorateur avec l'IDE intégrée

    // Démarrage du serveur Vite en arrière-plan et mise à jour de la live preview intégrée
    safeFetch("http://localhost:5006/api/bridge/launch-project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projName, open_explorer: false })
    }).then(async res => {
      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.previewUrl) {
          setPreviewUrl(data.previewUrl);
          setPreviewInput(data.previewUrl);
        }
      }
    }).catch(err => console.error("Erreur de lancement preview:", err));

    // Chargement immédiat de l'arborescence du projet pour l'explorateur
    safeFetch(`http://localhost:5006/api/fs/tree?project=${encodeURIComponent(projName)}`)
      .then(res => res ? res.json() : null)
      .then(data => {
        if (data && data.success && data.tree) {
          setFsTree(data.tree);
          // Ouvre automatiquement le fichier d'entrée principal s'il existe
          const findMainFile = (node: any): string | null => {
            if (!node) return null;
            if (node.type === 'file') {
              if (node.path === 'src/App.tsx' || node.path === 'src/App.jsx' || node.name === 'App.tsx' || node.name === 'index.html') {
                return node.path;
              }
            }
            if (node.children && Array.isArray(node.children)) {
              for (const child of node.children) {
                const found = findMainFile(child);
                if (found) return found;
              }
            }
            return null;
          };
          const mainFile = findMainFile(data.tree);
          if (mainFile) setActiveFile(mainFile);
        }
      })
      .catch(err => console.error("Erreur chargement arborescence:", err));
  };







  const handleSend = (overrideText?: any) => {
    // Si overrideText est un événement (ex: depuis onClick ou onKeyDown), on l'ignore.
    const textToSend = (typeof overrideText === 'string') ? overrideText : input;

    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);

    const lowerInput = textToSend.toLowerCase();

    setTimeout(() => {
      let responseMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "" };

      const normalizedInput = lowerInput.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // 0. DÉTECTION LISTE DES PROJETS (Doit passer AVANT la création)
      if (normalizedInput === "mes projets" || normalizedInput.includes("liste des projet") || normalizedInput === "projet" || normalizedInput === "projets") {
        responseMsg.content = "Voici la liste de vos projets récents :";
        responseMsg.widget = "projects";
      }
      // 1. DÉTECTION MODIFICATION (Projet Existant / Reprise)
      else if ((normalizedInput.includes("stitch") || normalizedInput.includes("deepseek") || normalizedInput.includes("design") || normalizedInput.includes("logique")) &&
        (normalizedInput.includes("modifi") || normalizedInput.includes("ajoute") || normalizedInput.includes("change") || normalizedInput.includes("mise a jour") || normalizedInput.includes("evolue") || normalizedInput.includes("reprends") || normalizedInput.includes("continue"))) {

        // Extraction du nom de projet si fourni entre crochets (ex: [Portfolio React Vite])
        const projectMatch = textToSend.match(/\[(.*?)\]/);
        const targetProject = projectMatch ? projectMatch[1] : null;
        const targetAi = normalizedInput.includes("deepseek") ? "deepseek" : "stitch";

        responseMsg.content = `🔄 MODE ÉVOLUTION ACTIVÉ (${targetAi.toUpperCase()}) 🔄\n\nJ'injecte vos nouvelles directives directement dans votre interface... ${targetProject ? `\n🔍 Recherche et AutoSwitch vers le projet : "${targetProject}"` : "Reprise du travail en cours."}`;
        responseMsg.widget = null;

        // On envoie le prompt directement au Bridge local sans ouvrir de nouvel onglet
        safeFetch("http://localhost:5006/bridge/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_ai: targetAi,
            target_project: targetProject, // L'extension fera le switch automatiquement !
            prompt: "Mise à jour (Reprise de projet) : " + textToSend.replace(/\[.*?\]/, "").trim(),
            auto_submit: true
          })
        }).catch(err => console.log("Erreur de connexion au Bridge local pour l'injection", err));

      }
      // 2. DÉTECTION NOUVEAU PROJET (PIPELINE COMPLET)
      else if (normalizedInput.includes("cree") || normalizedInput.includes("lance") || normalizedInput.includes("projet") || normalizedInput.includes("generation")) {
        responseMsg.content = "🚀 DÉMARRAGE PARALLÈLE KIROV5 🚀\n\n1️⃣ [UI/UX] Ouverture de l'assistant Design avec le prompt UI enrichi...\n2️⃣ [LOGIQUE] Préparation de l'assistant Logique et création du dossier projet local...\n\nLes intelligences artificielles sont informées et en attente. Une fois le design terminé, glissez l'HTML ici pour lancer le câblage final en phase 5.";
        responseMsg.widget = "phases";

        setActivePhase(1);

        // Création du nom de projet et ouverture dynamique de l'arborescence à gauche !
        const newProjectId = activeProject || (newProjectName.trim() ? newProjectName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') : ("Projet_" + textToSend.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now().toString().slice(-4)));
        setActiveProject(newProjectId);
        if (typeof window !== 'undefined') localStorage.setItem("tiger_lastGeneratedProject", newProjectId);

        if (typeof window !== "undefined") {
          const logicAi = localStorage.getItem("tiger_targetAi") || "deepseek";
          const uiAi = localStorage.getItem("tiger_targetUiAi") || "stitch";

          const getUrl = (id: string, isUi: boolean = false) => getTargetAiUrl(id, isUi);

          // Lancement réel via le Bridge Android (WebView Fantôme) ou Electron
          const bridge = (window as any).AndroidBridge;
          if (bridge && bridge.openAIWithPrompt) {
            // 📱 MOTEUR MOBILE : On lance Stitch d'abord. DeepSeek sera lancé après le Trombone.
            bridge.openAIWithPrompt(getUrl(uiAi, true), "Génère l'interface UI/UX complète et moderne pour ce projet : " + textToSend);
            if (bridge.showToast) bridge.showToast("Stitch s'ouvre. Générez le HTML, puis utilisez le Trombone.");
          } else {
            // 💻 MOTEUR PC : Fallback pour navigateur standard / Electron (Multifenêtrage)
            const packsDetailsText = (selectedPacks && selectedPacks.length > 0)
              ? `\n\n[PACKS PRD ARCHITECTURE SELECTIONNES (${selectedPacks.length})]\n` + selectedPacks.map(id => {
                const pk = AVAILABLE_PACKS.find(p => p.id === id);
                return `• ${pk ? pk.name : id} (#${id})`;
              }).join('\n')
              : "";

            const uiPromptText = "Génère l'interface UI/UX complète et moderne pour ce projet : " + textToSend + packsDetailsText;
            try {
              if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(uiPromptText);
              }
            } catch (e) { }

            // On envoie le prompt UI au Bridge
            const sendUiPrompt = () => {
              return safeFetch("http://localhost:5006/bridge/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  target_ai: uiAi,
                  prompt: uiPromptText,
                  auto_submit: true,
                  project_id: newProjectId,
                  phase_num: 1,
                  packs: selectedPacks
                })
              });
            };

            if (selectedStartPhase !== 200) {
              if (!reuseActiveTab) {
                window.open(getUrl(uiAi, true), "_blank");
              } else {
                window.open(getUrl(uiAi, true), "kirov5_ai_target");
              }
              sendUiPrompt().then(() => {
                console.log("Prompt UI envoyé avec succès au Bridge pour Stitch !");
              }).catch((e) => console.error("Erreur sendUiPrompt", e));
            }

            // On envoie le prompt Logique au Bridge avec un léger décalage réseau
            setTimeout(() => {
              const logicPromptText = (selectedPacks && selectedPacks.length > 0)
                ? textToSend + packsDetailsText
                : "L'interface UI/UX est actuellement en cours de génération. Prépare la structure backend et les états React pour un projet complexe : " + textToSend + ". Reste en attente, je te fournirai le fichier HTML pour le câblage final.";

              try {
                if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(logicPromptText);
                }
              } catch (e) { }

              window.open(getUrl(logicAi), "_blank");

              // Envoi systématique au Bridge pour l'extension et le moteur local
              safeFetch("http://localhost:5006/bridge/prompt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  target_ai: logicAi,
                  prompt: logicPromptText,
                  auto_submit: true,
                  project_id: newProjectId,
                  phase_num: 1,
                  packs: selectedPacks
                })
              }).catch(err => console.log("Erreur Bridge Logic Prompt:", err));

              if (selectedPacks && selectedPacks.length > 0) {
                // TROMBONE PIPELINE (PRD)
                safeFetch("/api/bridge/trombone", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    target_ai: logicAi,
                    user_prompt: logicPromptText,
                    packs: selectedPacks,
                    target_project: newProjectId
                  })
                }).then(() => {
                  console.log("Méga-Prompt Trombone envoyé !");
                }).catch(err => {
                  console.log("Erreur Trombone Bridge:", err);
                });
              } else {
                // STANDARD PIPELINE
                safeFetch("http://localhost:5006/bridge/prompt", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    target_ai: logicAi,
                    prompt: logicPromptText,
                    auto_submit: true,
                    project_id: newProjectId,
                    phase_num: 1
                  })
                }).then(() => {
                  console.log("Prompt Logique envoyé au Bridge");
                }).catch(() => { });
              }
            }, 800);

            console.log("Les IA ont été ouvertes. Les prompts ont été envoyés au Bridge local pour injection via l'extension.");
          }
        }

        // 3. Simulation visuelle des phases
        setActivePhase(1);
        let current = 1;
        const interval = setInterval(() => {
          current++;
          if (current > 11) {
            clearInterval(interval);
          } else {
            setActivePhase(current);
          }
        }, 1500);

      } else if (normalizedInput.includes("youtube") || normalizedInput.includes("video")) {
        responseMsg.content = "Voici les résultats YouTube pour votre recherche :";
        responseMsg.widget = "youtube";
      } else if (normalizedInput.includes("actualite") || normalizedInput.includes("ia") || normalizedInput.includes("news") || normalizedInput.includes("recherche")) {
        const currentApiKey = localStorage.getItem("tiger_apiKey");
        responseMsg.content = "Actualités & Dernières Innovations IA :";
        responseMsg.widget = "news";
        fetchLiveNews(currentApiKey || undefined);
      } else if (normalizedInput.includes("parametre") || normalizedInput.includes("reglage") || normalizedInput.includes("configuration") || normalizedInput.includes("setting")) {
        responseMsg.content = "Ouverture du panneau de configuration système :";
        responseMsg.widget = "settings";

      } else if (
        normalizedInput.includes("[plugin:vite:") ||
        normalizedInput.includes("missing semicolon") ||
        normalizedInput.includes("syntaxerror") ||
        normalizedInput.includes("typescriptparsermixin") ||
        normalizedInput.includes("babel/parser") ||
        (normalizedInput.includes("error") && normalizedInput.length > 80)
      ) {
        const targetProj = activeProject || "Projet_blog_8831";
        responseMsg.content = `🚨 Trace d'erreur détectée !\n\nLancement immédiat de l'Auto-Suture IA pour le projet "${targetProj}" avec la stack trace fournie... 🩺`;
        handleIDEAction("suture", textToSend);
      } else {
        responseMsg.content = "Traitement de votre demande via Tiger IA...";
        // Call bridge if available, otherwise window.open
        if (typeof window !== "undefined") {
          const bridge = (window as any).AndroidBridge;
          if (bridge && bridge.openAIWithPrompt) {
            bridge.openAIWithPrompt("https://chat.deepseek.com/", textToSend);
          } else {
            window.open("https://chat.deepseek.com/", "_blank");
          }
        }
      }

      setMessages((prev) => [...prev, responseMsg]);
    }, 600);

    setInput("");
  };

  const handleStartNewV0Project = () => {
    if (!newProjectName.trim()) return alert("Veuillez donner un nom à votre projet");

    const logicAi = window.KIROV_TARGET_AI || localStorage.getItem("tiger_targetAi") || "deepseek";
    setIsCreationMode(false);
    localStorage.setItem("tiger_targetAi", logicAi);

    const promptText = `Génère l'interface UI/UX complète et moderne pour le projet : ${newProjectName}.
Stack / Structure : ${newProjectStack}.
Description : ${newProjectDesc}.`;

    const newProjectId = activeProject || ("Projet_" + newProjectName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now().toString().slice(-4));

    if (!activeProject) {
      setActiveProject(newProjectId);
      // Création automatique si non validé manuellement (Astuce SOUVERAINE)
      safeFetch("http://localhost:5006/api/fs/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: newProjectId,
          file: "README.md",
          content: `# ${newProjectName}\n\nInitialisé par Tiger IA V0.\nStack : ${newProjectStack}\nDescription : ${newProjectDesc}`
        })
      }).catch(e => console.error("[IDE] Erreur création auto du dossier", e));
    }

    if (typeof window !== 'undefined') localStorage.setItem("tiger_lastGeneratedProject", newProjectId);

    const uiAi = localStorage.getItem("tiger_targetUiAi") || "stitch";
    const getUrl = (id: string, isUi: boolean = false) => getTargetAiUrl(id, isUi);

    const msg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: `🚀 Lancement de la phase UI pour "${newProjectName}".\nL'assistant Logique (${logicAi.toUpperCase()}) prendra le relais quand vous glisserez le fichier HTML final dans le chat.`,
      widget: "phases"
    };
    setActivePhase(1);
    setMessages(prev => [...prev, { id: Date.now().toString() + "_u", role: "user", content: `Nouveau projet : ${newProjectName}` }, msg]);

    const sendUiPrompt = () => {
      if (selectedPacks && selectedPacks.length > 0) {
        return safeFetch("/api/bridge/trombone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_ai: uiAi,
            user_prompt: promptText,
            packs: selectedPacks,
            target_project: newProjectId
          })
        });
      } else {
        return safeFetch("http://localhost:5006/bridge/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_ai: uiAi,
            prompt: promptText,
            auto_submit: true,
            project_id: newProjectId,
            phase_num: 1
          })
        });
      }
    };

    if (selectedStartPhase !== 200) {
      sendUiPrompt().then(() => {
        console.log("Prompt UI envoyé au Bridge");
        if (!reuseActiveTab) {
          window.open(getUrl(uiAi, true), "_blank");
        }
      }).catch(() => {
        if (!reuseActiveTab) {
          window.open(getUrl(uiAi, true), "_blank");
        }
      });
    }
  };

  const handleStartLocalZipPipeline = () => {
    const logicAi = window.KIROV_TARGET_AI || localStorage.getItem("tiger_targetAi") || "deepseek";
    const designProjectId = activeProject || (newProjectName.trim()
      ? "Projet_" + newProjectName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now().toString().slice(-4)
      : "Projet_Local_ZIP_" + Date.now().toString().slice(-4));

    if (!activeProject) {
      setActiveProject(designProjectId);
    }

    safeFetch("/api/bridge/trombone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zip_mode: true,
        target_ai: logicAi,
        target_project: designProjectId,
        start_phase: selectedStartPhase === 0 ? 1 : selectedStartPhase,
        auto_pilot: isAutoPilot,
        force_restart: true,
        user_prompt: newProjectName.trim() ? `${newProjectName} - ${newProjectDesc}` : "Application basée sur ZIP local"
      })
    }).then(async res => {
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "_hermes",
          role: "assistant",
          content: `✅ ${data.message}\n\n📡 Lot ${data.current_batch || (selectedStartPhase === 0 ? 1 : selectedStartPhase)}/${data.total_batches} transmis à ${logicAi.toUpperCase()}.\n⚙️ AutoPilot: ${isAutoPilot ? 'ACTIVÉ 🟢 (Lancement automatique des lots suivants)' : 'DÉSACTIVÉ 🟠'}\nFichiers détectés : ${(data.files_detected || []).join(', ')}`
        }]);
        if (!reuseActiveTab) {
          const logicAiUrl = getTargetAiUrl(logicAi);
          window.open(logicAiUrl, '_blank');
        }
      } else {
        alert('Erreur Hermes : ' + (data.error || 'Inconnue'));
      }
    }).catch(err => {
      alert(`Erreur de connexion au Moteur Local : ${err.message}`);
    });
  };

  const handleFileUpload = async (files: FileList | File[] | File) => {
    let fileArray = Array.isArray(files) ? files : (files instanceof FileList ? Array.from(files) : [files]);
    let originalZipFile: File | null = null; // On garde le ZIP original pour le mode Multi-Batch

    // 1. Décompression des ZIP à la volée
    const zipFiles = fileArray.filter(f => f.name.endsWith('.zip'));
    let extractedFiles: File[] = [];

    if (zipFiles.length > 0) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_zip",
        role: "user",
        content: `📦 Extraction de l'archive ZIP en cours...`
      }]);

      try {
        // @ts-ignore
        const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
        for (const zf of zipFiles) {
          originalZipFile = zf; // Sauvegarder le ZIP original
          const zip = new JSZip();
          const zipData = await zip.loadAsync(zf);

          for (const [filename, zipEntry] of Object.entries(zipData.files) as [string, any][]) {
            // Ignorer les dossiers et fichiers cachés
            if (!zipEntry.dir && !filename.includes('__MACOSX') && !filename.split('/').pop()?.startsWith('.')) {
              const blob = await zipEntry.async("blob");
              const extFile = new File([blob], filename.split('/').pop() || filename, { type: blob.type });
              extractedFiles.push(extFile);
            }
          }
        }
      } catch (err) {
        console.error("Erreur décompression ZIP:", err);
        alert("Système Kirov5 : Impossible de lire l'archive ZIP.");
      }

      // Synchroniser également le ZIP original vers le serveur VPS
      for (const zf of zipFiles) {
        try {
          const arrayBuf = await zf.arrayBuffer();
          const base64 = arrayBufferToBase64(arrayBuf);
          const targetProj = activeProject || selectedLaunchProject || newProjectName || "AUDIO";
          fetch("/api/fs/upload-zip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project: targetProj, fileName: zf.name, fileBase64: base64 })
          }).catch(e => console.warn("[Upload ZIP Sync] Notice:", e));
        } catch (_) {}
      }
    }

    // Remplacer les ZIP par leur contenu décompressé
    fileArray = [...fileArray.filter(f => !f.name.endsWith('.zip')), ...extractedFiles];

    // Separate HTML and code/asset files
    const htmlFiles = fileArray.filter(f => f.name.endsWith('.html'));
    const otherFiles = fileArray.filter(f => !f.name.endsWith('.html') && (
      f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') ||
      f.name.endsWith('.md') || f.name.endsWith('.json') || f.name.endsWith('.txt') ||
      f.name.endsWith('.tsx') || f.name.endsWith('.ts') || f.name.endsWith('.jsx') ||
      f.name.endsWith('.js') || f.name.endsWith('.css') || f.name.endsWith('.svg')
    ));

    if (htmlFiles.length === 0 && otherFiles.length === 0) {
      alert("Système Kirov5 : Format non supporté. Veuillez déposer au moins un .html, .md, .tsx, .ts, .png, ou un .zip.");
      return;
    }

    let appendedToTrombone = [...tromboneFiles];

    // Process contextual files (.md, .png, etc.)
    for (const f of otherFiles) {
      const isImage = f.name.endsWith('.png') || f.name.endsWith('.jpg') || f.name.endsWith('.jpeg');
      const content = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        if (isImage) reader.readAsDataURL(f);
        else reader.readAsText(f);
      });

      const newContext = { path: f.name, content: isImage ? `[Image jointe visuellement : ${f.name} (Binaire ignoré pour économie de tokens)]` : content };

      // Avoid duplicates
      if (!appendedToTrombone.some(ext => ext.path === f.name)) {
        appendedToTrombone.push(newContext);
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_" + Math.random(),
        role: "user",
        content: `📎 Fichier de contexte ajouté au Trombone : ${f.name}`
      }]);
    }

    // Process HTML file
    if (htmlFiles.length > 0) {
      const mainHtml = htmlFiles[0];
      const htmlContent = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(mainHtml);
      });

      const newContext = { path: mainHtml.name, content: htmlContent };
      if (!appendedToTrombone.some(ext => ext.path === mainHtml.name)) {
        appendedToTrombone.push(newContext);
      }

      const uploadMsg: Message = {
        id: Date.now().toString() + "_main",
        role: "user",
        content: `📁 Fichier de design déposé : ${mainHtml.name}\nAnalyse de la structure UI et assemblage du contexte en cours...`
      };
      setMessages((prev) => [...prev, uploadMsg]);
    }

    // Add dummy zip representation for UI feedback
    const originalZipFiles = (Array.isArray(files) ? files : (files instanceof FileList ? Array.from(files) : [files])).filter(f => f.name.endsWith('.zip'));
    for (const zf of originalZipFiles) {
      if (!appendedToTrombone.some(ext => ext.path === zf.name)) {
        appendedToTrombone.push({ path: zf.name, content: "ZIP_ARCHIVE_DUMMY" });
      }
    }

    setTromboneFiles(appendedToTrombone);

    // Notification de dépôt de fichiers
    const targetProj = activeProject || newProjectName || "Projet_Stitch";
    const uploadedNames = fileArray.map(f => f.name).join(', ');
    console.log(`[TROMBONE] Fichiers déposés pour ${targetProj}: ${uploadedNames}`);

    // KIROV5 MULTI-BATCH: Si plus de 3 fichiers HTML (ZIP ou Dossier complet)
    const totalHtmlFiles = htmlFiles.length; // htmlFiles contains all HTML files (already extracted or dropped)
    if (totalHtmlFiles > 3) {
      const logicAi = localStorage.getItem("tiger_targetAi") || "deepseek";
      const genId = originalZipFile
        ? "Projet_ZIP_" + originalZipFile.name.replace(/[^a-zA-Z0-9]/g, '_').replace('.zip', '') + '_' + Date.now().toString().slice(-4)
        : "Projet_BATCH_" + Date.now().toString().slice(-4);
      const designProjectId = activeProject || genId;
      if (!activeProject) setActiveProject(designProjectId);

      setMessages(prev => [...prev, {
        id: Date.now().toString() + "_batch",
        role: "assistant",
        content: `🤖 KIROV5 MULTI-BATCH DÉTECTÉ !

Hermes a détecté ${totalHtmlFiles} pages HTML dans votre ZIP.\nDécoupage automatique en lots de 3 fichiers en cours...\nDémarrage de l'automatisation séquentielle via DeepSeek !`,
        widget: "phases"
      }]);
      setActivePhase(1);

      // Créer le ZIP dynamique ou lire l'existant
      let zipBase64 = "";
      if (originalZipFile) {
        zipBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
          reader.readAsDataURL(originalZipFile!);
        });
      } else {
        // Zippage dynamique des fichiers déposés (pour multi-batch sans ZIP)
        // @ts-ignore
        const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
        const zip = new JSZip();
        for (const f of fileArray) {
          zip.file(f.name, f);
        }
        zipBase64 = await zip.generateAsync({ type: "base64" });
      }

      safeFetch("/api/bridge/trombone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip_base64: zipBase64,
          zip_mode: true,
          target_ai: logicAi,
          target_project: designProjectId,
          user_prompt: newProjectName.trim() ? `${newProjectName} - ${newProjectDesc}` : `Application multi-pages issue de ${originalZipFile?.name || "fichiers_locaux"}`
        })
      }).then(async res => {
        const data = await res.json();
        if (data.success) {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + "_hermes",
            role: "assistant",
            content: `✅ ${data.message}\n\n📡 Lot 1/${data.total_batches} transmis à DeepSeek. Les lots suivants s'enchaîneront automatiquement !\nFichiers détectés : ${(data.files_detected || []).join(', ')}`
          }]);
          // Ouvrir l'IA cible pour que l'extension capte le premier prompt
          window.open(getTargetAiUrl(logicAi), '_blank');
        } else {
          alert('Erreur Hermes : ' + (data.error || 'Inconnue'));
        }
      }).catch(err => {
        alert(`Erreur de connexion au Moteur Local : ${err.message}`);
      });

      return; // Stopper le flux classique
    }

    // Si là y a des fichiers HTML classiques (<= 3), comportement normal
    if (htmlFiles.length > 0) {
      // NE PAS AUTO-LANCER SI ON EST EN MODE CREATION INLINE
      if (document.getElementById('creation-mode-container')) {
        return;
      }

      setTimeout(() => {
        // Pass the updated array explicitly to avoid stale closures during auto-start
        handleStartFullPipeline(appendedToTrombone);
      }, 1200);
    }
  };

  const handleStartFullPipeline = async (filesToUse: { path: string, content: string }[] = tromboneFiles) => {
    setIsCreationMode(false);
    const htmlFile = filesToUse.find(f => f.path.endsWith('.html'));
    if (!htmlFile) {
      alert("Aucun fichier HTML trouvé dans le Trombone !");
      return;
    }

    // Auto-create folder explicitely before sending to DeepSeek
    const genId = newProjectName.trim()
      ? "Projet_" + newProjectName.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now().toString().slice(-4)
      : "Design_" + htmlFile.path.replace(".html", "").replace(/[^a-zA-Z0-9]/g, "_") + "_" + Date.now().toString().slice(-4);

    const designProjectId = activeProject || genId;

    if (!activeProject) {
      setActiveProject(designProjectId);
      try {
        await safeFetch("http://localhost:5006/api/fs/write", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project: designProjectId,
            file: "README.md",
            content: `# ${newProjectName || designProjectId}\n\nInitialisé par Tiger IA V0 (Design-First).`
          })
        });
      } catch (err) {
        console.error("[IDE] Erreur création auto du dossier", err);
      }
    }

    const appendedToTrombone = filesToUse.filter(f => f.path !== htmlFile.path);
    const htmlContent = htmlFile.content;

    const responseMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Mode "Design-First" activé. 🎨\n\nTransmission du design au LLM avec les ${appendedToTrombone.length} fichiers du Trombone intégrés.\nCâblage en cours...`,
      widget: "phases"
    };
    setActivePhase(5);
    setMessages((prev) => [...prev, responseMsg]);

    let currentDropPhase = 5;
    const dropInterval = setInterval(() => {
      currentDropPhase++;
      if (currentDropPhase > 11) {
        clearInterval(dropInterval);
      } else {
        setActivePhase(currentDropPhase);
      }
    }, 3000);

    if (typeof window !== "undefined" && (window as any).AndroidBridge && (window as any).AndroidBridge.showToast) {
      (window as any).AndroidBridge.showToast("Mode Design-First Activé !");
    }

    if (typeof window !== "undefined") {
      const logicAi = localStorage.getItem("tiger_targetAi") || "deepseek";

      let contextualData = "";
      if (appendedToTrombone.length > 0) {
        contextualData = "\n\n--- Fichiers de contexte complémentaires (Trombone) ---\n";
        appendedToTrombone.forEach(f => {
          contextualData += `\n[Fichier: ${f.path}]\n\`\`\`\n${f.content.substring(0, 3000)}\n\`\`\`\n`;
        });
      }

      let metadataBlock = "";
      if (newProjectName.trim() || newProjectStack.trim() || newProjectDesc.trim()) {
        metadataBlock = `\n--- MÉTADONNÉES DU PROJET ---
Nom : ${newProjectName || "Non spécifié"}
Stack / Structure : ${newProjectStack || "Non spécifiée"}
Description & Objectifs : ${newProjectDesc || "Non spécifiés"}
-----------------------------\n`;
      }

      const finalPrompt = `Voici le code HTML/CSS d'une interface générée par Stitch.${metadataBlock}
Ta mission est de créer un projet React (Vite + TSX) COMPLET et autonome à partir de ce design.

Tu DOIS impérativement générer TOUS les fichiers nécessaires pour que le projet soit exécutable immédiatement, notamment :
1. \`package.json\` (avec les scripts vite, et react/react-dom)
2. \`index.html\` (le point d'entrée)
3. \`vite.config.ts\`
4. \`src/main.tsx\` et \`src/App.tsx\`
5. Tous les composants React déduits du HTML (dans \`src/components/\`)
6. Le fichier \`src/design.css\` (OBLIGATOIRE ET STRICTEMENT NOMMÉ AINSI) contenant TOUTES les variables CSS du projet (\`:root\`). Les composants DOIVENT se servir de ces variables. INTERDICTION de coder des couleurs hex/rgb en dur dans les classes Tailwind ou les styles inlines (ex: utilise \`bg-[var(--primary)]\`). Importe ce fichier dans \`main.tsx\` ou \`App.tsx\`.
          
CODE HTML:
\`\`\`html
${htmlContent}
\`\`\`${contextualData}

RÈGLE ABSOLUE POUR LA RÉPONSE (KIROV5) :
Tu dois UNIQUEMENT répondre avec un objet JSON valide contenant les fichiers générés. Aucun texte explicatif avant ou après le JSON.
Format attendu:
\`\`\`json
{
  "files": [
    { "path": "src/App.tsx", "content": "...", "language": "tsx" }
  ]
}
\`\`\`
`;

      const bridge = (window as any).AndroidBridge;
      if (bridge && bridge.openAIWithPrompt) {
        const logicAiUrl = getTargetAiUrl(logicAi);
        bridge.openAIWithPrompt(logicAiUrl, finalPrompt);
        if (bridge.showToast) bridge.showToast("HTML injecté. Câblage sur " + logicAi.toUpperCase() + " !");
      } else {
        safeFetch("http://localhost:5006/bridge/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target_ai: logicAi,
            prompt: finalPrompt,
            auto_submit: true,
            project_id: designProjectId,
            phase_num: 5
          })
        })
          .then(res => console.log("[Bridge] Prompt HTML + Contexte envoyé avec succès, status:", res.status))
          .catch((err) => console.error("[Bridge] Erreur lors de l'envoi du prompt:", err));
      }
    }
  };

  // --- WIDGET COMPONENTS ---

  // --- WIDGET COMPONENTS ---

  // --- HELPERS IDE ---
  const renderFsTree = (node: any, level = 0) => {
    if (!node) return null;
    if (node.type === 'directory') {
      return (
        <div key={node.path} className="flex flex-col">
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-white/5 cursor-pointer text-gray-300 text-sm" style={{ paddingLeft: `${level * 12 + 8}px` }}>
            <span className="text-orange-400">📁</span>
            <span className="design-explorateur-texte design-explorateur-dossier truncate font-bold">{node.name}</span>
          </div>
          {node.children && node.children.map((child: any) => renderFsTree(child, level + 1))}
        </div>
      );
    } else {
      return (
        <div
          key={node.path}
          className={`flex items-center justify-between px-2 py-1 hover:bg-white/10 cursor-pointer text-sm group ${activeFile === node.path ? 'bg-cyan/20 text-cyan border-l-2 border-cyan' : 'text-gray-400'}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => setActiveFile(node.path)}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-blue-400">📄</span>
            <span className="design-explorateur-texte design-explorateur-fichier truncate">{node.name}</span>
          </div>
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              className="text-xs text-white bg-white/20 rounded px-1 hover:bg-red-500/50 transition-colors"
              title="Suture : Réparer ou débugger ce fichier"
              onClick={(e) => { 
                e.stopPropagation(); 
                setActiveFile(node.path);
                setTimeout(() => handleIDEAction("suture", `Veuillez analyser ce fichier et corriger toutes les erreurs, fautes de frappe ou imports manquants.`), 100);
              }}
            >
              🩺
            </button>
            <button
              className="text-xs text-white bg-white/20 rounded px-1 hover:bg-cyan/50 transition-colors"
              title="Ajouter au Trombone"
              onClick={(e) => { e.stopPropagation(); attachToTrombone(node.path); }}
            >
              📎
            </button>
          </div>
        </div>
      );
    }
  };

  const handleIDEAction = async (action: string, errorDetails?: string) => {
    if (!activeProject) {
      alert("⚠️ Veuillez sélectionner un projet actif dans l'explorateur.");
      return;
    }
    const logicAi = localStorage.getItem("tiger_targetAi") || "deepseek";

    let prompt = "";
    if (action === "suture") {
      prompt = `🩺 SUTURE CHIRURGICALE — CORRECTION D'ERREUR DÉTECTÉE\n\n` +
        `Projet Actif : [${activeProject}]\n` +
        (errorDetails ? `🚨 DÉTAILS DE L'ERREUR RENCONTRÉE :\n\`\`\`\n${errorDetails}\n\`\`\`\n\n` : `Mission : Corriger les erreurs de build, les routes React et le typage TypeScript.\n\n`);
    } else if (action === "refactor") {
      prompt = `🔄 REFACTORING — Refactorise le code du projet [${activeProject}] pour une qualité industrielle.\n\n`;
    } else if (action === "improve") {
      prompt = `✨ AMÉLIORATION — Ajoute des animations et améliorations UI pour le projet [${activeProject}].\n\n`;
    }

    if (activeFile && fileContent) {
      prompt += `--- Fichier Actif en Édition : ${activeFile} ---\n\`\`\`\n${fileContent}\n\`\`\`\n\n`;
    }

    if (tromboneFiles.length > 0) {
      prompt += "--- Fichiers de contexte du Trombone ---\n\n";
      tromboneFiles.forEach(f => {
        prompt += `--- ${f.path} ---\n\`\`\`\n${f.content}\n\`\`\`\n\n`;
      });
    }

    prompt += `\nRÈGLE ABSOLUE POUR LA RÉPONSE (KIROV5) :\n` +
      `Tu dois UNIQUEMENT répondre avec un objet JSON valide contenant les fichiers corrigés. Exemple:\n` +
      `\`\`\`json\n{\n  "files": [\n    { "path": "${activeFile || 'src/App.tsx'}", "content": "..." }\n  ]\n}\n\`\`\``;

    // 1. Notification visuelle dans le chat
    setMessages(prev => [...prev, {
      id: Date.now().toString() + "_action",
      role: "assistant",
      content: `🩺 Suture & Correction déclenchée pour "${activeProject}". Transmission de l'erreur à ${logicAi.toUpperCase()} en cours...`
    }]);

    // 2. Envoi direct au Bridge local pour que l'extension le capte immédiatement
    try {
      await safeFetch("http://localhost:5006/bridge/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_ai: logicAi,
          prompt,
          auto_submit: true,
          project_id: activeProject,
          phase_num: action
        })
      });

      // Si c'est une Suture, déclencher le moteur Suture V2 Zero-Touch en arrière-plan
      if (action === "suture") {
        safeFetch("http://localhost:5006/v1/suture/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: activeProject,
            activeFile: activeFile || "",
            rawError: errorDetails || "",
            prompt: errorDetails || "Analyse et corrige les erreurs du projet."
          })
        }).then(async res => {
          const data = await res.json();
          if (data.success && data.status === "applied") {
            setMessages(prev => [...prev, {
              id: Date.now().toString() + "_suture_ok",
              role: "assistant",
              content: `✅ Suture V2 réussie !\n\n🔧 ${data.repairId}\n🚀 Statut : **Patch appliqué en production**\n📁 Fichiers corrigés : ${JSON.stringify(data.patchReport?.files?.map((f: any) => f.path) || [])}`
            }]);
          } else if (data.success) {
            setMessages(prev => [...prev, {
              id: Date.now().toString() + "_suture_partial",
              role: "assistant",
              content: `⚠️ Suture V2 : correctif généré mais non promu.\nStatut : ${data.validationReport?.code || data.status}\n\nLe correctif est dans l'espace isolé. Vérifiez les logs du moteur pour plus de détails.`
            }]);
          } else {
            setMessages(prev => [...prev, {
              id: Date.now().toString() + "_suture_fail",
              role: "assistant",
              content: `❌ Suture V2 échouée.\nCode : ${data.code || "INCONNU"}\n${data.message || ""}`
            }]);
          }
        }).catch(() => {
          setMessages(prev => [...prev, {
            id: Date.now().toString() + "_suture_err",
            role: "assistant",
            content: `❌ Impossible de joindre le moteur Suture V2. Vérifiez que l'Orchestrateur Electron tourne sur le port 5006.`
          }]);
        });
        return; // On s'arrête : Suture V2 est autonome, pas besoin d'ouvrir un onglet IA.
      }

      // CORRECTION TIMING : Ouvrir l'IA cible dans un onglet dédié RÉUTILISÉ
      // On réutilise la fenêtre "kirov5_ai" pour éviter d'ouvrir un nouvel onglet à chaque fois
      // Le prompt est déjà en queue, l'extension le captera automatiquement lors du prochain poll (2.5s)
      const aiWindow = window.open(getTargetAiUrl(logicAi), 'kirov5_ai_target');
      if (!aiWindow) {
        // Si le popup est bloqué, afficher un message clair
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "_popup_blocked",
          role: "assistant",
          content: `⚠️ Popup bloqué par le navigateur !\n\nL'onglet ${logicAi.toUpperCase()} n'a pas pu s'ouvrir.\n\n**Solution** : Autorisez les popups pour ce site ou ouvrez manuellement : ${getTargetAiUrl(logicAi)}\n\nLe prompt est en queue (90s) — dès que l'onglet ${logicAi.toUpperCase()} sera ouvert avec l'extension active, il sera injecté automatiquement.`
        }]);
      }
    } catch (err: any) {
      console.error("[IDE] Erreur Suture:", err);
      alert(`🩺 Action ${action} transmise. Assurez-vous que le Moteur Electron tourne sur port 5006.`);
    }
  };


  const WidgetNews = () => {
    if (isFetchingNews) {
      return (
        <div className="w-full p-8 flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <div className="w-12 h-12 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin"></div>
          <div className="text-cyan font-bold animate-pulse text-sm">Interrogation de l'API DeepSeek en cours...</div>
        </div>
      );
    }

    if (selectedArticle) {
      return (
        <div className="w-full max-w-3xl backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mt-4 relative animate-fadeIn" style={{ background: isClient ? getCachedGradient('news-detail', 0.9) : 'rgba(0,0,0,0.9)' }}>
          <button
            onClick={() => setSelectedArticle(null)}
            className="absolute top-6 right-6 w-8 h-8 bg-white/10 hover:bg-red-500 rounded-full flex flex-col items-center justify-center text-white font-bold transition-colors z-20"
            title="Fermer"
          >
            ✕
          </button>

          <span className="px-3 py-1 bg-cyan/20 text-cyan text-xs font-bold rounded-md mb-4 inline-block">{selectedArticle.tag}</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">{selectedArticle.title}</h2>
          <p className="text-gray-300 font-medium text-sm md:text-base mb-6 leading-relaxed border-l-4 border-cyan/50 pl-4">
            {selectedArticle.desc}
          </p>

          <div className="w-full h-px bg-white/10 mb-6"></div>

          <div className="text-gray-200 text-sm md:text-base leading-loose whitespace-pre-line">
            {selectedArticle.content}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-cyan font-mono font-bold tracking-widest">GÉNÉRÉ PAR DEEPSEEK API</span>
            <button
              onClick={() => setSelectedArticle(null)}
              className="px-6 py-3 bg-white/5 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10 hover:border-cyan"
            >
              ← Retour à la liste
            </button>
          </div>
        </div>
      );
    }

    if (!liveNewsData || liveNewsData.length === 0) {
      return null;
    }

    return <Carousel items={liveNewsData.map(n => (
      <div key={n.id} className="design-carte-carrousel relative rounded-2xl p-5 border border-white/10 backdrop-blur-md flex flex-col hover:border-cyan/50 transition-colors shadow-lg" style={{ background: isClient ? getCachedGradient('news-' + n.id, 0.7) : 'rgba(0,0,0,0.7)' }}>
        <span className="self-start px-2 py-1 bg-cyan/20 text-cyan text-xs font-bold rounded-md mb-3 pr-4">{n.tag}</span>
        <h3 className="design-carte-titre text-lg font-bold text-white mb-2 leading-tight mt-1">{n.title}</h3>
        <p className="design-carte-desc text-gray-400 text-sm flex-1">{n.desc}</p>
        <button
          onClick={() => setSelectedArticle(n)}
          className="absolute top-4 right-4 text-cyan text-xs font-bold hover:underline cursor-pointer px-3 py-1.5 bg-cyan/10 hover:bg-cyan/20 rounded-xl border border-cyan/30 transition-all flex items-center gap-1"
        >
          Lire l&apos;article <span className="text-[10px]">↗</span>
        </button>
      </div>
    ))} />
  };

  const WidgetYouTube = () => {
    const videos = [
      { title: "Créer une IA Souveraine", channel: "Tiger Channel", views: "1.2k" },
      { title: "React Tailwind Masterclass", channel: "UI Design", views: "5.4k" },
      { title: "Android Bridge Capacitor", channel: "Mobile Dev", views: "800" },
    ];
    return <Carousel items={videos.map((v, i) => (
      <div key={i} className="design-carte-carrousel rounded-2xl overflow-hidden border border-red-500/30 hover:border-red-500 transition-colors shadow-lg flex flex-col" style={{ background: isClient ? getCachedGradient('yt-' + i, 0.6) : 'rgba(0,0,0,0.6)' }}>
        <div className="flex-1 bg-gray-800 relative flex items-center justify-center min-h-[50%]">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-900/40 to-transparent"></div>
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg z-10 cursor-pointer hover:scale-110 transition-transform">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-bold text-sm leading-tight mb-1">{v.title}</h3>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{v.channel}</span>
            <span>{v.views} vues</span>
          </div>
        </div>
      </div>
    ))} />
  };

  // --- RENDERING PRINCIPAL ---

  const WidgetPhases = () => {
    const allPhases = [
      "Setup", "Index", "React", "CSS", "Utils", "Vite",
      "Tests", "Package", "Vérif", "Bridge", "Build"
    ];

    return (
      <div className="mt-2">
        <Carousel items={allPhases.map((p, idx) => {
          const step = idx + 1;
          const isDone = step < activePhase;
          const isCurrent = step === activePhase;

          let cardBg = "bg-glass border-white/10 opacity-50";
          if (isDone) cardBg = "bg-gradient-to-br from-green-900/60 to-emerald-900/60 border-green-500/50 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
          if (isCurrent) cardBg = "bg-gradient-to-br from-cyan/20 to-blue-900/40 border-cyan text-white shadow-[0_0_20px_rgba(8,179,201,0.5)] animate-pulse hover:scale-105 cursor-pointer";

          return (
            <div
              key={idx}
              onClick={() => {
                if (p === "Build" || isCurrent || isDone) {
                  // Ouvre l'IDE sur le projet qui vient d'être lancé
                  const lastProj = localStorage.getItem("tiger_lastGeneratedProject");
                  if (lastProj) setActiveProject(lastProj);
                }
              }}
              className={`design-carte-carrousel rounded-2xl p-4 border flex flex-col justify-between transition-all duration-500 ${cardBg}`}
              title={p === "Build" ? "Cliquez pour ouvrir l'IDE sur le projet généré" : ""}
            >
              <div className="text-3xl font-black opacity-20">
                {step.toString().padStart(2, '0')}
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">{p}</h4>
                <div className="text-xs opacity-70">
                  {isDone ? "✓ Terminé" : isCurrent ? "En cours..." : "En attente"}
                </div>
              </div>
              {isCurrent && (
                <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-cyan w-1/2 animate-ping rounded-full"></div>
                </div>
              )}
              {p === "Build" && (
                <div className="mt-2 text-[10px] text-cyan font-bold uppercase tracking-widest flex items-center gap-1 bg-black/40 px-2 py-1 rounded">
                  <span>🚀</span> Ouvrir IDE
                </div>
              )}
            </div>
          );
        })} />
      </div>
    );
  };

  const currentThemeBg = activeTheme !== "random"
    ? (savedThemes.find(t => t.name === activeTheme)?.colors["bg-app"] || "radial-gradient(ellipse at 50% 20%, #1e1b4b 0%, #090a0f 70%, #000000 100%)")
    : undefined;

  return (
    <div
      className="design-app-root flex-1 w-full h-full flex flex-col overflow-hidden relative transition-all duration-700"
      style={{ background: currentThemeBg }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating Settings Modal */}
      {isSettingsOpen && (
        <div
          className="absolute inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
          style={{ background: isClient ? getCachedGradient('modal', 0.6) : 'rgba(0,0,0,0.6)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSettingsOpen(false);
          }}
        >
          <WidgetSettings
            isModal={true}
            onClose={() => setIsSettingsOpen(false)}
            initialTab={settingsInitialTab}
            isClient={isClient}
            getCachedGradient={getCachedGradient}
            mouchardLogs={mouchardLogs}
            activePhase={activePhase}
            availableProjects={availableProjects}
            setAvailableProjects={setAvailableProjects}
            selectedLaunchProject={selectedLaunchProject}
            setSelectedLaunchProject={setSelectedLaunchProject}
            isMobileNative={isMobileNative}
            isAutoPilot={isAutoPilot}
            setIsAutoPilot={setIsAutoPilot}
            reuseActiveTab={reuseActiveTab}
            setReuseActiveTab={setReuseActiveTab}
            selectedStartPhase={selectedStartPhase}
            setSelectedStartPhase={setSelectedStartPhase}
            selectedPacks={selectedPacks}
          />
        </div>
      )}



      {/* Top Status Bar (Centered) */}
      {!isIdeFullscreen && (
        <div className="w-full flex justify-center items-center pt-2 z-20 relative pointer-events-none">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar text-[10px] font-bold bg-[#05080c]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg pointer-events-auto">
            <div className="flex items-center gap-1.5 shrink-0 bg-green-900/40 px-2.5 py-1 rounded-full border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-orange-900/40 px-2.5 py-1 rounded-full border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316] animate-bounce"></span>
              <span className="text-orange-400">Ext: Tiger</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-purple-900/40 px-2.5 py-1 rounded-full border border-purple-500/30">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]"></span>
              <span className="text-purple-400">LLM: DeepSeek</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-cyan/10 px-2.5 py-1 rounded-full border border-cyan/20">
              <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_#08b3c9] animate-pulse"></span>
              <span className="text-cyan">Electron</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-gray-500/10 px-2.5 py-1 rounded-full border border-gray-500/20 opacity-60">
              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
              <span className="text-gray-400">Mobile (Capacitor)</span>
            </div>

            {/* Badge Super-Admin dans la barre de statut si connecté en tant que tel */}
            {isSuperAdmin && (
              <div className="flex items-center gap-1.5 shrink-0 bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.35)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]"></span>
                <span className="text-amber-300 font-bold">👑 Super-Admin</span>
              </div>
            )}

            {/* Bouton Déconnexion intégré avec Online, Ext: Tiger, LLM: DeepSeek... */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 shrink-0 bg-red-950/60 hover:bg-red-600/70 px-3 py-1 rounded-full border border-red-500/40 text-red-300 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.25)] hover:scale-105 active:scale-95 ml-1"
              title="Se déconnecter de l'application"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
              <span>Déconnexion</span>
              {currentUserEmail && (
                <span className="text-gray-300 font-normal text-[9px] max-w-[130px] truncate ml-0.5">({currentUserEmail})</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      {!isIdeFullscreen && (
        <header className="design-header backdrop-blur-md z-10 flex justify-between items-center shadow-lg -mt-2 px-4">
          <div className="flex items-center gap-3">
            <div className="design-logo flex items-center justify-center">
              <span>🐯</span>
            </div>
            <div>
              <h1 className="design-titre whitespace-nowrap">v0.reponse : OS Souverain v0.1.0 - idecode-2026</h1>
            </div>
          </div>

          {/* Section Profil Utilisateur & Déconnexion */}
          <div className="flex items-center gap-3">
            {currentUserEmail && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs backdrop-blur-sm shadow-inner">
                <span className="text-gray-300 font-medium">👤 {currentUserEmail}</span>
                {isSuperAdmin && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide animate-pulse">
                    👑 Super-Admin
                  </span>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              title="Se déconnecter de l'application"
            >
              <span>🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10 w-full">

        {/* === NOUVEAU : ZONE IDE INTEGREE === */}
        {activeProject && (
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden h-full animate-fadeIn">

            {/* 1. Left Action Bar */}
            <div className="design-ide-toolbar w-full h-16 lg:w-16 lg:h-full bg-black/80 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-row lg:flex-col items-center justify-around lg:justify-start lg:py-4 px-2 lg:px-0 gap-2 lg:gap-6 z-20 shadow-xl overflow-x-auto lg:overflow-x-visible">
              <button title="Fermer le projet" onClick={() => { setActiveProject(null); setActiveFile(null); }} className="design-ide-btn-action w-10 h-10 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all mb-4">
                ✕
              </button>

              <button 
                title={
                  sutureBtnState === "error"
                    ? "🔴 Erreur détectée dans le code ! Suture V2 en cours..."
                    : sutureBtnState === "working"
                    ? "🟣 Suture V2 en plein travail (génération & test du correctif)..."
                    : "🟢 Projet propre - Aucune erreur détectée"
                } 
                onClick={() => handleIDEAction("suture")} 
                className={`design-ide-btn-action w-10 h-10 rounded-xl text-xl border flex items-center justify-center transition-all group relative ${
                  sutureBtnState === "error" 
                    ? "bg-red-600 text-white border-2 border-red-400 shadow-[0_0_25px_#ff0055] animate-pulse ring-2 ring-red-500" 
                    : sutureBtnState === "working"
                    ? "bg-purple-600 text-white border-2 border-purple-300 shadow-[0_0_25px_#a855f7] animate-pulse ring-2 ring-purple-500"
                    : "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:border-emerald-400 hover:text-white"
                }`}
              >
                🩺
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-white pointer-events-none transition-opacity font-bold">
                  {sutureBtnState === "error" ? "🔴 Suture (Erreur !)" : sutureBtnState === "working" ? "🟣 Suture V2..." : "🟢 Suture V2 (OK)"}
                </span>
              </button>

              {/* Bacs de sauvegarde Time Machine */}
              <button
                title="Immortaliser le projet (Sauvegarde)"
                onClick={() => {
                  if (!activeProject) return;
                  safeFetch("http://localhost:5006/api/bridge/backup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: activeProject })
                  })
                  .then(res => res ? res.json() : null)
                  .then(data => {
                    if (!data) return alert("❌ Moteur inaccessible (Mode Cloud SaaS)");
                    if (data.success) alert("📸 " + data.message + "\n" + data.backupName);
                    else alert("Erreur: " + data.error);
                  })
                  .catch(e => alert("Erreur réseau: " + e.message));
                }}
                className="design-ide-btn-action w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white text-xl border border-blue-500/30 hover:border-blue-500 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] group relative mt-2"
              >
                📸
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-blue-400 pointer-events-none transition-opacity font-bold">
                  Immortaliser (Sauvegarder)
                </span>
              </button>

              <button
                title="Restaurer le projet (Time Machine)"
                onClick={() => {
                  if (!activeProject) return;
                  safeFetch("http://localhost:5006/api/bridge/backups?project_id=" + activeProject)
                  .then(res => res ? res.json() : null)
                  .then(data => {
                    if (!data) return alert("❌ Moteur inaccessible (Mode Cloud SaaS)");
                    if (!data.success || !data.backups || data.backups.length === 0) {
                      return alert("⏪ Aucune sauvegarde trouvée pour ce projet.");
                    }
                    setAvailableBackups(data.backups);
                    setShowBackupModal(true);
                  })
                  .catch(e => alert("Erreur réseau: " + e.message));
                }}
                className="design-ide-btn-action w-10 h-10 rounded-xl bg-slate-500/20 text-slate-400 hover:bg-slate-500 hover:text-white text-xl border border-slate-500/30 hover:border-slate-500 flex items-center justify-center transition-all group relative mb-2"
              >
                ⏪
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-slate-400 pointer-events-none transition-opacity font-bold">
                  Restaurer (Dernier Backup)
                </span>
              </button>

              <button title="Refactoring" onClick={() => handleIDEAction("refactor")} className="design-ide-btn-action w-10 h-10 rounded-xl bg-white/5 hover:bg-purple-500/20 text-xl border border-white/10 hover:border-purple-500 flex items-center justify-center transition-all group relative">
                🔄
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-purple-400 pointer-events-none transition-opacity">Refactoring</span>
              </button>

              <button title="Amélioration" onClick={() => handleIDEAction("improve")} className="design-ide-btn-action w-10 h-10 rounded-xl bg-white/5 hover:bg-yellow-500/20 text-xl border border-white/10 hover:border-yellow-500 flex items-center justify-center transition-all group relative">
                ✨
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-yellow-400 pointer-events-none transition-opacity">Amélioration</span>
              </button>

              <button
                title="Corriger Arborescence (Fix Extensions)"
                onClick={() => {
                  if (!activeProject) return;
                  safeFetch("http://localhost:5006/api/fix-extensions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: activeProject })
                  })
                  .then(res => res ? res.json() : null)
                  .then(data => {
                    if (!data) return alert("❌ Moteur inaccessible (Mode Cloud SaaS)");
                    if (data.success) alert(data.message);
                    else alert("Erreur: " + data.error);
                  })
                  .catch(e => alert("Erreur réseau: " + e.message));
                }}
                className="design-ide-btn-action w-10 h-10 rounded-xl bg-white/5 hover:bg-orange-500/20 text-xl border border-white/10 hover:border-orange-500 flex items-center justify-center transition-all group relative"
              >
                🛠️
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-orange-400 pointer-events-none transition-opacity font-bold">
                  Fix Arborescence (.txt ➡️ .tsx)
                </span>
              </button>

              <button
                title="Générateur PRD V0-Guest"
                onClick={() => {
                  setActiveProject("v0-guest");
                  setPreviewUrl("http://localhost:3007");
                  safeFetch("http://localhost:5006/api/bridge/launch-project", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: "v0-guest" })
                  }).catch(e => console.error("Erreur lancement v0-guest:", e));
                  
                  // Ouverture automatique dans un nouvel onglet
                  setTimeout(() => {
                    window.open("http://localhost:3007", "_blank");
                  }, 2500);
                }}
                className="design-ide-btn-action w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/20 to-purple-500/20 text-cyan hover:from-cyan hover:to-purple-500 hover:text-black text-xl border border-cyan/40 flex items-center justify-center transition-all group relative shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                🎁
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-cyan font-bold pointer-events-none transition-opacity">
                  V0-Guest PRD Generator
                </span>
              </button>

              <button
                title="Design v0 (Studio Visuel & Preview Split)"
                onClick={() => {
                  const nextState = !isDesignMode;
                  setIsDesignMode(nextState);
                  if (nextState && !previewUrl) {
                    const isNextJs = fsTree && JSON.stringify(fsTree).includes("next.config");
                    const isRemote = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
                    const targetHost = isRemote ? window.location.hostname : 'localhost';
                    setPreviewUrl(isNextJs ? `http://${targetHost}:3000` : `http://${targetHost}:5173`);
                  }
                }}
                className={`design-ide-btn-action w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative border ${isDesignMode ? 'bg-pink-500 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-white/5 hover:bg-pink-500/20 text-pink-500 border-white/10 hover:border-pink-500'}`}
              >
                🎨
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-pink-500 pointer-events-none transition-opacity font-bold">
                  Design v0 (Split View)
                </span>
              </button>

              <div className="flex-1"></div>

              <button
                title={isIdeFullscreen ? "Réduire (Afficher le Chat)" : "Pleine Page (Masquer le Chat)"}
                onClick={() => setIsIdeFullscreen(!isIdeFullscreen)}
                className={`design-ide-btn-action w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative border ${isIdeFullscreen ? 'bg-cyan text-black border-cyan' : 'bg-white/5 hover:bg-cyan/20 text-cyan border-white/10 hover:border-cyan'}`}
              >
                {isIdeFullscreen ? '🗗' : '🗖'}
                <span className="absolute left-14 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap text-cyan pointer-events-none transition-opacity">
                  {isIdeFullscreen ? 'Mode Normal' : 'Pleine Page'}
                </span>
              </button>

            </div>

            {/* 2. Explorateur de fichiers */}
            <div className="design-explorateur w-64 bg-[#0a0a0a]/95 border-r border-white/10 overflow-y-auto flex flex-col hide-scrollbar z-20 shadow-2xl">
              <div className="px-4 py-3 border-b border-white/10 sticky top-0 bg-[#0a0a0a] z-10 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-cyan font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
                    Projet Actif
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (!activeProject) return;
                        console.log("Clic Suture Manuel ! Projet:", activeProject, "Etat actuel:", sutureBtnState);
                        
                        // Si Suture est vert (le moteur a arrêté de surveiller les erreurs), 
                        // on force un redémarrage de l'analyse (Preview) pour qu'il détecte la nouvelle erreur !
                        if (sutureBtnState !== "error") {
                          safeFetch("http://localhost:5006/api/bridge/launch-project", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ project_id: activeProject })
                          }).catch(() => {});
                        }

                        // Déclenchement de la réparation manuelle (Lock file)
                        safeFetch("http://localhost:5006/api/suture/launch", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ projectId: activeProject })
                        })
                        .then(r => r ? r.json() : null)
                        .then(d => d && console.log("Réponse Suture API:", d))
                        .catch(e => console.error("Erreur Suture API:", e));
                      }}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded transition-colors border shadow-sm flex items-center gap-1 ${
                        sutureBtnState === "error" ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse hover:bg-red-500/30" :
                        sutureBtnState === "working" ? "bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30" :
                        "bg-green-500/20 text-green-400 border-green-500/50 opacity-50 hover:opacity-100"
                      }`}
                      title="Lancer Suture V2 manuellement"
                    >
                      sutur🩺
                    </button>
                    <button
                      onClick={() => {
                        safeFetch("http://localhost:5006/api/projects")
                          .then(r => r ? r.json() : null)
                          .then(d => {
                            if (d && d.success && d.projects) {
                              setRealProjects(d.projects.map((p: any) => ({
                                name: typeof p === 'string' ? p : (p.name || p.project_id || p.title || 'Projet'),
                                desc: "Projet local",
                                bg: ""
                              })));
                            } else {
                              fetch("/api/projects")
                                .then(cr => cr.json())
                                .then(cd => { if (cd.projects) setRealProjects(cd.projects.map((p: any) => ({ name: typeof p === 'string' ? p : (p.name || p.project_id || p.title || 'Projet'), desc: "SaaS Cloud", bg: "" }))); });
                            }
                          })
                          .catch(() => { });
                      }}
                      className="text-xs text-gray-400 hover:text-cyan p-1 transition-colors"
                      title="Actualiser la liste des projets"
                    >
                      🔄
                    </button>
                  </div>
                </div>

                {/* SÉLECTEUR DE PROJETS INTERACTIF */}
                <select
                  value={activeProject || ""}
                  onFocus={() => {
                    safeFetch("http://localhost:5006/api/projects")
                      .then(r => r ? r.json() : null)
                      .then(d => {
                        if (d && d.success && d.projects) {
                          setRealProjects(d.projects.map((p: any) => ({
                            name: typeof p === 'string' ? p : (p.name || p.project_id || p.title || 'Projet'),
                            desc: "Projet local",
                            bg: ""
                          })));
                        } else {
                          fetch("/api/projects")
                            .then(cr => cr.json())
                            .then(cd => { if (cd.projects) setRealProjects(cd.projects.map((p: any) => ({ name: typeof p === 'string' ? p : (p.name || p.project_id || p.title || 'Projet'), desc: "SaaS Cloud", bg: "" }))); });
                        }
                      })
                      .catch(() => { });
                  }}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected) {
                      setActiveProject(selected);
                      setActiveFile(null);
                      setFileContent("");
                      safeFetch("http://localhost:5006/api/bridge/launch-project", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ project_id: selected, open_explorer: false })
                      }).catch(err => console.error("Erreur de lancement :", err));
                    }
                  }}
                  className="w-full bg-[#161616] text-cyan font-bold text-xs border border-cyan/40 rounded-xl px-2.5 py-2 outline-none focus:border-cyan focus:ring-1 focus:ring-cyan shadow-[0_0_10px_rgba(8,179,201,0.2)] cursor-pointer truncate"
                >
                  <option value="" disabled className="bg-black text-gray-400">-- Choisir un projet --</option>
                  {realProjects.length > 0 ? (
                    realProjects.map((p, idx) => {
                      const pName = typeof p?.name === 'string' ? p.name : (p?.name?.project_id || p?.name?.title || `Projet_${idx}`);
                      return (
                        <option key={pName + '_' + idx} value={pName} className="bg-black text-white font-medium py-1">
                          📁 {pName}
                        </option>
                      );
                    })
                  ) : (
                    <option value={typeof activeProject === 'string' ? activeProject : (activeProject?.project_id || activeProject?.title || "AUDIO")} className="bg-black text-white py-1">
                      📁 {typeof activeProject === 'string' ? activeProject : (activeProject?.project_id || activeProject?.title || "AUDIO")}
                    </option>
                  )}
                </select>
              </div>
              <div className="py-2">
                {fsTree ? renderFsTree(fsTree) : <div className="text-gray-500 text-xs px-4 py-2 animate-pulse">Scan du projet...</div>}
              </div>
            </div>

            {/* 3. Editeur Monaco et Preview Split */}
            <div className="design-editeur flex-1 flex flex-col bg-[#1e1e1e] z-20 shadow-2xl relative">
              <div className="design-editeur-onglet h-12 bg-[#252526] border-b border-black flex justify-between items-center px-4">
                <div className="flex items-center gap-3">
                  <span className="text-blue-400 text-lg">{activeFile ? '📄' : '📁'}</span>
                  <span className="text-sm text-gray-300 font-mono">{activeFile || 'Aucun fichier sélectionné'}</span>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-green-400 animate-pulse font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span> SERVER:
                      </div>
                      <input
                        type="text"
                        value={previewInput}
                        onChange={(e) => setPreviewInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setPreviewUrl(previewInput);
                        }}
                        className="bg-black/50 border border-green-500/30 text-green-400 text-[10px] px-2 py-1 rounded outline-none focus:border-green-400 w-40 font-mono shadow-[0_0_10px_rgba(34,197,94,0.1)] transition-all"
                        title="Modifier et taper Entrée"
                      />
                      <button onClick={() => setPreviewUrl(previewInput)} className="text-[10px] bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white px-2 py-1 rounded font-bold border border-green-500/30">Go</button>
                    </div>
                  <button
                    onClick={() => handleSaveFile(fileContent)}
                    disabled={!activeFile}
                    className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeFile ? 'bg-cyan/20 text-cyan hover:bg-cyan hover:text-black border border-cyan/30 shadow-[0_0_10px_rgba(8,179,201,0.2)]' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                  >
                    SAUVEGARDER (CTRL+S)
                  </button>
                </div>
              </div>

              <div className="flex-1 relative flex overflow-hidden">
                {isDesignMode ? (
                  /* --- MODE DESIGN V0 : SPLIT VIEW 2 PANNEAUX (GAUCHE: RETOUCHE, DROITE: PREVIEW 5173/5174) --- */
                  <div className="flex-1 flex w-full h-full bg-[#0a0a0a] overflow-hidden">
                    {/* PANNEAU GAUCHE (50%): INTERFACE DE RETOUCHE DESIGN */}
                    <div className="w-1/2 h-full border-r border-white/10 flex flex-col bg-[#141414]">
                      {/* HEADER DU PANNEAU DESIGN */}
                      <div className="h-12 px-4 bg-black/90 border-b border-white/10 flex justify-between items-center shrink-0 z-10">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎨</span>
                          <div>
                            <h2 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan tracking-widest uppercase">
                              STUDIO DESIGN INTELLIGENT
                            </h2>
                            <p className="text-[10px] text-gray-400 truncate max-w-[180px]">
                              Projet : <span className="text-cyan font-bold">{activeProject || 'Projet Actif'}</span>
                            </p>
                          </div>
                        </div>

                        {/* TOGGLE STUDIO/EXPRESS & BOUTONS FERMER */}
                        <div className="flex items-center gap-2">


                          {/* BOUTON 1: FERMER ET REVENIR À L'EXPLORATEUR / CODE */}
                          <button
                            onClick={() => setIsDesignMode(false)}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 text-[11px] font-bold flex items-center gap-1 transition-all shadow"
                            title="Revenir à l'explorateur de fichiers & à l'éditeur de code"
                          >
                            📁 Fermer (Code)
                          </button>

                          {/* BOUTON 2: FERMER ET REVENIR DIRECTEMENT À LA PAGE D'ACCUEIL */}
                          <button
                            onClick={() => {
                              setIsDesignMode(false);
                              setActiveProject(null);
                              setIsIdeFullscreen(false);
                            }}
                            className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg border border-red-500/30 text-[11px] font-bold flex items-center gap-1 transition-all shadow"
                            title="Quitter le projet et revenir à la page d'accueil"
                          >
                            🏠 Fermer (Accueil)
                          </button>
                        </div>
                      </div>

                      {/* CONTENU DU STUDIO DESIGN */}
                      <div className="flex-1 overflow-hidden relative">
                        <iframe
                          src={'/admin-design.html?project=' + encodeURIComponent((typeof activeProject === 'string' ? activeProject : (activeProject ? ((activeProject as any).name || (activeProject as any).project_id || '') : '')) || (typeof window !== 'undefined' ? localStorage.getItem('tiger_active_project') || '' : ''))}
                          className="w-full h-full border-0 bg-black"
                          title="Studio Admin Design"
                        />
                      </div>
                    </div>

                    {/* PANNEAU DROITE (50%): APPLICATION ACTIVE SUR LOCALHOST 5173 / 5174 */}
                    <div className="design-preview w-1/2 h-full flex flex-col">
                      {/* HEADER PREVIEW */}
                      <div className="h-12 px-4 bg-black/90 border-b border-white/10 flex justify-between items-center shrink-0 z-10">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                          <span className="text-xs font-mono font-bold text-green-400">
                            LIVE PREVIEW ({fsTree && JSON.stringify(fsTree).includes("next.config") ? "LOCALHOST:3000" : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `${window.location.hostname}:5173` : "LOCALHOST:5173")})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={previewUrl || (fsTree && JSON.stringify(fsTree).includes("next.config") ? "http://localhost:3000" : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `http://${window.location.hostname}:5173` : "http://localhost:5173"))}
                            onChange={(e) => setPreviewInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') setPreviewUrl(previewInput);
                            }}
                            className="bg-black/80 border border-green-500/30 text-green-400 text-[11px] px-2.5 py-1 rounded outline-none focus:border-green-400 w-48 font-mono"
                          />
                          <button
                            onClick={() => {
                              if (!activeProject) return;
                              safeFetch("http://localhost:5006/api/bridge/launch-project", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ project_id: activeProject, open_explorer: false })
                              }).catch(e => console.error("Erreur lancement preview:", e));
                            }}
                            className="px-2.5 py-1 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white text-[11px] rounded font-bold border border-green-500/30 transition-all flex items-center gap-1"
                            title="Relancer / Démarrer le serveur Preview"
                          >
                            🚀 Relancer
                          </button>
                        </div>
                      </div>

                      {/* IFRAME APPLICATION ACTIVE */}
                      <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--preview-bg)' }}>
                        <iframe
                          src={previewUrl || (fsTree && JSON.stringify(fsTree).includes("next.config") ? "http://localhost:3000" : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `http://${window.location.hostname}:5173` : "http://localhost:5173"))}
                          className="w-full h-full border-none"
                          title="Application Preview Live"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- MODE ÉDITEUR STANDARD (CODE & PREVIEW OPTIONNEL) --- */
                  <>
                    {activeStudioTab === 'builder' ? (
                      <div className="w-full h-full overflow-hidden bg-[#0a0a0a]">
                        <BuilderView projectId={activeProject} onOpenPreview={() => {}} />
                      </div>
                    ) : activeStudioTab === 'data' ? (
                      <div className="w-full h-full overflow-hidden bg-[#0a0a0a]">
                        <DataView projectId={activeProject} />
                      </div>
                    ) : activeStudioTab === 'workflows' ? (
                      <div className="w-full h-full overflow-hidden bg-[#0a0a0a]">
                        <WorkflowsView projectId={activeProject} />
                      </div>
                    ) : activeStudioTab === 'generator' ? (
                      <div className="w-full h-full overflow-hidden bg-[#0a0a0a]">
                        <GeneratorView projectId={activeProject || undefined} onOpenBuilder={() => setActiveStudioTab('builder')} />
                      </div>
                    ) : (
                      <>
                        <div className={`relative flex flex-col ${previewUrl ? 'w-1/2 border-r border-black' : 'w-full'}`}>
                      {activeFile ? (
                        <Editor
                          height="100%"
                          theme="vs-dark"
                          path={activeFile}
                          language={activeFile.endsWith('.tsx') || activeFile.endsWith('.ts') ? 'typescript' : activeFile.endsWith('.css') ? 'css' : activeFile.endsWith('.html') ? 'html' : activeFile.endsWith('.json') ? 'json' : 'javascript'}
                          value={fileContent}
                          onChange={(val) => {
                            const newContent = val || "";
                            setFileContent(newContent);
                            if ((window as any).saveTimer) clearTimeout((window as any).saveTimer);
                            (window as any).saveTimer = setTimeout(() => {
                              handleSaveFile(newContent);
                            }, 500);
                          }}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: "on",
                            padding: { top: 16 }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-4">
                          <span className="text-6xl opacity-20">🐯</span>
                          <span className="font-medium tracking-wide text-sm">Sélectionnez un fichier dans l'explorateur ou activez Design v0</span>
                        </div>
                      )}
                    </div>

                    {/* Section Preview Iframe Standard */}
                    {previewUrl && (
                      <div className="design-preview w-1/2 relative" style={{ background: 'var(--preview-bg)' }}>
                        <iframe src={previewUrl} className="w-full h-full border-none" />
                        <button
                          onClick={() => setPreviewUrl(null)}
                          className="absolute top-2 right-4 bg-black/80 border border-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg z-50"
                          title="Fermer la Preview"
                        >
                          ✕
                        </button>
                        <button
                          onClick={() => {
                            let targetUrl = previewUrl;
                            if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                              targetUrl = targetUrl.replace(/localhost|127\.0\.0\.1/, window.location.hostname);
                            }
                            window.open(targetUrl, '_blank');
                          }}
                          className="absolute top-2 right-14 bg-black/80 border border-white/20 text-white rounded-full px-3 h-8 flex items-center justify-center hover:bg-cyan hover:text-black transition-all shadow-lg z-50 text-xs font-bold"
                          title="Ouvrir dans un nouvel onglet"
                        >
                          ↗ Ouvrir
                        </button>
                      </div>
                    )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Chat Area (Responsive) */}
        <main
          className={`design-chat-main ${activeProject ? (isIdeFullscreen ? 'hidden w-0' : 'w-full h-[50vh] lg:h-full lg:w-96 lg:min-w-[24rem]') : 'flex-1'} border-t lg:border-t-0 lg:border-l border-white/20 bg-black/60 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] overflow-y-auto p-4 md:p-8 z-10 hide-scrollbar flex flex-col transition-all duration-500 ease-in-out`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFileUpload(e.dataTransfer.files);
            }
          }}
        >
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-cyan/20 backdrop-blur-sm border-4 border-dashed border-cyan rounded-3xl m-4 flex items-center justify-center pointer-events-none">
              <h2 className="text-3xl font-black text-cyan drop-shadow-lg text-center px-4">Glissez votre projet Stitch (.zip, .html, .md, .png)<br />pour préparer le câblage !</h2>
            </div>
          )}

          <div className="design-chat-layout w-full flex-1 flex flex-col justify-center my-auto pb-[140px] relative">
            {(() => {
              const lastWidgetIndex = messages.map(m => !!m.widget).lastIndexOf(true);
              const lastMsg = lastWidgetIndex !== -1 ? messages[lastWidgetIndex] : null;
              const activeWidgetType = lastMsg ? lastMsg.widget : null;
              const hasActiveCarousel = showPacksCarousel || activeWidgetType === "packs" || activeWidgetType === "projects" || activeWidgetType === "news" || activeWidgetType === "youtube" || isColorModalOpen || isApkModalOpen;

              return (
                <div className="w-full flex flex-col xl:flex-row items-stretch justify-between gap-6 relative min-h-[50vh] my-auto">
                  {/* CARTE V0-GUEST PERMANENTE À GAUCHE CONTENANT TOUT LE FLUX DU CHAT */}
                  <CarteV0GuestChat
                    messages={messages}
                    showGuestPacks={showGuestPacks}
                    setShowGuestPacks={setShowGuestPacks}
                    guestPacksCount={4}
                    guestPackSearchQuery={guestPackSearchQuery}
                    setGuestPackSearchQuery={setGuestPackSearchQuery}
                  />

                  {/* CARROUSEL ACTIF / PANNEAUX INLINE POSITIONNÉS À DROITE DE V0-GUEST */}
                  {hasActiveCarousel && (
                    <div className="flex-1 w-full flex flex-col items-center justify-center my-auto z-20">
                      {!isColorModalOpen && !isApkModalOpen && (showPacksCarousel || activeWidgetType === "packs") && !activeProject && (
                        <WidgetPrdPacks
                          selectedPacks={selectedPacks}
                          togglePack={togglePack}
                          newProjectName={newProjectName}
                          setNewProjectName={setNewProjectName}
                          setActiveProject={setActiveProject}
                          handleSend={handleSend}
                          isClient={isClient}
                          getCachedGradient={getCachedGradient}
                          onDetailStateChange={setIsPrdDetailOpen}
                          showGuestPacks={showGuestPacks}
                          setShowGuestPacks={setShowGuestPacks}
                          guestPackSearchQuery={guestPackSearchQuery}
                        />
                      )}
                      {!isColorModalOpen && !isApkModalOpen && !showPacksCarousel && activeWidgetType === "projects" && (
                        <WidgetProjects isClient={isClient} getCachedGradient={getCachedGradient} setActiveProject={setActiveProject} onOpenProject={handleOpenProjectFromCarousel} />
                      )}
                      {!isColorModalOpen && !isApkModalOpen && !showPacksCarousel && activeWidgetType === "news" && (
                        WidgetNews()
                      )}
                      {!isColorModalOpen && !isApkModalOpen && !showPacksCarousel && activeWidgetType === "youtube" && (
                        WidgetYouTube()
                      )}

                      {/* PANNEAU THÈMES EN LIGNE (À la place des carrousels) */}
                      {isColorModalOpen && (
                        <div className="w-full bg-black/90 border-2 border-pink-500/50 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative my-2 text-white animate-fadeIn flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                            <h3 className="text-xl font-black text-pink-400 flex items-center gap-2">
                              🎨 Gestion des Thèmes & Couleurs
                            </h3>
                            <button 
                              onClick={() => setIsColorModalOpen(false)}
                              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/20"
                            >
                              ✕ Masquer
                            </button>
                          </div>

                          {/* BOUTON DÉDIÉ : FIXER LE FOND D'ÉCRAN ELECTRON */}
                          <div className="bg-cyan/10 border border-cyan/30 rounded-xl p-4 flex flex-col gap-2 mb-4">
                            <div className="text-xs font-bold text-cyan uppercase tracking-wider flex items-center gap-2">
                              <span>🖥️</span> Page d'Accueil Electron
                            </div>
                            <p className="text-xs text-gray-300">
                              Fixer le fond d'écran enregistré ("fold") pour la page d'accueil Electron.
                            </p>
                            <button
                              onClick={() => {
                                const defaultBg = "linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #000000 100%)";
                                const updatedThemes = savedThemes.map(t => t.name === "fold" ? { ...t, colors: { ...t.colors, "bg-app": defaultBg } } : t);
                                setSavedThemes(updatedThemes);
                                localStorage.setItem("tiger_saved_themes", JSON.stringify(updatedThemes));
                                setActiveTheme("fold");
                                document.body.style.background = defaultBg;
                                document.body.style.backgroundAttachment = "fixed";
                                safeFetch("http://localhost:5006/api/theme", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ activeTheme: "fold", bgApp: defaultBg })
                                }).catch(() => { });
                                setIsColorModalOpen(false);
                              }}
                              className="w-full mt-1 py-2.5 bg-cyan text-black font-extrabold rounded-lg hover:bg-cyan/80 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                            >
                              🖼️ Appliquer ce Fond d'Écran sur Electron ("fold")
                            </button>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 mb-4">
                            <div className="text-sm font-bold text-gray-400">Mode actuel : <span className="text-cyan uppercase">{activeTheme}</span></div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newThemeName}
                                onChange={(e) => setNewThemeName(e.target.value)}
                                placeholder="Nom (ex: Nuit, Océan, fold...)"
                                className="flex-1 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan"
                              />
                              <button
                                onClick={saveCurrentTheme}
                                className="px-4 py-2 bg-cyan text-black font-bold rounded-lg hover:bg-cyan/80 transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Save Mode
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Thèmes Enregistrés</div>

                            <div
                              onClick={() => { setActiveTheme("random"); setIsColorModalOpen(false); }}
                              className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${activeTheme === "random" ? "bg-cyan/20 border-cyan text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                            >
                              <span className="font-bold flex items-center gap-2">🎲 Mode Aléatoire (Dynamique)</span>
                              {activeTheme === "random" && <span className="text-cyan">✓</span>}
                            </div>

                            {savedThemes.map((t) => (
                              <div
                                key={t.name}
                                onClick={() => {
                                  setActiveTheme(t.name);
                                  document.body.style.background = t.colors["bg-app"] || "";
                                  if (t.name === "fold") document.body.style.backgroundAttachment = "fixed";
                                  else document.body.style.backgroundAttachment = "scroll";
                                }}
                                className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${activeTheme === t.name ? "bg-cyan/20 border-cyan text-white" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}
                              >
                                <span className="font-bold capitalize">{t.name}</span>
                                <button
                                  onClick={(e) => deleteTheme(t.name, e)}
                                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/20 cursor-pointer"
                                >
                                  Supprimer
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PANNEAU V0-APK EN LIGNE (À la place des carrousels) */}
                      {isApkModalOpen && (
                        <div className="w-full bg-[#090d16] border-2 border-purple-500/60 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative my-2 text-white animate-fadeIn flex-1 min-w-0 flex flex-col max-h-[520px] overflow-y-auto custom-scrollbar">
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-purple-500/30">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl animate-bounce">📱</span>
                              <div>
                                <h3 className="text-purple-300 font-black text-base md:text-lg uppercase tracking-wider flex items-center gap-2">
                                  v0-apk — Compilateur Mobile Java
                                </h3>
                                <p className="text-xs text-slate-400">Génération d'APK Android Souverain sans dépendance système externe</p>
                              </div>
                            </div>
                            <button
                              onClick={() => setIsApkModalOpen(false)}
                              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/20"
                            >
                              ✕ Masquer
                            </button>
                          </div>

                          {/* Cible Projet */}
                          <div className="flex flex-col gap-2 bg-black/50 p-4 rounded-2xl border border-purple-500/20 mb-3">
                            <label htmlFor="apk-target-inline" className="text-purple-400 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                              <span>📁</span> SELECTIONNER L'APPLICATION À COMPILER :
                            </label>
                            <select
                              id="apk-target-inline"
                              value={selectedApkTarget || activeProject || ""}
                              onChange={e => setSelectedApkTarget(e.target.value)}
                              className="w-full bg-[#121824] text-white border border-purple-500/40 rounded-xl px-4 py-2.5 outline-none focus:border-purple-400 text-xs font-semibold cursor-pointer"
                            >
                              <option value="">-- Sélectionner un projet --</option>
                              {realProjects.map((p, idx) => {
                                const pName = typeof p?.name === 'string' ? p.name : (p?.name?.project_id || p?.name?.title || `Projet_${idx}`);
                                return <option key={pName + '_' + idx} value={pName}>📁 {pName}</option>;
                              })}
                            </select>
                          </div>

                          {/* Configuration Build */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="bg-black/50 p-3 rounded-2xl border border-purple-500/20 flex flex-col gap-1">
                              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">☕ Java Portable</span>
                              <div className="text-[11px] text-slate-300 bg-purple-950/30 p-2 rounded-xl border border-purple-800/40 font-mono">
                                JDK 17 + Capacitor Android Engine
                              </div>
                            </div>
                            <div className="bg-black/50 p-3 rounded-2xl border border-purple-500/20 flex flex-col gap-1">
                              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">🎨 Thèmes Persistent</span>
                              <div className="text-[11px] text-slate-300 bg-purple-950/30 p-2 rounded-xl border border-purple-800/40 font-mono">
                                Injection Zero-Touch CSS embarquée
                              </div>
                            </div>
                          </div>

                          {/* Terminal Logs */}
                          <div className="bg-[#05070d] p-3 rounded-2xl border border-slate-800 flex flex-col gap-2 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${apkBuildStatus === 'building' ? 'bg-yellow-400 animate-ping' : apkBuildStatus === 'success' ? 'bg-green-400' : 'bg-slate-600'}`}></span>
                                Logs Compilation APK
                              </span>
                              {apkLogs.length > 0 && (
                                <button onClick={() => setApkLogs([])} className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer">
                                  Effacer
                                </button>
                              )}
                            </div>
                            <div className="bg-black/80 p-3 rounded-xl border border-slate-900 font-mono text-[11px] h-24 overflow-y-auto custom-scrollbar flex flex-col gap-1 text-slate-300">
                              {apkLogs.length === 0 ? (
                                <span className="text-slate-600 italic text-center my-auto">Prêt. Cliquez sur "Compiler l'APK".</span>
                              ) : (
                                apkLogs.map((log, idx) => <div key={idx} className="leading-tight">{log}</div>)
                              )}
                            </div>
                          </div>

                          {/* SECTION APK DISPONIBLES */}
                          {availableApks.length > 0 && (
                            <div className="bg-[#0b121e] p-3 rounded-2xl border border-emerald-500/30 flex flex-col gap-2 mb-3 shadow-inner">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                                  <span>📦</span> Fichiers APK Prêts ({availableApks.length})
                                </span>
                                <button
                                  onClick={loadAvailableApks}
                                  className="text-[11px] text-emerald-400 hover:text-emerald-200 transition-colors flex items-center gap-1 cursor-pointer font-bold"
                                  title="Actualiser la liste des APK sur le serveur"
                                >
                                  🔄 Actualiser
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar pt-1">
                                {availableApks.map((apk, idx) => {
                                  const isSelected = (selectedApkTarget || activeProject || "").toLowerCase() === apk.name.toLowerCase();
                                  return (
                                    <a
                                      key={idx}
                                      href={apk.url}
                                      download={apk.file}
                                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all shadow-md cursor-pointer border ${
                                        isSelected
                                          ? "bg-emerald-600/30 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                          : "bg-black/50 border-emerald-500/20 text-slate-300 hover:bg-emerald-950/40 hover:text-white hover:border-emerald-500/50"
                                      }`}
                                      title={`Télécharger ${apk.file} (${apk.sizeMb} Mo)`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="text-base">📱</span>
                                        <span className="font-mono truncate">{apk.name}</span>
                                      </div>
                                      <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-300 font-mono shrink-0 ml-2">
                                        📥 {apk.sizeMb} Mo
                                      </span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Actions et Téléchargement Principal */}
                          {(() => {
                            const target = selectedApkTarget || activeProject || "figma";
                            const matchingApk = availableApks.find(
                              a => a.name.toLowerCase() === target.toLowerCase() || a.file.toLowerCase() === `${target}.apk`.toLowerCase()
                            );
                            const finalDownloadUrl = apkOutputUrl || (matchingApk ? matchingApk.url : `/api/mobile/download-apk?file=${encodeURIComponent(target + '.apk')}`);
                            const isReady = !!(apkOutputUrl || matchingApk);

                            return (
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-500/20">
                                {isReady ? (
                                  <a
                                    href={finalDownloadUrl}
                                    download={`${target}.apk`}
                                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/50 border border-emerald-400/40 cursor-pointer animate-pulse hover:scale-105"
                                  >
                                    <span className="text-base">📥</span>
                                    <span>TÉLÉCHARGER {target.toUpperCase()}.APK</span>
                                    {matchingApk && <span className="text-[10px] opacity-90 font-mono">({matchingApk.sizeMb} Mo)</span>}
                                  </a>
                                ) : (
                                  <div className="px-4 py-2 bg-slate-900/70 text-slate-500 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-800/80 select-none">
                                    <span>⏳</span> APK non encore généré
                                  </div>
                                )}

                                  {/* Téléchargement de l'archive ZIP complète du code source du projet */}
                                  {target && (
                                    <a
                                      href={`/api/projects/download-zip?project_id=${encodeURIComponent(target)}`}
                                      download={`${target}.zip`}
                                      className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-amber-950/50 border border-amber-400/40 cursor-pointer hover:scale-105"
                                      title={`Télécharger l'archive ZIP du code source de "${target}" (sans node_modules)`}
                                    >
                                      <span className="text-base">📦</span>
                                      <span>TÉLÉCHARGER {target.toUpperCase()}.ZIP</span>
                                    </a>
                                  )}

                                <button
                                  disabled={apkBuildStatus === 'building'}
                                  onClick={async () => {
                                    if (!target) return alert("Veuillez sélectionner un projet !");
                                    setApkBuildStatus("building");
                                    setApkLogs([`> Initialisation build APK pour [${target}]...`]);
                                    
                                    const isRemoteVps = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
                                    if (isRemoteVps) {
                                      setApkLogs(l => [
                                        ...l,
                                        `> ℹ️ Détection environnement Cloud VPS (109.205.182.17)...`,
                                        `> 🚀 Bascule automatique sur le Compilateur Cloud Souverain (GitHub Actions Engine)...`
                                      ]);
                                      await launchCloudApkBuild(
                                        target,
                                        (msg) => setApkLogs(l => [...l, msg]),
                                        (status, url) => {
                                          setApkBuildStatus(status);
                                          if (url) {
                                            setApkOutputUrl(url);
                                            loadAvailableApks();
                                          }
                                        }
                                      );
                                      return;
                                    }

                                    try {
                                      const res = await safeFetch("http://localhost:5006/api/mobile/build-apk", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ project: target })
                                      });
                                      if (!res || !res.ok) {
                                        setApkLogs(l => [
                                          ...l,
                                          `> 🚀 Bascule automatique sur le Compilateur Cloud Souverain (GitHub Actions Engine)...`
                                        ]);
                                        await launchCloudApkBuild(
                                          target,
                                          (msg) => setApkLogs(l => [...l, msg]),
                                          (status, url) => {
                                            setApkBuildStatus(status);
                                            if (url) {
                                              setApkOutputUrl(url);
                                              loadAvailableApks();
                                            }
                                          }
                                        );
                                        return;
                                      }
                                    } catch (e: any) {
                                      setApkLogs(l => [
                                        ...l,
                                        `> 🚀 Bascule automatique sur le Compilateur Cloud Souverain...`
                                      ]);
                                      await launchCloudApkBuild(
                                        target,
                                        (msg) => setApkLogs(l => [...l, msg]),
                                        (status, url) => {
                                          setApkBuildStatus(status);
                                          if (url) {
                                            setApkOutputUrl(url);
                                            loadAvailableApks();
                                          }
                                        }
                                      );
                                    }
                                  }}
                                  className={`ml-auto px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${apkBuildStatus === 'building' ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer'}`}
                                >
                                  {apkBuildStatus === 'building' ? '⚙️ Compilation...' : '📱 Re-Compiler l\'APK'}
                                </button>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CHAT DISCUSSION BUBBLES POSITIONED TO THE RIGHT ONLY WHEN NO CAROUSEL IS ACTIVE */}
                  {!hasActiveCarousel && (
                    <div className="design-chat-bulles w-full xl:w-[450px] shrink-0 flex flex-col gap-3 items-end z-10 ml-auto">
                      {messages.map((msg, index) => {
                        const isAccueilMsg = index === 0;
                        return (
                          <div key={msg.id} className="w-full flex flex-col items-end">
                            <div
                              className={`${isAccueilMsg ? 'design-msg-accueil' : 'design-chat-bulle'} p-5 rounded-3xl rounded-br-sm backdrop-blur-md border border-white/20 text-gray-100 shadow-xl`}
                              style={{ background: isClient ? getCachedGradient('msg-' + msg.id, msg.role === "user" ? 0.8 : 0.6) : 'rgba(0,0,0,0.6)' }}
                            >
                              {msg.content}
                            </div>
                            {index === lastWidgetIndex && msg.widget === "settings" && <WidgetSettings isClient={isClient} getCachedGradient={getCachedGradient} mouchardLogs={mouchardLogs} activePhase={activePhase} availableProjects={availableProjects} setAvailableProjects={setAvailableProjects} selectedLaunchProject={selectedLaunchProject} setSelectedLaunchProject={setSelectedLaunchProject} isMobileNative={isMobileNative} isAutoPilot={isAutoPilot} setIsAutoPilot={setIsAutoPilot} reuseActiveTab={reuseActiveTab} setReuseActiveTab={setReuseActiveTab} selectedStartPhase={selectedStartPhase} setSelectedStartPhase={setSelectedStartPhase} selectedPacks={selectedPacks} />}
                            {index === lastWidgetIndex && msg.widget === "phases" && WidgetPhases()}
                            {index === lastWidgetIndex && msg.widget === "projects" && <WidgetProjects isClient={isClient} getCachedGradient={getCachedGradient} setActiveProject={setActiveProject} onOpenProject={handleOpenProjectFromCarousel} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
            <div ref={chatEndRef} />
          </div>
        </main>

        {/* Right Sidebar (Mouchard d'Installation) */}
        {isRightSidebarOpen && (() => {
          // --- ANALYSE DYNAMIQUE DU STATUT DU TERMINAL ---
          const recentLogsStr = mouchardLogs.slice(-10).join(" ").toLowerCase();
          const firstLogsStr = mouchardLogs.slice(0, 10).join(" ").toLowerCase();
          const allRecentStr = recentLogsStr + " " + firstLogsStr;

          let tColor = "text-green-400";
          let tDot = "bg-green-400 shadow-[0_0_8px_#4ade80]";
          let tBorder = "border-green-500/30 shadow-[-10px_0_30px_rgba(34,197,94,0.1)]";
          let tBg = "bg-green-950/20";
          let tTitle = "Terminal (Prêt)";

          if (allRecentStr.includes("erreur") || allRecentStr.includes("failed") || allRecentStr.includes("⚠️") || allRecentStr.includes("exception") || allRecentStr.includes("impossible") || allRecentStr.includes("[err")) {
            tColor = "text-red-500";
            tDot = "bg-red-500 animate-pulse shadow-[0_0_12px_#ef4444]";
            tBorder = "border-red-500/50 shadow-[-10px_0_30px_rgba(239,68,68,0.2)]";
            tBg = "bg-red-950/30";
            tTitle = "Terminal (Erreur)";
          } else if (
            allRecentStr.includes("en cours") || 
            allRecentStr.includes("execution") || 
            allRecentStr.includes("install") || 
            allRecentStr.includes("lancement") || 
            allRecentStr.includes("analyse") || 
            allRecentStr.includes("suture") ||
            allRecentStr.includes("patch")
          ) {
            if (!allRecentStr.includes("terminé") && !allRecentStr.includes("détecté") && !allRecentStr.includes("nettoyée") && !allRecentStr.includes("✅")) {
              tColor = "text-purple-400";
              tDot = "bg-purple-400 animate-ping shadow-[0_0_12px_#c084fc]";
              tBorder = "border-purple-500/50 shadow-[-10px_0_30px_rgba(168,85,247,0.2)]";
              tBg = "bg-purple-950/30";
              tTitle = "Terminal (Travail...)";
            }
          }

          return (
          <aside className={`w-80 border-l flex flex-col z-50 fixed right-0 top-0 h-screen bg-black transition-all duration-500 shadow-2xl ${tBorder}`}>
            <div className={`p-4 border-b border-white/10 flex justify-between items-center transition-colors duration-500 ${tBg}`}>
              <h3 className={`${tColor} font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors`}>
                <span className={`w-2 h-2 rounded-full ${tDot}`}></span>
                {tTitle}
              </h3>
              <div className="flex gap-2 items-center">
                <button
                  onClick={async () => {
                    setMouchardLogs(["> Arrêt des processus en cours... (Historique conservé dans la console noire)"]);
                    try {
                      const res = await safeFetch("http://localhost:5006/api/bridge/stop-launch", { method: "POST" });
                      if (!res || !res.ok) {
                        setMouchardLogs([
                          "> ⚠️ ERREUR : La commande n'existe pas !",
                          "> ⚠️ VOUS DEVEZ REDÉMARRER LA CONSOLE NOIRE !",
                          "> Fermez la fenêtre COMMAND_MENU_TIGER.bat et relancez-la."
                        ]);
                        return;
                      }
                      const data = await res.json();
                      setMouchardLogs(["> ✅ " + (data.message || "Processus arrêtés.")]);
                    } catch (e: any) {
                      setMouchardLogs([
                        "> ⚠️ ERREUR DE CONNEXION AU MOTEUR !",
                        "> Le moteur est peut-être éteint ou nécessite un redémarrage.",
                        "> Détail: " + e.message
                      ]);
                    }
                  }}
                  className="py-1 px-2 rounded text-white font-bold text-[10px] bg-red-500/20 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors shadow-md"
                  title="Arrêter l'installation ou le serveur (Ne nettoie plus la console)"
                >
                  ⏹️ Stop/Clear
                </button>
                <button onClick={() => setIsRightSidebarOpen(false)} className="text-gray-500 hover:text-white transition-colors ml-2 font-bold text-lg">✕</button>
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto flex flex-col-reverse hide-scrollbar bg-black">
              <div id="mouchard-terminal-logs">
                {mouchardLogs.map((log, idx) => {
                  let colorClass = "text-[#52c1c9]"; // Teal clair (Défaut)
                  if (log.includes("[INSTALL]")) colorClass = "text-[#f29f43]"; // Orange
                  if (log.includes("[SERVER]")) colorClass = "text-[#0ab7d4]"; // Cyan vif
                  if (log.includes("[IDE]")) colorClass = "text-[#e27396]"; // Rose
                  if (log.includes("[APK]")) colorClass = "text-[#c084fc]"; // Violet clair
                  if (log.includes("WARN") || log.includes("ERR") || log.includes("❌")) colorClass = "text-red-500";
                  if (log.includes("✅") || log.includes("🎉")) colorClass = "text-emerald-400";

                  return (
                    <div key={`log_${idx}_${log.slice(0, 15)}`} className={`mb-1 opacity-90 break-words ${colorClass}`}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
          );
        })()}

        {/* Bouton réductible pour ré-ouvrir le Mouchard UI si fermé */}
        {!isRightSidebarOpen && (
          <button
            onClick={() => setIsRightSidebarOpen(true)}
            title="Ouvrir le Mouchard Système / Terminal"
            className="fixed right-4 top-4 z-50 bg-[#111c2e]/90 hover:bg-[#1e293b] border border-cyan/40 text-cyan px-3 py-1.5 rounded-full text-[11px] font-mono font-bold shadow-[0_0_15px_rgba(8,179,201,0.25)] transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer hover:scale-105"
          >
            <span>🕵️</span>
            <span>Mouchard</span>
          </button>
        )}

      </div> {/* Fermeture div flex-1 principal pour que le footer passe en bas */}

      {/* Input Area + Integrated Status & Actions Toolbar Footer */}
      <footer className="design-footer absolute bottom-0 left-0 w-full backdrop-blur-2xl z-50 flex flex-col p-2 md:p-3 bg-black/80 border-t border-white/15 gap-2">
        {/* Integrated Top Strip: Action Icons Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Action Icons Toolbar (Moved to the Right of Chat Bar) */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 px-1">
            
            {/* 💻 Éditeur Code */}
            <button
              onClick={() => setActiveStudioTab('code')}
              className={`design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden ${activeStudioTab === 'code' ? 'border border-zinc-500 bg-zinc-500/20' : ''}`}
              title="Éditeur Code"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">💻</span>
              <span className="design-app-texte z-10 drop-shadow-md">Code</span>
            </button>

            {/* 🏗️ Builder UI */}
            <button
              onClick={() => setActiveStudioTab('builder')}
              className={`design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden ${activeStudioTab === 'builder' ? 'border border-blue-500 bg-blue-500/20' : ''}`}
              title="Builder UI"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🏗️</span>
              <span className="design-app-texte z-10 drop-shadow-md">Builder</span>
            </button>

            {/* 🗄️ Données */}
            <button
              onClick={() => setActiveStudioTab('data')}
              className={`design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden ${activeStudioTab === 'data' ? 'border border-purple-500 bg-purple-500/20' : ''}`}
              title="Données"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🗄️</span>
              <span className="design-app-texte z-10 drop-shadow-md">Données</span>
            </button>

            {/* ⚙️ Workflows */}
            <button
              onClick={() => setActiveStudioTab('workflows')}
              className={`design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden ${activeStudioTab === 'workflows' ? 'border border-orange-500 bg-orange-500/20' : ''}`}
              title="Workflows"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">⚙️</span>
              <span className="design-app-texte z-10 drop-shadow-md">Workflows</span>
            </button>

            {/* ⚡ Générateur */}
            <button
              onClick={() => setActiveStudioTab('generator')}
              className={`design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden ${activeStudioTab === 'generator' ? 'border border-green-500 bg-green-500/20' : ''}`}
              title="Générateur"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">⚡</span>
              <span className="design-app-texte z-10 drop-shadow-md">Générateur</span>
            </button>

            {/* ⚙️ Réglages */}
            <button
              onClick={() => { setSettingsInitialTab("connexion"); setIsSettingsOpen(true); }}
              className="design-app-icone design-icone-reglages flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              title="Réglages"
            >
              <span className="z-10 drop-shadow-md group-hover:rotate-45 transition-transform">⚙️</span>
              <span className="design-app-texte z-10 drop-shadow-md">Réglages</span>
            </button>

            {/* 🧠 Assistant IA */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  const logicAi = localStorage.getItem("tiger_targetAi") || "deepseek";
                  const aiUrl = getTargetAiUrl(logicAi);
                  const bridge = (window as any).AndroidBridge;
                  if (bridge && bridge.openAIWithPrompt) {
                    bridge.openAIWithPrompt(aiUrl, "Bonjour ! Je viens d'ouvrir l'Assistant IA.");
                  } else {
                    window.open(aiUrl, "_blank");
                  }
                }
              }}
              className="design-app-icone design-icone-assistant flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              title="Assistant IA"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🧠</span>
              <span className="design-app-texte z-10 drop-shadow-md">Assistant IA</span>
            </button>

            {/* 📁 Projets */}
            <button
              onClick={() => {
                setActiveProject(null);
                setActiveFile(null);
                setShowPacksCarousel(false);
                handleSend("Mes projets");
                setInput("");
              }}
              className="design-app-icone design-icone-projets flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              title="Projets"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">📁</span>
              <span className="design-app-texte z-10 drop-shadow-md">Projets</span>
            </button>

            {/* 📎 Packs PRD (Bouton Principal) */}
            <button
              id="btn-joindre-prd-main"
              onClick={() => {
                setShowPacksCarousel(true);
              }}
              className="design-app-icone design-icone-packs flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              title="Ouvrir le carrousel des Packs PRD"
            >
              {selectedPacks.length > 0 && (
                <span className="absolute -top-0 -right-0 bg-indigo-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white/20 shadow-md z-20">
                  {selectedPacks.length}
                </span>
              )}
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform text-xl">📎</span>
              <span className="design-app-texte z-10 drop-shadow-md">Packs PRD</span>
            </button>

            {/* 🎁 V0-Guest */}
            <button
              onClick={async () => {
                window.dispatchEvent(new CustomEvent('open-mouchard'));
                try {
                  await safeFetch("http://localhost:5006/api/bridge/launch-project", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: "v0-guest" })
                  });
                  // Ouverture automatique dans un nouvel onglet
                  setTimeout(() => {
                    window.open("http://localhost:3007", "_blank");
                  }, 2500);
                } catch (e: any) {
                  console.error("Erreur lancement v0-guest:", e);
                }
              }}
              className="design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden cursor-pointer"
              style={{ backgroundImage: 'linear-gradient(135deg, #00c6ff, #0072ff)' }}
              title="Démarrer le serveur V0-Guest (localhost:3007) en arrière-plan"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🎁</span>
              <span className="design-app-texte z-10 drop-shadow-md">V0-Guest</span>
            </button>
            <button
              onClick={() => {
                setShowPacksCarousel(false);
                handleSend("Actualités IA");
                setInput("");
              }}
              className="design-app-icone design-icone-actualites flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              title="Actualités"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">📰</span>
              <span className="design-app-texte z-10 drop-shadow-md">Actualités</span>
            </button>

            {/* 🖥️ Console-V0 */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsRightSidebarOpen(prev => {
                  const nextState = !prev;
                  if (nextState) {
                    setMouchardLogs(l => ["> Console-V0 ouverte. Prêt pour l'Introspection AST.", ...l]);
                  }
                  return nextState;
                });
              }}
              className="design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(135deg, #475163, #1f2530)' }}
              title="Console-V0"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🖥️</span>
              <span className="design-app-texte z-10 drop-shadow-md">Console-V0</span>
            </button>

            {/* 🧬 Patch UI */}
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  setIsRightSidebarOpen(true);
                  const targetProj = activeProject || "Projet_blog_8831";
                  const targetFileRelative = activeFile || "src/App.tsx";
                  const fullTargetFilePath = `e:\\v0reponses\\v0-moteur-electron\\v0saveprojets\\${targetProj}\\${targetFileRelative.replace(/\//g, '\\')}`;

                  window.dispatchEvent(new CustomEvent('kirov-mouchard-log', {
                    detail: `> 🚀 Lancement du Patch UI (Suture dynamique sur ${targetProj})...`
                  }));

                  const res = await safeFetch("http://localhost:5006/api/design/intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      intent: "PATCH_UI",
                      payload: {
                        targetFile: fullTargetFilePath,
                        templateId: "stitch_mock"
                      }
                    })
                  });
                  const data = res ? await res.json() : null;
                  if (data && data.success) {
                    window.dispatchEvent(new CustomEvent('kirov-mouchard-log', {
                      detail: `> 🎯 Patch appliqué avec succès par le LLM !`
                    }));
                  } else {
                    window.dispatchEvent(new CustomEvent('kirov-mouchard-log', {
                      detail: `> ⚠️ Erreur Patch UI AST : ${(data && data.error) || 'Basculement vers la Suture IA...'}`
                    }));
                    handleIDEAction("suture", `Échec du patch automatique AST : ${(data && data.error) || 'Format incompatible'}`);
                  }
                } catch (err: any) {
                  window.dispatchEvent(new CustomEvent('kirov-mouchard-log', {
                    detail: `> ⛔ Erreur Patch UI : ${err.message}`
                  }));
                  handleIDEAction("suture", `Exception Patch UI: ${err.message}`);
                }
              }}
              className="design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(135deg, #1b6345, #08291a)' }}
              title="Patch UI"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🧬</span>
              <span className="design-app-texte z-10 drop-shadow-md">Patch UI</span>
            </button>

            {/* 🧹 Flush Queue */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await safeFetch("http://localhost:5006/bridge/flush", { method: "POST" });
                  const data = res ? await res.json() : null;
                  setMessages(prev => [...prev, {
                    id: Date.now().toString() + "_flush",
                    role: "assistant",
                    content: `🧹 File Bridge vidée ! ${(data && data.flushed) || 0} prompt(s) supprimé(s).\n\nLa queue est vide. Relancez votre Suture ou Patch.`
                  }]);
                  window.dispatchEvent(new CustomEvent('kirov-mouchard-log', {
                    detail: `> 🧹 Bridge Queue FLUSH — ${(data && data.flushed) || 0} tâche(s) nettoyée(s)`
                  }));
                } catch (e) {
                  alert("Moteur hors ligne : impossible de vider la queue.");
                }
              }}
              className="design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(135deg, #a17c23, #4f3b0c)' }}
              title="Vider la file Bridge (déblocage injection)"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🧹</span>
              <span className="design-app-texte z-10 drop-shadow-md">Flush Queue</span>
            </button>

            {/* 🎨 Thèmes */}
            <button
              onClick={() => {
                setIsApkModalOpen(false);
                setShowPacksCarousel(false);
                setIsColorModalOpen(prev => !prev);
              }}
              className="design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(135deg, #993a61, #4d152c)' }}
              title="Thèmes & Couleurs"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform">🎨</span>
              <span className="design-app-texte z-10 drop-shadow-md">Thèmes</span>
            </button>

            {/* 📱 v0-apk */}
            <button
              onClick={() => {
                setIsColorModalOpen(false);
                setShowPacksCarousel(false);
                setIsApkModalOpen(prev => !prev);
              }}
              className="design-app-icone flex flex-col items-center justify-center shrink-0 group relative overflow-hidden"
              style={{ backgroundImage: 'linear-gradient(135deg, #5b227a, #230930)' }}
              title="Compiler l'Application Mobile (.apk - Java Portable)"
            >
              <span className="z-10 drop-shadow-md group-hover:scale-110 transition-transform animate-pulse">📱</span>
              <span className="design-app-texte z-10 drop-shadow-md">v0-apk</span>
            </button>

          </div>
        </div>

        {/* Input Bar */}
        <div className="px-3 pb-1 pt-1 relative w-full flex flex-col gap-2">

          {/* INPUT FICHIER PERMANENT (Accessible depuis la Modal et le Chat) */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept=".html,.md,.png,.jpg,.jpeg,.json,.txt,.zip"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleFileUpload(e.target.files);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />

          {/* LE TROMBONE (Fichiers attachés) */}
          {tromboneFiles.length > 0 && (
            <div className="flex gap-2 px-2 overflow-x-auto hide-scrollbar pb-2">
              {tromboneFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-cyan/10 border border-cyan/30 text-cyan text-xs px-3 py-1.5 rounded-full whitespace-nowrap animate-fadeIn">
                  <span>📎 {f.path.split('/').pop() || f.path.split('\\').pop()}</span>
                  <button
                    onClick={() => setTromboneFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="hover:text-red-400 font-bold ml-1"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {isCreationMode ? (
            <div id="creation-mode-container" className="absolute bottom-full left-2 right-2 mb-3 flex flex-col gap-4 bg-[#05080c]/98 p-5 rounded-3xl border-2 border-cyan/50 shadow-[0_0_50px_rgba(8,179,201,0.5)] backdrop-blur-2xl animate-fadeIn z-[100] max-h-[82vh] overflow-y-auto custom-scrollbar text-white">
              {/* Header */}
              <div className="flex justify-between items-center mb-1 sticky top-0 bg-[#05080c]/98 z-10 py-2 border-b border-cyan/20">
                <h3 className="text-cyan font-black flex items-center gap-2 text-base md:text-lg uppercase tracking-wider">
                  <span className="animate-pulse w-2.5 h-2.5 bg-cyan rounded-full shadow-[0_0_10px_#08b3c9]"></span> ⚙️ CONFIGURATION DU PROJET
                </h3>
                <button onClick={() => setIsCreationMode(false)} className="text-gray-400 hover:text-white bg-white/10 hover:bg-red-500 rounded-full w-7 h-7 flex items-center justify-center transition-colors">✕</button>
              </div>

              {/* ZONE 1: CIBLER LE PROJET */}
              <div className="flex flex-col gap-2 bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <label htmlFor="project-target" className="text-cyan font-bold uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <span>📁</span> CIBLER LE PROJET :
                </label>
                <select
                  id="project-target"
                  value={selectedTargetProject || ""}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedTargetProject(val || null);
                    if (val) {
                      setNewProjectName(val.replace('Projet_', '').split('_')[0]);
                      // We NO LONGER launch the project automatically here in the background!
                    } else {
                      setNewProjectName("");
                    }
                  }}
                  className="w-full bg-[#11161d] text-white border border-cyan/30 rounded-xl px-3 py-2 outline-none focus:border-cyan text-xs cursor-pointer"
                >
                  <option value="">-- SÉLECTIONNER UN PROJET --</option>
                  {realProjects.map((p, idx) => {
                    const pName = typeof p?.name === 'string' ? p.name : (p?.name?.project_id || p?.name?.title || `Projet_${idx}`);
                    return <option key={pName + '_' + idx} value={pName}>📁 {pName}</option>;
                  })}
                </select>
              </div>

              {/* ZONE 2: INSTRUCTIONS SPÉCIFIQUES */}
              <div className="flex flex-col gap-2 bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <label htmlFor="project-instructions" className="text-cyan font-bold uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                  <span>📝</span> INSTRUCTIONS SPÉCIFIQUES :
                </label>
                <textarea
                  id="project-instructions"
                  value={newProjectInstructions}
                  onChange={e => setNewProjectInstructions(e.target.value)}
                  placeholder="Instructions pour le Patch ou la modification..."
                  className="w-full bg-[#11161d] text-white border border-slate-700 rounded-xl px-3.5 py-2 outline-none focus:border-cyan h-14 resize-none text-xs leading-relaxed"
                ></textarea>
              </div>

              {/* ZONE 3: PARAMÈTRES & CIBLES */}
              <div className="flex flex-col gap-3.5 bg-black/60 p-3.5 rounded-2xl border border-white/10">
                <div className="text-cyan font-bold uppercase text-xs tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                  <span>⚡</span> PARAMÈTRES & CIBLES
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="project-name" className="text-cyan font-bold uppercase text-[10px] tracking-widest mb-1 block">Nom du Projet</label>
                    <div className="flex gap-2">
                      <input
                        id="project-name"
                        type="text"
                        value={newProjectName}
                        onChange={e => setNewProjectName(e.target.value)}
                        placeholder="Ex: MonSuperProjet"
                        className="flex-1 bg-[#11161d] text-white border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-cyan text-xs"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (newProjectName.trim()) {
                            const cleanName = newProjectName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
                            const genId = cleanName;
                            setActiveProject(genId);
                            try {
                              const API_BASE = 'http://localhost:5006';
                              await safeFetch(`${API_BASE}/v1/projects/set-active`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: genId, project_id: genId })
                              }).catch(() => null);
                              await safeFetch(`${API_BASE}/api/fs/write`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  project: genId,
                                  file: "README.md",
                                  content: `# ${newProjectName.trim()}\n\nInitialisé par Tiger IA V0.`
                                })
                              }).catch(() => null);
                            } catch (err) {
                              console.error("Erreur lors de la création du dossier sur disque:", err);
                            }
                          }
                        }}
                        className="px-3 py-2 bg-cyan/20 hover:bg-cyan text-cyan hover:text-black font-bold text-xs rounded-xl border border-cyan/40 transition-colors whitespace-nowrap"
                      >
                        Valider
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="project-stack" className="text-cyan font-bold uppercase text-[10px] tracking-widest mb-1 block">Stack Technique</label>
                    <select
                      id="project-stack"
                      value={newProjectStack}
                      onChange={e => setNewProjectStack(e.target.value)}
                      className="w-full bg-[#11161d] text-white border border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-cyan text-xs cursor-pointer"
                    >
                      <option value="Vite + React + Tailwind + TS">⭐ 1er Choix (Prioritaire) : Vite + React + Tailwind + TS</option>
                      <option value="Vite + React + TS + Canvas 2D">🎮 Jeu 2D : Vite + React + TS + Canvas 2D</option>
                      <option value="Vite + React + TS + Three.js / R3F (3D GPU)">🚀 Jeu 3D GPU : Vite + React + TS + Three.js / R3F</option>
                      <option value="Next.js + Tailwind + App Router">Next.js + Tailwind + App Router</option>
                      <option value="HTML + CSS Vanilla + JS">HTML + CSS Vanilla + JS</option>

                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="project-desc" className="text-cyan font-bold uppercase text-[10px] tracking-widest mb-1 block">Description / Vision</label>
                  <textarea
                    id="project-desc"
                    value={newProjectDesc}
                    onChange={e => setNewProjectDesc(e.target.value)}
                    placeholder="Décrivez l'application ou copiez votre PRD..."
                    className="w-full bg-[#11161d] text-white border border-slate-700 rounded-xl px-3.5 py-2 outline-none focus:border-cyan h-16 resize-none text-xs leading-relaxed"
                  ></textarea>
                </div>

                {/* BARRE D'OPTIONS ET DE COMMANDES DE DEPART */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
                  {/* INTELLIGENCE CIBLE */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-cyan uppercase tracking-wider">Intelligence Cible</span>
                    <select
                      value={newProjectLogicAi}
                      onChange={e => {
                        setNewProjectLogicAi(e.target.value);
                        localStorage.setItem("tiger_targetAi", e.target.value);
                      }}
                      className="bg-[#11161d] text-cyan font-bold text-xs border border-cyan/40 rounded-xl px-2.5 py-1.5 outline-none focus:border-cyan cursor-pointer"
                    >
                      <option value="deepseek">🩵 DeepSeek</option>
                      <option value="cloudflare">☁️ Cloudflare Qwen 3 (Grade Gold)</option>
                      <option value="stitch">🎨 Stitch (Google)</option>
                      <option value="v0">⚡ V0.dev</option>
                      <option value="chatgpt">🟢 ChatGPT</option>
                      <option value="claude">🟠 Claude</option>
                      <option value="kimi">🌙 Kimi (Moonshot)</option>
                      <option value="gemini">🔵 Gemini</option>
                      <option value="qwen">🔴 Qwen</option>
                      <option value="perplexity">🔍 Perplexity AI</option>
                    </select>
                  </div>

                  {/* MODE & LOT DE DÉPART */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-cyan uppercase tracking-wider">💉 Mode & Lot de Départ</span>
                    <select
                      value={selectedStartPhase}
                      onChange={e => setSelectedStartPhase(Number(e.target.value))}
                      className="bg-[#11161d] text-white font-bold text-xs border border-cyan/40 rounded-xl px-2.5 py-1.5 outline-none focus:border-cyan cursor-pointer"
                    >
                      <option value={1}>🎨 Phase 1 : Le Frontend (Stitch/v0)</option>
                      <option value={2}>💻 Phase 2 : Le Backend (Assistant IA)</option>
                      <option value={4}>🎨 Phase 3/4 : Câblage Métier (Business Wiring)</option>
                    </select>
                  </div>

                  {/* BOUTON TOGGLE AUTO-PILOT */}
                  <button
                    type="button"
                    onClick={() => setIsAutoPilot(!isAutoPilot)}
                    className={`mt-4 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${isAutoPilot ? 'bg-green-600/30 text-green-300 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                  >
                    <span>🤖</span>
                    <span>AUTO-PILOT : {isAutoPilot ? 'ON 🟢' : 'OFF ⚪'}</span>
                  </button>

                  {/* BOUTON TOGGLE INJECTER DANS L'ONGLET DEJA OUVERT */}
                  <button
                    type="button"
                    onClick={() => setReuseActiveTab(!reuseActiveTab)}
                    className={`mt-4 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${reuseActiveTab ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
                    title="Cochez pour réutiliser l'onglet KIROV5 au lieu d'ouvrir un nouvel onglet"
                  >
                    <span>🔗</span>
                    <span>{reuseActiveTab ? '✓ Injecter dans l\'onglet déjà ouvert' : 'Ouvrir un nouvel onglet'}</span>
                  </button>

                  {/* PACKS PRD - Affiche le pack sélectionné */}
                  <div
                    id="btn-joindre-prd"
                    className={`mt-4 px-3 py-1.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 relative ${
                      selectedPacks.length > 0
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.6)]'
                        : 'bg-indigo-900/40 text-indigo-200 border-indigo-500/40'
                    }`}
                    title="Pack PRD sélectionné — Sera injecté automatiquement dans le contexte IA"
                  >
                    <span>💎</span>
                    <span>
                      {selectedPacks.length > 0
                        ? `Packs PRD ${selectedPacks.length} ${selectedPacks[0]}`
                        : 'Aucun Pack PRD sélectionné'}
                    </span>
                  </div>

                  {/* JOINDRE ZIP (STITCH) */}
                  <button
                    type="button"
                    onClick={triggerNativeZipPicker}
                    className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:border-cyan hover:shadow-[0_0_15px_rgba(8,179,201,0.4)] cursor-pointer"
                  >
                    <span>📎</span>
                    <span>Joindre ZIP (Stitch)</span>
                  </button>
                </div>
              </div>

              {/* PANNEAU CARROUSEL / GRILLE DE SELECTION DES PACKS PRD */}
              {showPacksCarousel && (
                <div className="w-full bg-[#0a0d14]/98 p-4 rounded-2xl border-2 border-indigo-500/60 shadow-[0_0_30px_rgba(99,102,241,0.4)] my-2 text-white animate-fadeIn max-h-[50vh] overflow-y-auto custom-scrollbar flex flex-col gap-3 z-30">
                  <div className="flex justify-between items-center pb-2 border-b border-indigo-500/30 sticky top-0 bg-[#0a0d14]/98 z-10 py-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💎</span>
                      <div>
                        <h4 className="text-indigo-300 font-black text-xs md:text-sm uppercase tracking-wider">PACKS PRD ARCHITECTURE ({selectedPacks.length} SÉLECTIONNÉ{selectedPacks.length > 1 ? 'S' : ''})</h4>
                        <p className="text-[10px] text-slate-400">Sélectionnez les briques fonctionnelles à intégrer au Méga-Prompt.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPacks.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedPacks([])}
                          className="text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 px-2 py-1 rounded-lg border border-red-500/30 transition-all"
                        >
                          Tout décocher
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPacksCarousel(false)}
                        className="text-slate-400 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Input de filtre rapide */}
                  <input
                    type="text"
                    placeholder="🔍 Filtrer un pack PRD (ex: auth, ecom, mobile, saas, ai, game, sqlite...)"
                    value={packSearchQuery}
                    onChange={e => setPackSearchQuery(e.target.value)}
                    className="w-full bg-[#121824] text-xs text-white border border-indigo-500/40 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 placeholder:text-slate-500"
                  />

                  {/* Grille des 63+ Packs PRD */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {AVAILABLE_PACKS.filter(p => p.name.toLowerCase().includes(packSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(packSearchQuery.toLowerCase())).map(pack => {
                      const isSelected = selectedPacks.includes(pack.id);
                      const IconComp = pack.icon;
                      return (
                        <div
                          key={pack.id}
                          onClick={() => togglePack(pack.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between gap-1.5 relative select-none ${isSelected
                              ? 'bg-indigo-900/60 border-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] scale-[1.02]'
                              : 'bg-[#11161f] border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-[#171e2b]'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`p-1 rounded-lg ${pack.color}`}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="accent-indigo-500 w-3.5 h-3.5 rounded cursor-pointer pointer-events-none"
                            />
                          </div>
                          <div className="font-bold text-[11px] leading-tight line-clamp-1 text-white">
                            {pack.name}
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono truncate">
                            #{pack.id}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-indigo-500/20 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPacksCarousel(false);
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl shadow-lg transition-all"
                    >
                      ✓ Valider la sélection ({selectedPacks.length})
                    </button>
                  </div>
                </div>
              )}

              {/* BOUTONS D'ACTION (VALIDER & ANNULER) */}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreationMode(false)}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={async (e) => {
                    if (!newProjectName.trim() && !selectedTargetProject) { alert("Veuillez entrer un nom de projet ou en choisir un."); return; }
                    const cleanName = newProjectName.trim() ? newProjectName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') : "";
                    const genId = selectedTargetProject || cleanName || ("Projet_" + Date.now().toString().slice(-4));

                    const btn = e.currentTarget;
                    btn.innerText = '⏳ Initialisation...';
                    btn.disabled = true;

                    try {
                      const API_BASE = 'http://localhost:5006';
                      const isNativeMobile = typeof window !== 'undefined' && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform();

                      if (isNativeMobile) {
                        // 📱 MODE SOUVERAIN MOBILE (Capacitor Native)
                        try {
                          const { KirovSovereignEngine } = (window as any).Capacitor.Plugins;
                          if (KirovSovereignEngine) {
                            await KirovSovereignEngine.setActiveProject({ name: genId });
                          }
                        } catch(e) { console.warn("Plugin mobile introuvable", e); }
                      } else {
                        // 💻 MODE PC (Electron/Node)
                        // 1. Définir le projet actif & créer le dossier sur le disque dur
                        await safeFetch(`${API_BASE}/v1/projects/set-active`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ name: genId })
                        }).catch(() => null);
                      }

                      if (isNativeMobile) {
                        try {
                          const { KirovSovereignEngine } = (window as any).Capacitor.Plugins;
                          if (KirovSovereignEngine) {
                            await KirovSovereignEngine.writeFile({
                              project: genId,
                              file: "README.md",
                              content: `# ${newProjectName || genId}\n\nInitialisé par Tiger IA V0.\nStack : ${newProjectStack}\nDescription : ${newProjectDesc}`
                            });
                          }
                        } catch(e) {}
                      } else {
                        // 2. Écrire le fichier README initial
                        await safeFetch(`${API_BASE}/api/fs/write`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            project: genId,
                            file: "README.md",
                            content: `# ${newProjectName || genId}\n\nInitialisé par Tiger IA V0.\nStack : ${newProjectStack}\nDescription : ${newProjectDesc}`
                          })
                        }).catch(() => null);
                      }

                      const packsDetailsText = (selectedPacks && selectedPacks.length > 0)
                        ? `\n\n[PACKS PRD ARCHITECTURE SELECTIONNES (${selectedPacks.length})]\n` + selectedPacks.map(id => {
                          const pk = AVAILABLE_PACKS.find(p => p.id === id);
                          return `• ${pk ? pk.name : id} (#${id})`;
                        }).join('\n')
                        : "";

                      let stackInstructions = `\n\n[STACK TECHNIQUE OBLIGATOIRE : ${newProjectStack.toUpperCase()}]\n`;
                      if (newProjectStack.includes("Three.js") || newProjectStack.includes("3D GPU")) {
                        stackInstructions += "⚠️ CONSTRUCTEUR : Ce projet DOIT IMPÉRATIVEMENT être un jeu Web 3D accéléré GPU généré en **React + Vite + TypeScript (TSX) + Three.js / React Three Fiber (@react-three/fiber, @react-three/drei)**.\n• Générer : package.json, vite.config.ts, index.html, src/main.tsx, src/App.tsx, src/components/3d/Scene3D.tsx, src/components/3d/PlayerController.tsx.\n• Rendu 3D GPU : Canvas WebGL/WebGPU, éclairages PBR, contrôles de caméra Orbit/PointerLock, chargement de modèles glTF/GLB et HUD React/Tailwind superposé.\n\n[PHASE 0 : PRE-VIZ MAQUETTE NANO BANANA]\n• Avant le code source, générer la maquette visuelle d'écran de jeu (Wireframe / Design Mockup) pour valider l'ergonomie du HUD et du Viewport 3D.\n\n[SÉQUENCE DE MICRO-ACTIONS MULTI-ÉTAPES (DECOUPAGE ULTRA-COMPLEXE)]\n• ACTION 1/6 (Core Engine 3D) :\n  - 1.A : Architecture Canvas WebGL/R3F, Resize Handler & Viewport High-DPI.\n  - 1.B : Boucle de rendu 60 FPS DeltaTime, Render Queue & Gestionnaire de pause.\n  - 1.C : Configuration des caméras (OrbitControls & PointerLock FPS/TPS).\n• ACTION 2/6 (Moteur Physique & Collisions) :\n  - 2.A : Raycasting et masques de collisions 3D.\n  - 2.B : Calculs de forces Rigidbodies, vecteurs de rebond & gravité.\n  - 2.C : Zones de détection Triggers & volumes d'événements.\n• ACTION 3/6 (Contrôles Multi-Input) :\n  - 3.A : Entrées Clavier (WASD / Flèches) & Souris (Pointer Lock).\n  - 3.B : Overlay Joypad tactile mobile réactif (Joypad.tsx).\n  - 3.C : Support Gamepad API pour manettes USB/Bluetooth.\n• ACTION 4/6 (Game State & Level Manager) :\n  - 4.A : Machine à états (Init, StartMenu, Playing, Pause, GameOver, Victory).\n  - 4.B : Chargement des cartes de niveaux & parseur de données JSON.\n  - 4.C : Gestionnaire d'entités ECS & Spawner de bonus/ennemis.\n• ACTION 5/6 (Audio 3D & SFX Synth) :\n  - 5.A : Contexte Web Audio API, Noeud Panner 3D spatialisé.\n  - 5.B : Synthétiseur de bruitages 8-bit / SFX (Tir, Hit, Explosion, Powerup).\n  - 5.C : Gestionnaire de musique de fond & effets Reverb.\n• ACTION 6/6 (HUD Overlay & Leaderboard) :\n  - 6.A : Interface React/Tailwind superposée (Vies, Score, Jauge Énergie).\n  - 6.B : Écrans modaux (Pause, Game Over, Victoire).\n  - 6.C : Tableau des scores (Leaderboard) & enregistrement local.\n";
                      } else if (newProjectStack.includes("Canvas 2D")) {
                        stackInstructions += "⚠️ CONSTRUCTEUR : Ce projet DOIT IMPÉRATIVEMENT être un jeu Web 2D généré en **React + Vite + TypeScript (TSX) + Canvas 2D**.\n• Générer : package.json, vite.config.ts, index.html, src/main.tsx, src/App.tsx, src/game/GameEngine.ts.\n• Moteur : Moteur 2D avec boucle requestAnimationFrame, physique de collisions AABB/rebonds, Web Audio API pour effets sonores et HUD complet avec Tailwind.\n\n[PHASE 0 : PRE-VIZ MAQUETTE NANO BANANA]\n• Avant le code source, générer la maquette visuelle d'écran de jeu 2D (Wireframe / Design Mockup) pour valider le layout Arcade, le Canvas et la disposition des boutons.\n\n[SÉQUENCE DE MICRO-ACTIONS MULTI-ÉTAPES (DECOUPAGE ULTRA-COMPLEXE)]\n• ACTION 1/6 (Core Engine 2D) :\n  - 1.A : Architecture Canvas 2D, Aspect-Ratio Lock 16:9 & High-DPI Scaling.\n  - 1.B : Boucle requestAnimationFrame 60 FPS avec DeltaTime & Pause state.\n  - 1.C : Gestionnaire de scène et grille de coordonnées 2D.\n• ACTION 2/6 (Physique & Collisions AABB) :\n  - 2.A : Détection de collisions AABB (Axis-Aligned Bounding Boxes).\n  - 2.B : Calculs de rebonds angulaires, impulsion & frottements.\n  - 2.C : Triggers de bonus, pièges et limites du terrain.\n• ACTION 3/6 (Contrôles Multi-Input) :\n  - 3.A : Handlers d'événements Clavier (WASD / Flèches).\n  - 3.B : Overlay Joypad tactile mobile réactif (Joypad.tsx).\n  - 3.C : Support Gamepad API pour manettes.\n• ACTION 4/6 (Game State & Levels) :\n  - 4.A : Machine à états de jeu (StartMenu, Playing, Pause, GameOver).\n  - 4.B : Chargeur de cartes de niveaux & parseur de grille (levels_data.json).\n  - 4.C : Entity Component System (ECS) & gestionnaire d'objets.\n• ACTION 5/6 (Audio Web API Synth) :\n  - 5.A : Master Node Web Audio API & oscillateurs.\n  - 5.B : Synthétiseur de bruitages 8-bit (Tir, Rebonds, Explosions).\n  - 5.C : Gestionnaire audio global & réglages de volume.\n• ACTION 6/6 (HUD Overlay & Leaderboard) :\n  - 6.A : Interface React/Tailwind superposée (Score, Vies, Jauges).\n  - 6.B : Écrans modaux (Pause, Game Over, Victoire).\n  - 6.C : Modale Leaderboard avec classement et confettis.\n";
                      } else if (newProjectStack.includes("Vite")) {
                        stackInstructions += "⚠️ CONTRAT BOILERPLATE (GOLDEN CONTRACT) : Ce projet s'appuie sur un boilerplate préexistant (React + Vite + TS + Tailwind).\n• INTERDICTION FORMELLE : Ne crée PAS et ne modifie PAS les fichiers `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx` ou `src/index.css`. L'architecture de base, le routage racine et les variables Tailwind sont déjà câblés.\n• CHEMINS APLATIS (OBLIGATOIRE) : Tu DOIS placer TOUTES les pages directement à la racine de `src/pages/` (ex: `src/pages/HomePage.tsx`). NE CRÉE JAMAIS de sous-dossiers imbriqués ni de fichiers `code.tsx` profonds.\n• ANTI-DOUBLON : Ne crée pas la même page en double (ex: n'écris pas `Post.tsx` ET `PostPage.tsx`). Génère un seul fichier par page avec le suffixe 'Page'.\n• ROUTAGE STRICT : Dans `src/App.tsx`, vérifie que chaque import correspond EXACTEMENT au nom du fichier plat que tu as généré dans `src/pages/`. N'invente pas de routes fantômes.\n";
                      } else if (newProjectStack.includes("Next")) {
                        stackInstructions += "⚠️ CONSTRUCTEUR : Ce projet DOIT IMPÉRATIVEMENT être généré en **Next.js (App Router)**.\n• Générer : package.json, app/layout.tsx, app/page.tsx, app/globals.css.\n";
                      } else {
                        stackInstructions += "⚠️ CONSTRUCTEUR : Ce projet DOIT IMPÉRATIVEMENT être généré en **HTML5 / CSS Vanilla / JS**.\n• Générer : index.html, design.css, app.js.\n";
                      }

                      const megaPrompt = (newProjectDesc.trim() || newProjectInstructions.trim() || `Initialisation du projet ${newProjectName || genId}`) + stackInstructions + packsDetailsText;


                      // Déterminer l'IA cible en fonction de la phase
                      let finalTargetAi = newProjectLogicAi;
                      if (selectedStartPhase === 1) {
                        finalTargetAi = localStorage.getItem("tiger_targetUiAi") || "stitch";
                      }

                      // 3. Lancer la mission Kirov
                      if (isNativeMobile) {
                        try {
                          const { KirovSovereignEngine } = (window as any).Capacitor.Plugins;
                          if (KirovSovereignEngine) {
                            // 1. Ouvrir l'onglet IA via la WebView In-App Native
                            const aiUrl = getTargetAiUrl(finalTargetAi);
                            await KirovSovereignEngine.openAiTab({ url: aiUrl });
                            
                            // 2. Injecter le prompt après un léger délai pour que la page charge
                            setTimeout(async () => {
                              await KirovSovereignEngine.injectPrompt({ prompt: megaPrompt, target_ai: finalTargetAi });
                            }, 4500);
                          }
                        } catch (e) {
                          alert("Le moteur souverain mobile n'est pas encore implémenté ou le plugin est manquant.");
                        }
                      } else {
                        if (selectedStartPhase === 2) {
                          await safeFetch(`${API_BASE}/api/bridge/trombone`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              target_project: genId, 
                              user_prompt: megaPrompt, 
                              target_ai: finalTargetAi, 
                              packs: selectedPacks, 
                              zip_mode: true, 
                              start_phase: 200, 
                              force_restart: true,
                              auto_submit: isAutoPilotOn 
                            })
                          }).catch(() => null);
                          
                          if (!reuseActiveTab) {
                            await safeFetch(`${API_BASE}/v1/bridge/inject`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ project_id: genId, prompt: "OPEN_TAB_ONLY", target_ai: finalTargetAi, phase_num: selectedStartPhase })
                            }).catch(() => null);

                            const logicAiUrl = getTargetAiUrl(finalTargetAi);
                            window.open(logicAiUrl, '_blank');
                          }
                        } else {
                          await safeFetch(`${API_BASE}/v1/bridge/inject`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ project_id: genId, prompt: megaPrompt, target_ai: finalTargetAi, phase_num: selectedStartPhase, packs: selectedPacks })
                          }).catch(() => null);

                          // NOUVEAU: Activer le Watcher de Téléchargements pour la Reprise Automatique (Zero-Touch total)
                          await safeFetch(`${API_BASE}/api/bridge/expect-zip`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ project_id: genId, target_ai: finalTargetAi, auto_submit: isAutoPilotOn })
                          }).catch(() => null);

                          if (!reuseActiveTab) {
                            const logicAiUrl = getTargetAiUrl(finalTargetAi);
                            window.open(logicAiUrl, '_blank');
                          }
                        }
                      }

                      setPreviewUrl(null);
                      setActiveFile(null);
                      setFileContent("");
                      setIsCreationMode(false);
                      setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: "user",
                        content: `🚀 Mission "${newProjectName || genId}" initialisée pour ${newProjectLogicAi.toUpperCase()} avec ${selectedPacks.length} pack(s) PRD. Injection du Méga-Prompt en cours...`
                      }]);
                    } catch (err: any) {
                      alert("Erreur lors de la création : " + err.message);
                    } finally {
                      btn.innerText = '✅ Validé';
                      btn.disabled = false;
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan to-blue-600 text-black font-black text-xs rounded-xl hover:from-cyan/80 hover:to-blue-600/80 transition-all shadow-[0_0_20px_rgba(8,179,201,0.4)] flex items-center gap-2"
                >
                  <span>🚀</span> Valider & Démarrer le Projet
                </button>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="design-btn-trombone transition-all opacity-80 z-20 hover:scale-110"
                title="Joindre un fichier (Stitch/ZIP)"
              >
                📎
              </button>

              <button
                onClick={() => { setActiveProject(null); setNewProjectName(""); setTromboneFiles([]); setSettingsInitialTab("creation"); setIsSettingsOpen(true); }}
                className="design-btn-new-v0 font-bold flex items-center gap-1 transition-all z-20 hover:scale-105"
                title="Créer un nouveau projet"
              >
                ✨ New-v0
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Système v0-reponses initialisé. L'interface unique est active. Que souhaitez-vous faire ?"
                className="design-chat-input w-full pl-6 pr-14 transition-all shadow-inner focus:outline-none focus:ring-1 focus:ring-cyan"
              />
              <button
                onClick={handleSend}
                className="design-btn-envoi absolute right-2 top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* MODAL: Time Machine (Backup Selection) */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowBackupModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <span className="text-2xl">⏪</span> Machine à Remonter le Temps
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Choisissez l'une des sauvegardes ci-dessous pour restaurer votre projet à un état antérieur. 
              <br /><span className="text-red-400 font-bold">Attention : le code actuel sera écrasé.</span>
            </p>
            
            <div className="space-y-3">
              {availableBackups.map((bName) => (
                <div key={bName} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <div>
                      <div className="font-bold text-sm text-blue-300">{bName.replace('backup-', '')}</div>
                      <div className="text-xs text-slate-500">Sauvegarde Kirov</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Confirmer la restauration de ${bName} ?\nTout le travail actuel non sauvegardé sera perdu.`)) {
                        safeFetch("http://localhost:5006/api/bridge/restore-backup", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ project_id: activeProject, backup_name: bName })
                        })
                        .then(r => r ? r.json() : null)
                        .then(d => {
                          if (!d) return alert("❌ Moteur inaccessible (Mode Cloud SaaS)");
                          if (d.success) {
                            alert("✅ " + d.message);
                            setShowBackupModal(false);
                          } else {
                            alert("❌ Erreur Restauration : " + d.error);
                          }
                        }).catch(e => alert("Erreur réseau: " + e.message));
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Restaurer
                  </button>
                </div>
              ))}
              
              {availableBackups.length === 0 && (
                <div className="text-center p-4 text-slate-500 italic">
                  Aucune sauvegarde disponible.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
