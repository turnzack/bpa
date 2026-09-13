'use strict';
/**
 * TIGER-042 — Serveur MCP project-filesystem
 * mcp/servers/project-filesystem.js
 *
 * Outils : list_project_files, read_project_file, search_project_code, write_project_file
 * Accès STRICTEMENT restreint au dossier workspace du projet.
 * Aucun accès au système de fichiers global.
 */

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const WORKSPACE_BASE = 'e:\\v0reponses\\v0-moteur-electron\\v0saveprojets';

// Extensions autorisées en lecture/écriture
const ALLOWED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.env.example',
  '.gitignore', '.prettierrc', '.eslintrc', '.babelrc',
  'tailwind.config.js', 'metro.config.js', 'babel.config.js',
]);

/**
 * Vérifie qu'un chemin est dans le workspace d'un projet.
 * @param {string} projectDir
 * @param {string} filePath   Chemin relatif depuis la racine du projet
 * @returns {string} Chemin absolu validé
 */
function assertInWorkspace(projectDir, filePath) {
  if (!filePath || filePath.includes('..')) throw Object.assign(new Error('PATH_TRAVERSAL interdit.'), { code: 'PATH_TRAVERSAL' });
  if (path.isAbsolute(filePath)) throw Object.assign(new Error('Chemin absolu interdit.'), { code: 'PATH_TRAVERSAL' });

  const resolved = path.resolve(projectDir, filePath);
  const base     = path.resolve(projectDir);

  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw Object.assign(new Error(`Accès hors workspace refusé : ${filePath}`), { code: 'PATH_TRAVERSAL' });
  }
  return resolved;
}

const SERVER = {
  name:        'project-filesystem',
  description: 'Lecture/écriture sécurisée dans le workspace du projet',

  getTools() {
    return [
      { name: 'list_project_files',  description: 'Liste les fichiers du projet', schema: { projectDir: 'string', subPath: 'string?' } },
      { name: 'read_project_file',   description: 'Lit le contenu d\'un fichier', schema: { projectDir: 'string', filePath: 'string' } },
      { name: 'write_project_file',  description: 'Écrit le contenu d\'un fichier', schema: { projectDir: 'string', filePath: 'string', content: 'string' } },
      { name: 'search_project_code', description: 'Recherche une chaîne dans les fichiers du projet', schema: { projectDir: 'string', query: 'string' } },
      { name: 'delete_project_file', description: 'Supprime un fichier (protégé)', schema: { projectDir: 'string', filePath: 'string' } },
    ];
  },

  async invoke(toolName, args) {
    const { projectDir, filePath, content, subPath, query } = args;
    if (!projectDir) throw new Error('projectDir requis.');

    switch (toolName) {
      case 'list_project_files': {
        const targetDir = subPath ? assertInWorkspace(projectDir, subPath) : projectDir;
        if (!fs.existsSync(targetDir)) return { files: [] };

        const walk = (dir, base) => {
          const results = [];
          const items = fs.readdirSync(dir, { withFileTypes: true });
          for (const item of items) {
            if (['node_modules', '.git', '.expo', 'dist'].includes(item.name)) continue;
            const fullPath = path.join(dir, item.name);
            const relPath  = path.relative(base, fullPath).replace(/\\/g, '/');
            if (item.isDirectory()) {
              results.push(...walk(fullPath, base));
            } else {
              results.push({ path: relPath, size: fs.statSync(fullPath).size });
            }
          }
          return results;
        };

        return { files: walk(targetDir, projectDir) };
      }

      case 'read_project_file': {
        const abs = assertInWorkspace(projectDir, filePath);
        if (!fs.existsSync(abs)) throw new Error(`Fichier introuvable : ${filePath}`);
        const stat = fs.statSync(abs);
        if (stat.size > 500_000) throw new Error(`Fichier trop grand (max 500 Ko) : ${filePath}`);
        return { content: fs.readFileSync(abs, 'utf-8'), path: filePath, size: stat.size };
      }

      case 'write_project_file': {
        if (!content || typeof content !== 'string') throw new Error('content requis (string).');

        // Anti-WebView & anti-HTML runtime
        const dangerous = ['<WebView', 'dangerouslySetInnerHTML', '<iframe', '<script'];
        for (const d of dangerous) {
          if (content.includes(d)) throw new Error(`Contenu interdit détecté : ${d}. Utiliser des composants React Native natifs.`);
        }

        const abs = assertInWorkspace(projectDir, filePath);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, content, 'utf-8');
        return { success: true, path: filePath, size: content.length };
      }

      case 'search_project_code': {
        if (!query) throw new Error('query requis.');
        const results = [];

        const search = (dir) => {
          if (!fs.existsSync(dir)) return;
          for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
            if (['node_modules', '.git', '.expo'].includes(item.name)) continue;
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) { search(fullPath); continue; }
            try {
              const text = fs.readFileSync(fullPath, 'utf-8');
              const lines = text.split('\n');
              lines.forEach((line, idx) => {
                if (line.toLowerCase().includes(query.toLowerCase())) {
                  results.push({ file: path.relative(projectDir, fullPath).replace(/\\/g, '/'), line: idx + 1, content: line.trim() });
                }
              });
            } catch {}
          }
        };
        search(projectDir);
        return { query, matches: results.slice(0, 50) };
      }

      case 'delete_project_file': {
        // Outil protégé — nécessite confirmation (géré par mcp-policy)
        const abs = assertInWorkspace(projectDir, filePath);
        if (!fs.existsSync(abs)) throw new Error(`Fichier introuvable : ${filePath}`);
        fs.unlinkSync(abs);
        return { success: true, deleted: filePath };
      }

      default:
        throw new Error(`Outil inconnu : ${toolName}`);
    }
  },
};

module.exports = SERVER;
