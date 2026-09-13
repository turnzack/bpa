'use strict';
/**
 * TIGER-041 — Politique de sécurité MCP
 * electron/mcp/mcp-policy.js
 *
 * Règles absolues :
 * - Allowlist des 6 serveurs autorisés uniquement
 * - Transport : stdio local ou HTTP localhost uniquement
 * - Journalisation de chaque invocation d'outil
 * - Confirmation obligatoire pour les actions protégées
 */

const ALLOWED_SERVERS = new Set([
  'project-filesystem',
  'project-memory',
  'browser-deepseek-extension',
  'project-runner',
  'expo-mobile',
  'git-deployment',
]);

// Outils nécessitant confirmation explicite
const PROTECTED_TOOLS = new Set([
  'git_push',
  'build_android',
  'build_ios',
  'clear_project_memory',
  'delete_file',
]);

// Transports autorisés
const ALLOWED_TRANSPORTS = new Set(['stdio', 'http-local']);

/**
 * Valide qu'un serveur MCP est autorisé à s'exécuter.
 * @param {object} config  { name, transport, command, args, env }
 * @returns {{ ok: boolean, error?: string }}
 */
function validateServer(config) {
  if (!config || typeof config !== 'object') return { ok: false, error: 'Configuration MCP invalide.' };

  if (!config.name || !ALLOWED_SERVERS.has(config.name)) {
    return { ok: false, error: `Serveur MCP non autorisé : "${config.name}". Serveurs acceptés : ${[...ALLOWED_SERVERS].join(', ')}` };
  }

  if (config.transport && !ALLOWED_TRANSPORTS.has(config.transport)) {
    return { ok: false, error: `Transport MCP non autorisé : "${config.transport}". Acceptés : stdio, http-local` };
  }

  // Vérification URL pour transport HTTP
  if (config.transport === 'http-local' && config.url) {
    const url = config.url;
    if (!url.startsWith('http://127.0.0.1') && !url.startsWith('http://localhost')) {
      return { ok: false, error: `URL MCP non autorisée (doit être 127.0.0.1 ou localhost) : ${url}` };
    }
  }

  // Vérification command (pas d'injection)
  if (config.command && typeof config.command === 'string') {
    const dangerous = [';', '&&', '||', '`', '$(' , '|'];
    for (const c of dangerous) {
      if (config.command.includes(c)) return { ok: false, error: `Commande MCP dangereuse : ${config.command}` };
    }
  }

  return { ok: true };
}

/**
 * Vérifie si un outil nécessite confirmation.
 * @param {string} serverName
 * @param {string} toolName
 * @returns {boolean}
 */
function requiresConfirmation(serverName, toolName) {
  return PROTECTED_TOOLS.has(toolName);
}

/**
 * Journalise une invocation MCP.
 */
function logInvocation(serverName, toolName, args, result, error = null) {
  const entry = {
    timestamp:  new Date().toISOString(),
    server:     serverName,
    tool:       toolName,
    args:       sanitizeArgs(args),
    success:    !error,
    error:      error?.message || null,
    resultSize: result ? JSON.stringify(result).length : 0,
  };
  console.log(`[MCP-AUDIT] ${JSON.stringify(entry)}`);
  return entry;
}

/**
 * Supprime les valeurs sensibles des arguments avant log.
 */
function sanitizeArgs(args) {
  if (!args || typeof args !== 'object') return args;
  const sanitized = { ...args };
  const sensitiveKeys = ['token', 'secret', 'password', 'key', 'apikey', 'authorization'];
  for (const k of Object.keys(sanitized)) {
    if (sensitiveKeys.some(s => k.toLowerCase().includes(s))) sanitized[k] = '[REDACTED]';
  }
  return sanitized;
}

module.exports = { validateServer, requiresConfirmation, logInvocation, ALLOWED_SERVERS, PROTECTED_TOOLS };
