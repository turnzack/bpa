(function() {
  'use strict';

  const PRDS = {
    tmpl_neonstack_core_engine: {
      title: "Moteur de Jeu Principal",
      description: "Implémente la logique de base du jeu Tetris : grille, pièces, rotation, collision, lignes, score, niveaux.",
      context: `[CONTEXTE CACHÉ]
- Grille de 10 colonnes x 20 lignes.
- Pièces standard (I, O, T, S, Z, J, L) avec leurs rotations.
- Système de rotation SRS (Super Rotation System).
- Détection de collision avec les bords et les pièces empilées.
- Gestion de la gravité (vitesse de chute).
- Détection de lignes complètes et suppression.
- Scoring : 100 points pour 1 ligne, 300 pour 2, 500 pour 3, 800 pour 4, multiplié par le niveau.
- Niveaux : augmente tous les 10 lignes, augmente la vitesse.
- Game over si les pièces atteignent le sommet.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["GameBoard.tsx", "Piece.tsx", "useGameEngine.ts", "usePieceGenerator.ts", "useCollision.ts"]
    },
    tmpl_neonstack_ai_adaptive: {
      title: "IA Adaptative",
      description: "Ajuste la difficulté en temps réel en fonction des performances du joueur.",
      context: `[CONTEXTE CACHÉ]
- Analyse le score, le nombre de lignes, le temps écoulé.
- Si le joueur performe bien (score élevé, lignes rapides), augmente la vitesse de chute.
- Si le joueur a des difficultés (lignes lentes, game over fréquents), réduit la vitesse.
- Introduit des pièces spéciales (bombes, pièces gelées) à des niveaux de difficulté élevés.
- Utilise une courbe de difficulté progressive.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["useAdaptiveAI.ts", "DifficultyManager.ts", "SpecialPieces.tsx"]
    },
    tmpl_neonstack_creative_mode: {
      title: "Mode Créatif",
      description: "Permet de créer des niveaux personnalisés avec un éditeur visuel.",
      context: `[CONTEXTE CACHÉ]
- Éditeur de grille avec placement de pièces initiales.
- Palette de pièces disponibles.
- Définition de la séquence de pièces (ou aléatoire).
- Objectifs personnalisés (ex: atteindre un score, lignes spécifiques).
- Sauvegarde/chargement des niveaux en JSON.
- Export/import de niveaux.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["LevelEditor.tsx", "LevelPalette.tsx", "LevelPreview.tsx", "useLevelBuilder.ts"]
    },
    tmpl_neonstack_ui_hud: {
      title: "Interface HUD",
      description: "Affiche les informations de jeu en temps réel.",
      context: `[CONTEXTE CACHÉ]
- Score actuel, meilleur score.
- Niveau actuel, lignes complétées.
- Prochaine pièce, pièce en hold.
- Compteur de combo.
- Animations de score (flottement, changement de couleur).
- Affichage stylisé avec effet néon.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["HUD.tsx", "ScoreDisplay.tsx", "NextPiece.tsx", "HoldPiece.tsx", "ComboIndicator.tsx"]
    },
    tmpl_neonstack_audio_system: {
      title: "Système Audio",
      description: "Gère les effets sonores 8-bit et la musique de fond synthwave.",
      context: `[CONTEXTE CACHÉ]
- Utilisation de Web Audio API pour générer des sons rétro.
- Sons pour : déplacement, rotation, ligne complétée, game over, niveau supérieur.
- Musique de fond en boucle avec style synthwave.
- Contrôle du volume et activation/désactivation.
- Les sons doivent être générés procéduralement (pas de fichiers externes).
[FIN DU CONTEXTE CACHÉ]`,
      components: ["useAudioEngine.ts", "SoundEffects.ts", "MusicPlayer.tsx"]
    },
    tmpl_neonstack_visual_effects: {
      title: "Effets Visuels",
      description: "Gère les effets néon, particules et animations.",
      context: `[CONTEXTE CACHÉ]
- Effet de lueur néon sur les pièces et la grille.
- Particules lors de la destruction de lignes.
- Animation de flash lors de lignes complétées.
- Transition d'écran entre les menus et le jeu.
- Effet de secousse de l'écran lors de game over.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["ParticleSystem.tsx", "GlowEffect.tsx", "LineClearAnimation.tsx", "ScreenTransition.tsx"]
    },
    tmpl_neonstack_settings_personalization: {
      title: "Paramètres et Personnalisation",
      description: "Permet de personnaliser l'expérience de jeu.",
      context: `[CONTEXTE CACHÉ]
- Thèmes de couleurs : néon classique, synthwave, dark.
- Skins de pièces : différents styles visuels.
- Fonds d'écran : images ou dégradés.
- Difficulté manuelle : vitesse initiale, apparition de pièces spéciales.
- Contrôles : remappage des touches.
- Sauvegarde des préférences dans localStorage.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["SettingsPanel.tsx", "ThemeSelector.tsx", "SkinSelector.tsx", "ControlsConfig.tsx"]
    },
    tmpl_neonstack_progression_system: {
      title: "Système de Progression",
      description: "Gère les niveaux, l'expérience et les succès.",
      context: `[CONTEXTE CACHÉ]
- Niveau du joueur basé sur le score total.
- Barre d'expérience.
- Succès débloquables (ex: 100 lignes, score de 10000).
- Déblocage de contenu (skins, thèmes) en fonction des succès.
- Sauvegarde de la progression dans localStorage.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["ProgressionBar.tsx", "Achievements.tsx", "Unlockables.tsx", "useProgression.ts"]
    },
    tmpl_neonstack_menu_navigation: {
      title: "Navigation et Menus",
      description: "Gère la navigation entre les écrans du jeu.",
      context: `[CONTEXTE CACHÉ]
- Menu principal avec options : Jouer, Mode Créatif, Paramètres, Classement.
- Écran de jeu avec pause et options.
- Écran de mode créatif.
- Écran de paramètres.
- Écran de classement.
- Transitions fluides entre les écrans.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["MainMenu.tsx", "GameScreen.tsx", "CreativeScreen.tsx", "SettingsScreen.tsx", "LeaderboardScreen.tsx", "useNavigation.ts"]
    },
    tmpl_neonstack_leaderboard_social: {
      title: "Classement et Partage Social",
      description: "Affiche les meilleurs scores et permet le partage.",
      context: `[CONTEXTE CACHÉ]
- Tableau des scores locaux (top 10).
- Sauvegarde des scores dans localStorage.
- Boutons de partage sur Twitter, Facebook.
- Capture d'écran du score pour le partage.
- Affichage stylisé néon.
[FIN DU CONTEXTE CACHÉ]`,
      components: ["Leaderboard.tsx", "ScoreEntry.tsx", "ShareButton.tsx", "useLeaderboard.ts"]
    }
  };

  function injectText(templateId) {
    const prd = PRDS[templateId];
    if (!prd) return;
    const text = `
## ${prd.title}

${prd.description}

${prd.context}

Composants à générer : ${prd.components.join(', ')}
    `;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      activeElement.value = activeElement.value.slice(0, start) + text + activeElement.value.slice(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.log(text);
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #1a1a2e; border: 2px solid #00ffff; border-radius: 8px; padding: 10px; z-index: 9999; font-family: monospace;';
    const title = document.createElement('div');
    title.textContent = 'NeonStack PRDs';
    title.style.cssText = 'color: #00ffff; font-weight: bold; margin-bottom: 8px;';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(function(key) {
      const btn = document.createElement('button');
      btn.textContent = PRDS[key].title;
      btn.style.cssText = 'display: block; width: 100%; margin: 4px 0; padding: 4px; background: #0a0a0f; color: #ff00ff; border: 1px solid #ff00ff; border-radius: 4px; cursor: pointer;';
      btn.onclick = function() { injectText(key); };
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();