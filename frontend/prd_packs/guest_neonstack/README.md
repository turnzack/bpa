> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu dois générer des composants React/TypeScript de haute qualité pour le jeu NeonStack. Chaque composant doit être fonctionnel, stylé avec le design system néon, et intégrer les mécaniques de jeu décrites. Suis les PRDs fournis dans le script d'injection pour chaque module. Respecte les conventions de nommage et la structure de fichiers définies dans ce README.

# 🕹️ NEONSTACK: Puzzle Arcade Synthwave avec IA Adaptative et Mode Créatif

## Description du Domaine Métier

NeonStack est un jeu de puzzle arcade rétro inspiré de Tetris, revisité avec une esthétique néon/synthwave. Le jeu combine des mécaniques classiques de chute de blocs, de gestion de score et de niveaux, avec des fonctionnalités modernes : une IA adaptative qui ajuste la difficulté en temps réel selon les performances du joueur, un mode créatif permettant de concevoir des niveaux personnalisés, et une personnalisation poussée (thèmes, skins, sons). Le jeu vise à offrir une expérience immersive et rejouable, séduisant à la fois les puristes du rétro et les joueurs contemporains.

## Les 10 Modules Architecturaux Disponibles

### 1. tmpl_neonstack_core_engine
- **Mission** : Implémenter le moteur de jeu principal : grille, pièces, rotation, collision, ligne complète, chute, score, niveaux.
- **Design Requis** : Grille 10x20, pièces standard (I, O, T, S, Z, J, L), système de rotation (SRS), détection de collision, gestion de la gravité, scoring basé sur le nombre de lignes et le niveau.
- **Composants à générer** : `GameBoard.tsx`, `Piece.tsx`, `useGameEngine.ts`, `usePieceGenerator.ts`, `useCollision.ts`.

### 2. tmpl_neonstack_ai_adaptive
- **Mission** : Implémenter l'IA adaptative qui ajuste la difficulté (vitesse, apparition de pièces spéciales) en fonction des performances du joueur (score, lignes, temps).
- **Design Requis** : Algorithme d'analyse de performance, ajustement dynamique de la vitesse de chute, introduction de pièces spéciales (bombes, pièces gelées) à des moments stratégiques.
- **Composants à générer** : `useAdaptiveAI.ts`, `DifficultyManager.ts`, `SpecialPieces.tsx`.

### 3. tmpl_neonstack_creative_mode
- **Mission** : Permettre au joueur de créer ses propres niveaux (disposition initiale de la grille, séquence de pièces, objectifs).
- **Design Requis** : Éditeur de niveau avec palette de pièces, placement sur la grille, sauvegarde/chargement de niveaux, export/import JSON.
- **Composants à générer** : `LevelEditor.tsx`, `LevelPalette.tsx`, `LevelPreview.tsx`, `useLevelBuilder.ts`.

### 4. tmpl_neonstack_ui_hud
- **Mission** : Afficher les informations de jeu en temps réel : score, niveau, lignes, prochaine pièce, hold, combo, etc.
- **Design Requis** : Interface HUD stylisée néon, avec animations de score, affichage de la prochaine pièce, mini-carte de la grille.
- **Composants à générer** : `HUD.tsx`, `ScoreDisplay.tsx`, `NextPiece.tsx`, `HoldPiece.tsx`, `ComboIndicator.tsx`.

### 5. tmpl_neonstack_audio_system
- **Mission** : Gérer les effets sonores 8-bit et la musique de fond synthwave.
- **Design Requis** : Utilisation de Web Audio API pour générer des sons rétro, boucle musicale, contrôle du volume, activation/désactivation.
- **Composants à générer** : `useAudioEngine.ts`, `SoundEffects.ts`, `MusicPlayer.tsx`.

### 6. tmpl_neonstack_visual_effects
- **Mission** : Gérer les effets visuels néon : lueurs, particules, animations de ligne complétée, transitions d'écran.
- **Design Requis** : Effets de glow, particules lors de la destruction de lignes, animations de chute, effets de flash.
- **Composants à générer** : `ParticleSystem.tsx`, `GlowEffect.tsx`, `LineClearAnimation.tsx`, `ScreenTransition.tsx`.

### 7. tmpl_neonstack_settings_personalization
- **Mission** : Permettre à l'utilisateur de personnaliser l'expérience : thèmes de couleurs, skins de pièces, fonds d'écran, difficulté manuelle, contrôles.
- **Design Requis** : Écran de paramètres avec options de thème (néon classique, synthwave, dark), choix de skins, réglage de la vitesse initiale, remappage des touches.
- **Composants à générer** : `SettingsPanel.tsx`, `ThemeSelector.tsx`, `SkinSelector.tsx`, `ControlsConfig.tsx`.

### 8. tmpl_neonstack_progression_system
- **Mission** : Gérer la progression du joueur : niveaux, expérience, déblocage de contenu (skins, thèmes), succès.
- **Design Requis** : Système de niveaux basé sur le score, barre d'expérience, succès débloquables, sauvegarde de la progression en local (localStorage).
- **Composants à générer** : `ProgressionBar.tsx`, `Achievements.tsx`, `Unlockables.tsx`, `useProgression.ts`.

### 9. tmpl_neonstack_menu_navigation
- **Mission** : Gérer la navigation entre les écrans du jeu : menu principal, jeu, mode créatif, paramètres, classement.
- **Design Requis** : Menu principal avec animations néon, transitions fluides, navigation par clavier/souris.
- **Composants à générer** : `MainMenu.tsx`, `GameScreen.tsx`, `CreativeScreen.tsx`, `SettingsScreen.tsx`, `LeaderboardScreen.tsx`, `useNavigation.ts`.

