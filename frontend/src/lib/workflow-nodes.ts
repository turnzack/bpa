/**
 * Catalogue complet des nœuds de workflow OmniBuild (PRD « Catalogue des nœuds »).
 *
 * Source de vérité partagée client/serveur :
 * - la palette Workflow de l'éditeur (vue Workflows + dialog du Builder UI) ;
 * - le dialog « Catalogue des nœuds » (recherche, catégories, événements UI) ;
 * - GET /api/workflows/catalog (catalogue exportable, compatible marketplace).
 *
 * Architecture : chaque nœud catalogué possède un `code` (ex. « data.create »)
 * ET un exécuteur de base (`base`) parmi les 9 types réellement exécutés par le
 * moteur (webhook, timer, http, condition, code, email, db, notify, log).
 * Le code est persisté dans WorkflowNode.catalogCode ; le moteur exécute le
 * type de base — les données circulent sous forme d'objets JSON entre nœuds.
 *
 * Séparation des nœuds (données / logique / intégrations / IA) volontaire :
 * elle facilite la validation, les tests, l'observabilité et l'extension.
 */

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlignLeft,
  AlertTriangle,
  AppWindow,
  Archive,
  ArrowRightLeft,
  ArrowUpDown,
  Bell,
  BellRing,
  Binary,
  Bot,
  Boxes,
  Braces,
  Brain,
  BrainCircuit,
  Briefcase,
  Building2,
  Cable,
  Calendar,
  CalendarClock,
  Calculator,
  CircleCheck,
  CirclePause,
  CircleStop,
  CircleX,
  ClipboardCopy,
  Clock,
  CloudDownload,
  CloudUpload,
  CodeXml,
  Coins,
  Combine,
  Copy,
  CreditCard,
  Database,
  Download,
  EyeOff,
  FileDown,
  FileInput,
  FileJson,
  FileOutput,
  FileSpreadsheet,
  FileText,
  FileUp,
  FileX,
  Filter,
  Fingerprint,
  Flag,
  Focus,
  FolderOpen,
  FolderTree,
  Factory,
  Gauge,
  GitBranch,
  GitFork,
  GitMerge,
  Globe,
  Group,
  HardDrive,
  Hash,
  Hourglass,
  Inbox,
  Info,
  KeyRound,
  Languages,
  Layers,
  Leaf,
  LifeBuoy,
  Link2,
  ListFilter,
  ListOrdered,
  LoaderCircle,
  Lock,
  Mail,
  MailX,
  MessageSquare,
  Mic,
  Minimize2,
  MousePointerClick,
  MoveVertical,
  Navigation,
  Network,
  Newspaper,
  Notebook,
  Pencil,
  PenTool,
  Phone,
  Plug,
  Printer,
  QrCode,
  Radio,
  RefreshCw,
  Repeat,
  Replace,
  RotateCcw,
  Route,
  Scan,
  ScanLine,
  ScanText,
  ScrollText,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Shuffle,
  Pen,
  Hash,
  Smartphone,
  Siren,
  SortAsc,
  Split,
  SquareX,
  SunMoon,
  Table2,
  Tags,
  Terminal,
  TextCursorInput,
  Timer,
  TrendingUp,
  Trash2,
  Type,
  Undo2,
  Unlock,
  Upload,
  UserCheck,
  Users,
  Variable,
  Video,
  Volume2,
  Webhook,
  Wifi,
  Workflow,
  Play,
  Zap,
} from "lucide-react";
import { z } from "zod";
import type { NodeType, WorkflowNode, WorkflowNodeConfig } from "@/components/studio/types";
import { BUILDER_UNIVERSAL_EVENTS } from "./builder-events";

// ─── Catégories de la palette Workflow ───────────────────────────────────────

export type WorkflowNodeCategoryId =
  | "triggers"
  | "iot"
  | "ui"
  | "logic"
  | "data"
  | "transform"
  | "integration"
  | "files"
  | "communication"
  | "ai"
  | "security"
  | "ops";

export interface WorkflowNodeCategory {
  id: WorkflowNodeCategoryId;
  label: string;
  /** Rôle de la catégorie (PRD). */
  role: string;
  icon: LucideIcon;
  /** Pastille colorée du nœud (fond de l'icône). */
  chip: string;
  /** Bordure gauche de la carte nœud. */
  border: string;
  /** Texte de la pastille. */
  text?: string;
}

export const WORKFLOW_NODE_CATEGORIES: WorkflowNodeCategory[] = [
  { id: "triggers", label: "Déclencheurs", role: "Démarrer une exécution", icon: Zap, chip: "bg-emerald-500", border: "border-l-emerald-500" },
  { id: "iot", label: "Industrial / IoT", role: "Connecter les opérations industrielles", icon: Factory, chip: "bg-cyan-700", border: "border-l-cyan-700" },
  { id: "ui", label: "UI Actions", role: "Modifier l'interface", icon: MousePointerClick, chip: "bg-amber-500", border: "border-l-amber-500" },
  { id: "logic", label: "Logique", role: "Contrôler les chemins", icon: GitFork, chip: "bg-rose-500", border: "border-l-rose-500" },
  { id: "data", label: "Données", role: "Lire et modifier les entités", icon: Database, chip: "bg-teal-600", border: "border-l-teal-600" },
  { id: "transform", label: "Transformation", role: "Nettoyer et préparer les payloads", icon: Braces, chip: "bg-zinc-500", border: "border-l-zinc-400" },
  { id: "integration", label: "Intégrations", role: "Appeler des services externes", icon: Globe, chip: "bg-stone-500", border: "border-l-stone-400" },
  { id: "files", label: "Fichiers", role: "Gérer import/export et documents", icon: FolderOpen, chip: "bg-yellow-600", border: "border-l-yellow-600" },
  { id: "communication", label: "Communication", role: "Informer des personnes et systèmes", icon: Bell, chip: "bg-orange-500", border: "border-l-orange-500" },
  { id: "ai", label: "IA, RAG & agents", role: "Raisonnement, retrieval et agents", icon: Bot, chip: "bg-fuchsia-600", border: "border-l-fuchsia-600" },
  { id: "security", label: "Sécurité", role: "Gérer les accès et la gouvernance", icon: ShieldCheck, chip: "bg-red-600", border: "border-l-red-600" },
  { id: "ops", label: "Opérations", role: "Contrôler le moteur d'exécution", icon: Settings2, chip: "bg-lime-600", border: "border-l-lime-600" },
];

// ─── Spécifications des nœuds ────────────────────────────────────────────────

/** Clés de config éditables par nœud (miroir de WorkflowNodeConfig). */
export type NodeConfigFieldKey =
  | "path"
  | "method"
  | "cron"
  | "url"
  | "expression"
  | "code"
  | "to"
  | "subject"
  | "body"
  | "operation"
  | "table"
  | "data"
  | "rowId"
  | "message"
  | "level"
  | "prompt"
  | "params";

export interface WorkflowNodeSpec {
  /** Code canonique du nœud (ex. « data.create »). */
  code: string;
  label: string;
  description: string;
  category: WorkflowNodeCategoryId;
  icon: LucideIcon;
  /** Exécuteur de base réellement exécuté par le moteur. */
  base: NodeType;
  /** Champs de config affichés dans le panneau du nœud. */
  fields: NodeConfigFieldKey[];
  keywords?: string[];
}

