'use strict';
/**
 * StitchParser — Sprint 2
 * Transforme un fichier HTML Stitch en StitchSpec JSON exploitable par Hermes.
 * Zéro dépendance externe — utilise uniquement les regex et le DOM natif Node 18+.
 * Règle : Les maquettes HTML ne sont jamais le runtime. Elles ne servent qu'à
 * produire une spécification UI structurée pour Expo React Native.
 */

// =============================================================================
// TYPES (JSDoc pour intellisense)
// =============================================================================
/**
 * @typedef {{ type:string, text?:string, src?:string, href?:string,
 *             placeholder?:string, items?:string[], style?:object,
 *             children?:UIElement[] }} UIElement
 * @typedef {{ name:string, title:string, route:string,
 *             elements:UIElement[], actions:string[] }} Screen
 * @typedef {{ primary:string, secondary:string, background:string,
 *             surface:string, text:string, textMuted:string,
 *             error:string, success:string,
 *             fontFamily:string, borderRadius:string }} DesignTokens
 * @typedef {{ projectType:'react-native-expo', projectName:string,
 *             screens:Screen[], designTokens:DesignTokens,
 *             navigation:object, features:string[],
 *             rawMeta:object }} StitchSpec
 */

// =============================================================================
// HELPERS REGEX
// =============================================================================

/** Extrait tous les blocs qui matchent un pattern. */
function matchAll(html, regex) {
  const results = [];
  let m;
  const r = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
  while ((m = r.exec(html)) !== null) results.push(m);
  return results;
}

