/**
 * IntentValidator — Contrats de validation des Intents (v0.10.0)
 *
 * Remplace Zod par une validation JS pure pour Electron.
 * Valide les payloads avant qu'ils n'atteignent les Skills.
 *
 * Usage :
 *   const { validate } = require('./intent-validator');
 *   const result = validate('PATCH_UI', payload);
 *   if (!result.ok) throw new Error(result.error);
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Schémas de validation par Intent
// ─────────────────────────────────────────────────────────────────────────────

const SCHEMAS = {

  /**
   * PATCH_UI : Patcher un composant React avec un design Stitch indexé.
   */
  PATCH_UI: {
    required: ['targetFile'],
    optional: ['templateId', 'instruction', 'originalCode'],
    rules: {
      targetFile: (v) => typeof v === 'string' && v.trim().length > 0
        ? null : 'targetFile doit être une chaîne non vide (chemin du fichier .tsx)',
      templateId: (v) => v === undefined || typeof v === 'string'
        ? null : 'templateId doit être une chaîne ou absent',
      instruction: (v) => v === undefined || typeof v === 'string'
        ? null : 'instruction doit être une chaîne ou absente',
    },
  },

  /**
   * INDEX_STITCH : Indexer un HTML Stitch dans la mémoire RAG.
   */
  INDEX_STITCH: {
    required: [],
    optional: ['htmlContent', 'filePath', 'templateId', 'templateName'],
    rules: {
      htmlContent: (v, payload) => {
        if (!v && !payload.filePath) return 'htmlContent ou filePath est obligatoire';
        if (v !== undefined && typeof v !== 'string') return 'htmlContent doit être une chaîne';
        return null;
      },
      filePath: (v, payload) => {
        if (!v && !payload.htmlContent) return 'htmlContent ou filePath est obligatoire';
        if (v !== undefined && typeof v !== 'string') return 'filePath doit être une chaîne';
        return null;
      },
      templateId: (v) => v === undefined || typeof v === 'string'
        ? null : 'templateId doit être une chaîne ou absent',
      templateName: (v) => v === undefined || typeof v === 'string'
        ? null : 'templateName doit être une chaîne ou absent',
    },
    // Règle croisée : au moins l'un des deux
    crossValidate: (payload) => {
      if (!payload.htmlContent && !payload.filePath) {
        return 'Au moins htmlContent ou filePath est requis pour INDEX_STITCH';
      }
      return null;
    },
  },

  /**
   * INSPECT_PROJECT : Analyser l'AST d'un fichier React.
   */
  INSPECT_PROJECT: {
    required: ['targetFile'],
    optional: [],
    rules: {
      targetFile: (v) => typeof v === 'string' && v.trim().length > 0
        ? null : 'targetFile est requis',
    },
  },

  /**
   * SEARCH_TEMPLATE : Recherche sémantique dans la mémoire RAG.
   */
  SEARCH_TEMPLATE: {
    required: ['query'],
    optional: ['topK', 'threshold'],
    rules: {
      query: (v) => typeof v === 'string' && v.trim().length > 0
        ? null : 'query est requis (texte de recherche)',
      topK: (v) => v === undefined || (Number.isInteger(v) && v > 0 && v <= 20)
        ? null : 'topK doit être un entier entre 1 et 20',
      threshold: (v) => v === undefined || (typeof v === 'number' && v >= 0 && v <= 1)
        ? null : 'threshold doit être un nombre entre 0 et 1',
    },
  },

  /**
   * APPLY_PATCH : Appliquer un patch de code généré sur un fichier.
   */
  APPLY_PATCH: {
    required: ['targetFile', 'updatedCode'],
    optional: ['backupPath'],
    rules: {
      targetFile: (v) => typeof v === 'string' && v.trim().length > 0
        ? null : 'targetFile est requis',
      updatedCode: (v) => typeof v === 'string' && v.trim().length > 0
        ? null : 'updatedCode est requis (code source complet)',
      backupPath: (v) => v === undefined || typeof v === 'string'
        ? null : 'backupPath doit être une chaîne ou absent',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Moteur de validation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valide un payload contre son schéma d'Intent.
 * @param {string} intent
 * @param {object} payload
 * @returns {{ ok: boolean, error?: string, sanitized?: object }}
 */
function validate(intent, payload) {
  const schema = SCHEMAS[intent];

  // Intent inconnu → on laisse passer (le router gère l'erreur)
  if (!schema) {
    return { ok: true, sanitized: payload };
  }

  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: `Le payload de l'intent "${intent}" doit être un objet.` };
  }

  const errors = [];

  // Vérification des champs requis
  for (const field of schema.required) {
    if (payload[field] === undefined || payload[field] === null) {
      errors.push(`Champ obligatoire manquant : "${field}"`);
    }
  }

  // Vérification des règles sur chaque champ
  if (schema.rules) {
    for (const [field, ruleFn] of Object.entries(schema.rules)) {
      if (payload[field] !== undefined || schema.required.includes(field)) {
        const err = ruleFn(payload[field], payload);
        if (err) errors.push(err);
      }
    }
  }

  // Validation croisée (si définie)
  if (schema.crossValidate) {
    const crossErr = schema.crossValidate(payload);
    if (crossErr) errors.push(crossErr);
  }

  if (errors.length > 0) {
    return { ok: false, error: `[VALIDATION ${intent}] ${errors.join(' | ')}` };
  }

  // Sanitisation : ne garder que les champs déclarés (sécurité)
  const allowed = new Set([...schema.required, ...schema.optional]);
  const sanitized = {};
  for (const [k, v] of Object.entries(payload)) {
    if (allowed.has(k)) sanitized[k] = v;
  }

  return { ok: true, sanitized };
}

/**
 * Liste tous les intents supportés et leurs champs requis.
 * Utile pour le debug / documentation auto.
 */
function getSchemaInfo() {
  return Object.entries(SCHEMAS).map(([intent, schema]) => ({
    intent,
    required: schema.required,
    optional: schema.optional,
  }));
}

module.exports = { validate, getSchemaInfo, SCHEMAS };
