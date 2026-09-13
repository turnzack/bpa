'use strict';

/**
 * PublicBundleProvider.js
 * Télécharge et vérifie la méthodologie depuis le CDN Vercel public (OTA).
 * Implémente un cache en mémoire pour éviter les téléchargements répétés.
 * Fallback automatique vers LocalBundleProvider si le réseau est indisponible.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const KnowledgeProvider = require('./KnowledgeProvider');
const { KnowledgeErrors } = require('./KnowledgeErrors');

const PUBLIC_METHODOLOGY_URL = 'https://v0-reponse-git-main-v01-e951.vercel.app/methodology';
const PUBLIC_KEY_PATH = path.join(__dirname, '..', '..', '..', 'mcp', 'servers', 'creator_public.pem');

// Cache persistant sur disque : %LOCALAPPDATA%\Kirov5\methodology\
const DISK_CACHE_ROOT = path.join(
  process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
  'Kirov5',
  'methodology'
);

/** Cache en mémoire (session Electron) */
const _memCache = {
  manifest: null,
  checksums: null,
  files: {},
};

function verifySignature(manifestStr, signatureBase64, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(manifestStr);
  verify.end();
  return verify.verify(publicKey, signatureBase64, 'base64');
}

class PublicBundleProvider extends KnowledgeProvider {
  constructor() {
    super();
  }

  /** Chemin du cache disque pour une version donnée */
  _diskCachePath(version) {
    return path.join(DISK_CACHE_ROOT, version || 'current');
  }

  /** Persiste un fichier dans le cache disque */
  _writeToDiskCache(version, relativePath, content) {
    try {
      const dest = path.join(this._diskCachePath(version), relativePath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, content, 'utf8');
    } catch { /* cache disk non critique */ }
  }

  async _fetchManifest() {
    if (_memCache.manifest) return _memCache.manifest;

    if (!fs.existsSync(PUBLIC_KEY_PATH)) {
      throw KnowledgeErrors.PROVIDER_UNAVAILABLE('manifest.json (clé publique manquante)');
    }
    const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');

    let manifest;
    try {
      const res = await fetch(`${PUBLIC_METHODOLOGY_URL}/manifest.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      manifest = await res.json();
    } catch (e) {
      throw KnowledgeErrors.PROVIDER_UNAVAILABLE(`manifest.json (réseau: ${e.message})`);
    }

    const signature = manifest.signature;
    const rawManifest = { ...manifest };
    delete rawManifest.signature;

    const isValid = verifySignature(JSON.stringify(rawManifest), signature, publicKey);
    if (!isValid) {
      throw KnowledgeErrors.SIGNATURE_INVALID('manifest.json');
    }

    _memCache.manifest = manifest;
    // Persister le manifest sur le disque
    this._writeToDiskCache(manifest.version, 'manifest.json', JSON.stringify(manifest));
    return manifest;
  }

  async _fetchChecksums() {
    if (_memCache.checksums) return _memCache.checksums;

    const manifest = await this._fetchManifest();
    let checksumsText;
    try {
      const res = await fetch(`${PUBLIC_METHODOLOGY_URL}/checksums.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      checksumsText = await res.text();
    } catch (e) {
      throw KnowledgeErrors.PROVIDER_UNAVAILABLE(`checksums.json (réseau: ${e.message})`);
    }

    const computedHash = crypto.createHash('sha256').update(checksumsText).digest('hex');
    if (manifest.checksumsHash && computedHash !== manifest.checksumsHash) {
      throw KnowledgeErrors.HASH_MISMATCH('checksums.json', manifest.checksumsHash, computedHash);
    }

    _memCache.checksums = JSON.parse(checksumsText);
    // Persister le checksums.json sur le disque
    const manifest2 = await this._fetchManifest();
    this._writeToDiskCache(manifest2.version, 'checksums.json', checksumsText);
    return _memCache.checksums;
  }

  async getMethodology(pathname) {
    if (!pathname || typeof pathname !== 'string') {
      throw KnowledgeErrors.RESOURCE_NOT_FOUND(pathname);
    }

    const normalizedKey = pathname.replace(/\\/g, '/');

    if (_cache.files[normalizedKey]) {
      return _cache.files[normalizedKey];
    }

    const manifest = await this._fetchManifest();
    const checksums = await this._fetchChecksums();

    if (!checksums[normalizedKey]) {
      throw KnowledgeErrors.RESOURCE_NOT_FOUND(normalizedKey);
    }

    let content;
    try {
      const res = await fetch(`${PUBLIC_METHODOLOGY_URL}/${normalizedKey}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      content = await res.text();
    } catch (e) {
      throw KnowledgeErrors.PROVIDER_UNAVAILABLE(`${normalizedKey} (réseau: ${e.message})`);
    }

    const computedHash = crypto.createHash('sha256').update(content).digest('hex');
    if (computedHash !== checksums[normalizedKey]) {
      throw KnowledgeErrors.HASH_MISMATCH(normalizedKey, checksums[normalizedKey], computedHash);
    }

    const result = {
      content,
      version: manifest.version || 'unknown',
      hash: computedHash,
      source: 'public_vercel_bundle',
      verified: true,
      signatureVerified: true,
      artifactsVerified: true,
      manifestHash: manifest.checksumsHash || '',
    };

    _memCache.files[normalizedKey] = result;
    // Persister le fichier dans le cache disque (pour fallback offline)
    this._writeToDiskCache(manifest.version, normalizedKey, content);
    return result;
  }

  async isAvailable() {
    try {
      await this._fetchManifest();
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = PublicBundleProvider;
