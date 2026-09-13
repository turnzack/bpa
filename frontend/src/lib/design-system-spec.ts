/**
 * Design System Forge Studio — source de vérité des spécifications (PRD §8).
 *
 * Chaque composant du Builder est décrit par ses variantes, ses états, ses
 * attributs ARIA, les critères WCAG 2.1 applicables et son comportement
 * responsive. La checklist de conformité (persistée en base via la table
 * DesignCheck) s'appuie sur CHECK_KEYS : la clé d'une case est
 * « {componentId}:{checkKey} » (ex. « button:contrast »).
 *
 * Ce module est statique et partagé client/serveur : aucune dépendance.
 */

export interface DesignComponentSpec {
  /** Identifiant stable, ≡ BuilderType quand applicable (ex. "button"). */
  id: string;
  /** Nom français affiché (ex. "Bouton"). */
  name: string;
  /** Description courte en français (1-2 phrases). */
  description: string;
  /** Variantes visuelles ou fonctionnelles. */
  variants: string[];
  /** États interactifs / données à couvrir. */
  states: string[];
  /** Attributs / rôles ARIA attendus. */
  aria: string[];
  /** Critères WCAG 2.1 numérotés applicables. */
  wcag: string[];
  /** Comportement responsive en une ligne. */
  responsive: string;
  /** Maturité : design (maquette) · dev (implémenté) · doc (documenté). */
  status: "design" | "dev" | "doc";
}

export interface DesignCategory {
  id: string;
  label: string;
  components: DesignComponentSpec[];
}

// ─── Catégories & composants ────────────────────────────────────────────────

