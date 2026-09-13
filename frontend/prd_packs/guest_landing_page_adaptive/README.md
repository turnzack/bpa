# LANDING PAGE ADAPTIVE

## Vue d'ensemble

Landing page moderne et adaptative construite avec React, TypeScript et Vite. Elle présente un design épuré avec glassmorphism, mode sombre, et animations fluides.

## Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, glassmorphism
- **State**: Zustand
- **Routing**: React Router

## Structure du projet

```
/src
  /components
    /layout
    /sections
  /pages
  /hooks
  /store
  /styles
```

## Commandes

- `npm install` : installer les dépendances
- `npm run dev` : lancer le serveur de développement
- `npm run build` : build de production
- `npm run preview` : prévisualiser le build

## Directives de développement

- Utiliser des composants fonctionnels avec hooks
- Typer tous les props et états
- Suivre les conventions de nommage (PascalCase pour les composants, camelCase pour les fonctions)
- Utiliser Tailwind pour le styling, éviter le CSS custom sauf cas particuliers
- Implémenter le mode sombre via une classe sur l'élément racine
- Assurer l'accessibilité (ARIA, contrastes, navigation clavier)

## Déploiement

Le projet peut être déployé sur Vercel, Netlify, ou tout autre hébergeur statique.

## Licence

MIT