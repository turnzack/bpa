'use strict';
/**
 * TIGER-080 — Orchestrateur de Réparation Autonome (Auto-Repair Loop)
 * electron/orchestrator/mobile/auto-repair-orchestrator.js
 *
 * Scanne, valide (MobileValidator + tsc + eslint) et orchestre la correction automatique des erreurs.
 * RÈGLE CTO : Max 3 tentatives par fichier. Arrêt immédiat dès que le projet est 100% propre.
 */

const fs   = require('fs');
const path = require('path');
const MobileValidator = require('./mobile-validator');
const LocalMemory     = require('../../services/local-memory-service');
const McpHost          = require('../../mcp/mcp-host');


class AutoRepairOrchestrator {
  /**
   * Lance un cycle complet d'auto-réparation pour un projet.
   * @param {object} opts
   * @param {string} opts.projectId
   * @param {string} opts.projectDir
   * @param {Map<string, number>} [opts.fileRepairCounts]
   * @returns {Promise<{ success: boolean, totalErrors: number, attemptsMade: number, repairedFiles: string[], remainingErrors: object[] }>}
   */
  static async runAutoRepair({ projectId, projectDir, fileRepairCounts = new Map() }) {
    console.log(`[AUTO-REPAIR] Démarrage du cycle d'auto-réparation pour ${projectId}...`);

    let attemptsMade = 0;
    const maxCycles   = 3;
    const repaired    = new Set();

    while (attemptsMade < maxCycles) {
      attemptsMade++;

      // 1. Scan de validation 3 axes : Structural (MobileValidator) + TypeScript (tsc) + Lint (eslint)
      const scan = await this.performFullScan(projectDir);

      if (scan.valid && scan.totalErrors === 0) {
        console.log(`[AUTO-REPAIR] ✅ Projet 100% propre et valide au cycle ${attemptsMade}.`);
        LocalMemory.logEvent(projectId, 'auto_repair_success', { cycles: attemptsMade });
        return {
          success:         true,
          totalErrors:     0,
          attemptsMade,
          repairedFiles:   [...repaired],
          remainingErrors: [],
        };
      }

      console.log(`[AUTO-REPAIR] Cycle ${attemptsMade}/${maxCycles} : ${scan.totalErrors} erreur(s) détectée(s).`);

      // 2. Filtrer les fichiers en erreur qui n'ont pas dépassé 3 réparations
      const filesToRepair = scan.failingFiles.filter(f => {
        const cnt = fileRepairCounts.get(f.path) || 0;
        return cnt < 3;
      });

      if (filesToRepair.length === 0) {
        console.warn(`[AUTO-REPAIR] Tous les fichiers en erreur ont atteint la limite de 3 tentatives.`);
        LocalMemory.logEvent(projectId, 'auto_repair_limit_reached', { attemptsMade, errors: scan.totalErrors });
        return {
          success:         false,
          totalErrors:     scan.totalErrors,
          attemptsMade,
          repairedFiles:   [...repaired],
          remainingErrors: scan.failingFiles,
        };
      }

      // 3. Traiter le premier fichier prioritaire
      const target = filesToRepair[0];
      const currentCnt = fileRepairCounts.get(target.path) || 0;
      fileRepairCounts.set(target.path, currentCnt + 1);

      console.log(`[AUTO-REPAIR] Réparation ciblée de "${target.path}" (tentative ${currentCnt + 1}/3)...`);

      // 4. Générer le prompt de correction ciblée et l'envoyer au bridge DeepSeek
      const promptText = this.buildSurgicalPrompt(target, projectDir);
      try {
        await McpHost.call('browser-deepseek-extension', 'send_prompt_to_browser', {
          projectId,
          prompt:    promptText,
          phaseNum:  'repair',
          phaseName: `repair_${path.basename(target.path)}`,
        });

        repaired.add(target.path);
        LocalMemory.save(projectId, 'repair_prompt', promptText, { source: target.path }).catch(() => {});
      } catch (err) {
        console.warn(`[AUTO-REPAIR] Échec envoi prompt de réparation : ${err.message}`);
      }

      // Micro-pause entre les cycles
      await new Promise(r => setTimeout(r, 1000));
    }

    const finalScan = await this.performFullScan(projectDir);

    return {
      success:         finalScan.valid,
      totalErrors:     finalScan.totalErrors,
      attemptsMade,
      repairedFiles:   [...repaired],
      remainingErrors: finalScan.failingFiles,
    };
  }

  /**
   * Exécute une analyse complète 3 axes du projet.
   */
  static async performFullScan(projectDir) {
    const failingFilesMap = new Map();
    let totalErrors = 0;

    // Axe 1 : Structural (MobileValidator)
    const structRes = MobileValidator.validateProjectDir(projectDir);
    if (!structRes.valid) {
      for (const res of structRes.results) {
        if (!res.ok) {
          failingFilesMap.set(res.path, {
            path:   res.path,
            errors: res.errors,
            type:   'structural',
          });
          totalErrors += res.errors.length;
        }
      }
    }

    // Axe 2 : TypeScript (tsc) via MCP project-runner
    try {
      const tscRes = await McpHost.call('project-runner', 'run_typecheck', { projectDir });
      if (tscRes.ok && !tscRes.result.success && tscRes.result.errors) {
        for (const err of tscRes.result.errors) {
          const relPath = path.relative(projectDir, err.file).replace(/\\/g, '/');
          const existing = failingFilesMap.get(relPath) || { path: relPath, errors: [], type: 'typecheck' };
          existing.errors.push(`TS${err.code} Ligne ${err.line}:${err.col} — ${err.message}`);
          failingFilesMap.set(relPath, existing);
          totalErrors++;
        }
      }
    } catch {}

    const failingFiles = Array.from(failingFilesMap.values());

    return {
      valid:       totalErrors === 0,
      totalErrors,
      failingFiles,
    };
  }

  /**
   * Construit un prompt chirurgical pour réparer un fichier spécifique.
   */
  static buildSurgicalPrompt(target, projectDir) {
    let currentCode = '';
    try {
      const absPath = path.join(projectDir, target.path);
      if (fs.existsSync(absPath)) {
        currentCode = fs.readFileSync(absPath, 'utf-8');
      }
    } catch {}

    return `RÉPARATION CHIRURGICALE REACT NATIVE — FICHIER "${target.path}"
=================================================================
Erreurs détectées :
${target.errors.map(e => '- ' + e).join('\n')}

Code actuel (incomplet ou en erreur) :
\`\`\`typescript
${currentCode.slice(0, 3000)}
\`\`\`

CONSIGNE ABSOLUE :
Corrige uniquement ce fichier.
Interdit : WebView, HTML runtime, CSS navigateur, JS incomplet.
Requis : React Native natif (View, Text, Pressable, ScrollView, StyleSheet/NativeWind).

Format de réponse :
{"projectId":"...","phase":"repair","status":"completed","files":[{"path":"${target.path}","content":"...code corrigé complet...","language":"typescript"}]}`;
  }
}

module.exports = AutoRepairOrchestrator;
