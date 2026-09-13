/**
 * KIROV3 Orchestrator — Content Script
 * Injection de prompts + Smart Capture v2 dans DeepSeek / Gemini / ChatGPT / Kimi / Perplexity
 * L'extension est l'orchestrateur ; le chat LLM est l'exécuteur contrôlé.
 */

(() => {
  if (window.__KIROV3_CS__) return;
  window.__KIROV3_CS__ = true;

  const CONFIG = {
    CAPTURE_CHECK_INTERVAL: 2500,
    CAPTURE_TIMEOUT: 300000,
    MIN_RESPONSE_LENGTH: 200,
    STABLE_CHECKS_REQUIRED: 3,
    POST_GENERATION_COOLDOWN: 8000,
    MIN_FILES_REQUIRED: 1,
    CONTENT_DROP_THRESHOLD: 0.5,
    VERSION: "16.0.0",
  };

  let isBusy = false;

  function safeInterval(fn, delay) {
    const id = setInterval(async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.runtime?.id) {
          await fn();
        } else {
          clearInterval(id);
        }
      } catch (e) {
        if (e.message?.includes("Extension context invalidated")) {
          clearInterval(id);
        }
      }
    }, delay);
    return id;
  }

  /* ── Logger ── */
  const Log = {
    info: (...a) => console.log("%c[KIROV3]", "color:#06b6d4;font-weight:bold", ...a),
    warn: (...a) => console.warn("[KIROV3]", ...a),
    error: (...a) => console.error("[KIROV3]", ...a),
    success: (...a) => console.log("%c[KIROV3] ✅", "color:#10b981;font-weight:bold", ...a),
  };

  /* ── Platform detection ── */
  const PlatformDetector = {
    detect() {
      const host = location.hostname;
      if (host.includes("deepseek")) {
        return {
          name: "deepseek",
          textareaSelector:
            'textarea#chat-input, textarea[placeholder*="Message"], textarea[placeholder*="message"], div[contenteditable="true"]',
          sendButtonSelector:
            'div[role="button"][aria-disabled="false"], button[type="submit"], .ds-icon-button, button.send-button',
        };
      }
      if (host.includes("chatgpt") || host.includes("openai.com")) {
        return {
          name: "chatgpt",
          textareaSelector: '#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"], div[contenteditable="true"]',
          sendButtonSelector: 'button[data-testid="send-button"], button[aria-label*="Send"], button[aria-label*="Envoyer"]',
        };
      }
      if (host.includes("gemini")) {
        return {
          name: "gemini",
          textareaSelector:
            'rich-textarea div[contenteditable="true"], rich-textarea, div[contenteditable="true"], textarea',
          sendButtonSelector:
            'button[aria-label*="Send"], button[aria-label*="Envoyer"], button[mattooltip*="Send"], button.send-button',
        };
      }
      if (host.includes("kimi") || host.includes("moonshot")) {
        return {
          name: "kimi",
          textareaSelector: 'div[contenteditable="true"], textarea',
          sendButtonSelector:
            'button[aria-label*="send" i], button[aria-label*="envoyer" i], .send-button, div[role="button"]:has(svg)',
        };
      }
      if (host.includes("perplexity")) {
        return {
          name: "perplexity",
          textareaSelector: 'textarea, div[contenteditable="true"]',
          sendButtonSelector: 'button[aria-label*="Submit" i], button[aria-label*="Send" i], button:has(svg)',
        };
      }
      return {
        name: "unknown",
        textareaSelector: 'textarea, div[contenteditable="true"]',
        sendButtonSelector: 'button[type="submit"], button',
      };
    },
  };

  /* ── DOM helpers ── */
  function findTextarea() {
    const platform = PlatformDetector.detect();
    const els = document.querySelectorAll(platform.textareaSelector);
    for (const el of els) {
      if (
        el.offsetParent !== null ||
        el.getClientRects().length > 0 ||
        el.isContentEditable ||
        el.tagName === "TEXTAREA"
      ) {
        if (el.tagName === "TEXTAREA" || el.isContentEditable || el.tagName === "RICH-TEXTAREA") {
          return el;
        }
        // rich-textarea wrapper → find inner contenteditable
        const inner = el.querySelector('[contenteditable="true"], textarea');
        if (inner) return inner;
        return el;
      }
    }
    return (
      document.querySelector("textarea") ||
      document.querySelector('div[contenteditable="true"]')
    );
  }

  function findSendButton() {
    const platform = PlatformDetector.detect();
    const candidates = document.querySelectorAll(platform.sendButtonSelector);
    for (const el of candidates) {
      if (el.getAttribute("aria-disabled") === "true") continue;
      if (el.disabled) continue;
      if (el.offsetParent === null && el.getClientRects().length === 0) continue;
      return el;
    }
    // Fallback: look for buttons near the textarea
    const area = findTextarea();
    if (area) {
      const parent = area.closest("form, div, section") || document.body;
      const btns = parent.querySelectorAll('button, div[role="button"]');
      for (const b of btns) {
        const label = (b.getAttribute("aria-label") || b.title || b.textContent || "").toLowerCase();
        if (/send|envoyer|submit|arrow/i.test(label) && !b.disabled) return b;
      }
    }
    return document.querySelector('div[role="button"]:not([aria-disabled="true"])');
  }

  function isGenerating() {
    const stopBtn = document.querySelector(
      'button[aria-label*="Stop" i], button[aria-label*="Arrêter" i], button[aria-label*="Stop generating" i], div[role="button"][aria-label*="Stop" i], .ds-stop-button, [class*="stop-generating"], button[class*="stopButton"], [class*="stop-btn"]'
    );
    if (stopBtn && (stopBtn.offsetParent !== null || stopBtn.getClientRects().length)) return true;
    const spinner = document.querySelector(
      '.ds-spinner, .generating, [class*="loading-dots"], message-processing, [class*="Spinner"], [aria-busy="true"]'
    );
    if (spinner) return true;
    return false;
  }

  function getLastAssistantElement() {
    const selectors = [
      ".markdown-body",
      "div.ds-markdown",
      "message-content",
      "model-response",
      "response-message",
      '[data-message-author-role="assistant"]',
      '[data-role="assistant"]',
      ".prose",
      ".msh-markdown",
      '[class*="markdown"]',
      '[class*="MessageContent"]',
      '[class*="assistant"]',
      "div[dir='auto']",
    ];
    let els = [];
    for (const sel of selectors) {
      try {
        const found = document.querySelectorAll(sel);
        if (found.length) els = Array.from(found);
      } catch (_) {}
    }
    if (!els.length) {
      els = Array.from(
        document.querySelectorAll('[class*="message"], [class*="bubble"], [class*="response"]')
      );
    }
    // Prefer elements containing file markers or JSON
    const withFiles = els.filter(
      (e) =>
        e.textContent &&
        (e.textContent.includes('"path"') ||
          e.textContent.includes("Fichier:") ||
          e.textContent.includes('"status"') ||
          e.textContent.length > 200)
    );
    if (withFiles.length) return withFiles[withFiles.length - 1];
    if (els.length) return els[els.length - 1];
    return null;
  }

  function extractContent(el) {
    if (!el) return "";
    try {
      return (el.innerText || el.textContent || "").trim();
    } catch {
      return (el.textContent || "").trim();
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  /* ── Inject prompt ── */
  async function injectPrompt(prompt) {
    const textarea = findTextarea();
    if (!textarea) {
      Log.error("Textarea introuvable sur", location.hostname);
      return false;
    }
    textarea.focus();
    await sleep(150);

    if (textarea.tagName === "TEXTAREA") {
      const proto = window.HTMLTextAreaElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, "value");
      if (desc && desc.set) desc.set.call(textarea, prompt);
      else textarea.value = prompt;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      // contenteditable — simulate real paste
      try {
        document.execCommand("selectAll", false, null);
        const dt = new DataTransfer();
        dt.setData("text/plain", prompt);
        const pe = new ClipboardEvent("paste", {
          clipboardData: dt,
          bubbles: true,
          cancelable: true,
        });
        textarea.dispatchEvent(pe);
        if (!pe.defaultPrevented) {
          document.execCommand("insertText", false, prompt);
        }
      } catch (e) {
        Log.warn("paste fallback", e);
        textarea.textContent = prompt;
        textarea.innerText = prompt;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
      // Verify
      const current = (textarea.innerText || textarea.textContent || "").trim();
      if (current.length < Math.min(50, prompt.length / 2)) {
        textarea.focus();
        document.execCommand("selectAll", false, null);
        document.execCommand("insertText", false, prompt);
      }
    }

    // Wait for send button
    let sendBtn = null;
    for (let i = 0; i < 8; i++) {
      await sleep(400);
      sendBtn = findSendButton();
      if (sendBtn && !sendBtn.disabled && sendBtn.getAttribute("aria-disabled") !== "true") break;
      sendBtn = null;
    }

    if (sendBtn) {
      sendBtn.removeAttribute("disabled");
      sendBtn.removeAttribute("aria-disabled");
      sendBtn.click();
      Log.info("Bouton Send cliqué");
      return true;
    }

    // Fallback Enter key
    Log.warn("Send introuvable — fallback Enter");
    const target = findTextarea() || textarea;
    target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      })
    );
    return true;
  }

  /* ── Smart Capture v2 ── */
  function isJsonBalanced(content) {
    if (!content) return false;
    let json = content.trim();
    const fence = json.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) json = fence[1].trim();
    let braces = 0,
      brackets = 0,
      inString = false,
      escape = false;
    for (let i = 0; i < json.length; i++) {
      const c = json[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (c === "{") braces++;
      else if (c === "}") braces--;
      else if (c === "[") brackets++;
      else if (c === "]") brackets--;
    }
    return braces === 0 && brackets === 0;
  }

  function countFilesInJson(content) {
    if (!content) return 0;
    const m = content.match(/"path"\s*:/g);
    return m ? m.length : 0;
  }

  async function waitForFullResponse(opts = {}) {
    const minLength = opts.minLength || CONFIG.MIN_RESPONSE_LENGTH;
    const minFiles = opts.minFiles || 0;
    const timeout = opts.timeout || CONFIG.CAPTURE_TIMEOUT;
    const lastKnownText = opts.lastKnownText || "";

    Log.info("Attente démarrage génération...");
    let started = false;
    for (let i = 0; i < 40; i++) {
      await sleep(400);
      if (isGenerating()) {
        started = true;
        break;
      }
      // Also check if new content already appeared
      const el = getLastAssistantElement();
      const t = el ? extractContent(el) : "";
      if (t && t.length > lastKnownText.length + 50) {
        started = true;
        break;
      }
    }
    if (started) Log.info("Génération démarrée");
    else Log.warn("Génération non détectée — capture quand même");

    const startTime = Date.now();
    let previousContent = "";
    let previousLen = 0;
    let maxLenSeen = 0;
    let stableCount = 0;
    let checkNum = 0;
    let generationEndedAt = null;

    while (Date.now() - startTime < timeout) {
      await sleep(CONFIG.CAPTURE_CHECK_INTERVAL);
      checkNum++;
      let generating = isGenerating();
      const lastEl = getLastAssistantElement();
      const currentContent = lastEl ? extractContent(lastEl) : "";
      const currentLen = currentContent.length;

      if (currentLen > maxLenSeen) maxLenSeen = currentLen;

      // Content drop detection
      if (maxLenSeen > 1000 && currentLen < maxLenSeen * CONFIG.CONTENT_DROP_THRESHOLD) {
        Log.warn(`Chute contenu: ${currentLen} < ${maxLenSeen}`);
        stableCount = 0;
        generationEndedAt = null;
        maxLenSeen = currentLen;
      }

      // Same as last known = still thinking
      if (lastKnownText.length > 0 && Math.abs(currentLen - lastKnownText.length) <= 5) {
        stableCount = 0;
      } else if (!generating && currentContent === previousContent && currentLen > 0) {
        stableCount++;
      } else if (currentContent !== previousContent) {
        stableCount = 0;
      }

      // Force stop if stuck generating but text stable
      if (stableCount > 12 && generating && currentLen > minLength) {
        Log.warn("Texte stable mais generating=true — forçage arrêt");
        generating = false;
      }

      if (generating) generationEndedAt = null;
      else if (generationEndedAt === null && currentLen > 0) generationEndedAt = Date.now();

      previousContent = currentContent;
      previousLen = currentLen;

      const fileCount = countFilesInJson(currentContent);
      const jsonOk = isJsonBalanced(currentContent);

      if (checkNum % 2 === 0) {
        Log.info(
          `Check #${checkNum}: gen=${generating} len=${currentLen} stable=${stableCount}/${CONFIG.STABLE_CHECKS_REQUIRED} files=${fileCount} json=${jsonOk}`
        );
      }

      if (generating) continue;
      if (
        generationEndedAt &&
        Date.now() - generationEndedAt < CONFIG.POST_GENERATION_COOLDOWN
      ) {
        continue;
      }
      if (currentLen < minLength) continue;
      if (minFiles > 0 && fileCount < minFiles && currentLen < minLength * 3) continue;
      if (stableCount < CONFIG.STABLE_CHECKS_REQUIRED) continue;
      if (currentContent.includes("{") && !jsonOk && stableCount < 10) continue;

      Log.success(`Capture OK — ${currentLen} chars, ${fileCount} files`);
      return currentContent;
    }

    if (previousLen >= minLength) {
      Log.warn(`Timeout — capture partielle (${previousLen} chars)`);
      return previousContent;
    }
    Log.error("Timeout — aucune réponse");
    return null;
  }

  /* ── HUD overlay ── */
  function showHud(message, type = "info") {
    let hud = document.getElementById("kirov3-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "kirov3-hud";
      hud.style.cssText = `
        position:fixed; bottom:20px; right:20px; z-index:2147483647;
        background:rgba(15,23,42,0.95); color:#e2e8f0; padding:12px 16px;
        border-radius:12px; font:12px/1.4 system-ui,sans-serif;
        border:1px solid #06b6d4; box-shadow:0 8px 32px rgba(0,0,0,0.4);
        max-width:320px; backdrop-filter:blur(8px);
        transition:opacity .3s;
      `;
      document.documentElement.appendChild(hud);
    }
    const colors = { info: "#06b6d4", success: "#10b981", error: "#ef4444", warn: "#f59e0b" };
    hud.style.borderColor = colors[type] || colors.info;
    hud.innerHTML = `<div style="font-weight:700;color:${colors[type] || colors.info};margin-bottom:4px">⚡ KIROV3 v${CONFIG.VERSION}</div><div>${message}</div>`;
    hud.style.opacity = "1";
  }

  function hideHud(delay = 3000) {
    setTimeout(() => {
      const hud = document.getElementById("kirov3-hud");
      if (hud) hud.style.opacity = "0";
    }, delay);
  }

  /* ── Message handler ── */
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "KIROV_PING") {
      sendResponse({
        success: true,
        platform: PlatformDetector.detect().name,
        version: CONFIG.VERSION,
        busy: isBusy,
      });
      return false;
    }

    if (msg.type === "KIROV_INJECT_ONLY") {
      (async () => {
        try {
          showHud("Injection du prompt...", "info");
          const ok = await injectPrompt(msg.prompt || "");
          showHud(ok ? "Prompt injecté ✅" : "Échec injection", ok ? "success" : "error");
          hideHud();
          sendResponse({ success: ok });
        } catch (e) {
          sendResponse({ success: false, message: e.message });
        }
      })();
      return true;
    }

    if (msg.type === "KIROV_CAPTURE_ONLY") {
      (async () => {
        try {
          showHud("Capture en cours...", "info");
          const content = await waitForFullResponse({
            minLength: msg.minLength,
            minFiles: msg.minFiles,
            timeout: msg.timeout,
          });
          if (content) {
            showHud(`Capturé ${content.length} chars ✅`, "success");
            hideHud();
            sendResponse({ success: true, content });
          } else {
            showHud("Capture échouée", "error");
            hideHud();
            sendResponse({ success: false, message: "Aucune réponse capturée" });
          }
        } catch (e) {
          sendResponse({ success: false, message: e.message });
        }
      })();
      return true;
    }

    if (msg.type === "KIROV_INJECT_AND_CAPTURE") {
      (async () => {
        // Target AI Filter
        const platform = PlatformDetector.detect();
        if (msg.targetAi && msg.targetAi !== "any" && msg.targetAi !== platform.name) {
          // Silent ignore if not the target AI
          return;
        }

        if (isBusy) {
          sendResponse({ success: false, message: "Déjà en cours de traitement" });
          return;
        }
        isBusy = true;
        try {
          const platform = PlatformDetector.detect();
          Log.info(`Inject+Capture sur ${platform.name} — step ${msg.stepId}`);
          showHud(`Étape ${msg.stepId ?? "?"} — Injection...`, "info");

          // Snapshot last message before inject
          const lastEl = getLastAssistantElement();
          const lastKnownText = lastEl ? extractContent(lastEl) : "";

          const injected = await injectPrompt(msg.prompt || "");
          if (!injected) {
            showHud("Échec injection textarea", "error");
            hideHud();
            sendResponse({
              success: false,
              message: "Impossible d'injecter le prompt (textarea introuvable)",
            });
            return;
          }

          showHud(`Étape ${msg.stepId ?? "?"} — Génération en cours...`, "info");
          const content = await waitForFullResponse({
            minLength: msg.minLength || CONFIG.MIN_RESPONSE_LENGTH,
            minFiles: msg.minFiles || 0,
            timeout: msg.timeout || CONFIG.CAPTURE_TIMEOUT,
            lastKnownText,
          });

          if (content && content.length >= (msg.minLength || CONFIG.MIN_RESPONSE_LENGTH) * 0.5) {
            showHud(`Capturé ${content.length} caractères ✅`, "success");
            hideHud(4000);
            Log.success(`Capture ${content.length} chars`);
            sendResponse({ success: true, content, length: content.length });
          } else {
            showHud("Capture insuffisante / timeout", "error");
            hideHud();
            sendResponse({
              success: false,
              message: `Capture échouée (${content ? content.length : 0} chars)`,
              content: content || null,
            });
          }
        } catch (e) {
          Log.error(e);
          showHud("Erreur: " + e.message, "error");
          hideHud();
          sendResponse({ success: false, message: e.message });
        } finally {
          isBusy = false;
        }
      })();
      return true; // async
    }

    return false;
  });

  Log.success(`Content script actif sur ${PlatformDetector.detect().name} — v${CONFIG.VERSION}`);
})();
