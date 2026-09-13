/**
 * zip-batcher.js
 * KIROV5 Gold Industrial Pipeline
 *
 * Responsabilités :
 * - Extraction ZIP contrôlée et résistante au Zip Slip
 * - Inventaire complet du projet
 * - Scan HTML DOM avec Cheerio si disponible
 * - Fallback HTML prudent si Cheerio n'est pas installé
 * - Détection des routes, interactions, scripts et assets
 * - Blueprint JSON versionné
 * - Découpage immuable en batches
 * - Prompts contractuels
 * - Validation des réponses IA
 *
 * Compatibilité :
 * - CommonJS
 * - Node.js 18+
 *
 * Dépendances optionnelles recommandées :
 *   npm install cheerio
 */

"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

let cheerio = null;

try {
  cheerio = require("cheerio");
} catch {
  cheerio = null;
}

const BATCH_SIZE = 1;

const CORE_FILE_PATTERNS = [
  "index",
  "dashboard",
  "layout",
  "app",
  "main",
  "home"
];

const DEFAULT_LIMITS = Object.freeze({
  maxZipBytes: 100 * 1024 * 1024,
  maxExtractedBytes: 500 * 1024 * 1024,
  maxFiles: 5000,
  maxFileBytes: 20 * 1024 * 1024,
  maxHtmlPromptBytes: 80 * 1024,
  maxPathDepth: 32,
  maxBlueprintBytes: 250 * 1024,
  maxWarnings: 500
});

const HTML_EXTENSIONS = new Set([".html", ".htm"]);
const SCRIPT_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const STYLE_EXTENSIONS = new Set([".css", ".scss", ".sass", ".less"]);
const DATA_EXTENSIONS = new Set([".json", ".yaml", ".yml"]);
const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".avif"
]);

class KirovBatcherError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "KirovBatcherError";
    this.code = code;
    this.details = details;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function sha256(value) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

function stableId(prefix, value) {
  return `${prefix}-${sha256(String(value)).slice(0, 16)}`;
}

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function normalizeRelativePath(value) {
  return toPosix(value)
    .replace(/^\.\/+/, "")
    .replace(/\/+/g, "/");
}

function getPriority(filename) {
  const lower = String(filename || "").toLowerCase();

  for (let index = 0; index < CORE_FILE_PATTERNS.length; index += 1) {
    if (lower.includes(CORE_FILE_PATTERNS[index])) {
      return index;
    }
  }

  return 100;
}

function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function isHtmlFile(filename) {
  return HTML_EXTENSIONS.has(getExtension(filename));
}

function isScriptFile(filename) {
  return SCRIPT_EXTENSIONS.has(getExtension(filename));
}

function isStyleFile(filename) {
  return STYLE_EXTENSIONS.has(getExtension(filename));
}

function isDataFile(filename) {
  return DATA_EXTENSIONS.has(getExtension(filename));
}

function isImageFile(filename) {
  return IMAGE_EXTENSIONS.has(getExtension(filename));
}

function safeJsonParse(value) {
  try {
    return {
      ok: true,
      value: JSON.parse(value)
    };
  } catch (error) {
    return {
      ok: false,
      error
    };
  }
}

function compactJson(value, maxBytes = DEFAULT_LIMITS.maxBlueprintBytes) {
  const serialized = JSON.stringify(value);

  if (Buffer.byteLength(serialized, "utf8") <= maxBytes) {
    return serialized;
  }

  const reduced = {
    ...value,
    sourceFiles: undefined,
    scripts: undefined,
    styles: undefined,
    assets: Array.isArray(value.assets)
      ? value.assets.slice(0, 200)
      : [],
    interactions: Array.isArray(value.interactions)
      ? value.interactions.slice(0, 500)
      : [],
    warnings: Array.isArray(value.warnings)
      ? value.warnings.slice(0, 100)
      : []
  };

  const reducedSerialized = JSON.stringify(reduced);

  if (Buffer.byteLength(reducedSerialized, "utf8") <= maxBytes) {
    return reducedSerialized;
  }

  return JSON.stringify({
    version: value.version,
    generatedAt: value.generatedAt,
    framework: value.framework,
    truncated: true,
    routes: value.routes || [],
    interactions: (value.interactions || []).slice(0, 100),
    warnings: (value.warnings || []).slice(0, 50)
  });
}

function findAndReadPrd(projectRoot, projectId) {
  let errors = [];
  try {
    let prdContent = "";

    // -1. PRIORITÉ MAXIMALE : Pack Industriel de Briques Métier (hermes-business-pack.json)
    if (projectId) {
      const businessPackPaths = [
        require('path').join(projectRoot, 'hermes-business-pack.json'),
        require('path').join('E:\\v0reponses\\v0-moteur-electron\\v0saveprojets', projectId, 'hermes-business-pack.json'),
        require('path').join('E:\\v0reponses\\v0saveprojets', projectId, 'hermes-business-pack.json')
      ];
      for (const bpPath of businessPackPaths) {
        if (fs.existsSync(bpPath)) {
          try {
            const bp = JSON.parse(fs.readFileSync(bpPath, 'utf8'));
            prdContent += '\n\n## BRIQUES INDUSTRIELLES CERTIFIÉES (Selection Utilisateur)\n';
            if (bp.modules && bp.modules.length > 0) {
              prdContent += `### Modules Métier à Implémenter OBLIGATOIREMENT\n${bp.modules.map(m => `- ${m}`).join('\n')}\n`;
            }
            if (bp.contracts && bp.contracts.length > 0) {
              prdContent += `### Contrats Techniques\n${bp.contracts.map(c => `- ${c}`).join('\n')}\n`;
            }
            if (bp.megaPromptSuffix) {
              prdContent += bp.megaPromptSuffix;
            }
            console.log(`[PRD] 🏭 Pack Industriel Hermes chargé depuis : ${bpPath} (${bp.modules?.length || 0} modules)`);
            break;
          } catch (e) {
            console.warn('[PRD] hermes-business-pack.json invalide :', e.message);
            errors.push(`hermes-business-pack.json invalide: ${e.message}`);
          }
        }
      }
    }

    // 0. Priorité Absolue : Chercher dans le dossier v0-guest externe
    if (projectId) {
      // Construction du chemin v0-guest
      // Si projectRoot est e:\v0reponses\v0-moteur-electron\v0saveprojets\MONPROJET
      // Kirov5 (electron) est dans e:\v0reponses\v0-moteur-electron
      const engineDir = require('path').dirname(require('path').dirname(projectRoot));
      const rootReponsesDir = require('path').dirname(engineDir); // e:\v0reponses
      const guestProjectDir = require('path').join(rootReponsesDir, 'v0-guest', `guest_${projectId}`);

      if (fs.existsSync(guestProjectDir)) {
        console.log(`[PRD] Pack PRD v0-guest détecté dans: ${guestProjectDir}`);
        
        const manifestPath = require('path').join(guestProjectDir, 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          let manifest = {};
          try {
            manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            prdContent += `\n\n=== SOVEREIGN PACK MANIFEST ===\n${JSON.stringify(manifest, null, 2)}\n`;
          } catch (e) {
            console.warn("[PRD] manifest.json invalide, continuation en fallback...");
            errors.push(`manifest.json invalide: ${e.message}`);
          }
          
          // Fichiers modernes standards recommandés
          const standardFiles = [
            'README.md',
            'domain/entities.json',
            'domain/invariants.json',
            'domain/state-machines.json',
            'contracts/state-contract.json',
            'contracts/api-contract.json',
            'contracts/ui-bindings.json',
            'workflows/workflows.json',
            'tests/acceptance.json',
            'validation/pack-report.json'
          ];
          
          let modernFilesFound = false;
          
          for (const file of standardFiles) {
            const filePath = require('path').join(guestProjectDir, ...file.split('/'));
            if (fs.existsSync(filePath)) {
              modernFilesFound = true;
              const content = fs.readFileSync(filePath, 'utf8');
              prdContent += `\n\n=== CONTRACT ${file} ===\n${content}`;
            }
          }
          
          if (modernFilesFound) {
             return { status: 'valid', content: prdContent.trim() };
          }
        }
        
        // Fallback Legacy (Si pas de manifest ou pas de fichiers modernes)
        const legacyFilesToRead = ['state-contract.json', 'api-contract.json', 'interaction-manifest.json', 'domain-contract.json', 'PRD.md', 'README.md'];
        
        for (const file of legacyFilesToRead) {
          const filePath = require('path').join(guestProjectDir, file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            prdContent += `\n\n--- FICHIER PRD : ${file} ---\n${content}`;
          }
        }
        
        if (prdContent.trim()) {
          return { status: 'valid', content: prdContent.trim() };
        }
      }
    }

    if (!fs.existsSync(projectRoot)) return { status: 'not_found', errors };
    const files = fs.readdirSync(projectRoot);
    
    // 1. Chercher un fichier .md directement (README.md / PRD.md)
    const directPrd = files.find(f => f.toLowerCase() === 'readme.md' || f.toLowerCase() === 'prd.md');
    if (directPrd) {
      return { status: 'valid', content: fs.readFileSync(path.join(projectRoot, directPrd), 'utf8') };
    }

    // 2. Chercher dans les ZIPs — priorité absolue aux ZIPs préfixés 'prd_'
    const allZips = files.filter(f => f.endsWith('.zip'));
    // Trier : prd_* en premier, les autres après
    const zips = [
      ...allZips.filter(f => f.toLowerCase().startsWith('prd_')),
      ...allZips.filter(f => !f.toLowerCase().startsWith('prd_'))
    ];

    for (const zip of zips) {
      const zipPath = path.join(projectRoot, zip);
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kirov5_prd_"));
      
      try {
        if (process.platform === "win32") {
          execFileSync("powershell.exe", [
            "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass",
            "-Command", `& { $ErrorActionPreference = 'Stop'; Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${tmpDir}' -Force }`
          ], { windowsHide: true, stdio: "ignore" });
        } else {
           execFileSync("7z", ["x", zipPath, `-o${tmpDir}`, "-y"], { windowsHide: true, stdio: "ignore" });
        }
        
        let searchDir = tmpDir;
        let extractedFiles = fs.readdirSync(searchDir);
        
        // Tolérance: si le ZIP contient un seul dossier à la racine, chercher à l'intérieur
        if (extractedFiles.length === 1 && fs.statSync(path.join(searchDir, extractedFiles[0])).isDirectory()) {
            searchDir = path.join(searchDir, extractedFiles[0]);
            extractedFiles = fs.readdirSync(searchDir);
        }

        const mdFile = extractedFiles.find(f => f.toLowerCase() === 'readme.md' || f.toLowerCase() === 'prd.md');
        if (mdFile) {
          const content = fs.readFileSync(path.join(searchDir, mdFile), 'utf8');
          console.log(`[ZIP-BATCHER] 💎 Pack PRD trouvé dans '${zip}' — ${content.length} octets injectés.`);
          return { status: 'valid', content };
        }

        // Fallback intelligent pour archives ZIP UI (ex: stitch.zip sans README.md):
        // Composer un PRD structuré en lisant les fichiers de code et tokens découverts.
        const codeFiles = [];
        const scanDir = (dir) => {
          const items = fs.readdirSync(dir);
          for (const item of items) {
            const full = path.join(dir, item);
            const rel = path.relative(searchDir, full);
            if (fs.statSync(full).isDirectory()) {
              if (!item.startsWith('.') && item !== 'node_modules') scanDir(full);
            } else if (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.json') || item.endsWith('.css') || item.endsWith('.html')) {
              codeFiles.push({ path: rel, content: fs.readFileSync(full, 'utf8') });
            }
          }
        };
        scanDir(searchDir);

        if (codeFiles.length > 0) {
          const synthesizedPrd = `# CAHIER DES CHARGES EXTRAIT DU ZIP '${zip}' (${codeFiles.length} fichiers UI)\n\n` +
            codeFiles.map(cf => `#### Fichier: ${cf.path}\n\`\`\`\n${cf.content.substring(0, 3000)}\n\`\`\``).join('\n\n');
          console.log(`[ZIP-BATCHER] 💎 PRD Synthétisé depuis les ${codeFiles.length} fichiers du ZIP '${zip}' (${synthesizedPrd.length} octets).`);
          return { status: 'valid', content: synthesizedPrd };
        }
      } catch (err) {
        // Ignorer les erreurs d'extraction sur un ZIP spécifique (ex: ZIP Stitch sans README)
      } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) {}
      }
    }
  } catch (err) {
    console.error("[ZIP-BATCHER] ⚠️ Erreur lors de l'extraction automatique du PRD :", err.message);
    errors.push(err.message);
    return { status: 'invalid', errors };
  }
  return errors.length > 0 ? { status: 'invalid', errors } : { status: 'not_found' };
}


