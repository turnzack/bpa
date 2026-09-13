/**
 * Catalogue documenté de l'API Forge Studio.
 *
 * Source unique de vérité partagée par :
 * - la vue « Docs » (référence API interactive du studio) ;
 * - GET /api/openapi qui génère la spécification OpenAPI 3.0 à partir de ce fichier.
 *
 ⚠️ Chaque entrée correspond à une route réellement implémentée sous src/app/api.
 */

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiParamDoc {
  name: string;
  description: string;
}

export interface ApiEndpointDoc {
  method: ApiMethod;
  /** Chemin avec paramètres entre accolades, ex. /api/workflows/{workflowId}/run */
  path: string;
  summary: string;
  description?: string;
  pathParams?: ApiParamDoc[];
  queryParams?: ApiParamDoc[];
  bodyExample?: Record<string, unknown>;
  responseExample?: unknown;
  /** Endpoint GET testable en direct depuis la doc (bouton « Exécuter »). */
  tryable?: boolean;
}

export interface ApiGroupDoc {
  id: string;
  title: string;
  description: string;
  endpoints: ApiEndpointDoc[];
}

export const API_GROUPS: ApiGroupDoc[] = [
  {
    id: "general",
    title: "Général",
    description:
      "Santé du service, spécification OpenAPI auto-générée et journal d'audit de l'organisation.",
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        summary: "Health check du service",
        description:
          "Vérifie l'API et la connexion base de données. Renvoie 200 si tout est OK, 503 si la base est injoignable.",
        responseExample: {
          status: "ok",
          checks: { api: "ok", db: "ok" },
          dbLatencyMs: 2,
          uptimeMs: 128_450,
          timestamp: "2026-09-10T08:30:00.000Z",
        },
        tryable: true,
      },
      {
        method: "GET",
        path: "/api/openapi",
        summary: "Spécification OpenAPI 3.0 (auto-générée)",
        description:
          "Document OpenAPI généré à partir du catalogue interne (src/lib/api-catalog.ts). Importable dans Swagger UI, Postman ou Insomnia.",
        tryable: true,
      },
      {
        method: "GET",
        path: "/api/audit",
        summary: "Journal d'audit",
        description:
          "50 dernières entrées d'audit de l'organisation (créations, modifications, exécutions…).",
        tryable: true,
      },
    ],
  },
  {
    id: "roadmap",
    title: "Feuille de route",
    description:
      "Feuille de route de la plateforme (12 sprints) et des projets, avec cochage persistant des tâches.",
    endpoints: [
      {
        method: "GET",
        path: "/api/roadmap",
        summary: "Feuille de route de la plateforme",
        description:
          "5 phases, 12 sprints, tâches + livrables cochables et statistiques globales.",
        tryable: true,
      },
      {
        method: "PATCH",
        path: "/api/roadmap/tasks/{taskId}",
        summary: "Cocher / décocher une tâche ou un livrable",
        description: "Fonctionne pour les tâches de la plateforme ET des projets.",
        pathParams: [
          { name: "taskId", description: "Identifiant SprintTask (tâche ou livrable)." },
        ],
        bodyExample: { done: true },
        responseExample: { task: { id: "…", title: "…", done: true } },
      },
    ],
  },
  {
    id: "projects",
    title: "Projets",
    description:
      "Création de projets de tout type (SaaS, app, site web, jeu vidéo…) avec génération automatique de leur feuille de route.",
    endpoints: [
      {
        method: "GET",
        path: "/api/projects",
        summary: "Lister les projets",
        description: "Projets + statistiques globales + limites du plan d'abonnement.",
        tryable: true,
      },
      {
        method: "POST",
        path: "/api/projects",
        summary: "Créer un projet (+ feuille de route auto)",
        description:
          "Génère instantanément une feuille de route dédiée (4 à 8 sprints, tâches + livrables) adaptée au type de projet.",
        bodyExample: {
          name: "Mon SaaS",
          type: "saas",
          description: "Application SaaS de gestion",
        },
        responseExample: {
          project: { id: "…", name: "Mon SaaS", type: "saas", status: "active" },
          roadmap: { phases: 5, sprints: 8, tasks: 25, deliverables: 16 },
        },
      },
      {
        method: "PATCH",
        path: "/api/projects/{projectId}",
        summary: "Mettre à jour un projet",
        pathParams: [{ name: "projectId", description: "Identifiant du projet." }],
        bodyExample: { name: "Nouveau nom", status: "active" },
      },
      {
        method: "DELETE",
        path: "/api/projects/{projectId}",
        summary: "Supprimer un projet",
        description:
          "Supprime le projet et TOUTES ses ressources en cascade : pages, tables + champs + lignes, workflows + exécutions, feuille de route, runs générateur. Si le projet supprimé était le dernier, un projet vierge « Nouveau projet » est automatiquement recréé (avec sa feuille de route) pour que le studio reste opérationnel — la réponse contient alors replacement:{id,name}.",
        pathParams: [{ name: "projectId", description: "Identifiant du projet." }],
        responseExample: { ok: true, replacement: { id: "cuid", name: "Nouveau projet" } },
      },
      {
        method: "GET",
        path: "/api/projects/{projectId}/roadmap",
        summary: "Feuille de route du projet",
        description: "Même forme que /api/roadmap, périmétrée sur le projet.",
        pathParams: [{ name: "projectId", description: "Identifiant du projet." }],
      },
    ],
  },
  {
    id: "pages",
    title: "Pages & Builder UI",
    description:
      "Pages construites visuellement : arbre de composants (layoutJson) avec propriétés et actions/workflows liés.",
    endpoints: [
      {
        method: "GET",
        path: "/api/pages",
        summary: "Lister les pages",
        queryParams: [{ name: "projectId", description: "Filtre par projet (optionnel)." }],
        tryable: true,
      },
      {
        method: "POST",
        path: "/api/pages",
        summary: "Créer une page",
        bodyExample: { name: "Accueil", projectId: "…" },
      },
      {
        method: "GET",
        path: "/api/pages/{pageId}",
        summary: "Détail d'une page",
        description: "Renvoie layoutJson : la liste des composants (props + events/actions).",
        pathParams: [{ name: "pageId", description: "Identifiant de la page." }],
      },
      {
        method: "PUT",
        path: "/api/pages/{pageId}",
        summary: "Enregistrer le layout",
        description:
          "Sauvegarde automatique depuis le builder (debounce 2 s). Le layoutJson contient aussi les liaisons composant → workflow.",
        pathParams: [{ name: "pageId", description: "Identifiant de la page." }],
        bodyExample: {
          name: "Accueil",
          layoutJson:
            '[{"id":"c1","type":"button","props":{"text":"Cliquez ici"},"events":[{"id":"e1","event":"click","actions":[{"id":"a1","kind":"workflow","workflowId":"w1","workflowName":"Inscription"}]}]}]',
        },
      },
      {
        method: "DELETE",
        path: "/api/pages/{pageId}",
        summary: "Supprimer une page",
        pathParams: [{ name: "pageId", description: "Identifiant de la page." }],
      },
    ],
  },
  {
    id: "data",
    title: "Données",
    description:
      "Base de données visuelle : tables, champs typés avec contraintes, et lignes (CRUD complet).",
    endpoints: [
      {
        method: "GET",
        path: "/api/tables",
        summary: "Lister les tables",
        queryParams: [{ name: "projectId", description: "Filtre par projet (optionnel)." }],
        tryable: true,
      },
      {
        method: "POST",
        path: "/api/tables",
        summary: "Créer une table + ses champs",
        description:
          "Types disponibles : string, number, boolean, datetime, json. Contraintes : required, unique, defaultValue.",
        bodyExample: {
          name: "Clients",
          projectId: "…",
          fields: [
            { name: "email", type: "string", required: true, unique: true },
            { name: "actif", type: "boolean", defaultValue: "true" },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/tables/{tableId}",
        summary: "Détail d'une table (champs + lignes)",
        pathParams: [{ name: "tableId", description: "Identifiant de la table." }],
      },
      {
        method: "DELETE",
        path: "/api/tables/{tableId}",
        summary: "Supprimer une table",
        pathParams: [{ name: "tableId", description: "Identifiant de la table." }],
      },
      {
        method: "POST",
        path: "/api/tables/{tableId}/rows",
        summary: "Ajouter une ligne",
        pathParams: [{ name: "tableId", description: "Identifiant de la table." }],
        bodyExample: { data: { email: "claude@exemple.fr", actif: true } },
      },
      {
        method: "PATCH",
        path: "/api/tables/{tableId}/rows/{rowId}",
        summary: "Modifier une ligne",
        pathParams: [
          { name: "tableId", description: "Identifiant de la table." },
          { name: "rowId", description: "Identifiant de la ligne." },
        ],
        bodyExample: { data: { actif: false } },
      },
      {
        method: "DELETE",
        path: "/api/tables/{tableId}/rows/{rowId}",
        summary: "Supprimer une ligne",
        pathParams: [
          { name: "tableId", description: "Identifiant de la table." },
          { name: "rowId", description: "Identifiant de la ligne." },
        ],
      },
    ],
  },
  {
    id: "workflows",
    title: "Workflows",
    description:
      "Automatisations : catalogue complet de 191 nœuds catalogués en 12 catégories (Déclencheurs, Industrial/IoT, UI Actions, Logique, Données, Transformation, Intégrations, Fichiers, Communication, IA, Sécurité, Opérations) sur 9 exécuteurs réels (Webhook, Timer, HTTP, Condition, Code, E-mail, Base de données, Notification, Journal), 13 événements UI universels (trigger.ui.*), contrat JSON exportable par nœud, moteur d'exécution et historique. Les nœuds « data.* » s'exécutent RÉELLEMENT sur les tables visuelles du projet (find / create / update / delete).",
    endpoints: [
      {
        method: "GET",
        path: "/api/workflows/catalog",
        summary: "Catalogue complet des nœuds + événements UI universels",
        description:
          "Palette Workflow exportable : 191 nœuds en 12 catégories (code, libellé, description, exécuteur de base, champs de config), les 13 événements UI universels avec leurs nœuds déclencheurs trigger.ui.*, l'exemple métier industriel (scan QR → intervention) et le contrat JSON d'un nœud (version 1.0.0, compatible marketplace).",
        tryable: true,
        responseExample: {
          stats: { nodes: 191, categories: 12, uiEvents: 13, contractVersion: "1.0.0" },
          categories: [{ id: "triggers", label: "Déclencheurs", role: "Démarrer une exécution", nodes: 19 }],
          nodes: [
            {
              code: "data.create",
              label: "Créer donnée",
              description: "Insère un record dans la base métier.",
              category: "data",
              base: "db",
              fields: ["operation", "table", "data", "rowId"],
            },
          ],
          uiEvents: [{ key: "click", name: "onClick", triggerCode: "trigger.ui.click", scope: "client" }],
        },
      },
      {
        method: "GET",
        path: "/api/workflows",
        summary: "Lister les workflows",
        description: "Avec compteurs d'exécutions et dernier run.",
        queryParams: [{ name: "projectId", description: "Filtre par projet (optionnel)." }],
        tryable: true,
      },
      {
        method: "POST",
        path: "/api/workflows",
        summary: "Créer un workflow",
        description:
          "Créé aussi en inline depuis le Builder UI (panneau Propriétés → Actions & Workflows → Nouveau).",
        bodyExample: {
          name: "Inscription utilisateur",
          projectId: "…",
          nodes: [
            { id: "n1", type: "webhook", name: "Déclencheur", config: { path: "/signup", method: "POST" } },
            { id: "n2", type: "email", name: "Bienvenue", config: { to: "{{email}}", subject: "Bienvenue !", body: "Merci de votre inscription." } },
          ],
        },
      },
      {
        method: "GET",
        path: "/api/workflows/{workflowId}",
        summary: "Détail d'un workflow (nœuds)",
        pathParams: [{ name: "workflowId", description: "Identifiant du workflow." }],
      },
      {
        method: "PUT",
        path: "/api/workflows/{workflowId}",
        summary: "Mettre à jour nom / statut / nœuds",
        description:
          "Statuts : draft, active, paused. Nœuds : { id, type, name, config, catalogCode? } — type parmi les 9 exécuteurs (webhook, timer, http, condition, code, email, db, notify, log), catalogCode optionnel = code du catalogue (ex. data.create, ai.rag_answer) qui pilote l'affichage et les champs de config.",
        pathParams: [{ name: "workflowId", description: "Identifiant du workflow." }],
        bodyExample: { name: "Inscription utilisateur", status: "active" },
      },
      {
        method: "DELETE",
        path: "/api/workflows/{workflowId}",
        summary: "Supprimer un workflow",
        pathParams: [{ name: "workflowId", description: "Identifiant du workflow." }],
      },
      {
        method: "POST",
        path: "/api/workflows/{workflowId}/run",
        summary: "Exécuter un workflow",
        description:
          "Moteur d'exécution : parcourt les 9 types de nœuds dans l'ordre, évalue les conditions (court-circuit des actions suivantes si fausse, y compris Notification/Journal), produit des logs détaillés et persiste le run. Les nœuds « db » s'exécutent RÉELLEMENT sur la base visuelle du projet : find (5 dernières lignes), create (avec valeurs par défaut des champs requis), update (fusion JSON) et delete — durée réelle mesurée ; une erreur db marque le nœud et le run en « error » SANS interrompre les nœuds suivants. C'est l'endpoint appelé quand un bouton du Builder est cliqué en mode Aperçu.",
        pathParams: [{ name: "workflowId", description: "Identifiant du workflow." }],
        responseExample: {
          run: {
            id: "…",
            status: "success",
            durationMs: 175,
            logs: [
              { nodeId: "n1", type: "webhook", title: "Déclencheur", status: "success", message: "Webhook reçu", at: 0, durationMs: 12 },
              { nodeId: "n2", type: "db", title: "Créer la ligne", status: "success", message: "Ligne créée dans « Clients » (id cmex4t2a…)", at: 15, durationMs: 9 },
            ],
          },
        },
      },
      {
        method: "GET",
        path: "/api/workflows/{workflowId}/runs",
        summary: "Historique des exécutions",
        pathParams: [{ name: "workflowId", description: "Identifiant du workflow." }],
      },
    ],
  },
  {
    id: "analytics-billing",
    title: "Analytics & Billing",
    description: "Métriques d'usage de la plateforme et gestion de l'abonnement.",
    endpoints: [
      {
        method: "GET",
        path: "/api/analytics",
        summary: "Métriques consolidées",
        description: "Totaux, runs par workflow (succès/erreur), activité 14 jours, usage du plan.",
        queryParams: [{ name: "projectId", description: "Filtre par projet (optionnel)." }],
        tryable: true,
      },
      {
        method: "GET",
        path: "/api/billing",
        summary: "Abonnement, limites, usage et audit",
        tryable: true,
      },
      {
        method: "POST",
        path: "/api/billing/checkout",
        summary: "Changer de plan (checkout simulé)",
        description: "Plans : free, pro (29 €/mois), enterprise.",
        bodyExample: { plan: "pro" },
        responseExample: { subscription: { plan: "pro", status: "active" } },
      },
    ],
  },
  {
    id: "generator",
    title: "Générateur",
    description:
      "Moteur de création de Builder UIs : scan Blueprint des pages HTML importées, conversion IA avec règles strictes et boucliers (zéro bouton mort), extraction ZIP sécurisée, runs persistants (reprise, cache par hash, observabilité) et reliaison automatique des boutons aux workflows.",
    endpoints: [
      {
        method: "POST",
        path: "/api/generator/scan",
        summary: "Phase 0 — scanner le Blueprint",
        description:
          "Analyse des fichiers HTML : routes inférées, interactions découvertes (boutons, liens, champs, formulaires), collisions de routes, avertissements.",
        bodyExample: {
          files: [{ name: "dashboard.html", content: "<h1>Cockpit</h1><button>Paramètres</button>" }],
        },
        responseExample: {
          blueprint: {
            routes: [{ route: "/dashboard", source: "dashboard.html", title: "Cockpit" }],
            interactions: [{ id: "i_dashboard_button_1", source: "dashboard.html", kind: "button", label: "Paramètres" }],
            collisions: [],
            warnings: [],
          },
        },
      },
      {
        method: "POST",
        path: "/api/generator/generate",
        summary: "Convertir une page en composants du Builder",
        description:
          "Pipeline à 3 niveaux : IA (règles strictes + blueprint injecté) → réparation si sortie invalide → fallback déterministe. Cache par hash : une page inchangée (force=false) est servie sans régénération. Mode « queued » (défaut avec runId) : la conversion démarre en arrière-plan et répond { queued: true } en moins d'une seconde — le suivi se fait via /api/generator/status (aucune requête longue, plus d'erreur 502 passerelle). Mode « sync » : résultat direct dans la réponse.",
        bodyExample: {
          source: "dashboard.html",
          html: "<h1>Cockpit</h1>…",
          runId: "cuid-du-run (optionnel)",
          routes: [{ route: "/dashboard", source: "dashboard.html", title: "Cockpit" }],
          force: false,
          mode: "queued",
        },
        responseExample: {
          queued: true,
          runId: "cuid-du-run",
          fileName: "dashboard.html",
        },
      },
      {
        method: "GET",
        path: "/api/generator/status",
        summary: "Suivre une génération en file d'attente",
        description:
          "Statut d'une conversion en arrière-plan : generating (en cours), done (page résultat complète : composants, couverture, timings, jetons), failed (avec message d'erreur exploitable — relance possible), none. Une page « generating » sans mise à jour depuis plus de 3 minutes (tâche perdue) est marquée failed pour permettre la relance.",
        queryParams: [
          { name: "runId", description: "Identifiant du run persistant." },
          { name: "fileName", description: "Nom du fichier source (ex. dashboard.html)." },
        ],
        tryable: false,
        responseExample: {
          status: "done",
          page: {
            components: [{ id: "c1", type: "heading", props: { text: "Cockpit", level: "h1" } }],
            engine: "ia",
            durationMs: 9300,
            attempts: 1,
          },
        },
      },
      {
        method: "POST",
        path: "/api/generator/extract",
        summary: "Extraction ZIP sécurisée (serveur)",
        description:
          "Extrait une archive .zip (base64) avec boucliers : zip slip refusé (chemins absolus, « .. », lettres de lecteur), limites de taille (10 Mo archive, 20 Mo décompressé), 50 fichiers max, profondeur ≤ 8, doublons ignorés. Ne renvoie que les fichiers .html/.htm/.txt.",
        bodyExample: { zipBase64: "UEsDBBQAAAAIA…" },
        responseExample: {
          files: [{ name: "pages/dashboard.html", content: "<h1>…" }],
          rejected: [{ name: "../evil.txt", reason: "Remontée de chemin « .. » refusée (zip slip)." }],
          warnings: [],
        },
      },
      {
        method: "POST",
        path: "/api/generator/auto-link",
        summary: "Relier les boutons aux workflows existants (mapping par nom)",
        description:
          "Pour chaque bouton non déjà lié, cherche un workflow du projet dont le nom correspond au libellé (égalité normalisée, puis inclusion) et remplace l'action générique par une vraie action « workflow ».",
        bodyExample: {
          projectId: "cuid-du-projet",
          pages: [{ source: "dashboard.html", components: [{ id: "c2", type: "button", props: { text: "Notifier" } }] }],
        },
        responseExample: {
          pages: [{ source: "dashboard.html", components: [] }],
          mappings: [{ source: "dashboard.html", componentId: "c2", buttonText: "Notifier", workflowId: "…", workflowName: "Notifier les abonnés" }],
          linkedCount: 1,
          workflowCount: 4,
        },
      },
      {
        method: "POST",
        path: "/api/generator/runs",
        summary: "Créer un run persistant",
        description: "Snapshot des sources + blueprint : permet la reprise après interruption et le rapport final.",
        bodyExample: {
          projectId: "cuid-du-projet (optionnel)",
          blueprint: { routes: [], interactions: [], collisions: [], warnings: [] },
          files: [{ name: "dashboard.html", content: "…" }],
        },
        responseExample: { run: { id: "…", status: "running", totalFiles: 3 } },
      },
      {
        method: "GET",
        path: "/api/generator/runs",
        summary: "Lister les derniers runs",
        description: "10 derniers runs avec avancement par page (done / failed / pending) — base de la reprise.",
        queryParams: [{ name: "projectId", description: "Filtre par projet (optionnel)." }],
        tryable: true,
      },
      {
        method: "GET",
        path: "/api/generator/runs/{runId}",
        summary: "Recharger un run complet",
        description: "Blueprint, sources et résultats par page (composants, couverture, timings, jetons, tentatives).",
        pathParams: [{ name: "runId", description: "Identifiant du run." }],
      },
      {
        method: "PATCH",
        path: "/api/generator/runs/{runId}",
        summary: "Mettre à jour le statut d'un run",
        description: "Statuts : running, done, interrupted, failed.",
        pathParams: [{ name: "runId", description: "Identifiant du run." }],
        bodyExample: { status: "interrupted" },
      },
      {
        method: "DELETE",
        path: "/api/generator/runs/{runId}",
        summary: "Supprimer un run",
        description: "Supprime le run et ses résultats par page (cascade).",
        pathParams: [{ name: "runId", description: "Identifiant du run." }],
      },
      {
        method: "GET",
        path: "/api/generator/runs/{runId}/report",
        summary: "Rapport d'observabilité exportable",
        description:
          "Synthèse JSON : durées par phase (LLM, réparation, validation, secours), jetons, couverture des interactions, boutons câblés, tentatives de réparation, par page et en totaux.",
        pathParams: [{ name: "runId", description: "Identifiant du run." }],
        responseExample: {
          report: {
            runId: "…",
            totals: { pagesDone: 3, iaPages: 3, coveragePct: 100, totalTokens: 6200, avgDurationMs: 9100 },
            pages: [{ fileName: "dashboard.html", engine: "ia", coverageCovered: 7, coverageTotal: 7 }],
          },
        },
      },
    ],
  },
];

/** Nombre total d'endpoints documentés. */
export const API_ENDPOINT_COUNT = API_GROUPS.reduce(
  (acc, group) => acc + group.endpoints.length,
  0
);
