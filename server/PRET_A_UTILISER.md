# ✅ INTÉGRATION SUPABASE + STRIPE - PRÊTE

## 🎯 État actuel

### ✅ Ce qui est fait et configuré

| Élément | État | Détails |
|---------|------|---------|
| **Projet Supabase** | ✅ Configuré | `mgqwcuhlcsovbdihqfpd` |
| **Table BSD** | ✅ Existe déjà | Structure adaptée |
| **Code webhook** | ✅ Adapté | Utilise vos champs (`date_fin`, `date_fin_ts`, etc.) |
| **Authentification** | ✅ Prête | Routes `/api/auth/*` créées |
| **Paiements** | ✅ Prêts | Routes `/api/stripe/*` créées |
| **Middleware JWT** | ✅ Créé | Protection des routes |

---

## 🔧 Ce qu'il reste à configurer

### 1. SERVICE_ROLE_KEY (OBLIGATOIRE)

**Où** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/settings/api

**Action** :
1. Copiez la `service_role key`
2. Collez dans `server/.env` :

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. STRIPE_WEBHOOK_SECRET (OBLIGATOIRE)

**Où** : https://dashboard.stripe.com/test/webhooks

**Action** :
1. Créez un webhook ou utilisez l'existant
2. Copiez le "Signing secret" (commence par `whsec_...`)
3. Collez dans `server/.env` :

```env
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
```

**URL du webhook** :
```
https://votre-domaine.com/api/stripe/webhook
```

**Événements à écouter** :
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.paid`
- ✅ `invoice.payment_failed`

---

### 3. STRIPE PRICE IDs (OPTIONNEL)

**Où** : https://dashboard.stripe.com/test/products

**Action** (si vous avez des produits) :
1. Copiez les Price IDs
2. Collez dans `server/.env` :

```env
STRIPE_PRICE_ID_SUBSCRIPTION=price_...
STRIPE_PRICE_ID_SCAN_PAYMENT=price_...
```

---

## 🧪 Tester maintenant (sans Stripe)

Même sans configurer Stripe, vous pouvez tester l'authentification :

### 1. Démarrer le serveur

```bash
cd E:\PJS\bpa\server
npm run dev
```

### 2. Tester l'inscription

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'
```

### 3. Vérifier dans Supabase

**Lien** : https://supabase.com/dashboard/project/mgqwcuhlcsovbdihqfpd/editor

Vous devriez voir :
- ✅ Un nouvel utilisateur dans `auth.users`
- ✅ Un profil créé dans la table `bsd`

---

## 📡 API Endpoints

### Authentification

```
POST   /api/auth/signup          - Inscription
POST   /api/auth/signin          - Connexion
POST   /api/auth/signout         - Déconnexion
GET    /api/auth/me              - Infos utilisateur (protégé)
PUT    /api/auth/profile         - Mettre à jour profil (protégé)
```

### Stripe

```
POST   /api/stripe/create-checkout-session  - Créer session (protégé)
POST   /api/stripe/create-scan-payment      - Scan unique (protégé)
POST   /api/stripe/webhook                  - Webhook Stripe
GET    /api/stripe/customer                 - Infos client (protégé)
GET    /api/stripe/prices                   - Liste des prix
```

---

## 📖 Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `TABLE_BSD_CONFIGUREE.md` | 📋 Détails de votre table BSD |
| `GUIDE_FINALISATION.md` | 📖 Guide complet étape par étape |
| `RESUME_INTEGRATION.md` | 📝 Résumé de l'intégration |
| `src/services/tce/README.md` | 📚 Documentation API |
| `.env.example` | ⚙️ Exemple de configuration |

---

## ✅ Checklist finale

- [x] Code Supabase intégré
- [x] Table BSD existante détectée
- [x] Code adapté pour vos champs
- [x] Routes authentification créées
- [x] Routes Stripe configurées
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée
- [ ] `STRIPE_WEBHOOK_SECRET` configuré
- [ ] Webhook Stripe configuré dans le dashboard
- [ ] Test d'inscription réussi
- [ ] Test de paiement réussi

---

## 🎉 Une fois terminé

Votre système sera 100% opérationnel :

1. ✅ Les utilisateurs s'inscrivent via Supabase Auth
2. ✅ Un profil `bsd` est créé automatiquement
3. ✅ Les utilisateurs paient via Stripe Checkout
4. ✅ Les webhooks mettent à jour la table `bsd`
5. ✅ Vous suivez les abonnements et paiements

**Il ne vous reste plus qu'à ajouter les 2 clés manquantes !** 🚀
