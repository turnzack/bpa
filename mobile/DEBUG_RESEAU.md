# 🔧 Résolution: Erreur "Network request failed" sur Android

## ❌ Problème

L'erreur `TypeError: Network request failed` se produit car sur **Android**, `localhost` pointe vers **l'appareil Android**, pas votre PC !

---

## ✅ Solution appliquée

### 1. Fichier `.env` créé

**Fichier** : `E:\PJS\bpa\mobile\.env`

```env
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.148:4000
EXPO_PUBLIC_MASTER_SUPABASE_URL=https://mgqwcuhlcsovbdihqfpd.supabase.co
EXPO_PUBLIC_MASTER_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Configuration mise à jour

**Fichier** : `E:\PJS\bpa\mobile\constants\Config.ts`

```typescript
export const CONFIG = {
    BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.148:4000',
    MASTER_SUPABASE_URL: 'https://mgqwcuhlcsovbdihqfpd.supabase.co',
    MASTER_SUPABASE_ANON_KEY: '...'
};
```

---

## 🚀 Étapes pour tester

### Étape 1: Redémarrer le backend

```bash
cd E:\PJS\bpa\server
npm run dev
```

✅ Le serveur doit démarrer sur le port 4000

### Étape 2: Redémarrer l'app mobile avec cache clean

```bash
cd E:\PJS\bpa\mobile

# Clear cache et redémarrer
npx expo start -c
```

### Étape 3: Tester l'authentification

1. Ouvrez l'app sur Android
2. Allez dans l'écran de connexion
3. Entrez email et mot de passe
4. Cliquez sur "Se connecter"

---

## 🔍 Si ça ne marche toujours pas

### Vérification 1: Backend accessible

Depuis votre PC :

```bash
curl http://localhost:4000/health
```

Depuis un autre appareil sur le même réseau :

```bash
curl http://192.168.1.148:4000/health
```

**Résultat attendu** :
```json
{"ok": true}
```

### Vérification 2: Firewall Windows

Le firewall Windows peut bloquer les connexions entrantes.

**Solution** :

1. Ouvrez **Pare-feu Windows**
2. Cliquez sur **"Autoriser une application"**
3. Cherchez **Node.js** ou **node.exe**
4. Cochez **Privé** et **Public**
5. Cliquez sur **OK**

Ou en PowerShell (admin) :

```powershell
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow
```

### Vérification 3: IP a changé ?

Votre IP locale peut changer si vous redémarrez le routeur.

**Vérifier l'IP** :

```bash
ipconfig | findstr /i "IPv4"
```

**Mettre à jour** dans `mobile/.env` :

```env
EXPO_PUBLIC_BACKEND_URL=http://NOUVELLE_IP:4000
```

### Vérification 4: Supabase configuré ?

Assurez-vous que votre projet Supabase est actif :

**Test direct** :
```bash
curl https://mgqwcuhlcsovbdihqfpd.supabase.co/rest/v1/
```

---

## 📱 Sur iOS (iPhone)

Sur iOS, vous pouvez utiliser `localhost` car le simulateur partage le réseau du Mac.

Mais sur **appareil physique**, utilisez aussi l'IP locale.

---

## 🌐 En production

Quand vous déploierez l'app :

1. **Backend** : Déployez sur un serveur (Heroku, Railway, Vercel, etc.)
2. **Mettez à jour** `.env` :

```env
EXPO_PUBLIC_BACKEND_URL=https://votre-api.herokuapp.com
```

3. **Rebuild** l'app :

```bash
eas build --platform android
```

---

## 🧪 Autres tests

### Test 1: Auth Supabase directe

```typescript
// Dans la console Expo
import { masterSupabase } from './services/authService';

const { data, error } = await masterSupabase.auth.signInWithPassword({
  email: 'test@bpa.com',
  password: 'Test123!'
});

console.log(data, error);
```

### Test 2: API Backend

```typescript
const response = await fetch('http://192.168.1.148:4000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@bpa.com',
    password: 'Test123!'
  })
});

const data = await response.json();
console.log(data);
```

---

## ✅ Checklist de débogage

- [ ] Backend démarré sur le port 4000
- [ ] Fichier `mobile/.env` créé avec la bonne IP
- [ ] Cache Expo clean (`npx expo start -c`)
- [ ] Firewall Windows autorisé le port 4000
- [ ] PC et mobile sur le même réseau WiFi
- [ ] IP locale correcte (192.168.1.148)
- [ ] Projet Supabase actif et accessible

---

## 🆘 Besoin d'aide ?

Si le problème persiste, vérifiez :

1. **Logs du backend** : Y a-t-il des erreurs ?
2. **Logs de l'app** : `adb logcat` pour Android
3. **Connexion réseau** : PC et mobile sur le même WiFi ?

---

**Une fois configuré, l'authentification devrait fonctionner parfaitement !** 🎉
