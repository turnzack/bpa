"use strict";

class ProjectContractGate {
  static async run(projectId, context = {}, manifest = null) {
    if (!manifest || !manifest.projectId) {
      return {
        status: "failed",
        verified: true,
        mode: "real",
        errors: [{ code: "PROJECT_MANIFEST_INVALID", message: "Le manifeste est absent ou invalide." }]
      };
    }

    if (manifest.stack && manifest.stack.framework === "unknown") {
      return {
        status: "failed",
        verified: true,
        mode: "real",
        errors: [{ code: "STACK_NOT_SUPPORTED", message: "La stack du projet n'est pas reconnue." }]
      };
    }

    return {
      status: "passed",
      verified: true,
      mode: "real",
      errors: []
    };
  }
}

module.exports = ProjectContractGate;
