const fs = require('fs');
const path = require('path');

const FAILURE_POLICY = {
  INVALID_AI_JSON: { action: "repair", severity: "high" },
  MISSING_PAGE: { action: "repair", severity: "critical" },
  MISSING_IMPORT: { action: "repair", severity: "critical" },
  BUILD_FAILED: { action: "repair", severity: "critical" },
  RUNTIME_FAILED: { action: "repair", severity: "critical" },
  UNSAFE_PATH: { action: "reject", severity: "critical" },
  SECRET_DETECTED: { action: "reject", severity: "critical" },
  PROTECTED_FILE_MODIFIED: { action: "reject", severity: "critical" },
  VISUAL_COVERAGE_LOW: { action: "repair", severity: "high" }
};

class RepairManager {
  constructor(workspaceManager) {
    this.workspace = workspaceManager;
  }

  async create(taskDef) {
    const repairsDir = path.join(this.workspace.paths.workspace, ".kirov", "repairs");
    if (!fs.existsSync(repairsDir)) fs.mkdirSync(repairsDir, { recursive: true });

    const taskId = `repair-${Date.now()}`;
    const task = {
      id: taskId,
      batchId: taskDef.batchId,
      code: taskDef.errorCode,
      message: taskDef.message,
      severity: taskDef.severity,
      attempt: taskDef.attempt || 1,
      maxAttempts: taskDef.maxAttempts || 3,
      status: "open",
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(path.join(repairsDir, `${taskId}.json`), JSON.stringify(task, null, 2));
    return task;
  }

  async handleFailure({ batch, stateMachine, error }) {
    const policy = FAILURE_POLICY[error.code] || { action: "repair", severity: "high" };

    if (policy.action === "reject") {
      await stateMachine.transition("rejected", {
        error: error,
        severity: policy.severity,
        reason: "POLICY_REJECT"
      });
      return { status: "rejected", repairable: false };
    }

    if (batch.attempt >= 50) {
      await stateMachine.transition("rejected", {
        error: error,
        severity: policy.severity,
        reason: "MAX_ATTEMPTS_REACHED"
      });
      return { status: "rejected", repairable: false };
    }

    await stateMachine.fail(error, { severity: policy.severity });

    const task = await this.create({
      batchId: batch.id,
      errorCode: error.code,
      message: error.message,
      severity: policy.severity,
      attempt: batch.attempt || 1,
      maxAttempts: 50
    });

    return { status: "repair_required", repairable: true, task };
  }
}

module.exports = { RepairManager, FAILURE_POLICY };
