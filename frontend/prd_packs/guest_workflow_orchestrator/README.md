> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu génères des PRD (Product Requirements Documents) de haute qualité pour des projets React/TypeScript. Tu dois produire des spécifications détaillées, précises et actionnables, en t'inspirant du modèle ecommerce_pack. Chaque module doit être nommé et pensé pour le domaine exact du projet. La vision UI/UX doit décrire précisément des composants .tsx, des hooks, des états et des designs. Tu dois respecter les règles absolues : zéro fichier générique, modules nommés pour le domaine, script d'injection avec PRDS complets, et réponse en JSON valide.

# 🚀 WORKFLOW ORCHESTRATOR

## 📌 Description du Domaine Métier

WORKFLOW ORCHESTRATOR est une plateforme d'orchestration de workflows autonomes avec IA générative. Elle permet aux entreprises de créer, gérer et optimiser des workflows automatisés reliant des services et applications variés. L'IA intégrée assure une auto-optimisation des processus, une détection proactive des erreurs et une adaptation dynamique aux changements de contexte, réduisant ainsi la charge de maintenance et augmentant l'agilité opérationnelle.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. tmpl_workflow_orchestrator_canvas
- **Mission** : Fournir un canevas visuel interactif pour la création et la modification de workflows par glisser-déposer.
- **Design Requis** : Interface type "node-based" avec des nœuds représentant des actions, des connecteurs pour les flux de données, et une palette de composants. Utiliser React Flow pour la gestion du graphe.
- **Composants à générer** : `WorkflowCanvas.tsx`, `NodePalette.tsx`, `ConnectionLine.tsx`, `useWorkflowGraph.ts` (hook pour gérer l'état du graphe).

### 2. tmpl_workflow_orchestrator_ai_optimizer
- **Mission** : Intégrer l'IA générative pour analyser les workflows existants et proposer des optimisations automatiques (réduction de latence, détection de goulots d'étranglement).
- **Design Requis** : Panneau latéral avec suggestions d'optimisation, indicateurs de performance, et bouton "Appliquer" pour intégrer les changements.
- **Composants à générer** : `AIOptimizerPanel.tsx`, `OptimizationSuggestionCard.tsx`, `useAIOptimizer.ts` (hook pour appeler l'API d'optimisation).

### 3. tmpl_workflow_orchestrator_error_detection
- **Mission** : Détecter proactivement les erreurs dans les workflows et alerter l'utilisateur avec des recommandations de correction.
- **Design Requis** : Tableau de bord avec logs d'erreurs, filtres par sévérité, et suggestions de correctifs générées par l'IA.
- **Composants à générer** : `ErrorDashboard.tsx`, `ErrorLogTable.tsx`, `ErrorDetailModal.tsx`, `useErrorDetection.ts`.

