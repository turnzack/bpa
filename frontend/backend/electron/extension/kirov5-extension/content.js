/**
 * KIROV5 Orchestrator — Content Script
 * Base v16 : injection + Smart Capture v2 + HUD
 * + KIROV4 : bridge polling :5006/Vercel, target_ai filter, safeInterval,
 *            push GitHub auto, fetch override anti mixed-content, Claude
 */

(() => {
  if (window.__KIROV5_CS__) return;
  window.__KIROV5_CS__ = true;

  const CONFIG = {
    CAPTURE_CHECK_INTERVAL: 2500,
    CAPTURE_TIMEOUT: 300000,
    MIN_RESPONSE_LENGTH: 200,
    STABLE_CHECKS_REQUIRED: 3,
    POST_GENERATION_COOLDOWN: 8000,
    MIN_FILES_REQUIRED: 1,
    CONTENT_DROP_THRESHOLD: 0.5,
    BRIDGE_SERVER: "http://127.0.0.1:5006",
    BRIDGE_VERCEL: "https://forge-kohl-kappa.vercel.app",
    POLLING_INTERVAL: 2500,
    VERSION: "5.1.1",
  };

  let isBusy = false;
  let isBridgeProcessing = false;
  let bridgeEnabled = true;

  /* ── Logger ── */
  const Log = {
    info: (...a) => console.log("%c[KIROV5]", "color:#06b6d4;font-weight:bold", ...a),
    warn: (...a) => console.warn("[KIROV5]", ...a),
    error: (...a) => console.error("[KIROV5]", ...a),
    success: (...a) => console.log("%c[KIROV5] ✅", "color:#10b981;font-weight:bold", ...a),
  };

  function contentLog(message, level) {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime?.id) {
        chrome.runtime.sendMessage({ type: "CONTENT_LOG", message, level: level || "info" }).catch(() => {});
      }
    } catch (_) {}
  }

  /* ── safeInterval — protection invalidation d'extension (KIROV4) ── */
  function safeInterval(fn, delay) {
    const id = setInterval(async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.runtime?.id) {
          await fn();
        } else {
          clearInterval(id);
        }
      } catch (e) {
        if (e?.message?.includes("Extension context invalidated")) {
          clearInterval(id);
        }
      }
    }, delay);
    return id;
  }

  /* ── Fetch override (anti mixed-content → proxy BG) ── */
  const originalFetch = window.fetch.bind(window);
  window.fetch = async function (resource, config) {
    const url =
      typeof resource === "string"
        ? resource
        : resource instanceof Request
          ? resource.url
          : "";
    const isBridge =
      url &&
      (url.includes("127.0.0.1:5006") ||
        url.includes("localhost:5006") ||
        url.includes("forge-kohl-kappa.vercel.app"));
    if (isBridge && typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
      return new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage(
            { type: "FETCH", url, options: config || {} },
            (response) => {
              if (chrome.runtime.lastError || !response?.success) {
                originalFetch(resource, config).then(resolve).catch(reject);
                return;
              }
              resolve({
                ok: response.result.ok,
                status: response.result.status,
                text: async () => response.result.text,
                json: async () =>
                  response.result.data || JSON.parse(response.result.text || "{}"),
              });
            }
          );
        } catch (e) {
          originalFetch(resource, config).then(resolve).catch(reject);
        }
      });
    }
    return originalFetch(resource, config);
  };

  /* ── Platform detection (+ Claude from KIROV4) ── */
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
          textareaSelector:
            '#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"], div[contenteditable="true"]',
          sendButtonSelector:
            'button[data-testid="send-button"], button[aria-label*="Send"], button[aria-label*="Envoyer"]',
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
          textareaSelector: 'div[contenteditable="true"], textarea, [role="textbox"]',
          sendButtonSelector:
            'button[aria-label*="send" i], button[aria-label*="envoyer" i], .send-button, div[role="button"]:has(svg)',
        };
      }
      if (host.includes("claude")) {
        return {
          name: "claude",
          textareaSelector: 'div[contenteditable="true"], .ProseMirror, [role="textbox"]',
          sendButtonSelector:
            'button[aria-label*="Send" i], button[aria-label*="Envoyer" i], button[type="submit"]',
        };
      }
      if (host.includes("perplexity")) {
        return {
          name: "perplexity",
          textareaSelector: 'textarea, div[contenteditable="true"]',
          sendButtonSelector:
            'button[aria-label*="Submit" i], button[aria-label*="Send" i], button:has(svg)',
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
    const host = location.hostname;
    if (host.includes("deepseek")) {
      const els = document.querySelectorAll(".ds-markdown, .markdown-body");
      if (els.length) {
        let best = null,
          max = 0;
        els.forEach((e) => {
          const n = (e.textContent || "").length;
          if (n > max) {
            max = n;
            best = e;
          }
        });
        if (best) return best;
      }
    }
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

  async function sha256(t) {
    const b = new TextEncoder().encode(t);
    const h = await crypto.subtle.digest("SHA-256", b);
    return Array.from(new Uint8Array(h))
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
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
      const current = (textarea.innerText || textarea.textContent || "").trim();
      if (current.length < Math.min(50, prompt.length / 2)) {
        textarea.focus();
        document.execCommand("selectAll", false, null);
        document.execCommand("insertText", false, prompt);
      }
    }

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

      if (maxLenSeen > 1000 && currentLen < maxLenSeen * CONFIG.CONTENT_DROP_THRESHOLD) {
        Log.warn(`Chute contenu: ${currentLen} < ${maxLenSeen}`);
        stableCount = 0;
        generationEndedAt = null;
        maxLenSeen = currentLen;
      }

      if (lastKnownText.length > 0 && Math.abs(currentLen - lastKnownText.length) <= 5) {
        stableCount = 0;
      } else if (!generating && currentContent === previousContent && currentLen > 0) {
        stableCount++;
      } else if (currentContent !== previousContent) {
        stableCount = 0;
      }

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

  /* ── Parse / fix files (KIROV5.1.1 — React extensions préservées) ── */
  const FORBIDDEN_FILES = new Set(["package.js", "tsconfig.js", "App.ts", "main.js"]);

  const LANG_TO_EXT = {
    typescript: "ts", ts: "ts", tsx: "tsx",
    javascript: "js", js: "js", jsx: "jsx",
    html: "html", css: "css", json: "json",
    markdown: "md", md: "md", yaml: "yaml", yml: "yml",
  };

  const CANONICAL = {
    "index.html": "index.html",
    "package.json": "package.json",
    "tsconfig.json": "tsconfig.json",
    "vite.config.ts": "vite.config.ts",
    "vite.config.js": "vite.config.js",
    "tailwind.config.js": "tailwind.config.js",
    "postcss.config.js": "postcss.config.js",
    "readme.md": "README.md",
  };

  function inferExt(basename, content, dir) {
    const name = String(basename || "");
    const c = String(content || "");
    const d = String(dir || "").toLowerCase();
    const head = c.slice(0, 400);
    if (/<!doctype html|<html/i.test(c)) return "html";
    if (/^package$/i.test(name) || (c.trim().startsWith("{") && /"name"\s*:/.test(c))) return "json";
    if (/^tsconfig/i.test(name)) return "json";
    if (/^vite\.config$/i.test(name)) return "ts";
    if (/^tailwind\.config$/i.test(name) || /^postcss\.config$/i.test(name)) return "js";
    if (/^index$/i.test(name) && /@tailwind|@import|^\s*:root\s*\{/m.test(c)) return "css";
    if (
      /@tailwind\s+(base|components|utilities)/.test(c) ||
      (/^\s*[.#*a-z][\w-]*\s*\{/m.test(c) && !/^(import |export |const |function )/m.test(head))
    ) return "css";
    const hasJsx =
      /(?:return\s*\(?\s*|[=(:]\s*)<[A-Z][A-Za-z0-9]*[\s/>]/.test(c) ||
      /<\/[A-Za-z][A-Za-z0-9]*>/.test(c) ||
      /React\.createElement/.test(c) ||
      /\bcreateRoot\b|\bReactDOM\b/.test(c) ||
      /return\s+<[A-Za-z]/.test(c);
    if (/components|pages|layouts/i.test(d) || /^(App|main)$/i.test(name) || /^[A-Z][A-Za-z0-9]+$/.test(name))
      return "tsx";
    // hooks/store/utils/types → always .ts (ignore TS generics)
    if (/hooks|utils|store|services|types|lib|data/i.test(d) || /^use[A-Z]/.test(name))
      return "ts";
    if (hasJsx) return "tsx";
    if (/^(interface |type |enum |export type |import type )/m.test(c)) return "ts";
    if (/^import |^export |function |const /m.test(c)) return "ts";
    if (/^#\s/m.test(c)) return "md";
    return "ts";
  }

  function normalizePath(rawPath, content, language) {
    if (!rawPath) return rawPath;
    let path = String(rawPath).trim()
      .replace(/\\/g, "/").replace(/^\/+/, "").replace(/^\.\//, "")
      .replace(/\*\*/g, "").replace(/`/g, "").replace(/^["']|["']$/g, "")
      .replace(/[:\s]+$/, "");
    const segs = path.split("/");
    let base = segs.pop() || path;
    const dir = segs.join("/");
    const low = base.toLowerCase();
    if (CANONICAL[low]) {
      base = CANONICAL[low];
      return dir ? `${dir}/${base}` : base;
    }
    // Strip forced .txt
    if (/\.txt$/i.test(base)) base = base.replace(/\.txt$/i, "");
    const EXT_RE = /\.(tsx|ts|jsx|js|mjs|cjs|css|scss|html|json|md|yaml|yml|svg)$/i;
    if (EXT_RE.test(base)) {
      if (/\.ts$/i.test(base) && /<[A-Za-z]|<\/[A-Za-z]|from ['"]react['"]/.test(content || ""))
        base = base.replace(/\.ts$/i, ".tsx");
      return dir ? `${dir}/${base}` : base;
    }
    const lang = String(language || "").toLowerCase();
    let ext = LANG_TO_EXT[lang] || inferExt(base, content, dir);
    if (ext) base = `${base}.${ext}`;
    return dir ? `${dir}/${base}` : base;
  }

  function parseFiles(content) {
    if (!content) return [];
    const files = [];

    // 1) Fichier: path blocks
    const segs = content.split(/(?:Fichier|File)\s*:\s*/i);
    for (let i = 1; i < segs.length; i++) {
      const seg = segs[i];
      const lines = seg.split("\n");
      const path = lines[0].trim().replace(/\*\*/g, "").replace(/`/g, "");
      const f = seg.indexOf("```");
      const l = seg.lastIndexOf("```");
      if (f === -1 || l === f) continue;
      const nl = seg.substring(f).indexOf("\n");
      if (nl === -1) continue;
      const langMatch = seg.substring(f + 3, f + nl).trim();
      files.push({
        path,
        content: seg.substring(f + nl + 1, l).trim(),
        language: langMatch || undefined,
      });
    }
    if (files.length) return files;

    // 2) JSON {"files":[...]}
    let s = content.trim();
    const fm = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fm && /"files"\s*:|"path"\s*:/.test(fm[1])) s = fm[1].trim();

    try {
      const p = JSON.parse(s);
      if (p.files && Array.isArray(p.files)) return p.files;
      if (Array.isArray(p) && p[0]?.path) return p;
      if (typeof p.content === "string" && p.content.includes("path")) {
        const inner = parseFiles(p.content);
        if (inner.length) return inner;
      }
      if (p.content?.files) return p.content.files;
    } catch (_) {}

    // Brace-match extract of object containing "files"
    const filesKey = s.search(/"files"\s*:\s*\[/);
    if (filesKey !== -1) {
      let start = s.lastIndexOf("{", filesKey);
      for (let si = start; si >= 0; si = s.lastIndexOf("{", si - 1)) {
        let depth = 0, inStr = false, esc = false;
        for (let i = si; i < s.length; i++) {
          const c = s[i];
          if (esc) { esc = false; continue; }
          if (c === "\\") { esc = true; continue; }
          if (c === '"') { inStr = !inStr; continue; }
          if (inStr) continue;
          if (c === "{") depth++;
          else if (c === "}") {
            depth--;
            if (depth === 0) {
              try {
                const p = JSON.parse(s.slice(si, i + 1));
                if (p.files && Array.isArray(p.files)) return p.files;
              } catch (_) {}
              break;
            }
          }
        }
        if (si === 0) break;
      }
    }

    const fi = s.indexOf("{"), la = s.lastIndexOf("}");
    if (fi !== -1 && la > fi) {
      try {
        const p = JSON.parse(s.slice(fi, la + 1));
        if (p.files) return p.files;
        if (typeof p.content === "string") {
          const inner = parseFiles(p.content);
          if (inner.length) return inner;
        }
      } catch (_) {}
    }

    // 3) Regex individual file objects
    const re =
      /\{\s*"path"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"language"\s*:\s*"((?:[^"\\]|\\.)*)")?\s*\}/g;
    let m;
    while ((m = re.exec(s)) !== null) {
      try {
        files.push({
          path: JSON.parse(`"${m[1]}"`),
          content: JSON.parse(`"${m[2]}"`),
          language: m[3] ? JSON.parse(`"${m[3]}"`) : undefined,
        });
      } catch (_) {
        files.push({
          path: m[1],
          content: m[2].replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
          language: m[3] || undefined,
        });
      }
    }
    if (files.length) return files;

    // 4) ```tsx src/App.tsx\n...```
    const fencePathRe =
      /```(\w+)?\s*(?:(?:file|path|title)=)?[`"]?([^\n`"]+\.[a-zA-Z0-9]+)[`"]?\s*\n([\s\S]*?)```/g;
    let fm2;
    while ((fm2 = fencePathRe.exec(content)) !== null) {
      const lang = fm2[1] || "";
      const p = fm2[2].trim();
      if (/^(json|javascript|typescript|tsx|jsx|html|css|bash|shell|yaml|yml|md|markdown)$/i.test(p))
        continue;
      files.push({ path: p, content: fm2[3], language: lang });
    }
    return files;
  }

  function fixFiles(files) {
    const seen = new Set(), out = [];
    for (let f of files || []) {
      let p = f.path;
      let c = f.content;
      if (!p || c == null) continue;
      p = normalizePath(p, c, f.language);
      const base = p.split("/").pop() || p;
      if (base === "Index.html") p = p.replace(/Index\.html$/, "index.html");
      if (base === "package.js" && String(c).trim().startsWith("{"))
        p = p.replace(/package\.js$/, "package.json");
      if (/^App\.ts$/i.test(base) && /<[A-Z]|from ['"]react['"]/i.test(c))
        p = p.replace(/App\.ts$/i, "App.tsx");
      if (/^main\.ts$/i.test(base) && /from ['"]react['"]|createRoot/i.test(c))
        p = p.replace(/main\.ts$/i, "main.tsx");
      if (p.endsWith(".vue") || FORBIDDEN_FILES.has(base)) continue;
      const fl = String(c).split("\n")[0];
      if (/^(html|javascript|typescript|tsx|jsx|css|json)\s*$/i.test(fl.trim()))
        c = String(c).split("\n").slice(1).join("\n");
      if (/\.(tsx|jsx|ts|js)$/i.test(p) && String(c).includes("BrowserRouter"))
        c = String(c).replace(/\bBrowserRouter\b/g, "HashRouter");
      if (p === "package.json" || p.endsWith("/package.json")) {
        try {
          const pkg = JSON.parse(c);
          if (pkg.type !== "module") pkg.type = "module";
          if (!pkg.scripts) pkg.scripts = {};
          if (!pkg.scripts.dev) pkg.scripts.dev = "vite";
          if (!pkg.scripts.build || (String(pkg.scripts.build).includes("tsc") && !String(pkg.scripts.build).includes("vite")))
            pkg.scripts.build = "vite build";
          c = JSON.stringify(pkg, null, 2);
        } catch (_) {}
      }
      if (!seen.has(p)) {
        seen.add(p);
        out.push({ ...f, path: p, content: c });
      }
    }
    return out;
  }

  /* ── HUD overlay ── */
  function showHud(message, type = "info") {
    let hud = document.getElementById("kirov5-hud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "kirov5-hud";
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
    hud.innerHTML = `<div style="font-weight:700;color:${colors[type] || colors.info};margin-bottom:4px">⚡ KIROV5 v${CONFIG.VERSION}</div><div>${message}</div>`;
    hud.style.opacity = "1";
  }

  function hideHud(delay = 3000) {
    setTimeout(() => {
      const hud = document.getElementById("kirov5-hud");
      if (hud) hud.style.opacity = "0";
    }, delay);
  }

  /* ── Bridge helpers ── */
  function detectAiName() {
    const h = location.hostname.toLowerCase();
    if (h.includes("deepseek")) return "deepseek";
    if (h.includes("kimi") || h.includes("moonshot")) return "kimi";
    if (h.includes("gemini")) return "gemini";
    if (h.includes("claude")) return "claude";
    if (h.includes("chatgpt") || h.includes("openai.com")) return "chatgpt";
    if (h.includes("perplexity")) return "perplexity";
    return "unknown";
  }

  async function loadBridgeConfig() {
    try {
      if (typeof chrome === "undefined" || !chrome.runtime?.id) return;
      const r = await chrome.storage.local.get([
        "kirov_bridge_url",
        "kirov_bridge_vercel",
        "kirov_bridge_enabled",
        "kirov_bridge_interval",
      ]);
      if (r.kirov_bridge_url) CONFIG.BRIDGE_SERVER = r.kirov_bridge_url;
      if (r.kirov_bridge_vercel) CONFIG.BRIDGE_VERCEL = r.kirov_bridge_vercel;
      if (r.kirov_bridge_enabled === false) bridgeEnabled = false;
      else bridgeEnabled = true;
      if (r.kirov_bridge_interval) CONFIG.POLLING_INTERVAL = r.kirov_bridge_interval;
    } catch (_) {}
  }

  async function sendBridgeCallback(content) {
    try {
      const res = await fetch(`${CONFIG.BRIDGE_SERVER}/v1/bridge/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, response: content, is_final: true }),
      });
      return await res.json();
    } catch (e) {
      Log.error("sendCallback failed:", e.message);
      return null;
    }
  }

  const SILENCE = `
SILENCE ABSOLU — RÈGLE S1:
- UNIQUEMENT du JSON valide {"files":[{"path":"...","content":"...","language":"..."}]}
- Aucun texte conversationnel, aucune explication
`;

  async function pollForPrompt() {
    if (isBridgeProcessing || isBusy || !bridgeEnabled) return;
    try {
      let data = null;
      try {
        const r = await fetch(`${CONFIG.BRIDGE_VERCEL}/api/bridge/prompt`);
        if (r.ok) {
          const d = await r.json();
          if (d.status !== "idle" && d.prompt) data = d;
        }
      } catch (_) {}
      if (!data) {
        try {
          const r = await fetch(`${CONFIG.BRIDGE_SERVER}/v1/bridge/poll`);
          if (r.ok) {
            const d = await r.json();
            if (d.status !== "idle" && d.prompt) data = d;
          }
        } catch (_) {}
      }
      if (!data) return;

      // target_ai filter — avoid injecting on wrong AI tab (KIROV4)
      const ai = detectAiName();
      if (data.target_ai && ai !== "unknown" && data.target_ai !== ai) {
        Log.info(`Bridge skip: target_ai=${data.target_ai} current=${ai}`);
        return;
      }

      const hash = await sha256(data.prompt + (data.prompt_id || ""));
      const lastHash = sessionStorage.getItem("kirov5_last_hash");
      const lastPhase = parseInt(sessionStorage.getItem("kirov5_last_phase") || "-1", 10);
      if (hash === lastHash && data.phase_num === lastPhase) return;
      sessionStorage.setItem("kirov5_last_phase", String(data.phase_num ?? ""));

      isBridgeProcessing = true;
      const missionId = data.project_id || `mission_${Date.now()}`;
      const lastEl = getLastAssistantElement();
      const lastText = lastEl ? extractContent(lastEl) : "";

      let full = "";
      if (data.prompt && data.prompt.startsWith("[PROJET :")) {
        full = data.prompt;
      } else {
        full = `[PROJET : ${String(missionId).toUpperCase()}]`;
        if (data.phase_name) full += ` - [${data.phase_name}]`;
        full += "\n";
        if (parseInt(data.phase_num, 10) >= 2) full += SILENCE + "\n\n---\n\n";
        full += data.prompt;
      }

      showHud(`Bridge → injection (${ai})…`, "info");
      contentLog(`Bridge prompt reçu (${data.source || "local"}) → ${ai}`, "info");

      const ok = await injectPrompt(full);
      if (!ok) {
        isBridgeProcessing = false;
        showHud("Bridge: échec injection", "error");
        hideHud();
        return;
      }

      try {
        await fetch(`${CONFIG.BRIDGE_SERVER}/v1/bridge/consume`, { method: "POST" });
      } catch (_) {}
      sessionStorage.setItem("kirov5_last_hash", hash);

      showHud("Bridge → capture…", "info");
      const captured = await waitForFullResponse({
        lastKnownText: lastText,
        minLength: CONFIG.MIN_RESPONSE_LENGTH,
      });

      if (captured && captured.length >= CONFIG.MIN_RESPONSE_LENGTH) {
        const parsed = parseFiles(captured);
        if (parsed.length === 0) {
          await sendBridgeCallback(captured);
          showHud(`Bridge capturé ${captured.length} chars`, "success");
        } else {
          const fixed = fixFiles(parsed);
          const result = await sendBridgeCallback(JSON.stringify({ files: fixed }));
          try {
            chrome.runtime.sendMessage({ type: "STORE_CAPTURED", files: fixed }).catch(() => {});
          } catch (_) {}

          // Auto-write to disk (pour Treecontry Pipeline >= phase 8)
          const pNum = parseInt(data.phase_num, 10);
          if (!isNaN(pNum) && (pNum >= 8 || fixed.length >= 2)) {
            try {
              chrome.runtime.sendMessage({
                type: "WRITE_FILES",
                files: fixed,
                folderName: `Treecontry_${missionId}`,
                saveAs: false
              }).catch(() => {});
              contentLog(`💾 Auto-write disque déclenché (${fixed.length} fichiers)`, "success");
            } catch (_) {}
          }

          // Auto GitHub push if App/main present
          if (
            fixed.some(
              (f) =>
                f.path &&
                (f.path.includes("App.tsx") ||
                  f.path.includes("main.tsx") ||
                  f.path.includes("App.jsx"))
            ) &&
            fixed.length >= 2
          ) {
            try {
              chrome.runtime
                .sendMessage({ type: "PUSH_GITHUB", files: fixed })
                .catch(() => {});
              contentLog(`🐙 Auto-push GitHub (${fixed.length} fichiers)`, "info");
            } catch (_) {}
          }

          if (result?.success) {
            try {
              const r = await fetch(`${CONFIG.BRIDGE_SERVER}/v1/g5/autopilot/advance`, {
                method: "POST",
              });
              const d = await r.json();
              if (d.success && !d.completed) {
                Log.info(`AUTO-PILOT → Phase ${d.currentPhase}`);
                contentLog(`AUTO-PILOT → Phase ${d.currentPhase}`, "ok");
              }
            } catch (_) {}
          }
          showHud(`Bridge: ${fixed.length} fichiers ✅`, "success");
          contentLog(`📦 Bridge capture: ${fixed.length} fichiers`, "success");
        }
      } else {
        showHud("Bridge: capture insuffisante", "warn");
      }
      hideHud(4000);
      isBridgeProcessing = false;
    } catch (e) {
      Log.error("Poll error:", e.message);
      contentLog("Bridge error: " + e.message, "error");
      isBridgeProcessing = false;
    }
  }

  /* ── Message handler ── */
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    // Legacy KIROV4 action-style messages (popup inject tab)
    if (msg.action === "injectPrompt") {
      (async () => {
        try {
          showHud("Injection…", "info");
          const ok = await injectPrompt(msg.prompt || "");
          showHud(ok ? "Injecté ✅" : "Échec", ok ? "success" : "error");
          hideHud();
          sendResponse({ ok, success: ok });
        } catch (e) {
          sendResponse({ ok: false, success: false, message: e.message });
        }
      })();
      return true;
    }
    if (msg.action === "getCapturedFiles") {
      const el = getLastAssistantElement();
      if (el) {
        const c = extractContent(el);
        const files = fixFiles(parseFiles(c));
        sendResponse({ files, content: c, projectId: "kirov5-" + Date.now() });
      } else {
        sendResponse({ files: [], projectId: null });
      }
      return false;
    }
    if (msg.action === "getCapture") {
      const el = getLastAssistantElement();
      sendResponse({ content: el ? extractContent(el) : "" });
      return false;
    }

    if (msg.type === "KIROV_PING") {
      sendResponse({
        success: true,
        platform: PlatformDetector.detect().name,
        version: CONFIG.VERSION,
        busy: isBusy || isBridgeProcessing,
        bridgeEnabled,
      });
      return false;
    }

    if (msg.type === "KIROV_SET_BRIDGE") {
      if (msg.enabled != null) bridgeEnabled = !!msg.enabled;
      if (msg.serverUrl) CONFIG.BRIDGE_SERVER = msg.serverUrl;
      if (msg.vercelUrl) CONFIG.BRIDGE_VERCEL = msg.vercelUrl;
      sendResponse({ success: true, bridgeEnabled });
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
            const files = fixFiles(parseFiles(content));
            if (files.length) {
              try {
                chrome.runtime
                  .sendMessage({ type: "STORE_CAPTURED", files })
                  .catch(() => {});
              } catch (_) {}
            }
            showHud(`Capturé ${content.length} chars ✅`, "success");
            hideHud();
            sendResponse({ success: true, content, files, fileCount: files.length });
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
        if (isBusy) {
          sendResponse({ success: false, message: "Déjà en cours de traitement" });
          return;
        }
        isBusy = true;
        try {
          const platform = PlatformDetector.detect();
          Log.info(`Inject+Capture sur ${platform.name} — step ${msg.stepId}`);
          showHud(`Étape ${msg.stepId ?? "?"} — Injection...`, "info");

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
            const files = fixFiles(parseFiles(content));
            if (files.length) {
              try {
                chrome.runtime
                  .sendMessage({ type: "STORE_CAPTURED", files })
                  .catch(() => {});
              } catch (_) {}
            }
            showHud(`Capturé ${content.length} caractères ✅`, "success");
            hideHud(4000);
            Log.success(`Capture ${content.length} chars`);
            sendResponse({
              success: true,
              content,
              length: content.length,
              files,
              fileCount: files.length,
            });
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
      return true;
    }

    return false;
  });

  /* ── Boot ── */
  (async () => {
    await loadBridgeConfig();
    Log.success(
      `Content script actif sur ${PlatformDetector.detect().name} — v${CONFIG.VERSION} (bridge ${bridgeEnabled ? "ON" : "OFF"})`
    );
    contentLog(
      `CS prêt — ${PlatformDetector.detect().name} v${CONFIG.VERSION}`,
      "info"
    );
    safeInterval(pollForPrompt, CONFIG.POLLING_INTERVAL);
    // First poll after short delay
    setTimeout(() => {
      pollForPrompt().catch(() => {});
    }, 1500);
  })();
})();
