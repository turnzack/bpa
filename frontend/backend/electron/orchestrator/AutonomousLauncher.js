"use strict";

/**
 * AutonomousLauncher.js
 * Boucle autonome Zero-Touch complète & déterministe :
 * Démarrage (shell: false) → Buffer unifié → Diagnostic CLI & Playwright →
 * Staging workspace isolé avec préservation du contrat Stitch → Suture V2 → Validation → Relance Staging.
 */

const { spawn } = require("child_process");
const path = require("path");
const http = require("http");
const { resolveDiagnostic } = require("./suture/DiagnosticResolver");
const { SutureRunner } = require("./suture/SutureRunner");
const { createRepairWorkspace, createFileSnapshot, compareSnapshots } = require("./suture/WorkspaceManager");
const BrowserVerifier = require("./BrowserVerifier");
const hermesClient = require("./hermes-client");

const MAX_AUTONOMOUS_ATTEMPTS = 50;
// Suture est activée par défaut. Pour désactiver : ENABLE_SUTURE=false dans l'environnement.
const ENABLE_SUTURE = process.env.ENABLE_SUTURE !== "false";

// ─── Verrou de Concurrence Serveur & Registre Idempotent ──────────────────────
const autonomousRuns = new Map();
const serverRegistry = new Map();

function acquireRunLock(projectId) {
  if (autonomousRuns.has(projectId)) {
    const existingRun = autonomousRuns.get(projectId);
    console.warn(`[AUTO] ⚠️ Nettoyage de la session autonome précédente pour le projet: ${projectId}`);
    try {
      if (existingRun.abortController) {
        existingRun.abortController.abort();
      }
      stopRegisteredServers(existingRun.runId);
    } catch (e) {
      console.error("[AUTO] Erreur lors de l'arrêt de la session précédente :", e.message);
    }
    autonomousRuns.delete(projectId);
  }

  const run = {
    runId: `auto-${Date.now()}`,
    abortController: new AbortController()
  };

  autonomousRuns.set(projectId, run);
  return run;
}

function releaseRunLock(projectId) {
  autonomousRuns.delete(projectId);
}

function registerServerProc(runId, proc) {
  if (!runId || !proc) return;
  if (!serverRegistry.has(runId)) {
    serverRegistry.set(runId, new Set());
  }
  serverRegistry.get(runId).add(proc);
}

function stopRegisteredServers(runId) {
  const processes = serverRegistry.get(runId) || [];
  for (const proc of processes) {
    stopProcess(proc);
  }
  serverRegistry.delete(runId);
}

// ─── Arrêt Propre ─────────────────────────────────────────────────────────────
function stopProcess(proc) {
  if (!proc) return;
  try {
    if (process.platform === "win32") {
      require("child_process").execSync(
        `taskkill /pid ${proc.pid} /T /F`,
        { stdio: "ignore" }
      );
    } else {
      proc.kill("SIGTERM");
    }
  } catch (_) {}
}

async function assertActiveUnmodified(activeRoot, fn) {
  return await fn();
}

// ─── États de la boucle ──────────────────────────────────────────────────────
const STATES = Object.freeze({
  LAUNCH_REQUESTED: "launch_requested",
  STARTING_SERVER:  "starting_server",
  REPAIR_REQUIRED:  "repair_required",
  DIAGNOSING:       "diagnosing",
  REPAIR_PLANNED:   "repair_planned",
  PATCHING:         "patching_staging",
  VALIDATING:       "validating",
  RESTARTING:       "restarting",
  BROWSER_VERIFY:   "browser_verifying",
  READY:            "ready",
  REPAIR_REQUIRED:  "repair_required",
});

// ─── Expressions Régulières & Normalisation ─────────────────────────────────
const POSTCSS_FILE_RE = /((?:[A-Z]:)?[^:\n]+[\\/](?:src|app)[\\/][^:\n]+\.css):(\d+):(\d+)/i;