/** Extrait le contenu texte brut d'un nœud HTML (sans balises). */
function stripTags(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Extrait la valeur d'un attribut HTML. */
function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']*?)["']`, 'i'));
  return m ? m[1].trim() : null;
}

/** Normalise un texte en nom de route Expo Router. */
function toRoute(text) {
  return (text || 'screen')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'screen';
}

/** Extrait les couleurs CSS (#hex, rgb, hsl) d'une chaîne. */
function extractColors(css) {
  const hexes  = [...(css.matchAll(/#([0-9a-fA-F]{3,8})\b/g) || [])].map(m => '#' + m[1]);
  const vars   = [...(css.matchAll(/--[\w-]+:\s*(#[0-9a-fA-F]{3,8})/g) || [])].map(m => m[1]);
  return [...new Set([...vars, ...hexes])];
}

// =============================================================================
// EXTRACTION DES DESIGN TOKENS
// =============================================================================

function parseDesignTokens(html) {
  const tokens = {
    primary:      '#2563EB',
    secondary:    '#7C3AED',
    background:   '#FFFFFF',
    surface:      '#F8FAFC',
    text:         '#0F172A',
    textMuted:    '#64748B',
    error:        '#EF4444',
    success:      '#22C55E',
    fontFamily:   'Inter',
    borderRadius: '12px',
  };

  // --- CSS Variables ---
  const styleBlock = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [])[1] || '';

  const varMap = {
    '--primary':     'primary',
    '--secondary':   'secondary',
    '--background':  'background',
    '--bg':          'background',
    '--surface':     'surface',
    '--foreground':  'text',
    '--text':        'text',
    '--muted':       'textMuted',
    '--error':       'error',
    '--success':     'success',
    '--destructive': 'error',
  };

  for (const [cssVar, token] of Object.entries(varMap)) {
    const m = styleBlock.match(new RegExp(`${cssVar}[^:]*:\\s*(#[0-9a-fA-F]{3,8}|rgb[^;]+|hsl[^;]+)`, 'i'));
    if (m) tokens[token] = m[1].trim();
  }

  // --- Couleurs Tailwind inline (heuristique) ---
  const bgPrimary = html.match(/bg-\[?(#[0-9a-fA-F]{3,8})\]?/);
  if (bgPrimary && tokens.primary === '#2563EB') tokens.primary = bgPrimary[1];

  // --- Font-family ---
  const fontMatch = styleBlock.match(/font-family\s*:\s*['"]?([\w\s]+?)['"]?\s*[,;]/i);
  if (fontMatch) tokens.fontFamily = fontMatch[1].trim().split(',')[0].replace(/['"]/g, '');

  // --- Border-radius ---
  const radMatch = styleBlock.match(/--radius\s*:\s*([\d.]+(?:px|rem|em))/i);
  if (radMatch) tokens.borderRadius = radMatch[1];

  return tokens;
}

// =============================================================================
// EXTRACTION DES ÉLÉMENTS UI
// =============================================================================

function parseElements(sectionHtml) {
  const elements = [];

  // Headings h1-h4
  for (const m of matchAll(sectionHtml, /<h([1-4])[^>]*>([\s\S]*?)<\/h[1-4]>/i)) {
    const text = stripTags(m[2]);
    if (text) elements.push({ type: 'heading', level: parseInt(m[1]), text });
  }

  // Paragraphes
  for (const m of matchAll(sectionHtml, /<p[^>]*>([\s\S]*?)<\/p>/i)) {
    const text = stripTags(m[1]);
    if (text && text.length > 1) elements.push({ type: 'text', text });
  }

  // Boutons
  for (const m of matchAll(sectionHtml, /<button[^>]*>([\s\S]*?)<\/button>/i)) {
    const text = stripTags(m[1]);
    const cls  = attr(m[0], 'class') || '';
    const variant = cls.includes('outline') ? 'outline'
                  : cls.includes('ghost')   ? 'ghost'
                  : cls.includes('danger') || cls.includes('destructive') ? 'destructive'
                  : 'primary';
    if (text) elements.push({ type: 'button', text, variant });
  }

  // Liens <a>
  for (const m of matchAll(sectionHtml, /<a[^>]*href=["']([^"']*?)["'][^>]*>([\s\S]*?)<\/a>/i)) {
    const text = stripTags(m[2]);
    const href = m[1];
    if (text && !text.match(/^\s*$/)) elements.push({ type: 'link', text, href });
  }

  // Inputs
  for (const m of matchAll(sectionHtml, /<input[^>]*>/i)) {
    const tag         = m[0];
    const type        = attr(tag, 'type') || 'text';
    const placeholder = attr(tag, 'placeholder') || '';
    const name        = attr(tag, 'name') || attr(tag, 'id') || type;
    if (type !== 'hidden' && type !== 'submit') {
      elements.push({ type: 'input', inputType: type, placeholder, name });
    }
  }

  // Textarea
  for (const m of matchAll(sectionHtml, /<textarea[^>]*>([\s\S]*?)<\/textarea>/i)) {
    const placeholder = attr(m[0], 'placeholder') || '';
    elements.push({ type: 'textarea', placeholder });
  }

  // Images
  for (const m of matchAll(sectionHtml, /<img[^>]*>/i)) {
    const src = attr(m[0], 'src') || '';
    const alt = attr(m[0], 'alt') || '';
    elements.push({ type: 'image', src, alt });
  }

  // Listes <ul><li>
  const listMatch = sectionHtml.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (listMatch) {
    const items = matchAll(listMatch[1], /<li[^>]*>([\s\S]*?)<\/li>/i)
      .map(m => stripTags(m[1]))
      .filter(Boolean);
    if (items.length) elements.push({ type: 'list', items });
  }

  // Cards (divs avec classe card/item/product)
  const cardMatches = matchAll(sectionHtml, /<div[^>]*class=["'][^"']*(?:card|item|product|tile)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  for (const m of cardMatches.slice(0, 6)) {
    const inner = stripTags(m[1]).slice(0, 100);
    if (inner) elements.push({ type: 'card', preview: inner });
  }

  // Formulaires
  if (sectionHtml.match(/<form[^>]*>/i)) {
    elements.push({ type: 'form', hasForm: true });
  }

  return elements;
}

// =============================================================================
// EXTRACTION DES ÉCRANS
// =============================================================================

function parseScreens(html, projectName) {
  const screens = [];
  const seen    = new Set();

  // Stratégie 1 : sections sémantiques HTML5
  const sectionPatterns = [
    /<section[^>]*(?:id|class)=["']([^"']*?)["'][^>]*>([\s\S]*?)<\/section>/gi,
    /<main[^>]*>([\s\S]*?)<\/main>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/gi,
  ];

  for (const m of matchAll(html, /<section[^>]*>([\s\S]*?)<\/section>/i)) {
    const id    = attr(m[0], 'id') || attr(m[0], 'class') || '';
    const inner = m[1];
    const h     = inner.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    const title = h ? stripTags(h[1]) : (id ? id.replace(/[-_]/g, ' ') : `Écran ${screens.length + 1}`);
    const name  = toRoute(title);

    if (!seen.has(name) && title.length < 60) {
      seen.add(name);
      screens.push({
        name,
        title,
        route:    screens.length === 0 ? '/' : `/${name}`,
        elements: parseElements(inner),
        actions:  detectActions(inner),
      });
    }
  }

  // Stratégie 2 : Tabs / navigation visible
  if (screens.length === 0) {
    const tabMatches = matchAll(html,
      /<(?:li|button|a)[^>]*(?:tab|nav|menu)[^>]*>([\s\S]*?)<\/(?:li|button|a)>/i
    );
    for (const m of tabMatches) {
      const text = stripTags(m[1]);
      const name = toRoute(text);
      if (text && !seen.has(name) && text.length < 40) {
        seen.add(name);
        screens.push({
          name,
          title:    text,
          route:    screens.length === 0 ? '/' : `/${name}`,
          elements: [],
          actions:  [],
        });
      }
    }
  }

  // Stratégie 3 : Divs principaux avec ID significatif
  if (screens.length === 0) {
    for (const m of matchAll(html, /<div[^>]*id=["']([a-z][^"']*?)["'][^>]*>([\s\S]*?)<\/div>/i)) {
      const id   = m[1];
      const name = toRoute(id);
      if (!seen.has(name) && !['root','app','wrapper','container','main'].includes(name)) {
        seen.add(name);
        screens.push({
          name,
          title:    id.replace(/[-_]/g, ' '),
          route:    screens.length === 0 ? '/' : `/${name}`,
          elements: parseElements(m[2]),
          actions:  detectActions(m[2]),
        });
      }
    }
  }

  // Fallback : au moins un écran Home
  if (screens.length === 0) {
    screens.push({
      name:     'home',
      title:    projectName || 'Accueil',
      route:    '/',
      elements: parseElements(html),
      actions:  detectActions(html),
    });
  }

  return screens.slice(0, 15); // max 15 écrans
}

// =============================================================================
// DÉTECTION DES ACTIONS / FEATURES
// =============================================================================

function detectActions(html) {
  const actions = [];
  if (html.match(/<form/i))                              actions.push('form');
  if (html.match(/login|signin|connexion/i))             actions.push('auth');
  if (html.match(/search|recherche/i))                   actions.push('search');
  if (html.match(/cart|panier|basket/i))                 actions.push('cart');
  if (html.match(/upload|dropzone/i))                    actions.push('upload');
  if (html.match(/map|carte|leaflet/i))                  actions.push('map');
  if (html.match(/chart|graph|recharts/i))               actions.push('charts');
  if (html.match(/modal|dialog|overlay/i))               actions.push('modal');
  if (html.match(/notification|toast|alert/i))           actions.push('notifications');
  if (html.match(/camera|qr|barcode/i))                  actions.push('camera');
  return [...new Set(actions)];
}

function detectFeatures(html, screens) {
  const features = new Set();
  for (const screen of screens) {
    for (const a of screen.actions) features.add(a);
  }
  if (html.match(/localStorage|sessionStorage/i)) features.add('persistence');
  if (html.match(/fetch|axios|api/i))             features.add('api');
  if (html.match(/socket|websocket|ws:/i))        features.add('realtime');
  if (html.match(/i18n|locale|translation/i))     features.add('i18n');
  return [...features];
}

// =============================================================================
// DÉTECTION DE LA NAVIGATION
// =============================================================================

function parseNavigation(html, screens) {
  const nav = {
    type: 'stack',
    tabs: [],
    hasBottomBar:   false,
    hasDrawer:      false,
    hasTopBar:      true,
    hasAuth:        false,
    hasOnboarding:  false,
  };

  // Détection bottom tabs
  const bottomBar = html.match(/<(?:nav|div)[^>]*(?:bottom|tab-bar|navbar)[^>]*>/i);
  if (bottomBar) {
    nav.hasBottomBar = true;
    nav.type = 'tabs';
  }

  // Détection drawer / burger menu
  if (html.match(/drawer|hamburger|burger-menu|sidebar/i)) {
    nav.hasDrawer = true;
    nav.type = nav.type === 'tabs' ? 'tabs+drawer' : 'drawer';
  }

  // Détection auth
  if (screens.some(s => s.actions.includes('auth') || /login|register|signup/i.test(s.name))) {
    nav.hasAuth = true;
  }

  // Détection onboarding
  if (screens.some(s => /onboard|intro|welcome|splash/i.test(s.name))) {
    nav.hasOnboarding = true;
  }

  // Tabs depuis les screens
  nav.tabs = screens
    .filter(s => !['login', 'register', 'onboarding', 'splash'].includes(s.name))
    .slice(0, 5)
    .map(s => ({ name: s.name, title: s.title, route: s.route }));

  return nav;
}

// =============================================================================
// EXTRACTION DES META (title, description, favicon)
// =============================================================================

function parseMeta(html) {
  return {
    title:       (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim() || '',
    description: attr(
      (html.match(/<meta[^>]*name=["']description["'][^>]*>/i) || [''])[0], 'content'
    ) || '',
    charset: (html.match(/<meta[^>]*charset=["']?([^"'\s>]+)/i) || [])[1] || 'UTF-8',
    viewport: !!html.match(/name=["']viewport["']/i),
    links: matchAll(html, /<link[^>]*href=["']([^"']+)["'][^>]*>/i)
      .map(m => m[1])
      .filter(l => !l.startsWith('data:')),
  };
}

// =============================================================================
// POINT D'ENTRÉE PRINCIPAL
// =============================================================================

/**
 * Parse un HTML Stitch et retourne une StitchSpec JSON.
 * @param {string} html
 * @param {string} [projectName]
 * @returns {StitchSpec}
 */
function parse(html, projectName = 'MonApplication') {
  if (!html || typeof html !== 'string') {
    throw new Error('[StitchParser] html requis.');
  }

  const start = Date.now();

  const meta         = parseMeta(html);
  const resolvedName = projectName || meta.title || 'MonApplication';
  const tokens       = parseDesignTokens(html);
  const screens      = parseScreens(html, resolvedName);
  const navigation   = parseNavigation(html, screens);
  const features     = detectFeatures(html, screens);
  const colors       = extractColors(
    (html.match(/<style[^>]*>([\s\S]*?)<\/style>/i) || [])[1] || ''
  );

  /** @type {StitchSpec} */
  const spec = {
    projectType:  'react-native-expo',
    projectName:  resolvedName,
    version:      '1.0.0',
    screens,
    designTokens: tokens,
    navigation,
    features,
    stack: {
      framework:  'expo',
      router:     'expo-router',
      language:   'typescript',
      styling:    'nativewind',
      state:      'zustand',
      query:      '@tanstack/react-query',
      icons:      '@expo/vector-icons',
    },
    rawMeta: {
      ...meta,
      colorsDetected: colors,
      htmlLength:     html.length,
      screenCount:    screens.length,
      parseTimeMs:    Date.now() - start,
    },
  };

  return spec;
}

// =============================================================================
// GÉNÉRATION DU PROMPT HERMES ENRICHI
// =============================================================================

/**
 * Génère un prompt DeepSeek optimisé à partir d'une StitchSpec.
 * @param {StitchSpec} spec
 * @param {number} phase
 * @param {string} projectId
 * @returns {string}
 */
function buildPrompt(spec, phase = 5, projectId = '') {
  const screenList = spec.screens
    .map((s, i) => `  ${i + 1}. ${s.title} (route: ${s.route}) — ${s.elements.length} éléments, actions: [${s.actions.join(', ') || 'none'}]`)
    .join('\n');

  const tokensBlock = Object.entries(spec.designTokens)
    .map(([k, v]) => `  ${k}: "${v}"`)
    .join('\n');

  return `=================================================================
RÈGLE SYSTÈME ABSOLUE — NE PAS IGNORER
=================================================================
Tu génères un projet Expo React Native NATIF.
INTERDIT : WebView, dangerouslySetInnerHTML, HTML runtime, CSS navigateur, fichiers .html.
INTERDIT : Lignes "..." ou "// reste du code...".
REQUIS : Chemins relatifs uniquement (ex: src/app/index.tsx).
FORMAT DE SORTIE : JSON strict {"projectId":"...","phase":${phase},"status":"completed","files":[{"path":"...","content":"...","language":"typescript"}]}
=================================================================

=== SPEC PROJET ===
Nom        : ${spec.projectName}
Type       : ${spec.projectType}
Phase      : ${phase}
ProjectId  : ${projectId}

=== ÉCRANS (${spec.screens.length} écrans détectés) ===
${screenList}

=== DESIGN TOKENS ===
${tokensBlock}

=== NAVIGATION ===
Type           : ${spec.navigation.type}
Bottom Tabs    : ${spec.navigation.hasBottomBar}
Drawer         : ${spec.navigation.hasDrawer}
Auth           : ${spec.navigation.hasAuth}

=== STACK TECHNIQUE ===
- Expo Router (fichiers dans src/app/)
- TypeScript strict
- NativeWind (className sur View/Text/Pressable)
- Zustand (stores dans src/stores/)
- @tanstack/react-query (hooks dans src/hooks/)
- @expo/vector-icons (Ionicons)

=== FEATURES À IMPLÉMENTER ===
${spec.features.length ? spec.features.map(f => '- ' + f).join('\n') : '- navigation de base'}

=== PHASE ${phase} — INSTRUCTION ===
Génère les fichiers React Native pour la Phase ${phase}.
Chaque composant utilise View, Text, Pressable, ScrollView, TextInput, Image (NATIF).
JAMAIS de <div>, <span>, <p>, <a> HTML.
NativeWind : className="flex-1 bg-white" etc.
=================================================================`;
}

// =============================================================================
// VALIDATION POST-PARSE
// =============================================================================

/**
 * Valide une StitchSpec et retourne les warnings.
 * @param {StitchSpec} spec
 * @returns {{ valid:boolean, warnings:string[], errors:string[] }}
 */
function validate(spec) {
  const errors   = [];
  const warnings = [];

  if (!spec.projectName)         errors.push('projectName manquant');
  if (!spec.screens?.length)     errors.push('Aucun écran détecté');
  if (!spec.designTokens)        errors.push('designTokens manquant');

  if (spec.screens?.length > 12) warnings.push(`${spec.screens.length} écrans — considère limiter à 10`);

  const routes = spec.screens?.map(s => s.route) || [];
  const dups   = routes.filter((r, i) => routes.indexOf(r) !== i);
  if (dups.length) warnings.push(`Routes dupliquées : ${dups.join(', ')}`);

  const hasHome = spec.screens?.some(s => s.route === '/');
  if (!hasHome) warnings.push('Aucun écran route "/" (index) détecté');

  return { valid: errors.length === 0, warnings, errors };
}

module.exports = { parse, buildPrompt, validate };
