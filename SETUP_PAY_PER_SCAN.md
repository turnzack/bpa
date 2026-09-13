# 🚀 Configuration du Système Pay-Per-Scan

## État Actuel ✅

Votre application BPA a été mise à jour avec un système complet de paiement à l'usage (pay-per-scan).

### ✅ Implémenté

1. **Page de Login/Signup** 
   - Créée: `mobile/app/auth.tsx`
   - Authentification via Supabase
   - Création et connexion de comptes

2. **Endpoints API**
   - ✅ `POST /api/stripe/create-scan-payment` - Créer session de paiement
   - ✅ `POST /api/payments/check-scan-payment` - Vérifier paiement
   - ✅ `POST /api/ai/initiate-scan` - Initier un scan
   - ✅ `POST /api/stripe/webhook` - Webhook Stripe
   - ✅ Middleware d'authentification sur tous les endpoints

3. **Flow de Paiement**
   - L'utilisateur crée un compte
   - Sélectionne une image à scanner
   - Système initie un payment Stripe (1.99€)
   - Utilisateur paye via Stripe
   - Webhook confirme paiement
   - Accès à l'analyse accordé

## 🔧 Configuration Requise

### 1. Variables d'Environnement (.env du serveur)

Vérifiez/mettez à jour `e:\PJS\bpa\server\.env`:

```env
# Stripe (mise à jour)
STRIPE_SECRET_KEY=sk_test_51SFxtAH0UUxI7nCm...
STRIPE_WEBHOOK_SECRET=sk_test_51SFxtAH0UUxI7nCm...

# URLs de redirection (mise à jour)
FRONTEND_URL=http://localhost:8081
MOBILE_DEEP_LINK=bpa://scan

# Supabase (IMPORTANT - doit être configuré)
SUPABASE_MASTER_URL=https://your-project.supabase.co
SUPABASE_MASTER_SERVICE_KEY=your-service-key

# Mistral AI (optionnel pour le chat)
MISTRAL_API_KEY=sk-...
```

### 2. Configuration Supabase

Créez les tables de paiement dans Supabase:

```sql
-- Table scan_payments
CREATE TABLE scan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  stripe_payment_id TEXT UNIQUE,
  amount DECIMAL(10, 2) DEFAULT 1.99,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Table scan_attempts
CREATE TABLE scan_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  attempted_at TIMESTAMP DEFAULT now(),
  status TEXT DEFAULT 'pending_payment'
);

-- RLS Policies
ALTER TABLE scan_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON scan_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own attempts"
  ON scan_attempts FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Configuration Stripe Webhook

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Naviguez vers **Developers → Webhooks**
3. Cliquez sur **Add endpoint**
4. URL endpoint: `http://localhost:4000/api/stripe/webhook`
5. Événements à sélectionner:
   - `checkout.session.completed`
   - `checkout.session.expired`
6. Copier le **Webhook Secret** et le mettre dans `.env` comme `STRIPE_WEBHOOK_SECRET`

## 🚀 Démarrage

### Serveur Backend
```bash
cd e:\PJS\bpa\server
npm install
npm run build
npm start
# Écoute sur http://localhost:4000
```

### App Mobile (Expo)
```bash
cd e:\PJS\bpa\mobile
npm install
npm start
# Ouvrez l'app dans Expo Go
```

### Tester les Endpoints
```bash
node e:\PJS\bpa\server\test-api.js
```

## 📋 Flow Utilisateur Complet

### 1️⃣ Inscription/Connexion
```
App démarre → Auth Screen
↓
Entrée email/password
↓
Création compte ou connexion existante
↓
Redirection vers (tabs) home
```

### 2️⃣ Scan & Paiement
```
(tabs) home → Bouton "Scanner"
↓
Sélection image (caméra ou galerie)
↓
POST /api/ai/initiate-scan
↓
Reçoit scanId unique
↓
POST /api/stripe/create-scan-payment
↓
Redirection vers Stripe Checkout (1.99€)
↓
Utilisateur paye
↓
Webhook Stripe → Enregistre paiement
↓
App détecte payment_success via deep link
↓
POST /api/invoices/upload (analyse document)
```

### 3️⃣ Analyse & Résultats
```
Document uploadé avec scanId
↓
Système de paiement vérifie statut
↓
(Si payé) Analyse via Mistral/DeepSeek
↓
Résultats retournés
↓
Affichage dans (tabs) → Chat
```

## 🧪 Test manuel des Endpoints

### Flux d'authentification
```bash
# 1. Créer compte
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Résponse: { "session": {...}, "user": {...} }
# Sauvegardez le token: session.access_token
```

### Flux de paiement
```bash
# 2. Initier un scan (authentifié)
curl -X POST http://localhost:4000/api/ai/initiate-scan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'

# Résponse: { "scanId": "scan_...", "paymentRequired": true }

# 3. Créer session de paiement
curl -X POST http://localhost:4000/api/stripe/create-scan-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "scanId": "scan_..." }'

# Résponse: { "url": "https://checkout.stripe.com/..." }
# → Ouvrir l'URL dans navigateur pour payer
```

### Vérifier paiement
```bash
# 4. Vérifier si le paiement est enregistré
curl -X POST http://localhost:4000/api/payments/check-scan-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "scanId": "scan_..." }'

# Résponse: { "hasValidPayment": true }
```

## ⚠️ Problèmes Courants

### Port 4000 déjà utilisé
```bash
# Tuer le process
netstat -ano | findstr ":4000"
taskkill /PID <PID> /F
```

### Erreur Supabase
```
"SUPABASE_MASTER_URL is not configured"
```
→ Mettre à jour `.env` avec les vraies valeurs Supabase

### Erreur Stripe
```
"No signature supplied"
```
→ Vérifier que le Webhook Secret dans `.env` correspond au webhook Stripe

### Authentification échouée
```
"Invalid token"
```
→ Vérifier que le JWT est correct dans l'en-tête `Authorization: Bearer ...`

## 📱 Deep Linking (Mobile)

Le Stripe redirect utilise le deep link pour retourner à l'app:
```
✅ Success: bpa://scan/success?scanId=scan_...
✗ Cancel: bpa://scan/cancel?scanId=scan_...
```

L'app détecte automatiquement et:
- Affiche une alerte de succès
- Permet de continuer l'analyse
- Enregistre le paiement

## 🔐 Sécurité

- ✅ Tous les endpoints nécessitent l'authentification JWT
- ✅ Les paiements sont vérifiés côté serveur
- ✅ RLS Supabase protège l'accès aux données
- ✅ Stripe gère les données de carte bancaire (PCI-DSS)

## 📊 Monitoring

Pour voir les paiements enregistrés:
```sql
-- Supabase SQL Console
SELECT * FROM scan_payments WHERE status = 'completed';
SELECT * FROM scan_attempts WHERE status != 'pending_payment';
```

## 🎯 Prochaines Étapes

1. **Configurer les vraies clés Supabase** → sera nécessaire pour la production
2. **Tester avec un paiement Stripe réel** → utiliser Stripe Test Mode
3. **Deployer** → AWS, Railway, Render, etc.
4. **Analytics** → Suivre les taux de conversion
5. **Améliorer UX** → Animations, loading states, error messages

---

**Besoin d'aide?** Décrivez l'erreur et je vais corriger! 🚀
