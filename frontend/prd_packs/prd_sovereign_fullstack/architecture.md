# 🏗️ Architecture Cible : Les 5 Piliers du Moteur Souverain

Ce document définit l'architecture cible vers laquelle toute interface frontend générée doit converger.

## 1. 🧠 Le Moteur d'Exécution (Le "Core" Métier)
L'interface doit être conçue pour communiquer avec un moteur asynchrone (ex: BullMQ, Celery). Les actions longues (ex: lancer un workflow, traiter des données) ne doivent jamais bloquer l'UI. Le frontend doit refléter des états transitoires (\`pending\`, \`processing\`, \`completed\`, \`failed\`).

## 2. 🔌 Le Vrai Backend API & Base de Données
Les données ne doivent pas être manipulées localement de manière synchrone. L'IA doit structurer le code avec :
- Une couche **Store** (Zustand) pour gérer l'état global.
- Une couche **Service** (\`api.ts\`, \`services/\`) qui contient les requêtes asynchrones (\`Promises\`, faux délais \`setTimeout\`) prêtes à être remplacées par de vrais \`fetch()\`.

## 3. 🔒 Sécurité et Gestion des Identifiants
Le design system doit inclure :
- Des composants pour la gestion de clés secrètes (masquage par défaut, impossible à copier sans authentification).
- Une prise en charge native du mode "Multi-Tenant" (chaque utilisateur a son propre espace de travail isolé).

## 4. ⚡ Le Temps Réel (WebSockets)
L'architecture d'état (Store) doit être capable de recevoir des signaux externes. Les composants UI doivent être réactifs aux changements de props ou d'état globaux sans nécessiter de rafraîchissement manuel.

## 5. 🐳 Déploiement et Conteneurisation (Docker)
L'application doit être \`12-Factor App\` compliant :
- Les URL d'API, clés de test, et configurations doivent être prêtes à être injectées via des variables d'environnement (\`.env\`).
- Le code source doit être agnostique du serveur hôte pour faciliter une conteneurisation Docker (Frontend / Backend / Database).
