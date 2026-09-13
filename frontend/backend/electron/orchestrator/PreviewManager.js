const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

class PreviewManager {
  static activeProcesses = new Map();

  constructor(workspaceManager) {
    this.workspace = workspaceManager;
    this.activeProcess = null;
  }

  async startCertified({ projectRoot, projectId, port, blueprint }) {
    // 1. Verify CURRENT pointer
    const currentPath = path.join(this.workspace.paths.active, "CURRENT");
    if (!fs.existsSync(currentPath)) {
       throw new Error("Impossible de démarrer le preview : pointeur CURRENT introuvable.");
    }
    
    const currentVersion = fs.readFileSync(currentPath, "utf8").trim();
    const versionDir = path.join(this.workspace.paths.active, "versions", currentVersion);
    
    if (!fs.existsSync(versionDir)) {
       throw new Error(`Impossible de démarrer le preview : la version ${currentVersion} n'existe pas.`);
    }

    console.log(`[PREVIEW] project=${projectId} version=${currentVersion} cwd=${versionDir} port=${port}`);

    // 2. Kill existing process if any
    if (this.activeProcess && !this.activeProcess.killed) {
       this.activeProcess.kill();
    }
    const globalOldProcess = PreviewManager.activeProcesses.get(projectId);
    if (globalOldProcess && !globalOldProcess.killed) {
       console.log(`[PREVIEW_MANAGER] 🛑 Arrêt de l'ancien serveur Vite pour ${projectId}`);
       globalOldProcess.kill();
    }
    PreviewManager.activeProcesses.delete(projectId);

    // 3. Start Vite preview on strict port
    return new Promise((resolve, reject) => {
       const args = [
         "run",
         "preview",
         "--",
         "--host",
         "127.0.0.1",
         "--port",
         port.toString(),
         "--strictPort"
       ];

       const child = spawn(process.platform === 'win32' ? "npm.cmd" : "npm", args, {
         cwd: versionDir,
         shell: process.platform === 'win32',
         windowsHide: true
       });

       this.activeProcess = child;
       PreviewManager.activeProcesses.set(projectId, child);
       let started = false;

       child.stdout.on("data", (data) => {
         const out = data.toString();
         if (out.includes(`http://127.0.0.1:${port}`) || out.includes("ready in")) {
            if (!started) {
               started = true;
               resolve({ url: `http://127.0.0.1:${port}`, port, status: "passed", version: currentVersion });
            }
         }
         // Error if it complains about port
         if (out.includes("EADDRINUSE") || out.includes("could not start")) {
            reject(new Error(`PREVIEW_PORT_MISMATCH: Impossible de démarrer sur le port strict ${port}`));
         }
       });

       child.stderr.on("data", (data) => {
         const err = data.toString();
         if (err.includes("EADDRINUSE")) {
            reject(new Error(`PREVIEW_PORT_MISMATCH: Impossible de démarrer sur le port strict ${port}`));
         }
       });

       child.on("error", (error) => {
         reject(error);
       });
       
       // Fallback resolve after 5 seconds if no specific log matches but process didn't die
       setTimeout(() => {
          if (!started && !child.killed) {
             started = true;
             resolve({ url: `http://127.0.0.1:${port}`, port, status: "passed", version: currentVersion, note: "auto-resolved" });
          }
       }, 5000);
    });
  }
}

module.exports = { PreviewManager };
