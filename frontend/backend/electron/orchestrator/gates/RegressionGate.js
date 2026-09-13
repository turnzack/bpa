"use strict";

const { chromium } = require("playwright");
const fs = require("fs/promises");
const path = require("path");

function materializeRoute(route) {
  return route.replace(/:([A-Za-z0-9_]+)/g, "test-value");
}

async function resolveLocator(page, target) {
  if (target.role) {
    return page.getByRole(target.role, target.name ? { name: target.name } : undefined);
  }

  if (target.label) {
    return page.getByLabel(target.label);
  }

  if (target.testId) {
    return page.getByTestId(target.testId);
  }

  if (target.text) {
    return page.getByText(target.text, { exact: true });
  }

  if (target.css) {
    return page.locator(target.css);
  }

  throw new Error("Sélecteur de régression invalide.");
}

async function runStep({ page, step, baseUrl }) {
  switch (step.action) {
    case "goto": {
      const route = materializeRoute(step.route || "/");
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      return;
    }

    case "click": {
      const locator = await resolveLocator(page, step.target);
      await locator.click();
      return;
    }

    case "fill": {
      const locator = await resolveLocator(page, step.target);
      await locator.fill(String(step.value ?? ""));
      return;
    }

    case "check": {
      const locator = await resolveLocator(page, step.target);
      await locator.check();
      return;
    }

    case "select": {
      const locator = await resolveLocator(page, step.target);
      await locator.selectOption(String(step.value));
      return;
    }

    case "expect-visible": {
      const locator = await resolveLocator(page, step.target);
      await locator.waitFor({ state: "visible", timeout: 10000 });
      return;
    }

    case "expect-hidden": {
      const locator = await resolveLocator(page, step.target);
      await locator.waitFor({ state: "hidden", timeout: 10000 });
      return;
    }

    case "expect-text": {
      const locator = await resolveLocator(page, step.target);
      const text = await locator.innerText();
      if (text !== String(step.value)) {
        throw new Error(`Texte inattendu : ${text}`);
      }
      return;
    }

    case "expect-url": {
      const expected = materializeRoute(step.value);
      await page.waitForURL(`**${expected}`, { timeout: 10000 });
      return;
    }

    case "expect-value": {
      const locator = await resolveLocator(page, step.target);
      const value = await locator.inputValue();
      if (value !== String(step.value)) {
        throw new Error(`Valeur inattendue : ${value}`);
      }
      return;
    }

    default:
      throw new Error(`Action inconnue : ${step.action}`);
  }
}

const VALID_ACTIONS = new Set([
  "goto",
  "click",
  "fill",
  "check",
  "select",
  "expect-visible",
  "expect-hidden",
  "expect-text",
  "expect-url",
  "expect-value"
]);

function validateWorkflow(workflow) {
  if (!workflow.id || !workflow.startRoute || !Array.isArray(workflow.steps)) {
    throw new Error("Workflow de régression invalide.");
  }

  for (const step of workflow.steps) {
    if (!VALID_ACTIONS.has(step.action)) {
      throw Object.assign(new Error(`Action interdite : ${step.action}`), { code: "REGRESSION_ACTION_FORBIDDEN" });
    }

    if (
      ["click", "fill", "check", "select", "expect-visible", "expect-hidden", "expect-text"].includes(step.action) &&
      !step.target
    ) {
      throw Object.assign(new Error(`Target manquante : ${step.action}`), { code: "REGRESSION_TARGET_REQUIRED" });
    }
  }

  return true;
}

class RegressionGate {
  static async run(projectId, context = {}, manifest = null) {
    if (context.skipRegression) {
      return {
        status: "blocked",
        verified: false,
        mode: "not_run",
        errors: [{ code: "REGRESSION_SKIPPED" }],
        results: []
      };
    }

    if (!context.runtime?.url) {
      return {
        status: "blocked",
        verified: false,
        mode: "real",
        errors: [{ code: "NO_RUNTIME_URL" }]
      };
    }

    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    const regressionManifestPath = path.join(projectRoot, ".kirov", "regression", "manifest.json");
    
    let regressionManifest;
    try {
      const manifestContent = await fs.readFile(regressionManifestPath, "utf-8");
      regressionManifest = JSON.parse(manifestContent);
    } catch {
      return {
        status: "blocked",
        verified: true,
        mode: "real",
        errors: [{ code: "REGRESSION_MANIFEST_REQUIRED" }]
      };
    }

    const workflows = regressionManifest.workflows || [];
    if (workflows.length === 0) {
      return {
        status: "blocked",
        verified: true,
        mode: "real",
        errors: [{ code: "REGRESSION_MANIFEST_REQUIRED", message: "Workflows vides" }]
      };
    }

    for (const workflow of workflows) {
      try {
        validateWorkflow(workflow);
      } catch (e) {
        return {
          status: "blocked",
          verified: true,
          mode: "real",
          errors: [{ code: e.code || "INVALID_WORKFLOW", message: e.message }]
        };
      }
    }

    const browser = await chromium.launch({ headless: true });
    const results = [];
    const errors = [];

    try {
      for (const workflow of workflows) {
        const page = await browser.newPage();
        const workflowErrors = [];

        page.on("pageerror", (error) => {
          workflowErrors.push({ code: "PAGE_ERROR", message: error.message });
        });

        page.on("console", (message) => {
          if (message.type() === "error") {
            workflowErrors.push({ code: "CONSOLE_ERROR", message: message.text() });
          }
        });

        try {
          await page.goto(`${context.runtime.url}${materializeRoute(workflow.startRoute)}`, {
            waitUntil: "networkidle",
            timeout: 30000
          });

          for (const step of workflow.steps) {
            await runStep({ page, step, baseUrl: context.runtime.url });
          }

          results.push({
            id: workflow.id,
            status: workflowErrors.length === 0 ? "passed" : "failed",
            errors: workflowErrors
          });

          errors.push(...workflowErrors.map((error) => ({ workflow: workflow.id, ...error })));
        } catch (error) {
          results.push({
            id: workflow.id,
            status: "failed",
            errors: [{ code: "REGRESSION_WORKFLOW_FAILED", message: error.message }]
          });

          errors.push({ workflow: workflow.id, code: "REGRESSION_WORKFLOW_FAILED", message: error.message });
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }

    return {
      status: errors.length === 0 ? "passed" : "failed",
      verified: true,
      mode: "real",
      results,
      errors
    };
  }
}

module.exports = RegressionGate;
