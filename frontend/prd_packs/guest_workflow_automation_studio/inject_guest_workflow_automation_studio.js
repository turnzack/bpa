(function() {
  'use strict';

  const PRDS = {
    'tmpl_workflow_automation_studio_canvas': `
      [CONTEXTE CACHÉ]
      Module: Canvas de Workflow
      Rôle: Interface principale de conception de workflows.
      Fonctionnalités: Glisser-déposer de nœuds, zoom, pan, mini-carte.
      Design: Fond sombre avec grille, nœuds colorés par catégorie.
      [FIN DU CONTEXTE CACHÉ]
      Génère un composant React TypeScript pour le canevas de workflow avec les fonctionnalités suivantes :
      - Zone de glisser-déposer pour les nœuds.
      - Zoom et pan (molette, boutons).
      - Mini-carte en bas à droite.
      - Palette de nœuds à gauche.
      - Utilise le store Zustand pour l'état.
    `,
    'tmpl_workflow_automation_studio_nodes': `
      [CONTEXTE CACHÉ]
      Module: Gestion des Nœuds
      Rôle: Définir et configurer les nœuds du workflow.
      Types: Déclencheur, Action, Condition, Logique.
      [FIN DU CONTEXTE CACHÉ]
      Génère les composants pour afficher et configurer les nœuds :
      - NodeCard avec icône, nom, couleur.
      - NodeConfigPanel pour éditer les propriétés.
      - Types TypeScript pour les nœuds.
    `,
    'tmpl_workflow_automation_studio_connections': `
      [CONTEXTE CACHÉ]
      Module: Connexions
      Rôle: Relier les nœuds entre eux pour former le flux.
      [FIN DU CONTEXTE CACHÉ]
      Génère les composants pour les connexions :
      - Lignes courbes SVG avec animation.
      - Points de connexion sur les nœuds.
      - Hook pour gérer les connexions.
    `,
    'tmpl_workflow_automation_studio_integrations': `
      [CONTEXTE CACHÉ]
      Module: Intégrations
      Rôle: Connecter des services externes (Gmail, Slack, etc.).
      [FIN DU CONTEXTE CACHÉ]
      Génère la bibliothèque d'intégrations :
      - Liste avec recherche.
      - Fiches détaillées avec configuration OAuth.
      - Modale de configuration.
    `,
    'tmpl_workflow_automation_studio_execution': `
      [CONTEXTE CACHÉ]
      Module: Exécution
      Rôle: Exécuter les workflows et afficher les résultats.
      [FIN DU CONTEXTE CACHÉ]
      Génère le panneau d'exécution :
      - Logs en temps réel.
      - Statut des nœuds.
      - Boutons pour démarrer/arrêter.
    `,
    'tmpl_workflow_automation_studio_scheduler': `
      [CONTEXTE CACHÉ]
      Module: Planification
      Rôle: Planifier l'exécution automatique des workflows.
      [FIN DU CONTEXTE CACHÉ]
      Génère l'interface de planification :
      - Configuration cron ou intervalle.
      - Liste des planifications.
      - Hook pour gérer la planification.
    `,
    'tmpl_workflow_automation_studio_monitoring': `
      [CONTEXTE CACHÉ]
      Module: Monitoring
      Rôle: Surveiller les performances et les erreurs.
      [FIN DU CONTEXTE CACHÉ]
      Génère le tableau de bord de monitoring :
      - Graphiques de performance.
      - Liste des alertes.
      - Historique des exécutions.
    `,
    'tmpl_workflow_automation_studio_templates': `
      [CONTEXTE CACHÉ]
      Module: Modèles
      Rôle: Fournir des workflows pré-construits.
      [FIN DU CONTEXTE CACHÉ]
      Génère la galerie de modèles :
      - Cartes avec aperçu.
      - Catégories.
      - Import en un clic.
    `,
    'tmpl_workflow_automation_studio_settings': `
      [CONTEXTE CACHÉ]
      Module: Paramètres
      Rôle: Gérer les préférences et les clés API.
      [FIN DU CONTEXTE CACHÉ]
      Génère la page de paramètres :
      - Onglets (profil, API, préférences).
      - Gestion des clés API.
      - Formulaire de préférences.
    `,
    'tmpl_workflow_automation_studio_ai_assistant': `
      [CONTEXTE CACHÉ]
      Module: Assistant IA
      Rôle: Aider à créer des workflows via chat.
      [FIN DU CONTEXTE CACHÉ]
      Génère l'assistant IA :
      - Chatbot avec suggestions.
      - Panneau de suggestions contextuelles.
      - Hook pour gérer l'assistant.
    `
  };

  function injectText(templateName) {
    const prd = PRDS[templateName];
    if (!prd) {
      console.error('Template PRD non trouvé:', templateName);
      return;
    }
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = prd;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.warn('Aucune zone de texte trouvée pour injection.');
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.id = 'prd-injector-menu';
    menu.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999; background:#1e1e2e; color:#fff; padding:15px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.3); font-family:Inter, sans-serif;';
    menu.innerHTML = '<strong style="display:block; margin-bottom:10px;">Injecter PRD</strong>';
    Object.keys(PRDS).forEach(templateName => {
      const btn = document.createElement('button');
      btn.textContent = templateName.replace('tmpl_workflow_automation_studio_', '');
      btn.style.cssText = 'display:block; width:100%; margin:5px 0; padding:8px; background:#2a2a3c; border:none; color:#fff; border-radius:4px; cursor:pointer;';
      btn.onclick = () => injectText(templateName);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();