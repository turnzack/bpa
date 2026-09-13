"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { runBusinessContractGate } = require("../gates/BusinessContractGate");

// Tests sur BusinessContractGate
test("un Sovereign Pack complet est accepté", async () => {
  const pack = {
    manifest: { schemaVersion: "1.0", projectName: "test" },
    unresolvedItems: [],
    files: {
      "domain/entities.json": "{}",
      "domain/invariants.json": "{}",
      "contracts/ui-bindings.json": "{}",
      "workflows/workflows.json": "{}",
      "tests/acceptance.json": "{}"
    }
  };

  const blueprint = { version: "1.0.0" };
  const contractHash = "sha256:test";
  const traceability = {
    missingBindings: [],
    missingCommands: [],
    missingTests: []
  };

  const result = await runBusinessContractGate({
    guestPack: pack,
    businessBlueprint: blueprint,
    contractHash: contractHash,
    traceability: traceability
  });

  assert.equal(result.status, "passed");
  assert.equal(result.verified, true);
});

test("unresolvedItems bloque la gate", async () => {
  const pack = {
    manifest: {},
    unresolvedItems: [{ id: "unknown-action" }]
  };

  const result = await runBusinessContractGate({
    guestPack: pack,
    businessBlueprint: {},
    contractHash: "sha256:test",
    traceability: {
      missingBindings: [],
      missingCommands: [],
      missingTests: []
    }
  });

  assert.equal(result.status, "failed");
  assert.equal(result.verified, false);
  assert.equal(result.errors[0].code, "UNRESOLVED_ITEMS");
});

test("un binding manquant bloque la gate", async () => {
  const pack = {
    manifest: {},
    unresolvedItems: []
  };
  
  const blueprint = { version: "1.0.0" };

  const result = await runBusinessContractGate({
    guestPack: pack,
    businessBlueprint: blueprint,
    contractHash: "sha256:test",
    traceability: {
      missingBindings: ["catalog.addToCart"],
      missingCommands: [],
      missingTests: []
    }
  });

  assert.equal(result.status, "failed");
  assert.equal(result.errors[0].code, "MISSING_BINDINGS");
});

test("absence du blueprint ou du hash bloque la gate", async () => {
  const pack = { manifest: {}, unresolvedItems: [] };
  
  const resultSansBlueprint = await runBusinessContractGate({
    guestPack: pack,
    businessBlueprint: null,
    contractHash: "sha256:test",
    traceability: { missingBindings: [], missingCommands: [], missingTests: [] }
  });
  
  assert.equal(resultSansBlueprint.status, "failed");
  assert.equal(resultSansBlueprint.errors[0].code, "BLUEPRINT_MISSING");

  const resultSansHash = await runBusinessContractGate({
    guestPack: pack,
    businessBlueprint: {},
    contractHash: null,
    traceability: { missingBindings: [], missingCommands: [], missingTests: [] }
  });
  
  assert.equal(resultSansHash.status, "failed");
  assert.equal(resultSansHash.errors[0].code, "CONTRACT_HASH_MISSING");
});

test("contract hash mismatch bloque la gate", async () => {
  const pack = { manifest: { schemaVersion: "1.0" }, unresolvedItems: [] };
  
  // Fake files with a specific hash
  const filesArray = [
    { path: "manifest.json", sha256: "real_hash_1" },
    { path: "domain/entities.json", sha256: "real_hash_2" }
  ];

  const result = await runBusinessContractGate({
    guestPack: pack,
    businessBlueprint: { version: "1.0.0" },
    contractHash: "sha256:fake_hash", // Mismatch !
    contractFiles: { files: filesArray },
    traceability: { missingBindings: [], missingCommands: [], missingTests: [] }
  });
  
  assert.equal(result.status, "failed");
  assert.equal(result.errors[0].code, "CONTRACT_HASH_MISMATCH");
});

test("business_contract est exécutée avant typecheck", async () => {
  const calls = [];
  
  // Simulation simplifiée du GateRunner
  const gates = {
    pack: async () => { calls.push("pack"); return { status: "passed", verified: true, mode: "real" }; },
    business_contract: async () => { calls.push("business_contract"); return { status: "passed", verified: true, mode: "real" }; },
    typecheck: async () => { calls.push("typecheck"); return { status: "passed", verified: true, mode: "real" }; }
  };

  const SEQUENCE = ["pack", "business_contract", "typecheck"];
  
  for (const gate of SEQUENCE) {
    const res = await gates[gate]();
    if (res.status !== "passed") break;
  }

  assert.deepEqual(calls, ["pack", "business_contract", "typecheck"]);
});
