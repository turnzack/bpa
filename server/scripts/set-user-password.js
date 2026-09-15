const { neon } = require('@neondatabase/serverless');
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch {
  bcrypt = require('bcrypt');
}

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iXDMLpI7C2Py@ep-solitary-tree-b2h7z8qh-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function setPassword(email, newPassword) {
  const cleanEmail = email.toLowerCase().trim();
  const hash = await bcrypt.hash(newPassword, 10);

  const updated = await sql`
    UPDATE users 
    SET password_hash = ${hash}
    WHERE email = ${cleanEmail}
    RETURNING id, email, role
  `;

  if (updated.length === 0) {
    console.log(`Utilisateur introuvable pour ${cleanEmail}, création...`);
    const inserted = await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${cleanEmail}, ${hash}, 'superadmin')
      RETURNING id, email, role
    `;
    console.log('✅ Utilisateur créé :', inserted[0]);
  } else {
    console.log('✅ Mot de passe mis à jour avec succès dans Neon pour :', updated[0]);
  }
}

const targetEmail = process.argv[2] || 'tce.reponse@gmail.com';
const targetPassword = process.argv[3] || 'bpa2026!';

setPassword(targetEmail, targetPassword).catch(console.error);