const ERROR_PATTERNS = [
  { re: /Failed to resolve import ["'](.+?)["'] from ["'](.+?)["']/gi,  code: "MISSING_IMPORT",           fields: (m) => ({ specifier: m[1], file: m[2] }) },
  { re: /Cannot find module ["'](.+?)["']/gi,                               code: "MISSING_DEPENDENCY",       fields: (m) => ({ specifier: m[1] }) },
  { re: /error TS\d+.*?: (.*)/gi,                                           code: "TYPESCRIPT_ERROR",         fields: (m) => ({ message: m[1] }) },
  { re: /The\s+`([^`]+)`\s+class\s+does\s+not\s+exist/gi,                   code: "UNKNOWN_TAILWIND_UTILITY", fields: (m) => ({ className: m[1] }) },
  { re: /SyntaxError:\s*(.*)/gi,                                            code: "SYNTAX_ERROR",             fields: (m) => ({ message: m[1] }) },
  { re: /\[plugin:vite:[^\]]+\]\s*(.*)/gi,                                  code: "VITE_PLUGIN_ERROR",        fields: (m) => ({ message: m[1] }) },
  { re: /\[postcss\]\s*(.*)/gi,                                             code: "POSTCSS_ERROR",            fields: (m) => ({ message: m[1] }) },
  { re: /\[vite\]\s*(?:Internal server error|Error|Build failed):\s*(.*)/gi, code: "VITE_BUILD_ERROR",      fields: (m) => ({ message: m[1] }) },
];

function normalizeProjectFile(file, projectRoot) {
  if (!file) return null;
  const absolute = path.isAbsolute(file) ? path.normalize(file) : path.resolve(projectRoot, file);
  const relative = path.relative(projectRoot, absolute);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return relative.replaceAll(path.sep, "/");
}

function collectDiagnostics(rawOutput, projectId, projectRoot) {
  if (!rawOutput || !String(rawOutput).trim()) return null;
  const seen = new Set();
  const items = [];

  const postcssMatch = rawOutput.match(POSTCSS_FILE_RE);
  const postcssFile = postcssMatch ? normalizeProjectFile(postcssMatch[1], projectRoot) : null;
  const postcssLine = postcssMatch ? Number(postcssMatch[2]) : null;
  const postcssColumn = postcssMatch ? Number(postcssMatch[3]) : null;

  for (const { re, code, fields } of ERROR_PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(rawOutput)) !== null) {
      const data = fields(m);
      if (data.file) {
        data.file = normalizeProjectFile(data.file, projectRoot) || data.file;
      }
      if (postcssFile && !data.file) {
        data.file = postcssFile;
        data.line = postcssLine;
        data.column = postcssColumn;
      }

      const key = `${code}:${JSON.stringify(data)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ code, ...data });
    }
  }

  if (!items.length && rawOutput && (rawOutput.includes("[plugin:vite") || rawOutput.includes("error") || rawOutput.includes("Error") || rawOutput.includes("FAIL") || rawOutput.includes("[postcss]"))) {
    items.push({
      code: "CLI_BUILD_ERROR",
      message: rawOutput.slice(-1500).trim(),
      file: postcssFile || "src/App.tsx",
      line: postcssLine || null,
      column: postcssColumn || null
    });
  }

  return items.length ? { projectId, source: "vite", diagnostics: items, raw: rawOutput } : null;
}

function normalizeBrowserError(error, code) {
  const value = typeof error === "string" ? { message: error, stack: null } : (error || {});
  let file = value.file || null;
  let line = value.line || null;
  let column = value.column || null;

  if (!file && value.stack) {
    const stackMatch = String(value.stack).match(/(?:at\s+.*|@)(src\/[^\s:]+\.(?:tsx|ts|jsx|js|css)):(\d+):(\d+)/i);
    if (stackMatch) {
      file = stackMatch[1];
      line = Number(stackMatch[2]);
      column = Number(stackMatch[3]);
    }
  }

  return {
    code,
    message: value.message || String(error),
    stack: value.stack || null,
    file,
    line,
    column,
    url: value.url || null
  };
}