// Raccourcis de champs récurrents (PRD).
const F_WEBHOOK: NodeConfigFieldKey[] = ["path", "method"];
const F_TIMER: NodeConfigFieldKey[] = ["cron"];
const F_HTTP: NodeConfigFieldKey[] = ["url", "method"];
const F_COND: NodeConfigFieldKey[] = ["expression"];
const F_CODE: NodeConfigFieldKey[] = ["code"];
const F_EMAIL: NodeConfigFieldKey[] = ["to", "subject", "body"];
const F_DB: NodeConfigFieldKey[] = ["operation", "table", "data", "rowId"];
const F_NOTIFY: NodeConfigFieldKey[] = ["to", "message"];
const F_LOG: NodeConfigFieldKey[] = ["message", "level"];
const F_PROMPT: NodeConfigFieldKey[] = ["prompt"];
const F_PARAMS: NodeConfigFieldKey[] = ["params"];

function spec(
  code: string,
  label: string,
  description: string,
  category: WorkflowNodeCategoryId,
  icon: LucideIcon,
  base: NodeType,
  fields: NodeConfigFieldKey[],
  keywords?: string[]
): WorkflowNodeSpec {
  return { code, label, description, category, icon, base, fields, keywords };
}

// ── Déclencheurs (19) ────────────────────────────────────────────────────────
const TRIGGER_SPECS: WorkflowNodeSpec[] = [
  spec("trigger.manual", "Manuel", "Lancement depuis Studio (bouton Exécuter).", "triggers", Play, "code", F_PARAMS, ["manuel", "test"]),
  spec("trigger.ui.event", "Événement UI", "Clic, submit, changement ou navigation depuis l'interface.", "triggers", MousePointerClick, "code", F_PARAMS, ["clic", "interface", "click"]),
  spec("trigger.webhook", "Webhook", "Reçoit une requête HTTP (headers, body, query).", "triggers", Webhook, "webhook", F_WEBHOOK, ["http", "entrée"]),
  spec("trigger.cron", "Cron", "Lance selon une expression CRON (planning).", "triggers", Clock, "timer", F_TIMER, ["planification", "horaires"]),
  spec("trigger.interval", "Intervalle", "Lance toutes les N minutes ou heures.", "triggers", Timer, "timer", F_TIMER, ["périodique", "répète"]),
  spec("trigger.datetime", "Date planifiée", "Lance à une date et heure précises.", "triggers", CalendarClock, "timer", F_TIMER, ["rendez-vous", "planifié"]),
  spec("trigger.data.created", "Création donnée", "Nouvelle ligne créée dans un modèle.", "triggers", Database, "code", F_PARAMS, ["insert", "record"]),
  spec("trigger.data.updated", "Modification donnée", "Ligne modifiée (champs surveillés).", "triggers", Database, "code", F_PARAMS, ["update", "record"]),
  spec("trigger.data.deleted", "Suppression donnée", "Ligne supprimée d'un modèle.", "triggers", Database, "code", F_PARAMS, ["delete", "record"]),
  spec("trigger.data.status_changed", "Changement statut", "Statut métier évolue (champ status).", "triggers", GitBranch, "code", F_PARAMS, ["transition", "workflow"]),
  spec("trigger.import.completed", "Import terminé", "Fin d'un import CSV/XLSX.", "triggers", FileInput, "code", F_PARAMS, ["csv", "xlsx"]),
  spec("trigger.file.uploaded", "Fichier uploadé", "Un fichier est disponible (stockage objet).", "triggers", FileUp, "code", F_PARAMS, ["upload", "storage"]),
  spec("trigger.stripe.event", "Paiement Stripe", "Événement Stripe signé (checkout, invoice…).", "triggers", CreditCard, "code", F_PARAMS, ["paiement", "webhook"]),
  spec("trigger.email.received", "Email reçu", "Message entrant analysé (mail brut).", "triggers", Mail, "code", F_PARAMS, ["imap", "mail"]),
  spec("trigger.chat.message", "Message chat", "Nouveau message assistant / chat.", "triggers", MessageSquare, "code", F_PARAMS, ["assistant", "session"]),
  spec("trigger.workflow.error", "Erreur workflow", "Échec d'un autre flux (run/step error).", "triggers", AlertTriangle, "code", F_PARAMS, ["échec", "monitoring"]),
  spec("trigger.metric.threshold", "Seuil métrique", "Dépassement d'un KPI (règle de seuil).", "triggers", Gauge, "code", F_PARAMS, ["kpi", "alerte"]),
  spec("trigger.workflow.invoked", "Appel sous-workflow", "Invocation interne (contrat d'entrée).", "triggers", Workflow, "code", F_PARAMS, ["réutilise", "flux"]),
  spec("trigger.system.event", "Événement système", "Publication, membre, quota… de la plateforme.", "triggers", Info, "code", F_PARAMS, ["plateforme"]),
];

// ── Industrial / IoT (7) ─────────────────────────────────────────────────────
const IOT_SPECS: WorkflowNodeSpec[] = [
  spec("trigger.iot.telemetry", "Équipement IoT", "Télémétrie reçue (device + mesure).", "iot", Radio, "code", F_PARAMS, ["capteur", "mesure"]),
  spec("trigger.iot.alarm", "Alarme industrielle", "Événement critique (alarme OT).", "iot", Siren, "code", F_PARAMS, ["critique", "urgence"]),
  spec("iot.alarm_rule", "Règle d'alarme", "Évalue des seuils sur la télémétrie et déclenche des alertes.", "iot", Gauge, "code", F_PARAMS, ["seuil", "supervision"]),
  spec("iot.digital_twin", "Jumeau numérique", "Synchronise l'état temps réel d'un équipement (digital twin).", "iot", Boxes, "code", F_PARAMS, ["état", "simulation"]),
  spec("iot.historian", "Historien de mesures", "Historise les séries temporelles (time series).", "iot", Activity, "code", F_PARAMS, ["archives", "courbes"]),
  spec("iot.edge_buffer", "Tampon edge", "Met en file locale puis rejoue vers le cloud.", "iot", HardDrive, "code", F_PARAMS, ["offline", "rejeu"]),
  spec("iot.ot_gateway_check", "Santé passerelle OT", "Vérifie la passerelle OPC-UA / Modbus (health check).", "iot", Wifi, "code", F_PARAMS, ["supervision", "réseau"]),
];

