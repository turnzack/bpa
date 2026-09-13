'use strict';

/**
 * RepairSchema.js
 * ─────────────────────────────────────────────────────────────────
 * Sprint 5 — Contrat JSON strict pour les réponses Hermes.
 *
 * Valide le JSON retourné par Hermes AVANT que RepairPlanner ou
 * PatchApplier n'en fassent quoi que ce soit.
 *
 * Structure attendue (schemaVersion: "2.0") :
 * {
 *   schemaVersion: "2.0",
 *   repairId: string,
 *   diagnosis: {
 *     diagnosticId: string,
 *     fingerprint: string
 *   },
 *   files: Array<{
 *     path: string,
 *     operation: "create" | "replace",
 *     content: string,
 *     expectedHash?: string   // obligatoire si operation === "replace"
 *   }>,
 *   dependencyRequests?: Array<{
 *     name: string,
 *     version?: string,
 *     reason: string
 *   }>,
 *   commands?: Array<"install" | "rebuild" | "typecheck" | "build">,
 *   validation?: any[],
 *   reason?: string
 * }
 * ─────────────────────────────────────────────────────────────────
 */

const SCHEMA_VERSION = '2.0';

const ALLOWED_ROOT_KEYS = new Set([
  'schemaVersion',
  'repairId',
  'diagnosis',
  'files',
  'dependencyRequests',
  'commands',
  'validation',
  'reason'
]);

const ALLOWED_FILE_KEYS = new Set([
  'path',
  'operation',
  'content',
  'expectedHash'
]);

const ALLOWED_DEPENDENCY_KEYS = new Set([
  'name',
  'version',
  'reason'
]);

const VALID_OPERATIONS = new Set(['create', 'replace']);
const VALID_COMMANDS   = new Set(['install', 'rebuild', 'typecheck', 'build']);

// ─── Helpers ────────────────────────────────────────────────────

function rejectExtraKeys(obj, allowedSet, context) {
  for (const key of Object.keys(obj)) {
    if (!allowedSet.has(key)) {
      throw Object.assign(
        new Error(`[RepairSchema] Propriété non autorisée "${key}" dans ${context}.`),
        { code: 'SCHEMA_ADDITIONAL_PROPERTY', field: key, context }
      );
    }
  }
}

function assertString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw Object.assign(
      new Error(`[RepairSchema] Le champ "${field}" doit être une chaîne non vide.`),
      { code: 'SCHEMA_FIELD_INVALID', field }
    );
  }
}

// ─── Validation principale ───────────────────────────────────────

