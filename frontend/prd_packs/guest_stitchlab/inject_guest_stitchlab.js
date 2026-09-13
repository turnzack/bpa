// ==UserScript==
// @name         StitchLab PRD Injector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Injecte les PRDs StitchLab dans les IAs
// @author       Vous
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PRDS = {
        tmpl_stitchlab_discovery: {
            name: "Discovery Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_discovery
Objectif: Créer une interface de découverte de projets créatifs.
Fonctionnalités:
- Grille de cartes projet avec image, titre, catégorie, niveau.
- Barre de filtres par catégorie (Art, Design, Tech, Artisanat).
- Recherche instantanée avec debounce.
- Animations d'apparition des cartes.
Design: Dark mode glassmorphism, cartes avec backdrop-blur, dégradés.
Composants à générer: ProjectCard, FilterBar, SearchInput, CategoryPills.
Utiliser Tailwind CSS et Framer Motion.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_project_detail: {
            name: "Project Detail Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_project_detail
Objectif: Afficher les détails d'un projet.
Fonctionnalités:
- En-tête avec image de couverture, titre, auteur, tags.
- Timeline des étapes du projet.
- Section commentaires avec ajout en temps réel.
- Bouton "Rejoindre" pour participer.
Design: Mise en page fluide, timeline verticale, glassmorphism.
Composants: ProjectHeader, StepTimeline, CommentSection, JoinButton.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_collab_editor: {
            name: "Collaborative Editor Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_collab_editor
Objectif: Permettre la co-création en temps réel.
Fonctionnalités:
- Zone de dessin/texte collaborative avec WebSocket.
- Curseurs des utilisateurs en direct.
- Panneau de chat intégré.
- Historique des versions.
Design: Interface type éditeur, curseurs colorés, chat latéral.
Composants: CanvasArea, LiveCursors, ChatPanel, VersionHistory.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_mentorship: {
            name: "Mentorship Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_mentorship
Objectif: Connecter créateurs et mentors.
Fonctionnalités:
- Liste de mentors avec spécialités et notes.
- Modal de réservation de session.
- Messagerie intégrée.
Design: Cartes profil, modal élégant, fil de messages.
Composants: MentorCard, BookingModal, MessageThread.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_progress: {
            name: "Progress Tracking Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_progress
Objectif: Suivre la progression d'apprentissage.
Fonctionnalités:
- Graphique de progression (compétences, projets complétés).
- Badges de réussite.
- Objectifs personnalisés.
Design: Graphiques interactifs, badges animés.
Composants: ProgressChart, BadgeGrid, GoalTracker.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_community: {
            name: "Community Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_community
Objectif: Favoriser l'interaction communautaire.
Fonctionnalités:
- Forum avec fils de discussion.
- Calendrier d'événements.
- Profils utilisateurs.
Design: Fil de discussion, calendrier en grille, profils avec avatar.
Composants: ForumThread, EventCalendar, UserProfile.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_ai_assistant: {
            name: "AI Assistant Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_ai_assistant
Objectif: Fournir des suggestions intelligentes.
Fonctionnalités:
- Panneau de recommandations basées sur l'IA (projets, ressources).
- Chat avec assistant IA.
Design: Panneau latéral avec cartes de suggestions, chat flottant.
Composants: SuggestionPanel, AIChatWidget.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_gallery: {
            name: "Gallery Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_gallery
Objectif: Présenter les projets terminés.
Fonctionnalités:
- Vue galerie immersive avec effets 3D.
- Filtres par popularité, catégorie.
- Partage social.
Design: Grille avec effets de survol, modal de partage.
Composants: GalleryView, ProjectSpotlight, ShareModal.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_workshop: {
            name: "Workshop Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_workshop
Objectif: Héberger des ateliers en direct.
Fonctionnalités:
- Lecteur vidéo intégré.
- Chat en direct.
- Quiz interactifs.
Design: Lecteur vidéo, chat latéral, quiz popup.
Composants: VideoPlayer, LiveChat, QuizModule.
[FIN DU CONTEXTE CACHÉ]`
        },
        tmpl_stitchlab_dashboard: {
            name: "Dashboard Module",
            context: `[CONTEXTE CACHÉ]
Module: tmpl_stitchlab_dashboard
Objectif: Vue d'ensemble personnalisée.
Fonctionnalités:
- Widgets: projets récents, messages, notifications.
- Statistiques clés.
Design: Grille de widgets, cartes avec icônes.
Composants: StatCard, RecentProjects, NotificationList.
[FIN DU CONTEXTE CACHÉ]`
        }
    };

    function injectText(text) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT' || activeElement.isContentEditable)) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(activeElement, text);
            } else {
                activeElement.value = text;
            }
            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.log('Aucun champ de saisie actif. Texte à injecter:', text);
        }
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.style.cssText = 'position:fixed; bottom:20px; right:20px; background:rgba(0,0,0,0.8); color:white; padding:10px; border-radius:8px; z-index:9999; font-family:sans-serif;';
        menu.innerHTML = '<strong>StitchLab PRDs</strong><br>';
        Object.keys(PRDS).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = PRDS[key].name;
            btn.style.cssText = 'display:block; margin:5px 0; padding:5px; background:#4a4a4a; color:white; border:none; border-radius:4px; cursor:pointer;';
            btn.onclick = () => injectText(PRDS[key].context);
            menu.appendChild(btn);
        });
        document.body.appendChild(menu);
    }

    setTimeout(createMenu, 3000);
})();