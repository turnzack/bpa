> **Directive Système IA** : Tu es un Architecte Logiciel Senior et expert en Product Design. Tu génères des PRD (Product Requirements Documents) de haute qualité pour des projets React/TypeScript. Tu dois produire des spécifications détaillées, précises et exploitables, en t'inspirant des meilleures pratiques du modèle ecommerce_pack. Chaque module doit être nommé de manière unique, avec une mission claire, un design requis et des composants à générer. Tu dois respecter les règles de câblage VFS et fournir des instructions de fusion complètes.

# 🚀 SCRAPING DU SITE WEB HTTPS — Application Pro de Surveillance et d'Analyse de Contenu Web

## 📌 Domaine Métier
Cette application est une plateforme SaaS de **surveillance et d'analyse de contenu web** permettant aux utilisateurs de suivre l'évolution de pages web spécifiques, de détecter les changements, d'extraire des données structurées et de générer des rapports automatisés. Elle s'adresse aux professionnels du marketing, de la veille concurrentielle, du SEO et de la recherche académique. L'application offre une interface moderne, réactive et hautement configurable pour gérer des projets de scraping, visualiser les données extraites et recevoir des alertes en temps réel.

## 🧩 Les 10 Modules Architecturaux Disponibles

### 1. `tmpl_scraping_du_site_web_https__dashboard`
- **Mission** : Fournir une vue d'ensemble des projets de scraping, des statistiques en temps réel et des alertes récentes.
- **Design Requis** : Composants React avec graphiques (recharts), cartes de statistiques, liste des alertes, et un tableau de bord personnalisable.
- **Composants à générer** : `DashboardLayout.tsx`, `StatCard.tsx`, `AlertList.tsx`, `ActivityChart.tsx`, `ProjectSummary.tsx`.

### 2. `tmpl_scraping_du_site_web_https__project_manager`
- **Mission** : Gérer les projets de scraping : création, édition, duplication, suppression et configuration des cibles.
- **Design Requis** : Interface CRUD complète avec modales, formulaires validés, et gestion d'état global (Redux Toolkit).
- **Composants à générer** : `ProjectList.tsx`, `ProjectForm.tsx`, `ProjectCard.tsx`, `ConfirmDialog.tsx`, `ProjectFilters.tsx`.

### 3. `tmpl_scraping_du_site_web_https__scraper_engine`
- **Mission** : Configurer et exécuter des tâches de scraping : sélecteurs CSS, expressions régulières, planification.
- **Design Requis** : Éditeur de configuration avec aperçu en direct, gestion des tâches planifiées, et journal d'exécution.
- **Composants à générer** : `ScraperConfigurator.tsx`, `SelectorBuilder.tsx`, `ScheduleForm.tsx`, `ExecutionLog.tsx`, `ScraperPreview.tsx`.

### 4. `tmpl_scraping_du_site_web_https__data_extraction`
- **Mission** : Extraire des données structurées à partir des pages cibles : texte, images, liens, tableaux.
- **Design Requis** : Interface de visualisation des données extraites avec tableaux dynamiques, filtres et export.
- **Composants à générer** : `ExtractionResultTable.tsx`, `DataFilterBar.tsx`, `ExportButton.tsx`, `FieldMapping.tsx`, `DataPreviewModal.tsx`.

### 5. `tmpl_scraping_du_site_web_https__change_detection`
- **Mission** : Détecter les changements de contenu sur les pages surveillées et alerter l'utilisateur.
- **Design Requis** : Comparaison visuelle des versions, historique des modifications, et notifications push.
- **Composants à générer** : `DiffViewer.tsx`, `ChangeHistory.tsx`, `NotificationSettings.tsx`, `ChangeAlertCard.tsx`, `VersionTimeline.tsx`.

### 6. `tmpl_scraping_du_site_web_https__reporting`
- **Mission** : Générer des rapports personnalisés sur les données collectées et les tendances.
- **Design Requis** : Générateur de rapports avec modèles, export PDF/CSV, et envoi par email.
- **Composants à générer** : `ReportBuilder.tsx`, `ReportTemplateList.tsx`, `ReportPreview.tsx`, `ExportOptions.tsx`, `ScheduledReportForm.tsx`.

### 7. `tmpl_scraping_du_site_web_https__user_auth`
- **Mission** : Gérer l'authentification, les rôles et les permissions des utilisateurs.
- **Design Requis** : Écrans de connexion/inscription, gestion de profil, et contrôle d'accès basé sur les rôles.
- **Composants à générer** : `LoginForm.tsx`, `RegisterForm.tsx`, `ProfilePage.tsx`, `RoleGuard.tsx`, `PermissionSettings.tsx`.

### 8. `tmpl_scraping_du_site_web_https__api_integration`
- **Mission** : Intégrer des API externes pour enrichir les données (ex: WHOIS, métadonnées, services tiers).
- **Design Requis** : Gestion des clés API, appels asynchrones, et affichage des données enrichies.
- **Composants à générer** : `ApiKeyManager.tsx`, `ExternalApiCaller.tsx`, `EnrichedDataPanel.tsx`, `ApiLogViewer.tsx`, `IntegrationSettings.tsx`.

### 9. `tmpl_scraping_du_site_web_https__settings`
- **Mission** : Configurer les préférences globales de l'application : thème, langue, notifications, etc.
- **Design Requis** : Page de paramètres avec onglets, formulaires de configuration, et persistance locale.
- **Composants à générer** : `SettingsPage.tsx`, `ThemeSelector.tsx`, `LanguageSwitcher.tsx`, `NotificationPreferences.tsx`, `AdvancedSettings.tsx`.

