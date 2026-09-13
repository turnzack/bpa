/**
 * Vitrine de la palette — page de démonstration du Builder UI.
 *
 * Contient les 24 composants de la palette (7 catégories) avec un contenu
 * réaliste, des titres de section et quelques actions (toast) câblées pour
 * montrer le système d'événements en mode Aperçu.
 *
 * Utilisée par POST /api/pages (template: "palette") — réinsérable à volonté
 * dans n'importe quel projet depuis le bouton « Vitrine palette » du Builder.
 */
import type { BuilderComponent, BuilderEvent, BuilderProps, BuilderType } from "@/components/studio/types";

/** Nom canonique de la page de démonstration (suffixe « (2) », « (3) »… si doublon). */
export const VITRINE_PAGE_NAME = "Vitrine palette";

/** Identifiant du template côté API. */
export const VITRINE_TEMPLATE = "palette" as const;

type VitrineEvent = Pick<BuilderEvent, "event"> & { actionMessage: string };

/** Petit constructeur de composant (ids stables et lisibles). */
function c(id: string, type: BuilderType, props: BuilderProps, vitrineEvent?: VitrineEvent): BuilderComponent {
  const events: BuilderEvent[] | undefined = vitrineEvent
    ? [
        {
          id: `${id}-event`,
          event: vitrineEvent.event,
          actions: [{ id: `${id}-action`, kind: "toast", message: vitrineEvent.actionMessage }],
        },
      ]
    : undefined;
  return { id, type, props, ...(events ? { events } : {}) };
}

/**
 * Construit le layout complet de la vitrine — 40 composants couvrant
 * les 24 types de la palette, organisés par catégorie.
 */
