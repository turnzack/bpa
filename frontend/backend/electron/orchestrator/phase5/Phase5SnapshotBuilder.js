'use strict';
/**
 * Phase5SnapshotBuilder — Générateur de snapshot sécurisé
 *
 * Règles :
 *  - Jamais de .env, .env.*, *.key, *.pem, credentials*
 *  - Jamais de node_modules, .git, dist, build, .kirov
 *  - Extensions autorisées uniquement
 *  - Limite : 500 Ko par fichier, 10 Mo total, 500 fichiers max
 *  - Chemins relatifs uniquement (slash POSIX)
 *  - Contenu texte uniquement
 */

const fs   = require('fs');
const path = require('path');

// Dossiers entièrement ignorés (nom exact)
const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build',
  '.kirov', '.expo', 'coverage', '.next', '.turbo'
]);

// Extensions de fichiers autorisées
const ALLOWED_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.json', '.css', '.scss', '.html', '.md',
  '.yml', '.yaml', '.env.example', '.env.template'
]);

// Patterns de noms de fichiers interdits (secrets)
const SECRET_FILE_PATTERNS = [
  /^\.env(\..+)?$/i,   // .env, .env.local, .env.production…
  /\.key$/i,
  /\.pem$/i,
  /\.p12$/i,
  /\.pfx$/i,
  /^credentials/i,
  /^secrets\./i,
  /\.secret$/i,
];

const MAX_FILE_BYTES   = 500_000;  // 500 Ko par fichier
const MAX_TOTAL_BYTES  = 10_000_000; // 10 Mo total
const MAX_FILE_COUNT   = 500;

/**
 * Vérifie si un nom de fichier doit être ignoré (secret)
 */
function isSecretFile(filename) {
  return SECRET_FILE_PATTERNS.some(re => re.test(filename));
}

/**
 * Vérifie si l'extension est autorisée
 */
function isAllowedExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  // Cas spécial : .env.example, .env.template (non-secrets)
  if (filename.toLowerCase().endsWith('.env.example') ||
      filename.toLowerCase().endsWith('.env.template')) {
    return true;
  }
  return ALLOWED_EXTENSIONS.has(ext);
}

/**
 * Construit un snapshot structuré du projet
 * @param {string} projectRoot - Chemin absolu validé du projet
 * @returns {Promise<{rootName: string, files: Array, totalBytes: number, fileCount: number}>}
 */
async function buildProjectSnapshot(projectRoot) {
  const files = [];
  let totalBytes = 0;

  async function walk(currentDir) {
    let entries;
    try {
      entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    } catch (e) {
      // Dossier inaccessible — on ignore silencieusement
      return;
    }

    for (const entry of entries) {
      // Ignorer les dossiers exclus
      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        await walk(path.join(currentDir, entry.name));
        continue;
      }

      // Ignorer les fichiers secrets
      if (isSecretFile(entry.name)) continue;

      // Ignorer les extensions non autorisées
      if (!isAllowedExtension(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);

      let stat;
      try {
        stat = await fs.promises.stat(fullPath);
      } catch { continue; }

      // Ignorer les fichiers trop grands
      if (stat.size > MAX_FILE_BYTES) continue;

      // Vérifier la limite totale
      if (totalBytes + stat.size > MAX_TOTAL_BYTES) {
        throw Object.assign(
          new Error('PROJECT_SNAPSHOT_TOO_LARGE'),
          { code: 'PROJECT_SNAPSHOT_TOO_LARGE', totalBytes, maxBytes: MAX_TOTAL_BYTES }
        );
      }

      // Vérifier la limite de fichiers
      if (files.length >= MAX_FILE_COUNT) {
        throw Object.assign(
          new Error('PROJECT_SNAPSHOT_TOO_MANY_FILES'),
          { code: 'PROJECT_SNAPSHOT_TOO_MANY_FILES', count: files.length, max: MAX_FILE_COUNT }
        );
      }

      let content;
      try {
        content = await fs.promises.readFile(fullPath, 'utf8');
      } catch { continue; } // Fichier binaire ou inaccessible

      // Vérification basique : le contenu doit être lisible (pas binaire)
      if (content.includes('\x00')) continue;

      totalBytes += stat.size;

      const relativePath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');

      files.push({
        path: relativePath,
        content,
        size: stat.size
      });
    }
  }

  await walk(projectRoot);

  return {
    rootName:   path.basename(projectRoot),
    files,
    totalBytes,
    fileCount:  files.length
  };
}

/**
 * Valide un chemin projectRoot :
 *  - doit être dans un workspace autorisé
 *  - pas de traversée ..
 *  - doit exister
 *  - doit être un dossier
 */
function getAuthorizedWorkspaces() {
  const list = [
    path.resolve('e:\\v0reponses'),
    path.resolve('e:\\JahVISE-ZAI'),
    path.resolve('e:\\ZAI'),
    path.resolve('e:\\worldmodelv2'),
    '/var/www/tiger',
    '/var/www/tiger/backend',
    '/var/www/tiger/backend/v0saveprojets',
    '/var/projects',
    process.cwd(),
    path.resolve(process.cwd(), 'v0saveprojets'),
  ];
  if (global.WORKSPACE_DIR) {
    list.push(path.resolve(global.WORKSPACE_DIR));
  }
  return list;
}

function resolveAuthorizedProjectRoot(projectRoot) {
  if (!projectRoot || typeof projectRoot !== 'string') {
    throw Object.assign(new Error('projectRoot manquant'), { code: 'INVALID_PROJECT_ROOT' });
  }

  // Résoudre le chemin absolu (élimine les ..)
  const resolved = path.resolve(projectRoot);
  const normResolved = resolved.replace(/\\/g, '/').toLowerCase();

  // Vérifier contre les workspaces autorisés (insensible à la casse)
  const workspaces = getAuthorizedWorkspaces();
  const isAuthorized = workspaces.some(ws => {
    const normWs = path.resolve(ws).replace(/\\/g, '/').toLowerCase();
    return normResolved.startsWith(normWs);
  });
  
  if (!isAuthorized) {
    throw Object.assign(
      new Error(`Chemin non autorisé : ${resolved}`),
      { code: 'UNAUTHORIZED_PROJECT_ROOT' }
    );
  }

  // Vérifier l'existence
  if (!fs.existsSync(resolved)) {
    throw Object.assign(
      new Error(`Dossier introuvable : ${resolved}`),
      { code: 'PROJECT_ROOT_NOT_FOUND' }
    );
  }

  // Vérifier que c'est un dossier
  const stat = fs.statSync(resolved);
  if (!stat.isDirectory()) {
    throw Object.assign(
      new Error(`Le chemin n'est pas un dossier : ${resolved}`),
      { code: 'PROJECT_ROOT_NOT_DIRECTORY' }
    );
  }

  return resolved;
}

module.exports = { buildProjectSnapshot, resolveAuthorizedProjectRoot };
