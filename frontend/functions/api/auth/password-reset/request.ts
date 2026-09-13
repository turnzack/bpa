import { getNeonClient } from '../../../_lib/neonClient';

function generateToken(bytes = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context: any) {
  const env = context.env;
  const request = context.request;
  const sql = getNeonClient(env);

  const { email } = await request.json() as any;

  if (typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'EMAIL_REQUIRED' }), { status: 400 });
  }

  const GENERIC_RESPONSE = { ok: true, message: 'Si cet email existe, un lien a été envoyé.' };

  try {
    const users = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;

    if (users.length === 0) {
      return new Response(JSON.stringify(GENERIC_RESPONSE), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const userId = users[0].id;
    const resetToken = generateToken(32);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${userId}, ${resetToken}, ${expiresAt.toISOString()})
    `;

    console.log(`[PASSWORD_RESET] Token généré pour ${email} — À envoyer par email`);

    return new Response(JSON.stringify(GENERIC_RESPONSE), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[AUTH/RESET-REQUEST] Erreur:', err?.message || 'Unknown');
    return new Response(JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }), { status: 500 });
  }
}
