/**
 * Rate limiting en mémoire (fixed window) pour les routes /api/*.
 * Forme MVP volontairement simple : une Map par instance de serveur,
 * fenêtre glissante de 60 s par (IP + bucket). Aucune dépendance externe,
 * compatible edge runtime (aucune API Node).
 */

export interface RateLimitResult {
  ok: boolean;
  limit: number;
  remaining: number;
  /** Secondes avant réinitialisation de la fenêtre (pour Retry-After). */
  retryAfterSec: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;

/** Limites spécifiques par préfixe de chemin (sinon DEFAULT_LIMIT). */
const DEFAULT_LIMIT = 120;
const OVERRIDES: { prefix: string; limit: number }[] = [
  { prefix: "/api/health", limit: 300 },
  { prefix: "/api/openapi", limit: 60 },
  // Suivi de génération : interrogé toutes les ~2 s par page en cours → besoin large.
  { prefix: "/api/generator/status", limit: 600 },
];

/** Buckets actifs (nettoyés périodiquement pour éviter toute fuite mémoire). */
const buckets = new Map<string, Bucket>();
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < 30_000 && buckets.size < 5_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  lastCleanup = now;
}

function limitFor(pathname: string): number {
  for (const o of OVERRIDES) {
    if (pathname.startsWith(o.prefix)) return o.limit;
  }
  return DEFAULT_LIMIT;
}

/** Extrait l'IP cliente (passerelle Caddy → x-forwarded-for) avec repli local. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "local";
}

/**
 * Vérifie la limite pour cette requête. À appeler en début de middleware :
 * renvoie ok=false quand la limite est dépassée (réponse 429 à émettre).
 */
export function rateLimit(req: Request): RateLimitResult {
  const { pathname } = new URL(req.url);
  const limit = limitFor(pathname);
  const now = Date.now();

  cleanup(now);

  const key = `${clientIp(req)}:${pathname.split("/").slice(0, 3).join("/")}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, limit, remaining: limit - 1, retryAfterSec: 0 };
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  return { ok: bucket.count <= limit, limit, remaining, retryAfterSec };
}
