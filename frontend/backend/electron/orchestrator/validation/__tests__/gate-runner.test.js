"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const GateRunner = require("../../gates/GateRunner");

test("une gate échouée bloque les gates suivantes", async () => {
  const report = {
    errors: [],
    addError(id, errors) {
      this.errors.push({ id, errors });
    }
  };

  const fakeGates = [
    {
      id: "localImports",
      run: async () => ({
        status: "failed",
        verified: true,
        mode: "real",
        errors: [{ code: "MISSING_LOCAL_IMPORT" }]
      })
    },
    {
      id: "exports",
      run: async () => ({
        status: "passed",
        verified: true,
        mode: "real",
        errors: []
      })
    }
  ];

  const result = await GateRunner.run("gate-failure", report, {}, null, fakeGates);

  const exportsGate = result.required.find((gate) => gate.id === "exports");
  assert.equal(exportsGate.status, "blocked");
  assert.equal(result.status, "failed");
});

test("une gate unimplemented ne peut pas valider le projet", async () => {
  const result = await GateRunner.run(
    "gate-unimplemented",
    null,
    {},
    null,
    [
      {
        id: "localImports",
        run: async () => ({
          status: "unimplemented",
          verified: false,
          mode: "unimplemented",
          errors: [{ code: "GATE_NOT_IMPLEMENTED" }]
        })
      }
    ]
  );

  assert.equal(result.status, "failed");
});
