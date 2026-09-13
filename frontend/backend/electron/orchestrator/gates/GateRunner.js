'use strict';

/**
 * GateRunner.js
 * Exécuteur principal des Gates de validation (Phase 3 & Pipeline Strict)
 */

const fs = require('fs');
const path = require('path');

// Importation des différentes gates (qui seront implémentées séparément)
const SyntaxGate = require('./SyntaxGate');        // ← DOIT RESTER EN PREMIER
const LocalImportGate = require('./LocalImportGate');
const ExportContractGate = require('./ExportContractGate');
const TypecheckGate = require('./TypecheckGate');
const DependencyGate = require('./DependencyGate');
const BusinessContractGate = require('./BusinessContractGate');

const RuntimeGate = require('./RuntimeGate');
const RouteGate = require('./RouteGate');
const ConsoleErrorGate = require('./ConsoleErrorGate');
const VisualGate = require('./VisualGate');
const RegressionGate = require('./RegressionGate');

const BuildGate = require('./BuildGate');
const ProjectContractGate = require('./ProjectContractGate');

const GATE_REGISTRY = {
  pack: { run: async () => ({ status: 'passed', verified: true, mode: 'real', errors: [] }) }, // Dummy for sequence
  business_contract: BusinessContractGate,
  syntax: SyntaxGate,              // ← Gate #0 : bloque toute syntaxe invalide
  projectContract: ProjectContractGate,
  dependencies: DependencyGate,
  localImports: LocalImportGate,
  exports: ExportContractGate,
  typecheck: TypecheckGate,
  build: BuildGate,
  runtime: RuntimeGate,
  routes: RouteGate,
  consoleError: ConsoleErrorGate,
  visual: VisualGate,
  regression: RegressionGate,

  // Gates fictives qui devront être implémentées
  props: { run: async () => ({ status: 'unimplemented', mode: 'not_implemented', errors: [{ code: 'GATE_NOT_IMPLEMENTED' }] }) },
  typeModel: { run: async () => ({ status: 'unimplemented', mode: 'not_implemented', errors: [{ code: 'GATE_NOT_IMPLEMENTED' }] }) }
};

function resolveRequiredGates(manifest) {
  if (!manifest || !manifest.requiredGates) {
    // Fallback safe au cas où le manifest est mal formé
    return [{ id: 'fatal_manifest', run: async () => ({ status: 'error', mode: 'real', errors: [{ code: 'MANIFEST_MISSING' }] }) }];
  }

  return manifest.requiredGates.map(id => {
    const gate = GATE_REGISTRY[id];
    if (!gate) {
      return {
        id,
        run: async () => ({ status: "unimplemented", verified: false, mode: "not_implemented", errors: [{ code: 'GATE_NOT_FOUND' }] })
      };
    }
    return { id, run: gate.run };
  });
}

class GateRunner {
  static async run(projectId, report, context = {}, manifest = null, customGates = null) {
    console.log(`[GATE-RUNNER] Démarrage de la validation pour ${projectId}...`);
    
    // Soit on utilise les gates passées explicitement (pour les tests), soit on les résout avec le manifeste
    let gates = customGates;
    if (!gates) {
       if (!manifest) {
           return { status: 'failed', required: [{ id: 'manifest', status: 'error', mode: 'real', errors: [{ code: 'MANIFEST_REQUIRED' }] }] };
       }
       gates = resolveRequiredGates(manifest);
    }

    const results = [];
    let blocked = false;

    for (const gate of gates) {
      if (blocked) {
        results.push({ id: gate.id, status: 'blocked', verified: false, mode: 'not_run', errors: [] });
        continue;
      }

      const skipKey = `skip${gate.id.charAt(0).toUpperCase() + gate.id.slice(1)}`;
      if (context[skipKey]) {
        console.log(`[GATE-RUNNER] Ignoré mais requis par le manifeste : ${gate.name || gate.id}...`);
        results.push({ id: gate.id, status: 'blocked', verified: false, mode: 'not_run', errors: [{ code: 'GATE_SKIPPED_BUT_REQUIRED' }] });
        blocked = true;
        continue;
      }

      console.log(`[GATE-RUNNER] Exécution : ${gate.name || gate.id}...`);
      let result;
      try {
        result = await gate.run(projectId, context, manifest);
      } catch (error) {
        result = {
          status: 'error',
          verified: false,
          mode: 'real',
          errors: [{ code: 'GATE_EXECUTION_ERROR', message: error.message }]
        };
      }

      const formattedResult = {
        id: gate.id,
        status: result.status,
        verified: result.verified || false,
        mode: result.mode || 'real',
        errors: result.errors || [],
        durationMs: result.durationMs || 0
      };
      
      if (result.port) formattedResult.port = result.port;
      if (result.url) formattedResult.url = result.url;
      if (result.pid) formattedResult.pid = result.pid;

      results.push(formattedResult);

      if (
        formattedResult.status !== 'passed' ||
        formattedResult.verified !== true ||
        formattedResult.mode !== 'real'
      ) {
        blocked = true;
        console.error(`[GATE-RUNNER] ❌ Arrêt du pipeline à la gate : ${gate.name || gate.id} (${formattedResult.status})`);
        if (report) report.addError(gate.id, formattedResult.errors);
      }
    }

    const finalStatus = blocked ? 'failed' : 'passed';
    console.log(`[GATE-RUNNER] Validation terminée. Statut global : ${finalStatus}`);
    
    return {
      status: finalStatus,
      required: results
    };
  }
}

module.exports = GateRunner;
