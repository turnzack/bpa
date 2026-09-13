const { SUTURE_LIMITS, PROTECTED_FILES } = require('./SutureConfig');

const VALID_OPERATIONS = new Set(["create", "replace"]);
const VALID_COMMANDS = new Set(["install", "rebuild", "typecheck", "build"]);

// ─── GRADE GOLD : Fichiers d'architecture protégés contre toute réécriture complète ───
// Ces fichiers ne peuvent être modifiés que par patch minimal (operation: "replace" + expectedHash + diff minimal).
const PROTECTED_ARCHITECTURE_FILES = new Set([
  "vite.config.ts",
  "vite.config.js",
  "tsconfig.json",
  "tsconfig.node.json",
  "src/App.tsx",
  "src/main.tsx",
  "src/pageRegistry.ts"
]);

// ─── GRADE GOLD : Gate Alias — Vite ET TypeScript doivent pointer vers src/ (cible vérifiée) ───
function validateAliasContract({ viteConfig, tsConfig }) {
  const viteAlias = viteConfig?.resolve?.alias;
  const tsPaths   = tsConfig?.compilerOptions?.paths;

  // Supporte les deux formes : objet { "@": "..." } et tableau [{ find: "@", replacement: "..." }]
  const viteTarget = Array.isArray(viteAlias)
    ? viteAlias.find((entry) => entry.find === "@")?.replacement
    : viteAlias?.["@"];

  const tsTarget = tsPaths?.["@/*"]?.[0];

  const validVite =
    typeof viteTarget === "string" &&
    (
      viteTarget.includes("path.resolve") ||
      viteTarget.endsWith("/src") ||
      viteTarget.endsWith("\\src")
    );

  const validTs =
    tsTarget === "src/*" ||
    tsTarget === "./src/*";

  if (!validVite || !validTs) {
    throw Object.assign(
      new Error("Alias @ invalide ou incohérent : Vite et TypeScript doivent tous deux pointer vers src/."),
      { code: "ALIAS_CONTRACT_INVALID", viteTarget, tsTarget }
    );
  }

  return true;
}

// ─── GRADE GOLD : Gate Routage — App.tsx doit utiliser pageRegistry + React.lazy + Suspense ───
// requireRegistry=false permet de ne pas bloquer les projets avec un routeur custom
function validateRoutingContract(appTsxContent, options = {}) {
  const { requireRegistry = true } = options;
  if (!appTsxContent) return true;

  const hasFallback    = /Application pr.te|<h1>[^<]*<\/h1>/i.test(appTsxContent);
  const hasPageRegistry = /pageRegistry/i.test(appTsxContent);
  const hasSuspense    = /\bSuspense\b/.test(appTsxContent);
  const hasLazy        = /\blazy\b/.test(appTsxContent);

  if (hasFallback) {
    throw Object.assign(
      new Error("App.tsx interdit : fallback vide ou h1 de test détecté. Suture ne peut pas remplacer le routeur par un composant bouchon."),
      { code: "APP_TSX_FALLBACK_FORBIDDEN" }
    );
  }

  if (requireRegistry && (!hasPageRegistry || !hasSuspense || !hasLazy)) {
    throw Object.assign(
      new Error("Contrat de routage incomplet : pageRegistry, Suspense et lazy sont obligatoires pour ce projet."),
      { code: "APP_TSX_ROUTING_MISSING" }
    );
  }

  return true;
}

// ─── GRADE GOLD : Gate tsconfig.json — seul un patch alias minimal est autorisé ───
function validateTsConfigAliasPatch(file) {
  if (file.path.replace(/\\/g, "/") !== "tsconfig.json") return;

  if (file.operation !== "replace" || !file.expectedHash) {
    throw Object.assign(
      new Error("tsconfig.json exige un patch alias minimal avec expectedHash."),
      { code: "TSCONFIG_ALIAS_PATCH_INVALID" }
    );
  }

  const hasAlias =
    (file.content || "").includes('"@/*"') ||
    (file.content || "").includes("'@/*'");

  if (!hasAlias) {
    throw Object.assign(
      new Error("Le patch tsconfig.json ne contient pas paths @/*. Seul l'ajout de l'alias @ est autorisé."),
      { code: "TSCONFIG_ALIAS_MISSING" }
    );
  }
}

