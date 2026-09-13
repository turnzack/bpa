'use strict';
/**
 * WorkspaceManager — Gestionnaire des chemins de workspace KIROV5
 *
 * ZERO TRUST — v2 :
 *  - paths.active pointe vers projectRoot/active/ (et non projectRoot directement)
 *  - paths.staging pointe vers projectRoot/.kirov/staging/<runId>
 *  - assertStagingNotActive() lève STAGING_ACTIVE_COLLISION si les deux sont confondus
 *  - init() crée tous les dossiers nécessaires et effectue un clonage sécurisé
 *
 * Structure :
 *   projectRoot/
 *   ├── active/              ← code en production (versions gérées par PromotionManager)
 *   ├── .kirov/
 *   │   ├── staging/<runId>/ ← fichiers générés par ArtifactWriter (jamais fusionnés manuellement)
 *   │   ├── backups/         ← sauvegardes atomiques avant promotion
 *   │   ├── sessions/        ← persistance disque des sessions StateStore
 *   │   └── locks/           ← verrous d'exclusion mutuelle
 */

const fs   = require('fs');
const path = require('path');

class WorkspaceManager {
  /**
   * @param {string} rootDir   — Répertoire parent des projets (ex: E:\v0reponses\v0saveprojets)
   * @param {string} projectId — Identifiant du projet
   * @param {string} [runId]   — Identifiant de run unique (UUID ou timestamp)
   */
  constructor(rootDir, projectId, runId = 'run-001') {
    const projectRoot = path.resolve(rootDir, projectId);
    const kirovRoot   = path.join(projectRoot, '.kirov');

    this.projectRoot = projectRoot;
    this.runId       = runId;

    this.paths = {
      projectRoot,                                                   // Racine du projet (lecture seule hors active/)
      active:    path.join(projectRoot, 'active'),                   // Code en production (ZERO TRUST boundary)
      staging:   path.join(kirovRoot,   'staging', runId),          // Fichiers générés — ArtifactWriter uniquement
      workspace: path.join(kirovRoot,   'staging', runId, 'workspace'), // Workspace de build
      batches:   path.join(kirovRoot,   'staging', runId, 'batches'),
      manifests: path.join(kirovRoot,   'staging', runId, 'manifests'),
      reports:   path.join(kirovRoot,   'staging', runId, 'reports'),
      logs:      path.join(kirovRoot,   'staging', runId, 'logs'),
      backups:   path.join(kirovRoot,   'backups'),
      sessions:  path.join(kirovRoot,   'sessions'),
      locks:     path.join(kirovRoot,   'locks'),
      input:     path.join(projectRoot, 'input'),
    };
  }

  // ─── Garde Zero Trust ──────────────────────────────────────────────────────

  /**
   * Vérifie que staging et active ne pointent pas vers le même dossier.
   * @throws STAGING_ACTIVE_COLLISION
   */
  assertStagingNotActive() {
    const staging = path.resolve(this.paths.staging);
    const active  = path.resolve(this.paths.active);
    if (staging === active) {
      throw Object.assign(
        new Error('STAGING_ACTIVE_COLLISION : staging et active sont identiques !'),
        { code: 'STAGING_ACTIVE_COLLISION', staging, active }
      );
    }
  }

  // ─── Initialisation ───────────────────────────────────────────────────────