function normalizeRoutePath(value) {
  if (!value) {
    return null;
  }

  let route = String(value)
    .trim()
    .replace(/\\/g, "/")
    .replace(/^https?:\/\/[^/]+/i, "")
    .split("#")[0]
    .split("?")[0];

  if (!route || route === "/") {
    return "/";
  }

  route = route.replace(/\.(html?|HTML?)$/, "");
  route = route.replace(/\/+/g, "/");

  if (!route.startsWith("/")) {
    route = `/${route}`;
  }

  if (route.endsWith("/index")) {
    route = route.slice(0, -6) || "/";
  }

  return route.toLowerCase();
}

function inferRouteFromFile(relativePath) {
  let normalized = normalizeRelativePath(relativePath);
  
  // Nettoyer les dossiers racines générés par v0/Stitch
  normalized = normalized.replace(/^(stitch_[^/]+|v0-[^/]+|projet_[^/]+)\//i, '');
  
  const parsed = path.posix.parse(normalized);
  const dirname = parsed.dir;
  const basename = parsed.name.toLowerCase();

  if (basename === "index" || basename === "page" || basename === "code") {
    return normalizeRoutePath(dirname || "/");
  }

  return normalizeRoutePath(
    dirname ? `${dirname}/${parsed.name}` : parsed.name
  );
}

/**
 * Refuse les chemins :
 * - absolus ;
 * - avec null byte ;
 * - contenant .. ;
 * - qui sortent de la destination ;
 * - trop profonds.
 */
function assertSafeArchivePath(
  destinationDir,
  archiveEntryName,
  limits = DEFAULT_LIMITS
) {
  const normalizedEntry = normalizeRelativePath(archiveEntryName);

  if (
    !normalizedEntry ||
    normalizedEntry.startsWith("/") ||
    normalizedEntry.includes("\0")
  ) {
    throw new KirovBatcherError(
      "UNSAFE_ARCHIVE_PATH",
      `Entrée ZIP dangereuse refusée : ${archiveEntryName}`,
      { archiveEntryName }
    );
  }

  const segments = normalizedEntry.split("/");

  if (segments.includes("..")) {
    throw new KirovBatcherError(
      "ZIP_SLIP_BLOCKED",
      `Tentative Zip Slip bloquée : ${archiveEntryName}`,
      { archiveEntryName }
    );
  }

  if (segments.length > limits.maxPathDepth) {
    throw new KirovBatcherError(
      "ARCHIVE_PATH_TOO_DEEP",
      `Chemin ZIP trop profond : ${archiveEntryName}`,
      { archiveEntryName }
    );
  }

  const destinationRoot = path.resolve(destinationDir);
  const outputPath = path.resolve(destinationRoot, normalizedEntry);
  const relative = path.relative(destinationRoot, outputPath);

  if (
    relative.startsWith("..") ||
    path.isAbsolute(relative)
  ) {
    throw new KirovBatcherError(
      "ARCHIVE_PATH_ESCAPE",
      `Chemin extrait hors du dossier autorisé : ${archiveEntryName}`,
      { archiveEntryName }
    );
  }

  return outputPath;
}

function validateRegularFile(fullPath) {
  const stat = fs.lstatSync(fullPath);

  if (stat.isSymbolicLink()) {
    throw new KirovBatcherError(
      "SYMLINK_REJECTED",
      `Lien symbolique refusé : ${fullPath}`,
      { fullPath }
    );
  }

  return stat;
}

function ensureInputZip(zipData, projectId, isFilePath, tmpDir, limits) {
  if (isFilePath) {
    if (typeof zipData !== "string") {
      throw new KirovBatcherError(
        "INVALID_ZIP_PATH",
        "Le chemin ZIP doit être une chaîne."
      );
    }

    const resolved = path.resolve(zipData);

    if (!fs.existsSync(resolved)) {
      throw new KirovBatcherError(
        "ZIP_NOT_FOUND",
        `ZIP introuvable : ${resolved}`,
        { resolved }
      );
    }

    const stat = fs.statSync(resolved);

    if (!stat.isFile()) {
      throw new KirovBatcherError(
        "ZIP_NOT_A_FILE",
        `Le chemin ZIP n'est pas un fichier : ${resolved}`,
        { resolved }
      );
    }

    if (stat.size > limits.maxZipBytes) {
      throw new KirovBatcherError(
        "ZIP_TOO_LARGE",
        `ZIP trop volumineux : ${stat.size} octets`,
        { size: stat.size }
      );
    }

    // FIX: PowerShell Expand-Archive échoue souvent silencieusement si le chemin d'origine
    // contient des parenthèses ou des caractères spéciaux comme (1).
    // On copie toujours le fichier dans le dossier temp avec un nom propre et sûr.
    const zipPath = path.join(tmpDir, "upload.zip");
    fs.copyFileSync(resolved, zipPath);
    return zipPath;
  }

  if (typeof zipData !== "string" && !Buffer.isBuffer(zipData)) {
    throw new KirovBatcherError(
      "INVALID_ZIP_DATA",
      "Les données ZIP doivent être un Buffer ou une chaîne base64."
    );
  }

  const buffer = Buffer.isBuffer(zipData)
    ? zipData
    : Buffer.from(zipData, "base64");

  if (!buffer.length) {
    throw new KirovBatcherError(
      "EMPTY_ZIP",
      "Le fichier ZIP est vide."
    );
  }

  if (buffer.length > limits.maxZipBytes) {
    throw new KirovBatcherError(
      "ZIP_TOO_LARGE",
      `ZIP trop volumineux : ${buffer.length} octets`,
      { size: buffer.length }
    );
  }

  const zipPath = path.join(tmpDir, "upload.zip");
  fs.writeFileSync(zipPath, buffer, { flag: "wx" });

  return zipPath;
}

function extractWithPowerShell(zipPath, destinationDir) {
  if (process.platform !== "win32") {
    throw new KirovBatcherError(
      "POWERSHELL_UNAVAILABLE",
      "PowerShell n'est pas disponible sur cette plateforme."
    );
  }

  execFileSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "& { $ErrorActionPreference = 'Stop'; Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force }",
      zipPath,
      destinationDir
    ],
    {
      stdio: "pipe",
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024
    }
  );
}

