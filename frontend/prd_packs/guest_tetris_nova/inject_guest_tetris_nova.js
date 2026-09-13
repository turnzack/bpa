(function() {
  'use strict';

  const PRDS = {
    tmpl_tetris_nova_core: {
      title: 'Moteur de Jeu Tetris',
      description: 'Implémente le cœur du jeu : grille, pièces, rotation, collision, lignes, score.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_core
Objectif : Fournir un moteur de jeu Tetris complet et performant.
Exigences :
- Grille 10x20, pièces standard avec couleurs néon.
- Système de rotation SRS, ghost piece, hold, next queue.
- Détection de collision, effacement de lignes, score, niveaux.
- Utiliser useReducer pour l'état du jeu.
- Exposer des hooks réutilisables.
[FIN DU CONTEXTE CACHÉ]

# PRD : Moteur de Jeu Tetris

## Objectif
Implémenter le moteur de jeu Tetris avec toutes les mécaniques classiques.

## Fonctionnalités
- Grille 10x20 avec cellules colorées.
- Pièces : I, O, T, S, Z, J, L avec formes et couleurs.
- Rotation horaire et antihoraire avec SRS.
- Ghost piece (projection de la pièce en bas).
- Hold piece (réserver une pièce).
- Next queue (3 pièces suivantes).
- Détection de collision (murs, sol, autres pièces).
- Effacement des lignes complètes avec animation.
- Score basé sur le nombre de lignes (100, 300, 500, 800) et niveau.
- Niveau augmente avec le nombre de lignes, vitesse de chute augmente.

## Composants à générer
- `GameBoard.tsx` : Affiche la grille et les pièces.
- `Piece.tsx` : Représente une pièce avec sa forme et couleur.
- `useTetrisEngine.ts` : Hook principal gérant l'état du jeu.
- `usePieceGenerator.ts` : Génère des pièces aléatoires.
- `useCollisionDetection.ts` : Détecte les collisions.

## Design
- Grille avec fond sombre, bordures lumineuses.
- Pièces avec dégradés et glow.
- Ghost piece en transparence.

## Tests
- Vérifier les rotations, collisions, effacement de lignes.
`
    },
    tmpl_tetris_nova_ai: {
      title: 'IA Adaptative',
      description: 'Système d\\'IA qui ajuste la difficulté et génère des défis personnalisés.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_ai
Objectif : Créer une IA qui analyse le joueur et adapte le jeu.
Exigences :
- Analyser les performances (vitesse, précision, patterns).
- Ajuster la vitesse de chute, la fréquence des pièces spéciales.
- Générer des objectifs personnalisés.
- Utiliser des algorithmes de machine learning simples (régression).
[FIN DU CONTEXTE CACHÉ]

# PRD : IA Adaptative

## Objectif
Offrir une expérience personnalisée en ajustant la difficulté en temps réel.

## Fonctionnalités
- Collecter des données de jeu (temps par pièce, erreurs, lignes par minute).
- Calculer un score de compétence.
- Moduler la vitesse de chute (de 0.5s à 0.1s).
- Introduire des pièces spéciales (bombes, lignes gelées) selon le niveau.
- Proposer des défis (ex: compléter 3 Tetris en 2 minutes).

## Composants à générer
- `AIDifficultyManager.ts` : Gère la logique d'adaptation.
- `usePlayerAnalysis.ts` : Hook pour analyser les performances.
- `ChallengeGenerator.ts` : Génère des défis.

## Design
- Interface discrète, indicateur de difficulté.

## Tests
- Vérifier que la difficulté augmente avec la compétence.
`
    },
    tmpl_tetris_nova_modes: {
      title: 'Modes de Jeu',
      description: 'Implémente plusieurs modes de jeu avec des règles variées.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_modes
Objectif : Fournir une variété de modes pour diversifier l'expérience.
Exigences :
- Modes : Classique, Sprint (40 lignes), Ultra (3 min), Marathon (150 lignes), Survie (obstacles), Puzzle (placement imposé).
- Chaque mode a des règles spécifiques.
- Interface de sélection claire.
[FIN DU CONTEXTE CACHÉ]

# PRD : Modes de Jeu

## Objectif
Proposer plusieurs façons de jouer pour augmenter la rejouabilité.

## Fonctionnalités
- Classique : sans limite de temps, niveau augmente.
- Sprint : terminer 40 lignes le plus vite possible.
- Ultra : score maximum en 3 minutes.
- Marathon : 150 lignes avec difficulté croissante.
- Survie : des obstacles apparaissent (lignes gelées, trous).
- Puzzle : placer des pièces pour former des motifs.

## Composants à générer
- `ModeSelector.tsx` : Écran de sélection.
- `GameMode.ts` : Type représentant un mode.
- `ModeRules.ts` : Règles de chaque mode.

## Design
- Cartes avec icônes et descriptions.

## Tests
- Vérifier que chaque mode applique ses règles.
`
    },
    tmpl_tetris_nova_social: {
      title: 'Fonctionnalités Sociales',
      description: 'Classements, défis entre amis, partage de scores.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_social
Objectif : Intégrer des éléments sociaux pour engager la communauté.
Exigences :
- Tableau des scores global et par amis.
- Système d'invitation d'amis.
- Partage de scores sur réseaux sociaux.
- Défis personnalisés entre amis.
[FIN DU CONTEXTE CACHÉ]

# PRD : Fonctionnalités Sociales

## Objectif
Cultiver une communauté compétitive et collaborative.

## Fonctionnalités
- Leaderboard global et hebdomadaire.
- Ajout d'amis par nom d'utilisateur.
- Comparaison des scores avec les amis.
- Envoi de défis (ex: battre mon score).
- Partage de captures d'écran ou de replays sur Twitter, Facebook.

## Composants à générer
- `Leaderboard.tsx` : Affiche les classements.
- `SocialShare.tsx` : Boutons de partage.
- `FriendChallenge.tsx` : Gère les défis entre amis.

## Design
- Interface avec avatars, badges.

## Tests
- Vérifier la mise à jour des scores.
`
    },
    tmpl_tetris_nova_progression: {
      title: 'Système de Progression',
      description: 'Niveaux, XP, succès, déblocages.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_progression
Objectif : Motiver le joueur avec un système de progression.
Exigences :
- XP gagné à chaque partie.
- Niveaux avec récompenses (cosmétiques, thèmes).
- Succès variés (première ligne, 100 lignes, etc.).
- Barre de progression visible.
[FIN DU CONTEXTE CACHÉ]

# PRD : Système de Progression

## Objectif
Encourager la pratique régulière.

## Fonctionnalités
- XP basé sur le score et les lignes.
- Niveaux de 1 à 100, chaque niveau débloque quelque chose.
- Succès avec badges.
- Progression sauvegardée localement.

## Composants à générer
- `ProgressionPanel.tsx` : Affiche niveau et XP.
- `AchievementBadge.tsx` : Badge pour chaque succès.
- `useProgression.ts` : Hook pour gérer la progression.

## Design
- Barre de progression avec dégradé.

## Tests
- Vérifier le calcul d'XP.
`
    },
    tmpl_tetris_nova_customization: {
      title: 'Personnalisation',
      description: 'Thèmes, skins, effets sonores, musique.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_customization
Objectif : Permettre au joueur de personnaliser son expérience.
Exigences :
- Éditeur de thème (couleurs de fond, de pièces).
- Skins de pièces (classique, néon, pixel).
- Réglages audio (volume, musique, effets).
- Sauvegarde des préférences.
[FIN DU CONTEXTE CACHÉ]

# PRD : Personnalisation

## Objectif
Offrir une expérience unique à chaque joueur.

## Fonctionnalités
- Thèmes : sombre, clair, néon, rétro.
- Skins de pièces : couleurs, motifs.
- Musique de fond et effets sonores personnalisables.
- Aperçu en direct.

## Composants à générer
- `ThemeEditor.tsx` : Éditeur de thème.
- `SkinSelector.tsx` : Sélecteur de skins.
- `AudioSettings.tsx` : Réglages audio.

## Design
- Interface avec aperçu en direct.

## Tests
- Vérifier l'application du thème.
`
    },
    tmpl_tetris_nova_replay: {
      title: 'Système de Replay',
      description: 'Enregistrement et relecture des parties.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_replay
Objectif : Permettre de revoir et partager ses parties.
Exigences :
- Enregistrer les actions (touches, timestamps).
- Rejouer avec contrôles (pause, vitesse).
- Exporter en vidéo (via canvas).
- Liste des replays.
[FIN DU CONTEXTE CACHÉ]

# PRD : Système de Replay

## Objectif
Analyser et partager ses performances.

## Fonctionnalités
- Enregistrement automatique des parties.
- Lecture avec contrôles (play, pause, vitesse).
- Export en WebM.
- Sauvegarde locale.

## Composants à générer
- `ReplayRecorder.ts` : Enregistre les actions.
- `ReplayPlayer.tsx` : Lit un replay.
- `ReplayList.tsx` : Liste des replays.

## Design
- Interface avec timeline.

## Tests
- Vérifier la fidélité de la relecture.
`
    },
    tmpl_tetris_nova_stats: {
      title: 'Statistiques Avancées',
      description: 'Graphiques et analyses des performances.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_stats
Objectif : Fournir des statistiques détaillées.
Exigences :
- Graphiques d'évolution (score, lignes, précision).
- Comparaison avec la moyenne.
- Analyse des points faibles.
- Utiliser une bibliothèque de graphiques (Recharts).
[FIN DU CONTEXTE CACHÉ]

# PRD : Statistiques Avancées

## Objectif
Aider le joueur à progresser.

## Fonctionnalités
- Graphique du score au fil du temps.
- Graphique du nombre de lignes par partie.
- Précision (pièces bien placées).
- Analyse des erreurs (collisions, malus).

## Composants à générer
- `StatsDashboard.tsx` : Tableau de bord.
- `PerformanceChart.tsx` : Graphique.
- `useStats.ts` : Hook pour calculer les stats.

## Design
- Graphiques interactifs.

## Tests
- Vérifier les calculs.
`
    },
    tmpl_tetris_nova_tutorial: {
      title: 'Tutoriel Interactif',
      description: 'Apprentissage des bases et techniques avancées.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_tutorial
Objectif : Guider les nouveaux joueurs.
Exigences :
- Étapes guidées avec animations.
- Démonstrations de techniques (T-spin, combo).
- Quiz pour valider.
- Accessible depuis le menu.
[FIN DU CONTEXTE CACHÉ]

# PRD : Tutoriel Interactif

## Objectif
Rendre le jeu accessible à tous.

## Fonctionnalités
- Étapes : déplacement, rotation, hold, ghost.
- Techniques avancées : T-spin, combo, back-to-back.
- Quiz avec feedback.
- Progression sauvegardée.

## Composants à générer
- `TutorialStep.tsx` : Étape du tutoriel.
- `TutorialOverlay.tsx` : Superposition sur le jeu.
- `useTutorial.ts` : Hook pour gérer le tutoriel.

## Design
- Animations explicatives.

## Tests
- Vérifier le déroulement.
`
    },
    tmpl_tetris_nova_settings: {
      title: 'Paramètres du Jeu',
      description: 'Contrôles, accessibilité, langue.',
      prd: `
[CONTEXTE CACHÉ]
Module : tmpl_tetris_nova_settings
Objectif : Permettre de configurer le jeu selon ses préférences.
Exigences :
- Remappage des touches.
- Options d'accessibilité (daltonisme, taille de police).
- Choix de la langue.
- Sauvegarde des paramètres.
[FIN DU CONTEXTE CACHÉ]

# PRD : Paramètres du Jeu

## Objectif
Adapter le jeu aux besoins de chacun.

## Fonctionnalités
- Contrôles : gauche, droite, bas, rotation, hold, pause.
- Accessibilité : mode daltonien, police agrandie, réduction des animations.
- Langues : français, anglais, espagnol.

## Composants à générer
- `SettingsPanel.tsx` : Panneau principal.
- `ControlsConfig.tsx` : Configuration des touches.
- `AccessibilityOptions.tsx` : Options d'accessibilité.

## Design
- Interface claire.

## Tests
- Vérifier la sauvegarde.
`
    }
  };

  function injectText(text) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT' || activeElement.isContentEditable)) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      activeElement.value = value.substring(0, start) + text + value.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Texte copié dans le presse-papiers !');
      });
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position:fixed; bottom:20px; right:20px; background:rgba(0,0,0,0.8); color:white; padding:10px; border-radius:8px; z-index:9999; font-family:sans-serif;';
    const title = document.createElement('div');
    title.textContent = 'TETRIS NOVA - Injection PRD';
    title.style.fontWeight = 'bold';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = PRDS[key].title;
      btn.style.cssText = 'display:block; margin:5px 0; padding:5px; background:#333; color:white; border:none; border-radius:4px; cursor:pointer;';
      btn.onclick = () => injectText(PRDS[key].prd);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();