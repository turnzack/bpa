// TIGER-003 — Contrat JSON Canonique v1.0
// shared/schemas/project-contract-schema.js
// Validation Zod du contrat projet (version JS sans dépendance Zod)
'use strict';

// Allowlist des types de projets supportés
const VALID_PROJECT_TYPES = ['react-native-expo', 'expo-router', 'react-native-bare'];

// Allowlist des dépendances natives Expo autorisées
const ALLOWED_NATIVE = new Set([
  'expo-router', 'expo-status-bar', 'expo-constants', 'expo-font',
  'expo-splash-screen', 'expo-camera', 'expo-image-picker', 'expo-location',
  'expo-notifications', 'expo-haptics', 'expo-linear-gradient', 'expo-blur',
  'expo-av', 'expo-file-system', 'expo-asset', 'expo-modules-core',
  'react-native-reanimated', 'react-native-gesture-handler',
  'react-native-safe-area-context', 'react-native-screens',
  'react-native-maps', 'react-native-svg',
]);

// Allowlist des dépendances runtime
const ALLOWED_RUNTIME = new Set([
  'nativewind', 'zustand', '@tanstack/react-query',
  '@expo/vector-icons', 'axios', 'date-fns', 'zod',
  'react-native-mmkv', '@react-native-async-storage/async-storage',
  'react-native-paper', 'react-native-elements',
]);

// Allowlist des dépendances dev
const ALLOWED_DEV = new Set([
  'typescript', 'tailwindcss', 'eslint', 'prettier',
  '@typescript-eslint/eslint-plugin', '@typescript-eslint/parser',
  'eslint-plugin-react', 'eslint-plugin-react-native',
  '@types/react', '@types/react-native', 'jest', '@testing-library/react-native',
]);

// Patterns interdits dans les noms de dépendances
const BANNED_PATTERNS = [
  /^\.\.\//,        // chemins relatifs
  /^file:/,         // protocole file:
  /^git\+ssh:\/\//, // protocole git+ssh
  /^git\+http/,     // protocole git+http
  /^https?:\/\//,   // URLs directes
  /^github:/,       // raccourci GitHub
];

/**
 * Valide un nom de dépendance.
 */
function validateDependencyName(dep) {
  if (typeof dep !== 'string' || dep.trim().length === 0) return { ok: false, error: `Dépendance invalide : ${JSON.stringify(dep)}` };
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(dep)) return { ok: false, error: `Dépendance interdite (chemin/URL) : ${dep}` };
  }
  return { ok: true };
}

/**
 * Valide le contrat projet complet.
 * @param {object} contract
 * @returns {{ valid: boolean, errors: string[], warnings: string[], contract: object|null }}
 */
function validateContract(contract) {
  const errors   = [];
  const warnings = [];

  if (!contract || typeof contract !== 'object') {
    return { valid: false, errors: ['Contrat manquant ou non-objet'], warnings, contract: null };
  }

  // schemaVersion
  if (!contract.schemaVersion) warnings.push('schemaVersion absent (recommandé : "1.0")');

  // projectId
  if (!contract.projectId || typeof contract.projectId !== 'string') {
    errors.push('projectId obligatoire (string)');
  } else if (!/^[a-z0-9-_]+$/i.test(contract.projectId)) {
    errors.push(`projectId invalide : ${contract.projectId} (alphanumérique + tirets uniquement)`);
  }

  // projectType
  if (!contract.projectType) {
    errors.push('projectType obligatoire');
  } else if (!VALID_PROJECT_TYPES.includes(contract.projectType)) {
    errors.push(`projectType invalide : ${contract.projectType}. Valeurs acceptées : ${VALID_PROJECT_TYPES.join(', ')}`);
  }

  // dependencies
  if (!contract.dependencies || typeof contract.dependencies !== 'object') {
    errors.push('dependencies obligatoire (objet avec native, runtime, dev)');
  } else {
    const { native = [], runtime = [], dev = [], expo = [] } = contract.dependencies;

    for (const dep of [...(expo || []), ...(native || [])]) {
      const v = validateDependencyName(dep);
      if (!v.ok) errors.push(v.error);
      else if (!ALLOWED_NATIVE.has(dep)) warnings.push(`Dépendance native non dans l'allowlist : ${dep}`);
    }
    for (const dep of (runtime || [])) {
      const v = validateDependencyName(dep);
      if (!v.ok) errors.push(v.error);
      else if (!ALLOWED_RUNTIME.has(dep)) warnings.push(`Dépendance runtime non dans l'allowlist : ${dep}`);
    }
    for (const dep of (dev || [])) {
      const v = validateDependencyName(dep);
      if (!v.ok) errors.push(v.error);
      else if (!ALLOWED_DEV.has(dep)) warnings.push(`Dépendance dev non dans l'allowlist : ${dep}`);
    }
  }

  // files
  if (contract.files !== undefined) {
    if (!Array.isArray(contract.files)) {
      errors.push('files doit être un tableau');
    } else {
      for (const f of contract.files) {
        if (!f.path || typeof f.path !== 'string') { errors.push(`Fichier sans path valide : ${JSON.stringify(f)}`); continue; }
        if (f.path.includes('..')) errors.push(`Path traversal interdit dans files : ${f.path}`);
        if (f.path.startsWith('/') || /^[A-Z]:/i.test(f.path)) errors.push(`Chemin absolu interdit : ${f.path}`);
        if (!f.content || typeof f.content !== 'string') warnings.push(`Fichier sans contenu : ${f.path}`);
      }
    }
  }

  // commands — intentions uniquement
  if (contract.commands !== undefined && !Array.isArray(contract.commands)) {
    errors.push('commands doit être un tableau d\'intentions (strings)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    contract: errors.length === 0 ? contract : null,
  };
}

/**
 * Valide et parse le contrat.
 * Lève une Error si invalide.
 */
function parseContract(raw) {
  const result = validateContract(raw);
  if (!result.valid) throw Object.assign(new Error('Contrat projet invalide'), { code: 'INVALID_CONTRACT', errors: result.errors });
  return result.contract;
}

module.exports = { validateContract, parseContract, ALLOWED_NATIVE, ALLOWED_RUNTIME, ALLOWED_DEV, VALID_PROJECT_TYPES };
