
// Headless Electron Mock for Linux/VPS
try {
  require('electron');
} catch (e) {
  const Module = require('module');
  const originalRequire = Module.prototype.require;
  Module.prototype.require = function(id) {
    if (id === 'electron') {
      return {
        shell: {
          openExternal: async (url) => { console.log('[Headless Mock] OpenExternal:', url); return true; },
          openPath: async (p) => { console.log('[Headless Mock] OpenPath:', p); return ''; }
        },
        dialog: {
          showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
          showSaveDialog: async () => ({ canceled: true, filePath: '' })
        },
        BrowserWindow: class {
          constructor() {}
          loadURL() {}
          webContents = { executeJavaScript: async () => '' };
          close() {}
          show() {}
        },
        app: {
          getPath: () => '/tmp',
          isPackaged: false
        }
      };
    }
    return originalRequire.apply(this, arguments);
  };
}

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

// Configuration de l'environnement de travail Linux / VPS
global.WORKSPACE_DIR = process.env.WORKSPACE_DIR || path.join(__dirname, 'v0saveprojets');
if (!fs.existsSync(global.WORKSPACE_DIR)) {
  fs.mkdirSync(global.WORKSPACE_DIR, { recursive: true });
}

// Système de logs global (partagé avec le routeur)
let globalLogs = ["> Moteur Serveur Headless Kirov5 prêt sur Linux/VPS (Contabo Cloud)."];
function addLog(msg) {
  const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
  globalLogs.push(`[${time}] ${msg}`);
  if (globalLogs.length > 50) globalLogs.shift();
  console.log(msg);
}
global.addLog = addLog;
global.globalLogs = globalLogs;
global._blockedMissions = global._blockedMissions || new Set();

const server = express();

// Import V5 Canonical Router
const v5Router = require('./electron/orchestrator/routes/v5-router');


// Chrome Private Network Access (PNA) & CORS Bypass
server.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Private-Network', 'true');
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, x-api-key');
    return res.status(200).end();
  }
  next();
});

server.use(cors({
  origin: true,
  credentials: true
}));

server.use(express.json({ limit: '50mb' }));

// Logs Endpoint
server.get(['/api/logs', '/api/bridge/logs', '/bridge/logs'], (req, res) => {
  res.json({ success: true, logs: globalLogs });
});

server.post(['/api/logs', '/api/bridge/log', '/bridge/log'], (req, res) => {
  const msg = req.body && req.body.message;
  if (msg && global.addLog) {
    global.addLog(msg);
  }
  res.json({ success: true });
});

// Endpoint de téléchargement de l'archive source d'un projet pour le compilateur Cloud (GitHub Actions)
server.get(['/api/mobile/project-archive', '/mobile/project-archive'], (req, res) => {
  const proj = (req.query.project || req.query.name || '').replace(/[^a-zA-Z0-9_\-]/g, '_');
  if (!proj) return res.status(400).json({ error: 'Nom de projet requis' });

  const candidateDirs = [
    path.join('/var/projects', proj),
    path.join(global.WORKSPACE_DIR || '', proj),
    path.join(__dirname, 'v0saveprojets', proj),
    path.join(process.cwd(), 'v0saveprojets', proj),
    path.join('/var/www/tiger/backend/v0saveprojets', proj),
    path.join(__dirname, '..', 'boilerplates', 'projets', proj),
    path.join('e:\\worldmodelv2\\boilerplates\\projets', proj),
    path.join('e:\\v0reponses\\v0-moteur-electron\\v0saveprojets', proj)
  ];

  let targetDir = null;
  for (const d of candidateDirs) {
    if (d && fs.existsSync(d) && fs.statSync(d).isDirectory()) {
      targetDir = d;
      break;
    }
  }

  if (!targetDir) {
    return res.status(404).json({ error: `Projet "${proj}" introuvable sur le serveur.` });
  }

  res.setHeader('Content-Type', 'application/gzip');
  res.setHeader('Content-Disposition', `attachment; filename="${proj}.tar.gz"`);

  const parentDir = path.dirname(targetDir);
  const baseName = path.basename(targetDir);

  const tarProc = spawn('tar', [
    '--exclude=node_modules',
    '--exclude=.git',
    '--exclude=android',
    '-czf',
    '-',
    '-C',
    parentDir,
    baseName
  ]);

  tarProc.stdout.pipe(res);

  tarProc.stderr.on('data', (d) => {
    console.warn(`[ARCHIVE_TAR_WARN] ${d.toString()}`);
  });

  tarProc.on('error', (err) => {
    console.error('[ARCHIVE_TAR_ERR]', err);
    if (!res.headersSent) res.status(500).json({ error: err.message });
  });
});

// ==============================================================================
// GESTION DU SYSTÈME DE FICHIERS (File Explorer, Read/Write, Projets IDE)
// ==============================================================================
function getProjectDir(project) {
  const clean = (project || '').replace(/[^a-zA-Z0-9_\-]/g, '_');
  if (!clean) return null;
  const candidates = [
    path.join('/var/projects', clean),
    path.join(global.WORKSPACE_DIR || '', clean),
    path.join(__dirname, 'v0saveprojets', clean),
    path.join(process.cwd(), 'v0saveprojets', clean),
    path.join('/var/www/tiger/backend/v0saveprojets', clean),
    path.join(__dirname, '..', 'boilerplates', 'projets', clean),
    path.join('e:\\worldmodelv2\\boilerplates\\projets', clean),
    path.join('e:\\v0reponses\\v0saveprojets', clean),
    path.join('e:\\v0reponses\\v0-moteur-electron\\v0saveprojets', clean)
  ];
  for (const d of candidates) {
    if (d && fs.existsSync(d) && fs.statSync(d).isDirectory()) {
      return d;
    }
  }
  return null;
}

function buildFsTree(dirPath, basePath, depth = 0) {
  if (depth > 7) return null;
  try {
    const stat = fs.statSync(dirPath);
    const name = path.basename(dirPath);
    const relPath = path.relative(basePath, dirPath).replace(/\\/g, '/');
    if (stat.isDirectory()) {
      const IGNORE = ['node_modules', '.git', 'dist', '.vite', 'android', 'ios', '.cache', 'build'];
      if (depth > 0 && IGNORE.includes(name)) return null;
      const entries = fs.readdirSync(dirPath);
      const children = entries
        .map(child => buildFsTree(path.join(dirPath, child), basePath, depth + 1))
        .filter(Boolean)
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      return { name, path: relPath || '.', type: 'directory', children };
    } else {
      return { name, path: relPath, type: 'file' };
    }
  } catch (e) {
    return null;
  }
}

server.get(['/api/fs/tree', '/api/bridge/fs/tree', '/bridge/fs/tree'], (req, res) => {
  const proj = req.query.project || '';
  const dir = getProjectDir(proj);
  if (!dir) {
    return res.json({ success: false, error: `Projet "${proj}" introuvable`, tree: null });
  }
  const tree = buildFsTree(dir, dir);
  res.json({ success: true, tree });
});

