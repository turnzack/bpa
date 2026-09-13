'use strict';
/**
 * TIGER-040 — MCP Host : initialisation et auto-connexion des serveurs
 * electron/mcp/mcp-host.js
 *
 * Charge les 3 serveurs essentiels au démarrage et les enregistre dans le registry.
 * Point d'entrée unique pour toute interaction MCP.
 */

const registry = require('./mcp-registry');

// Serveurs MCP (vague 1 — Sprint 4)
let ServerFilesystem = null;
let ServerMemory = null;
let ServerBrowser = null;
try { ServerFilesystem = require('../../mcp/servers/project-filesystem'); } catch(e) { console.warn('[MCP-HOST] project-filesystem non chargé:', e.message); }
try { ServerMemory     = require('../../mcp/servers/project-memory');     } catch(e) { console.warn('[MCP-HOST] project-memory non chargé:',     e.message); }
try { ServerBrowser    = require('../../mcp/servers/browser-deepseek-extension'); } catch(e) { console.warn('[MCP-HOST] browser-deepseek non chargé:', e.message); }

// Serveurs MCP (vague 2 — Sprint 5)
let ServerRunner  = null;
let ServerExpo    = null;
let ServerGit     = null;
let ServerKnowledgeProvider = null;

try { ServerRunner = require('../../mcp/servers/project-runner');  } catch (e) { console.warn('[MCP-HOST] project-runner non chargé:', e.message); }
try { ServerExpo   = require('../../mcp/servers/expo-mobile');     } catch (e) { console.warn('[MCP-HOST] expo-mobile non chargé:',    e.message); }
try { ServerGit    = require('../../mcp/servers/git-deployment');  } catch (e) { console.warn('[MCP-HOST] git-deployment non chargé:', e.message); }
try { ServerKnowledgeProvider = require('../../mcp/servers/knowledge-provider'); } catch (e) { console.warn('[MCP-HOST] knowledge-provider non chargé:', e.message); }

let _initialized = false;

/**
 * Initialise et connecte tous les serveurs MCP disponibles.
 */
async function init() {
  if (_initialized) return;
  _initialized = true;

  const servers = [
    ServerFilesystem,
    ServerMemory,
    ServerBrowser,
    ServerRunner,
    ServerExpo,
    ServerGit,
    ServerKnowledgeProvider,
  ].filter(Boolean);

  console.log(`[MCP-HOST] Initialisation de ${servers.length} serveurs MCP...`);

  for (const srv of servers) {
    const regResult = registry.register({ name: srv.name, transport: 'stdio', description: srv.description, server: srv });
    if (!regResult.ok) {
      console.warn(`[MCP-HOST] Serveur refusé par la policy : ${srv.name} — ${regResult.error}`);
      continue;
    }

    const connResult = await registry.connect(srv.name);
    if (!connResult.ok) {
      console.warn(`[MCP-HOST] Connexion échouée : ${srv.name} — ${connResult.error}`);
    } else {
      console.log(`[MCP-HOST] ✅ ${srv.name} — ${connResult.tools.length} outils`);
    }
  }

  console.log('[MCP-HOST] Initialisation terminée.');
  const allTools = registry.discoverAllTools();
  console.log(`[MCP-HOST] ${allTools.length} outils MCP disponibles au total.`);
}

/**
 * Invoque un outil MCP de manière sécurisée.
 * @param {string} serverName
 * @param {string} toolName
 * @param {object} args
 * @param {object} opts  { confirmed?: boolean }
 */
async function call(serverName, toolName, args = {}, opts = {}) {
  return registry.invoke(serverName, toolName, args, opts);
}

/**
 * Invoque un outil via son ID complet : "mcp.<server>.<tool>"
 * @param {string} toolId    Ex: "mcp.project-filesystem.read_project_file"
 * @param {object} args
 */
async function callById(toolId, args = {}, opts = {}) {
  const parts = toolId.split('.');
  if (parts.length < 3 || parts[0] !== 'mcp') throw new Error(`toolId invalide : ${toolId}. Format attendu : mcp.<server>.<tool>`);

  const serverName = parts.slice(1, -1).join('.');
  const toolName   = parts[parts.length - 1];
  return call(serverName, toolName, args, opts);
}

module.exports = { init, call, callById, registry };
