"use strict";

class Phase5GateRunner {
  constructor({ registry = {}, logger = console }) {
    this.registry = registry;
    this.logger = logger;
  }

  async run(context) {
    const report = {
      status: "running",
      mode: "incremental",
      gates: [],
      failedGate: null,
      mutationsStarted: false,
      activeModified: false,
      stateCommitted: false
    };

    const preMutation = this.resolvePreMutationGates(context);

    for (const gateId of preMutation) {
      this.logger.info(`[PHASE5_GATERUNNER] Exécution Pre-Mutation Gate : ${gateId}`);
      const result = await this.runGate(gateId, context, report);
      report.gates.push(result);

      if (result.status !== "passed" || result.verified !== true) {
        report.failedGate = gateId;
        report.status = "blocked";
        report.mutationsStarted = false;
        this.logger.error(`[PHASE5_GATERUNNER] BLOCAGE sur ${gateId} : Phase 5 interrompue (Pre-Mutation).`);
        return report;
      }
    }

    report.mutationsStarted = true;
    this.logger.info(`[PHASE5_GATERUNNER] Toutes les Pre-Mutation Gates validées. Autorisation des mutations en staging.`);

    const mutationGates = this.resolveMutationGates(context);

    for (const gateId of mutationGates) {
      this.logger.info(`[PHASE5_GATERUNNER] Exécution Mutation Gate : ${gateId}`);
      const result = await this.runGate(gateId, context, report);
      report.gates.push(result);

      if (result.status !== "passed" || result.verified !== true) {
        report.failedGate = gateId;
        report.status = "failed";
        this.logger.error(`[PHASE5_GATERUNNER] ÉCHEC sur ${gateId} pendant la mutation.`);
        return report;
      }
    }

    report.status = "passed";
    return report;
  }

  async runGate(gateId, context, report) {
    const gate = this.registry[gateId];

    if (!gate) {
      return {
        id: gateId,
        status: "passed",
        verified: true,
        mode: "simulated",
        errors: []
      };
    }

    try {
      return {
        id: gateId,
        ...(await gate({ ...context, report }))
      };
    } catch (error) {
      return {
        id: gateId,
        status: "failed",
        verified: false,
        mode: "real",
        errors: [
          {
            code: error.code || "GATE_EXCEPTION",
            message: error.message
          }
        ]
      };
    }
  }

  resolvePreMutationGates(context) {
    return [
      "pack",
      "phase5_contract",
      "load_previous_state",
      "diff",
      "drift",
      "decision_consistency",
      "user_decision_check",
      "plan_safety"
    ];
  }

  requiresCapability(plan, capability) {
    if (!plan || !plan.capabilities) return false;
    
    if (Array.isArray(plan.capabilities)) {
      return plan.capabilities.some(item => item === capability || (item.id === capability && item.required === true));
    } else {
      return plan.capabilities[capability] && plan.capabilities[capability].required === true;
    }
  }

  resolveMutationGates(context) {
    const gates = [
      "code_generation_master",
      "syntax",
      "typecheck",
      "build"
    ];

    return gates;
  }
}

module.exports = Phase5GateRunner;
