# 💎 PÉPITES TCE - Fonctionnalités à intégrer dans BPA

## 🎯 Top 10 des meilleures fonctionnalités

Voici les fonctionnalités les plus intéressantes du projet **TCE Réponse Fin** que vous pouvez intégrer dans votre projet **BPA** :

---

## 1. 🏗️ Architecture Multi-Tenant (SaaS)

**Fichier** : `backend/server.js` - Route `/api/tenant-config`

### Description
Chaque artisan a sa **propre base de données Supabase** isolée !

### Code clé
```javascript
app.post('/api/tenant-config', async (req, res) => {
    // 1. Trouver l'utilisateur par email
    // 2. Chercher dans la table 'artisans'
    // 3. Renvoyer les clés Supabase personnalisées
    res.json({
        url: data.artisan_supabase_url,
        key: data.artisan_supabase_key
    });
});
```

### Comment l'intégrer dans BPA

**Table `artisans` à créer** :
```sql
CREATE TABLE artisans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    nom_societe TEXT,
    artisan_supabase_url TEXT,
    artisan_supabase_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Avantage** : Chaque client BPA a ses données isolées = parfait pour le SaaS !

---

## 2. 📱 Application Mobile React Native / Expo

**Dossier** : `frontend/`

### Fonctionnalités incluses
- ✅ Authentification Supabase
- ✅ Gestion clients/devis/factures
- ✅ Prise de photos (expo-image-picker)
- ✅ Génération PDF (expo-print)
- ✅ Navigation native (React Navigation)
- ✅ Stockage sécurisé (expo-secure-store)

### Comment l'intégrer

1. **Copier les composants** :
   ```
   e:\PJS\tce reponse fin\frontend\components\
   → E:\PJS\bpa\mobile\components\
   ```

2. **Copier les services** :
   ```
   e:\PJS\tce reponse fin\frontend\services\
   → E:\PJS\bpa\mobile\services\
   ```

3. **Copier les écrans** :
   ```
   e:\PJS\tce reponse fin\frontend\app\
   → E:\PJS\bpa\mobile\app\
   ```

---

## 3. 🧮 Calculateur de Devis Automatique

**Fichier** : `backend/server.js` - `/api/devis/calculate`

### Description
Calcule automatiquement les totaux HT, TVA, TTC avec remises.

### Code à récupérer
```javascript
app.post('/api/devis/calculate', (req, res) => {
    const { items, globalDiscount, globalDiscountType } = req.body;
    const result = calculateDevis(items, globalDiscount, globalDiscountType);
    res.json(result);
});
```

### Intégration dans BPA

Créer un service dans `server/src/services/devisService.ts` :

```typescript
export function calculateDevis(items: any[], discount?: number, type?: 'percent' | 'amount') {
  let totalHT = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (discount) {
    if (type === 'percent') {
      totalHT *= (1 - discount / 100);
    } else {
      totalHT -= discount;
    }
  }
  
  const tva = totalHT * 0.20;
  const totalTTC = totalHT + tva;
  
  return { totalHT, tva, totalTTC };
}
```

---

## 4. 📚 Bibliothèque de Prix (Catalogue)

**Fichier** : `backend/server.js` - `/api/catalogue/articles`

### Description
Catalogue des prix avec recherche et filtrage par catégorie.

### Tables nécessaires
```sql
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    designation TEXT,
    prix_unitaire NUMERIC(10,2),
    unite TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_designation ON articles(designation);
```

### API à copier
```typescript
// GET /api/catalogue/articles?category=peinture&search=primaire
app.get('/api/catalogue/articles', async (req, res) => {
    const { category, search } = req.query;
    let query = supabase.from('articles').select('*');
    
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('designation', `%${search}%`);
    
    const { data } = await query.limit(50);
    res.json(data);
});
```

---

## 5. 🎨 Génération PDF de Devis/Factures

**Fichier** : `backend/server.js` - `/api/devis/generate-pdf`

### Description
Génère des PDF professionnels pour les devis et factures.

### Comment l'intégrer

**Option 1** : Utiliser `expo-print` (mobile)
```typescript
import * as Print from 'expo-print';

const pdf = await Print.printToFileAsync({
  html: devisTemplateHTML,
  base64: false
});
```

**Option 2** : Utiliser `pdfmake` (backend)
```bash
npm install pdfmake
```

```typescript
import PdfPrinter from 'pdfmake';

const generatePDF = (devisData) => {
  const docDefinition = {
    content: [
      { text: 'DEVIS', style: 'header' },
      { text: `Client: ${devisData.client.nom}` },
      // ... items
      { text: `Total: ${devisData.totalTTC}€`, style: 'total' }
    ]
  };
  return printer.createPdfKitDocument(docDefinition);
};
```

---

## 6. 💳 Gestion des Encaissements

**Dossier** : `frontend/app/encaissements/`

### Description
Suivi des paiements reçus pour les factures.

### Table (déjà existante chez vous)
```sql
CREATE TABLE encaissements (
    id UUID PRIMARY KEY,
    facture_id UUID REFERENCES factures(id),
    montant NUMERIC(10,2),
    moyen_paiement TEXT CHECK (moyen_paiement IN ('virement', 'cheque', 'especes', 'CB')),
    date_paiement TIMESTAMPTZ DEFAULT NOW(),
    reference TEXT
);
```

### Fonctionnalités à copier
- Liste des encaissements par facture
- Ajout d'un encaissement partiel
- Calcul du reste à payer
- Historique des paiements

---

## 7. 📊 Tableau de Bord / Stats

**Dossier** : `frontend/app/stats/`

### Description
Statistiques de l'activité (CA, nombre de devis, etc.)

### Requetes SQL utiles
```sql
-- CA du mois
SELECT SUM(total_ttc) FROM factures 
WHERE statut = 'payee' 
AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());

