const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { PROTECTED_FILES, ALLOWED_EXTENSIONS, SUTURE_LIMITS } = require('./SutureConfig');

function resolveSafeTarget(projectRoot, relativePath) {
  const normalized = String(relativePath)
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  if (!normalized || normalized.includes("\0") || path.isAbsolute(relativePath)) {
    throw Object.assign(new Error(`Chemin invalide ou absolu : ${relativePath}`), { code: "INVALID_REPAIR_PATH" });
  }

  const root = path.resolve(projectRoot);
  const target = path.resolve(root, normalized);
  const relative = path.relative(root, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw Object.assign(new Error(`Path traversal détecté : ${relativePath}`), { code: "REPAIR_PATH_TRAVERSAL" });
  }

  // Vérification de l'extension
  const ext = path.extname(target).toLowerCase();
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    // Si ce n'est pas un fichier connu, on autorise exceptionnellement les fichiers sans extension (comme 'active' s'il n'était pas protégé)
    // Mais en principe, seules les extensions autorisées passent.
    if (!['', '.lock', '.yaml'].includes(ext)) { // Exceptions techniques courantes
        throw Object.assign(new Error(`Extension non autorisée : ${ext}`), { code: "INVALID_EXTENSION" });
    }
  }

  // Vérification des fichiers protégés
  // On compare par rapport au chemin relatif depuis le root.
  const normalizedRelative = relative.replace(/\\/g, "/");
  
  if (PROTECTED_FILES.has(normalizedRelative)) {
    throw Object.assign(new Error(`Fichier protégé : ${normalizedRelative}`), { code: "PROTECTED_FILE" });
  }
  
  // Hard blocage de package.json
  if (normalizedRelative === "package.json") {
     throw Object.assign(new Error(`La modification de package.json est strictement interdite via repair files.`), { code: "PROTECTED_FILE" });
  }

  return target;
}

function verifyExpectedHash(targetPath, expectedHash, operation) {
  if (operation === 'create') return true;

  if (!expectedHash) {
     throw Object.assign(new Error(`Hash manquant pour : ${targetPath}`), { code: "REPAIR_HASH_MISMATCH" });
  }

  const currentContent = fs.existsSync(targetPath) ? fs.readFileSync(targetPath, "utf8") : "";
  const actualHash = 'sha256:' + crypto.createHash('sha256').update(currentContent).digest('hex');

  if (actualHash !== expectedHash) {
    throw Object.assign(new Error(`Hash différent pour ${targetPath}. Attendu: ${expectedHash}, Actuel: ${actualHash}`), { code: "REPAIR_HASH_MISMATCH" });
  }

  return true;
}

function validatePatchScope(plan) {
  if (!plan.files || !Array.isArray(plan.files)) {
    throw Object.assign(new Error("Le plan doit contenir un tableau files."), { code: "INVALID_PLAN" });
  }

  if (plan.files.length > SUTURE_LIMITS.maxFilesPerAttempt) {
    throw Object.assign(new Error(`Suture refusée : trop de fichiers modifiés (${plan.files.length} > ${SUTURE_LIMITS.maxFilesPerAttempt}).`), { code: "SUTURE_SCOPE_TOO_LARGE" });
  }

  // Validation de la taille des patchs
  for (const f of plan.files) {
    if (!f.path) throw Object.assign(new Error("Chemin manquant dans un fichier du patch."), { code: "INVALID_PLAN" });
    const byteLength = Buffer.byteLength(f.content || '', 'utf8');
    if (byteLength > SUTURE_LIMITS.maxPatchBytes) {
      throw Object.assign(new Error(`Patch trop volumineux pour ${f.path}`), { code: "PATCH_TOO_LARGE" });
    }
  }

  return true;
}

function validateRepairPlan(plan, projectRoot) {
  validatePatchScope(plan);

  // Vérifier chaque cible
  plan.files.forEach(f => {
    resolveSafeTarget(projectRoot, f.path);
    // Note: on ne vérifie pas le expectedHash ici car le workspace n'est peut-être pas encore prêt.
    // L'Applier s'en chargera.
  });

  return true;
}

module.exports = {
  validateRepairPlan,
  resolveSafeTarget,
  validatePatchScope,
  verifyExpectedHash
};
