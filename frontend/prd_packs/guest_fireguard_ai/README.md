> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu dois générer des composants React/TypeScript de haute qualité pour la plateforme FireGuard AI. Chaque composant doit être spécifique au domaine de la sécurité incendie, avec une attention particulière à la précision des données, à la réactivité en temps réel et à l'accessibilité. Suis les directives de conception fournies dans ce document et dans les scripts d'injection. Ne génère jamais de code générique ou placeholder.

# 🔥 FireGuard AI – Plateforme Prédictive de Sécurité Incendie

## Description du Domaine Métier
FireGuard AI est une plateforme de gestion proactive de la sécurité incendie. Elle intègre des capteurs IoT (température, fumée, gaz), des données météorologiques (vent, humidité, température extérieure) et des algorithmes d'IA pour prédire les risques d'incendie, détecter les incidents en temps réel, et optimiser les plans d'évacuation et d'intervention. La plateforme s'adresse aux gestionnaires de bâtiments, aux industries, aux services de protection civile et aux espaces naturels.

## Les 10 Modules Architecturaux Disponibles

### 1. tmpl_fireguard_ai_dashboard
- **Mission** : Fournir une vue d'ensemble en temps réel de l'état de sécurité incendie de tous les sites surveillés.
- **Design Requis** : Dashboard avec cartes de statistiques (nombre de capteurs actifs, alertes en cours, risques calculés), graphiques de tendances (température, humidité, niveau de risque), et une carte géographique interactive des sites.
- **Composants à générer** : `Dashboard.tsx`, `StatCard.tsx`, `RiskGauge.tsx`, `TrendChart.tsx`, `SiteMap.tsx`

### 2. tmpl_fireguard_ai_sensor_management
- **Mission** : Gérer le cycle de vie des capteurs IoT (enregistrement, configuration, maintenance, désactivation).
- **Design Requis** : Tableau de bord des capteurs avec filtres par type, statut, site. Formulaires d'ajout et d'édition, historique des lectures.
- **Composants à générer** : `SensorList.tsx`, `SensorForm.tsx`, `SensorDetail.tsx`, `SensorHistory.tsx`

### 3. tmpl_fireguard_ai_risk_analysis
- **Mission** : Analyser les données pour calculer un score de risque d'incendie par zone ou site.
- **Design Requis** : Interface de configuration des modèles de risque (pondération des facteurs), visualisation des scores sous forme de jauge ou de heatmap, et explication des facteurs contributifs.
- **Composants à générer** : `RiskAnalysis.tsx`, `RiskHeatmap.tsx`, `RiskFactors.tsx`, `RiskModelConfig.tsx`

### 4. tmpl_fireguard_ai_alert_system
- **Mission** : Gérer les alertes en temps réel (déclenchement, notification, escalade).
- **Design Requis** : Centre de notifications avec niveaux de priorité, canaux de notification (email, SMS, push), et workflow d'escalade.
- **Composants à générer** : `AlertCenter.tsx`, `AlertCard.tsx`, `NotificationSettings.tsx`, `EscalationPolicy.tsx`

### 5. tmpl_fireguard_ai_evacuation_planner
- **Mission** : Créer et visualiser des plans d'évacuation dynamiques pour chaque bâtiment.
- **Design Requis** : Éditeur de plans d'étage avec placement des issues de secours, simulation d'évacuation, et affichage des chemins optimaux.
- **Composants à générer** : `EvacuationPlanner.tsx`, `FloorPlanEditor.tsx`, `EvacuationSimulation.tsx`, `ExitPath.tsx`

### 6. tmpl_fireguard_ai_incident_response
- **Mission** : Coordonner les interventions en cas d'incident (assignation des équipes, suivi en temps réel).
- **Design Requis** : Vue de gestion d'incident avec timeline, liste des intervenants, statut des actions, et communication intégrée.
- **Composants à générer** : `IncidentResponse.tsx`, `IncidentTimeline.tsx`, `TeamAssignment.tsx`, `ActionTracker.tsx`

### 7. tmpl_fireguard_ai_weather_integration
- **Mission** : Intégrer les données météorologiques pour affiner les prédictions de risque.
- **Design Requis** : Widgets météo en temps réel, historique météo, et corrélation avec les incidents passés.
- **Composants à générer** : `WeatherWidget.tsx`, `WeatherHistory.tsx`, `WeatherCorrelation.tsx`

