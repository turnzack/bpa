const { spawn } = require("child_process");
const path = require("path");

const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const ALLOWED_COMMANDS = Object.freeze({
  install: {
    file: PNPM,
    args: ["install"]
  },
  rebuild: {
    file: PNPM,
    args: ["rebuild"]
  },
  typecheck: {
    file: PNPM,
    args: ["exec", "tsc", "--noEmit"]
  },
  build: {
    file: PNPM,
    args: ["run", "build"]
  }
});

const COMMAND_ORDER = ["install", "rebuild", "typecheck", "build"];

function orderCommands(commands) {
  return COMMAND_ORDER.filter(commandId => commands.includes(commandId));
}

function assertInstallAllowed(plan) {
  if (
    plan.commands.includes("install") &&
    (!Array.isArray(plan.dependencyRequests) || plan.dependencyRequests.length === 0)
  ) {
    throw Object.assign(new Error("install sans dependencyRequest."), { code: "INSTALL_WITHOUT_DEPENDENCY_REQUEST" });
  }
}

function assertCommandCwd({ cwd, workspaceRoot }) {
  const actual = path.resolve(cwd);
  const expected = path.resolve(workspaceRoot);

  if (actual !== expected) {
    throw Object.assign(new Error("Commande hors workspace."), { code: "COMMAND_CWD_FORBIDDEN" });
  }
}

function terminateProcessTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === "win32") {
    child.kill(); // On Windows we might need taskkill in future, but child.kill() is safest fallback.
    return;
  }
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    child.kill();
  }
}

function runAllowedCommand({ commandId, plan, cwd, workspaceRoot, timeoutMs = 180000, maxOutputBytes = 2 * 1024 * 1024 }) {
  const command = ALLOWED_COMMANDS[commandId];

  if (!command) {
    throw Object.assign(new Error(`Commande inconnue : ${commandId}`), { code: "SUTURE_COMMAND_FORBIDDEN" });
  }

  assertCommandCwd({ cwd, workspaceRoot });

  let args = [...command.args];
  if (commandId === "install" && plan && Array.isArray(plan.dependencyRequests) && plan.dependencyRequests.length > 0) {
    const pkgNames = plan.dependencyRequests.map(d => (typeof d === 'string' ? d : d.name)).filter(Boolean);
    if (pkgNames.length > 0) {
      args = ["add", ...pkgNames];
    }
  }

  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const child = spawn(command.file, args, {
      cwd,
      shell: process.platform === "win32",
      windowsHide: true,
      env: { ...process.env, CI: "1" }
    });

    let stdout = "";
    let stderr = "";
    let outputBytes = 0;
    let finished = false;

    let timer;

    const appendOutput = (target, chunk) => {
      const text = chunk.toString();
      outputBytes += Buffer.byteLength(text, "utf8");

      if (outputBytes > maxOutputBytes) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        terminateProcessTree(child);
        reject(Object.assign(new Error("Sortie de commande trop volumineuse."), { code: "SUTURE_OUTPUT_LIMIT" }));
        return;
      }

      if (target === "stdout") {
        stdout += text;
      } else {
        stderr += text;
      }
    };

    timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      terminateProcessTree(child);
      reject(Object.assign(new Error(`Timeout commande : ${commandId}`), { code: "SUTURE_COMMAND_TIMEOUT" }));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => appendOutput("stdout", chunk));
    child.stderr.on("data", (chunk) => appendOutput("stderr", chunk));

    child.on("error", (error) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (exitCode) => {
      if (finished) return;
      
      if (exitCode !== 0 && commandId === "install") {
        console.warn(`[COMMAND_RUNNER] ⚠️ pnpm install/add a échoué (exit ${exitCode}). Tentative de fallback avec npm...`);
        const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
        const pkgNames = (plan && Array.isArray(plan.dependencyRequests))
          ? plan.dependencyRequests.map(d => (typeof d === 'string' ? d : d.name)).filter(Boolean)
          : [];
        const npmArgs = pkgNames.length > 0 ? ["install", "--no-audit", "--no-fund", ...pkgNames] : ["install", "--no-audit", "--no-fund"];
        
        try {
          const fallbackChild = spawn(npmCmd, npmArgs, {
            cwd,
            shell: process.platform === "win32",
            windowsHide: true,
            env: { ...process.env, CI: "1" }
          });

          fallbackChild.on("close", (npmExitCode) => {
            finished = true;
            clearTimeout(timer);
            resolve({
              commandId,
              exitCode: npmExitCode,
              stdout,
              stderr,
              durationMs: Date.now() - startedAt,
              status: npmExitCode === 0 ? "passed" : "failed"
            });
          });
          return;
        } catch (e) {
          console.error('[COMMAND_RUNNER] Échec du fallback npm :', e.message);
        }
      }

      finished = true;
      clearTimeout(timer);

      resolve({
        commandId,
        exitCode,
        stdout,
        stderr,
        durationMs: Date.now() - startedAt,
        status: exitCode === 0 ? "passed" : "failed"
      });
    });
  });
}

module.exports = {
  orderCommands,
  assertInstallAllowed,
  runAllowedCommand
};
