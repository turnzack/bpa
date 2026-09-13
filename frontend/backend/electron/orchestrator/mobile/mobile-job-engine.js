/**
 * MobileJobEngine — Sprint 1
 * Moteur de persistance des jobs de génération mobile Expo/React Native.
 * Survit aux crashes Electron (stockage JSON disque).
 * Architecture : strictement additive — n'impacte pas le pipeline KIROV5 existant.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// =============================================================================
// CONSTANTES
// =============================================================================

const BASE_WORKSPACE = global.WORKSPACE_DIR || process.env.WORKSPACE_DIR || path.join(process.cwd(), 'v0saveprojets');

/** Répertoire de persistance des jobs mobiles */
const MOBILE_JOBS_DIR = path.join(BASE_WORKSPACE, '.kirov', 'jobs');

/** Répertoire des snapshots avant modification */
const MOBILE_SNAPSHOTS_DIR = path.join(BASE_WORKSPACE, '.kirov', 'snapshots');

/** Workspace disque des projets Expo générés */
const MOBILE_PROJECTS_DIR = BASE_WORKSPACE;

/** Toutes les transitions valides de la machine à état */
const VALID_TRANSITIONS = {
  pending:      ['analyzing', 'failed'],
  analyzing:    ['parsing',   'failed'],
  parsing:      ['designing', 'failed'],
  designing:    ['generating','failed'],
  generating:   ['validating','failed'],
  validating:   ['installing','repairing','failed'],
  installing:   ['testing',   'failed'],
  testing:      ['previewing','repairing','failed'],
  repairing:    ['validating','failed'],
  previewing:   ['documenting','failed'],
  documenting:  ['completed', 'failed'],
  completed:    [],
  failed:       [],
};

/**
 * @typedef {'pending'|'analyzing'|'parsing'|'designing'|'generating'|
 *           'validating'|'installing'|'testing'|'repairing'|
 *           'previewing'|'documenting'|'completed'|'failed'} MobileJobState
 *
 * @typedef {{
 *   id:           string,
 *   projectId:    string,
 *   projectName:  string,
 *   state:        MobileJobState,
 *   phase:        number,
 *   stitch?:      object,
 *   generatedFiles?: Array<{path:string,content:string,language:string}>,
 *   logs:         string[],
 *   errorCount:   number,
 *   repairCount:  number,
 *   snapshotPath? :string,
 *   createdAt:    number,
 *   updatedAt:    number
 * }} MobileJob
 */

// =============================================================================
// UTILITAIRES INTERNES
// =============================================================================

/** Garantit l'existence d'un répertoire. */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Chemin du fichier JSON d'un job. */
function jobFilePath(jobId) {
  return path.join(MOBILE_JOBS_DIR, `${jobId}.json`);
}

/** Timestamp formaté pour les logs. */
function ts() {
  return new Date().toLocaleTimeString('fr-FR', { hour12: false });
}

// =============================================================================
// CLASSE ENGINE
// =============================================================================

class MobileJobEngine {
  constructor() {
    ensureDir(MOBILE_JOBS_DIR);
    ensureDir(MOBILE_SNAPSHOTS_DIR);
    ensureDir(MOBILE_PROJECTS_DIR);
    console.log('[MOBILE_ENGINE] ✅ Moteur initialisé.');
    console.log(`[MOBILE_ENGINE] Jobs     : ${MOBILE_JOBS_DIR}`);
    console.log(`[MOBILE_ENGINE] Projets  : ${MOBILE_PROJECTS_DIR}`);
    console.log(`[MOBILE_ENGINE] Snapshots: ${MOBILE_SNAPSHOTS_DIR}`);
  }

  // ---------------------------------------------------------------------------
  // CRUD JOBS
  // ---------------------------------------------------------------------------

  /**
   * Crée un nouveau job mobile et le persiste immédiatement sur disque.
   * @param {object} opts
   * @param {string} opts.projectName  Nom lisible du projet
   * @param {string} [opts.description] Description courte
   * @returns {MobileJob}
   */
  create({ projectName, description = '' }) {
    if (!projectName || typeof projectName !== 'string') {
      throw new Error('[MOBILE_ENGINE] projectName est requis.');
    }

    const id        = `mobile-${Date.now()}`;
    const projectId = `${id}-${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)}`;

    /** @type {MobileJob} */
    const job = {
      id,
      projectId,
      projectName,
      description,
      state:          'pending',
      phase:          0,
      stitch:         null,
      generatedFiles: [],
      logs:           [`[${ts()}] Job créé : ${projectName}`],
      errorCount:     0,
      repairCount:    0,
      snapshotPath:   null,
      createdAt:      Date.now(),
      updatedAt:      Date.now(),
    };

    this._write(job);
    console.log(`[MOBILE_ENGINE] ✅ Job créé : ${id} (${projectName})`);
    return job;
  }

