# 🎮 Game Editor 3D - Guide d'Utilisation

## 📋 Vue d'Ensemble

L'éditeur de jeu 3D permet de créer des scènes interactives avec des personnages animés et de les tester en mode jeu.

## 🚀 Démarrage

### 1. Lancer le Serveur Backend

```bash
cd E:\SOLAROBJ\backend-node
npm run dev
```

### 2. Ouvrir l'Éditeur

Dans votre navigateur ou WebView :
```
http://192.168.1.148:4000/editor
```

## 🎨 Modes de Vue

L'éditeur propose 4 modes de vue :

### 3D Mode (Éditeur)
- **Caméra** : Orbit (rotation libre)
- **Grille** : Visible
- **Usage** : Construction de la scène

**Contrôles** :
- Rotation : Clic gauche + glisser
- Zoom : Molette
- Pan : Clic droit + glisser

### 2D Mode (Top-Down)
- **Caméra** : Vue de dessus
- **Grille** : Visible
- **Usage** : Placement précis

### Render Mode (Aperçu)
- **Caméra** : Cinématique
- **Grille** : Cachée
- **Usage** : Prévisualisation

### Game Mode (Jouable)
- **Caméra** : 3ème personne
- **Contrôles** : Joystick + Boutons
- **Usage** : Test du jeu

## 📦 Panneau Assets

### Primitives
- **Cube** : Objet cubique
- **Sphere** : Sphère
- **Plan** : Surface plane

### Characters
Liste des personnages FBX disponibles dans `data/jobs/*/output/*.fbx`

### Objects
Autres modèles 3D disponibles

## 🎬 Workflow Complet

### Étape 1 : Construire la Scène

1. Mode **3D** activé
2. Cliquer sur les primitives pour les ajouter
3. Placer les objets sur la grille
4. Créer le décor

### Étape 2 : Ajouter un Personnage

1. Panneau **Characters**
2. Cliquer sur un personnage FBX
3. Le personnage apparaît au centre

### Étape 3 : Tester en Mode Game

1. Cliquer sur bouton **[Game]**
2. Utiliser le joystick pour déplacer
3. Bouton **A** : Jump
4. Bouton **B** : Run

### Étape 4 : Sauvegarder

1. Cliquer sur **[💾 Save]**
2. La scène est sauvegardée

## 🕹️ Contrôles Mode Game

### Joystick Virtuel (Gauche)
- **Avant** : Marche
- **Avant + B** : Course
- **Immobile** : Idle

### Boutons d'Action (Droite)
- **A** : Saut (Jump)
- **B** : Course (Run)

## 🎯 Animations Supportées

Pour que les animations fonctionnent, vos fichiers FBX doivent être nommés :
- `Walking.fbx` → Animation de marche
- `Fast Run (1).fbx` → Animation de course
- `Running Jump.fbx` → Animation de saut
- `Idle.fbx` → Animation au repos (optionnel)

## 🔧 Structure des Fichiers

```
gameplan/
├── game-editor.html          ← Interface principale
├── js/
│   ├── SceneManager.js       ← Gestion de la scène
│   ├── AssetManager.js       ← Chargement FBX
│   ├── CharacterController.js ← Personnage + animations
│   ├── VirtualJoystick.js    ← Joystick tactile
│   ├── GameMode.js           ← Mode jeu
│   └── main.js               ← Point d'entrée
└── README.md                 ← Ce fichier
```

## 📡 API Backend

### GET /editor
Sert l'interface de l'éditeur

### GET /api/models
Liste tous les modèles FBX disponibles

**Réponse** :
```json
{
  "models": [
    {
      "id": "1766516817524_Walking.fbx",
      "name": "Walking",
      "path": "/data/jobs/1766516817524/output/Walking.fbx",
      "jobId": "1766516817524",
      "type": "model"
    }
  ]
}
```

### GET /api/animations/:jobId
Liste les animations d'un job spécifique

## 🐛 Dépannage

### Le personnage ne s'affiche pas
- Vérifiez que le fichier FBX existe dans `data/jobs/*/output/`
- Vérifiez la console du navigateur pour les erreurs
- Le fichier FBX peut être trop gros (échelle automatique à 0.01)

### Les animations ne jouent pas
- Vérifiez que les fichiers FBX contiennent des animations
- Les noms des animations doivent correspondre (walk, run, jump)
- Vérifiez la console pour les erreurs de chargement

### Le joystick ne fonctionne pas
- Mode Game doit être activé
- Sur mobile, vérifiez les permissions tactiles
- Testez d'abord sur desktop avec la souris

## 🎓 Prochaines Étapes

### Phase 3 : Character System
- Charger plusieurs animations
- Transitions fluides
- Test avec personnages réels

### Phase 4 : Game Mode
- Calibrage caméra
- Physique de base
- Collisions

### Phase 5 : Scene Management
- Sauvegarde complète
- Chargement de scènes
- Gestion de plusieurs scènes

## 💡 Astuces

- **Échelle FBX** : Les modèles FBX sont automatiquement réduits à 1% de leur taille
- **Performance** : Limitez le nombre d'objets pour de meilleures performances
- **Mobile** : Testez sur Android pour les contrôles tactiles
- **Debug** : Ouvrez la console (F12) pour voir les logs

## 📞 Support

Pour toute question ou problème, consultez les logs de la console navigateur et du serveur backend.
