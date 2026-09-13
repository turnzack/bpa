'use strict';

/**
 * SyntaxGate.js
 * ─────────────────────────────────────────────────────────────────
 * Première gate du pipeline.
 * Détecte les anomalies syntaxiques triviales AVANT que TypeScript
 * ou Vite/esbuild ne s'en charge, afin de bloquer immédiatement
 * les fichiers produits par un pipeline Legacy ou une réponse
 * Hermes incomplète.
 *
 * Règles vérifiées :
 *  1. Déclarations const/let/var sans initialiseur
 *     (ex: `const avatar4 =\nconst interiorImage`)
 *  2. Accolades { } non équilibrées
 *  3. Parenthèses ( ) non équilibrées
 *  4. Fichier se terminant par `=` ou `=>` (troncature)
 *  5. Contenu vide ou purement commenté
 * ─────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

// Extensions analysées par la gate
const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

// Dossiers exclus de l'analyse
const EXCLUDED_DIRS = new Set(['node_modules', '.next', 'dist', 'out', 'build', '.git']);

// ─── Helpers ────────────────────────────────────────────────────

function removeStringsAndComments(src) {
  // Supprime les chaînes entre guillemets (simples, doubles, backtick)
  // et les commentaires pour éviter les faux positifs
  return src
    .replace(/`[^`]*`/gs, '""')              // template literals
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')     // double-quoted strings
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")     // single-quoted strings
    .replace(/\/\*[\s\S]*?\*\//g, '')        // block comments
    .replace(/\/\/[^\n]*/g, '');             // line comments
}

function countBalance(src, open, close) {
  let depth = 0;
  for (const ch of src) {
    if (ch === open)  depth++;
    if (ch === close) depth--;
  }
  return depth;
}

// ─── Règles de détection ────────────────────────────────────────

/**
 * Règle 1 : déclaration `const/let/var x =` suivie directement
 * d'une autre déclaration (la valeur est absente).
 */
function detectIncompleteDeclarations(cleaned) {
  const pattern =
    /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*(?:\s*:\s*[A-Za-z_$<>[\]|&, ]+)?\s*=\s*(?=\b(?:const|let|var)\b)/gm;
  const matches = [];
  let m;
  while ((m = pattern.exec(cleaned)) !== null) {
    matches.push(m[0].trim());
  }
  return matches;
}

/**
 * Règle 2 & 3 : déséquilibre d'accolades ou de parenthèses.
 */
function detectImbalance(cleaned) {
  const errors = [];
  const braces = countBalance(cleaned, '{', '}');
  const parens = countBalance(cleaned, '(', ')');
  if (braces !== 0) errors.push({ code: 'UNBALANCED_BRACES', delta: braces });
  if (parens !== 0) errors.push({ code: 'UNBALANCED_PARENS', delta: parens });
  return errors;
}

/**
 * Règle 4 : fichier tronqué (se termine par `=` ou `=>`).
 */
function detectTrailingAssignment(cleaned) {
  const trimmed = cleaned.trimEnd();
  if (/=>?\s*$/.test(trimmed)) {
    return [{ code: 'TRAILING_ASSIGNMENT', hint: trimmed.slice(-40).trim() }];
  }
  return [];
}

/**
 * Règle 5 : fichier vide ou purement commenté.
 */
function detectEmptyContent(cleaned) {
  if (!cleaned.trim()) {
    return [{ code: 'EMPTY_FILE' }];
  }
  return [];
}

// ─── Analyse d'un fichier unique ────────────────────────────────

function analyzeFile(filePath) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return [{ code: 'FILE_READ_ERROR', message: e.message }];
  }

  const cleaned = removeStringsAndComments(raw);
  const fileErrors = [
    ...detectEmptyContent(cleaned),
    ...detectIncompleteDeclarations(cleaned),
    ...detectImbalance(cleaned),
    ...detectTrailingAssignment(cleaned),
  ];

  return fileErrors.map(err => ({ file: filePath, ...err }));
}

// ─── Collecte récursive des fichiers sources ─────────────────────

function collectSourceFiles(dir, found = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, found);
    } else if (SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      found.push(full);
    }
  }
  return found;
}

// ─── Interface Gate ─────────────────────────────────────────────

const SyntaxGate = {
  id: 'syntax',
  name: 'SyntaxGate',

  /**
   * @param {string} projectId
   * @param {{ projectPath?: string }} context
   * @returns {Promise<{ status: string, verified: boolean, mode: string, errors: object[] }>}
   */
  async run(projectId, context = {}) {
    const projectPath = context.projectPath;
    if (!projectPath || !fs.existsSync(projectPath)) {
      return {
        status:   'failed',
        verified: true,
        mode:     'real',
        errors:   [{ code: 'PROJECT_PATH_MISSING', projectId }]
      };
    }

    const srcDir   = path.join(projectPath, 'src');
    const scanRoot = fs.existsSync(srcDir) ? srcDir : projectPath;
    const files    = collectSourceFiles(scanRoot);

    const allErrors = [];
    for (const file of files) {
      const fileErrors = analyzeFile(file);
      allErrors.push(...fileErrors);
    }

    if (allErrors.length > 0) {
      console.error(
        `[SYNTAX-GATE] ❌ ${allErrors.length} anomalie(s) syntaxique(s) bloquante(s) détectée(s) dans ${projectId}.`
      );
      allErrors.forEach(e =>
        console.error(`  [${e.code}] ${e.file || ''}  ${e.hint || e.delta !== undefined ? `(delta=${e.delta})` : ''}`)
      );
      return {
        status:   'failed',
        verified: true,
        mode:     'real',
        errors:   allErrors
      };
    }

    console.log(`[SYNTAX-GATE] ✅ Aucune anomalie syntaxique dans ${projectId}.`);
    return {
      status:   'passed',
      verified: true,
      mode:     'real',
      errors:   []
    };
  }
};

module.exports = SyntaxGate;
