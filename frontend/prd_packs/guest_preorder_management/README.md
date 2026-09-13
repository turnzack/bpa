> **Directive Système IA** : Tu es un architecte logiciel senior et expert en Product Design. Tu dois générer des composants React/TypeScript de haute qualité, en suivant scrupuleusement les PRDs fournis dans le contexte caché. Chaque composant doit être fonctionnel, stylé avec du CSS moderne (glassmorphism, dark mode), et intégrer les meilleures pratiques d'accessibilité et de performance. Tu dois respecter les directives de câblage VFS et produire un code propre, commenté et maintenable.

# 🎮 PREORDER MANAGEMENT

## 📋 Description du Domaine Métier

Cette plateforme est dédiée à la gestion des précommandes de jeux vidéo et à la communication d'annonces officielles. Elle s'inspire du processus de précommande de GTA VI, où Rockstar Games a annoncé le début des précommandes via son site officiel. L'application centralise les annonces, gère les précommandes en temps réel, offre des analytics avancés, et améliore l'expérience des joueurs et des éditeurs.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. tmpl_preorder_management_dashboard
- **Mission** : Fournir une vue d'ensemble des précommandes, des annonces et des statistiques clés.
- **Design Requis** : Dashboard avec cartes de statistiques (nombre de précommandes, revenus, éditions spéciales), graphiques d'évolution, et liste des dernières annonces.
- **Composants à générer** : `Dashboard.tsx`, `StatCard.tsx`, `RevenueChart.tsx`, `AnnouncementFeed.tsx`

### 2. tmpl_preorder_management_announcements
- **Mission** : Créer et gérer les annonces officielles (comme le Newswire de Rockstar).
- **Design Requis** : Éditeur de contenu riche, liste des annonces avec statut (brouillon, publié), et aperçu en direct.
- **Composants à générer** : `AnnouncementEditor.tsx`, `AnnouncementList.tsx`, `RichTextEditor.tsx`

### 3. tmpl_preorder_management_preorders
- **Mission** : Gérer les précommandes des joueurs : création, modification, annulation.
- **Design Requis** : Tableau des précommandes avec filtres (jeu, édition, statut), formulaire de précommande, et détails de chaque précommande.
- **Composants à générer** : `PreorderTable.tsx`, `PreorderForm.tsx`, `PreorderDetails.tsx`

### 4. tmpl_preorder_management_inventory
- **Mission** : Suivre les stocks des éditions standard, collector, et spéciales.
- **Design Requis** : Vue en temps réel des niveaux de stock, alertes de rupture, et gestion des réapprovisionnements.
- **Composants à générer** : `InventoryOverview.tsx`, `StockAlert.tsx`, `InventoryAdjustment.tsx`

### 5. tmpl_preorder_management_analytics
- **Mission** : Analyser les tendances de précommandes, les pics de demande, et les performances des annonces.
- **Design Requis** : Graphiques interactifs (courbes, barres, camemberts), filtres temporels, et export de rapports.
- **Composants à générer** : `AnalyticsDashboard.tsx`, `TrendChart.tsx`, `ReportExport.tsx`

### 6. tmpl_preorder_management_notifications
- **Mission** : Envoyer des notifications aux joueurs (confirmations, rappels, mises à jour).
- **Design Requis** : Centre de notifications, templates d'emails, et gestion des canaux (email, push).
- **Composants à générer** : `NotificationCenter.tsx`, `EmailTemplate.tsx`, `NotificationSettings.tsx`

### 7. tmpl_preorder_management_users
- **Mission** : Gérer les comptes utilisateurs (joueurs, administrateurs, éditeurs).
- **Design Requis** : Liste des utilisateurs, profils, rôles et permissions.
- **Composants à générer** : `UserList.tsx`, `UserProfile.tsx`, `RoleManager.tsx`

