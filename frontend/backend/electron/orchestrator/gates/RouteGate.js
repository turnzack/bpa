"use strict";

function materializeRoute(route) {
  return route.replace(/:([A-Za-z0-9_]+)/g, "test-value");
}

function extractSourceFile(stack) {
  if (!stack) return null;
  const match = stack.match(/(src\/[^:]+\.(?:tsx|ts|jsx|js|css))/i);
  return match ? match[1] : null;
}

function publishRuntimeDiagnostics({ projectId, errors }) {
  try {
    const sutureEngine = require("../../SutureEngine");
    for (const error of errors) {
      if (error.code === "RUNTIME_PAGE_ERROR" || error.code === "CONSOLE_ERROR") {
        sutureEngine.recordError({
          projectId,
          source: "playwright",
          file: extractSourceFile(error.stack || error.message),
          message: error.message,
          stack: error.stack,
          observedAt: new Date().toISOString()
        });
      }
    }
  } catch(e) {
    // Ignore require error if SutureEngine is not available
  }
}

class RouteGate {
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
      return { status: "error", verified: false, mode: "real", errors: [{ code: "PLAYWRIGHT_NOT_INSTALLED", message: e.message }] };
    }

    const start = Date.now();
    const errors = [];
    const tested = [];
    
    const browser = await playwright.chromium.launch({ headless: true });
    
    try {
      const page = await browser.newPage();

      page.on("pageerror", (error) => {
        errors.push({
          code: "RUNTIME_PAGE_ERROR",
          message: error.message,
          stack: error.stack || null,
          url: page.url()
        });
      });

      page.on("console", (message) => {
        if (message.type() === "error") {
          errors.push({
            code: "CONSOLE_ERROR",
            message: message.text(),
            url: page.url()
          });
        }
      });

      for (const route of routes) {
        const concreteRoute = materializeRoute(route);
        let response;
        try {
          response = await page.goto(`${url}${concreteRoute}`, {
            waitUntil: "domcontentloaded",
            timeout: 30000
          });
        } catch (navErr) {
          errors.push({ code: "NAVIGATION_FAILED", route, message: navErr.message });
          continue;
        }

        const status = response ? response.status() : 0;
        tested.push({ route, concreteRoute, status });

        if (status >= 400 || status === 0) {
          errors.push({ code: "ROUTE_HTTP_FAILED", route, status });
        }

        await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});

        // Détection d'écran blanc améliorée
        const rootHtml = await page.locator("#root").innerHTML().catch(() => "");
        const bodyText = await page.locator("body").innerText().catch(() => "");

        const visibleText = bodyText.trim().length > 0;
        const hasRootContent = rootHtml.trim().length > 0;

        if (!visibleText && !hasRootContent) {
          errors.push({ code: "BLANK_SCREEN", route });
        }
        
        // Détection d'Error Boundary
        const bodyHtmlStr = await page.locator("body").innerHTML().catch(() => "");
        if (bodyHtmlStr.includes("Erreur d'affichage") || bodyHtmlStr.toLowerCase().includes("something went wrong")) {
          errors.push({ code: "ERROR_BOUNDARY_RENDERED", route });
        }
      }
    } finally {
      await browser.close();
    }

    if (errors.length > 0) {
      publishRuntimeDiagnostics({ projectId, errors });
    }

    return {
      status: errors.length === 0 ? "passed" : "failed",
      verified: true,
      mode: "real",
      tested,
      errors,
      durationMs: Date.now() - start
    };
  }
}

module.exports = RouteGate;
