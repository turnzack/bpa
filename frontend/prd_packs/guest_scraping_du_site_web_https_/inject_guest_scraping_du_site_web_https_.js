(function() {
  'use strict';

  const PRDS = {
    tmpl_scraping_du_site_web_https__dashboard: `
[CONTEXTE CACHÉ]
Module : Dashboard
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Fournir une vue d'ensemble des projets de scraping, des statistiques en temps réel et des alertes récentes.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Dashboard

## Objectif
Créer un tableau de bord interactif affichant les métriques clés des projets de scraping, les alertes récentes et un graphique d'activité.

## Fonctionnalités
- Afficher des cartes de statistiques (nombre de projets, tâches exécutées, changements détectés, erreurs).
- Afficher un graphique en courbes de l'activité de scraping sur les 7 derniers jours.
- Lister les alertes récentes avec niveau de sévérité.
- Permettre la navigation rapide vers les projets.

## Composants Requis
- DashboardLayout.tsx : Layout principal avec sidebar et zone de contenu.
- StatCard.tsx : Carte de statistique avec icône, valeur et tendance.
- AlertList.tsx : Liste des alertes avec badge de sévérité.
- ActivityChart.tsx : Graphique utilisant recharts.
- ProjectSummary.tsx : Résumé des projets avec progression.

## Design
- Utiliser Tailwind CSS pour le style.
- Palette sombre avec accents bleus.
- Animations de transition douces.

## Tests
- Vérifier que les données sont chargées depuis le store Redux.
- Tester la réactivité sur mobile.
`,
    tmpl_scraping_du_site_web_https__project_manager: `
[CONTEXTE CACHÉ]
Module : Project Manager
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Gérer les projets de scraping : création, édition, duplication, suppression et configuration des cibles.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Project Manager

## Objectif
Fournir une interface CRUD complète pour gérer les projets de scraping.

## Fonctionnalités
- Créer un nouveau projet avec nom, URL cible, sélecteurs et planification.
- Éditer un projet existant.
- Dupliquer un projet.
- Supprimer un projet avec confirmation.
- Filtrer les projets par statut ou date.

## Composants Requis
- ProjectList.tsx : Tableau des projets avec actions.
- ProjectForm.tsx : Formulaire de création/édition avec validation.
- ProjectCard.tsx : Carte alternative pour affichage en grille.
- ConfirmDialog.tsx : Dialogue de confirmation pour suppression.
- ProjectFilters.tsx : Barre de filtres.

## Design
- Modales pour les formulaires.
- Utiliser des icônes pour les actions.
- Feedback visuel pour les erreurs.

## Tests
- Tester le cycle de vie complet d'un projet.
- Vérifier la validation des champs.
`,
    tmpl_scraping_du_site_web_https__scraper_engine: `
[CONTEXTE CACHÉ]
Module : Scraper Engine
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Configurer et exécuter des tâches de scraping : sélecteurs CSS, expressions régulières, planification.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Scraper Engine

## Objectif
Permettre aux utilisateurs de configurer des tâches de scraping avec des sélecteurs personnalisés et de les exécuter.

## Fonctionnalités
- Éditeur de sélecteurs CSS avec aperçu en direct.
- Support des expressions régulières pour l'extraction.
- Planification des tâches (cron ou intervalle).
- Journal d'exécution avec statut et durée.
- Prévisualisation des données extraites.

## Composants Requis
- ScraperConfigurator.tsx : Interface principale de configuration.
- SelectorBuilder.tsx : Outil de construction de sélecteurs.
- ScheduleForm.tsx : Formulaire de planification.
- ExecutionLog.tsx : Journal des exécutions.
- ScraperPreview.tsx : Aperçu des résultats.

## Design
- Panneau de configuration avec onglets.
- Aperçu en direct à droite.
- Logs avec couleurs par statut.

## Tests
- Tester l'exécution d'une tâche simulée.
- Vérifier la persistance de la configuration.
`,
    tmpl_scraping_du_site_web_https__data_extraction: `
[CONTEXTE CACHÉ]
Module : Data Extraction
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Extraire des données structurées à partir des pages cibles : texte, images, liens, tableaux.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Data Extraction

## Objectif
Visualiser et gérer les données extraites des pages web.

## Fonctionnalités
- Afficher les données extraites dans un tableau dynamique.
- Filtrer les données par champ ou valeur.
- Exporter les données en CSV/JSON.
- Mapper les champs extraits aux champs de la base.
- Prévisualiser les données avant export.

## Composants Requis
- ExtractionResultTable.tsx : Tableau des données extraites.
- DataFilterBar.tsx : Barre de filtres.
- ExportButton.tsx : Bouton d'exportation.
- FieldMapping.tsx : Interface de mapping des champs.
- DataPreviewModal.tsx : Modale de prévisualisation.

## Design
- Tableau avec colonnes triables.
- Filtres en temps réel.
- Modale pour prévisualisation.

## Tests
- Tester l'exportation des données.
- Vérifier le mapping des champs.
`,
    tmpl_scraping_du_site_web_https__change_detection: `
[CONTEXTE CACHÉ]
Module : Change Detection
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Détecter les changements de contenu sur les pages surveillées et alerter l'utilisateur.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Change Detection

## Objectif
Surveiller les pages web et notifier les changements de contenu.

## Fonctionnalités
- Comparer visuellement deux versions d'une page.
- Afficher l'historique des modifications.
- Configurer les notifications (email, push).
- Afficher les alertes de changement avec détails.
- Timeline des versions.

## Composants Requis
- DiffViewer.tsx : Visualisation des différences.
- ChangeHistory.tsx : Historique des changements.
- NotificationSettings.tsx : Paramètres de notification.
- ChangeAlertCard.tsx : Carte d'alerte.
- VersionTimeline.tsx : Timeline des versions.

## Design
- Vue côte à côte pour le diff.
- Timeline horizontale.
- Badges pour les types de changements.

## Tests
- Simuler un changement et vérifier l'alerte.
- Tester la configuration des notifications.
`,
    tmpl_scraping_du_site_web_https__reporting: `
[CONTEXTE CACHÉ]
Module : Reporting
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Générer des rapports personnalisés sur les données collectées et les tendances.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Reporting

## Objectif
Créer des rapports personnalisés et les exporter.

## Fonctionnalités
- Construire des rapports avec des graphiques et tableaux.
- Utiliser des modèles prédéfinis.
- Exporter en PDF/CSV.
- Planifier l'envoi par email.
- Prévisualiser le rapport avant génération.

## Composants Requis
- ReportBuilder.tsx : Interface de construction de rapport.
- ReportTemplateList.tsx : Liste des modèles.
- ReportPreview.tsx : Aperçu du rapport.
- ExportOptions.tsx : Options d'exportation.
- ScheduledReportForm.tsx : Formulaire de planification.

## Design
- Glisser-déposer pour ajouter des widgets.
- Aperçu en temps réel.
- Options d'exportation claires.

## Tests
- Tester la génération d'un rapport.
- Vérifier l'export PDF.
`,
    tmpl_scraping_du_site_web_https__user_auth: `
[CONTEXTE CACHÉ]
Module : User Auth
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Gérer l'authentification, les rôles et les permissions des utilisateurs.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module User Auth

## Objectif
Fournir un système d'authentification sécurisé avec gestion des rôles.

## Fonctionnalités
- Connexion et inscription.
- Gestion du profil utilisateur.
- Contrôle d'accès basé sur les rôles (admin, utilisateur).
- Permissions personnalisées.
- Déconnexion.

## Composants Requis
- LoginForm.tsx : Formulaire de connexion.
- RegisterForm.tsx : Formulaire d'inscription.
- ProfilePage.tsx : Page de profil.
- RoleGuard.tsx : Composant de garde pour les routes.
- PermissionSettings.tsx : Gestion des permissions.

## Design
- Formulaires avec validation.
- Messages d'erreur clairs.
- Interface de profil épurée.

## Tests
- Tester le flux de connexion.
- Vérifier la protection des routes.
`,
    tmpl_scraping_du_site_web_https__api_integration: `
[CONTEXTE CACHÉ]
Module : API Integration
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Intégrer des API externes pour enrichir les données (ex: WHOIS, métadonnées, services tiers).
[FIN DU CONTEXTE CACHÉ]

# PRD : Module API Integration

## Objectif
Permettre l'intégration de services externes pour enrichir les données collectées.

## Fonctionnalités
- Gérer les clés API.
- Effectuer des appels API externes.
- Afficher les données enrichies.
- Journal des appels API.
- Configuration des intégrations.

## Composants Requis
- ApiKeyManager.tsx : Gestion des clés API.
- ExternalApiCaller.tsx : Composant pour appeler des API.
- EnrichedDataPanel.tsx : Panneau des données enrichies.
- ApiLogViewer.tsx : Visualisation des logs.
- IntegrationSettings.tsx : Paramètres d'intégration.

## Design
- Interface de gestion des clés sécurisée.
- Logs avec horodatage.
- Panneau d'affichage des données.

## Tests
- Tester l'ajout d'une clé API.
- Simuler un appel API et vérifier l'affichage.
`,
    tmpl_scraping_du_site_web_https__settings: `
[CONTEXTE CACHÉ]
Module : Settings
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Configurer les préférences globales de l'application : thème, langue, notifications, etc.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Settings

## Objectif
Permettre aux utilisateurs de personnaliser l'application selon leurs préférences.

## Fonctionnalités
- Changer le thème (clair/sombre).
- Changer la langue.
- Configurer les notifications.
- Paramètres avancés (cache, logs).
- Sauvegarde automatique.

## Composants Requis
- SettingsPage.tsx : Page principale des paramètres.
- ThemeSelector.tsx : Sélecteur de thème.
- LanguageSwitcher.tsx : Sélecteur de langue.
- NotificationPreferences.tsx : Préférences de notification.
- AdvancedSettings.tsx : Paramètres avancés.

## Design
- Onglets pour les catégories.
- Toggles et selects.
- Feedback de sauvegarde.

## Tests
- Tester le changement de thème.
- Vérifier la persistance des préférences.
`,
    tmpl_scraping_du_site_web_https__help_support: `
[CONTEXTE CACHÉ]
Module : Help & Support
Application : SCRAPING DU SITE WEB HTTPS
Rôle : Fournir une aide contextuelle, une FAQ et un système de tickets de support.
[FIN DU CONTEXTE CACHÉ]

# PRD : Module Help & Support

## Objectif
Assister les utilisateurs avec une base de connaissances et un support.

## Fonctionnalités
- Recherche dans la base de connaissances.
- FAQ avec accordéon.
- Formulaire de contact.
- Suivi des tickets.
- Articles d'aide.

## Composants Requis
- HelpCenter.tsx : Centre d'aide principal.
- FaqAccordion.tsx : FAQ en accordéon.
- ContactForm.tsx : Formulaire de contact.
- TicketList.tsx : Liste des tickets.
- KnowledgeBaseSearch.tsx : Recherche dans la base.

## Design
- Interface de recherche intuitive.
- Accordéons pour les FAQ.
- Formulaires simples.

## Tests
- Tester la recherche d'un article.
- Vérifier l'envoi d'un ticket.
`
  };

  function injectText(templateName) {
    const prd = PRDS[templateName];
    if (!prd) {
      console.error('Template non trouvé:', templateName);
      return;
    }
    const existing = document.querySelector('.prd-injected');
    if (existing) existing.remove();
    const div = document.createElement('div');
    div.className = 'prd-injected';
    div.style.cssText = 'position: fixed; top: 20px; right: 20px; width: 500px; max-height: 80vh; overflow-y: auto; background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; z-index: 9999; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    div.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${prd}</pre>`;
    document.body.appendChild(div);
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position: fixed; bottom: 20px; left: 20px; background: #0f172a; color: white; padding: 10px; border-radius: 8px; z-index: 9998; font-family: Arial;';
    const title = document.createElement('div');
    title.textContent = 'Injecter PRD';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(templateName => {
      const btn = document.createElement('button');
      btn.textContent = templateName.replace('tmpl_scraping_du_site_web_https__', '');
      btn.style.cssText = 'display: block; margin: 4px 0; padding: 4px 8px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;';
      btn.onclick = () => injectText(templateName);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();