### 10. tmpl_neonstack_leaderboard_social
- **Mission** : Afficher les meilleurs scores locaux et permettre le partage sur les réseaux sociaux.
- **Design Requis** : Tableau des scores avec tri, sauvegarde locale, boutons de partage (Twitter, Facebook), capture d'écran du score.
- **Composants à générer** : `Leaderboard.tsx`, `ScoreEntry.tsx`, `ShareButton.tsx`, `useLeaderboard.ts`.

## Vision UI/UX & Design System Global

L'interface de NeonStack doit évoquer l'ère des arcades rétro avec une touche futuriste synthwave. Le design system repose sur les principes suivants :

- **Palette de couleurs** : Fond sombre (#0a0a0f), couleurs néon vives (cyan #00ffff, magenta #ff00ff, jaune #ffff00, vert #00ff00, orange #ff6600).
- **Typographie** : Police pixelisée (ex: 'Press Start 2P') pour les titres et les scores, police sans-serif pour le texte courant.
- **Effets de lueur** : Utilisation de `text-shadow` et `box-shadow` pour créer un effet néon sur les bordures et les textes.
- **Composants UI** : Boutons avec bordure néon, panneaux avec fond semi-transparent et flou (glassmorphism), animations de pulsation.
- **Grille de jeu** : Cases avec bordures lumineuses, pièces avec dégradés et lueur.
- **Feedback visuel** : Animations de flash lors des lignes complétées, particules, secousses de l'écran.
- **Accessibilité** : Contraste élevé, options pour réduire les effets visuels (mode daltonien).

## Directives de Câblage VFS

- Tous les composants doivent être créés dans le répertoire `src/components/` avec un sous-dossier par module (ex: `src/components/core_engine/`).
- Les hooks personnalisés doivent être placés dans `src/hooks/`.
- Les utilitaires (algorithmes, types) dans `src/utils/`.
- Les styles CSS dans `src/styles/` avec un fichier par module.
- Les assets (images, sons) dans `public/assets/`.
- Le fichier principal `App.tsx` doit orchestrer la navigation et l'état global.
- Utiliser React Context pour l'état global (score, niveau, paramètres).
- Les données de progression et de paramètres doivent être persistées dans `localStorage`.

## Instruction de Fusion

Lors de la fusion des modules, assurez-vous que :
- Le moteur de jeu (`core_engine`) est indépendant et ne dépend que des hooks de base.
- L'IA adaptative (`ai_adaptive`) s'intègre avec le moteur via des événements ou des callbacks.
- Le mode créatif (`creative_mode`) utilise le même moteur mais avec une configuration de niveau personnalisée.
- Le HUD (`ui_hud`) écoute les changements d'état du moteur via un contexte global.
- Le système audio (`audio_system`) est déclenché par les événements du moteur (ligne complétée, game over).
- Les effets visuels (`visual_effects`) sont déclenchés par les mêmes événements.
- Les paramètres (`settings_personalization`) modifient le thème global via un contexte de thème.
- La progression (`progression_system`) est mise à jour à chaque partie terminée.
- La navigation (`menu_navigation`) gère les transitions entre les écrans.
- Le classement (`leaderboard_social`) est mis à jour à la fin de chaque partie.

## [INSTRUCTION IA]

Structure de fichiers complète à générer :

```
src/
  App.tsx
  main.tsx
  index.css
  types/
    game.ts
    piece.ts
    level.ts
    settings.ts
    achievement.ts
  constants/
    pieces.ts
    levels.ts
    themes.ts
    achievements.ts
  hooks/
    useGameEngine.ts
    usePieceGenerator.ts
    useCollision.ts
    useAdaptiveAI.ts
    useAudioEngine.ts
    useProgression.ts
    useLeaderboard.ts
    useNavigation.ts
    useLocalStorage.ts
  components/
    core_engine/
      GameBoard.tsx
      Piece.tsx
    ai_adaptive/
      DifficultyManager.ts
      SpecialPieces.tsx
    creative_mode/
      LevelEditor.tsx
      LevelPalette.tsx
      LevelPreview.tsx
    ui_hud/
      HUD.tsx
      ScoreDisplay.tsx
      NextPiece.tsx
      HoldPiece.tsx
      ComboIndicator.tsx
    audio_system/
      MusicPlayer.tsx
    visual_effects/
      ParticleSystem.tsx
      GlowEffect.tsx
      LineClearAnimation.tsx
      ScreenTransition.tsx
    settings_personalization/
      SettingsPanel.tsx
      ThemeSelector.tsx
      SkinSelector.tsx
      ControlsConfig.tsx
    progression_system/
      ProgressionBar.tsx
      Achievements.tsx
      Unlockables.tsx
    menu_navigation/
      MainMenu.tsx
      GameScreen.tsx
      CreativeScreen.tsx
      SettingsScreen.tsx
      LeaderboardScreen.tsx
    leaderboard_social/
      Leaderboard.tsx
      ScoreEntry.tsx
      ShareButton.tsx
  utils/
    board.ts
    scoring.ts
    levelGenerator.ts
    soundGenerator.ts
    storage.ts
  styles/
    global.css
    themes.css
    components.css
```

Chaque composant doit être entièrement fonctionnel, avec des props typées, et utiliser les hooks appropriés. Le code doit être propre, commenté et suivre les meilleures pratiques React/TypeScript.