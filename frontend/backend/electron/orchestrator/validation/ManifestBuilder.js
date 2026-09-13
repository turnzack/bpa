"use strict";

const { detectProjectStack } = require("./ProjectDetector");

function buildManifest(projectId, projectRoot, options = {}) {
  const stack = detectProjectStack(projectRoot);
  const isSovereign = options.isSovereign || false;

  // Déterminer les gates requises selon la stack
  let requiredGates = [];

  if (stack.framework === "unknown") {
    // Les projets inconnus n'ont pas de validation (ils échoueront la validation STACK)
    requiredGates = ["syntax", "projectContract"]; 
  } else if (stack.runtime === "mobile") {
    // Exemple pour expo
    requiredGates = [
      "pack",
      ...(isSovereign ? ["business_contract"] : []),
      "syntax",            // ← Gate #0 : bloque toute syntaxe invalide
      "projectContract",
      "dependencies",
      "localImports",
      "exports",
      "typecheck",
      "build",
      // Les gates spécifiques mobile viendront plus tard
    ];
  } else {
    // Par défaut, stack web (React/Vite ou Next)
    requiredGates = [
      "pack",
      ...(isSovereign ? ["business_contract"] : []),
      "syntax",            // ← Gate #0 : bloque toute syntaxe invalide
      "projectContract",
      "dependencies",
      "localImports",
      "exports",
      "typecheck",
      "build",
      "runtime",
      "routes",
      "consoleError",
      "visual",
      "regression"
    ];
  }

  // Si Javascript pur, pas de typecheck AST TS
  if (stack.language === "javascript") {
    requiredGates = requiredGates.filter(g => g !== "typecheck" && g !== "exports");
  }

  const manifest = {
    schemaVersion: "1.0",
    projectId: projectId || "unknown",
    projectName: projectId || "unknown",
    stack,
    roots: {
      source: "src",
      entry: stack.framework === "next" ? "src/app/layout.tsx" : "src/main.tsx",
      app: stack.framework === "next" ? "src/app/page.tsx" : "src/App.tsx"
    },
    scripts: {
      dev: stack.bundler === "vite" ? "vite" : "next dev",
      build: stack.bundler === "vite" ? "tsc && vite build" : "next build",
      typecheck: "tsc --noEmit"
    },
    requiredGates,
    routes: [],
    files: {},
    imports: {},
    exports: {},
    components: {},
    types: {},
    dependencies: {},
    policies: {
      designLocked: true,
      activeWritable: false
    }
  };

  return manifest;
}

module.exports = { buildManifest };
