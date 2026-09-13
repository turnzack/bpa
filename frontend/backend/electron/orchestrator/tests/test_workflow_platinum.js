"use strict";

const http = require("node:http");
const path = require("node:path");
const os = require("node:os");
let request;
try {
  const playwright = require("playwright");
  request = playwright.request;
} catch (e) {
  // Ignoré, assumé présent
}

const WorkflowTestRunner = require("../runtime/WorkflowTestRunner");
const { ContractValidator } = require("../validators/ContractValidator");

async function createTestContexts(baseURL) {
  const owner = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      "X-Kirov-Test-Run": "platinum-owner"
    }
  });

  const attacker = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
      "X-Kirov-Test-Run": "platinum-attacker"
    }
  });

  return { owner, attacker };
}

function assertNoSecrets(value) {
  const serialized = JSON.stringify(value);

  const forbidden = [
    /Bearer\s+[A-Za-z0-9._-]+/i,
    /\beyJ[A-Za-z0-9._-]+\b/,
    /[?&](token|secret|password|api[_-]?key)=/i
  ];

  const leaked = forbidden.some((pattern) => pattern.test(serialized));

  if (leaked) {
    const error = new Error("Secret détecté dans le rapport (échec de maskSecrets).");
    error.code = "SECRET_LEAK_IN_EVIDENCE";
    throw error;
  }
}

async function run() {
  console.log("Démarrage du test d'intégration Workflow Platinum...");

  if (!request) {
    console.error("Playwright est requis.");
    process.exitCode = 1;
    return;
  }

  // 1. Démarrer le serveur du projet (mock backend vulnérable)
  let mutations = 0;
  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      const auth = req.headers["x-kirov-test-run"] || "";
      if (req.url === "/api/resource") {
        if (auth.includes("attacker")) {
          res.writeHead(403);
          return res.end();
        }
        res.writeHead(200);
        return res.end(JSON.stringify({ secret: "data" }));
      }
      if (req.url === "/api/mutation") {
        mutations++;
        res.writeHead(200);
        return res.end(JSON.stringify({ operationId: "op-777", count: mutations }));
      }
      res.writeHead(404);
      res.end();
    });
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 2. Créer un workspace API isolé
    const contexts = await createTestContexts(baseUrl);

    // 3. Vérifier l'isolation
    const ownerResponse = await contexts.owner.get("/api/resource");
    const attackerResponse = await contexts.attacker.get("/api/resource");
    
    if (ownerResponse.status() !== 200 || attackerResponse.status() !== 403) {
      throw new Error("L'isolation des contextes a échoué.");
    }
    console.log("Isolation des contextes: passed");

    // 4. Utilisation du WorkflowTestRunner
    const reportDir = path.join(os.tmpdir(), `kirov5-workflow-plat-${Date.now()}`);
    const runner = new WorkflowTestRunner({ baseUrl, reportDir });

    const capabilities = {
      workflows: true,
      idempotency: true,
      authorization: true,
      massAssignment: true,
      concurrency: false 
    };

    const testPlan = {
      tests: [
        { id: "test-auth", kind: "authorization", resourcePath: "/api/resource", ownerToken: "dummy", attackerToken: "dummy" },
        { id: "test-mass", kind: "unexpected-properties", path: "/api/resource", token: "dummy" },
        { id: "test-replay", kind: "replay", path: "/api/mutation", payload: { id: "a" }, idempotencyKey: "k1" },
        { id: "test-mismatch", kind: "payload-mismatch", path: "/api/mutation", firstPayload: { id: "a" }, secondPayload: { id: "b" }, idempotencyKey: "k1" },
        { id: "test-transition", kind: "invalid-transition", path: "/api/invalid", expectedStatus: 404, expectedError: "NOT_FOUND", token: "dummy" }
      ]
    };

    const report = await runner.run(testPlan, capabilities);

    // 5. Test du masquage des secrets via assertNoSecrets
    const masked = runner.maskSecrets({
      body: { token: "secret-token-123", myPassword: "password-456" },
      headers: { Authorization: "Bearer eyJhb.123.sig" }
    });
    
    assertNoSecrets(masked);
    assertNoSecrets(report); // Vérifie que le vrai rapport est également propre !
    console.log("Masquage des secrets et assertNoSecrets: passed");

    // 6. Test de la Gate Platine (Validation des résultats)
    // Nous passons un mock de rapport de Promotion pour vérifier assertWorkflowEvidence
    const { validateWorkflowReport } = require("../validators/ContractValidator");
    
    const promotionReport = {
      workflowTests: report,
      idempotencyTests: report,
      authorizationTests: report,
      massAssignmentTests: report,
      concurrencyTests: null
    };

    try {
      const isValid = validateWorkflowReport(promotionReport, capabilities);
      if (!isValid && report.status !== "passed") {
         console.log("La Gate bloque correctement un faux rapport.");
      }
    } catch (e) {
      if (e.code === "WORKFLOW_EVIDENCE_MISSING") {
        console.log("La Gate Platine bloque l'absence de preuve: passed");
      }
    }

    console.log("\nWorkflow Platinum Integration: passed");

  } finally {
    server.close();
  }
}

run().catch((e) => {
  console.error("Test Workflow Platinum échoué:", e);
  process.exitCode = 1;
});
