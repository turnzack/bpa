const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log("Génération des clés RSA pour la signature OTA Kirov5...");

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Clé privée (Gardée secrète par le créateur)
const privateKeyPath = path.join(__dirname, 'creator_private.pem');
fs.writeFileSync(privateKeyPath, privateKey);
console.log(`✅ Clé privée générée : ${privateKeyPath}`);
console.log(`⚠️ ATTENTION : Ne JAMAIS commiter ce fichier !`);

// Clé publique (Embarquée dans le .exe pour vérifier la signature)
const publicKeyPath = path.join(__dirname, '..', 'mcp', 'servers', 'creator_public.pem');
fs.writeFileSync(publicKeyPath, publicKey);
console.log(`✅ Clé publique générée : ${publicKeyPath}`);
console.log(`Cette clé sera lue par knowledge-provider.js`);
