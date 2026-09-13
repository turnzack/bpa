(function() {
  'use strict';

  const PRDS = {
    tmpl_workflow_orchestrator_canvas: {
      name: 'Workflow Canvas',
      description: 'Canevas visuel interactif pour créer et modifier des workflows par glisser-déposer.',
      context: `[CONTEXTE CACHÉ]
Ce module doit fournir un canevas de type node-based. Utiliser React Flow pour la gestion du graphe. Les nœuds représentent des actions (envoyer un email, appeler une API, etc.) et les connexions représentent le flux de données. Le canevas doit permettre de zoomer, déplacer, sélectionner, et supprimer des éléments. Une palette de nœuds doit être disponible sur le côté gauche. Le hook useWorkflowGraph doit gérer l'état du graphe (nœuds, arêtes) et fournir des fonctions pour ajouter, mettre à jour, supprimer des éléments.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : WorkflowCanvas.tsx, NodePalette.tsx, ConnectionLine.tsx, useWorkflowGraph.ts
- **Fonctionnalités** :
  - Drag-and-drop de nœuds depuis la palette vers le canevas.
  - Connexion entre nœuds par glisser depuis un port de sortie vers un port d'entrée.
  - Édition des propriétés d'un nœud via un panneau latéral.
  - Sauvegarde et chargement du workflow (JSON).
- **UI/UX** : Dark mode, nœuds avec coins arrondis, couleurs par type d'action, animations de connexion.
- **Tests** : Vérifier que le drag-and-drop fonctionne, que les connexions sont correctes, et que la sauvegarde/chargement est fidèle.
`
    },
    tmpl_workflow_orchestrator_ai_optimizer: {
      name: 'AI Optimizer',
      description: 'Analyse les workflows et propose des optimisations automatiques.',
      context: `[CONTEXTE CACHÉ]
Ce module doit intégrer un appel à un service d'IA (ex: OpenAI) pour analyser la structure du workflow et proposer des optimisations. Les suggestions doivent être affichées dans un panneau latéral avec un score de confiance et un bouton pour appliquer. Le hook useAIOptimizer doit gérer l'appel API et l'état des suggestions.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : AIOptimizerPanel.tsx, OptimizationSuggestionCard.tsx, useAIOptimizer.ts
- **Fonctionnalités** :
  - Bouton "Analyser" pour lancer l'analyse IA.
  - Affichage des suggestions avec description, impact estimé, et bouton "Appliquer".
  - Historique des optimisations appliquées.
- **UI/UX** : Panneau coulissant à droite, cartes avec icônes, animations de chargement.
- **Tests** : Simuler une réponse API et vérifier l'affichage des suggestions et l'application.
`
    },
    tmpl_workflow_orchestrator_error_detection: {
      name: 'Error Detection',
      description: 'Détecte proactivement les erreurs dans les workflows et alerte l\'utilisateur.',
      context: `[CONTEXTE CACHÉ]
Ce module doit collecter les erreurs d'exécution des workflows et les afficher dans un tableau de bord. L'IA doit générer des recommandations de correction pour chaque erreur. Le hook useErrorDetection doit interroger l'API pour obtenir les erreurs et les recommandations.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : ErrorDashboard.tsx, ErrorLogTable.tsx, ErrorDetailModal.tsx, useErrorDetection.ts
- **Fonctionnalités** :
  - Liste des erreurs avec sévérité, timestamp, et workflow concerné.
  - Filtres par sévérité et par workflow.
  - Clic sur une erreur pour afficher les détails et les recommandations IA.
- **UI/UX** : Tableau avec badges colorés, modale de détail avec suggestions.
- **Tests** : Vérifier le filtrage et l'affichage des détails.
`
    },
    tmpl_workflow_orchestrator_dynamic_adaptation: {
      name: 'Dynamic Adaptation',
      description: 'Adapte dynamiquement les workflows en fonction des changements de contexte.',
      context: `[CONTEXTE CACHÉ]
Ce module doit permettre de définir des règles d'adaptation (si condition alors action). Les conditions peuvent être basées sur des métriques (latence, erreurs) ou des événements externes. Le hook useDynamicAdaptation doit gérer la création et l'application des règles.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : AdaptationRules.tsx, RuleBuilder.tsx, AdaptationHistory.tsx, useDynamicAdaptation.ts
- **Fonctionnalités** :
  - Création de règles avec un builder visuel (condition, action).
  - Liste des règles actives avec possibilité de désactiver.
  - Historique des adaptations effectuées.
- **UI/UX** : Builder avec champs de sélection, historique sous forme de timeline.
- **Tests** : Vérifier la création de règles et l'application simulée.
`
    },
    tmpl_workflow_orchestrator_service_integration: {
      name: 'Service Integration',
      description: 'Gère les connexions aux services externes et leur authentification.',
      context: `[CONTEXTE CACHÉ]
Ce module doit permettre de configurer des intégrations avec des services externes (API REST, bases de données, webhooks). Il doit gérer les clés API, les tokens, et les tests de connexion. Le hook useServiceIntegration doit gérer la liste des intégrations et leur état.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : ServiceIntegrationManager.tsx, IntegrationForm.tsx, IntegrationList.tsx, useServiceIntegration.ts
- **Fonctionnalités** :
  - Ajout d'une nouvelle intégration avec formulaire (nom, type, URL, clé).
  - Test de connexion.
  - Liste des intégrations avec statut (connecté, échec).
- **UI/UX** : Formulaire avec validation, badges de statut.
- **Tests** : Vérifier l'ajout et le test de connexion.
`
    },
    tmpl_workflow_orchestrator_execution_monitor: {
      name: 'Execution Monitor',
      description: 'Surveille l\'exécution des workflows en temps réel.',
      context: `[CONTEXTE CACHÉ]
Ce module doit afficher les exécutions en cours et passées avec des métriques de performance. Utiliser des graphiques temps réel (latence, succès/échec). Le hook useExecutionMonitor doit interroger l'API pour obtenir les données d'exécution.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : ExecutionMonitor.tsx, ExecutionChart.tsx, ExecutionLogViewer.tsx, useExecutionMonitor.ts
- **Fonctionnalités** :
  - Graphique temps réel du nombre d'exécutions réussies/échouées.
  - Liste des exécutions récentes avec statut.
  - Vue détaillée d'une exécution avec logs.
- **UI/UX** : Graphiques avec animation, logs avec coloration syntaxique.
- **Tests** : Vérifier l'affichage des graphiques et des logs.
`
    },
    tmpl_workflow_orchestrator_automation_templates: {
      name: 'Automation Templates',
      description: 'Bibliothèque de modèles de workflows pré-construits.',
      context: `[CONTEXTE CACHÉ]
Ce module doit fournir une galerie de modèles de workflows pour des cas d'usage courants. Chaque modèle est un JSON de workflow. Le hook useAutomationTemplates doit charger les modèles depuis une API ou un fichier local.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : TemplateGallery.tsx, TemplateCard.tsx, TemplatePreview.tsx, useAutomationTemplates.ts
- **Fonctionnalités** :
  - Affichage des modèles avec catégories et recherche.
  - Aperçu du workflow du modèle.
  - Bouton "Utiliser" pour créer un nouveau workflow à partir du modèle.
- **UI/UX** : Cartes avec image d'aperçu, filtres par catégorie.
- **Tests** : Vérifier la recherche et la création à partir d'un modèle.
`
    },
    tmpl_workflow_orchestrator_user_collaboration: {
      name: 'User Collaboration',
      description: 'Permet la collaboration entre utilisateurs sur les workflows.',
      context: `[CONTEXTE CACHÉ]
Ce module doit gérer le partage de workflows avec d'autres utilisateurs, les commentaires et les versions. Le hook useCollaboration doit gérer les permissions et les commentaires.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : CollaborationPanel.tsx, CommentThread.tsx, VersionHistory.tsx, useCollaboration.ts
- **Fonctionnalités** :
  - Partage d'un workflow avec des utilisateurs (lecture/écriture).
  - Ajout de commentaires sur des nœuds ou sur le workflow entier.
  - Historique des versions avec restauration.
- **UI/UX** : Panneau latéral avec liste des collaborateurs, fil de commentaires.
- **Tests** : Vérifier le partage et l'ajout de commentaires.
`
    },
    tmpl_workflow_orchestrator_scheduler: {
      name: 'Scheduler',
      description: 'Planifie l\'exécution des workflows selon des horaires ou des événements.',
      context: `[CONTEXTE CACHÉ]
Ce module doit permettre de définir des déclencheurs temporels (cron) ou événementiels (webhook). Le hook useScheduler doit gérer la création et la gestion des déclencheurs.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : SchedulerEditor.tsx, CronInput.tsx, TriggerList.tsx, useScheduler.ts
- **Fonctionnalités** :
  - Création d'un déclencheur cron avec validation.
  - Création d'un déclencheur webhook (URL générée).
  - Liste des déclencheurs avec activation/désactivation.
- **UI/UX** : Éditeur avec prévisualisation du cron, liste avec switch.
- **Tests** : Vérifier la validation du cron et la génération du webhook.
`
    },
    tmpl_workflow_orchestrator_security_governance: {
      name: 'Security & Governance',
      description: 'Assure la sécurité des workflows et la conformité.',
      context: `[CONTEXTE CACHÉ]
Ce module doit gérer les politiques de sécurité (mots de passe, chiffrement), les rôles des utilisateurs et les logs d'audit. Le hook useSecurityGovernance doit gérer les politiques et les logs.
[FIN DU CONTEXTE CACHÉ]`,
      prd: `
- **Composants** : SecurityDashboard.tsx, PolicyManager.tsx, AuditLog.tsx, useSecurityGovernance.ts
- **Fonctionnalités** :
  - Affichage des politiques de sécurité actuelles.
  - Gestion des rôles (admin, éditeur, lecteur).
  - Logs d'audit avec filtres.
- **UI/UX** : Dashboard avec indicateurs de conformité, tableaux.
- **Tests** : Vérifier la gestion des rôles et l'affichage des logs.
`
    }
  };

  function injectText(text) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT' || activeElement.isContentEditable)) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value || '';
      activeElement.value = value.slice(0, start) + text + value.slice(end);
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Texte copié dans le presse-papiers !');
      });
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.id = 'workflow-orchestrator-menu';
    menu.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; background:#1a1a2e; border:1px solid #00D4FF; border-radius:8px; padding:10px; box-shadow:0 4px 12px rgba(0,0,0,0.5);';
    const title = document.createElement('div');
    title.textContent = 'Workflow Orchestrator';
    title.style.cssText = 'color:#00D4FF; font-weight:bold; margin-bottom:8px;';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = PRDS[key].name;
      btn.style.cssText = 'display:block; width:100%; margin:4px 0; padding:6px; background:#16213e; color:#fff; border:1px solid #0f3460; border-radius:4px; cursor:pointer;';
      btn.onclick = () => {
        const content = `# ${PRDS[key].name}\n\n${PRDS[key].description}\n\n${PRDS[key].context}\n\n${PRDS[key].prd}`;
        injectText(content);
      };
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();