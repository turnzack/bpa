import { getNeonClient } from '../_lib/neonClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SUPER_ADMIN_EMAILS = ['tce.reponse@gmail.com', 'patrice.adja@gmail.com'];

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
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'`;

    const { email, password } = await request.json() as any;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email et mot de passe requis' }), { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUsers = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: 'Cet email est déjà utilisé.' }), { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${cleanEmail}, ${passwordHash}, 'user')
      RETURNING id, email, role
    `;

    const user = result[0];
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(cleanEmail);

    const token = jwt.sign(
      { userId: user.id, email: user.email, isSuperAdmin, role: isSuperAdmin ? 'superadmin' : 'user' },
      env.JWT_SECRET || 'bpa_facture_scan_secret_key_2026',
      { expiresIn: '7d' }
    );

    return new Response(JSON.stringify({
      success: true,
      message: 'Inscription réussie',
      token,
      userId: user.id,
      email: user.email,
      isSuperAdmin,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Erreur API Register:', error);
    return new Response(JSON.stringify({ error: 'Erreur interne: ' + (error?.message || error) }), { status: 500 });
  }
}
