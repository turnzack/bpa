"use strict";

const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const { chromium } = require("playwright");
let pixelmatch, PNG;
try {
  pixelmatch = require("pixelmatch");
  PNG = require("pngjs").PNG;
} catch (e) {
  // Ces modules peuvent ne pas être encore installés
}

function materializeRoute(route) {
  return route.replace(/:([A-Za-z0-9_]+)/g, "test-value");
}

async function stabilizePage(page) {
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `
  });

  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(document.images);

    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();

        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      })
    );
  });

  await page.waitForTimeout(100);
}

function comparePngFiles(baselinePath, actualPath, diffPath) {
  const baseline = PNG.sync.read(fsSync.readFileSync(baselinePath));
  const actual = PNG.sync.read(fsSync.readFileSync(actualPath));

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    return {
      status: "failed",
      code: "VISUAL_DIMENSIONS_MISMATCH",
      baseline: { width: baseline.width, height: baseline.height },
      actual: { width: actual.width, height: actual.height }
    };
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });

  const diffPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0.1, includeAA: false }
  );

  fsSync.mkdirSync(path.dirname(diffPath), { recursive: true });
  fsSync.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = baseline.width * baseline.height;

  return {
    status: diffPixels === 0 ? "passed" : "failed",
    diffPixels,
    diffPixelRatio: diffPixels / totalPixels,
    diffPath
  };
}

class VisualGate {
  static async run(projectId, context = {}, manifest = null) {
    if (context.skipVisual) {
      return {
        status: "blocked",
        verified: false,
        mode: "not_run",
        errors: [{ code: "VISUAL_SKIPPED" }],
        tested: []
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

    if (!pixelmatch || !PNG) {
      return {
        status: "failed",
        verified: true,
        mode: "real",
        errors: [{ code: "MISSING_DEPENDENCIES", message: "pixelmatch et pngjs doivent être installés" }]
      };
    }

    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    const baselineRoot = path.join(projectRoot, ".kirov", "visuals");
    const baselineManifestPath = path.join(baselineRoot, "manifest.json");

    let visual;
    try {
      const manifestContent = await fs.readFile(baselineManifestPath, "utf-8");
      visual = JSON.parse(manifestContent);
    } catch {
      return {
        status: "blocked",
        verified: true,
        mode: "real",
        errors: [{ code: "VISUAL_BASELINE_REQUIRED" }]
      };
    }

    if (!visual.viewports || !visual.routes) {
      return {
        status: "blocked",
        verified: true,
        mode: "real",
        errors: [{ code: "VISUAL_MANIFEST_INVALID", message: "Le manifeste visuel doit définir viewports et routes" }]
      };
    }

    const reportVisualRoot = path.join(projectRoot, ".kirov", "reports", "visual");

    const browser = await chromium.launch({ headless: true });
    const errors = [];
    const tested = [];

    try {
      for (const viewport of visual.viewports) {
        const page = await browser.newPage({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: viewport.deviceScaleFactor || 1
        });

        for (const route of visual.routes) {
          const concreteRoute = materializeRoute(route);

          const response = await page.goto(`${context.runtime.url}${concreteRoute}`, {
            waitUntil: "networkidle",
            timeout: 30000
          });

          if (!response || response.status() >= 400) {
            errors.push({
              code: "VISUAL_ROUTE_FAILED",
              route: concreteRoute,
              status: response?.status() || 0
            });
            continue;
          }

          await stabilizePage(page);

          const routeName = route === "/" ? "home" : route.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
          const screenshotName = `${viewport.id}/${routeName}.png`;
          const actualPath = path.join(reportVisualRoot, "actual", screenshotName);
          const diffPath = path.join(reportVisualRoot, "diff", screenshotName);
          const baselinePath = path.join(baselineRoot, screenshotName);

          await fs.mkdir(path.dirname(actualPath), { recursive: true });

          await page.screenshot({
            path: actualPath,
            fullPage: true,
            animations: "disabled",
            caret: "hide"
          });

          // Vérifier si le baseline de cette image existe
          try {
            await fs.access(baselinePath);
          } catch {
            errors.push({ code: "VISUAL_BASELINE_REQUIRED", route: concreteRoute, viewport: viewport.id });
            continue;
          }

          // Comparaison
          const result = comparePngFiles(baselinePath, actualPath, diffPath);
          if (result.status === "failed") {
            const maxRatio = manifest?.visual?.threshold?.maxDiffPixelRatio || 0;
            if (result.diffPixelRatio === undefined || result.diffPixelRatio > maxRatio) {
              errors.push({
                code: result.code || "VISUAL_MISMATCH",
                route: concreteRoute,
                viewport: viewport.id,
                diffPixels: result.diffPixels,
                diffPixelRatio: result.diffPixelRatio,
                diffPath: result.diffPath
              });
            }
          }

          tested.push({
            viewport: viewport.id,
            route: concreteRoute,
            actual: actualPath,
            diff: result.status === "failed" ? result.diffPath : null
          });
        }
        await page.close();
      }
    } finally {
      await browser.close();
    }

    return {
      status: errors.length === 0 ? "passed" : "failed",
      verified: true,
      mode: "real",
      tested,
      errors
    };
  }
}

module.exports = VisualGate;