function extractWithSevenZip(zipPath, destinationDir) {
  execFileSync(
    "7z",
    ["x", zipPath, `-o${destinationDir}`, "-y"],
    {
      stdio: "pipe",
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024
    }
  );
}

function validateExtractedTree(rootDir, limits) {
  const files = [];
  let totalBytes = 0;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, {
      withFileTypes: true
    });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = normalizeRelativePath(
        path.relative(rootDir, fullPath)
      );

      assertSafeArchivePath(rootDir, relativePath);

      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      const stat = validateRegularFile(fullPath);

      if (relativePath === "upload.zip") {
        continue;
      }

      if (stat.size > limits.maxFileBytes) {
        throw new KirovBatcherError(
          "FILE_TOO_LARGE",
          `Fichier trop volumineux : ${relativePath}`,
          { relativePath, size: stat.size }
        );
      }

      totalBytes += stat.size;

      if (totalBytes > limits.maxExtractedBytes) {
        throw new KirovBatcherError(
          "EXTRACTED_DATA_TOO_LARGE",
          "La taille totale extraite dépasse la limite.",
          { totalBytes }
        );
      }

      files.push({
        fullPath,
        relativePath,
        size: stat.size
      });

      if (files.length > limits.maxFiles) {
        throw new KirovBatcherError(
          "TOO_MANY_FILES",
          "Le nombre maximal de fichiers est dépassé.",
          { count: files.length }
        );
      }
    }
  }

  walk(rootDir);

  return {
    files,
    totalBytes
  };
}

function readFileRecord(rootDir, fileInfo) {
  const content = fs.readFileSync(fileInfo.fullPath);
  const relativePath = fileInfo.relativePath;
  const extension = getExtension(relativePath);

  return {
    name: path.posix.basename(relativePath),
    relativePath,
    originalPath: relativePath,
    extension,
    sizeBytes: content.length,
    hash: sha256(content),
    content: content.toString("utf8"),
    isHtml: isHtmlFile(relativePath),
    isScript: isScriptFile(relativePath),
    isStyle: isStyleFile(relativePath),
    isData: isDataFile(relativePath),
    isImage: isImageFile(relativePath)
  };
}

function getElementLabel($, element, index) {
  const node = $(element);

  const label =
    node.attr("aria-label") ||
    node.attr("title") ||
    node.attr("data-label") ||
    node.text().replace(/\s+/g, " ").trim();

  return label || `${element.name || "element"}_${index}`;
}

function buildElementSelector($, element, index) {
  const node = $(element);
  const id = node.attr("id");

  if (id) {
    return `#${id}`;
  }

  const dataRoute = node.attr("data-route");
  if (dataRoute) {
    return `[data-route="${dataRoute}"]`;
  }

  const dataAction = node.attr("data-action");
  if (dataAction) {
    return `[data-action="${dataAction}"]`;
  }

  const className = node.attr("class");
  if (className) {
    const firstClass = className
      .split(/\s+/)
      .filter(Boolean)[0];

    if (firstClass) {
      return `${element.name}.${firstClass}`;
    }
  }

  return `${element.name || "element"}:nth-of-type(${index + 1})`;
}

function inferInteractionKind(tag, routeAttr, actionAttr, node) {
  if (tag === "a" || routeAttr) {
    return "navigation";
  }

  if (tag === "form") {
    return "submit";
  }

  if (
    actionAttr ||
    node.attr("onclick") ||
    node.attr("onchange") ||
    node.attr("onsubmit")
  ) {
    return "mutation";
  }

  if (tag === "input" && node.attr("type") === "checkbox") {
    return "toggle";
  }

  return "button";
}

function inferExpectedBehavior(
  tag,
  route,
  action,
  node
) {
  if (tag === "a" || route) {
    return route ? "navigate" : "requires-analysis";
  }

  if (tag === "form" || node.attr("onsubmit")) {
    return "submit";
  }

  if (
    node.attr("type") === "checkbox" ||
    node.attr("role") === "tab"
  ) {
    return "toggle";
  }

  if (action || node.attr("onclick")) {
    const value = `${action || ""} ${node.attr("onclick") || ""}`
      .toLowerCase();

    if (
      value.includes("export") ||
      value.includes("download")
    ) {
      return "export";
    }

    if (
      value.includes("toggle") ||
      value.includes("select")
    ) {
      return "toggle";
    }

    return "mutate-state";
  }

  return "requires-analysis";
}

function scanHtmlInteractionsWithCheerio(html, sourceFile) {
  const $ = cheerio.load(html, {
    decodeEntities: false
  });

  const interactions = [];
  const selector =
    "a,button,form,input[type='button'],input[type='submit'],input[type='checkbox'],[role='tab'],[role='menuitem'],[data-action],[data-route],[onclick],[onchange],[onsubmit]";

  $(selector).each((index, element) => {
    const node = $(element);
    const tag = String(element.name || "").toLowerCase();

    const href = node.attr("href");
    const action = node.attr("data-action");
    const dataRoute = node.attr("data-route");
    const formAction = node.attr("formaction");
    const route = dataRoute || href || formAction || null;

    interactions.push({
      id: stableId(
        "interaction",
        `${sourceFile}:${buildElementSelector($, element, index)}:${index}`
      ),
      sourceFile,
      selector: buildElementSelector($, element, index),
      label: getElementLabel($, element, index),
      tag,
      kind: inferInteractionKind(tag, route, action, node),
      intendedTarget: normalizeRoutePath(route),
      action,
      inlineHandlers: {
        onclick: node.attr("onclick") || null,
        onchange: node.attr("onchange") || null,
        onsubmit: node.attr("onsubmit") || null
      },
      expectedBehavior: inferExpectedBehavior(
        tag,
        route,
        action,
        node
      ),
      status: "discovered",
      confidence: route || action ? 0.95 : 0.7
    });
  });

  return interactions;
}

function scanHtmlInteractionsFallback(html, sourceFile) {
  const interactions = [];
  const regex =
    /<(a|button|form|input)\b([\s\S]*?)>/gi;

  let match;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const attributes = match[2] || "";

    const readAttribute = (name) => {
      const expression = new RegExp(
        `${name}\\s*=\\s*["']([^"']*)["']`,
        "i"
      );
      const result = attributes.match(expression);
      return result ? result[1] : null;
    };

    const href = readAttribute("href");
    const action = readAttribute("data-action");
    const dataRoute = readAttribute("data-route");
    const route = dataRoute || href;

    interactions.push({
      id: stableId(
        "interaction",
        `${sourceFile}:${tag}:${index}:${attributes}`
      ),
      sourceFile,
      selector: `${tag}:nth-of-type(${index + 1})`,
      label: readAttribute("aria-label") || `${tag}_${index}`,
      tag,
      kind: route ? "navigation" : action ? "mutation" : "button",
      intendedTarget: normalizeRoutePath(route),
      action,
      inlineHandlers: {
        onclick: readAttribute("onclick"),
        onchange: readAttribute("onchange"),
        onsubmit: readAttribute("onsubmit")
      },
      expectedBehavior: route
        ? "navigate"
        : action
          ? "mutate-state"
          : "requires-analysis",
      status: "discovered",
      confidence: 0.45,
      warning: "HTML parser Cheerio indisponible"
    });

    index += 1;
  }

  return interactions;
}

function scanHtmlInteractions(html, sourceFile) {
  if (cheerio) {
    return scanHtmlInteractionsWithCheerio(html, sourceFile);
  }

  return scanHtmlInteractionsFallback(html, sourceFile);
}

