const BATCH_STATES = Object.freeze({
  PENDING: "pending",
  GENERATING: "generating",
  RESPONSE_VALIDATED: "response_validated",
  STAGED: "staged",
  STATIC_VALIDATED: "static_validated",
  BUILD_VALIDATED: "build_validated",
  RUNTIME_VALIDATED: "runtime_validated",
  PROMOTED: "promoted",
  REPAIR_REQUIRED: "repair_required",
  REJECTED: "rejected",
  ROLLED_BACK: "rolled_back"
});

const TRANSITIONS = Object.freeze({
  pending: ["generating"],
  generating: ["response_validated", "repair_required", "rejected"],
  response_validated: ["staged", "repair_required", "rejected"],
  staged: ["static_validated", "repair_required", "rejected"],
  static_validated: ["build_validated", "repair_required", "rejected"],
  build_validated: ["runtime_validated", "repair_required", "rejected"],
  runtime_validated: ["promoted", "repair_required"],
  repair_required: ["generating", "rejected"],
  rejected: [],
  promoted: [],
  rolled_back: ["generating", "rejected"]
});

function serializeError(error) {
  return {
    name: error?.name || "Error",
    code: error?.code || "UNKNOWN_ERROR",
    message: error?.message || String(error),
    stack: error?.stack || null
  };
}

class BatchStateMachine {
  constructor({ batchId, projectId, store }) {
    this.batchId = batchId;
    this.projectId = projectId;
    this.store = store; // ManifestStore instance
  }

  async getState() {
    const record = await this.store.getBatch(this.projectId, this.batchId);
    return record?.status || BATCH_STATES.PENDING;
  }

  async transition(nextState, metadata = {}) {
    const currentState = await this.getState();
    const allowed = TRANSITIONS[currentState] || [];

    if (!allowed.includes(nextState)) {
      throw new Error(`Transition interdite pour ${this.batchId}: ${currentState} → ${nextState}`);
    }

    return this.store.updateBatch(this.projectId, this.batchId, {
        status: nextState,
        updatedAt: new Date().toISOString(),
        historyEntry: { from: currentState, to: nextState, at: new Date().toISOString(), metadata }
    });
  }

  async fail(error, metadata = {}) {
    const state = await this.getState();

    if (state === BATCH_STATES.PROMOTED) {
      throw new Error(`Impossible de faire échouer un batch déjà promu : ${this.batchId}`);
    }

    return this.transition(BATCH_STATES.REPAIR_REQUIRED, {
        error: serializeError(error),
        ...metadata
    });
  }
}

module.exports = { BatchStateMachine, BATCH_STATES, TRANSITIONS, serializeError };