// ─── GRADE GOLD : Gate scope Phase 4 — seuls les fichiers de logique métier sont autorisés ───
const LOGIC_PATHS = [
  "src/types/",
  "src/store/",
  "src/stores/",
  "src/services/",
  "src/api/",
  "src/hooks/"
];

function isLogicPath(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  return LOGIC_PATHS.some((prefix) => normalized.startsWith(prefix));
}

function validateLogicWiringScope(file) {
  const normalized = file.path.replaceAll("\\", "/");

  // CSS interdit en phase de câblage métier
  if (/\.css$/i.test(normalized)) {
    throw Object.assign(
      new Error(`Modification CSS interdite pendant le câblage métier : ${file.path}`),
      { code: "LOGIC_WIRING_CSS_MODIFICATION_FORBIDDEN", file: file.path }
    );
  }

  if (isLogicPath(normalized)) return true;

  // Pages autorisées pour les bindings (imports + handlers uniquement)
  const allowedBindingFiles = [
    "src/pages/Dashboard.tsx",
    "src/pages/DashboardPage.tsx",
    "src/pages/AnalyzerPage.tsx",
    "src/App.tsx",
    "src/pageRegistry.ts"
  ];

  if (allowedBindingFiles.includes(normalized)) return true;

  // Autres pages src/pages/ autorisées en lecture/binding ciblé
  if (normalized.startsWith("src/pages/")) return true;

  throw Object.assign(
    new Error(`Fichier hors scope Phase 4 : ${file.path}`),
    { code: "LOGIC_WIRING_FILE_OUT_OF_SCOPE" }
  );
}

const REPAIR_SCOPE_RULES = {
  VITE_MISSING_IMPORT: {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    protectedFiles: ["src/index.css"]
  },
  MISSING_LOCAL_IMPORT: {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    protectedFiles: ["src/index.css"]
  },
  DEFAULT_EXPORT_MISSING: {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    protectedFiles: ["src/index.css"]
  },
  NAMED_EXPORT_MISSING: {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    protectedFiles: ["src/index.css"]
  },
  RUNTIME_NOT_READY: {
    maxFiles: 10,
    allowedFiles: ["any-src", "vite.config.ts"],
    protectedFiles: ["src/index.css"]
  },
  RUNTIME_PING_FAILED: {
    maxFiles: 10,
    allowedFiles: ["any-src", "vite.config.ts"],
    protectedFiles: ["src/index.css"]
  },
  VITE_STARTUP_FAILED: {
    maxFiles: 10,
    allowedFiles: ["any-src", "vite.config.ts", "package.json"],
    protectedFiles: ["src/index.css"]
  },
  CLI_BUILD_ERROR: {
    maxFiles: 10,
    allowedFiles: ["any-src", "vite.config.ts"],
    protectedFiles: ["src/index.css"]
  },
  TYPECHECK_FAILED: {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    protectedFiles: ["src/index.css"]
  },
  BUILD_FAILED: {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    protectedFiles: ["src/index.css"]
  }
};

function isExternalModuleImport(importName) {
  return (
    !importName.startsWith(".") &&
    !importName.startsWith("/") &&
    !importName.startsWith("@/")
  );
}

function resolveScopeRule(diagnostic) {
  if (diagnostic.code === "TYPESCRIPT_MODULE_NOT_FOUND" && isExternalModuleImport(diagnostic.import || "")) {
    return {
      maxFiles: 10,
      allowedFiles: ["any-src"],
      dependencyRequestsOnly: false
    };
  }

  if (diagnostic.code === "TYPESCRIPT_MODULE_NOT_FOUND") {
    return {
      maxFiles: 10,
      allowedFiles: ["any-src"],
      dependencyRequestsOnly: false
    };
  }

  return REPAIR_SCOPE_RULES[diagnostic.code] || {
    maxFiles: 10,
    allowedFiles: ["any-src"],
    dependencyRequestsOnly: false
  };
}

function isAllowedScopeFile({ filePath, diagnostic, scopeRule }) {
  const normalizedFile = filePath.replace(/\\/g, "/");

  if (scopeRule.allowedFiles.includes(normalizedFile)) {
    return true;
  }

  if (scopeRule.allowedFiles.includes("diagnostic-file")) {
    if (!diagnostic?.file || normalizedFile === diagnostic.file) return true;
  }

  if (scopeRule.allowedFiles.includes("any-src")) {
    return normalizedFile.startsWith("src/") || normalizedFile.startsWith("public/") || normalizedFile === diagnostic?.file;
  }

  return false;
}

