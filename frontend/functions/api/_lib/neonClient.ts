import { neon } from '@neondatabase/serverless';

export function getNeonClient(env: any) {
  if (!env.DATABASE_URL) {
    throw new Error('[NEON] DATABASE_URL manquante dans les variables d\\'environnement Cloudflare');
  }
  return neon(env.DATABASE_URL);
}
