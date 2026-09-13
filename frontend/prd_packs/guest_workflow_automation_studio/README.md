> **Directive Système IA** : Tu es un Architecte Logiciel Senior et Expert en Product Design. Ta mission est de générer des composants React/TypeScript de haute qualité pour le projet **Workflow Automation Studio**. Tu dois respecter strictement les directives de design, de structure et de câblage définies dans ce document. Chaque composant doit être fonctionnel, esthétique, et suivre les principes de l'architecture modulaire. Tu dois produire du code propre, typé, et documenté. En cas d'ambiguïté, privilégie la simplicité et l'expérience utilisateur.

# 🚀 WORKFLOW AUTOMATION STUDIO

## 📌 Description du Domaine Métier

**Workflow Automation Studio** est une plateforme d'automatisation de workflows conçue pour les PME. Elle permet de connecter visuellement des applications métier (CRM, email, bases de données, API) sans écrire de code. L'utilisateur construit des scénarios d'automatisation à l'aide de nœuds (déclencheurs, actions, conditions) et de connexions, puis les exécute en temps réel ou sur planification. L'objectif est de réduire les tâches répétitives, d'améliorer l'efficacité opérationnelle et de faciliter l'intégration des outils existants.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. tmpl_workflow_automation_studio_canvas
- **Mission** : Fournir le canevas interactif où les utilisateurs conçoivent leurs workflows.
- **Design Requis** : Zone de glisser-déposer, zoom/pan, grille de fond, mini-carte de navigation.
- **Composants à générer** : `WorkflowCanvas.tsx`, `NodePalette.tsx`, `CanvasControls.tsx`, `useCanvasState.ts`.

### 2. tmpl_workflow_automation_studio_nodes
- **Mission** : Gérer les différents types de nœuds (déclencheurs, actions, conditions) et leur configuration.
- **Design Requis** : Cartes de nœuds avec icônes, couleurs par catégorie, panneau de configuration latéral.
- **Composants à générer** : `NodeCard.tsx`, `NodeConfigPanel.tsx`, `NodeTypes.ts`, `NodeIcon.tsx`.

### 3. tmpl_workflow_automation_studio_connections
- **Mission** : Permettre la création et la gestion des connexions entre nœuds.
- **Design Requis** : Lignes courbes animées, points de connexion, validation de flux.
- **Composants à générer** : `ConnectionLine.tsx`, `ConnectionPoint.tsx`, `useConnections.ts`.

### 4. tmpl_workflow_automation_studio_integrations
- **Mission** : Gérer les intégrations natives avec les services populaires (Gmail, Slack, Stripe, etc.).
- **Design Requis** : Bibliothèque d'intégrations avec recherche, fiches détaillées, configuration OAuth.
- **Composants à générer** : `IntegrationLibrary.tsx`, `IntegrationCard.tsx`, `IntegrationConfigModal.tsx`.

### 5. tmpl_workflow_automation_studio_execution
- **Mission** : Exécuter les workflows et visualiser les résultats en temps réel.
- **Design Requis** : Console d'exécution avec logs, indicateurs de progression, gestion des erreurs.
- **Composants à générer** : `ExecutionPanel.tsx`, `ExecutionLog.tsx`, `ExecutionStatusBadge.tsx`.

### 6. tmpl_workflow_automation_studio_scheduler
- **Mission** : Planifier l'exécution des workflows (cron, intervalles, événements).
- **Design Requis** : Interface de configuration de planification, visualisation des prochaines exécutions.
- **Composants à générer** : `SchedulerConfig.tsx`, `ScheduleList.tsx`, `useScheduler.ts`.

### 7. tmpl_workflow_automation_studio_monitoring
- **Mission** : Surveiller la santé des workflows, les performances et les alertes.
- **Design Requis** : Tableaux de bord avec graphiques, notifications, historique des exécutions.
- **Composants à générer** : `MonitoringDashboard.tsx`, `PerformanceChart.tsx`, `AlertList.tsx`.

### 8. tmpl_workflow_automation_studio_templates
- **Mission** : Proposer des modèles de workflows pré-construits pour démarrer rapidement.
- **Design Requis** : Galerie de modèles avec catégories, aperçu, import en un clic.
- **Composants à générer** : `TemplateGallery.tsx`, `TemplateCard.tsx`, `TemplatePreview.tsx`.

