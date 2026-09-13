'use strict';
/**
 * MobileDocGenerator — Sprint 5
 * Génère la documentation technique d'un projet Expo depuis sa StitchSpec + job.
 */

/**
 * Génère le README complet du projet.
 * @param {object} job   MobileJob
 * @param {object} spec  StitchSpec
 * @param {string[]} files  Liste des fichiers scaffoldés
 * @returns {string}
 */
function generateReadme(job, spec, files = []) {
  const routes = (spec.screens || [])
    .map(s => `| \`${s.route}\` | ${s.title} | ${s.elements?.length || 0} éléments |`)
    .join('\n');

  const components = files
    .filter(f => f.includes('design-system/') || f.includes('components/'))
    .map(f => `- \`${f}\``)
    .join('\n');

  const featuresList = (spec.features || []).map(f => `- ${f}`).join('\n') || '- Navigation de base';

  return `# ${spec.projectName}

> Projet Expo React Native généré par **Tiger IA — Moteur Souverain**
> Job ID : \`${job.id}\` | Généré le : ${new Date().toLocaleDateString('fr-FR')}

---

## 🚀 Installation rapide

\`\`\`bash
pnpm install
npx expo start
\`\`\`

Scan le QR code avec **Expo Go** (iOS/Android) ou appuie sur \`a\` pour Android / \`i\` pour iOS.

---

## 📱 Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Expo | ~51.0 | Runtime natif |
| Expo Router | ~3.5 | Navigation fichiers |
| TypeScript | ^5.3 | Typage strict |
| NativeWind | ^4.0 | Tailwind → RN |
| Zustand | ^4.5 | State management |
| TanStack Query | ^5.0 | Data fetching |
| @expo/vector-icons | ^14.0 | Icônes Ionicons |

---

## 🗺️ Routes (Expo Router)

| Route | Écran | Éléments |
|-------|-------|----------|
${routes}

---

## 🎨 Design Tokens

\`\`\`typescript
export const Colors = {
  primary:    '${spec.designTokens?.primary || '#2563EB'}',
  secondary:  '${spec.designTokens?.secondary || '#7C3AED'}',
  background: '${spec.designTokens?.background || '#FFFFFF'}',
  surface:    '${spec.designTokens?.surface || '#F8FAFC'}',
  text:       '${spec.designTokens?.text || '#0F172A'}',
  textMuted:  '${spec.designTokens?.textMuted || '#64748B'}',
};
\`\`\`

Font : **${spec.designTokens?.fontFamily || 'Inter'}** | Border Radius : **${spec.designTokens?.borderRadius || '12px'}**

---

## 🧩 Composants Design System

${components || '- Voir `src/design-system/`'}

---

## ⚙️ Features implémentées

${featuresList}

---

## 🗂️ Structure du projet

\`\`\`
${spec.projectName}/
├── app/                  ← Expo Router (routes)
│   ├── _layout.tsx       ← Layout racine (Tabs/Stack)
│   └── index.tsx         ← Écran Home
├── src/
│   ├── design-system/    ← Composants natifs réutilisables
│   ├── stores/           ← Zustand stores
│   ├── services/         ← API client
│   ├── hooks/            ← Hooks personnalisés
│   └── types/            ← Types TypeScript
├── assets/
├── app.json
├── package.json
└── tailwind.config.js
\`\`\`

---

## 🔧 Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| Démarrer | \`npx expo start\` | Lance le bundler Metro |
| Android | \`npx expo start --android\` | Lance sur émulateur Android |
| iOS | \`npx expo start --ios\` | Lance sur simulateur iOS |
| Type-check | \`pnpm type-check\` | Vérifie TypeScript |
| Lint | \`pnpm lint\` | ESLint |

---

## 🌐 Variables d'environnement

\`\`\`env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=${spec.projectName}
\`\`\`

---

*Généré automatiquement par Tiger IA — Moteur Souverain v5 (Sprint 5)*
`;
}

/**
 * Génère le fichier ARCHITECTURE.md du projet.
 */
function generateArchitecture(job, spec) {
  const screens = (spec.screens || [])
    .map(s => `  ${s.name}[${s.title}] --> ${s.route === '/' ? 'index' : s.name}Screen`)
    .join('\n');

  return `# Architecture — ${spec.projectName}

## Vue d'ensemble

\`\`\`mermaid
graph TD
  App[_layout.tsx] --> ${spec.navigation?.hasBottomBar ? 'Tabs' : 'Stack'}
${screens}
\`\`\`

## Navigation

- **Type** : ${spec.navigation?.type || 'stack'}
- **Bottom Tabs** : ${spec.navigation?.hasBottomBar ? '✅' : '❌'}
- **Drawer** : ${spec.navigation?.hasDrawer ? '✅' : '❌'}
- **Auth** : ${spec.navigation?.hasAuth ? '✅' : '❌'}

## State Management (Zustand)

\`\`\`typescript
// src/stores/useAppStore.ts
const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
\`\`\`

## Règles CTO (non négociables)

- ❌ Aucun \`<WebView>\`
- ❌ Aucun \`dangerouslySetInnerHTML\`
- ❌ Aucune balise HTML (\`<div>\`, \`<span>\`…)
- ✅ Uniquement \`View\`, \`Text\`, \`Pressable\`, \`ScrollView\`, \`Image\`
- ✅ NativeWind pour le style (\`className\`)
- ✅ Expo Router pour la navigation

---
*Tiger IA — Sprint 5*
`;
}

/**
 * Génère le fichier CHANGELOG.md à partir de la mémoire du job.
 */
function generateChangelog(job, memoryEntries = []) {
  const lines = memoryEntries
    .slice(-30)
    .map(e => `- **[${e.type}]** ${new Date(e.at).toLocaleString('fr-FR')} — ${JSON.stringify(e.payload).slice(0, 120)}`)
    .join('\n');

  return `# Changelog — ${job.projectName}

Généré le ${new Date().toLocaleDateString('fr-FR')}.

## Événements du projet

${lines || '- Aucun événement enregistré.'}

---
*Tiger IA — Sprint 5*
`;
}

module.exports = { generateReadme, generateArchitecture, generateChangelog };
