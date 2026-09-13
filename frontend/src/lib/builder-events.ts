/**
 * Événements UI universels d'OmniBuild (PRD « Événements UI universels »).
 *
 * Source de vérité partagée client/serveur :
 * - le panneau Propriétés du Builder UI (section « Actions & Workflows ») ;
 * - les boucliers du Générateur (src/lib/generator/validate.ts) ;
 * - le catalogue des nœuds (src/lib/workflow-nodes.ts) et l'API /api/workflows/catalog.
 *
 * Chaque événement correspond à un nœud déclencheur généré (trigger.ui.*) :
 * léger côté client (navigation, validation, affichage) ou serveur asynchrone
 * (données, paiements, intégrations — secrets et permissions jamais exposés).
 */

import type { BuilderEventType, BuilderType } from "@/components/studio/types";

export interface BuilderEventSpec {
  /** Clé technique persistée dans layoutJson (ex. « click »). */
  key: BuilderEventType;
  /** Nom de l'event côté PRD/JS (ex. « onClick »). */
  name: string;
  /** Libellé FR affiché dans le panneau Propriétés. */
  label: string;
  /** Quand l'événement survient. */
  when: string;
  /** Code du nœud déclencheur généré (ex. « trigger.ui.click »). */
  triggerCode: string;
  /** « client » = exécutable dans l'aperçu du builder · « serveur » = logique (données/permissions). */
  scope: "client" | "serveur";
  /** true = l'un des 13 événements UI universels du PRD (false = « change », spécifique formulaires). */
  universal: boolean;
}

/** Les 13 événements UI universels du PRD (+ « change » natif des formulaires). */
export const BUILDER_EVENTS: Record<BuilderEventType, BuilderEventSpec> = {
  load: {
    key: "load",
    name: "onMount",
    label: "Au chargement (onMount)",
    when: "Au chargement du composant",
    triggerCode: "trigger.ui.mount",
    scope: "client",
    universal: true,
  },
  visible: {
    key: "visible",
    name: "onVisible",
    label: "À l'apparition (onVisible)",
    when: "Quand le composant apparaît à l'écran",
    triggerCode: "trigger.ui.visible",
    scope: "client",
    universal: true,
  },
  click: {
    key: "click",
    name: "onClick",
    label: "Au clic",
    when: "Clic ou pression tactile",
    triggerCode: "trigger.ui.click",
    scope: "client",
    universal: true,
  },
  dblclick: {
    key: "dblclick",
    name: "onDoubleClick",
    label: "Au double-clic",
    when: "Double clic",
    triggerCode: "trigger.ui.double_click",
    scope: "client",
    universal: true,
  },
  hover: {
    key: "hover",
    name: "onHoverEnter",
    label: "Au survol (entrée)",
    when: "Curseur sur le composant",
    triggerCode: "trigger.ui.hover_enter",
    scope: "client",
    universal: true,
  },
  hoverleave: {
    key: "hoverleave",
    name: "onHoverLeave",
    label: "À la sortie du survol",
    when: "Curseur quitte le composant",
    triggerCode: "trigger.ui.hover_leave",
    scope: "client",
    universal: true,
  },
  focus: {
    key: "focus",
    name: "onFocus",
    label: "À la prise de focus",
    when: "Élément reçoit le focus",
    triggerCode: "trigger.ui.focus",
    scope: "client",
    universal: true,
  },
  blur: {
    key: "blur",
    name: "onBlur",
    label: "À la perte de focus",
    when: "Élément perd le focus",
    triggerCode: "trigger.ui.blur",
    scope: "client",
    universal: true,
  },
  keydown: {
    key: "keydown",
    name: "onKeyDown",
    label: "Touche pressée",
    when: "Touche pressée",
    triggerCode: "trigger.ui.key_down",
    scope: "client",
    universal: true,
  },
  keyup: {
    key: "keyup",
    name: "onKeyUp",
    label: "Touche relâchée",
    when: "Touche relâchée",
    triggerCode: "trigger.ui.key_up",
    scope: "client",
    universal: true,
  },
  change: {
    key: "change",
    name: "onChange",
    label: "À la modification",
    when: "Valeur du champ modifiée / validée",
    triggerCode: "trigger.ui.change",
    scope: "client",
    universal: false,
  },
  error: {
    key: "error",
    name: "onError",
    label: "En cas d'erreur",
    when: "Erreur de rendu, de chargement ou de données",
    triggerCode: "trigger.ui.error",
    scope: "serveur",
    universal: true,
  },
  dataloaded: {
    key: "dataloaded",
    name: "onDataLoaded",
    label: "Aux données chargées",
    when: "Source de données chargée",
    triggerCode: "trigger.ui.data_loaded",
    scope: "serveur",
    universal: true,
  },
  permission: {
    key: "permission",
    name: "onPermissionDenied",
    label: "Si permission refusée",
    when: "Utilisateur sans permission",
    triggerCode: "trigger.ui.permission_denied",
    scope: "serveur",
    universal: true,
  },
};

