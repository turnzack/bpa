/**
 * mobile-tools.js — Sprint 1 (Squelette complet)
 * Registre des outils mobiles Expo/React Native pour Hermes.
 * Chaque outil est enregistré dans le tool-registry global.
 *
 * ⚠️  Ce fichier doit être importé APRÈS tool-registry.js dans main.js
 */

'use strict';

const path    = require('path');
const fs      = require('fs');
const { spawn } = require('child_process');

const toolRegistry  = require('../tool-registry');
const mobileEngine  = require('./mobile-job-engine');

// =============================================================================
// HELPERS
// =============================================================================

/** Lance un processus et retourne {status, logs} à la résolution. */
function spawnSecure(cmd, args, cwd) {
  return new Promise((resolve) => {
    // 🛡️ Validation du répertoire de travail
    const safeCwd = path.resolve(cwd);
    if (!fs.existsSync(safeCwd)) {
      return resolve({ status: 'error', message: `Dossier introuvable : ${safeCwd}`, logs: '' });
    }

    const isWin = process.platform === 'win32';
    const child = spawn(
      isWin ? `${cmd}.cmd` : cmd,
      args,
      {
        cwd:   safeCwd,
        shell: false, // 🛡️ Jamais shell:true avec des arguments dynamiques
      }
    );

    let logs = '';
    child.stdout.on('data', d => { logs += d.toString(); });
    child.stderr.on('data', d => { logs += d.toString(); });

    child.on('close', code => {
      if (code === 0) resolve({ status: 'success', logs });
      else            resolve({ status: 'error',   message: `Exit code ${code}`, logs });
    });

    child.on('error', err => {
      resolve({ status: 'error', message: err.message, logs });
    });

    // Timeout de sécurité : 5 minutes max
    setTimeout(() => {
      try { child.kill(); } catch {}
      resolve({ status: 'timeout', message: 'Délai de 5 min dépassé.', logs });
    }, 300_000);
  });
}

// =============================================================================
// OUTIL 1 — create_mobile_job
// =============================================================================
toolRegistry.registerTool(
  'create_mobile_job',
  {
    description: 'Crée un job mobile persistant et initialise le workspace Expo.',
    parameters: {
      type: 'object',
      properties: {
        projectName:  { type: 'string', description: 'Nom lisible du projet mobile' },
        description:  { type: 'string', description: 'Description fonctionnelle courte' },
      },
      required: ['projectName'],
    },
  },
  async ({ projectName, description = '' }) => {
    try {
      const job = mobileEngine.create({ projectName, description });
      console.log(`[MOBILE_TOOL] create_mobile_job → ${job.id}`);
      return { status: 'success', jobId: job.id, projectId: job.projectId, job };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
);

// =============================================================================
// OUTIL 2 — get_mobile_job
// =============================================================================
toolRegistry.registerTool(
  'get_mobile_job',
  {
    description: 'Récupère l\'état complet d\'un job mobile depuis le disque.',
    parameters: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
      },
      required: ['jobId'],
    },
  },
  async ({ jobId }) => {
    const job = mobileEngine.load(jobId);
    if (!job) return { status: 'error', message: `Job introuvable : ${jobId}` };
    return { status: 'success', job };
  }
);

// =============================================================================
// OUTIL 3 — list_mobile_jobs
// =============================================================================
toolRegistry.registerTool(
  'list_mobile_jobs',
  {
    description: 'Liste tous les jobs mobiles (optionnellement filtrés par état).',
    parameters: {
      type: 'object',
      properties: {
        state: { type: 'string', description: 'Filtre par état (pending, generating, completed…)' },
      },
    },
  },
  async ({ state } = {}) => {
    const jobs = mobileEngine.list({ state });
    return { status: 'success', count: jobs.length, jobs };
  }
);

