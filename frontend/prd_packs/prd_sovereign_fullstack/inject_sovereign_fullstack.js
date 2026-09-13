/*
[CONTEXTE CACHÉ - ARCHITECTURE MASTER PRD SOVEREIGN FULL-STACK ENGINE]
MISSION: Tu dois préparer le code React généré pour qu'il s'intègre parfaitement avec un Moteur Souverain Full-Stack (Backend Node/Python, Base de données, WebSockets, Workers).

RÈGLES ARCHITECTURALES STRICTES (LES 5 PILIERS) :
1. MOTEUR D'EXÉCUTION (CORE) : Le frontend doit envoyer des intentions claires via des appels asynchrones (services) pour qu'un moteur puisse les traiter en arrière-plan. Utiliser des états explicites (idle, running, pending, failed, success).
2. BACKEND & DB API-READY : L'état global (Zustand) DOIT simuler de vrais appels asynchrones (ex: Promesses avec setTimeout) vers une future API. Ne JAMAIS muter l'état directement depuis les composants UI (passer obligatoirement par des fonctions de store ou des services).
3. SÉCURITÉ & AUTH : Préparer les vues pour un système d'authentification (JWT/OAuth). Les modules de secrets/identifiants doivent afficher les données de manière sécurisée (masquage, copie protégée).
4. TEMPS RÉEL (WEBSOCKETS) : Concevoir l'architecture Zustand pour qu'elle puisse facilement recevoir des mises à jour asynchrones pushées par un serveur (SSE/WebSockets), en déclenchant un re-rendu fluide de l'UI.
5. DÉPLOIEMENT : Le code source doit respecter les standards 12-Factor App (agnostique, prêt pour Docker, utilisation de variables d'environnement simulées si nécessaire).

IMPACT SUR LA GÉNÉRATION DE CODE :
- Tes composants UI doivent être parfaitement découplés de la logique métier.
- Crée toujours un dossier \`src/store/\` (Zustand) et un dossier \`src/services/\` (API mockée).
- Utilise \`crypto.randomUUID()\` ou similaire pour générer des IDs temporaires réalistes.

[FIN DU CONTEXTE CACHÉ]
*/
