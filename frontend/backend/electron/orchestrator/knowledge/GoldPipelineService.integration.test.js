'use strict';

/**
 * GoldPipelineService.integration.test.js
 * Tests d'intégration de GoldPipelineService.
 *
 * Vérifie que :
 * 1. Le pipeline retourne { status: "blocked", mutationsStarted: false }
 *    quand le KnowledgeProvider est indisponible.
 * 2. Le prompt Hermes reçoit bien le contenu de la méthodologie (injection réelle).
 * 3. Le pipeline ne démarre aucune mutation si le provider échoue.
 *
 * Stratégie : On remplace (monkey-patch) le module MethodologyResolver
 * pour injecter des providers contrôlés — sans toucher au réseau ni au disque.
 *
 * Exécution : node GoldPipelineService.integration.test.js
 */

const assert = require('assert');
const path = require('path');
const Module = require('module');

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

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
    if (process.env.VERBOSE) console.error(e.stack);
    failed++;
  }
}

/**
 * Remplace temporairement le module MethodologyResolver par un mock,
 * puis restaure le registre après le test.
 *
 * @param {object} mockExports - Exports de remplacement
 * @param {Function} fn - Fonction de test à exécuter
 */
async function withMockedResolver(mockExports, fn) {
  const resolverPath = require.resolve(
    './MethodologyResolver'
  );

  const original = require.cache[resolverPath];

  require.cache[resolverPath] = {
    id: resolverPath,
    filename: resolverPath,
    loaded: true,
    exports: mockExports,
  };

  const servicePath = require.resolve('../GoldPipelineService');
  delete require.cache[servicePath];

  try {
    await fn();
  } finally {
    if (original) {
      require.cache[resolverPath] = original;
    } else {
      delete require.cache[resolverPath];
    }
    delete require.cache[servicePath];
  }
}

// ──────────────────────────────────────────────
// Fixtures minimales
// ──────────────────────────────────────────────

const FIXTURE_PROJECT_ID = 'integration_test_project';
const FIXTURE_METHODOLOGY = 'CODING_STANDARD_FIXTURE_v14.2.0';
const FIXTURE_CONTEXT_BLOCK = `
=== KIROV5 GRADE GOLD — CONTEXTE MÉTHODOLOGIQUE VÉRIFIÉ ===
Source    : local_signed_bundle
Version   : 14.2.0
Hash      : abc123
Vérifié   : OUI

❗ DIRECTIVE ABSOLUE :
${FIXTURE_METHODOLOGY}
=== FIN DU CONTEXTE ===
`;

/**
 * Crée une instance minimale de GoldPipelineService avec des dépendances stubées
 * pour éviter de toucher au vrai réseau, Playwright, better-sqlite3, etc.
 */
function buildMockService() {
  const { GoldPipelineService } = require('../GoldPipelineService');

  let capturedPrompt = null;

  const hermesClientPath = require.resolve('../hermes-client');
  const originalHermes = require.cache[hermesClientPath];

  require.cache[hermesClientPath] = {
    id: hermesClientPath,
    filename: hermesClientPath,
    loaded: true,
    exports: {
      decide: async ({ state }) => {
        capturedPrompt = state.systemPrompt || '';
        // Retourner un plan valide minimal (format wiring)
        return {
          content: JSON.stringify({
            status: 'plan_ready',
            compliance: { designPreserved: true, cssChanges: false, classNameChanges: false },
            files: [],
            bindings: [],
            violations: [],
          })
        };
      }
    }
  };

  // Stub projectOrchestrator — exécute le callback generate pour simuler le pipeline
  const mockOrchestrator = {
    runProject: async (batches, callbacks) => {
      // Simuler le passage sur un batch wiring
      if (callbacks && callbacks.generate) {
        const result = await callbacks.generate({ phase: 'wiring', id: 'batch-wiring-1' });
        if (result && result.status === 'blocked') {
          return result; // Faire remonter le blocage
        }
      }
      return { status: 'ready' };
    }
  };

  // Stub tous les managers/validators optionnels
  const service = new GoldPipelineService({
    projectStore: null,
    manifestStore: null,
    blueprintBuilder: null,
    batchPlanner: null,
    projectOrchestrator: mockOrchestrator,
    previewManager: null,
    lockManager: null,
  });

  // Patcher run() pour bypass assertGoldRuntime (Playwright/Chromium non disponibles en test)
  const originalRun = service.run.bind(service);
  service.run = async (opts) => originalRun({ ...opts, pipelineMode: 'standard' });

  return { service, getPrompt: () => capturedPrompt, restoreHermes: () => {
    if (originalHermes) require.cache[hermesClientPath] = originalHermes;
    else delete require.cache[hermesClientPath];
  }};
}

// ──────────────────────────────────────────────
// TESTS
// ──────────────────────────────────────────────

