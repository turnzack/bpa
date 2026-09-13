'use strict';
/**
 * TIGER-100 — Agrégateur du Dashboard Global
 * electron/orchestrator/mobile/dashboard-aggregator.js
 *
 * Agrège les statistiques multi-projets de la plateforme Sovereign Engine :
 * - Nombre de projets par état (created, scaffolded, testing, completed, failed)
 * - Volume de la mémoire SQLite locale
 * - Nombre total d'appels d'outils MCP
 * - Statistiques d'auto-réparation
 */

const mobileEngine = require('./mobile-job-engine');
const LocalMemory  = require('../../services/local-memory-service');
const McpRegistry  = require('../../mcp/mcp-registry');

const fs           = require('fs');
const path         = require('path');

const WORKSPACE_BASE = 'e:\\v0reponses\\v0-moteur-electron\\v0saveprojets';

class DashboardAggregator {
  /**
   * Retourne la synthèse globale du dashboard.
   * @returns {object}
   */
  static getGlobalStats() {
    const jobs = mobileEngine.list();

    const stateCounts = {
      created:    0,
      scaffolded: 0,
      testing:    0,
      repairing:  0,
      completed:  0,
      failed:     0,
    };

    let totalScreens = 0;

    for (const j of jobs) {
      if (stateCounts[j.state] !== undefined) {
        stateCounts[j.state]++;
      }
      if (j.contract?.screens) {
        totalScreens += j.contract.screens.length;
      }
    }

    // Calcul de l'espace disque du workspace
    let totalWorkspaceBytes = 0;
    try {
      if (fs.existsSync(WORKSPACE_BASE)) {
        totalWorkspaceBytes = getDirSize(WORKSPACE_BASE);
      }
    } catch {}

    const mcpServers = McpRegistry.status();
    const mcpTools   = McpRegistry.discoverAllTools();

    return {
      overview: {
        totalProjects:  jobs.length,
        activeProjects: jobs.filter(j => ['scaffolded', 'testing', 'repairing'].includes(j.state)).length,
        completedProjects: stateCounts.completed,
        failedProjects:    stateCounts.failed,
        totalScreens,
        workspaceSizeMb: (totalWorkspaceBytes / (1024 * 1024)).toFixed(2),
      },
      states: stateCounts,
      mcp: {
        totalServers:   mcpServers.length,
        connectedServers: mcpServers.filter(s => s.status === 'connected').length,
        totalTools:     mcpTools.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Retourne la liste enrichie de tous les projets pour le dashboard.
   * @returns {Array<object>}
   */
  static getProjectsList() {
    const jobs = mobileEngine.list();
    return jobs.map(job => {
      const projectDir = mobileEngine.getProjectDir(job.id);
      const manifestPath = path.join(projectDir, 'project-manifest.json');
      let manifest = null;
      if (fs.existsSync(manifestPath)) {
        try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')); } catch {}
      }

      return {
        id:           job.id,
        projectId:    job.projectId,
        projectName:  job.projectName || job.contract?.projectName || 'MonAppMobile',
        state:        job.state,
        phase:        job.phase,
        createdAt:    job.createdAt,
        updatedAt:    job.updatedAt,
        screenCount:  job.contract?.screens?.length || manifest?.screenCount || 0,
        hasManifest:  !!manifest,
        logsCount:    job.logs?.length || 0,
      };
    });
  }
}

function getDirSize(dir) {
  let size = 0;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (['node_modules', '.git', '.expo'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      size += getDirSize(full);
    } else {
      size += fs.statSync(full).size;
    }
  }
  return size;
}

module.exports = DashboardAggregator;
