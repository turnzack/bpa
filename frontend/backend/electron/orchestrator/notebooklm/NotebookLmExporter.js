"use strict";

const fs = require("node:fs");
const path = require("node:path");

class NotebookLmExporter {
  constructor() {
    this.exportRoot = path.join(process.cwd(), "..", "notebooklm_exports");
  }

  async exportProjectKnowledge(projectId, activeRoot) {
    console.log(`[NotebookLmExporter] Démarrage de l'export pour ${projectId}...`);
    
    const projectExportDir = path.join(this.exportRoot, projectId);
    if (!fs.existsSync(projectExportDir)) {
      fs.mkdirSync(projectExportDir, { recursive: true });
    }

    const { guestPack, manifestPath } = this._loadGuestPack(projectId);
    
    // 01. Project Overview & Manifest
    const c1 = this._generateProjectOverview(projectId, guestPack, manifestPath, projectExportDir);

    // 02. UI Design Tokens & Components
    const c2 = this._generateUIDesignKnowledge(projectId, activeRoot, projectExportDir);

    // 03. Architecture & Logic
    const c3 = this._generateArchitectureKnowledge(projectId, activeRoot, projectExportDir);

    console.log(`[NotebookLmExporter] Export terminé dans ${projectExportDir}`);
    const combinedContent = c1 + "\n\n---\n\n" + c2 + "\n\n---\n\n" + c3;
    return { projectExportDir, combinedContent };
  }

