(function() {
  'use strict';

  const PRDS = {
    tmpl_neonstack_arcade_core: {
      title: 'Moteur de Jeu Principal',
      description: 'Implémente la logique de base du Tetris néon.',
      [CONTEXTE CACHÉ]: 'Le moteur doit gérer une grille 10x20, les pièces classiques, la rotation SRS, la détection de collision, et la gravité. Utiliser un hook useGameEngine pour encapsuler la logique.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_ai: {
      title: 'IA Adaptative',
      description: 'Ajuste la difficulté en temps réel.',
      [CONTEXTE CACHÉ]: 'Analyser les performances du joueur (lignes par minute, précision, vitesse) et ajuster la vitesse de chute et les patterns de pièces. Implémenter un DifficultyManager et un PatternGenerator.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_audio: {
      title: 'Bande-son Dynamique',
      description: 'Génère une musique synthwave et des effets sonores.',
      [CONTEXTE CACHÉ]: 'Utiliser Web Audio API pour créer des boucles musicales génératives et des sons pour les actions (rotation, ligne, game over). Exposer un AudioEngine avec des méthodes play(), stop(), setIntensity().',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_ui: {
      title: 'Interface Utilisateur',
      description: 'Composants UI pour menus, HUD, écrans.',
      [CONTEXTE CACHÉ]: 'Créer des composants React avec thème néon, glassmorphism, animations. Inclure MainMenu, HUD (score, niveau, prochaine pièce), GameOverScreen, PauseMenu.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_progression: {
      title: 'Progression et Compétences',
      description: 'Système de niveaux et compétences déblocables.',
      [CONTEXTE CACHÉ]: 'Implémenter un système d\'XP, un arbre de compétences (vitesse, précision, bonus), et une sauvegarde locale du profil joueur.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_creative: {
      title: 'Mode Créatif',
      description: 'Éditeur de niveaux personnalisés.',
      [CONTEXTE CACHÉ]: 'Fournir un éditeur de grille où l\'utilisateur peut placer des pièces, définir des séquences, et partager ses créations. Implémenter LevelEditor et CustomLevel.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_online: {
      title: 'Multijoueur Asynchrone',
      description: 'Classements, défis, tournois.',
      [CONTEXTE CACHÉ]: 'Créer un système de classement, des défis entre amis, et une gestion de tournois saisonniers. Utiliser des appels API simulés.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_events: {
      title: 'Événements Saisonniers',
      description: 'Quêtes et récompenses.',
      [CONTEXTE CACHÉ]: 'Implémenter un calendrier d\'événements, des quêtes spéciales, et un gestionnaire de récompenses cosmétiques.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_settings: {
      title: 'Paramètres',
      description: 'Réglages graphiques, audio, contrôles.',
      [CONTEXTE CACHÉ]: 'Créer un écran de réglages avec persistance des préférences, options d\'accessibilité.',
      [FIN DU CONTEXTE CACHÉ]
    },
    tmpl_neonstack_arcade_visuals: {
      title: 'Effets Visuels Néon',
      description: 'Particules, lueurs, animations.',
      [CONTEXTE CACHÉ]: 'Implémenter un système de particules, des effets de lueur, et un gestionnaire de thème synthwave.',
      [FIN DU CONTEXTE CACHÉ]
    }
  };

  function injectText(templateId) {
    const prd = PRDS[templateId];
    if (!prd) return;
    const text = `
## PRD: ${prd.title}

${prd.description}

${prd[CONTEXTE CACHÉ]}

${prd[FIN DU CONTEXTE CACHÉ]}
    `;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.log('PRD à injecter:', text);
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.id = 'neonstack-menu';
    menu.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#0d0221;border:2px solid #ff00ff;border-radius:10px;padding:10px;font-family:sans-serif;';
    const title = document.createElement('div');
    title.textContent = 'NEONSTACK PRDs';
    title.style.color = '#00ffff';
    title.style.fontWeight = 'bold';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(id => {
      const btn = document.createElement('button');
      btn.textContent = PRDS[id].title;
      btn.style.cssText = 'display:block;margin:5px 0;padding:5px;background:#ff00ff;color:#fff;border:none;border-radius:5px;cursor:pointer;';
      btn.onclick = () => injectText(id);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();