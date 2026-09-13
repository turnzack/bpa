# KIROV5 Orchestrator — Elite Forge v5.1.1

Extension Chrome **Manifest V3** — fusion v16 + KIROV4, avec correctif structure React.

## Correctif v5.1.1 (critique)

### Problème corrigé
Lors de la phase **code + écriture disque**, tous les fichiers finissaient en `.txt` :
```
src/main.txt          ❌
src/hooks/useGame.ts  → useGameLoop.txt  ❌
vite.config.txt       ❌
01_PRD.txt            ❌
```
au lieu d'une vraie arborescence React/Vite :
```
index.html
package.json
vite.config.ts
src/main.tsx
src/App.tsx
src/index.css
src/components/*.tsx
src/hooks/*.ts
src/store/*.ts
src/types/*.ts
src/utils/*.ts
```

### Causes racines
1. **MIME `text/plain`** sur tous les téléchargements → Chrome force l'extension `.txt`
2. **Parsing codegen fragile** → `codeFiles` vide → pas de structure React
3. **Artefacts specs stockés en JSON envelope** `{"status":"ok","content":"..."}` au lieu du markdown réel
4. **Pas de normalisation** des chemins `.txt` / sans extension vers `.tsx/.ts/.css`

### Correctifs appliqués
| Fichier | Fix |
|---------|-----|
| `lib/artifact-writer.js` | MIME par extension, `normalizePath`, `parseCodeFiles` robuste, unwrap artefacts |
| `lib/orchestrator.js` | unwrap specs, fallback capture, `applyKnownFixes` React |
| `lib/command-router.js` | unwrap JSON nested, prompts chemins React |
| `lib/pack-builder.js` | codegen prompt avec règles de chemins strictes |
| `content.js` | parse/fix extensions React (plus de `.txt`) |
| `lib/constants.js` | SILENCE_ABSOLU + règles chemins |

## Installation

1. Chrome → `chrome://extensions`
2. Activer **Mode développeur**
3. **Charger l'extension non empaquetée** → sélectionner le dossier `kirov5/`
4. Si une ancienne version est chargée : **Recharger** (icône ↻) puis recharger les onglets IA (DeepSeek, etc.)

## Résultat attendu après codegen

```
Downloads/<projet>/
├── 00_PROJECT_META.md
├── 01_PRD.md
├── ...
├── 08_ORDERS.md
├── state.json
├── README.md
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── components/
    ├── hooks/
    ├── store/
    ├── types/
    └── utils/
```

Puis :
```bash
cd Downloads/<projet>
npm install
npm run dev
```

## Récupérer un ancien projet déjà écrit en .txt

Un script de récupération est fourni : `tools/recover-txt-project.cjs`

```bash
node tools/recover-txt-project.cjs /chemin/vers/bn /chemin/vers/bn-react
```

Il renomme `src/main.txt` → `src/main.tsx`, etc., selon le contenu et le dossier.

## Pipeline 4 couches

| # | Document / action |
|---|-------------------|
| 0–8 | Specs (`00_PROJECT_META.md` … `08_ORDERS.md`) |
| 9 | Génération code (`{"files":[{"path":"src/App.tsx",...}]}`) |
| 10 | Écriture disque → `Downloads/<dossier>/` avec **vraies extensions** |

## Modes d'exécution

| Mode | Comportement |
|------|----------------|
| **Chat Web** | Injection DeepSeek/Gemini/ChatGPT/Kimi/Perplexity/Claude + capture DOM |
| **API Directe** | Appels API (clé) DeepSeek / OpenAI / Claude / Gemini / Mistral / Ollama |
| **Hybride** | Specs via API, codegen via chat web |

## Structure

```
kirov5/
├── manifest.json
├── background.js
├── content.js
├── popup.html / .css / .js
├── icons/
├── tools/
│   └── recover-txt-project.cjs
└── lib/
    ├── constants.js
    ├── pack-builder.js
    ├── pack-registry.js
    ├── gatekeeper.js
    ├── command-router.js
    ├── artifact-writer.js   ← FIX principal
    ├── orchestrator.js
    ├── bridge_polling.js
    └── github_pusher.js
```

## Version

**5.1.1** — Fix structure hiérarchique React (extensions .tsx/.ts/.css/.json préservées à l'écriture disque)