  async pushToNotebookLm(exportDir, notebookId, authCookie) {
    return new Promise((resolve, reject) => {
      const { exec } = require("child_process");
      // Use process.cwd() to resolve the scripts directory
      const pythonScript = path.join(process.cwd(), "scripts", "sync_notebooklm.py");
      const command = `python "${pythonScript}" "${exportDir}" "${notebookId}" "${authCookie}"`;
      
      console.log(`[NotebookLmExporter] Exécution du script Python de synchronisation...`);
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Python script failed: ${error.message}\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`));
          return;
        }
        
        if (stdout.includes('SUCCESS')) {
          console.log(`[NotebookLmExporter] Synchronisation réussie.`);
          resolve({ success: true, log: stdout });
        } else {
          reject(new Error(`Upload failed: ${stdout}`));
        }
      });
    });
  }

  _loadGuestPack(projectId) {
    const rootReponsesDir = path.join(process.cwd(), "..");
    const guestProjectDir = path.join(rootReponsesDir, "v0-guest", `guest_${projectId}`);
    
    let guestPack = {};
    let manifestPath = guestProjectDir;

    if (fs.existsSync(guestProjectDir)) {
      const manifestFile = path.join(guestProjectDir, "manifest.json");
      if (fs.existsSync(manifestFile)) {
        try {
          guestPack = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
        } catch (e) {
          console.warn("[NotebookLmExporter] manifest.json invalide");
        }
      }
    }
    
    return { guestPack, manifestPath };
  }

  _generateProjectOverview(projectId, guestPack, manifestPath, outDir) {
    let content = `# Projet: ${guestPack.title || projectId}\n\n`;
    content += `## Idée Principale\n${guestPack.ideaSummary || "Non défini"}\n\n`;
    content += `## Architecture Prévue\n${guestPack.architectureSummary || "Non définie"}\n\n`;
    
    if (guestPack.tasks) {
      content += `## Fonctionnalités Principales\n`;
      guestPack.tasks.forEach(task => {
        content += `- **${task.title}** (${task.priority}): ${task.description}\n`;
      });
    }

    // Try to load additional PRD contracts if they exist
    const prdFiles = ["README.md", "domain/entities.json", "domain/state-machines.json"];
    prdFiles.forEach(file => {
      const fullPath = path.join(manifestPath, file);
      if (fs.existsSync(fullPath)) {
        content += `\n\n## Contexte ${file}\n\`\`\`json\n${fs.readFileSync(fullPath, "utf8")}\n\`\`\`\n`;
      }
    });

    fs.writeFileSync(path.join(outDir, "01-Project_Overview.md"), content, "utf8");
    return content;
  }

  _generateUIDesignKnowledge(projectId, activeRoot, outDir) {
    let content = `# Design System & UI Components - ${projectId}\n\n`;

    // Extract Tailwind Config
    const twPath = path.join(activeRoot, "tailwind.config.js");
    const twPathTS = path.join(activeRoot, "tailwind.config.ts");
    if (fs.existsSync(twPath)) {
      content += `## Tailwind Configuration\n\`\`\`javascript\n${fs.readFileSync(twPath, "utf8")}\n\`\`\`\n\n`;
    } else if (fs.existsSync(twPathTS)) {
      content += `## Tailwind Configuration\n\`\`\`typescript\n${fs.readFileSync(twPathTS, "utf8")}\n\`\`\`\n\n`;
    }

    // Extract design.css or index.css variables
    const cssFiles = [path.join(activeRoot, "src", "design.css"), path.join(activeRoot, "src", "index.css")];
    cssFiles.forEach(cssPath => {
      if (fs.existsSync(cssPath)) {
        const cssContent = fs.readFileSync(cssPath, "utf8");
        // Only keep :root definitions to avoid massive files
        const rootMatch = cssContent.match(/:root\s*{[^}]+}/g);
        if (rootMatch) {
          content += `## CSS Variables (${path.basename(cssPath)})\n\`\`\`css\n${rootMatch.join("\n")}\n\`\`\`\n\n`;
        }
      }
    });

    // List components
    content += `## Composants React\n`;
    const componentsDir = path.join(activeRoot, "src", "components");
    if (fs.existsSync(componentsDir)) {
      const listComponents = (dir, prefix = "") => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          if (fs.statSync(itemPath).isDirectory()) {
            listComponents(itemPath, prefix + item + "/");
          } else if (itemPath.endsWith(".tsx") || itemPath.endsWith(".jsx")) {
            const fileContent = fs.readFileSync(itemPath, "utf8");
            content += `### ${prefix}${item}\n\`\`\`tsx\n${fileContent}\n\`\`\`\n\n`;
          }
        });
      };
      listComponents(componentsDir);
    } else {
      content += `Aucun dossier src/components trouvé.\n`;
    }
    
    // Pages
    content += `\n## Pages React\n`;
    const pagesDir = path.join(activeRoot, "src", "pages");
    if (fs.existsSync(pagesDir)) {
      const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith(".tsx") || f.endsWith(".jsx"));
      pages.forEach(p => {
        const pContent = fs.readFileSync(path.join(pagesDir, p), "utf8");
        content += `### ${p}\n\`\`\`tsx\n${pContent}\n\`\`\`\n\n`;
      });
    }

    fs.writeFileSync(path.join(outDir, "02-UI_Design_Tokens.md"), content, "utf8");
    return content;
  }

  _generateArchitectureKnowledge(projectId, activeRoot, outDir) {
    let content = `# Logique et Architecture - ${projectId}\n\n`;

    // Types
    content += `## Modèles de données (Types)\n`;
    const typesDir = path.join(activeRoot, "src", "types");
    if (fs.existsSync(typesDir)) {
      fs.readdirSync(typesDir).filter(f => f.endsWith(".ts")).forEach(f => {
        content += `### ${f}\n\`\`\`typescript\n${fs.readFileSync(path.join(typesDir, f), "utf8")}\n\`\`\`\n\n`;
      });
    }

    // Stores (Zustand)
    content += `## Stores d'état globaux\n`;
    const storeDir = path.join(activeRoot, "src", "store");
    if (fs.existsSync(storeDir)) {
      fs.readdirSync(storeDir).filter(f => f.endsWith(".ts")).forEach(f => {
        const storeContent = fs.readFileSync(path.join(storeDir, f), "utf8");
        content += `### ${f}\n\`\`\`typescript\n${storeContent}\n\`\`\`\n\n`;
      });
    }

    // Services / API
    const scanServices = (folderName, title) => {
      content += `## ${title}\n`;
      const dir = path.join(activeRoot, "src", folderName);
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).filter(f => f.endsWith(".ts")).forEach(f => {
          const fileContent = fs.readFileSync(path.join(dir, f), "utf8");
          content += `### ${f}\n\`\`\`typescript\n${fileContent}\n\`\`\`\n\n`;
        });
      }
    };

    scanServices("services", "Services Métiers");
    scanServices("api", "Appels API (Phase 5)");

    fs.writeFileSync(path.join(outDir, "03-Architecture_State.md"), content, "utf8");
    return content;
  }
}

module.exports = new NotebookLmExporter();
