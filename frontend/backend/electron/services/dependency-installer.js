'use strict';
/**
 * TIGER-022 — Service d'installation des dépendances
 * electron/services/dependency-installer.js
 *
 * Règle absolue : toutes les commandes sont construites par Electron,
 * jamais depuis le contenu LLM. Utilisation de spawn avec shell: false.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs   = require('fs');

const INSTALL_TIMEOUT_MS = 180_000; // 3 minutes par phase
const IS_WIN = process.platform === 'win32';

/**
 * Exécute une commande sécurisée avec spawn shell:false
 * @param {string} cmd
 * @param {string[]} args
 * @param {string} cwd
 * @param {Function} onLog  callback(line: string)
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>}
 */
function spawnSecure(cmd, args, cwd, onLog = () => {}) {
  return new Promise((resolve, reject) => {
    const bin = IS_WIN && !cmd.endsWith('.cmd') ? `${cmd}.cmd` : cmd;

    const child = spawn(bin, args, {
      cwd,
      shell:        false,   // 🛡️ JAMAIS shell: true
      windowsHide:  true,
      env: {
        ...process.env,
        // Nettoyage des vars sensibles transmises au processus enfant
        npm_config_token:  undefined,
        NPM_TOKEN:         undefined,
        GITHUB_TOKEN:      undefined,
        DEEPSEEK_API_KEY:  undefined,
      },
    });

    let stdout = '';
    let stderr = '';

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Timeout (${INSTALL_TIMEOUT_MS / 1000}s) atteint pour : ${cmd} ${args.join(' ')}`));
    }, INSTALL_TIMEOUT_MS);

    child.stdout.on('data', d => { const line = d.toString(); stdout += line; onLog(line.trim()); });
    child.stderr.on('data', d => { const line = d.toString(); stderr += line; });
    child.on('close', code => { clearTimeout(timeout); resolve({ code: code || 0, stdout, stderr }); });
    child.on('error', err => { clearTimeout(timeout); reject(err); });
  });
}

/**
 * Service d'installation des dépendances en 5 phases séquentielles.
 */
class DependencyInstaller {
  /**
   * @param {object} opts
   * @param {string} opts.projectDir   Dossier racine du projet Expo
   * @param {string} opts.projectName  Nom du projet
   * @param {object} opts.deps         { expo, native, runtime, dev }
   * @param {Function} opts.onLog      Callback pour les logs en temps réel
   * @param {Function} opts.onPhase    Callback pour les transitions de phase
   */
  constructor({ projectDir, projectName, deps, onLog = () => {}, onPhase = () => {} }) {
    this.projectDir  = projectDir;
    this.projectName = projectName;
    this.deps        = deps;
    this.onLog       = onLog;
    this.onPhase     = onPhase;
    this.results     = [];
  }

  log(msg) { this.onLog(`[INSTALLER] ${msg}`); }

  async runPhase(phaseNum, phaseName, cmd, args) {
    this.log(`Phase ${phaseNum} : ${phaseName} — ${cmd} ${args.join(' ')}`);
    this.onPhase({ phase: phaseNum, name: phaseName, status: 'running' });

    try {
      const result = await spawnSecure(cmd, args, this.projectDir, line => this.log(line));
      const success = result.code === 0;

      this.results.push({ phase: phaseNum, name: phaseName, success, code: result.code, stdout: result.stdout.slice(-2000), stderr: result.stderr.slice(-1000) });

      this.onPhase({ phase: phaseNum, name: phaseName, status: success ? 'done' : 'failed', code: result.code });

      if (!success) {
        throw Object.assign(new Error(`Phase ${phaseNum} (${phaseName}) échouée (code ${result.code})`), {
          code: 'INSTALL_PHASE_FAILED',
          phase: phaseNum,
          phaseName,
          exitCode: result.code,
          stderr: result.stderr,
        });
      }

      return result;
    } catch (e) {
      this.results.push({ phase: phaseNum, name: phaseName, success: false, error: e.message });
      this.onPhase({ phase: phaseNum, name: phaseName, status: 'failed', error: e.message });
      throw e;
    }
  }

  /**
   * Lance les 5 phases d'installation séquentiellement.
   */
  async install() {
    const { expo = [], native = [], runtime = [], dev = [] } = this.deps;

    // Phase 0 — Vérification que le dossier projet existe
    if (!fs.existsSync(this.projectDir)) {
      throw new Error(`Dossier projet introuvable : ${this.projectDir}`);
    }

    // Vérifier si package.json existe (projet déjà bootstrappé)
    const hasPackageJson = fs.existsSync(path.join(this.projectDir, 'package.json'));

    if (!hasPackageJson) {
      // Phase 1 — Bootstrap Expo (uniquement si pas encore fait)
      await this.runPhase(1, 'create-expo-app', 'npx', [
        'create-expo-app@latest', '.', '--template', 'blank-typescript', '--no-install',
      ]);
    } else {
      this.log('Phase 1 : package.json existant détecté — bootstrap ignoré.');
    }

    // Phase 2 — Installation des deps natives Expo
    const nativeDeps = [...expo, ...native].filter(Boolean);
    if (nativeDeps.length > 0) {
      await this.runPhase(2, 'expo install (native)', 'npx', ['expo', 'install', ...nativeDeps]);
    } else {
      this.log('Phase 2 : aucune dépendance native à installer.');
    }

    // Phase 3 — Installation des deps runtime JavaScript
    if (runtime.length > 0) {
      await this.runPhase(3, 'pnpm add (runtime)', 'pnpm', ['add', ...runtime]);
    } else {
      this.log('Phase 3 : aucune dépendance runtime à installer.');
    }

    // Phase 4 — Installation des deps dev
    if (dev.length > 0) {
      await this.runPhase(4, 'pnpm add -D (dev)', 'pnpm', ['add', '-D', ...dev]);
    } else {
      this.log('Phase 4 : aucune dépendance dev à installer.');
    }

    // Phase 5 — Vérification de compatibilité Expo
    await this.runPhase(5, 'expo install --check', 'npx', ['expo', 'install', '--check']);

    this.log('✅ Toutes les phases d\'installation ont réussi.');
    return { success: true, results: this.results };
  }
}

module.exports = { DependencyInstaller, spawnSecure };
