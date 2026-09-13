const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WORKSPACE_DIR = 'e:\\v0reponses\\v0-moteur-electron\\v0saveprojets';
const PRD_PACKS_DIR = path.join(__dirname, '../../prd_packs');

/**
 * Lance l'initialisation souveraine d'un projet de jeu
 */
async function initializeGameProject(projectName, packName, addLog) {
  addLog(`[ORCHESTRATEUR] 🎮 Démarrage du pipeline Game Engine pour "${projectName}"...`);
  
  const projectDir = path.join(WORKSPACE_DIR, projectName);
  const packDir = path.join(PRD_PACKS_DIR, packName);
  
  // 1. Vérifier si le pack existe
  if (!fs.existsSync(packDir)) {
    throw new Error(`Le pack PRD "${packName}" n'existe pas dans prd_packs/.`);
  }

  // 2. Créer le dossier du projet s'il n'existe pas
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
    addLog(`[ORCHESTRATEUR] 📁 Dossier projet créé : ${projectDir}`);
  }

  // 3. Initialiser le projet Vite (React + TS) de manière synchrone ou asynchrone
  addLog(`[ORCHESTRATEUR] ⚡ Initialisation de Vite (React + TS)...`);
  await runCommand('npx', ['-y', 'create-vite@latest', './', '--template', 'react-ts'], projectDir, addLog);
  
  // 4. Installer les dépendances additionnelles requises pour les jeux
  addLog(`[ORCHESTRATEUR] 📦 Installation des dépendances (Tailwind, Three.js, etc.)...`);
  await runCommand('npm', ['install'], projectDir, addLog);
  // (Note: on pourrait installer tailwind, lucide-react, three, @react-three/fiber ici selon project_spec.yaml)

  // 5. Créer le dossier .sovereign/ et copier les contrats
  const sovereignDir = path.join(projectDir, '.sovereign');
  if (!fs.existsSync(sovereignDir)) {
    fs.mkdirSync(sovereignDir, { recursive: true });
  }

  addLog(`[ORCHESTRATEUR] 🧠 Initialisation de la mémoire d'état dans .sovereign/...`);
  
  // Copier tous les fichiers de config du pack vers .sovereign/
  const packFiles = fs.readdirSync(packDir);
  for (const file of packFiles) {
    if (file.endsWith('.json') || file.endsWith('.yaml') || file.endsWith('.md')) {
      // Sauf README.md et manifest.json qu'on peut garder à la racine ou ignorer
      if (file !== 'inject_' + packName + '.js') {
        const srcPath = path.join(packDir, file);
        const destPath = path.join(sovereignDir, file);
        fs.copyFileSync(srcPath, destPath);
        addLog(`  -> Copié : ${file}`);
      }
    }
  }

  // Créer l'état initial
  const initialState = `# 📊 ÉTAT DE PROGRESSION DU PROJET : ${projectName}

- **Action Courante :** \`ACTION 2.A\` (Core Engine & Viewport)
- **Statut :** \`READY\`
- **Actions Validées :** [\`1.A\`, \`1.B\`, \`1.C\`] (Générées via Pack PRD)
- **Dernier Test Exécuté :** Aucun
- **Erreurs Connues :** Aucune
`;
  fs.writeFileSync(path.join(sovereignDir, 'PROJECT_STATE.md'), initialState, 'utf-8');
  
  const decisions = `# 🏛️ REGISTRE DES DÉCISIONS (ADR)
- **[001]** Architecture initiale générée par Hermes via le pack PRD.
`;
  fs.writeFileSync(path.join(sovereignDir, 'DECISIONS.md'), decisions, 'utf-8');

  addLog(`[ORCHESTRATEUR] ✅ Projet "${projectName}" initialisé avec succès ! Prêt pour la boucle d'actions.`);
  
  return {
    success: true,
    projectDir,
    sovereignDir
  };
}

/**
 * Exécute une commande shell et renvoie une Promise
 */
function runCommand(cmd, args, cwd, addLog) {
  return new Promise((resolve, reject) => {
    // Utiliser shell: true sur Windows pour npx et npm
    const isWindows = process.platform === 'win32';
    const proc = spawn(cmd, args, { cwd, shell: isWindows });

    proc.stdout.on('data', (data) => {
      // Optionnel : logger la sortie (peut être verbeux)
      // addLog(`[CMD] ${data.toString().trim()}`);
    });

    proc.stderr.on('data', (data) => {
      // Les npm warnings passent souvent par stderr
      // addLog(`[CMD ERR] ${data.toString().trim()}`);
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Commande "${cmd} ${args.join(' ')}" a échoué avec le code ${code}`));
      }
    });
  });
}

module.exports = {
  initializeGameProject
};
