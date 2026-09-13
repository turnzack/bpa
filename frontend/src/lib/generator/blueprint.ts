/**
 * Phase 0 — Scanner « Blueprint » (inspiré du moteur KIROV5).
 * Analyse des fichiers HTML fournis et production d'une carte exhaustive :
 * routes inférées depuis les noms de fichiers, interactions découvertes
 * (boutons, liens, champs, formulaires), collisions de routes, avertissements.
 * Ce blueprint est injecté dans chaque prompt de génération → zéro bouton mort.
 */

export interface ScannedRoute {
  route: string;
  source: string;
  title: string;
}

export type ScannedInteractionKind = "button" | "link" | "input" | "form";

export interface ScannedInteraction {
  id: string;
  source: string;
  kind: ScannedInteractionKind;
  label: string;
  href?: string;
}

export interface Blueprint {
  routes: ScannedRoute[];
  interactions: ScannedInteraction[];
  /** Routes en doublon (deux fichiers → même route). */
  collisions: string[];
  warnings: string[];
}

export interface SourceFile {
  name: string;
  content: string;
}

/** Limite de sécurité : contenu tronqué avant analyse/prompt.
 * 60 000 caractères ≈ pages exportées par les outils de design (20-40 Ko)
 * analysées EN ENTIER — les interactions du bas de page sont découvertes. */
const MAX_HTML_LENGTH = 60_000;
const MAX_FILES = 50;
const MAX_LABEL = 90;

/** Bases de fichiers génériques (conventions d'export design) : la route est
 * alors déduite du DOSSIER parent (« shader/code.html » → /shader). */
const GENERIC_STEMS = new Set(["index", "home", "main", "code", "page", "default", "template"]);
/** Dossiers techniques ignorés dans la dérivation de route. */
const GENERIC_FOLDERS = new Set([
  "pages", "page", "html", "src", "dist", "build", "export", "exports", "output",
  "out", "www", "public", "site", "app", "templates", "static", "assets", "files",
]);