// =============================================================================
// OUTIL 4 — transition_mobile_job
// =============================================================================
toolRegistry.registerTool(
  'transition_mobile_job',
  {
    description: 'Fait avancer la machine à état d\'un job mobile.',
    parameters: {
      type: 'object',
      properties: {
        jobId:     { type: 'string' },
        nextState: { type: 'string', description: 'Nouvel état cible' },
        reason:    { type: 'string' },
      },
      required: ['jobId', 'nextState'],
    },
  },
  async ({ jobId, nextState, reason = '' }) => {
    try {
      const job = mobileEngine.transition(jobId, nextState, reason ? { reason } : {});
      return { status: 'success', job };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
);

// =============================================================================
// OUTIL 5 — snapshot_mobile_job
// =============================================================================
toolRegistry.registerTool(
  'snapshot_mobile_job',
  {
    description: 'Crée un snapshot du projet avant modification (CTO safety rule).',
    parameters: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
      },
      required: ['jobId'],
    },
  },
  async ({ jobId }) => {
    try {
      const snapshotPath = mobileEngine.snapshot(jobId);
      if (!snapshotPath) return { status: 'skipped', message: 'Projet vide, snapshot ignoré.' };
      return { status: 'success', snapshotPath };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  }
);

// =============================================================================
// OUTIL 6 — add_mobile_log
// =============================================================================
toolRegistry.registerTool(
  'add_mobile_log',
  {
    description: 'Ajoute une entrée de log à un job mobile sans changer son état.',
    parameters: {
      type: 'object',
      properties: {
        jobId:   { type: 'string' },
        message: { type: 'string' },
      },
      required: ['jobId', 'message'],
    },
  },
  async ({ jobId, message }) => {
    const job = mobileEngine.addLog(jobId, message);
    if (!job) return { status: 'error', message: `Job introuvable : ${jobId}` };
    return { status: 'success', job };
  }
);

// =============================================================================
// OUTIL 7 — install_mobile_dependencies (squelette Sprint 5)
// =============================================================================
toolRegistry.registerTool(
  'install_mobile_dependencies',
  {
    description: 'Lance pnpm install dans le workspace du projet Expo.',
    parameters: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
      },
      required: ['jobId'],
    },
  },
  async ({ jobId }) => {
    const projectDir = mobileEngine.getProjectDir(jobId);
    if (!projectDir) return { status: 'error', message: `Job introuvable : ${jobId}` };

    mobileEngine.addLog(jobId, '⏳ pnpm install en cours…');
    const result = await spawnSecure('pnpm', ['install'], projectDir);
    mobileEngine.addLog(jobId, `pnpm install → ${result.status}`);

    if (result.status === 'success') {
      mobileEngine.transition(jobId, 'testing');
    } else {
      mobileEngine.fail(jobId, `pnpm install échoué : ${result.message}`);
    }

    return result;
  }
);

// =============================================================================
// OUTIL 8 — run_mobile_typecheck (squelette Sprint 5)
// =============================================================================
toolRegistry.registerTool(
  'run_mobile_typecheck',
  {
    description: 'Exécute tsc --noEmit dans le projet Expo pour valider TypeScript.',
    parameters: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
      },
      required: ['jobId'],
    },
  },
  async ({ jobId }) => {
    const projectDir = mobileEngine.getProjectDir(jobId);
    if (!projectDir) return { status: 'error', message: `Job introuvable : ${jobId}` };

    mobileEngine.addLog(jobId, '⏳ TypeScript check en cours…');
    const result = await spawnSecure('npx', ['tsc', '--noEmit'], projectDir);
    mobileEngine.addLog(jobId, `tsc → ${result.status}`);
    return result;
  }
);

// =============================================================================
// OUTIL 9 — generate_mobile_files (délégation DeepSeek)
// =============================================================================
toolRegistry.registerTool(
  'generate_mobile_files',
  {
    description: 'Délègue la génération des fichiers Expo/RN à l\'extension Chrome via le bridge DeepSeek.',
    parameters: {
      type: 'object',
      properties: {
        jobId:    { type: 'string' },
        prompt:   { type: 'string', description: 'Prompt enrichi avec StitchSpec + règles natif' },
        phase:    { type: 'number' },
      },
      required: ['jobId', 'prompt'],
    },
  },
  async ({ jobId, prompt, phase = 5 }) => {
    const job = mobileEngine.load(jobId);
    if (!job) return { status: 'error', message: `Job introuvable : ${jobId}` };

    try {
      mobileEngine.addLog(jobId, `📡 Délégation génération Phase ${phase} → DeepSeek bridge`);

      const response = await fetch('http://127.0.0.1:5006/bridge/prompt', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          prompt,
          target_ai:      'deepseek',
          target_project: job.projectId,
          project_id:     job.projectId,
          phase_num:      phase,
          phase_name:     `mobile_phase_${phase}`,
        }),
      });

      const data = await response.json();
      mobileEngine.addLog(jobId, `Bridge répondu : ${data.success ? '✅' : '❌'} (prompt_id: ${data.prompt_id})`);
      mobileEngine.transition(jobId, 'generating');

      return { status: 'queued', promptId: data.prompt_id, jobId };
    } catch (e) {
      mobileEngine.fail(jobId, `Bridge indisponible : ${e.message}`);
      return { status: 'error', message: e.message };
    }
  }
);

