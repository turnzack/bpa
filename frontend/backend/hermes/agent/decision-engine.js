'use strict';
/**
 * TIGER-061 — Moteur de Décision Local Hermes
 * hermes/agent/decision-engine.js
 *
 * Évalue l'état actuel d'un projet, consulte sa mémoire SQLite
 * et détermine la prochaine action optimale (outil MCP à invoquer ou phase à exécuter).
 *
 * Règles :
 * - Maximum 20 itérations par exécution
 * - Maximum 3 tentatives de réparation par fichier
 * - Journalisation systématique des décisions dans SQLite
 */

const LocalMemory = require('../../electron/services/local-memory-service');

class DecisionEngine {
  /**
   * Évalue le projet et retourne la décision suivante.
   * @param {object} opts
   * @param {object} opts.job             Métadonnées du job
   * @param {object} opts.contract        Contrat projet (si disponible)
   * @param {object} opts.validation      Résultats de validation (typecheck/validator)
   * @param {number} opts.stepCount       Nombre de pas effectués dans la boucle actuelle
   * @param {Map<string, number>} opts.fileRepairCounts  Compteurs de réparations par fichier
   * @returns {Promise<{ action: 'call_tool'|'complete'|'error'|'wait_user', toolId?: string, args?: object, reason: string, phase: string }>}
   */
  static async decide({ job, contract, validation, stepCount = 0, fileRepairCounts = new Map() }) {
    const projectId = job.projectId;
    const state     = job.state;

    // 1. Limite d'itérations
    if (stepCount >= 20) {
      const decision = {
        action: 'error',
        reason: 'Limite maximale de 20 itérations atteinte par Hermes.',
        phase: 'iteration_limit',
      };
      LocalMemory.saveDecision(projectId, 'iteration_limit', 'STOP', decision.reason, '', 'limit_reached');
      return decision;
    }

    // 2. Récupérer le contexte récent depuis la mémoire SQLite
    const context = LocalMemory.getProjectContext(projectId);
    const errors  = LocalMemory.getPreviousErrors(projectId);

    // ── Phase 1 : Extraction du contrat (si pas encore fait) ──────────────────
    if (!contract && job.stitch) {
      const decision = {
        action: 'call_tool',
        toolId: 'mcp.project-memory.save_project_memory',
        args: { projectId, type: 'status', content: 'Hermes démarre l\'analyse du projet.' },
        reason: 'Initialisation du contexte projet par Hermes.',
        phase:  'init',
      };
      LocalMemory.saveDecision(projectId, 'init', 'START_ANALYSIS', decision.reason, decision.toolId, 'ok');
      return decision;
    }

    // ── Phase 2 : Vérification du TypeCheck / Validation ─────────────────────
    if (validation) {
      if (!validation.valid && validation.failedFiles && validation.failedFiles.length > 0) {
        // Sélection du premier fichier échoué qui n'a pas dépassé 3 tentatives
        const targetFile = validation.failedFiles.find(f => (fileRepairCounts.get(f.path || f) || 0) < 3);

        if (!targetFile) {
          const decision = {
            action: 'error',
            reason: 'Tous les fichiers en erreur ont atteint la limite de 3 réparations.',
            phase:  'repair_exhausted',
          };
          LocalMemory.saveDecision(projectId, 'repair_exhausted', 'STOP', decision.reason, '', 'failed');
          return decision;
        }

        const filePath    = targetFile.path || targetFile;
        const currentCnt  = fileRepairCounts.get(filePath) || 0;
        fileRepairCounts.set(filePath, currentCnt + 1);

        const decision = {
          action: 'call_tool',
          toolId: 'mcp.browser-deepseek-extension.send_prompt_to_browser',
          args: {
            projectId,
            prompt: `Le fichier "${filePath}" contient des erreurs (tentative ${currentCnt + 1}/3). Veuillez corriger le code TypeScript/React Native natif sans WebView.`,
            phaseNum: 'repair',
            phaseName: 'file_repair',
          },
          reason: `Réparation demandée pour ${filePath} (tentative ${currentCnt + 1}/3).`,
          phase:  'repair',
        };
        LocalMemory.saveDecision(projectId, 'repair', `REPAIR_${filePath}`, decision.reason, decision.toolId, 'queued');
        return decision;
      }
    }

    // ── Phase 3 : Exécution du TypeCheck ─────────────────────────────────────
    if (state === 'testing' || state === 'repairing') {
      const decision = {
        action: 'call_tool',
        toolId: 'mcp.project-runner.run_typecheck',
        args:   { projectDir: job.projectDir },
        reason: 'Lancement du TypeCheck TypeScript pour vérifier la conformité du code.',
        phase:  'typecheck',
      };
      LocalMemory.saveDecision(projectId, 'typecheck', 'RUN_TSC', decision.reason, decision.toolId, 'pending');
      return decision;
    }

    // ── Phase 4 : Finalisation du projet ─────────────────────────────────────
    if (state === 'completed' || state === 'previewing') {
      const decision = {
        action: 'complete',
        reason: 'Le projet est valide et prêt pour le preview Expo Go.',
        phase:  'completed',
      };
      LocalMemory.saveDecision(projectId, 'completed', 'FINISH', decision.reason, '', 'success');
      return decision;
    }

    // ── Fallback par défaut ──────────────────────────────────────────────────
    const decision = {
      action: 'call_tool',
      toolId: 'mcp.project-memory.get_project_context',
      args:   { projectId },
      reason: `Lecture du contexte Hermes pour l'état : ${state}.`,
      phase:  'context_check',
    };
    LocalMemory.saveDecision(projectId, 'context_check', 'CHECK_CONTEXT', decision.reason, decision.toolId, 'done');
    return decision;
  }
}

module.exports = DecisionEngine;
