'use strict';
/**
 * TIGER-010/011/012/013/014 — Extension Chrome : Parseur de Contrat Projet
 * extension/parsers/project-contract-parser.js
 *
 * Extrait le contrat JSON depuis la réponse DeepSeek (markdown/texte brut).
 * RÈGLE : Ce module ne lance AUCUNE commande. Il parse et valide uniquement.
 */

/**
 * Extrait le premier bloc JSON valide d'un texte.
 * Gère les blocs ```json ... ``` et les JSON inline.
 * @param {string} text
 * @returns {object|null}
 */
function extractJsonBlock(text) {
  if (!text || typeof text !== 'string') return null;

  // Tentative 1 : bloc ```json ... ```
  const fenceMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]); } catch {}
  }

  // Tentative 2 : JSON inline (premier { ... })
  const startIdx = text.indexOf('{');
  if (startIdx !== -1) {
    // Cherche la fermeture correspondante
    let depth = 0;
    for (let i = startIdx; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') {
        depth--;
        if (depth === 0) {
          try { return JSON.parse(text.slice(startIdx, i + 1)); } catch {}
          break;
        }
      }
    }
  }

  return null;
}

/**
 * Valide les champs obligatoires d'un contrat.
 * @param {object} contract
 * @returns {{ ok: boolean, errors: string[] }}
 */
function validateRequiredFields(contract) {
  const errors = [];
  if (!contract.projectType) errors.push('projectType manquant');
  if (!contract.dependencies || typeof contract.dependencies !== 'object') errors.push('dependencies manquant ou invalide');
  if (contract.files && !Array.isArray(contract.files)) errors.push('files doit être un tableau');
  return { ok: errors.length === 0, errors };
}

/**
 * Sépare les dépendances en 3 catégories si elles arrivent dans un tableau plat.
 * @param {object} deps
 * @returns {{ expo: string[], native: string[], runtime: string[], dev: string[] }}
 */
function normalizeDependencies(deps) {
  if (!deps || typeof deps !== 'object') return { expo: [], native: [], runtime: [], dev: [] };
  return {
    expo:    Array.isArray(deps.expo)    ? deps.expo    : [],
    native:  Array.isArray(deps.native)  ? deps.native  : [],
    runtime: Array.isArray(deps.runtime) ? deps.runtime : [],
    dev:     Array.isArray(deps.dev)     ? deps.dev     : [],
  };
}

/**
 * Parse et valide le contrat projet depuis une réponse DeepSeek brute.
 * @param {string} rawText  Texte brut capturé depuis DeepSeek Chat Web
 * @returns {{ success: boolean, contract?: object, error?: string, errors?: string[] }}
 */
function parseProjectContract(rawText) {
  // 1. Extraction du JSON
  const raw = extractJsonBlock(rawText);
  if (!raw) {
    return { success: false, error: 'Aucun bloc JSON valide trouvé dans la réponse DeepSeek.' };
  }

  // 2. Validation des champs obligatoires
  const { ok, errors } = validateRequiredFields(raw);
  if (!ok) {
    return { success: false, error: `Contrat incomplet : ${errors.join(', ')}`, errors };
  }

  // 3. Normalisation
  const contract = {
    schemaVersion: raw.schemaVersion || '1.0',
    projectId:     raw.projectId     || `project-${Date.now()}`,
    projectType:   raw.projectType,
    stack:         raw.stack         || {},
    dependencies:  normalizeDependencies(raw.dependencies),
    mcpServers:    Array.isArray(raw.mcpServers) ? raw.mcpServers : [],
    files:         Array.isArray(raw.files)      ? raw.files      : [],
    commands:      Array.isArray(raw.commands)   ? raw.commands   : [],
    nextPhase:     raw.nextPhase     || null,
  };

  return { success: true, contract };
}

/**
 * Parse les dépendances depuis un texte libre (fallback si le JSON est absent).
 * @param {string} text
 * @returns {{ expo: string[], native: string[], runtime: string[], dev: string[] }}
 */
function parseDependenciesFromText(text) {
  const result = { expo: [], native: [], runtime: [], dev: [] };
  if (!text) return result;

  // Cherche des patterns comme "native: [...]" ou "dependencies.native: [...]"
  const patterns = [
    { key: 'native',  re: /(?:native|expo)\s*[:=]\s*\[([^\]]+)\]/gi },
    { key: 'runtime', re: /(?:runtime|js)\s*[:=]\s*\[([^\]]+)\]/gi },
    { key: 'dev',     re: /(?:dev|devDependencies)\s*[:=]\s*\[([^\]]+)\]/gi },
  ];

  for (const { key, re } of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const pkgs = m[1].split(',')
        .map(p => p.trim().replace(/['"]/g, ''))
        .filter(p => p.length > 0 && !p.includes(' '));
      result[key].push(...pkgs);
    }
  }

  return result;
}

module.exports = { parseProjectContract, parseDependenciesFromText, extractJsonBlock, normalizeDependencies };
