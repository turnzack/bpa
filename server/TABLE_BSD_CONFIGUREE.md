# ✅ Table BSD - Déjà configurée

## 📋 Structure de votre table BSD

Votre table `bsd` existe déjà avec cette structure :

```sql
CREATE TABLE public.bsd (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  nom text,
  
  -- Champs Stripe
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,
  stripe_plan_id text,
  
  -- Statut et dates
  statut text CHECK (statut IN ('inactive', 'active', 'trialing')),
  date_debut text,
  date_fin text,
  date_debut_ts timestamp with time zone,
  date_fin_ts timestamp with time zone,
  subscription_end_date timestamp with time zone,
  annuler_en_fin_de_periode boolean,
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## ✅ Code adapté

Le code a été **automatiquement adapté** pour utiliser vos champs :

### Champs mappés

| Champ TCE original | Champ votre table |
|-------------------|-------------------|
| `statut` | `statut` ✅ |
| `stripe_customer_id` | `stripe_customer_id` ✅ |
| `stripe_subscription_id` | `stripe_subscription_id` ✅ |
| `subscription_end_date` | `subscription_end_date` + `date_fin` + `date_fin_ts` ✅ |
| - | `annuler_en_fin_de_periode` ✅ |
| - | `nom` ✅ |

### Mises à jour effectuées

Quand un webhook Stripe arrive, le code met à jour :

```typescript
{
  statut: subscription.status,
  subscription_end_date: new Date(...),
  date_fin: new Date(...),           // Votre champ
  date_fin_ts: new Date(...),        // Votre champ
  annuler_en_fin_de_periode: ...,    // Votre champ
  updated_at: new Date(...)          // Votre champ
}
```

---

## 🔧 Ce dont vous avez encore besoin

### 1. SERVICE_ROLE_KEY

**Lien** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/settings/api

```env
# Dans server/.env
SUPABASE_SERVICE_ROLE_KEY=votre_clé_ici
```

### 2. STRIPE_WEBHOOK_SECRET

**Lien** : https://dashboard.stripe.com/test/webhooks

```env
# Dans server/.env
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
```

### 3. Tables supplémentaires (optionnel)

Pour un système complet, vous pouvez ajouter :

```sql
-- Table pour journaliser les webhooks Stripe
CREATE TABLE IF NOT EXISTS public.stripe_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'processing',
    note TEXT
);

-- Table pour les paiements de scans uniques
CREATE TABLE IF NOT EXISTS public.scan_payments (
    id BIGSERIAL PRIMARY KEY,
    scan_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    user_email TEXT,
    stripe_payment_id TEXT,
    amount DECIMAL(10, 2) DEFAULT 1.99,
    currency TEXT DEFAULT 'eur',
    status TEXT DEFAULT 'pending',
    paid_at TIMESTAMPTZ
);
```

---

## 🧪 Tester

### 1. Démarrer le serveur

```bash
cd E:\PJS\bpa\server
npm run dev
```

### 2. Tester l'authentification

```bash
# Inscription
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'

# Connexion
curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'
```

### 3. Vérifier dans Supabase

**Lien** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/editor

Vérifiez que :
- ✅ La table `bsd` existe
- ✅ Un profil est créé automatiquement à l'inscription

---

## 📡 Flux de paiement

### Abonnement

```
1. Utilisateur clique "S'abonner"
2. POST /api/stripe/create-checkout-session
   → Crée customer Stripe si inexistant
   → Met à jour bsd.stripe_customer_id
3. Redirection vers Stripe Checkout
4. Paiement validé
5. Stripe webhook → POST /api/stripe/webhook
6. Webhook met à jour bsd :
   - statut: 'active' ou 'trialing'
   - stripe_subscription_id: sub_...
   - subscription_end_date, date_fin, date_fin_ts
   - annuler_en_fin_de_periode: false
```

### Paiement unique (Scan)

```
1. Utilisateur clique "Payer le scan"
2. POST /api/stripe/create-scan-payment
3. Redirection vers Stripe Checkout
4. Paiement validé
5. Stripe webhook → handleScanPaymentSuccess
6. Insert dans scan_payments (si table créée)
```

---

## ✅ Checklist

- [x] Table `bsd` existe avec la bonne structure
- [x] Code adapté pour vos champs
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée
- [ ] `STRIPE_WEBHOOK_SECRET` configuré
- [ ] Webhook Stripe configuré dans le dashboard
- [ ] Test d'inscription réussi
- [ ] Test de paiement réussi

---

## 📖 Références

- `server/src/services/tce/checkout-session.service.ts` - Création sessions
- `server/src/services/tce/stripe-webhook.service.ts` - Gestion webhooks
- `server/src/routes/stripeRoutes.ts` - Routes API
- `server/GUIDE_FINALISATION.md` - Guide complet