function extractHtmlMetadata(html, sourceFile) {
  if (!cheerio) {
    return {
      title: null,
      headings: [],
      links: [],
      forms: [],
      inlineScripts: 0,
      externalResources: [],
      parser: "fallback"
    };
  }

  const $ = cheerio.load(html, {
    decodeEntities: false
  });

  const headings = [];

  $("h1,h2,h3,h4,h5,h6").each((_, element) => {
    headings.push({
      level: element.name,
      text: $(element).text().replace(/\s+/g, " ").trim()
    });
  });

  const links = [];

  $("a[href]").each((_, element) => {
    links.push({
      href: $(element).attr("href"),
      label: $(element).text().replace(/\s+/g, " ").trim()
    });
  });

  const forms = [];

  $("form").each((_, element) => {
    forms.push({
      action: $(element).attr("action") || null,
      method: $(element).attr("method") || "get"
    });
  });

  const externalResources = [];

  $("[src],[href]").each((_, element) => {
    const value =
      $(element).attr("src") ||
      $(element).attr("href");

    if (
      value &&
      /^https?:\/\//i.test(value)
    ) {
      externalResources.push(value);
    }
  });

  return {
    sourceFile,
    title: $("title").text().trim() || null,
    headings,
    links,
    forms,
    inlineScripts: $("script:not([src])").length,
    externalResources: [...new Set(externalResources)],
    parser: "cheerio"
  };
}

function extractAssetsFromHtml(html, sourceFile) {
  if (!cheerio) {
    return [];
  }

  const $ = cheerio.load(html, {
    decodeEntities: false
  });

  const assets = [];

  $("img[src],source[src],video[src],audio[src],link[href]").each(
    (index, element) => {
      const node = $(element);
      const value = node.attr("src") || node.attr("href");

      if (!value) {
        return;
      }

      assets.push({
        id: stableId(
          "asset",
          `${sourceFile}:${value}:${index}`
        ),
        sourceFile,
        path: value,
        kind: element.name === "img" ? "image" : "resource",
        alt: node.attr("alt") || null,
        external: /^https?:\/\//i.test(value)
      });
    }
  );

  return assets;
}

function extractScriptMetadata(files) {
  return files
    .filter((file) => file.isScript || file.isHtml)
    .map((file) => {
      const content = file.content || "";

      return {
        file: file.relativePath,
        hash: file.hash,
        inline: file.isHtml && /<script\b/i.test(content),
        usesDom: /\bdocument\.|\bwindow\.|\bquerySelector\b/i.test(
          content
        ),
        usesWebGL: /\bwebgl\b|\bWebGLRenderingContext\b/i.test(
          content
        ),
        usesAnimationFrame: /\brequestAnimationFrame\b/.test(
          content
        ),
        usesFetch: /\bfetch\s*\(/.test(content),
        inlineHandlers: /\bonclick\s*=|onchange\s*=|onsubmit\s*=/i.test(
          content
        )
      };
    });
}

function extractStyleMetadata(files) {
  return files
    .filter((file) => file.isStyle || file.isHtml)
    .map((file) => {
      const content = file.content || "";

      const colors = [
        ...content.matchAll(
          /#[0-9a-f]{3,8}\b/gi
        )
      ].map((match) => match[0].toUpperCase());

      const dimensions = [
        ...content.matchAll(
          /\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)\b/gi
        )
      ].map((match) => match[0]);

      return {
        file: file.relativePath,
        colors: [...new Set(colors)],
        dimensions: [...new Set(dimensions)].slice(0, 500),
        hasMediaQueries: /@media\b/i.test(content),
        hasTailwindClasses: /\b(?:bg|text|flex|grid|rounded|p|m)-[\w[\].:/%-]+/.test(
          content
        )
      };
    });
}

// --- GRADE GOLD : Detection du framework depuis le projet reel ---
// Analyse les fichiers du ZIP extrait pour determiner vite-react vs next-app-router.
// Les fichiers traites par ce module sont les fichiers extraits du ZIP (isHtml, isStyle, etc.).
function detectFramework(files) {
  const fileNames = files.map(function(f) { return f.relativePath || f.name || ""; });
  const hasViteConfig = fileNames.some(function(name) {
    return /vite\.config\.(ts|js)$/i.test(name);
  });
  const hasNextConfig = fileNames.some(function(name) {
    return /next\.config\.(js|ts|mjs)$/i.test(name);
  });
  if (hasViteConfig) return "vite-react";
  if (hasNextConfig) return "next-app-router";
  // Par defaut, les projets Stitch sont Vite+React
  return "vite-react";
}

function buildRouteDefinitions(files) {
  const routeMap = new Map();

  for (const file of files.filter((item) => item.isHtml)) {
    const route = inferRouteFromFile(file.relativePath);

    if (!routeMap.has(route)) {
      routeMap.set(route, []);
    }

    routeMap.get(route).push(file);
  }

  const routes = [];

  for (const [route, routeFiles] of routeMap.entries()) {
    const primary = routeFiles[0];

    routes.push({
      id: stableId("route", route),
      path: route,
      sourceFile: primary.relativePath,
      aliases: routeFiles.map((file) => file.relativePath),
      kind: "page",
      confidence: routeFiles.length === 1 ? 0.95 : 0.65,
      collision: routeFiles.length > 1
    });
  }

  return routes.sort((a, b) => a.path.localeCompare(b.path));
}

function buildNavigationGraph(routes, interactions) {
  const knownRoutes = new Set(routes.map((route) => route.path));

  return interactions
    .filter((interaction) => interaction.intendedTarget)
    .map((interaction) => ({
      from: interaction.sourceFile,
      to: interaction.intendedTarget,
      interactionId: interaction.id,
      targetExists: knownRoutes.has(interaction.intendedTarget),
      confidence: interaction.confidence
    }));
}

function buildBlueprint(files, projectId = "kirov5-project") {
  const routes = buildRouteDefinitions(files);

  const interactions = files.flatMap((file) =>
    Array.isArray(file.interactions)
      ? file.interactions
      : []
  );

  const assets = files.flatMap((file) =>
    Array.isArray(file.assets)
      ? file.assets
      : []
  );

  const warnings = [];

  for (const route of routes) {
    if (route.collision) {
      warnings.push({
        code: "ROUTE_COLLISION",
        severity: "high",
        message: `Plusieurs fichiers correspondent à ${route.path}.`,
        files: route.aliases
      });
    }
  }

  for (const interaction of interactions) {
    if (
      interaction.expectedBehavior === "navigate" &&
      !interaction.intendedTarget
    ) {
      warnings.push({
        code: "NAVIGATION_WITHOUT_TARGET",
        severity: "high",
        message: `Navigation sans destination : ${interaction.id}`,
        interactionId: interaction.id
      });
    }

    if (
      interaction.intendedTarget &&
      interaction.intendedTarget.startsWith("#")
    ) {
      warnings.push({
        code: "HASH_NAVIGATION",
        severity: "medium",
        message: `Navigation hash détectée : ${interaction.id}`,
        interactionId: interaction.id
      });
    }
  }

  const navigationGraph = buildNavigationGraph(
    routes,
    interactions
  );

  for (const edge of navigationGraph) {
    if (!edge.targetExists) {
      warnings.push({
        code: "UNKNOWN_ROUTE_TARGET",
        severity: "high",
        message: `Route cible inconnue : ${edge.to}`,
        interactionId: edge.interactionId,
        source: edge.from
      });
    }
  }

  const scripts = extractScriptMetadata(files);
  const styles = extractStyleMetadata(files);

  if (scripts.some((script) => script.usesWebGL)) {
    warnings.push({
      code: "WEBGL_REQUIRES_CLIENT_COMPONENT",
      severity: "medium",
      message: "WebGL détecté : isolation dans un Client Component requise."
    });
  }

  if (scripts.some((script) => script.inlineHandlers)) {
    warnings.push({
      code: "INLINE_HANDLERS",
      severity: "high",
      message: "Des handlers inline doivent être migrés vers React."
    });
  }

  // ─── GRADE GOLD : Détection dynamique du framework depuis le projet réel ───
  // Le blueprint doit reflet la technologie effective, pas une valeur codée en dur.
  const detectedFramework = detectFramework(files);

  const blueprint = {
    version: "2.0.0",
    generatedAt: nowIso(),
    projectId,
    framework: detectedFramework,
    parser: cheerio ? "cheerio" : "fallback",
    routes,
    interactions,
    navigationGraph,
    assets,
    scripts,
    styles,
    sourceFiles: files.map((file) => ({
      name: file.name,
      relativePath: file.relativePath,
      extension: file.extension,
      sizeBytes: file.sizeBytes,
      hash: file.hash
    })),
    browserRequirements: [
      ...new Set(
        scripts.flatMap((script) => [
          script.usesDom ? "DOM" : null,
          script.usesWebGL ? "WebGL" : null,
          script.usesAnimationFrame
            ? "requestAnimationFrame"
            : null,
          script.usesFetch ? "fetch" : null
        ]).filter(Boolean)
      )
    ],
    warnings: warnings.slice(0, DEFAULT_LIMITS.maxWarnings)
  };

  blueprint.hash = sha256(
    JSON.stringify({
      routes: blueprint.routes,
      interactions: blueprint.interactions,
      assets: blueprint.assets,
      sourceFiles: blueprint.sourceFiles
    })
  );

  return blueprint;
}

