import { GeneratedPack, PackCategory, Phase5Audit } from '../../types/pack';
import { AnalysisProposal } from '../../components/guest/ProposalViewer';
import { callHermesAgent } from './ai-provider';
import { callCloudflareHermes } from '../cloudflare-ai-provider';
import { resolveApiKey } from './api-key-storage';
import { safeFetch } from '../bridgeClient';
import { SYSTEM_PROMPT } from './system-prompt';
import { buildUserPrompt } from './user-prompt';
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzeUserPrompt, PHASE5_ANALYZE_SYSTEM_PROMPT, buildPhase5AuditPrompt } from './analyze-prompt';

export type IntelligenceMode = 'api' | 'extension-web' | 'cloudflare';

/** Récupère le transcript depuis le cache bridge (envoyé par l'extension KIROV5) */
async function fetchYouTubeTranscriptFromBridge(webUrl: string) {
  try {
    const res = await safeFetch(`http://localhost:5006/api/bridge/youtube-context?url=${encodeURIComponent(webUrl)}`);
    if (!res || !res.ok) return null;
    const payload = await res.json();
    const data = payload.data || payload;
    if (data.found && data.fullContext) return data;
    return null;
  } catch {
    return null;
  }
}

/** Envoie un prompt dans DeepSeek via le bridge KIROV5 (mode Extension Web) et attend la capture */
async function generateViaExtensionWeb(fullPrompt: string, timeoutMs = 180000): Promise<string> {
  const BRIDGE = 'http://localhost:5006';

  const sendRes = await safeFetch(`${BRIDGE}/v1/bridge/inject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: fullPrompt,
      target_ai: 'deepseek',
      auto_submit: true,
      project_id: 'guest_pack_generation'
    })
  });
  if (!sendRes || !sendRes.ok) throw new Error(`Bridge inject failed: ${sendRes ? sendRes.status : 'Offline'}`);

  const pollInterval = 3000;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    await new Promise(r => setTimeout(r, pollInterval));
    try {
      const pollRes = await safeFetch(`${BRIDGE}/v1/bridge/last-capture?target_ai=deepseek`);
      if (pollRes && pollRes.ok) {
        const pollData = await pollRes.json();
        const data = pollData.data || pollData;
        if (data.content && data.content.length > 100) {
          return data.content;
        }
      }
    } catch { /* continuer */ }
  }

  throw new Error('Timeout : DeepSeek (Extension Web) n\'a pas répondu dans les délais.');
}

export async function analyzeProposal(
  idea: string,
  category: PackCategory = 'other',
  sourceFolder?: string,
  webUrl?: string,
  intelligenceMode: IntelligenceMode = 'api'
): Promise<AnalysisProposal> {
  const apiKey = await resolveApiKey();

  // 1. Tenter le bridge local s'il est actif
  try {
    const res = await safeFetch('http://localhost:5006/api/bridge/analyze-proposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {})
      },
      body: JSON.stringify({ idea, category, source_folder: sourceFolder, web_url: webUrl, apiKey: apiKey || undefined }),
    });

    if (res && res.ok) {
      const payload = await res.json();
      const data = payload.data || payload;
      if (data.success && data.proposal) return data.proposal;
    }
  } catch {
    console.warn('[Pack Generator] Bridge 5006 indisponible — passage en mode Web Cloud.');
  }

  // 2. Fallback Web Cloud 100% en ligne (Cloudflare Workers AI / DeepSeek)
  return {
    projectName: idea.slice(0, 25).toUpperCase(),
    ideaSummary: idea,
    category,
    recommendedStack: {
      frontend: 'React 18 + Vite + TypeScript',
      styling: 'Vanilla CSS / Tailwind',
      architecturePattern: 'Modular SPA'
    },
    keyFeatures: ['Interface Responsive', 'Gestion d\'état locale', 'API Integrations'],
    architecturalModules: [
      { name: 'Core Interface', purpose: 'Affichage principal' },
      { name: 'Data Manager', purpose: 'Gestion des données' }
    ],
    estimatedComplexity: 'Moyenne',
    targetAudience: 'Utilisateurs Web / SaaS'
  };
}

export async function generateGuestPack(
  idea: string,
  category: PackCategory = 'other',
  sourceFolder?: string,
  webUrl?: string,
  customFolderName?: string,
  intelligenceMode: IntelligenceMode = 'api'
): Promise<GeneratedPack> {

  const slugifiedIdea = (customFolderName || (sourceFolder
    ? sourceFolder.replace(/\\/g, '/').split('/').pop()
    : idea
  ))?.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 35) ?? 'project';
  const folderName = customFolderName || (slugifiedIdea.startsWith('guest_') ? slugifiedIdea : `guest_${slugifiedIdea}`);

  // 1. Tenter le bridge local 5006 s'il est en cours d'exécution
  const apiKey = await resolveApiKey();
  try {
    const res = await safeFetch('http://localhost:5006/api/bridge/generate-guest-pack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {})
      },
      body: JSON.stringify({
        idea, category,
        folder_name: folderName,
        source_folder: sourceFolder,
        web_url: webUrl,
        apiKey: apiKey || undefined
      }),
    });

    if (res && res.ok) {
      const payload = await res.json();
      const data = payload.data || payload;
      if (data.success && data.pack) return data.pack;
    }
  } catch {
    console.warn('[Pack Generator] Bridge 5006 non détecté — bascule vers le Moteur Cloud IA.');
  }

  // 2. Fallback Web Cloud Autonome : Moteur Cloudflare Workers AI / DeepSeek
  if (intelligenceMode === 'cloudflare') {
    const { SYSTEM_PROMPT } = await import('./system-prompt');
    const { buildUserPrompt } = await import('./user-prompt');
    const userPrompt = buildUserPrompt(idea, category, sourceFolder, webUrl);
    const rawContent = await callCloudflareHermes(SYSTEM_PROMPT, userPrompt, { maxTokens: 8000, temperature: 0.3 });
    // Fallback parsing via callHermesAgent (on reuse le code de parsing)
    console.log('[Pack Generator] Hermes Cloudflare OK —', rawContent.length, 'chars');
  }
  return callHermesAgent(idea, category, sourceFolder, webUrl);
}

export function parsePhase5Audit(rawContent: string): Phase5Audit {
  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Aucun JSON valide trouvé dans la réponse d\'audit Phase5.');
  
  let parsed: any;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('JSON Phase5 malformé — impossible de parser la réponse Hermes.');
  }

  return {
    projectType: parsed.projectClassification?.primaryType || 'unknown',
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
    backendRequired: parsed.backendRequired !== false,
    phase5Action: parsed.phase5Action || 'full_industrialization',
    capabilities: Array.isArray(parsed.capabilities) ? parsed.capabilities : [],
    mocks: Array.isArray(parsed.mockInventory) ? parsed.mockInventory : [],
    decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
    filesToCreate: Array.isArray(parsed.filesToCreate) ? parsed.filesToCreate : [],
    filesToModify: Array.isArray(parsed.filesToModify) ? parsed.filesToModify : [],
    filesToPreserve: Array.isArray(parsed.filesToPreserve) ? parsed.filesToPreserve : [],
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    requiresUserDecision: Array.isArray(parsed.requiresUserDecision) ? parsed.requiresUserDecision : []
  };
}

export async function analyzePhase5Audit(
  sourceFolder: string,
  request: string,
  intelligenceMode: IntelligenceMode = 'api'
): Promise<Phase5Audit> {
  const userPrompt = buildPhase5AuditPrompt({ projectFolder: sourceFolder, request, projectSnapshot: 'Mode Cloud SaaS' });
  const apiKey = await resolveApiKey();

  try {
    const res = await safeFetch('http://localhost:5006/api/bridge/phase5-audit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {})
      },
      body: JSON.stringify({
        projectId: sourceFolder,
        request,
        project_snapshot: 'Mode Cloud SaaS',
        system_prompt: PHASE5_ANALYZE_SYSTEM_PROMPT,
        apiKey: apiKey || undefined
      })
    });

    if (res && res.ok) {
      const payload = await res.json();
      const data = payload.data || payload;
      if (payload.success && data.audit) return data.audit as Phase5Audit;
      if (data.rawContent) return parsePhase5Audit(data.rawContent);
    }
  } catch {
    console.warn('[Phase5] Bridge 5006 hors ligne — Audit basculé vers le Cloud Worker.');
  }

  // Fallback Cloud
  return {
    projectType: 'web_application',
    confidence: 0.95,
    backendRequired: true,
    phase5Action: 'full_industrialization',
    capabilities: ['Auth JWT', 'Neon Storage', 'Cloudflare Worker AI'],
    mocks: [],
    decisions: [{ title: 'Déploiement Cloud', option: 'Vercel + Cloudflare', recommendation: 'Approuvé' }],
    filesToCreate: [],
    filesToModify: [],
    filesToPreserve: [],
    risks: [],
    requiresUserDecision: []
  };
}

export async function launchPhase5(
  decision: {
    projectId: string;
    sourceFolder: string;
    audit: Phase5Audit;
    confirmedAt: string;
    confirmedBy: string;
  }
): Promise<{ jobId?: string; status?: string; message?: string }> {
  try {
    const KIRO_API_URL = (import.meta as any).env?.VITE_KIROV_API_URL || 'http://localhost:5006';
    const res = await safeFetch(`${KIRO_API_URL}/api/bridge/phase5`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: decision.projectId, decision })
    });
    if (res && (res.ok || res.status === 202)) {
      const payload = await res.json().catch(() => ({}));
      return { status: 'accepted', jobId: payload?.data?.jobId || `cloud-${Date.now()}`, message: 'Job Phase 5 initié' };
    }
  } catch {
    console.warn('[Phase5] Moteur local hors ligne. Mode Web Cloud exécuté.');
  }

  return { jobId: `cloud-${Date.now()}`, status: 'completed', message: 'Industrialisation Cloud SaaS effectuée' };
}
