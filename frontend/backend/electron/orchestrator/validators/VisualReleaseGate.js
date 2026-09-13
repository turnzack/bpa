"use strict";

const crypto = require("crypto");
let cheerio = null;
try {
  cheerio = require("cheerio");
} catch {
  // Graceful fallback si non installé localement, même si fortement recommandé
}

/**
 * Valide s'il y a des erreurs bloquantes dans les rapports.
 */
function hasBlockingIssues(issues = []) {
  return issues.some((issue) => ["critical", "high"].includes(issue.severity));
}

/**
 * Porte principale de promotion (Gate) : 
 * Ne retourne true que si toutes les preuves techniques et visuelles sont réunies.
 */
function canPromoteVisualRelease(report) {
  const issues = report.issues || [];

  const requiredChecks = [
    report.html?.status === "passed",
    report.manifests?.status === "passed",
    report.architecture?.status === "passed",
    report.entrypoints?.status === "passed",
    report.pageCoverage?.status === "passed",
    report.interactions?.status === "passed",
    report.assets?.status === "passed",
    report.tokens?.status === "passed",
    report.typecheck?.status === "passed",
    report.build?.status === "executed_passed",
    report.runtime?.status === "passed"
  ];

  const allRoutesPassed =
    (report.runtime?.routesExpected || []).every((route) =>
      (report.runtime?.routesPassed || []).includes(route)
    ) && (report.runtime?.routesExpected?.length > 0 || false);

  const visualChecks = [
    (report.visual?.requiredElementsMissing || 0) === 0,
    (report.visual?.missingSections || 0) === 0,
    (report.visual?.criticalDiffs || 0) === 0,
    (report.visual?.missingScreens || 0) === 0,
    (report.visual?.missingInteractions || 0) === 0,
    (report.visual?.missingAssets || 0) === 0
  ];

  return (
    requiredChecks.every(Boolean) &&
    visualChecks.every(Boolean) &&
    allRoutesPassed &&
    !hasBlockingIssues(issues)
  );
}

/**
 * Différenciation stricte entre couverture globale (score) et éléments vitaux.
 */
function isVisualReleaseValid(report) {
  const visual = report.visual || {};
  const criticalMissing =
    (visual.missingSectionsRequired?.length || 0) > 0 ||
    (visual.missingInteractionsRequired?.length || 0) > 0 ||
    (visual.missingAssetsRequired?.length || 0) > 0 ||
    (visual.missingRoutesRequired?.length || 0) > 0;

  return (
    !criticalMissing &&
    (visual.coverageScore || 1) >= 0.9 &&
    (visual.criticalDiffs || 0) === 0
  );
}

/**
 * Asserte la promotion, sinon lève une erreur traçable.
 */
function assertPromotionAllowed(report) {
  if (!canPromoteVisualRelease(report) || !isVisualReleaseValid(report)) {
    const error = new Error("Promotion visuelle refusée.");
    error.code = "VISUAL_RELEASE_GATE_FAILED";
    error.report = report;
    throw error;
  }
}

/**
 * Normalise un contrat pour éviter les faux-positifs liés à l'ordre.
 */
function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeContract(contract) {
  return {
    screens: unique(contract.screens).sort(),
    sections: unique(contract.sections).sort(),
    components: unique(contract.components).sort(),
    interactions: unique(contract.interactions).sort(),
    routes: unique(contract.routes).sort(),
    assets: unique(contract.assets).sort(),
    textNodes: unique(contract.textNodes).sort()
  };
}

function hashContract(contract) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(normalizeContract(contract)))
    .digest("hex");
}

function difference(expected, actual) {
  const actualSet = new Set(actual);
  return unique(expected).filter((value) => !actualSet.has(value));
}

/**
 * Extrait le contrat depuis le HTML source (Stitch).
 */
function extractVisualDomContract(html) {
  if (!cheerio) return null;
  
  const $ = cheerio.load(html, { decodeEntities: false });

  return {
    screens: $("[data-screen]").map((_, el) => $(el).attr("data-screen")).get(),
    sections: $("[data-section]").map((_, el) => $(el).attr("data-section")).get(),
    components: $("[data-component]").map((_, el) => $(el).attr("data-component")).get(),
    interactions: $("[data-interaction-id]").map((_, el) => $(el).attr("data-interaction-id")).get(),
    routes: $("[data-target]").map((_, el) => $(el).attr("data-target")).get(),
    assets: $("img[src], source[src]").map((_, el) => $(el).attr("src")).get(),
    textNodes: $("h1,h2,h3,h4,h5,h6,button,a,label")
      .map((_, el) => $(el).text().replace(/\\s+/g, " ").trim())
      .get()
      .filter(Boolean)
  };
}