export function buildVitrineLayout(): BuilderComponent[] {
  return [
    // ─── Hero ────────────────────────────────────────────────────────────────
    c("vt-badge-hero", "badge", { text: "Palette · 24 composants", color: "emerald" }),
    c("vt-heading-hero", "heading", {
      text: "Vitrine de la palette",
      level: "h1",
      size: "xl",
      color: "default",
    }),
    c("vt-text-hero", "text", {
      text: "Toutes les briques du Builder UI, présentées par catégorie. En mode édition, cliquez sur un élément pour éditer ses propriétés dans le panneau de droite ; basculez ensuite en mode Aperçu pour les tester en conditions réelles.",
      size: "lg",
      color: "muted",
    }),
    c("vt-button-hero", "button", { text: "Explorer la palette", variant: "default" }, {
      event: "click",
      actionMessage: "Sélectionnez un composant sur la toile pour voir ses propriétés ✨",
    }),
    c("vt-divider-hero", "divider", {}),
    c("vt-spacer-hero", "spacer", { size: "sm" }),

    // ─── 1 · Contenu ─────────────────────────────────────────────────────────
    c("vt-heading-contenu", "heading", { text: "1 · Contenu", level: "h2", size: "lg", color: "default" }),
    c("vt-quote", "quote", {
      text: "« La meilleure interface est celle qu'on ne remarque pas. »",
      size: "md",
      color: "muted",
    }),
    c("vt-list", "list", {
      text: "Titres, paragraphes et citations\nListes à puces et badges d'état\nBlocs de code monospace",
      size: "md",
    }),
    c("vt-badge", "badge", { text: "Nouveau", color: "emerald" }),
    c("vt-badge-muted", "badge", { text: "Bêta", color: "muted" }),
    c("vt-badge-rose", "badge", { text: "Priorité haute", color: "rose" }),
    c("vt-code", "code", {
      text: 'const studio = create("forge");\n// Composez vos pages, branchez vos workflows,\n// exportez le layout en JSON.',
    }),

    // ─── 2 · Mise en page ────────────────────────────────────────────────────
    c("vt-heading-layout", "heading", { text: "2 · Mise en page", level: "h2", size: "lg", color: "default" }),
    c("vt-card", "card", {
      text: "Carte — conteneur générique pour regrouper du contenu lié (texte, chiffres, actions…).",
      color: "default",
    }),
    c("vt-divider", "divider", {}),
    c("vt-spacer", "spacer", { size: "md" }),

    // ─── 3 · Formulaires ─────────────────────────────────────────────────────
    c("vt-heading-forms", "heading", { text: "3 · Formulaires", level: "h2", size: "lg", color: "default" }),
    c("vt-text-forms", "text", {
      text: "En mode Aperçu, tous les contrôles ci-dessous sont vivants : ils déclenchent les événements « change » configurables dans Actions & Workflows.",
      size: "md",
      color: "muted",
    }),
    c("vt-input", "input", { placeholder: "Votre nom…" }),
    c("vt-textarea", "textarea", { placeholder: "Votre message…" }),
    c("vt-select", "select", {
      placeholder: "Choisir un plan…",
      options: "Gratuit\nPro — 19 €/mois\nBusiness — 49 €/mois\nEntreprise — sur devis",
    }),
    c("vt-checkbox", "checkbox", { text: "J'accepte les conditions d'utilisation" }),
    c("vt-switch", "switch", { text: "Notifications par email" }, {
      event: "change",
      actionMessage: "Préférence enregistrée ✓",
    }),
    c("vt-slider", "slider", { value: 50 }),
    c("vt-date", "date", {}),
    c("vt-file", "file", {}),

    // ─── 4 · Actions ─────────────────────────────────────────────────────────
    c("vt-heading-actions", "heading", { text: "4 · Actions", level: "h2", size: "lg", color: "default" }),
    c("vt-button-default", "button", { text: "Action principale", variant: "default" }, {
      event: "click",
      actionMessage: "Action principale déclenchée !",
    }),
    c("vt-button-secondary", "button", { text: "Secondaire", variant: "secondary" }),
    c("vt-button-outline", "button", { text: "Contour", variant: "outline" }),
    c("vt-button-destructive", "button", { text: "Supprimer", variant: "destructive" }),

    // ─── 5 · Données ─────────────────────────────────────────────────────────
    c("vt-heading-data", "heading", { text: "5 · Données", level: "h2", size: "lg", color: "default" }),
    c("vt-stat", "stat", { text: "Utilisateurs actifs", value: "1 284", color: "default" }),
    c("vt-stat-emerald", "stat", { text: "Conversion", value: "+18 %", color: "emerald" }),
    c("vt-table", "table", { columns: 3 }),
    c("vt-timeline", "timeline", {
      text: "Inscription de l'utilisateur\nPremière connexion\nInvitation de l'équipe\nPassage au plan Pro",
    }),
    c("vt-avatar", "avatar", { text: "Alex Martin" }),

    // ─── 6 · Médias ──────────────────────────────────────────────────────────
    c("vt-heading-media", "heading", { text: "6 · Médias", level: "h2", size: "lg", color: "default" }),
    c("vt-text-media", "text", {
      text: "Image et Vidéo affichent un emplacement réservé tant qu'aucune source n'est fournie — sélectionnez-les pour coller une URL (YouTube, Vimeo, MP4…).",
      size: "md",
      color: "muted",
    }),
    c("vt-image", "image", { src: "" }),
    c("vt-video", "video", { src: "" }),

    // ─── 7 · Feedback ────────────────────────────────────────────────────────
    c("vt-heading-feedback", "heading", { text: "7 · Feedback", level: "h2", size: "lg", color: "default" }),
    c("vt-alert-default", "alert", {
      text: "Information : la vitrine est une page comme les autres — modifiez-la, dupliquez-la ou supprimez-la librement.",
      tone: "default",
    }),
    c("vt-alert-success", "alert", {
      text: "Succès : les 24 composants de la palette sont tous représentés sur cette page.",
      tone: "success",
    }),
    c("vt-alert-warning", "alert", {
      text: "Attention : les actions toast de cette page sont des démonstrations — remplacez-les par de vrais workflows.",
      tone: "warning",
    }),
    c("vt-alert-error", "alert", {
      text: "Erreur : exemple d'alerte critique avec ton « error ».",
      tone: "error",
    }),
    c("vt-progress", "progress", { text: "Progression du projet", value: 65 }),
    c("vt-skeleton", "skeleton", { size: "md" }),
  ];
}

/** Types de composants présents dans la vitrine (dérivé, pour test/vérification). */
export function vitrineTypes(): Set<string> {
  return new Set(buildVitrineLayout().map((c) => c.type));
}
