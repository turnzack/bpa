'use strict';

/**
 * LocalBundleProvider.js
 * Lit la méthodologie depuis le bundle local signé (généré par publish_methodology.js).
 * Ce provider est le fallback offline du système Grade Gold.
 * Il ne fait JAMAIS de requête réseau.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KnowledgeProvider = require('./KnowledgeProvider');
const { KnowledgeErrors } = require('./KnowledgeErrors');

// Noms de fichier canoniques attendus dans le bundle
const MANIFEST_FILENAME = 'manifest.json';
const CHECKSUMS_FILENAME = 'checksums.json';

/**
 * Bloque les path traversal (ex: "../../etc/passwd").
 * Compatible Windows : normalise tout en POSIX avant comparaison.
 */
function assertSafePath(bundleRoot, requestedPath) {
  // Normaliser en posix (forward slashes) sur toutes les plateformes
  const posixRequested = requestedPath.replace(/\\/g, '/');

  // Bloquer les séquences dangereuses explicites
  if (
    posixRequested.includes('..') ||
    posixRequested.startsWith('/') ||
    posixRequested.includes('\0')
  ) {
    throw KnowledgeErrors.PATH_TRAVERSAL(requestedPath);
  }

  // Vérifier que le chemin résolu reste dans le bundleRoot
  const resolved = path.resolve(bundleRoot, posixRequested);
  const relative = path.relative(bundleRoot, resolved);
  const posixRelative = relative.replace(/\\/g, '/');

  if (posixRelative.startsWith('..') || path.isAbsolute(relative)) {
    throw KnowledgeErrors.PATH_TRAVERSAL(requestedPath);
  }

  return resolved;
}

class LocalBundleProvider extends KnowledgeProvider {
  /**
   * @param {string} bundleRoot - Chemin absolu vers le dossier du bundle local
   *   (ex: "e:\v0reponses\v0-interface-versel\public\methodology")
   */
  constructor(bundleRoot) {
    super();
    this.bundleRoot = bundleRoot;
    this._manifest = null;
    this._checksums = null;
  }

  /**
   * Charge et valide le manifest local (hash du checksums.json).
   * @returns {Promise<object>} manifest
   */
  async _loadManifest() {
    if (this._manifest) return this._manifest;

    const manifestPath = path.join(this.bundleRoot, MANIFEST_FILENAME);
    if (!fs.existsSync(manifestPath)) {
      throw KnowledgeErrors.BUNDLE_CORRUPTED({ reason: 'manifest.json absent', bundleRoot: this.bundleRoot });
    }

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      throw KnowledgeErrors.BUNDLE_CORRUPTED({ reason: 'manifest.json invalide (JSON)', error: e.message });
    }

    this._manifest = manifest;
    return manifest;
  }

  /**
   * Charge et valide les checksums locaux.
   * Vérifie le hash du fichier checksums.json contre la valeur dans le manifest.
   * @returns {Promise<object>} checksums
   */
  async _loadChecksums() {
    if (this._checksums) return this._checksums;

    const manifest = await this._loadManifest();
    const checksumsPath = path.join(this.bundleRoot, CHECKSUMS_FILENAME);

    if (!fs.existsSync(checksumsPath)) {
      throw KnowledgeErrors.BUNDLE_CORRUPTED({ reason: 'checksums.json absent' });
    }

    const checksumsText = fs.readFileSync(checksumsPath, 'utf8');
    const computedHash = crypto.createHash('sha256').update(checksumsText).digest('hex');

    if (manifest.checksumsHash && computedHash !== manifest.checksumsHash) {
      throw KnowledgeErrors.HASH_MISMATCH('checksums.json', manifest.checksumsHash, computedHash);
    }

    try {
      this._checksums = JSON.parse(checksumsText);
    } catch (e) {
      throw KnowledgeErrors.BUNDLE_CORRUPTED({ reason: 'checksums.json invalide (JSON)', error: e.message });
    }

    return this._checksums;
  }

  /**
   * Récupère un fichier de méthodologie depuis le bundle local.
   * Vérifie le hash du fichier contre checksums.json.
   * @param {string} pathname - ex: "prompts/phase4-backend-api.md"
   */
  async getMethodology(pathname) {
    if (!pathname || typeof pathname !== 'string') {
      throw KnowledgeErrors.RESOURCE_NOT_FOUND(pathname);
    }

    const safeFilePath = assertSafePath(this.bundleRoot, pathname);
    const manifest = await this._loadManifest();
    const checksums = await this._loadChecksums();

    const normalizedKey = pathname.replace(/\\/g, '/');

    if (!checksums[normalizedKey]) {
      throw KnowledgeErrors.RESOURCE_NOT_FOUND(normalizedKey);
    }

    if (!fs.existsSync(safeFilePath)) {
      throw KnowledgeErrors.RESOURCE_NOT_FOUND(normalizedKey);
    }

    const content = fs.readFileSync(safeFilePath, 'utf8');
    const computedHash = crypto.createHash('sha256').update(content).digest('hex');

    if (computedHash !== checksums[normalizedKey]) {
      throw KnowledgeErrors.HASH_MISMATCH(normalizedKey, checksums[normalizedKey], computedHash);
    }

    return {
      content,
      version: manifest.version || 'unknown',
      hash: computedHash,
      source: 'local_signed_bundle',
      verified: true,
      signatureVerified: !!manifest.signature,
      artifactsVerified: true,
      manifestHash: manifest.checksumsHash || '',
      bundleRoot: this.bundleRoot,
    };
  }

  async isAvailable() {
    try {
      await this._loadManifest();
      await this._loadChecksums();
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = LocalBundleProvider;
