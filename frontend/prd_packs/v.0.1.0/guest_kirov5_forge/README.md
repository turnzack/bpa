# 🏗️ KIROV5 FORGE — Orchestrateur Souverain de Génération de Projets IA

> **Directive Système IA** : Tu es KIROV5 FORGE, un orchestrateur souverain de génération de projets React/Vite complets. Ta mission est de transformer des spécifications métier en applications web professionnelles, avec une correction structurelle automatique des artefacts (fichiers `.txt` → `.tsx/.ts/.css`), une validation de code en temps réel, et une intégration Git. Tu opères via une extension Chrome Manifest V3, un moteur headless local (port 5005), et un système de routage de commandes. Tu génères des projets complets avec une qualité professionnelle, en corrigeant proactivement les erreurs et en offrant une expérience utilisateur fluide.

## Domaine Métier

KIROV5 FORGE est un outil de forge logicielle autonome pour développeurs et équipes produit. Il orchestre des agents IA (DeepSeek, etc.) pour générer des projets React/Vite complets directement dans le système de fichiers, avec une correction structurelle automatique (le problème critique des fichiers `.txt`), un pipeline de tests automatisés, et une interface de visualisation de l'arborescence générée. Il supporte multi-modèles IA et s'intègre avec Git pour un versioning complet.

## Les 10 Modules Architecturaux Disponibles

### 1. `tmpl_kirov5_forge_core` — Moteur d'Orchestration Souverain
- **Mission** : Orchestrer les agents IA (DeepSeek, etc.) pour générer des projets React/Vite complets, avec routage de commandes et correction structurelle automatique.
- **Design Requis** : Dashboard temps réel avec état des agents, file d'attente des tâches, logs d'orchestration.
- **Composants à générer** : `OrchestratorDashboard.tsx`, `AgentStatusCard.tsx`, `TaskQueue.tsx`, `CommandRouter.tsx`, `useOrchestrator.ts`

### 2. `tmpl_kirov5_forge_engine` — Moteur Headless Local (Port 5005)
- **Mission** : Fournir un moteur headless local pour exécuter des commandes de génération, avec API REST et WebSocket pour communication temps réel.
- **Design Requis** : Interface de contrôle du moteur avec indicateurs de performance, logs en direct, et gestion des processus.
- **Composants à générer** : `EngineControlPanel.tsx`, `EngineStatusBadge.tsx`, `ProcessMonitor.tsx`, `useEngine.ts`

### 3. `tmpl_kirov5_forge_artifact` — Correcteur d'Artefacts Structurels
- **Mission** : Corriger automatiquement les artefacts de génération (fichiers `.txt` → `.tsx/.ts/.css`), normaliser les chemins, et appliquer des correctifs React connus.
- **Design Requis** : Visualisation des corrections appliquées, historique des artefacts, et règles de correction configurables.
- **Composants à générer** : `ArtifactCorrector.tsx`, `CorrectionHistory.tsx`, `PathNormalizer.tsx`, `useArtifactCorrection.ts`

### 4. `tmpl_kirov5_forge_pack` — Pack Builder & Registry
- **Mission** : Construire des packs de génération de code (PRD, prompts, règles de chemins) et les enregistrer dans un registre pour réutilisation.
- **Design Requis** : Éditeur de packs avec aperçu, registre de packs avec recherche, et gestion des versions.
- **Composants à générer** : `PackBuilder.tsx`, `PackRegistry.tsx`, `PackEditor.tsx`, `usePackBuilder.ts`

### 5. `tmpl_kirov5_forge_validation` — Validation de Code en Temps Réel
- **Mission** : Valider le code généré en temps réel (linting, TypeScript, tests unitaires) et fournir des retours immédiats.
- **Design Requis** : Panneau de validation avec erreurs/warnings, indicateurs de qualité, et intégration avec les outils de build.
- **Composants à générer** : `ValidationPanel.tsx`, `ErrorList.tsx`, `QualityGauge.tsx`, `useCodeValidation.ts`

### 6. `tmpl_kirov5_forge_git` — Intégration Git & Versioning
- **Mission** : Intégrer Git pour versionner les projets générés, avec commits automatiques, branches, et push vers GitHub.
- **Design Requis** : Interface de gestion Git avec historique des commits, branches, et actions de push/pull.
- **Composants à générer** : `GitPanel.tsx`, `CommitHistory.tsx`, `BranchManager.tsx`, `useGitIntegration.ts`

### 7. `tmpl_kirov5_forge_visualizer` — Visualisation de l'Arborescence Générée
- **Mission** : Afficher l'arborescence des fichiers générés en temps réel, avec aperçu des fichiers et navigation.
- **Design Requis** : Arborescence interactive avec icônes par type de fichier, aperçu dans un panneau latéral, et recherche.
- **Composants à générer** : `FileTree.tsx`, `FilePreview.tsx`, `TreeSearch.tsx`, `useFileTree.ts`

### 8. `tmpl_kirov5_forge_multiagent` — Support Multi-Modèles IA
- **Mission** : Gérer plusieurs agents IA (DeepSeek, OpenAI, etc.) avec bascule dynamique, comparaison de résultats, et routage intelligent.
- **Design Requis** : Sélecteur de modèles, comparaison côte à côte, et indicateurs de performance par modèle.
- **Composants à générer** : `ModelSelector.tsx`, `ModelComparison.tsx`, `PerformanceMetrics.tsx`, `useMultiAgent.ts`

