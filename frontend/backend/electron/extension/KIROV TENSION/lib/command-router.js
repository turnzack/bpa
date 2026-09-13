/* Command Router — multi-provider LLM API + auto-detect models */

class CommandRouter {
  static async getProviderId() {
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.PROVIDER], (r) => {
        resolve(r[STORAGE_KEYS.PROVIDER] || DEFAULT_PROVIDER);
      });
    });
  }

  static async setProviderId(providerId) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [STORAGE_KEYS.PROVIDER]: providerId }, () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  static async getProvider() {
    const id = await this.getProviderId();
    return PROVIDERS[id] || PROVIDERS[DEFAULT_PROVIDER];
  }

  static async getApiKey(providerId) {
    const active = providerId || (await this.getProviderId());
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.API_KEYS, STORAGE_KEYS.API_KEY], (r) => {
        const keys = r[STORAGE_KEYS.API_KEYS] || {};
        resolve(keys[active] || r[STORAGE_KEYS.API_KEY] || null);
      });
    });
  }

  static async setApiKey(key, providerId) {
    const active = providerId || (await this.getProviderId());
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([STORAGE_KEYS.API_KEYS], (r) => {
        const keys = r[STORAGE_KEYS.API_KEYS] || {};
        keys[active] = key;
        chrome.storage.local.set(
          { [STORAGE_KEYS.API_KEYS]: keys, [STORAGE_KEYS.API_KEY]: key },
          () => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve();
          }
        );
      });
    });
  }

  static async getModel(providerId) {
    const active = providerId || (await this.getProviderId());
    return new Promise((resolve) => {
      chrome.storage.local.get([STORAGE_KEYS.MODELS, STORAGE_KEYS.MODEL], (r) => {
        const models = r[STORAGE_KEYS.MODELS] || {};
        if (models[active]) {
          resolve({ providerId: active, model: models[active] });
        } else if (r[STORAGE_KEYS.MODEL] && r[STORAGE_KEYS.MODEL].providerId === active) {
          resolve(r[STORAGE_KEYS.MODEL]);
        } else {
          resolve({ providerId: active, model: PROVIDERS[active]?.model || "deepseek-chat" });
        }
      });
    });
  }

  static async setModel(model, providerId) {
    const modelStr = typeof model === "object" ? model.model : model;
    const active =
      (typeof model === "object" ? model.providerId : null) ||
      providerId ||
      (await this.getProviderId());
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([STORAGE_KEYS.MODELS], (r) => {
        const models = r[STORAGE_KEYS.MODELS] || {};
        models[active] = modelStr;
        chrome.storage.local.set(
          {
            [STORAGE_KEYS.MODELS]: models,
            [STORAGE_KEYS.MODEL]: { providerId: active, model: modelStr },
          },
          () => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve();
          }
        );
      });
    });
  }

  static async getEffectiveModel(provider) {
    const stored = await this.getModel(provider.id);
    if (stored && stored.providerId === provider.id) return stored.model;
    return provider.model;
  }

  /* ── Model auto-detection ── */

  static async listModels(providerId, apiKey) {
    const provider = PROVIDERS[providerId];
    if (!provider) return { success: false, message: `Provider inconnu: ${providerId}` };
    if (provider.needsKey && !apiKey) {
      return { success: false, message: `Clé API requise pour ${provider.label}` };
    }
    try {
      if (provider.id === "gemma") return await this.listOllamaModels(provider);
      if (provider.format === "openai") return await this.listOpenAIModels(provider, apiKey);
      if (provider.format === "anthropic") return await this.listAnthropicModels(provider, apiKey);
      if (provider.format === "gemini") return await this.listGeminiModels(provider, apiKey);
      return { success: false, message: `Format non supporté: ${provider.format}` };
    } catch (err) {
      return { success: false, message: `Erreur détection: ${err.message}` };
    }
  }

  static async listOpenAIModels(provider, apiKey) {
    const url = provider.modelsUrl || provider.apiUrl.replace("/chat/completions", "/models");
    const headers = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const resp = await fetch(url, { headers });
    if (!resp.ok) {
      const txt = await resp.text();
      return { success: false, message: `${provider.label} models error (${resp.status}): ${txt.slice(0, 300)}` };
    }
    const data = await resp.json();
    const models = (data.data || data.models || [])
      .map((m) => ({ id: m.id || m.name || "", label: m.id || m.name || "" }))
      .filter((m) => m.id)
      .sort((a, b) => a.label.localeCompare(b.label));
    return { success: true, models };
  }

  static async listOllamaModels(provider) {
    try {
      const resp = await fetch(provider.modelsUrl || "http://localhost:11434/api/tags");
      if (!resp.ok) {
        return {
          success: true,
          models: [{ id: "gemma2", label: "gemma2" }, { id: "gemma2:9b", label: "gemma2:9b" }],
          warning: "Ollama non joignable — modèles par défaut",
        };
      }
      const data = await resp.json();
      const models = (data.models || [])
        .map((m) => ({ id: m.name || m.model || "", label: m.name || m.model || "" }))
        .filter((m) => m.id);
      return { success: true, models: models.length ? models : [{ id: "gemma2", label: "gemma2" }] };
    } catch (err) {
      return {
        success: true,
        models: [{ id: "gemma2", label: "gemma2" }],
        warning: `Ollama offline: ${err.message}`,
      };
    }
  }

  static async listAnthropicModels(provider, apiKey) {
    const url = provider.modelsUrl || provider.apiUrl.replace("/messages", "/models");
    const resp = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
    });
    if (!resp.ok) {
      // Fallback known models
      return {
        success: true,
        models: [
          { id: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
          { id: "claude-opus-4-20250514", label: "Claude Opus 4" },
          { id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet" },
          { id: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
        ],
        warning: `API models (${resp.status}) — fallback liste connue`,
      };
    }
    const data = await resp.json();
    const models = (data.data || [])
      .map((m) => ({ id: m.id || "", label: m.display_name || m.id || "" }))
      .filter((m) => m.id);
    return { success: true, models };
  }

  static async listGeminiModels(provider, apiKey) {
    const fallback = [
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
      { id: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
      { id: "gemini-flash-latest", label: "Gemini Flash Latest" },
      { id: "gemini-pro-latest", label: "Gemini Pro Latest" },
    ];
    try {
      const url = `${provider.modelsUrl || provider.apiUrl}?key=${encodeURIComponent(apiKey)}&pageSize=100`;
      const resp = await fetch(url, { headers: { "x-goog-api-key": apiKey } });
      if (!resp.ok) {
        const txt = await resp.text();
        return { success: true, models: fallback, warning: `Gemini API (${resp.status}): ${txt.slice(0, 200)}` };
      }
      const data = await resp.json();
      let models = (data.models || [])
        .filter((m) => {
          const methods = m.supportedGenerationMethods || [];
          return !methods.length || methods.includes("generateContent");
        })
        .map((m) => {
          const id = (m.name || "").replace(/^models\//, "");
          return { id, label: m.displayName || id };
        })
        .filter((m) => m.id && !/embedding|aqa|imagen|veo|tts/i.test(m.id));

      if (!models.length) models = fallback;
      else models.sort((a, b) => a.label.localeCompare(b.label));
      return { success: true, models };
    } catch (err) {
      return { success: true, models: fallback, warning: err.message };
    }
  }

  /* ── Command building ── */

  static buildCommandMessage(action, document, documentContent) {
    if (action === "read") {
      return {
        role: "user",
        content: JSON.stringify({
          action: "read",
          document,
          content: documentContent || "",
          instruction: `Acknowledge you have read ${document}. Summarize key points in the content field. Respond with JSON only.`,
        }),
      };
    }
    if (action === "create") {
      return {
        role: "user",
        content: JSON.stringify({
          action: "create",
          document,
          context: documentContent || "",
          instruction: `Generate COMPLETE production-quality content for ${document}. Follow the structure and purpose in the context. Return JSON: {"status":"ok","document":"${document}","content":"<full markdown or yaml>","ready":true}`,
        }),
      };
    }
    if (action === "codegen") {
      return {
        role: "user",
        content: JSON.stringify({
          action: "codegen",
          instruction:
            "Generate the FULL application source code based on all previous specification documents. " +
            SILENCE_ABSOLU +
            ' Respond ONLY with: {"status":"ok","document":"CODE","content":"{\\"files\\":[...]}","ready":true}',
        }),
      };
    }
    if (action === "validate") {
      return { role: "user", content: JSON.stringify({ action: "validate", document }) };
    }
    if (action === "advance") {
      return { role: "user", content: JSON.stringify({ action: "advance" }) };
    }
    return null;
  }

  /* ── Send command ── */

  static async sendCommand(action, document, documentContent, conversationHistory) {
    const provider = await this.getProvider();
    const apiKey = await this.getApiKey();
    const model = await this.getEffectiveModel(provider);

    if (provider.needsKey && !apiKey) {
      return {
        status: "error",
        errorType: ERROR_TYPES.API_ERROR,
        message: `Aucune clé API pour ${provider.label}. Configurez-la dans les paramètres.`,
        ready: false,
      };
    }

    const userMessage = this.buildCommandMessage(action, document, documentContent);
    if (!userMessage) {
      return {
        status: "error",
        errorType: ERROR_TYPES.UNAUTHORIZED_ACTION,
        message: `Impossible de construire la commande pour "${action}".`,
        ready: false,
      };
    }

    // Build context from previous artifacts for create/codegen
    const messages = [];
    if (conversationHistory && conversationHistory.length) {
      // Limit history size to avoid token overflow
      const recent = conversationHistory.slice(-12);
      messages.push(...recent);
    }
    messages.push(userMessage);

    try {
      let response;
      if (provider.format === "openai") {
        response = await this.callOpenAICompatible(provider, apiKey, messages, model);
      } else if (provider.format === "anthropic") {
        response = await this.callAnthropic(provider, apiKey, messages, model);
      } else if (provider.format === "gemini") {
        response = await this.callGemini(provider, apiKey, messages, model);
      } else {
        return {
          status: "error",
          errorType: ERROR_TYPES.API_ERROR,
          message: `Format inconnu: ${provider.format}`,
          ready: false,
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        return {
          status: "error",
          errorType: ERROR_TYPES.API_ERROR,
          message: `${provider.label} API error (${response.status}): ${errorText.slice(0, 500)}`,
          ready: false,
        };
      }

      const data = await response.json();
      const assistantContent = this.extractContent(provider.format, data);
      return this.parseAssistantResponse(assistantContent, document);
    } catch (err) {
      return {
        status: "error",
        errorType: ERROR_TYPES.API_ERROR,
        message: `Erreur réseau: ${err.message}`,
        ready: false,
      };
    }
  }

  static parseAssistantResponse(assistantContent, document) {
    if (!assistantContent || !assistantContent.trim()) {
      return {
        status: "error",
        errorType: ERROR_TYPES.INVALID_RESPONSE,
        message: "Réponse LLM vide.",
        ready: false,
      };
    }

    // Try direct JSON parse
    let cleaned = assistantContent.trim();
    const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) cleaned = fence[1].trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed.status || parsed.content || parsed.files) {
        // Normalize files-array responses into content
        if (parsed.files && !parsed.content) {
          return {
            status: "ok",
            document: document || "CODE",
            content: JSON.stringify({ files: parsed.files }),
            ready: true,
          };
        }
        if (!parsed.status) parsed.status = "ok";
        if (!parsed.document) parsed.document = document;
        if (parsed.ready === undefined) parsed.ready = true;
        return parsed;
      }
    } catch (_) {
      /* fall through */
    }

    // Try extract JSON object
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        const parsed = JSON.parse(cleaned.slice(first, last + 1));
        if (parsed.status || parsed.content || parsed.files) {
          if (parsed.files && !parsed.content) {
            return {
              status: "ok",
              document: document || "CODE",
              content: JSON.stringify({ files: parsed.files }),
              ready: true,
            };
          }
          if (!parsed.status) parsed.status = "ok";
          return parsed;
        }
      } catch (_) {
        /* fall through */
      }
    }

    // Treat raw markdown/text as successful content
    if (cleaned.length >= 50) {
      return {
        status: "ok",
        document: document || "unknown",
        content: cleaned,
        ready: true,
      };
    }

    return {
      status: "error",
      errorType: ERROR_TYPES.INVALID_RESPONSE,
      message: "Réponse LLM non parsable.",
      raw: assistantContent.slice(0, 500),
      ready: false,
    };
  }

  static extractContent(format, data) {
    if (format === "openai") return data.choices?.[0]?.message?.content || "";
    if (format === "anthropic") return data.content?.[0]?.text || "";
    if (format === "gemini") return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return "";
  }

  static async callOpenAICompatible(provider, apiKey, messages, model) {
    const body = {
      model: model || provider.model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 8192,
    };
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    return fetch(provider.apiUrl, { method: "POST", headers, body: JSON.stringify(body) });
  }

  static async callAnthropic(provider, apiKey, messages, model) {
    const body = {
      model: model || provider.model,
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    };
    return fetch(provider.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });
  }

  static async callGemini(provider, apiKey, messages, model) {
    const cleanModel = (model || provider.model).replace(/^models\//, "");
    const url = `${provider.apiUrl}/${cleanModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const body = {
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    };
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });
  }

  /* Build a natural-language prompt for WEB injection mode */
  static buildWebPrompt(action, document, documentContent, pack) {
    const name = pack?.projectName || "Project";
    const desc = pack?.projectDescription || "";
    if (action === "read") {
      return `[PROJET : ${name.toUpperCase()}]\n\nLis et accuse réception de ce document:\n\n---\n${documentContent}\n---\n\nRéponds UNIQUEMENT en JSON:\n{"status":"ok","document":"${document}","content":"<résumé des points clés>","ready":true}`;
    }
    if (action === "create") {
      return `[PROJET : ${name.toUpperCase()}]\nDescription: ${desc}\n\nGénère le contenu COMPLET et professionnel pour le document: ${document}\n\nContexte / instructions:\n${documentContent}\n\nRéponds UNIQUEMENT en JSON (pas de texte autour):\n{"status":"ok","document":"${document}","content":"<contenu markdown/yaml complet>","ready":true}`;
    }
    if (action === "codegen") {
      const arts = pack?.state?.artifacts || {};
      const specs = Object.entries(arts)
        .map(([k, v]) => `### ${k}\n${(v || "").slice(0, 3000)}`)
        .join("\n\n");
      return `[PROJET : ${name.toUpperCase()}]\nDescription: ${desc}\n\n${SILENCE_ABSOLU}\n\nSpécifications du projet:\n${specs}\n\nGénère le code source COMPLET de l'application.\nFormat STRICT:\n{"files":[{"path":"index.html","content":"...","language":"html"},{"path":"package.json","content":"...","language":"json"},...]}`;
    }
    return `[PROJET : ${name}]\n${documentContent || ""}`;
  }
}
