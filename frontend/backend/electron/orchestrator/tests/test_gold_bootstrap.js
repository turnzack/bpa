const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const { ContractValidator } = require("../validators/ContractValidator");
const { assertChromiumAvailable } = require("../runtime/RuntimeSmokeTest");

const requiredSchemas = [
  "phase2-domain.schema.json",
  "phase2-state.schema.json",
  "phase2-api.schema.json",
  "integration-response.schema.json",
  "screens-manifest.schema.json",
  "interactions-manifest.schema.json",
  "assets-manifest.schema.json",
  "design-tokens.schema.json",
  "visual-conversion.schema.json",
  "runtime-report.schema.json"
];

async function run() {
  let failed = 0;
  const schemaDir = path.join(__dirname, "..", "schemas");

  console.log("Démarrage du bootstrap Gold...");

  // 1. Dépendances et Navigateur
  try {
    const validatorCheck = new ContractValidator(schemaDir);
    console.log("Dependencies (AJV): passed");
  } catch (e) {
    console.error("Dependencies: failed", e.message);
    failed++;
  }

  try {
    await assertChromiumAvailable();
    console.log("Chromium: passed");
  } catch (e) {
    console.error("Chromium: failed", e.message);
    failed++;
  }

  // 2. Schémas
  const missing = requiredSchemas.filter(
    (file) => !fs.existsSync(path.join(schemaDir, file))
  );
  if (missing.length === 0) {
    console.log("Schemas: 10/10");
  } else {
    console.error(`Schemas: failed (manquants: ${missing.join(", ")})`);
    failed++;
  }

  const validator = new ContractValidator(schemaDir);
  requiredSchemas.forEach(schema => {
    validator.load(schema.replace(".schema.json", ""), schema);
  });

  const loaded = validator.getLoadedSchemas();
  if (loaded.length === 10) {
    console.log("Validateurs chargés: 10/10");
  } else {
    console.error(`Validateurs chargés: failed (${loaded.length}/10)`);
    failed++;
  }

  // 3. Tests de schémas positifs/négatifs
  const validDomain = {
    policyVersion: "gold-5.0.0",
    phase: "domain-contracts",
    projectId: "demo",
    domainContract: {
        entities: [], valueObjects: [], businessRules: [], permissions: []
    },
    stateContract: {
        clientStores: [], serverState: [], stateMachines: [], invariants: []
    },
    apiContract: {
        endpoints: [], schemas: [], authorization: [], idempotency: [], errors: []
    },
    dependenciesRequested: [], testsRequired: [], decisions: [], warnings: [], status: "complete"
  };

  try {
    validator.validate("phase2-domain", validDomain);
    console.log("Valid contract: passed");
  } catch (e) {
    console.error("Valid contract: failed", e.message);
    failed++;
  }

  try {
    validator.validate("phase2-domain", { phase: "domain-contracts" });
    console.error("Invalid contract: failed (aurait dû rejeter)");
    failed++;
  } catch (e) {
    if (e.code === "CONTRACT_SCHEMA_INVALID") console.log("Invalid contract: rejected (passed)");
    else { console.error("Invalid contract: bad error", e.message); failed++; }
  }

  try {
    validator.validate("phase2-domain", { ...validDomain, policyVersion: "gold-1.0.0" });
    console.error("Wrong version: failed (aurait dû rejeter)");
    failed++;
  } catch (e) {
    if (e.code === "CONTRACT_SCHEMA_INVALID") console.log("Wrong version: rejected (passed)");
    else { console.error("Wrong version: bad error", e.message); failed++; }
  }

  try {
    validator.validate("phase2-domain", { ...validDomain, hallucinated: true });
    console.error("Unknown property: failed (aurait dû rejeter)");
    failed++;
  } catch (e) {
    if (e.code === "CONTRACT_SCHEMA_INVALID") console.log("Unknown property: rejected (passed)");
    else { console.error("Unknown property: bad error", e.message); failed++; }
  }

  if (failed > 0) {
    console.error(`\nGold contract bootstrap: FAILED (${failed} erreurs)`);
    process.exitCode = 1;
  } else {
    console.log("\nGold contract bootstrap: passed");
  }
}

run();
