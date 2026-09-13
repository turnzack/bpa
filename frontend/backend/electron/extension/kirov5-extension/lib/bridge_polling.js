/* Bridge Polling — KIROV5
   Polling Vercel + local :5006, anti race-condition, auto-pilot advance
   Porté depuis KIROV4_ORCHESTRATOR
*/

class BridgePolling {
  static DEFAULTS = {
    SERVER_URL: "http://127.0.0.1:5006",
    VERCEL_URL: "https://forge-kohl-kappa.vercel.app",
    POLLING_INTERVAL: 2500,
  };

  static async getConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        [
          STORAGE_KEYS.BRIDGE_URL,
          STORAGE_KEYS.BRIDGE_VERCEL,
          STORAGE_KEYS.BRIDGE_ENABLED,
          STORAGE_KEYS.BRIDGE_INTERVAL,
          STORAGE_KEYS.WEB_AI,
        ],
        (r) => {
          resolve({
            serverUrl: r[STORAGE_KEYS.BRIDGE_URL] || BridgePolling.DEFAULTS.SERVER_URL,
            vercelUrl: r[STORAGE_KEYS.BRIDGE_VERCEL] || BridgePolling.DEFAULTS.VERCEL_URL,
            enabled: r[STORAGE_KEYS.BRIDGE_ENABLED] !== false,
            interval:
              r[STORAGE_KEYS.BRIDGE_INTERVAL] || BridgePolling.DEFAULTS.POLLING_INTERVAL,
            webAi: r[STORAGE_KEYS.WEB_AI] || "deepseek",
          });
        }
      );
    });
  }

  static async setConfig(partial) {
    const map = {};
    if (partial.serverUrl != null) map[STORAGE_KEYS.BRIDGE_URL] = partial.serverUrl;
    if (partial.vercelUrl != null) map[STORAGE_KEYS.BRIDGE_VERCEL] = partial.vercelUrl;
    if (partial.enabled != null) map[STORAGE_KEYS.BRIDGE_ENABLED] = !!partial.enabled;
    if (partial.interval != null) map[STORAGE_KEYS.BRIDGE_INTERVAL] = partial.interval;
    return new Promise((resolve) => chrome.storage.local.set(map, resolve));
  }

  /** Test connectivity to local bridge and/or Vercel */
  static async test(url) {
    const cfg = await this.getConfig();
    const target = (url || cfg.serverUrl || "").replace(/\/$/, "");
    if (!target) return { success: false, message: "URL bridge vide" };

    let lastError = null;
    const endpoints = ["/health", "/bridge/health", "/v1/bridge/poll", "/api/bridge/health"];
    
    // Try both the provided target and a localhost fallback if applicable
    const targetsToTry = [target];
    if (target.includes("127.0.0.1")) targetsToTry.push(target.replace("127.0.0.1", "localhost"));
    else if (target.includes("localhost")) targetsToTry.push(target.replace("localhost", "127.0.0.1"));

    for (const currentTarget of targetsToTry) {
      for (const ep of endpoints) {
        try {
          const res = await fetch(`${currentTarget}${ep}`, {
            method: "GET",
            mode: "no-cors",
            headers: { Accept: "application/json" },
          });
          if (res.ok || res.type === 'opaque') {
          const text = await res.text();
          let data = null;
          try { data = JSON.parse(text); } catch (_) {}
          return {
            success: true,
            status: res.status,
            data,
            endpoint: ep,
            message: "Bridge connecté",
          };
        } else {
          lastError = `HTTP ${res.status}`;
        }
      } catch (err) {
        lastError = err.message;
        console.error(`Fetch ${ep} failed:`, err);
      }
      }
    }
    return { success: false, message: `Failed to fetch (Bridge hors ligne) - ${lastError}` };
  }

  /** Poll both Vercel then local bridge for a pending prompt */
  static async pollForPrompt() {
    const cfg = await this.getConfig();
    if (!cfg.enabled) return null;

    // 1) Vercel first
    try {
      const r = await fetch(`${cfg.vercelUrl.replace(/\/$/, "")}/api/bridge/prompt`);
      if (r.ok) {
        const d = await r.json();
        if (d && d.status !== "idle" && d.prompt) return { ...d, source: "vercel" };
      }
    } catch (_) {}

    // 2) Local :5006
    try {
      const r = await fetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/bridge/poll`);
      if (r.ok) {
        const d = await r.json();
        if (d && d.status !== "idle" && d.prompt) return { ...d, source: "local" };
      }
    } catch (_) {}

    return null;
  }

  /** Mark prompt as consumed on local bridge */
  static async consume() {
    const cfg = await this.getConfig();
    try {
      await fetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/bridge/consume`, {
        method: "POST",
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  /** Send captured content back to bridge callback */
  static async sendCallback(content) {
    const cfg = await this.getConfig();
    try {
      const res = await fetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/bridge/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, response: content, is_final: true }),
      });
      const data = await res.json().catch(() => null);
      return data;
    } catch (e) {
      console.error("[BridgePolling] callback failed:", e.message);
      return null;
    }
  }

  /** Advance G5 auto-pilot after successful capture */
  static async advanceAutopilot() {
    const cfg = await this.getConfig();
    try {
      const r = await fetch(`${cfg.serverUrl.replace(/\/$/, "")}/v1/g5/autopilot/advance`, {
        method: "POST",
      });
      return await r.json();
    } catch (_) {
      return null;
    }
  }

  /**
   * Detect platform AI name from hostname.
   * Used with target_ai filter to avoid injecting on wrong tab.
   */
  static detectAiFromHost(hostname) {
    const h = String(hostname || "").toLowerCase();
    if (h.includes("deepseek")) return "deepseek";
    if (h.includes("kimi") || h.includes("moonshot")) return "kimi";
    if (h.includes("gemini")) return "gemini";
    if (h.includes("claude")) return "claude";
    if (h.includes("chatgpt") || h.includes("openai.com")) return "chatgpt";
    if (h.includes("perplexity")) return "perplexity";
    if (h.includes("mistral")) return "mistral";
    return "unknown";
  }

  /**
   * Returns true if this page is allowed to process the bridge prompt.
   * If data.target_ai is set and current AI is known, they must match.
   */
  static matchesTargetAi(data, hostname) {
    if (!data || !data.target_ai) return true;
    const ai = this.detectAiFromHost(hostname);
    if (ai === "unknown") return true; // let unknown hosts try
    return data.target_ai === ai;
  }

  /** Build full prompt with optional Silence Absolu for phase >= 2 */
  static buildBridgePrompt(data) {
    const missionId = data.project_id || `mission_${Date.now()}`;
    let full = `[PROJET : ${String(missionId).toUpperCase()}]`;
    if (data.phase_name) full += ` - [${data.phase_name}]`;
    full += "\n";
    const phaseNum = parseInt(data.phase_num, 10);
    if (!Number.isNaN(phaseNum) && phaseNum >= 2) {
      full += (typeof SILENCE_ABSOLU !== "undefined" ? SILENCE_ABSOLU : "") + "\n\n---\n\n";
    }
    full += data.prompt || "";
    return full;
  }
}
