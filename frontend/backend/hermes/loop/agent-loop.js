'use strict';
/**
 * TIGER-060 — Boucle Agentique Hermes (Agent Loop)
 * hermes/loop/agent-loop.js
 *
 * Exécute la boucle autonome de décision et d'appel d'outils MCP pour un projet.
 * - Max 20 itérations
 * - Suivi état de la boucle en mémoire et SQLite
 * - Arrêt propre via stopLoop()
 */

const DecisionEngine = require('../agent/decision-engine');
const McpHost        = require('../../electron/mcp/mcp-host');
const LocalMemory    = require('../../electron/services/local-memory-service');

const _activeLoops = new Map(); // projectId -> AgentLoop instance

class AgentLoop {
  /**
   * @param {object} opts
   * @param {object} opts.job
   * @param {object} [opts.contract]
   * @param {object} [opts.validation]
   * @param {Function} [opts.onStep]  Callback(stepInfo)
   */
  constructor({ job, contract = null, validation = null, onStep = () => {} }) {
    this.job          = job;
    this.projectId    = job.projectId;
    this.contract     = contract;
    this.validation   = validation;
    this.onStep       = onStep;
    this.stepCount    = 0;
    this.maxSteps     = 20;
    this.running      = false;
    this.stopped      = false;
    this.history      = [];
    this.fileRepairs  = new Map(); // path -> count
  }

  /**
   * Exécute un pas unique de la boucle.
   */
  async step() {
    if (this.stopped) return { status: 'stopped', reason: 'Boucle arrêtée manuellement.' };

    this.stepCount++;
    const stepNum = this.stepCount;

    // 1. Obtenir la décision du moteur Hermes
    const decision = await DecisionEngine.decide({
      job:              this.job,
      contract:         this.contract,
      validation:       this.validation,
      stepCount:        this.stepCount,
      fileRepairCounts: this.fileRepairs,
    });

    const stepRecord = {
      step:       stepNum,
      timestamp:  new Date().toISOString(),
      decision,
      result:     null,
      error:      null,
    };

    // 2. Traitement selon l'action décidée
    if (decision.action === 'complete') {
      this.running = false;
      stepRecord.result = { message: 'Boucle terminée avec succès.' };
      this.history.push(stepRecord);
      this.onStep(stepRecord);
      LocalMemory.logEvent(this.projectId, 'hermes_completed', { steps: stepNum });
      return { status: 'completed', steps: stepNum, decision, history: this.history };
    }

    if (decision.action === 'error' || decision.action === 'wait_user') {
      this.running = false;
      stepRecord.error = decision.reason;
      this.history.push(stepRecord);
      this.onStep(stepRecord);
      LocalMemory.logEvent(this.projectId, 'hermes_failed', { reason: decision.reason, steps: stepNum });
      return { status: 'failed', steps: stepNum, reason: decision.reason, decision, history: this.history };
    }

    // 3. Exécution de l'outil MCP (action === 'call_tool')
    if (decision.action === 'call_tool' && decision.toolId) {
      try {
        console.log(`[HERMES-LOOP] Pas ${stepNum} -> Invoque ${decision.toolId}`);
        const mcpResult = await McpHost.callById(decision.toolId, decision.args || {});

        stepRecord.result = mcpResult.result || mcpResult;
        if (!mcpResult.ok) stepRecord.error = mcpResult.error;

        // Mise à jour de la validation si typecheck
        if (decision.toolId === 'mcp.project-runner.run_typecheck' && mcpResult.ok) {
          this.validation = {
            valid:       mcpResult.result.success,
            failedFiles: mcpResult.result.errors || [],
          };
        }
      } catch (err) {
        stepRecord.error = err.message;
        console.warn(`[HERMES-LOOP] Pas ${stepNum} erreur : ${err.message}`);
      }
    }

    this.history.push(stepRecord);
    this.onStep(stepRecord);
    LocalMemory.logEvent(this.projectId, 'hermes_step', { step: stepNum, tool: decision.toolId, success: !stepRecord.error });

    return { status: 'running', step: stepNum, decision, result: stepRecord.result, error: stepRecord.error };
  }

  /**
   * Lance la boucle de manière autonome jusqu'à complétion ou erreur.
   */
  async run() {
    this.running = true;
    this.stopped = false;
    _activeLoops.set(this.projectId, this);

    console.log(`[HERMES-LOOP] Démarrage boucle agentique pour ${this.projectId}`);

    try {
      while (this.running && !this.stopped && this.stepCount < this.maxSteps) {
        const res = await this.step();
        if (res.status === 'completed' || res.status === 'failed' || res.status === 'stopped') {
          break;
        }
        // Micro-pause entre les itérations
        await new Promise(r => setTimeout(r, 500));
      }
    } finally {
      this.running = false;
      _activeLoops.delete(this.projectId);
    }

    return {
      projectId: this.projectId,
      totalSteps: this.stepCount,
      history:    this.history,
    };
  }

  /**
   * Arrête immédiatement la boucle.
   */
  stop() {
    this.stopped = true;
    this.running = false;
    _activeLoops.delete(this.projectId);
    console.log(`[HERMES-LOOP] Boucle arrêtée pour ${this.projectId}`);
  }
}

// ── Helpers statiques de gestion des boucles ──────────────────────────────────

function getActiveLoop(projectId) {
  return _activeLoops.get(projectId) || null;
}

function stopActiveLoop(projectId) {
  const loop = _activeLoops.get(projectId);
  if (loop) {
    loop.stop();
    return true;
  }
  return false;
}

module.exports = { AgentLoop, getActiveLoop, stopActiveLoop };
