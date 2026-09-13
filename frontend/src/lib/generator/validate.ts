/**
 * Boucliers du Générateur (validation « Gold » de la sortie IA).
 * 1. Extraction JSON robuste (fences, texte parasite).
 * 2. Validation schéma composants (types/props/events autorisés, ids uniques).
 * 3. Anti-placeholder (fichier « vide », TODO, texte fantôme).
 * 4. Couverture des interactions (découvertes vs décisions + events réels).
 */

import type { BuilderAction, BuilderComponent, BuilderEvent, BuilderEventType, BuilderProps } from "@/components/studio/types";
import { isEventAllowed } from "@/lib/builder-events";
import type { PromptInteraction } from "./prompts";

const COMPONENT_TYPES = new Set([
  "heading", "text", "quote", "list", "badge", "code",
  "card", "divider", "spacer",
  "navbar", "tabs", "sidebar",
  "input", "textarea", "select", "checkbox", "switch", "slider", "date", "file",
  "button", "table", "stat", "timeline", "avatar",
  "image", "video", "alert", "progress", "skeleton",
]);
/** Champs de formulaire : event « change » naturel (comme input). */
const FORM_FIELD_TYPES = new Set(["textarea", "select", "checkbox", "switch", "slider", "date", "file"]);
/**
 * Types « cliquables » : events « click » + « hover » autorisés (miroir exact
 * de ALLOWED_EVENTS côté client) — « load » reste universel.
 */
const CLICKABLE_TYPES = new Set([
  "button", "heading", "text", "quote", "list", "badge", "code",
  "card", "divider", "spacer", "navbar", "tabs", "sidebar",
  "table", "stat", "timeline", "avatar",
  "image", "video", "alert", "progress", "skeleton",
]);
/** Composants de navigation : couvrent les interactions « link » du blueprint. */
const NAV_TYPES = new Set(["navbar", "tabs", "sidebar"]);
const TONES = new Set(["default", "success", "warning", "error"]);
const LEVELS = new Set(["h1", "h2", "h3"]);
const COLORS = new Set(["default", "muted", "emerald", "amber", "rose"]);
const SIZES = new Set(["sm", "md", "lg", "xl"]);
const VARIANTS = new Set(["default", "secondary", "outline", "destructive"]);
const ACTION_KINDS = new Set(["workflow", "link", "toast", "page", "copy"]);

/**
 * Événement autorisé pour un type donné — whitelist partagée avec le panneau
 * Propriétés (src/lib/builder-events.ts) : 13 événements UI universels, dont
 * « load » (onMount) universel, clics/survis/visibilité pour les cliquables,
 * saisie pour les formulaires, « error » pour les médias, etc.
 */
function eventAllowed(type: string, event: string): boolean {
  return isEventAllowed(type, event);
}

export interface CoverageItem {
  interactionId: string;
  label: string;
  kind: string;
  status: "covered" | "missing";
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
  components: BuilderComponent[];
  decisions: { interactionId: string; componentId: string; event: string; action: string }[];
  warnings: string[];
}