async function runTests() {
  console.log('\n=== Tests Intégration GoldPipelineService ===\n');

  // ─── GROUPE 1 : Blocage sans méthodologie ───
  console.log('🚫 Blocage sans KnowledgeProvider');

  await test('Pipeline retourne { status: "blocked" } si provider UNAVAILABLE', async () => {
    const UNAVAILABLE_RESOLVER = {
      resolveGenerationContext: async () => {
        throw Object.assign(
          new Error('No methodology available'),
          { code: 'KNOWLEDGE_PROVIDER_UNAVAILABLE' }
        );
      },
      buildContextBlock: () => '',
    };

    await withMockedResolver(UNAVAILABLE_RESOLVER, async () => {
      const { service, restoreHermes } = buildMockService();
      try {
        const result = await service.run({
          projectId: FIXTURE_PROJECT_ID,
          projectRoot: 'E:\\v0reponses\\v0-moteur-electron\\v0saveprojets\\' + FIXTURE_PROJECT_ID,
          source: 'zip',
          userPrompt: 'Test de blocage',
          files: [],
        });

        // Le pipeline DOIT retourner blocked si le provider échoue
        assert.equal(result.status, 'blocked',
          `Attendu status="blocked", reçu "${result.status}"`);
        assert.equal(result.mutationsStarted, false,
          'mutationsStarted doit être false');
        assert.ok(
          result.code === 'KNOWLEDGE_PROVIDER_UNAVAILABLE' ||
          result.code === 'PIPELINE_FAILED',
          `Code inattendu: ${result.code}`
        );
      } finally {
        restoreHermes();
      }
    });
  });

  await test('Pipeline ne démarre aucune mutation si provider absent', async () => {
    let mutationAttempted = false;

    const UNAVAILABLE_RESOLVER = {
      resolveGenerationContext: async () => {
        throw Object.assign(
          new Error('Provider absent'),
          { code: 'KNOWLEDGE_PROVIDER_UNAVAILABLE' }
        );
      },
      buildContextBlock: () => '',
    };

    await withMockedResolver(UNAVAILABLE_RESOLVER, async () => {
      const servicePath = require.resolve('../GoldPipelineService');
      delete require.cache[servicePath];

      // Stub ArtifactWriter pour détecter toute tentative d'écriture
      const artifactPath = require.resolve('../ArtifactWriter');
      const origArtifact = require.cache[artifactPath];
      require.cache[artifactPath] = {
        id: artifactPath, filename: artifactPath, loaded: true,
        exports: {
          write: async () => { mutationAttempted = true; throw new Error('NO_WRITES_ALLOWED'); }
        }
      };

      const { service, restoreHermes } = buildMockService();
      try {
        await service.run({
          projectId: FIXTURE_PROJECT_ID,
          projectRoot: 'fixture_root',
          source: 'zip', userPrompt: 'Test', files: [],
        });
      } catch { /* expected */ }

      assert.equal(mutationAttempted, false,
        'Aucune écriture ne doit être tentée quand le provider est absent');

      restoreHermes();
      if (origArtifact) require.cache[artifactPath] = origArtifact;
      else delete require.cache[artifactPath];
    });
  });

  // ─── GROUPE 2 : Injection réelle de la méthodologie ───
  console.log('\n💉 Injection de la méthodologie dans le prompt Hermes');

  await test('Le prompt Hermes contient le contexte méthodologique injecté', async () => {
    const WORKING_RESOLVER = {
      resolveGenerationContext: async ({ phase }) => ({
        phase,
        projectId: FIXTURE_PROJECT_ID,
        methodologyResource: 'prompts/phase4-backend-api.md',
        methodologyContent: FIXTURE_METHODOLOGY,
        methodologyVersion: '14.2.0',
        methodologyHash: 'abc123',
        manifestHash: 'def456',
        signatureVerified: true,
        artifactsVerified: true,
        methodologySource: 'local_signed_bundle',
        policyContent: '',
        contextHash: 'ghi789',
        verified: true,
      }),
      buildContextBlock: (ctx) => FIXTURE_CONTEXT_BLOCK,
    };

    await withMockedResolver(WORKING_RESOLVER, async () => {
      const { service, getPrompt, restoreHermes } = buildMockService();
      try {
        await service.run({
          projectId: FIXTURE_PROJECT_ID,
          projectRoot: 'fixture_root',
          source: 'zip',
          userPrompt: 'Test injection',
          files: [],
        });

        const prompt = getPrompt();
        assert.ok(prompt !== null, 'Le prompt ne doit pas être null (la phase wiring a dû être appelée)');
        assert.match(prompt, /CODING_STANDARD_FIXTURE/,
          'Le prompt doit contenir le contenu de la méthodologie');
        assert.match(prompt, /KIROV5 GRADE GOLD/,
          'Le prompt doit contenir l\'en-tête Grade Gold');
      } finally {
        restoreHermes();
      }
    });
  });

  await test('resolveGenerationContext retourne le bon contexte pour phase wiring', async () => {
    // Test direct du resolver réel avec un bundle fixture local
    const { resolveMethodologyResources } = require('./MethodologyResolver');
    const resources = resolveMethodologyResources('wiring');
    assert.equal(resources.primary, 'prompts/phase4-backend-api.md');
    assert.equal(resources.policy, 'policies/coding-standards.md');
  });

  await test('buildContextBlock injecte les preuves de provenance dans le prompt', () => {
    const { buildContextBlock } = require('./MethodologyResolver');
    const ctx = {
      methodologySource: 'local_signed_bundle',
      methodologyResource: 'prompts/phase4-backend-api.md',
      methodologyVersion: '14.2.0',
      methodologyHash: 'abc123',
      manifestHash: 'def789',
      signatureVerified: false,
      artifactsVerified: true,
      contextHash: 'ghi000',
      verified: true,
      methodologyContent: FIXTURE_METHODOLOGY,
      policyContent: '',
    };
    const block = buildContextBlock(ctx);
    assert.match(block, /CODING_STANDARD_FIXTURE_v14\.2\.0/);
    assert.match(block, /DIRECTIVE ABSOLUE/);
    assert.match(block, /Tu ne dois PAS appeler un outil MCP/);
    assert.match(block, /14\.2\.0/);
    assert.match(block, /abc123/);
  });

  // Résumé
  console.log(`\n=== Résultats : ${passed} ✅ passés, ${failed} ❌ échoués ===\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Erreur fatale dans les tests d\'intégration :', e);
  process.exit(1);
});
