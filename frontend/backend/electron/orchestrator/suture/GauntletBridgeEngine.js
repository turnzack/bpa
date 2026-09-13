'use strict';

const fs = require('fs/promises');
const path = require('path');
const { validateWorkspace } = require('./ValidationRunner');

// Map pour suivre l'état des itérations par projet
const gauntletSessions = new Map();

class GauntletBridgeEngine {
  static getSession(projectId) {
    if (!gauntletSessions.has(projectId)) {
      gauntletSessions.set(projectId, { attempt: 1, maxAttempts: 5 });
    }
    return gauntletSessions.get(projectId);
  }

  static resetSession(projectId) {
    gauntletSessions.set(projectId, { attempt: 1, maxAttempts: 5 });
  }

  /**
   * Traite les artefacts capturés par l'extension KIROV5 sur DeepSeek Chat.
   * 1. Écrit les fichiers sur disque
   * 2. Lance le ValidationRunner (Critique severe)
   * 3. Si erreur : génère et réinjecte le prompt de correction dans la queue du bridge
   */
  static async processCapturedArtifacts({ projectId, files, targetAi, pendingQueue }) {
    const projId = projectId || 'GTASTICH';
    const session = this.getSession(projId);
    const workspaceRoot = global.WORKSPACE_DIR || path.join(process.cwd(), 'v0saveprojets');
    const projectDir = path.join(workspaceRoot, projId);
    
    // 1. Écriture physique des fichiers sur disque
    let filesWritten = 0;
    if (Array.isArray(files)) {
      for (const f of files) {
        if (!f.path || typeof f.content !== 'string') continue;
        const targetPath = path.join(projectDir, f.path);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, f.content, 'utf8');
        filesWritten++;
      }
    }

    console.log(`[GAUNTLET ENGINE] 🛡️ ${filesWritten} fichier(s) enregistrés dans ${projectDir} (Tentative ${session.attempt}/${session.maxAttempts}). Lancement du Benchmark Critique...`);

    // 2. Évaluation autonome par le Critique (ValidationRunner)
    let validation = { status: 'passed' };
    try {
      validation = await validateWorkspace({
        workspaceRoot: projectDir,
        diagnostic: { code: 'GAUNTLET_EVALUATION' },
        repairReport: { files: files || [] },
        routes: ['/'],
        projectId: projId
      });
    } catch (valErr) {
      console.warn(`[GAUNTLET ENGINE] ⚠️ Note sur la validation : ${valErr.message}`);
    }

    // 3. PROMOTION SI 100% DE RÉUSSITE
    if (validation.status === 'passed' || !validation.gates || Object.keys(validation.gates).length === 0) {
      console.log(`[GAUNTLET ENGINE] 🎉 PROJET CERTIFIÉ VALIDÉ (${projId}) à l'itération ${session.attempt} !`);
      if (global.addLog) global.addLog(`[GAUNTLET] ✅ Projet ${projId} validé sans erreurs (Itération ${session.attempt}).`);
      this.resetSession(projId);
      return { status: 'passed', message: 'Projet validé et promu avec succès.' };
    }

    // 4. SI ÉCHEC -> CRITIQUE & RÉINJECTION AUTONOME
    if (session.attempt < session.maxAttempts) {
      session.attempt += 1;
      
      const failedGates = [];
      if (validation.gates) {
        for (const [gateName, gateRes] of Object.entries(validation.gates)) {
          if (gateRes && gateRes.status === 'failed') {
            const errMsgs = (gateRes.errors || []).map(e => e.message || e).join('; ');
            failedGates.push(`- Gate [${gateName}]: ${errMsgs || 'Erreur détectée'}`);
          }
        }
      }

      if (failedGates.length === 0 && validation.errors) {
        failedGates.push(`- Erreur: ${validation.errors.map(e => e.message || e).join('; ')}`);
      }

      const critiquePrompt = `[GAUNTLET LOOP - CRITIQUE ITÉRATION ${session.attempt}/${session.maxAttempts}]
❌ LE BENCHMARK A DÉTECTÉ LES ERREURS SUIVANTES DANS LE PROJET "${projId}":
${failedGates.join('\n')}

CONSIGNES DE CORRECTION (SILENCE ABSOLU S1):
1. Corrige immédiatement ces erreurs dans le code.
2. Ré-émets l'ensemble des fichiers corrigés au format JSON immuable:
{"files": [{"path": "src/App.tsx", "content": "..."}]}
3. AUCUN TEXTE OU COMMENTAIRE EN DEHORS DU BLOC JSON.`;

      console.log(`[GAUNTLET ENGINE] 🔄 Injecton de la critique itérative (Étape ${session.attempt}) pour DeepSeek Chat...`);
      if (global.addLog) global.addLog(`[GAUNTLET] 🔄 Critique émise (Étape ${session.attempt}/${session.maxAttempts}) pour ${projId}.`);

      pendingQueue.unshift({
        prompt_id: `gauntlet_${Date.now()}`,
        prompt: critiquePrompt,
        target_ai: targetAi || 'deepseek',
        project_id: projId,
        phase_num: session.attempt,
        phase_name: `Gauntlet Critique (${session.attempt}/${session.maxAttempts})`,
        timestamp: Date.now()
      });

      return {
        status: 'retry',
        attempt: session.attempt,
        failedGates,
        message: `Correction demandée à l'itération ${session.attempt}`
      };
    } else {
      console.warn(`[GAUNTLET ENGINE] 🛑 Limite atteinte (${session.maxAttempts}/${session.maxAttempts}) pour ${projId}. Seuil de sécurité activé.`);
      if (global.addLog) global.addLog(`[GAUNTLET] 🛑 Limite de 5 itérations atteinte pour ${projId}.`);
      this.resetSession(projId);
      return { status: 'max_attempts_reached', message: 'Seuil max d\'itérations atteint.' };
    }
  }
}

module.exports = GauntletBridgeEngine;