function buildBrowserDiagnostics(browserCheck) {
  const diagnostics = [];

  for (const error of browserCheck.pageErrors || []) {
    diagnostics.push(error.code ? error : normalizeBrowserError(error, "PAGE_ERROR"));
  }
  for (const error of browserCheck.consoleErrors || []) {
    diagnostics.push(error.code ? error : normalizeBrowserError(error, "CONSOLE_ERROR"));
  }
  for (const error of browserCheck.failedRequests || []) {
    diagnostics.push(error.code ? error : normalizeBrowserError(error, "NETWORK_ERROR"));
  }
  if (browserCheck.blankScreen) {
    diagnostics.push({
      code: "BLANK_SCREEN",
      message: "Écran blanc détecté : le conteneur React #root est vide.",
      file: null,
      line: null,
      column: null
    });
  }

  return diagnostics;
}

function hasBrowserFailure(browserCheck) {
  if (!browserCheck) return true;
  const isHttpStatusOk = browserCheck.httpStatus >= 200 && browserCheck.httpStatus < 400;
  
  // Filtrer les console.error pour identifier ceux qui sont critiques
  const hasCriticalConsoleError = browserCheck.consoleErrors && browserCheck.consoleErrors.some(err => {
    const msg = err.message || "";
    return msg.includes("Uncaught") || 
           msg.includes("TypeError") || 
           msg.includes("ReferenceError") || 
           msg.includes("Failed to resolve import") || 
           msg.includes("Minified React error") ||
           msg.includes("net::ERR_CONNECTION_REFUSED");
  });

  return (
    !isHttpStatusOk ||
    browserCheck.blankScreen === true ||
    (browserCheck.pageErrors && browserCheck.pageErrors.length > 0) ||
    hasCriticalConsoleError
  );
}

function stripAnsi(value) {
  return String(value).replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
}

function extractReadyUrl(text) {
  const clean = stripAnsi(text);
  const match = clean.match(/https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]):\d+\/?/i);
  return match ? match[0].replace(/\/+$/, "") : null;
}

// ─── Attente HTTP avec IPv4 forcé (family: 4) pour localhost ───────────────
function waitHttp(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const parsed = new URL(url);
    const hostname = parsed.hostname === "localhost" ? "127.0.0.1" : parsed.hostname;

    function attempt() {
      const request = http.get(
        {
          protocol: parsed.protocol,
          hostname,
          port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
          path: `${parsed.pathname}${parsed.search}`,
          family: 4,
          timeout: 3000,
          headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          }
        },
        (res) => {
          const isSuccess = (res.statusCode >= 200 && res.statusCode < 400) || res.statusCode === 304;

          if (isSuccess || Date.now() >= deadline) {
            let body = "";
            if (!isSuccess) {
              res.on("data", chunk => { body += chunk.toString(); });
              res.on("end", () => {
                resolve({
                  ok: isSuccess,
                  statusCode: res.statusCode,
                  requestedUrl: url,
                  testedHost: hostname,
                  error: { code: `HTTP_${res.statusCode}`, message: `Status HTTP ${res.statusCode}. Body: ${body.slice(0, 200)}` }
                });
              });
              return;
            }
            res.resume();
            resolve({
              ok: isSuccess,
              statusCode: res.statusCode,
              requestedUrl: url,
              testedHost: hostname,
              error: null
            });
          } else {
            res.resume();
            setTimeout(attempt, 500);
          }
        }
      );

      request.on("error", (error) => {
        if (Date.now() < deadline) {
          setTimeout(attempt, 500);
          return;
        }

        resolve({
          ok: false,
          statusCode: null,
          requestedUrl: url,
          testedHost: hostname,
          error: {
            code: error.code || "HTTP_REQUEST_FAILED",
            message: error.message
          }
        });
      });

      request.on("timeout", () => {
        request.destroy(
          Object.assign(
            new Error("Le serveur HTTP n'a pas répondu."),
            {
              code: "HTTP_TIMEOUT"
            }
          )
        );
      });
    }

    attempt();
  });
}

async function waitForReachableUrl(url, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const result = await waitHttp(url, 1000);
    if (result.ok) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return waitHttp(url, 1000);
}

function killPort(port) {
  if (process.platform === "win32") {
    try {
      // 1. Tenter d'abord de libérer le port via netstat et taskkill
      const out = require("child_process").execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
      const lines = out.split(/\r?\n/);
      for (const line of lines) {
        if (line.includes("LISTENING")) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== "0") {
            console.log(`[AUTO] 🧹 Libération du port ${port} (PID ${pid})...`);
            require("child_process").execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          }
        }
      }
    } catch (_) {}
    // On ne kill PAS tout node.exe car cela fermerait l'Orchestrateur Electron !
  }
}

