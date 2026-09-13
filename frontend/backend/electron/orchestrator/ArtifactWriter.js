"use strict";

const fs = require("node:fs");
const path = require("node:path");

class ArtifactWriter {
  constructor({ projectId, runId, stagingRoot, activeRoot, policy, audit }) {
    this.projectId = projectId;
    this.runId = runId;
    this.stagingRoot = path.resolve(stagingRoot);
    this.activeRoot = path.resolve(activeRoot);
    this.policy = policy;
    this.audit = audit;
  }

  /**
   * Vérifie que staging et active ne sont pas confondus (STAGING_ACTIVE_COLLISION),
   * puis que le chemin cible est bien DANS staging et PAS dans active.
   *
   * @throws STAGING_ACTIVE_COLLISION
   * @throws DIRECT_ACTIVE_WRITE
   * @throws WRITE_OUTSIDE_STAGING
   * @throws UNSAFE_OUTPUT_PATH
   */
  assertWriteInsideStaging(normalized) {
    const target  = path.resolve(this.stagingRoot, normalized);
    const staging = path.resolve(this.stagingRoot);
    const active  = path.resolve(this.activeRoot);

    // 0. Anti-collision : staging ne doit jamais être identique à active
    if (staging === active) {
      throw Object.assign(
        new Error('STAGING_ACTIVE_COLLISION : stagingRoot et activeRoot sont identiques !'),
        { code: 'STAGING_ACTIVE_COLLISION', staging, active }
      );
    }

    // 1. Vérifier que la cible n'est PAS dans active
    const relativeToActive  = path.relative(active, target);
    const insideActive = relativeToActive === '' ||
      (!relativeToActive.startsWith('..') && !path.isAbsolute(relativeToActive));
    if (insideActive) {
      throw Object.assign(
        new Error(`DIRECT_ACTIVE_WRITE interdit : ${normalized}`),
        { code: 'DIRECT_ACTIVE_WRITE', target, active }
      );
    }

    // 2. Vérifier que la cible EST dans staging
    const relativeToStaging = path.relative(staging, target);
    const insideStaging = relativeToStaging === '' ||
      (!relativeToStaging.startsWith('..') && !path.isAbsolute(relativeToStaging));
    if (!insideStaging) {
      throw Object.assign(
        new Error(`WRITE_OUTSIDE_STAGING : ${normalized}`),
        { code: 'WRITE_OUTSIDE_STAGING', target, staging }
      );
    }

    return target;
  }

  resolveSafe(relativePath) {
    const normalized = String(relativePath).replace(/\\/g, '/').replace(/^\/+/, '');

    if (normalized.includes('\0') || normalized.split('/').includes('..') || normalized.startsWith('/')) {
      const error = new Error(`Chemin dangereux : ${relativePath}`);
      error.code = 'UNSAFE_OUTPUT_PATH';
      throw error;
    }

    const outputPath = this.assertWriteInsideStaging(normalized);
    return { normalized, outputPath };
  }


