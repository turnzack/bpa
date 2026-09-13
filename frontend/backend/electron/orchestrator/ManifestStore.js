const fs = require('fs');
const path = require('path');

class ManifestStore {
  constructor(manifestsDir) {
    this.manifestsDir = manifestsDir;
    if (!fs.existsSync(this.manifestsDir)) {
      fs.mkdirSync(this.manifestsDir, { recursive: true });
    }
  }

  _getManifestPath(projectId) {
    return path.join(this.manifestsDir, `${projectId}.manifest.json`);
  }

  async getManifest(projectId) {
    const manifestPath = this._getManifestPath(projectId);
    if (!fs.existsSync(manifestPath)) {
      return null;
    }
    const data = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(data);
  }

  async saveManifest(projectId, manifest) {
    const manifestPath = this._getManifestPath(projectId);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  }

  async createManifest(projectId, runId, blueprintHash) {
    const manifest = {
      schemaVersion: "2.0.0",
      projectId,
      runId,
      status: "generating",
      blueprintHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      batches: [],
      pages: [],
      routes: [],
      validation: {
        static: "pending",
        build: "pending",
        runtime: "pending"
      },
      history: []
    };
    await this.saveManifest(projectId, manifest);
    return manifest;
  }

  async getBatch(projectId, batchId) {
    const manifest = await this.getManifest(projectId);
    if (!manifest) return null;
    return manifest.batches.find(b => b.id === batchId);
  }

  async updateBatch(projectId, batchId, updates) {
    const manifest = await this.getManifest(projectId);
    if (!manifest) throw new Error(`Manifest non trouvé pour le projet ${projectId}`);

    let batch = manifest.batches.find(b => b.id === batchId);
    if (!batch) {
      batch = { id: batchId, status: "pending", attempt: 1, history: [] };
      manifest.batches.push(batch);
    }

    Object.assign(batch, updates);
    if (updates.historyEntry) {
        if (!batch.history) batch.history = [];
        batch.history.push(updates.historyEntry);
        delete batch.historyEntry; // Ne pas polluer l'objet batch avec la clé temporaire
    }
    
    manifest.updatedAt = new Date().toISOString();
    await this.saveManifest(projectId, manifest);
    return batch;
  }
}

module.exports = { ManifestStore };
