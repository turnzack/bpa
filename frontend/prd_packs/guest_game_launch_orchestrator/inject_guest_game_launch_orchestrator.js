// ==UserScript==
// @name         Game Launch Orchestrator - Template Injector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Injecte les PRDs des templates pour Game Launch Orchestrator dans les IAs
// @author       Vous
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PRDS = {
        'tmpl_game_launch_orchestrator_dashboard': {
            name: 'Dashboard',
            description: 'Tableau de bord temps réel',
            context: `[CONTEXTE CACHÉ]
Module : Tableau de bord principal
Objectif : Fournir une vue d\'ensemble des lancements de jeux avec KPIs en temps réel.
Fonctionnalités :
- Afficher les statistiques clés : nombre de précommandes, revenus estimés, taux de conversion.
- Graphique de tendance des précommandes sur les 30 derniers jours.
- Liste des lancements récents avec statut (annoncé, en précommande, lancé).
- Filtres par plateforme et par région.
Design : Dark mode glassmorphism, cartes avec backdrop-blur, animations Framer Motion.
Composants à générer : Dashboard.tsx, StatCard.tsx, TrendChart.tsx, LaunchList.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_campaign_manager': {
            name: 'Campaign Manager',
            description: 'Gestion des campagnes de précommande',
            context: `[CONTEXTE CACHÉ]
Module : Gestion des campagnes de précommande
Objectif : Permettre aux équipes marketing de créer et suivre des campagnes.
Fonctionnalités :
- Formulaire multi-étapes pour créer une campagne (nom, objectif, budget, canaux).
- Vue Kanban des campagnes avec statuts (brouillon, active, terminée).
- Indicateurs de progression (objectif vs réalisé).
- Historique des modifications.
Design : Interface claire avec drag & drop, badges colorés par statut.
Composants à générer : CampaignManager.tsx, CampaignForm.tsx, CampaignBoard.tsx, ProgressBar.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_launch_calendar': {
            name: 'Launch Calendar',
            description: 'Calendrier des lancements',
            context: `[CONTEXTE CACHÉ]
Module : Calendrier des lancements
Objectif : Visualiser les dates de lancement sur un calendrier interactif.
Fonctionnalités :
- Vue mensuelle et vue agenda.
- Drag & drop pour modifier les dates.
- Filtres par statut, plateforme, région.
- Badges colorés pour chaque événement.
Design : Calendrier responsive avec animations de transition.
Composants à générer : LaunchCalendar.tsx, CalendarView.tsx, EventBadge.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_notification_center': {
            name: 'Notification Center',
            description: 'Centre de notifications',
            context: `[CONTEXTE CACHÉ]
Module : Centre de notifications
Objectif : Gérer les notifications envoyées aux joueurs et aux équipes.
Fonctionnalités :
- Liste des notifications avec statut (envoyée, en attente, échouée).
- Éditeur de modèles avec variables dynamiques.
- Journal d'envoi avec horodatage.
- Paramètres de canaux (email, push, in-app).
Design : Interface avec onglets, aperçu des modèles.
Composants à générer : NotificationCenter.tsx, NotificationList.tsx, TemplateEditor.tsx, SendLog.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_team_coordination': {
            name: 'Team Coordination',
            description: 'Coordination des équipes',
            context: `[CONTEXTE CACHÉ]
Module : Coordination des équipes
Objectif : Espace collaboratif pour les équipes internes.
Fonctionnalités :
- Tableau Kanban des tâches avec assignation.
- Fil de discussion par tâche.
- Pièces jointes (images, documents).
- Notifications en temps réel.
Design : Interface collaborative avec avatars, commentaires.
Composants à générer : TeamCoordination.tsx, TaskBoard.tsx, CommentThread.tsx, FileUpload.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_analytics': {
            name: 'Analytics',
            description: 'Analyses prédictives',
            context: `[CONTEXTE CACHÉ]
Module : Analyses prédictives
Objectif : Fournir des prévisions de ventes basées sur les données.
Fonctionnalités :
- Graphique de prévision avec intervalle de confiance.
- Indicateur de confiance (pourcentage).
- Filtres par jeu, plateforme, région.
- Export des données.
Design : Graphiques interactifs avec tooltips.
Composants à générer : Analytics.tsx, ForecastChart.tsx, ConfidenceIndicator.tsx, FilterBar.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_integrations': {
            name: 'Integrations',
            description: 'Intégrations plateformes de distribution',
            context: `[CONTEXTE CACHÉ]
Module : Intégrations plateformes de distribution
Objectif : Connecter les plateformes pour synchroniser les données.
Fonctionnalités :
- Liste des intégrations disponibles (Steam, Epic, PlayStation, Xbox).
- Formulaire de connexion avec clé API.
- Statut de synchronisation (en ligne, hors ligne, erreur).
- Historique des synchronisations.
Design : Cartes avec logos, indicateurs de statut.
Composants à générer : Integrations.tsx, IntegrationCard.tsx, ConnectionForm.tsx, SyncStatus.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_audience_engagement': {
            name: 'Audience Engagement',
            description: 'Engagement des joueurs',
            context: `[CONTEXTE CACHÉ]
Module : Engagement des joueurs
Objectif : Gérer les interactions avec la communauté.
Fonctionnalités :
- Widgets de sondage avec résultats en direct.
- Fil d'actualité avec posts et commentaires.
- Système de récompenses (points, badges).
- Notifications pour les événements.
Design : Interface sociale avec animations.
Composants à générer : AudienceEngagement.tsx, PollWidget.tsx, Feed.tsx, RewardSystem.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_reporting': {
            name: 'Reporting',
            description: 'Rapports et exports',
            context: `[CONTEXTE CACHÉ]
Module : Rapports et exports
Objectif : Générer des rapports détaillés sur les lancements.
Fonctionnalités :
- Sélecteur de période (jour, semaine, mois).
- Générateur de rapports avec graphiques.
- Aperçu avant export.
- Export en PDF et CSV.
Design : Interface de génération avec aperçu.
Composants à générer : Reporting.tsx, ReportGenerator.tsx, ReportPreview.tsx, ExportButton.tsx.
[FIN DU CONTEXTE CACHÉ]`
        },
        'tmpl_game_launch_orchestrator_settings': {
            name: 'Settings',
            description: 'Paramètres et configuration',
            context: `[CONTEXTE CACHÉ]
Module : Paramètres et configuration
Objectif : Gérer les préférences utilisateur et la sécurité.
Fonctionnalités :
- Onglets de paramètres (profil, sécurité, notifications).
- Gestion des rôles (admin, éditeur, viewer).
- Authentification à deux facteurs.
- Préférences de thème.
Design : Interface sobre avec formulaires.
Composants à générer : Settings.tsx, ProfileSettings.tsx, RoleManager.tsx, SecuritySettings.tsx.
[FIN DU CONTEXTE CACHÉ]`
        }
    };

    function injectText(templateName) {
        const prd = PRDS[templateName];
        if (!prd) return;
        const text = `### Template: ${prd.name}\n\n${prd.description}\n\n${prd.context}`;
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.log('PRD pour ' + prd.name + ' :\n\n' + text);
        }
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'glo-menu';
        menu.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#1a1a2e;border:1px solid #e94560;border-radius:8px;padding:10px;font-family:Arial;';
        const title = document.createElement('div');
        title.textContent = 'Game Launch Orchestrator';
        title.style.cssText = 'color:#e94560;font-weight:bold;margin-bottom:10px;';
        menu.appendChild(title);
        Object.keys(PRDS).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = PRDS[key].name;
            btn.style.cssText = 'display:block;width:100%;margin:5px 0;padding:5px;background:#16213e;color:#fff;border:none;border-radius:4px;cursor:pointer;';
            btn.onclick = () => injectText(key);
            menu.appendChild(btn);
        });
        document.body.appendChild(menu);
    }

    setTimeout(createMenu, 3000);
})();