  write(relativePath, content, metadata = {}) {
    let { normalized, outputPath } = this.resolveSafe(relativePath);

    let fileContent = String(content);

    // 🛡️ VITE AUTO-REMAP : Correction des imports Next.js dans le code source
    if (/\.(tsx|ts|jsx|js)$/i.test(normalized)) {
      if (normalized.endsWith('App.tsx') || normalized.endsWith('main.tsx')) {
        fileContent = fileContent.replace(/import\s+['"][^'"]*globals\.css['"]/g, 'import "./index.css"');
      } else {
        fileContent = fileContent.replace(/import\s+['"][^'"]*globals\.css['"]/g, '');
      }
    }

    // 🛡️ VITE AUTO-REMAP : Rediriger les fichiers Next.js vers la structure Vite
    if (normalized.includes('styles/globals.css') || normalized.includes('app/globals.css') || normalized === 'globals.css') {
      const newPath = 'src/index.css';
      const resolved = this.resolveSafe(newPath);
      normalized = resolved.normalized;
      outputPath = resolved.outputPath;
    }

    // ♻️ KIROV5 CSS Policy — tailwind.config.js sans tokens shadcn/ui
    const baseName = path.basename(normalized);
    if ((baseName === 'tailwind.config.js' || baseName === 'tailwind.config.ts') && !fileContent.includes('hsl(var(--background))')) {
      fileContent = `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],\n  darkMode: ["class"],\n  theme: {\n    extend: {\n      colors: {\n        background: "hsl(var(--background))",\n        foreground: "hsl(var(--foreground))",\n        border: "hsl(var(--border))",\n        input: "hsl(var(--input, var(--border)))",\n        ring: "hsl(var(--ring, 222.2 84% 4.9%))",\n        primary: { DEFAULT: "hsl(var(--primary, 222.2 47.4% 11.2%))", foreground: "hsl(var(--primary-foreground, 210 40% 98%))" },\n        secondary: { DEFAULT: "hsl(var(--secondary, 210 40% 96.1%))", foreground: "hsl(var(--secondary-foreground, 222.2 47.4% 11.2%))" },\n        muted: { DEFAULT: "hsl(var(--muted, 210 40% 96.1%))", foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))" },\n        accent: { DEFAULT: "hsl(var(--accent, 210 40% 96.1%))", foreground: "hsl(var(--accent-foreground, 222.2 47.4% 11.2%))" },\n        destructive: { DEFAULT: "hsl(var(--destructive, 0 84.2% 60.2%))", foreground: "hsl(var(--destructive-foreground, 210 40% 98%))" },\n        card: { DEFAULT: "hsl(var(--card, var(--background)))", foreground: "hsl(var(--card-foreground, var(--foreground)))" },\n        popover: { DEFAULT: "hsl(var(--popover, var(--background)))", foreground: "hsl(var(--popover-foreground, var(--foreground)))" },\n      },\n      borderRadius: { lg: "var(--radius, 0.5rem)", md: "calc(var(--radius, 0.5rem) - 2px)", sm: "calc(var(--radius, 0.5rem) - 4px)" },\n    },\n  },\n  plugins: [],\n}\n`;
    }

    // ♻️ KIROV5 CSS Policy — @apply border-border → CSS natif
    if (/\.css$/i.test(normalized) && fileContent.includes('@apply border-border')) {
      fileContent = fileContent.replace(/@apply border-border;/g, 'border-color: hsl(var(--border));');
      if (!fileContent.includes('--border')) {
        fileContent = fileContent.replace(/:root\s*\{/, ':root {\n    --border: 214.3 31.8% 91.4%;');
        fileContent = fileContent.replace(/\.dark\s*\{/, '.dark {\n    --border: 217.2 32.6% 17.5%;');
      }
      if (!fileContent.includes('--background')) {
        fileContent = fileContent.replace(/:root\s*\{/, ':root {\n    --background: 0 0% 100%;\n    --foreground: 222.2 84% 4.9%;');
      }
    }

    if (this.policy && typeof this.policy.assert === "function") {
      this.policy.assert({
        relativePath: normalized,
        operation: metadata.operation || "create",
        projectRoot: this.stagingRoot,
        stagingRoot: this.stagingRoot,
        activeRoot: this.activeRoot
      });
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const temporaryPath = path.join(path.dirname(outputPath), `.${path.basename(outputPath)}.${process.pid}.tmp`);
    fs.writeFileSync(temporaryPath, fileContent, "utf8");
    fs.renameSync(temporaryPath, outputPath);

    this.audit.push({
      projectId: this.projectId,
      runId: this.runId,
      path: normalized,
      targetPath: outputPath,
      operation: metadata.operation || "create",
      source: metadata.source || "unknown",
      guard: "passed",
      at: new Date().toISOString()
    });

    return outputPath;
  }
  writeBatch({ batchId, files, scope, preserve }) {
    if (!Array.isArray(files)) return [];
    const results = [];
    
    // Normalisation pour correspondre aux chemins
    const normalize = (p) => String(p).replace(/\\/g, '/').replace(/^\/+/, '');
    const scopeSet = new Set((scope || []).map(normalize));
    const preserveSet = new Set((preserve || []).map(normalize));

    for (const file of files) {
      if (!file.path || file.content === undefined) continue;
      
      const normalizedPath = normalize(file.path);
      
      if (!file.content || file.content.trim() === '') {
         console.warn(`[ArtifactWriter] Rejeté (vide) : ${normalizedPath}`);
         continue;
      }
      
      if (preserveSet.has(normalizedPath)) {
         console.warn(`[ArtifactWriter] Rejeté (preserve) : ${normalizedPath}`);
         continue;
      }
      
      // Si un scope est défini, on exige que le fichier y soit
      if (scopeSet.size > 0 && !scopeSet.has(normalizedPath)) {
         console.warn(`[ArtifactWriter] Rejeté (hors scope) : ${normalizedPath}`);
         continue;
      }
      
      if (file.content.includes('// ...') || file.content.includes('/* existing code */')) {
          console.warn(`[ArtifactWriter] Rejeté (placeholder détecté) : ${normalizedPath}`);
          continue;
      }
      
      try {
        const outputPath = this.write(file.path, file.content, { batchId, source: "hermes", operation: "update" });
        results.push({ path: normalizedPath, outputPath, status: "written" });
      } catch (e) {
        console.error(`[ArtifactWriter] Echec écriture de ${normalizedPath}:`, e.message);
      }
    }
    
    return results;
  }
}

module.exports = ArtifactWriter;
