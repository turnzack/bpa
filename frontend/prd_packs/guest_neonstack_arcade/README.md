> **Directive Système IA** : Tu es un Architecte Logiciel Senior et Expert en Product Design. Génère des composants React/TypeScript de haute qualité pour le jeu **NEONSTACK ARCADE**. Suis les directives du PRD, respecte le design system, et produis du code fonctionnel et esthétique.

# 🕹️ NEONSTACK ARCADE — PRD Complet

## Domaine Métier
NEONSTACK ARCADE est un jeu de puzzle arcade rétro (type Tetris) avec une esthétique néon synthwave, une difficulté adaptative pilotée par IA, un mode créatif, et une plateforme live-service (événements, tournois, partage de niveaux).

## Les 10 Modules Architecturaux Disponibles

### tmpl_neonstack_arcade_core
- **Mission** : Implémenter le moteur de jeu principal (grille, pièces, rotation, collision, ligne complète).
- **Design Requis** : Grille 10x20, pièces standard (I, O, T, S, Z, J, L), système de rotation SRS, détection de collision, gestion de la gravité.
- **Composants à générer** : `GameBoard.tsx`, `Piece.tsx`, `useGameEngine.ts`, `types.ts`.

### tmpl_neonstack_arcade_ai
- **Mission** : Implémenter l'IA adaptative qui ajuste la difficulté en fonction des performances du joueur.
- **Design Requis** : Analyse en temps réel (vitesse de chute, précision, lignes complétées), ajustement dynamique de la vitesse, génération de patterns de pièces.
- **Composants à générer** : `useAdaptiveAI.ts`, `DifficultyManager.ts`, `PatternGenerator.ts`.

### tmpl_neonstack_arcade_audio
- **Mission** : Générer une bande-son dynamique et des effets sonores rétro.
- **Design Requis** : Utilisation de Web Audio API pour générer des boucles synthwave, sons de rotation, de ligne complétée, de game over.
- **Composants à générer** : `AudioEngine.ts`, `SynthWaveGenerator.ts`, `SoundEffects.ts`.

### tmpl_neonstack_arcade_ui
- **Mission** : Créer l'interface utilisateur complète (menus, HUD, écrans de fin).
- **Design Requis** : Thème néon, glassmorphism, animations fluides, composants réutilisables.
- **Composants à générer** : `MainMenu.tsx`, `HUD.tsx`, `GameOverScreen.tsx`, `PauseMenu.tsx`.

### tmpl_neonstack_arcade_progression
- **Mission** : Gérer la progression du joueur, les niveaux, les compétences déblocables.
- **Design Requis** : Système d'XP, arbre de compétences (vitesse, précision, bonus), sauvegarde locale.
- **Composants à générer** : `ProgressionSystem.ts`, `SkillTree.tsx`, `PlayerProfile.ts`.

### tmpl_neonstack_arcade_creative
- **Mission** : Fournir un mode créatif où les joueurs peuvent concevoir leurs propres niveaux.
- **Design Requis** : Éditeur de grille, placement de pièces, définition de séquences, partage de niveaux.
- **Composants à générer** : `LevelEditor.tsx`, `CustomLevel.ts`, `LevelShare.ts`.

### tmpl_neonstack_arcade_online
- **Mission** : Implémenter le multijoueur asynchrone et les tournois.
- **Design Requis** : Classements, replays, défis entre amis, gestion des tournois saisonniers.
- **Composants à générer** : `Leaderboard.tsx`, `ChallengeSystem.ts`, `TournamentManager.ts`.

### tmpl_neonstack_arcade_events
- **Mission** : Gérer les événements saisonniers et les récompenses.
- **Design Requis** : Calendrier d'événements, quêtes spéciales, récompenses cosmétiques.
- **Composants à générer** : `EventCalendar.tsx`, `QuestSystem.ts`, `RewardManager.ts`.

### tmpl_neonstack_arcade_settings
- **Mission** : Gérer les paramètres du jeu (graphismes, audio, contrôles).
- **Design Requis** : Écran de réglages, persistance des préférences, accessibilité.
- **Composants à générer** : `SettingsScreen.tsx`, `useSettings.ts`, `AccessibilityOptions.ts`.

### tmpl_neonstack_arcade_visuals
- **Mission** : Gérer les effets visuels néon et les animations.
- **Design Requis** : Particules, lueurs, transitions, thème synthwave.
- **Composants à générer** : `NeonEffects.tsx`, `ParticleSystem.ts`, `ThemeManager.ts`.

## Vision UI/UX & Design System Global
- **Thème** : Synthwave néon (couleurs : #ff00ff, #00ffff, #ffcc00, fond #0d0221).
- **Typographie** : Police rétro (ex: 'Press Start 2P') pour les titres, 'Orbitron' pour le texte.
- **Composants** : Boutons avec effet néon, cartes glassmorphism, animations de survol.
- **Hooks** : `useGameLoop`, `useKeyboardControls`, `useLocalStorage`.
- **États** : `gameState`, `playerStats`, `settings`, `events`.

## Directives de Câblage VFS
- Créer les fichiers dans `/src/components`, `/src/hooks`, `/src/utils`, `/src/styles`.
- Utiliser des imports relatifs.
- Nommer les fichiers en camelCase.

## Instruction de Fusion
- Fusionner les modules en respectant les dépendances : core → ai, audio, ui → progression, creative, online → events, settings, visuals.
- Intégrer les styles globaux dans `App.css`.

## [INSTRUCTION IA]
Structure de fichiers src/ complète :
```
src/
  components/
    GameBoard.tsx
    Piece.tsx
    MainMenu.tsx
    HUD.tsx
    GameOverScreen.tsx
    PauseMenu.tsx
    SkillTree.tsx
    LevelEditor.tsx
    Leaderboard.tsx
    EventCalendar.tsx
    SettingsScreen.tsx
    NeonEffects.tsx
  hooks/
    useGameEngine.ts
    useAdaptiveAI.ts
    useGameLoop.ts
    useKeyboardControls.ts
    useLocalStorage.ts
    useSettings.ts
  utils/
    types.ts
    DifficultyManager.ts
    PatternGenerator.ts
    AudioEngine.ts
    SynthWaveGenerator.ts
    SoundEffects.ts
    ProgressionSystem.ts
    PlayerProfile.ts
    CustomLevel.ts
    LevelShare.ts
    ChallengeSystem.ts
    TournamentManager.ts
    QuestSystem.ts
    RewardManager.ts
    ParticleSystem.ts
    ThemeManager.ts
  styles/
    global.css
    neon.css
  App.tsx
  main.tsx
```