// ── UI Actions (17) ──────────────────────────────────────────────────────────
const UI_SPECS: WorkflowNodeSpec[] = [
  spec("ui.navigate", "Naviguer", "Va vers une route interne ou externe.", "ui", Navigation, "code", F_PARAMS, ["route", "page"]),
  spec("ui.open_modal", "Ouvrir modal", "Ouvre une fenêtre modale.", "ui", AppWindow, "code", F_PARAMS, ["dialog", "popup"]),
  spec("ui.close_modal", "Fermer modal", "Ferme la fenêtre modale courante.", "ui", SquareX, "code", F_PARAMS, ["dialog", "fermer"]),
  spec("ui.show_toast", "Toast", "Message success / error / info.", "ui", MessageSquare, "notify", F_NOTIFY, ["notification", "feedback"]),
  spec("ui.confirm", "Confirmation", "Demande une validation utilisateur.", "ui", CircleCheck, "code", F_PARAMS, ["dialog", "valider"]),
  spec("ui.set_state", "Set state", "Modifie l'état local ou global de l'app.", "ui", Variable, "code", F_PARAMS, ["état", "store"]),
  spec("ui.set_component_value", "Set component value", "Modifie la valeur d'un composant.", "ui", TextCursorInput, "code", F_PARAMS, ["champ", "formulaire"]),
  spec("ui.refresh_query", "Refresh data", "Recharge une source de données.", "ui", RefreshCw, "code", F_PARAMS, ["recharger", "liste"]),
  spec("ui.scroll_to", "Scroll", "Scrolle vers un composant ou une position.", "ui", MoveVertical, "code", F_PARAMS, ["ancre", "haut"]),
  spec("ui.focus", "Focus", "Place le focus sur un champ.", "ui", Focus, "code", F_PARAMS, ["curseur", "saisie"]),
  spec("ui.set_loading", "Loader", "Active ou désactive un état de chargement.", "ui", LoaderCircle, "code", F_PARAMS, ["spinner", "attente"]),
  spec("ui.download_file", "Download", "Télécharge un fichier côté utilisateur.", "ui", FileDown, "code", F_PARAMS, ["télécharger", "export"]),
  spec("ui.copy_to_clipboard", "Copier presse-papiers", "Copie une valeur dans le presse-papiers.", "ui", ClipboardCopy, "code", F_PARAMS, ["copie"]),
  spec("ui.print", "Impression", "Lance l'impression de la vue courante.", "ui", Printer, "code", F_PARAMS, ["imprimer"]),
  spec("ui.browser_notification", "Notification navigateur", "Notification Web Push locale.", "ui", BellRing, "code", F_PARAMS, ["push", "desktop"]),
  spec("ui.set_theme", "Changer thème", "Dark / light / branding tenant.", "ui", SunMoon, "code", F_PARAMS, ["dark", "light"]),
  spec("ui.run_workflow", "Lancer workflow", "Démarre un flux publié depuis l'UI.", "ui", Workflow, "code", F_PARAMS, ["déclenche", "flux"]),
];

// ── Contrôle de flux (20) ────────────────────────────────────────────────────
const LOGIC_SPECS: WorkflowNodeSpec[] = [
  spec("logic.if", "Si / Sinon", "Deux branches selon une expression booléenne.", "logic", GitFork, "condition", F_COND, ["condition", "branche"]),
  spec("logic.switch", "Switch", "Plusieurs branches selon une valeur.", "logic", GitBranch, "condition", F_COND, ["multi", "cases"]),
  spec("logic.filter", "Filtre", "Ne laisse passer que les items valides.", "logic", Filter, "condition", F_COND, ["garde", "predicate"]),
  spec("logic.merge", "Fusion", "Combine deux branches ou plus.", "logic", GitMerge, "code", F_PARAMS, ["combine", "join"]),
  spec("logic.loop", "Boucle", "Itère sur une liste.", "logic", Repeat, "code", F_PARAMS, ["foreach", "itération"]),
  spec("logic.batch", "Batch", "Traite N éléments à la fois.", "logic", Layers, "code", F_PARAMS, ["lot", "chunk"]),
  spec("logic.parallel", "Paralléliser", "Exécute des branches simultanément.", "logic", Split, "code", F_PARAMS, ["simultané", "fork"]),
  spec("logic.join", "Join / attendre", "Attend la fin de branches parallèles.", "logic", Combine, "code", F_PARAMS, ["barrière", "sync"]),
  spec("logic.delay", "Délai", "Attend une durée avant de continuer.", "logic", Hourglass, "code", F_PARAMS, ["pause", "attente"]),
  spec("logic.wait_event", "Attendre événement", "Suspend jusqu'à un webhook ou un statut.", "logic", CirclePause, "code", F_PARAMS, ["suspend", "signal"]),
  spec("logic.retry", "Retry", "Réessaie une étape selon une politique.", "logic", RotateCcw, "code", F_PARAMS, ["réessai", "backoff"]),
  spec("logic.circuit_breaker", "Circuit breaker", "Protège une API externe instable.", "logic", ShieldAlert, "code", F_PARAMS, ["disjoncteur", "protection"]),
  spec("logic.rate_limit", "Rate limit", "Limite le débit par tenant ou connecteur.", "logic", Gauge, "code", F_PARAMS, ["throttle", "quota"]),
  spec("logic.timeout", "Timeout", "Arrête une action trop longue.", "logic", Timer, "code", F_PARAMS, ["délai max", "arrêt"]),
  spec("logic.cancel", "Annulation", "Annule l'exécution ou une branche.", "logic", CircleX, "code", F_PARAMS, ["stop", "abandon"]),
  spec("logic.compensate", "Compensation", "Exécute une action inverse après échec.", "logic", Undo2, "code", F_PARAMS, ["rollback", "saga"]),
  spec("logic.invoke_workflow", "Sous-workflow", "Réutilise un flux publié.", "logic", Workflow, "code", F_PARAMS, ["appel", "réutilise"]),
  spec("logic.stop", "Stop", "Termine avec succès ou erreur contrôlée.", "logic", CircleStop, "code", F_PARAMS, ["fin", "termine"]),
  spec("logic.try_catch", "Error handler", "Capture une erreur et branche vers le traitement.", "logic", LifeBuoy, "code", F_PARAMS, ["exception", "erreur"]),
  spec("logic.approval", "Approval", "Pause jusqu'à validation humaine.", "logic", UserCheck, "code", F_PARAMS, ["validation", "humain"]),
];

// ── Données et base métier (20) ──────────────────────────────────────────────
const DATA_SPECS: WorkflowNodeSpec[] = [
  spec("data.create", "Créer donnée", "Insère un record dans la base métier.", "data", Database, "db", F_DB, ["insert", "ligne"]),
  spec("data.get", "Lire donnée", "Charge un record par identifiant.", "data", Search, "db", F_DB, ["find", "lecture"]),
  spec("data.query", "Lister / query", "Filtre, tri et pagination.", "data", Table2, "db", F_DB, ["select", "liste"]),
  spec("data.update", "Mettre à jour", "Modifie un record existant.", "data", Pencil, "db", F_DB, ["patch", "modifie"]),
  spec("data.delete", "Supprimer", "Supprime un record.", "data", Trash2, "db", F_DB, ["remove", "ligne"]),
  spec("data.upsert", "Upsert", "Crée ou met à jour selon une clé.", "data", ArrowUpDown, "db", F_DB, ["create or update"]),
  spec("data.bulk_update", "Mise à jour bulk", "Modifie plusieurs records d'un coup.", "data", Layers, "db", F_DB, ["massif", "batch"]),
  spec("data.bulk_delete", "Suppression bulk", "Supprime plusieurs records d'un coup.", "data", Trash2, "db", F_DB, ["massif", "batch"]),
  spec("data.aggregate", "Agrégation", "Count, sum, avg, min, max, group by.", "data", Calculator, "db", F_DB, ["kpi", "stats"]),
  spec("data.transaction", "Transaction", "Garantit un groupe d'opérations atomiques.", "data", Link2, "code", F_PARAMS, ["atomique", "rollback"]),
  spec("data.sql", "Requête SQL contrôlée", "SQL paramétré, permissions strictes.", "data", Terminal, "code", F_PARAMS, ["base", "query"]),
  spec("data.fulltext_search", "Recherche texte", "Recherche plein texte (FTS).", "data", Search, "code", F_PARAMS, ["mots-clés", "fts"]),
  spec("data.vector_search", "Recherche vectorielle", "Similarité sémantique pour le RAG.", "data", Scan, "code", F_PARAMS, ["embeddings", "rag"]),
  spec("data.cache_get", "Cache read", "Lit une valeur en cache (Redis).", "data", Download, "code", F_PARAMS, ["redis", "rapide"]),
  spec("data.cache_set", "Cache write", "Écrit une valeur en cache avec TTL.", "data", Upload, "code", F_PARAMS, ["redis", "ttl"]),
  spec("data.set_variable", "Variable workflow", "Crée ou modifie une variable du flux.", "data", Variable, "code", F_PARAMS, ["état", "mémoire"]),
  spec("data.get_secret", "Secret", "Lit un secret sans l'exposer dans les logs.", "data", KeyRound, "code", F_PARAMS, ["credential", "vault"]),
  spec("data.user_preferences", "État utilisateur", "Lit ou écrit les préférences UI.", "data", Settings2, "code", F_PARAMS, ["préférences", "profil"]),
  spec("data.file_metadata", "Fichier metadata", "Lit les métadonnées d'un document.", "data", FileText, "code", F_PARAMS, ["document", "infos"]),
  spec("data.audit_log", "Audit event", "Écrit une action sensible (immuable).", "data", ScrollText, "log", F_LOG, ["journal", "traçabilité"]),
];

