const fs = require('fs');
const path = require('path');
class SutureEngine {
  constructor() {
    this.repairAttempts = {};
    this.lastErrors = {};
    this.MAX_ATTEMPTS = 3;
    this.isRepairing = false;
  }

  getLastError(filePath) {
    return this.lastErrors[filePath] || null;
  }

  recordError({ projectId, source, file, message, stack, observedAt }) {
    const diagnostic = {
      projectId,
      source,
      file: file || null,
      message,
      stack: stack || null,
      observedAt
    };
    
    // On utilise la clé projectId si pas de fichier, ou le fichier si présent
    this.lastErrors[file || projectId] = diagnostic;
    return diagnostic;
  }


  /**
   * Attache le moteur de Suture à un processus en cours (ex: Vite, Next, ou TSC).
   * @param {ChildProcess} childProcess Le processus enfant à surveiller.
   * @param {string} projectDir Le dossier racine du projet concerné.
   */
  attachToProcess(childProcess, projectDir) {
    console.log(`[SUTURE] 🩺 Moteur de Suture attaché au projet (Dossier : ${projectDir})`);

    // Surveillance des erreurs critiques (stderr)
    childProcess.stderr.on('data', async (data) => {
      const output = data.toString('utf-8');
      await this.handleErrorOutput(output, projectDir);
    });

    // Surveillance des erreurs générales (stdout) qui ne déclenchent pas toujours stderr dans certains outils
    childProcess.stdout.on('data', async (data) => {
      const output = data.toString('utf-8');
      if (
        output.toLowerCase().includes('error') ||
        output.includes('TS23') || // Erreurs TypeScript fréquentes
        output.includes('SyntaxError')
      ) {
        await this.handleErrorOutput(output, projectDir);
      }
    });
  }

  /**
   * Enregistre l'erreur, extrait le contexte, mais NE TENTE PLUS de réparer automatiquement.
   * La réparation est déléguée à Suture V2 (SutureRunner).
   */
  async handleErrorOutput(output, projectDir) {
    // Expression régulière pour extraire le fichier qui a planté
    const fileMatch = output.match(/((?:src\/|app\/|components\/)?[^:]+\.(?:tsx|ts|jsx|js|css))(?::(\d+):(\d+))?/i);
    const relativePath = fileMatch ? fileMatch[1] : null;
    
    // Mémoriser la dernière erreur pour ce fichier afin que Suture V2 puisse la récupérer
    this.recordError({
      projectId: path.basename(projectDir),
      source: "vite_compiler",
      file: relativePath,
      message: output,
      stack: null,
      observedAt: new Date().toISOString()
    });

    if (relativePath) {
      console.log(`\n[SUTURE] 🚨 DÉCHIRURE DÉTECTÉE : Erreur dans ${relativePath}`);
    } else {
      console.log(`\n[SUTURE] 🚨 DÉCHIRURE DÉTECTÉE : Erreur générale du compilateur`);
    }
    console.log(`[SUTURE] 🩺 L'erreur a été enregistrée. Attente du déclenchement de Suture V2...`);
  }
}

module.exports = new SutureEngine();
