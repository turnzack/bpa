'use strict';

/**
 * MethodologyResolver.js
 * Cœur du système KnowledgeProvider Grade Gold.
 *
 * Responsabilités :
 * 1. Mapper chaque phase d'exécution vers la ressource de méthodologie correcte.
 * 2. Résoudre le contexte de génération AVANT d'appeler Hermes.
 * 3. Implémenter la stratégie de fallback : Public → Local → Gate Bloquante.
 * 4. Exposer resolveGenerationContext() pour GoldPipelineService.
 */

const crypto = require('crypto');

const PublicBundleProvider = require('./PublicBundleProvider');
const LocalBundleProvider = require('./LocalBundleProvider');
const { KnowledgeErrors } = require('./KnowledgeErrors');

// Nom d'outil canonique unique (résout l'incohérence knowledge_get_methodology / get_methodology)
const CANONICAL_TOOL_NAME = 'get_methodology';

// Alias pour rétrocompatibilité (tout est remappé vers le nom canonique)
const KNOWLEDGE_TOOL_ALIASES = {
  knowledge_get_methodology: CANONICAL_TOOL_NAME,
  knowledgegetmethodology:   CANONICAL_TOOL_NAME,
  get_methodology:           CANONICAL_TOOL_NAME,
  ask_notebooklm:            CANONICAL_TOOL_NAME,
};

/**
 * Mappe une phase d'exécution vers les ressources de méthodologie nécessaires.
 * @param {string} phase - ex: "wiring", "ui-update", "default"
 * @returns {{ primary: string, policy: string }}
 */
function resolveMethodologyResources(phase) {
  const PHASE_RESOURCE_MAP = {
    'wiring':    { primary: 'prompts/phase4-backend-api.md', policy: 'policies/coding-standards.md' },
    'ui-update': { primary: 'prompts/phase3-ui-ux.md',       policy: 'policies/coding-standards.md' },
    'phase1':    { primary: 'prompts/phase1-conception.md',  policy: 'policies/coding-standards.md' },
    'phase2':    { primary: 'prompts/phase2-architecture.md', policy: 'policies/coding-standards.md' },
    'phase5':    { primary: 'prompts/phase5-industrialisation.md', policy: 'policies/coding-standards.md' },
    'default':   { primary: 'policies/coding-standards.md', policy: 'schemas/project-structure.json' },
  };

  return PHASE_RESOURCE_MAP[phase] || PHASE_RESOURCE_MAP['default'];
}

/**
 * Résout la chaîne de providers avec fallback automatique.
 * Stratégie : Online (Vercel) → Offline (Local Bundle) → Gate Bloquante
 *
 * @param {string} bundleLocalPath - Chemin absolu du bundle local signé
 * @returns {Promise<KnowledgeProvider>} Le provider disponible
 */
async function resolveProvider(bundleLocalPath) {
  // 1. Essayer le provider public (Vercel OTA)
  const publicProvider = new PublicBundleProvider();
  if (await publicProvider.isAvailable()) {
    console.log('[MethodologyResolver] ✅ Provider: Vercel OTA (online)');
    return publicProvider;
  }

  // 2. Fallback vers le bundle local signé
  if (bundleLocalPath) {
    const localProvider = new LocalBundleProvider(bundleLocalPath);
    if (await localProvider.isAvailable()) {
      console.log('[MethodologyResolver] ⚠️  Provider: Bundle local (offline fallback)');
      return localProvider;
    }
  }

  // 3. Aucun provider disponible → Gate bloquante
  throw KnowledgeErrors.PROVIDER_UNAVAILABLE('all providers failed (online + offline)');
}

/**
 * Résout le contexte de génération complet avant d'appeler Hermes.
 * Ce contexte sera injecté directement dans le prompt (pas juste une instruction textuelle).
 *
 * @param {{ phase: string, projectId: string, bundleLocalPath: string }} options
 * @returns {Promise<{
 *   phase: string,
 *   projectId: string,
 *   methodologyResource: string,
 *   methodologyContent: string,
 *   methodologyVersion: string,
 *   methodologyHash: string,
 *   methodologySource: string,
 *   policyContent: string,
 *   contextHash: string,
 *   verified: boolean,
 * }>}
 */