### 9. `tmpl_kirov5_forge_automation` — Automatisation & Pipeline de Tests
- **Mission** : Automatiser les pipelines de tests (unitaires, intégration, E2E) et les intégrer dans le flux de génération.
- **Design Requis** : Configuration des pipelines, exécution automatisée, et rapports de tests détaillés.
- **Composants à générer** : `PipelineConfigurator.tsx`, `TestRunner.tsx`, `TestReport.tsx`, `useAutomation.ts`

### 10. `tmpl_kirov5_forge_ui` — Interface Utilisateur Souveraine
- **Mission** : Fournir une interface utilisateur complète pour l'extension Chrome, avec popup, panneau flottant, et dashboard.
- **Design Requis** : Design system glassmorphism, dark mode, composants réutilisables, et navigation fluide.
- **Composants à générer** : `Popup.tsx`, `FloatingPanel.tsx`, `Dashboard.tsx`, `ThemeProvider.tsx`, `useTheme.ts`

## Vision UI/UX & Design System Global

- **Thème** : Dark mode glassmorphism avec accents cyan/violet, inspiré des interfaces de forge futuriste.
- **Typographie** : `Inter` pour le texte, `JetBrains Mono` pour le code.
- **Composants** : Boutons avec effet glass, cartes avec bordure lumineuse, badges de statut animés.
- **Hooks** : `useTheme`, `useOrchestrator`, `useEngine`, `useArtifactCorrection`, `usePackBuilder`, `useCodeValidation`, `useGitIntegration`, `useFileTree`, `useMultiAgent`, `useAutomation`.
- **États** : Chargement (spinner), succès (checkmark), erreur (alerte), en cours (pulsation).

## Directives de Câblage VFS

- Utiliser le système de fichiers virtuel (VFS) pour organiser les modules : `vfs/kirov5_forge/tmpl_kirov5_forge_core/`, `vfs/kirov5_forge/tmpl_kirov5_forge_engine/`, etc.
- Chaque module doit avoir un `index.ts` exportant ses composants et hooks.
- Les styles doivent être co-localisés avec les composants (CSS Modules ou Tailwind).
- Les assets (icônes, images) doivent être placés dans `vfs/kirov5_forge/assets/`.

## Instruction de Fusion

- Fusionner les modules en un seul projet React/Vite avec une structure `src/` complète.
- Le point d'entrée est `src/main.tsx` qui monte `App.tsx`.
- `App.tsx` doit intégrer le dashboard principal avec navigation entre les modules.
- Les hooks partagés doivent être dans `src/hooks/`, les composants dans `src/components/`, les types dans `src/types/`, et les utilitaires dans `src/utils/`.
- Le design system global doit être dans `src/styles/` avec des variables CSS.

## [INSTRUCTION IA]

Structure de fichiers `src/` complète pour le projet fusionné :

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── components/
│   ├── OrchestratorDashboard.tsx
│   ├── AgentStatusCard.tsx
│   ├── TaskQueue.tsx
│   ├── CommandRouter.tsx
│   ├── EngineControlPanel.tsx
│   ├── EngineStatusBadge.tsx
│   ├── ProcessMonitor.tsx
│   ├── ArtifactCorrector.tsx
│   ├── CorrectionHistory.tsx
│   ├── PathNormalizer.tsx
│   ├── PackBuilder.tsx
│   ├── PackRegistry.tsx
│   ├── PackEditor.tsx
│   ├── ValidationPanel.tsx
│   ├── ErrorList.tsx
│   ├── QualityGauge.tsx
│   ├── GitPanel.tsx
│   ├── CommitHistory.tsx
│   ├── BranchManager.tsx
│   ├── FileTree.tsx
│   ├── FilePreview.tsx
│   ├── TreeSearch.tsx
│   ├── ModelSelector.tsx
│   ├── ModelComparison.tsx
│   ├── PerformanceMetrics.tsx
│   ├── PipelineConfigurator.tsx
│   ├── TestRunner.tsx
│   ├── TestReport.tsx
│   ├── Popup.tsx
│   ├── FloatingPanel.tsx
│   ├── Dashboard.tsx
│   └── ThemeProvider.tsx
├── hooks/
│   ├── useOrchestrator.ts
│   ├── useEngine.ts
│   ├── useArtifactCorrection.ts
│   ├── usePackBuilder.ts
│   ├── useCodeValidation.ts
│   ├── useGitIntegration.ts
│   ├── useFileTree.ts
│   ├── useMultiAgent.ts
│   ├── useAutomation.ts
│   └── useTheme.ts
├── types/
│   ├── orchestrator.ts
│   ├── engine.ts
│   ├── artifact.ts
│   ├── pack.ts
│   ├── validation.ts
│   ├── git.ts
│   ├── fileTree.ts
│   ├── multiAgent.ts
│   ├── automation.ts
│   └── theme.ts
├── utils/
│   ├── pathNormalizer.ts
│   ├── artifactCorrector.ts
│   ├── codeParser.ts
│   └── gitHelper.ts
└── styles/
    ├── global.css
    ├── variables.css
    └── glassmorphism.css
```