/** Les 13 événements UI universels du PRD (« change » des formulaires exclu). */
export const BUILDER_UNIVERSAL_EVENTS: BuilderEventSpec[] = Object.values(BUILDER_EVENTS).filter(
  (ev) => ev.universal
);

/** Ordre d'affichage canonique dans le panneau Propriétés. */
export const BUILDER_EVENT_ORDER: BuilderEventType[] = [
  "load",
  "visible",
  "click",
  "dblclick",
  "hover",
  "hoverleave",
  "focus",
  "blur",
  "keydown",
  "keyup",
  "change",
  "error",
  "dataloaded",
  "permission",
];

// ─── Whitelist par type de composant ──────────────────────────────────────────

/** Contrôles de formulaire : change + focus/blur/clavier. */
const FORM_CONTROL_TYPES = new Set<BuilderType>([
  "input",
  "textarea",
  "select",
  "checkbox",
  "switch",
  "slider",
  "date",
  "file",
]);

/** Types cliquables : clic, double-clic, survols, visibilité (miroir validate.ts). */
const CLICKABLE_TYPES = new Set<BuilderType>([
  "button",
  "heading",
  "text",
  "quote",
  "list",
  "badge",
  "code",
  "card",
  "divider",
  "spacer",
  "navbar",
  "tabs",
  "sidebar",
  "table",
  "stat",
  "timeline",
  "avatar",
  "image",
  "video",
  "alert",
  "progress",
  "skeleton",
]);

/** Composants qui peuvent porter onError (chargement de ressource / de données). */
const ERROR_TYPES = new Set<BuilderType>(["image", "video", "file", "table", "stat", "avatar", "timeline", "tabs"]);

/** Composants alimentés par une source de données (onDataLoaded). */
const DATA_LOADED_TYPES = new Set<BuilderType>(["table", "stat", "timeline", "badge", "heading", "text", "card", "avatar"]);

/**
 * Événements proposés pour un type de composant :
 * « load » (onMount) et « permission » universels · clics/survis/visibilité pour
 * les cliquables · saisie (change/focus/blur/clavier) pour les formulaires ·
 * « error » pour les médias · « dataloaded » pour les composants de données.
 */
export function allowedEventsFor(type: BuilderType): BuilderEventType[] {
  const allowed = new Set<BuilderEventType>(["load", "permission"]);

  if (CLICKABLE_TYPES.has(type)) {
    allowed.add("visible");
    allowed.add("click");
    allowed.add("dblclick");
    allowed.add("hover");
    allowed.add("hoverleave");
  }
  if (FORM_CONTROL_TYPES.has(type)) {
    allowed.add("visible");
    allowed.add("change");
    allowed.add("focus");
    allowed.add("blur");
    allowed.add("keydown");
    allowed.add("keyup");
  }
  if (ERROR_TYPES.has(type)) allowed.add("error");
  if (DATA_LOADED_TYPES.has(type)) allowed.add("dataloaded");

  return BUILDER_EVENT_ORDER.filter((key) => allowed.has(key));
}

/** Garde-fou serveur : l'événement est-il autorisé pour ce type ? */
export function isEventAllowed(type: string, event: string): boolean {
  return allowedEventsFor(type as BuilderType).includes(event as BuilderEventType);
}