function isLocalImport(value) {
  return (
    value.startsWith("./") ||
    value.startsWith("../") ||
    value.startsWith("@/")
  );
}

function assertNoInstallForLocalImport({ diagnostic, plan }) {
  if (
    isLocalImport(diagnostic.import || "") &&
    (plan.commands || []).includes("install")
  ) {
    throw Object.assign(
      new Error("install interdit pour un import local."),
      { code: "LOCAL_IMPORT_INSTALL_FORBIDDEN" }
    );
  }
}

function validateRepairPlan({ plan, diagnostic, repairId }) {
  assertNoInstallForLocalImport({ diagnostic, plan });
  if (!plan || typeof plan !== "object") {
    throw Object.assign(new Error("Le plan doit être un objet JSON valide."), { code: "INVALID_PLAN_FORMAT" });
  }

  // Refuser les propriétés non déclarées (pseudo-schema additionalProperties: false)
  const allowedKeys = new Set(["schemaVersion", "repairId", "diagnosticId", "diagnosis", "files", "dependencyRequests", "commands", "validation", "reason"]);
  for (const key of Object.keys(plan)) {
    if (!allowedKeys.has(key)) {
      throw Object.assign(new Error(`Propriété inconnue refusée : ${key}`), { code: "SCHEMA_ADDITIONAL_PROPERTY" });
    }
  }

  if (plan.schemaVersion !== "2.0") {
    throw Object.assign(new Error("schemaVersion invalide"), { code: "INVALID_SCHEMA_VERSION" });
  }

  if (plan.repairId !== repairId) {
    console.warn(`[REPAIR_PLANNER] Attention: Le LLM a retourné un repairId incorrect (${plan.repairId}). Auto-correction avec ${repairId}.`);
    plan.repairId = repairId;
  }

  if (!plan.diagnosis || typeof plan.diagnosis !== "object") {
    throw Object.assign(new Error("Diagnostic du plan absent ou malformé."), { code: "PLAN_DIAGNOSIS_REQUIRED" });
  }

  if (plan.diagnosis.diagnosticId !== diagnostic.diagnosticId) {
    throw Object.assign(new Error("diagnosticId incohérent"), { code: "DIAGNOSTIC_ID_MISMATCH" });
  }

  if (plan.diagnosis.fingerprint !== diagnostic.fingerprint) {
    throw Object.assign(new Error("Fingerprint incohérent."), { code: "DIAGNOSTIC_FINGERPRINT_MISMATCH" });
  }

  const files = Array.isArray(plan.files) ? plan.files : [];
  const commands = Array.isArray(plan.commands) ? plan.commands : [];
  
  if (files.length > SUTURE_LIMITS.maxFilesPerAttempt) {
    throw Object.assign(new Error("Trop de fichiers"), { code: "SUTURE_SCOPE_TOO_LARGE" });
  }

  const scopeRule = resolveScopeRule(diagnostic);
  
  if (files.length > scopeRule.maxFiles) {
     throw Object.assign(new Error(`Ce diagnostic n'autorise que ${scopeRule.maxFiles} fichier(s) modifié(s).`), { code: "SUTURE_SCOPE_TOO_LARGE" });
  }

  for (const file of files) {
    const normalizedPath = file.path.replace(/\\/g, '/');

    if (normalizedPath === "package.json") {
      throw Object.assign(new Error("La réécriture de package.json est interdite."), { code: "PACKAGE_JSON_REWRITE_FORBIDDEN" });
    }

    // ─── GRADE GOLD : Les fichiers d'architecture protégés ne peuvent jamais être
    // réécrits intégralement. Ils nécessitent un expectedHash (patch minimal).
    if (PROTECTED_ARCHITECTURE_FILES.has(normalizedPath)) {
      if (file.operation === "replace" && !file.expectedHash) {
        throw Object.assign(
          new Error(`Fichier d'architecture protégé (${normalizedPath}) : expectedHash obligatoire pour garantir un patch minimal idempotent.`),
          { code: "PROTECTED_ARCH_HASH_REQUIRED" }
        );
      }

      // tsconfig.json : seul un patch alias @/* est autorisé
      if (normalizedPath === "tsconfig.json" && file.content) {
        validateTsConfigAliasPatch(file);
      }

      // Vérifier que App.tsx n'est pas remplacé par un fallback vide
      if (normalizedPath === "src/App.tsx" && file.content) {
        const hasFallback = /Application pr.te|<h1>[^<]*<\/h1>/i.test(file.content);
        const hasSuspense = /Suspense/.test(file.content);
        if (hasFallback || !hasSuspense) {
          throw Object.assign(
            new Error("App.tsx interdit : Suture ne peut pas injecter un fallback vide ou supprimer le Suspense/pageRegistry."),
            { code: "APP_TSX_ROUTING_DESTRUCTION_FORBIDDEN" }
          );
        }
      }
    }

    if (!isAllowedScopeFile({ filePath: file.path, diagnostic, scopeRule })) {
      throw Object.assign(new Error(`Fichier hors scope : ${file.path}`), { code: "SUTURE_FILE_OUT_OF_SCOPE" });
    }

    if (scopeRule.protectedFiles && scopeRule.protectedFiles.includes(normalizedPath)) {
      throw Object.assign(new Error(`Fichier design protégé: ${normalizedPath}`), { code: "PROTECTED_DESIGN_FILE" });
    }

    if (!VALID_OPERATIONS.has(file.operation)) {
      throw Object.assign(new Error(`Opération interdite: ${file.operation}`), { code: "INVALID_OPERATION" });
    }

    if (file.operation === "replace" && !file.expectedHash) {
      throw Object.assign(new Error(`expectedHash manquant pour: ${file.path}`), { code: "EXPECTED_HASH_REQUIRED" });
    }
  }

  for (const command of commands) {
    if (!VALID_COMMANDS.has(command)) {
      throw Object.assign(new Error(`Commande interdite : ${command}`), { code: "SUTURE_COMMAND_FORBIDDEN" });
    }
  }

  return true;
}

