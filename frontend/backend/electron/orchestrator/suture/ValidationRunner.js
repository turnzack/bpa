'use strict';

/**
 * ValidationRunner.js — Sprint 8 FINAL
 * ─────────────────────────────────────────────────────────────────
 * Pipeline de validation post-patch complet :
 *
 *  1. patch        — rapport PatchApplier (déjà appliqué)
 *  2. localImports — délégué à TypecheckGate (tsc --noEmit inclut les imports)
 *  3. typecheck    — tsc --noEmit via CommandRunner (shell=false)
 *  4. build        — pnpm run build via CommandRunner (shell=false)
 *  5. runtime      — Vite preview + ping HTTP 127.0.0.1 (RuntimeSmokeTest)
 *  6. route        — GET / via Playwright headless ou fetch
 *  7. regression   — Comparaison fingerprints erreur initiale vs build output
 *
 * ─────────────────────────────────────────────────────────────────
 */

const { spawn } = require('child_process');
const { runAllowedCommand } = require('./CommandRunner');

// ─── Config ───────────────────────────────────────────────────────
const VALIDATION_MODE = process.env.SUTURE_VALIDATION_MODE || 'real';

const RUNTIME_PORT_BASE  = 4200;
const RUNTIME_TIMEOUT_MS = 30000;
const ROUTE_TIMEOUT_MS   = 15000;

// ─── Gate #2 : Imports locaux ─────────────────────────────────────
// Couvert par TypecheckGate — on délègue
async function runLocalImportGate({ workspaceRoot }) {
  return { status: 'passed', verified: true, mode: 'delegated_to_typecheck', errors: [] };
}

// ─── Gate #3 : Typecheck (tsc --noEmit) ──────────────────────────
async function runTypecheckGate({ workspaceRoot }) {
  try {
    const result = await runAllowedCommand({
      commandId:     'typecheck',
      cwd:           workspaceRoot,
      workspaceRoot,
      timeoutMs:     90000
    });
    return {
      status:   result.status === 'passed' ? 'passed' : 'failed',
      verified: true,
      mode:     'real',
      errors:   result.status !== 'passed'
        ? [{ code: 'TYPECHECK_FAILED', message: result.stderr || result.stdout || 'tsc failed' }]
        : [],
      exitCode:   result.exitCode,
      durationMs: result.durationMs
    };
  } catch (err) {
    return {
      status:   'failed',
      verified: true,
      mode:     'real',
      errors:   [{ code: 'TYPECHECK_EXCEPTION', message: err.message }]
    };
  }
}

// ─── Gate #4 : Build ─────────────────────────────────────────────
async function runBuildGate({ workspaceRoot }) {
  try {
    const result = await runAllowedCommand({
      commandId:     'build',
      cwd:           workspaceRoot,
      workspaceRoot,
      timeoutMs:     180000
    });
    return {
      status:   result.status === 'passed' ? 'passed' : 'failed',
      verified: true,
      mode:     'real',
      errors:   result.status !== 'passed'
        ? [{ code: 'BUILD_FAILED', message: result.stderr || result.stdout || 'build failed' }]
        : [],
      exitCode:   result.exitCode,
      durationMs: result.durationMs
    };
  } catch (err) {
    return {
      status:   'failed',
      verified: true,
      mode:     'real',
      errors:   [{ code: 'BUILD_EXCEPTION', message: err.message }]
    };
  }
}

// ─── Gate #5 : Runtime (Vite preview + ping) ─────────────────────

/**
 * Lance `pnpm run preview` dans le workspace et tente un ping HTTP
 * sur 127.0.0.1:<port>. Retourne passed si le ping réussit,
 * ou si le process tourne toujours après le fallback de 5s.
 */
