(function() {
  'use strict';

  const PRDS = {
    tmpl_nebula_calc_core: {
      title: 'Module Core - Moteur de Calcul',
      description: 'Implémente le moteur de calcul avec opérations de base, scientifiques et financières.',
      [CONTEXTE CACHÉ]: 'Le moteur doit supporter les opérations de base (+, -, *, /), les fonctions scientifiques (sin, cos, tan, log, sqrt, puissance), et les fonctions financières (intérêts, amortissement). Il doit gérer la précision (jusqu\'à 15 décimales) et les erreurs (division par zéro, racine négative).',
      [FIN DU CONTEXTE CACHÉ]: 'Génère les fichiers CalculatorEngine.ts, DisplayPanel.tsx, Keypad.tsx, ScientificPad.tsx avec des styles glassmorphiques.'
    },
    tmpl_nebula_calc_memory: {
      title: 'Module Mémoire Contextuelle',
      description: 'Gère la sauvegarde automatique des résultats et expressions avec possibilité de réutilisation.',
      [CONTEXTE CACHÉ]: 'La mémoire doit stocker les résultats avec un timestamp, permettre l\'épinglage des valeurs importantes, et offrir une recherche. Les données doivent être persistées dans localStorage.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère MemoryManager.ts, MemoryPanel.tsx, MemoryItem.tsx avec animations de glissement.'
    },
    tmpl_nebula_calc_converter: {
      title: 'Module Convertisseur Intelligent',
      description: 'Convertit les unités (devises, longueur, poids, temps) avec taux de change en temps réel.',
      [CONTEXTE CACHÉ]: 'Le convertisseur doit supporter les devises avec taux de change dynamiques (API), les unités métriques et impériales, et les conversions de temps. L\'interface doit être intuitive avec sélecteurs et résultats instantanés.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère ConverterEngine.ts, ConverterPanel.tsx, UnitSelector.tsx avec transitions fluides.'
    },
    tmpl_nebula_calc_history: {
      title: 'Module Historique Timeline',
      description: 'Affiche l\'historique des calculs sous forme de timeline interactive.',
      [CONTEXTE CACHÉ]: 'L\'historique doit être présenté comme une timeline verticale avec des points de repère, permettre la recherche par expression ou résultat, et offrir des filtres par date. Chaque entrée doit être cliquable pour réutiliser le résultat.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère HistoryStore.ts, TimelineView.tsx, HistoryFilter.tsx avec animations de défilement.'
    },
    tmpl_nebula_calc_visualization: {
      title: 'Module Visualisation de Données',
      description: 'Visualise les résultats sous forme de graphiques interactifs.',
      [CONTEXTE CACHÉ]: 'Le module doit permettre de tracer des fonctions mathématiques, afficher des statistiques (moyenne, écart-type) et des graphiques à barres. Utiliser Recharts pour les graphiques, avec zoom et pan.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère VisualizationEngine.ts, GraphView.tsx, ChartControls.tsx avec couleurs néon.'
    },
    tmpl_nebula_calc_theme: {
      title: 'Module Thème Glassmorphique',
      description: 'Gère le thème sombre avec effet de verre et personnalisation.',
      [CONTEXTE CACHÉ]: 'Le thème doit utiliser des dégradés de fond, des effets de flou (backdrop-filter), et des bordures semi-transparentes. Proposer plusieurs variantes de couleurs d\'accent.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère ThemeProvider.tsx, GlassCard.tsx, ThemeSwitcher.tsx avec animations de transition.'
    },
    tmpl_nebula_calc_ai: {
      title: 'Module Assistant IA',
      description: 'Fournit des suggestions intelligentes basées sur le contexte.',
      [CONTEXTE CACHÉ]: 'L\'assistant doit analyser les expressions saisies pour suggérer des formules, des conversions ou des raccourcis. Utiliser un modèle de langage léger (ex: TensorFlow.js) ou des règles heuristiques.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère AIAssistant.ts, SuggestionBar.tsx, ContextAnalyzer.ts avec animations de suggestion.'
    },
    tmpl_nebula_calc_export: {
      title: 'Module Exportation',
      description: 'Exporte les résultats et historiques en PDF, CSV, ou image.',
      [CONTEXTE CACHÉ]: 'L\'export doit générer des fichiers PDF avec mise en page propre, CSV pour les données, et PNG pour les graphiques. Proposer un aperçu avant export.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère ExportManager.ts, ExportMenu.tsx, ExportPreview.tsx avec notifications.'
    },
    tmpl_nebula_calc_shortcuts: {
      title: 'Module Raccourcis',
      description: 'Gère les raccourcis clavier et gestes tactiles.',
      [CONTEXTE CACHÉ]: 'Les raccourcis doivent inclure les opérations de base (Ctrl+C, Ctrl+V), les fonctions scientifiques (S pour sin), et les gestes (swipe pour effacer). Proposer une interface de configuration.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère ShortcutManager.ts, ShortcutSettings.tsx, GestureHandler.ts avec indicateurs visuels.'
    },
    tmpl_nebula_calc_settings: {
      title: 'Module Paramètres',
      description: 'Gère les préférences utilisateur.',
      [CONTEXTE CACHÉ]: 'Les paramètres doivent inclure la précision des calculs, la langue, les unités par défaut, et le thème. Sauvegarder automatiquement dans localStorage.',
      [FIN DU CONTEXTE CACHÉ]: 'Génère SettingsStore.ts, SettingsPage.tsx, SettingToggle.tsx avec design épuré.'
    }
  };

  function injectText(templateName) {
    const prd = PRDS[templateName];
    if (!prd) return;
    const text = `## ${prd.title}\n\n${prd.description}\n\n${prd[CONTEXTE CACHÉ]}\n\n${prd[FIN DU CONTEXTE CACHÉ]}`;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('PRD copié dans le presse-papiers !');
      });
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:rgba(0,0,0,0.8);color:white;padding:10px;border-radius:8px;font-family:sans-serif;';
    const title = document.createElement('div');
    title.textContent = 'NébulaCalc PRDs';
    title.style.fontWeight = 'bold';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = PRDS[key].title;
      btn.style.cssText = 'display:block;margin:5px 0;padding:5px;background:#333;color:white;border:none;border-radius:4px;cursor:pointer;';
      btn.onclick = () => injectText(key);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();