export const DESIGN_CATEGORIES: DesignCategory[] = [
  // ── 1. Contenu ──────────────────────────────────────────────────────────
  {
    id: "contenu",
    label: "Contenu",
    components: [
      {
        id: "heading",
        name: "Titre",
        description:
          "Titre de section hiérarchisé de h1 à h6. Structure le plan de lecture du document et l'annonce au lecteur d'écran.",
        variants: ["H1 — Page", "H2 — Section", "H3 — Sous-section", "H4 — Intertitre"],
        states: ["enabled"],
        aria: [
          "Éléments h1–h6 natifs, sans role ajouté",
          "Un seul h1 par page",
          "Hiérarchie sans saut de niveau (h2 → h3, jamais h2 → h4)",
        ],
        wcag: ["1.3.1 Structure et relations", "2.4.6 En-têtes et étiquettes", "2.4.10 Sections d'en-tête"],
        responsive: "Échelle typographique fluide clamp() 1,5→3 rem · césure contrôlée (text-wrap: balance)",
        status: "dev",
      },
      {
        id: "text",
        name: "Texte",
        description:
          "Paragraphe de corps de texte avec tailles et tons normalisés (corps, secondaire, muet).",
        variants: ["Corps", "Secondaire", "Petit", "Muet"],
        states: ["enabled"],
        aria: [
          "Paragraphe <p> natif",
          "Pas de texte justifié (césures imprévisibles)",
          "Attribut lang sur les passages en langue étrangère",
        ],
        wcag: ["1.4.3 Contraste (minimum)", "1.4.8 Présentation du texte", "1.4.12 Espacement du texte"],
        responsive: "Interlignage ≥ 1,5 · mesure de ligne 60–75 caractères",
        status: "dev",
      },
      {
        id: "quote",
        name: "Citation",
        description:
          "Citation mise en valeur avec barre d'accent et source optionnelle (<cite>).",
        variants: ["Simple", "Avec source", "Mise en avant"],
        states: ["enabled"],
        aria: [
          "<blockquote> natif + <cite> pour la source",
          "Guillemets typographiques dans le contenu, pas injectés en CSS masqué",
          "Pas de role artificiel",
        ],
        wcag: ["1.3.1 Structure et relations", "1.4.3 Contraste (minimum)"],
        responsive: "Barre d'accent 3 px pleine hauteur · retrait réduit sous sm",
        status: "doc",
      },
      {
        id: "list",
        name: "Liste",
        description:
          "Liste à puces ou numérotée avec espacement régulier entre les éléments.",
        variants: ["À puces", "Numérotée", "Compacte"],
        states: ["enabled"],
        aria: [
          "<ul>/<ol> + <li> natifs",
          "list-style non retiré sans compensation (role=\"list\" conservé)",
          "Un seul sujet par élément",
        ],
        wcag: ["1.3.1 Structure et relations", "1.4.12 Espacement du texte"],
        responsive: "Indentation 1,25 rem · retrait négatif supprimé au retour à la ligne",
        status: "dev",
      },
      {
        id: "badge",
        name: "Badge",
        description:
          "Étiquette courte de statut ou de catégorie, en pilule colorée ou en contour.",
        variants: ["Neutre", "Succès", "Attention", "Erreur", "Contour"],
        states: ["enabled"],
        aria: [
          "Texte porteur du sens, couleur jamais seule (1.4.1)",
          "aria-label si abréviation",
          "Non interactif : pas de tabindex ni de curseur pointer",
        ],
        wcag: ["1.4.1 Utilisation de la couleur", "1.4.3 Contraste (minimum)", "2.5.3 Étiquette dans le nom"],
        responsive: "Pilule min-h 24 px · troncature ellipsis après 24 caractères",
        status: "dev",
      },
      {
        id: "code",
        name: "Code",
        description:
          "Bloc de code à fond sombre, police à chasse fixe, avec bouton copier optionnel.",
        variants: ["En ligne", "Bloc", "Bloc + copier"],
        states: ["enabled", "hover", "focus"],
        aria: [
          "<code> / <pre> natifs",
          "Attribut lang sur le passage si le langage est connu",
          "Bouton copier avec aria-label et retour d'état « Copié » annoncé",
        ],
        wcag: ["1.4.3 Contraste (minimum)", "2.1.1 Clavier", "2.4.7 Focus visible"],
        responsive: "Défilement horizontal interne · retour à la ligne forcé activable sur mobile",
        status: "doc",
      },
    ],
  },

  // ── 2. Mise en page ─────────────────────────────────────────────────────
  {
    id: "mise-en-page",
    label: "Mise en page",
    components: [
      {
        id: "card",
        name: "Carte",
        description:
          "Conteneur de contenu autonome avec titre, corps et zone d'action optionnelle.",
        variants: ["Défaut", "Bordure", "Élevée (ombre)", "Interactive"],
        states: ["enabled", "hover", "focus-within", "active"],
        aria: [
          "<article> ou <section> selon le sens du contenu",
          "Titre porté par un heading dédié",
          "Carte cliquable : lien principal étendu (stretched link) + focus visible",
        ],
        wcag: [
          "1.3.1 Structure et relations",
          "1.4.3 Contraste (minimum)",
          "2.4.7 Focus visible",
          "2.5.8 Taille de la cible",
        ],
        responsive: "Grille 1→2→3 colonnes · padding 16→24 px",
        status: "dev",
      },
      {
        id: "divider",
        name: "Séparateur",
        description:
          "Ligne de séparation horizontale ou verticale entre deux groupes de contenu.",
        variants: ["Horizontale", "Verticale", "Avec libellé"],
        states: ["enabled"],
        aria: [
          "<hr> natif si la séparation porte un sens, sinon aria-hidden décoratif",
          "role=\"separator\" uniquement hors élément <hr>",
        ],
        wcag: ["1.3.1 Structure et relations", "1.4.11 Contraste des éléments non textuels"],
        responsive: "Espacement vertical 16→24 px · variante verticale masquée sous md",
        status: "dev",
      },
      {
        id: "spacer",
        name: "Espaceur",
        description:
          "Bloc de respiration à hauteur fixe pour ajuster finement un agencement.",
        variants: ["4 px", "8 px", "16 px", "32 px", "64 px"],
        states: ["enabled"],
        aria: [
          "aria-hidden=\"true\" (décoratif)",
          "Jamais utilisé pour espacer du contenu interactif",
          "Préférer gap/margin du conteneur quand possible",
        ],
        wcag: ["1.4.12 Espacement du texte (n'annule pas l'espacement utilisateur)"],
        responsive: "Hauteur réduite de moitié sous sm pour compacter",
        status: "dev",
      },
    ],
  },

  // ── 3. Navigation ───────────────────────────────────────────────────────
  {
    id: "navigation",
    label: "Navigation",
    components: [
      {
        id: "navbar",
        name: "Barre de navigation",
        description:
          "En-tête global avec logo, liens principaux et actions secondaires, sticky par défaut.",
        variants: ["Claire", "Sombre", "Transparente + dégradé", "Avec recherche"],
        states: ["enabled", "sticky", "hover", "focus", "active (lien courant)"],
        aria: [
          "<nav aria-label=\"Navigation principale\"> (landmark unique)",
          "aria-current=\"page\" sur le lien de la page active",
          "Menu mobile : bouton aria-expanded + aria-controls vers le tiroir",
        ],
        wcag: [
          "1.3.1 Structure et relations",
          "2.1.1 Clavier",
          "2.4.1 Contournement de blocs",
          "2.4.7 Focus visible",
          "2.4.8 Emplacement",
        ],
        responsive: "Menu burger < lg (cible ≥ 44 px) · liens repliés en tiroir plein écran",
        status: "design",
      },
      {
        id: "tabs",
        name: "Onglets",
        description:
          "Bascule entre plusieurs panneaux de contenu affichés au même emplacement.",
        variants: ["Lignés (underline)", "Pilules", "Encadrés", "Vertical"],
        states: ["selected", "unselected", "hover", "focus", "disabled"],
        aria: [
          "role=\"tablist\" / tab / tabpanel couplés par id + aria-controls",
          "aria-selected sur l'onglet actif",
          "Flèches ← → pour naviguer (roving tabindex), Tab sort du tablist",
          "Panneau lié : role=\"tabpanel\" + aria-labelledby",
        ],
        wcag: ["1.3.1 Structure et relations", "2.1.1 Clavier", "4.1.2 Nom, rôle, valeur"],
        responsive: "Défilement horizontal des onglets (scroll-snap) · panneaux empilés si vertical",
        status: "design",
      },
      {
        id: "sidebar",
        name: "Barre latérale",
        description:
          "Colonne de navigation secondaire persistante avec groupes repliables et état mémorisé.",
        variants: ["Étendue", "Réduite (icônes)", "Flottante", "Tiroir mobile"],
        states: ["enabled", "collapsed", "hover", "focus", "active (entrée courante)"],
        aria: [
          "<nav aria-label=\"Navigation secondaire\">",
          "Boutons de repli : aria-expanded + aria-controls",
          "aria-current=\"true\" sur l'entrée active",
          "Tiroir mobile : focus piégé dans la surcouche + Échap pour fermer",
        ],
        wcag: [
          "1.3.1 Structure et relations",
          "1.4.10 Reflow",
          "2.1.1 Clavier",
          "2.1.2 Sans piège clavier",
          "2.4.7 Focus visible",
        ],
        responsive: "Tiroir en surcouche < lg · état réduit mémorisé côté utilisateur",
        status: "doc",
      },
    ],
  },

  // ── 4. Formulaires ──────────────────────────────────────────────────────
  {
    id: "formulaires",
    label: "Formulaires",
    components: [
      {
        id: "input",
        name: "Champ de saisie",
        description:
          "Saisie de texte sur une ligne avec libellé, texte d'aide et message d'erreur intégrés.",
        variants: ["Défaut", "Avec icône", "Erreur", "Désactivé", "Lecture seule"],
        states: ["enabled", "hover", "focus", "filled", "disabled", "readonly", "invalid"],
        aria: [
          "<label for> obligatoire (le placeholder n'est pas une étiquette)",
          "aria-describedby vers l'aide puis l'erreur",
          "aria-invalid=\"true\" + message d'erreur textuel",
          "autocomplete approprié (email, name, tel…)",
        ],
        wcag: [
          "1.3.1 Structure et relations",
          "1.3.5 Identification de l'entrée",
          "2.1.1 Clavier",
          "2.4.7 Focus visible",
          "3.3.1 Identification des erreurs",
          "3.3.3 Suggestions après erreur",
        ],
        responsive: "Cible tactile ≥ 44 px · font-size ≥ 16 px (anti-zoom iOS) · pleine largeur mobile",
        status: "dev",
      },
      {
        id: "textarea",
        name: "Zone de texte",
        description:
          "Saisie multi-lignes avec redimensionnement vertical contrôlé et compteur optionnel.",
        variants: ["Défaut", "Avec compteur", "Erreur", "Désactivée"],
        states: ["enabled", "hover", "focus", "disabled", "invalid"],
        aria: [
          "<label for> obligatoire",
          "aria-describedby pour l'aide et le compteur (aria-live=\"polite\")",
          "aria-invalid=\"true\" + message d'erreur textuel",
        ],
        wcag: [
          "1.3.1 Structure et relations",
          "2.1.1 Clavier",
          "2.4.7 Focus visible",
          "3.3.1 Identification des erreurs",
        ],
        responsive: "min-h 96 px sur mobile · redimensionnement vertical uniquement",
        status: "dev",
      },
      {
        id: "select",
        name: "Liste déroulante",
        description:
          "Sélection unique dans une liste d'options, native ou enrichie (recherche, groupes).",
        variants: ["Défaut", "Avec libellé flottant", "Erreur", "Désactivée"],
        states: ["enabled", "hover", "focus", "open", "disabled", "invalid"],
        aria: [
          "<label for> + <select> natif (ou listbox conforme au motif ARIA)",
          "aria-describedby vers l'aide/erreur",
          "Options regroupées via <optgroup label>",
          "Option d'invite disabled pour éviter la sélection ambiguë",
        ],
        wcag: ["1.3.1 Structure et relations", "2.1.1 Clavier", "3.3.1 Identification des erreurs", "4.1.2 Nom, rôle, valeur"],
        responsive: "Déclencheur ≥ 44 px · feuille plein écran (bottom sheet) sur mobile si enrichie",
        status: "dev",
      },
      {
        id: "checkbox",
        name: "Case à cocher",
        description:
          "Sélection binaire indépendante, avec état indéterminé pour les groupes parents.",
        variants: ["Seule", "Avec description", "Indéterminée", "Carte cochable"],
        states: ["unchecked", "checked", "indeterminate", "focus", "disabled"],
        aria: [
          "<input type=\"checkbox\"> natif + <label> associé",
          "aria-checked=\"mixed\" si indéterminé",
          "Groupe : <fieldset> + <legend> ou role=\"group\"",
          "Toute la zone d'étiquette est cliquable",
        ],
        wcag: ["1.3.1 Structure et relations", "2.1.1 Clavier", "2.4.7 Focus visible", "2.5.8 Taille de la cible", "4.1.2 Nom, rôle, valeur"],
        responsive: "Cible ≥ 44 px (padding sur le label) · espacement ≥ 8 px entre options",
        status: "doc",
      },
      {
        id: "switch",
        name: "Interrupteur",
        description:
          "Bascule immédiate entre deux états (activé/désactivé) appliquée sans validation.",
        variants: ["Avec libellé", "Compact", "Avec icône", "Désactivé"],
        states: ["off", "on", "focus", "disabled", "loading"],
        aria: [
          "role=\"switch\" + aria-checked (ou checkbox native si le sens s'y prête)",
          "<label> ou aria-label obligatoire",
          "Résultat asynchrone annoncé (aria-live=\"polite\")",
          "Espace = bascule ; Entrée ne doit pas être la seule voie",
        ],
        wcag: ["1.4.1 Utilisation de la couleur", "2.1.1 Clavier", "2.4.7 Focus visible", "4.1.2 Nom, rôle, valeur"],
        responsive: "Piste 44 × 24 px, zone cliquable ≥ 44 px · libellé au-dessus sur mobile",
        status: "dev",
      },
      {
        id: "slider",
        name: "Curseur",
        description:
          "Sélection d'une valeur numérique dans un intervalle par glissement ou au clavier.",
        variants: ["Simple", "Avec pas (step)", "Double poignée", "Avec valeur affichée"],
        states: ["enabled", "hover", "focus", "dragging", "disabled"],
        aria: [
          "<input type=\"range\"> natif ou role=\"slider\"",
          "aria-valuemin / aria-valuemax / aria-valuenow + aria-valuetext (unités)",
          "Flèches ± pas, Page ± 10 %, Début/Fin aux extrêmes",
          "Valeur affichée en permanence à côté, pas seulement au survol",
        ],
        wcag: ["2.1.1 Clavier", "2.4.7 Focus visible", "2.5.5 Taille de la cible (poignée)", "4.1.2 Nom, rôle, valeur"],
        responsive: "Poignée ≥ 24 px + zone tactile ≥ 44 px · pleine largeur mobile",
        status: "dev",
      },
      {
        id: "date",
        name: "Sélecteur de date",
        description:
          "Choix d'une date par champ masqué, calendrier ou saisie guidée (format JJ/MM/AAAA).",
        variants: ["Champ masqué", "Calendrier", "Plage (début–fin)", "Date + heure"],
        states: ["enabled", "focus", "open", "disabled", "invalid"],
        aria: [
          "<input type=\"date\"> natif ou dialog calendrier conforme",
          "Format attendu annoncé dans le texte d'aide",
          "Grille du calendrier : flèches, Page ± 1 mois, aria-selected sur le jour",
          "aria-invalid + erreur sur date hors plage",
        ],
        wcag: [
          "1.3.1 Structure et relations",
          "1.3.5 Identification de l'entrée",
          "2.1.1 Clavier",
          "2.4.7 Focus visible",
          "3.3.1 Identification des erreurs",
        ],
        responsive: "Calendrier en popover desktop · feuille plein écran mobile · masque de saisie tactile",
        status: "design",
      },
      {
        id: "file",
        name: "Dépôt de fichier",
        description:
          "Zone de dépôt (drag & drop) ou bouton parcourir pour l'envoi de fichiers, avec progression.",
        variants: ["Bouton parcourir", "Zone de dépôt", "Compact", "Fichiers multiples"],
        states: ["enabled", "hover", "focus", "dragover", "uploading", "error", "done"],
        aria: [
          "<input type=\"file\"> natif stylé + <label>",
          "aria-describedby : formats acceptés et taille max",
          "Progression : role=\"progressbar\" + aria-valuenow",
          "Erreurs (format/poids) annoncées via aria-live=\"assertive\"",
        ],
        wcag: [
          "1.3.5 Identification de l'entrée",
          "2.1.1 Clavier (parcourir sans souris)",
          "2.5.7 Alternative au glisser-déposer",
          "3.3.1 Identification des erreurs",
        ],
        responsive: "Zone de dépôt ≥ 88 px de haut · nom de fichier tronqué + poids affiché",
        status: "design",
      },
    ],
  },

  // ── 5. Actions ──────────────────────────────────────────────────────────
  {
    id: "actions",
    label: "Actions",
    components: [
      {
        id: "button",
        name: "Bouton",
        description:
          "Déclencheur d'action primaire avec variantes d'intention et cycle d'états complet.",
        variants: ["Défaut", "Secondaire", "Contour", "Fantôme", "Destructif", "Lien", "Avec icône"],
        states: ["enabled", "hover", "focus", "active", "disabled", "loading"],
        aria: [
          "role=button natif",
          "aria-disabled (sans tabindex=-1) + raison du blocage annoncée",
          "aria-busy + libellé « En cours… » pendant le chargement",
          "focus visible obligatoire (anneau 2 px décalé)",
        ],
        wcag: ["1.4.3 Contraste (min AA)", "2.1.1 Clavier", "2.4.7 Focus visible", "2.5.8 Taille de la cible"],
        responsive: "Cible tactile ≥ 44 px · plein largeur mobile",
        status: "dev",
      },
    ],
  },

  // ── 6. Données ──────────────────────────────────────────────────────────
  {
    id: "donnees",
    label: "Données",
    components: [
      {
        id: "table",
        name: "Tableau",
        description:
          "Grille de données avec en-têtes triables, sélection de lignes et pagination optionnelle.",
        variants: ["Simple", "Triable", "Avec sélection", "Compacte", "Avec pagination"],
        states: ["enabled", "hover (ligne)", "focus (cellule)", "sorted-asc", "sorted-desc", "empty", "loading"],
        aria: [
          "<table> + <thead>/<th scope=\"col|row\"> natifs",
          "Caption ou aria-label décrivant le contenu",
          "Tri : aria-sort sur l'en-tête + bouton déclencheur",
          "Sélection : checkbox avec aria-label « Sélectionner la ligne X »",
        ],
        wcag: ["1.3.1 Structure et relations", "1.4.3 Contraste (minimum)", "2.1.1 Clavier", "4.1.2 Nom, rôle, valeur"],
        responsive: "Défilement horizontal conteneur + 1ʳᵉ colonne figée · version cartes empilées < sm",
        status: "dev",
      },
      {
        id: "stat",
        name: "Indicateur (KPI)",
        description:
          "Chiffre clé mis en scène avec libellé, tendance et comparaison à la période précédente.",
        variants: ["Simple", "Avec tendance", "Avec icône", "Avec barre de progression"],
        states: ["enabled", "loading (squelette)", "tendance-haute", "tendance-basse"],
        aria: [
          "Valeur en texte réel (jamais une image de texte)",
          "Tendance : flèche + libellé « +18 % vs semaine dernière »",
          "Delta lisible sans la couleur (signe +/− et texte)",
        ],
        wcag: ["1.3.1 Structure et relations", "1.4.1 Utilisation de la couleur", "1.4.3 Contraste (minimum)"],
        responsive: "Grille 1→2→4 colonnes · valeur clamp 1,5→2,25 rem",
        status: "dev",
      },
      {
        id: "timeline",
        name: "Chronologie",
        description:
          "Suite d'événements ou d'étapes reliés par un rail vertical à points, horodatés.",
        variants: ["Verticale", "Compacte", "Avec horodatage", "Avec statut par étape"],
        states: ["enabled", "étape-done", "étape-courante", "étape-à-venir"],
        aria: [
          "<ol> d'étapes (l'ordre est significatif)",
          "Statut de l'étape en texte (« Terminée », « En cours », « À venir »), jamais la couleur seule",
          "Étape courante : aria-current=\"step\"",
        ],
        wcag: ["1.3.1 Structure et relations", "1.4.1 Utilisation de la couleur", "1.4.3 Contraste (minimum)"],
        responsive: "Rail à gauche · horodatages empilés sous le titre sur mobile",
        status: "doc",
      },
      {
        id: "avatar",
        name: "Avatar",
        description:
          "Photo de profil ou initiales sur fond coloré, avec badge de présence optionnel.",
        variants: ["Image", "Initiales", "Icône", "Avec badge présence"],
        states: ["enabled", "tailles sm/md/lg", "image-cassée (repli initiales)"],
        aria: [
          "alt descriptif si l'identité compte (« Photo de Sophie Bernard »)",
          "alt=\"\" si décoratif à côté du nom déjà affiché",
          "Badge présence : libellé texte (aria-label) ou masqué si redondant",
        ],
        wcag: ["1.1.1 Contenu non textuel", "1.4.3 Contraste (initiales/fond)", "1.4.11 Contraste des éléments non textuels"],
        responsive: "Tailles 24→48 px selon le contexte · empilement limité à 5 + compteur",
        status: "doc",
      },
    ],
  },

  // ── 7. Médias ───────────────────────────────────────────────────────────
  {
    id: "medias",
    label: "Médias",
    components: [
      {
        id: "image",
        name: "Image",
        description:
          "Média visuel avec ratio contrôlé, chargement différé et repli d'erreur.",
        variants: ["Ratio libre", "16:9", "1:1", "Couverture (cover)", "Miniature"],
        states: ["loading", "loaded", "error (repli)", "zoom (optionnel)"],
        aria: [
          "alt significatif décrivant la fonction, pas l'apparence",
          "alt=\"\" + aria-hidden si décorative",
          "Image-lien : alt = destination du lien",
          "Figure + figcaption pour la légende",
        ],
        wcag: ["1.1.1 Contenu non textuel", "1.4.5 Texte dans l'image (à éviter)", "1.4.11 Contraste des bordures"],
        responsive: "next/image + sizes/srcset · ratio réservé à l'avance (anti-CLS)",
        status: "dev",
      },
      {
        id: "video",
        name: "Vidéo",
        description:
          "Lecteur intégré (YouTube, Vimeo ou MP4) dans un cadre 16:9, avec façade cliquable optionnelle.",
        variants: ["Intégration 16:9", "MP4 natif", "Miniature cliquable (façade)"],
        states: ["loading", "playing", "paused", "error"],
        aria: [
          "<iframe title=\"…\"> descriptif obligatoire",
          "Façade : bouton aria-label « Lire la vidéo : <titre> »",
          "Transcription ou sous-titres fournis quand disponibles",
          "Aucune lecture automatique avec son",
        ],
        wcag: ["1.1.1 Contenu non textuel", "1.2.2 Sous-titres", "2.1.1 Clavier (contrôles natifs)", "2.3.1 Trois flashs ou moins"],
        responsive: "Cadre aspect-video fluidifié · lecture plein écran sur mobile",
        status: "doc",
      },
    ],
  },

  // ── 8. Feedback ─────────────────────────────────────────────────────────
  {
    id: "feedback",
    label: "Feedback",
    components: [
      {
        id: "alert",
        name: "Alerte",
        description:
          "Message de contexte (info, succès, attention, erreur) avec icône et action optionnelle.",
        variants: ["Info", "Succès", "Attention", "Erreur", "Avec action"],
        states: ["enabled", "annoncée (live)", "rejetable"],
        aria: [
          "role=\"alert\" pour les erreurs, role=\"status\" pour info/succès",
          "Icône aria-hidden, texte porteur du sens",
          "Bouton de fermeture avec aria-label « Fermer l'alerte »",
          "Ton explicite dans le texte (« Erreur : », « Attention : »)",
        ],
        wcag: ["1.4.1 Utilisation de la couleur", "1.4.3 Contraste (minimum)", "2.1.1 Clavier (action)", "4.1.3 Messages de statut"],
        responsive: "Empilement icône/texte/action sur mobile · largeur max 640 px",
        status: "dev",
      },
      {
        id: "progress",
        name: "Progression",
        description:
          "Barre de progression déterminée ou indéterminée avec pourcentage visible.",
        variants: ["Déterminée", "Indéterminée", "Avec libellé", "Compacte"],
        states: ["enabled", "animating", "complete", "error"],
        aria: [
          "role=\"progressbar\" + aria-valuemin / aria-valuemax / aria-valuenow",
          "aria-valuetext « 65 % » si nécessaire",
          "Zone aria-live=\"polite\" pour l'annonce d'achèvement",
          "Pourcentage affiché hors de la barre (pas que la couleur)",
        ],
        wcag: ["1.4.1 Utilisation de la couleur", "1.4.3 Contraste (minimum)", "2.2.2 Pause, arrêt, masquage (indéterminée)", "4.1.3 Messages de statut"],
        responsive: "Hauteur 8→12 px · libellé au-dessus de la barre sur mobile",
        status: "dev",
      },
      {
        id: "skeleton",
        name: "Squelette",
        description:
          "Placeholder animé de chargement imitant la forme du contenu à venir, sans saut de rendu.",
        variants: ["Ligne", "Carte", "Avatar", "Grille"],
        states: ["enabled (pulsation)", "statique (reduced motion)"],
        aria: [
          "aria-hidden=\"true\" + conteneur aria-busy=\"true\"",
          "Jamais annoncé par le lecteur d'écran (décoratif)",
          "Chargement > 3 s : état réel annoncé (aria-live=\"polite\")",
        ],
        wcag: ["1.4.11 Contraste des éléments non textuels (pulsation perceptible)", "2.2.2 Pause, arrêt, masquage", "2.3.3 Animation des interactions"],
        responsive: "Formes calquées sur le layout réel (zéro saut de rendu) · largeurs fluides",
        status: "doc",
      },
    ],
  },
];