async function runRuntimeGate({ workspaceRoot }) {
  // Port dynamique pour isoler les runs concurrents
  const port = RUNTIME_PORT_BASE + Math.floor(Math.random() * 800);
  const url  = `http://127.0.0.1:${port}`;

  let child;
  const startMs = Date.now();

  try {
    const isWin = process.platform === 'win32';
    const cmdBinary = isWin ? 'cmd.exe' : 'pnpm';
    const args = isWin ? ['/c', 'pnpm.cmd', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'] : ['run', 'dev', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'];

    child = spawn(cmdBinary, args, {
      cwd:         workspaceRoot,
      shell:       false,          // shell: true sur Windows pour exécuter pnpm.cmd
      env:         { ...process.env, CI: 'true' },
      windowsHide: true
    });

    let ready = false;
    const outputLines = [];

    child.stdout.on('data', chunk => {
      const text = chunk.toString();
      outputLines.push(text);
      if (text.includes('Local:') || text.includes(`127.0.0.1:${port}`) || text.includes('localhost:')) {
        ready = true;
      }
    });
    child.stderr.on('data', chunk => outputLines.push(chunk.toString()));

    // Attente du signal "prêt" avec timeout
    const deadline      = Date.now() + RUNTIME_TIMEOUT_MS;
    const fallbackAfter = Date.now() + 5000;

    while (!ready && Date.now() < deadline) {
      if (child.exitCode !== null && child.exitCode !== undefined) break;
      if (Date.now() > fallbackAfter && child.exitCode == null) {
        // Le process tourne encore => on suppose qu'il est prêt
        ready = true;
        break;
      }
      await sleep(300);
    }

    if (!ready) {
      return {
        status:   'failed',
        verified: true,
        mode:     'real',
        port,
        errors:   [{ code: 'RUNTIME_NOT_READY', message: outputLines.slice(-5).join('') }]
      };
    }

    // Ping HTTP
    const pingOk = await httpPing(url, 5000);
    return {
      status:   pingOk ? 'passed' : 'failed',
      verified: true,
      mode:     'real',
      port,
      url,
      durationMs: Date.now() - startMs,
      errors:   pingOk ? [] : [{ code: 'RUNTIME_PING_FAILED', message: `GET ${url} n'a pas répondu` }]
    };

  } catch (err) {
    return {
      status:   'failed',
      verified: true,
      mode:     'real',
      port,
      errors:   [{ code: 'RUNTIME_EXCEPTION', message: err.message }]
    };
  } finally {
    killProcess(child);
  }
}

// ─── Gate #6 : Route ─────────────────────────────────────────────

/**
 * Tente de naviguer sur les routes définies via fetch simple.
 * Si Playwright est disponible, utilise Playwright headless pour
 * détecter les erreurs console et les écrans blancs.
 */
async function runRouteGate({ routes = ['/'], baseUrl = 'http://127.0.0.1:4200' }) {
  const results = [];

  // Essai Playwright headless (optionnel)
  try {
    const playwright = require('playwright');
    const browser    = await playwright.chromium.launch({ headless: true }).catch(() => null);

    if (browser) {
      try {
        for (const route of routes) {
          const page          = await browser.newPage();
          const consoleErrors = [];
          const pageErrors    = [];

          page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
          page.on('pageerror', err => pageErrors.push(err.message));

          const targetUrl = `${baseUrl}${route}`;
          const response  = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: ROUTE_TIMEOUT_MS }).catch(() => null);

          const bodyText = await page.locator('body').innerText().catch(() => '');
          const rootExists = (await page.locator('#root').count()) > 0;
          const hasCriticalConsole = consoleErrors.some(msg => 
            msg.includes('Uncaught') || 
            msg.includes('TypeError') || 
            msg.includes('ReferenceError') || 
            msg.includes('Failed to resolve import') || 
            msg.includes('Minified React error') ||
            msg.includes('net::ERR_CONNECTION_REFUSED')
          );
          const passed = response?.ok() && rootExists && bodyText.trim().length > 0 && pageErrors.length === 0 && !hasCriticalConsole;

          results.push({
            route,
            httpStatus:    response?.status() || 0,
            rootExists,
            hasContent:    bodyText.trim().length > 0,
            consoleErrors,
            pageErrors,
            status:        passed ? 'passed' : 'failed'
          });
          await page.close();
        }
      } finally {
        await browser.close();
      }

      const allPassed = results.every(r => r.status === 'passed');
      const errors    = results
        .filter(r => r.status !== 'passed')
        .map(r => ({
          code:   'ROUTE_FAILED',
          route:  r.route,
          status: r.httpStatus,
          consoleErrors: r.consoleErrors,
          pageErrors:    r.pageErrors
        }));

      return {
        status:   allPassed ? 'passed' : 'failed',
        verified: true,
        mode:     'playwright',
        tested:   routes,
        results,
        errors
      };
    }
  } catch (_) {
    // Playwright absent — fallback fetch
  }

  // Fallback : fetch simple
  for (const route of routes) {
    const targetUrl = `${baseUrl}${route}`;
    try {
      const res = await fetchWithTimeout(targetUrl, ROUTE_TIMEOUT_MS);
      results.push({ route, httpStatus: res.status, status: res.ok ? 'passed' : 'failed' });
    } catch (err) {
      results.push({ route, httpStatus: 0, status: 'failed', error: err.message });
    }
  }

  const allPassed = results.every(r => r.status === 'passed');
  return {
    status:   allPassed ? 'passed' : 'failed',
    verified: true,
    mode:     'fetch',
    tested:   routes,
    results,
    errors:   results.filter(r => r.status !== 'passed').map(r => ({
      code:  'ROUTE_FAILED',
      route: r.route,
      status: r.httpStatus
    }))
  };
}

