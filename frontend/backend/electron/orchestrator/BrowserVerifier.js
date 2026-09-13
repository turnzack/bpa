"use strict";

const path = require("path");

function normalizeBrowserError(error, code) {
  const value = typeof error === "string" ? { message: error, stack: null } : (error || {});
  
  let file = value.file || null;
  let line = value.line || null;
  let column = value.column || null;

  if (!file && value.stack) {
    const stackMatch = String(value.stack).match(/(?:at\s+.*|@)(src\/[^\s:]+\.(?:tsx|ts|jsx|js|css)):(\d+):(\d+)/i);
    if (stackMatch) {
      file = stackMatch[1];
      line = Number(stackMatch[2]);
      column = Number(stackMatch[3]);
    }
  }

  return {
    code,
    message: value.message || String(error),
    stack: value.stack || null,
    file,
    line,
    column,
    url: value.url || null
  };
}

/**
 * BrowserVerifier.js
 * Implémente la vérification dynamique Playwright de l'application
 * (Détection d'écran blanc, erreurs JS pageerror, console.error, 404/500).
 */
class BrowserVerifier {
  static async verify({ url, projectId, projectRoot, routes = ["/"], timeoutMs = 20000 }) {
    let playwright;
    try {
      playwright = require("playwright");
    } catch (err) {
      console.warn("[BrowserVerifier] Playwright n'est pas disponible :", err.message);
      return {
        ok: false,
        httpStatus: 0,
        blankScreen: true,
        pageErrors: [normalizeBrowserError({ message: "Playwright non disponible" }, "PAGE_ERROR")],
        consoleErrors: [],
        failedRequests: [],
        routesChecked: [],
        diagnostics: [{ code: "PAGE_ERROR", message: "Playwright non disponible", file: null }],
        error: "Playwright non disponible"
      };
    }

    const browser = await playwright.chromium.launch({ headless: true });
    const aggregate = {
      ok: true,
      httpStatus: 200,
      blankScreen: false,
      pageErrors: [],
      consoleErrors: [],
      failedRequests: [],
      routesChecked: [],
      diagnostics: []
    };

    try {
      const page = await browser.newPage();

      page.on("pageerror", (err) => {
        const errorObj = normalizeBrowserError({
          message: err.message || String(err),
          stack: err.stack || null
        }, "PAGE_ERROR");
        aggregate.pageErrors.push(errorObj);
        aggregate.diagnostics.push(errorObj);
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          if (!text.includes("Download the React DevTools")) {
            const errorObj = normalizeBrowserError({ message: text, url: page.url() }, "CONSOLE_ERROR");
            aggregate.consoleErrors.push(errorObj);
            aggregate.diagnostics.push(errorObj);
          }
        }
      });

      page.on("response", (res) => {
        if (res.status() >= 400) {
          const resUrl = res.url();
          // Ignorer les erreurs non-bloquantes (favicons, svgs secondaires, manifest)
          if (resUrl.endsWith('.ico') || resUrl.endsWith('/vite.svg') || resUrl.endsWith('/favicon.ico') || resUrl.includes('manifest.json')) {
            return;
          }
          const reqStr = `${res.status()} ${resUrl}`;
          const errorObj = normalizeBrowserError({ message: reqStr, url: resUrl }, "NETWORK_ERROR");
          aggregate.failedRequests.push(errorObj);
          aggregate.diagnostics.push(errorObj);
        }
      });

      for (const route of routes) {
        const fullUrl = `${url.replace(/\/+$/, "")}${route.startsWith("/") ? route : "/" + route}`;
        let mainStatus = 0;
        let isBlank = false;

        try {
          const response = await page.goto(fullUrl, {
            waitUntil: "domcontentloaded",
            timeout: timeoutMs
          });

          mainStatus = response ? response.status() : 0;
          await page.waitForTimeout(1000); // Laisse React/Vite hydrater

          // Détection dynamique de l'overlay d'erreur Vite dans le DOM !
          const viteOverlayText = await page.evaluate(() => {
            const el = document.querySelector('vite-error-overlay');
            if (!el) return null;
            if (el.shadowRoot) {
              return el.shadowRoot.textContent || el.shadowRoot.innerText || el.textContent;
            }
            return el.textContent || el.innerText;
          });

          if (viteOverlayText) {
            const overlayErrObj = normalizeBrowserError({
              message: `[vite-error-overlay] ${viteOverlayText.slice(0, 1500)}`,
              stack: viteOverlayText
            }, "PAGE_ERROR");
            aggregate.pageErrors.push(overlayErrObj);
            aggregate.diagnostics.push(overlayErrObj);
            isBlank = true;
          }

          isBlank = isBlank || await page.evaluate(() => {
            if (!document.body) return true;
            const text = document.body.innerText ? document.body.innerText.trim() : "";
            const children = document.body.children.length;
            const rootEl = document.getElementById("root") || document.getElementById("app");
            const rootEmpty = rootEl ? rootEl.children.length === 0 && !rootEl.innerText.trim() : false;
            return (text.length === 0 && children <= 1) || rootEmpty;
          });
        } catch (gotoErr) {
          const navErrorObj = normalizeBrowserError({ message: `Navigation error for ${route}: ${gotoErr.message}` }, "PAGE_ERROR");
          aggregate.pageErrors.push(navErrorObj);
          aggregate.diagnostics.push(navErrorObj);
          mainStatus = 0;
          isBlank = true;
        }

        aggregate.routesChecked.push({
          route,
          httpStatus: mainStatus,
          blankScreen: isBlank
        });

        if (mainStatus < 200 || mainStatus >= 400) {
          aggregate.httpStatus = mainStatus;
        }
        if (isBlank) {
          aggregate.blankScreen = true;
        }
      }

      if (aggregate.blankScreen) {
        const blankObj = {
          code: "BLANK_SCREEN",
          message: "Écran blanc détecté : le conteneur React #root est vide.",
          file: null,
          line: null,
          column: null
        };
        aggregate.diagnostics.push(blankObj);
      }
    } finally {
      await browser.close().catch(() => {});
    }

    const isHttpStatusOk = aggregate.httpStatus >= 200 && aggregate.httpStatus < 400;
    aggregate.ok =
      isHttpStatusOk &&
      !aggregate.blankScreen &&
      aggregate.pageErrors.length === 0 &&
      aggregate.consoleErrors.length === 0 &&
      aggregate.failedRequests.length === 0;

    return aggregate;
  }
}

module.exports = BrowserVerifier;
