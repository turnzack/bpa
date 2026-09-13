'use strict';
/**
 * MobileValidator — Sprint 4
 * Valide structurellement les fichiers React Native générés par DeepSeek.
 * Règles CTO non négociables :
 *   - Aucun WebView / HTML runtime
 *   - Chemins relatifs uniquement
 *   - Imports valides (pas de node_modules non autorisés)
 *   - Pas de lignes tronquées "..."
 *   - Syntaxe JSON valide pour les fichiers .json
 */

const fs   = require('fs');
const path = require('path');

// ─── Listes blanches ──────────────────────────────────────────────────────────
const ALLOWED_DEPS = new Set([
  'react','react-native','expo','expo-router','expo-status-bar','expo-font',
  'expo-splash-screen','expo-constants','expo-camera','expo-image-picker',
  'expo-location','expo-notifications','expo-haptics','expo-linear-gradient',
  'expo-blur','nativewind','tailwindcss','zustand','@tanstack/react-query',
  '@expo/vector-icons','react-native-safe-area-context','react-native-screens',
  'react-native-reanimated','react-native-gesture-handler','react-native-maps',
  '@supabase/supabase-js','axios','date-fns','zod',
]);

// ─── Patterns interdits ───────────────────────────────────────────────────────
const BANNED_PATTERNS = [
  { re: /<WebView[\s>]/,               msg: 'WebView détecté — interdit en RN natif' },
  { re: /dangerouslySetInnerHTML/,      msg: 'dangerouslySetInnerHTML interdit' },
  { re: /document\.write|window\.alert/,msg: 'API navigateur (document/window) interdite' },
  { re: /import\s+.*\s+from\s+['"]react-dom['"]/, msg: 'react-dom interdit en React Native' },
  { re: /<html|<body|<div[\s>]|<span[\s>]|<p[\s>]|<a[\s>]/i, msg: 'Balises HTML runtime détectées' },
  { re: /require\(['"]fs['"]\)/,        msg: 'require(fs) interdit dans le code natif' },
  { re: /require\(['"]path['"]\)/,      msg: 'require(path) interdit dans le code natif' },
  { re: /\.\.\.\s*\/\//,               msg: 'Troncature "... //" détectée — code incomplet' },
  { re: /\/\/ \.{3,}/,                 msg: 'Troncature "// ..." détectée — code incomplet' },
  { re: /TODO: implement|PLACEHOLDER/i, msg: 'Placeholder non-implémenté détecté' },
];

// ─── Extensions valides pour un projet Expo ───────────────────────────────────
const VALID_EXTENSIONS = new Set([
  '.ts','.tsx','.js','.jsx','.json','.css','.md','.env','.gitkeep',
]);

// ─── Regex imports ────────────────────────────────────────────────────────────
const IMPORT_RE = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;

// =============================================================================
// FONCTIONS DE VALIDATION
// =============================================================================

/**
 * Valide un fichier individuel.
 * @param {{ path:string, content:string }} file
 * @returns {{ ok:boolean, errors:string[], warnings:string[] }}
 */
function validateFile(file) {
  const errors   = [];
  const warnings = [];
  const { path: filePath, content } = file;

  if (!filePath || typeof filePath !== 'string') {
    return { ok:false, errors:['path manquant ou invalide'], warnings };
  }

  // 1. Extension valide
  const ext = path.extname(filePath).toLowerCase();
  if (ext && !VALID_EXTENSIONS.has(ext)) {
    warnings.push(`Extension inhabituelle : ${ext}`);
  }

  // 2. Chemin relatif
  if (path.isAbsolute(filePath)) {
    errors.push(`Chemin absolu interdit : ${filePath}`);
  }
  if (filePath.includes('..')) {
    errors.push(`Path traversal détecté : ${filePath}`);
  }

  // 3. Contenu non vide
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    errors.push('Fichier vide');
    return { ok: false, errors, warnings };
  }

  // 4. Patterns interdits (seulement pour les fichiers code)
  if (['.ts','.tsx','.js','.jsx'].includes(ext)) {
    for (const { re, msg } of BANNED_PATTERNS) {
      if (re.test(content)) errors.push(msg);
    }

    // 5. Imports — vérification des dépendances
    let m;
    const importRe = new RegExp(IMPORT_RE.source, 'g');
    while ((m = importRe.exec(content)) !== null) {
      const dep = m[1];
      if (dep.startsWith('.') || dep.startsWith('@/')) continue; // relatif ou alias — ok
      const root = dep.startsWith('@') ? dep.split('/').slice(0,2).join('/') : dep.split('/')[0];
      if (!ALLOWED_DEPS.has(root)) {
        warnings.push(`Dépendance non autorisée : ${root}`);
      }
    }

    // 6. StyleSheet.create usage (heuristique natif)
    if (content.includes('className=') && !content.includes('nativewind') && !content.includes('// nativewind')) {
      // NativeWind className= est autorisé
    }
    if (content.includes('style={{') || content.includes('StyleSheet')) {
      // ok — styles natifs
    }
  }

  // 7. JSON valide
  if (ext === '.json') {
    try { JSON.parse(content); }
    catch (e) { errors.push(`JSON invalide : ${e.message}`); }
  }

  return { ok: errors.length === 0, errors, warnings };
}

/**
 * Valide un tableau de fichiers générés.
 * @param {Array<{path:string,content:string}>} files
 * @returns {{ valid:boolean, passed:number, failed:number, results:object[], allErrors:string[], allWarnings:string[] }}
 */
function validateFiles(files) {
  if (!Array.isArray(files) || files.length === 0) {
    return { valid:false, passed:0, failed:0, results:[], allErrors:['Aucun fichier fourni'], allWarnings:[] };
  }

  const results     = [];
  const allErrors   = [];
  const allWarnings = [];
  let   passed      = 0;
  let   failed      = 0;

  for (const file of files) {
    const result = validateFile(file);
    results.push({ path: file.path, ...result });
    if (result.ok) {
      passed++;
    } else {
      failed++;
      result.errors.forEach(e => allErrors.push(`[${file.path}] ${e}`));
    }
    result.warnings.forEach(w => allWarnings.push(`[${file.path}] ${w}`));
  }

  return {
    valid:       failed === 0,
    passed,
    failed,
    results,
    allErrors,
    allWarnings,
  };
}

/**
 * Valide un projet existant sur le disque.
 * @param {string} projectDir  Chemin absolu du dossier Expo
 * @returns {{ valid:boolean, passed:number, failed:number, results:object[] }}
 */
function validateProjectDir(projectDir) {
  if (!fs.existsSync(projectDir)) {
    return { valid:false, passed:0, failed:0, results:[], allErrors:[`Dossier introuvable : ${projectDir}`], allWarnings:[] };
  }

  const files = [];
  readDirRecursive(projectDir, projectDir, files);
  return validateFiles(files);
}

function readDirRecursive(base, current, out) {
  const SKIP = new Set(['node_modules','.git','.expo','dist','build','assets']);
  try {
    for (const item of fs.readdirSync(current, { withFileTypes:true })) {
      if (SKIP.has(item.name)) continue;
      const full = path.join(current, item.name);
      if (item.isDirectory()) {
        readDirRecursive(base, full, out);
      } else {
        const ext = path.extname(item.name).toLowerCase();
        if (['.ts','.tsx','.js','.jsx','.json'].includes(ext)) {
          try {
            out.push({ path: path.relative(base, full).replace(/\\/g,'/'), content: fs.readFileSync(full,'utf-8') });
          } catch {}
        }
      }
    }
  } catch {}
}

// =============================================================================
// REPAIR — Génération du prompt de correction ciblé
// =============================================================================

/**
 * Construit un prompt de réparation pour DeepSeek à partir des erreurs de validation.
 * @param {object} validationResult  Résultat de validateFiles()
 * @param {object} spec              StitchSpec du projet
 * @param {string} projectId
 * @returns {string}
 */
function buildRepairPrompt(validationResult, spec, projectId) {
  const failedFiles = validationResult.results
    .filter(r => !r.ok)
    .map(r => `  - ${r.path} : ${r.errors.join(', ')}`)
    .join('\n');

  return `=================================================================
RÈGLE SYSTÈME — RÉPARATION REACT NATIVE
=================================================================
Tu répares des fichiers Expo React Native qui ont échoué la validation.
INTERDIT : WebView, dangerouslySetInnerHTML, HTML runtime, chemins absolus.
FORMAT DE SORTIE STRICT :
{"projectId":"${projectId}","phase":"repair","status":"completed","files":[{"path":"...","content":"...","language":"typescript"}]}
=================================================================

=== FICHIERS EN ERREUR ===
${failedFiles}

=== ERREURS DÉTECTÉES ===
${validationResult.allErrors.slice(0,20).join('\n')}

=== CONTEXTE PROJET ===
Nom    : ${spec?.projectName || 'Inconnu'}
Stack  : Expo Router + TypeScript + NativeWind + Zustand
Règles : View, Text, Pressable, ScrollView, Image (NATIF). Jamais <div> <span> <p>.

=== INSTRUCTION ===
Corrige UNIQUEMENT les fichiers listés ci-dessus.
Retourne uniquement les fichiers corrigés dans le JSON strict.
Chaque fichier doit être complet, sans troncature.
=================================================================`;
}

/**
 * Vérifie les fichiers d'un callback DeepSeek AVANT de les écrire.
 * Retourne les fichiers valides et les refusés.
 */
function filterSafeFiles(files) {
  const safe    = [];
  const refused = [];

  for (const file of (files || [])) {
    const result = validateFile(file);
    if (result.ok) {
      safe.push(file);
    } else {
      refused.push({ ...file, errors: result.errors, warnings: result.warnings });
    }
  }

  return { safe, refused };
}

module.exports = {
  validateFile,
  validateFiles,
  validateProjectDir,
  buildRepairPrompt,
  filterSafeFiles,
  ALLOWED_DEPS,
  BANNED_PATTERNS,
};
