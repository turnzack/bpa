# APK Forge — Intelligent Android Packaging Suite

> Directive IA : Ce README est le contrat de conception pour le projet APK Forge. Il définit l'architecture, les modules, la vision UI/UX et les règles de câblage. Toute décision technique doit s'y conformer. Le code généré devra respecter strictement la structure src/ définie et les interfaces TypeScript spécifiées.

---

## 🧭 Vision Métier

APK Forge répond à la complexité de la génération d'APK en entreprise. Il automatise l'intégralité du pipeline : clonage du projet, résolution de dépendances, exécution de Gradle, signature, tests, analyse statique et publication. L'assistant IA prédit les échecs de build, suggère des optimisations de performance et de sécurité, et réduit le temps de cycle de déploiement.

---

## 🧱 Modules Architecturaux (10)

### 1. tmpl_apk_core – Moteur d'Orchestration
- Mission : Piloter le flux de build (séquences, parallélisation, gestion d'état).
- Design Requis : Pattern State Machine avec états idle, configuring, building, testing, signing, publishing, done, error.
- Composants à générer : src/core/Orchestrator.tsx (hook useBuildOrchestrator), src/core/BuildStateContext.tsx.

### 2. tmpl_apk_builder – Exécuteur de Build
- Mission : Lancer Gradle, gérer les variants (debug/release/flavors), optimiser les ressources.
- Design Requis : API REST pour déclencher les tâches, flux de logs en temps réel via WebSocket.
- Composants : src/builder/BuildRunner.tsx, src/builder/GradleConfigEditor.tsx.

### 3. tmpl_apk_signer – Gestionnaire de Signature
- Mission : Centraliser les keystores, gérer les rotations et la conformité (APK v2/v3).
- Design Requis : Chiffrement des clés, interface de sélection de profil de signature.
- Composants : src/signer/KeystoreManager.tsx, src/signer/SigningProfileForm.tsx.

### 4. tmpl_apk_analyzer – Analyse Statique & Dynamique
- Mission : Scanner le code source, les ressources, détecter les vulnérabilités, les régressions de performance.
- Design Requis : Intégration de lint, de détecteurs de fuites mémoire, et de rapports de conformité.
- Composants : src/analyzer/AnalysisDashboard.tsx, src/analyzer/IssueList.tsx.

### 5. tmpl_apk_tester – Exécuteur de Tests
- Mission : Lancer les tests unitaires, d'intégration et UI en parallèle du build.
- Design Requis : Agrégation des résultats, capture des écrans d'échec.
- Composants : src/tester/TestRunner.tsx, src/tester/TestReportViewer.tsx.

### 6. tmpl_apk_publisher – Connecteur de Distribution
- Mission : Publier sur Google Play, Huawei AppGallery, ou générer des liens de téléchargement privés.
- Design Requis : Gestion des comptes services, API de téléchargement.
- Composants : src/publisher/StoreConnector.tsx, src/publisher/ReleaseChannelManager.tsx.

### 7. tmpl_apk_ai_assistant – Assistant Prédictif IA
- Mission : Analyser les logs de build, prédire les erreurs, proposer des correctifs et des optimisations.
- Design Requis : Modèle de langage léger (ex. TensorFlow.js) ou appel à un service externe.
- Composants : src/ai/ErrorPredictor.tsx, src/ai/SuggestionPanel.tsx.

### 8. tmpl_apk_dashboard – Tableau de Bord
- Mission : Visualiser les métriques de build (durée, taux de succès, tendances) et les alertes.
- Design Requis : Graphiques interactifs (Chart.js), système de notifications.
- Composants : src/dashboard/StatsWidget.tsx, src/dashboard/AlertList.tsx.

### 9. tmpl_apk_ui – Interface Utilisateur
- Mission : Rendre l'expérience fluide – configuration, lancement, suivi en direct.
- Design Requis : Layout responsive, thème clair/sombre, animations de progression.
- Composants : src/ui/AppLayout.tsx, src/ui/BuildProgressBar.tsx, src/ui/ConfigWizard.tsx.

### 10. tmpl_apk_shared – Bibliothèque Partagée
- Mission : Utilitaires (logging, cryptage, gestion de fichiers, hooks personnalisés).
- Design Requis : Pas de dépendance vers les modules métier.
- Composants : src/shared/hooks/useWebSocket.ts, src/shared/utils/logger.ts, src/shared/utils/encryption.ts.

---

## 🎨 Vision UI/UX & Design System

- Palette : #0B1E33 (primary), #2A7DE1 (accent), #F0F4FA (background), #FFFFFF (surface).
- Typographie : Inter (sans-serif) pour lisibilité, tailles fluides.
- Composants Atomiques : Boutons (variant primary, secondary, danger), champs de formulaire avec validation en temps réel, cartes de statut (build en cours, réussi, échec).
- Animations : Transitions douces sur les changements d'état (300ms ease). Indicateur de progression avec pourcentage et logs en console défilante.
- Accessibilité : Contraste WCAG AA, navigation au clavier, aria-labels.

---

## 🔌 Directives de Câblage VFS

- TypeScript strict : strict: true dans tsconfig.json.
- React Context : Fournir BuildContext, AuthContext, ThemeContext.
- Custom Hooks : useBuild, useSigning, useAnalytics encapsulant la logique métier.
- API Backend : Endpoints REST pour lancer/arrêter un build, récupérer les logs, les résultats. WebSocket pour le streaming.
- Gestion d'état : Redux Toolkit ou Zustand pour l'état global (builds, projets, notifications).

---

## 📁 Structure src/ (Instruction IA)


src/
├── core/
│ ├── Orchestrator.tsx
│ ├── BuildStateContext.tsx
│ └── BuildMachine.ts
├── builder/
│ ├── BuildRunner.tsx
│ └── GradleConfigEditor.tsx
├── signer/
│ ├── KeystoreManager.tsx
│ └── SigningProfileForm.tsx
├── analyzer/
│ ├── AnalysisDashboard.tsx
│ └── IssueList.tsx
├── tester/
│ ├── TestRunner.tsx
│ └── TestReportViewer.tsx
├── publisher/
│ ├── StoreConnector.tsx
│ └── ReleaseChannelManager.tsx
├── ai/
│ ├── ErrorPredictor.tsx
│ └── SuggestionPanel.tsx
├── dashboard/
│ ├── StatsWidget.tsx
│ └── AlertList.tsx
├── ui/
│ ├── AppLayout.tsx
│ ├── BuildProgressBar.tsx
│ └── ConfigWizard.tsx
├── shared/
│ ├── hooks/
│ │ ├── useWebSocket.ts
│ │ └── useLocalStorage.ts
│ ├── utils/
│ │ ├── logger.ts
│ │ └── encryption.ts
│ └── types/
│ └── BuildTypes.ts
└── index.tsx


---

## 🔗 Fusion avec l'Orchestrateur

Le core/Orchestrator consomme les modules via des interfaces bien définies. Chaque module expose un service ou un ensemble de fonctions. Exemple : builder exporte runBuild(config), signer exporte signApk(file, profile). L'orchestrateur enchaîne les appels, gère les erreurs et met à jour le contexte. L'IA est intégrée en tant que middleware avant chaque étape pour valider les paramètres.

---

## 🧪 Tests & Qualité

- Tests unitaires avec Jest + React Testing Library.
- Tests d'intégration sur le pipeline de build (mock backend).
- E2E avec Cypress.
- Documentation auto-générée (TypeDoc).

---

## 🚀 Livrables

- Application web déployable (Docker + Nginx).
- API backend (Node.js/Express) avec documentation OpenAPI.
- Assistant IA entraîné sur des logs historiques.

---
