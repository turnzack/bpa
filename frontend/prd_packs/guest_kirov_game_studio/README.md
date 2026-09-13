# KIROV Game Studio — Forge de Spécifications de Jeux Vidéo Autonome et Prédictive

> Directive IA : Ce README est le contrat de conception pour le projet KIROV Game Studio. Il définit l'architecture, les modules, la vision UI/UX et les règles de câblage. Toute décision technique doit s'y conformer. Le code généré devra respecter strictement la structure src/ définie et les interfaces TypeScript spécifiées.

---

## 🧭 Vision Métier

KIROV Game Studio est une plateforme de conception de jeux vidéo assistée par IA. Elle transforme une idée brute (texte, lien web, vidéo YouTube) en un pack PRD/GDD complet, incluant des spécifications techniques, des maquettes jouables et des plans de développement prédictifs. L'IA analyse les idées, propose des architectures techniques, anticipe les risques et réduit le cycle de conception.

---

## 🧱 Modules Architecturaux (10)

### 1. tmpl_core – Moteur d'Orchestration
- Mission : Piloter le pipeline de génération (ingestion, analyse, génération, validation).
- Design Requis : Pattern State Machine avec états idle, analyzing, generating, validating, done, error.
- Composants à générer : src/core/Orchestrator.tsx (hook usePipelineOrchestrator), src/core/PipelineStateContext.tsx.

### 2. tmpl_ingestion – Ingestion des Sources
- Mission : Accepter les idées texte, les URLs web, les vidéos YouTube (analyse de la thématique, pas de scraping).
- Design Requis : Interface de saisie avec validation, extraction de métadonnées, normalisation.
- Composants : src/ingestion/IdeaInput.tsx, src/ingestion/SourceNormalizer.ts.

### 3. tmpl_analyzer – Analyse IA & Proposition
- Mission : Analyser l'idée, proposer un concept de jeu, définir le genre, la plateforme, le style artistique.
- Design Requis : Appel à l'API IA (DeepSeek ou autre), génération de proposition structurée.
- Composants : src/analyzer/AnalysisEngine.ts, src/analyzer/ProposalViewer.tsx.

### 4. tmpl_generator – Générateur de Packs PRD/GDD
- Mission : Générer les documents PRD (Product Requirements Document) et GDD (Game Design Document) complets.
- Design Requis : Templates markdown, génération de contenu structuré, export en ZIP.
- Composants : src/generator/PackGenerator.ts, src/generator/PackViewer.tsx.

### 5. tmpl_prototype – Générateur de Maquettes Jouables
- Mission : Générer des prototypes jouables (HTML5 Canvas, Phaser, Three.js) à partir des spécifications.
- Design Requis : Génération de code source, prévisualisation dans le navigateur.
- Composants : src/prototype/PrototypeGenerator.ts, src/prototype/PrototypePreview.tsx.

### 6. tmpl_planner – Plan de Développement Prédictif
- Mission : Générer un plan de développement détaillé avec estimation des tâches, des risques et des jalons.
- Design Requis : Algorithmes d'estimation, analyse des risques, génération de diagrammes de Gantt.
- Composants : src/planner/DevelopmentPlanner.ts, src/planner/PlanViewer.tsx.

### 7. tmpl_validator – Validation & Tests
- Mission : Valider la cohérence des packs générés, exécuter des tests de conformité.
- Design Requis : Règles de validation, tests unitaires, rapport de validation.
- Composants : src/validator/PackValidator.ts, src/validator/ValidationReport.tsx.

### 8. tmpl_export – Export & Intégration
- Mission : Exporter les packs en ZIP, intégrer avec le boilerplate electron-game.
- Design Requis : Génération de fichiers, téléchargement, intégration avec le système de fichiers local.
- Composants : src/export/PackExporter.ts, src/export/ExportButton.tsx.

### 9. tmpl_ui – Interface Utilisateur
- Mission : Fournir une interface moderne avec dark mode, glassmorphism, animations fluides.
- Design Requis : React + Tailwind CSS + Framer Motion, composants réutilisables.
- Composants : src/ui/Header.tsx, src/ui/Footer.tsx, src/ui/GlassCard.tsx.

### 10. tmpl_bridge – Pont Backend
- Mission : Communiquer avec le backend KIROV (port 5005) pour les appels IA et la persistance.
- Design Requis : API client, gestion des clés API, stockage local.
- Composants : src/bridge/ApiClient.ts, src/bridge/KeyManager.ts.

---

## 🎯 Spécifications & Objectifs

1. **Zéro Défaut Visual** : Respect strict du design système sombre, dégradés vibrants et glassmorphism.
2. **Modularité** : Isolation propre des modules et des routes.
3. **Persistance & Mock Data** : Structure de données prête pour la production.
4. **IA Prédictive** : Analyse des risques, estimation des délais, suggestions d'amélioration.
5. **Prototypage Rapide** : Génération de maquettes jouables en HTML5/Canvas.

---

## 🛠️ Instructions pour Tiger IA

Pour exécuter la création de ce projet dans le Moteur Tiger IA :
```bash
# Ce pack est injecté automatiquement via inject_guest_kirov_game_studio.js
```

---

## 📦 Structure du Pack

```
guest_kirov_game_studio/
├── manifest.json
├── README.md
├── domain/
│   ├── entities.json
│   ├── invariants.json
│   └── state-machines.json
├── contracts/
│   ├── state-contract.json
│   ├── api-contract.json
│   └── ui-bindings.json
├── workflows/
│   └── workflows.json
├── tests/
│   └── acceptance.json
└── validation/
    └── pack-report.json
```