-- Nombre de devis par statut
SELECT statut, COUNT(*) FROM devis 
GROUP BY statut;

-- Top clients
SELECT client_id, SUM(total_ttc) as ca 
FROM factures 
GROUP BY client_id 
ORDER BY ca DESC 
LIMIT 10;
```

---

## 8. 🔐 Fallback Mock DB (Mode Hors-Ligne)

**Fichier** : `backend/server.js`

### Description
Si Supabase échoue, le backend utilise une base mémoire locale.

### Code génial à copier
```javascript
// In-Memory Storage for Fallback
let mockClientsDB = [];
let mockDevisDB = [];

app.get('/api/clients', async (req, res) => {
    try {
        const { data } = await supabase.from('clients').select('*');
        res.json(data);
    } catch (error) {
        // Fallback to mock DB on crash
        console.warn("Supabase error, using mock DB");
        res.json(mockClientsDB);
    }
});
```

**Avantage** : Votre app ne plante jamais, même si Supabase est down !

---

## 9. 🤖 Intelligence Artificielle

**Dossier** : `frontend/app/ai/`

### Fonctionnalités possibles
- Génération de descriptions de travaux
- Estimation automatique de prix
- Classification de documents
- Chatbot d'assistance

### Intégration dans BPA

Vous avez déjà Gemini et DeepSeek configurés ! Ajoutez :

```typescript
// server/src/ai/devisAssistant.ts
export async function generateDevisDescription(items: string[]) {
  const response = await gemini.generateContent(`
    Génère une description professionnelle pour un devis contenant:
    ${items.join(', ')}
  `);
  return response.text();
}
```

---

## 10. 📲 Historique et Synchronisation

**Dossier** : `frontend/app/history/`

### Description
Historique des actions et synchronisation offline/online.

### Table à créer
```sql
CREATE TABLE user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action_type TEXT,
    entity_type TEXT,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_actions_user ON user_actions(user_id);
CREATE INDEX idx_user_actions_entity ON user_actions(entity_type, entity_id);
```

---

## 🎁 Bonus : Autres fonctionnalités intéressantes

### A. Gestion des Fournisseurs
**Dossier** : `frontend/app/fournisseurs/`

### B. CRM Clients
**Dossier** : `frontend/app/crm/`
- Suivi des prospects
- Relances automatiques
- Notes et commentaires

### C. Marketplace
**Dossier** : `frontend/app/marketplace/`
- Achat de matériaux
- Comparaison de prix

### D. QCM / Formation
**Dossier** : `frontend/app/QCM/`
- Quiz de formation
- Certification utilisateurs

### E. Chat en direct
**Dossier** : `frontend/app/chat/`
- Support client
- Messagerie interne

---

## 📋 Checklist d'intégration dans BPA

### Priorité 1 (Essentiel)
- [ ] Architecture Multi-Tenant (`artisans` table)
- [ ] Calculateur de Devis
- [ ] Bibliothèque de Prix (catalogue)
- [ ] Application Mobile (copier composants)

### Priorité 2 (Important)
- [ ] Génération PDF
- [ ] Gestion des Encaissements
- [ ] Tableau de Bord / Stats
- [ ] Fallback Mock DB

### Priorité 3 (Nice to have)
- [ ] IA pour descriptions
- [ ] Historique des actions
- [ ] CRM Clients
- [ ] Fournisseurs

---

## 🚀 Comment procéder

### Étape 1 : Copier les tables SQL
```bash
# Exécuter dans Supabase
type "e:\PJS\tce reponse fin\db_schema.sql"
```

### Étape 2 : Copier le code backend
```bash
# Routes API
xcopy "e:\PJS\tce reponse fin\backend\routes" "E:\PJS\bpa\server\src\routes" /E /I

# Services
xcopy "e:\PJS\tce reponse fin\backend\services" "E:\PJS\bpa\server\src\services" /E /I
```

### Étape 3 : Copier le frontend mobile
```bash
# Composants
xcopy "e:\PJS\tce reponse fin\frontend\components" "E:\PJS\bpa\mobile\components" /E /I

# Écrans
xcopy "e:\PJS\tce reponse fin\frontend\app" "E:\PJS\bpa\mobile\app" /E /I
```

---

## 📖 Références

- **Code source TCE** : `e:\PJS\tce reponse fin\`
- **Schema SQL** : `e:\PJS\tce reponse fin\db_schema.sql`
- **Documentation** : `e:\PJS\tce reponse fin\DOCUMENTATION_SYSTEME_PERMISSIONS.md`

---

**Votre projet BPA va devenir ultra-puissant avec ces fonctionnalités !** 🚀
