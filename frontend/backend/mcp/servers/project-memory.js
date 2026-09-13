'use strict';
/**
 * TIGER-043 — Serveur MCP project-memory
 * mcp/servers/project-memory.js
 *
 * Outils : search_project_memory, save_project_memory, get_project_decisions,
 *          get_project_context, get_previous_errors, log_project_event
 *
 * Connecté au LocalMemoryService (SQLite + Ollama embeddings).
 */

const LocalMemory = require('../../electron/services/local-memory-service');

const SERVER = {
  name:        'project-memory',
  description: 'Mémoire persistante locale SQLite + embeddings sémantiques Ollama',

  getTools() {
    return [
      { name: 'search_project_memory',   description: 'Recherche sémantique dans la mémoire du projet', schema: { projectId: 'string', query: 'string', limit: 'number?' } },
      { name: 'save_project_memory',     description: 'Sauvegarde une entrée mémoire typée', schema: { projectId: 'string', type: 'string', content: 'string', source: 'string?', tags: 'string[]?' } },
      { name: 'get_project_decisions',   description: 'Récupère les décisions Hermes passées', schema: { projectId: 'string' } },
      { name: 'get_project_context',     description: 'Contexte global du projet (résumé par type)', schema: { projectId: 'string' } },
      { name: 'get_previous_errors',     description: 'Récupère les erreurs précédentes du projet', schema: { projectId: 'string' } },
      { name: 'log_project_event',       description: 'Journalise un événement d\'orchestration', schema: { projectId: 'string', eventType: 'string', payload: 'object?' } },
      { name: 'save_project_decision',   description: 'Sauvegarde une décision Hermes avec contexte', schema: { projectId: 'string', phase: 'string', decision: 'string', reason: 'string?', toolUsed: 'string?', outcome: 'string?' } },
    ];
  },

  async invoke(toolName, args) {
    const { projectId } = args;
    if (!projectId) throw new Error('projectId requis.');

    switch (toolName) {
      case 'search_project_memory': {
        const { query, limit = 8 } = args;
        if (!query) throw new Error('query requis.');
        const results = await LocalMemory.search(projectId, query, limit);
        return { projectId, query, count: results.length, results };
      }

      case 'save_project_memory': {
        const { type, content, source, tags, metadata } = args;
        if (!type)    throw new Error('type requis.');
        if (!content) throw new Error('content requis.');
        const entry = await LocalMemory.save(projectId, type, content, { source, tags, metadata });
        return { success: true, projectId, entry };
      }

      case 'get_project_decisions': {
        const decisions = LocalMemory.listDecisions(projectId);
        return { projectId, count: decisions.length, decisions };
      }

      case 'get_project_context': {
        const context = LocalMemory.getProjectContext(projectId);
        return context;
      }

      case 'get_previous_errors': {
        const errors = LocalMemory.getPreviousErrors(projectId);
        return { projectId, count: errors.length, errors };
      }

      case 'log_project_event': {
        const { eventType, payload } = args;
        if (!eventType) throw new Error('eventType requis.');
        const event = LocalMemory.logEvent(projectId, eventType, payload || {});
        return { success: true, event };
      }

      case 'save_project_decision': {
        const { phase, decision, reason, toolUsed, outcome } = args;
        if (!phase || !decision) throw new Error('phase et decision requis.');
        const entry = LocalMemory.saveDecision(projectId, phase, decision, reason, toolUsed, outcome);
        return { success: true, entry };
      }

      default:
        throw new Error(`Outil inconnu : ${toolName}`);
    }
  },
};

module.exports = SERVER;
