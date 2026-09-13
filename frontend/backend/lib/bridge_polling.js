/* Bridge Polling -- KIROV5
   Polling Vercel + local :5006, anti race-condition, auto-pilot advance
   Porte depuis KIROV4_ORCHESTRATOR
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

  /** Test connectivity to bridge server (local + optional Vercel) */
  static async test(url) {
    const cfg = await this.getConfig();
    const target = (url || cfg.serverUrl || "").replace(/\/$/, "");
    const vercel = (cfg.vercelUrl || "").replace(/\/$/, "");
    if (!target && !vercel) return { connected: false, success: false, message: "URL bridge vide" };

    const endpoints = ["/health", "/bridge/health", "/bridge/poll", "/v1/bridge/poll", "/api/bridge/health", "/"];
    const vercelEndpoints = ["/api/bridge/prompt", "/api/bridge/health"];
    let lastError = null;

    /* Try both 127.0.0.1 and localhost, port 5006 and 3000 */
    const targets = [target];
    if (target.includes("5006")) {
      targets.push(target.replace("5006", "3000"));
    }
    if (target.includes("127.0.0.1")) {
      targets.push(target.replace("127.0.0.1", "localhost"));
      if (target.includes("5006")) targets.push("http://localhost:3000");
    } else if (target.includes("localhost")) {
      targets.push(target.replace("localhost", "127.0.0.1"));
      if (target.includes("5006")) targets.push("http://127.0.0.1:3000");
    }

    for (const base of targets) {
      for (const ep of endpoints) {
        try {
          const t0 = Date.now();
          const res = await fetch(base + ep, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          const latency = Date.now() - t0;

          /* Case 1: normal response (res.ok === true, type: "basic") */
          if (res.ok && res.type !== 'opaque') {
            let data = null;
            try { data = await res.json(); } catch (_) { try { await res.text(); } catch(_) {} }
            return {
              connected: true,
              success: true, status: res.status, data, endpoint: ep,
              latency, message: "Bridge connecté",
              missions: (data && data.mission) ? 1 : 0,
              projects: (data && data.projects) ? data.projects.length : 0,
            };
          }

          /* Case 2: opaque response (server reachable but body unreadable) */
          if (res.type === 'opaque') {
            return {
              connected: true,
              success: true, status: 0, data: null, endpoint: ep,
              latency, message: "Bridge connecté (opaque)",
              missions: 0, projects: 0,
            };
          }

          /* Case 3: HTTP error (404, 500, etc.) */
          lastError = "HTTP " + res.status;
        } catch (err) {
          lastError = err.message;
        }
      }
    }

    /* Try Vercel as fallback */
    if (vercel && vercel !== target) {
      for (const ep of vercelEndpoints) {
        try {
          const t0 = Date.now();
          const res = await fetch(vercel + ep, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          if (res.ok || res.type === 'opaque') {
            return {
              connected: true,
              success: true, status: res.status, data: null, endpoint: ep,
              latency: Date.now() - t0, message: "Bridge Vercel connecté",
              source: "vercel", missions: 0, projects: 0,
            };
          }
        } catch (_) {}
      }
    }

    return { connected: false, success: false, message: "Bridge injoignable - " + (lastError || "serveur non trouvé") };
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
    if (h.includes("stitch.withgoogle.com") || h.includes("stitch")) return "stitch";
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