function buildHermesPrompt(diagnostic, repairId) {
  return `MODE : SUTURE V2

Tu dois corriger uniquement le diagnostic fourni.

Diagnostic :
${JSON.stringify(diagnostic, null, 2)}

══════════════════════════════════════════════════
CONTRAT DE RÉPARATION FRONTEND — GRADE GOLD
══════════════════════════════════════════════════

1. Ne réécris jamais un fichier de configuration complet pour corriger une erreur locale.
   Applique uniquement un patch minimal (operation: "replace", expectedHash obligatoire, diff minimal).

2. Ne remplace JAMAIS src/App.tsx par un fallback vide, un <h1> de test ou une page temporaire.
   App.tsx DOIT toujours contenir : pageRegistry.ts + React.lazy + Suspense + BrowserRouter/Routes.
   Tout App.tsx sans Suspense ou pageRegistry est un plan INVALIDE — renvoie files: [] à la place.

3. Préserve src/pageRegistry.ts, le routeur existant, React.lazy, Suspense et toutes les routes.
   Ne supprime aucune route, aucune page, aucune entrée du pageRegistry.
   Assure-toi qu'il existe TOUJOURS une route pour le chemin racine ('/').

4. LOI DES ALIAS — vite.config.ts :
   - Si l'alias "@" est ABSENT de vite.config.ts, ajoute-le avec un patch minimal :
     resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
     et import path from "node:path" en tête de fichier.
   - Si l'alias "@" est DÉJÀ PRÉSENT, ne touche pas à resolve.alias.
   - N'efface JAMAIS d'autres options de configuration existantes (server, plugins, etc.).
   - Le même alias doit être déclaré dans tsconfig.json : { "paths": { "@/*": ["src/*"] } }.
   - Patch autorisé : ajout ciblé de resolve.alias["@"] si absent.
   - Patch INTERDIT : remplacement complet de vite.config.ts par une configuration minimale.

5. LOI DU TYPAGE — avant chaque modification de fichier :
   - Inspecte les types existants (domain.ts, apk-forge.ts, etc.).
   - Ne crée jamais un nouveau statut (ex: 'success') sans l'ajouter au type union associé.
   - Ne crée jamais un appel de fonction sans fournir TOUS ses arguments obligatoires.
   - Ne retourne jamais une propriété absente de l'interface définie.
   - Pour chaque fonction modifiée : lis sa signature, conserve l'ordre des paramètres, types les callbacks.
   - Ajoute "typecheck" dans commands pour valider après le patch.

6. Ne modifie aucune className, aucun token CSS, aucun asset ou layout sans diagnostic explicite.

7. Ne touche jamais : src/index.css, src/main.tsx, index.html, active/.
   tsconfig.json : modifiable UNIQUEMENT pour ajouter paths["@/*"] si absent (patch minimal avec expectedHash).

8. Retourne uniquement un plan JSON valide avec : files, commands, dependencyRequests, validation, reason.

Erreurs TypeScript à détecter et corriger (prioritaires) :
  TS2339 — propriété absente de l'interface
  TS2345 — argument de mauvais type
  TS2554 — nombre d'arguments incorrect
  TS2322 — type incompatible
  TS7006 — paramètre de callback sans type
  TS2304 — nom introuvable (import manquant ou type non déclaré)

══════════════════════════════════════════════════

Contraintes absolues :
- ne régénère jamais le projet ;
- ne modifie jamais le design ;
- ne modifie jamais index.css ;
- ne modifie jamais main.tsx ;
- ne modifie jamais tsconfig.json (sauf ajout de paths @/* si absent) ;
- ne réécris jamais package.json ;
- ne touche jamais active ;
- ne retourne que du JSON valide ;
- maximum 3 fichiers dans src/ ;
- expectedHash obligatoire pour chaque remplacement de fichier d'architecture ;
- utilise dependencyRequests pour une dépendance manquante ;
- commands doit contenir uniquement des identifiants autorisés (install, rebuild, typecheck, build).
- Ne retourne jamais de propriété supplémentaire dans le JSON.
- Ne retourne jamais de Markdown (seulement le JSON).
- Ne retourne jamais de commentaire hors JSON.
- INCLURE OBLIGATOIREMENT "repairId": "${repairId}" à la racine de ton JSON.
- INCLURE OBLIGATOIREMENT "diagnosis": { "diagnosticId": "${diagnostic.diagnosticId}", "fingerprint": "${diagnostic.fingerprint}" } à la racine.

Règles de correction conditionnelles (CRITIQUE) :
- CRASH VITE INSTANTANÉ (VITE_STARTUP_FAILED, CLI_BUILD_ERROR, CONNECTION_REFUSED, HTTP_404, RUNTIME_NOT_READY, RUNTIME_PING_FAILED) : Le serveur Vite a crashé. Vérifie d'abord si vite.config.ts contient déjà { server: { host: "127.0.0.1", port: 5173 } }. Si oui, cherche la cause dans src/ (import manquant, composant qui plante). Si l'alias @ est absent, ajoute-le. Ne remplace JAMAIS intégralement vite.config.ts. Ne remplace JAMAIS App.tsx par un composant bouchon.
- IMPORT LOCAL (chemin commençant par ./, ../, @/) : Tu dois SEULEMENT utiliser "operation: replace" sur le fichier pour corriger le chemin. Laisse le tableau "commands" VIDE: [].
- IMPORT EXTERNE (ex: npm package) : Tu peux demander son installation via "install" dans commands avec dependencyRequests, OU réécrire le fichier (ex: src/App.tsx) pour utiliser une implémentation alternative sans dépendance manquante — en conservant pageRegistry et Suspense.
- TYPECHECK_FAILED : Corrige les erreurs TypeScript en lisant les types existants. Ne supprime pas un type, étends-le. Fournis tous les arguments manquants.
- Si le diagnostic est inconnu : retourne files: [], commands: [], validation: [] et une reason indiquant qu'une intervention humaine est requise.

Réponds exclusivement avec le schéma RepairPlan V2 (schemaVersion: "2.0").`;
}

