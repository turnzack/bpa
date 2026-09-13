const fs = require('fs');
const path = require('path');

// Mémoire des logs et reprise des jobs par fichier local (pour persister à la fermeture d'Electron)
class LogStore {
  constructor(logsDir = 'e:\\v0reponses\\v0-moteur-electron\\memory\\logs') {
    this.logsDir = logsDir;
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getLogFilePath(jobId) {
    return path.join(this.logsDir, `${jobId}.json`);
  }

  async latest(jobId) {
    try {
      const file = this.getLogFilePath(jobId);
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        return JSON.parse(content);
      }
    } catch (e) {
      console.warn(`[LOG_STORE] Erreur lecture logs pour job ${jobId}: ${e.message}`);
    }
    return [];
  }

  async save(jobId, result) {
    try {
      const file = this.getLogFilePath(jobId);
      let logs = [];
      if (fs.existsSync(file)) {
        logs = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
      
      logs.push({
        timestamp: Date.now(),
        result
      });

      fs.writeFileSync(file, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (e) {
      console.warn(`[LOG_STORE] Erreur sauvegarde logs pour job ${jobId}: ${e.message}`);
    }
  }
}

module.exports = new LogStore();
