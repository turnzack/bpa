/**
 * Convertisseur déterministe HTML → composants du Builder (fallback).
 * Utilisé quand l'IA échoue ou renvoie une sortie invalide : garantit qu'une
 * page est TOUJOURS importable (bouclier « zéro page vide »).
 * Les boutons reçoivent toujours une action (lien externe, navigation interne
 * simulée par toast, ou message métier) — jamais de bouton mort.
 */

import type { BuilderComponent, BuilderProps } from "@/components/studio/types";
import type { ScannedInteraction } from "./blueprint";

let counter = 0;

/** id court unique par conversion (c1, c2…). */
function nextId(): string {
  counter += 1;
  return `c${counter}`;
}

function decodeEntities(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function textOf(raw: string): string {
  return decodeEntities(raw.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

const MAX_COMPONENTS = 40;

export interface FallbackResult {
  components: BuilderComponent[];
  warnings: string[];
  /** Interactions réellement converties (id → componentId). */
  covered: Map<string, string>;
}

/** Conversion sans IA, dans l'ordre visuel du document. */
export function htmlToFallbackComponents(
  html: string,
  interactions: ScannedInteraction[],
  knownRoutes: string[]
): FallbackResult {
  counter = 0;
  const components: BuilderComponent[] = [];
  const warnings: string[] = [];
  const covered = new Map<string, string>();

  // Retire scripts/styles/commentaires/heads pour ne garder que le visible.
  const body = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|svg|head|noscript)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<head\b[\s\S]*?<\/head>/gi, "");

  const push = (type: BuilderComponent["type"], props: BuilderProps, events?: BuilderComponent["events"]) => {
    if (components.length >= MAX_COMPONENTS) return false;
    components.push({ id: nextId(), type, props, ...(events ? { events } : {}) });
    return true;
  };

  // Parcours des blocs significatifs dans l'ordre du document.
  const blockRe =
    /<(h[1-3]|p|li|button|a|input|textarea|img|table|blockquote)\b([^>]*)>([\s\S]*?)<\/\1>|<(input|img|hr)\b([^>]*)\/?>/gi;
  let m: RegExpExecArray | null;
  let buttonIndex = 0;

  while ((m = blockRe.exec(body)) !== null) {
    const tag = (m[1] ?? m[4] ?? "").toLowerCase();
    const attrs = m[2] ?? m[5] ?? "";
    const inner = m[3] ?? "";

    switch (tag) {
      case "h1":
      case "h2":
      case "h3": {
        const text = textOf(inner);
        if (text) push("heading", { text, level: tag });
        break;
      }
      case "blockquote": {
        const text = textOf(inner);
        if (text.length > 1) push("quote", { text, color: "muted", size: "md" });
        break;
      }
      case "hr": {
        push("divider", {});
        break;
      }
      case "p":
      case "li": {
        const text = textOf(inner);
        if (text.length > 1) push("text", { text, color: "default", size: "md" });
        break;
      }
      case "button": {
        const label = textOf(inner) || "Action";
        const it = interactions.find((x) => x.kind === "button" && x.label === label);
        push("button", { text: label, variant: "default", size: "md" }, [
          {
            id: `e${components.length + 1}`,
            event: "click",
            actions: [{ id: `a${components.length + 1}`, kind: "toast", message: `Action : ${label}` }],
          },
        ]);
        if (it) covered.set(it.id, components[components.length - 1]!.id);
        buttonIndex += 1;
        break;
      }
      case "a": {
        const href = decodeEntities(/href=["']([^"']*)["']/i.exec(attrs)?.[1] ?? "").trim();
        const label = textOf(inner);
        if (!label || !href || href.startsWith("#")) break;
        const external = /^https?:\/\//i.test(href);
        push("button", { text: label.slice(0, 40), variant: "outline", size: "md" }, [
          {
            id: `e${components.length + 1}`,
            event: "click",
            actions: [
              external
                ? { id: `a${components.length + 1}`, kind: "link", url: href }
                : knownRoutes.includes(href.startsWith("/") ? href : `/${href}`)
                  ? { id: `a${components.length + 1}`, kind: "toast", message: `Navigation : ${href}` }
                  : { id: `a${components.length + 1}`, kind: "toast", message: `Action : ${label}` },
            ],
          },
        ]);
        const it = interactions.find((x) => x.kind === "link" && (x.href === href || x.label === label));
        if (it) covered.set(it.id, components[components.length - 1]!.id);
        break;
      }
      case "input":
      case "textarea": {
        const type = /type=["']([^"']*)["']/i.exec(attrs)?.[1]?.toLowerCase() ?? "text";
        if (["hidden", "submit", "checkbox", "radio"].includes(type)) break;
        const placeholder =
          /placeholder=["']([^"']*)["']/i.exec(attrs)?.[1] ??
          /name=["']([^"']*)["']/i.exec(attrs)?.[1] ?? "Saisir…";
        const it = interactions.find((x) => x.kind === "input" && (x.label === textOf(placeholder) || x.label === placeholder));
        push("input", { placeholder: textOf(placeholder) || "Saisir…" }, [
          {
            id: `e${components.length + 1}`,
            event: "change",
            actions: [{ id: `a${components.length + 1}`, kind: "toast", message: "Saisie enregistrée" }],
          },
        ]);
        if (it) covered.set(it.id, components[components.length - 1]!.id);
        break;
      }
      case "img": {
        const src = decodeEntities(/src=["']([^"']*)["']/i.exec(attrs)?.[1] ?? "").trim();
        if (/^https?:\/\//i.test(src)) push("image", { src, size: "md" });
        else warnings.push("Image locale ignorée (URL externe requise).");
        break;
      }
      case "table": {
        const headers = [...body.slice(m.index, m.index + (m[0]?.length ?? 0)).matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)];
        push("table", { columns: Math.max(2, Math.min(6, headers.length || 3)) });
        break;
      }
    }
  }

  if (components.length === 0) {
    warnings.push("Aucun contenu exploitable détecté — un titre a été inséré pour garder la page valide.");
    push("heading", { text: "Page importée", level: "h1" });
  }
  if (components.length >= MAX_COMPONENTS) {
    warnings.push(`Page volumineuse : limitée aux ${MAX_COMPONENTS} premiers composants.`);
  }

  return { components, warnings, covered };
}
