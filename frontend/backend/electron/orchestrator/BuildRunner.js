const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function runCommand(command, args, options = {}) {
  const timeoutMs = options.timeoutMs || 180000;

  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...process.env, CI: "true", ...options.env },
      shell: process.platform === 'win32', // Requis sur Windows pour npx/npm
      signal: controller.signal,
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject({
        code: controller.signal.aborted ? "COMMAND_TIMEOUT" : "COMMAND_FAILED_TO_START",
        error, stdout, stderr
      });
    });

    child.on("close", (exitCode, signal) => {
      clearTimeout(timer);
      if (exitCode !== 0) {
        reject({
          code: controller.signal.aborted ? "COMMAND_TIMEOUT" : "COMMAND_FAILED",
          exitCode, signal, stdout, stderr
        });
        return;
      }
      resolve({ exitCode, signal, stdout, stderr });
    });
  });
}

class BuildRunner {
  constructor(workspaceManager) {
    this.workspace = workspaceManager;
  }

  getValidationCommands(packageJson) {
    const scripts = packageJson.scripts || {};
    // La priorité : on veut typechecker, linter et build
    return [
      "npm install --no-audit --no-fund --prefer-offline", // Force dependencies resolution
      scripts.typecheck && "npm run typecheck",
      scripts.lint && "npm run lint",
      scripts.build && "npm run build"
    ].filter(Boolean);
  }

  async validateBuild() {
    const targetDir = this.workspace.paths.workspace;
    const pkgPath = path.join(targetDir, "package.json");
    
    if (!fs.existsSync(pkgPath)) {
       return { status: "failed", failedCommand: "package.json check", error: "Aucun package.json trouvé dans le workspace." };
    }

    const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const commands = this.getValidationCommands(packageJson);
    const results = {};

    console.log(`[BuildRunner] Lancement de ${commands.length} commandes de validation sur ${targetDir}...`);

    for (const command of commands) {
      const parts = command.split(" ");
      const executable = parts[0];
      const args = parts.slice(1);

      console.log(`[BuildRunner] ⏳ Exécution: ${command}`);
      try {
        results[command] = await runCommand(executable, args, {
          cwd: targetDir,
          timeoutMs: 180000 // 3 minutes max par process
        });
        console.log(`[BuildRunner] ✅ Succès: ${command}`);
      } catch (error) {
        const fullError = `STDOUT:\n${error.stdout || 'None'}\n\nSTDERR:\n${error.stderr || 'None'}`;
        console.error(`[BuildRunner] ❌ Échec: ${command} ->`, fullError.substring(0, 500));
        return {
          status: "failed",
          failedCommand: command,
          results,
          error: {
             code: error.code || "BUILD_FAILED",
             message: fullError
          }
        };
      }
    }

    return {
      status: "executed_passed",
      results
    };
  }
}

module.exports = { BuildRunner, runCommand };