  /**
   * Crée les dossiers nécessaires et clone le code actif dans le workspace de staging.
   */
  init() {
    // 1. Créer les dossiers de base
    const dirs = [
      this.paths.active,
      this.paths.staging,
      this.paths.workspace,
      this.paths.batches,
      this.paths.manifests,
      this.paths.reports,
      this.paths.logs,
      this.paths.backups,
      this.paths.sessions,
      this.paths.locks,
      this.paths.input,
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    // 2. Garde : staging ≠ active
    this.assertStagingNotActive();

    // 3. Clonage du projet actif vers le workspace de staging
    //    → Priorité 1 : résoudre via CURRENT (versioning PromotionManager)
    //    → Priorité 2 : cloner depuis active/ directement
    let activeSource = this.paths.active;
    const currentFile = path.join(this.paths.active, 'CURRENT');
    if (fs.existsSync(currentFile)) {
      const currentVersion = fs.readFileSync(currentFile, 'utf8').trim();
      const versionPath    = path.join(this.paths.active, 'versions', currentVersion);
      if (fs.existsSync(versionPath)) {
        activeSource = versionPath;
      }
    }

    if (fs.existsSync(activeSource) && activeSource !== this.paths.workspace) {
      const items = fs.readdirSync(activeSource);
      const skip  = new Set(['.kirov', 'node_modules', '.git', 'dist', 'build']);
      for (const item of items) {
        if (skip.has(item.toLowerCase())) continue;
        const src  = path.join(activeSource, item);
        const dest = path.join(this.paths.workspace, item);
        try {
          fs.cpSync(src, dest, { recursive: true });
        } catch (e) {
          console.warn(`[WorkspaceManager] ⚠️ Impossible de cloner ${item} : ${e.message}`);
        }
      }
      console.log(`[WorkspaceManager] ✅ Clonage de ${activeSource} → ${this.paths.workspace}`);
    }

    return this;
  }

  /**
   * Détecte si le projet utilise l'ancien layout (fichiers directement dans projectRoot).
   * Si oui, propose une migration vers active/ sans déplacer automatiquement.
   */
  detectLegacyLayout() {
    const skipDirs = new Set(['.kirov', 'node_modules', '.git', 'dist', 'build', 'active', 'input']);
    const items = fs.existsSync(this.projectRoot) ? fs.readdirSync(this.projectRoot) : [];
    const legacyFiles = items.filter(item => !skipDirs.has(item.toLowerCase()) && !item.startsWith('.'));
    const isLegacy = legacyFiles.length > 0 && !fs.existsSync(path.join(this.paths.active, 'CURRENT'));

    return { isLegacy, legacyFiles };
  }

  /**
   * Migre un projet du layout legacy (fichiers dans projectRoot) vers active/.
   * Crée un backup, copie les fichiers, génère un rapport.
   */
  migrateLegacyToActive() {
    const { isLegacy, legacyFiles } = this.detectLegacyLayout();
    if (!isLegacy) return { migration: 'not_needed' };

    const backupPath = path.join(this.paths.backups, `legacy-migration-${Date.now()}`);
    fs.mkdirSync(backupPath, { recursive: true });
    fs.mkdirSync(this.paths.active, { recursive: true });

    const skipDirs = new Set(['.kirov', 'node_modules', '.git', 'dist', 'build', 'active', 'input']);
    let filesCopied = 0;

    for (const item of legacyFiles) {
      if (skipDirs.has(item.toLowerCase())) continue;
      const src    = path.join(this.projectRoot, item);
      const backup = path.join(backupPath, item);
      const dest   = path.join(this.paths.active, item);
      try {
        fs.cpSync(src, backup, { recursive: true });
        fs.cpSync(src, dest,   { recursive: true });
        filesCopied++;
      } catch (e) {
        console.warn(`[WorkspaceManager] ⚠️ Migration partielle pour ${item} : ${e.message}`);
      }
    }

    const report = {
      migration:     'legacy_to_active_layout',
      status:        'passed',
      source:        this.projectRoot,
      target:        this.paths.active,
      filesCopied,
      backupCreated: true,
      backupPath
    };

    fs.writeFileSync(
      path.join(this.paths.backups, 'migration-report.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );

    console.log(`[WorkspaceManager] ✅ Migration legacy → active/ : ${filesCopied} fichiers copiés. Backup : ${backupPath}`);
    return report;
  }

  getBatchWorkspace(batchId) {
    const batchPath = path.join(this.paths.batches, batchId, 'workspace');
    if (!fs.existsSync(batchPath)) fs.mkdirSync(batchPath, { recursive: true });
    return batchPath;
  }

  /**
   * Résout un chemin relatif à l'intérieur du workspace de staging.
   * Protège contre les path traversal.
   */
  resolveInside(relativePath) {
    const root     = path.resolve(this.paths.workspace);
    const output   = path.resolve(root, relativePath);
    const relative = path.relative(root, output);

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      throw new Error(`Chemin hors workspace refusé : ${relativePath}`);
    }
    return output;
  }
}

module.exports = { WorkspaceManager };