### 8. tmpl_fireguard_ai_maintenance_scheduler
- **Mission** : Planifier et suivre la maintenance préventive des équipements de sécurité.
- **Design Requis** : Calendrier de maintenance, rappels automatiques, et suivi des interventions.
- **Composants à générer** : `MaintenanceScheduler.tsx`, `MaintenanceCalendar.tsx`, `MaintenanceTask.tsx`

### 9. tmpl_fireguard_ai_reporting
- **Mission** : Générer des rapports de conformité et d'analyse pour les parties prenantes.
- **Design Requis** : Générateur de rapports personnalisables, export PDF/CSV, et visualisations prêtes à l'emploi.
- **Composants à générer** : `ReportGenerator.tsx`, `ReportTemplate.tsx`, `ReportExport.tsx`

### 10. tmpl_fireguard_ai_settings
- **Mission** : Gérer les paramètres globaux de la plateforme (utilisateurs, rôles, préférences).
- **Design Requis** : Interface de gestion des utilisateurs, des rôles et des permissions, et des préférences système.
- **Composants à générer** : `Settings.tsx`, `UserManagement.tsx`, `RolePermissions.tsx`, `SystemPreferences.tsx`

## Vision UI/UX & Design System Global

- **Thème** : Mode sombre avec glassmorphism (fond semi-transparent, flou d'arrière-plan, bordures subtiles). Couleurs principales : Rouge incendie (#E63946), Orange alerte (#F4A261), Bleu nuit (#1D3557), Vert sécurité (#2A9D8F).
- **Typographie** : Inter pour les textes, Roboto Mono pour les données numériques.
- **Composants UI** : Boutons avec états hover/active, cartes avec ombres portées, badges de statut (actif, inactif, alerte), jauges de risque animées.
- **Hooks** : `useSensorData` pour les données temps réel, `useRiskScore` pour le calcul de risque, `useAlertNotifications` pour les alertes.
- **Accessibilité** : Contraste élevé, navigation clavier, ARIA labels.

## Directives de Câblage VFS

- **Structure des dossiers** : Chaque module doit être placé dans `src/components/{module_name}/` avec ses sous-composants.
- **Imports** : Utiliser des imports relatifs pour les composants internes, et des imports absolus pour les services et hooks partagés.
- **Services** : Créer un dossier `src/services/` pour les appels API (simulés ou réels) et `src/hooks/` pour les hooks personnalisés.
- **Types** : Définir les interfaces TypeScript dans `src/types/` et les exporter pour une utilisation globale.

## Instruction de Fusion

Lors de la fusion des modules, assure-toi que les composants partagent les mêmes types et services. Utilise le contexte React pour la gestion d'état global (par exemple, `AuthContext`, `SensorContext`). Les routes doivent être définies dans `App.tsx` avec React Router.

## [INSTRUCTION IA]

Structure de fichiers `src/` complète :

```
src/
  main.tsx
  App.tsx
  types/
    index.ts
    sensor.ts
    alert.ts
    risk.ts
    user.ts
  services/
    api.ts
    sensorService.ts
    alertService.ts
    riskService.ts
    weatherService.ts
  hooks/
    useAuth.ts
    useSensorData.ts
    useRiskScore.ts
    useAlertNotifications.ts
  components/
    common/
      Button.tsx
      Card.tsx
      Badge.tsx
      Modal.tsx
    dashboard/
      Dashboard.tsx
      StatCard.tsx
      RiskGauge.tsx
      TrendChart.tsx
      SiteMap.tsx
    sensor_management/
      SensorList.tsx
      SensorForm.tsx
      SensorDetail.tsx
      SensorHistory.tsx
    risk_analysis/
      RiskAnalysis.tsx
      RiskHeatmap.tsx
      RiskFactors.tsx
      RiskModelConfig.tsx
    alert_system/
      AlertCenter.tsx
      AlertCard.tsx
      NotificationSettings.tsx
      EscalationPolicy.tsx
    evacuation_planner/
      EvacuationPlanner.tsx
      FloorPlanEditor.tsx
      EvacuationSimulation.tsx
      ExitPath.tsx
    incident_response/
      IncidentResponse.tsx
      IncidentTimeline.tsx
      TeamAssignment.tsx
      ActionTracker.tsx
    weather_integration/
      WeatherWidget.tsx
      WeatherHistory.tsx
      WeatherCorrelation.tsx
    maintenance_scheduler/
      MaintenanceScheduler.tsx
      MaintenanceCalendar.tsx
      MaintenanceTask.tsx
    reporting/
      ReportGenerator.tsx
      ReportTemplate.tsx
      ReportExport.tsx
    settings/
      Settings.tsx
      UserManagement.tsx
      RolePermissions.tsx
      SystemPreferences.tsx
```