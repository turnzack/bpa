"use strict";

const { analyzeExports } = require("../validation/ExportResolver");
const path = require("path");
const fs = require("fs");

class ExportContractGate {
  static async run(projectId, context = {}) {
    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    
    if (!fs.existsSync(projectRoot)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "PROJECT_NOT_FOUND", file: "" }] };
    }

    try {
      const result = analyzeExports({ projectRoot });
      return {
        status: result.status,
        verified: result.verified,
        mode: result.mode,
        errors: result.errors || [],
        durationMs: 0
      };
    } catch (e) {
      return { status: "error", verified: false, mode: "real", errors: [{ code: "INTERNAL_ERROR", message: e.message }] };
    }
  }
}

module.exports = ExportContractGate;