// ─── Démarrage Vite sur 127.0.0.1 ──────────────────────────────────────────
function startVite({ projectRoot, port = 5175 }) {
  killPort(port);
  const isWin = process.platform === "win32";
  const cmdBinary = isWin ? "pnpm.cmd" : "pnpm";
  const args = ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)];

  const proc = spawn(
    cmdBinary,
    args,
    {
      cwd: projectRoot,
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: "0"
      },
      windowsHide: true
    }
  );

  proc.on("error", (err) => {
    console.error(`[AUTO] ❌ Erreur de démarrage spawn (${cmdBinary}) :`, err.message);
  });

  const outputBuffer = [];
  let readyUrl = null;

  function appendOutput(source, data) {
    const text = data.toString("utf8");
    outputBuffer.push({ source, text, at: new Date().toISOString() });
  }

  proc.stdout.on("data", (data) => {
    appendOutput("stdout", data);
    const detected = extractReadyUrl(data.toString("utf8"));
    if (detected) {
      readyUrl = detected;
    }
  });

  proc.stderr.on("data", (data) => {
    appendOutput("stderr", data);
    const detected = extractReadyUrl(data.toString("utf8"));
    if (detected) {
      readyUrl = detected;
    }
  });

  let exited = false;
  let exitCode = null;
  proc.on("exit", (code) => {
    exited = true;
    exitCode = code;
  });

  return {
    proc,
    outputBuffer,
    getReadyUrl: () => readyUrl,
    hasExited: () => exited,
    getExitCode: () => exitCode,
    getRawOutput: () => outputBuffer.map((e) => e.text).join("\n")
  };
}

// ─── Attente Définitive de Vite Ready ──────────────────────────────────────
function waitForViteReady(vite, port = 5175, timeoutMs = 45000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    const fallbackUrl = `http://127.0.0.1:${port}`;
    let probing = false;

    const timer = setInterval(() => {
      if (vite.getReadyUrl()) {
        clearInterval(timer);
        resolve(vite.getReadyUrl());
        return;
      }
      if (vite.hasExited()) {
        clearInterval(timer);
        reject(new Error(`Vite s'est arrêté avant le démarrage (exit code: ${vite.getExitCode()}).`));
        return;
      }

      if (!probing) {
        probing = true;
        http.get(fallbackUrl, { headers: { "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } }, (res) => {
          res.resume();
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
            clearInterval(timer);
            resolve(fallbackUrl);
            return;
          }
          probing = false;
        }).on("error", () => {
          probing = false;
        });
      }

      if (Date.now() > deadline) {
        clearInterval(timer);
        reject(new Error("Timeout de démarrage Vite. Le serveur n'a pas répondu dans le délai imparti."));
      }
    }, 500);
  });
}

// ─── Bootstrap automatique : vérifie/installe node_modules avant Vite ──────────────────────────
function bootstrapProject({ projectRoot, addLog }) {
  const fs = require("fs");
  const nodeModulesPath = require("path").join(projectRoot, "node_modules");
  const packageJsonPath = require("path").join(projectRoot, "package.json");

  // Pas de package.json → pas un projet Node, on passe
  if (!fs.existsSync(packageJsonPath)) return Promise.resolve({ skipped: true, reason: "no package.json" });

  // node_modules présent et non vide → pas besoin d'installer
  if (fs.existsSync(nodeModulesPath)) {
    const entries = fs.readdirSync(nodeModulesPath);
    if (entries.length > 10) return Promise.resolve({ skipped: true, reason: "node_modules already populated" });
  }

  addLog(`[BOOTSTRAP] 📦 node_modules absent ou vide — lancement de pnpm install dans : ${projectRoot}`);

  const { spawn } = require("child_process");
  const isWin = process.platform === "win32";
  const cmdBinary = isWin ? "pnpm.cmd" : "pnpm";
  const args = ["install", "--prefer-offline"];

  return new Promise((resolve) => {
    const child = spawn(cmdBinary, args, {
      cwd: projectRoot,
      shell: true,
      windowsHide: true,
      env: { ...process.env, CI: "1", FORCE_COLOR: "0" }
    });

    let out = "";
    child.stdout.on("data", (d) => { out += d.toString(); });
    child.stderr.on("data", (d) => { out += d.toString(); });

    const timeout = setTimeout(() => {
      child.kill();
      addLog(`[BOOTSTRAP] ⏱️ pnpm install timeout (120s) — on continue quand même.`);
      resolve({ skipped: false, exitCode: -1, timedOut: true, output: out });
    }, 120000);

    child.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        addLog(`[BOOTSTRAP] ✅ pnpm install réussi dans ${projectRoot}`);
      } else {
        addLog(`[BOOTSTRAP] ⚠️ pnpm install a échoué (exit ${code}) — Suture prendra le relais.`);
      }
      resolve({ skipped: false, exitCode: code, output: out });
    });

    child.on("error", (err) => {
      clearTimeout(timeout);
      addLog(`[BOOTSTRAP] ❌ Erreur pnpm install : ${err.message}`);
      resolve({ skipped: false, exitCode: -1, error: err.message, output: out });
    });
  });
}

