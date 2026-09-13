const fsPromises = require("node:fs/promises");
const path = require("node:path");

class LockManager {
  static async acquireLock(projectRoot) {
    const lockDir = path.join(projectRoot, ".kirov", "locks");
    await fsPromises.mkdir(lockDir, { recursive: true });
    
    const lockPath = path.join(lockDir, "project.lock");

    try {
      const handle = await fsPromises.open(lockPath, "wx");
      await handle.writeFile(
        JSON.stringify({
          pid: process.pid,
          createdAt: new Date().toISOString()
        })
      );
      return { handle, lockPath };
    } catch (error) {
      if (error.code === "EEXIST" || error.code === "EPERM") {
        // Tentative de récupération (Stale Lock)
        try {
          const content = await fsPromises.readFile(lockPath, "utf8");
          const lockData = JSON.parse(content);
          
          let isRunning = true;
          try {
             process.kill(lockData.pid, 0);
          } catch (e) {
             isRunning = false;
          }
          
          if (!isRunning) {
             console.log(`[LockManager] Verrou zombie détecté (PID ${lockData.pid} mort). Suppression automatique.`);
             await fsPromises.rm(lockPath, { force: true });
             return this.acquireLock(projectRoot); // Retry
          }
        } catch (e) {
           // Ignorer l'erreur de lecture du verrou
        }
        
        throw new Error(`Le projet est actuellement verrouillé par un autre processus (PID ou Génération en cours) : ${lockPath}`);
      }
      throw error;
    }
  }

  static async releaseLock(lockObj) {
    if (!lockObj || !lockObj.handle) return;
    try {
      await lockObj.handle.close();
      await fsPromises.rm(lockObj.lockPath, { force: true });
    } catch (err) {
      console.warn(`[LockManager] Échec lors de la libération du verrou ${lockObj.lockPath}:`, err.message);
    }
  }
}

module.exports = { LockManager };