/** Décode les entités HTML courantes pour des libellés propres. */
function decodeEntities(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Nettoie un fragment HTML pour en extraire un libellé texte. */
function stripTags(raw: string): string {
  const text = decodeEntities(raw.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
  return text.length > MAX_LABEL ? `${text.slice(0, MAX_LABEL)}…` : text;
}

/** Slug stable : « Mon Super Dashboard.html » → « mon-super-dashboard ». */
function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\.(html?|htm)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "page";
}

/**
 * Nom de fichier → route, en respectant les conventions d'export des outils
 * de design (Framer, Anima, TeleportHQ…) : chaque page vit dans son dossier
 * sous le nom « code.html ». La route est donc dérivée du CHEMIN :
 *   shader/code.html              → /shader
 *   game_discovery_hub/code.html  → /game-discovery-hub
 *   pages/about.html              → /about            (dossier technique ignoré)
 *   features/auth/login.html      → /features/auth/login
 *   docs/docs.html                → /docs             (redondance évitée)
 *   index.html / code.html (racine) → /
 * Les collisions restantes (ex. a/index.html + a/code.html) sont signalées
 * dans blueprint.collisions et résolubles dans l'éditeur de Blueprint.
 */
export function fileNameToRoute(fileName: string): string {
  const segments = fileName.split("/").filter(Boolean);
  const base = segments.pop() ?? fileName;
  const stem = slugify(base);

  // 1. Chemin de dossiers significatifs (les dossiers techniques sont ignorés).
  const folderParts: string[] = [];
  for (const seg of segments) {
    const s = slugify(seg);
    if (!s || GENERIC_FOLDERS.has(s)) continue;
    folderParts.push(s);
  }
  if (folderParts.length > 0) {
    // Base générique (code/index/home…) → la route est celle du dossier.
    // Base significative → suffixée, sauf redondance avec le dernier dossier.
    const lastFolder = folderParts[folderParts.length - 1]!;
    if (!GENERIC_STEMS.has(stem) && stem !== lastFolder) folderParts.push(stem);
    return `/${folderParts.join("/")}`;
  }

  // 2. Fichier à la racine : index/home/main/code → « / », sinon slug du nom.
  if (GENERIC_STEMS.has(stem)) return "/";
  return `/${stem}`;
}

/**
 * Normalise une route éditée par l'utilisateur (éditeur de Blueprint, Sprint G2).
 * « Mon  Page! » → « /mon-page » ; retourne null si la valeur est inexploitable.
 */
export function normalizeEditedRoute(value: string): string | null {
  if (value.trim() === "/") return "/";
  const cleaned = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, "")
    .split("#")[0]!
    .split("?")[0]!
    .replace(/\.(html?|htm)$/i, "")
    .replace(/[^a-z0-9/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/+/, "");
  if (!cleaned || cleaned === "-") return null;
  const route = `/${cleaned.replace(/-+$/, "")}`.replace(/\/-+/, "/");
  return route === "/" ? "/" : route.replace(/\/+$/, "") || "/";
}

/** Titre de page : <title>, premier <h1>, sinon nom du fichier. */
function extractTitle(html: string, fileName: string): string {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (title?.[1]?.trim()) return stripTags(title[1]).slice(0, 80);
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  if (h1?.[1]?.trim()) return stripTags(h1[1]).slice(0, 80);
  return (fileName.split("/").pop() ?? fileName).replace(/\.(html?|htm)$/i, "");
}

/** Identifiant d'interaction stable (réutilisé par l'IA dans decisions[]). */
function interactionId(source: string, kind: string, index: number): string {
  return `i_${slugify(source.replace(/\.(html?|htm)$/i, ""))}_${kind}_${index + 1}`;
}

/**
 * Scanne les fichiers sources et produit le Blueprint complet.
 * Tolérant aux entrées sales (HTML tronqué, aucune interaction, doublons).
 */
export function scanFiles(files: SourceFile[]): Blueprint {
  const routes: ScannedRoute[] = [];
  const interactions: ScannedInteraction[] = [];
  const warnings: string[] = [];

  const usable = files
    .filter((f) => /\.(html?|htm)$/i.test(f.name))
    .slice(0, MAX_FILES);

  if (files.length === 0) warnings.push("Aucun fichier fourni.");
  if (usable.length === 0 && files.length > 0) {
    warnings.push("Aucun fichier .html détecté — seuls les fichiers HTML sont analysés.");
  }
  if (files.length > MAX_FILES) {
    warnings.push(`Limité aux ${MAX_FILES} premiers fichiers (${files.length} fournis).`);
  }

  for (const file of usable) {
    const html = file.content.length > MAX_HTML_LENGTH
      ? file.content.slice(0, MAX_HTML_LENGTH)
      : file.content;

    const route = fileNameToRoute(file.name);
    const title = extractTitle(html, file.name);
    routes.push({ route, source: file.name, title });

    // Boutons
    const buttonRe = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
    let m: RegExpExecArray | null;
    let b = 0;
    while ((m = buttonRe.exec(html)) !== null) {
      const label = stripTags(m[1] ?? "");
      if (!label) continue;
      interactions.push({ id: interactionId(file.name, "button", b++), source: file.name, kind: "button", label });
    }

    // Liens <a href>
    const linkRe = /<a\s[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let l = 0;
    while ((m = linkRe.exec(html)) !== null) {
      const href = decodeEntities((m[1] ?? "").trim());
      const label = stripTags(m[2] ?? "");
      if (!label && !href) continue;
      interactions.push({
        id: interactionId(file.name, "link", l++),
        source: file.name,
        kind: "link",
        label: label || href,
        href,
      });
    }

    // Champs de saisie (input / textarea avec placeholder ou name)
    const inputRe = /<(input|textarea)\b[^>]*>/gi;
    let i = 0;
    while ((m = inputRe.exec(html)) !== null) {
      const tag = m[0];
      const type = /type=["']([^"']*)["']/i.exec(tag)?.[1]?.toLowerCase() ?? "text";
      if (["hidden", "submit", "checkbox", "radio"].includes(type)) continue;
      const placeholder = /placeholder=["']([^"']*)["']/i.exec(tag)?.[1];
      const name = /name=["']([^"']*)["']/i.exec(tag)?.[1];
      const label = stripTags(placeholder ?? name ?? type);
      if (!label) continue;
      interactions.push({ id: interactionId(file.name, "input", i++), source: file.name, kind: "input", label });
    }

    // Formulaires
    const formRe = /<form\b[^>]*>/gi;
    let f = 0;
    while ((m = formRe.exec(html)) !== null) {
      interactions.push({ id: interactionId(file.name, "form", f++), source: file.name, kind: "form", label: "Formulaire" });
    }

    if (html.length >= MAX_HTML_LENGTH) {
      warnings.push(`« ${file.name} » tronqué à ${MAX_HTML_LENGTH} caractères pour l'analyse.`);
    }
  }

  // Collisions de routes
  const byRoute = new Map<string, string[]>();
  for (const r of routes) {
    byRoute.set(r.route, [...(byRoute.get(r.route) ?? []), r.source]);
  }
  const collisions: string[] = [];
  for (const [route, sources] of byRoute) {
    if (sources.length > 1) collisions.push(`${route} ← ${sources.join(", ")}`);
  }

  return { routes, interactions, collisions, warnings };
}
