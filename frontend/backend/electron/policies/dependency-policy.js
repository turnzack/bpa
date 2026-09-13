'use strict';
/**
 * TIGER-021 — Politique de dépendances (allowlist stricte)
 * electron/policies/dependency-policy.js
 *
 * Règle : Electron construit les commandes. Le LLM fournit des INTENTIONS.
 * Aucune commande n'est jamais construite depuis le contenu LLM directement.
 */

const { ALLOWED_NATIVE, ALLOWED_RUNTIME, ALLOWED_DEV } = require('../../shared/schemas/project-contract-schema');

// Patterns interdits dans tous les noms de packages
const BANNED_PATTERNS = [
  /^\.\.\//,        // chemin relatif
  /^file:/i,        // protocole file:
  /^git\+/i,        // git+ssh, git+http
  /^https?:\/\//i,  // URL directe
  /^github:/i,      // raccourci GitHub
  /[;&|`$]/,        // injection shell
  /\s/,             // espaces (injection d'arguments)
];

// Commandes intentions autorisées (mappées côté Electron vers les vraies commandes)
const ALLOWED_COMMANDS = new Set([
  'install_dependencies',
  'run_typecheck',
  'run_lint',
  'run_tests',
  'start_preview',
  'stop_preview',
  'run_typecheck_fix',
  'install_native_deps',
  'install_runtime_deps',
  'install_dev_deps',
  'check_compatibility',
  'create_expo_project',
  'git_status',
  'git_commit',
  'git_push',     // requiert confirmation
  'build_android',
  'build_ios',
]);

// Commandes nécessitant une confirmation utilisateur
const PROTECTED_COMMANDS = new Set(['git_push', 'build_android', 'build_ios']);

/**
 * Valide un nom de package.
 * @param {string} pkg
 * @returns {{ ok: boolean, error?: string }}
 */
function validatePackageName(pkg) {
  if (typeof pkg !== 'string' || pkg.trim().length === 0) return { ok: false, error: `Nom de package invalide : ${JSON.stringify(pkg)}` };
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(pkg)) return { ok: false, error: `Package interdit (pattern dangereux) : ${pkg}` };
  }
  return { ok: true };
}

/**
 * Filtre et valide les dépendances par catégorie.
 * @param {{ expo?: string[], native?: string[], runtime?: string[], dev?: string[] }} deps
 * @param {string} projectType
 * @returns {{ approved: object, rejected: object[], warnings: string[] }}
 */
function filterDependencies(deps, projectType = 'react-native-expo') {
  const approved  = { expo: [], native: [], runtime: [], dev: [] };
  const rejected  = [];
  const warnings  = [];

  const process = (list, category, allowlist) => {
    for (const pkg of (list || [])) {
      const v = validatePackageName(pkg);
      if (!v.ok) {
        rejected.push({ pkg, category, reason: v.error });
        continue;
      }
      if (allowlist && !allowlist.has(pkg)) {
        warnings.push(`Package non dans l'allowlist [${category}] : ${pkg} (autorisé avec prudence)`);
      }
      approved[category].push(pkg);
    }
  };

  process(deps.expo,    'expo',    ALLOWED_NATIVE);
  process(deps.native,  'native',  ALLOWED_NATIVE);
  process(deps.runtime, 'runtime', ALLOWED_RUNTIME);
  process(deps.dev,     'dev',     ALLOWED_DEV);

  return { approved, rejected, warnings };
}

/**
 * Valide une commande intention.
 * @param {string} cmd
 * @returns {{ ok: boolean, requiresConfirmation: boolean, error?: string }}
 */
function validateCommand(cmd) {
  if (!ALLOWED_COMMANDS.has(cmd)) {
    return { ok: false, requiresConfirmation: false, error: `Commande non autorisée : ${cmd}` };
  }
  return { ok: true, requiresConfirmation: PROTECTED_COMMANDS.has(cmd) };
}

/**
 * Filtre un tableau de commandes intentions.
 */
function filterCommands(commands = []) {
  const approved  = [];
  const rejected  = [];

  for (const cmd of commands) {
    const v = validateCommand(cmd);
    if (v.ok) approved.push({ cmd, requiresConfirmation: v.requiresConfirmation });
    else rejected.push({ cmd, reason: v.error });
  }

  return { approved, rejected };
}

module.exports = { validatePackageName, filterDependencies, validateCommand, filterCommands, ALLOWED_COMMANDS, PROTECTED_COMMANDS };