const ALLOWED_STATUSES = new Set([
  "plan_ready",
  "candidate_ready",
  "rejected",
  "repair_required"
]);

function validateBusinessWiringPlan(
  plan,
  {
    allowedFiles = [],
    maxFiles = 10
  } = {}
) {
  const violations = [];

  if (!plan || typeof plan !== "object") {
    violations.push("PLAN_NOT_OBJECT");
    return { valid: false, status: "rejected", code: "BUSINESS_WIRING_CONTRACT_VIOLATION", violations };
  }

  if (plan.status !== "planready" && plan.status !== "plan_ready") {
    violations.push("BUSINESS_PLAN_STATUS_INVALID");
  }

  // Les vérifications designPreserved, cssChanges, classNameChanges ont été déplacées
  // dans validateUIUpdatePlan conformément aux directives du Zéro-Touch Grade Gold.

  const files = Array.isArray(plan.files) ? plan.files : [];

  if (files.length > maxFiles) {
    violations.push("TOO_MANY_FILES");
  }

  for (const file of files) {
    if (typeof file.path !== "string") {
      violations.push("INVALID_FILE_PATH");
      continue;
    }

    const normalized = file.path.replaceAll("\\", "/");

    if (normalized.startsWith("/") || normalized.includes("..")) {
      violations.push(`DANGEROUS_PATH:${normalized}`);
    }

    if (allowedFiles.length > 0 && !allowedFiles.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
      violations.push(`OUT_OF_SCOPE:${normalized}`);
    }

    if (normalized.endsWith(".css")) {
      violations.push(`CSS_FORBIDDEN:${normalized}`);
    }

    if (file.operation === "update" && typeof file.expectedHash !== "string") {
      violations.push(`HASH_REQUIRED:${normalized}`);
    }

    if (/document\.|window\.|querySelector|classList/.test(file.content || "")) {
      violations.push(`DOM_ACCESS:${normalized}`);
    }

    if (/setTimeout\s*\([^)]*success/i.test(file.content || "")) {
      violations.push(`MOCK_API:${normalized}`);
    }
  }

  if (violations.length > 0) {
    return {
      valid: false,
      status: "rejected",
      code: "BUSINESS_WIRING_CONTRACT_VIOLATION",
      violations
    };
  }

  return {
    valid: true,
    status: plan.status || "plan_ready",
    violations: []
  };
}

