# BPA - Application Autonome (FactureScan)

Ce dossier contient une version complète et autonome du projet **FactureScan**, incluant le frontend mobile et le backend nécessaire à son fonctionnement.

## Structure du Projet
- `/mobile` : Application Expo (React Native) pour le scan et la validation des factures.
- `/server` : Serveur Node.js gérant l'OCR, l'IA et la base de données.

## Installation Rapide

1. **Dépendances** :
   ```bash
   pnpm install
   ```

2. **Configuration** :
   - Le fichier `server/.env` contient la configuration du backend (Supabase, etc.).
   - Le fichier `mobile/.env` contient l'URL du backend (`http://localhost:4000` par défaut).

3. **Lancement** :
   Pour lancer les deux parties en simultané :
   ```bash
   npm run dev:all
   ```

## Fonctionnalités
- Scan de factures via mobile.
- Extraction OCR intelligente.
- Système multi-tenant sécurisé.
- Validation manuelle des données.

---
*Généré automatiquement par Antigravity pour une architecture autonome.*
