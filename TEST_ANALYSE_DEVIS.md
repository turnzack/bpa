# Test d'analyse de devis avec l'IA BPA

## Fonctionnalités implémentées

### ✅ 1. Extraction des articles depuis un devis PDF/image
- OCR avec Mindee ou AWS Textract
- Extraction automatique des lignes de devis (désignation, quantité, prix, unité)
- Support de multiples formats de devis

### ✅ 2. Comparaison avec la bibliothèque de prix
- **Recherche intelligente multi-métiers** : L'IA détecte automatiquement le métier (électricité, plomberie, menuiserie, etc.)
- **Benchmark automatique** : Compare chaque article avec les prix de référence dans `E:\PJS\bpa\server\data\bibliotheque_prix.json`
- **Détection de métier** : Basée sur les mots-clés de la désignation

### ✅ 3. Analyse experte détaillée
L'IA fournit maintenant :

#### 📊 Analyse détaillée du devis
- Tableau comparatif article par article
- Prix du devis vs Prix de référence
- Écart en pourcentage
- Commentaire d'expert pour chaque ligne

#### ⚠️ Points d'attention & anomalies
- 🔴 Critique : Surcoût > 30% ou anomalie majeure
- 🟠 Attention : Surcoût 15-30%
- 🟡 Vérification : Surcoût 5-15%

#### 💰 Estimation globale
- Total Devis
- Total Prix Marché
- Écart global en € et %
- Appréciation (Très cher / Cher / Correct / Bon marché)

#### ✅ Verdict d'expert
- 🟢 BON POUR ACCORD / 🟠 ATTENTION NÉCESSAIRE / 🔴 À RENÉGOCIER
- Justification argumentée
- Recommandation principale

#### 📝 Conseils pour l'utilisateur
- Questions à poser à l'artisan
- Points à vérifier sur le chantier
- Alternatives économiques possibles

## Métiers supportés dans la bibliothèque

- ⚡ Électricité
- 🚰 Plomberie
- 🪚 Menuiserie
- 🎨 Peinture
- 🏠 Couverture
- 🧱 Maçonnerie
- 🔥 Isolation
- 🌡️ Chauffage
- 🏠 Aménagement de jardin
- 🏠 Sol

## Comment tester

### Via le chat mobile (recommandé)
1. Ouvrir l'application mobile BPA
2. Aller dans le chat IA
3. Cliquer sur 📎 ou 📷 pour uploader un devis PDF ou scanner un devis papier
4. L'IA analyse automatiquement et retourne l'audit complet

### Via API (développement)
```bash
POST http://localhost:4000/api/ai/chat
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body:
  file: <PDF ou image du devis>
```

## Exemple de réponse IA

```
J'ai bien reçu votre document "devis_electricite.pdf". Analyse en cours via BPA...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 **ANALYSE DÉTAILLÉE DU DEVIS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Article | Qté | Unité | Prix Devis | Prix Réf. | Écart | Analyse |
|---------|-----|-------|------------|-----------|-------|---------|
| Prise de courant 16A | 15 | U | 85.00 € | 45.00 € | +89% | Prix très élevé, qualité premium suspectée |
| Disjoncteur différentiel | 2 | U | 120.00 € | 95.00 € | +26% | Prix dans la fourchette haute |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ **POINTS D'ATTENTION & ANOMALIES**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 **Critique** : 
- Prise de courant 16A : +89% (85€ vs 45€ référence)
  → Demander la marque et la gamme exacte
  → Vérifier si la pose est incluse

🟠 **Attention** :
- Disjoncteur différentiel : +26%
  → Prix justifié si marque Legrand/Schneider

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 **ESTIMATION GLOBALE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- **Total Devis** : 3500 €
- **Total Prix Marché** : 2400 €
- **Écart Global** : +46% (+1100 €)
- **Appréciation** : Très cher

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ **VERDICT D'EXPERT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**🔴 À RENÉGOCIER**

**Justification** :
- Écart global de 46% au-dessus des prix du marché
- Certains articles sont jusqu'à 89% plus chers
- Des devis concurrents pourraient faire économiser 1000€+

**Recommandation principale** : Demander un détail précis des fournitures (marques, gammes) et comparer avec 2-3 autres devis.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 **CONSEILS POUR L'UTILISATEUR**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **Questions à poser à l'artisan** :
   - "Quelles sont les marques exactes des prises et disjoncteurs ?"
   - "Le prix inclut-il la pose et la mise en service ?"
   - "Pouvez-vous justifier l'écart de prix sur les prises de courant ?"

2. **Points à vérifier sur le chantier** :
   - Vérifier que les prises sont bien aux normes NF
   - Contrôler le nombre de circuits dédiés

3. **Alternatives économiques possibles** :
   - Prises de courant gamme standard (Legrand Céliane → Mosaic)
   - Regrouper certains circuits pour réduire le nombre de disjoncteurs
```

## Fichiers modifiés

- `server/src/services/PriceService.ts` - Ajout recherche multi-métiers
- `server/src/routes/aiRoutes.ts` - Amélioration prompt IA et benchmark