function extractZipToFiles(
  zipData,
  projectId,
  isFilePath = false,
  options = {}
) {
  const limits = {
    ...DEFAULT_LIMITS,
    ...(options.limits || {})
  };

  const safeProjectId = String(projectId || "project")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);

  const tmpDir = fs.mkdtempSync(
    path.join(os.tmpdir(), `kirov5_${safeProjectId}_`)
  );

  let keepTemp = Boolean(options.keepTemp);
  let zipPath;

  try {
    zipPath = ensureInputZip(
      zipData,
      projectId,
      isFilePath,
      tmpDir,
      limits
    );

    try {
      extractWithPowerShell(zipPath, tmpDir);
    } catch (powershellError) {
      try {
        extractWithSevenZip(zipPath, tmpDir);
      } catch (sevenZipError) {
        throw new KirovBatcherError(
          "ZIP_EXTRACTION_FAILED",
          "Impossible d'extraire le ZIP.",
          {
            powershell: powershellError.message,
            sevenZip: sevenZipError.message
          }
        );
      }
    }

    const tree = validateExtractedTree(tmpDir, limits);

    const files = tree.files.map((fileInfo) =>
      readFileRecord(tmpDir, fileInfo)
    );

    const htmlFiles = files
      .filter((file) => file.isHtml)
      .map((file) => ({
        ...file,
        routeCandidate: inferRouteFromFile(file.relativePath),
        interactions: scanHtmlInteractions(
          file.content,
          file.relativePath
        ),
        metadata: extractHtmlMetadata(
          file.content,
          file.relativePath
        ),
        assets: extractAssetsFromHtml(
          file.content,
          file.relativePath
        )
      }));

    return htmlFiles;
  } catch (error) {
    keepTemp = true;
    throw error;
  } finally {
    if (!keepTemp) {
      try {
        fs.rmSync(tmpDir, {
          recursive: true,
          force: true
        });
      } catch (cleanupError) {
        console.warn(
          `[ZIP_BATCHER] Nettoyage temporaire échoué : ${cleanupError.message}`
        );
      }
    }
  }
}

function createBatchFiles(files) {
  return files.map((file) => ({
    name: file.name,
    relativePath: file.relativePath,
    originalPath: file.originalPath,
    content: file.content,
    interactions: file.interactions || [],
    metadata: file.metadata || null,
    assets: file.assets || [],
    hash: file.hash
  }));
}

function sliceIntoBatches(
  files,
  batchSize = BATCH_SIZE,
  options = {}
) {
  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new KirovBatcherError(
      "INVALID_BATCH_SIZE",
      "batchSize doit être un entier supérieur ou égal à 1."
    );
  }

  const projectId = options.projectId || "kirov5-project";

  const sorted = [...files].sort((a, b) => {
    const priorityDifference =
      getPriority(a.relativePath || a.name) -
      getPriority(b.relativePath || b.name);

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return String(
      a.relativePath || a.name
    ).localeCompare(
      String(b.relativePath || b.name)
    );
  });

  const blueprint = buildBlueprint(
    sorted,
    projectId
  );

  const blueprintJson = compactJson(blueprint);
  const batches = [];

  batches.push({
    id: "foundation",
    phase: "foundation",
    sequence: 0,
    files: [],
    blueprint: blueprintJson,
    blueprintHash: blueprint.hash,
    acceptanceCriteria: [
      "Les contrats TypeScript sont cohérents avec le Blueprint.",
      "Le store prépare les entités découvertes.",
      "Aucune page finale n'est encore générée."
    ]
  });

  for (
    let index = 0;
    index < sorted.length;
    index += batchSize
  ) {
    const pageFiles = sorted.slice(
      index,
      index + batchSize
    );

    batches.push({
      id: `pages-${Math.floor(index / batchSize) + 1}`,
      phase: "pages",
      sequence: batches.length,
      files: createBatchFiles(pageFiles),
      blueprint: blueprintJson,
      blueprintHash: blueprint.hash,
      acceptanceCriteria: [
        "Toutes les interactions du fichier sont traitées.",
        "Aucune route hors Blueprint n'est créée.",
        "Les composants client sont utilisés si nécessaire."
      ]
    });
  }

  batches.push({
    id: "integration",
    phase: "integration",
    sequence: batches.length,
    files: [],
    blueprint: blueprintJson,
    blueprintHash: blueprint.hash,
    acceptanceCriteria: [
      "Les composants réutilisables sont extraits.",
      "Les mutations et API nécessaires sont connectées.",
      "Les interactions déclarées sont implémentées."
    ]
  });

  batches.push({
    id: "assembly",
    phase: "assembly",
    sequence: batches.length,
    files: [],
    blueprint: blueprintJson,
    blueprintHash: blueprint.hash,
    acceptanceCriteria: [
      "Les routes internes sont valides.",
      "Les liens morts sont supprimés.",
      "Les fichiers générés sont prêts pour validation."
    ]
  });

  batches.push({
    id: "validation",
    phase: "validation",
    sequence: batches.length,
    files: [],
    blueprint: blueprintJson,
    blueprintHash: blueprint.hash,
    acceptanceCriteria: [
      "Le contrat JSON de chaque réponse est valide.",
      "Les routes et interactions sont couvertes.",
      "Le projet passe typecheck, lint et build."
    ]
  });

  return batches;
}

function getBatchFiles(batchObj) {
  return Array.isArray(batchObj)
    ? batchObj
    : Array.isArray(batchObj.files)
      ? batchObj.files
      : [];
}

function getBatchPhase(batchObj, batchIndex, totalBatches) {
  if (!Array.isArray(batchObj) && batchObj.phase) {
    return batchObj.phase;
  }

  if (batchIndex === 0) {
    return "foundation";
  }

  if (batchIndex === totalBatches - 1) {
    return "assembly";
  }

  if (batchIndex === totalBatches - 2) {
    return "integration";
  }

  return "pages";
}

