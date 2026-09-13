const fs = require('fs');
const path = require('path');

// Mémoire persistante via fichiers JSON locaux (SANS Docker ni Qdrant)
class LocalMemoryStore {
  constructor(memoryDir = 'e:\\v0reponses\\v0-moteur-electron\\memory\\projects') {
    this.memoryDir = memoryDir;
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
  }

  getMemoryFilePath(projectId) {
    return path.join(this.memoryDir, `${projectId}_memory.json`);
  }

  async search(projectId, limit = 5) {
    try {
      const file = this.getMemoryFilePath(projectId);
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        const observations = JSON.parse(content);
        // Retourne les "limit" observations les plus récentes
        return observations.slice(-limit);
      }
    } catch (e) {
      console.warn(`[MEMORY_STORE] Erreur lecture mémoire pour ${projectId}: ${e.message}`);
    }
    return [];
  }

  async saveObservation(projectId, result) {
    try {
      const file = this.getMemoryFilePath(projectId);
      let observations = [];
      if (fs.existsSync(file)) {
        observations = JSON.parse(fs.readFileSync(file, 'utf-8'));
      }
      
      const payload = {
        projectId,
        timestamp: Date.now(),
        result: JSON.stringify(result)
      };

      observations.push(payload);
      fs.writeFileSync(file, JSON.stringify(observations, null, 2), 'utf-8');
      console.log(`[MEMORY_STORE] Observation sauvegardée en local pour ${projectId}.`);
    } catch (e) {
      console.warn(`[MEMORY_STORE] Erreur sauvegarde mémoire pour ${projectId}: ${e.message}`);
    }
  }
}

module.exports = new LocalMemoryStore();
