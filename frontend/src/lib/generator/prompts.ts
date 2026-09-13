/**
 * Prompts du Générateur — adaptation des « 12 règles strictes » de KIROV5
 * au contrat de sortie du Builder Forge Studio (composants JSON + events).
 * Le blueprint complet est injecté dans chaque prompt → câblage garanti.
 */

export interface PromptRoute {
  route: string;
  source: string;
  title: string;
}

export interface PromptInteraction {
  id: string;
  source: string;
  kind: "button" | "link" | "input" | "form";
  label: string;
  href?: string;
}

const MAX_HTML_IN_PROMPT = 48_000;

/**
 * Allège le HTML avant envoi au LLM : le budget de contexte est réservé au
 * CONTENU visible (fidélité « reconstruction à l'identique »). Sont retirés :
 * commentaires, <script>, <style>, <noscript>, contenus <svg> (icônes),
 * données base64/data-URI (images inline), attributs d'événements inline,
 * espaces superflus. Une page export design de 20-40 Ko tient alors ENTIÈRE
 * dans le prompt — le bas de page n'est plus jamais perdu.
 */
export function slimHtmlForLlm(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "<svg></svg>")
    // data:/base64 (images inline, polices embarquées) → valeur courte.
    .replace(/(["'])(data:[^"']{80,})\1/gi, `$1[data omis]$1`)
    // srcset/hrefset très longs → omis (le src principal suffit).
    .replace(/\s(srcset|sizes)=["'][^"']*["']/gi, "")
    // Attributs d'événements inline : bruit pour la conversion.
    .replace(/\s on[a-z]+=["'][^"']*["']/gi, "")
    .replace(/[\t ]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/** Règles strictes injectées telles quelles (concises, non négociables). */
export const STRICT_RULES = `⚠️ CONSIGNES STRICTES (non négociables) :
1. FORMAT : réponds UNIQUEMENT avec un JSON valide. Aucun texte avant/après, aucune balise code.
2. COMPOSANTS AUTORISÉS : heading, text, quote, list, badge, code, card, divider, spacer, navbar, tabs, sidebar, input, textarea, select, checkbox, switch, slider, date, file, button, table, stat, timeline, avatar, image, video, alert, progress, skeleton — rien d'autre.
3. PROPS AUTORISÉES : heading{text, level:h1|h2|h3}, text{text, color:default|muted|emerald|amber|rose, size:sm|md|lg|xl}, quote{text, size}, list{text: UNE LIGNE PAR ÉLÉMENT}, badge{text, color}, code{text}, card{text, color, size}, divider{}, spacer{size}, navbar{text:marque, links: UN LIEN PAR LIGNE, max 20}, tabs{links: UN ONGLET PAR LIGNE, max 20}, sidebar{text:titre, links: UN LIEN PAR LIGNE, max 20}, button{text, variant:default|secondary|outline|destructive, size:sm|md|lg|xl}, input{placeholder}, textarea{placeholder}, select{placeholder, options: UNE OPTION PAR LIGNE, max 20}, checkbox{text}, switch{text}, slider{value:0-100}, date{}, file{}, image{src:https uniquement}, video{src:URL youtube/vimeo ou .mp4 https}, alert{text, tone:default|success|warning|error}, progress{text, value:0-100}, skeleton{size}, table{columns:2-6}, stat{text:libellé, value:"1 284" ou "+12 %"}, timeline{text: UNE ÉTAPE PAR LIGNE}, avatar{text:nom, src:https optionnel}.
4. ZÉRO BOUTON MORT : chaque composant interactif DOIT avoir events:[{id,event,actions:[...]}] — event:"click" (boutons, cartes, liens de navigation), event:"change" (champs de formulaire), event:"hover" (au survol, avec parcimonie), event:"load" (au chargement de la page, avec parcimonie — ex. message d'accueil). Chaque event doit contenir AU MOINS UNE action.
5. ACTIONS : {id, kind:"toast", message} pour les actions métier (message utile, en français, jamais "console.log") ; {id, kind:"link", url} UNIQUEMENT pour les URLs https:// externes ; pour naviguer vers une route interne du blueprint → {id, kind:"page", pageName:"Nom de la page cible"} ; {id, kind:"copy", message} pour copier un texte utile dans le presse-papiers (max 500 caractères). Ne mets JAMAIS workflowId (les workflows seront liés ensuite dans le Builder).
6. ZÉRO PLACEHOLDER : interdiction de "…", "...", "// TODO", "// code existant".
7. FIDÉLITÉ : conserve TOUT le contenu visible (titres, paragraphes, labels de boutons et champs) dans l'ordre visuel du HTML. Choisis le type le plus proche : <blockquote>→quote, <ul>/<ol>→list, <nav>/<header> de liens→navbar, onglets/role="tablist"→tabs, <aside> de liens→sidebar, <select>→select, case à cocher→checkbox, interrupteur→switch, jauge/barre→progress, chiffre clé→stat, étapes datées→timeline, message d'info/erreur→alert, extrait de code→code, prix/total→stat. Ignore <script>, <style>, <svg>, commentaires.
8. TRAÇABILITÉ : chaque interaction fournie (ids i_…) DOIT apparaître dans decisions:{interactionId, componentId, event, action} ; si une interaction ne peut pas être implémentée, ajoute-la à warnings.
9. IDS : composants "c1", "c2", … ; events "e1", "e2"… ; actions "a1", "a2"… (uniques).
10. SORTE CONTRAT EXACT : {"components":[…],"decisions":[…],"warnings":[…]}`;

/** Contract de sortie rappelé dans le message utilisateur. */
function contractReminder(): string {
  return `Contrat de sortie (JSON exact, aucune clé supplémentaire) :
{"components":[{"id":"c1","type":"heading","props":{"text":"…","level":"h1"}},{"id":"c2","type":"button","props":{"text":"…","variant":"default","size":"md"},"events":[{"id":"e1","event":"click","actions":[{"id":"a1","kind":"toast","message":"…"}]}]},{"id":"c3","type":"navbar","props":{"text":"Marque","links":"Accueil\nTarifs"},"events":[{"id":"e2","event":"load","actions":[{"id":"a2","kind":"toast","message":"Bienvenue !"}]}]}],"decisions":[{"interactionId":"i_…","componentId":"c2","event":"click","action":"toast"}],"warnings":[]}`;
}

export function buildGenerationSystemPrompt(): string {
  return (
    "Tu es un moteur de conversion HTML → Builder Forge Studio. " +
    "Tu transformes une page HTML en une liste ordonnée de composants JSON du Builder, " +
    "avec toutes les interactions câblées (aucun bouton mort).\n\n" +
    STRICT_RULES
  );
}

export function buildGenerationUserPrompt(input: {
  pageSource: string;
  html: string;
  routes: PromptRoute[];
  interactions: PromptInteraction[];
}): string {
  const routesList = input.routes
    .map((r) => `- Route '${r.route}' (Source: ${r.source}${r.title ? `, titre: ${r.title}` : ""})`)
    .join("\n");
  const interactionsList = input.interactions
    .map((i) => `- [${i.id}] ${i.kind} « ${i.label} »${i.href ? ` → ${i.href}` : ""} (${i.source})`)
    .join("\n");
  const slimmed = slimHtmlForLlm(input.html);
  const html = slimmed.length > MAX_HTML_IN_PROMPT
    ? `${slimmed.slice(0, MAX_HTML_IN_PROMPT)}\n… [HTML TRONQUÉ — la fin de la page n'est pas montrée, mais la liste d'INTERACTIONS ci-dessus est exhaustive : câble aussi les éléments du bas de page]`
    : slimmed;

  return [
    "BLUEPRINT GLOBAL DU PROJET (toutes les routes existent, câble la navigation vers ces routes via des actions kind:\"page\" avec pageName = nom de la page cible) :",
    routesList || "(aucune autre route)",
    "",
    "INTERACTIONS DÉCOUVERTES SUR CETTE PAGE (à implémenter et déclarer dans decisions) :",
    interactionsList || "(aucune)",
    "",
    `PAGE À CONVERTIR (source : ${input.pageSource}) — HTML :`,
    html,
    "",
    contractReminder(),
  ].join("\n");
}

/** Prompt de réparation (tentative 2) : renvoie les erreurs de validation. */
export function buildRepairUserPrompt(errors: string[], previousJson: string): string {
  const clipped = previousJson.length > 4_000 ? `${previousJson.slice(0, 4_000)}…` : previousJson;
  return [
    "Ta réponse précédente est INVALIDE. Corrige et renvoie UNIQUEMENT le JSON corrigé.",
    "",
    "ERREURS DE VALIDATION :",
    ...errors.map((e) => `- ${e}`),
    "",
    "EXTRAIT DE TA RÉPONSE PRÉCÉDENTE :",
    clipped,
    "",
    contractReminder(),
  ].join("\n");
}
