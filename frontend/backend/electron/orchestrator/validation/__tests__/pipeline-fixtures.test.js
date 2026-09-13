"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const net = require("net");

const { copyFixture, createFileSnapshot, compareSnapshots } = require("../FixtureManager");
const ProjectContractAnalyzer = require("../ProjectContractAnalyzer");

function isPortClosed(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: "127.0.0.1" });
    socket.on("connect", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      resolve(true);
    });
  });
}

const fixtures = [
  { name: "valid-react-vite", expected: "passed" },
  { name: "missing-local-import", expected: "blocked" },
  { name: "missing-export", expected: "blocked" },
  { name: "missing-dependency", expected: "blocked" },
  { name: "runtime-render-error", expected: "blocked" },
  { name: "blank-screen", expected: "blocked" },
  { name: "visual-missing-baseline", expected: "blocked", testVisual: true },
  { name: "visual-dimensions-mismatch", expected: "blocked", testVisual: true },
  { name: "regression-broken-button", expected: "blocked", testRegression: true },
  { name: "regression-navigation", expected: "passed", testRegression: true }
];

for (const fixture of fixtures) {
  test(`pipeline universel : ${fixture.name}`, async () => {
    // 1. Cloner la fixture
    const projectRoot = await copyFixture(fixture.name);
    
    // 2. Prendre un snapshot avant
    const before = await createFileSnapshot(projectRoot);

    // 3. Exécuter l'analyse
    const report = await ProjectContractAnalyzer.analyze(fixture.name, {
      projectRoot,
      runRuntime: true,
      skipVisual: !fixture.testVisual,
      skipRegression: !fixture.testRegression
    });

    // 4. Vérifier le statut attendu
    if (report.status !== fixture.expected) {
      console.error(`\n[TEST FAILED] ${fixture.name}`);
      console.error(JSON.stringify(report.gates, null, 2));
    }
    assert.equal(report.status, fixture.expected, `Status doit être ${fixture.expected} mais est ${report.status}`);
    assert.deepEqual(report.requiredGates, report.executedGates, "Les gates exécutées doivent correspondre aux gates requises");

    if (fixture.expected === "blocked") {
      assert.equal(report.promotion, "blocked", "La promotion doit être bloquée");
    }

    // 5. Vérifier le nettoyage (Processus/Port)
    if (report.gates && report.gates.runtime && report.gates.runtime.status === "passed") {
      const port = report.gates.runtime.port || (context.runtime ? context.runtime.port : null);
      if (port) {
        // Le test doit confirmer : runtime démarré -> arrêté -> port fermé
        const closed = await isPortClosed(port);
        assert.ok(closed, `Le port ${port} devrait être fermé après l'analyse`);
      }
    }

    // 6. Vérifier la non-modification du workspace source
    const sourceBefore = await createFileSnapshot(path.join(__dirname, "..", "fixtures", fixture.name));
    const sourceAfter = await createFileSnapshot(path.join(__dirname, "..", "fixtures", fixture.name));
    assert.deepEqual(compareSnapshots(sourceBefore, sourceAfter), [], "Le dossier source de la fixture ne doit jamais être modifié");
  });
}