function validateUIUpdatePlan(
  plan,
  {
    allowedFiles = [],
    maxFiles = 10
  } = {}
) {
  const violations = [];

  if (!plan || typeof plan !== "object") {
    violations.push("PLAN_NOT_OBJECT");
    return { valid: false, status: "rejected", code: "UI_UPDATE_CONTRACT_VIOLATION", violations };
  }

  if (plan.status !== "planready" && plan.status !== "plan_ready") {
    violations.push("UI_PLAN_STATUS_INVALID");
  }

  if (plan.compliance?.designPreserved !== true) {
    violations.push("DESIGN_PRESERVATION_NOT_CONFIRMED");
  }

  if (plan.compliance?.cssChanges !== false) {
    violations.push("CSS_MODIFICATION_FORBIDDEN");
  }

  if (plan.compliance?.classNameChanges !== false) {
    violations.push("CLASSNAME_MODIFICATION_FORBIDDEN");
  }

  if (plan.compliance?.logicPreserved !== true) {
    violations.push("LOGIC_NOT_PRESERVED");
  }

  if (plan.compliance?.hooksPreserved !== true) {
    violations.push("HOOKS_NOT_PRESERVED");
  }

  if (plan.compliance?.importsPreserved !== true) {
    violations.push("IMPORTS_NOT_PRESERVED");
  }

  const files = Array.isArray(plan.files) ? plan.files : [];

  if (files.length > maxFiles) {
    violations.push("TOO_MANY_FILES");
  }

  for (const file of files) {
    if (typeof file.path !== "string") {
      violations.push("INVALID_FILE_PATH");
      continue;
    }

    const normalized = file.path.replaceAll("\\", "/");

    if (normalized.startsWith("/") || normalized.includes("..")) {
      violations.push(`DANGEROUS_PATH:${normalized}`);
    }

    if (allowedFiles.length > 0 && !allowedFiles.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`))) {
      violations.push(`OUT_OF_SCOPE:${normalized}`);
    }

    // In UI update, we allow updating the file
    if (file.operation === "update" && typeof file.expectedHash !== "string") {
      violations.push(`HASH_REQUIRED:${normalized}`);
    }
  }

  if (violations.length > 0) {
    return {
      valid: false,
      status: "rejected",
      code: "UI_UPDATE_CONTRACT_VIOLATION",
      violations
    };
  }

  return {
    valid: true,
    status: plan.status || "plan_ready",
    violations: []
  };
}

module.exports = {
  VALID_OPERATIONS,
  VALID_COMMANDS,
  PROTECTED_ARCHITECTURE_FILES,
  LOGIC_PATHS,
  validateRepairPlan,
  validateAliasContract,
  validateRoutingContract,
  validateTsConfigAliasPatch,
  validateLogicWiringScope,
  isLogicPath,
  buildHermesPrompt,
  validateBusinessWiringPlan,
  validateUIUpdatePlan
};
