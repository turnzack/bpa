'use strict';
/**
 * TIGER-101 — Moniteur de Santé & Performance Système
 * electron/orchestrator/mobile/system-health-monitor.js
 *
 * Surveille la santé de la plateforme Sovereign Engine :
 * - Mémoire Node.js / Electron
 * - Temps de fonctionnement (Uptime)
 * - Statut SQLite & Ollama
 * - Statut des serveurs MCP
 */

const os = require('os');
const { DB_PATH } = require('../../services/db');
const { checkOllamaAvailable } = require('../../services/ollama-embeddings');
const McpRegistry = require('../../mcp/mcp-registry');

const fs = require('fs');

class SystemHealthMonitor {
  /**
   * Effectue un bilan de santé 360° du système local.
   * @returns {Promise<object>}
   */
  static async getSystemHealth() {
    const mem = process.memoryUsage();
    let dbSizeBytes = 0;
    try {
      if (fs.existsSync(DB_PATH)) {
        dbSizeBytes = fs.statSync(DB_PATH).size;
      }
    } catch {}

    const ollamaOk = await checkOllamaAvailable().catch(() => false);
    const mcpServers = McpRegistry.status();

    return {
      status: 'healthy',
      system: {
        platform:   process.platform,
        arch:       process.arch,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        cpuCount:   os.cpus().length,
        freeMemoryMb:  (os.freemem() / (1024 * 1024)).toFixed(2),
        totalMemoryMb: (os.totalmem() / (1024 * 1024)).toFixed(2),
      },
      processMemory: {
        rssMb:       (mem.rss / (1024 * 1024)).toFixed(2),
        heapTotalMb: (mem.heapTotal / (1024 * 1024)).toFixed(2),
        heapUsedMb:  (mem.heapUsed / (1024 * 1024)).toFixed(2),
      },
      database: {
        type:     'SQLite (better-sqlite3)',
        path:     DB_PATH,
        exists:   fs.existsSync(DB_PATH),
        sizeMb:   (dbSizeBytes / (1024 * 1024)).toFixed(2),
      },
      ollama: {
        available: ollamaOk,
        model:     'nomic-embed-text',
      },
      mcp: {
        serversCount:   mcpServers.length,
        serversConnected: mcpServers.filter(s => s.status === 'connected').length,
        servers:        mcpServers,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = SystemHealthMonitor;
