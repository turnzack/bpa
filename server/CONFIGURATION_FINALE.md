# ⚙️ Configuration Finale - Projet BPA + Supabase

## ✅ Projet Supabase configuré

| Élément | Valeur |
|---------|--------|
| **Projet** | `mgqwcuhlcsovbdihqfpd` |
| **URL** | `https://mgqwcuhlcsovbdihqfpd.supabase.co` |
| **Anon Key** | ✅ Configurée |
| **Tables existantes** | `entreprises`, `clients`, `devis`, `factures`, `encaissements` |

---

## 🔧 Fichiers mis à jour

### 1. `.env`

```env
SUPABASE_URL=https://mgqwcuhlcsovbdihqfpd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=À_REMPLIR
```

### 2. `src/config/supabase.ts`

Mis à jour avec la nouvelle URL et les nouvelles tables.

---

## 📋 Tables Supabase existantes

Votre projet utilise cette structure :

```
├── entreprises (profil artisan)
│   ├── id (UUID)
│   ├── user_id (UUID) → auth.users
│   ├── nom_societe, siret, ape, email, adresse...
│   └── created_at, updated_at
│
├── clients
│   ├── id (UUID)
│   ├── user_id (UUID) → auth.users
│   ├── type (particulier/pro)
│   └── nom, prenom, email, adresse...
│
├── devis
│   ├── id (UUID)
│   ├── user_id (UUID)
│   ├── client_id (UUID) → clients
│   ├── statut, items (JSONB), total_ht/ttc
│   └── numero (auto: DEV-YYYY-NNNN)
│
├── factures
│   ├── id (UUID)
│   ├── user_id (UUID)
│   ├── client_id (UUID) → clients
│   ├── type_facture (finale/acompte/avoir)
│   ├── statut, items (JSONB), total_ht/ttc
│   └── numero (auto: FACT-YYYY-NNNN)
│
└── encaissements
    ├── id (UUID)
    ├── facture_id (UUID) → factures
    ├── montant, moyen_paiement, date_paiement
    └── reference, notes
```

---

## 🔑 Récupérer la SERVICE_ROLE_KEY

Pour que l'intégration Stripe fonctionne, vous avez besoin de la **service_role key**.

### Étapes :

1. Allez sur : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/settings/api

2. Copiez la **service_role key** (clé secrète)

3. Collez-la dans `server/.env` :

```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

⚠️ **Important** : Ne partagez jamais cette clé !

---

## 🔄 Adapter le code pour vos tables

Le code TCE utilise la table `bsd`. Pour utiliser vos tables existantes, voici les modifications :

### Option 1 : Ajouter la table `bsd` pour Stripe

Exécutez ce script SQL minimaliste :

```sql
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

-- Index
CREATE INDEX IF NOT EXISTS idx_bsd_user_id ON bsd(user_id);
CREATE INDEX IF NOT EXISTS idx_bsd_stripe_customer_id ON bsd(stripe_customer_id);

-- RLS
ALTER TABLE bsd ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON bsd FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" ON bsd FOR ALL 
    USING (auth.jwt()->>'role' = 'service_role');

-- Trigger updated_at
CREATE TRIGGER update_bsd_updated_at BEFORE UPDATE ON bsd
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Option 2 : Utiliser la table `entreprises` pour Stripe

Je peux modifier le code pour ajouter les colonnes Stripe dans `entreprises` :

```sql
-- Ajouter les colonnes Stripe à entreprises
ALTER TABLE entreprises 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS abonnement_statut TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
```

---

## 🧪 Tester la connexion

Après avoir ajouté la `SERVICE_ROLE_KEY` :

```bash
cd E:\PJS\bpa\server
npm run dev
```

Puis testez :

```bash
# Santé du serveur
curl http://localhost:4000/health

# Inscription
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'
```

---

## 📝 Prochaines étapes

1. **Récupérer la SERVICE_ROLE_KEY** depuis le dashboard Supabase
2. **Choisir l'option pour Stripe** :
   - Option 1 : Créer la table `bsd` (recommandé, plus propre)
   - Option 2 : Modifier la table `entreprises`
3. **Configurer Stripe** (webhook, prix)

---

## 📞 Besoin d'aide ?

Dites-moi quelle option vous préférez et je mettrai à jour le code !