  /**
   * Charge un job depuis le disque.
   * @param {string} jobId
   * @returns {MobileJob|null}
   */
  load(jobId) {
    const filePath = jobFilePath(jobId);
    if (!fs.existsSync(filePath)) return null;
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`[MOBILE_ENGINE] ❌ Erreur lecture job ${jobId}: ${e.message}`);
      return null;
    }
  }

  /**
   * Liste tous les jobs (du plus récent au plus ancien).
   * @param {object} [opts]
   * @param {MobileJobState} [opts.state] Filtre par état
   * @returns {MobileJob[]}
   */
  list({ state: filterState } = {}) {
    ensureDir(MOBILE_JOBS_DIR);
    try {
      return fs.readdirSync(MOBILE_JOBS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => {
          try { return JSON.parse(fs.readFileSync(path.join(MOBILE_JOBS_DIR, f), 'utf-8')); }
          catch { return null; }
        })
        .filter(j => j && (!filterState || j.state === filterState))
        .sort((a, b) => b.createdAt - a.createdAt);
    } catch (e) {
      console.error(`[MOBILE_ENGINE] ❌ Erreur listing jobs: ${e.message}`);
      return [];
    }
  }

  /**
   * Met à jour des champs d'un job existant.
   * @param {string} jobId
   * @param {Partial<MobileJob>} patches
   * @returns {MobileJob}
   */
  update(jobId, patches) {
    const job = this.load(jobId);
    if (!job) throw new Error(`[MOBILE_ENGINE] Job introuvable : ${jobId}`);

    const updated = { ...job, ...patches, updatedAt: Date.now() };
    this._write(updated);
    return updated;
  }

  /**
   * Supprime un job (et son fichier JSON).
   * @param {string} jobId
   */
  delete(jobId) {
    const filePath = jobFilePath(jobId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[MOBILE_ENGINE] 🗑️ Job supprimé : ${jobId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // MACHINE À ÉTAT
  // ---------------------------------------------------------------------------

  /**
   * Fait avancer l'état d'un job vers le prochain état valide.
   * @param {string} jobId
   * @param {MobileJobState} nextState
   * @param {object} [metadata] Champs supplémentaires à persister (ex: stitch)
   * @returns {MobileJob}
   */
  transition(jobId, nextState, metadata = {}) {
    const job = this.load(jobId);
    if (!job) throw new Error(`[MOBILE_ENGINE] Job introuvable : ${jobId}`);

    const allowed = VALID_TRANSITIONS[job.state] || [];
    if (!allowed.includes(nextState)) {
      throw new Error(
        `[MOBILE_ENGINE] Transition invalide ${job.state} → ${nextState} pour le job ${jobId}.`
      );
    }

    const phaseMap = {
      pending:     0, analyzing: 1, parsing: 2, designing: 3,
      generating:  5, validating: 6, installing: 7, testing: 8,
      repairing:   8, previewing: 9, documenting: 10, completed: 11, failed: -1
    };

    const logEntry = `[${ts()}] État : ${job.state} → ${nextState}`;
    const updated  = {
      ...job,
      ...metadata,
      state:     nextState,
      phase:     phaseMap[nextState] ?? job.phase,
      logs:      [...(job.logs || []), logEntry],
      updatedAt: Date.now(),
    };

    this._write(updated);
    console.log(`[MOBILE_ENGINE] 🔄 ${jobId} : ${job.state} → ${nextState}`);
    return updated;
  }

  /**
   * Ajoute une entrée de log à un job sans changer son état.
   * @param {string} jobId
   * @param {string} message
   * @returns {MobileJob}
   */
  addLog(jobId, message) {
    const job = this.load(jobId);
    if (!job) return null;
    const entry = `[${ts()}] ${message}`;
    return this._write({
      ...job,
      logs:      [...(job.logs || []), entry],
      updatedAt: Date.now(),
    });
  }

  /**
   * Marque un job comme échoué avec un message d'erreur.
   * @param {string} jobId
   * @param {string} reason
   * @returns {MobileJob}
   */
  fail(jobId, reason) {
    const job = this.load(jobId);
    if (!job) throw new Error(`[MOBILE_ENGINE] Job introuvable : ${jobId}`);

    const entry = `[${ts()}] ❌ ÉCHEC : ${reason}`;
    const updated = {
      ...job,
      state:      'failed',
      errorCount: (job.errorCount || 0) + 1,
      logs:       [...(job.logs || []), entry],
      updatedAt:  Date.now(),
    };

    this._write(updated);
    console.error(`[MOBILE_ENGINE] ❌ Job ${jobId} échoué : ${reason}`);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // SNAPSHOTS
  // ---------------------------------------------------------------------------

  /**
   * Prend un snapshot du dossier projet avant modification.
   * Stocké sous forme de fichier JSON dans MOBILE_SNAPSHOTS_DIR.
   * @param {string} jobId
   * @returns {string|null} chemin du snapshot ou null si projet vide
   */
  snapshot(jobId) {
    const job = this.load(jobId);
    if (!job) return null;

    const projectDir = path.join(MOBILE_PROJECTS_DIR, job.projectId);
    if (!fs.existsSync(projectDir)) return null;

    const snapshotData = {
      jobId,
      projectId:  job.projectId,
      capturedAt: Date.now(),
      files:      this._readDirRecursive(projectDir, projectDir),
    };

    const snapshotPath = path.join(
      MOBILE_SNAPSHOTS_DIR,
      `${jobId}-${Date.now()}.json`
    );

    fs.writeFileSync(snapshotPath, JSON.stringify(snapshotData, null, 2), 'utf-8');
    this.update(jobId, { snapshotPath });
    console.log(`[MOBILE_ENGINE] 📸 Snapshot créé : ${snapshotPath}`);
    return snapshotPath;
  }

  /**
   * Restaure un projet depuis un snapshot.
   * @param {string} snapshotPath Chemin absolu du fichier snapshot
   * @returns {boolean}
   */
  restore(snapshotPath) {
    if (!fs.existsSync(snapshotPath)) {
      console.error(`[MOBILE_ENGINE] Snapshot introuvable : ${snapshotPath}`);
      return false;
    }

    try {
      const data       = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
      const projectDir = path.join(MOBILE_PROJECTS_DIR, data.projectId);

      for (const { relativePath, content } of data.files) {
        const fullPath = path.join(projectDir, relativePath);
        ensureDir(path.dirname(fullPath));
        fs.writeFileSync(fullPath, content, 'utf-8');
      }

      console.log(`[MOBILE_ENGINE] ♻️ Restauration terminée depuis ${snapshotPath}`);
      return true;
    } catch (e) {
      console.error(`[MOBILE_ENGINE] ❌ Erreur restauration : ${e.message}`);
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  /** Chemin absolu du dossier projet Expo. */
  getProjectDir(jobId) {
    const job = this.load(jobId);
    if (!job) return null;
    return path.join(MOBILE_PROJECTS_DIR, job.projectId);
  }

  /** Constantes exposées pour les endpoints. */
  get dirs() {
    return {
      jobs:      MOBILE_JOBS_DIR,
      snapshots: MOBILE_SNAPSHOTS_DIR,
      projects:  MOBILE_PROJECTS_DIR,
    };
  }

  // ---------------------------------------------------------------------------
  // PRIVÉ
  // ---------------------------------------------------------------------------

  /** Écrit un job sur disque et le retourne. */
  _write(job) {
    ensureDir(MOBILE_JOBS_DIR);
    fs.writeFileSync(jobFilePath(job.id), JSON.stringify(job, null, 2), 'utf-8');
    return job;
  }

  /** Lit récursivement un dossier en mémoire pour les snapshots. */
  _readDirRecursive(baseDir, currentDir) {
    const result = [];
    const SKIP   = new Set(['node_modules', '.git', '.expo', 'dist', 'build']);

    try {
      for (const item of fs.readdirSync(currentDir, { withFileTypes: true })) {
        if (SKIP.has(item.name)) continue;
        const fullPath    = path.join(currentDir, item.name);
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

        if (item.isDirectory()) {
          result.push(...this._readDirRecursive(baseDir, fullPath));
        } else {
          try {
            result.push({ relativePath, content: fs.readFileSync(fullPath, 'utf-8') });
          } catch { /* fichiers binaires ignorés */ }
        }
      }
    } catch (e) {
      console.warn(`[MOBILE_ENGINE] Avertissement lecture dossier : ${e.message}`);
    }

    return result;
  }
}

module.exports = new MobileJobEngine();
