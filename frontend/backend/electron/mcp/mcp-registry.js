'use strict';
/**
 * TIGER-040 — MCP Registry & Host
 * electron/mcp/mcp-registry.js
 *
 * Registre central des serveurs MCP locaux.
 * Gère le cycle de vie : register → connect → discover → invoke → disconnect
 */

const { validateServer, requiresConfirmation, logInvocation } = require('./mcp-policy');

// ─── Registre en mémoire ────────────────────────────────────────────────────
const _registry = new Map(); // name → { config, status, tools, server }

/**
 * Enregistre un serveur MCP (validation policy avant tout).
 * @param {object} config  { name, transport, description, server }
 * @returns {{ ok: boolean, error?: string }}
 */
function register(config) {
  const validation = validateServer(config);
  if (!validation.ok) return validation;

  if (_registry.has(config.name)) {
    console.log(`[MCP-REGISTRY] Serveur "${config.name}" déjà enregistré — mise à jour.`);
  }

  _registry.set(config.name, {
    config,
    status: 'registered',
    tools:  [],
    server: config.server || null,
    connectedAt: null,
  });

  console.log(`[MCP-REGISTRY] Serveur enregistré : ${config.name}`);
  return { ok: true };
}

/**
 * Connecte un serveur et découvre ses outils.
 * @param {string} name
 * @returns {{ ok: boolean, tools?: object[], error?: string }}
 */
async function connect(name) {
  const entry = _registry.get(name);
  if (!entry) return { ok: false, error: `Serveur non enregistré : ${name}` };

  try {
    entry.status    = 'connecting';
    const tools     = entry.server?.getTools?.() || [];
    entry.tools     = tools;
    entry.status    = 'connected';
    entry.connectedAt = Date.now();
    console.log(`[MCP-REGISTRY] Connecté : ${name} — ${tools.length} outils disponibles.`);
    return { ok: true, tools };
  } catch (e) {
    entry.status = 'error';
    return { ok: false, error: `Connexion échouée pour ${name} : ${e.message}` };
  }
}

/**
 * Retourne tous les outils de tous les serveurs connectés.
 * Format : mcp.<server>.<tool>
 */
function discoverAllTools() {
  const allTools = [];
  for (const [name, entry] of _registry) {
    if (entry.status !== 'connected') continue;
    for (const tool of entry.tools) {
      allTools.push({
        id:          `mcp.${name}.${tool.name}`,
        server:      name,
        name:        tool.name,
        description: tool.description || '',
        schema:      tool.schema      || {},
      });
    }
  }
  return allTools;
}

/**
 * Invoque un outil d'un serveur MCP.
 * @param {string} serverName
 * @param {string} toolName
 * @param {object} args
 * @param {object} opts  { requireConfirmation?: boolean }
 * @returns {Promise<{ ok: boolean, result?: any, error?: string }>}
 */
async function invoke(serverName, toolName, args = {}, opts = {}) {
  const entry = _registry.get(serverName);
  if (!entry) return { ok: false, error: `Serveur non enregistré : ${serverName}` };
  if (entry.status !== 'connected') return { ok: false, error: `Serveur non connecté : ${serverName} (statut : ${entry.status})` };

  // Vérification confirmation
  if (requiresConfirmation(serverName, toolName) && !opts.confirmed) {
    return { ok: false, requiresConfirmation: true, error: `L'outil "${toolName}" nécessite une confirmation explicite.` };
  }

  try {
    const result = await entry.server.invoke(toolName, args);
    logInvocation(serverName, toolName, args, result);
    return { ok: true, result };
  } catch (e) {
    logInvocation(serverName, toolName, args, null, e);
    return { ok: false, error: `Erreur lors de l'invocation ${serverName}.${toolName} : ${e.message}` };
  }
}

/**
 * Déconnecte un serveur.
 */
function disconnect(name) {
  const entry = _registry.get(name);
  if (!entry) return;
  entry.status = 'disconnected';
  entry.tools  = [];
  console.log(`[MCP-REGISTRY] Déconnecté : ${name}`);
}

/**
 * Retourne le statut de tous les serveurs.
 */
function status() {
  const result = {};
  for (const [name, entry] of _registry) {
    result[name] = {
      status:      entry.status,
      toolsCount:  entry.tools.length,
      connectedAt: entry.connectedAt,
      tools:       entry.tools.map(t => t.name),
    };
  }
  return result;
}

/**
 * Retourne les outils d'un serveur spécifique.
 */
function getServerTools(name) {
  const entry = _registry.get(name);
  if (!entry) return null;
  return entry.tools;
}

module.exports = { register, connect, disconnect, invoke, discoverAllTools, status, getServerTools };