function buildPromptHeader({
  phase,
  batchNum,
  totalBatches,
  projectId,
  userPrompt,
  blueprint,
  batchObj
}) {
  const common = `
PROJET :
${projectId}

DEMANDE UTILISATEUR :
${userPrompt || "Aucune demande complémentaire."}

BLUEPRINT JSON :
${blueprint}

HASH BLUEPRINT :
${batchObj.blueprintHash || "unknown"}

MODE : HTML STITCH → VITE REACT TYPESCRIPT

Tu ne dois pas redessiner l'interface.
Tu dois reproduire fidèlement le contrat visuel reçu.

OBLIGATIONS :
1. Respecter les sections du screen manifest et les tokens de design.
2. Conserver les assets et les proportions importantes.
3. Générer les composants dans les chemins autorisés.
4. Enregistrer toutes les pages dans pageRegistry.ts.
5. Câbler toutes les interactions du interaction manifest.
6. Implémenter les états déclarés.
7. Ne pas supprimer une section pour simplifier ni remplacer une couleur par un thème générique.
8. ⚠️ CONTRAT D'ARCHITECTURE STRICT : Ton point d'entrée DOIT être src/App.tsx avec un 'export default function App()'.
9. ⚠️ INTERDICTION FORMELLE de modifier ou générer src/main.tsx, index.html, vite.config.ts ou package.json.
10. Si tu as besoin d'un Routeur (BrowserRouter) ou de Providers, instancie-les EXCLUSIVEMENT dans src/App.tsx.
11. Les librairies suivantes sont DÉJÀ installées (utilise-les sans demander) : react-router-dom, lucide-react, framer-motion, clsx, tailwind-merge, zustand.
12. Ne pas utiliser Next.js (pas de app/, page.tsx ou layout.tsx).
13. Ne pas utiliser dangerouslySetInnerHTML ni querySelector pour gérer l'état React.
14. Toute classe utilisée avec @apply doit exister dans la configuration Tailwind.
15. Le boilerplate est UNIQUEMENT une fondation technique. Tu dois REMPLACER l'interface par défaut ("Sovereign Engine").
16. ⚠️ STYLES ET COULEURS : Les variables CSS standards de type shadcn (comme bg-background, text-foreground, border-border, ring-ring, bg-input) SONT DÉJÀ CONFIGURÉES dans le projet. Tu PEUX et DOIS les utiliser pour un rendu natif de haute qualité (évite d'importer tes propres variables CSS).
17. ⚠️ ANTI-HALLUCINATION ICÔNES : N'utilise QUE des icônes valides de lucide-react. N'utilise JAMAIS de noms provenant de Material UI. Convertis toujours : Movie -> Film, Person -> User, AccountCircle -> UserCircle2, ArrowForward -> ArrowRight, LocalFireDepartment -> Flame, ChatBubble -> MessageSquare, Sync -> RefreshCw. ⚠️ CRITIQUE : Tu DOIS absolument importer TOUTES les icônes que tu utilises dans le composant JSX (ex: import { Clock } from 'lucide-react';). Oublier un import d'icône fera crasher l'application.

─── GRADE GOLD — CONTRAT ROUTAGE ET ALIAS ───
18. ⚠️ LOI DU ROUTAGE : App.tsx DOIT utiliser pageRegistry.ts + React.lazy + Suspense + BrowserRouter/Routes.
    - Ne crée JAMAIS un App.tsx avec seulement un <h1> ou un fallback vide.
    - Chaque page doit être enregistrée dans pageRegistry.ts comme import dynamique lazy().
    - ⚠️ IMPORTANT : Il DOIT obligatoirement y avoir une route racine path: '/' dans pageRegistry.ts (pointant vers la page d'accueil ou de dashboard) pour éviter une erreur d'écran blanc au lancement.
    - App.tsx doit mapper pageRegistry en Routes.
    - Suspense DOIT avoir un fallback non vide (ex: <div data-state="loading">Chargement…</div>).
19. ⚠️ LOI DE L'ALIAS : L'import '@/...' est activé par vite.config.ts (resolve.alias @) et tsconfig.json (paths @/*).
    - Utilise toujours '@/' pour les imports depuis src/.
    - Ne crée jamais de chemin relatif profond (../../) quand un alias @ est disponible.
    - Ne modifie ni vite.config.ts ni tsconfig.json. Utilise les alias existants.

─── GRADE GOLD — CONTRAT DE TYPAGE STRICT ───
20. ⚠️ LOI DU TYPAGE : Avant de générer un fichier, inspecte les types existants dans src/types/.
    - Ne crée JAMAIS un statut (ex: 'success', 'progress') sans l'ajouter au type union associé.
    - Ne crée JAMAIS un appel de fonction sans fournir TOUS ses arguments obligatoires.
    - Ne retourne JAMAIS une propriété absente de l'interface.
    - Pour chaque fonction modifiée : lis sa signature, conserve l'ordre des paramètres, type les callbacks.
    - Type union des niveaux de log : 'info' | 'warning' | 'error' | 'success'.
    - Type union des statuts de build : 'idle' | 'loading' | 'progress' | 'success' | 'error' | 'completed' | 'failed' | 'terminated'.
    - Les stores Zustand ne contiennent JAMAIS de JSX.
    - Les services ne contiennent JAMAIS d'appels DOM (document, window, querySelector).

CRITÈRE :
La page React doit être visuellement et structurellement équivalente à l'écran HTML de référence.

RÈGLE VISUAL FIDELITY :
Le convertisseur ne doit pas redessiner l'interface. Il doit compiler le contrat visuel fourni.
Interdit :
- supprimer une section marquée required ;
- fusionner plusieurs composants visuels required ;
- remplacer une couleur définie par une couleur générique ;
- remplacer un asset par un placeholder ;
- supprimer une variante responsive ou un état UI ;
- changer les proportions principales sans décision ;
- déplacer une interaction sans le déclarer.
Toute différence volontaire doit être déclarée dans decisions avec la référence de l'élément.

QUALITÉ :
- Aucun placeholder. Aucun bouton critique sans comportement.
- Aucune action métier remplacée par console.log.
- Aucun import inconnu ou chemin local inexistant. Aucun secret.
- Les états loading, empty, error et success doivent être présents lorsque nécessaires.
- Ne pas mettre en warnings les interactions obligatoires manquées. Les déclarer explicitement dans missing.

PIPELINE :
- Un batch échoué ou non validé ne doit jamais être déclaré terminé.
- Chaque interaction doit apparaître dans implemented, ambiguous ou missing.
- Le projet ne peut être considéré prêt qu'après build et runtime smoke test.

SORTIE :
Retourne uniquement un JSON conforme au schéma fourni :
{
  "policyVersion": "gold-4.0.0",
  "phase": "html-to-vite-conversion",
  "batchId": "pages-001",
  "blueprintHash": "sha256:...",
  "files": [{ "path": "string", "content": "string", "operation": "create|update" }],
  "screens": [],
  "pages": [],
  "routes": [],
  "components": [],
  "interactions": {
    "implemented": [],
    "ambiguous": [],
    "missing": []
  },
  "assets": {
    "copied": [],
    "missing": [],
    "replaced": []
  },
  "tokens": {
    "used": [],
    "missing": [],
    "overridden": []
  },
  "visualDeviations": [],
  "tests": [],
  "decisions": [],
  "warnings": [],
  "status": "complete"
}
Ne retourne aucun commentaire hors JSON. Ne retourne pas de code partiel "...".
`;

  if (phase === "foundation") {
    return `
🏗️ ACTION [${batchNum}/${totalBatches}] — FONDATION${common}

OBJECTIF :
Préparer les contrats, types, store et modèles métier.

SORTIE ATTENDUE :
{
  "files": [
    {
      "path": "types/example.ts",
      "content": "..."
    }
  ],
  "decisions": [],
  "warnings": []
}

INTERDIT :
- Générer les pages finales.
- Modifier package.json.
- Modifier la configuration globale.
`;
  }

  if (phase === "pages") {
    return `
📄 ACTION [${batchNum}/${totalBatches}] — PAGE${common}

OBJECTIF :
Convertir les fichiers HTML fournis en composants React fonctionnels.

CONTRAINTES :
- Ajouter "use client" si des APIs navigateur sont nécessaires (même si c'est Vite, garde-le pour la compatibilité avec certains modules tiers).
- Isoler WebGL, canvas et listeners globaux.
- Migrer les onclick inline vers des handlers React.
- Conserver l'intention visuelle et responsive.
- Implémenter les états loading, empty, success et error si pertinents.
- 🚨 ANTI-CRASH (MÉMOIRE) : NE JAMAIS créer une variable useState individuelle par élément. Limitez-vous à 10 variables d'état maximum.
- 🚨 ANTI-CRASH (POIDS) : NE TRADUISEZ JAMAIS les longs codes SVG, WebGL ou Base64. Remplacez-les TOUJOURS par des placeholders courts (ex: '<div className="svg-placeholder" data-icon="nom-de-licone" />' ou '/* TODO: Insérer SVG complexe ici */'). Si le code HTML d'origine contient des répétitions massives (ex: 50 cartes identiques), n'en codez qu'une seule et utilisez un '.map()' avec un tableau de données (mock data) de 3 éléments maximum.
- 🚨 ANTI-CRASH (CSS POSTCSS) : NE JAMAIS utiliser '@apply border-border', '@apply bg-background' ou '@apply text-foreground' dans les fichiers CSS. Utilisez TOUJOURS le CSS natif avec les variables (ex: 'border-color: hsl(var(--border)); background-color: hsl(var(--background)); color: hsl(var(--foreground));'). PostCSS plantera sinon.

SORTIE ATTENDUE :
{
  "files": [],
  "decisions": [
    {
      "interactionId": "interaction-id",
      "behavior": "navigate|toggle|submit|export|mutate-state",
      "implementation": "description"
    }
  ],
  "warnings": []
}
`;
  }

  if (phase === "integration") {
    return `
🔌 PHASE INTÉGRATION — LOGIQUE MÉTIER GOLD${common}

OBJECTIF :
Connecter l'interface Stitch au domaine métier sans créer d'état divergent.

AVANT DE CODER :
1. Lire le domain-contract.json, state-contract.json, api-contract.json et interaction-manifest.json.
2. Lire le blueprintHash et vérifier les fichiers déjà générés.
3. Ne pas modifier les contrats sans décision explicite.

ARCHITECTURE :
4. Les types vont dans src/types/. Les services vont dans src/services/.
5. Les appels API vont dans src/api/. Les stores vont dans src/store/.
6. Les composants ne contiennent pas de logique serveur. Les stores ne contiennent pas de JSX.
7. Les routes API valident leurs entrées. Les mutations métier passent par des services.
8. Les workflows utilisent des transitions explicites.

ÉTAT :
9. Déclarer l'état initial. Déclarer les actions autorisées.
10. Déclarer loading, success, empty et error. Refuser les transitions invalides.
11. Ne pas dupliquer le même état dans plusieurs stores.
12. Ne pas utiliser querySelector pour synchroniser React ni de console.log.

INTERACTIONS :
13. Chaque interaction du manifeste doit être implémentée (action ou route).
14. Une mutation doit avoir validation et gestion d'erreur (formulaire, export, etc.).

─── GRADE GOLD — TYPAGE CONTRACTUEL STRICT ───
Règle absolue avant toute génération de code :
a. Inspecter src/types/domain.ts et tout fichier de types existant.
b. Déclarer TOUS les statuts utilisés dans les types unions (ex: 'success' DOIT être dans le type level).
c. Les types incontournables à inclure SYSTMATIQUEMENT :
     type BuildLogLevel = 'info' | 'warning' | 'error' | 'success';
     type BuildStatus   = 'idle' | 'loading' | 'progress' | 'success' | 'error' | 'completed' | 'failed' | 'terminated';
d. PatchStatus DOIT être importé depuis son fichier de définition, jamais utilisé directement sans import.
e. Pour chaque fonction générée ou modifiée :
   - Lire sa signature complète avant de l'appeler.
   - Fournir TOUS les arguments obligatoires dans le bon ordre.
   - Typer tous les callbacks (ex: .map((item: MonType) => ...)).
f. Ne pas créer de propriété sur un store si elle n'est pas déclarée dans l'interface du store.

SÉCURITÉ & QUALITÉ :
15. Ne jamais faire confiance aux données du frontend. Vérifier autorisation et idempotency côté serveur.
16. TypeScript strict. Aucun any non justifié. Aucun import manquant ni placeholder.
17. Ajouter des tests pour les transitions, les services et les erreurs API.
18. REMPLACE LE FORMAT DE SORTIE DE BASE PAR CE JSON CONTRACTUEL STRICT :
{
  "policyVersion": "gold-5.0.0",
  "phase": "integration",
  "contractHashes": {
    "domain": "sha256:...",
    "state": "sha256:...",
    "api": "sha256:..."
  },
  "files": [{ "path": "string", "content": "string", "operation": "create|update" }],
  "implementations": {
    "types": [],
    "stores": [],
    "services": [],
    "api": [],
    "workflows": [],
    "tests": []
  },
  "interactionImplementations": [],
  "decisions": [],
  "warnings": [],
  "status": "complete"
}
`;
  }

  if (phase === "assembly") {
    return `
🧩 ACTION [${batchNum}/${totalBatches}] — ASSEMBLAGE${common}

OBJECTIF :
Assembler les layouts, la navigation et les routes. Utiliser des balises <a> classiques ou des boutons avec onClick pour la navigation (routing par état).

CONTRAINTES :
- Vérifier chaque route déclarée.
- Remplacer les href vides ou #.
- Ajouter une navigation cohérente.
- Vérifier les imports et exports.
- Ne pas masquer une erreur par un fallback silencieux.
`;
  }

  if (phase === "wiring") {
    const systemPrompt = `
ROLE:
Senior TypeScript engineer, Phase 4 Business Wiring.

MISSION:
Connecter la logique métier sans modifier le design existant.

ABSOLUTE INVARIANTS:
D1 design, CSS, className, tokens, assets and layout are immutable.
S1 global state uses typed Zustand stores, not global useState.
A1 network logic belongs in services, never in UI components.
T1 strict TypeScript, exhaustive unions, typed callbacks, complete arguments.
R1 preserve existing routes and page registry.
SEC1 never hardcode secrets.
P1 write only to staging.
V1 return only the requested JSON contract.

REJECT:
If a rule cannot be respected, return status "rejected"
and list violations. Never invent a workaround that violates a rule.

OUTPUT:
Return valid JSON only.
`;
  }

  if (phase === "backend_integration") {
    return `
🔌 PHASE 5 — INDUSTRIALISATION BACKEND ADAPTATIVE${common}

OBJECTIF :
Transformer ou faire évoluer ce projet vers un Backend industriel, de manière 100% INCRÉMENTALE.
Tu reçois un "Plan Incrémental" (migration-plan.json). Tu ne dois appliquer QUE les actions décrites dans le delta de ce plan.

RÈGLES INCRÉMENTALES STRICTES :
1. Tu exécutes une évolution incrémentale. Ne régénère JAMAIS les capacités inchangées.
2. Ne réinstalle PAS les providers déjà validés (sauf si explicitement demandé).
3. Ne modifie JAMAIS les fichiers listés dans la section "preserve" du plan incrémental. Si tu tentes de modifier un fichier "preserve", l'orchestrateur bloquera l'opération (PRESERVE_LIST_VIOLATION).
4. Ne supprime rien sans décision explicite dans le plan.
5. Respecte les migrations SQL déjà appliquées. Si des migrations existent (ex: 001, 002), génère LA SUITE de la séquence (ex: 003_xxx.sql). Ne recrée jamais de tables existantes.
6. Traite les fichiers modifiés manuellement comme protégés si leur hash ne correspond plus à l'implementation-manifest (ceci sera géré en amont par l'orchestrateur via le DRIFT_DETECTED).
7. Applique uniquement les steps de ton "migration-plan".

SÉCURITÉ ET SECRETS :
8. Ne JAMAIS écrire de vraies clés API en dur dans le code.
9. Utiliser import.meta.env.VITE_... pour récupérer les clés côté client.
10. Lister dans les "envVariablesRequired" les variables d'environnement que l'utilisateur devra créer.

SORTIE (JSON STRICT) :
{
  "policyVersion": "gold-phase5-incremental-1.0.0",
  "phase": "backend_integration",
  "files": [{ "path": "string", "content": "string", "operation": "create|update|delete" }],
  "envVariablesRequired": [],
  "decisions": [],
  "warnings": [],
  "status": "complete"
}
`;
  }


  return `
🧪 ACTION [${batchNum}/${totalBatches}] — VALIDATION${common}

OBJECTIF :
Analyser les erreurs du projet généré et produire uniquement des corrections ciblées.

CONTRAINTES :
- Ne modifier que les fichiers nécessaires.
- Corriger les routes et interactions non couvertes.
- Corriger les erreurs TypeScript.
- Ne pas réécrire arbitrairement les pages fonctionnelles.
`;
}