### 4. tmpl_workflow_orchestrator_dynamic_adaptation
- **Mission** : Adapter dynamiquement les workflows en fonction des changements de contexte (ex: changement de disponibilité d'un service, variation de charge).
- **Design Requis** : Interface de configuration des règles d'adaptation, avec conditions et actions. Visualisation en temps réel des adaptations effectuées.
- **Composants à générer** : `AdaptationRules.tsx`, `RuleBuilder.tsx`, `AdaptationHistory.tsx`, `useDynamicAdaptation.ts`.

### 5. tmpl_workflow_orchestrator_service_integration
- **Mission** : Gérer les connexions aux services externes (API, bases de données, webhooks) et leur authentification.
- **Design Requis** : Écran de configuration des intégrations avec formulaire de connexion, gestion des clés API, et test de connexion.
- **Composants à générer** : `ServiceIntegrationManager.tsx`, `IntegrationForm.tsx`, `IntegrationList.tsx`, `useServiceIntegration.ts`.

### 6. tmpl_workflow_orchestrator_execution_monitor
- **Mission** : Surveiller l'exécution des workflows en temps réel, afficher les métriques de performance et les logs d'exécution.
- **Design Requis** : Dashboard avec graphiques temps réel (latence, succès/échec), liste des exécutions récentes, et vue détaillée d'une exécution.
- **Composants à générer** : `ExecutionMonitor.tsx`, `ExecutionChart.tsx`, `ExecutionLogViewer.tsx`, `useExecutionMonitor.ts`.

### 7. tmpl_workflow_orchestrator_automation_templates
- **Mission** : Proposer une bibliothèque de modèles de workflows pré-construits pour des cas d'usage courants (ex: synchronisation de données, notification, traitement de fichiers).
- **Design Requis** : Galerie de modèles avec catégories, recherche, et aperçu du workflow. Bouton "Utiliser" pour créer un nouveau workflow à partir du modèle.
- **Composants à générer** : `TemplateGallery.tsx`, `TemplateCard.tsx`, `TemplatePreview.tsx`, `useAutomationTemplates.ts`.

### 8. tmpl_workflow_orchestrator_user_collaboration
- **Mission** : Permettre la collaboration entre plusieurs utilisateurs sur les mêmes workflows (partage, commentaires, versions).
- **Design Requis** : Interface de gestion des permissions, système de commentaires intégré au canevas, et historique des versions avec restauration.
- **Composants à générer** : `CollaborationPanel.tsx`, `CommentThread.tsx`, `VersionHistory.tsx`, `useCollaboration.ts`.

### 9. tmpl_workflow_orchestrator_scheduler
- **Mission** : Planifier l'exécution des workflows selon des horaires ou des événements déclencheurs.
- **Design Requis** : Éditeur de planification avec cron expressions, calendrier visuel, et gestion des déclencheurs.
- **Composants à générer** : `SchedulerEditor.tsx`, `CronInput.tsx`, `TriggerList.tsx`, `useScheduler.ts`.

### 10. tmpl_workflow_orchestrator_security_governance
- **Mission** : Assurer la sécurité des workflows et la conformité aux politiques de l'entreprise (gestion des accès, chiffrement, audit).
- **Design Requis** : Tableau de bord de sécurité avec politiques, logs d'audit, et gestion des rôles.
- **Composants à générer** : `SecurityDashboard.tsx`, `PolicyManager.tsx`, `AuditLog.tsx`, `useSecurityGovernance.ts`.

## 🎨 Vision UI/UX & Design System Global

- **Thème** : Dark mode glassmorphism avec des accents de couleur néon (bleu électrique #00D4FF, vert émeraude #00FF9D, orange #FF6B35).
- **Typographie** : Inter pour les textes, JetBrains Mono pour le code et les logs.
- **Composants UI** : Boutons avec effet de glow, cartes avec fond semi-transparent et blur, tooltips personnalisés, modales avec animation de scale.
- **Layout** : Sidebar de navigation à gauche, zone principale pour le contenu, panneaux latéraux coulissants pour les détails.
- **Interactions** : Drag-and-drop fluide, animations de transition (fade, slide), feedback visuel en temps réel (spinners, toasts).
- **Hooks personnalisés** : `useTheme`, `useToast`, `useModal`, `useDebounce`, `useLocalStorage`.

## 🔌 Directives de Câblage VFS

- **Structure des dossiers** : Chaque module doit être dans `src/modules/tmpl_workflow_orchestrator_<nom>/` avec ses composants, hooks, et styles.
- **Imports** : Utiliser des alias `@/` pour pointer vers `src/`.
- **State Management** : Utiliser Zustand pour les états globaux (workflows, exécutions, utilisateurs).
- **API** : Créer un service API centralisé dans `src/services/api.ts` avec des fonctions pour chaque module.
- **Routing** : Utiliser React Router avec des routes pour chaque module principal.

## 🔄 Instruction de Fusion

- **Fusion des PRDS** : Chaque PRD de module doit être fusionné dans le code source en respectant la structure définie. Les composants doivent être créés dans les dossiers correspondants.
- **Intégration des hooks** : Les hooks personnalisés doivent être placés dans `src/hooks/` et importés dans les composants.
- **Styles** : Utiliser CSS Modules ou Tailwind CSS avec configuration pour le thème glassmorphism.
- **Tests** : Ajouter des tests unitaires pour les composants critiques (WorkflowCanvas, AIOptimizerPanel, etc.).

## [INSTRUCTION IA]

Structure de fichiers `src/` complète :

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── modules/
│   ├── tmpl_workflow_orchestrator_canvas/
│   │   ├── WorkflowCanvas.tsx
│   │   ├── NodePalette.tsx
│   │   ├── ConnectionLine.tsx
│   │   └── useWorkflowGraph.ts
│   ├── tmpl_workflow_orchestrator_ai_optimizer/
│   │   ├── AIOptimizerPanel.tsx
│   │   ├── OptimizationSuggestionCard.tsx
│   │   └── useAIOptimizer.ts
│   ├── tmpl_workflow_orchestrator_error_detection/
│   │   ├── ErrorDashboard.tsx
│   │   ├── ErrorLogTable.tsx
│   │   ├── ErrorDetailModal.tsx
│   │   └── useErrorDetection.ts
│   ├── tmpl_workflow_orchestrator_dynamic_adaptation/
│   │   ├── AdaptationRules.tsx
│   │   ├── RuleBuilder.tsx
│   │   ├── AdaptationHistory.tsx
│   │   └── useDynamicAdaptation.ts
│   ├── tmpl_workflow_orchestrator_service_integration/
│   │   ├── ServiceIntegrationManager.tsx
│   │   ├── IntegrationForm.tsx
│   │   ├── IntegrationList.tsx
│   │   └── useServiceIntegration.ts
│   ├── tmpl_workflow_orchestrator_execution_monitor/
│   │   ├── ExecutionMonitor.tsx
│   │   ├── ExecutionChart.tsx
│   │   ├── ExecutionLogViewer.tsx
│   │   └── useExecutionMonitor.ts
│   ├── tmpl_workflow_orchestrator_automation_templates/
│   │   ├── TemplateGallery.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── TemplatePreview.tsx
│   │   └── useAutomationTemplates.ts
│   ├── tmpl_workflow_orchestrator_user_collaboration/
│   │   ├── CollaborationPanel.tsx
│   │   ├── CommentThread.tsx
│   │   ├── VersionHistory.tsx
│   │   └── useCollaboration.ts
│   ├── tmpl_workflow_orchestrator_scheduler/
│   │   ├── SchedulerEditor.tsx
│   │   ├── CronInput.tsx
│   │   ├── TriggerList.tsx
│   │   └── useScheduler.ts
│   └── tmpl_workflow_orchestrator_security_governance/
│       ├── SecurityDashboard.tsx
│       ├── PolicyManager.tsx
│       ├── AuditLog.tsx
│       └── useSecurityGovernance.ts
├── hooks/
│   ├── useTheme.ts
│   ├── useToast.ts
│   ├── useModal.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── services/
│   └── api.ts
├── store/
│   ├── workflowStore.ts
│   ├── executionStore.ts
│   └── userStore.ts
├── components/
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   └── Toast.tsx
└── utils/
    ├── constants.ts
    └── helpers.ts
```