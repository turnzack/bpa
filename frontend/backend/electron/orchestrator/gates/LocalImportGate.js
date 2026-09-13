"use strict";

const { analyzeLocalImports } = require("../validation/ImportResolver");
const path = require("path");
const fs = require("fs");

class LocalImportGate {
  static async run(projectId, context = {}) {
    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    
    // Si c'est en staging, on doit pointer vers le staging. 
    // Pour simplifier l'implémentation, on pointe vers le projet pour le moment.
    if (!fs.existsSync(projectRoot)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "PROJECT_NOT_FOUND", file: "" }] };
    }

    try {
      const result = analyzeLocalImports({ projectRoot });
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

module.exports = LocalImportGate;
