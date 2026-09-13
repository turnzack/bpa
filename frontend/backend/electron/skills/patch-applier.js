const fs = require('fs');
const path = require('path');
const patchValidator = require('./patch-validator');

// Chemin racine du workspace (sécurité anti path-traversal)
const WORKSPACE_ROOT = 'e:\\v0reponses';

class PatchApplierSkill {
  async execute(payload, context) {
    console.log(`[PATCH-APPLIER] 🚀 Début de l'application du patch...`);

    const { targetFile, updatedCode, backupPath } = payload;

    if (!targetFile || !updatedCode) {
      throw new Error(`Fichier cible ou code mis à jour manquant.`);
    }

    // 🛡️ Sécurité 1 : Vérification du périmètre workspace
    const normalizedTarget = path.resolve(targetFile);
    const normalizedWorkspace = path.resolve(WORKSPACE_ROOT);
    if (!normalizedTarget.startsWith(normalizedWorkspace)) {
      throw new Error(`🚫 Sécurité : Le fichier cible est hors du workspace autorisé : ${targetFile}`);
    }

    // 🛡️ Sécurité 2 : Path traversal
    if (targetFile.includes('..') || targetFile.includes('~')) {
      throw new Error(`🚫 Sécurité : Chemin suspect détecté : ${targetFile}`);
    }

    if (!fs.existsSync(targetFile)) {
      throw new Error(`Le fichier cible n'existe pas : ${targetFile}`);
    }

    // Lire le code original pour comparaison
    const originalCode = fs.readFileSync(targetFile, 'utf8');

    // 🔍 VALIDATION AST avant écriture (Priorité 1)
    console.log(`[PATCH-APPLIER] 🔍 Validation AST du code généré...`);
    let validation;
    try {
      validation = await patchValidator.execute({
        code: updatedCode,
        targetFile,
        originalCode
      }, context);
    } catch (valErr) {
      console.warn(`[PATCH-APPLIER] ⚠️ Validateur injoignable (${valErr.message}). Application en mode dégradé.`);
      validation = { valid: true, errors: [], warnings: [`Validation ignorée : ${valErr.message}`] };
    }

    // Rapport des avertissements
    if (validation.warnings && validation.warnings.length > 0) {
      validation.warnings.forEach(w => console.warn(`[PATCH-APPLIER] ⚠️ ${w}`));
    }

    // Blocage si code invalide
    if (!validation.valid) {
      console.error(`[PATCH-APPLIER] ❌ Patch REFUSÉ — code invalide. Fichier original préservé.`);
      validation.errors.forEach(e => console.error(`  └→ ${e}`));
      return {
        success: false,
        blocked: true,
        message: `Patch refusé par le validateur AST. Fichier original préservé.`,
        validationErrors: validation.errors,
        validationWarnings: validation.warnings,
        targetFile
      };
    }

    // 🛡️ Backup automatique si pas encore créé
    let finalBackupPath = backupPath;
    if (!finalBackupPath || !fs.existsSync(finalBackupPath)) {
      finalBackupPath = `${targetFile}.backup-${Date.now()}.bak`;
      fs.copyFileSync(targetFile, finalBackupPath);
      console.log(`[PATCH-APPLIER] 🛡️ Backup créé : ${path.basename(finalBackupPath)}`);
    }

    // ✅ Écriture du nouveau code
    fs.writeFileSync(targetFile, updatedCode, 'utf8');
    console.log(`[PATCH-APPLIER] ✅ Fichier mis à jour avec succès : ${path.basename(targetFile)}`);
    console.log(`[PATCH-APPLIER] 📊 Stats : ${validation.stats?.lines || '?'} lignes | ${validation.stats?.chars || '?'} chars`);

    return {
      success: true,
      message: "Patch validé et appliqué avec succès. L'aperçu devrait se rafraîchir en direct.",
      targetFile,
      backupPath: finalBackupPath,
      validation: {
        warnings: validation.warnings,
        stats: validation.stats
      }
    };
  }
}

module.exports = new PatchApplierSkill();