### 10. `tmpl_scraping_du_site_web_https__help_support`
- **Mission** : Fournir une aide contextuelle, une FAQ et un système de tickets de support.
- **Design Requis** : Base de connaissances, chat en direct simulé, et formulaire de contact.
- **Composants à générer** : `HelpCenter.tsx`, `FaqAccordion.tsx`, `ContactForm.tsx`, `TicketList.tsx`, `KnowledgeBaseSearch.tsx`.

## 🎨 Vision UI/UX & Design System Global

L'application adopte un design **moderne et professionnel** avec une palette de couleurs sombres (fond #0f172a) et des accents bleus/cyan (#3b82f6, #06b6d4). La typographie utilise **Inter** pour les textes et **JetBrains Mono** pour les données techniques. Les composants sont conçus avec **Tailwind CSS** et **shadcn/ui** pour une cohérence visuelle. Les animations sont fluides (transitions 200ms) et les icônes proviennent de **Lucide React**. Le layout principal est une sidebar fixe avec un contenu scrollable. Les états de chargement utilisent des skeletons et les erreurs sont affichées avec des toasts. Le design system inclut des variables CSS personnalisées pour les couleurs, les espacements et les rayons de bordure.

## 🔌 Directives de Câblage VFS

- Tous les composants doivent être créés dans le répertoire `src/components/` avec un sous-dossier par module (ex: `src/components/dashboard/`).
- Les hooks personnalisés doivent être placés dans `src/hooks/` et nommés avec le préfixe `use` (ex: `useScraperEngine.ts`).
- Les services API doivent être dans `src/services/` et les types TypeScript dans `src/types/`.
- Les routes doivent être définies dans `src/App.tsx` en utilisant React Router, avec lazy loading pour chaque module.
- Le state global doit être géré avec Redux Toolkit, avec des slices par domaine (ex: `src/store/slices/projectSlice.ts`).
- Les styles globaux sont dans `src/index.css` et les utilitaires Tailwind dans `tailwind.config.js`.
- Les fichiers de configuration (ex: `src/config/constants.ts`) centralisent les constantes et les URLs d'API.

## 🔄 Instruction de Fusion

Lors de la fusion des modules, il est impératif de :
1. Importer les composants de chaque module dans les routes correspondantes.
2. Configurer le store Redux avec les reducers de chaque slice.
3. S'assurer que les styles Tailwind sont correctement appliqués en important les classes dans chaque composant.
4. Vérifier que les appels API utilisent le service centralisé `apiClient`.
5. Tester la navigation entre les modules et le chargement dynamique.
6. Mettre à jour le fichier `src/App.tsx` pour inclure toutes les routes.

## [INSTRUCTION IA]

Structure de fichiers `src/` complète :

```
src/
  main.tsx
  App.tsx
  index.css
  vite-env.d.ts
  components/
    dashboard/
      DashboardLayout.tsx
      StatCard.tsx
      AlertList.tsx
      ActivityChart.tsx
      ProjectSummary.tsx
    project_manager/
      ProjectList.tsx
      ProjectForm.tsx
      ProjectCard.tsx
      ConfirmDialog.tsx
      ProjectFilters.tsx
    scraper_engine/
      ScraperConfigurator.tsx
      SelectorBuilder.tsx
      ScheduleForm.tsx
      ExecutionLog.tsx
      ScraperPreview.tsx
    data_extraction/
      ExtractionResultTable.tsx
      DataFilterBar.tsx
      ExportButton.tsx
      FieldMapping.tsx
      DataPreviewModal.tsx
    change_detection/
      DiffViewer.tsx
      ChangeHistory.tsx
      NotificationSettings.tsx
      ChangeAlertCard.tsx
      VersionTimeline.tsx
    reporting/
      ReportBuilder.tsx
      ReportTemplateList.tsx
      ReportPreview.tsx
      ExportOptions.tsx
      ScheduledReportForm.tsx
    user_auth/
      LoginForm.tsx
      RegisterForm.tsx
      ProfilePage.tsx
      RoleGuard.tsx
      PermissionSettings.tsx
    api_integration/
      ApiKeyManager.tsx
      ExternalApiCaller.tsx
      EnrichedDataPanel.tsx
      ApiLogViewer.tsx
      IntegrationSettings.tsx
    settings/
      SettingsPage.tsx
      ThemeSelector.tsx
      LanguageSwitcher.tsx
      NotificationPreferences.tsx
      AdvancedSettings.tsx
    help_support/
      HelpCenter.tsx
      FaqAccordion.tsx
      ContactForm.tsx
      TicketList.tsx
      KnowledgeBaseSearch.tsx
  hooks/
    useAuth.ts
    useScraperEngine.ts
    useChangeDetection.ts
    useReporting.ts
    useApiIntegration.ts
  services/
    apiClient.ts
    scraperService.ts
    authService.ts
    reportService.ts
    notificationService.ts
  store/
    index.ts
    slices/
      authSlice.ts
      projectSlice.ts
      scraperSlice.ts
      dataSlice.ts
      changeDetectionSlice.ts
      reportSlice.ts
      settingsSlice.ts
  types/
    index.ts
    project.ts
    scraper.ts
    data.ts
    changeDetection.ts
    report.ts
    user.ts
  config/
    constants.ts
    apiEndpoints.ts
  utils/
    formatters.ts
    validators.ts
    diffUtils.ts
```