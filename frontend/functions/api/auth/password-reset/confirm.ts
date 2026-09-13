import { getNeonClient } from '../../../_lib/neonClient';
import bcrypt from 'bcryptjs';

export async function onRequestPost(context: any) {
  const env = context.env;
  const request = context.request;
  const sql = getNeonClient(env);

  const { token, newPassword } = await request.json() as any;

  if (typeof token !== 'string' || typeof newPassword !== 'string') {
    return new Response(JSON.stringify({ error: 'INVALID_INPUT' }), { status: 400 });
  }

  if (newPassword.length < 8 || newPassword.length > 128) {
    return new Response(JSON.stringify({ error: 'PASSWORD_INVALID_LENGTH' }), { status: 400 });
  }

  try {
    const tokens = await sql`
      SELECT id, user_id, used_at
      FROM password_reset_tokens
      WHERE token_hash = ${token}
        AND expires_at > now()
    `;

    if (tokens.length === 0) {
      return new Response(JSON.stringify({ error: 'TOKEN_INVALID_OR_EXPIRED' }), { status: 400 });
    }

    const resetEntry = tokens[0];

    if (resetEntry.used_at !== null) {
      return new Response(JSON.stringify({ error: 'TOKEN_ALREADY_USED' }), { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${resetEntry.user_id}`;
    await sql`UPDATE password_reset_tokens SET used_at = now() WHERE id = ${resetEntry.id}`;

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[AUTH/RESET-CONFIRM] Erreur:', err?.message || 'Unknown');
    return new Response(JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' }), { status: 500 });
  }
}
