# Intégration Supabase + Stripe dans BPA

Ce dossier contient l'intégration complète de Supabase (Auth & Database) et Stripe (Paiements & Abonnements) adaptée depuis le repo TCE pour fonctionner avec Express.js (Node.js).

## 📁 Structure des fichiers

```
server/src/
├── config/
│   └── supabase.ts              # Client Supabase configuré
├── services/
│   ├── tce/                      # Services intégrés depuis TCE
│   │   ├── stripe-webhook.service.ts
│   │   └── checkout-session.service.ts
│   └── stripeService.ts          # Service Stripe existant
├── routes/
│   ├── authRoutes.ts             # Authentification Supabase
│   └── stripeRoutes.ts           # Routes Stripe + Webhooks
└── middleware/
    └── auth.middleware.ts        # Middleware d'authentification
```

## 🚀 Configuration

### 1. Variables d'environnement

Ajoutez dans `server/.env` :

```env
# SUPABASE
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role

# STRIPE
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_SUBSCRIPTION=price_...
STRIPE_PRICE_ID_SCAN_PAYMENT=price_...

# FRONTEND
FRONTEND_URL=http://localhost:8081
```

### 2. Base de données Supabase

Exécutez le script SQL dans le dashboard Supabase :

```bash
# Copiez le contenu de server/scripts/supabase-schema.sql
# Collez-le dans : Supabase Dashboard > SQL Editor > Run
```

Ce script crée :
- Table `bsd` : Profils d'abonnement des utilisateurs
- Table `stripe_events` : Journal des événements webhook
- Table `scan_payments` : Historique des paiements de scans
- Vues utiles et politiques RLS

## 📡 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/signup` | Inscription email/mot de passe | ❌ |
| POST | `/signin` | Connexion | ❌ |
| POST | `/signout` | Déconnexion | ✅ |
| POST | `/refresh` | Rafraîchir token | ❌ |
| POST | `/forgot-password` | Demander réinitialisation | ❌ |
| POST | `/reset-password` | Réinitialiser mot de passe | ❌ |
| GET | `/me` | Infos utilisateur connecté | ✅ |
| PUT | `/profile` | Mettre à jour profil | ✅ |
| GET | `/session` | Vérifier session | ✅ |

### Stripe (`/api/stripe`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/create-checkout-session` | Créer session paiement | ✅ |
| POST | `/create-scan-payment` | Créer session scan unique | ✅ |
| POST | `/webhook` | Webhook Stripe | ❌ |
| GET | `/customer` | Infos client Stripe | ✅ |
| GET | `/prices` | Liste des prix | ❌ |
| POST | `/portal-session` | Portail client Stripe | ✅ |

## 🔐 Utilisation

### Inscription / Connexion

```typescript
// Inscription
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123"
}

// Connexion
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123"
}

// Réponse:
{
  "user": { "id": "...", "email": "..." },
  "session": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 3600
  }
}
```

### Créer un paiement

```typescript
POST /api/stripe/create-checkout-session
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "priceId": "price_123456",
  "successUrl": "http://localhost:8081/success",
  "cancelUrl": "http://localhost:8081/cancel"
}
```

### Gérer le webhook Stripe

Configurez votre webhook Stripe pour pointer vers :
```
https://votre-domaine.com/api/stripe/webhook
```

Événements gérés :
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

## 🔄 Flux typique

### 1. Inscription et abonnement

```
1. Utilisateur s'inscrit → POST /api/auth/signup
2. Utilisateur se connecte → POST /api/auth/signin
3. Frontend stocke accessToken
4. Utilisateur clique "S'abonner"
5. Frontend appelle → POST /api/stripe/create-checkout-session
6. Redirection vers Stripe Checkout
7. Paiement validé → Stripe redirige vers successUrl
8. Stripe appelle webhook → POST /api/stripe/webhook
9. Webhook met à jour table `bsd` → statut: 'active'
```

### 2. Paiement unique (Scan)

```
1. Utilisateur authentifié
2. Frontend appelle → POST /api/stripe/create-scan-payment
3. Redirection vers Stripe Checkout
4. Paiement validé
5. Webhook met à jour `scan_payments` → status: 'completed'
```

## 🛠️ Développement

### Build du serveur

```bash
cd server
npm run build
```

### Mode développement

```bash
cd server
npm run dev
```

### Tester les webhooks en local

Utilisez Stripe CLI :

```bash
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

## 📝 Notes

- Le middleware `authenticateUser` vérifie le token JWT Supabase
- Le service role Supabase bypass les politiques RLS
- Les tokens d'accès expirent après 1 heure (3600s)
- Utilisez le refresh token pour obtenir un nouvel accessToken

## 🔗 Références

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