// ─── Checklist de conformité (clés partagées par tous les composants) ──────

export const CHECK_KEYS: { key: string; label: string; hint: string }[] = [
  {
    key: "contrast",
    label: "Contraste AA vérifié",
    hint: "Contraste mesuré au vérificateur : ≥ 4,5:1 pour le texte, ≥ 3:1 pour le texte large et les composants d'interface.",
  },
  {
    key: "keyboard",
    label: "Navigation clavier testée",
    hint: "Parcours complet au clavier seul : Tab / Maj+Tab, Entrée, Espace, flèches et Échap quand c'est pertinent.",
  },
  {
    key: "screen-reader",
    label: "Lecteur d'écran testé",
    hint: "Nom, rôle et valeur vérifiés avec NVDA ou VoiceOver : annonces, états et messages d'erreur corrects.",
  },
  {
    key: "responsive",
    label: "Responsive 390→1280 vérifié",
    hint: "Contrôle du reflow de 390 px à 1280 px : aucun débordement, cibles tactiles ≥ 44 px, contenu lisible.",
  },
];

/** Nombre total de composants décrits (pour l'en-tête du module). */
export const DS_COMPONENT_COUNT = DESIGN_CATEGORIES.reduce(
  (acc, cat) => acc + cat.components.length,
  0
);

/** Nombre total de cases de checklist théoriques (composants × vérifications). */
export const DS_CHECK_TOTAL = DS_COMPONENT_COUNT * CHECK_KEYS.length;

/** Métadonnées d'affichage d'un statut de maturité. */
export const STATUS_META: Record<
  DesignComponentSpec["status"],
  { label: string; dot: string; badge: string }
> = {
  design: {
    label: "Design",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
  },
  dev: {
    label: "Dev",
    dot: "bg-emerald-500",
    badge: "bg-emerald-600 text-white border-emerald-600",
  },
  doc: {
    label: "Doc",
    dot: "bg-amber-500",
    badge: "bg-amber-500 text-white border-amber-500",
  },
};