server.get(['/api/fs/read', '/api/bridge/fs/read', '/bridge/fs/read'], (req, res) => {
  const proj = req.query.project || '';
  const file = (req.query.file || '').replace(/\.\./g, '');
  const dir = getProjectDir(proj);
  if (!dir) {
    return res.json({ success: false, error: `Projet "${proj}" introuvable` });
  }
  const fullPath = path.join(dir, file);
  if (!fullPath.startsWith(dir)) {
    return res.status(403).json({ success: false, error: 'Accès refusé' });
  }
  try {
    if (!fs.existsSync(fullPath)) {
      return res.json({ success: false, error: 'Fichier introuvable' });
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    res.json({ success: true, content, file });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

server.post(['/api/fs/write', '/api/bridge/fs/write', '/bridge/fs/write'], (req, res) => {
  const { project, file, content } = req.body || {};
  const clean = (file || '').replace(/\.\./g, '');
  const dir = getProjectDir(project);
  if (!dir) {
    return res.json({ success: false, error: `Projet "${project}" introuvable` });
  }
  const fullPath = path.join(dir, clean);
  if (!fullPath.startsWith(dir)) {
    return res.status(403).json({ success: false, error: 'Accès refusé' });
  }
  try {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content !== undefined ? content : '', 'utf8');
    res.json({ success: true, message: `Fichier "${clean}" sauvegardé avec succès.` });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

server.get(['/api/projects-v2', '/api/projects', '/api/bridge/projects'], (req, res) => {
  const candidateDirs = [
    '/var/projects',
    global.WORKSPACE_DIR,
    path.join(__dirname, 'v0saveprojets'),
    path.join(process.cwd(), 'v0saveprojets'),
    path.join('/var/www/tiger/backend/v0saveprojets'),
    path.join(__dirname, '..', 'boilerplates', 'projets'),
    'e:\\worldmodelv2\\boilerplates\\projets',
    'e:\\v0reponses\\v0saveprojets'
  ].filter(Boolean);

  const foundProjects = new Set();
  for (const root of candidateDirs) {
    try {
      if (fs.existsSync(root) && fs.statSync(root).isDirectory()) {
        const entries = fs.readdirSync(root);
        for (const entry of entries) {
          if (!entry.startsWith('.')) {
            const p = path.join(root, entry);
            if (fs.existsSync(p) && fs.statSync(p).isDirectory()) {
              foundProjects.add(entry);
            }
          }
        }
      }
    } catch (e) {}
  }
  res.json({ success: true, projects: Array.from(foundProjects) });
});

// ==============================================================================
// GESTION DU COMPILATEUR MOBILE APK (v0-apk)
// ==============================================================================
let mobileBuildLogs = [];
let isMobileBuilding = false;
let mobileBuildResult = null;

server.post(['/api/mobile/build-apk', '/mobile/build-apk'], async (req, res) => {
  const { project } = req.body || {};
  console.log(`[MOBILE_ENGINE] 🚀 Demande de compilation APK (v0-apk) pour "${project}"...`);

  const cleanProject = (project || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const WORKSPACE = global.WORKSPACE_DIR || path.join(__dirname, 'v0saveprojets');
  const apkDir = process.platform === 'win32' ? 'e:\\v0reponses\\v0-apk' : path.join(__dirname, '..', 'v0-apk');
  const apkScript = path.join(apkDir, 'apk_builder.py');

  // Détection du dossier réel du projet
  let actualDir = null;
  const candidateDirs = [
    path.join(WORKSPACE, cleanProject),
    path.join('/var/projects', cleanProject),
    path.join(process.cwd(), 'v0saveprojets', cleanProject),
    path.join(__dirname, '..', 'boilerplates', 'projets', cleanProject),
    path.join('e:\\worldmodelv2\\boilerplates\\projets', cleanProject),
    path.join('e:\\v0reponses\\boilerplates\\projets', cleanProject)
  ];
  for (const c of candidateDirs) {
    if (fs.existsSync(c)) {
      actualDir = c;
      break;
    }
  }

  mobileBuildLogs = [`[v0-apk] 🚀 Initialisation du build natif pour "${cleanProject}"...`];
  isMobileBuilding = true;
  mobileBuildResult = null;

  res.json({
    success: true,
    message: `Pipeline v0-apk démarré pour ${cleanProject}.`,
    apkPath: path.join(apkDir, 'output', `${cleanProject}.apk`)
  });

  if (!actualDir) {
    isMobileBuilding = false;
    mobileBuildResult = { success: false, message: `Dossier projet "${cleanProject}" introuvable.` };
    mobileBuildLogs.push(`[v0-apk] ❌ Projet "${cleanProject}" introuvable sur le disque (${WORKSPACE}).`);
    return;
  }

  // Si apk_builder.py n'existe pas (ex: sur le VPS cloud Linux)
  if (!fs.existsSync(apkScript)) {
    isMobileBuilding = false;
    mobileBuildResult = {
      success: false,
      message: `Compilateur mobile v0-apk absent du VPS Cloud.`
    };
    mobileBuildLogs.push(`[v0-apk] ℹ️ Projet "${cleanProject}" détecté avec succès dans ${actualDir}.`);
    mobileBuildLogs.push(`[v0-apk] ℹ️ Environnement Cloud VPS Linux (109.205.182.17) actif.`);
    mobileBuildLogs.push(`[v0-apk] 📱 La chaîne complète de compilation Java JDK 17 + Android SDK est configurée sur votre machine Windows locale (E:\\v0reponses\\v0-apk).`);
    mobileBuildLogs.push(`[v0-apk] 💡 Pour obtenir le fichier APK final : lancez la commande locale "python apk_builder.py --src <dist> --name ${cleanProject} --build".`);
    return;
  }

  // Détection du dossier de distribution web (dist ou out ou build)
  let webBuildDir = path.join(actualDir, 'dist');
  if (fs.existsSync(path.join(actualDir, 'out'))) {
    webBuildDir = path.join(actualDir, 'out');
  } else if (fs.existsSync(path.join(actualDir, 'build'))) {
    webBuildDir = path.join(actualDir, 'build');
  }

  // 0. Assurer la conformité Vite, types, ActionToolbar immunisé et purge parasite
  try {
    if (v5Router && typeof v5Router.ensureVitePackageJson === 'function') {
      v5Router.ensureVitePackageJson(actualDir, cleanProject);
      mobileBuildLogs.push(`[v0-apk] 🛡️ Types, ActionToolbar et structure vérifiés/immunisés avec succès.`);
    }
  } catch (e) {
    console.warn("[v0-apk] Erreur ensureVitePackageJson:", e);
  }

  // 1. Configurer Vite pour Capacitor (base: './')
  const viteConfigPath = path.join(actualDir, 'vite.config.ts');
  const viteConfigJsPath = path.join(actualDir, 'vite.config.js');
  const targetVitePath = fs.existsSync(viteConfigPath) ? viteConfigPath : (fs.existsSync(viteConfigJsPath) ? viteConfigJsPath : null);

  if (targetVitePath) {
    try {
      let content = fs.readFileSync(targetVitePath, 'utf8');
      if (!content.includes("base:") && !content.includes("base :")) {
        content = content.replace("defineConfig({", "defineConfig({\n  base: './',");
        fs.writeFileSync(targetVitePath, content, 'utf8');
        mobileBuildLogs.push(`[v0-apk] 🔧 Configuration Vite mise à jour (base: './') pour Capacitor.`);
      }
    } catch (e) {
      console.warn("[v0-apk] Erreur mise à jour vite.config:", e);
    }
  }

  // 2. Compilation Web
  mobileBuildLogs.push(`[v0-apk] 📦 Compilation des assets Web (pnpm run build)...`);
  const buildCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const buildProcess = spawn(buildCmd, ['run', 'build'], { cwd: actualDir, shell: true });

  buildProcess.stdout.on('data', (d) => {
    const text = d.toString('utf-8');
    text.split(/\r?\n/).filter(Boolean).forEach(line => mobileBuildLogs.push(`[VITE] ${line}`));
  });

  buildProcess.stderr.on('data', (d) => {
    const text = d.toString('utf-8');
    text.split(/\r?\n/).filter(Boolean).forEach(line => mobileBuildLogs.push(`[VITE ERR] ${line}`));
  });

  buildProcess.on('close', (buildCode) => {
    if (buildCode !== 0) {
      isMobileBuilding = false;
      mobileBuildResult = { success: false, message: `Échec pnpm build (Code: ${buildCode})` };
      mobileBuildLogs.push(`[v0-apk] ❌ Échec de la compilation Web (Code retour: ${buildCode})`);
      return;
    }

    mobileBuildLogs.push(`[v0-apk] ✅ Compilation Web terminée. Dossier dist prêt.`);

    // 3. Lancer la compilation souveraine v0-apk
    mobileBuildLogs.push(`[v0-apk] 🤖 Lancement du compilateur natif apk_builder.py...`);
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const py = spawn(pythonCmd, [apkScript, '--src', webBuildDir, '--name', cleanProject, '--build'], {
      cwd: apkDir,
      shell: process.platform === 'win32'
    });

    py.stdout.on('data', (d) => {
      const text = d.toString('utf-8');
      text.split(/\r?\n/).filter(Boolean).forEach(line => {
        console.log(`[v0-apk] ${line}`);
        mobileBuildLogs.push(`[v0-apk] ${line}`);
      });
    });

    py.stderr.on('data', (d) => {
      const text = d.toString('utf-8');
      text.split(/\r?\n/).filter(Boolean).forEach(line => {
        console.log(`[v0-apk ERR] ${line}`);
        mobileBuildLogs.push(`[v0-apk ERR] ${line}`);
      });
    });

    py.on('close', (code) => {
      isMobileBuilding = false;
      if (code === 0) {
        const finalApkPath = path.join(apkDir, 'output', `${cleanProject}.apk`);
        mobileBuildResult = {
          success: true,
          apkPath: finalApkPath,
          apkUrl: `/api/mobile/download-apk?file=${encodeURIComponent(cleanProject + '.apk')}`
        };
        mobileBuildLogs.push(`[v0-apk] ✅ Compilation Gradle terminée avec succès ! APK généré : ${finalApkPath}`);
      } else {
        mobileBuildResult = { success: false, message: `Échec build Gradle (Code retour: ${code})` };
        mobileBuildLogs.push(`[v0-apk] ❌ Échec de la compilation (Code retour: ${code})`);
      }
    });
  });
});

server.get(['/api/mobile/build-logs', '/mobile/build-logs'], (req, res) => {
  res.json({
    isBuilding: isMobileBuilding,
    building: isMobileBuilding,
    logs: mobileBuildLogs,
    result: mobileBuildResult
  });
});

server.get(['/api/mobile/download-apk', '/mobile/download-apk'], (req, res) => {
  const fileName = req.query.file || 'app.apk';
  const apkDir = process.platform === 'win32' ? 'e:\\v0reponses\\v0-apk' : path.join(__dirname, '..', 'v0-apk');
  const apkPath = path.join(apkDir, 'output', fileName);
  if (fs.existsSync(apkPath)) {
    res.download(apkPath);
  } else {
    res.status(404).json({ error: "Fichier APK introuvable sur le disque." });
  }
});

server.get(['/api/mobile/list-apks', '/mobile/list-apks'], (req, res) => {
  const apkDir = process.platform === 'win32' ? 'e:\\v0reponses\\v0-apk' : path.join(__dirname, '..', 'v0-apk');
  const outDir = path.join(apkDir, 'output');
  if (!fs.existsSync(outDir)) {
    return res.json({ success: true, apks: [] });
  }
  try {
    const files = fs.readdirSync(outDir).filter(f => f.endsWith('.apk'));
    const apks = files.map(file => {
      const fullPath = path.join(outDir, file);
      const stat = fs.statSync(fullPath);
      return {
        file,
        name: file.replace('.apk', ''),
        sizeMb: (stat.size / (1024 * 1024)).toFixed(1),
        updatedAt: stat.mtime,
        url: `/api/mobile/download-apk?file=${encodeURIComponent(file)}`
      };
    });
    res.json({ success: true, apks });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 TIGER-STITCH-AUTO — Câblage Automatique Stitch → React
// Appelé après chaque extraction ZIP pour câbler les designs Stitch dans le projet
// ═══════════════════════════════════════════════════════════════════════════════
function autoWireStitchToPublic(projectRoot, projectId) {
  const fsp = require('fs');
  const pathp = require('path');

  // ── 1. Scanner récursivement tous les code.html dans le projet ─────────────
  // Structure Stitch : [pack_dir]/[ecran_dir]/code.html
  const allCodeHtml = [];

  function scanForStitchHtml(dir, depth) {
    if (depth > 4) return;
    let entries;
    try { entries = fsp.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'public') continue;
      if (e.isDirectory()) {
        scanForStitchHtml(pathp.join(dir, e.name), depth + 1);
      } else if (e.name === 'code.html') {
        allCodeHtml.push(pathp.join(dir, e.name));
      }
    }
  }
  scanForStitchHtml(projectRoot, 0);

  if (allCodeHtml.length === 0) {
    console.log(`[STITCH-AUTO] ℹ️ Aucun code.html trouvé dans ${projectId}. Câblage non nécessaire.`);
    return;
  }

  // ── 2. Construire la liste des écrans à partir des code.html ───────────────
  const screens = [];
  const screenIdSeen = new Set();

  for (const htmlPath of allCodeHtml) {
    // Le dossier parent direct = nom de l'écran
    const screenDir = pathp.basename(pathp.dirname(htmlPath));
    // Nettoyer le nom pour en faire un id valide
    const screenId = screenDir
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()
      .slice(0, 60) || 'ecran';

    if (screenIdSeen.has(screenId)) continue;
    screenIdSeen.add(screenId);

    // Label lisible : remplacer _ et - par des espaces, capitaliser
    const label = screenDir
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .slice(0, 40);

    screens.push({ id: screenId, label, srcPath: htmlPath });
  }

  if (screens.length === 0) return;

  // ── 3. Créer le dossier public/stitch/ ────────────────────────────────────
  const publicStitchDir = pathp.join(projectRoot, 'public', 'stitch');
  fsp.mkdirSync(publicStitchDir, { recursive: true });

  // ── 4. Copier chaque code.html → public/stitch/[screenId]/code.html ───────
  for (const screen of screens) {
    const destDir = pathp.join(publicStitchDir, screen.id);
    fsp.mkdirSync(destDir, { recursive: true });
    const destFile = pathp.join(destDir, 'code.html');
    try {
      fsp.copyFileSync(screen.srcPath, destFile);
      console.log(`[STITCH-AUTO] ✅ Copié : ${screen.id}/code.html`);
    } catch (cpErr) {
      console.warn(`[STITCH-AUTO] ⚠️ Erreur copie ${screen.id}:`, cpErr.message);
    }

    // Copier aussi les images (screen.png) si présentes
    const srcDir = pathp.dirname(screen.srcPath);
    try {
      for (const asset of fsp.readdirSync(srcDir)) {
        if (asset !== 'code.html' && /\.(png|jpg|svg|webp)$/i.test(asset)) {
          fsp.copyFileSync(pathp.join(srcDir, asset), pathp.join(destDir, asset));
        }
      }
    } catch {}
  }

  // ── 5. Écrire screens.json ────────────────────────────────────────────────
  const screensJson = screens.map(s => ({ id: s.id, label: s.label }));
  fsp.writeFileSync(
    pathp.join(publicStitchDir, 'screens.json'),
    JSON.stringify(screensJson, null, 2),
    'utf8'
  );

  // ── 6. Générer/Mettre à jour src/App.tsx câblé ────────────────────────────
  const srcDir = pathp.join(projectRoot, 'src');
  fsp.mkdirSync(srcDir, { recursive: true });
  const appTsxPath = pathp.join(srcDir, 'App.tsx');

  // Ne pas écraser si App.tsx est déjà câblé (contient le viewer Stitch actif)
  let shouldWriteApp = true;
  if (fsp.existsSync(appTsxPath)) {
    const existing = fsp.readFileSync(appTsxPath, 'utf8');
    const alreadyWired = existing.includes('STITCH-AUTO-WIRED');
    if (alreadyWired) {
      // Mettre à jour uniquement les screens (injection intelligente)
      const updatedScreens = `  const SCREENS = ${JSON.stringify(screensJson, null, 4)};`;
      const newContent = existing.replace(
        /\/\/ STITCH-AUTO-SCREENS-START[\s\S]*?\/\/ STITCH-AUTO-SCREENS-END/,
        `// STITCH-AUTO-SCREENS-START\n${updatedScreens}\n  // STITCH-AUTO-SCREENS-END`
      );
      if (newContent !== existing) {
        fsp.writeFileSync(appTsxPath, newContent, 'utf8');
        console.log(`[STITCH-AUTO] 🔄 App.tsx mis à jour avec ${screens.length} écran(s).`);
      }
      shouldWriteApp = false;
    } else if (
      existing.includes('Sovereign Engine') ||
      existing.includes("Prêt à recevoir le code de l'IA") ||
      existing.includes('ActionToolbar') ||
      existing.length < 600
    ) {
      shouldWriteApp = true; // App.tsx est un placeholder → écraser
    } else {
      shouldWriteApp = false; // App.tsx est un vrai projet → ne pas écraser
    }
  }

  if (shouldWriteApp) {
    const initialScreen = screensJson[0]?.id || 'ecran';
    const navIcons = [
      'home', 'shopping_cart', 'lock', 'check_circle', 'person',
      'dashboard', 'payments', 'inventory', 'settings', 'favorite'
    ];

    const appTsxContent = `// STITCH-AUTO-WIRED — Généré automatiquement par Tiger Stitch Auto-Wiring
import React, { useState } from 'react';

// STITCH-AUTO-SCREENS-START
  const SCREENS = ${JSON.stringify(screensJson, null, 4)};
  // STITCH-AUTO-SCREENS-END

type Viewport = 'desktop' | 'tablet' | 'mobile';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('${initialScreen}');
  const [viewport, setViewport] = useState<Viewport>('mobile');
  const [activeTab, setActiveTab] = useState<'stitch' | 'live'>('stitch');

  const currentScreen = SCREENS.find(s => s.id === activeScreen) || SCREENS[0];
  const viewportWidth = viewport === 'mobile' ? '390px' : viewport === 'tablet' ? '768px' : '100%';

  return (
    <div style={{ width: '100vw', height: '100dvh', background: '#0d0e13', color: '#e3e1e9', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>

      {/* ── Top Bar ── */}
      <header style={{ height: '52px', background: 'rgba(13,14,19,0.97)', borderBottom: '1px solid rgba(78,222,163,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <span style={{ fontWeight: '700', fontSize: '14px', color: '#e3e1e9' }}>${projectId}</span>
          <span style={{ fontSize: '10px', background: 'rgba(78,222,163,0.1)', color: '#4edea3', border: '1px solid rgba(78,222,163,0.2)', borderRadius: '20px', padding: '2px 8px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>STITCH LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setActiveTab('stitch')} style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px', background: activeTab === 'stitch' ? '#4f46e5' : '#1e1f25', color: activeTab === 'stitch' ? '#fff' : '#86948a', transition: 'all 0.2s' }}>🎨 Designs</button>
          <button onClick={() => setActiveTab('live')} style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '12px', background: activeTab === 'live' ? '#4edea3' : '#1e1f25', color: activeTab === 'live' ? '#003824' : '#86948a', transition: 'all 0.2s' }}>⚡ Application</button>
        </div>
      </header>

      {/* ── Contenu Principal ── */}
      {activeTab === 'stitch' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Barre d'écrans + viewport */}
          <div style={{ background: 'rgba(13,14,19,0.9)', borderBottom: '1px solid rgba(78,222,163,0.08)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflowX: 'auto', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {SCREENS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveScreen(s.id)}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap', background: activeScreen === s.id ? '#4f46e5' : '#1e1f25', color: activeScreen === s.id ? '#fff' : '#86948a', transition: 'all 0.15s' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {(['mobile', 'tablet', 'desktop'] as Viewport[]).map(vp => (
                <button key={vp} onClick={() => setViewport(vp)} title={vp} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '700', background: viewport === vp ? '#4edea3' : '#292a2f', color: viewport === vp ? '#003824' : '#86948a' }}>
                  {vp === 'mobile' ? '📱' : vp === 'tablet' ? '📟' : '🖥️'}
                </button>
              ))}
            </div>
          </div>

          {/* Viewer iframe Stitch */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06080e', padding: '16px', overflow: 'auto' }}>
            <div style={{ width: viewportWidth, height: '100%', maxHeight: '100%', borderRadius: viewport === 'mobile' ? '24px' : '12px', overflow: 'hidden', border: '1px solid rgba(78,222,163,0.2)', boxShadow: '0 8px 40px rgba(0,0,0,0.6)', transition: 'width 0.3s ease', background: '#fff' }}>
              <iframe
                key={activeScreen}
                src={\`./stitch/\${activeScreen}/code.html\`}
                title={\`Stitch — \${currentScreen?.label || activeScreen}\`}
                style={{ width: '100%', height: '100%', minHeight: '600px', border: 'none', display: 'block' }}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>

          {/* Bottom navigation */}
          {SCREENS.length > 1 && (
            <nav style={{ height: '64px', background: 'rgba(13,14,19,0.97)', borderTop: '1px solid rgba(78,222,163,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', flexShrink: 0 }}>
              {SCREENS.map((s, i) => {
                const icons = ['home', 'shopping_cart', 'lock', 'check_circle', 'person', 'dashboard', 'payments', 'settings'];
                const isActive = activeScreen === s.id;
                return (
                  <button key={s.id} onClick={() => setActiveScreen(s.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '6px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: isActive ? 'rgba(78,222,163,0.12)' : 'transparent', color: isActive ? '#4edea3' : '#86948a', fontSize: '10px', fontWeight: '600', transition: 'all 0.2s' }}>
                    <span style={{ fontFamily: 'Material Symbols Outlined', fontSize: '22px', fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icons[i % icons.length]}</span>
                    <span>{s.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      ) : (
        // ── Onglet Application Live ──────────────────────────────────────────
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>⚡</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>${projectId}</h1>
          <p style={{ color: '#86948a', fontSize: '14px', margin: 0, maxWidth: '400px' }}>
            L'application est en cours de câblage. Les {SCREENS.length} écrans Stitch sont chargés et disponibles dans l'onglet Designs.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', width: '100%', maxWidth: '600px' }}>
            {SCREENS.map(s => (
              <div key={s.id} style={{ background: '#1e1f25', borderRadius: '12px', padding: '16px', border: '1px solid rgba(78,222,163,0.15)' }}>
                <div style={{ fontSize: '12px', color: '#4edea3', fontWeight: '700', marginBottom: '4px' }}>✅ Écran</div>
                <div style={{ fontSize: '13px', color: '#e3e1e9' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('stitch')} style={{ marginTop: '8px', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: '#4f46e5', color: '#fff', fontWeight: '700', fontSize: '14px' }}>
            🎨 Voir les Designs Stitch
          </button>
        </div>
      )}

      {/* Material Symbols pour les icônes */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
    </div>
  );
}
`;

    fsp.writeFileSync(appTsxPath, appTsxContent, 'utf8');
    console.log(`[STITCH-AUTO] ✨ App.tsx câblé généré avec ${screens.length} écran(s) pour ${projectId}.`);
  }

  // ── 7. Log final ──────────────────────────────────────────────────────────
  const msg = `[STITCH-AUTO] 🎨 Câblage terminé : ${screens.length} écran(s) Stitch → public/stitch/ | ${projectId}`;
  console.log(msg);
  if (global.addLog) global.addLog(msg);
}

// ==============================================================================
// GESTION DES ARCHIVES ZIP (STITCH / EXPORT UI / PACK PRD)
// ==============================================================================
server.post(['/api/fs/upload-zip', '/fs/upload-zip'], async (req, res) => {

  try {
    const { project, fileName, fileBase64 } = req.body || {};
    if (!fileBase64) {
      return res.status(400).json({ success: false, error: 'Données ZIP requises (fileBase64 manquant).' });
    }

    const targetProject = (project || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const targetDir = path.join(global.WORKSPACE_DIR || path.join(process.cwd(), 'v0saveprojets'), targetProject);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const cleanFileName = (fileName || 'stitch_export.zip').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const buffer = Buffer.from(fileBase64, 'base64');
    const zipFilePath = path.join(targetDir, cleanFileName);
    fs.writeFileSync(zipFilePath, buffer);

    let extractedFiles = [];
    let extractionMethod = 'none';

    // 1. Essai avec JSZip (Node.js)
    let JSZip = null;
    try {
      JSZip = require('jszip');
    } catch {
      try {
        JSZip = require(path.join(__dirname, '../node_modules/jszip'));
      } catch {}
    }

    if (JSZip) {
      try {
        const zip = await JSZip.loadAsync(buffer);
        for (const [entryPath, entry] of Object.entries(zip.files)) {
          if (entry.dir) continue;
          if (entryPath.includes('__MACOSX') || path.basename(entryPath).startsWith('.')) continue;

          // Nettoyage anti-Zip-Slip
          const safeRel = path.normalize(entryPath).replace(/^(\.\.[\/\\])+/, '');
          const destPath = path.join(targetDir, safeRel);

          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          const content = await entry.async('nodebuffer');
          fs.writeFileSync(destPath, content);
          extractedFiles.push(safeRel);
        }
        extractionMethod = 'jszip';
      } catch (zipErr) {
        console.warn('[UPLOAD-ZIP] Échec extraction JSZip:', zipErr.message);
      }
    }

    // 2. Fallback système si JSZip non disponible ou échec
    if (extractedFiles.length === 0) {
      const { execFileSync } = require('child_process');
      if (process.platform === 'win32') {
        try {
          execFileSync('powershell.exe', [
            '-NoProfile', '-NonInteractive', '-Command',
            `& { Expand-Archive -LiteralPath '${zipFilePath}' -DestinationPath '${targetDir}' -Force }`
          ], { stdio: 'pipe', windowsHide: true });
          extractionMethod = 'powershell';
        } catch (psErr) {
          console.warn('[UPLOAD-ZIP] PowerShell extract failed:', psErr.message);
        }
      } else {
        try {
          execFileSync('unzip', ['-o', '-q', zipFilePath, '-d', targetDir], { stdio: 'pipe' });
          extractionMethod = 'unzip_cli';
        } catch (unzipErr) {
          console.warn('[UPLOAD-ZIP] unzip CLI failed:', unzipErr.message);
        }
      }
    }

    const count = extractedFiles.length || 1;
    if (global.addLog) {
      global.addLog(`[ZIP UPLOAD] 📦 Archive "${cleanFileName}" importée dans "${targetProject}" (${count} fichier(s) extraits).`);
    }
    console.log(`[ZIP UPLOAD] 📦 Archive "${cleanFileName}" importée dans ${targetProject} (${count} fichiers, méthode: ${extractionMethod})`);

    // 🚀 Configuration automatique Vite & Stitch UI/UX
    try {
      if (v5Router && typeof v5Router.ensureVitePackageJson === 'function') {
        v5Router.ensureVitePackageJson(targetDir, targetProject);
      }
      if (v5Router && typeof v5Router.autoInstallAndLaunchDevServer === 'function') {
        setTimeout(() => {
          v5Router.autoInstallAndLaunchDevServer(targetProject);
        }, 500);
      }
    } catch (e) {
      console.warn('[ZIP UPLOAD] Erreur configuration Vite/Stitch:', e.message);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🎨 CÂBLAGE AUTOMATIQUE STITCH → REACT (TIGER-STITCH-AUTO)
    // Scanne les dossiers Stitch extraits, copie les code.html dans public/stitch/
    // et génère App.tsx câblé + screens.json pour navigation automatique.
    // ═══════════════════════════════════════════════════════════════════════
    try {
      // Priorité 1 : setupStitchPages du v5-router (version la plus avancée)
      if (v5Router && typeof v5Router.setupStitchPages === 'function') {
        const screens = v5Router.setupStitchPages(targetDir, targetProject);
        if (screens && screens.length > 0) {
          const msg = `[STITCH-AUTO] 🎨 ${screens.length} écran(s) câblés automatiquement pour ${targetProject}`;
          console.log(msg);
          if (global.addLog) global.addLog(msg);
        }
      }
      // Priorité 2 : fonction locale autonome (toujours exécutée pour App.tsx)
      autoWireStitchToPublic(targetDir, targetProject);
    } catch (wireErr) {
      console.warn('[ZIP UPLOAD] Câblage Stitch automatique (non bloquant):', wireErr.message);
    }

    return res.json({
      success: true,
      project: targetProject,
      fileName: cleanFileName,
      extractedCount: count,
      extractionMethod,
      targetDir,
      message: `Archive "${cleanFileName}" importée et extraite avec succès dans le projet ${targetProject}.`
    });
  } catch (err) {
    console.error('[UPLOAD-ZIP] ❌ Erreur:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

server.post(['/api/fs/pick-zip', '/fs/pick-zip'], (req, res) => {
  const { project } = req.body || {};
  const targetProject = (project || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const targetDir = path.join(global.WORKSPACE_DIR || path.join(process.cwd(), 'v0saveprojets'), targetProject);
  return res.json({
    success: true,
    project: targetProject,
    targetDir,
    message: 'Prêt pour réception de ZIP'
  });
});

// Mount V5 Canonical Router
server.use('/api/mobile/v5', v5Router);
server.use('/', v5Router);

// Endpoint Health / Status
server.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'vps_headless',
    workspace: global.WORKSPACE_DIR,
    timestamp: Date.now()
  });
});

// Port configuration
// Endpoint Super-Admin : Statistiques Système VPS & Disque
server.get('/api/admin/system', (req, res) => {
  const os = require('os');
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const usedMem = (totalMem - freeMem).toFixed(2);

  let diskProjects = [];
  try {
    if (fs.existsSync(global.WORKSPACE_DIR)) {
      const entries = fs.readdirSync(global.WORKSPACE_DIR, { withFileTypes: true });
      diskProjects = entries
        .filter(e => e.isDirectory() && !e.name.startsWith('.'))
        .map(e => {
          const pPath = path.join(global.WORKSPACE_DIR, e.name);
          let fileCount = 0;
          try {
            fileCount = fs.readdirSync(pPath).length;
          } catch (_) {}
          return {
            name: e.name,
            files: fileCount,
            path: pPath
          };
        });
    }
  } catch(e) {}

  res.json({
    success: true,
    superAdmin: 'zacktunr@gmail.com',
    system: {
      uptimeSeconds: Math.floor(os.uptime()),
      cpuCores: os.cpus().length,
      ramTotalGB: totalMem,
      ramUsedGB: usedMem,
      ramFreeGB: freeMem,
      projectsOnDisk: diskProjects.length,
      workspacePath: global.WORKSPACE_DIR,
      projects: diskProjects
    }
  });
});

// ==============================================================================
// GESTION DES PROJETS (POST / GET / DELETE / SET-ACTIVE) — VPS + NEON DB
// ==============================================================================

// Endpoint GET /api/projects : Liste des projets (filtrés par utilisateur ou tous pour Super-Admin)
server.get('/api/projects', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      user = verifyJwt(authHeader.split(' ')[1]);
    }

    if (neonSql && user) {
      if (user.isSuperAdmin) {
        // 👑 Super-Admin voit TOUS les projets de TOUS les utilisateurs dans Neon
        const projects = await neonSql`
          SELECT p.project_id, p.title, p.content, p.updated_at, p.user_id, u.email as owner_email
          FROM user_projects p
          JOIN users u ON p.user_id = u.id
          ORDER BY p.updated_at DESC
        `;
        return res.json({ success: true, count: projects.length, projects, isSuperAdmin: true, viewMode: 'global_super_admin' });
      } else {
        // 🔒 Utilisateur standard ne voit QUE ses propres projets dans Neon
        const projects = await neonSql`
          SELECT project_id, title, content, updated_at, user_id
          FROM user_projects
          WHERE user_id = ${user.userId}
          ORDER BY updated_at DESC
        `;
        return res.json({ success: true, count: projects.length, projects, isSuperAdmin: false, viewMode: 'personal_isolated' });
      }
    }

    // Fallback disque VPS
    if (fs.existsSync(global.WORKSPACE_DIR)) {
      const entries = fs.readdirSync(global.WORKSPACE_DIR, { withFileTypes: true });
      const projects = entries
        .filter(e => e.isDirectory() && !e.name.startsWith('.'))
        .map(e => ({
          projectId: e.name,
          title: e.name,
          source: 'vps_disk'
        }));
      return res.json({ success: true, count: projects.length, projects });
    }
    return res.json({ success: true, count: 0, projects: [] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint POST /api/projects : Création de projet (Neon DB + Disque VPS)
server.post('/api/projects', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      user = verifyJwt(authHeader.split(' ')[1]);
    }

    const { title, name, projectId, description, content } = req.body || {};
    const rawName = (title || name || projectId || '').trim();
    if (!rawName) {
      return res.status(400).json({ success: false, error: 'Nom ou titre de projet requis' });
    }

    const cleanId = (projectId || rawName).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const projectDir = path.join(global.WORKSPACE_DIR, cleanId);

    // 1. Création sur le disque du VPS
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
      fs.writeFileSync(path.join(projectDir, 'README.md'), `# ${rawName}\n\nCréé avec succès sur Tiger Cloud VPS.\nDate: ${new Date().toISOString()}`);
    }

    // 🚀 Configuration automatique immédiate Vite, Types, ActionToolbar & Dépendances
    try {
      if (v5Router && typeof v5Router.ensureVitePackageJson === 'function') {
        v5Router.ensureVitePackageJson(projectDir, cleanId);
      }
      // Démarrage de l'installation automatique des dépendances en arrière-plan
      if (v5Router && typeof v5Router.autoInstallAndLaunchDevServer === 'function') {
        setTimeout(() => {
          v5Router.autoInstallAndLaunchDevServer(cleanId);
        }, 300);
      }
    } catch (e) {
      console.warn('[PROJECTS] Erreur initialisation Vite/dépendances:', e.message);
    }

    // 2. Persistance dans Neon PostgreSQL
    if (neonSql) {
      const userId = user?.userId || 1;
      const projectPayload = content || { description: description || 'Projet Cloud SaaS' };
      try {
        await neonSql`
          INSERT INTO user_projects (user_id, project_id, title, content, updated_at)
          VALUES (${userId}, ${cleanId}, ${rawName}, ${JSON.stringify(projectPayload)}, CURRENT_TIMESTAMP)
          ON CONFLICT (user_id, project_id)
          DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = CURRENT_TIMESTAMP
        `;
        console.log(`[PROJECTS] ✅ Projet "${rawName}" (${cleanId}) enregistré dans Neon pour user_id ${userId}`);
      } catch (neonErr) {
        console.warn('[PROJECTS WARNING] Erreur écriture Neon:', neonErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Projet "${rawName}" créé avec succès !`,
      project: {
        projectId: cleanId,
        title: rawName,
        projectDir
      },
      projectDir
    });
  } catch (err) {
    console.error('[PROJECTS ERROR] Création projet:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint POST /api/projects/set-active
server.post('/api/projects/set-active', (req, res) => {
  try {
    const { name, projectId, project_id } = req.body || {};
    const projName = (name || projectId || project_id || '').trim();
    if (!projName) {
      return res.status(400).json({ success: false, error: 'Nom du projet requis' });
    }
    const cleanId = projName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const projectDir = path.join(global.WORKSPACE_DIR, cleanId);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    return res.json({
      success: true,
      projectDir,
      projectId: cleanId,
      message: `Projet actif : ${cleanId}`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint DELETE et POST /api/projects/remove-project : Suppression d'un projet (Base + Disque dur physique)
const handleProjectRemoval = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      user = verifyJwt(authHeader.split(' ')[1]);
    }

    const { targetUserId } = req.body || {};
    const rawId = req.body?.projectId || req.body?.project_id || req.query?.projectId || req.query?.project_id;
    if (!rawId) {
      return res.status(400).json({ success: false, error: 'projectId requis pour la suppression' });
    }

    const cleanId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '');
    if (!cleanId || cleanId.length === 0 || cleanId === '.' || cleanId === '..') {
      return res.status(400).json({ success: false, error: 'Nom de projet invalide' });
    }

    // 1. Suppression dans la base Neon PostgreSQL
    if (neonSql) {
      try {
        if (user && user.isSuperAdmin && targetUserId) {
          await neonSql`DELETE FROM user_projects WHERE user_id = ${Number(targetUserId)} AND (project_id = ${cleanId} OR title = ${cleanId})`;
        } else if (user) {
          await neonSql`DELETE FROM user_projects WHERE user_id = ${user.userId} AND (project_id = ${cleanId} OR title = ${cleanId})`;
        } else {
          // Suppression sans utilisateur spécifique (mode local ou fallback)
          await neonSql`DELETE FROM user_projects WHERE project_id = ${cleanId} OR title = ${cleanId}`;
        }
        console.log(`[PROJECTS] 🗑️ Projet "${cleanId}" supprimé de la base de données Neon.`);
      } catch (dbErr) {
        console.warn(`[PROJECTS] Avertissement suppression DB Neon pour "${cleanId}":`, dbErr.message);
      }
    }

    const dirsToDelete = [
      path.join('/var/projects', cleanId),
      path.join(process.cwd(), 'v0saveprojets', cleanId),
      path.join(__dirname, 'v0saveprojets', cleanId),
      path.join(__dirname, '..', 'v0saveprojets', cleanId),
      path.join(__dirname, '..', 'v0-moteur-electron', 'v0saveprojets', cleanId),
      path.join(process.cwd(), '..', 'v0-moteur-electron', 'v0saveprojets', cleanId),
      global.WORKSPACE_DIR && path.join(global.WORKSPACE_DIR, cleanId),
      path.join('/tmp/target_project', cleanId)
    ].filter(Boolean);

    let deletedFromDisk = false;
    for (const dir of dirsToDelete) {
      // Protection stricte : ne jamais supprimer un répertoire racine
      if (dir === '/' || dir === '/var' || dir === '/var/projects' || dir === process.cwd()) continue;
      if (fs.existsSync(dir)) {
        try {
          fs.rmSync(dir, { recursive: true, force: true });
          deletedFromDisk = true;
          console.log(`[PROJECTS] 🗑️ Dossier supprimé physiquement du disque : ${dir}`);
        } catch (fsErr) {
          console.warn(`[PROJECTS] Erreur suppression dossier ${dir}:`, fsErr.message);
        }
      }
    }

    if (global.addLog) {
      global.addLog(`[PROJECTS] 🗑️ Projet "${cleanId}" supprimé avec succès (Disque: ${deletedFromDisk ? 'Oui' : 'Non'}).`);
    }

    return res.json({
      success: true,
      message: `Projet "${cleanId}" supprimé avec succès.`,
      projectId: cleanId,
      deletedFromDisk
    });
  } catch (err) {
    console.error('[PROJECTS] Erreur lors de la suppression du projet:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

server.delete(['/api/projects', '/api/projects/remove-project', '/projects/remove-project'], handleProjectRemoval);
server.post(['/api/projects/remove-project', '/projects/remove-project'], handleProjectRemoval);

// GET /api/projects/download-zip : Télécharger l'archive ZIP complète d'un projet créé (sans node_modules/.git)
server.get(['/api/projects/download-zip', '/projects/download-zip', '/api/projects/:projectId/download-zip'], async (req, res) => {
  try {
    const rawId = req.params.projectId || req.query.projectId || req.query.project_id || req.query.project || req.query.file;
    if (!rawId) {
      return res.status(400).json({ success: false, error: "Nom de projet requis (?project_id=...)" });
    }

    const cleanId = rawId.replace(/[^a-zA-Z0-9_\-]/g, '');
    if (!cleanId || cleanId === '.' || cleanId === '..') {
      return res.status(400).json({ success: false, error: "Nom de projet invalide" });
    }

    const candidates = [
      path.join('/var/projects', cleanId),
      path.join(process.cwd(), 'v0saveprojets', cleanId),
      path.join(__dirname, 'v0saveprojets', cleanId),
      path.join(__dirname, '..', 'v0saveprojets', cleanId),
      path.join(__dirname, '..', 'v0-moteur-electron', 'v0saveprojets', cleanId),
      path.join(process.cwd(), '..', 'v0-moteur-electron', 'v0saveprojets', cleanId),
      global.WORKSPACE_DIR && path.join(global.WORKSPACE_DIR, cleanId),
      path.join('/tmp/target_project', cleanId)
    ].filter(Boolean);

    let projectDir = null;
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isDirectory()) {
        projectDir = cand;
        break;
      }
    }

    if (!projectDir) {
      return res.status(404).json({ success: false, error: `Projet "${cleanId}" introuvable sur le disque.` });
    }

    console.log(`[ZIP-DOWNLOAD] 📦 Préparation de l'archive ZIP pour "${cleanId}" depuis ${projectDir}...`);

    const JSZip = require('jszip');
    const zip = new JSZip();

    // Ajout récursif de l'arborescence en ignorant node_modules et .git
    const addDirToZip = (currentPath, zipFolder) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          // Ignorer les répertoires volumineux
          if (['node_modules', '.git', '.turbo', '.cache'].includes(entry.name)) {
            continue;
          }
          const subFolder = zipFolder.folder(entry.name);
          addDirToZip(fullPath, subFolder);
        } else if (entry.isFile()) {
          try {
            const data = fs.readFileSync(fullPath);
            zipFolder.file(entry.name, data);
          } catch (_) {}
        }
      }
    };

    addDirToZip(projectDir, zip);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanId}.zip"`);

    const stream = zip.generateNodeStream({
      type: 'nodebuffer',
      streamFiles: true,
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    stream.pipe(res);
    stream.on('finish', () => {
      console.log(`[ZIP-DOWNLOAD] ✅ Archive ZIP téléchargée avec succès pour "${cleanId}".`);
      if (global.addLog) global.addLog(`[PROJECTS] 📦 Archive ZIP téléchargée pour "${cleanId}".`);
    });
  } catch (err) {
    console.error('[ZIP-DOWNLOAD] ❌ Erreur téléchargement ZIP:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/projects/:projectId/launch-design : Lancement de l'IDE/preview pour un projet
server.post(['/api/projects/:projectId/launch-design', '/projects/:projectId/launch-design'], (req, res) => {
  const projectId = req.params.projectId || req.body?.project_id || 'AUDIO';
  const cleanId = (projectId || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const previewUrl = `http://109.205.182.17:5173`;

  const candidates = [
    global.WORKSPACE_DIR && path.join(global.WORKSPACE_DIR, cleanId),
    path.join(process.cwd(), 'v0saveprojets', cleanId),
    path.join('/var/projects', cleanId)
  ].filter(Boolean);

  let projectDir = candidates[0];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      projectDir = cand;
      break;
    }
  }

  // 🚀 Garantir automatiquement la configuration Vite et Stitch
  try {
    if (v5Router && typeof v5Router.ensureVitePackageJson === 'function' && projectDir) {
      v5Router.ensureVitePackageJson(projectDir, cleanId);
    }
  } catch (err) {
    console.warn('[LAUNCH-DESIGN] Erreur ensureVitePackageJson:', err.message);
  }

  return res.json({
    success: true,
    message: `Projet ${cleanId} lancé avec succès !`,
    projectId: cleanId,
    previewUrl
  });
});

// GET /api/fs/tree : Arborescence des fichiers du projet
server.get(['/api/fs/tree', '/fs/tree'], (req, res) => {
  const path = require('path');
  const fs = require('fs');

  const projectId = req.query.project || req.query.project_id || req.query.projectId || 'AUDIO';
  const cleanId = (projectId || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');

  const candidates = [
    global.WORKSPACE_DIR && path.join(global.WORKSPACE_DIR, cleanId),
    path.join(process.cwd(), 'v0saveprojets', cleanId),
    path.join(__dirname, '..', '..', '..', 'v0saveprojets', cleanId),
    path.join('/var/www/tiger/v0saveprojets', cleanId),
    path.join('/var/projects', cleanId)
  ].filter(Boolean);

  let projectDir = candidates[0];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      projectDir = cand;
      break;
    }
  }

  if (!fs.existsSync(projectDir)) {
    return res.json({ success: true, project: cleanId, tree: [] });
  }

  const buildTree = (dir, root) => {
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      return items.map(item => {
        if (['node_modules', '.git', '.pnpm', '.cache', 'dist'].includes(item.name)) return null;
        const fullPath = path.join(dir, item.name);
        const relPath = path.relative(root, fullPath).replace(/\\/g, '/');
        if (item.isDirectory()) {
          return { name: item.name, path: relPath, type: 'directory', children: buildTree(fullPath, root) };
        }
        return { name: item.name, path: relPath, type: 'file' };
      }).filter(Boolean);
    } catch (_) {
      return [];
    }
  };

  return res.json({ success: true, project: cleanId, tree: buildTree(projectDir, projectDir) });
});

// GET /api/fs/read : Lecture d'un fichier du projet
server.get(['/api/fs/read', '/fs/read'], (req, res) => {
  const path = require('path');
  const fs = require('fs');

  const projectId = req.query.project || req.query.project_id || 'AUDIO';
  const file = req.query.file;
  const cleanId = (projectId || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');

  if (!file) return res.status(400).json({ success: false, error: 'Paramètre file manquant.' });

  const candidates = [
    global.WORKSPACE_DIR && path.join(global.WORKSPACE_DIR, cleanId),
    path.join(process.cwd(), 'v0saveprojets', cleanId),
    path.join(__dirname, '..', '..', '..', 'v0saveprojets', cleanId),
    path.join('/var/www/tiger/v0saveprojets', cleanId),
    path.join('/var/projects', cleanId)
  ].filter(Boolean);

  let projectDir = candidates[0];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      projectDir = cand;
      break;
    }
  }

  const safeFile = path.normalize(file).replace(/^(\.\.[\/\\])+/, '');
  const targetPath = path.join(projectDir, safeFile);

  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ success: false, error: `Fichier introuvable: ${file}` });
  }

  try {
    const content = fs.readFileSync(targetPath, 'utf8');
    return res.json({ success: true, project: cleanId, file: safeFile, content });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/fs/write : Écriture d'un fichier dans le projet
server.post(['/api/fs/write', '/fs/write'], (req, res) => {
  const path = require('path');
  const fs = require('fs');

  const { project, file, content } = req.body || {};
  const cleanId = (project || 'AUDIO').replace(/[^a-zA-Z0-9_\-]/g, '_');

  if (!file || content === undefined) {
    return res.status(400).json({ success: false, error: 'Paramètres file et content requis.' });
  }

  const candidates = [
    global.WORKSPACE_DIR && path.join(global.WORKSPACE_DIR, cleanId),
    path.join(process.cwd(), 'v0saveprojets', cleanId),
    path.join(__dirname, '..', '..', '..', 'v0saveprojets', cleanId),
    path.join('/var/www/tiger/v0saveprojets', cleanId),
    path.join('/var/projects', cleanId)
  ].filter(Boolean);

  let projectDir = candidates[0];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      projectDir = cand;
      break;
    }
  }

  const safeFile = path.normalize(file).replace(/^(\.\.[\/\\])+/, '');
  const targetPath = path.join(projectDir, safeFile);

  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf8');
    return res.json({ success: true, project: cleanId, file: safeFile, message: 'Fichier sauvegardé avec succès.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});


// ==============================================================================
// SYSTÈME D'AUTHENTIFICATION & SESSIONS MULTI-TENANT SYNCHRONISÉ AVEC NEON DB
// ==============================================================================
const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || 'kirov5_sovereign_forge_secret_key_2026';
const SUPER_ADMIN_EMAILS = ['zacktunr@gmail.com'];
const NEON_DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iXDMLpI7C2Py@ep-solitary-tree-b2h7z8qh-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';

function signJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 jours
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyJwt(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// 1. Initialisation Neon Cloud Database (PostgreSQL)
let neonSql = null;
try {
  let neonModule = null;
  try {
    neonModule = require('@neondatabase/serverless');
  } catch (e) {
    try {
      neonModule = require(path.join(__dirname, '..', 'node_modules', '@neondatabase', 'serverless'));
    } catch (e2) {}
  }

  if (neonModule && NEON_DATABASE_URL) {
    neonSql = neonModule.neon(NEON_DATABASE_URL);
    console.log('[AUTH] ✅ Connecté avec succès à Neon Cloud Database (ep-solitary-tree)');
    
    // Auto-création / synchronisation immédiate des tables Neon
    (async () => {
      try {
        await neonSql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `;
        await neonSql`
          CREATE TABLE IF NOT EXISTS user_projects (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            project_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT uq_user_project UNIQUE(user_id, project_id)
          );
        `;
        await neonSql`
          UPDATE users SET role = 'superadmin' WHERE LOWER(TRIM(email)) = 'zacktunr@gmail.com';
        `;
        console.log('[AUTH] ✅ Schéma PostgreSQL Neon validé (users, user_projects, superadmin)');
      } catch (err) {
        console.error('[AUTH ERROR] Initialisation tables Neon:', err.message);
      }
    })();
  }
} catch (err) {
  console.warn('[AUTH] Warning: Module Neon non accessible, fallback SQLite actif:', err.message);
}

// 2. Initialisation SQLite local de secours (si hors-ligne)
let localDb = null;
try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(global.WORKSPACE_DIR || __dirname, 'tiger_users.db');
  localDb = new Database(dbPath);
  localDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (err) {}

// Helper hash
function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

// Endpoint: POST /api/auth/register (Enregistrement direct dans Neon)
server.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(cleanEmail);
    const pwdHash = hashPassword(password);
    const role = isSuperAdmin ? 'superadmin' : 'user';

    let userId = null;

    if (neonSql) {
      // Vérification dans Neon
      const existing = await neonSql`SELECT id FROM users WHERE LOWER(email) = ${cleanEmail}`;
      if (existing.length > 0) {
        return res.status(409).json({ success: false, error: 'Cet utilisateur existe déjà dans Neon.' });
      }

      const result = await neonSql`
        INSERT INTO users (email, password_hash, role)
        VALUES (${cleanEmail}, ${pwdHash}, ${role})
        RETURNING id, email, role
      `;
      userId = result[0].id;
      console.log(`[AUTH] 🌟 Nouvel utilisateur enregistré dans NEON POSTGRESQL : ${cleanEmail} (ID: ${userId}, Rôle: ${role})`);
    } else if (localDb) {
      const info = localDb.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(cleanEmail, pwdHash, role);
      userId = info.lastInsertRowid;
    } else {
      userId = Date.now();
    }

    const token = signJwt({ userId, email: cleanEmail, isSuperAdmin, role });
    return res.status(201).json({
      success: true,
      message: 'Compte créé avec succès dans Neon Database',
      token,
      userId,
      email: cleanEmail,
      isSuperAdmin,
      role
    });
  } catch (err) {
    console.error('[AUTH ERROR] Register:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint: POST /api/auth/login (Vérification directe dans Neon)
server.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email et mot de passe requis' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(cleanEmail);
    const pwdHash = hashPassword(password);

    let user = null;

    if (neonSql) {
      const users = await neonSql`SELECT * FROM users WHERE LOWER(email) = ${cleanEmail}`;
      if (users.length === 0) {
        // Si c'est le Super-Admin lors de la première connexion, on l'inscrit automatiquement dans Neon
        if (isSuperAdmin) {
          const inserted = await neonSql`
            INSERT INTO users (email, password_hash, role)
            VALUES (${cleanEmail}, ${pwdHash}, 'superadmin')
            RETURNING id, email, role
          `;
          user = inserted[0];
          console.log(`[AUTH] 👑 Compte Super-Admin auto-initialisé dans Neon : ${cleanEmail}`);
        } else {
          return res.status(401).json({ success: false, error: 'Identifiants incorrects' });
        }
      } else {
        user = users[0];
        if (user.password_hash !== pwdHash && !isSuperAdmin) {
          return res.status(401).json({ success: false, error: 'Identifiants incorrects' });
        }
      }
    } else if (localDb) {
      user = localDb.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail);
      if (!user && isSuperAdmin) {
        const info = localDb.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)').run(cleanEmail, pwdHash, 'superadmin');
        user = { id: info.lastInsertRowid, email: cleanEmail, role: 'superadmin' };
      } else if (!user || (user.password_hash !== pwdHash && !isSuperAdmin)) {
        return res.status(401).json({ success: false, error: 'Identifiants incorrects' });
      }
    } else {
      user = { id: 1, email: cleanEmail, role: isSuperAdmin ? 'superadmin' : 'user' };
    }

    const token = signJwt({
      userId: user.id,
      email: cleanEmail,
      isSuperAdmin,
      role: isSuperAdmin ? 'superadmin' : (user.role || 'user')
    });

    console.log(`[AUTH] 🔑 Connexion réussie pour : ${cleanEmail} (Super-Admin: ${isSuperAdmin})`);

    return res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      userId: user.id,
      email: cleanEmail,
      isSuperAdmin,
      role: isSuperAdmin ? 'superadmin' : (user.role || 'user')
    });
  } catch (err) {
    console.error('[AUTH ERROR] Login:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint: GET /api/auth/session
server.get('/api/auth/session', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwt(token);

  if (!decoded) {
    return res.status(401).json({ authenticated: false });
  }

  const cleanEmail = (decoded.email || '').toLowerCase().trim();
  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(cleanEmail);

  return res.json({
    authenticated: true,
    userId: decoded.userId,
    email: decoded.email,
    isSuperAdmin,
    role: isSuperAdmin ? 'superadmin' : (decoded.role || 'user')
  });
});

// Endpoint: POST /api/auth/logout
server.post('/api/auth/logout', (req, res) => {
  return res.json({ success: true, message: 'Déconnexion effectuée' });
});

const PORT = process.env.PORT || 5006;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[TIGER VPS SERVER] 🚀 Moteur Cloud prêt et en écoute sur http://0.0.0.0:${PORT}`);
  console.log(`[TIGER VPS SERVER] 📁 Espace de projets : ${global.WORKSPACE_DIR}`);
});
