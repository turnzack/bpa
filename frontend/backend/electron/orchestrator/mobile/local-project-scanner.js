const fs = require('fs');
const path = require('path');

// Limites du scanner (MVP)
const DEFAULT_SCAN_LIMITS = {
  maxFiles: 10000,
  maxTotalBytes: 100000000,
  maxFileBytes: 1000000,
  maxDepth: 12,
  maxTextBytesPerCategory: 120000
};

// Exclusions par défaut
const EXCLUDED_DIRECTORIES = new Set([
  "node_modules", ".git", ".next", "dist", "build", "coverage", 
  ".cache", ".turbo", ".vercel", "v0saveprojets", "prd_packs", 
  "target", "bin", "obj"
]);

// Exclusions supplémentaires (Secrets et Binaires)
const EXCLUDED_FILES = [
  '.env', '.env.local', '.env.development', '.env.production',
  '.pem', '.key', '.p12', '.pfx', '.crt', 'id_rsa', 'id_ed25519',
  'credentials.json', 'service-account.json', '.DS_Store'
];

/**
 * Assure que le chemin candidat est bien contenu dans le dossier racine.
 * Évite les attaques par Directory Traversal (../).
 */
function assertInsideRoot(rootPath, candidatePath) {
  const root = path.resolve(rootPath);
  const candidate = path.resolve(candidatePath);
  const relative = path.relative(root, candidate);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Chemin situé hors du dossier autorisé.");
  }
  return candidate;
}

/**
 * Détecte si le nom du fichier indique un secret à masquer
 */
function isSecretFile(filename) {
  return EXCLUDED_FILES.some(ex => filename === ex || filename.endsWith(ex));
}

/**
 * Scan sécurisé et classification
 */
function scanLocalProject(rootPath, limits = DEFAULT_SCAN_LIMITS) {
  const root = path.resolve(rootPath);
  if (!fs.existsSync(root)) {
    throw new Error(`Le dossier source n'existe pas : ${root}`);
  }

  const report = {
    scanId: Date.now().toString(),
    rootName: path.basename(root),
    fileCount: 0,
    totalBytes: 0,
    excludedDirectories: [],
    skippedFiles: [],
    files: []
  };

  function walkDir(dir, depth = 0) {
    if (depth > limits.maxDepth) return;
    if (report.fileCount >= limits.maxFiles) return;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (report.fileCount >= limits.maxFiles) break;

      const fullPath = path.join(dir, entry.name);
      
      // Validation de sécurité absolue
      try {
        assertInsideRoot(root, fullPath);
      } catch {
        continue;
      }

      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name)) {
          report.excludedDirectories.push(entry.name);
          continue;
        }
        walkDir(fullPath, depth + 1);
      } else if (entry.isFile()) {
        if (isSecretFile(entry.name)) {
          report.skippedFiles.push({ path: fullPath, reason: 'secret-file' });
          continue;
        }

        try {
          const stats = fs.statSync(fullPath);
          if (stats.size > limits.maxFileBytes) {
            report.skippedFiles.push({ path: fullPath, reason: 'too-large' });
            continue;
          }

          report.totalBytes += stats.size;
          if (report.totalBytes > limits.maxTotalBytes) {
            report.skippedFiles.push({ path: fullPath, reason: 'max-total-bytes-reached' });
            break;
          }

          report.fileCount++;
          report.files.push({
            name: entry.name,
            relativePath: path.relative(root, fullPath).replace(/\\/g, '/'),
            absolutePath: fullPath,
            size: stats.size
          });
        } catch (e) {
          report.skippedFiles.push({ path: fullPath, reason: 'read-error' });
        }
      }
    }
  }

  walkDir(root);
  return report;
}

/**
 * Construit la matrice contextuelle à envoyer à l'Agent Hermes
 */
function buildProjectMatrix(report) {
  // Sélection des fichiers P0 et P1 pour le contexte
  const p0_p1_patterns = ['package.json', 'README.md', 'schema.prisma', 'next.config', 'tailwind.config', 'App.tsx', 'page.tsx', 'layout.tsx', 'main.tsx'];
  
  let keyFileContents = '';
  const architectureTree = report.files.map(f => f.relativePath).slice(0, 100).join('\n'); // Arborescence simplifiée

  for (const file of report.files) {
    const isPriority = p0_p1_patterns.some(p => file.relativePath.includes(p));
    // Priorité sur les scripts pour la logique métier
    const isScript = file.name.endsWith('.py') || file.name.endsWith('.bat') || file.name.endsWith('.sh');

    if (isPriority || isScript) {
      try {
        let content = fs.readFileSync(file.absolutePath, 'utf8');
        // Truncate to avoid context limit (max 2000 chars per file for matrix)
        if (content.length > 2000) content = content.slice(0, 2000) + '\n...[TRUNCATED]';
        keyFileContents += `\n\n### <UNTRUSTED_LEGACY_SOURCE path="${file.relativePath}">\n\`\`\`\n${content}\n\`\`\`\n</UNTRUSTED_LEGACY_SOURCE>`;
      } catch {}
    }
  }

  return {
    architectureTree,
    keyFileContents,
    stats: {
      fileCount: report.fileCount,
      totalBytes: report.totalBytes,
      excludedCount: report.skippedFiles.length + report.excludedDirectories.length
    }
  };
}

module.exports = {
  scanLocalProject,
  buildProjectMatrix,
  assertInsideRoot
};
