'use strict';

/**
 * ProjectContractAnalyzer.js
 * Le correctif prioritaire pour la création stricte de projets.
 * Combine toutes les analyses : AST/imports, exports, props, types, dépendances, tsc, build, runtime, routes, Error Boundary.
 */

const GateRunner = require('../gates/GateRunner');
const { buildManifest } = require('./ManifestBuilder');
const path = require('path');

class ProjectContractAnalyzer {
  
  /**
   * Analyse globale du contrat du projet. 
   * Ne dépend plus de "BINGO", mais génère un manifeste selon la stack détectée.
   */
  static async analyze(projectId, context = {}) {
    console.log(`[PROJECT-CONTRACT-ANALYZER] Démarrage de l'analyse universelle pour ${projectId}...`);
    
    // Si projectRoot n'est pas passé dans le context (test local), on assume le workspace v0saveprojets
    const projectRoot = context.projectRoot || path.join(__dirname, '..', '..', '..', '..', 'v0saveprojets', projectId);
    
    // Génération du manifeste universel en détectant la stack dynamiquement
    const manifest = buildManifest(projectId, projectRoot);
    const fs = require('fs');
    const projectJsonPath = path.join(projectRoot, '.kirov', 'project.json');
    if (fs.existsSync(projectJsonPath)) {
      try {
        const localManifest = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'));
        if (localManifest.requiredGates) {
          manifest.requiredGates = localManifest.requiredGates;
        }
      } catch (e) {}
    }

    const report = {
      projectId,
      projectName: manifest.projectName,
      stack: manifest.stack,
      errors: [],
      addError: (gateId, errs) => {
        report.errors.push(...errs.map(e => ({ gate: gateId, ...e })));
      }
    };

    if (context.activeRoot && context.baseSnapshot) {
      const { createFileSnapshot, compareSnapshots } = require('./FixtureManager');
      const currentSnapshot = await createFileSnapshot(context.activeRoot);
      const changes = compareSnapshots(context.baseSnapshot, currentSnapshot);
      if (changes.length > 0) {
        report.addError("system", [{ code: "ACTIVE_MUTATION", message: "Le dossier source actif a été modifié directement" }]);
        return {
          status: "blocked",
          projectId: manifest.projectId,
          projectName: manifest.projectName,
          stack: manifest.stack,
          requiredGates: manifest.requiredGates || [],
          executedGates: [],
          gates: {},
          errors: report.errors,
          promotion: "blocked"
        };
      }
    }

    let gateResults;
    try {
      // On passe le manifeste au GateRunner qui résoudra les requiredGates
      gateResults = await GateRunner.run(projectId, report, context, manifest);
      
      // Mapping des résultats au format de rapport détaillé
      const formattedGates = {};
      for (const gate of gateResults.required) {
        formattedGates[gate.id] = {
          status: gate.status,
          verified: gate.verified === true,
          mode: gate.mode || "real",
          errors: gate.errors || [],
          durationMs: gate.durationMs || 0
        };
        if (gate.port) formattedGates[gate.id].port = gate.port;
      }

      const finalReport = {
        status: gateResults.status === 'passed' ? 'passed' : 'blocked',
        projectId: manifest.projectId,
        projectName: manifest.projectName,
        stack: manifest.stack,
        requiredGates: manifest.requiredGates || [],
        executedGates: gateResults.required.map(g => g.id),
        gates: formattedGates,
        errors: report.errors,
        promotion: gateResults.status === 'passed' ? 'ready' : 'blocked'
      };

      console.log(`[PROJECT-CONTRACT-ANALYZER] Analyse terminée pour ${manifest.projectId}. Statut: ${finalReport.status}`);
      
      return finalReport;
    } finally {
      // Nettoyage impératif du Runtime (Sprint U6.5)
      if (context.runtime && context.runtime.child) {
        console.log(`[PROJECT-CONTRACT-ANALYZER] Arrêt du processus runtime (PID: ${context.runtime.child.pid})...`);
        const { terminateProcessTree } = require('../process/ProcessTree');
        await terminateProcessTree(context.runtime.child);
        context.runtime = null;
      }
    }
  }
}

module.exports = ProjectContractAnalyzer;