// ── Transformations (20) ─────────────────────────────────────────────────────
const TRANSFORM_SPECS: WorkflowNodeSpec[] = [
  spec("transform.set", "Définir champs", "Ajoute ou écrase des champs JSON.", "transform", Replace, "code", F_CODE, ["payload", "champs"]),
  spec("transform.map", "Mapper", "Transforme chaque objet d'une liste.", "transform", ArrowRightLeft, "code", F_CODE, ["liste", "projection"]),
  spec("transform.reduce", "Réduire", "Réduit une liste vers une valeur.", "transform", Combine, "code", F_CODE, ["somme", "accumule"]),
  spec("transform.sort", "Trier", "Trie une collection.", "transform", SortAsc, "code", F_CODE, ["ordre", "asc"]),
  spec("transform.deduplicate", "Dédupliquer", "Retire les doublons.", "transform", Copy, "code", F_CODE, ["doublons", "unique"]),
  spec("transform.group_by", "Grouper", "Groupe par clé.", "transform", Group, "code", F_CODE, ["cluster", "clé"]),
  spec("transform.flatten", "Aplatir", "Simplifie les structures imbriquées.", "transform", Minimize2, "code", F_CODE, ["aplatit", "nested"]),
  spec("transform.json_merge", "Fusion JSON", "Fusionne des objets JSON.", "transform", GitMerge, "code", F_CODE, ["merge", "objet"]),
  spec("transform.json_parse", "Parse JSON", "Transforme du texte JSON en objet.", "transform", Braces, "code", F_CODE, ["parse", "objet"]),
  spec("transform.json_stringify", "Stringify JSON", "Transforme un objet en texte JSON.", "transform", FileJson, "code", F_CODE, ["texte", "serialize"]),
  spec("transform.datetime", "Date et heure", "Parse, format, timezone, calcul de délai.", "transform", Calendar, "code", F_CODE, ["date", "heure"]),
  spec("transform.number", "Nombre / monnaie", "Format, arrondi, conversion de devise.", "transform", Coins, "code", F_CODE, ["format", "devise"]),
  spec("transform.text", "Texte", "Trim, replace, split, regex, slug.", "transform", Type, "code", F_CODE, ["chaîne", "regex"]),
  spec("transform.template", "Template", "Génère du texte / HTML avec variables.", "transform", FileText, "code", F_CODE, ["gabarit", "variables"]),
  spec("transform.hash", "Hash", "SHA-256 pour intégrité / idempotence.", "transform", Fingerprint, "code", F_CODE, ["sha", "empreinte"]),
  spec("transform.encode", "Encode / decode", "Base64, URL encode.", "transform", Binary, "code", F_CODE, ["base64", "url"]),
  spec("transform.validate", "Validation schema", "Valide avec Zod ou JSON Schema.", "transform", ShieldCheck, "code", F_CODE, ["schéma", "zod"]),
  spec("transform.csv_parse", "CSV vers JSON", "Parse un fichier CSV.", "transform", FileSpreadsheet, "code", F_CODE, ["csv", "import"]),
  spec("transform.csv_generate", "JSON vers CSV", "Génère un export CSV.", "transform", FileSpreadsheet, "code", F_CODE, ["csv", "export"]),
  spec("transform.html_extract", "HTML extraction", "Sélectionne du contenu HTML par sélecteur CSS.", "transform", CodeXml, "code", F_CODE, ["scrape", "sélecteur"]),
];

// ── APIs et intégrations (25) ────────────────────────────────────────────────
const INTEGRATION_SPECS: WorkflowNodeSpec[] = [
  spec("integration.http", "HTTP Request", "REST universel : GET, POST, PUT, PATCH, DELETE.", "integration", Globe, "http", F_HTTP, ["rest", "api"]),
  spec("integration.graphql", "GraphQL", "Query / mutation GraphQL.", "integration", Network, "http", F_HTTP, ["query", "mutation"]),
  spec("integration.rest_connector", "REST connector", "Actions depuis une spec OpenAPI importée.", "integration", Plug, "http", F_HTTP, ["openapi", "swagger"]),
  spec("integration.webhook_send", "Webhook sortant", "Envoie un événement à un système externe.", "integration", Webhook, "http", F_HTTP, ["sortant", "event"]),
  spec("integration.stripe", "Stripe", "Checkout, client, invoice, subscription.", "integration", CreditCard, "code", F_PARAMS, ["paiement", "facture"]),
  spec("integration.email", "Resend / email", "Email transactionnel et templates.", "integration", Mail, "email", F_EMAIL, ["smtp", "template"]),
  spec("integration.Hash", "Hash", "Message, canal, thread.", "integration", Hash, "notify", F_NOTIFY, ["chat", "canal"]),
  spec("integration.teams", "Microsoft Teams", "Notifications entreprise.", "integration", Users, "notify", F_NOTIFY, ["message", "canal"]),
  spec("integration.discord", "Discord", "Message ou webhook Discord.", "integration", MessageSquare, "notify", F_NOTIFY, ["serveur", "salon"]),
  spec("integration.google_sheets", "Google Sheets", "Lit ou écrit des lignes.", "integration", FileSpreadsheet, "code", F_PARAMS, ["tableur", "google"]),
  spec("integration.google_drive", "Google Drive", "Fichiers et dossiers.", "integration", HardDrive, "code", F_PARAMS, ["fichiers", "google"]),
  spec("integration.microsoft_365", "Microsoft 365", "Outlook, Excel, OneDrive.", "integration", Briefcase, "code", F_PARAMS, ["outlook", "office"]),
  spec("integration.notion", "Notion", "Lit ou écrit pages et bases.", "integration", Notebook, "code", F_PARAMS, ["wiki", "pages"]),
  spec("integration.airtable", "Airtable", "Lit ou écrit des records.", "integration", Table2, "code", F_PARAMS, ["base", "records"]),
  spec("integration.postgres", "PostgreSQL", "DB externe via requêtes autorisées.", "integration", Database, "code", F_PARAMS, ["sql", "base"]),
  spec("integration.mysql", "MySQL", "DB externe (requêtes autorisées).", "integration", Database, "code", F_PARAMS, ["sql", "base"]),
  spec("integration.mongodb", "MongoDB", "Documents externes.", "integration", Leaf, "code", F_PARAMS, ["nosql", "documents"]),
  spec("integration.sftp", "SFTP", "Import / export sécurisé.", "integration", FolderTree, "code", F_PARAMS, ["fichiers", "sécurisé"]),
  spec("integration.ftp", "FTP", "Legacy — à éviter si possible.", "integration", FolderOpen, "code", F_PARAMS, ["legacy", "fichiers"]),
  spec("integration.mailbox", "SMTP / IMAP", "Lit et envoie des emails.", "integration", Inbox, "code", F_PARAMS, ["mail", "boîte"]),
  spec("integration.oauth2", "OAuth client", "Appels API avec connexion utilisateur.", "integration", KeyRound, "code", F_PARAMS, ["token", "connexion"]),
  spec("integration.erp_connector", "ERP / CRM", "SAP, Odoo, Salesforce, HubSpot via plugins.", "integration", Boxes, "code", F_PARAMS, ["sap", "odoo", "crm"]),
  spec("integration.mqtt", "MQTT", "Messagerie IoT (publish / subscribe).", "integration", Radio, "code", F_PARAMS, ["iot", "topic"]),
  spec("integration.opcua", "OPC-UA Gateway", "Passage sécurisé vers les systèmes industriels.", "integration", Factory, "code", F_PARAMS, ["ot", "industrie"]),
  spec("integration.modbus", "Modbus Gateway", "Lecture / écriture via gateway — jamais depuis le navigateur.", "integration", Cable, "code", F_PARAMS, ["ot", "capteurs"]),
];

