"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
let request;
try {
  const playwright = require("playwright");
  request = playwright.request;
} catch (e) {
  // Ignored here, handled by GoldPipeline assertPlaywrightAvailable
}

class WorkflowTestRunner {
  constructor({ baseUrl, evidenceWriter, reportDir }) {
    this.baseUrl = baseUrl;
    this.evidenceWriter = evidenceWriter;
    this.reportDir = reportDir;
    this.apiContext = null;
  }

  async setup() {
    if (request) {
      this.apiContext = await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          "Content-Type": "application/json",
          "X-Kirov-Test-Run": "true"
        },
        ignoreHTTPSErrors: true
      });
    }
  }

  async teardown() {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }

  maskSecrets(value) {
    if (typeof value === "string") {
      return value
        .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [MASKED]")
        .replace(/(token|secret|password|api[_-]?key)=([^&\s]+)/gi, "$1=[MASKED]")
        .replace(/\beyJ[A-Za-z0-9._-]+\b/g, "[MASKED_JWT]");
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.maskSecrets(item));
    }

    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          /token|secret|password|authorization|cookie|key/i.test(key)
            ? "[MASKED]"
            : this.maskSecrets(item)
        ])
      );
    }

    return value;
  }

  hashBody(body) {
    if (!body) return null;
    return "sha256:" + crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
  }

  async run(testPlan, capabilities) {
    const results = [];
    await fs.mkdir(this.reportDir, { recursive: true });
    await this.setup();

    try {
      this.assertRequiredTests(testPlan, capabilities);
    } catch (error) {
      const report = {
        status: "blocked",
        error: error.message,
        code: error.code,
        missing: error.missing || []
      };
      await this.writeReport(report);
      return report;
    }

    for (const test of testPlan.tests) {
      const startedAt = Date.now();
      try {
        const result = await this.execute(test);
        results.push({
          ...result,
          testDef: this.maskSecrets(test),
          durationMs: Date.now() - startedAt
        });
      } catch (error) {
        results.push({
          id: test.id,
          status: "failed",
          code: error.code || "WORKFLOW_TEST_EXCEPTION",
          message: error.message,
          testDef: this.maskSecrets(test),
          durationMs: Date.now() - startedAt
        });
      }
    }

    await this.teardown();

    const report = {
      status: results.every((r) => r.status === "passed" || r.status === "not_applicable") ? "passed" : "failed",
      total: results.length,
      passed: results.filter((r) => r.status === "passed").length,
      failed: results.filter((r) => r.status === "failed").length,
      notApplicable: results.filter((r) => r.status === "not_applicable").length,
      blocked: results.filter((r) => r.status === "blocked").length,
      results
    };

    await this.writeReport(report);
    return report;
  }

  assertRequiredTests(testPlan, capabilities) {
    const required = [];
    if (capabilities.workflows) required.push("invalid-transition");
    if (capabilities.idempotency) {
      required.push("replay");
      required.push("payload-mismatch");
    }
    if (capabilities.authorization) required.push("authorization");
    if (capabilities.massAssignment) required.push("unexpected-properties");
    if (capabilities.concurrency) required.push("concurrent-mutation");

    const available = new Set(testPlan.tests.map((test) => test.kind));
    const missing = required.filter((kind) => !available.has(kind));

    if (missing.length > 0) {
      throw Object.assign(
        new Error(`Tests backend manquants : ${missing.join(", ")}`),
        { code: "REQUIRED_WORKFLOW_TESTS_MISSING", missing }
      );
    }
  }

  generateInvalidTransitions(machine) {
    const invalid = [];
    for (const state of machine.states) {
      const allowed = machine.transitions
        .filter((t) => t.from.includes(state))
        .map((t) => t.event);
      const allEvents = machine.transitions.map((t) => t.event);
      for (const event of allEvents) {
        if (!allowed.includes(event)) {
          invalid.push({ state, event });
        }
      }
    }
    return invalid;
  }

  async writeReport(report) {
    if (this.evidenceWriter) {
      await this.evidenceWriter.write("workflow-report.json", report);
    } else {
      await fs.writeFile(path.join(this.reportDir, "workflow-report.json"), JSON.stringify(report, null, 2), "utf8");
    }
  }

  async execute(test) {
    if (!this.apiContext) return { id: test.id, status: "blocked", message: "API Context unavailable" };

    switch (test.kind) {
      case "invalid-transition": return this.testInvalidWorkflowTransition(test);
      case "replay": return this.testReplay(test);
      case "payload-mismatch": return this.testIdempotencyPayloadMismatch(test);
      case "authorization": return this.testObjectAuthorization(test);
      case "unexpected-properties": return this.testUnexpectedProperties(test);
      case "payload-limits": return this.testPayloadLimits(test);
      case "concurrent-mutation": return this.testConcurrentMutation(test);
      default: return { id: test.id, status: "not_applicable", message: `Type inconnu: ${test.kind}` };
    }
  }

  async testInvalidWorkflowTransition(test) {
    const response = await this.apiContext.post(test.path, {
      headers: { Authorization: `Bearer ${test.token}` }
    });
    return {
      id: test.id,
      status: response.status() === test.expectedStatus ? "passed" : "failed",
      expectedStatus: test.expectedStatus,
      actualStatus: response.status(),
      expectedError: test.expectedError
    };
  }

  async testReplay(test) {
    const first = await this.apiContext.post(test.path, {
      headers: { "Idempotency-Key": test.idempotencyKey },
      data: test.payload
    });
    const second = await this.apiContext.post(test.path, {
      headers: { "Idempotency-Key": test.idempotencyKey },
      data: test.payload
    });

    const firstBody = await first.json().catch(() => ({}));
    const secondBody = await second.json().catch(() => ({}));

    return {
      id: test.id,
      status: (first.status() < 300 && second.status() < 300 && firstBody.operationId === secondBody.operationId) ? "passed" : "failed",
      firstStatus: first.status(),
      secondStatus: second.status(),
      sameOperation: firstBody.operationId === secondBody.operationId
    };
  }

  async testIdempotencyPayloadMismatch(test) {
    await this.apiContext.post(test.path, {
      headers: { "Idempotency-Key": test.idempotencyKey },
      data: test.firstPayload
    });

    const response = await this.apiContext.post(test.path, {
      headers: { "Idempotency-Key": test.idempotencyKey },
      data: test.secondPayload
    });

    const body = await response.json().catch(() => ({}));

    return {
      id: test.id,
      status: (response.status() === 409 && body.code === "IDEMPOTENCY_KEY_REUSED") ? "passed" : "failed",
      actualStatus: response.status(),
      expectedError: "IDEMPOTENCY_KEY_REUSED",
      actualError: body.code
    };
  }

  async testObjectAuthorization(test) {
    const ownerResponse = await this.apiContext.get(test.resourcePath, {
      headers: { Authorization: `Bearer ${test.ownerToken}` }
    });
    const attackerResponse = await this.apiContext.patch(test.resourcePath, {
      headers: { Authorization: `Bearer ${test.attackerToken}` },
      data: { name: "unauthorized-change" }
    });

    return {
      id: test.id,
      status: (ownerResponse.status() < 300 && [403, 404].includes(attackerResponse.status())) ? "passed" : "failed",
      ownerStatus: ownerResponse.status(),
      attackerStatus: attackerResponse.status()
    };
  }
  
  async testUnexpectedProperties(test) {
    const patchResponse = await this.apiContext.patch(test.path, {
      headers: { Authorization: `Bearer ${test.token}` },
      data: { validProp: "yes", role: "admin", isOwner: true, status: "approved" }
    });

    if (patchResponse.status() === 400) {
      return { id: test.id, status: "passed", actualStatus: 400 };
    }

    const getResponse = await this.apiContext.get(test.path, {
      headers: { Authorization: `Bearer ${test.token}` }
    });
    const resource = await getResponse.json().catch(() => ({}));

    return {
      id: test.id,
      status: (resource.role !== "admin" && resource.isOwner !== true && resource.status !== "approved") ? "passed" : "failed",
      actualStatus: patchResponse.status(),
      resourceHasIgnoredProperties: (resource.role !== "admin" && resource.isOwner !== true && resource.status !== "approved")
    };
  }

  async testPayloadLimits(test) {
    const response = await this.apiContext.post(test.path, {
      headers: { Authorization: `Bearer ${test.token}` },
      data: { items: Array.from({ length: 10001 }, (_, i) => i) }
    });

    return {
      id: test.id,
      status: [400, 413, 422].includes(response.status()) ? "passed" : "failed",
      actualStatus: response.status()
    };
  }

  async testConcurrentMutation(test) {
    const requests = Array.from({ length: 5 }, (_, index) =>
      this.apiContext.post(test.path, {
        headers: { "Idempotency-Key": `${test.idempotencyKeyBase}-${index}` },
        data: test.payload
      })
    );
    const responses = await Promise.all(requests);
    const successful = responses.filter((r) => r.status() < 300);

    return {
      id: test.id,
      status: successful.length <= 1 ? "passed" : "failed",
      successfulRequests: successful.length
    };
  }
}

module.exports = WorkflowTestRunner;
