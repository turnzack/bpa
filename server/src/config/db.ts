import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const sql = dbUrl ? neon(dbUrl) : ((() => {
  throw new Error('DATABASE_URL is not configured');
}) as any);

export async function initDb() {
  if (!dbUrl) {
    console.warn('⚠️  DATABASE_URL non configuré : Neon indisponible.');
    return;
  }
  try {
    // 1. Table users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_super_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Table bsd (abonnements Stripe)
    await sql`
      CREATE TABLE IF NOT EXISTS bsd (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_email TEXT,
        statut TEXT DEFAULT 'inactive',
        plan TEXT DEFAULT 'standard',
        stripe_customer_id TEXT UNIQUE,
        stripe_subscription_id TEXT UNIQUE,
        subscription_end_date TIMESTAMPTZ,
        date_fin TIMESTAMPTZ,
        annuler_en_fin_de_periode BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Table stripe_events
    await sql`
      CREATE TABLE IF NOT EXISTS stripe_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'processing',
        note TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Table scan_payments (paiements unitaires 1.99€)
    await sql`
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
    `;

    // 5. Table scan_attempts
    await sql`
      CREATE TABLE IF NOT EXISTS scan_attempts (
        id BIGSERIAL PRIMARY KEY,
        scan_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending_payment',
        attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Table invoice_categories
    await sql`
      CREATE TABLE IF NOT EXISTS invoice_categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        nom TEXT NOT NULL,
        icone TEXT,
        couleur TEXT,
        deductible_tva BOOLEAN DEFAULT true,
        ordre_affichage INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 7. Table invoices
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        type TEXT DEFAULT 'achat',
        numero_facture TEXT,
        date_emission DATE DEFAULT CURRENT_DATE,
        date_echeance DATE,
        fournisseur_nom TEXT,
        fournisseur_siret TEXT,
        fournisseur_adresse TEXT,
        client_nom TEXT,
        client_siret TEXT,
        montant_ht NUMERIC(10,2) DEFAULT 0,
        montant_ttc NUMERIC(10,2) DEFAULT 0,
        tva_details JSONB,
        taux_tva_principal NUMERIC(4,2),
        category_id UUID REFERENCES invoice_categories(id) ON DELETE SET NULL,
        tags TEXT[],
        file_url TEXT,
        file_type TEXT,
        file_size INTEGER,
        confidence_score NUMERIC(5,2),
        status TEXT DEFAULT 'draft',
        raw_ocr_text TEXT,
        bbox_coordinates JSONB,
        articles_json JSONB,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        validated_at TIMESTAMPTZ
      );
    `;

    console.log('✅ Base de données Neon connectée et toutes les tables vérifiées.');
  } catch (err) {
    console.error('❌ Erreur initialisation tables Neon:', err);
  }
}

export { sql };
