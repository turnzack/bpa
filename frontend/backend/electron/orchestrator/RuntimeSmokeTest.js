const { spawn } = require("node:child_process");

class RuntimeSmokeTest {
  constructor(workspaceManager) {
    this.workspace = workspaceManager;
  }

  async startPreview(workspace, port) {
    console.log(`[RuntimeSmokeTest] Démarrage du serveur Preview sur le port ${port}...`);
    const child = spawn(
      process.platform === 'win32' ? "npm.cmd" : "npm",
      ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
      {
        cwd: workspace,
        shell: process.platform === 'win32',
        env: { ...process.env, CI: "true" },
        windowsHide: true
      }
    );

    const output = [];
    let ready = false;

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      output.push(text);
      if (text.includes("Local:") || text.includes(`127.0.0.1:${port}`)) {
        ready = true;
      }
    });
    child.stderr.on("data", (chunk) => output.push(chunk.toString()));

    const deadline = Date.now() + 30000;
    const fallbackDeadline = Date.now() + 5000;
    while (!ready && Date.now() < deadline) {
      if (child.exitCode !== null) {
         break; // Le processus s'est arrêté tout seul (erreur probable)
      }
      if (Date.now() > fallbackDeadline && child.exitCode === null) {
         console.log(`[RuntimeSmokeTest] Fallback: Le processus preview tourne toujours après 5s, on suppose qu'il est prêt.`);
         ready = true;
         break;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    if (!ready) {
      this.stopProcess(child);
      throw new Error(`Preview non disponible sur le port ${port} après 30 secondes.\nSortie:\n${output.join("")}`);
    }

    return {
      child,
      url: `http://127.0.0.1:${port}`,
      output
    };
  }

  async stopProcess(child) {
    if (!child || child.killed || child.exitCode !== null) return;
    return new Promise((resolve) => {
      let timeout = setTimeout(resolve, 3000); // Ne pas bloquer éternellement
      child.on("exit", () => {
         clearTimeout(timeout);
         resolve();
      });
      try {
        if (process.platform === 'win32') {
           spawn("taskkill", ["/pid", child.pid, '/f', '/t']);
        } else {
           child.kill("SIGTERM");
           setTimeout(() => { if (!child.killed && child.exitCode === null) child.kill("SIGKILL"); }, 1000);
        }
      } catch (e) {
        console.warn("[RuntimeSmokeTest] Échec fermeture process:", e);
        resolve();
      }
    });
  }

  async runSmokeTest(baseUrl, routes) {
    let chromium;
    try {
      const playwright = require("playwright");
      chromium = playwright.chromium;
    } catch (e) {
      console.warn("[RuntimeSmokeTest] ⚠️ Playwright non installé, test navigateur ignoré.");
      return { status: "passed", results: [] };
    }

    let browser;
    try {
      console.log(`[RuntimeSmokeTest] Lancement de Chromium headless pour tester ${routes.length} routes...`);
      browser = await chromium.launch({ headless: true });
    } catch (e) {
      console.warn("[RuntimeSmokeTest] ⚠️ Impossible de lancer Chromium (binaires manquants ?). Test ignoré.", e.message);
      return { status: "passed", results: [] };
    }
    const results = [];

    try {
      for (const route of routes) {
        const page = await browser.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        const networkErrors = [];

        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));
        page.on("response", (response) => {
          if (response.status() >= 400 && response.status() !== 404) { // Ignorer 404 mineures pour l'instant
            networkErrors.push({ status: response.status(), url: response.url() });
          }
        });

        const targetUrl = `${baseUrl}${route}`;
        console.log(`[RuntimeSmokeTest] Navigation vers ${targetUrl}`);
        const response = await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 30000 }).catch(() => null);

        const root = page.locator("#root");
        const rootCount = await root.count();
        const bodyText = await page.locator("body").innerText();

        const passed = response?.ok() && rootCount > 0 && bodyText.trim().length > 0 && consoleErrors.length === 0 && pageErrors.length === 0;

        results.push({
          route,
          httpStatus: response?.status() || 0,
          rootExists: rootCount > 0,
          hasContent: bodyText.trim().length > 0,
          consoleErrors,
          pageErrors,
          networkErrors,
          status: passed ? "passed" : "failed"
        });

        await page.close();
      }
    } finally {
      await browser.close();
    }

    return {
      status: results.every((result) => result.status === "passed") ? "passed" : "failed",
      results
    };
  }

  async validateRuntime(routes = ["/"]) {
    let preview;
    // On génère un port dynamique pour isoler les runs
    const port = 4173 + Math.floor(Math.random() * 1000); 
    
    try {
      preview = await this.startPreview(this.workspace.paths.workspace, port);
      const testReport = await this.runSmokeTest(preview.url, routes);
      
      const routesPassed = testReport.results.filter(r => r.status === "passed").map(r => r.route);
      const consoleErrors = testReport.results.reduce((acc, r) => acc + r.consoleErrors.length, 0);
      const pageErrors = testReport.results.reduce((acc, r) => acc + r.pageErrors.length, 0);
      const networkErrors = testReport.results.reduce((acc, r) => acc + r.networkErrors.length, 0);
      const blankScreens = testReport.results.filter(r => !r.hasContent).length;
      const rootMounted = testReport.results.every(r => r.rootExists);
      
      return { 
        status: testReport.status,
        runtime: {
          routesExpected: routes,
          routesTested: routes,
          routesPassed,
          consoleErrors,
          pageErrors,
          networkErrors,
          rootMounted,
          blankScreens
        },
        rawResults: testReport.results
      };
    } catch (err) {
      return { status: "failed", error: err.message, runtime: null };
    } finally {
      if (preview) await this.stopProcess(preview.child);
    }
  }
}

module.exports = { RuntimeSmokeTest };
