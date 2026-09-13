"use strict";

const path = require("path");
const fs = require("fs");
// Mocking the CommandRunner execution since the actual path might differ 
// We will execute the command using Node.js child_process directly for this sprint.
const { exec } = require("child_process");

class TypecheckGate {
  static async run(projectId, context = {}) {
    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    
    if (!fs.existsSync(projectRoot)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "PROJECT_NOT_FOUND", file: "" }] };
    }

    return new Promise((resolve) => {
      const start = Date.now();
      exec("npx tsc --noEmit", { cwd: projectRoot }, (error, stdout, stderr) => {
        const durationMs = Date.now() - start;
        if (error) {
          const out = stdout || stderr;
          console.error(`[TYPECHECK-GATE] Erreur tsc : ${out}`);
          resolve({
            status: "failed",
            verified: true,
            mode: "real",
            errors: [{ code: "TYPECHECK_FAILED", output: out }],
            durationMs,
            exitCode: error.code || 1
          });
        } else {
          resolve({
            status: "passed",
            verified: true,
            mode: "real",
            errors: [],
            durationMs,
            exitCode: 0
          });
        }
      });
    });
  }
}

module.exports = TypecheckGate;
