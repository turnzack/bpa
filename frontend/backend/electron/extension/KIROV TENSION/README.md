# KIROV3 Orchestrator v16 — Elite Forge

Extension Chrome **Manifest V3** qui fusionne :

- **GLOBAL_KIROV3 v15** → injection prompt + Smart Capture v2 dans le chat web
- **LLM Orchestrator** → pipeline 4 couches, gatekeeper, multi-provider API
- **KIROV3 HYBRID / QOD** → auto-detect modèles, UI multi-onglets

## Principe gravé dans le marbre

> **L'extension = orchestrateur.**  
> **Le LLM (DeepSeek / Gemini / ChatGPT…) = exécuteur contrôlé.**  
> Il ne lit que le document autorisé au bon moment.

## Pipeline 4 couches

1. **Intake** — nom + descriptif + dossier cible (boîte de dialogue)
2. **Pack d'instructions** — dossier virtuel (pochette surprise) en `chrome.storage`
3. **Blind-bag** — un seul document révélé par étape
4. **Orchestration** — commande → injection/API → capture → validation → disque

### Étapes

| # | Document / action |
|---|-------------------|
| 0 | `00_PROJECT_META.md` |
| 1 | `01_PRD.md` |
| 2 | `02_ARCHITECTURE.md` |
| 3 | `03_SKILLS.yaml` |
| 4 | `04_TASKS.md` |
| 5 | `05_FILE_TREE.md` |
| 6 | `06_PROMPT_WORKFLOW.md` |
| 7 | `07_VALIDATION_RULES.md` |
| 8 | `08_ORDERS.md` |
| 9 | Génération code (`{"files":[...]}`) |
| 10 | Écriture disque → `Downloads/<dossier>/` |

## Modes d'exécution

| Mode | Comportement |
|------|----------------|
| **Chat Web** | Injection dans DeepSeek/Gemini/ChatGPT/Kimi/Perplexity + capture DOM |
| **API Directe** | Appels API (clé) DeepSeek / OpenAI / Claude / Gemini / Mistral / Ollama |
| **Hybride** | Specs via API, codegen via chat web |

## Installation

1. Chrome → `chrome://extensions`
2. Activer **Mode développeur**
3. **Charger l'extension non empaquetée** → sélectionner ce dossier
4. Ouvrir l'icône KIROV3

## Utilisation rapide

1. ⚙ Choisir le mode (**Chat Web** recommandé pour DeepSeek)
2. Choisir l'assistant web (DeepSeek, Gemini…)
3. Saisir **nom** + **descriptif**
4. Cliquer **Créer & Lancer** → la boîte de dialogue dossier s'ouvre
5. Confirmer le dossier cible
6. **Tout exécuter** (ou étape par étape)
7. Les fichiers arrivent dans `Downloads/<votre_dossier>/`

### Mode API

1. ⚙ → Fournisseur + clé → **Enregistrer + Détecter**
2. Le menu **Modèle** se remplit automatiquement (ex. `gemini-2.5-flash`)
3. Mode **API Directe** ou **Hybride**

## Structure

```
webapp/
├── manifest.json
├── background.js          # service worker + hub messages
├── content.js             # inject + Smart Capture (pages chat)
├── popup.html / .css / .js
├── icons/
└── lib/
    ├── constants.js
    ├── pack-builder.js    # génère le pack virtuel
    ├── pack-registry.js   # stockage blind-bag
    ├── gatekeeper.js      # contrôle d'accès documents
    ├── command-router.js  # multi-provider + auto-detect
    ├── artifact-writer.js # écriture Downloads
    └── orchestrator.js    # boucle pipeline
```

## Fonctionnalités rapatriées

- ✅ Injection prompt (textarea React / contenteditable / paste)
- ✅ Smart Capture v2 (stabilité, drop, JSON équilibré, cooldown)
- ✅ Multi-plateforme chat (DeepSeek, Gemini, ChatGPT, Kimi, Perplexity)
- ✅ Multi-provider API + auto-detect modèles à l'enregistrement de la clé
- ✅ Boîte de dialogue dossier à la création de projet
- ✅ Écriture synchronisée sur disque (`chrome.downloads`)
- ✅ Gatekeeper : accès non autorisé → erreur + retry
- ✅ HUD overlay sur la page chat pendant injection/capture

## Notes

- Les fichiers sont écrits via l'API Downloads Chrome (sous-dossier de Téléchargements). Chrome ne permet pas d'écrire un chemin absolu arbitraire sans File System Access API côté page privilégiée ; le modal de dossier fixe le **nom** du sous-dossier.
- Pour Gemma local : `ollama serve` + `ollama pull gemma2`.
- Rechargez l'onglet chat après installation de l'extension.

## Version

**16.0.0** — Fusion GLOBAL_KIROV3 + Orchestrator + Hybrid QOD