/**
 * Extrait le contrat au runtime via Playwright.
 * Cette fonction est destinée à être évaluée dans le contexte du navigateur (`page.evaluate`).
 */
async function extractRuntimeVisualContract(page) {
  return page.evaluate(() => ({
    screens: [...document.querySelectorAll("[data-screen]")].map((node) => node.getAttribute("data-screen")),
    sections: [...document.querySelectorAll("[data-section]")].map((node) => node.getAttribute("data-section")),
    components: [...document.querySelectorAll("[data-component]")].map((node) => node.getAttribute("data-component")),
    interactions: [...document.querySelectorAll("[data-interaction-id]")].map((node) => node.getAttribute("data-interaction-id")),
    routes: [...document.querySelectorAll("[data-target]")].map((node) => node.getAttribute("data-target")),
    assets: [...document.querySelectorAll("img[src], source[src]")].map((node) => node.getAttribute("src")),
    textNodes: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,button,a,label")]
      .map((node) => node.textContent?.replace(/\\s+/g, " ").trim())
      .filter(Boolean)
  }));
}

/**
 * Compare le HTML source au DOM React généré.
 */
function compareVisualContracts(source, runtime) {
  const missingSections = difference(source.sections, runtime.sections);
  const missingComponents = difference(source.components, runtime.components);
  const missingInteractions = difference(source.interactions, runtime.interactions);
  const missingAssets = difference(source.assets, runtime.assets);
  const missingRoutes = difference(source.routes, runtime.routes);

  return {
    missingSections,
    missingComponents,
    missingInteractions,
    missingAssets,
    missingRoutes,
    missingText: difference(source.textNodes, runtime.textNodes),
    requiredElementsMissing: missingSections.length + missingComponents.length + missingInteractions.length,
    criticalDiffs: missingSections.length + missingInteractions.length + missingRoutes.length
  };
}

/**
 * Calcule le score de couverture entre la source et le rendu.
 */
function computeCoverage(source, runtime) {
  const expected = [
    ...(source.sections || []),
    ...(source.components || []),
    ...(source.interactions || []),
    ...(source.routes || [])
  ];

  const missing = [
    ...difference(source.sections, runtime.sections),
    ...difference(source.components, runtime.components),
    ...difference(source.interactions, runtime.interactions),
    ...difference(source.routes, runtime.routes)
  ];

  return {
    expected: expected.length,
    missing: missing.length,
    score: expected.length === 0 ? 1 : (expected.length - missing.length) / expected.length
  };
}

/**
 * Valide les manifestes Stitch avant conversion.
 */
function validateManifests({ screensManifest, interactionsManifest, assetsManifest, tokens }) {
  const issues = [];

  const screenIds = new Set((screensManifest?.screens || []).map((screen) => screen.id));

  for (const interaction of interactionsManifest?.interactions || []) {
    if (!screenIds.has(interaction.screenId)) {
      issues.push({ code: "INTERACTION_SCREEN_UNKNOWN", severity: "critical", interactionId: interaction.id });
    }
    if (interaction.kind === "navigate" && !interaction.target) {
      issues.push({ code: "INTERACTION_TARGET_MISSING", severity: "critical", interactionId: interaction.id });
    }
  }

  for (const asset of assetsManifest?.assets || []) {
    if (!asset.id || !asset.path) {
      issues.push({ code: "ASSET_MANIFEST_INVALID", severity: "critical" });
    }
  }

  if (!tokens || !tokens.colors) {
    issues.push({ code: "DESIGN_TOKENS_MISSING", severity: "critical" });
  }

  return issues;
}

module.exports = {
  hasBlockingIssues,
  canPromoteVisualRelease,
  assertPromotionAllowed,
  extractVisualDomContract,
  extractRuntimeVisualContract,
  compareVisualContracts,
  normalizeContract,
  hashContract,
  computeCoverage,
  validateManifests,
  isVisualReleaseValid
};
