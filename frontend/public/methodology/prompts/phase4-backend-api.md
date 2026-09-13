# Phase 4: Backend et API

## Objectif
Lier l'interface utilisateur aux services backend ou mocker les appels API.

## Règles strictes
- Isoler tous les appels réseau dans `src/services/` ou `src/api/`.
- Utiliser fetch ou axios avec une gestion d'erreur stricte (Try/Catch).
- En l'absence de backend réel, créer des mocks réalistes avec des délais artificiels pour tester les états de chargement.
