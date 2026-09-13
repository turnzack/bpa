"use strict";

class ConsoleErrorGate {
  static async run(projectId, context = {}, manifest = null) {
    if (!context.runtime || !context.runtime.url) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "NO_RUNTIME_URL" }] };
    }

    const { url } = context.runtime;
    const routes = (manifest && manifest.routes && manifest.routes.length > 0) ? manifest.routes : ["/"];

    let playwright;
    try {
      playwright = require("playwright");
    } catch (e) {
      return { status: "error", verified: false, mode: "real", errors: [{ code: "PLAYWRIGHT_NOT_INSTALLED" }] };
    }

    const start = Date.now();
    const errors = [];
    const browser = await playwright.chromium.launch({ headless: true });

    try {
      const page = await browser.newPage();

      page.on("console", (message) => {
        if (message.type() === "error") {
          // Filtrer les erreurs normales liées à React DevTools si besoin
          const text = message.text();
          if (!text.includes("Download the React DevTools")) {
            errors.push({ code: "CONSOLE_ERROR", message: text });
          }
        }
      });

      page.on("pageerror", (error) => {
        errors.push({ code: "PAGE_ERROR", message: error.message });
      });

      for (const route of routes) {
        try {
          await page.goto(`${url}${route}`, { waitUntil: "domcontentloaded", timeout: 20000 });
          // Laisser un peu de temps pour l'exécution JS client
          await page.waitForTimeout(1000);
        } catch (e) {
          // Ignoré, capturé par RouteGate
        }
      }
    } finally {
      await browser.close();
    }

    return {
      status: errors.length === 0 ? "passed" : "failed",
      verified: true,
      mode: "real",
      errors,
      durationMs: Date.now() - start
    };
  }
}

module.exports = ConsoleErrorGate;