// ── Fichiers et documents (15) ───────────────────────────────────────────────
const FILE_SPECS: WorkflowNodeSpec[] = [
  spec("file.upload", "Upload", "Envoie vers le stockage objet.", "files", CloudUpload, "code", F_PARAMS, ["storage", "s3"]),
  spec("file.download", "Télécharger", "Obtient le contenu ou une URL signée.", "files", CloudDownload, "code", F_PARAMS, ["contenu", "get"]),
  spec("file.signed_url", "URL signée", "Accès temporaire sécurisé.", "files", Link2, "code", F_PARAMS, ["presigné", "temporaire"]),
  spec("file.delete", "Supprimer", "Supprime un fichier avec audit.", "files", FileX, "code", F_PARAMS, ["remove", "storage"]),
  spec("file.antivirus_scan", "Scan antivirus", "Vérifie les uploads.", "files", ShieldAlert, "code", F_PARAMS, ["virus", "sécurité"]),
  spec("file.ocr", "OCR", "Extrait le texte d'une image ou d'un PDF.", "files", ScanText, "code", F_PARAMS, ["texte", "image"]),
  spec("file.pdf_extract", "Lire PDF", "Extrait texte et métadonnées d'un PDF.", "files", FileText, "code", F_PARAMS, ["pdf", "extrait"]),
  spec("file.pdf_generate", "Générer PDF", "Produit rapport, facture, bon d'intervention.", "files", FileOutput, "code", F_PARAMS, ["rapport", "facture"]),
  spec("file.docx_generate", "Générer DOCX", "Produit un document Word.", "files", FileText, "code", F_PARAMS, ["word", "document"]),
  spec("file.xlsx_generate", "Générer XLSX", "Produit un tableur.", "files", FileSpreadsheet, "code", F_PARAMS, ["excel", "export"]),
  spec("file.xlsx_parse", "Lire XLSX", "Importe feuilles et lignes.", "files", FileInput, "code", F_PARAMS, ["excel", "import"]),
  spec("file.image_convert", "Convertir image", "Resize, WebP, compression.", "files", Hash, "code", F_PARAMS, ["webp", "resize"]),
  spec("file.qr_generate", "Générer QR code", "QR d'équipement, lien ou ticket.", "files", QrCode, "code", F_PARAMS, ["qr", "code-barres"]),
  spec("file.esign_request", "Pen électronique", "Envoie en Pen électronique.", "files", Pen, "code", F_PARAMS, ["esign", "contrat"]),
  spec("file.zip", "Archive ZIP", "Compresse des exports ou fichiers.", "files", Archive, "code", F_PARAMS, ["compresse", "archive"]),
];

// ── Communication (11) ───────────────────────────────────────────────────────
const COMMUNICATION_SPECS: WorkflowNodeSpec[] = [
  spec("notify.email", "Email", "Email transactionnel.", "communication", Send, "email", F_EMAIL, ["mail", "transactionnel"]),
  spec("notify.sms", "SMS", "Notification SMS.", "communication", Smartphone, "notify", F_NOTIFY, ["téléphone", "texto"]),
  spec("notify.whatsapp", "WhatsApp", "Message WhatsApp Business.", "communication", Phone, "notify", F_NOTIFY, ["message", "business"]),
  spec("notify.web_push", "Push web", "Notification navigateur.", "communication", Bell, "notify", F_NOTIFY, ["navigateur", "push"]),
  spec("notify.mobile_push", "Push mobile", "FCM / APNs (futur mobile).", "communication", Smartphone, "notify", F_NOTIFY, ["fcm", "apns"]),
  spec("notify.Hash", "Hash", "Alerte canal ou DM.", "communication", Hash, "notify", F_NOTIFY, ["canal", "message"]),
  spec("notify.teams", "Teams", "Alerte entreprise Microsoft Teams.", "communication", Users, "notify", F_NOTIFY, ["entreprise", "canal"]),
  spec("notify.in_app", "In-app", "Centre de notifications OmniBuild.", "communication", Inbox, "notify", F_NOTIFY, ["centre", "interne"]),
  spec("notify.escalate", "Escalade", "Relance si non lu / non traité.", "communication", TrendingUp, "notify", F_NOTIFY, ["relance", "priorité"]),
  spec("notify.digest", "Digest", "Synthèse journalière ou hebdomadaire.", "communication", Newspaper, "notify", F_NOTIFY, ["résumé", "quotidien"]),
  spec("notify.incident", "Incidents", "PagerDuty / Opsgenie / SMS selon gravité.", "communication", MailX, "notify", F_NOTIFY, ["astreinte", "pager"]),
];

