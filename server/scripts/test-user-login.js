const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcrypt');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iXDMLpI7C2Py@ep-solitary-tree-b2h7z8qh-pooler.c-6.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

async function test() {
  const users = await sql`SELECT id, email, password_hash, role FROM users WHERE email = 'tce.reponse@gmail.com'`;
  console.log('User found:', users);
  if (users.length > 0) {
    const isMatch = await bcrypt.compare('bpa2026!', users[0].password_hash);
    console.log('Password "bpa2026!" match:', isMatch);
  }
}

test().catch(console.error);
