> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Génère des composants React/TypeScript de haute qualité pour le projet **TETRIS NOVA**. Suis scrupuleusement les spécifications des modules, la vision UI/UX et les directives de câblage. Chaque fichier doit être fonctionnel, élégant et optimisé pour les performances. Utilise les hooks modernes (useState, useEffect, useReducer, useRef, useContext) et les patterns avancés (render props, HOC, custom hooks). Le style doit suivre le design system défini (glassmorphism, dark mode, animations fluides). Assure-toi que chaque composant est autonome, testable et documenté.

# 🧩 TETRIS NOVA : Puzzle Adaptatif et Social

## Description du Domaine Métier

TETRIS NOVA réinvente le jeu de Tetris classique en une plateforme de puzzle adaptative et sociale. Le jeu conserve les mécaniques fondamentales (chute de pièces, lignes à compléter) mais introduit des modes de jeu variés, un système de progression intelligent basé sur l'IA, et des fonctionnalités communautaires. L'objectif est d'offrir une expérience immersive, personnalisable et compétitive, fidèle à l'original mais audacieuse.

## Les 10 Modules Architecturaux Disponibles

### tmpl_tetris_nova_core
- **Mission** : Implémenter le moteur de jeu Tetris (grille, pièces, rotation, collision, détection de lignes, score, niveaux).
- **Design Requis** : Grille 10x20, pièces standard (I, O, T, S, Z, J, L) avec couleurs néon, système de rotation (SRS), ghost piece, hold piece, next queue.
- **Composants à générer** : `GameBoard.tsx`, `Piece.tsx`, `useTetrisEngine.ts`, `usePieceGenerator.ts`, `useCollisionDetection.ts`.

### tmpl_tetris_nova_ai
- **Mission** : Développer le système d'IA adaptative qui ajuste la difficulté et génère des défis personnalisés.
- **Design Requis** : Analyse des performances du joueur (vitesse, précision, pattern de placement) pour moduler la vitesse de chute, la fréquence des pièces spéciales, et proposer des objectifs.
- **Composants à générer** : `AIDifficultyManager.ts`, `usePlayerAnalysis.ts`, `ChallengeGenerator.ts`.

### tmpl_tetris_nova_modes
- **Mission** : Implémenter les différents modes de jeu (Classique, Sprint, Ultra, Marathon, Survie, Puzzle).
- **Design Requis** : Chaque mode a des règles spécifiques (temps, lignes cibles, obstacles, pièces spéciales). Interface de sélection claire.
- **Composants à générer** : `ModeSelector.tsx`, `GameMode.ts`, `ModeRules.ts`.

### tmpl_tetris_nova_social
- **Mission** : Créer les fonctionnalités sociales (classements, défis entre amis, partage de scores).
- **Design Requis** : Tableau des scores global et par amis, système d'invitation, partage sur réseaux sociaux.
- **Composants à générer** : `Leaderboard.tsx`, `SocialShare.tsx`, `FriendChallenge.tsx`.

### tmpl_tetris_nova_progression
- **Mission** : Gérer le système de progression (niveaux, XP, succès, déblocages).
- **Design Requis** : Barre d'XP, niveaux avec récompenses, succès variés, cosmétiques déblocables.
- **Composants à générer** : `ProgressionPanel.tsx`, `AchievementBadge.tsx`, `useProgression.ts`.

### tmpl_tetris_nova_customization
- **Mission** : Permettre la personnalisation de l'expérience (thèmes, skins de pièces, effets sonores, musique).
- **Design Requis** : Éditeur de thème (couleurs, fonds), choix de skins, réglages audio.
- **Composants à générer** : `ThemeEditor.tsx`, `SkinSelector.tsx`, `AudioSettings.tsx`.

### tmpl_tetris_nova_replay
- **Mission** : Implémenter le système de replay (enregistrement des parties, relecture, partage).
- **Design Requis** : Enregistrement des actions, lecture avec contrôles (pause, vitesse), export vidéo.
- **Composants à générer** : `ReplayRecorder.ts`, `ReplayPlayer.tsx`, `ReplayList.tsx`.