// =============================================================================
// OUTIL 10 — write_generated_files
// =============================================================================
toolRegistry.registerTool(
  'write_generated_files',
  {
    description: 'Écrit les fichiers Expo/RN générés par DeepSeek dans le workspace du projet.',
    parameters: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        files: {
          type:  'array',
          items: {
            type:       'object',
            properties: {
              path:    { type: 'string' },
              content: { type: 'string' },
            },
          },
          description: 'Tableau de {path, content} — chemins relatifs uniquement',
        },
      },
      required: ['jobId', 'files'],
    },
  },
  async ({ jobId, files }) => {
    const projectDir = mobileEngine.getProjectDir(jobId);
    if (!projectDir) return { status: 'error', message: `Job introuvable : ${jobId}` };

    // 🛡️ Snapshot avant écriture
    mobileEngine.snapshot(jobId);

    const saved   = [];
    const refused = [];

    for (const file of files) {
      // 🛡️ Validations de sécurité
      if (!file.path || typeof file.path !== 'string') { refused.push({ reason: 'path manquant', file }); continue; }
      if (file.path.includes('..'))                     { refused.push({ reason: 'path traversal', path: file.path }); continue; }
      if (file.path.length > 200)                       { refused.push({ reason: 'path trop long', path: file.path }); continue; }
      if (file.path.includes('\n'))                     { refused.push({ reason: 'path multi-ligne', path: file.path }); continue; }

      // 🛡️ Anti-WebView / anti-HTML runtime
      if (
        file.content && (
          file.content.includes('<WebView') ||
          file.content.includes('dangerouslySetInnerHTML') ||
          file.content.includes('document.write')
        )
      ) {
        refused.push({ reason: 'contenu WebView/HTML interdit', path: file.path });
        mobileEngine.addLog(jobId, `⛔ Fichier refusé (WebView détecté) : ${file.path}`);
        continue;
      }

      try {
        const fullPath = path.join(projectDir, file.path);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, file.content, 'utf-8');
        saved.push(file.path);
        mobileEngine.addLog(jobId, `✅ Écrit : ${file.path}`);
      } catch (e) {
        refused.push({ reason: e.message, path: file.path });
      }
    }

    // Mise à jour des fichiers générés dans le job
    mobileEngine.update(jobId, { generatedFiles: files.map(f => ({ path: f.path })) });
    mobileEngine.transition(jobId, 'validating');

    return { status: 'success', saved: saved.length, refused: refused.length, savedPaths: saved, refusedFiles: refused };
  }
);

// =============================================================================
// OUTIL 11 — save_mobile_memory
// =============================================================================
toolRegistry.registerTool(
  'save_mobile_memory',
  {
    description: 'Enregistre la mémoire du projet mobile (StitchSpec + fichiers clés) pour Hermes.',
    parameters: {
      type: 'object',
      properties: {
        jobId:   { type: 'string' },
        payload: { type: 'object', description: 'Données à mémoriser (spec, corrections, routes…)' },
      },
      required: ['jobId'],
    },
  },
  async ({ jobId, payload = {} }) => {
    const job = mobileEngine.load(jobId);
    if (!job) return { status: 'error', message: `Job introuvable : ${jobId}` };

    const memoryStore = require('../memory-store');
    await memoryStore.saveObservation(job.projectId, { jobId, type: 'mobile_memory', ...payload });

    mobileEngine.addLog(jobId, '🧠 Mémoire sauvegardée dans memory-store.');
    return { status: 'success', projectId: job.projectId };
  }
);

console.log('[MOBILE_TOOLS] ✅ 11 outils mobiles enregistrés dans le tool-registry.');
