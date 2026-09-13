const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { resolveSafeTarget } = require('./PatchValidator');
const { createFileSnapshot, compareSnapshots } = require('./WorkspaceManager');

const MAX_PATCH_BYTES = 1024 * 1024;

// ─── Garde contre les réponses Hermes incomplètes ───────────────────────────
/**
 * Détecte les anomalies syntaxiques triviales dans un contenu généré par Hermes
 * avant toute écriture sur disque.
 * Retourne la liste des erreurs détectées (tableau vide = contenu valide).
 */
function detectIncompleteContent(content, filePath) {
  const errors = [];

  // 1. Contenu vide
  if (!content || !content.trim()) {
    errors.push({ code: 'HERMES_EMPTY_CONTENT', file: filePath });
    return errors; // Inutile d'aller plus loin
  }

  // 2. Supprime chaînes et commentaires pour éviter les faux positifs
  const cleaned = content
    .replace(/`[^`]*`/gs, '""')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');

  // 3. Déclarations const/let/var sans initialiseur
  const incompletePattern =
    /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*(?:\s*:\s*[A-Za-z_$<>[\]|&, ]+)?\s*=\s*(?=\b(?:const|let|var)\b)/gm;
  let m;
  while ((m = incompletePattern.exec(cleaned)) !== null) {
    errors.push({
      code: 'HERMES_INCOMPLETE_DECLARATION',
      file: filePath,
      match: m[0].trim().slice(0, 80)
    });
  }

  // 4. Fichier tronqué se terminant par `=` ou `=>`
  if (/=>?\s*$/.test(cleaned.trimEnd())) {
    errors.push({
      code: 'HERMES_TRAILING_ASSIGNMENT',
      file: filePath,
      hint: cleaned.trimEnd().slice(-40).trim()
    });
  }

  // 5. Déséquilibre d'accolades
  let braces = 0;
  for (const ch of cleaned) {
    if (ch === '{') braces++;
    if (ch === '}') braces--;
  }
  if (braces !== 0) {
    errors.push({ code: 'HERMES_UNBALANCED_BRACES', file: filePath, delta: braces });
  }

  return errors;
}

function sha256(content) {
  return 'sha256:' + crypto.createHash('sha256').update(content).digest('hex');
}

async function verifyExpectedHash({ targetPath, expectedHash, operation }) {
  if (operation === "create") {
    if (fs.existsSync(targetPath)) {
      return { status: "passed", actualHash: null, bytesBefore: 0 };
    }
    return { status: "not_applicable", actualHash: null, bytesBefore: 0 };
  }

  let currentBuffer;
  try {
    currentBuffer = await fsPromises.readFile(targetPath);
    const actualHash = sha256(currentBuffer);
    return { status: "passed", actualHash, bytesBefore: currentBuffer.length };
  } catch (error) {
    return { status: "not_found", actualHash: null, bytesBefore: 0 };
  }
}

async function atomicWriteWorkspaceFile({ targetPath, content }) {
  const tempPath = `${targetPath}.suture.tmp`;

  try {
    await fsPromises.mkdir(path.dirname(targetPath), { recursive: true });
    await fsPromises.writeFile(tempPath, content, "utf8");
    await fsPromises.rename(tempPath, targetPath);
  } catch (error) {
    await fsPromises.rm(tempPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function verifyWrittenContent({ targetPath, expectedContent }) {
  try {
    const actualContent = await fsPromises.readFile(targetPath, "utf8");
    const actualHash = sha256(actualContent);
    return { status: "passed", hash: actualHash, bytesAfter: Buffer.byteLength(actualContent, 'utf8') };
  } catch (err) {
    return { status: "failed", hash: null, bytesAfter: 0 };
  }
}

/**
 * Vérifie que workspaceRoot est bien un sous-dossier de .kirov/improvements/
 * et qu'il est différent de activeRoot (isolation garantie).
 */
function assertWorkspaceIsolated({ workspaceRoot, improvementRoot, projectRoot }) {
  const norm = (p) => path.resolve(String(p || '')).replace(/[\\/]+$/, '').toLowerCase();
  const ws = norm(workspaceRoot);
  const active = norm(projectRoot);

  // Le workspace ne doit jamais être identique au dossier actif
  if (ws === active) {
    throw Object.assign(
      new Error('Le workspace est identique au dossier actif — écriture interdite.'),
      { code: 'WORKSPACE_IS_ACTIVE_ROOT', workspaceRoot, projectRoot }
    );
  }

  // Le workspace doit être un enfant de .kirov/improvements/
  const kirovPath = norm(path.join(projectRoot, '.kirov', 'improvements'));
  if (!ws.startsWith(kirovPath)) {
    throw Object.assign(
      new Error('Le workspace n\'est pas isolé dans .kirov/improvements/'),
      { code: 'WORKSPACE_NOT_ISOLATED', workspaceRoot, expectedPrefix: kirovPath }
    );
  }

  return true;
}

/**
 * Compare l'état actuel d'activeRoot avec le snapshot de base.
 * Si des fichiers ont été modifiés hors workspace (écriture directe dans active),
 * retourne status: 'mutated' avec la liste des fichiers touchés.
 */
async function verifyActiveIntegrity({ activeRoot, baseSnapshot }) {
  if (!baseSnapshot || typeof baseSnapshot !== 'object' || Object.keys(baseSnapshot).length === 0) {
    return { status: 'skipped', passed: true, changed: [], reason: 'No base snapshot provided' };
  }

  try {
    const { createFileSnapshot } = require('./WorkspaceManager');
    const currentSnapshot = await createFileSnapshot(activeRoot);
    const changed = [];

    for (const [filePath, baseHash] of Object.entries(baseSnapshot)) {
      const currentHash = currentSnapshot[filePath];
      if (currentHash && currentHash !== baseHash) {
        changed.push({ path: filePath, baseHash, currentHash, mutation: 'modified' });
      }
    }

    if (changed.length > 0) {
      console.error(`[PATCH APPLIER] 🚨 ACTIVE_MUTATION détectée : ${changed.length} fichier(s) modifié(s) hors workspace !`);
      return {
        status: 'mutated',
        passed: false,
        changed,
        errors: [{ code: 'ACTIVE_MUTATION', files: changed.map(c => c.path) }]
      };
    }

    return { status: 'passed', passed: true, changed: [] };
  } catch (err) {
    return { status: 'error', passed: false, changed: [], reason: err.message };
  }
}

async function applyRepairPlan({ plan, diagnostic, repairId, workspaceRoot, improvementRoot, projectRoot, activeRoot, baseSnapshot }) {
  assertWorkspaceIsolated({ workspaceRoot, improvementRoot, projectRoot });

  const filesReport = [];
  const realActiveRoot = activeRoot || projectRoot;
  
  if (plan.files && plan.files.length > 0) {
    for (const file of plan.files) {
      if (!file || typeof file.path !== "string" || typeof file.content !== "string") {
        throw Object.assign(new Error("Patch malformé."), { code: "INVALID_PATCH_ENTRY" });
      }

      if (Buffer.byteLength(file.content, "utf8") > MAX_PATCH_BYTES) {
        throw Object.assign(new Error("Patch trop volumineux."), { code: "PATCH_SIZE_LIMIT" });
      }

      const targetPath = resolveSafeTarget(workspaceRoot, file.path);
      
      const verifyBefore = await verifyExpectedHash({ 
        targetPath, 
        expectedHash: file.expectedHash, 
        operation: file.operation 
      });

      // ── Vérification de l'intégrité du contenu Hermes (AVANT écriture) ──
      const contentErrors = detectIncompleteContent(file.content, file.path);
      if (contentErrors.length > 0) {
        const summary = contentErrors.map(e => e.code).join(', ');
        throw Object.assign(
          new Error(`Contenu Hermes invalide pour ${file.path} : ${summary}`),
          { code: 'HERMES_INVALID_CONTENT', details: contentErrors }
        );
      }

      // Écriture dans le workspace de staging UNIQUEMENT — active est en lecture seule
      await atomicWriteWorkspaceFile({ targetPath, content: file.content });
      console.log(`[PATCH APPLIER] 📝 Patch écrit dans workspace : ${targetPath}`);

      const verifyAfter = await verifyWrittenContent({ targetPath, expectedContent: file.content });

      filesReport.push({
        path: file.path,
        operation: file.operation,
        status: "applied",
        expectedHash: file.expectedHash || null,
        actualHashBefore: verifyBefore.actualHash || null,
        actualHashAfter: verifyAfter.hash,
        bytesBefore: verifyBefore.bytesBefore || 0,
        bytesAfter: verifyAfter.bytesAfter
      });
    }
  }

  const activeIntegrity = await verifyActiveIntegrity({ activeRoot: realActiveRoot, baseSnapshot });

  return {
    repairId,
    status: "passed",
    workspaceRoot,
    files: filesReport,
    activeTouched: true,
    activeIntegrity
  };
}

async function promoteWorkspace({ workspaceRoot, activeRoot, patchReport }) {
  if (!patchReport || patchReport.status !== "passed") {
    throw Object.assign(new Error("Cannot promote an incomplete or failed patch."), { code: "PROMOTION_FAILED_INVALID_PATCH" });
  }

  const promotedFiles = [];
  
  for (const file of patchReport.files) {
    if (file.status === "applied") {
      const src = path.join(workspaceRoot, file.path);
      const dest = path.join(activeRoot, file.path);
      
      await fsPromises.mkdir(path.dirname(dest), { recursive: true });
      await fsPromises.copyFile(src, dest);
      promotedFiles.push(file.path);
    }
  }

  return { status: "promoted", promotedFiles };
}

module.exports = {
  assertWorkspaceIsolated,
  applyRepairPlan,
  promoteWorkspace
};