### tmpl_tetris_nova_stats
- **Mission** : Fournir des statistiques détaillées sur les performances du joueur.
- **Design Requis** : Graphiques (évolution du score, précision, vitesse), comparaison avec la moyenne, analyse des points faibles.
- **Composants à générer** : `StatsDashboard.tsx`, `PerformanceChart.tsx`, `useStats.ts`.

### tmpl_tetris_nova_tutorial
- **Mission** : Créer un tutoriel interactif pour apprendre les bases et les techniques avancées.
- **Design Requis** : Étapes guidées, démonstrations animées, quiz.
- **Composants à générer** : `TutorialStep.tsx`, `TutorialOverlay.tsx`, `useTutorial.ts`.

### tmpl_tetris_nova_settings
- **Mission** : Gérer les paramètres du jeu (contrôles, accessibilité, langue).
- **Design Requis** : Écran de réglages complet, remappage des touches, options d'accessibilité (daltonisme, taille de police).
- **Composants à générer** : `SettingsPanel.tsx`, `ControlsConfig.tsx`, `AccessibilityOptions.tsx`.

## Vision UI/UX & Design System Global

- **Thème** : Dark mode avec glassmorphism (arrière-plans flous, transparences, bordures lumineuses). Couleurs néon (cyan, magenta, jaune) pour les pièces, avec des dégradés et des effets de glow.
- **Typographie** : Police 'Orbitron' pour les titres, 'Roboto' pour le texte.
- **Composants UI** : Boutons avec effet de survol lumineux, cartes en verre, animations de transition fluides.
- **Hooks** : `useTheme`, `useSound`, `useGameLoop`, `useLocalStorage`.
- **Layout** : Interface en trois zones : zone de jeu centrale, panneau latéral (score, prochaine pièce, hold), barre supérieure (mode, progression).

## Directives de Câblage VFS

- Les composants doivent être placés dans `src/components/` avec un sous-dossier par module (ex: `src/components/core/`).
- Les hooks dans `src/hooks/`.
- Les utilitaires dans `src/utils/`.
- Les styles dans `src/styles/` (CSS Modules ou Tailwind).
- Les assets (images, sons) dans `src/assets/`.
- Le state global sera géré avec Context API ou Zustand.
- Les appels API (si nécessaires) via `src/services/`.

## Instruction de Fusion

Pour fusionner les modules, importer les composants principaux dans `App.tsx` et utiliser un routeur (React Router) pour naviguer entre les écrans (menu principal, jeu, tutoriel, stats, etc.). Le state global (progression, paramètres) sera fourni par un `GameProvider`.

## [INSTRUCTION IA]

Structure de fichiers src/ complète :

```
src/
  main.tsx
  App.tsx
  index.css
  components/
    core/
      GameBoard.tsx
      Piece.tsx
      useTetrisEngine.ts
      usePieceGenerator.ts
      useCollisionDetection.ts
    ai/
      AIDifficultyManager.ts
      usePlayerAnalysis.ts
      ChallengeGenerator.ts
    modes/
      ModeSelector.tsx
      GameMode.ts
      ModeRules.ts
    social/
      Leaderboard.tsx
      SocialShare.tsx
      FriendChallenge.tsx
    progression/
      ProgressionPanel.tsx
      AchievementBadge.tsx
      useProgression.ts
    customization/
      ThemeEditor.tsx
      SkinSelector.tsx
      AudioSettings.tsx
    replay/
      ReplayRecorder.ts
      ReplayPlayer.tsx
      ReplayList.tsx
    stats/
      StatsDashboard.tsx
      PerformanceChart.tsx
      useStats.ts
    tutorial/
      TutorialStep.tsx
      TutorialOverlay.tsx
      useTutorial.ts
    settings/
      SettingsPanel.tsx
      ControlsConfig.tsx
      AccessibilityOptions.tsx
  hooks/
    useTheme.ts
    useSound.ts
    useGameLoop.ts
    useLocalStorage.ts
  utils/
    constants.ts
    types.ts
    helpers.ts
  services/
    api.ts
  assets/
    sounds/
    images/
  styles/
    global.css
```