async function resolveGenerationContext({ phase, projectId, bundleLocalPath }) {
  const resources = resolveMethodologyResources(phase);
  const provider = await resolveProvider(bundleLocalPath);

  // Charger la ressource principale (prompt de phase)
  let primaryResult;
  try {
    primaryResult = await provider.getMethodology(resources.primary);
  } catch (e) {
    // Si la ressource principale n'existe pas, tenter le fallback local
    if (e.code === 'KNOWLEDGE_RESOURCE_NOT_FOUND' && !(provider instanceof LocalBundleProvider) && bundleLocalPath) {
      console.warn(`[MethodologyResolver] Ressource "${resources.primary}" absente en ligne, tentative locale...`);
      const localProvider = new LocalBundleProvider(bundleLocalPath);
      primaryResult = await localProvider.getMethodology(resources.primary);
    } else {
      throw e;
    }
  }

  // Charger la politique de code (coding-standards)
  let policyResult = { content: '', hash: '' };
  try {
    policyResult = await provider.getPolicy(resources.policy);
  } catch {
    // La politique est optionnelle si déjà incluse dans le primary
    console.warn(`[MethodologyResolver] Politique "${resources.policy}" non disponible, continuation sans.`);
  }

  // Hash de contexte global (pour validation dans le callback)
  const contextHash = crypto
    .createHash('sha256')
    .update(primaryResult.hash + policyResult.hash + phase + projectId)
    .digest('hex');

  return {
    phase,
    projectId,
    methodologyResource:  resources.primary,
    methodologyContent:   primaryResult.content,
    methodologyVersion:   primaryResult.version,
    methodologyHash:      primaryResult.hash,
    methodologySource:    primaryResult.source,
    manifestHash:         primaryResult.manifestHash || '',
    signatureVerified:    primaryResult.signatureVerified || false,
    artifactsVerified:    primaryResult.artifactsVerified || false,
    policyContent:        policyResult.content,
    contextHash,
    verified:             true,
  };
}

/**
 * Construit un bloc de contexte de méthodologie prêt à être injecté dans le prompt.
 * Ce bloc remplace l'ancienne simple "instruction textuelle".
 *
 * @param {{ methodologyContent: string, methodologyVersion: string, methodologyHash: string, methodologyResource: string, methodologySource: string, policyContent: string, contextHash: string }} context
 * @returns {string}
 */
/**
 * Construit le bloc de contexte injecté en tête du prompt Hermes.
 *
 * IMPORTANT : Ce bloc contient le CONTENU RÉEL de la méthodologie, déjà résolu
 * et vérifié par MethodologyResolver. Hermes n'a PAS à appeler un outil MCP.
 * Il doit appliquer le contenu ci-dessous sans le remettre en question.
 */
function buildContextBlock(context) {
  return `
=== KIROV5 GRADE GOLD — CONTEXTE MÉTHODOLOGIQUE VÉRIFIÉ ===
Source              : ${context.methodologySource}
Ressource           : ${context.methodologyResource}
Version             : ${context.methodologyVersion}
Hash artefact       : ${context.methodologyHash}
Hash manifest       : ${context.manifestHash || 'n/a'}
Signature validée   : ${context.signatureVerified ? 'OUI' : 'NON (bundle local)'}
Artefacts validés   : ${context.artifactsVerified ? 'OUI' : 'NON'}
ContextHash         : ${context.contextHash}
Vérifié             : ${context.verified ? 'OUI' : 'NON'}

❗ DIRECTIVE ABSOLUE — À LIRE EN PREMIER :
Le contenu ci-dessous est la méthodologie officielle Kirov5, récupérée,
vérifiée et injectée par le pipeline avant cet appel.
Tu ne dois PAS ignorer, contourner ou remplacer ces instructions.
Tu ne dois PAS appeler un outil MCP pour les récupérer : elles sont déjà ici.
Si une instruction ci-dessous contredit une règle ci-après dans le prompt,
les instructions de ce bloc ont PRIORITÉ ABSOLUE.

--- INSTRUCTIONS DE PHASE ---
${context.methodologyContent}

${context.policyContent ? `--- POLITIQUE DE CODE (vérifiée) ---\n${context.policyContent}` : ''}
=== FIN DU CONTEXTE MÉTHODOLOGIQUE — CES RÈGLES SONT ABSOLUES ===
`;
}

module.exports = {
  resolveGenerationContext,
  resolveMethodologyResources,
  resolveProvider,
  buildContextBlock,
  CANONICAL_TOOL_NAME,
  KNOWLEDGE_TOOL_ALIASES,
};
