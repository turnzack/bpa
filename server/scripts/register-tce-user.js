const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iXDMLpI7C2Py@ep-solitary-tree-b2h7z8qh-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function main() {
  const email = 'tce.reponse@gmail.com';
  // Check if exists
  const existing = await sql`SELECT id, email, role FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    console.log(`L'utilisateur ${email} existe déjà (ID: ${existing[0].id}, Rôle: ${existing[0].role})`);
    return;
  }

  // Create default password hash
  const defaultPassword = process.env.USER_PASSWORD || 'bpa2026!';
  const saltRounds = 10;
  const hash = await bcrypt.hash(defaultPassword, saltRounds);

  const inserted = await sql`
    INSERT INTO users (email, password_hash, role)
    VALUES (${email}, ${hash}, 'superadmin')
    RETURNING id, email, role
  `;

  console.log('Utilisateur créé avec succès dans Neon :', inserted[0]);
  console.log(`Mot de passe par défaut configuré : "${defaultPassword}"`);
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
