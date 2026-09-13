-- PHASE 2: EXTENSION ARTISAN (COFFRE-FORT METIER)

-- 2.1. Nouvelles Tables Comptables

-- COMPANY PROFILE
CREATE TABLE IF NOT EXISTS company_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- Link to Auth User
    nom_entreprise TEXT,
    siret TEXT UNIQUE,
    statut_juridique TEXT, -- Enum logic tailored in Check constraint or app layer
    regime_tva TEXT,
    taux_cotisation NUMERIC,
    periodicite_urssaf TEXT,
    date_debut_activite DATE,
    rib TEXT, -- Encrypted commonly handled in app
    adresse_complete TEXT,
    code_ape TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICE CATEGORIES
CREATE TABLE IF NOT EXISTS invoice_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Nullable for global categories
    nom TEXT NOT NULL,
    icone TEXT,
    couleur TEXT,
    deductible_tva BOOLEAN DEFAULT true,
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICES (Factures)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT CHECK (type IN ('achat', 'vente')),
    
    -- References
    numero_facture TEXT,
    date_emission DATE,
    date_echeance DATE,
    
    -- Tiers
    fournisseur_id UUID, -- Link to suppliers table
    fournisseur_nom TEXT,
    fournisseur_siret TEXT,
    fournisseur_adresse TEXT,
    
    client_id UUID, -- Link to customers table
    client_nom TEXT,
    client_siret TEXT,
    
    -- Montants
    montant_ht NUMERIC(10,2),
    montant_ttc NUMERIC(10,2),
    tva_details JSONB, -- {"20": 200, "10": 50}
    taux_tva_principal NUMERIC(4,2),
    
    -- Classement
    category_id UUID REFERENCES invoice_categories(id),
    tags TEXT[],
    
    -- Fichier
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    
    -- OCR
    confidence_score NUMERIC(5,2),
    status TEXT CHECK (status IN ('draft', 'a_verifier', 'valide', 'archive')) DEFAULT 'draft',
    raw_ocr_text TEXT,
    bbox_coordinates JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ
);

-- QUOTES (Devis)
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    source TEXT DEFAULT 'manual', -- ia, manual, import
    
    numero_devis TEXT UNIQUE,
    date_creation DATE DEFAULT CURRENT_DATE,
    date_validite DATE,
    
    client_id UUID, -- FK customers
    status TEXT DEFAULT 'brouillon',
    
    -- Montants
    total_ht NUMERIC DEFAULT 0,
    total_tva NUMERIC DEFAULT 0,
    total_ttc NUMERIC DEFAULT 0,
    remise_pourcentage NUMERIC,
    remise_montant NUMERIC,
    
    -- AI Meta
    ai_prompt TEXT,
    ai_model_version TEXT,
    matched_prices_count INTEGER,
    
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTE ITEMS
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    ligne_numero INTEGER,
    designation TEXT,
    quantite NUMERIC,
    unite TEXT,
    prix_unitaire_ht NUMERIC,
    taux_tva NUMERIC,
    montant_ht NUMERIC,
    montant_tva NUMERIC,
    montant_ttc NUMERIC,
    
    code_ouvrage TEXT,
    source_price TEXT,
    price_confidence NUMERIC
);

-- REVENUE BOOK (Livre Recettes)
CREATE TABLE IF NOT EXISTS revenue_book (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    numero_sequentiel INTEGER,
    date_encaissement DATE,
    numero_piece TEXT,
    client_nom TEXT,
    designation TEXT,
    montant_ht NUMERIC,
    tva_collectee JSONB,
    montant_ttc NUMERIC,
    mode_paiement TEXT,
    periode_comptable TEXT, -- YYYY-MM
    quote_id UUID REFERENCES quotes(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, numero_sequentiel)
);

-- PURCHASE REGISTRY (Registre Achats)
CREATE TABLE IF NOT EXISTS purchase_registry (
    invoice_id UUID PRIMARY KEY REFERENCES invoices(id),
    user_id UUID,
    numero_chronologique INTEGER, -- Auto generated ideally
    date_facture DATE,
    date_enregistrement DATE DEFAULT CURRENT_DATE,
    fournisseur_nom TEXT,
    numero_facture TEXT,
    montant_ht NUMERIC,
    tva_deductible JSONB,
    montant_ttc NUMERIC,
    categorie TEXT,
    periode_comptable TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2. Functions & Triggers

-- Calcul TVA
CREATE OR REPLACE FUNCTION calc_tva(montant_ht NUMERIC, taux NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(montant_ht * taux / 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger Numero Sequentiel Revenue Book
CREATE OR REPLACE FUNCTION set_numero_sequentiel()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_sequentiel := COALESCE(
    (SELECT MAX(numero_sequentiel) FROM revenue_book WHERE user_id = NEW.user_id), 0
  ) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_revenue_book_numero ON revenue_book;
CREATE TRIGGER trg_revenue_book_numero
BEFORE INSERT ON revenue_book
FOR EACH ROW EXECUTE FUNCTION set_numero_sequentiel();

-- Trigger Sync Invoice -> Registry
CREATE OR REPLACE FUNCTION sync_purchase_registry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'achat' AND NEW.status = 'valide' THEN
    INSERT INTO purchase_registry (
      invoice_id, user_id, date_facture, fournisseur_nom, 
      numero_facture, montant_ht, tva_deductible, montant_ttc, periode_comptable
    ) VALUES (
      NEW.id, NEW.user_id, NEW.date_emission, NEW.fournisseur_nom,
      NEW.numero_facture, NEW.montant_ht, NEW.tva_details, NEW.montant_ttc,
      TO_CHAR(NEW.date_emission, 'YYYY-MM')
    )
    ON CONFLICT (invoice_id) DO UPDATE SET
      montant_ht = EXCLUDED.montant_ht,
      tva_deductible = EXCLUDED.tva_deductible,
      montant_ttc = EXCLUDED.montant_ttc,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invoices_to_registry ON invoices;
CREATE TRIGGER trg_invoices_to_registry
AFTER INSERT OR UPDATE ON invoices
FOR EACH ROW EXECUTE FUNCTION sync_purchase_registry();

-- RLS POLICIES (Example)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their invoices"
ON invoices FOR ALL
USING (auth.uid() = user_id);
-- Repeat RLS for all tables with user_id
