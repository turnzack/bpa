# WELCOME VIBES

Landing page colorée de bienvenue, conçue pour offrir une expérience visuelle vibrante et engageante. Ce projet est un PRD (Product Requirements Document) de type Sovereign Guest, fournissant une spécification complète pour l'implémentation.

## Stack Technique

- **React** 18+
- **TypeScript** 5+
- **Vite** 5+
- **TailwindCSS** 3.4+
- **Framer Motion** pour les animations

## Installation

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` : lance le serveur de développement
- `npm run build` : construit l'application pour la production
- `npm run preview` : prévisualise la build
- `npm run test` : exécute les tests (si configurés)

## Structure du Projet

```
/src
  /components
    /ui
    /sections
  /hooks
  /lib
  /styles
  /types
```

## Directives de Développement

- Utiliser des composants fonctionnels avec hooks.
- Respecter les types TypeScript stricts.
- Utiliser TailwindCSS pour le styling, avec des classes utilitaires.
- Les animations doivent être fluides et non bloquantes.
- Le design doit être responsive et accessible.

## Modèle de Données

Voir `domain/entities.json` pour les entités principales.

## Workflows

Voir `workflows/workflows.json` pour les parcours utilisateur.

## Tests

Voir `tests/acceptance.json` pour les critères d'acceptation.

## Validation

Voir `validation/pack-report.json` pour le rapport de validation du pack.
