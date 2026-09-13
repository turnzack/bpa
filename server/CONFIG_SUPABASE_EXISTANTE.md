# 🔌 Configuration Supabase - Table existante

## ✅ Configuration actuelle

Votre projet Supabase **gprsutpgnezomoyfantx** est maintenant configuré dans BPA.

### Clés configurées

```env
SUPABASE_URL=https://gprsutpgnezomoyfantx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Vérifier la structure de votre table

Pour que l'intégration fonctionne parfaitement, nous devons connaître la structure de **votre table existante**.

### Option 1 : Exécuter le script de test

```bash
cd E:\PJS\bpa\server
npx ts-node scripts/test-supabase.ts
```

Cela affichera les tables disponibles et leurs colonnes.

### Option 2 : Vérifier dans le dashboard Supabase

1. Allez sur : https://supabase.com/dashboard/project/gprsutpgnezomoyfantx/editor
2. Notez le **nom de votre table** (ex: `bsd`, `users`, `customers`, etc.)
3. Notez les **colonnes** de la table

---

## 🔧 Adapter le code à votre table

Actuellement, le code utilise ces tables :

| Table | Utilité |
|-------|---------|
| `bsd` | Profils utilisateurs avec abonnements Stripe |
| `stripe_events` | Journal des événements webhook |
| `scan_payments` | Paiements de scans uniques |

### Si votre table a un nom différent

Par exemple, si votre table s'appelle `users` au lieu de `bsd`, dites-le moi et je mettrai à jour le code.

### Si votre table a des colonnes différentes

Donnez-moi la liste des colonnes et j'adapterai les requêtes.

**Exemple de structure attendue pour `bsd` :**

```sql
id              (BIGINT, primary key)
user_id         (UUID, référence auth.users)
user_email      (TEXT)
statut          (TEXT: 'inactive', 'active', 'cancelled')
stripe_customer_id  (TEXT, unique)
stripe_subscription_id (TEXT, unique)
subscription_end_date (TIMESTAMPTZ)
```

---

## 🧪 Tester l'authentification

### 1. Inscription

```bash
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'
```

### 2. Connexion

```bash
curl -X POST http://localhost:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bpa.com","password":"Test123!"}'
```

### 3. Créer une session de paiement

```bash
curl -X POST http://localhost:4000/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN" \
  -d '{
    "priceId": "price_123456",
    "successUrl": "http://localhost:8081/success",
    "cancelUrl": "http://localhost:8081/cancel"
  }'
```

---

## 📝 Prochaines étapes

1. **Dites-moi le nom de votre table existante** (si ce n'est pas `bsd`)
2. **Donnez-moi la structure des colonnes** (si différente)
3. **Testez l'authentification** avec les commandes ci-dessus

---

## 🔍 Besoin d'aide ?

Si vous avez des questions ou besoin d'adapter le code à votre structure existante, dites-le moi !
