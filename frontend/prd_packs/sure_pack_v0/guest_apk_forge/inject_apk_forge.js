(function() {
 'use strict';

 const PRDS = {
 tmpl_apk_core: {
 name: 'tmpl_apk_core',
 description: 'Moteur d\'orchestration de build',
 context: [CONTEXTE CACHÉ]
 - Implémenter une machine à états avec XState ou un reducer personnalisé.
 - Les états : idle, configuring, building, testing, signing, publishing, done, error.
 - Exposer un hook useBuildOrchestrator qui renvoie { state, dispatch, startBuild, cancelBuild }.
 - Le contexte doit stocker le projet courant, la configuration, les logs, et les métadonnées du build.
 - L'orchestrateur appelle séquentiellement les modules builder, tester, signer, publisher via des promesses.
 - Gérer les erreurs avec des fallbacks et des tentatives de reprise.
 - Intégrer des points de surveillance pour le dashboard.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_builder: {
 name: 'tmpl_apk_builder',
 description: 'Exécuteur de build Gradle',
 context: [CONTEXTE CACHÉ]
 - Communiquer avec le backend via une API REST (POST /build) et WebSocket pour les logs.
 - Accepter un objet BuildConfig contenant : projectPath, variant, flavor, optimizations.
 - La fonction runBuild(config) retourne une promesse avec le chemin de l'APK généré et le rapport de build.
 - Implémenter un composant GradleConfigEditor pour modifier les paramètres de build (minify, proguard, etc.).
 - Afficher la sortie en temps réel dans un terminal virtuel.
 - Gérer les timeouts et les annulations.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_signer: {
 name: 'tmpl_apk_signer',
 description: 'Gestionnaire de signature',
 context: [CONTEXTE CACHÉ]
 - Stocker les keystores chiffrés (AES) dans le backend, avec des clés gérées par HashiCorp Vault ou similaire.
 - Interface pour ajouter/supprimer des profils de signature (alias, mot de passe, validité).
 - Fonction signApk(apkPath, profileId) : renvoie l'APK signé.
 - Valider la conformité avec les exigences de Google Play (v2, v3).
 - Générer des rapports de signature.
 - Implémenter une rotation automatique des certificats.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_analyzer: {
 name: 'tmpl_apk_analyzer',
 description: 'Analyse statique et dynamique',
 context: [CONTEXTE CACHÉ]
 - Exécuter des outils comme Lint, PMD, ou des analyseurs maison sur le code source.
 - Analyser la taille des ressources, les dépendances, les permissions.
 - Générer un rapport JSON avec les issues (sévérité, catégorie, fichier).
 - Intégrer des seuils d'alerte (ex: nombre de warnings > 50 → build échoue).
 - Afficher les résultats dans un tableau avec filtrage et tri.
 - Proposer des actions correctives automatiques (ex: suppression de ressources inutilisées).
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_tester: {
 name: 'tmpl_apk_tester',
 description: 'Exécuteur de tests',
 context: [CONTEXTE CACHÉ]
 - Lancer les tests Gradle (test, connectedCheck) en parallèle du build.
 - Récupérer les résultats en temps réel via les sorties Gradle.
 - Fournir un composant TestRunner avec options (exécuter tous les tests, seulement les modifiés).
 - Afficher les statistiques : total, réussis, échoués, temps d'exécution.
 - Capturer les captures d'écran en cas d'échec UI.
 - Stocker l'historique des tests pour détection de régressions.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_publisher: {
 name: 'tmpl_apk_publisher',
 description: 'Connecteur de distribution',
 context: [CONTEXTE CACHÉ]
 - Authentification via OAuth avec Google Play Console et autres stores.
 - API pour uploader l'APK, définir les notes de version, les track (alpha/beta/production).
 - Gérer les déploiements multi-canaux.
 - Fournir des liens de téléchargement direct ou des QR codes.
 - Implémenter une vérification préalable (validité du package, version).
 - Journaliser les actions de publication pour audit.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_ai_assistant: {
 name: 'tmpl_apk_ai_assistant',
 description: 'Assistant prédictif IA',
 context: [CONTEXTE CACHÉ]
 - Utiliser un modèle entraîné sur des logs de builds antérieurs pour prédire les échecs.
 - Intégrer des appels à une API externe (ex: OpenAI) pour générer des suggestions de correction.
 - Afficher une recommandation proactive avant chaque étape critique.
 - Analyser les patterns d'erreur récurrents (ex: dépendances manquantes).
 - Proposer des optimisations de performance (ex: réduire la taille des ressources).
 - Le composant SuggestionPanel affiche la prédiction et un score de confiance.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_dashboard: {
 name: 'tmpl_apk_dashboard',
 description: 'Tableau de bord et métriques',
 context: [CONTEXTE CACHÉ]
 - Agréger les données de build (durée moyenne, taux de succès, fréquence).
 - Utiliser Chart.js pour afficher des graphiques (barres, courbes).
 - Configurer des alertes par email ou Slack lors d'échecs répétés.
 - Widgets personnalisables (derniers builds, top erreurs).
 - Permettre l'export des rapports en PDF.
 - Mettre à jour en temps réel via WebSocket.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_ui: {
 name: 'tmpl_apk_ui',
 description: 'Interface utilisateur',
 context: [CONTEXTE CACHÉ]
 - Layout avec barre de navigation latérale pour accéder aux modules.
 - Page d'accueil avec résumé des derniers builds.
 - Formulaire de configuration en steps (projet, build, signature, tests).
 - Indicateur de progression avec animation de barre et logs déroulants.
 - Thème clair/sombre basé sur les préférences utilisateur.
 - Notifications toast pour les actions réussies/échouées.
 - Design responsive adapté aux tablettes et mobiles.
 [FIN DU CONTEXTE CACHÉ]
 },
 tmpl_apk_shared: {
 name: 'tmpl_apk_shared',
 description: 'Utilitaires partagés',
 context: [CONTEXTE CACHÉ]
 - Logger avec niveaux (debug, info, warn, error) et écriture dans la console et le localStorage.
 - Fonctions de cryptage/décryptage (AES) pour les données sensibles.
 - Gestion des fichiers : lecture, écriture, conversion en base64.
 - Hooks personnalisés : useWebSocket pour la connexion en temps réel, useLocalStorage pour la persistance.
 - Types TypeScript partagés pour les interfaces de build, de projet, de configuration.
 - Aucune dépendance vers les modules métier.
 [FIN DU CONTEXTE CACHÉ]
 }
 };

 function injectText(text, name) {
 const container = document.getElementById('prd-inject-container') || (function() {
 const div = document.createElement('div');
 div.id = 'prd-inject-container';
 div.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;max-width:400px;';
 document.body.appendChild(div);
 return div;
 })();
 const card = document.createElement('div');
 card.style.cssText = 'background:#1e293b;color:#e2e8f0;border-radius:12px;padding:16px;margin-top:8px;box-shadow:0 8px 24px rgba(0,0,0,0.5);border-left:4px solid #2a7de1;font-family:Inter, sans-serif;';
 const title = document.createElement('div');
 title.style.cssText = 'font-weight:bold;font-size:14px;color:#94a3b8;margin-bottom:4px;';
 title.textContent = '🧩 ' + (name || 'PRD Module');
 const content = document.createElement('div');
 content.style.cssText = 'font-size:13px;line-height:1.5;white-space:pre-wrap;';
 content.textContent = text;
 card.appendChild(title);
 card.appendChild(content);
 container.appendChild(card);
 }

 function createMenu() {
 const existing = document.getElementById('prd-menu-container');
 if (existing) existing.remove();

 const container = document.createElement('div');
 container.id = 'prd-menu-container';
 container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;background:#0f172a;border-radius:16px;padding:12px;box-shadow:0 12px 40px rgba(0,0,0,0.6);border:1px solid #334155;max-height:80vh;overflow-y:auto;width:240px;';
 
 const title = document.createElement('div');
 title.style.cssText = 'color:#f8fafc;font-weight:bold;font-size:16px;padding-bottom:8px;border-bottom:1px solid #334155;margin-bottom:8px;';
 title.textContent = '📦 APK Forge - Modules';
 container.appendChild(title);

 Object.keys(PRDS).forEach(key => {
 const btn = document.createElement('button');
 const module = PRDS[key];
 btn.style.cssText = 'display:block;width:100%;background:transparent;border:none;color:#cbd5e1;padding:8px 4px;text-align:left;font-size:14px;cursor:pointer;border-radius:6px;transition:background 0.2s;';
 btn.textContent = module.name;
 btn.addEventListener('mouseover', () => { btn.style.background = '#1e293b'; });
 btn.addEventListener('mouseout', () => { btn.style.background = 'transparent'; });
 btn.addEventListener('click', () => {
 injectText(module.context, module.name);
 });
 container.appendChild(btn);
 });

 document.body.appendChild(container);
 }

 // Auto-inject all contexts after 3 seconds
 setTimeout(() => {
 createMenu();
 // Optionally inject first module as demo
 // injectText(PRDS.tmpl_apk_core.context, PRDS.tmpl_apk_core.name);
 }, 3000);

})();
