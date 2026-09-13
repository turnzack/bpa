# 🎯 Guide de Finalisation - Intégration Stripe + Supabase

## ✅ Ce qui est fait

- [x] Code Supabase intégré dans BPA
- [x] Routes d'authentification créées
- [x] Routes Stripe configurées
- [x] Webhooks Stripe prêts
- [x] Configuration Supabase : `mgqwcuhlcsovbdihqfpd`

---

## 📋 3 étapes pour finaliser

### ÉTAPE 1 : Exécuter le script SQL dans Supabase

1. **Allez sur** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/sql/new

2. **Ouvrez le fichier** : `E:\PJS\bpa\server\scripts\create-stripe-tables.sql`

3. **Copiez-collez** tout le contenu dans l'éditeur SQL

4. **Cliquez sur "RUN"**

✅ Cela va créer :
- Table `bsd` (abonnements Stripe)
- Table `stripe_events` (journal webhooks)
- Table `scan_payments` (paiements scans)
- Triggers et politiques RLS

---

### ÉTAPE 2 : Récupérer la SERVICE_ROLE_KEY

1. **Allez sur** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/settings/api

2. **Trouvez** : `service_role key` (clé secrète)

3. **Copiez-la**

4. **Ouvrez** : `E:\PJS\bpa\server\.env`

5. **Remplacez** :
```env
SUPABASE_SERVICE_ROLE_KEY=votre_clé_copiée_ici
```

⚠️ **Important** : Cette clé est secrète, ne la partagez jamais !

---

### ÉTAPE 3 : Configurer Stripe Webhook

#### A. Récupérer le secret du webhook

1. **Allez sur** : https://dashboard.stripe.com/test/webhooks

2. **Cliquez sur** "Add endpoint" (ou sélectionnez votre webhook existant)

3. **Configuration** :
   - **Endpoint URL** : `https://votre-domaine.com/api/stripe/webhook`
   - **Événements à écouter** :
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.paid`
     - ✅ `invoice.payment_failed`

4. **Copiez** le "Signing secret" (commence par `whsec_...`)

5. **Collez-le** dans `E:\PJS\bpa\server\.env` :
```env
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
```

#### B. En local (pour tester les webhooks)

Installez Stripe CLI :

```bash
# Windows (avec Chocolatey)
choco install stripe-cli

# Ou téléchargez : https://github.com/stripe/stripe-cli/releases

# Puis connectez-vous
stripe login

# Écoutez les webhooks
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

---

### ÉTAPE 4 : Récupérer les Price IDs Stripe

1. **Allez sur** : https://dashboard.stripe.com/test/products

2. **Créez vos produits** (ou utilisez ceux existants) :
   - Un produit pour l'abonnement (prix récurrent)
   - Un produit pour le scan unique (prix unique)

3. **Copiez les Price IDs** (commencent par `price_...`)

4. **Collez-les** dans `E:\PJS\bpa\server\.env` :
```env
STRIPE_PRICE_ID_SUBSCRIPTION=price_1234567890
STRIPE_PRICE_ID_SCAN_PAYMENT=price_0987654321
```

---

## 🧪 Tester l'intégration

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

### 3. Vérifier les tables Supabase

**Allez sur** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/editor

Vérifiez que les tables existent :
- ✅ `bsd`
- ✅ `stripe_events`
- ✅ `scan_payments`

---

## 📡 API Endpoints disponibles

### Authentification (`/api/auth`)

```
POST   /api/auth/signup          - Inscription
POST   /api/auth/signin          - Connexion
POST   /api/auth/signout         - Déconnexion
POST   /api/auth/refresh         - Rafraîchir token
POST   /api/auth/forgot-password - Réinitialisation
GET    /api/auth/me              - Infos utilisateur (protégé)
PUT    /api/auth/profile         - Mettre à jour profil (protégé)
GET    /api/auth/session         - Vérifier session (protégé)
```

### Stripe (`/api/stripe`)

```
POST   /api/stripe/create-checkout-session  - Créer session paiement (protégé)
POST   /api/stripe/create-scan-payment      - Paiement scan unique (protégé)
POST   /api/stripe/webhook                  - Webhook Stripe
GET    /api/stripe/customer                 - Infos client Stripe (protégé)
GET    /api/stripe/prices                   - Liste des prix
POST   /api/stripe/portal-session           - Portail client (protégé)
```

---

## 🔍 Résolution de problèmes

### Erreur: "SUPABASE_SERVICE_ROLE_KEY manquante"

**Solution** : Ajoutez la clé dans `.env` (voir ÉTAPE 2)

### Erreur: "Webhook signature failed"

**Solution** : Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond au webhook Stripe

### Erreur: "relation 'bsd' does not exist"

**Solution** : Exécutez le script SQL (voir ÉTAPE 1)

### Erreur: "No customer found"

**Solution** : Le customer Stripe sera créé automatiquement lors du premier paiement

---

## ✅ Checklist finale

- [ ] Script SQL exécuté dans Supabase
- [ ] Tables `bsd`, `stripe_events`, `scan_payments` créées
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée dans `.env`
- [ ] `STRIPE_WEBHOOK_SECRET` configuré dans `.env`
- [ ] `STRIPE_PRICE_ID_*` configurés dans `.env`
- [ ] Webhook Stripe configuré dans le dashboard Stripe
- [ ] Test d'inscription réussi
- [ ] Test de connexion réussi

---

## 📚 Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `scripts/create-stripe-tables.sql` | Script SQL à exécuter |
| `src/services/tce/README.md` | Documentation API complète |
| `src/routes/authRoutes.ts` | Routes d'authentification |
| `src/routes/stripeRoutes.ts` | Routes Stripe |
| `src/middleware/auth.middleware.ts` | Middleware JWT |

---

## 🎉 Une fois cette checklist complétée...

Votre système de paiement Stripe avec authentification Supabase est **100% opérationnel** !

Les utilisateurs pourront :
1. ✅ S'inscrire et se connecter
2. ✅ Souscrire à un abonnement via Stripe
3. ✅ Payer pour des scans uniques
4. ✅ Gérer leur abonnement depuis le portail Stripe

**Bon déploiement !** 🚀
