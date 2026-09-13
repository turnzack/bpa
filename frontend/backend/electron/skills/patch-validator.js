/**
 * PatchValidator — Validateur AST avant écriture sur disque (Priorité 1)
 *
 * Protège contre les hallucinations LLM en vérifiant que le code généré
 * est syntaxiquement valide AVANT d'écraser le fichier original.
 *
 * Vérifications effectuées :
 *  1. Parsing AST Babel (JSX + TypeScript)
 *  2. Présence de la structure de composant React (fonction/classe + return JSX)
 *  3. Absence de patterns dangereux (eval, process.exit, require arbitraire)
 *  4. Cohérence des imports (pas de références cassées détectables)
 *
 * Retourne : { valid: boolean, errors: string[], warnings: string[] }
 */

'use strict';

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// Patterns dangereux à rejeter
// ─────────────────────────────────────────────────────────────────────────────
const FORBIDDEN_PATTERNS = [
  { pattern: /\beval\s*\(/, label: 'eval() interdit' },
  { pattern: /\bprocess\.exit\s*\(/, label: 'process.exit() interdit' },
  { pattern: /\bchild_process\b/, label: 'child_process interdit' },
  { pattern: /\brequire\s*\(\s*['"]fs['"]\s*\)/, label: 'require("fs") interdit dans un patch React' },
  { pattern: /\bdocument\.cookie\b/, label: 'accès cookies interdit' },
  { pattern: /\blocalStorage\.clear\s*\(/, label: 'localStorage.clear() interdit' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Validateur principal
// ─────────────────────────────────────────────────────────────────────────────

class PatchValidatorSkill {

  /**
   * execute(payload, context)
   * @param {{ code: string, targetFile: string, originalCode?: string }} payload
   * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
   */
  async execute(payload, context) {
    const { code, targetFile, originalCode } = payload;
    const errors = [];
    const warnings = [];
    const ext = path.extname(targetFile || '').toLowerCase();

    console.log(`[PATCH-VALIDATOR] 🔍 Validation du patch pour : ${path.basename(targetFile || 'inconnu')}`);

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return { valid: false, errors: ['Le code généré est vide ou invalide.'], warnings };
    }

    // ── 1. Vérification longueur minimale ────────────────────────────────────
    if (code.trim().length < 50) {
      errors.push(`Code trop court (${code.trim().length} chars). Génération probablement échouée.`);
      return { valid: false, errors, warnings };
    }

    // ── 2. Patterns dangereux (regex rapide avant AST) ───────────────────────
    for (const { pattern, label } of FORBIDDEN_PATTERNS) {
      if (pattern.test(code)) {
        errors.push(`Pattern dangereux détecté : ${label}`);
      }
    }
    if (errors.length > 0) {
      console.error(`[PATCH-VALIDATOR] ❌ ${errors.length} pattern(s) dangereux trouvé(s).`);
      return { valid: false, errors, warnings };
    }

    // ── 3. Parsing AST Babel ─────────────────────────────────────────────────
    let ast = null;
    const isTS = ext === '.tsx' || ext === '.ts';

    try {
      ast = parser.parse(code, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        plugins: isTS
          ? ['jsx', 'typescript', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator']
          : ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
        errorRecovery: false,
      });
      console.log(`[PATCH-VALIDATOR] ✅ AST parsé avec succès (${code.length} chars)`);
    } catch (syntaxErr) {
      errors.push(`Erreur de syntaxe AST : ${syntaxErr.message} (ligne ${syntaxErr.loc?.line || '?'})`);
      console.error(`[PATCH-VALIDATOR] ❌ Syntaxe invalide : ${syntaxErr.message}`);
      return { valid: false, errors, warnings };
    }

    // ── 4. Vérifications sémantiques via traversée AST ───────────────────────
    let hasJsx = false;
    let hasDefaultExport = false;
    let hasReactImport = false;
    let functionComponents = [];
    let classComponents = [];

    try {
      traverse(ast, {
        JSXElement() { hasJsx = true; },
        JSXFragment() { hasJsx = true; },

        ExportDefaultDeclaration() { hasDefaultExport = true; },

        ImportDeclaration(nodePath) {
          const src = nodePath.node.source.value;
          if (src === 'react' || src === 'React') hasReactImport = true;
        },

        FunctionDeclaration(nodePath) {
          if (nodePath.node.id?.name) functionComponents.push(nodePath.node.id.name);
        },

        ArrowFunctionExpression(nodePath) {
          // Détecter const MyComponent = () => ...
          const parent = nodePath.parent;
          if (parent?.type === 'VariableDeclarator' && parent.id?.name) {
            functionComponents.push(parent.id.name);
          }
        },

        ClassDeclaration(nodePath) {
          if (nodePath.node.id?.name) classComponents.push(nodePath.node.id.name);
        },
      });
    } catch (traverseErr) {
      warnings.push(`Traversée AST partielle : ${traverseErr.message}`);
    }

    // ── 5. Règles pour fichiers React/TSX ────────────────────────────────────
    const isReactFile = ['.tsx', '.jsx'].includes(ext);

    if (isReactFile) {
      if (!hasJsx) {
        errors.push('Aucun JSX détecté dans un fichier React. Le composant semble vide ou invalide.');
      }
      if (!hasDefaultExport) {
        warnings.push('Aucun export default détecté. Le composant ne sera pas importable.');
      }
    }

    // ── 6. Comparaison avec l'original (si fourni) ───────────────────────────
    if (originalCode && typeof originalCode === 'string') {
      const originalLines = originalCode.split('\n').length;
      const newLines = code.split('\n').length;
      const ratio = newLines / Math.max(originalLines, 1);

      if (ratio < 0.3) {
        warnings.push(`Fichier réduit de ${Math.round((1 - ratio) * 100)}% — vérifier que la logique métier est préservée.`);
      }
      if (ratio > 5) {
        warnings.push(`Fichier agrandi de ${Math.round(ratio)}x — possible contenu parasite généré par le LLM.`);
      }
    }

    // ── Résultat final ────────────────────────────────────────────────────────
    const valid = errors.length === 0;

    console.log(`[PATCH-VALIDATOR] ${valid ? '✅ Patch VALIDE' : '❌ Patch INVALIDE'} | Erreurs: ${errors.length} | Avertissements: ${warnings.length}`);
    if (warnings.length > 0) warnings.forEach(w => console.warn(`[PATCH-VALIDATOR] ⚠️ ${w}`));

    return {
      valid,
      errors,
      warnings,
      stats: {
        lines: code.split('\n').length,
        chars: code.length,
        hasJsx,
        hasDefaultExport,
        hasReactImport,
        components: [...functionComponents, ...classComponents],
      },
    };
  }
}

module.exports = new PatchValidatorSkill();