// ── IA, RAG et agents (19) ───────────────────────────────────────────────────
const AI_SPECS: WorkflowNodeSpec[] = [
  spec("ai.llm_chat", "LLM Chat", "Génère ou structure du texte.", "ai", Bot, "code", F_PROMPT, ["gpt", "conversation"]),
  spec("ai.llm_structured", "LLM Structured Output", "Retourne un JSON validé par schéma.", "ai", Braces, "code", F_PROMPT, ["json", "schema"]),
  spec("ai.agent", "Agent", "Planifie et appelle des outils autorisés.", "ai", BrainCircuit, "code", F_PROMPT, ["autonome", "outils"]),
  spec("ai.tool", "Outil IA", "Expose une action contrôlée à l'agent.", "ai", Hash, "code", F_PARAMS, ["function", "outillage"]),
  spec("ai.embeddings", "Embeddings", "Vectorise du texte ou des documents.", "ai", Network, "code", F_PROMPT, ["vecteurs", "sémantique"]),
  spec("ai.vector_upsert", "Vector store upsert", "Ajoute des documents au RAG.", "ai", Database, "code", F_PARAMS, ["index", "rag"]),
  spec("ai.vector_search", "Vector search", "Recherche sémantique.", "ai", Scan, "code", F_PROMPT, ["similarité", "rag"]),
  spec("ai.rag_answer", "RAG answer", "Répond depuis les documents + sources.", "ai", Route, "code", F_PROMPT, ["retrieval", "sources"]),
  spec("ai.vision_ocr", "OCR IA", "Lit un document ou une image.", "ai", ScanText, "code", F_PARAMS, ["ocr", "document"]),
  spec("ai.vision", "Vision", "Analyse une image ou contrôle qualité.", "ai", Video, "code", F_PARAMS, ["image", "qualité"]),
  spec("ai.transcribe", "Speech-to-text", "Transcrit un audio.", "ai", Mic, "code", F_PARAMS, ["audio", "stt"]),
  spec("ai.tts", "Text-to-speech", "Génère de l'audio.", "ai", Volume2, "code", F_PARAMS, ["voix", "audio"]),
  spec("ai.classify", "Classification", "Classe ticket, document, demande.", "ai", Tags, "code", F_PROMPT, ["catégories", "routage"]),
  spec("ai.extract", "Extraction", "Extrait les champs d'une facture, rapport, bon.", "ai", ScanLine, "code", F_PROMPT, ["champs", "facture"]),
  spec("ai.summarize", "Résumé", "Résume un texte long.", "ai", AlignLeft, "code", F_PROMPT, ["synthèse", "tl;dr"]),
  spec("ai.translate", "Traduction", "Traduit du contenu métier.", "ai", Languages, "code", F_PROMPT, ["langue", "traduit"]),
  spec("ai.moderate", "Modération", "Filtre un contenu dangereux ou inapproprié.", "ai", ShieldCheck, "code", F_PROMPT, ["filtre", "sécurité"]),
  spec("ai.evaluate", "Évaluation", "Vérifie la qualité d'une sortie IA.", "ai", CircleCheck, "code", F_PROMPT, ["qualité", "eval"]),
  spec("ai.memory", "Mémoire", "Lit / écrit une mémoire conversationnelle limitée.", "ai", Brain, "code", F_PARAMS, ["conversation", "contexte"]),
];

// ── Sécurité, gouvernance et exploitation (14) ───────────────────────────────
const SECURITY_SPECS: WorkflowNodeSpec[] = [
  spec("security.check_permission", "Vérifier permission", "Contrôle RBAC / ABAC.", "security", UserCheck, "code", F_PARAMS, ["rbac", "droits"]),
  spec("security.assert_tenant", "Vérifier tenant", "Bloque le cross-tenant.", "security", Building2, "code", F_PARAMS, ["multi-tenant", "isolation"]),
  spec("security.redact", "Masquer données", "Retire PII / secrets avant logs ou IA.", "security", EyeOff, "code", F_PARAMS, ["pii", "anonymise"]),
  spec("security.encrypt", "Chiffrer", "Chiffre un payload ciblé.", "security", Lock, "code", F_PARAMS, ["chiffrement", "aes"]),
  spec("security.decrypt", "Déchiffrer", "Réservé au worker sécurisé.", "security", Unlock, "code", F_PARAMS, ["déchiffrement"]),
  spec("security.verify_signature", "Valider Pen", "Stripe / webhook / HMAC.", "security", Fingerprint, "code", F_PARAMS, ["hmac", "Pen"]),
  spec("security.human_approval", "Approval humain", "Validation d'une action sensible.", "security", UserCheck, "code", F_PARAMS, ["validation", "sensible"]),
  spec("security.audit", "Journal d'audit", "Écrit une action immuable.", "security", ScrollText, "log", F_LOG, ["traçabilité", "journal"]),
  spec("security.gdpr_export", "RGPD export", "Prépare l'export d'un utilisateur.", "security", FileOutput, "code", F_PARAMS, ["rgpd", "portabilité"]),
  spec("security.gdpr_delete", "RGPD effacement", "Orchestre suppression / anonymisation.", "security", ShieldX, "code", F_PARAMS, ["rgpd", "droit à l'oubli"]),
  spec("security.rotate_secret", "Rotation secret", "Renouvelle un credential.", "security", KeyRound, "code", F_PARAMS, ["credential", "rotation"]),
  spec("security.feature_flag", "Feature flag", "Active une fonctionnalité par tenant.", "security", Flag, "code", F_PARAMS, ["toggle", "activation"]),
  spec("security.check_quota", "Vérifier quota", "Bloque ou compte l'usage.", "security", Gauge, "code", F_PARAMS, ["limite", "usage"]),
  spec("security.risk_check", "Anti-fraude", "Score de risque d'une transaction.", "security", ShieldAlert, "code", F_PARAMS, ["fraude", "score"]),
];

// ── Opérations moteur (4) ────────────────────────────────────────────────────
const OPS_SPECS: WorkflowNodeSpec[] = [
  spec("ops.queue", "Queue", "Empile un job asynchrone (file de traitement).", "ops", ListOrdered, "code", F_PARAMS, ["file", "worker"]),
  spec("ops.dead_letter", "Dead-letter queue", "Met de côté les exécutions en échec pour analyse.", "ops", MailX, "code", F_PARAMS, ["dlq", "échec"]),
  spec("ops.error_handler", "Error handler", "Route les erreurs vers un traitement dédié.", "ops", LifeBuoy, "code", F_PARAMS, ["erreur", "route"]),
  spec("ops.sub_workflow", "Sub-workflow", "Invoque un flux interne (contrat d'entrée).", "ops", Workflow, "code", F_PARAMS, ["flux", "interne"]),
];

// ─── Catalogue consolidé ─────────────────────────────────────────────────────

export const WORKFLOW_NODE_SPECS: WorkflowNodeSpec[] = [
  ...TRIGGER_SPECS,
  ...IOT_SPECS,
  ...UI_SPECS,
  ...LOGIC_SPECS,
  ...DATA_SPECS,
  ...TRANSFORM_SPECS,
  ...INTEGRATION_SPECS,
  ...FILE_SPECS,
  ...COMMUNICATION_SPECS,
  ...AI_SPECS,
  ...SECURITY_SPECS,
  ...OPS_SPECS,
];

export const WORKFLOW_NODE_COUNT = WORKFLOW_NODE_SPECS.length;

/** Repli visuel pour les codes inconnus (nœuds importés, marketplace…). */
export const FALLBACK_NODE_SPEC: WorkflowNodeSpec = {
  code: "studio.node",
  label: "Nœud",
  description: "Nœud inconnu du catalogue (extension ou import).",
  category: "ops",
  icon: Workflow,
  base: "code",
  fields: ["params"],
};