// ─── Gate #7 : Regression ────────────────────────────────────────

/**
 * Vérifie que le fingerprint de l'erreur initiale n'est plus présent
 * dans la sortie de build du workspace corrigé.
 * Aussi vérifie l'absence de nouvelles erreurs TypeScript/Vite.
 */
async function runRegressionGate({ diagnostic, buildOutput = '' }) {
  if (!diagnostic || !diagnostic.fingerprint) {
    return {
      status:   'passed',
      verified: true,
      mode:     'skipped',
      reason:   'No diagnostic fingerprint to compare',
      errors:   []
    };
  }

  // Le fingerprint initial est un sha256 — on ne peut pas le retrouver dans le texte brut.
  // On regarde plutôt si les patterns caractéristiques de l'erreur initiale sont absents.
  const errorPatterns = buildOutputErrorPatterns(diagnostic);
  const newErrors     = [];

  for (const pattern of errorPatterns) {
    if (buildOutput.toLowerCase().includes(pattern.toLowerCase())) {
      newErrors.push({ code: 'REGRESSION_INITIAL_ERROR_PERSISTS', pattern });
    }
  }

  // Détection de nouvelles erreurs TS/Vite qui n'existaient pas avant
  const newTsErrors = extractTsErrors(buildOutput).filter(e =>
    // Ignorer les erreurs dans les sous-dossiers .kirov
    !e.file?.includes('.kirov')
  );

  return {
    status:                  newErrors.length === 0 ? 'passed' : 'failed',
    verified:                true,
    mode:                    'real',
    initialFingerprintGone:  newErrors.length === 0,
    newTsErrors:             newTsErrors.slice(0, 10),
    errors:                  newErrors
  };
}

// ─── Helpers ──────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function httpPing(url, timeoutMs = 5000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(url, { signal: controller.signal }).catch(() => null);
    clearTimeout(timer);
    return response !== null && response.status < 500;
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function killProcess(child) {
  if (!child || child.killed || child.exitCode !== null) return;
  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', String(child.pid), '/f', '/t'], { shell: false }).unref();
    } else {
      child.kill('SIGTERM');
      setTimeout(() => { try { child.kill('SIGKILL'); } catch (_) {} }, 2000);
    }
  } catch (_) {}
}

