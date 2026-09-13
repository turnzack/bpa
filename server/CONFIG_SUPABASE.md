# ⚙️ Configuration Supabase - Projet gprsutpgnezomoyfantx

## 📋 Étapes de configuration

### 1️⃣ Récupérer vos clés API

1. **Allez sur** : https://supabase.com/dashboard/project/gprsutpgnezomoyfantx/settings/api

2. **Notez ces valeurs** :
   ```
   Project URL: https://gprsutpgnezomoyfantx.supabase.co
   service_role key: (clé secrète - à copier)
   anon/public key: (clé publique)
   ```

---

### 2️⃣ Exécuter le script SQL

1. **Allez sur** : https://supabase.com/dashboard/project/gprsutpgnezomoyfantx/sql/new

2. **Copiez-collez** le script ci-dessous (ou le contenu de `server/scripts/supabase-schema.sql`)

3. **Cliquez sur "Run"**

---

### 3️⃣ Mettre à jour le fichier .env

Dans `E:\PJS\bpa\server\.env`, remplacez :

```env
# SUPABASE
SUPABASE_URL=https://gprsutpgnezomoyfantx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE_ICI

# STRIPE
STRIPE_SECRET_KEY=sk_test_placeholder_remplacez_par_votre_vrai_secret
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_STRIPE

# FRONTEND
FRONTEND_URL=http://localhost:8081
```

---

### 4️⃣ Configurer Stripe Webhook

1. **Allez sur** : https://dashboard.stripe.com/test/webhooks

2. **Cliquez sur "Add endpoint"**

3. **Configuration** :
   - **Endpoint URL** : `https://votre-domaine.com/api/stripe/webhook`
   - **Events to send** :
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.paid`
     - ✅ `invoice.payment_failed`

4. **Copiez le "Signing secret"** dans `.env` :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 🧪 Tester l'intégration

### Test 1 : Vérifier la connexion Supabase

```bash
cd E:\PJS\bpa\server
npm run dev
```

Puis testez :

```bash
# Santé du serveur
curl http://localhost:4000/health

# Créer un utilisateur de test
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'
```

### Test 2 : Vérifier les tables dans Supabase

1. **Allez sur** : https://supabase.com/dashboard/project/gprsutpgnezomoyfantx/editor

2. **Vérifiez les tables** :
   - ✅ `bsd`
   - ✅ `stripe_events`
   - ✅ `scan_payments`

---

## 🔍 Résolution de problèmes

### Problème : "Supabase Config missing"

**Solution** : Vérifiez que `.env` contient :
```env
SUPABASE_URL=https://gprsutpgnezomoyfantx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Problème : "Webhook signature failed"

**Solution** :
1. Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond au webhook Stripe
2. En local, utilisez Stripe CLI :
   ```bash
   stripe listen --forward-to localhost:4000/api/stripe/webhook
   ```

### Problème : "Table does not exist"

**Solution** : Réexécutez le script SQL dans Supabase Dashboard

---

## 📚 Liens utiles

- **Dashboard Supabase** : https://supabase.com/dashboard/project/gprsutpgnezomoyfantx
- **Dashboard Stripe** : https://dashboard.stripe.com/test
- **Documentation API** : `server/src/services/tce/README.md`

---

## ✅ Checklist de configuration

- [ ] Récupéré la `service_role key` depuis Supabase
- [ ] Exécuté le script SQL dans Supabase
- [ ] Vérifié les tables `bsd`, `stripe_events`, `scan_payments`
- [ ] Mis à jour `server/.env` avec `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Configuré le webhook Stripe
- [ ] Testé l'endpoint `/api/auth/signup`
- [ ] Testé l'endpoint `/api/stripe/create-checkout-session`

---

**Une fois cette checklist complétée, votre intégration est opérationnelle !** 🎉