function truncateForPrompt(content, maxBytes) {
  const buffer = Buffer.from(String(content || ""), "utf8");

  if (buffer.length <= maxBytes) {
    return buffer.toString("utf8");
  }

  return `${buffer
    .subarray(0, maxBytes)
    .toString("utf8")}\n\n... [CONTENU TRONQUÉ PAR LE PIPELINE]`;
}

function generateBatchPrompt(
  batchObj,
  batchIndex,
  totalBatches,
  projectId,
  userPrompt,
  options = {}
) {
  const files = getBatchFiles(batchObj);
  const phase = getBatchPhase(
    batchObj,
    batchIndex,
    totalBatches
  );

  const blueprint =
    !Array.isArray(batchObj) && batchObj.blueprint
      ? batchObj.blueprint
      : files[0]?.blueprint || "{}";

  const maxPromptBytes =
    options.maxPromptBytes ||
    DEFAULT_LIMITS.maxHtmlPromptBytes;

  const fileList = files.length
    ? files.map((file) => file.relativePath || file.name).join(", ")
    : "Aucun fichier direct";

  const header = buildPromptHeader({
    phase,
    batchNum: batchIndex + 1,
    totalBatches,
    projectId,
    userPrompt,
    blueprint,
    batchObj
  });

  const sourceContent = files
    .filter((file) => !String(file.name).includes("SYSTEM"))
    .map((file) => {
      const source = truncateForPrompt(
        file.content,
        maxPromptBytes
      );

      const interactions = JSON.stringify(
        file.interactions || [],
        null,
        2
      );

      return `
FILE: ${file.relativePath || file.name}
--- INTERACTIONS DÉTECTÉES ---
${interactions}
--- SOURCE ---
${source}
`;
    })
    .join("\n---\n");

  if (phase === "wiring") {
    // Le contexte de méthodologie est résolu et vérifié par GoldPipelineService AVANT cet appel.
    // Si absent (appel direct hors Gold), on signale l'absence sans bloquer pour compatibilité.
    const resolvedMethodology = options.methodologyContextBlock || '';
    const methodologyWarning = resolvedMethodology
      ? ''
      : '\n[AVERTISSEMENT] Aucun contexte de méthodologie vérifié n\'a été injecté par le pipeline Grade Gold.\n';

    const systemPrompt = `${resolvedMethodology}${methodologyWarning}
ROLE:
Senior TypeScript engineer, Phase 4 Business Wiring.

MISSION:
Connecter la logique métier sans modifier le design existant.

ABSOLUTE INVARIANTS:
D1 design, CSS, className, tokens, assets and layout are immutable.
S1 global state uses typed Zustand stores, not global useState.
A1 network logic belongs in services, never in UI components.
T1 strict TypeScript, exhaustive unions, typed callbacks, complete arguments.
R1 preserve existing routes and page registry.
SEC1 never hardcode secrets.
P1 write only to staging.
V1 return only the requested JSON contract.

REJECT:
If a rule cannot be respected, return status "rejected"
and list violations. Never invent a workaround that violates a rule.

OUTPUT:
Return valid JSON only.
`;

    const isPlanStep = options.step !== "code";

    let userPromptText;
    if (isPlanStep) {
      userPromptText = `
TASK:
Execute business-wiring batch ${batchIndex + 1}/${totalBatches}
for project ${projectId}.

${userPrompt ? `USER REQUEST:\n${userPrompt}\n` : ""}

SCOPE:
${files.length ? files.map(f => f.relativePath || f.name).join("\n") : "Aucun fichier direct"}

ACTION_PLAN / BLUEPRINT:
<action_plan>
${blueprint}
</action_plan>

SOURCE_FILES:
<source_files>
${sourceContent}
</source_files>

FINAL CHECK:
- no CSS or className changes;
- no JSX in stores;
- no DOM access in stores/services;
- no setTimeout API mock;
- all async actions use try/catch;
- all statuses exist in TypeScript unions;
- all function arguments are complete;
- every file is inside scope;
- return JSON only.

OUTPUT:
Return ONLY the BusinessWiringPlan JSON contract matching EXACTLY this format. Do NOT generate file contents yet.
{
  "status": "plan_ready",
  "compliance": {
    "designPreserved": true,
    "cssChanges": false,
    "classNameChanges": false
  },
  "files": [
    { "path": "src/pages/Dashboard.tsx", "operation": "create" }
  ],
  "bindings": [],
  "violations": []
}
`;
    } else {
      userPromptText = `
TASK:
Generate file contents for the approved business-wiring plan (batch ${batchIndex + 1}/${totalBatches})
for project ${projectId}.

APPROVED PLAN:
${JSON.stringify(options.validatedPlan || {}, null, 2)}

SOURCE_FILES:
<source_files>
${sourceContent}
</source_files>

FINAL CHECK:
- strictly follow the approved plan;
- return JSON only with the full file contents.

OUTPUT:
Return the BusinessWiringPlan JSON contract with the 'content' field populated for each file.
`;
    }

    return {
      systemPrompt,
      userPrompt: userPromptText,
      jsonMode: true
    };
  }

  if (phase === "ui-update") {
    const resolvedMethodology = options.methodologyContextBlock || '';
    const methodologyWarning = resolvedMethodology
      ? ''
      : '\n[AVERTISSEMENT] Aucun contexte de méthodologie vérifié n\'a été injecté par le pipeline Grade Gold.\n';

    const systemPrompt = `${resolvedMethodology}${methodologyWarning}
ROLE:
Senior Frontend Engineer, Expert in React & Tailwind CSS.

MISSION:
Mettre à jour l'interface utilisateur (HTML/Tailwind) d'un composant React existant en utilisant un nouveau design HTML, SANS CASSER la logique métier existante.

ABSOLUTE INVARIANTS:
L1 Tu dois CONSERVER 100% des hooks existants (useState, useEffect, useCartStore, etc.).
L2 Tu dois CONSERVER 100% des imports existants.
L3 Tu dois CONSERVER 100% des gestionnaires d'événements existants (onClick, onSubmit, etc.) et les rattacher aux nouveaux éléments visuels correspondants.
U1 Seules les classes CSS (Tailwind) et la structure des balises HTML peuvent être modifiées pour s'aligner sur le nouveau design.
R1 Ne supprime jamais une variable d'état ou une fonction métier sous prétexte qu'elle n'est pas dans le nouveau design visuel.
V1 Return ONLY valid JSON.

REJECT:
If a rule cannot be respected, return status "rejected".

OUTPUT:
Return valid JSON only.
`;

    const isPlanStep = options.step !== "code";

    let userPromptText;
    if (isPlanStep) {
      userPromptText = `
TASK:
Analyze the requested UI update and produce a strict plan.

USER REQUEST / NEW DESIGN:
<new_design>
${userPrompt || "Aucun nouveau design fourni."}
</new_design>

EXISTING SOURCE FILES:
<source_files>
${sourceContent}
</source_files>

FINAL CHECK:
- You must keep all business logic intact.
- You must map existing event handlers to the new UI elements.

OUTPUT:
Return ONLY the UIUpdatePlan JSON contract matching EXACTLY this format. Do NOT generate file contents yet.
{
  "status": "plan_ready",
  "compliance": {
    "logicPreserved": true,
    "hooksPreserved": true,
    "importsPreserved": true
  },
  "files": [
    { "path": "src/pages/Dashboard.tsx", "operation": "update", "expectedHash": "dummy_hash_or_real" }
  ],
  "violations": []
}
`;
    } else {
      userPromptText = `
TASK:
Generate the updated React file contents combining the old logic with the new design.

APPROVED PLAN:
${JSON.stringify(options.validatedPlan || {}, null, 2)}

EXISTING SOURCE FILES:
<source_files>
${sourceContent}
</source_files>

NEW DESIGN REFERENCE:
<new_design>
${userPrompt || "Aucun nouveau design fourni."}
</new_design>

FINAL CHECK:
- ALL imports and React hooks from the original file MUST be present in your output.
- ONLY modify the JSX/Tailwind structure.

OUTPUT:
Return the UIUpdatePlan JSON contract with the 'content' field populated for each file.
`;
    }

    return {
      systemPrompt,
      userPrompt: userPromptText,
      jsonMode: true
    };
  }

  // Phase par défaut
  const resolvedMethodology = options.methodologyContextBlock || '';
  const methodologyWarning = resolvedMethodology
    ? ''
    : '\n[AVERTISSEMENT] Aucun contexte de méthodologie vérifié n\'a été injecté par le pipeline Grade Gold.\n';

  return `${resolvedMethodology}${methodologyWarning}
${header}

FICHIERS DU BATCH :
${fileList}

${sourceContent}`;
}

