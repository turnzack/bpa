const crypto = require('crypto');
const path = require('path');

const DIAGNOSTIC_CODES = Object.freeze({
  VITE_MISSING_IMPORT: "VITE_MISSING_IMPORT",
  VITE_SYNTAX_ERROR: "VITE_SYNTAX_ERROR",
  TYPESCRIPT_ERROR: "TYPESCRIPT_ERROR",
  TYPESCRIPT_MODULE_NOT_FOUND: "TYPESCRIPT_MODULE_NOT_FOUND",
  BUILD_FAILED: "BUILD_FAILED",
  RUNTIME_ERROR: "RUNTIME_ERROR",
  ROUTE_FAILED: "ROUTE_FAILED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
});

function createDiagnosticId() {
  return `diag-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function normalizeDiagnosticMessage(message) {
  return String(message || "")
    .replace(/\\/g, "/")
    .replace(/[A-Z]:\/[^:\n]+/gi, "<PROJECT_PATH>")
    .replace(/\(\d+,\d+\)/g, "(POSITION)")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function createFingerprint({ source = "vite", code, file, importName, message }) {
  return 'sha256:' + crypto.createHash('sha256').update(
    [source, code, file || "", importName || "", normalizeDiagnosticMessage(message)].join("|")
  ).digest('hex');
}

function normalizeProjectPath(value, projectRoot) {
  const raw = String(value || "").replace(/\\/g, "/");
  const root = String(projectRoot || "").replace(/\\/g, "/").replace(/\/+$/, "");

  // Si le chemin contient la racine du projet
  const index = raw.indexOf(`${root}/`);
  if (index >= 0) {
    return raw.slice(index + root.length + 1);
  }

  // Fallback heuristique standard (src/...)
  const srcIndex = raw.indexOf("/src/");
  if (srcIndex >= 0) {
    return raw.slice(srcIndex + 1);
  }

  return raw.replace(/^\/+/, "");
}

function parsePosition(message) {
  const match = String(message).match(/(?:^|[\s(])([^()\s]+):(\d+):(\d+)(?:\)?|$)/);
  if (!match) {
    return { line: null, column: null };
  }
  return { line: Number(match[2]), column: Number(match[3]) };
}

function parseViteMissingImport(message, projectRoot) {
  const msgStr = String(message).replace(/\r\n/g, '\n');
  const match = msgStr.match(/Failed to resolve import ["']([^"']+)["']\s+from\s+["']([^"']+)["']/i) 
             || msgStr.match(/Cannot find module ["']([^"']+)["']/i);

  if (!match) return null;

  // Le format "Cannot find module" n'a pas toujours le 'from file'
  const importName = match[1];
  const fileRaw = match[2] || null;

  return {
    code: fileRaw ? "VITE_MISSING_IMPORT" : "TYPESCRIPT_MODULE_NOT_FOUND",
    import: importName,
    file: fileRaw ? normalizeProjectPath(fileRaw, projectRoot) : null,
    message: msgStr
  };
}

function parseTypeScriptError(message, projectRoot) {
  const msgStr = String(message);
  // Exemple: src/App.tsx(2,65): error TS2307: Cannot find module 'react-router-dom'
  const match = msgStr.match(/([^\s()]+)\((\d+),(\d+)\):\s*error\s*TS(\d+):\s*(.*)/i);
  
  if (!match) return null;

  const rawFile = match[1];
  const line = Number(match[2]);
  const column = Number(match[3]);
  const tsCode = match[4];
  const errorMsg = match[5];

  let code = "TYPESCRIPT_ERROR";
  let importName = null;

  if (tsCode === "2307") {
    code = "TYPESCRIPT_MODULE_NOT_FOUND";
    const modMatch = errorMsg.match(/module ['"]([^'"]+)['"]/);
    if (modMatch) importName = modMatch[1];
  }

  return {
    code,
    file: normalizeProjectPath(rawFile, projectRoot),
    line,
    column,
    import: importName,
    message: msgStr
  };
}

function parsePlaywrightError(message, projectRoot) {
  const msgStr = String(message);
  if (!msgStr.startsWith("[playwright]")) return null;

  const lines = msgStr.split('\n');
  const errorMsg = lines[0].replace("[playwright]", "").trim();
  
  // Chercher la première ligne de stack contenant un fichier source
  const stackFileMatch = msgStr.match(/(?:at\s+.*|@)(src\/[^:]+\.(?:tsx|ts|jsx|js|css)):(\d+):(\d+)/i);
  
  return {
    code: "RUNTIME_ERROR",
    file: stackFileMatch ? normalizeProjectPath(stackFileMatch[1], projectRoot) : null,
    line: stackFileMatch ? Number(stackFileMatch[2]) : null,
    column: stackFileMatch ? Number(stackFileMatch[3]) : null,
    message: errorMsg
  };
}

function classifySeverity(code) {
  if (code === "VITE_MISSING_IMPORT" || code === "TYPESCRIPT_MODULE_NOT_FOUND" || code === "VITE_SYNTAX_ERROR") {
    return "critical";
  }
  if (code === "UNKNOWN_ERROR") {
    return "high";
  }
  return "medium";
}

function parseStructuredDiagnostic(diagnostics) {
  const first = Array.isArray(diagnostics) ? diagnostics[0] : null;
  if (!first) return null;

  const mapping = {
    PAGE_ERROR: "RUNTIME_ERROR",
    CONSOLE_ERROR: "RUNTIME_ERROR",
    NETWORK_ERROR: "ROUTE_FAILED",
    BLANK_SCREEN: "RUNTIME_ERROR"
  };

  return {
    ...first,
    code: mapping[first.code] || first.code
  };
}

/**
 * Fonction d'entrée pour résoudre le diagnostic depuis l'erreur brute
 */
function resolveDiagnostic({ projectId, projectRoot, activeFile, rawError, source = "vite", diagnostics = null }) {
  if (!rawError || !String(rawError).trim()) {
    throw Object.assign(new Error("Aucun message d'erreur exploitable."), { code: "NO_ACTIVE_DIAGNOSTIC" });
  }

  let parsed = parseStructuredDiagnostic(diagnostics)
            || parseViteMissingImport(rawError, projectRoot) 
            || parseTypeScriptError(rawError, projectRoot) 
            || parsePlaywrightError(rawError, projectRoot)
            || { code: DIAGNOSTIC_CODES.UNKNOWN_ERROR, message: String(rawError) };

  // Priorité au fichier parsé, fallback sur l'activeFile transmis par le client ou src/App.tsx
  if (!parsed.file) {
    parsed.file = activeFile ? normalizeProjectPath(activeFile, projectRoot) : "src/App.tsx";
  }

  const position = parsePosition(rawError);

  const diagnostic = {
    diagnosticId: createDiagnosticId(),
    projectId,
    source,
    code: parsed.code,
    severity: classifySeverity(parsed.code),
    confidence: parsed.code === "UNKNOWN_ERROR" ? 0 : 0.98,
    file: parsed.file || null,
    line: parsed.line || position.line || null,
    column: parsed.column || position.column || null,
    import: parsed.import || null,
    message: parsed.message || String(rawError),
    raw: String(rawError),
    diagnostics: Array.isArray(diagnostics) ? diagnostics : [],
    observedAt: new Date().toISOString()
  };

  diagnostic.fingerprint = createFingerprint({
    source: diagnostic.source,
    code: diagnostic.code,
    file: diagnostic.file,
    importName: diagnostic.import,
    message: diagnostic.message
  });

  return diagnostic;
}

function assertDiagnosticBelongsToProject({ diagnostic, projectId }) {
  if (diagnostic.projectId !== projectId) {
    throw Object.assign(new Error("Diagnostic rattaché au mauvais projet."), { code: "DIAGNOSTIC_PROJECT_MISMATCH" });
  }
}

module.exports = {
  DIAGNOSTIC_CODES,
  resolveDiagnostic,
  normalizeProjectPath,
  assertDiagnosticBelongsToProject
};