/** Extrait le premier objet JSON d'une réponse potentiellement bruitée. */
export function extractJson(raw: string): unknown {
  let text = raw.trim();
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  if (fence?.[1]) text = fence[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("Aucun objet JSON trouvé dans la réponse.");
  return JSON.parse(text.slice(start, end + 1));
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Détecte les props fantômes : vide, "…", TODO… */
function isPlaceholderText(v: unknown): boolean {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (!t) return true;
  return /^[.\s…]+$/.test(t) || /^(\/\/\s*)?(todo|code existant|placeholder)/i.test(t);
}

/** Valide + normalise une props selon le type (coercion douce, drop des clés interdites). */
function validateProps(type: string, rawProps: unknown, errors: string[], cid: string): BuilderProps | null {
  const props = (typeof rawProps === "object" && rawProps !== null ? rawProps : {}) as Record<string, unknown>;
  const out: BuilderProps = {};

  if (type === "heading") {
    const text = str(props.text);
    if (!text || isPlaceholderText(text)) { errors.push(`${cid}: heading sans texte valide.`); return null; }
    out.text = text;
    out.level = LEVELS.has(str(props.level) ?? "") ? (str(props.level) as "h1") : "h2";
    return out;
  }
  if (type === "text" || type === "card") {
    const text = str(props.text);
    if (!text || isPlaceholderText(text)) { errors.push(`${cid}: ${type} sans texte valide.`); return null; }
    out.text = text;
    if (COLORS.has(str(props.color) ?? "")) out.color = str(props.color) as "default";
    if (SIZES.has(str(props.size) ?? "")) out.size = str(props.size) as "md";
    return out;
  }
  if (type === "button") {
    const text = str(props.text);
    if (!text || isPlaceholderText(text)) { errors.push(`${cid}: button sans texte valide.`); return null; }
    out.text = text.slice(0, 60);
    if (VARIANTS.has(str(props.variant) ?? "")) out.variant = str(props.variant) as "default";
    if (SIZES.has(str(props.size) ?? "")) out.size = str(props.size) as "md";
    return out;
  }
  if (type === "input") {
    out.placeholder = str(props.placeholder) ?? "Saisir…";
    return out;
  }
  if (type === "image") {
    const src = str(props.src) ?? "";
    if (!/^https?:\/\//i.test(src)) { errors.push(`${cid}: image sans src https (ignorée).`); return null; }
    out.src = src;
    if (SIZES.has(str(props.size) ?? "")) out.size = str(props.size) as "md";
    return out;
  }
  if (type === "table") {
    const columns = Number(props.columns);
    out.columns = Number.isFinite(columns) ? Math.min(6, Math.max(2, Math.round(columns))) : 3;
    return out;
  }
  if (type === "quote" || type === "list" || type === "timeline" || type === "code" || type === "alert") {
    const text = str(props.text);
    if (!text || isPlaceholderText(text)) { errors.push(`${cid}: ${type} sans texte valide.`); return null; }
    out.text = text.slice(0, 1200);
    if (type === "alert" && TONES.has(str(props.tone) ?? "")) out.tone = str(props.tone) as "default";
    if (type === "quote" && SIZES.has(str(props.size) ?? "")) out.size = str(props.size) as "md";
    return out;
  }
  if (type === "badge") {
    const text = str(props.text);
    if (!text || isPlaceholderText(text)) { errors.push(`${cid}: badge sans texte valide.`); return null; }
    out.text = text.slice(0, 40);
    if (COLORS.has(str(props.color) ?? "")) out.color = str(props.color) as "default";
    return out;
  }
  if (type === "stat") {
    const value = str(props.value);
    if (!value) { errors.push(`${cid}: stat sans valeur.`); return null; }
    out.value = value.slice(0, 24);
    out.text = str(props.text)?.slice(0, 60);
    if (COLORS.has(str(props.color) ?? "")) out.color = str(props.color) as "default";
    return out;
  }
  if (type === "divider" || type === "spacer" || type === "skeleton") {
    if ((type === "spacer" || type === "skeleton") && SIZES.has(str(props.size) ?? "")) {
      out.size = str(props.size) as "md";
    }
    return out;
  }
  if (type === "navbar" || type === "tabs" || type === "sidebar") {
    const text = str(props.text);
    if (text) out.text = text.slice(0, 120);
    const rawLinks = Array.isArray(props.links)
      ? (props.links as unknown[]).map((l) => str(l)).filter((l): l is string => Boolean(l))
      : str(props.links)?.split("\n") ?? [];
    const links = rawLinks.map((l) => l.trim().slice(0, 60)).filter(Boolean).slice(0, 20);
    if (links.length === 0) {
      // Bouclier « zéro navigation morte » : un composant de nav sans lien est inutilisable.
      errors.push(`${cid}: ${type} sans lien valide (composant ignoré).`);
      return null;
    }
    out.links = links.join("\n");
    return out;
  }
  if (type === "avatar") {
    out.text = str(props.text)?.slice(0, 60);
    const src = str(props.src) ?? "";
    if (src) {
      if (!/^https?:\/\//i.test(src)) { errors.push(`${cid}: avatar avec src non https (ignorée).`); return null; }
      out.src = src;
    }
    return out;
  }
  if (type === "textarea" || type === "select" || type === "date" || type === "file") {
    out.placeholder = str(props.placeholder) ?? (type === "select" ? "Choisir…" : "Saisir…");
    if (type === "select") {
      const options = Array.isArray(props.options)
        ? (props.options as unknown[]).map((o) => str(o)).filter((o): o is string => Boolean(o)).slice(0, 20)
        : str(props.options)?.split("\n").map((o) => o.trim()).filter(Boolean).slice(0, 20) ?? [];
      if (options.length > 0) out.options = options.join("\n");
    }
    return out;
  }
  if (type === "checkbox" || type === "switch") {
    out.text = str(props.text)?.slice(0, 80) ?? "Option";
    return out;
  }
  if (type === "slider" || type === "progress") {
    const value = Number(props.value);
    out.value = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : type === "slider" ? 50 : 0;
    if (type === "progress") out.text = str(props.text)?.slice(0, 60);
    return out;
  }
  if (type === "video") {
    const src = str(props.src) ?? "";
    if (!/^https?:\/\//i.test(src)) { errors.push(`${cid}: video sans src https (ignorée).`); return null; }
    out.src = src;
    return out;
  }
  errors.push(`${cid}: type inconnu « ${type} ».`);
  return null;
}

/** Valide les events/actions d'un composant (drop des actions invalides). */
function validateEvents(rawEvents: unknown, cid: string, errors: string[], type: string): BuilderEvent[] {
  if (!Array.isArray(rawEvents)) return [];
  const events: BuilderEvent[] = [];
  rawEvents.forEach((rawEvent, ei) => {
    const ev = (typeof rawEvent === "object" && rawEvent !== null ? rawEvent : {}) as Record<string, unknown>;
    const event = str(ev.event);
    if (!event || !eventAllowed(type, event)) return;
    const actions: BuilderAction[] = [];
    if (Array.isArray(ev.actions)) {
      ev.actions.forEach((rawAction, ai) => {
        const ac = (typeof rawAction === "object" && rawAction !== null ? rawAction : {}) as Record<string, unknown>;
        const kind = str(ac.kind);
        if (!kind || !ACTION_KINDS.has(kind)) return;
        const action: BuilderAction = {
          id: str(ac.id) ?? `a${ei}${ai}`,
          kind: kind as BuilderAction["kind"],
        };
        if (kind === "workflow") {
          // L'IA ne lie pas de workflow : nom dénormalisé indicatif uniquement,
          // la vraie liaison se fait dans le panneau Propriétés du Builder.
          action.workflowName = str(ac.workflowName) ?? "Workflow à lier";
        }
        if (kind === "link") {
          const url = str(ac.url) ?? "";
          if (!/^(https?:\/\/)/i.test(url)) return; // liens internes → jamais en « link »
          action.url = url;
        }
        if (kind === "toast") {
          const message = str(ac.message) ?? "Action exécutée";
          if (/console\.log/i.test(message)) return;
          action.message = message.slice(0, 120);
        }
        if (kind === "page") {
          // L'IA ne connaît pas les ids de pages : pageId indicatif + nom
          // dénormalisé, la vraie liaison se fait dans le panneau Propriétés.
          const pageId = str(ac.pageId);
          if (pageId) action.pageId = pageId.slice(0, 64);
          action.pageName = str(ac.pageName)?.slice(0, 120) ?? "Page à lier";
        }
        if (kind === "copy") {
          const message = str(ac.message) ?? "Texte copié";
          if (/console\.log/i.test(message)) return;
          action.message = message.slice(0, 500);
        }
        actions.push(action);
      });
    }
    if (actions.length === 0) {
      // Bouclier « zéro bouton mort » : action par défaut plutôt que rien.
      if (event === "click") {
        actions.push({ id: `a${ei}x`, kind: "toast", message: "Action à configurer dans le Builder" });
        errors.push(`${cid}: action manquante → toast par défaut ajouté.`);
      }
      return;
    }
    events.push({ id: str(ev.id) ?? `e${ei}`, event: event as BuilderEventType, actions });
  });
  return events;
}

/** Validation complète de la sortie IA (components + decisions + warnings). */
export function validateAiOutput(raw: unknown, interactions: PromptInteraction[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const data = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  if (!Array.isArray(data.components) || data.components.length === 0) {
    return { ok: false, errors: ["components absent ou vide."], components: [], decisions: [], warnings };
  }
  if (data.components.length > 60) {
    warnings.push(`Sortie tronquée à 60 composants (${data.components.length} reçus).`);
  }

  const components: BuilderComponent[] = [];
  const seenIds = new Set<string>();
  const rawComponents = (data.components as unknown[]).slice(0, 60);

  rawComponents.forEach((rawComponent, index) => {
    const c = (typeof rawComponent === "object" && rawComponent !== null ? rawComponent : {}) as Record<string, unknown>;
    const type = str(c.type) ?? "";
    if (!COMPONENT_TYPES.has(type)) {
      errors.push(`c${index + 1}: type interdit « ${type} » (composant ignoré).`);
      return;
    }
    const cid = str(c.id) && !seenIds.has(str(c.id)!) ? str(c.id)! : `c${components.length + 1}`;
    if (seenIds.has(cid)) errors.push(`${cid}: id dupliqué → régénéré.`);
    const props = validateProps(type, c.props, errors, cid);
    if (!props) return;
    seenIds.add(cid);
    // Events validés pour tous les types (« load » universel ; click/hover
    // cliquables ; change formulaires) — le whitelistage est dans eventAllowed.
    const events = validateEvents(c.events, cid, errors, type);
    const component: BuilderComponent = { id: cid, type: type as BuilderComponent["type"], props };
    if (events.length > 0) component.events = events;
    components.push(component);
  });

  if (components.length === 0) {
    errors.push("Aucun composant valide après normalisation.");
    return { ok: false, errors, components, decisions: [], warnings };
  }

  // decisions (traçabilité) — format libre, on normalise.
  const decisions: ValidationResult["decisions"] = [];
  if (Array.isArray(data.decisions)) {
    for (const rawDecision of data.decisions) {
      const d = (typeof rawDecision === "object" && rawDecision !== null ? rawDecision : {}) as Record<string, unknown>;
      const interactionId = str(d.interactionId);
      const componentId = str(d.componentId);
      if (!interactionId || !componentId) continue;
      decisions.push({
        interactionId,
        componentId,
        event: str(d.event) ?? "click",
        action: str(d.action) ?? "toast",
      });
    }
  }

  if (Array.isArray(data.warnings)) {
    for (const w of data.warnings) {
      const s = str(w);
      if (s) warnings.push(s.slice(0, 160));
    }
  }

  // Bouclier couverture : toute interaction non couverte → warning explicite.
  const componentIds = new Set(components.map((c) => c.id));
  const coveredIds = new Set(
    decisions.filter((d) => componentIds.has(d.componentId)).map((d) => d.interactionId)
  );
  // Une interaction est aussi couverte si un composant interactif équivalent existe
  // (les composants de navigation navbar/tabs/sidebar couvrent les liens).
  const isInteractive = (c: BuilderComponent, kind: string): boolean =>
    (kind === "button" && c.type === "button") ||
    (kind === "link" && (c.type === "button" || NAV_TYPES.has(c.type))) ||
    (kind === "input" && (c.type === "input" || FORM_FIELD_TYPES.has(c.type)));
  for (const it of interactions) {
    if (coveredIds.has(it.id)) continue;
    const hasInteractive = components.some((c) => isInteractive(c, it.kind));
    if (hasInteractive) coveredIds.add(it.id);
    else warnings.push(`Interaction non couverte : [${it.id}] ${it.kind} « ${it.label} ».`);
  }

  return { ok: true, errors, components, decisions, warnings };
}

/** Calcule le rapport de couverture final (pour l'UI). */
export function buildCoverage(
  interactions: PromptInteraction[],
  components: BuilderComponent[],
  coveredIds: Set<string>
): CoverageItem[] {
  return interactions.map((it) => {
    // Couvert si déclaré, ou si un composant interactif équivalent existe.
    let coveredNow = coveredIds.has(it.id);
    if (!coveredNow) {
      coveredNow = components.some(
        (c) =>
          (it.kind === "button" && c.type === "button") ||
          (it.kind === "link" && (c.type === "button" || NAV_TYPES.has(c.type))) ||
          (it.kind === "input" && (c.type === "input" || FORM_FIELD_TYPES.has(c.type)))
      );
    }
    return { interactionId: it.id, label: it.label, kind: it.kind, status: coveredNow ? "covered" : "missing" };
  });
}
