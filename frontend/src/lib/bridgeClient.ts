// Client Moteur Bridge Souverain
// Compatible Local Dev & Cloud VPS (Contabo / Vercel / Cloudflare)

let isLocalBridgeAvailable: boolean | null = null;
let lastFailureTimestamp = 0;

export function isElectronEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).electron || 
    (window as any).electronAPI || 
    navigator.userAgent?.includes('Electron')
  );
}

export function isLocalEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return true;
}

/**
 * Normalise les URLs pour le Cloud VPS :
 * Si l'application tourne sur un serveur distant (ex: 109.205.182.17),
 * toute requête vers http://localhost:5006 ou http://127.0.0.1:5006
 * est automatiquement redirigée vers l'origine actuelle.
 */
export function normalizeBridgeUrl(url: string): string {
  if (typeof window === 'undefined') return url;
  
  const isRemote = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isRemote) {
    if (url.includes('localhost:500') || url.includes('127.0.0.1:500') || url.includes(':5006') || url.includes(':5005')) {
      let path = url.replace(/^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):(5005|5006)/, '');
      if (!path.startsWith('/')) path = '/' + path;
      return path;
    }
  }
  return url;
}

/**
 * safeFetch sécurisé et transparent :
 * - Fonctionne en local ET sur le VPS Cloud Contabo
 * - Réécrit automatiquement les URLs localhost:5006 vers le serveur actuel
 * - Injecte automatiquement le jeton JWT si présent
 */
export async function safeFetch(url: string, init?: RequestInit): Promise<Response | null> {
  const targetUrl = normalizeBridgeUrl(url);

  // Injection automatique du jeton d'authentification JWT
  const token = typeof window !== 'undefined' ? localStorage.getItem('kirov5_jwt_token') : null;
  const headers = new Headers(init?.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const controller = new AbortController();
    const timeoutMs = 25000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(targetUrl, {
      ...init,
      headers,
      signal: init?.signal || controller.signal
    });

    clearTimeout(timer);
    return res;
  } catch (err) {
    console.warn('[SAFE-FETCH] Impossible de contacter', targetUrl, err);
    return null;
  }
}