export function nodeSpecByCode(code: string | undefined | null): WorkflowNodeSpec | null {
  if (!code) return null;
  return WORKFLOW_NODE_SPECS.find((s) => s.code === code) ?? null;
}

export function categoryById(id: WorkflowNodeCategoryId): WorkflowNodeCategory {
  return WORKFLOW_NODE_CATEGORIES.find((c) => c.id === id) ?? WORKFLOW_NODE_CATEGORIES[0];
}

/** Normalise une chaîne pour la recherche (casse + accents insensibles). */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Recherche plein texte dans le catalogue (libellé, code, description, mots-clés). */
export function searchNodeSpecs(query: string, categoryId?: WorkflowNodeCategoryId | "all"): WorkflowNodeSpec[] {
  const q = normalize(query.trim());
  return WORKFLOW_NODE_SPECS.filter((s) => {
    if (categoryId && categoryId !== "all" && s.category !== categoryId) return false;
    if (!q) return true;
    const haystack = normalize(
      [s.code, s.label, s.description, ...(s.keywords ?? [])].join(" ")
    );
    return q.split(/\s+/).every((token) => haystack.includes(token));
  });
}

/** Nombre de nœuds par catégorie (badges des groupes). */
export function countByCategory(): Record<WorkflowNodeCategoryId, number> {
  const counts = {} as Record<WorkflowNodeCategoryId, number>;
  for (const c of WORKFLOW_NODE_CATEGORIES) counts[c.id] = 0;
  for (const s of WORKFLOW_NODE_SPECS) counts[s.category] += 1;
  return counts;
}

// ─── Mapping vers les 9 exécuteurs du moteur ─────────────────────────────────

/** Opération db par défaut selon le code de nœud de données. */
const DB_OPERATION_BY_CODE: Record<string, string> = {
  "data.create": "create",
  "data.upsert": "create",
  "data.get": "find",
  "data.query": "find",
  "data.aggregate": "find",
  "data.update": "update",
  "data.bulk_update": "update",
  "data.delete": "delete",
  "data.bulk_delete": "delete",
};

/** Config par défaut d'un nœud catalogué (adaptée à son exécuteur de base). */
export function defaultConfigForSpec(specItem: WorkflowNodeSpec): WorkflowNodeConfig {
  switch (specItem.base) {
    case "webhook":
      return { path: "/mon-webhook", method: "POST" };
    case "timer":
      return { cron: "*/15 * * * *" };
    case "http":
      return { url: "https://api.exemple.com/ressource", method: "GET" };
    case "condition":
      return { expression: "total > 100" };
    case "email":
      return {
        to: "destinataire@exemple.com",
        subject: "Notification OmniBuild",
        body: "Bonjour,\n\nVoici votre notification.",
      };
    case "db": {
      const operation = DB_OPERATION_BY_CODE[specItem.code] ?? "find";
      return { operation, table: "", data: "{}", rowId: "" };
    }
    case "notify":
      return { message: specItem.label, to: "" };
    case "log":
      return { message: specItem.label, level: "info" };
    case "code":
    default:
      if (specItem.category === "ai") return { prompt: "" };
      if (specItem.category === "transform") return { code: "return input" };
      return { params: "{}" };
  }
}

/**
 * Construit un WorkflowNode complet depuis un code du catalogue.
 * Renvoie null si le code est inconnu.
 */
export function defaultNodeForCode(code: string): WorkflowNode | null {
  const specItem = nodeSpecByCode(code);
  if (!specItem) return null;
  return {
    id: crypto.randomUUID(),
    type: specItem.base,
    name: specItem.label,
    config: defaultConfigForSpec(specItem),
    catalogCode: specItem.code,
  };
}

// ─── Nœuds recommandés par composant du Builder (« Nœuds par palette UI ») ───

export interface ComponentNodeHint {
  /** Actions UI possibles depuis le panneau Propriétés. */
  uiActions: string[];
  /** Codes de nœuds serveur/données utiles pour ce composant. */
  serverNodes: string[];
}

export const COMPONENT_NODE_HINTS: Record<string, ComponentNodeHint> = {
  heading: { uiActions: ["Changer texte, couleur, visibilité, tooltip"], serverNodes: ["data.set_variable", "transform.template", "data.aggregate"] },
  text: { uiActions: ["Mettre à jour contenu, copier, masquer"], serverNodes: ["transform.template", "ai.summarize", "ai.translate"] },
  quote: { uiActions: ["Mettre en valeur, masquer"], serverNodes: ["transform.template"] },
  list: { uiActions: ["Ouvrir détail, recharger"], serverNodes: ["data.query"] },
  badge: { uiActions: ["Filtrer, mettre à jour statut"], serverNodes: ["data.aggregate"] },
  code: { uiActions: ["Exécuter, formater"], serverNodes: ["transform.json_parse"] },
  card: { uiActions: ["Ouvrir modal, naviguer, sélectionner"], serverNodes: ["data.get", "data.audit_log"] },
  divider: { uiActions: ["Modifier couleur, épaisseur, visibilité"], serverNodes: ["security.feature_flag"] },
  spacer: { uiActions: ["Ajuster taille, visibilité"], serverNodes: ["security.feature_flag"] },
  navbar: { uiActions: ["Naviguer, ouvrir menu, déconnexion"], serverNodes: ["security.check_permission", "data.audit_log"] },
  tabs: { uiActions: ["Changer onglet, lazy load, badge"], serverNodes: ["data.query", "security.check_permission"] },
  sidebar: { uiActions: ["Naviguer, replier, épingler"], serverNodes: ["security.check_permission", "data.user_preferences"] },
  input: { uiActions: ["Valider, nettoyer, afficher l'aide"], serverNodes: ["transform.validate", "data.get"] },
  textarea: { uiActions: ["Compteur, autosave, aperçu"], serverNodes: ["data.set_variable", "ai.summarize"] },
  select: { uiActions: ["Options, champ dépendant"], serverNodes: ["data.query", "data.get"] },
  checkbox: { uiActions: ["Cocher, champ conditionnel"], serverNodes: ["data.update", "data.audit_log"] },
  switch: { uiActions: ["Activer, confirmer"], serverNodes: ["security.feature_flag", "data.update"] },
  slider: { uiActions: ["Valeur en direct"], serverNodes: ["data.set_variable", "transform.number"] },
  date: { uiActions: ["Calendrier, plage"], serverNodes: ["transform.datetime", "trigger.datetime"] },
  file: { uiActions: ["Progression, annuler, aperçu"], serverNodes: ["file.upload", "file.antivirus_scan", "file.ocr"] },
  button: { uiActions: ["Toast, modal, navigation, reset"], serverNodes: ["logic.invoke_workflow", "data.create", "integration.stripe"] },
  table: { uiActions: ["Sélection, édition inline, refresh"], serverNodes: ["data.query", "data.aggregate", "transform.csv_generate"] },
  stat: { uiActions: ["Animer valeur, drill-down"], serverNodes: ["data.aggregate"] },
  timeline: { uiActions: ["Ouvrir événement, filtrer"], serverNodes: ["data.audit_log", "data.query"] },
  avatar: { uiActions: ["Ouvrir profil, initiales de repli"], serverNodes: ["data.get", "file.signed_url"] },
  image: { uiActions: ["Zoom, lightbox, remplacer"], serverNodes: ["file.upload", "file.signed_url", "file.ocr"] },
  video: { uiActions: ["Contrôler lecture, changer source"], serverNodes: ["file.signed_url", "file.image_convert"] },
  alert: { uiActions: ["Afficher statut, masquer"], serverNodes: ["notify.in_app", "security.feature_flag"] },
  progress: { uiActions: ["Afficher statut, arrêter"], serverNodes: ["data.set_variable"] },
  skeleton: { uiActions: ["Afficher/masquer pendant le chargement"], serverNodes: ["ui.set_loading"] },
};

