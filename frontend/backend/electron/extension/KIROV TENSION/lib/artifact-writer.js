/* Artifact Writer — writes validated files to disk via chrome.downloads
   or File System Access API (folder handle from popup). */

class ArtifactWriter {
  /**
   * Write all pack artifacts + code files.
   * @param {object} options
   * @param {string} [options.folderName] - subfolder name under Downloads
   * @param {boolean} [options.saveAs] - prompt user for location
   */
  static async writeAll(options = {}) {
    const pack = await PackRegistry.getPack();
    if (!pack) {
      return { success: false, message: "Aucun pack actif à écrire." };
    }

    const results = [];
    const safeName =
      options.folderName ||
      pack.state.folderName ||
      pack.projectName.replace(/[^a-zA-Z0-9_-]/g, "_") ||
      "kirov_project";

    // 1. Spec documents (artifacts preferred, else pack documents)
    for (const filename of PACK_FILES) {
      const content =
        pack.state.artifacts[filename] || pack.documents[filename] || "";
      if (!content) continue;
      const ok = await this.downloadText(content, `${safeName}/${filename}`, options.saveAs);
      results.push({ filename, success: ok, type: "spec" });
    }

    // 2. state.json
    const stateJson = JSON.stringify(
      {
        ...pack.state,
        projectName: pack.projectName,
        projectDescription: pack.projectDescription,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const stateOk = await this.downloadText(stateJson, `${safeName}/state.json`, false);
    results.push({ filename: "state.json", success: stateOk, type: "meta" });

    // 3. Code files from codegen
    const codeFiles = pack.state.codeFiles || [];
    for (const file of codeFiles) {
      if (!file.path || file.content == null) continue;
      const path = `${safeName}/${file.path.replace(/^\//, "")}`;
      const ok = await this.downloadText(String(file.content), path, false);
      results.push({ filename: file.path, success: ok, type: "code" });
    }

    // 4. README
    const readme = this.buildReadme(pack, codeFiles);
    const readmeOk = await this.downloadText(readme, `${safeName}/README.md`, false);
    results.push({ filename: "README.md", success: readmeOk, type: "meta" });

    pack.state.status = "complete";
    pack.state.updatedAt = new Date().toISOString();
    pack.state.exportFolder = safeName;
    await PackRegistry.savePack(pack);

    const successCount = results.filter((r) => r.success).length;
    return {
      success: successCount > 0,
      message: `${successCount}/${results.length} fichiers écrits dans Downloads/${safeName}/`,
      results,
      folderName: safeName,
    };
  }

  /** Write an array of {path, content} files into folderName */
  static async writeFiles(files, folderName, saveAs = false) {
    const results = [];
    const safe = (folderName || "kirov_project").replace(/[^a-zA-Z0-9_-]/g, "_");
    for (const file of files) {
      if (!file.path) continue;
      const path = `${safe}/${String(file.path).replace(/^\//, "")}`;
      const ok = await this.downloadText(String(file.content ?? ""), path, saveAs && results.length === 0);
      results.push({ filename: file.path, success: ok });
    }
    return { success: results.some((r) => r.success), results, folderName: safe };
  }

  static buildReadme(pack, codeFiles) {
    return [
      `# ${pack.projectName}`,
      "",
      pack.projectDescription || "",
      "",
      `Généré par KIROV3 Orchestrator v16 — ${new Date().toISOString()}`,
      "",
      "## Spécifications",
      "",
      ...PACK_FILES.map((f) => `- \`${f}\`${pack.state.artifacts[f] ? " ✅" : ""}`),
      "",
      "## Code source",
      "",
      codeFiles.length
        ? codeFiles.map((f) => `- \`${f.path}\``).join("\n")
        : "_Aucun fichier code généré._",
      "",
      "## Pipeline",
      "",
      `- Étapes complétées: ${(pack.state.completedSteps || []).join(", ")}`,
      `- Status: ${pack.state.status}`,
      "",
    ].join("\n");
  }

  static async downloadText(content, filename, saveAs = false) {
    try {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const dataUrl = await this.blobToDataUrl(blob);
      const downloadId = await this.downloadFile(dataUrl, filename, saveAs);
      return !!downloadId;
    } catch (e) {
      console.error("[ArtifactWriter] download error:", filename, e);
      return false;
    }
  }

  static blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static downloadFile(dataUrl, filename, saveAs = false) {
    return new Promise((resolve) => {
      try {
        chrome.downloads.download(
          {
            url: dataUrl,
            filename,
            saveAs: !!saveAs,
            conflictAction: "overwrite",
          },
          (downloadId) => {
            if (chrome.runtime.lastError) {
              console.warn("[ArtifactWriter]", chrome.runtime.lastError.message);
              resolve(null);
            } else {
              resolve(downloadId);
            }
          }
        );
      } catch (e) {
        resolve(null);
      }
    });
  }

  /* Parse code files from various LLM output formats */
  static parseCodeFiles(content) {
    if (!content) return [];
    let cleaned = String(content).trim();

    // Strip markdown fences
    const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) cleaned = fence[1].trim();

    // Direct JSON
    try {
      const p = JSON.parse(cleaned);
      if (p.files && Array.isArray(p.files)) return p.files;
      if (Array.isArray(p)) return p;
    } catch (_) {}

    // Extract JSON object
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        const p = JSON.parse(cleaned.slice(first, last + 1));
        if (p.files && Array.isArray(p.files)) return p.files;
      } catch (_) {}
    }

    // Regex fallback for individual file objects
    const files = [];
    const re =
      /\{\s*"path"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"language"\s*:\s*"((?:[^"\\]|\\.)*)")?\s*\}/g;
    let m;
    while ((m = re.exec(cleaned)) !== null) {
      try {
        files.push({
          path: JSON.parse(`"${m[1]}"`),
          content: JSON.parse(`"${m[2]}"`),
          language: m[3] ? JSON.parse(`"${m[3]}"`) : undefined,
        });
      } catch (_) {
        files.push({ path: m[1], content: m[2], language: m[3] || undefined });
      }
    }

    // Fichier: path blocks (French KIROV format)
    if (!files.length) {
      const blockRe = /(?:Fichier|File)\s*:\s*[`"]?([^\n`"]+)[`"]?\s*\n```[\w]*\n([\s\S]*?)```/gi;
      let bm;
      while ((bm = blockRe.exec(cleaned)) !== null) {
        files.push({ path: bm[1].trim(), content: bm[2] });
      }
    }

    return files;
  }
}
