# Directive Système IA

> **Directive Système IA** : Tu es un architecte logiciel senior et expert en product design. Ta mission est de générer des fichiers de haute qualité pour le projet **GTA VI STORE**. Tu dois suivre les spécifications détaillées dans ce document, en respectant les 10 modules architecturaux, la vision UI/UX, et les directives de câblage VFS. Chaque fichier généré doit être spécifique au domaine de la boutique en ligne de jeux vidéo, avec une expérience utilisateur cinématique et immersive. Tu dois produire du code React/TypeScript moderne, avec des composants réutilisables, des hooks personnalisés, et un design system cohérent. Tu dois également intégrer les fonctionnalités de précommande, de comparaison d'éditions, et de communauté. Assure-toi que chaque module est complet, fonctionnel, et prêt à être intégré dans l'application.

# 🎮 GTA VI STORE

## Description du Domaine Métier

**GTA VI STORE** est une plateforme de précommande et de découverte de jeux vidéo nouvelle génération, centrée sur l'expérience utilisateur cinématique. Inspirée de la page de précommande de GTA VI sur le store Rockstar Games, cette application vise à immerger les utilisateurs dans l'univers du jeu avant même sa sortie. Elle combine une présentation visuelle forte (captures d'écran, bandes-annonces) avec des informations clés (date de sortie, plateformes, éditions) et un appel à l'action clair. L'objectif est de construire une communauté autour du jeu, avec des contenus exclusifs, des interactions enrichies, et des fonctionnalités de personnalisation et de comparaison d'éditions.

## Les 10 Modules Architecturaux Disponibles

### 1. tmpl_gta_vi_store_hero
- **Mission** : Présenter le jeu de manière spectaculaire avec une vidéo de fond, un titre animé, et un appel à l'action principal.
- **Design Requis** : Section plein écran avec vidéo en arrière-plan, overlay dégradé, titre avec animation de fondu, boutons de précommande et de bande-annonce.
- **Composants à générer** : `HeroSection.tsx`, `HeroVideo.tsx`, `HeroTitle.tsx`, `HeroCTA.tsx`

### 2. tmpl_gta_vi_store_editions
- **Mission** : Afficher les différentes éditions du jeu (Standard, Deluxe, Ultimate) avec leurs prix et avantages.
- **Design Requis** : Cartes comparatives avec effets de survol, badges de popularité, et boutons de sélection.
- **Composants à générer** : `EditionsSection.tsx`, `EditionCard.tsx`, `EditionBadge.tsx`, `EditionPrice.tsx`

### 3. tmpl_gta_vi_store_screenshots
- **Mission** : Présenter une galerie de captures d'écran immersives avec navigation et zoom.
- **Design Requis** : Carrousel horizontal avec miniatures, mode plein écran, transitions fluides.
- **Composants à générer** : `ScreenshotsGallery.tsx`, `ScreenshotItem.tsx`, `ScreenshotLightbox.tsx`, `ScreenshotThumbnails.tsx`

### 4. tmpl_gta_vi_store_trailer
- **Mission** : Intégrer la bande-annonce officielle avec lecture intégrée et contrôles personnalisés.
- **Design Requis** : Lecteur vidéo personnalisé avec bouton play, plein écran, et contrôles de volume.
- **Composants à générer** : `TrailerSection.tsx`, `TrailerPlayer.tsx`, `TrailerControls.tsx`, `TrailerModal.tsx`

### 5. tmpl_gta_vi_store_features
- **Mission** : Mettre en avant les caractéristiques clés du jeu (monde ouvert, graphismes, histoire).
- **Design Requis** : Grille de fonctionnalités avec icônes, animations au scroll, et texte descriptif.
- **Composants à générer** : `FeaturesSection.tsx`, `FeatureItem.tsx`, `FeatureIcon.tsx`, `FeatureText.tsx`

### 6. tmpl_gta_vi_store_preorder
- **Mission** : Gérer le processus de précommande avec sélection d'édition, plateforme, et paiement.
- **Design Requis** : Formulaire multi-étapes avec barre de progression, récapitulatif, et confirmation.
- **Composants à générer** : `PreorderSection.tsx`, `PreorderForm.tsx`, `PreorderSteps.tsx`, `PreorderSummary.tsx`

### 7. tmpl_gta_vi_store_community
- **Mission** : Créer un espace communautaire avec actualités, forums, et événements.
- **Design Requis** : Fil d'actualités, cartes d'événements, et section de commentaires.
- **Composants à générer** : `CommunitySection.tsx`, `NewsFeed.tsx`, `EventCard.tsx`, `CommentSection.tsx`

### 8. tmpl_gta_vi_store_social
- **Mission** : Intégrer les réseaux sociaux et le partage de contenu.
- **Design Requis** : Boutons de partage, flux social intégré, et compteurs de likes.
- **Composants à générer** : `SocialSection.tsx`, `ShareButtons.tsx`, `SocialFeed.tsx`, `LikeCounter.tsx`

### 9. tmpl_gta_vi_store_faq
- **Mission** : Fournir une section FAQ pour répondre aux questions courantes sur la précommande et le jeu.
- **Design Requis** : Accordéon avec animations, recherche de questions, et liens de contact.
- **Composants à générer** : `FaqSection.tsx`, `FaqItem.tsx`, `FaqSearch.tsx`, `FaqContact.tsx`

### 10. tmpl_gta_vi_store_footer
- **Mission** : Présenter les informations légales, les liens de navigation, et les réseaux sociaux.
- **Design Requis** : Footer multi-colonnes avec newsletter, icônes sociales, et copyright.
- **Composants à générer** : `FooterSection.tsx`, `FooterLinks.tsx`, `NewsletterSignup.tsx`, `SocialIcons.tsx`

## Vision UI/UX & Design System Global

**Thème** : Dark mode avec glassmorphism, accents néon (orange et bleu), typographie futuriste.

**Design System** :
- **Couleurs** : 
  - `--color-bg: #0a0a0a` (fond principal)
  - `--color-surface: rgba(255, 255, 255, 0.05)` (verre)
  - `--color-primary: #ff6b00` (orange néon)
  - `--color-secondary: #00d4ff` (bleu néon)
  - `--color-text: #ffffff`
- **Typographie** : `Orbitron` pour les titres, `Inter` pour le corps.
- **Effets** : Glassmorphism (backdrop-filter: blur), ombres portées, animations de fondu et de glissement.
- **Composants UI** : Boutons avec dégradé, cartes avec bordure lumineuse, icônes SVG personnalisées.

**Hooks personnalisés** : `useScrollReveal`, `useVideoPlayer`, `usePreorderState`, `useCommunityFeed`.

**États globaux** : Gestion de la sélection d'édition, de la plateforme, et de l'état de précommande via Context API.

## Directives de Câblage VFS

- **Structure des dossiers** : `src/components/`, `src/hooks/`, `src/context/`, `src/data/`, `src/styles/`.
- **Nommage** : Chaque module doit être dans un dossier `src/components/tmpl_gta_vi_store_*`.
- **Importation** : Utiliser des imports relatifs pour les composants internes.
- **Styles** : Utiliser CSS Modules ou Tailwind CSS pour les styles.
- **Données** : Les données statiques (éditions, captures, FAQ) doivent être dans `src/data/`.
- **Context** : Créer un contexte global pour la précommande dans `src/context/PreorderContext.tsx`.

## Instruction de Fusion

Pour fusionner les modules dans l'application principale, importer chaque composant principal dans `App.tsx` et les placer dans l'ordre : Hero, Éditions, Captures, Bande-annonce, Fonctionnalités, Précommande, Communauté, Social, FAQ, Footer. Assurer la navigation fluide entre les sections avec des ancres.

## [INSTRUCTION IA]

**Structure de fichiers `src/` complète** :

```
src/
  App.tsx
  main.tsx
  index.css
  components/
    tmpl_gta_vi_store_hero/
      HeroSection.tsx
      HeroVideo.tsx
      HeroTitle.tsx
      HeroCTA.tsx
    tmpl_gta_vi_store_editions/
      EditionsSection.tsx
      EditionCard.tsx
      EditionBadge.tsx
      EditionPrice.tsx
    tmpl_gta_vi_store_screenshots/
      ScreenshotsGallery.tsx
      ScreenshotItem.tsx
      ScreenshotLightbox.tsx
      ScreenshotThumbnails.tsx
    tmpl_gta_vi_store_trailer/
      TrailerSection.tsx
      TrailerPlayer.tsx
      TrailerControls.tsx
      TrailerModal.tsx
    tmpl_gta_vi_store_features/
      FeaturesSection.tsx
      FeatureItem.tsx
      FeatureIcon.tsx
      FeatureText.tsx
    tmpl_gta_vi_store_preorder/
      PreorderSection.tsx
      PreorderForm.tsx
      PreorderSteps.tsx
      PreorderSummary.tsx
    tmpl_gta_vi_store_community/
      CommunitySection.tsx
      NewsFeed.tsx
      EventCard.tsx
      CommentSection.tsx
    tmpl_gta_vi_store_social/
      SocialSection.tsx
      ShareButtons.tsx
      SocialFeed.tsx
      LikeCounter.tsx
    tmpl_gta_vi_store_faq/
      FaqSection.tsx
      FaqItem.tsx
      FaqSearch.tsx
      FaqContact.tsx
    tmpl_gta_vi_store_footer/
      FooterSection.tsx
      FooterLinks.tsx
      NewsletterSignup.tsx
      SocialIcons.tsx
  hooks/
    useScrollReveal.ts
    useVideoPlayer.ts
    usePreorderState.ts
    useCommunityFeed.ts
  context/
    PreorderContext.tsx
  data/
    editions.ts
    screenshots.ts
    features.ts
    faqs.ts
    news.ts
  styles/
    global.css
    variables.css
```