function normalizeLLMAliases(plan, repairId, diagnostic) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return;

  // Normalisation racine
  if (plan.version && !plan.schemaVersion) {
    plan.schemaVersion = String(plan.version);
    delete plan.version;
  }
  if (!plan.schemaVersion) {
    plan.schemaVersion = SCHEMA_VERSION;
  }
  if (!plan.repairId) {
    plan.repairId = repairId;
  }
  if (!plan.diagnosis) {
    plan.diagnosis = {
      diagnosticId: diagnostic?.diagnosticId || `diag-${repairId}`,
      fingerprint: diagnostic?.fingerprint || 'sha256:0000000000000000000000000000000000000000000000000000000000000000'
    };
  } else if (typeof plan.diagnosis === 'object') {
    if (!plan.diagnosis.diagnosticId) {
      plan.diagnosis.diagnosticId = diagnostic?.diagnosticId || `diag-${repairId}`;
    }
    if (!plan.diagnosis.fingerprint) {
      plan.diagnosis.fingerprint = diagnostic?.fingerprint || 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
    }
  }

  if (diagnostic) {
    if (!diagnostic.diagnosticId) diagnostic.diagnosticId = plan.diagnosis.diagnosticId;
    if (!diagnostic.fingerprint) diagnostic.fingerprint = plan.diagnosis.fingerprint;
  }

  // Normalisation des dependencyRequests
  if (Array.isArray(plan.dependencyRequests)) {
    for (const dep of plan.dependencyRequests) {
      if (!dep || typeof dep !== 'object') continue;

      if (!dep.name && (dep.package || dep.module || dep.library || dep.specifier)) {
        dep.name = dep.package || dep.module || dep.library || dep.specifier;
      }
      delete dep.package;
      delete dep.module;
      delete dep.library;
      delete dep.specifier;

      if (!dep.reason && (dep.description || dep.purpose || dep.why || dep.comment)) {
        dep.reason = dep.description || dep.purpose || dep.why || dep.comment;
      }
      delete dep.description;
      delete dep.purpose;
      delete dep.why;
      delete dep.comment;

      if (!dep.reason || typeof dep.reason !== 'string' || !dep.reason.trim()) {
        dep.reason = `Ajout de la dépendance ${dep.name || 'requise'}`;
      }
    }
  }

  // Normalisation des fichiers
  if (Array.isArray(plan.files)) {
    for (const f of plan.files) {
      if (!f || typeof f !== 'object') continue;

      if (!f.path && (f.file || f.filePath || f.filename)) {
        f.path = f.file || f.filePath || f.filename;
      }
      delete f.file;
      delete f.filePath;
      delete f.filename;

      if (!f.operation && (f.type || f.action)) {
        const op = String(f.type || f.action).toLowerCase();
        if (['add', 'create', 'new'].includes(op)) f.operation = 'create';
        else if (['edit', 'update', 'replace', 'modify'].includes(op)) f.operation = 'replace';
      }
      delete f.type;
      delete f.action;

      if (!f.content && (f.code || f.text || f.body || f.newContent || f.fileContent || f.source || f.patchContent || f.modifiedContent || f.replacement || f.rawContent)) {
        f.content = f.code || f.text || f.body || f.newContent || f.fileContent || f.source || f.patchContent || f.modifiedContent || f.replacement || f.rawContent;
      }
      delete f.code;
      delete f.text;
      delete f.body;
      delete f.newContent;
      delete f.fileContent;
      delete f.source;
      delete f.patchContent;
      delete f.modifiedContent;
      delete f.replacement;
      delete f.rawContent;

      if (!f.expectedHash && (f.hash || f.sha256 || f.checksum)) {
        f.expectedHash = f.hash || f.sha256 || f.checksum;
      }
      delete f.hash;
      delete f.sha256;
      delete f.checksum;

      if (f.operation === 'replace' && (!f.expectedHash || typeof f.expectedHash !== 'string' || !f.expectedHash.trim())) {
        f.expectedHash = 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
      }
    }
  }

  // Normalisation des commandes (Support chaînes et objets)
  if (Array.isArray(plan.commands)) {
    const normalizedCmds = [];
    for (const cmd of plan.commands) {
      let raw = typeof cmd === 'string' ? cmd : (cmd?.name || cmd?.command || cmd?.cmd || cmd?.action || '');
      if (typeof raw !== 'string') continue;
      raw = raw.toLowerCase().trim();
      if (raw.includes('install') || raw.includes('add') || raw.includes('npm i') || raw.includes('pnpm i')) {
        normalizedCmds.push('install');
      } else if (raw.includes('typecheck') || raw.includes('tsc')) {
        normalizedCmds.push('typecheck');
      } else if (raw.includes('rebuild')) {
        normalizedCmds.push('rebuild');
      } else if (raw.includes('build')) {
        normalizedCmds.push('build');
      }
    }
    plan.commands = normalizedCmds;
  }
}

/**
 * Valide un plan JSON retourné par Hermes.
 * Lève une erreur enrichie si le plan est invalide.
 *
 * @param {object} plan    - L'objet JSON parsé
 * @param {string} repairId - L'ID de réparation attendu
 * @param {object} diagnostic - Le diagnostic courant
 * @returns {true} si tout est valide
 */
