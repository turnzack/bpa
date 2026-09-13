// ==UserScript==
// @name         KIROV5 Forge - Injecteur de PRD
// @namespace    http://kirov5-forge.local
// @version      1.0.0
// @description  Injecte les PRD des modules KIROV5 Forge dans les conversations IA
// @author       KIROV5 Team
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const PRDS = {
        tmpl_kirov5_forge_core: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_core
Rôle : Orchestrateur Souverain de Génération de Projets IA
Fonctionnalités :
- Routage de commandes vers les agents IA (DeepSeek, etc.)
- Correction structurelle automatique des artefacts (fichiers .txt → .tsx/.ts/.css)
- Gestion de la file d'attente des tâches
- Logs d'orchestration en temps réel
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Moteur d'Orchestration Souverain

## Objectif
Orchestrer les agents IA pour générer des projets React/Vite complets, avec correction structurelle automatique.

## Fonctionnalités
- Dashboard temps réel avec état des agents
- File d'attente des tâches avec priorités
- Routage de commandes vers les modèles appropriés
- Correction automatique des artefacts (fichiers .txt → .tsx/.ts/.css)
- Logs détaillés de chaque étape

## Composants à générer
- OrchestratorDashboard.tsx
- AgentStatusCard.tsx
- TaskQueue.tsx
- CommandRouter.tsx
- useOrchestrator.ts

## Design Requis
- Dark mode glassmorphism
- Badges de statut animés
- Cartes avec bordure lumineuse
`,
        tmpl_kirov5_forge_engine: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_engine
Rôle : Moteur Headless Local (Port 5005)
Fonctionnalités :
- API REST pour commandes de génération
- WebSocket pour communication temps réel
- Gestion des processus
- Indicateurs de performance
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Moteur Headless Local

## Objectif
Fournir un moteur headless local pour exécuter des commandes de génération, avec API REST et WebSocket.

## Fonctionnalités
- API REST pour lancer/arrêter des générations
- WebSocket pour logs en direct
- Gestion des processus (démarrage, arrêt, redémarrage)
- Indicateurs de performance (CPU, mémoire)

## Composants à générer
- EngineControlPanel.tsx
- EngineStatusBadge.tsx
- ProcessMonitor.tsx
- useEngine.ts

## Design Requis
- Interface de contrôle avec boutons start/stop
- Logs en direct avec coloration syntaxique
- Graphiques de performance
`,
        tmpl_kirov5_forge_artifact: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_artifact
Rôle : Correcteur d'Artefacts Structurels
Fonctionnalités :
- Correction automatique des fichiers .txt vers .tsx/.ts/.css
- Normalisation des chemins
- Application de correctifs React connus
- Historique des corrections
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Correcteur d'Artefacts Structurels

## Objectif
Corriger automatiquement les artefacts de génération (fichiers .txt → .tsx/.ts/.css), normaliser les chemins, et appliquer des correctifs React connus.

## Fonctionnalités
- Détection des fichiers .txt et conversion en extensions correctes
- Normalisation des chemins (ex: src/main.txt → src/main.tsx)
- Application de correctifs React (ex: ajout d'imports manquants)
- Historique des corrections avec possibilité d'annulation

## Composants à générer
- ArtifactCorrector.tsx
- CorrectionHistory.tsx
- PathNormalizer.tsx
- useArtifactCorrection.ts

## Design Requis
- Liste des corrections avec statut (appliquée/échouée)
- Bouton pour annuler une correction
- Règles de correction configurables
`,
        tmpl_kirov5_forge_pack: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_pack
Rôle : Pack Builder & Registry
Fonctionnalités :
- Construction de packs de génération (PRD, prompts, règles de chemins)
- Enregistrement dans un registre
- Recherche et réutilisation
- Gestion des versions
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Pack Builder & Registry

## Objectif
Construire des packs de génération de code (PRD, prompts, règles de chemins) et les enregistrer dans un registre pour réutilisation.

## Fonctionnalités
- Éditeur de packs avec champs pour PRD, prompts, règles de chemins
- Registre de packs avec recherche par nom/tag
- Gestion des versions (créer, modifier, supprimer)
- Export/Import de packs

## Composants à générer
- PackBuilder.tsx
- PackRegistry.tsx
- PackEditor.tsx
- usePackBuilder.ts

## Design Requis
- Formulaire avec validation
- Liste des packs avec recherche
- Badges de version
`,
        tmpl_kirov5_forge_validation: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_validation
Rôle : Validation de Code en Temps Réel
Fonctionnalités :
- Linting (ESLint)
- Vérification TypeScript
- Tests unitaires
- Indicateurs de qualité
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Validation de Code en Temps Réel

## Objectif
Valider le code généré en temps réel (linting, TypeScript, tests unitaires) et fournir des retours immédiats.

## Fonctionnalités
- Exécution de ESLint sur les fichiers générés
- Vérification TypeScript (tsc --noEmit)
- Exécution de tests unitaires (Vitest)
- Affichage des erreurs/warnings avec suggestions
- Indicateur de qualité global

## Composants à générer
- ValidationPanel.tsx
- ErrorList.tsx
- QualityGauge.tsx
- useCodeValidation.ts

## Design Requis
- Panneau avec liste d'erreurs/warnings
- Jauge de qualité avec couleur (vert/jaune/rouge)
- Bouton pour relancer la validation
`,
        tmpl_kirov5_forge_git: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_git
Rôle : Intégration Git & Versioning
Fonctionnalités :
- Initialisation de dépôt Git
- Commits automatiques
- Gestion des branches
- Push vers GitHub
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Intégration Git & Versioning

## Objectif
Intégrer Git pour versionner les projets générés, avec commits automatiques, branches, et push vers GitHub.

## Fonctionnalités
- Initialisation d'un dépôt Git dans le projet généré
- Commits automatiques après chaque génération
- Gestion des branches (créer, fusionner, supprimer)
- Push vers un dépôt distant (GitHub)

## Composants à générer
- GitPanel.tsx
- CommitHistory.tsx
- BranchManager.tsx
- useGitIntegration.ts

## Design Requis
- Historique des commits avec graphique
- Sélecteur de branche
- Boutons pour commit/push
`,
        tmpl_kirov5_forge_visualizer: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_visualizer
Rôle : Visualisation de l'Arborescence Générée
Fonctionnalités :
- Affichage de l'arborescence des fichiers
- Aperçu des fichiers
- Recherche
- Navigation
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Visualisation de l'Arborescence Générée

## Objectif
Afficher l'arborescence des fichiers générés en temps réel, avec aperçu des fichiers et navigation.

## Fonctionnalités
- Arborescence interactive avec icônes par type de fichier
- Aperçu du contenu dans un panneau latéral
- Recherche de fichiers par nom
- Navigation entre les dossiers

## Composants à générer
- FileTree.tsx
- FilePreview.tsx
- TreeSearch.tsx
- useFileTree.ts

## Design Requis
- Arborescence avec indentation et icônes
- Panneau d'aperçu avec coloration syntaxique
- Champ de recherche avec autocomplétion
`,
        tmpl_kirov5_forge_multiagent: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_multiagent
Rôle : Support Multi-Modèles IA
Fonctionnalités :
- Gestion de plusieurs agents IA (DeepSeek, OpenAI, etc.)
- Bascule dynamique
- Comparaison de résultats
- Routage intelligent
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Support Multi-Modèles IA

## Objectif
Gérer plusieurs agents IA (DeepSeek, OpenAI, etc.) avec bascule dynamique, comparaison de résultats, et routage intelligent.

## Fonctionnalités
- Sélecteur de modèles avec liste des disponibles
- Bascule dynamique entre modèles en cours de génération
- Comparaison côte à côte des résultats de différents modèles
- Routage intelligent basé sur la complexité de la tâche

## Composants à générer
- ModelSelector.tsx
- ModelComparison.tsx
- PerformanceMetrics.tsx
- useMultiAgent.ts

## Design Requis
- Menu déroulant avec logos des modèles
- Panneau de comparaison avec scores
- Graphiques de performance
`,
        tmpl_kirov5_forge_automation: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_automation
Rôle : Automatisation & Pipeline de Tests
Fonctionnalités :
- Configuration de pipelines de tests
- Exécution automatisée
- Rapports de tests
- Intégration dans le flux de génération
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Automatisation & Pipeline de Tests

## Objectif
Automatiser les pipelines de tests (unitaires, intégration, E2E) et les intégrer dans le flux de génération.

## Fonctionnalités
- Configuration de pipelines avec étapes (lint, test, build)
- Exécution automatisée après chaque génération
- Rapports de tests détaillés avec taux de réussite
- Intégration avec les hooks de génération

## Composants à générer
- PipelineConfigurator.tsx
- TestRunner.tsx
- TestReport.tsx
- useAutomation.ts

## Design Requis
- Éditeur de pipeline avec drag-and-drop
- Barre de progression d'exécution
- Rapports avec graphiques
`,
        tmpl_kirov5_forge_ui: `
[CONTEXTE CACHÉ]
Module : tmpl_kirov5_forge_ui
Rôle : Interface Utilisateur Souveraine
Fonctionnalités :
- Popup pour l'extension Chrome
- Panneau flottant
- Dashboard principal
- Design system glassmorphism
[FIN DU CONTEXTE CACHÉ]

PRD :
# PRD - Interface Utilisateur Souveraine

## Objectif
Fournir une interface utilisateur complète pour l'extension Chrome, avec popup, panneau flottant, et dashboard.

## Fonctionnalités
- Popup avec accès rapide aux commandes
- Panneau flottant pour surveiller les générations
- Dashboard principal avec navigation entre les modules
- Design system glassmorphism avec dark mode

## Composants à générer
- Popup.tsx
- FloatingPanel.tsx
- Dashboard.tsx
- ThemeProvider.tsx
- useTheme.ts

## Design Requis
- Thème sombre avec effets de verre dépoli
- Accents cyan/violet
- Typographie Inter et JetBrains Mono
`
    };

    function injectText(text) {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT' || activeEl.isContentEditable)) {
            const start = activeEl.selectionStart || 0;
            const end = activeEl.selectionEnd || 0;
            const value = activeEl.value || '';
            const newValue = value.substring(0, start) + text + value.substring(end);
            activeEl.value = newValue;
            activeEl.selectionStart = activeEl.selectionEnd = start + text.length;
            activeEl.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Texte copié dans le presse-papiers !');
        }
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'kirov5-forge-menu';
        menu.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:rgba(0,0,0,0.8);border:1px solid #00ffff;border-radius:8px;padding:10px;font-family:monospace;color:#fff;';
        menu.innerHTML = '<strong style="display:block;margin-bottom:8px;">⚡ KIROV5 Forge</strong>';
        Object.keys(PRDS).forEach(key => {
            const btn = document.createElement('button');
            btn.textContent = key.replace('tmpl_kirov5_forge_', '').toUpperCase();
            btn.style.cssText = 'display:block;width:100%;margin:4px 0;padding:4px;background:#1a1a1a;border:1px solid #00ffff;color:#00ffff;cursor:pointer;border-radius:4px;';
            btn.onclick = () => injectText(PRDS[key]);
            menu.appendChild(btn);
        });
        document.body.appendChild(menu);
    }

    setTimeout(createMenu, 3000);
})();