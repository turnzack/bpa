> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu dois générer des composants React/TypeScript de haute qualité pour le projet **GAME LAUNCH ORCHESTRATOR**. Suis strictement les spécifications des modules, les directives de design system, et les instructions de câblage VFS. Chaque composant doit être fonctionnel, stylé avec Tailwind CSS, et intégrer les animations et interactions décrites. Ne génère jamais de code générique ou placeholder.

# 🎮 GAME LAUNCH ORCHESTRATOR

## 📌 Domaine Métier
Plateforme SaaS de coordination des lancements et précommandes de jeux vidéo. Elle permet aux éditeurs et studios de gérer l'ensemble du cycle de vie d'un lancement : annonce, précommandes, communication, suivi des ventes, et coordination des équipes. Inspiré par l'annonce des précommandes de GTA VI, l'outil centralise les dates, les notifications, et les analyses prédictives pour optimiser les lancements.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. `tmpl_game_launch_orchestrator_dashboard` — Tableau de bord temps réel
- **Mission** : Vue d'ensemble des lancements en cours, prochains, et passés avec KPIs clés (précommandes, revenus, taux de conversion).
- **Design Requis** : Cartes statistiques animées, graphiques de tendance (Recharts), liste des lancements récents.
- **Composants** : `Dashboard.tsx`, `StatCard.tsx`, `TrendChart.tsx`, `LaunchList.tsx`.

### 2. `tmpl_game_launch_orchestrator_campaign_manager` — Gestion des campagnes de précommande
- **Mission** : Créer, modifier, et suivre les campagnes de précommande avec objectifs, canaux, et budgets.
- **Design Requis** : Formulaire multi-étapes, kanban de campagnes, indicateurs de progression.
- **Composants** : `CampaignManager.tsx`, `CampaignForm.tsx`, `CampaignBoard.tsx`, `ProgressBar.tsx`.

### 3. `tmpl_game_launch_orchestrator_launch_calendar` — Calendrier des lancements
- **Mission** : Visualiser les dates de lancement sur un calendrier interactif avec filtres par statut, plateforme, et région.
- **Design Requis** : Vue mensuelle/agenda, drag & drop pour modifier les dates, badges de statut.
- **Composants** : `LaunchCalendar.tsx`, `CalendarView.tsx`, `EventBadge.tsx`.

### 4. `tmpl_game_launch_orchestrator_notification_center` — Centre de notifications
- **Mission** : Gérer les notifications envoyées aux joueurs (email, push, in-app) et aux équipes internes.
- **Design Requis** : Liste des notifications, éditeur de modèles, journal d'envoi.
- **Composants** : `NotificationCenter.tsx`, `NotificationList.tsx`, `TemplateEditor.tsx`, `SendLog.tsx`.

### 5. `tmpl_game_launch_orchestrator_team_coordination` — Coordination des équipes
- **Mission** : Espace collaboratif pour les équipes marketing, commerciales, et techniques avec tâches, commentaires, et fichiers.
- **Design Requis** : Tableau Kanban, fil de discussion, pièces jointes.
- **Composants** : `TeamCoordination.tsx`, `TaskBoard.tsx`, `CommentThread.tsx`, `FileUpload.tsx`.

### 6. `tmpl_game_launch_orchestrator_analytics` — Analyses prédictives
- **Mission** : Fournir des prévisions de ventes basées sur les données historiques et les tendances actuelles.
- **Design Requis** : Graphiques de prévision, indicateurs de confiance, filtres par jeu.
- **Composants** : `Analytics.tsx`, `ForecastChart.tsx`, `ConfidenceIndicator.tsx`, `FilterBar.tsx`.

### 7. `tmpl_game_launch_orchestrator_integrations` — Intégrations plateformes de distribution
- **Mission** : Connecter les plateformes (Steam, Epic, PlayStation, Xbox) pour synchroniser les données de précommandes.
- **Design Requis** : Liste des intégrations, formulaire de connexion, statut de synchronisation.
- **Composants** : `Integrations.tsx`, `IntegrationCard.tsx`, `ConnectionForm.tsx`, `SyncStatus.tsx`.

