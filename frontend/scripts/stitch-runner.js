const path = require('path');
const fs = require('fs');

async function runStitchAutomation({ prompt, projectId, targetDir, extensionPath }) {
  console.log(`[STITCH RUNNER] 🎬 Démarrage du robot Stitch pour le projet ${projectId}...`);
  
  let puppeteer;
  try {
    puppeteer = require('puppeteer-core');
  } catch (e) {
    try {
      puppeteer = require('puppeteer');
    } catch (_) {
      console.warn('[STITCH RUNNER] Puppeteer non disponible, passage en mode API souveraine.');
      return { success: false, reason: 'PUPPETEER_NOT_INSTALLED' };
    }
  }

  const extPath = extensionPath || path.resolve(__dirname, '../v0-moteur-electron/electron/extension');
  const userDataDir = path.resolve(__dirname, '../.stitch-chrome-profile');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeBin = process.env.CHROME_BIN || (fs.existsSync('/usr/bin/chromium-browser') ? '/usr/bin/chromium-browser' : '/usr/bin/chromium');

  try {
    const browser = await puppeteer.launch({
      executablePath: chromeBin,
      headless: false, // Tourne dans l'écran virtuel Xvfb (DISPLAY=:99)
      userDataDir,
      args: [
        `--disable-extensions-except=${extPath}`,
        `--load-extension=${extPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('[STITCH RUNNER] 🌐 Connexion à https://stitch.withgoogle.com...');
    await page.goto('https://stitch.withgoogle.com', { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('[STITCH RUNNER] ✅ Session Stitch active. L\'extension KIROV5 pilote la génération.');
    return { success: true, browserPid: browser.process()?.pid };
  } catch (err) {
    console.error('[STITCH RUNNER] ❌ Erreur lancement robot Stitch:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { runStitchAutomation };
