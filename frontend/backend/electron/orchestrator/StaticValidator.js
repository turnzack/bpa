const fs = require('fs');
const path = require('path');

const PLACEHOLDER_PATTERNS = [
  /^\s*\.\.\.\s*$/m,
  /^\s*\/\/\s*(code|existing|todo|implement)\b/im,
  /\bnot implemented\b/i,
  /\bcoming soon\b/i,
  /\bthrow new Error\(["'`]Not implemented/i
];

const BOOTSTRAP_SIGNATURES = [
  'data-kirov-bootstrap="true"',
  'data-kirov-status="waiting-for-generation"',
  'Sovereign Engine',
  "Prêt à recevoir le code de l'IA",
  "Prêt à recevoir le code de l’IA"
];

const SECRET_PATTERNS = [
  /AIza[0-9A-Za-z-_]{35}/, // Google API Key
  /sk-(?:proj-)?[A-Za-z0-9-_]{40,}/, // OpenAI API Key
  /ghp_[A-Za-z0-9]{36}/ // GitHub Personal Access Token
];

const PROTECTED_FILES = new Set([
  "package.json", "vite.config.ts", "vite.config.js", "tsconfig.json"
]);

const CUSTOM_TOKEN_UTILITIES = new Set([
  "border-border", "border-input", "ring-ring",
  "bg-background", "text-foreground", "bg-card", "text-card-foreground",
  "bg-primary", "text-primary-foreground", "bg-secondary", "text-secondary-foreground",
  "bg-muted", "text-muted-foreground", "bg-accent", "text-accent-foreground",
  "bg-destructive", "text-destructive-foreground"
]);

function detectTailwindConfigs(projectRoot) {
  return [
    "tailwind.config.js", "tailwind.config.cjs", "tailwind.config.ts"
  ].map((file) => path.join(projectRoot, file)).filter((file) => fs.existsSync(file));
}

function extractApplyUtilities(css) {
  const utilities = new Set();
  for (const match of css.matchAll(/@apply\s+([^;]+);/g)) {
    match[1].split(/\s+/).map((value) => value.trim()).filter(Boolean).forEach((utility) => {
        utilities.add(utility);
    });
  }
  return [...utilities];
}

class StaticValidator {
  constructor(workspaceManager) {
    this.workspace = workspaceManager;
  }

  async validateBatch(batch, filesList) {
    const issues = [];
    
    // 1. Détection des chemins dangereux
    filesList.forEach(file => {
      try {
        this.workspace.resolveInside(file.path);
      } catch (err) {
        issues.push({ severity: 'critical', code: 'UNSAFE_PATH', file: file.path, message: err.message });
      }
      
      // 2. Détection de modification de fichiers protégés non autorisée
      if (PROTECTED_FILES.has(file.path) && batch.phase !== 'foundation') {
         issues.push({ severity: 'high', code: 'PROTECTED_FILE_MODIFIED', file: file.path, message: `L'IA a modifié ${file.path} hors de la phase de fondation.` });
      }

      // Bouclier Anti-Next.js (Vérification des chemins)
      const normalizedPath = file.path.replace(/\\/g, '/').replace(/^\/+/, '');
      if (
        normalizedPath === "app" ||
        normalizedPath.startsWith("app/") ||
        /(^|\/)page\.tsx?$/.test(normalizedPath) ||
        /(^|\/)layout\.tsx?$/.test(normalizedPath)
      ) {
        issues.push({
          code: "FORBIDDEN_NEXT_STRUCTURE",
          severity: "critical",
          file: file.path,
          message: "L'IA a généré une architecture Next.js (app/page) dans un projet Vite."
        });
      }
    });

    const configs = detectTailwindConfigs(this.workspace.paths.workspace);
    if (configs.length > 1) {
       issues.push({ severity: 'critical', code: 'MULTIPLE_TAILWIND_CONFIGS', file: configs.join(", "), message: "Plusieurs configurations Tailwind détectées." });
    }

    // 3. Lecture du contenu Staging pour analyse Statique
    for (const file of filesList) {
      const fullPath = path.join(this.workspace.paths.workspace, file.path);
      if (fs.existsSync(fullPath)) {
         const content = fs.readFileSync(fullPath, 'utf8');

         // 4. Placeholders
         if (PLACEHOLDER_PATTERNS.some(p => p.test(content))) {
           issues.push({ severity: 'high', code: 'PLACEHOLDER_DETECTED', file: file.path, message: 'Le fichier contient des instructions incomplètes ou des placeholders (ex: "// TODO").' });
         }

         // 5. Secrets
         if (SECRET_PATTERNS.some(p => p.test(content))) {
           issues.push({ severity: 'critical', code: 'SECRET_DETECTED', file: file.path, message: 'Un secret ou une clé API en dur a été détecté dans le code.' });
         }

         // 6. Validation Tailwind CSS @apply
         if (file.path.endsWith('.css')) {
            const applied = extractApplyUtilities(content);
            for (const utility of applied) {
               if (CUSTOM_TOKEN_UTILITIES.has(utility)) {
                  issues.push({
                     severity: 'critical',
                     code: 'TAILWIND_UNKNOWN_APPLY_UTILITY',
                     file: file.path,
                     message: `La classe ${utility} utilisée dans @apply n'est pas recommandée sans configuration explicite. Utilisez la variable CSS native (ex: border-color: hsl(var(--border))).`
                  });
               }
            }
         }
         // Bouclier Anti-Next.js (Vérification des imports)
         if (/\bnext\/(link|font|router)\b/.test(content) || /\bfrom\s+["']next\//.test(content)) {
            issues.push({ code: "FORBIDDEN_NEXT_IMPORT", severity: "critical", file: file.path, message: "Import Next.js interdit détecté." });
         }
         
         if (/<Link[\s>]/.test(content) && !/import\s+Link\s+from/.test(content) && !/import\s+\{[^}]*Link[^}]*\}\s+from\s+['"]react-router-dom['"]/.test(content)) {
            issues.push({ code: "UNRESOLVED_LINK_COMPONENT", severity: "critical", file: file.path, message: "Composant <Link> utilisé sans import de react-router-dom." });
         }

         // Vérification de remplacement du Boilerplate générique (sur TOUS les fichiers)
         for (const signature of BOOTSTRAP_SIGNATURES) {
            if (content.includes(signature)) {
               issues.push({
                  severity: 'critical',
                  code: 'BOOTSTRAP_UI_STILL_PRESENT',
                  file: file.path,
                  message: `Le marqueur technique boilerplate '${signature}' est encore présent.`
               });
            }
         }
      }
    }

    // 8. Vérification des entrypoints génériques
    const requiredFiles = ["index.html", "src/main.tsx", "src/App.tsx", "src/index.css"];
    for (const required of requiredFiles) {
       const filePath = path.join(this.workspace.paths.workspace, required);
       if (!fs.existsSync(filePath)) {
           issues.push({
              severity: 'critical',
              code: 'VITE_ENTRYPOINT_MISSING',
              file: required,
              message: `L'entrypoint obligatoire ${required} est manquant.`
           });
       }
    }

    // Vérification du contenu du Main entrypoint
    const mainTsxPath = path.join(this.workspace.paths.workspace, "src/main.tsx");
    if (fs.existsSync(mainTsxPath)) {
        const mainContent = fs.readFileSync(mainTsxPath, 'utf8');
        if (!/createRoot\s*\(/.test(mainContent)) {
            issues.push({ code: "REACT_ROOT_NOT_MOUNTED", severity: "critical", file: "src/main.tsx", message: "createRoot n'est pas appelé." });
        }
        if (!/from\s+["']\.\/App["']/.test(mainContent)) {
            issues.push({ code: "APP_NOT_MOUNTED", severity: "critical", file: "src/main.tsx", message: "Le composant App n'est pas monté." });
        }
        if (!/index\.css/.test(mainContent)) {
            issues.push({ code: "GLOBAL_CSS_NOT_IMPORTED", severity: "high", file: "src/main.tsx", message: "index.css n'est pas importé." });
        }
    }

    return {
      isValid: issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0,
      issues
    };
  }
}

module.exports = { StaticValidator };