### 8. tmpl_preorder_management_payments
- **Mission** : Traiter les paiements des précommandes et gérer les remboursements.
- **Design Requis** : Intégration de passerelle de paiement, historique des transactions, et gestion des remboursements.
- **Composants à générer** : `PaymentGateway.tsx`, `TransactionHistory.tsx`, `RefundManager.tsx`

### 9. tmpl_preorder_management_special_editions
- **Mission** : Gérer les éditions spéciales (collector, steelbook, etc.) avec leurs avantages.
- **Design Requis** : Catalogue des éditions, gestion des bonus, et allocation aux précommandes.
- **Composants à générer** : `SpecialEditionCatalog.tsx`, `BonusManager.tsx`, `EditionAllocation.tsx`

### 10. tmpl_preorder_management_settings
- **Mission** : Configurer les paramètres globaux de la plateforme (devises, langues, intégrations).
- **Design Requis** : Formulaire de configuration, gestion des intégrations API, et préférences système.
- **Composants à générer** : `SettingsForm.tsx`, `IntegrationManager.tsx`, `SystemPreferences.tsx`

## 🎨 Vision UI/UX & Design System Global

- **Thème** : Dark mode avec glassmorphism (arrière-plans flous, transparences, bordures subtiles).
- **Couleurs** : Palette sombre (#0f0f0f, #1a1a1a) avec accents néon (vert #00ff88, bleu #00aaff).
- **Typographie** : Inter pour le texte, Orbitron pour les titres.
- **Composants UI** : Boutons avec effets de survol, cartes avec ombres portées, transitions fluides.
- **Hooks** : `useTheme`, `useAuth`, `usePreorderData`, `useNotifications`.
- **État global** : Redux Toolkit pour la gestion des précommandes, des annonces et des utilisateurs.

## 🔌 Directives de Câblage VFS

- Tous les composants doivent être placés dans `src/components/` avec un sous-dossier par module.
- Les hooks personnalisés dans `src/hooks/`.
- Les services API dans `src/services/`.
- Les types TypeScript dans `src/types/`.
- Les styles globaux dans `src/styles/`.
- Utiliser les imports relatifs.

## 🔄 Instruction de Fusion

- Fusionner les fichiers générés avec le projet existant en respectant la structure de dossiers.
- Remplacer les fichiers existants si nécessaire, mais conserver les configurations de build.
- Mettre à jour le fichier `package.json` avec les nouvelles dépendances.

## 🤖 [INSTRUCTION IA]

Structure de fichiers `src/` complète :

```
src/
  components/
    dashboard/
      Dashboard.tsx
      StatCard.tsx
      RevenueChart.tsx
      AnnouncementFeed.tsx
    announcements/
      AnnouncementEditor.tsx
      AnnouncementList.tsx
      RichTextEditor.tsx
    preorders/
      PreorderTable.tsx
      PreorderForm.tsx
      PreorderDetails.tsx
    inventory/
      InventoryOverview.tsx
      StockAlert.tsx
      InventoryAdjustment.tsx
    analytics/
      AnalyticsDashboard.tsx
      TrendChart.tsx
      ReportExport.tsx
    notifications/
      NotificationCenter.tsx
      EmailTemplate.tsx
      NotificationSettings.tsx
    users/
      UserList.tsx
      UserProfile.tsx
      RoleManager.tsx
    payments/
      PaymentGateway.tsx
      TransactionHistory.tsx
      RefundManager.tsx
    specialEditions/
      SpecialEditionCatalog.tsx
      BonusManager.tsx
      EditionAllocation.tsx
    settings/
      SettingsForm.tsx
      IntegrationManager.tsx
      SystemPreferences.tsx
  hooks/
    useTheme.ts
    useAuth.ts
    usePreorderData.ts
    useNotifications.ts
  services/
    api.ts
    preorderService.ts
    announcementService.ts
  types/
    index.ts
  styles/
    global.css
  App.tsx
  main.tsx
```