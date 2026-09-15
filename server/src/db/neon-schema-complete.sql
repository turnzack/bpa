-- ============================================================
-- SCHÉMA COMPLET NEON POSTGRESQL - BPA (Bâtiment Prix Assistant)
-- Remplace intégralement Supabase (Auth, Tables, Stripe, Storage)
-- ============================================================

-- 1. EXTENSIONS POSTGRESQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. TABLE UTILISATEURS (Neon Native)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_super_admin BOOLEAN DEFAULT false,
    nom TEXT,
    prenom TEXT,
    telephone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- 3. ABONNEMENTS STRIPE (Table BSD - Business Subscriber Data)
-- ============================================================
CREATE TABLE IF NOT EXISTS bsd (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_email TEXT,
    statut TEXT DEFAULT 'inactive', -- 'active', 'inactive', 'canceled', 'past_due'
    plan TEXT DEFAULT 'standard',
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_end_date TIMESTAMPTZ,
    date_fin TIMESTAMPTZ,
    annuler_en_fin_de_periode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bsd_user_id ON bsd(user_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_customer_id ON bsd(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_subscription_id ON bsd(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_bsd_statut ON bsd(statut);

-- ============================================================
-- 4. JOURNAL DES WEBHOOKS STRIPE
-- ============================================================
CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'processing',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON stripe_events(status);

-- ============================================================
-- 5. PAIEMENTS DE SCANS À L'UNITÉ (1.99 €)
-- ============================================================
CREATE TABLE IF NOT EXISTS scan_payments (
    id BIGSERIAL PRIMARY KEY,
    scan_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_email TEXT,
    stripe_payment_id TEXT,
    amount DECIMAL(10, 2) DEFAULT 1.99,
    currency TEXT DEFAULT 'eur',
    status TEXT DEFAULT 'pending', -- 'completed', 'pending', 'failed'
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scan_payments_scan_id ON scan_payments(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_user_id ON scan_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_status ON scan_payments(status);

-- TABLE: scan_attempts (Tentatives de scan)
CREATE TABLE IF NOT EXISTS scan_attempts (
    id BIGSERIAL PRIMARY KEY,
    scan_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending_payment',
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scan_attempts_scan_id ON scan_attempts(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_attempts_user_id ON scan_attempts(user_id);

-- ============================================================
-- 6. CATÉGORIES DE FACTURES
-- ============================================================
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

-- ============================================================
-- 7. FACTURES (Achats et Ventes)
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date_emission ON invoices(date_emission);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ============================================================
-- 8. DEVIS (Quotes)
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    source TEXT DEFAULT 'ia',
    numero_devis TEXT,
    date_creation DATE DEFAULT CURRENT_DATE,
    date_validite DATE,
    client_nom TEXT,
    client_email TEXT,
    status TEXT DEFAULT 'brouillon',
    
    total_ht NUMERIC(10,2) DEFAULT 0,
    total_tva NUMERIC(10,2) DEFAULT 0,
    total_ttc NUMERIC(10,2) DEFAULT 0,
    
    score_conformite INTEGER DEFAULT 75,
    articles_json JSONB,
    anomalies_json JSONB,
    synthese_expert TEXT,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);

-- ============================================================
-- 9. PROFIL ENTREPRISE ARTISAN
-- ============================================================
CREATE TABLE IF NOT EXISTS company_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    nom_entreprise TEXT,
    siret TEXT UNIQUE,
    statut_juridique TEXT,
    regime_tva TEXT,
    adresse_complete TEXT,
    code_ape TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. VUES UTILES
-- ============================================================
CREATE OR REPLACE VIEW user_subscriptions AS
SELECT 
    u.id AS user_id, 
    u.email, 
    b.statut, 
    b.plan,
    b.stripe_customer_id, 
    b.stripe_subscription_id, 
    b.subscription_end_date, 
    b.created_at, 
    b.updated_at
FROM users u 
LEFT JOIN bsd b ON u.id::text = b.user_id;

CREATE OR REPLACE VIEW payment_history AS
SELECT 
    sp.id, 
    sp.scan_id, 
    sp.user_id, 
    u.email AS user_email, 
    sp.amount, 
    sp.currency, 
    sp.status, 
    sp.paid_at, 
    sp.created_at
FROM scan_payments sp 
LEFT JOIN users u ON sp.user_id = u.id::text
ORDER BY sp.created_at DESC;