function validateGeneratedAiResponse(response) {
  if (!response || typeof response !== "object") {
    throw new KirovBatcherError(
      "INVALID_AI_RESPONSE",
      "La réponse IA n'est pas un objet."
    );
  }

  if (!Array.isArray(response.files)) {
    throw new KirovBatcherError(
      "INVALID_AI_FILES",
      "La clé files doit être un tableau."
    );
  }

  if (
    response.decisions !== undefined &&
    !Array.isArray(response.decisions)
  ) {
    throw new KirovBatcherError(
      "INVALID_AI_DECISIONS",
      "La clé decisions doit être un tableau."
    );
  }

  if (
    response.warnings !== undefined &&
    !Array.isArray(response.warnings)
  ) {
    throw new KirovBatcherError(
      "INVALID_AI_WARNINGS",
      "La clé warnings doit être un tableau."
    );
  }

  for (const file of response.files) {
    if (!file || typeof file !== "object") {
      throw new KirovBatcherError(
        "INVALID_AI_FILE_ENTRY",
        "Une entrée files est invalide."
      );
    }

    if (
      typeof file.path !== "string" ||
      typeof file.content !== "string"
    ) {
      throw new KirovBatcherError(
        "INVALID_AI_FILE_SHAPE",
        "Chaque fichier doit contenir path et content."
      );
    }

    if (
      path.isAbsolute(file.path) ||
      file.path.split(/[\\/]/).includes("..")
    ) {
      throw new KirovBatcherError(
        "INVALID_AI_OUTPUT_PATH",
        `Chemin de fichier IA dangereux : ${file.path}`,
        { filePath: file.path }
      );
    }
  }

  return {
    files: response.files,
    decisions: response.decisions || [],
    warnings: response.warnings || []
  };
}

function getBlueprintObjectFromBatch(batch) {
  const parsed = safeJsonParse(batch.blueprint || "{}");

  if (!parsed.ok) {
    throw new KirovBatcherError(
      "INVALID_BLUEPRINT_JSON",
      "Le Blueprint du batch n'est pas un JSON valide.",
      { error: parsed.error.message }
    );
  }

  return parsed.value;
}

function validateBatchBlueprintConsistency(batch) {
  const blueprint = getBlueprintObjectFromBatch(batch);

  if (
    batch.blueprintHash &&
    blueprint.hash &&
    batch.blueprintHash !== blueprint.hash
  ) {
    throw new KirovBatcherError(
      "BLUEPRINT_HASH_MISMATCH",
      "Le hash du Blueprint ne correspond pas au batch."
    );
  }

  return blueprint;
}

function validateInteractionCoverage(blueprint, aiResponse) {
  const declared = new Set(
    aiResponse.decisions
      .map((decision) => decision.interactionId)
      .filter(Boolean)
  );

  return (blueprint.interactions || []).map((interaction) => ({
    interactionId: interaction.id,
    sourceFile: interaction.sourceFile,
    label: interaction.label,
    status: declared.has(interaction.id)
      ? "declared"
      : "missing"
  }));
}

function createBlueprintReport(files, projectId) {
  const blueprint = buildBlueprint(files, projectId);

  return {
    blueprint,
    json: JSON.stringify(blueprint, null, 2),
    compact: compactJson(blueprint),
    hash: blueprint.hash,
    summary: {
      files: blueprint.sourceFiles.length,
      routes: blueprint.routes.length,
      interactions: blueprint.interactions.length,
      assets: blueprint.assets.length,
      warnings: blueprint.warnings.length,
      parser: blueprint.parser
    }
  };
}

module.exports = {
  BATCH_SIZE,
  DEFAULT_LIMITS,
  KirovBatcherError,
  assertSafeArchivePath,
  extractZipToFiles,
  normalizeRoutePath,
  scanHtmlInteractions,
  buildBlueprint,
  createBlueprintReport,
  sliceIntoBatches,
  generateBatchPrompt,
  validateGeneratedAiResponse,
  validateInteractionCoverage,
  validateBatchBlueprintConsistency,
  findAndReadPrd
};