### 8. `tmpl_game_launch_orchestrator_audience_engagement` — Engagement des joueurs
- **Mission** : Gérer les interactions avec la communauté (sondages, forums, récompenses) pour fidéliser les joueurs.
- **Design Requis** : Widgets de sondage, fil d'actualité, système de récompenses.
- **Composants** : `AudienceEngagement.tsx`, `PollWidget.tsx`, `Feed.tsx`, `RewardSystem.tsx`.

### 9. `tmpl_game_launch_orchestrator_reporting` — Rapports et exports
- **Mission** : Générer des rapports détaillés sur les performances des lancements et les exporter en PDF/CSV.
- **Design Requis** : Sélecteur de période, générateur de rapports, aperçu avant export.
- **Composants** : `Reporting.tsx`, `ReportGenerator.tsx`, `ReportPreview.tsx`, `ExportButton.tsx`.

### 10. `tmpl_game_launch_orchestrator_settings` — Paramètres et configuration
- **Mission** : Gérer les préférences de l'utilisateur, les rôles, et les paramètres de sécurité.
- **Design Requis** : Onglets de paramètres, gestion des rôles, authentification.
- **Composants** : `Settings.tsx`, `ProfileSettings.tsx`, `RoleManager.tsx`, `SecuritySettings.tsx`.

## 🎨 Vision UI/UX & Design System Global

- **Thème** : Dark mode glassmorphism avec accents néon (violet/cyan).
- **Typographie** : Inter pour les textes, Orbitron pour les titres.
- **Composants UI** : Boutons avec effets de glow, cartes avec backdrop-blur, transitions fluides.
- **Layout** : Sidebar fixe à gauche, header avec recherche et notifications, contenu principal en grid responsive.
- **Animations** : Framer Motion pour les apparitions, micro-interactions au survol.
- **Hooks** : `useTheme`, `useAuth`, `useNotifications`, `useLaunchData`, `useCampaigns`.

## 🔌 Directives de Câblage VFS

- Créer les fichiers dans le dossier `src/` correspondant à chaque module.
- Utiliser les imports relatifs pour les composants internes.
- Respecter la structure de fichiers définie dans `[INSTRUCTION IA]`.
- Utiliser Tailwind CSS pour le styling, avec les classes personnalisées définies dans `index.css`.
- Intégrer les données mockées depuis `src/data/mockData.ts`.

## 🔀 Instruction de Fusion

- Fusionner les modules en un seul fichier `App.tsx` qui gère le routing et l'affichage des modules.
- Utiliser React Router pour la navigation entre les modules.
- Assurer la cohérence du design system global.

## [INSTRUCTION IA]

Structure de fichiers `src/` à générer :

```
src/
  components/
    layout/
      Sidebar.tsx
      Header.tsx
      Footer.tsx
    ui/
      Button.tsx
      Card.tsx
      Modal.tsx
      Input.tsx
      Select.tsx
      Badge.tsx
      ProgressBar.tsx
      StatCard.tsx
      Chart.tsx
  modules/
    dashboard/
      Dashboard.tsx
      StatCard.tsx
      TrendChart.tsx
      LaunchList.tsx
    campaign-manager/
      CampaignManager.tsx
      CampaignForm.tsx
      CampaignBoard.tsx
      ProgressBar.tsx
    launch-calendar/
      LaunchCalendar.tsx
      CalendarView.tsx
      EventBadge.tsx
    notification-center/
      NotificationCenter.tsx
      NotificationList.tsx
      TemplateEditor.tsx
      SendLog.tsx
    team-coordination/
      TeamCoordination.tsx
      TaskBoard.tsx
      CommentThread.tsx
      FileUpload.tsx
    analytics/
      Analytics.tsx
      ForecastChart.tsx
      ConfidenceIndicator.tsx
      FilterBar.tsx
    integrations/
      Integrations.tsx
      IntegrationCard.tsx
      ConnectionForm.tsx
      SyncStatus.tsx
    audience-engagement/
      AudienceEngagement.tsx
      PollWidget.tsx
      Feed.tsx
      RewardSystem.tsx
    reporting/
      Reporting.tsx
      ReportGenerator.tsx
      ReportPreview.tsx
      ExportButton.tsx
    settings/
      Settings.tsx
      ProfileSettings.tsx
      RoleManager.tsx
      SecuritySettings.tsx
  data/
    mockData.ts
  hooks/
    useTheme.ts
    useAuth.ts
    useNotifications.ts
    useLaunchData.ts
    useCampaigns.ts
  App.tsx
  main.tsx
  index.css
```