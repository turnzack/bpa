const path = require('path');
const dotenv = require('dotenv');
const { neon } = require('@neondatabase/serverless');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkAndInit() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL manquant dans server/.env');
    return;
  }
  const sql = neon(dbUrl);

  const rawSql = (queryStr) => {
    const templateArr = [queryStr];
    templateArr.raw = [queryStr];
    return sql(templateArr);
  };

  console.log('Connexion à Neon PostgreSQL...');

  await rawSql(`
    CREATE TABLE IF NOT EXISTS scan_payments (
      id BIGSERIAL PRIMARY KEY,
      scan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_email TEXT,
      stripe_payment_id TEXT,
      amount DECIMAL(10, 2) DEFAULT 1.99,
      currency TEXT DEFAULT 'eur',
      status TEXT DEFAULT 'pending',
      paid_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await rawSql(`CREATE INDEX IF NOT EXISTS idx_scan_payments_scan_id ON scan_payments(scan_id);`);
  await rawSql(`CREATE INDEX IF NOT EXISTS idx_scan_payments_user_id ON scan_payments(user_id);`);
  await rawSql(`CREATE INDEX IF NOT EXISTS idx_scan_payments_status ON scan_payments(status);`);

  await rawSql(`
    CREATE TABLE IF NOT EXISTS scan_attempts (
      id BIGSERIAL PRIMARY KEY,
      scan_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending_payment',
      attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ Tables scan_payments et scan_attempts vérifiées avec succès sur Neon !');
  const count = await rawSql(`SELECT count(*) as c FROM scan_payments`);
  console.log('Nombre de paiements enregistrés dans Neon :', count[0]?.c);
}

checkAndInit().catch(console.error);
