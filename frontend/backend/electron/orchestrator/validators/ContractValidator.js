"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function assertValidationDependencies() {
  try {
    require("ajv");
    require("ajv-formats");
  } catch (error) {
    throw Object.assign(
      new Error("Dépendances AJV obligatoires absentes."),
      { code: "VALIDATION_DEPENDENCIES_MISSING", cause: error.message }
    );
  }
}

class ContractValidator {
  constructor(schemaDir) {
    assertValidationDependencies();
    
    const Ajv = require("ajv/dist/2020");
    const addFormats = require("ajv-formats");
    
    this.ajv = new Ajv({
      allErrors: true,
      strict: false // Relaxed strict mode to allow generic schema validation at first
    });

    addFormats(this.ajv);

    this.schemaDir = schemaDir;
    this.validators = new Map();
  }

  load(name, filename) {
    const schemaPath = path.join(this.schemaDir, filename);
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schéma introuvable : ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const validate = this.ajv.compile(schema);
    this.validators.set(name, validate);

    return validate;
  }

  getLoadedSchemas() {
    return [...this.validators.keys()];
  }

  validate(name, data) {

    const validate = this.validators.get(name);
    if (!validate) {
      throw new Error(`Schéma non chargé : ${name}`);
    }

    const valid = validate(data);
    if (!valid) {
      const error = new Error(`Contrat JSON invalide : ${name}`);
      error.code = "CONTRACT_SCHEMA_INVALID";
      error.schema = name;
      error.details = validate.errors;
      throw error;
    }

    return true;
  }
}

/**
 * Assure que l'implémentation correspond exactement aux contrats générés lors de la Phase 2.
 */
function assertContractHashes({ expected, received }) {
  const keys = ["domain", "state", "api"];

  for (const key of keys) {
    if (expected[key] !== received[key]) {
      const error = new Error(`Hash de contrat incohérent : ${key}`);
      error.code = "CONTRACT_HASH_MISMATCH";
      error.contract = key;
      error.expected = expected[key];
      error.received = received[key];
      throw error;
    }
  }
}

/**
 * Valide les références croisées métier pour s'assurer de la cohérence interne.
 */
function validateDomainReferences({ domain, state, api }) {
  const issues = [];

  const entities = new Set((domain?.entities || []).map((entity) => entity.id));
  const workflows = new Set((state?.stateMachines || []).map((machine) => machine.id));

  for (const store of state?.clientStores || []) {
    if (store.entityId && !entities.has(store.entityId)) {
      issues.push({ code: "UNKNOWN_STORE_ENTITY", severity: "critical", storeId: store.id });
    }
  }

  for (const endpoint of api?.endpoints || []) {
    if (endpoint.workflowId && !workflows.has(endpoint.workflowId)) {
      issues.push({ code: "UNKNOWN_ENDPOINT_WORKFLOW", severity: "critical", endpointId: endpoint.id });
    }
  }

  return issues;
}

/**
 * Porte vérifiant si la Phase d'Intégration (génération Vite/React) peut démarrer.
 */
function canStartIntegration({ domain, state, api, hashes }) {
  if (
    domain?.status !== "complete" ||
    state?.status !== "complete" ||
    api?.status !== "complete"
  ) {
    return false;
  }

  assertContractHashes({ expected: hashes.expected, received: hashes.received });

  const issues = validateDomainReferences({ domain, state, api });

  return !issues.some((issue) => ["critical", "high"].includes(issue.severity));
}

/**
 * Vérifie que les capacités déclarées correspondent réellement au projet.
 */
function validateCapabilities({ blueprint = {}, apiContract = {} }) {
  const capabilities = blueprint.testCapabilities || {};
  const hasApi = (apiContract.endpoints || []).length > 0;

  if (capabilities.api === true && !hasApi) {
    const error = new Error("Le Blueprint déclare une API mais aucun endpoint n'est défini.");
    error.code = "CAPABILITY_CONTRACT_MISMATCH";
    throw error;
  }

  return true;
}

/**
 * Vérifie que les capacités de tests obligatoires sont validées selon la politique du projet.
 */
function validateRequiredTestCapabilities(report, capabilities = {}) {
  if (capabilities.api && report.apiTests?.status !== "passed" && report.apiTests?.status !== "not_applicable") return false;
  if (capabilities.auth && report.authorizationTests?.status !== "passed" && report.authorizationTests?.status !== "not_applicable") return false;
  if (capabilities.idempotency && report.idempotencyTests?.status !== "passed" && report.idempotencyTests?.status !== "not_applicable") return false;
  if (capabilities.workflows && report.workflowTests?.status !== "passed" && report.workflowTests?.status !== "not_applicable") return false;
  
  return true;
}

function assertWorkflowEvidence(suite) {
  if (suite && (!suite.results || suite.results.length === 0)) {
    throw Object.assign(
      new Error("Rapport workflow sans résultats exécutés. Preuves manquantes."),
      { code: "WORKFLOW_EVIDENCE_MISSING" }
    );
  }
}

function validateWorkflowReport(report, capabilities = {}) {
  const requiredSuites = [];

  if (capabilities.workflows) requiredSuites.push(report.workflowTests);
  if (capabilities.idempotency) requiredSuites.push(report.idempotencyTests);
  if (capabilities.authorization) requiredSuites.push(report.authorizationTests);
  if (capabilities.massAssignment) requiredSuites.push(report.massAssignmentTests);
  if (capabilities.concurrency) requiredSuites.push(report.concurrencyTests);

  return requiredSuites.every((suite) => {
    if (!suite) return false;
    assertWorkflowEvidence(suite);
    return suite.status === "passed" && suite.failed === 0 && suite.blocked === 0;
  });
}

/**
 * Porte Platine : Validation absolue finale
 */
function canPromotePlatinum(report, capabilities = {}) {
  const blockingIssues = report.issues?.filter((issue) => ["critical", "high"].includes(issue.severity)) || [];

  const contractsValid =
    report.contracts?.domain === "verified" &&
    report.contracts?.state === "verified" &&
    report.contracts?.api === "verified" &&
    report.contracts?.visual === "verified";

  const routesValid = (report.runtime?.routesExpected || []).every((route) =>
    (report.runtime?.routesPassed || []).includes(route)
  ) && (report.runtime?.routesExpected?.length > 0 || false);

  const visualValid =
    (report.runtime?.visual?.requiredElementsMissing || 0) === 0 &&
    (report.runtime?.visual?.criticalDiffs || 0) === 0;

  const testCapabilitiesValid = validateRequiredTestCapabilities(report, capabilities);
  const workflowValid = validateWorkflowReport(report, capabilities);

  return (
    contractsValid &&
    report.typecheck?.status === "passed" &&
    report.build?.status === "executed_passed" &&
    report.runtime?.status === "passed" &&
    routesValid &&
    visualValid &&
    testCapabilitiesValid &&
    workflowValid &&
    blockingIssues.length === 0
  );
}

/**
 * Calcule le hash de toute la collection de schémas.
 */
function hashSchemaCollection(schemaDir) {
  const files = fs.readdirSync(schemaDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  const content = files.map((file) => ({
    file,
    content: fs.readFileSync(path.join(schemaDir, file), "utf8")
  }));

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(content))
    .digest("hex");
}

module.exports = {
  ContractValidator,
  assertValidationDependencies,
  assertContractHashes,
  validateDomainReferences,
  canStartIntegration,
  validateCapabilities,
  validateRequiredTestCapabilities,
  validateWorkflowReport,
  canPromotePlatinum,
  hashSchemaCollection
};
