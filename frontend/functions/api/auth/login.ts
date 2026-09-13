import { getNeonClient } from '../_lib/neonClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SUPER_ADMIN_EMAILS = ['zacktunr@gmail.com'];

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

    const cleanEmail = email.toLowerCase().trim();
    const users = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: 'Identifiants incorrects' }), { status: 401 });
    }

    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Identifiants incorrects' }), { status: 401 });
    }

    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(cleanEmail);

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        isSuperAdmin,
        role: isSuperAdmin ? 'superadmin' : 'user'
      },
      env.JWT_SECRET || 'kirov5_sovereign_forge_secret_key_2026',
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Connexion réussie',
      token,
      userId: user.id,
      email: user.email,
      isSuperAdmin,
      role: isSuperAdmin ? 'superadmin' : 'user'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Erreur API Login:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne: ' + (error?.message || error) }), { status: 500 });
  }
}
