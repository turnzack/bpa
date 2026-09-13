"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const WORKSPACE_DIR = 'e:\\v0reponses\\v0-moteur-electron\\v0saveprojets';

class UiPushStore {
  constructor() {
    this.memoryCache = new Map();
  }

  getKirovDir(projectId) {
    return path.join(WORKSPACE_DIR, projectId, ".kirov", "ui-pushes");
  }

  async findByIdempotencyKey(projectId, idempotencyKey) {
    const kirovDir = this.getKirovDir(projectId);
    if (!fs.existsSync(kirovDir)) return null;

    const dirs = fs.readdirSync(kirovDir, { withFileTypes: true });
    for (const d of dirs) {
      if (d.isDirectory()) {
        const reqPath = path.join(kirovDir, d.name, "request.json");
        const statPath = path.join(kirovDir, d.name, "status.json");
        if (fs.existsSync(reqPath) && fs.existsSync(statPath)) {
          try {
            const reqData = JSON.parse(fs.readFileSync(reqPath, "utf-8"));
            if (reqData.idempotencyKey === idempotencyKey) {
              const statusData = JSON.parse(fs.readFileSync(statPath, "utf-8"));
              return {
                pushId: d.name,
                runId: reqData.runId,
                publicStatus: {
                  success: true,
                  status: statusData.state || "queued",
                  pushId: d.name,
                  runId: reqData.runId,
                  promotion: statusData.promotion || "blocked"
                }
              };
            }
          } catch (e) {
            // Ignorer les erreurs de parsing
          }
        }
      }
    }
    return null;
  }

  async create(input) {
    const pushId = `push-${input.projectId}-${Date.now()}`;
    const runId = `run-${crypto.randomBytes(4).toString("hex")}`;
    
    const pushDir = path.join(this.getKirovDir(input.projectId), pushId);
    fs.mkdirSync(pushDir, { recursive: true });

    // Staging dir
    const stagingRoot = path.join(pushDir, "staging");
    fs.mkdirSync(stagingRoot, { recursive: true });

    const pushData = {
      ...input,
      pushId,
      runId,
      pushDir,
      stagingRoot,
      activeRoot: path.join(WORKSPACE_DIR, input.projectId),
      createdAt: new Date().toISOString()
    };

    const statusData = {
      state: "queued",
      promotion: "blocked",
      activeModified: false,
      gates: {}
    };

    fs.writeFileSync(path.join(pushDir, "request.json"), JSON.stringify(pushData, null, 2), "utf-8");
    fs.writeFileSync(path.join(pushDir, "status.json"), JSON.stringify(statusData, null, 2), "utf-8");

    return pushData;
  }

  async getStatus(projectId, pushId) {
    const statPath = path.join(this.getKirovDir(projectId), pushId, "status.json");
    if (!fs.existsSync(statPath)) return null;
    return JSON.parse(fs.readFileSync(statPath, "utf-8"));
  }

  async updateStatus(push, newStateData) {
    const statPath = path.join(push.pushDir, "status.json");
    let current = {};
    if (fs.existsSync(statPath)) {
      current = JSON.parse(fs.readFileSync(statPath, "utf-8"));
    }
    const updated = { ...current, ...newStateData, updatedAt: new Date().toISOString() };
    fs.writeFileSync(statPath, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  }

  fail(pushId, error) {
    console.error(`[UiPushStore] Push ${pushId} failed:`, error);
    // Dans un vrai environnement, on irait chercher le dossier via le pushId (ou on le passe en entier)
    // Pour l'instant, on va juste logger car l'implémentation complète nécessiterait le projectId
  }
}

module.exports = new UiPushStore();
