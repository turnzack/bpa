> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu génères des PRD de haute qualité pour des projets React/TypeScript. Tu dois produire des spécifications détaillées, précises et actionnables, en t'inspirant du modèle de référence 'ecommerce_pack'. Chaque module doit être nommé avec le préfixe 'tmpl_tetris_evolution_' et doit inclure une mission claire, un design requis, et des composants à générer. Tu dois respecter les règles d'or : zéro fichier générique, modules spécifiques au domaine, vision UI/UX précise, et script d'injection avec PRDS complets.

# 🧩 TETRIS EVOLUTION

## 📌 Description du Domaine Métier

TETRIS EVOLUTION est une plateforme de puzzle adaptative et sociale qui transcende le jeu de Tetris classique. Elle intègre des mécaniques modernes de jeu (multijoueur en temps réel, IA adaptative, personnalisation avancée) et des fonctionnalités sociales (classements, tournois, partage de performances) pour maximiser l'engagement des joueurs. L'objectif est de fournir une expérience de jeu complète, non seulement comme un passe-temps, mais comme un outil de développement cognitif et de compétition sociale. L'architecture est modulaire et évolutive, permettant d'ajouter de nouvelles fonctionnalités sans réécrire le cœur du jeu.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. tmpl_tetris_evolution_core_engine
- **Mission** : Implémenter le moteur de jeu Tetris pur (grille, pièces, collisions, rotation, ligne complète, score, niveaux).
- **Design Requis** : Classe `TetrisEngine` avec méthodes `moveLeft()`, `moveRight()`, `rotate()`, `drop()`, `hardDrop()`, `tick()`. Gestion de l'état du jeu via un store (Zustand ou Context).
- **Composants à générer** : `useTetrisEngine.ts` (hook personnalisé), `TetrisBoard.tsx` (rendu de la grille), `TetrisPiece.tsx` (rendu des pièces).

### 2. tmpl_tetris_evolution_ui_ux
- **Mission** : Créer l'interface utilisateur complète du jeu (menus, écrans de jeu, popups, animations).
- **Design Requis** : Thème néon futuriste avec glassmorphism, animations fluides (framer-motion), composants réutilisables (Button, Modal, ScoreBoard).
- **Composants à générer** : `MainMenu.tsx`, `GameScreen.tsx`, `PauseModal.tsx`, `GameOverModal.tsx`, `ScoreBoard.tsx`.

