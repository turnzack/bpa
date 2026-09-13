> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu dois générer des composants React/TypeScript de haute qualité pour FlowForge Studio, une plateforme d'automatisation de workflows visuelle. Suis strictement les spécifications des templates tmpl_flowforge_studio_*. Chaque composant doit être fonctionnel, esthétique (glassmorphism, dark mode) et intégrer les meilleures pratiques (hooks, états, accessibilité). Utilise Tailwind CSS pour le styling et respecte le design system défini.

# 🚀 FlowForge Studio : Orchestrateur d'Automatisations Visuelles Nouvelle Génération

## 📌 Description du Domaine Métier
FlowForge Studio est une plateforme SaaS qui permet aux équipes de créer, déployer et surveiller des automatisations de workflows sans écrire de code. Inspirée de n8n.io, elle se distingue par l'intégration native d'IA générative, la collaboration temps réel et une marketplace de templates intelligents. Les utilisateurs peuvent connecter des applications (CRM, email, bases de données), définir des déclencheurs et des actions, et visualiser l'exécution en temps réel. La plateforme cible les équipes ops, marketing et support qui souhaitent automatiser des processus métier complexes.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. tmpl_flowforge_studio_canvas
- **Mission** : Fournir le canevas de conception de workflows avec glisser-déposer.
- **Design Requis** : Canvas interactif avec zoom/pan, grille de fond, nodes connectés par des lignes courbes. Dark mode, glassmorphism.
- **Composants à générer** : `WorkflowCanvas.tsx`, `NodeComponent.tsx`, `EdgeComponent.tsx`, `useWorkflowState.ts`.

### 2. tmpl_flowforge_studio_node_palette
- **Mission** : Afficher la palette de nodes (déclencheurs, actions, logique) pour ajouter au canvas.
- **Design Requis** : Panneau latéral avec catégories, recherche, drag-and-drop. Style glassmorphism.
- **Composants à générer** : `NodePalette.tsx`, `NodeCategory.tsx`, `NodeItem.tsx`.

### 3. tmpl_flowforge_studio_node_configurator
- **Mission** : Permettre la configuration détaillée de chaque node (paramètres, authentification, mapping de données).
- **Design Requis** : Panneau latéral droit avec formulaires dynamiques, validation, aperçu des données. Dark mode.
- **Composants à générer** : `NodeConfigurator.tsx`, `ConfigField.tsx`, `DataMapping.tsx`.

### 4. tmpl_flowforge_studio_workflow_execution
- **Mission** : Exécuter les workflows et visualiser l'exécution en temps réel (logs, succès/échec).
- **Design Requis** : Console de logs avec streaming, indicateurs de statut, timeline. Dark mode avec accents colorés.
- **Composants à générer** : `ExecutionPanel.tsx`, `ExecutionLog.tsx`, `ExecutionStatus.tsx`.

### 5. tmpl_flowforge_studio_ai_assistant
- **Mission** : Intégrer un assistant IA pour suggérer des automatisations, générer des workflows à partir de texte, et optimiser les flux.
- **Design Requis** : Chat intégré avec suggestions contextuelles, génération de workflows en langage naturel. UI conversationnelle.
- **Composants à générer** : `AIAssistant.tsx`, `ChatMessage.tsx`, `SuggestionChip.tsx`.

### 6. tmpl_flowforge_studio_collaboration
- **Mission** : Permettre la collaboration temps réel (commentaires, co-édition, partage).
- **Design Requis** : Curseurs de présence, zone de commentaires, avatars. Intégration WebSocket.
- **Composants à générer** : `CollaborationPanel.tsx`, `CommentThread.tsx`, `PresenceCursor.tsx`.

### 7. tmpl_flowforge_studio_template_marketplace
- **Mission** : Afficher une marketplace de templates de workflows prêts à l'emploi.
- **Design Requis** : Grille de cartes avec catégories, recherche, aperçu. Dark mode, glassmorphism.
- **Composants à générer** : `TemplateMarketplace.tsx`, `TemplateCard.tsx`, `TemplatePreview.tsx`.

