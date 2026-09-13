"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");

function assertPlaywrightAvailable() {
  try {
    require("playwright");
  } catch (error) {
    throw Object.assign(
      new Error("Playwright est obligatoire pour le RuntimeSmokeTest Gold+."),
      { code: "PLAYWRIGHT_MISSING" }
    );
  }
}

async function assertChromiumAvailable() {
  const { chromium } = require("playwright");

  return chromium
    .launch({ headless: true })
    .then((browser) => browser.close())
    .catch((error) => {
      throw Object.assign(
        new Error("Chromium indisponible pour Playwright."),
        {
          code: "PLAYWRIGHT_BROWSER_MISSING",
          cause: error.message
        }
      );
    });
}

class RuntimeSmokeTest {
  constructor({
    baseUrl,
    reportDir,
    routes,
    sourceContracts = {},
    runtimeTimeoutMs = 30000
  }) {
    assertPlaywrightAvailable();
    
    this.baseUrl = baseUrl;
    this.reportDir = reportDir;
    this.routes = routes;
    this.sourceContracts = sourceContracts;
    this.runtimeTimeoutMs = runtimeTimeoutMs;
  }

  async run() {
    const { chromium } = require("playwright");

    await fs.mkdir(this.reportDir, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const results = [];

    try {
      for (const route of this.routes) {
        const result = await this.testRoute(browser, route);
        results.push(result);
      }
    } finally {
      await browser.close();
    }

    const report = {
      status: results.every((result) => result.status === "passed") ? "passed" : "failed",
      routesExpected: this.routes,
      routesTested: results.map((result) => result.route),
      routesPassed: results.filter((result) => result.status === "passed").map((result) => result.route),
      routesFailed: results.filter((result) => result.status === "failed").map((result) => result.route),
      consoleErrors: results.flatMap((result) => result.consoleErrors),
      pageErrors: results.flatMap((result) => result.pageErrors),
      networkErrors: results.flatMap((result) => result.networkErrors),
      results
    };

    await this.writeJson("runtime-report.json", report);
    return report;
  }

  async testRoute(browser, route) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1024 },
      colorScheme: "dark",
      locale: "fr-FR",
      timezoneId: "Europe/Paris"
    });

    const page = await context.newPage();

    const consoleErrors = [];
    const pageErrors = [];
    const networkErrors = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        networkErrors.push({ status: response.status(), url: response.url() });
      }
    });

    const tracePath = path.join(this.reportDir, `${this.routeName(route)}.trace.zip`);

    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    try {
      const response = await page.goto(`${this.baseUrl}${route}`, {
        waitUntil: "networkidle",
        timeout: this.runtimeTimeoutMs
      });

      await page.waitForTimeout(300);

      const rootMounted = await page.locator("#root").count() > 0;
      const visibleText = await page.locator("body").innerText();
      const errorBoundaryVisible = await page.locator("[data-kirov-error-boundary='true']").count() > 0;

      const visual = await this.validateVisualContract(page, route);

      const passed =
        response?.ok() &&
        rootMounted &&
        visibleText.trim().length > 0 &&
        !errorBoundaryVisible &&
        consoleErrors.length === 0 &&
        pageErrors.length === 0 &&
        networkErrors.length === 0 &&
        visual.status === "passed";

      await page.screenshot({
        path: path.join(this.reportDir, `${this.routeName(route)}-desktop.png`),
        fullPage: true
      });

      // Ajout du test Mobile Responsive
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(100);
      await page.screenshot({
        path: path.join(this.reportDir, `${this.routeName(route)}-mobile.png`),
        fullPage: true
      });

      return {
        route,
        status: passed ? "passed" : "failed",
        httpStatus: response?.status() || 0,
        rootMounted,
        hasVisibleContent: visibleText.trim().length > 0,
        errorBoundaryVisible,
        consoleErrors,
        pageErrors,
        networkErrors,
        visual
      };
    } catch (error) {
      await this.writeJson(`${this.routeName(route)}-exception.json`, {
        route,
        message: error.message,
        stack: error.stack
      });

      return {
        route,
        status: "failed",
        httpStatus: 0,
        rootMounted: false,
        hasVisibleContent: false,
        errorBoundaryVisible: false,
        consoleErrors,
        pageErrors: [...pageErrors, error.message],
        networkErrors,
        visual: { status: "failed", error: error.message }
      };
    } finally {
      await context.tracing.stop({ path: tracePath });
      await context.close();
    }
  }

  async validateVisualContract(page, route) {
    const expected = this.sourceContracts[route];

    if (!expected) {
      return { status: "failed", code: "SOURCE_CONTRACT_MISSING" };
    }

    const actual = await page.evaluate(() => ({
      screens: [...document.querySelectorAll("[data-screen]")].map((node) => node.getAttribute("data-screen")),
      sections: [...document.querySelectorAll("[data-section]")].map((node) => node.getAttribute("data-section")),
      components: [...document.querySelectorAll("[data-component]")].map((node) => node.getAttribute("data-component")),
      interactions: [...document.querySelectorAll("[data-interaction-id]")].map((node) => node.getAttribute("data-interaction-id")),
      assets: [...document.querySelectorAll("img[data-asset-id], [data-asset-id]")].map((node) => node.getAttribute("data-asset-id"))
    }));

    const missingSections = this.diff(expected.sections || [], actual.sections);
    const missingComponents = this.diff(expected.components || [], actual.components);
    const missingInteractions = this.diff(expected.interactions || [], actual.interactions);
    const missingAssets = this.diff(expected.assets || [], actual.assets);

    const criticalDiffs = missingSections.length + missingInteractions.length + missingAssets.length;

    return {
      status: criticalDiffs === 0 ? "passed" : "failed",
      coverage: this.coverage(expected, actual),
      missingSectionsRequired: missingSections,
      missingInteractionsRequired: missingInteractions,
      missingAssetsRequired: missingAssets,
      missingRoutesRequired: [], // Simplified for this check
      missingSections,
      missingComponents,
      missingInteractions,
      missingAssets,
      criticalDiffs,
      expected: expected,
      actual
    };
  }

  diff(expected, actual) {
    const actualSet = new Set(actual);
    return [...new Set(expected)].filter((value) => !actualSet.has(value));
  }

  coverage(expected, actual) {
    const expectedCount =
      (expected.sections || []).length +
      (expected.components || []).length +
      (expected.interactions || []).length +
      (expected.assets || []).length;

    const missingCount =
      this.diff(expected.sections || [], actual.sections).length +
      this.diff(expected.components || [], actual.components).length +
      this.diff(expected.interactions || [], actual.interactions).length +
      this.diff(expected.assets || [], actual.assets).length;

    return expectedCount === 0 ? 1 : (expectedCount - missingCount) / expectedCount;
  }

  routeName(route) {
    return route.replace(/^\/+/, "").replace(/[^a-zA-Z0-9_-]+/g, "_") || "home";
  }

  async writeJson(filename, data) {
    await fs.writeFile(path.join(this.reportDir, filename), JSON.stringify(data, null, 2), "utf8");
  }
}

module.exports = {
  RuntimeSmokeTest,
  assertPlaywrightAvailable,
  assertChromiumAvailable
};
