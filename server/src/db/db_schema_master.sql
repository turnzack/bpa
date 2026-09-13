-- PHASE 1: EXTENSION MASTER POUR PERMISSIONS MODULE COMPTA

-- 1.1. Module Catalog
CREATE TABLE IF NOT EXISTS modules_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  description TEXT,
  requires_plan TEXT CHECK (requires_plan IN ('standard', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Modules
INSERT INTO modules_catalog (code, nom, description, requires_plan) VALUES
('devis_ia', 'Devis IA Generatif', 'Génération de devis par IA', 'standard'),
('bibliotheque_prix', 'Bibliothèque de Prix', 'Accès base prix partagée', 'standard'),
('compta_ocr', 'Comptabilité OCR', 'Scan factures et gestion comptable', 'premium'),
('chantiers', 'Gestion Chantiers', 'Suivi de chantier et photos', 'standard')
ON CONFLICT (code) DO NOTHING;

-- 1.2. Artisan Modules Activation
CREATE TABLE IF NOT EXISTS artisan_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
  module_code TEXT NOT NULL REFERENCES modules_catalog(code),
  enabled BOOLEAN DEFAULT true,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artisan_id, module_code)
);

-- 1.3. Example Function to get Permissions (Simplified for SQL view)
-- Note: This logic is implemented in Backend Node (masterAuthService.ts) for flexibility,
-- but a Postgres function is also good for direct calls.

CREATE OR REPLACE FUNCTION get_user_permissions_sql(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_artisan_id UUID;
  v_plan_code TEXT;
  v_modules JSONB;
BEGIN
  SELECT id, (SELECT code FROM plans WHERE id = artisans.plan_id)
  INTO v_artisan_id, v_plan_code
  FROM artisans WHERE user_id = p_user_id;

  SELECT jsonb_object_agg(module_code, enabled)
  INTO v_modules
  FROM artisan_modules
  WHERE artisan_id = v_artisan_id AND enabled = true;

  RETURN jsonb_build_object(
    'user_id', p_user_id,
    'plan', v_plan_code,
    'modules', COALESCE(v_modules, '{}'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
