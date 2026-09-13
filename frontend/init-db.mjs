import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'fs';

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && existsSync('.env.local')) {
  const envConfig = readFileSync('.env.local', 'utf-8');
  for (const line of envConfig.split('\n')) {
    const [key, ...value] = line.split('=');
    if (key?.trim() === 'DATABASE_URL') {
      dbUrl = value.join('=').trim();
      break;
    }
  }
}

if (!dbUrl) {
  console.error('❌ DATABASE_URL introuvable dans .env.local');
  process.exit(1);
}

const sql = neon(dbUrl);

async function initDb() {
  console.log('🚀 Configuration de la base de données Neon en cours...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
    console.log('✅ SUCCÈS : Table "users" créée et configurée dans Neon !');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation:', err.message || err);
  }
}

initDb();
