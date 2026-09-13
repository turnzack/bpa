'use strict';

/**
 * KnowledgeProvider.test.js
 * Tests du système KnowledgeProvider Grade Gold.
 * Exécuter avec : node KnowledgeProvider.test.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert');

const LocalBundleProvider = require('./LocalBundleProvider');
const { resolveMethodologyResources, buildContextBlock } = require('./MethodologyResolver');
const { KnowledgeErrors } = require('./KnowledgeErrors');

// === FIXTURE SETUP ===
const FIXTURE_DIR = path.join(__dirname, '__test_fixtures__');
const FIXTURE_VERSION = '14.2.0';
const FIXTURE_FILE_PATH = 'prompts/phase4-backend-api.md';
const FIXTURE_FILE_CONTENT = '# Phase 4 Backend API\nContenu de test pour validation.';

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function setupFixtureBundle() {
  fs.mkdirSync(path.join(FIXTURE_DIR, 'prompts'), { recursive: true });
  fs.mkdirSync(path.join(FIXTURE_DIR, 'policies'), { recursive: true });

  // Écrire un fichier de méthodologie
  fs.writeFileSync(path.join(FIXTURE_DIR, FIXTURE_FILE_PATH), FIXTURE_FILE_CONTENT, 'utf8');

  // Générer le checksums.json
  const fileHash = sha256(FIXTURE_FILE_CONTENT);
  const checksums = { [FIXTURE_FILE_PATH]: fileHash };
  const checksumsText = JSON.stringify(checksums);
  fs.writeFileSync(path.join(FIXTURE_DIR, 'checksums.json'), checksumsText, 'utf8');

  // Générer le manifest.json
  const checksumsHash = sha256(checksumsText);
  const manifest = {
    version: FIXTURE_VERSION,
    generatedAt: new Date().toISOString(),
    checksumsHash,
    // Pas de signature RSA dans les fixtures (test local)
  };
  fs.writeFileSync(path.join(FIXTURE_DIR, 'manifest.json'), JSON.stringify(manifest), 'utf8');

  return { fileHash, checksumsHash };
}

function teardownFixtureBundle() {
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true });
}

// === TESTS ===

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${e.message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n=== Tests KnowledgeProvider Grade Gold ===\n');

  // Setup
  setupFixtureBundle();
  const provider = new LocalBundleProvider(FIXTURE_DIR);

  // --- TESTS POSITIFS ---
  console.log('📦 Tests LocalBundleProvider — Cas positifs');

  await test('Méthodologie signée chargée avec succès', async () => {
    const result = await provider.getMethodology(FIXTURE_FILE_PATH);
    assert.equal(result.verified, true);
    assert.equal(result.version, FIXTURE_VERSION);
    assert.equal(result.source, 'local_signed_bundle');
    assert.equal(result.content, FIXTURE_FILE_CONTENT);
    assert.equal(result.artifactsVerified, true);
    assert.equal(typeof result.manifestHash, 'string');
    assert.equal(typeof result.hash, 'string');
  });

  await test('Hash du fichier correct', async () => {
    const result = await provider.getMethodology(FIXTURE_FILE_PATH);
    assert.equal(result.hash, sha256(FIXTURE_FILE_CONTENT));
  });

  await test('isAvailable() retourne true si bundle valide', async () => {
    const available = await provider.isAvailable();
    assert.equal(available, true);
  });

  // --- TESTS NÉGATIFS ---
  console.log('\n🔴 Tests LocalBundleProvider — Cas négatifs');

  await test('Fichier absent → KNOWLEDGE_RESOURCE_NOT_FOUND', async () => {
    try {
      await provider.getMethodology('prompts/inexistant.md');
      assert.fail('Devait lancer une erreur');
    } catch (e) {
      assert.equal(e.code, 'KNOWLEDGE_RESOURCE_NOT_FOUND');
    }
  });

  await test('Path traversal bloqué → KNOWLEDGE_PATH_TRAVERSAL', async () => {
    try {
      await provider.getMethodology('../../etc/passwd');
      assert.fail('Devait lancer une erreur');
    } catch (e) {
      assert.equal(e.code, 'KNOWLEDGE_PATH_TRAVERSAL');
    }
  });

  await test('Hash incorrect → KNOWLEDGE_HASH_MISMATCH', async () => {
    // Corrompre le fichier
    const filePath = path.join(FIXTURE_DIR, FIXTURE_FILE_PATH);
    fs.writeFileSync(filePath, 'CONTENU CORROMPU', 'utf8');
    try {
      // Réinitialiser le cache
      const freshProvider = new LocalBundleProvider(FIXTURE_DIR);
      await freshProvider.getMethodology(FIXTURE_FILE_PATH);
      assert.fail('Devait lancer une erreur');
    } catch (e) {
      assert.equal(e.code, 'KNOWLEDGE_HASH_MISMATCH');
    } finally {
      // Restaurer le fichier
      fs.writeFileSync(filePath, FIXTURE_FILE_CONTENT, 'utf8');
    }
  });

  await test('Bundle corrompu (manifest absent) → KNOWLEDGE_BUNDLE_CORRUPTED', async () => {
    const emptyDir = path.join(FIXTURE_DIR, 'empty_bundle');
    fs.mkdirSync(emptyDir, { recursive: true });
    try {
      const badProvider = new LocalBundleProvider(emptyDir);
      await badProvider.getMethodology(FIXTURE_FILE_PATH);
      assert.fail('Devait lancer une erreur');
    } catch (e) {
      assert.equal(e.code, 'KNOWLEDGE_BUNDLE_CORRUPTED');
    } finally {
      fs.rmSync(emptyDir, { recursive: true, force: true });
    }
  });

  // --- TESTS MethodologyResolver ---
  console.log('\n🗺️  Tests MethodologyResolver');

  await test('Phase wiring → prompts/phase4-backend-api.md', () => {
    const { primary } = resolveMethodologyResources('wiring');
    assert.equal(primary, 'prompts/phase4-backend-api.md');
  });

  await test('Phase ui-update → prompts/phase3-ui-ux.md', () => {
    const { primary } = resolveMethodologyResources('ui-update');
    assert.equal(primary, 'prompts/phase3-ui-ux.md');
  });

  await test('Phase default → policies/coding-standards.md', () => {
    const { primary } = resolveMethodologyResources('default');
    assert.equal(primary, 'policies/coding-standards.md');
  });

  await test('buildContextBlock contient la version, le hash et la directive ABSOLUE', () => {
    const fakeCtx = {
      methodologySource: 'local_signed_bundle',
      methodologyResource: 'prompts/phase4-backend-api.md',
      methodologyVersion: '14.2.0',
      methodologyHash: 'abc123',
      manifestHash: 'def789',
      signatureVerified: false,
      artifactsVerified: true,
      contextHash: 'def456',
      verified: true,
      methodologyContent: 'Contenu de test',
      policyContent: 'Politique de test',
    };
    const block = buildContextBlock(fakeCtx);
    assert.match(block, /14\.2\.0/);
    assert.match(block, /abc123/);
    assert.match(block, /KIROV5 GRADE GOLD/);
    assert.match(block, /Contenu de test/);
    assert.match(block, /DIRECTIVE ABSOLUE/);
    assert.match(block, /Tu ne dois PAS appeler un outil MCP/);
    assert.match(block, /Politique de test/);
  });

  // Teardown
  teardownFixtureBundle();

  // Résumé
  console.log(`\n=== Résultats : ${passed} ✅ passés, ${failed} ❌ échoués ===\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Erreur fatale dans les tests :', e);
  process.exit(1);
});
