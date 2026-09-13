# FactureScan - Application de Scan 3D

Application React Native/Expo recréée à l'identique depuis l'application Solar2D originale.

## 🎯 Fonctionnalités

- **Capture vidéo** : Enregistrement de vidéos pour reconstruction 3D
- **Galerie** : Sélection de vidéos depuis la galerie du téléphone
- **Monitoring** : Suivi en temps réel du traitement des scans
- **Visualisation 3D** : Affichage des modèles 3D générés via WebView
- **Interface identique** : Design et navigation fidèles à l'application Solar2D

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

## 📱 Écrans principaux

- **Home** : Écran d'accueil avec boutons flottants (Caméra/Galerie) et modal "Capture Guide"
- **History** : Liste des scans 3D avec statuts (en cours, terminé, en pause, échec)
- **Monitor** : Logs système et suivi des jobs de traitement
- **Viewer** : Visualisation 3D via WebView
- **Video Prepare** : Prévisualisation et validation avant upload

## 🎨 Design

L'application utilise une palette de couleurs sombre identique à l'original :
- Background: `#2E2E2E`
- Accents: `#0078FF` (bleu) et `#7800FF` (violet)
- Navigation: `#1C1C1C`

## 🔧 Configuration

Le backend est configuré par défaut sur `http://192.168.1.148:4000`.
Pour modifier l'URL, éditez les fichiers suivants :
- `app/(tabs)/history.tsx`
- `app/monitor.tsx`
- `app/viewer.tsx`

## 📦 Structure du projet

```
FactureScan/
├── app/
│   ├── (tabs)/          # Navigation par onglets
│   │   ├── index.tsx    # Home
│   │   ├── history.tsx  # Galerie des scans
│   │   ├── scan.tsx     # Placeholder
│   │   ├── settings.tsx # Paramètres
│   │   └── profile.tsx  # Profil
│   ├── monitor.tsx      # Monitoring
│   ├── viewer.tsx       # Visualiseur 3D
│   └── video_prepare.tsx # Préparation vidéo
├── components/
│   └── CaptureGuideModal.tsx # Modal de guide de capture
├── constants/
│   └── Colors.ts        # Palette de couleurs
└── services/
    └── Logger.ts        # Service de logs
```

## ⚠️ Notes importantes

- Le cache Metro est configuré pour utiliser le disque E: (`.metro-cache/`)
- Les erreurs TypeScript JSX sont normales en développement et n'affectent pas l'exécution
- L'application fonctionne en mode "démo" si le backend n'est pas accessible

## 🔗 Compatibilité

- Expo SDK 54
- React Native 0.81.5
- React 19.1.0
