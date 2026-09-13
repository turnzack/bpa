# FACTURESCAN SOUVERAIN

## Contexte

Ce projet est une **élévation technologique** de l'ancien projet local `E:\PJS\bpa`. L'ancien projet était une application mobile (Expo/React Native) avec un backend Node.js, intégrant de l'IA (YOLOv8, Real-ESRGAN, Gemma 2B) pour le scan et l'analyse de factures. L'objectif est de **moderniser** cette base en une **plateforme autonome de gestion documentaire intelligente**, avec une architecture multi-tenant, des paiements intégrés et une IA embarquée pour la souveraineté des données.

## Objectifs

- **Souveraineté numérique** : Traitement local des documents, IA on-device, fonctionnement hors-ligne.
- **Autonomie** : Pipeline complet de scan → OCR → analyse → validation → paiement.
- **Monétisation** : Abonnements (Stripe) et paiement à l'usage.
- **Multi-tenant** : Isolation des données par organisation.

## Architecture

- **Frontend** : Application mobile React Native (Expo SDK 54) avec navigation par onglets, écrans de scan, validation, historique, profil.
- **Backend** : Serveur Node.js (Express) exposant des APIs REST pour l'authentification, le traitement des documents, les paiements.
- **IA** :
  - **YOLOv8** : Détection d'objets (factures, documents) dans les images.
  - **Real-ESRGAN** : Amélioration de la résolution des images.
  - **Gemma 2B** : Analyse contextuelle et extraction de données structurées.
- **Base de données** : Supabase (PostgreSQL) avec authentification et stockage.
- **Paiements** : Stripe pour les abonnements et les paiements à l'usage.

## Fonctionnalités principales

1. **Scan de documents** : Capture photo ou import depuis la galerie.
2. **Prétraitement d'image** : Détection de flou, amélioration de résolution.
3. **OCR** : Extraction de texte (via Tesseract ou services cloud).
4. **Analyse IA** : Extraction de champs (montant, date, fournisseur) via Gemma.
5. **Validation** : Interface de validation manuelle des données extraites.
6. **Paiement** : Intégration Stripe pour les abonnements et le paiement par scan.
7. **Multi-tenant** : Gestion des organisations et des rôles.
8. **Mode hors-ligne** : Fonctionnalités de base disponibles sans connexion.

## Guide de démarrage

### Prérequis

- Node.js 18+
- pnpm
- Python 3.11 (pour les scripts IA)
- Compte Supabase
- Compte Stripe

### Installation

```bash
# Cloner le dépôt
# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp server/.env.example server/.env
cp mobile/.env.example mobile/.env

# Lancer le backend
pnpm --filter server dev

# Lancer le mobile
pnpm --filter mobile start
```

### Configuration IA

- Installer les dépendances Python : `pip install torch ultralytics realesrgan basicsr opencv-python numpy`
- Télécharger les modèles : `yolov8n.pt`, `RealESRGAN_x2plus.pth`, `gemma-2b-it.gguf`
- Placer les modèles dans `server/src/ai/models/` et `mobile/models/`

## Structure du projet

```
├── mobile/          # Application React Native (Expo)
├── server/          # Backend Node.js (Express)
├── package.json     # Scripts racine
└── README.md
```

## Licence

Propriétaire. Tous droits réservés.