(function() {
  'use strict';

  const PRDS = {
    tmpl_tetris_evolution_core_engine: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_core_engine
Mission : Implémenter le moteur de jeu Tetris pur.
Design Requis : Classe TetrisEngine avec méthodes de mouvement, rotation, chute, détection de collision, gestion des lignes complètes, score et niveaux. Utiliser un store Zustand pour l'état global.
Composants à générer : useTetrisEngine.ts, TetrisBoard.tsx, TetrisPiece.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_ui_ux: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_ui_ux
Mission : Créer l'interface utilisateur complète du jeu.
Design Requis : Thème néon futuriste avec glassmorphism, animations fluides (framer-motion), composants réutilisables.
Composants à générer : MainMenu.tsx, GameScreen.tsx, PauseModal.tsx, GameOverModal.tsx, ScoreBoard.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_ai_opponent: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_ai_opponent
Mission : Implémenter un adversaire IA adaptatif.
Design Requis : Algorithme de décision basé sur la recherche de meilleur placement, paramètres de difficulté.
Composants à générer : useAIOpponent.ts, AIPlayer.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_multiplayer: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_multiplayer
Mission : Gérer le multijoueur en temps réel.
Design Requis : WebSockets (Socket.io) pour la communication, gestion des salles et sessions.
Composants à générer : MultiplayerLobby.tsx, MultiplayerGame.tsx, ChatBox.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_social_features: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_social_features
Mission : Intégrer les fonctionnalités sociales.
Design Requis : API REST pour les classements, partage sur réseaux sociaux, profils utilisateurs.
Composants à générer : Leaderboard.tsx, UserProfile.tsx, ShareScoreButton.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_customization: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_customization
Mission : Permettre la personnalisation de l'expérience.
Design Requis : Système de thèmes CSS variables, sélecteur de skins, gestion des préférences.
Composants à générer : CustomizationPanel.tsx, ThemeSelector.tsx, SkinSelector.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_progression: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_progression
Mission : Gérer la progression du joueur.
Design Requis : Système de niveaux et XP, succès, récompenses.
Composants à générer : ProgressionBar.tsx, AchievementsList.tsx, RewardModal.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_analytics: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_analytics
Mission : Collecter et afficher des statistiques de jeu.
Design Requis : Tableau de bord avec graphiques (Recharts), stockage local ou distant.
Composants à générer : StatsDashboard.tsx, StatCard.tsx, LineChart.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_audio: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_audio
Mission : Gérer les effets sonores et la musique.
Design Requis : Web Audio API, gestion des pistes, contrôle du volume.
Composants à générer : AudioManager.ts, SoundToggle.tsx, MusicPlayer.tsx.
[FIN DU CONTEXTE CACHÉ]
`,
    tmpl_tetris_evolution_settings: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_evolution_settings
Mission : Gérer les paramètres du jeu.
Design Requis : Écran de réglages avec options, sauvegarde des préférences.
Composants à générer : SettingsScreen.tsx, DifficultySelector.tsx, ControlsCustomizer.tsx.
[FIN DU CONTEXTE CACHÉ]
`
  };

  function injectText(templateName) {
    const prd = PRDS[templateName];
    if (prd) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.value = prd;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; background:#0a0e27; border:1px solid #00f0ff; border-radius:8px; padding:10px; font-family: Arial;';
    const title = document.createElement('div');
    title.textContent = 'TETRIS EVOLUTION PRDs';
    title.style.color = '#00f0ff';
    title.style.fontWeight = 'bold';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(function(key) {
      const btn = document.createElement('button');
      btn.textContent = key.replace('tmpl_tetris_evolution_', '');
      btn.style.cssText = 'display:block; margin:5px 0; padding:5px; background:#1a1f3a; color:#fff; border:1px solid #00f0ff; border-radius:4px; cursor:pointer;';
      btn.onclick = function() { injectText(key); };
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();