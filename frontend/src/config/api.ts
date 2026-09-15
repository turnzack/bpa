/**
 * Configuration universelle de l'URL API (BPA / Kirov5)
 * En local: utilise le proxy relatif ou localhost
 * En production (Vercel, Cloudflare, Web): communique DIRECTEMENT avec l'API HTTPS VPS
 * pour éliminer les erreurs 405 Method Not Allowed causées par les CDN statiques.
 */
export const API_BASE_ORIGIN = 'https://109-205-182-17.nip.io';

export function getApiUrl(endpoint: string): string {
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }

  // En environnement navigateur local (localhost / 127.0.0.1)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return endpoint;
    }
  }

  // En production Cloud / Vercel : accès direct à l'API Express sécurisée du VPS
  return `${API_BASE_ORIGIN}${endpoint}`;
}
