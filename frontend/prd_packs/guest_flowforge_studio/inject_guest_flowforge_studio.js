(function() {
  'use strict';

  const PRDS = {
    tmpl_flowforge_studio_canvas: {
      name: 'Workflow Canvas',
      description: 'Canvas interactif pour créer et éditer des workflows.',
      context: `[CONTEXTE CACHÉ]
        Le canvas doit permettre de glisser-déposer des nodes depuis la palette, de les connecter par des edges, et de naviguer (zoom, pan). Il doit être performant avec un grand nombre de nodes. Utiliser React Flow ou une implémentation personnalisée avec SVG. Le canvas doit être en dark mode avec une grille de fond subtile.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['WorkflowCanvas.tsx', 'NodeComponent.tsx', 'EdgeComponent.tsx', 'useWorkflowState.ts']
    },
    tmpl_flowforge_studio_node_palette: {
      name: 'Node Palette',
      description: 'Panneau latéral listant les nodes disponibles par catégorie.',
      context: `[CONTEXTE CACHÉ]
        La palette doit afficher les nodes regroupés par catégorie (Déclencheurs, Actions, Logique). Chaque node est draggable vers le canvas. Inclure une barre de recherche et des icônes. Style glassmorphism.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['NodePalette.tsx', 'NodeCategory.tsx', 'NodeItem.tsx']
    },
    tmpl_flowforge_studio_node_configurator: {
      name: 'Node Configurator',
      description: 'Panneau de configuration pour les paramètres d\'un node sélectionné.',
      context: `[CONTEXTE CACHÉ]
        Le configurateur doit afficher les champs de configuration dynamiques selon le type de node. Inclure la validation, la gestion des credentials, et un aperçu des données d\'entrée/sortie. Utiliser des formulaires avec feedback.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['NodeConfigurator.tsx', 'ConfigField.tsx', 'DataMapping.tsx']
    },
    tmpl_flowforge_studio_workflow_execution: {
      name: 'Workflow Execution',
      description: 'Console de visualisation des exécutions de workflows en temps réel.',
      context: `[CONTEXTE CACHÉ]
        Afficher les logs d\'exécution avec streaming, les statuts (succès, échec, en cours), et une timeline. Permettre de filtrer par statut. Utiliser des couleurs pour les différents niveaux de log.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['ExecutionPanel.tsx', 'ExecutionLog.tsx', 'ExecutionStatus.tsx']
    },
    tmpl_flowforge_studio_ai_assistant: {
      name: 'AI Assistant',
      description: 'Assistant IA pour aider à créer et optimiser des workflows.',
      context: `[CONTEXTE CACHÉ]
        L\'assistant doit être un chat intégré qui peut générer des workflows à partir de descriptions textuelles, suggérer des améliorations, et répondre à des questions. Utiliser une API d\'IA (ex: OpenAI) en arrière-plan. Interface conversationnelle avec suggestions cliquables.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['AIAssistant.tsx', 'ChatMessage.tsx', 'SuggestionChip.tsx']
    },
    tmpl_flowforge_studio_collaboration: {
      name: 'Collaboration',
      description: 'Fonctionnalités de collaboration temps réel.',
      context: `[CONTEXTE CACHÉ]
        Permettre la présence des utilisateurs (curseurs), les commentaires sur les nodes, et la co-édition. Utiliser WebSocket pour la synchronisation. Afficher les avatars et les commentaires dans un panneau latéral.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['CollaborationPanel.tsx', 'CommentThread.tsx', 'PresenceCursor.tsx']
    },
    tmpl_flowforge_studio_template_marketplace: {
      name: 'Template Marketplace',
      description: 'Marketplace de templates de workflows prêts à l\'emploi.',
      context: `[CONTEXTE CACHÉ]
        Afficher une grille de templates avec catégories, recherche, et aperçu. Chaque template peut être importé dans le canvas. Utiliser des cartes avec image, titre, description, et tags.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['TemplateMarketplace.tsx', 'TemplateCard.tsx', 'TemplatePreview.tsx']
    },
    tmpl_flowforge_studio_dashboard: {
      name: 'Dashboard',
      description: 'Tableau de bord avec statistiques et graphiques.',
      context: `[CONTEXTE CACHÉ]
        Afficher des KPIs (nombre d\'exécutions, taux de succès, etc.) et des graphiques d\'activité. Utiliser une bibliothèque de graphiques (ex: Recharts). Permettre de filtrer par période.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['Dashboard.tsx', 'StatCard.tsx', 'ActivityChart.tsx']
    },
    tmpl_flowforge_studio_credentials_manager: {
      name: 'Credentials Manager',
      description: 'Gestion des connexions aux services externes.',
      context: `[CONTEXTE CACHÉ]
        Afficher la liste des credentials (OAuth, API keys), permettre d\'ajouter, modifier, supprimer. Sécuriser l\'affichage des secrets. Utiliser des cartes avec indicateurs de statut.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['CredentialsManager.tsx', 'CredentialCard.tsx', 'CredentialForm.tsx']
    },
    tmpl_flowforge_studio_settings: {
      name: 'Settings',
      description: 'Paramètres utilisateur et préférences.',
      context: `[CONTEXTE CACHÉ]
        Permettre de modifier le profil, les préférences de notification, et les paramètres de l\'application. Utiliser des onglets et des formulaires.
      [FIN DU CONTEXTE CACHÉ]`,
      files: ['Settings.tsx', 'ProfileSettings.tsx', 'NotificationSettings.tsx']
    }
  };

  function injectText(templateId) {
    const prd = PRDS[templateId];
    if (!prd) return;
    const text = `
      Template: ${prd.name}
      Description: ${prd.description}
      Contexte: ${prd.context}
      Fichiers à générer: ${prd.files.join(', ')}
    `;
    // Injection dans le champ de saisie de l'IA (ex: textarea)
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; background:rgba(0,0,0,0.8); padding:10px; border-radius:8px;';
    const title = document.createElement('div');
    title.textContent = 'FlowForge Studio Templates';
    title.style.color = '#fff';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(function(id) {
      const btn = document.createElement('button');
      btn.textContent = PRDS[id].name;
      btn.style.cssText = 'display:block; margin:5px; padding:5px; background:#6366F1; color:#fff; border:none; border-radius:4px; cursor:pointer;';
      btn.addEventListener('click', function() { injectText(id); });
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();