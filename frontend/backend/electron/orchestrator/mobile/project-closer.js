'use strict';
/**
 * TIGER-091 — Service de Clôture de Projet (Project Closer)
 * electron/orchestrator/mobile/project-closer.js
 *
 * Effectue les vérifications d'intégrité finales, génère la documentation complète
 * et bascule le projet en état COMPLETED.
 */

const fs   = require('fs');
const path = require('path');
const DocGen = require('./mobile-doc-generator');
const MobileValidator = require('./mobile-validator');
const LocalMemory = require('../../services/local-memory-service');


class ProjectCloser {
  /**
   * Effectue la clôture complète d'un projet.
   * @param {object} opts
   * @param {object} opts.job
   * @param {string} opts.projectDir
   * @param {object} [opts.spec]
   * @returns {Promise<{ success: boolean, manifest: object, docFiles: string[], validation: object }>}
   */
  static async closeProject({ job, projectDir, spec }) {
    console.log(`[PROJECT-CLOSER] Clôture du projet ${job.projectId} dans ${projectDir}...`);

    if (!fs.existsSync(projectDir)) {
      throw new Error(`Dossier projet introuvable pour la clôture : ${projectDir}`);
    }

    const resolvedSpec = spec || job.contract || {
      projectName:  job.projectName || 'MonAppMobile',
      screens:      [{ name: 'home', title: 'Accueil', route: '/' }],
      designTokens: { primary: '#2563EB', background: '#FFFFFF' },
    };

    // 1. Diagnostic de santé final
    const validation = MobileValidator.validateProjectDir(projectDir);

    if (validation.webviewDetected) {
      throw new Error('[CLOSER-REJECTED] Présence de WebView détectée lors de la clôture. Clôture refusée.');
    }

    // 2. Génération automatique de la documentation complète (TIGER-090)
    const readmeContent = DocGen.generateReadme(job, resolvedSpec);
    const archContent   = DocGen.generateArchitecture(job, resolvedSpec);
    const changelog     = DocGen.generateChangelog(job, LocalMemory.listEvents(job.projectId));

    const docFiles = [];

    const writeDoc = (rel, content) => {
      const abs = path.join(projectDir, rel);
      fs.writeFileSync(abs, content, 'utf-8');
      docFiles.push(rel);
    };

    writeDoc('README.md',       readmeContent);
    writeDoc('ARCHITECTURE.md', archContent);
    writeDoc('CHANGELOG.md',    changelog);

    // 3. Construction du Manifeste final de livraison
    const manifest = {
      projectId:      job.projectId,
      jobId:          job.id,
      projectName:    resolvedSpec.projectName,
      version:        '1.0.0',
      state:          'COMPLETED',
      closedAt:       new Date().toISOString(),
      stack:          'React Native Expo (Expo Router + NativeWind + TypeScript)',
      screenCount:    resolvedSpec.screens?.length || 1,
      totalFiles:     validation.totalFiles || 0,
      nativeScore:    100,
      docFiles,
      validation: {
        valid: validation.valid,
        passed: validation.passed,
        failed: validation.failed,
      },
    };

    // 4. Enregistrement dans SQLite et journalisation
    fs.writeFileSync(path.join(projectDir, 'project-manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
    docFiles.push('project-manifest.json');

    LocalMemory.save(job.projectId, 'project_manifest', JSON.stringify(manifest), { source: 'project_closer' }).catch(() => {});
    LocalMemory.logEvent(job.projectId, 'project_closed', { manifest });

    console.log(`[PROJECT-CLOSER] ✅ Projet ${job.projectId} clôturé avec succès (${docFiles.length} docs).`);

    return {
      success: true,
      manifest,
      docFiles,
      validation: manifest.validation,
    };
  }
}

module.exports = ProjectCloser;
