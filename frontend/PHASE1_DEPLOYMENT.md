## 🚀 PHASE 1 — INSTRUCTIONS DE DÉPLOIEMENT MANUEL

### Étape A : Installer les dépendances

Ouvrez un terminal PowerShell dans `e:\v0reponses\v0-interface-versel\` et exécutez :

```powershell
pnpm add @neondatabase/serverless @node-rs/argon2 @vercel/node
```

### Étape B : Créer votre projet Neon PostgreSQL

1. Allez sur https://neon.tech et créez un compte/projet
2. Créez une base de données nommée `kirov5db`
3. Copiez votre `DATABASE_URL` depuis le dashboard Neon

### Étape C : Configurer les variables d'environnement locales

Créez un fichier `.env.local` (copié depuis `.env.local.example`) :

```powershell
Copy-Item .env.local.example .env.local
```

Puis éditez `.env.local` avec votre vraie `DATABASE_URL` Neon.

### Étape D : Exécuter les migrations SQL sur Neon

```powershell
$env:DATABASE_URL = "postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/kirov5db?sslmode=require"
node run-migrations.mjs
```

Ou depuis le Dashboard Neon (SQL Editor), exécutez chaque fichier dans l'ordre :
- `migrations/001_users.sql`
- `migrations/002_auth_sessions.sql`
- `migrations/003_device_sessions.sql`
- `migrations/004_password_reset_tokens.sql`
- `migrations/005_provider_credentials.sql`
- `migrations/006_quota_system.sql`

### Étape E : Configurer les variables sur Vercel

Dans Vercel Dashboard > Settings > Environment Variables, ajoutez (marqué Sensitive) :
- `DATABASE_URL` → Votre connection string Neon
- `DEEPSEEK_ENCRYPTION_KEY` → 32 octets hex aléatoires
- `CLOUDFLARE_WORKER_URL` → URL de votre Worker
- `CLOUDFLARE_WORKER_AUTH_SECRET` → Secret HMAC fort
- `SESSION_SECRET` → 64 caractères aléatoires

### Étape F : Vérifier le déploiement Vercel

```powershell
pnpm build
vercel deploy
```

Tester les routes :
- `GET https://votre-projet.vercel.app/api/auth/session`
- `POST https://votre-projet.vercel.app/api/auth/register`
- `POST https://votre-projet.vercel.app/api/auth/login`