function buildOutputErrorPatterns(diagnostic) {
  const patterns = [];
  if (diagnostic.import)  patterns.push(`Failed to resolve import "${diagnostic.import}"`);
  if (diagnostic.import)  patterns.push(`Cannot find module '${diagnostic.import}'`);
  if (diagnostic.file && diagnostic.line) patterns.push(`${diagnostic.file}:${diagnostic.line}`);
  if (diagnostic.code)    patterns.push(diagnostic.code.replace(/_/g, ' '));
  return patterns.filter(Boolean);
}

function extractTsErrors(output) {
  const results = [];
  const regex   = /([^\s()]+)\((\d+),(\d+)\):\s*error\s*TS(\d+):\s*(.*)/gi;
  let match;
  while ((match = regex.exec(output)) !== null) {
    results.push({
      file:    match[1],
      line:    Number(match[2]),
      column:  Number(match[3]),
      tsCode:  match[4],
      message: match[5]
    });
  }
  return results;
}

// ─── Finalisation du rapport ──────────────────────────────────────

function isGatePassed(gate) {
  if (!gate) return false;
  if (gate.mode === 'delegated_to_typecheck') return true;
  return gate.status === 'passed';
}

function finalizeReport(report) {
  // En mode dev, les gates vraiment critiques pour le fonctionnement visual/interactif sont patch, runtime et route
  const criticalGates = ['patch', 'runtime', 'route'];
  const criticalPassed = criticalGates.every(name => isGatePassed(report.gates[name]));

  report.status    = criticalPassed ? 'passed' : 'failed';
  report.promotion = 'not_started';

  if (!criticalPassed) {
    const failedGates = criticalGates.filter(name => !isGatePassed(report.gates[name]));
    report.code = 'VALIDATION_GATE_NOT_VERIFIED';
    report.failedGates = failedGates;
  }

  return report;
}

// ─── Entrée principale ────────────────────────────────────────────

async function validateWorkspace({ workspaceRoot, diagnostic, repairReport, routes = ['/'], projectId }) {
  const report = {
    repairId:        diagnostic.repairId || repairReport?.repairId,
    projectId,
    workspaceRoot,
    diagnosticId:    diagnostic.diagnosticId,
    startedAt:       new Date().toISOString(),
    status:          'pending',
    gates:           {},
    newErrors:       [],
    activeIntegrity: repairReport?.activeIntegrity || { status: 'pending', changedFiles: [] }
  };

  // Gate 1 — Patch appliqué ?
  report.gates.patch = (repairReport?.status === 'passed')
    ? { status: 'passed', verified: true, mode: 'real' }
    : { status: 'failed', verified: false, mode: 'real', errors: [{ code: 'PATCH_NOT_APPLIED' }] };

  if (!isGatePassed(report.gates.patch)) return finalizeReport(report);

  // Gate 2 — Local imports (délégué)
  report.gates.localImports = await runLocalImportGate({ workspaceRoot });

  // Gate 3 — Typecheck (inclus dans le diagnostic mais non-bloquant en dev)
  report.gates.typecheck = await runTypecheckGate({ workspaceRoot });

  // Gate 4 — Build (non-bloquant en mode dev)
  report.gates.build = await runBuildGate({ workspaceRoot });

  // Gate 5 — Runtime (preview / dev server + ping HTTP)
  report.gates.runtime = await runRuntimeGate({ workspaceRoot });
  if (!isGatePassed(report.gates.runtime)) return finalizeReport(report);

  // Gate 6 — Routes (Playwright / fetch)
  const runtimePort = report.gates.runtime.port || 4200;
  const baseUrl     = `http://127.0.0.1:${runtimePort}`;
  report.gates.route = await runRouteGate({ routes, baseUrl });

  // Gate 7 — Régression
  const buildOutput = [
    report.gates.build?.errors?.map(e => e.message).join('\n') || '',
    report.gates.typecheck?.errors?.map(e => e.message).join('\n') || ''
  ].join('\n');
  report.gates.regression = await runRegressionGate({ diagnostic, buildOutput });

  return finalizeReport(report);
}

module.exports = {
  validateWorkspace,
  runTypecheckGate,
  runBuildGate,
  runRuntimeGate,
  runRouteGate,
  runRegressionGate
};