### 8. tmpl_flowforge_studio_dashboard
- **Mission** : Fournir un tableau de bord avec statistiques d'utilisation, exécutions réussies/échouées, et tendances.
- **Design Requis** : Graphiques interactifs (charts), KPIs, filtres temporels. Dark mode.
- **Composants à générer** : `Dashboard.tsx`, `StatCard.tsx`, `ActivityChart.tsx`.

### 9. tmpl_flowforge_studio_credentials_manager
- **Mission** : Gérer les connexions sécurisées aux applications tierces (OAuth, API keys).
- **Design Requis** : Liste des credentials, formulaire d'ajout, indicateurs de sécurité. Dark mode.
- **Composants à générer** : `CredentialsManager.tsx`, `CredentialCard.tsx`, `CredentialForm.tsx`.

### 10. tmpl_flowforge_studio_settings
- **Mission** : Permettre la configuration de l'utilisateur (profil, préférences, notifications).
- **Design Requis** : Onglets de paramètres, formulaires, toggles. Dark mode.
- **Composants à générer** : `Settings.tsx`, `ProfileSettings.tsx`, `NotificationSettings.tsx`.

## 🎨 Vision UI/UX & Design System Global

- **Thème** : Dark mode par défaut avec glassmorphism (arrière-plans translucides, flous, bordures subtiles).
- **Couleurs** : Fond #0A0A0A, surfaces #1A1A1A avec opacité, accents #6366F1 (indigo) et #22D3EE (cyan).
- **Typographie** : Inter pour le texte, JetBrains Mono pour le code.
- **Composants UI** : Boutons, inputs, modales, tooltips, badges, etc. avec styles cohérents.
- **Animations** : Transitions douces, micro-interactions au survol.
- **Responsive** : Adapté aux écrans desktop et tablette.

## 🔌 Directives de Câblage VFS

- Utiliser le Virtual File System (VFS) pour organiser les fichiers générés.
- Chaque module doit être dans un dossier `src/components/templates/tmpl_flowforge_studio_<module>/`.
- Les hooks partagés dans `src/hooks/`, les types dans `src/types/`.
- Les styles globaux dans `src/styles/globals.css`.

## 🧩 Instruction de Fusion

- Fusionner les composants générés dans une application React existante ou nouvelle.
- Importer les composants dans les pages appropriées (ex: `WorkflowPage.tsx` pour le canvas).
- Assurer la compatibilité avec les routes et le state management (React Context ou Redux).

## [INSTRUCTION IA]

Génère la structure de fichiers suivante dans `src/` :

```
src/
  components/
    templates/
      tmpl_flowforge_studio_canvas/
        WorkflowCanvas.tsx
        NodeComponent.tsx
        EdgeComponent.tsx
        useWorkflowState.ts
      tmpl_flowforge_studio_node_palette/
        NodePalette.tsx
        NodeCategory.tsx
        NodeItem.tsx
      tmpl_flowforge_studio_node_configurator/
        NodeConfigurator.tsx
        ConfigField.tsx
        DataMapping.tsx
      tmpl_flowforge_studio_workflow_execution/
        ExecutionPanel.tsx
        ExecutionLog.tsx
        ExecutionStatus.tsx
      tmpl_flowforge_studio_ai_assistant/
        AIAssistant.tsx
        ChatMessage.tsx
        SuggestionChip.tsx
      tmpl_flowforge_studio_collaboration/
        CollaborationPanel.tsx
        CommentThread.tsx
        PresenceCursor.tsx
      tmpl_flowforge_studio_template_marketplace/
        TemplateMarketplace.tsx
        TemplateCard.tsx
        TemplatePreview.tsx
      tmpl_flowforge_studio_dashboard/
        Dashboard.tsx
        StatCard.tsx
        ActivityChart.tsx
      tmpl_flowforge_studio_credentials_manager/
        CredentialsManager.tsx
        CredentialCard.tsx
        CredentialForm.tsx
      tmpl_flowforge_studio_settings/
        Settings.tsx
        ProfileSettings.tsx
        NotificationSettings.tsx
  hooks/
    useLocalStorage.ts
    useDebounce.ts
  types/
    workflow.ts
    node.ts
  styles/
    globals.css
```

Chaque composant doit être complet, avec props typées, et utiliser Tailwind CSS pour le styling.