### 9. tmpl_workflow_automation_studio_settings
- **Mission** : Gérer les paramètres de l'utilisateur, les connexions API, les préférences.
- **Design Requis** : Page de paramètres avec onglets, formulaires, gestion des clés API.
- **Composants à générer** : `SettingsPage.tsx`, `ApiKeysManager.tsx`, `UserPreferences.tsx`.

### 10. tmpl_workflow_automation_studio_ai_assistant
- **Mission** : Assister l'utilisateur dans la création de workflows grâce à l'IA.
- **Design Requis** : Chatbot contextuel, suggestions de nœuds, génération automatique de workflows.
- **Composants à générer** : `AiAssistant.tsx`, `SuggestionPanel.tsx`, `useAiAssistant.ts`.

## 🎨 Vision UI/UX & Design System Global

- **Thème** : Dark mode glassmorphism avec accents bleu-violet et dégradés subtils.
- **Typographie** : Inter pour les textes, JetBrains Mono pour le code et les logs.
- **Composants UI** : Boutons, cartes, modales, tooltips, badges, tous avec des coins arrondis (12px) et des ombres douces.
- **Animations** : Transitions fluides (300ms), micro-interactions au survol, chargement avec skeleton screens.
- **Layout** : Sidebar de navigation à gauche, zone de contenu principale, panneaux contextuels.
- **Responsive** : Adapté aux écrans desktop (priorité), tablette et mobile.

## 🔌 Directives de Câblage VFS

- Les composants générés doivent être placés dans le répertoire `src/` selon la structure définie.
- Chaque module `tmpl_*` correspond à un dossier dans `src/modules/`.
- Les imports entre modules doivent utiliser des alias `@/` (configurés dans `tsconfig.json`).
- Les états globaux (workflows, exécutions) doivent être gérés avec Zustand (store) et les appels API avec React Query.
- Les styles doivent utiliser Tailwind CSS avec des classes utilitaires et des variables CSS personnalisées.

## 🔀 Instruction de Fusion

- Fusionner les composants générés dans le projet existant en respectant la structure de dossiers.
- Ne pas écraser les fichiers existants sans vérification.
- Mettre à jour les imports et les routes si nécessaire.
- Tester l'intégration avec `npm run dev` et vérifier la console.

## [INSTRUCTION IA]

Structure de fichiers `src/` à générer :

```
src/
  main.tsx
  App.tsx
  index.css
  types/
    workflow.ts
    node.ts
    integration.ts
  store/
    workflowStore.ts
    executionStore.ts
  api/
    client.ts
    workflows.ts
    integrations.ts
  modules/
    canvas/
      WorkflowCanvas.tsx
      NodePalette.tsx
      CanvasControls.tsx
      useCanvasState.ts
    nodes/
      NodeCard.tsx
      NodeConfigPanel.tsx
      NodeTypes.ts
      NodeIcon.tsx
    connections/
      ConnectionLine.tsx
      ConnectionPoint.tsx
      useConnections.ts
    integrations/
      IntegrationLibrary.tsx
      IntegrationCard.tsx
      IntegrationConfigModal.tsx
    execution/
      ExecutionPanel.tsx
      ExecutionLog.tsx
      ExecutionStatusBadge.tsx
    scheduler/
      SchedulerConfig.tsx
      ScheduleList.tsx
      useScheduler.ts
    monitoring/
      MonitoringDashboard.tsx
      PerformanceChart.tsx
      AlertList.tsx
    templates/
      TemplateGallery.tsx
      TemplateCard.tsx
      TemplatePreview.tsx
    settings/
      SettingsPage.tsx
      ApiKeysManager.tsx
      UserPreferences.tsx
    ai_assistant/
      AiAssistant.tsx
      SuggestionPanel.tsx
      useAiAssistant.ts
  components/
    ui/
      Button.tsx
      Card.tsx
      Modal.tsx
      Badge.tsx
      Tooltip.tsx
    layout/
      Sidebar.tsx
      Header.tsx
  hooks/
    useDebounce.ts
    useLocalStorage.ts
```