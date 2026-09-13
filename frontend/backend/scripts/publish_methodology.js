const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const PRIVATE_KEY_PATH = path.join(__dirname, 'creator_private.pem');
const INPUT_DIR = path.join(__dirname, '..', '..', 'v0-guest', 'methodology_source'); // Dossier où le créateur travaille sa méthodologie
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'v0-interface-versel', 'public', 'methodology');

function calculateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function signManifest(manifestStr, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(manifestStr);
  sign.end();
  return sign.sign(privateKey, 'base64');
}

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

function publish() {
  console.log("🚀 Démarrage de la publication de la méthodologie (OTA)...");

  if (!fs.existsSync(PRIVATE_KEY_PATH)) {
    console.error(`❌ ERREUR : Clé privée introuvable (${PRIVATE_KEY_PATH}). Exécutez generate_keys.js d'abord.`);
    process.exit(1);
  }

  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

  // 1. Préparer les dossiers
  if (!fs.existsSync(INPUT_DIR)) {
    console.log(`Création du dossier source de méthodologie : ${INPUT_DIR}`);
    fs.mkdirSync(path.join(INPUT_DIR, 'prompts'), { recursive: true });
    fs.mkdirSync(path.join(INPUT_DIR, 'schemas'), { recursive: true });
    fs.mkdirSync(path.join(INPUT_DIR, 'policies'), { recursive: true });
    fs.writeFileSync(path.join(INPUT_DIR, 'prompts', 'mega-prompt.md'), '# Mega Prompt Kirov5\n\nTu es un expert React...');
  }

  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 2. Copier les fichiers et générer les checksums
  const files = walkSync(INPUT_DIR);
  const checksums = {};

  files.forEach(file => {
    const relPath = path.relative(INPUT_DIR, file).replace(/\\/g, '/');
    const destPath = path.join(OUTPUT_DIR, relPath);
    
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(file, destPath);
    
    const content = fs.readFileSync(file);
    checksums[relPath] = calculateHash(content);
  });

  // Sauvegarder checksums.json
  fs.writeFileSync(path.join(OUTPUT_DIR, 'checksums.json'), JSON.stringify(checksums, null, 2));

  // 3. Générer et signer le manifest.json
  const rawManifest = {
    version: "14.2.0",
    engineMinimumVersion: "0.10.0",
    keyId: "kirov5-methodology",
    checksumsHash: calculateHash(JSON.stringify(checksums)),
    publishedAt: new Date().toISOString()
  };

  const signature = signManifest(JSON.stringify(rawManifest), privateKey);

  const finalManifest = {
    ...rawManifest,
    signature: signature
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(finalManifest, null, 2));

  console.log(`✅ Méthodologie publiée avec succès dans ${OUTPUT_DIR}`);
  console.log(`🔒 Signature cryptographique : ${signature.substring(0, 32)}...`);
  console.log(`👉 Vercel distribuera désormais ce bundle signé OTA.`);
}

publish();
