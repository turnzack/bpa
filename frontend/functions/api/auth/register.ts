import { getNeonClient } from '../_lib/neonClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function onRequestPost(context: any) {
  try {
    const env = context.env;
    const request = context.request;
    const sql = getNeonClient(env);

    // Auto-création de la table si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { email, password } = await request.json() as any;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email et mot de passe requis' }), { status: 400 });
    }

    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'Cet agent existe déjà dans le Nexus.' }), { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email.toLowerCase().trim()}, ${passwordHash})
      RETURNING id, email
    `;

    const user = result[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET || 'kirov5_sovereign_forge_secret_key_2026',
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Habilitation créée avec succès',
      token,
      userId: user.id
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Erreur API Register:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne: ' + (error?.message || error) }), { status: 500 });
  }
}
