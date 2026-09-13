/**
 * HermesClient v2 — Fallback automatique sur DeepSeek/OpenAI
 *
 * Stratégie :
 *  1. Essaie le sidecar Python Hermes sur :8765 (si installé)
 *  2. Si indisponible → appelle directement l'API DeepSeek (ou OpenAI)
 *
 * Variables d'env requises pour le fallback :
 *  - DEEPSEEK_API_KEY  (priorité 1)
 *  - OPENAI_API_KEY    (priorité 2)
 */
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first'); // Fix pour "fetch failed" sur Windows/Node 18+ (contourne les problèmes de routage IPv6)
function resolveProvider({ provider, apiKey }) {
  if (provider === "deepseek") {
    return {
      name: "deepseek",
      apiUrl: process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions",
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat"
    };
  }

  if (provider === "openai") {
    return {
      name: "openai",
      apiUrl: "https://api.openai.com/v1/chat/completions",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini"
    };
  }

  if (provider === "gemini") {
    return {
      name: "gemini",
      apiUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: process.env.GEMINI_MODEL || "gemini-1.5-pro"
    };
  }

  throw Object.assign(
    new Error(`Provider LLM non supporté: ${provider}`),
    { code: "UNSUPPORTED_LLM_PROVIDER" }
  );
}

function normalizePromptState(state) {
  const instruction = state?.instruction && typeof state.instruction === "object" ? state.instruction : {};

  return {
    systemPrompt: state?.systemPrompt || instruction.systemPrompt || null,
    userPrompt: state?.userPrompt || instruction.userPrompt || null,
    jsonMode: state?.jsonMode === true || instruction.jsonMode === true,
    provider: state?.provider || instruction.provider || process.env.LLM_PROVIDER || "deepseek"
  };
}

class HermesClient {
  constructor(baseUrl = 'http://127.0.0.1:8765') {
    this.baseUrl = baseUrl;
  }

  async health() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(`${this.baseUrl}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  async generate(systemPrompt, userPrompt) {
    const res = await this.decide({
      state: {
        systemPrompt,
        userPrompt,
        jsonMode: false
      }
    });
    // La réponse peut varier selon que c'est le fallback ou le sidecar Python
    if (typeof res === "string") return res;
    return res.content || res.response || JSON.stringify(res);
  }

  /**
   * Appel principal avec fallback LLM intégré.
   */
  async decide({ state, memory, logs, tools }) {
    const promptState = normalizePromptState(state);

    const sidecardAvailable = await this.health();

    if (sidecardAvailable) {
      const response = await fetch(`${this.baseUrl}/decide`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          state,
          memory,
          logs,
          availableTools: tools,
          systemPrompt: promptState.systemPrompt,
          userPrompt: promptState.userPrompt,
          jsonMode: promptState.jsonMode
        }),
      });
      if (!response.ok) throw new Error(`Hermes API error: ${response.status}`);
      return response.json();
    }

    console.warn('[HERMES-CLIENT] ⚠️ Sidecar Python indisponible. Bascule sur le LLM direct...');
    return await this._fallbackLLM(state, promptState);
  }

  async _fallbackLLM(state, promptState) {
    if (!promptState) {
      promptState = normalizePromptState(state);
    }
    
    let envKey = global.HERMES_DEEPSEEK_KEY || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!envKey) {
      try {
        const fs = require('fs');
        const path = require('path');
        const keyPath = path.join(__dirname, '../../.api_keys.json');
        if (fs.existsSync(keyPath)) {
          const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
          envKey = keys.DEEPSEEK_API_KEY || keys.OPENAI_API_KEY || keys.ANTHROPIC_API_KEY;
        }
      } catch (e) {
        console.warn('[HERMES-CLIENT] Impossible de lire .api_keys.json :', e.message);
      }
    }

    const rawKey = envKey;

    if (!rawKey) {
      throw new Error(
        'Hermes indisponible et aucune clé API LLM configurée. ' +
        'Vérifiez le fichier .api_keys.json ou les variables d\'environnement.'
      );
    }

    const apiKey = rawKey.trim();
    const route = resolveProvider({ provider: promptState.provider, apiKey });

    const systemPrompt = promptState.systemPrompt || `Tu es un agent expert en React/TypeScript. Ton rôle est d'exécuter des tâches de patching de code UI selon les instructions fournies. Réponds UNIQUEMENT avec le code demandé, sans explications supplémentaires.`;
    const userPrompt = promptState.userPrompt || JSON.stringify(state, null, 2);

    console.log(`[HERMES-CLIENT] 🤖 Routage vers API (${route.name} - ${route.model}) → ${route.apiUrl}`);

    let response;
    let retries = 6;
    let attempt = 0;
    while (retries > 0) {
      attempt++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout
      
      try {
        response = await fetch(route.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Connection': 'keep-alive'
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: route.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user',   content: userPrompt },
            ],
            ...(promptState.jsonMode && { response_format: { type: 'json_object' } }),
            temperature: 0.3,
            max_tokens: 8000,
          }),
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Erreur LLM (${response.status}) : ${errText.substring(0, 200)}`);
        }
        break; // Succès, on sort de la boucle
      } catch (err) {
        clearTimeout(timeoutId);
        retries--;
        const waitMs = Math.min(30000, 3000 * Math.pow(1.5, attempt));
        console.warn(`[HERMES-CLIENT] ⚠️ Erreur réseau (${err.message}). Tentatives restantes: ${retries} (Pause de ${Math.round(waitMs / 1000)}s)...`);
        if (retries === 0) throw err;
        await new Promise(r => setTimeout(r, waitMs));
      }
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const content = choice?.message?.content || "";
    const finishReason = choice?.finish_reason || null;

    if (!content.trim()) {
      throw new Error("Réponse LLM vide.");
    }

    if (promptState.jsonMode === true && finishReason === "length") {
      throw Object.assign(
        new Error("Réponse JSON tronquée par max_tokens."),
        { code: "LLM_JSON_TRUNCATED", finishReason }
      );
    }

    if (promptState.jsonMode === true) {
      try {
        JSON.parse(content);
      } catch (error) {
        throw Object.assign(
          new Error("Réponse JSON invalide."),
          {
            code: "LLM_INVALID_JSON",
            cause: error.message,
            contentPreview: content.slice(0, 500)
          }
        );
      }
    }

    console.log(`[HERMES-CLIENT] ✅ Réponse LLM reçue (${content.length} caractères)`);

    return {
      content,
      finishReason,
      usage: data.usage || null,
      model: data.model || route.model,
      provider: route.name
    };
  }
}

module.exports = new HermesClient();

