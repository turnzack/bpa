'use strict';
/**
 * TIGER-043 — Serveur MCP notebooklm-chat
 * mcp/servers/notebooklm-chat.js
 *
 * Outils : ask_notebooklm
 * Permet d'interroger la base de connaissances du projet sur NotebookLM.
 */

const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

const SERVER = {
  name:        'notebooklm-chat',
  description: 'Interroger la base de connaissances NotebookLM du projet',

  getTools() {
    return [
      { 
        name: 'ask_notebooklm',  
        description: 'Pose une question à la base de connaissances NotebookLM du projet pour obtenir des conseils d\'architecture ou de code', 
        schema: { notebookId: 'string', query: 'string' } 
      },
    ];
  },

  async invoke(toolName, args) {
    const { notebookId, query } = args;
    if (!notebookId) throw new Error('notebookId requis.');
    if (!query) throw new Error('query requis.');

    if (toolName === 'ask_notebooklm') {
      try {
        const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'ask_notebooklm.py');
        // Échappement basique pour la ligne de commande Windows
        const safeQuery = query.replace(/"/g, '\\"');
        const cmd = `python "${scriptPath}" "${notebookId}" "${safeQuery}"`;
        
        const { stdout, stderr } = await execPromise(cmd);
        
        if (stdout.includes('ERROR:')) {
           throw new Error(stdout.trim());
        }

        return { success: true, answer: stdout.trim() };
      } catch (e) {
        throw new Error(`Erreur NotebookLM: ${e.message}`);
      }
    }

    throw new Error(`Outil inconnu : ${toolName}`);
  },
};

module.exports = SERVER;
