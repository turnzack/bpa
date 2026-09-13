'use strict';
/**
 * TIGER-051 — Serveur MCP expo-mobile
 * mcp/servers/expo-mobile.js
 *
 * Outils spécialisés Expo : install_dependencies, run_typecheck, start_expo,
 * build_android (protégé), build_ios (protégé)
 *
 * Utilise npx expo install (sélection auto des versions compatibles SDK).
 * Ne fixe JAMAIS les versions manuellement.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs   = require('fs');

const IS_WIN = process.platform === 'win32';

function spawnExpo(args, cwd, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const bin = IS_WIN ? 'npx.cmd' : 'npx';
    const child = spawn(bin, ['expo', ...args], {
      cwd,
      shell:       false,
      windowsHide: true,
      env: { ...process.env, CI: '1', EXPO_NO_TELEMETRY: '1' },
    });

    let stdout = '';
    let stderr = '';

    const timer = timeoutMs ? setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Timeout Expo (${timeoutMs / 1000}s) : expo ${args.join(' ')}`));
    }, timeoutMs) : null;

    child.stdout.on('data', d => { stdout += d.toString(); });
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('close', code => {
      if (timer) clearTimeout(timer);
      resolve({ code: code ?? 0, stdout: stdout.slice(-4000), stderr: stderr.slice(-2000) });
    });
    child.on('error', err => { if (timer) clearTimeout(timer); reject(err); });
  });
}

const SERVER = {
  name:        'expo-mobile',
  description: 'Gestion des opérations Expo (install, typecheck, start, build)',

  getTools() {
    return [
      { name: 'install_dependencies', description: 'npx expo install — versions compatibles SDK auto', schema: { projectDir: 'string', packages: 'string[]?' } },
      { name: 'check_compatibility',  description: 'npx expo install --check', schema: { projectDir: 'string' } },
      { name: 'run_typecheck',        description: 'tsc --noEmit sur le projet Expo', schema: { projectDir: 'string' } },
      { name: 'start_expo',           description: 'npx expo start', schema: { projectDir: 'string', mode: 'string?' } },
      { name: 'build_android',        description: 'Build Android (PROTÉGÉ — confirmation requise)', schema: { projectDir: 'string', profile: 'string?' } },
      { name: 'build_ios',            description: 'Build iOS (PROTÉGÉ — confirmation requise)', schema: { projectDir: 'string', profile: 'string?' } },
      { name: 'get_sdk_version',      description: 'Retourne la version SDK Expo du projet', schema: { projectDir: 'string' } },
    ];
  },

  async invoke(toolName, args) {
    const { projectDir } = args;
    if (!projectDir) throw new Error('projectDir requis.');
    if (!fs.existsSync(projectDir)) throw new Error(`Dossier projet introuvable : ${projectDir}`);

    switch (toolName) {

      case 'install_dependencies': {
        const { packages = [] } = args;
        const expoArgs = packages.length > 0 ? ['install', ...packages] : ['install'];
        const r = await spawnExpo(expoArgs, projectDir, 180_000);
        return { success: r.code === 0, code: r.code, installed: packages, stdout: r.stdout.slice(-2000) };
      }

      case 'check_compatibility': {
        const r = await spawnExpo(['install', '--check'], projectDir, 60_000);
        return { success: r.code === 0, code: r.code, output: (r.stdout + r.stderr).slice(-2000) };
      }

      case 'run_typecheck': {
        const bin = IS_WIN ? 'npx.cmd' : 'npx';
        const child = spawn(bin, ['tsc', '--noEmit', '--pretty', 'false'], {
          cwd:   projectDir,
          shell: false,
          env:   { ...process.env, CI: '1' },
        });
        const output = await new Promise((resolve, reject) => {
          let out = '';
          const t = setTimeout(() => { child.kill(); reject(new Error('Timeout tsc')); }, 60_000);
          child.stdout.on('data', d => { out += d; });
          child.stderr.on('data', d => { out += d; });
          child.on('close', code => { clearTimeout(t); resolve({ code, out }); });
          child.on('error', reject);
        });
        const errors = parseTypescriptErrors(output.out);
        return { success: output.code === 0, code: output.code, errors, errorCount: errors.length };
      }

      case 'start_expo': {
        const { mode = 'development' } = args;
        const expoArgs = mode === 'tunnel'
          ? ['start', '--tunnel']
          : ['start', '--lan'];

        // Lancement non-bloquant
        const bin = IS_WIN ? 'npx.cmd' : 'npx';
        const child = spawn(bin, ['expo', ...expoArgs], {
          cwd:         projectDir,
          shell:       false,
          windowsHide: true,
          detached:    false,
          env:         { ...process.env, CI: '0', EXPO_NO_TELEMETRY: '1' },
        });

        return { success: true, status: 'starting', pid: child.pid, mode };
      }

      case 'build_android': {
        // Cet outil est dans PROTECTED_TOOLS — la confirmation est gérée par mcp-policy
        const { profile = 'development' } = args;
        const r = await spawnExpo(['build:android', '--profile', profile, '--non-interactive'], projectDir, 900_000); // 15 min
        return { success: r.code === 0, code: r.code, profile, output: r.stdout.slice(-3000) };
      }

      case 'build_ios': {
        const { profile = 'development' } = args;
        const r = await spawnExpo(['build:ios', '--profile', profile, '--non-interactive'], projectDir, 900_000);
        return { success: r.code === 0, code: r.code, profile, output: r.stdout.slice(-3000) };
      }

      case 'get_sdk_version': {
        try {
          const pkgPath = path.join(projectDir, 'package.json');
          const pkg     = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
          const sdkVersion = pkg.dependencies?.expo || pkg.devDependencies?.expo || 'unknown';
          return { sdkVersion, expoVersion: sdkVersion };
        } catch {
          return { sdkVersion: 'unknown', error: 'package.json introuvable' };
        }
      }

      default:
        throw new Error(`Outil inconnu : ${toolName}`);
    }
  },
};

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
