'use strict';
/**
 * TIGER-044 — Serveur MCP knowledge-provider
 * mcp/servers/knowledge-provider.js
 *
 * Outils : get_methodology
 * Télécharge le bundle OTA signé de la méthodologie depuis Vercel.
 * Vérifie l'intégrité cryptographique avant d'autoriser Hermes à lire les prompts.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// URL publique du bundle de méthodologie
// Dans un environnement de prod, on met l'URL Vercel. Pour le test local, on peut utiliser le serveur Vite ou l'URL de prod Vercel.
const PUBLIC_METHODOLOGY_URL = 'https://v0-reponse-git-main-v01-e951.vercel.app/methodology';

// Clé publique embarquée dans le client pour vérifier la signature
const PUBLIC_KEY_PATH = path.join(__dirname, 'creator_public.pem');

// Cache en mémoire
let cachedManifest = null;
let cachedFiles = {};

function verifySignature(manifestStr, signatureBase64, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(manifestStr);
  verify.end();
  return verify.verify(publicKey, signatureBase64, 'base64');
}

const SERVER = {
  name:        'knowledge-provider',
  description: 'Fournisseur de connaissances OTA sécurisé (Télécharge et vérifie la méthodologie)',

  getTools() {
    return [
      { 
        name: 'get_methodology',  
        description: 'Récupère un prompt ou une règle de méthodologie validée (ex: "prompts/mega-prompt.md")', 
        schema: { filePath: 'string' } 
      },
    ];
  },

  async invoke(toolName, args) {
    if (toolName !== 'get_methodology') throw new Error(`Outil inconnu : ${toolName}`);

    const { filePath } = args;
    if (!filePath) throw new Error('filePath requis (ex: prompts/mega-prompt.md).');

    // 1. Lire la clé publique locale
    if (!fs.existsSync(PUBLIC_KEY_PATH)) {
      throw new Error("Erreur de sécurité : Clé publique manquante dans l'application.");
    }
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');

    try {
      // 2. Télécharger et vérifier le manifest si pas en cache
      if (!cachedManifest) {
        console.log(`[MCP] Téléchargement du manifest depuis ${PUBLIC_METHODOLOGY_URL}/manifest.json`);
        const manifestRes = await fetch(`${PUBLIC_METHODOLOGY_URL}/manifest.json`);
        if (!manifestRes.ok) throw new Error("METHODOLOGY_UNAVAILABLE");
        
        const manifest = await manifestRes.json();
        const signature = manifest.signature;
        
        // Retirer la signature du manifest pour calculer le hash originel
        const rawManifest = { ...manifest };
        delete rawManifest.signature;
        
        const isValid = verifySignature(JSON.stringify(rawManifest), signature, publicKey);
        if (!isValid) {
          throw new Error("VIOLATION DE SÉCURITÉ : La signature du manifest est invalide ou corrompue !");
        }
        
        console.log(`[MCP] ✅ Signature OTA validée (Version ${manifest.version})`);
        cachedManifest = manifest;
      }

      // 3. Télécharger les checksums
      if (!cachedFiles['checksums.json']) {
        const checkRes = await fetch(`${PUBLIC_METHODOLOGY_URL}/checksums.json`);
        if (!checkRes.ok) throw new Error("CHECKSUMS_UNAVAILABLE");
        
        const checksumsText = await checkRes.text();
        // Vérifier le hash du checksums.json
        const hash = crypto.createHash('sha256').update(checksumsText).digest('hex');
        if (hash !== cachedManifest.checksumsHash) {
          throw new Error("VIOLATION DE SÉCURITÉ : Le fichier checksums.json a été altéré !");
        }
        
        cachedFiles['checksums.json'] = JSON.parse(checksumsText);
      }

      // 4. Vérifier si le fichier demandé existe dans le bundle
      const checksums = cachedFiles['checksums.json'];
      if (!checksums[filePath]) {
        throw new Error(`Fichier introuvable dans la méthodologie : ${filePath}`);
      }

      // 5. Télécharger et vérifier le fichier
      if (!cachedFiles[filePath]) {
        console.log(`[MCP] Téléchargement sécurisé : ${filePath}`);
        const fileRes = await fetch(`${PUBLIC_METHODOLOGY_URL}/${filePath}`);
        if (!fileRes.ok) throw new Error(`Impossible de télécharger ${filePath}`);
        
        const content = await fileRes.text(); // ou arrayBuffer pour du binaire
        const fileHash = crypto.createHash('sha256').update(content).digest('hex');
        
        if (fileHash !== checksums[filePath]) {
          throw new Error(`VIOLATION DE SÉCURITÉ : Le fichier ${filePath} a été corrompu ou altéré !`);
        }
        
        cachedFiles[filePath] = content;
      }

      return { 
        success: true, 
        version: cachedManifest.version,
        content: cachedFiles[filePath] 
      };

    } catch (e) {
      throw new Error(`Erreur Knowledge Provider: ${e.message}`);
    }
  },
};

module.exports = SERVER;