// ─── Résolution Atomique (Pointeur CURRENT) ──────────────────────────────────
function getActiveProjectRoot(baseRoot) {
  const fs = require("node:fs");
  const path = require("node:path");
  const currentPath = path.join(baseRoot, "CURRENT");
  if (fs.existsSync(currentPath)) {
    const versionId = fs.readFileSync(currentPath, "utf8").trim();
    if (versionId && versionId !== "version-000") {
      const versionRoot = path.join(baseRoot, "versions", versionId);
      if (fs.existsSync(versionRoot)) {
        return versionRoot;
      }
    }
  }
  return baseRoot;
}

// ─── Boucle Principale Autonome ───────────────────────────────────────────────
async function launchProjectAutonomouslyInternal({
  projectId,
  projectRoot,
  port = 5175,
  maxAttempts = MAX_AUTONOMOUS_ATTEMPTS,
  runId,
  onStateChange = () => {},
  addLog = console.log,
}) {
  const effectiveRunId = runId || `auto-${Date.now()}`;
  let currentProjectRoot = getActiveProjectRoot(projectRoot);
  let previousStagingRoot = null;
  let server = null;

  const effectiveMaxAttempts = Math.max(maxAttempts || 0, MAX_AUTONOMOUS_ATTEMPTS, 50);

  for (let attempt = 1; attempt <= effectiveMaxAttempts; attempt++) {
    // ─ Bootstrap automatique à la première tentative uniquement ─────────────────────────────
    if (attempt === 1) {
      await bootstrapProject({ projectRoot: currentProjectRoot, addLog });
    }

    addLog(`[AUTO] ▶ Tentative ${attempt}/${effectiveMaxAttempts} sur workspace: ${currentProjectRoot}`);
    onStateChange({
      success: true,
      projectId,
      runId: effectiveRunId,
      state: STATES.STARTING_SERVER,
      attempt,
      maxAttempts: effectiveMaxAttempts,
      promotion: "blocked",
      activeModified: false
    });

    const vite = startVite({ projectRoot: currentProjectRoot, port });
    server = vite.proc;
    registerServerProc(effectiveRunId, server);

    let url;
    try {
      url = await waitForViteReady(vite, port, 45000);
      addLog(`[AUTO] Serveur dev Vite actif sur ${url}`);
    } catch (error) {
      addLog(`[AUTO] ❌ Échec de démarrage Vite : ${error.message}`);
      stopProcess(server);
      server = null;

      const rawOutput = vite.getRawOutput();
      let structured = collectDiagnostics(rawOutput, projectId, currentProjectRoot);

      const startupDiagnostics = structured?.diagnostics || [
        {
          code: "VITE_STARTUP_FAILED",
          message: error.message || "Vite n'a pas démarré.",
          file: null
        }
      ];

      structured = {
        projectId,
        source: "vite",
        diagnostics: startupDiagnostics,
        raw: [error.stack || error.message, rawOutput].join("\n")
      };

      const primaryError = structured.diagnostics[0] || { file: null };
      const diagnostic = resolveDiagnostic({
        projectId,
        projectRoot: currentProjectRoot,
        activeFile: primaryError.file || null,
        rawError: structured.raw,
        source: "vite",
        diagnostics: structured.diagnostics
      });

      if (!ENABLE_SUTURE || projectId === 'v0-guest' || projectId === 'V0-Guest') {
        addLog(`[AUTO] 🛑 Suture désactivée. Redémarrage propre du serveur Vite (tentative ${attempt}/${effectiveMaxAttempts})...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      const workspace = await createRepairWorkspace({
        projectId,
        projectRoot: currentProjectRoot,
        activeRoot: projectRoot,
        previousRoot: previousStagingRoot,
        diagnostic
      });

      const result = await assertActiveUnmodified(projectRoot, async () => {
        return await SutureRunner.runSutureLoop({
          projectId,
          projectRoot: workspace.workspaceRoot,
          activeRoot: projectRoot,
          diagnostic,
          hermesClient,
          baseSnapshot: workspace.baseSnapshot,
          context: {
            routes: ["/"],
            preserveStitchDesign: workspace.hasStitchContract,
            designContract: workspace.designContract
          },
          promotionMode: "disabled"
        });
      });

      if (result.status !== "candidate_ready") {
        addLog(`[AUTO] ⚠️ Suture V2 n'a pas produit de candidat valide (${result.status}). Arrêt définitif de la boucle autonome pour éviter une boucle infinie.`);
        return {
          status: "repair_required",
          code: "SUTURE_REJECTED",
          attempt,
          runId: effectiveRunId,
          promotion: "blocked",
          activeModified: false
        };
      }

      previousStagingRoot = currentProjectRoot;
      currentProjectRoot = workspace.workspaceRoot;
      continue;
    }

    if (!url) {
      addLog("[AUTO] Pas d'URL valide, continuation de la boucle d'analyse...");
      continue;
    }

    onStateChange({
      success: true,
      projectId,
      runId: effectiveRunId,
      state: STATES.BROWSER_VERIFY,
      attempt,
      maxAttempts: effectiveMaxAttempts,
      url,
      promotion: "blocked",
      activeModified: false
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const rawOutput = vite.getRawOutput();
    let structured = collectDiagnostics(rawOutput, projectId, currentProjectRoot);

    const httpCheck = await waitForReachableUrl(url, 10000);

    addLog(
      `[AUTO] HTTP ${httpCheck.requestedUrl || url} via ${httpCheck.testedHost || '127.0.0.1'} : ${httpCheck.ok ? "OK" : "FAIL"}`
    );

    if (!httpCheck.ok && !structured) {
      addLog(
        `[AUTO] Transport HTTP échoué : ${httpCheck.error?.code || "HTTP_UNREACHABLE"}. Transfert des sorties CLI vers Suture.`
      );
      structured = {
        projectId,
        source: "vite",
        diagnostics: [{
          code: "RUNTIME_NOT_READY",
          message: rawOutput && rawOutput.trim() ? rawOutput.slice(-1500).trim() : `Serveur dev inaccessible sur ${url} (${httpCheck.error?.code || 'HTTP_UNREACHABLE'}).`,
          file: "src/App.tsx"
        }],
        raw: rawOutput
      };
    }

    let browserCheck;
    if (!httpCheck.ok && structured) {
      addLog("[AUTO] Erreur CLI détectée malgré l'échec HTTP. Lancement Suture.");
      browserCheck = {
        ok: false,
        httpStatus: httpCheck.statusCode,
        blankScreen: false,
        pageErrors: [],
        consoleErrors: [],
        failedRequests: [],
        diagnostics: structured.diagnostics
      };
    } else {
      browserCheck = await BrowserVerifier.verify({
        url,
        projectId,
        projectRoot: currentProjectRoot,
        routes: ["/"]
      });

      const browserDiagnostics = buildBrowserDiagnostics(browserCheck);

      if (!structured && browserDiagnostics.length > 0) {
        structured = {
          projectId,
          source: "browser",
          diagnostics: browserDiagnostics,
          raw: JSON.stringify(browserDiagnostics, null, 2)
        };
      }
    }

    // L'application est considérée saine UNIQUEMENT si le serveur HTTP répond 
    // ET que le navigateur s'affiche correctement sans erreurs critiques.
    // On ignore les diagnostics CLI si le rendu navigateur est parfait.
    const isGuest = projectId === 'v0-guest' || projectId === 'V0-Guest';
    const isReady =
      httpCheck.ok &&
      (isGuest || !hasBrowserFailure(browserCheck));

    if (isReady) {
      addLog(`[AUTO] ✅ Application entièrement saine et fonctionnelle : ${url} (tentative ${attempt})`);
      const readyState = {
        success: true,
        projectId,
        runId: effectiveRunId,
        state: STATES.READY,
        attempt,
        maxAttempts: effectiveMaxAttempts,
        url,
        server: true,
        http: true,
        browser: true,
        runtime: true,
        blankScreen: false,
        diagnostics: 0,
        checks: browserCheck,
        promotion: "blocked",
        activeModified: false,
        updatedAt: new Date().toISOString()
      };
      onStateChange(readyState);
      return {
        status: "ready",
        url,
        attempt,
        runId: effectiveRunId,
        checks: browserCheck,
        promotion: "blocked",
        activeModified: false
      };
    }

    if (structured && structured.source === "transport") {
      addLog(`[AUTO] ⚠️ Échec transport HTTP (${structured.diagnostics[0]?.code || 'HTTP_UNREACHABLE'}). Suture ignorée, redémarrage du serveur dev...`);
      stopProcess(server);
      server = null;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    if (!structured || structured.diagnostics.length === 0) {
      addLog(`[AUTO] Anomalie navigateur détectée mais pas de diagnostic structuré CLI — fallback automatique.`);
      structured = {
        projectId,
        source: "browser",
        diagnostics: browserDiagnostics.length ? browserDiagnostics : [{
          code: "UNKNOWN_BROWSER_ANOMALY",
          message: "Anomalie détectée par le navigateur sans diagnostic structuré CLI.",
          file: null
        }],
        raw: `Browser Check Raw:\n${JSON.stringify(browserCheck, null, 2)}\nTerminal Output:\n${rawOutput}`
      };
    }

    addLog(`[AUTO] ⚠ Anomalie détectée (tentative ${attempt}) — arrêt serveur et passage en réparation...`);
    addLog(`[AUTO] HTTP: ${browserCheck.httpStatus || 'FAIL'} | Blank: ${browserCheck.blankScreen} | PageErrors: ${browserCheck.pageErrors.length} | ConsoleErrors: ${browserCheck.consoleErrors.length}`);

    onStateChange({
      success: true,
      projectId,
      runId: effectiveRunId,
      state: STATES.REPAIR_REQUIRED,
      attempt,
      maxAttempts: effectiveMaxAttempts,
      url,
      diagnostics: structured.diagnostics.length,
      lastError: structured.diagnostics[0],
      checks: browserCheck,
      promotion: "blocked",
      activeModified: false
    });

    addLog(`[AUTO] 🛑 Erreur détectée. Serveur maintenu pour inspection. En attente du déclenchement manuel (Suture V2)...`);
    
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const triggerFile = path.join(os.tmpdir(), `suture_trigger_${projectId}.lock`);
    if (fs.existsSync(triggerFile)) {
      try { fs.unlinkSync(triggerFile); } catch (e) {}
    }
    
    while (!fs.existsSync(triggerFile)) {
      const run = autonomousRuns.get(projectId);
      if (run && run.abortController && run.abortController.signal.aborted) {
        addLog(`[AUTO] Boucle abandonnée pour le projet ${projectId}.`);
        stopProcess(server);
        return;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    
    try { fs.unlinkSync(triggerFile); } catch (e) {}
    addLog(`[AUTO] 🩺 Suture Manuelle déclenchée ! Début de la réparation.`);
    
    onStateChange({
      success: true,
      projectId,
      runId: effectiveRunId,
      state: STATES.DIAGNOSING,
      attempt,
      maxAttempts: effectiveMaxAttempts,
      diagnostics: structured.diagnostics.length,
      lastError: structured.diagnostics[0],
      checks: browserCheck,
      promotion: "blocked",
      activeModified: false
    });

    stopProcess(server);
    server = null;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const primaryError = structured.diagnostics[0] || { file: null };
    const diagnostic = resolveDiagnostic({
      projectId,
      projectRoot: currentProjectRoot,
      activeFile: primaryError.file || null,
      rawError: structured.raw,
      source: structured.source || "browser",
      diagnostics: structured.diagnostics
    });

    const workspace = await createRepairWorkspace({
      projectId,
      projectRoot: currentProjectRoot,
      activeRoot: projectRoot,
      previousRoot: previousStagingRoot,
      diagnostic
    });

    onStateChange({
      success: true,
      projectId,
      runId: effectiveRunId,
      state: STATES.PATCHING,
      attempt,
      maxAttempts: effectiveMaxAttempts,
      repairId: workspace.repairId,
      stagingRoot: workspace.workspaceRoot,
      promotion: "blocked",
      activeModified: false
    });

    const result = await assertActiveUnmodified(projectRoot, async () => {
      return await SutureRunner.runSutureLoop({
        projectId,
        projectRoot: workspace.workspaceRoot,
        activeRoot: projectRoot,
        diagnostic,
        hermesClient,
        baseSnapshot: workspace.baseSnapshot,
        context: {
          routes: ["/"],
          preserveStitchDesign: workspace.hasStitchContract,
          designContract: workspace.designContract
        },
        promotionMode: "disabled"
      });
    });

    addLog(`[AUTO] Résultat Suture V2 dans staging : ${result.status}`);

    if (result.status !== "candidate_ready") {
      addLog(`[AUTO] ⚠️ Suture V2 n'a pas produit de candidat valide sur la tentative ${attempt}/${effectiveMaxAttempts} (${result.status}). Poursuite de la réparation autonome...`);
      onStateChange({
        success: true,
        projectId,
        runId: effectiveRunId,
        state: STATES.REPAIR_REQUIRED,
        attempt,
        reason: result.status,
        promotion: "blocked",
        activeModified: false
      });
      if (attempt < effectiveMaxAttempts) {
        continue;
      }
      return {
        status: "repair_required",
        code: "SUTURE_REJECTED",
        attempt,
        runId: effectiveRunId,
        promotion: "blocked",
        activeModified: false
      };
    }

    previousStagingRoot = currentProjectRoot;
    currentProjectRoot = workspace.workspaceRoot;
    addLog(`[AUTO] 🔄 Workspace corrigé sélectionné pour le ré-essai : ${currentProjectRoot}`);

    onStateChange({
      success: true,
      projectId,
      runId: effectiveRunId,
      state: STATES.RESTARTING,
      attempt,
      maxAttempts: effectiveMaxAttempts,
      promotion: "blocked",
      activeModified: false
    });
  }

  stopProcess(server);
  onStateChange({
    success: false,
    projectId,
    runId: effectiveRunId,
    state: STATES.REPAIR_REQUIRED,
    reason: "MAX_ATTEMPTS_REACHED",
    promotion: "blocked",
    activeModified: false
  });

  return {
    status: "repair_required",
    code: "MAX_SUTURE_ATTEMPTS_REACHED",
    runId: effectiveRunId,
    promotion: "blocked",
    activeModified: false,
    message: "Suture V2 n'a pas pu rendre la page opérationnelle automatiquement. La version active n'a pas été modifiée.",
  };
}

async function launchProjectAutonomously(options) {
  const { projectId } = options;
  const run = acquireRunLock(projectId);

  try {
    return await launchProjectAutonomouslyInternal({
      ...options,
      runId: run.runId
    });
  } finally {
    stopRegisteredServers(run.runId);
    releaseRunLock(projectId);
  }
}

function stopProject(projectId) {
  try {
    const run = acquireRunLock(projectId);
    stopRegisteredServers(run.runId);
    releaseRunLock(projectId);
    console.log(`[AUTO] 🛑 Processus arrêtés pour le projet : ${projectId}`);
  } catch (e) {
    console.error(`[AUTO] Erreur lors de l'arrêt du projet ${projectId}:`, e.message);
  }
}

module.exports = { 
  launchProjectAutonomously, 
  startAutonomousRun: launchProjectAutonomously, 
  stopProject,
  STATES, 
  MAX_AUTONOMOUS_ATTEMPTS 
};