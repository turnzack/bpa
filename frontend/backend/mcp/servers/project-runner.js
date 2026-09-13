'use strict';
/**
 * TIGER-050 — Serveur MCP project-runner
 * mcp/servers/project-runner.js
 *
 * Outils : install_dependencies, run_typecheck, run_lint, run_tests, start_expo, stop_preview
 *
 * RÈGLE ABSOLUE : Commandes pré-approuvées uniquement. Aucune commande depuis le LLM.
 * spawn avec shell: false partout.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs   = require('fs');

const IS_WIN = process.platform === 'win32';

// Processus actifs (pour stop_preview)
const _activeProcesses = new Map();

// Timeout par type de commande
const TIMEOUTS = {
  install:   180_000,  // 3 min
  typecheck:  60_000,  // 1 min
  lint:       60_000,
  test:      120_000,  // 2 min
  start:    null,      // persistent — pas de timeout
};

/**
 * Exécute une commande approuvée avec spawn shell:false.
 * @param {string}   cmd
 * @param {string[]} args
 * @param {string}   cwd
 * @param {number|null} timeoutMs
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
function spawnCmd(cmd, args, cwd, timeoutMs = 60_000) {
  return new Promise((resolve, reject) => {
    const bin = IS_WIN ? `${cmd}.cmd` : cmd;

    const child = spawn(bin, args, {
      cwd,
      shell:       false,
      windowsHide: true,
      env: { ...process.env, FORCE_COLOR: '0', CI: '1' },
    });

    let stdout = '';
    let stderr = '';

    const timer = timeoutMs ? setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Timeout (${timeoutMs / 1000}s) : ${cmd} ${args.join(' ')}`));
    }, timeoutMs) : null;

    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('close', code => {
      if (timer) clearTimeout(timer);
      resolve({ code: code ?? 0, stdout: stdout.slice(-5000), stderr: stderr.slice(-2000) });
    });
    child.on('error', err => { if (timer) clearTimeout(timer); reject(err); });
  });
}

const SERVER = {
  name:        'project-runner',
  description: 'Exécution sécurisée des commandes de build/test/preview du projet',

  getTools() {
    return [
      { name: 'install_dependencies', description: 'Installe les dépendances pnpm', schema: { projectDir: 'string' } },
      { name: 'run_typecheck',        description: 'Lance tsc --noEmit', schema: { projectDir: 'string' } },
      { name: 'run_lint',             description: 'Lance ESLint sur les fichiers TypeScript', schema: { projectDir: 'string' } },
      { name: 'run_tests',            description: 'Lance les tests Jest', schema: { projectDir: 'string' } },
      { name: 'start_expo',           description: 'Démarre le serveur Metro Expo', schema: { projectDir: 'string', port: 'number?' } },
      { name: 'stop_preview',         description: 'Arrête le serveur Metro Expo', schema: { projectDir: 'string' } },
      { name: 'get_preview_status',   description: 'Retourne l\'état du serveur Metro', schema: { projectDir: 'string' } },
    ];
  },

  async invoke(toolName, args) {
    const { projectDir, port = 8081 } = args;
    if (!projectDir) throw new Error('projectDir requis.');
    if (!fs.existsSync(projectDir)) throw new Error(`Dossier projet introuvable : ${projectDir}`);

    switch (toolName) {

      case 'install_dependencies': {
        // Phase 1 : pnpm install
        const r1 = await spawnCmd('pnpm', ['install'], projectDir, TIMEOUTS.install);
        if (r1.code !== 0) return { success: false, phase: 'pnpm install', code: r1.code, stderr: r1.stderr };

        // Phase 2 : expo install --check
        const hasExpo = fs.existsSync(path.join(projectDir, 'node_modules', '.bin', 'expo')) ||
                        fs.existsSync(path.join(projectDir, 'node_modules', '.bin', 'expo.cmd'));
        if (hasExpo) {
          await spawnCmd('npx', ['expo', 'install', '--check'], projectDir, TIMEOUTS.install);
        }

        return { success: true, stdout: r1.stdout.slice(-1000) };
      }

      case 'run_typecheck': {
        const r = await spawnCmd('npx', ['tsc', '--noEmit', '--pretty', 'false'], projectDir, TIMEOUTS.typecheck);
        const errors = parseTypescriptErrors(r.stdout + r.stderr);
        return { success: r.code === 0, code: r.code, errors, errorCount: errors.length, raw: (r.stdout + r.stderr).slice(-3000) };
      }

      case 'run_lint': {
        const r = await spawnCmd('npx', ['eslint', 'src', '--ext', '.ts,.tsx', '--format', 'json'], projectDir, TIMEOUTS.lint);
        let lintResults = [];
        try { lintResults = JSON.parse(r.stdout); } catch {}
        const errorCount   = lintResults.reduce((a, f) => a + f.errorCount, 0);
        const warningCount = lintResults.reduce((a, f) => a + f.warningCount, 0);
        return { success: r.code === 0, code: r.code, errorCount, warningCount, results: lintResults.slice(0, 10) };
      }

      case 'run_tests': {
        const r = await spawnCmd('npx', ['jest', '--json', '--passWithNoTests'], projectDir, TIMEOUTS.test);
        let testResults = {};
        try { testResults = JSON.parse(r.stdout); } catch {}
        return { success: r.code === 0, code: r.code, numTests: testResults.numTotalTests || 0, numFailed: testResults.numFailedTests || 0, numPassed: testResults.numPassedTests || 0 };
      }

      case 'start_expo': {
        const key = projectDir;
        if (_activeProcesses.has(key)) return { success: true, status: 'already_running', port };

        const bin = IS_WIN ? 'npx.cmd' : 'npx';
        const child = spawn(bin, ['expo', 'start', '--port', String(port), '--no-dev', '--minify'], {
          cwd:         projectDir,
          shell:       false,
          windowsHide: true,
          detached:    false,
          env:         { ...process.env, CI: '0' },
        });

        _activeProcesses.set(key, { child, port, startedAt: Date.now() });

        child.on('close', () => _activeProcesses.delete(key));
        child.on('error', () => _activeProcesses.delete(key));

        return { success: true, status: 'starting', port, pid: child.pid };
      }

      case 'stop_preview': {
        const proc = _activeProcesses.get(projectDir);
        if (!proc) return { success: true, status: 'not_running' };
        proc.child.kill('SIGTERM');
        _activeProcesses.delete(projectDir);
        return { success: true, status: 'stopped' };
      }

      case 'get_preview_status': {
        const proc = _activeProcesses.get(projectDir);
        return {
          running:   !!proc,
          port:      proc?.port || null,
          pid:       proc?.child?.pid || null,
          startedAt: proc?.startedAt || null,
        };
      }

      default:
        throw new Error(`Outil inconnu : ${toolName}`);
    }
  },
};

/**
 * Parse les erreurs TypeScript depuis la sortie tsc.
 */
function parseTypescriptErrors(output) {
  const errors = [];
  const re = /^(.+)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/gm;
  let m;
  while ((m = re.exec(output)) !== null) {
    errors.push({ file: m[1].trim(), line: parseInt(m[2]), col: parseInt(m[3]), code: m[4], message: m[5].trim() });
    if (errors.length >= 50) break;
  }
  return errors;
}

module.exports = SERVER;
