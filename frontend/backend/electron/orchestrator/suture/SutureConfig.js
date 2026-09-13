const path = require('path');

// --- DÉFINITION DES FLAGS D'ENVIRONNEMENT ---
const SUTURE_V2_ENABLED = process.env.SUTURE_V2_ENABLED === "1" || true; // Actif par défaut pour le dév
const SUTURE_LEGACY_ENABLED = process.env.SUTURE_LEGACY_ENABLED === "1" || false;

// --- DÉFINITION DES CHEMINS ---
const PROJECTS_ROOT = path.resolve(__dirname, '../../../v0saveprojets');

// --- ÉTATS DU WORKFLOW SUTURE ---
const SUTURE_STATES = Object.freeze({
  REQUESTED: "requested",
  DIAGNOSING: "diagnosing",
  PLAN_READY: "plan_ready",
  PATCHING: "patching",
  INSTALLING: "installing",
  VALIDATING: "validating",
  REPAIRING: "repairing",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REJECTED: "rejected",
  ROLLED_BACK: "rolled_back"
});

// --- LIMITES OPÉRATIONNELLES ---
const SUTURE_LIMITS = Object.freeze({
  maxAttempts: 4,
  maxFilesPerAttempt: 12,
  maxCommandsPerAttempt: 3,
  commandTimeoutMs: 180000,
  validationTimeoutMs: 120000,
  maxPatchBytes: 1024 * 1024
});

// --- FICHIERS STRICTEMENT PROTÉGÉS ---
const PROTECTED_FILES = new Set([
  ".git",
  ".env",
  ".env.local",
  "active",
  "main.js",
  "electron/main.js",
  "electron/orchestrator/SutureEngine.js"
]);

// --- EXTENSIONS AUTORISÉES POUR LA MODIFICATION ---
const ALLOWED_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".json",
  ".html"
]);

module.exports = {
  SUTURE_V2_ENABLED,
  SUTURE_LEGACY_ENABLED,
  PROJECTS_ROOT,
  SUTURE_STATES,
  SUTURE_LIMITS,
  PROTECTED_FILES,
  ALLOWED_EXTENSIONS
};
