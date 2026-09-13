"use strict";

const http = require("node:http");
const path = require("node:path");
const os = require("node:os");

const WorkflowTestRunner = require("../runtime/WorkflowTestRunner");

async function run() {
  console.log("Démarrage du test Workflow Backend (OWASP)...");

  // 1. Simuler un backend vulnérable VS robuste
  const state = {
    resourceRole: "user",
    idempotencyKeys: new Set(),
    mutations: 0,
    ownerToken: "token-owner",
    attackerToken: "token-attacker"
  };

  const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      const parsed = body ? JSON.parse(body) : {};
      
      // Route pour Invalid Transition (Attendu: 409)
      if (req.url === "/api/orders/1/approve") {
        res.writeHead(409, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ code: "INVALID_STATE" }));
      }
      
      // Route pour Idempotence & Replay (Attendu: 200 avec même OpId, ou 409 si mismatch)
      if (req.url === "/api/export") {
        const idempKey = req.headers["idempotency-key"];
        if (idempKey === "mismatch-key" && parsed.id === "b") {
          res.writeHead(409, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ code: "IDEMPOTENCY_KEY_REUSED" }));
        }
        
        if (state.idempotencyKeys.has(idempKey)) {
          // Replay pur
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ operationId: "op-123", mutations: state.mutations }));
        } else {
          // Première fois
          state.idempotencyKeys.add(idempKey);
          state.mutations++;
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ operationId: "op-123", mutations: state.mutations }));
        }
      }

      // Route pour Authorization (Attendu: 200 pour owner, 403 pour attacker)
      if (req.url === "/api/private-resource") {
        const auth = req.headers["authorization"] || "";
        if (auth.includes("token-attacker")) {
          res.writeHead(403);
          return res.end();
        }
        res.writeHead(200);
        return res.end();
      }

      // Route pour Mass Assignment (Attendu: ignorer role, isOwner, status)
      if (req.url === "/api/profile") {
        if (req.method === "PATCH") {
          // On ignore purement et simplement les mauvaises propriétés
          res.writeHead(200);
          return res.end();
        }
        if (req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ role: "user", isOwner: false, status: "pending" }));
        }
      }

      res.writeHead(404);
      res.end();
    });
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  const reportDir = path.join(os.tmpdir(), `kirov5-workflow-${Date.now()}`);

  const runner = new WorkflowTestRunner({ baseUrl, reportDir });

  const testPlan = {
    tests: [
      { id: "test-transition", kind: "invalid-transition", path: "/api/orders/1/approve", expectedStatus: 409, expectedError: "INVALID_STATE", token: "test" },
      { id: "test-replay", kind: "replay", path: "/api/export", payload: { id: "a" }, idempotencyKey: "replay-key" },
      { id: "test-mismatch", kind: "payload-mismatch", path: "/api/export", firstPayload: { id: "a" }, secondPayload: { id: "b" }, idempotencyKey: "mismatch-key" },
      { id: "test-auth", kind: "authorization", resourcePath: "/api/private-resource", ownerToken: "token-owner", attackerToken: "token-attacker" },
      { id: "test-mass", kind: "unexpected-properties", path: "/api/profile", token: "test" }
    ]
  };

  const capabilities = {
    workflows: true,
    idempotency: true,
    authorization: true,
    massAssignment: true,
    concurrency: false // Exclu pour ce test unitaire rapide
  };

  try {
    const report = await runner.run(testPlan, capabilities);

    if (report.status !== "passed" || report.failed > 0) {
      console.error("Workflow Test (Backend): échoué", report);
      process.exitCode = 1;
    } else {
      console.log("Workflow Test (Backend): passed");
      console.log(`Tous les scénarios OWASP sont validés (Rapport: ${reportDir})`);
    }

  } finally {
    server.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
