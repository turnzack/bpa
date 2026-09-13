"use strict";

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");
const fs = require("fs");

const { terminateProcessTree } = require("../process/ProcessTree");

function findFreePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(findFreePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

function checkServerReady(url, maxRetries = 30, intervalMs = 1000) {
  return new Promise((resolve) => {
    let retries = 0;
    const attempt = () => {
      http.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, statusCode: res.statusCode });
        } else {
          retry();
        }
      }).on("error", () => retry());
    };

    const retry = () => {
      retries++;
      if (retries >= maxRetries) {
        resolve({ ok: false });
      } else {
        setTimeout(attempt, intervalMs);
      }
    };

    attempt();
  });
}

class RuntimeGate {
  static async run(projectId, context = {}, manifest = null) {
    const projectRoot = context.projectRoot || path.join(__dirname, "..", "..", "..", "..", "v0saveprojets", projectId);
    
    if (!fs.existsSync(projectRoot)) {
      return { status: "blocked", verified: false, mode: "real", errors: [{ code: "PROJECT_NOT_FOUND" }] };
    }

    const port = await findFreePort(5173);
    const url = `http://127.0.0.1:${port}`;
    const isWin = process.platform === "win32";

    let cmd = "node";
    let args = [];
    
    if (manifest && manifest.stack && manifest.stack.bundler === "vite") {
      args.push(path.join("node_modules", "vite", "bin", "vite.js"));
      args.push("--host", "127.0.0.1", "--port", port.toString());
    } else if (manifest && manifest.stack && manifest.stack.framework === "next") {
      args.push(path.join("node_modules", "next", "dist", "bin", "next"));
      args.push("dev", "-p", port.toString(), "-H", "127.0.0.1");
    } else {
      cmd = isWin ? "pnpm.cmd" : "pnpm";
      args = ["run", "dev", "--", "--port", port.toString()];
    }

    const start = Date.now();
    let child;

    try {
      child = spawn(cmd, args, {
        cwd: projectRoot,
        shell: isWin,
        stdio: "pipe"
      });

      let output = "";
      if (child.stdout) {
        child.stdout.on("data", d => output += d.toString());
      }
      if (child.stderr) {
        child.stderr.on("data", d => output += d.toString());
      }

      child.on("error", (err) => {
        console.error(`[RUNTIME-GATE] Erreur spawn: ${err.message}`);
      });

      let exitCode = null;
      child.on("exit", (code) => {
        exitCode = code;
      });

      const readiness = await checkServerReady(url);

      if (!readiness.ok) {
        await terminateProcessTree(child);
        return {
          status: "failed",
          verified: true,
          mode: "real",
          errors: [{ code: "RUNTIME_START_FAILED", message: `Le serveur n'a pas répondu. Logs: ${output} (Exit code: ${exitCode})` }],
          durationMs: Date.now() - start
        };
      }

      context.runtime = { url, child, port };

      return {
        status: "passed",
        verified: true,
        mode: "real",
        port,
        url,
        pid: child.pid,
        errors: [],
        durationMs: Date.now() - start
      };
    } catch (e) {
      if (child) await terminateProcessTree(child);
      return {
        status: "error",
        verified: false,
        mode: "real",
        errors: [{ code: "RUNTIME_EXCEPTION", message: e.message }],
        durationMs: Date.now() - start
      };
    }
  }
}

module.exports = RuntimeGate;
