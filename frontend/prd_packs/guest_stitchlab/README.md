> **Directive Système IA** : Tu es un architecte logiciel senior et expert en product design. Tu dois générer des composants React/TypeScript de haute qualité pour la plateforme StitchLab, en suivant scrupuleusement les PRDs fournis dans le contexte caché. Chaque composant doit être fonctionnel, esthétique, et suivre le design system défini. Tu dois utiliser Tailwind CSS pour le styling, Framer Motion pour les animations, et respecter les conventions de nommage et de structure de fichiers indiquées. Tu dois produire du code propre, commenté et prêt pour la production.

# 🧵 StitchLab : Création Collaborative et Apprentissage par Projets

## Description du Domaine Métier
StitchLab est une plateforme de projets créatifs collaboratifs, inspirée de Stitch with Google Projects. Elle permet aux créateurs de tous niveaux de découvrir, partager et co-créer des projets dans divers domaines (art, design, technologie, artisanat). L'application intègre des outils de collaboration en temps réel, de mentorat, et de suivi de progression pour transformer l'inspiration en compétences mesurables.

## Les 10 Modules Architecturaux Disponibles

### 1. tmpl_stitchlab_discovery
- **Mission** : Explorer et découvrir des projets créatifs via une interface immersive.
- **Design Requis** : Grille de cartes avec images, filtres par catégorie, recherche instantanée, animations d'apparition.
- **Composants à générer** : `ProjectCard`, `FilterBar`, `SearchInput`, `CategoryPills`.

### 2. tmpl_stitchlab_project_detail
- **Mission** : Afficher les détails d'un projet, incluant description, étapes, ressources et commentaires.
- **Design Requis** : Mise en page avec galerie d'images, timeline des étapes, section commentaires, bouton "Rejoindre".
- **Composants à générer** : `ProjectHeader`, `StepTimeline`, `CommentSection`, `JoinButton`.

### 3. tmpl_stitchlab_collab_editor
- **Mission** : Permettre la co-création en temps réel sur un projet (texte, dessin, mindmap).
- **Design Requis** : Éditeur collaboratif avec curseurs en direct, chat intégré, et historique des versions.
- **Composants à générer** : `CanvasArea`, `LiveCursors`, `ChatPanel`, `VersionHistory`.

### 4. tmpl_stitchlab_mentorship
- **Mission** : Connecter les créateurs avec des mentors pour des conseils personnalisés.
- **Design Requis** : Profils de mentors, système de réservation de sessions, messagerie intégrée.
- **Composants à générer** : `MentorCard`, `BookingModal`, `MessageThread`.

### 5. tmpl_stitchlab_progress
- **Mission** : Suivre la progression d'apprentissage et les compétences acquises.
- **Design Requis** : Tableau de bord avec graphiques de progression, badges, et objectifs personnalisés.
- **Composants à générer** : `ProgressChart`, `BadgeGrid`, `GoalTracker`.

### 6. tmpl_stitchlab_community
- **Mission** : Favoriser l'interaction communautaire via des forums et des événements.
- **Design Requis** : Fil de discussion, calendrier d'événements, profils utilisateurs.
- **Composants à générer** : `ForumThread`, `EventCalendar`, `UserProfile`.

### 7. tmpl_stitchlab_ai_assistant
- **Mission** : Fournir des suggestions intelligentes pour améliorer les projets et l'apprentissage.
- **Design Requis** : Panneau latéral avec recommandations basées sur l'IA, chat avec assistant.
- **Composants à générer** : `SuggestionPanel`, `AIChatWidget`.

### 8. tmpl_stitchlab_gallery
- **Mission** : Présenter les projets terminés dans une galerie virtuelle immersive.
- **Design Requis** : Mode galerie avec vue 3D, filtres par popularité, et partage social.
- **Composants à générer** : `GalleryView`, `ProjectSpotlight`, `ShareModal`.

### 9. tmpl_stitchlab_workshop
- **Mission** : Héberger des ateliers en direct et des tutoriels interactifs.
- **Design Requis** : Lecteur vidéo intégré, chat en direct, quiz interactifs.
- **Composants à générer** : `VideoPlayer`, `LiveChat`, `QuizModule`.

### 10. tmpl_stitchlab_dashboard
- **Mission** : Fournir une vue d'ensemble personnalisée de l'activité de l'utilisateur.
- **Design Requis** : Widgets pour projets récents, messages, notifications, et statistiques.
- **Composants à générer** : `StatCard`, `RecentProjects`, `NotificationList`.

## Vision UI/UX & Design System Global

- **Thème** : Dark mode glassmorphism avec accents vibrants (dégradés de violet et cyan).
- **Typographie** : Inter pour le texte, Space Grotesk pour les titres.
- **Composants UI** : Boutons avec effets de survol, cartes avec glass effect (backdrop-blur), transitions fluides via Framer Motion.
- **Hooks personnalisés** : `useAuth`, `useProjectData`, `useRealtimeCollab`, `useProgressTracking`.
- **États** : Chargement avec skeletons, erreurs avec messages clairs, vides avec illustrations.

## Directives de Câblage VFS

- Tous les composants doivent être placés dans `src/components/` avec des sous-dossiers par module.
- Les hooks dans `src/hooks/`, les contextes dans `src/contexts/`, les services API dans `src/services/`.
- Utiliser `react-router-dom` pour la navigation, avec des routes définies dans `src/App.tsx`.
- Les styles globaux dans `src/index.css` avec Tailwind directives.

## Instruction de Fusion

- Fusionner les composants générés dans le projet existant en respectant la structure de dossiers.
- Importer les composants dans les pages correspondantes.
- Assurer la cohérence des imports et des dépendances.

## [INSTRUCTION IA]

Structure de fichiers `src/` complète :

```
src/
  components/
    discovery/
      ProjectCard.tsx
      FilterBar.tsx
      SearchInput.tsx
      CategoryPills.tsx
    projectDetail/
      ProjectHeader.tsx
      StepTimeline.tsx
      CommentSection.tsx
      JoinButton.tsx
    collabEditor/
      CanvasArea.tsx
      LiveCursors.tsx
      ChatPanel.tsx
      VersionHistory.tsx
    mentorship/
      MentorCard.tsx
      BookingModal.tsx
      MessageThread.tsx
    progress/
      ProgressChart.tsx
      BadgeGrid.tsx
      GoalTracker.tsx
    community/
      ForumThread.tsx
      EventCalendar.tsx
      UserProfile.tsx
    aiAssistant/
      SuggestionPanel.tsx
      AIChatWidget.tsx
    gallery/
      GalleryView.tsx
      ProjectSpotlight.tsx
      ShareModal.tsx
    workshop/
      VideoPlayer.tsx
      LiveChat.tsx
      QuizModule.tsx
    dashboard/
      StatCard.tsx
      RecentProjects.tsx
      NotificationList.tsx
  hooks/
    useAuth.ts
    useProjectData.ts
    useRealtimeCollab.ts
    useProgressTracking.ts
  contexts/
    AuthContext.tsx
    ProjectContext.tsx
  services/
    api.ts
    websocket.ts
  pages/
    Home.tsx
    ProjectDetail.tsx
    CollabEditor.tsx
    Mentorship.tsx
    Progress.tsx
    Community.tsx
    Gallery.tsx
    Workshop.tsx
    Dashboard.tsx
  App.tsx
  main.tsx
  index.css
```