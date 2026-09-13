// ============================================================
// HERMES CLOUDFLARE AI PROVIDER — v0reponses
// Worker URL : https://kirov-worker.v0reponses.workers.dev
// Route      : POST /api/hermes
// Format     : OpenAI-compatible messages[]
// Modele     : @cf/qwen/qwen2.5-coder-32b-instruct (plan FREE)
// ============================================================

export interface CloudflareCredentials {
  accountId: string;
  apiToken: string;
  model?: string;
}

// Modeles Cloudflare Workers AI confirmes sur plan FREE
export const CF_MODELS = {
  QWEN_CODER_32B:   '@cf/qwen/qwen2.5-coder-32b-instruct',          // Meilleur pour code
  DEEPSEEK_R1_32B:  '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', // Code + raisonnement
  LLAMA_3_3_70B:    '@cf/meta/llama-3.3-70b-instruct-fp8-fast',      // Llama 3.3 actuel
  LLAMA_3_2_3B:     '@cf/meta/llama-3.2-3b-instruct',               // Leger & rapide
  MISTRAL_7B:       '@cf/mistral/mistral-7b-instruct-v0.1',          // Stable
  GLM_4_7B:         '@cf/zai-org/glm-4.7-flash',                     // Google GLM
} as const;

export type CfModel = typeof CF_MODELS[keyof typeof CF_MODELS];

const STORAGE_KEY_CF = 'hermes_cloudflare_credentials';

// URL du Worker Kirov (kirov-worker.v0reponses.workers.dev)
const WORKER_PROXY_URL = (import.meta as any).env?.VITE_HERMES_WORKER_URL
  || 'https://kirov-worker.v0reponses.workers.dev';

export function getCfCredentials(): CloudflareCredentials | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CF);
    if (!raw) return null;
    return JSON.parse(raw) as CloudflareCredentials;
  } catch { return null; }
}

export function setCfCredentials(creds: CloudflareCredentials): void {
  try { localStorage.setItem(STORAGE_KEY_CF, JSON.stringify(creds)); } catch {}
}

export function clearCfCredentials(): void {
  try { localStorage.removeItem(STORAGE_KEY_CF); } catch {}
}

export function hasCfCredentials(): boolean {
  try {
    return localStorage.getItem('hermes_cf_enabled') === 'true';
  } catch { return false; }
}

export function enableCfMode(): void {
  try { localStorage.setItem('hermes_cf_enabled', 'true'); } catch {}
}

export function disableCfMode(): void {
  try { localStorage.removeItem('hermes_cf_enabled'); } catch {}
}

// ── Appel Cloudflare Workers AI via Worker Kirov ─────────────
export async function callCloudflareHermes(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    model?: CfModel;
  }
): Promise<string> {
  const model = options?.model || CF_MODELS.QWEN_CODER_32B;
  const maxTokens = options?.maxTokens ?? 8192;
  const temperature = options?.temperature ?? 0.3;

  let response: Response | undefined;
  let lastError: Error | undefined;
  const maxRetries = 2;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    const abortCtrl = new AbortController();
    const timeoutId = setTimeout(() => abortCtrl.abort(), 300000); // 300s timeout

    try {
      console.log(`[Hermes-CF] Appel Worker Kirov (Tentative ${attempt}/${maxRetries + 1})...`);

      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('kirov5_jwt_token') || '')
        : '';

      response = await fetch(`${WORKER_PROXY_URL}/api/hermes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        signal: abortCtrl.signal,
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userPrompt   },
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        if (response.status === 403) {
          throw new Error('Hermes Worker — Modele non disponible sur plan Free (403).');
        }
        if (response.status === 429) {
          throw new Error('Hermes Worker — Quota 10 000 Neurons/jour atteint. Reset a 00:00 UTC.');
        }
        if (response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error(`Erreur transitoire ${response.status}: ${errText.slice(0, 300)}`);
        }
        throw new Error(`Hermes Worker — Erreur ${response.status}: ${errText.slice(0, 300)}`);
      }

      break; // Succes
    } catch (netErr: any) {
      clearTimeout(timeoutId);
      let errMsg = netErr.message;
      if (netErr.name === 'AbortError') {
        errMsg = 'Hermes Worker — Timeout local (300s) atteint.';
      }
      lastError = new Error(errMsg);

      if (errMsg.includes('Modele non disponible') || errMsg.includes('Quota 10 000')) {
        throw lastError;
      }
      if (attempt <= maxRetries) {
        console.warn(`[Hermes-CF] Echec (Tentative ${attempt}). Retry dans ${3 * attempt}s... (${errMsg})`);
        await new Promise(res => setTimeout(res, 3000 * attempt));
      } else {
        console.error(`[Hermes-CF] Echec definitif apres ${maxRetries + 1} tentatives.`);
        throw lastError;
      }
    }
  }

  if (!response) {
    throw lastError || new Error("Erreur inconnue lors de l'appel Cloudflare.");
  }

  const data = await response.json();

  let content: any = (
    data?.response ||
    data?.choices?.[0]?.message?.content ||
    data?.choices?.[0]?.text ||
    data?.choices?.[0]?.delta?.content ||
    data?.result?.response ||
    (typeof data?.result === 'string' ? data.result : '') ||
    ''
  );

  if (typeof content !== 'string') {
    try { content = JSON.stringify(content); } catch { content = String(content); }
  }

  if ((!content || content.trim().length < 5) && data?.choices?.[0]?.message?.reasoning) {
    console.warn('[Hermes-CF] Contenu vide, utilisation du champ reasoning.');
    content = data.choices[0].message.reasoning;
  }

  if (!content || content.trim().length < 5) {
    const choice0 = data?.choices?.[0];
    console.error('[Hermes-CF] Reponse vide. choices[0]:', JSON.stringify(choice0, null, 2));
    throw new Error(`Hermes Worker — Reponse vide (finish_reason: ${choice0?.finish_reason || 'unknown'}). Modele: ${data?.model}`);
  }

  return content;
}

// ── Test de connexion ─────────────────────────────────────────
export async function testCfConnection(creds: CloudflareCredentials): Promise<{
  ok: boolean;
  model: string;
  error?: string;
}> {
  try {
    const prev = getCfCredentials();
    setCfCredentials(creds);

    const reply = await callCloudflareHermes(
      'You are a test assistant. Reply with exactly: {"status":"ok"}',
      'ping',
      { maxTokens: 20, temperature: 0 }
    );

    if (!prev) clearCfCredentials();
    else setCfCredentials(prev);

    return { ok: true, model: creds.model || CF_MODELS.QWEN_CODER_32B };
  } catch (err: any) {
    return { ok: false, model: creds.model || CF_MODELS.QWEN_CODER_32B, error: err.message };
  }
}
