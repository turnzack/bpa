'use strict';
/**
 * TIGER-044 — Serveur MCP browser-deepseek-extension
 * mcp/servers/browser-deepseek-extension.js
 *
 * Bridge entre Hermes Agent et l'Extension Chrome DeepSeek.
 * L'extension collecte, transmet — elle n'exécute RIEN.
 * Domaines autorisés : chat.deepseek.com uniquement.
 *
 * Outils :
 *   deepseek_web_generate       → Injecte un prompt via l'extension
 *   capture_deepseek_response   → Capture la dernière réponse DeepSeek
 *   get_extension_status        → Statut de connexion de l'extension
 *   send_prompt_to_browser      → Envoie un prompt structuré
 *   get_pending_contracts       → Récupère les contrats en attente
 */

const BRIDGE_URL     = 'http://127.0.0.1:5006';
const BRIDGE_TOKEN   = process.env.BRIDGE_TOKEN || 'local-sovereign-bridge';
const ALLOWED_DOMAINS = ['chat.deepseek.com', 'www.deepseek.com'];

const MAX_PROMPT_LENGTH = 50_000;

function bridgeHeaders() {
  return {
    'Content-Type':    'application/json',
    'X-Bridge-Token':  BRIDGE_TOKEN,
    'X-Bridge-Version': 'v5',
  };
}

async function bridgePost(endpoint, body) {
  const ctrl = new AbortController();
  const t    = setTimeout(() => ctrl.abort(), 30_000);
  try {
    const res = await fetch(`${BRIDGE_URL}${endpoint}`, {
      method:  'POST',
      headers: bridgeHeaders(),
      body:    JSON.stringify(body),
      signal:  ctrl.signal,
    });
    clearTimeout(t);
    return await res.json();
  } catch (e) {
    clearTimeout(t);
    throw new Error(`Bridge indisponible : ${e.message}`);
  }
}

async function bridgeGet(endpoint) {
  const ctrl = new AbortController();
  const t    = setTimeout(() => ctrl.abort(), 10_000);
  try {
    const res = await fetch(`${BRIDGE_URL}${endpoint}`, {
      headers: bridgeHeaders(),
      signal:  ctrl.signal,
    });
    clearTimeout(t);
    return await res.json();
  } catch (e) {
    clearTimeout(t);
    throw new Error(`Bridge GET indisponible : ${e.message}`);
  }
}

const SERVER = {
  name:        'browser-deepseek-extension',
  description: 'Bridge Hermes ↔ Extension Chrome DeepSeek Chat Web',

  getTools() {
    return [
      { name: 'deepseek_web_generate',     description: 'Injecte un prompt dans DeepSeek Chat Web via l\'extension', schema: { prompt: 'string', projectId: 'string', phase: 'string?' } },
      { name: 'capture_deepseek_response', description: 'Capture la dernière réponse générée par DeepSeek', schema: { taskId: 'string?' } },
      { name: 'get_extension_status',      description: 'Vérifie que l\'extension Chrome est connectée', schema: {} },
      { name: 'send_prompt_to_browser',    description: 'Envoie un prompt structuré à DeepSeek Chat Web', schema: { prompt: 'string', targetAi: 'string?', projectId: 'string', phaseNum: 'string?', phaseName: 'string?' } },
      { name: 'get_pending_contracts',     description: 'Récupère les contrats projet en attente de traitement', schema: {} },
    ];
  },

  async invoke(toolName, args) {
    switch (toolName) {

      case 'deepseek_web_generate':
      case 'send_prompt_to_browser': {
        const { prompt, projectId, phase, phaseNum, phaseName, targetAi = 'deepseek' } = args;
        if (!prompt || typeof prompt !== 'string') throw new Error('prompt requis.');
        if (!projectId) throw new Error('projectId requis.');
        if (prompt.length > MAX_PROMPT_LENGTH) throw new Error(`Prompt trop long (max ${MAX_PROMPT_LENGTH} chars).`);

        const result = await bridgePost('/bridge/prompt', {
          prompt,
          target_ai:      targetAi,
          target_project: projectId,
          project_id:     projectId,
          phase_num:      phaseNum || phase || 'generate',
          phase_name:     phaseName || 'mobile_generate',
        });

        return { success: true, promptId: result?.prompt_id, status: result?.status || 'queued' };
      }

      case 'capture_deepseek_response': {
        const { taskId } = args;
        const endpoint = taskId ? `/bridge/response/${taskId}` : '/bridge/response/latest';
        const result = await bridgeGet(endpoint);
        return { success: true, response: result };
      }

      case 'get_extension_status': {
        try {
          const result = await bridgeGet('/bridge/status');
          return {
            connected:      true,
            extensionReady: result?.extension_ready || false,
            lastSeen:       result?.last_seen || null,
            allowedDomains: ALLOWED_DOMAINS,
          };
        } catch {
          return { connected: false, extensionReady: false, allowedDomains: ALLOWED_DOMAINS };
        }
      }

      case 'get_pending_contracts': {
        const result = await bridgeGet('/bridge/contracts/pending');
        return { contracts: result?.contracts || [], count: result?.count || 0 };
      }

      default:
        throw new Error(`Outil inconnu : ${toolName}`);
    }
  },
};

module.exports = SERVER;
