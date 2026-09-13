-- ============================================================
-- SCRIPT SQL SUPABASE - BPA
-- Projet: gprsutpgnezomoyfantx
-- ============================================================
-- Copiez-collez TOUT ce script dans:
-- https://supabase.com/dashboard/project/gprsutpgnezomoyfantx/sql/new
-- ============================================================

-- TABLE: bsd (Business Subscriber Data)
CREATE TABLE IF NOT EXISTS bsd (
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

CREATE INDEX IF NOT EXISTS idx_bsd_user_id ON bsd(user_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_customer_id ON bsd(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_subscription_id ON bsd(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_bsd_statut ON bsd(statut);

-- TABLE: stripe_events
CREATE TABLE IF NOT EXISTS stripe_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'processing',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON stripe_events(status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed_at ON stripe_events(processed_at);

-- TABLE: scan_payments
CREATE TABLE IF NOT EXISTS scan_payments (
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

CREATE INDEX IF NOT EXISTS idx_scan_payments_scan_id ON scan_payments(scan_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_user_id ON scan_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_stripe_payment_id ON scan_payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_scan_payments_status ON scan_payments(status);

-- ROW LEVEL SECURITY
ALTER TABLE bsd ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_payments ENABLE ROW LEVEL SECURITY;

-- POLITIQUES RLS: bsd
CREATE POLICY "Users can view own profile" ON bsd FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON bsd FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can do anything" ON bsd FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- POLITIQUES RLS: scan_payments
CREATE POLICY "Users can view own payments" ON scan_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert payments" ON scan_payments FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- POLITIQUES RLS: stripe_events
CREATE POLICY "Service role can view events" ON stripe_events FOR SELECT USING (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role can insert events" ON stripe_events FOR INSERT WITH CHECK (auth.jwt()->>'role' = 'service_role');
CREATE POLICY "Service role can update events" ON stripe_events FOR UPDATE USING (auth.jwt()->>'role' = 'service_role');

-- VUES
CREATE OR REPLACE VIEW user_subscriptions AS
SELECT u.id AS user_id, u.email, b.statut, b.stripe_customer_id, b.stripe_subscription_id, 
       b.subscription_end_date, b.created_at, b.updated_at
FROM auth.users u LEFT JOIN bsd b ON u.id = b.user_id;

CREATE OR REPLACE VIEW payment_history AS
SELECT sp.id, sp.scan_id, sp.user_id, u.email AS user_email, sp.amount, sp.currency, 
       sp.status, sp.paid_at, sp.created_at
FROM scan_payments sp LEFT JOIN auth.users u ON sp.user_id = u.id
ORDER BY sp.created_at DESC;

-- FONCTION: Créer profil BSD automatiquement
CREATE OR REPLACE FUNCTION create_bsd_profile() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO bsd (user_id, user_email, statut) VALUES (NEW.id, NEW.email, 'inactive');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Création auto profil
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_bsd_profile();

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
