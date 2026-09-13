'use strict';

/**
 * SutureReporter.js
 * ─────────────────────────────────────────────────────────────────
 * Sprint 11 — Génération et persistance du rapport de réparation.
 *
 * Responsabilités :
 *  - Construire le rapport final JSON à partir des tentatives.
 *  - Persister le rapport dans .kirov/improvements/<repairId>/report.json.
 *  - Fournir un résumé lisible pour les logs console.
 *  - Calculer le verdict global (succeeded / failed / rejected).
 * ─────────────────────────────────────────────────────────────────
 */

const fs   = require('fs');
const path = require('path');

const REPORT_SCHEMA_VERSION = '2.0';

// ─── Helpers ────────────────────────────────────────────────────

function safeWrite(filePath, content) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (e) {
    console.error(`[SUTURE-REPORTER] ⚠️ Impossible d'écrire ${filePath} : ${e.message}`);
  }
}

function formatDurationMs(startIso, endIso) {
  try {
    return new Date(endIso).getTime() - new Date(startIso).getTime();
  } catch {
    return null;
  }
}

function gateStatusIcon(status) {
  if (status === 'passed')      return '✅';
  if (status === 'failed')      return '❌';
  if (status === 'blocked')     return '⏸️';
  if (status === 'unimplemented') return '⚠️';
  return '❓';
}

// ─── Classe principale ───────────────────────────────────────────

class SutureReporter {
  /**
   * Construit le rapport final à partir du résultat de SutureRunner.
   *
   * @param {object} params
   * @param {string}   params.repairId
   * @param {string}   params.projectId
   * @param {object}   params.diagnostic  - Diagnostic initial
   * @param {string}   params.startedAt   - ISO timestamp début
   * @param {object[]} params.attempts    - Tableau des tentatives
   * @param {string}   params.finalStatus - 'succeeded'|'failed'|'rejected'
   * @param {object}   [params.promotion] - Résultat de la promotion (si applicable)
   * @param {object}   [params.error]     - Erreur terminale si failed
   * @returns {object} Le rapport complet
   */
  static buildReport({
    repairId,
    projectId,
    diagnostic,
    startedAt,
    attempts = [],
    finalStatus,
    promotion = null,
    error = null
  }) {
    const finishedAt  = new Date().toISOString();
    const durationMs  = formatDurationMs(startedAt, finishedAt);

    // ─ Synthèse par tentative ─
    const attemptSummaries = attempts.map((a, i) => {
      const gates = {};
      if (a.validation && Array.isArray(a.validation.required)) {
        for (const g of a.validation.required) {
          gates[g.id] = { status: g.status, mode: g.mode, errors: g.errors || [] };
        }
      }
      return {
        index:         i + 1,
        attemptId:     a.attemptId || `attempt-${i + 1}`,
        status:        a.validation?.status || 'unknown',
        filesPatched:  a.patchReport?.files?.length || 0,
        gates,
        errorCount:    (a.validation?.required || []).filter(g => g.status === 'failed').length
      };
    });

    // ─ Toutes les erreurs de gates ─
    const allGateErrors = [];
    for (const attempt of attempts) {
      if (!attempt.validation?.required) continue;
      for (const gate of attempt.validation.required) {
        if (gate.status === 'failed' && gate.errors?.length) {
          for (const e of gate.errors) {
            allGateErrors.push({
              attemptId: attempt.attemptId,
              gate:      gate.id,
              ...e
            });
          }
        }
      }
    }

    const report = {
      reportSchemaVersion: REPORT_SCHEMA_VERSION,
      repairId,
      projectId,
      diagnosticId:   diagnostic?.diagnosticId  || null,
      diagnosticCode: diagnostic?.code          || null,
      diagnosticFile: diagnostic?.file          || null,
      startedAt,
      finishedAt,
      durationMs,
      totalAttempts:  attempts.length,
      finalStatus,
      promotion:      promotion || { status: 'not_started' },
      error:          error ? { code: error.code || 'UNKNOWN', message: error.message } : null,
      attempts:       attemptSummaries,
      allGateErrors
    };

    return report;
  }

  /**
   * Persiste le rapport dans .kirov/improvements/<repairId>/report.json.
   *
   * @param {string} projectRoot  - Racine du projet
   * @param {string} repairId
   * @param {object} report       - Rapport construit par buildReport()
   * @returns {string} Chemin absolu du fichier report.json écrit
   */
  static persist(projectRoot, repairId, report) {
    const reportPath = path.join(
      projectRoot,
      '.kirov',
      'improvements',
      repairId,
      'report.json'
    );
    safeWrite(reportPath, JSON.stringify(report, null, 2));
    console.log(`[SUTURE-REPORTER] 📄 Rapport persisté : ${reportPath}`);
    return reportPath;
  }

  /**
   * Affiche un résumé lisible dans la console.
   */
  static printSummary(report) {
    const icon = report.finalStatus === 'succeeded' ? '🎉'
               : report.finalStatus === 'rejected'  ? '🚫'
               : '💥';

    console.log(`\n[SUTURE-REPORTER] ${icon} Réparation ${report.repairId} terminée`);
    console.log(`  Projet       : ${report.projectId}`);
    console.log(`  Statut       : ${report.finalStatus.toUpperCase()}`);
    console.log(`  Durée        : ${report.durationMs != null ? report.durationMs + ' ms' : 'N/A'}`);
    console.log(`  Tentatives   : ${report.totalAttempts}`);
    console.log(`  Diagnostic   : [${report.diagnosticCode}] ${report.diagnosticFile || ''}`);

    if (report.promotion?.status === 'promoted') {
      console.log(`  Promotion    : ✅ ${report.promotion.versionId || ''}`);
    }

    if (report.allGateErrors?.length > 0) {
      console.log(`  Erreurs gate :`);
      for (const e of report.allGateErrors.slice(0, 5)) {
        console.log(`    ${gateStatusIcon('failed')} [${e.gate}] ${e.code || ''} — ${e.file || ''}`);
      }
      if (report.allGateErrors.length > 5) {
        console.log(`    ... et ${report.allGateErrors.length - 5} autre(s)`);
      }
    }

    if (report.error) {
      console.error(`  Erreur fatale: [${report.error.code}] ${report.error.message}`);
    }
    console.log('');
  }

  /**
   * Méthode façade : buildReport + persist + printSummary en une seule étape.
   */
  static finalize({ projectRoot, repairId, projectId, diagnostic, startedAt, attempts, finalStatus, promotion, error }) {
    const report = SutureReporter.buildReport({
      repairId, projectId, diagnostic, startedAt, attempts, finalStatus, promotion, error
    });
    SutureReporter.persist(projectRoot, repairId, report);
    SutureReporter.printSummary(report);
    return report;
  }
}

module.exports = { SutureReporter };