### 3. tmpl_tetris_evolution_ai_opponent
- **Mission** : Implémenter un adversaire IA adaptatif qui ajuste sa difficulté selon le niveau du joueur.
- **Design Requis** : Algorithme de décision (recherche de meilleur placement) avec paramètres de difficulté (vitesse, précision).
- **Composants à générer** : `useAIOpponent.ts` (hook), `AIPlayer.tsx` (rendu de l'IA dans le mode multijoueur).

### 4. tmpl_tetris_evolution_multiplayer
- **Mission** : Gérer le multijoueur en temps réel (matchmaking, synchronisation des états, chat).
- **Design Requis** : Utilisation de WebSockets (Socket.io) ou de WebRTC pour la communication. Gestion des salles et des sessions.
- **Composants à générer** : `MultiplayerLobby.tsx`, `MultiplayerGame.tsx`, `ChatBox.tsx`.

### 5. tmpl_tetris_evolution_social_features
- **Mission** : Intégrer les fonctionnalités sociales (classements, profils, partage de scores, défis).
- **Design Requis** : API REST pour les classements, intégration de partage sur les réseaux sociaux, profils utilisateurs.
- **Composants à générer** : `Leaderboard.tsx`, `UserProfile.tsx`, `ShareScoreButton.tsx`.

### 6. tmpl_tetris_evolution_customization
- **Mission** : Permettre la personnalisation de l'expérience (thèmes, skins de pièces, effets sonores).
- **Design Requis** : Système de thèmes CSS variables, sélecteur de skins, gestion des préférences utilisateur.
- **Composants à générer** : `CustomizationPanel.tsx`, `ThemeSelector.tsx`, `SkinSelector.tsx`.

### 7. tmpl_tetris_evolution_progression
- **Mission** : Gérer la progression du joueur (niveaux, XP, succès, déblocages).
- **Design Requis** : Système de niveaux et d'XP, succès (achievements), récompenses.
- **Composants à générer** : `ProgressionBar.tsx`, `AchievementsList.tsx`, `RewardModal.tsx`.

### 8. tmpl_tetris_evolution_analytics
- **Mission** : Collecter et afficher des statistiques de jeu (temps de jeu, scores, taux de réussite).
- **Design Requis** : Tableau de bord avec graphiques (Chart.js ou Recharts), stockage local ou distant.
- **Composants à générer** : `StatsDashboard.tsx`, `StatCard.tsx`, `LineChart.tsx`.

### 9. tmpl_tetris_evolution_audio
- **Mission** : Gérer les effets sonores et la musique de fond.
- **Design Requis** : Utilisation de Web Audio API, gestion des pistes audio, contrôle du volume.
- **Composants à générer** : `AudioManager.ts` (classe), `SoundToggle.tsx`, `MusicPlayer.tsx`.

### 10. tmpl_tetris_evolution_settings
- **Mission** : Gérer les paramètres du jeu (difficulté, commandes, accessibilité).
- **Design Requis** : Écran de réglages avec options de personnalisation, sauvegarde des préférences.
- **Composants à générer** : `SettingsScreen.tsx`, `DifficultySelector.tsx`, `ControlsCustomizer.tsx`.

## 🎨 Vision UI/UX & Design System Global

- **Thème** : Néon futuriste avec fond sombre (bleu nuit #0a0e27), accents cyan (#00f0ff) et magenta (#ff00ff). Glassmorphism pour les panneaux (fond semi-transparent avec blur).
- **Typographie** : Police 'Orbitron' pour les titres, 'Roboto' pour le texte.
- **Composants UI** : Boutons avec effet de glow, cartes avec coins arrondis et ombres, animations de transition fluides.
- **Hooks** : `useGameLoop` pour la boucle de jeu, `useLocalStorage` pour la persistance, `useWebSocket` pour le multijoueur.
- **États** : Gestion via Zustand pour le jeu, React Query pour les données distantes.
- **Responsive** : Design adaptatif pour mobile et desktop.

## 🔌 Directives de Câblage VFS

- **Structure des dossiers** :
  - `src/` : code source
    - `components/` : composants React
    - `hooks/` : hooks personnalisés
    - `store/` : stores Zustand
    - `services/` : services API et WebSocket
    - `utils/` : utilitaires
    - `styles/` : fichiers CSS/SCSS
    - `types/` : types TypeScript
  - `public/` : assets statiques
  - `server/` : backend (si nécessaire)
- **Câblage** : Chaque module doit être indépendant et communiquer via des interfaces claires. Utiliser des imports relatifs.

## 🔄 Instruction de Fusion

- **Fusion des modules** : Les modules doivent être fusionnés dans un seul projet React. Le module `core_engine` est le cœur, les autres modules s'y connectent via des hooks et des services.
- **Ordre de fusion** : 1. core_engine, 2. ui_ux, 3. audio, 4. settings, 5. progression, 6. customization, 7. ai_opponent, 8. multiplayer, 9. social_features, 10. analytics.
- **Tests** : Chaque module doit avoir des tests unitaires (Jest) et des tests d'intégration.

## 🤖 [INSTRUCTION IA]

Structure de fichiers `src/` complète :

```
src/
  components/
    MainMenu.tsx
    GameScreen.tsx
    PauseModal.tsx
    GameOverModal.tsx
    ScoreBoard.tsx
    MultiplayerLobby.tsx
    MultiplayerGame.tsx
    ChatBox.tsx
    Leaderboard.tsx
    UserProfile.tsx
    ShareScoreButton.tsx
    CustomizationPanel.tsx
    ThemeSelector.tsx
    SkinSelector.tsx
    ProgressionBar.tsx
    AchievementsList.tsx
    RewardModal.tsx
    StatsDashboard.tsx
    StatCard.tsx
    LineChart.tsx
    SoundToggle.tsx
    MusicPlayer.tsx
    SettingsScreen.tsx
    DifficultySelector.tsx
    ControlsCustomizer.tsx
  hooks/
    useTetrisEngine.ts
    useAIOpponent.ts
    useGameLoop.ts
    useLocalStorage.ts
    useWebSocket.ts
  store/
    gameStore.ts
    settingsStore.ts
    userStore.ts
  services/
    api.ts
    websocket.ts
    audio.ts
  utils/
    constants.ts
    helpers.ts
  styles/
    global.css
    themes.css
  types/
    index.ts
```