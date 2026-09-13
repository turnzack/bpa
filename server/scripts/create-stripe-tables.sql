-- ============================================================
-- TABLE BSD (Business Subscriber Data) - Pour Stripe
-- ============================================================
-- Cette table gère les abonnements Stripe des utilisateurs
-- Projet Supabase: mgqwcuhlcsovbdihqfpd
-- ============================================================

-- Table pour les abonnements Stripe
CREATE TABLE IF NOT EXISTS public.bsd (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    statut TEXT DEFAULT 'inactive',
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_bsd_user_id ON bsd(user_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_customer_id ON bsd(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_subscription_id ON bsd(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_bsd_statut ON bsd(statut);

-- Activer RLS (Row Level Security)
ALTER TABLE bsd ENABLE ROW LEVEL SECURITY;

-- POLITIQUES RLS

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
    ON bsd FOR SELECT
    USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
    ON bsd FOR UPDATE
    USING (auth.uid() = user_id);

-- Le service role peut tout faire (pour les webhooks Stripe)
CREATE POLICY "Service role can do anything"
    ON bsd FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_bsd_updated_at
    BEFORE UPDATE ON bsd
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- TABLE STRIPE_EVENTS (Journal des webhooks)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.stripe_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'processing',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON stripe_events(status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at ON stripe_events(processed_at);

-- RLS
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Seul le service role peut accéder aux événements Stripe
CREATE POLICY "Service role can view events"
    ON stripe_events FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can insert events"
    ON stripe_events FOR INSERT
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can update events"
    ON stripe_events FOR UPDATE
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================
-- TABLE SCAN_PAYMENTS (Paiements de scans uniques)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.scan_payments (
    id BIGSERIAL PRIMARY KEY,
    scan_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    stripe_payment_id TEXT,
    amount DECIMAL(10, 2) DEFAULT 1.99,
    currency TEXT DEFAULT 'eur',
    status TEXT DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_scan_payments_scan_id ON scan_payments(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_user_id ON scan_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_stripe_payment_id ON scan_payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_status ON scan_payments(status);

-- RLS
ALTER TABLE scan_payments ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres paiements
CREATE POLICY "Users can view own payments"
    ON scan_payments FOR SELECT
    USING (auth.uid() = user_id);

-- Le service role peut tout faire (pour les webhooks)
CREATE POLICY "Service role can insert payments"
    ON scan_payments FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================
-- VUES UTILES
-- ============================================================

-- Vue pour voir les utilisateurs avec leur statut d'abonnement
CREATE OR REPLACE VIEW user_subscriptions AS
SELECT
    u.id AS user_id,
    u.email,
    b.statut,
    b.stripe_customer_id,
    b.stripe_subscription_id,
    b.subscription_end_date,
    b.created_at AS subscription_created_at,
    b.updated_at AS subscription_updated_at
FROM auth.users u
LEFT JOIN bsd b ON u.id = b.user_id;

-- Vue pour voir l'historique des paiements
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
LEFT JOIN auth.users u ON sp.user_id = u.id
ORDER BY sp.created_at DESC;

-- ============================================================
-- FONCTION: Créer profil BSD automatiquement à l'inscription
-- ============================================================

CREATE OR REPLACE FUNCTION create_bsd_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO bsd (user_id, user_email, statut)
    VALUES (NEW.id, NEW.email, 'inactive');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil BSD
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_bsd_profile();

-- ============================================================
-- RECHARGER LE CACHE POSTGREST
-- ============================================================
NOTIFY pgrst, 'reload config';

-- ============================================================
-- VÉRIFICATION
-- ============================================================
-- Vérifier que les tables ont été créées
SELECT 
    'bsd' AS table_name, 
    COUNT(*) AS row_count 
FROM bsd
UNION ALL
SELECT 
    'stripe_events', 
    COUNT(*) 
FROM stripe_events
UNION ALL
SELECT 
    'scan_payments', 
    COUNT(*) 
FROM scan_payments;

-- ============================================================
-- FIN DU SCRIPT - Tables Stripe prêtes !
-- ============================================================