// ─── Contrat JSON d'un nœud (extensible, exportable, validable) ──────────────

export interface WorkflowNodeContract {
  id: string;
  type: string;
  version: string;
  name: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  retry?: {
    maxAttempts: number;
    backoff?: "fixed" | "linear" | "exponential";
    initialDelayMs?: number;
  };
  timeoutMs?: number;
  permissions?: string[];
  tenantScope?: "required" | "optional" | "none";
  logPolicy?: { input: "raw" | "redacted" | "none"; output: "raw" | "redacted" | "none" };
}

export const NODE_CONTRACT_VERSION = "1.0.0";

/** Schéma zod du contrat (validation d'import / marketplace). */
export const nodeContractSchema = z.object({
  id: z.string().uuid(),
  type: z.string().regex(/^[a-z_]+\.[a-z_0-9]+$/, "type attendu : domaine.action (ex. data.create)"),
  version: z.string().min(1),
  name: z.string().min(1),
  position: z.object({ x: z.number(), y: z.number() }),
  config: z.record(z.string(), z.unknown()),
  inputSchema: z.record(z.string(), z.unknown()).optional(),
  outputSchema: z.record(z.string(), z.unknown()).optional(),
  retry: z
    .object({
      maxAttempts: z.number().int().min(0).max(10),
      backoff: z.enum(["fixed", "linear", "exponential"]).optional(),
      initialDelayMs: z.number().int().min(0).optional(),
    })
    .optional(),
  timeoutMs: z.number().int().min(100).max(3_600_000).optional(),
  permissions: z.array(z.string()).optional(),
  tenantScope: z.enum(["required", "optional", "none"]).optional(),
  logPolicy: z
    .object({
      input: z.enum(["raw", "redacted", "none"]),
      output: z.enum(["raw", "redacted", "none"]),
    })
    .optional(),
});

/** Exemple canonique du PRD (contrat du nœud « Créer une intervention »). */
export const WORKFLOW_NODE_CONTRACT_EXAMPLE: WorkflowNodeContract = {
  id: "3f8b3e09-c6ae-4822-b40b-93aa7bcdb118",
  type: "data.create",
  version: "1.0.0",
  name: "Créer une intervention",
  position: { x: 480, y: 240 },
  config: {
    model: "interventions",
    data: {
      equipment_id: "{{trigger.body.equipment_id}}",
      priority: "{{trigger.body.priority}}",
      status: "open",
    },
  },
  inputSchema: { type: "object" },
  outputSchema: { type: "object" },
  retry: { maxAttempts: 3, backoff: "exponential", initialDelayMs: 1000 },
  timeoutMs: 30000,
  permissions: ["data:interventions:create"],
  tenantScope: "required",
  logPolicy: { input: "redacted", output: "redacted" },
};

/** Permissions suggérées par catégorie (contrat exportable). */
const PERMISSIONS_BY_CATEGORY: Record<WorkflowNodeCategoryId, string[]> = {
  triggers: ["workflows:trigger"],
  iot: ["iot:connect"],
  ui: ["ui:control"],
  logic: ["workflows:control"],
  data: ["data:write"],
  transform: ["workflows:control"],
  integration: ["integrations:call"],
  files: ["files:write"],
  communication: ["notify:send"],
  ai: ["ai:invoke"],
  security: ["security:manage"],
  ops: ["ops:manage"],
};

/** Catégories dont les payloads sont masqués dans les logs par défaut. */
const REDACTED_CATEGORIES = new Set<WorkflowNodeCategoryId>(["data", "integration", "security", "ai", "files"]);

/** Code de contrat pour un nœud (catalogué ou exécuteur studio historique). */
export function contractCodeOf(node: Pick<WorkflowNode, "type" | "catalogCode">): string {
  if (node.catalogCode) return node.catalogCode;
  return `studio.${node.type}`;
}

/**
 * Génère le contrat JSON d'un nœud du studio (export compatible marketplace).
 * Position verticale par défaut : chaîne x=240, y=80+index*160.
 */
export function toNodeContract(node: WorkflowNode, index = 0): WorkflowNodeContract {
  const specItem = nodeSpecByCode(node.catalogCode);
  const category: WorkflowNodeCategoryId = specItem?.category ?? "ops";
  const redacted = REDACTED_CATEGORIES.has(category);
  return {
    id: node.id,
    type: contractCodeOf(node),
    version: NODE_CONTRACT_VERSION,
    name: node.name || specItem?.label || "Nœud",
    position: { x: 240, y: 80 + index * 160 },
    config: node.config as Record<string, unknown>,
    inputSchema: { type: "object" },
    outputSchema: { type: "object" },
    retry: { maxAttempts: 3, backoff: "exponential", initialDelayMs: 1000 },
    timeoutMs: 30000,
    permissions: PERMISSIONS_BY_CATEGORY[category],
    tenantScope: "required",
    logPolicy: { input: redacted ? "redacted" : "raw", output: redacted ? "redacted" : "raw" },
  };
}

// ─── Exemple métier industriel (PRD) ─────────────────────────────────────────

export interface IndustrialExampleStep {
  code: string;
  name: string;
  note: string;
}

export const INDUSTRIAL_EXAMPLE: {
  title: string;
  scenario: string;
  steps: IndustrialExampleStep[];
} = {
  title: "Exemple métier industriel — intervention sur seuil de température",
  scenario:
    "Un technicien scanne le QR code d'un équipement ; si la température mesurée dépasse un seuil, OmniBuild crée une intervention et alerte le responsable maintenance.",
  steps: [
    { code: "trigger.ui.click", name: "Scan QR équipement", note: "Événement UI du scanner QR (trigger.ui.*) " },
    { code: "data.get", name: "Charger l'équipement", note: "Record équipement par identifiant" },
    { code: "trigger.iot.telemetry", name: "Télémétrie MQTT", note: "Mesure de température entrante" },
    { code: "logic.if", name: "Température > seuil ?", note: "Branchement conditionnel" },
    { code: "data.create", name: "Créer l'intervention", note: "Statut « open », priorité du scan" },
    { code: "notify.teams", name: "Alerter l'équipe", note: "Canal maintenance" },
    { code: "notify.email", name: "E-mail responsable", note: "Responsable maintenance" },
    { code: "ui.show_toast", name: "Confirmer au technicien", note: "Feedback dans l'app" },
    { code: "security.audit", name: "Journal d'audit", note: "Action sensible — immuable" },
    { code: "data.update", name: "Mettre à jour l'équipement", note: "Branche sinon — dernier contrôle" },
  ],
};

/** Événements UI universels (13 du PRD) formatés pour l'API / l'affichage catalogue. */
export function uiEventCatalog() {
  return BUILDER_UNIVERSAL_EVENTS;
}