function validateRepairSchema(plan, repairId, diagnostic) {
  normalizeLLMAliases(plan, repairId, diagnostic);

  // 1. Type de base
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    throw Object.assign(
      new Error('[RepairSchema] Le plan doit être un objet JSON.'),
      { code: 'SCHEMA_NOT_AN_OBJECT' }
    );
  }

  // 2. Propriétés supplémentaires interdites à la racine
  rejectExtraKeys(plan, ALLOWED_ROOT_KEYS, 'root');

  // 3. schemaVersion
  if (plan.schemaVersion !== SCHEMA_VERSION) {
    throw Object.assign(
      new Error(`[RepairSchema] schemaVersion invalide : "${plan.schemaVersion}", attendu "${SCHEMA_VERSION}".`),
      { code: 'SCHEMA_VERSION_MISMATCH' }
    );
  }

  // 4. repairId (auto-correction tolérée avec warn)
  assertString(plan.repairId, 'repairId');
  if (plan.repairId !== repairId) {
    console.warn(
      `[RepairSchema] repairId incohérent (${plan.repairId} ≠ ${repairId}). Auto-correction.`
    );
    plan.repairId = repairId;
  }

  // 5. diagnosis
  if (!plan.diagnosis || typeof plan.diagnosis !== 'object') {
    throw Object.assign(
      new Error('[RepairSchema] Le champ "diagnosis" est manquant ou malformé.'),
      { code: 'SCHEMA_DIAGNOSIS_REQUIRED' }
    );
  }
  assertString(plan.diagnosis.diagnosticId, 'diagnosis.diagnosticId');
  assertString(plan.diagnosis.fingerprint,  'diagnosis.fingerprint');

  if (plan.diagnosis.diagnosticId !== diagnostic.diagnosticId) {
    throw Object.assign(
      new Error(`[RepairSchema] diagnosticId incohérent (${plan.diagnosis.diagnosticId} ≠ ${diagnostic.diagnosticId}).`),
      { code: 'SCHEMA_DIAGNOSTIC_ID_MISMATCH' }
    );
  }
  if (plan.diagnosis.fingerprint !== diagnostic.fingerprint) {
    throw Object.assign(
      new Error('[RepairSchema] Fingerprint du diagnostic incohérent.'),
      { code: 'SCHEMA_FINGERPRINT_MISMATCH' }
    );
  }

  // 6. files
  const files = Array.isArray(plan.files) ? plan.files : [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    if (!f || typeof f !== 'object') {
      throw Object.assign(
        new Error(`[RepairSchema] files[${i}] n'est pas un objet.`),
        { code: 'SCHEMA_FILE_NOT_OBJECT', index: i }
      );
    }
    rejectExtraKeys(f, ALLOWED_FILE_KEYS, `files[${i}]`);
    assertString(f.path,      `files[${i}].path`);
    assertString(f.operation, `files[${i}].operation`);
    assertString(f.content,   `files[${i}].content`);

    // Slashes Windows → Unix
    f.path = f.path.replace(/\\/g, '/');

    if (!VALID_OPERATIONS.has(f.operation)) {
      throw Object.assign(
        new Error(`[RepairSchema] Opération interdite "${f.operation}" dans files[${i}].`),
        { code: 'SCHEMA_INVALID_OPERATION', index: i }
      );
    }
    if (f.operation === 'replace' && !f.expectedHash) {
      throw Object.assign(
        new Error(`[RepairSchema] "expectedHash" obligatoire pour replace dans files[${i}].`),
        { code: 'SCHEMA_EXPECTED_HASH_REQUIRED', index: i }
      );
    }
  }

  // 7. dependencyRequests (optionnel)
  if (plan.dependencyRequests !== undefined) {
    if (!Array.isArray(plan.dependencyRequests)) {
      throw Object.assign(
        new Error('[RepairSchema] "dependencyRequests" doit être un tableau.'),
        { code: 'SCHEMA_DEPENDENCY_REQUESTS_NOT_ARRAY' }
      );
    }
    for (let i = 0; i < plan.dependencyRequests.length; i++) {
      const dep = plan.dependencyRequests[i];
      rejectExtraKeys(dep, ALLOWED_DEPENDENCY_KEYS, `dependencyRequests[${i}]`);
      assertString(dep.name,   `dependencyRequests[${i}].name`);
      assertString(dep.reason, `dependencyRequests[${i}].reason`);
    }
  }

  // 8. commands (optionnel)
  if (plan.commands !== undefined) {
    if (!Array.isArray(plan.commands)) {
      throw Object.assign(
        new Error('[RepairSchema] "commands" doit être un tableau.'),
        { code: 'SCHEMA_COMMANDS_NOT_ARRAY' }
      );
    }
    for (const cmd of plan.commands) {
      if (!VALID_COMMANDS.has(cmd)) {
        throw Object.assign(
          new Error(`[RepairSchema] Commande interdite : "${cmd}".`),
          { code: 'SCHEMA_COMMAND_FORBIDDEN', command: cmd }
        );
      }
    }
  }

  return true;
}

/**
 * Extrait et valide le JSON depuis la réponse brute d'Hermes
 * (supporte les blocs ```json ... ``` ou le JSON brut).
 */
function parseAndValidateHermesResponse(rawResponse, repairId, diagnostic) {
  const content = typeof rawResponse === 'string'
    ? rawResponse
    : rawResponse?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw Object.assign(
      new Error('[RepairSchema] Hermes n\'a retourné aucun contenu.'),
      { code: 'HERMES_EMPTY_RESPONSE' }
    );
  }

  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonString = jsonMatch ? jsonMatch[1].trim() : trimmed;

  let plan;
  try {
    plan = JSON.parse(jsonString);
  } catch (e) {
    throw Object.assign(
      new Error(`[RepairSchema] Hermes n'a pas retourné un JSON valide : ${e.message}`),
      { code: 'HERMES_INVALID_JSON', raw: jsonString.slice(0, 200) }
    );
  }

  validateRepairSchema(plan, repairId, diagnostic);
  return plan;
}

module.exports = {
  SCHEMA_VERSION,
  validateRepairSchema,
  parseAndValidateHermesResponse
};
