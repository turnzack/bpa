"use strict";

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

class BuildGate {
  static async run(projectId, context = {}, manifest = null) {
    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    
    if (!fs.existsSync(projectRoot)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "PROJECT_NOT_FOUND" }] };
    }

    const start = Date.now();
    const isWin = process.platform === "win32";
    const cmd = isWin ? "pnpm.cmd" : "pnpm";
    
    // Si la commande est spécifiée dans le manifest, on l'utilise, sinon pnpm run build
    let args = ["run", "build"];

    return new Promise((resolve) => {
      const child = spawn(cmd, args, {
        cwd: projectRoot,
        shell: isWin
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        const durationMs = Date.now() - start;
        if (code === 0) {
          resolve({
            status: "passed",
            verified: true,
            mode: "real",
            errors: [],
            durationMs
          });
        } else {
          resolve({
            status: "failed",
            verified: true,
            mode: "real",
            errors: [{ code: "BUILD_FAILED", message: stderr || stdout }],
            durationMs
          });
        }
      });

      child.on("error", (err) => {
        const durationMs = Date.now() - start;
        resolve({
          status: "error",
          verified: false,
          mode: "real",
          errors: [{ code: "BUILD_EXCEPTION", message: err.message }],
          durationMs
        });
      });
    });
  }
}

module.exports = BuildGate;
