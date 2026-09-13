/**
 * Types partagés du frontend Forge Studio.
 * Miroir strict du contrat API défini dans worklog.md (Task ID 1).
 */

import type { ProjectStatus, ProjectType } from "@/lib/project-templates";

// ─── Roadmap ────────────────────────────────────────────────────────────────

export interface RoadmapTask {
  id: string;
  title: string;
  category: string;
  done: boolean;
  /** Statut tri-state (PRD §2.3) : todo | doing | done — done ≡ done=true. */
  status?: "todo" | "doing" | "done";
}

export interface RoadmapDeliverable {
  id: string;
  title: string;
  done: boolean;
  /** Statut tri-state (PRD §2.3) : todo | doing | done. */
  status?: "todo" | "doing" | "done";
}

export interface RoadmapSprint {
  sprint: number;
  title: string;
  weeks: string;
  objective: string;
  deliverables: RoadmapDeliverable[];
  tasks: RoadmapTask[];
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  objective: string;
  sprints: RoadmapSprint[];
}

export interface RoadmapStats {
  done: number;
  total: number;
}

export interface RoadmapData {
  phases: RoadmapPhase[];
  stats: RoadmapStats;
  deliverableStats: RoadmapStats;
}

// ─── Builder UI (pages) ─────────────────────────────────────────────────────

export interface PageSummary {
  id: string;
  name: string;
  updatedAt: string;
}

export interface PageDetail {
  id: string;
  name: string;
  layoutJson: string;
}

/**
 * Palette complète du Builder UI, organisée en catégories :
 *  Contenu (heading, text, quote, list, badge, code) ·
 *  Mise en page (card, divider, spacer) ·
 *  Navigation (navbar, tabs, sidebar) ·
 *  Formulaires (input, textarea, select, checkbox, switch, slider, date, file) ·
 *  Actions (button) · Données (table, stat, timeline, avatar) ·
 *  Médias (image, video) · Feedback (alert, progress, skeleton).
 */
export type BuilderType =
  | "heading"
  | "text"
  | "quote"
  | "list"
  | "badge"
  | "code"
  | "card"
  | "divider"
  | "spacer"
  | "navbar"
  | "tabs"
  | "sidebar"
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "slider"
  | "date"
  | "file"
  | "button"
  | "table"
  | "stat"
  | "timeline"
  | "avatar"
  | "image"
  | "video"
  | "alert"
  | "progress"
  | "skeleton";

export type BuilderColor = "default" | "muted" | "emerald" | "amber" | "rose";
export type BuilderSize = "sm" | "md" | "lg" | "xl";
export type HeadingLevel = "h1" | "h2" | "h3";
export type BuilderButtonVariant = "default" | "secondary" | "outline" | "destructive";
/** Ton d'une alerte (sémantique visuelle). */
export type BuilderTone = "default" | "success" | "warning" | "error";

/**
 * Événements UI universels d'un composant (PRD « Événements UI universels »).
 * Chaque événement correspond à un nœud déclencheur généré (trigger.ui.* —
 * voir src/lib/builder-events.ts) : « load » = onMount, « visible » = entrée
 * dans le viewport, les événements clavier/focus suivent le DOM.
 */
export type BuilderEventType =
  | "load" // onMount — au chargement (montage) du composant
  | "visible" // onVisible — le composant apparaît à l'écran
  | "click" // onClick
  | "dblclick" // onDoubleClick
  | "hover" // onHoverEnter
  | "hoverleave" // onHoverLeave
  | "focus" // onFocus
  | "blur" // onBlur
  | "keydown" // onKeyDown
  | "keyup" // onKeyUp
  | "change" // onChange (contrôles de formulaire)
  | "error" // onError — erreur de rendu, de chargement ou de données
  | "dataloaded" // onDataLoaded — source de données chargée
  | "permission"; // onPermissionDenied — utilisateur sans permission

/** Type d'action exécutée quand l'événement se produit. */
export type BuilderActionKind = "workflow" | "link" | "toast" | "page" | "copy";

/** Action configurée depuis le panneau Propriétés du builder. */
export interface BuilderAction {
  id: string;
  kind: BuilderActionKind;
  /** kind = "workflow" : workflow à exécuter. */
  workflowId?: string;
  /** Nom dénormalisé (affichage résilient si le workflow est supprimé). */
  workflowName?: string;
  /** kind = "link" : URL à ouvrir. */
  url?: string;
  /** kind = "toast" : message à afficher. */
  message?: string;
  /** kind = "page" : page interne du projet à ouvrir dans le Builder. */
  pageId?: string;
  /** Nom dénormalisé de la page cible (affichage résilient). */
  pageName?: string;
}

/** Liaison événement → actions d'un composant du builder. */
export interface BuilderEvent {
  id: string;
  event: BuilderEventType;
  actions: BuilderAction[];
}

export interface BuilderProps {
  text?: string;
  level?: HeadingLevel;
  variant?: BuilderButtonVariant;
  placeholder?: string;
  color?: BuilderColor;
  size?: BuilderSize;
  src?: string;
  columns?: number;
  /** select : une option par ligne. */
  options?: string;
  /** navbar / tabs / sidebar : éléments de navigation, un par ligne. */
  links?: string;
  /** slider / progress : pourcentage 0-100 (number) · stat : valeur affichée (string, ex. « 1 284 » ou « +12 % »). */
  value?: number | string;
  /** alert : ton sémantique. */
  tone?: BuilderTone;
}

export interface BuilderComponent {
  id: string;
  type: BuilderType;
  props: BuilderProps;
  /** Actions & workflows configurables (persistés dans layoutJson). */
  events?: BuilderEvent[];
}

// ─── Données (tables visuelles) ─────────────────────────────────────────────

export type FieldType = "string" | "number" | "boolean" | "datetime" | "json";

export interface TableField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  unique: boolean;
  defaultValue: string | null;
}

export interface TableSummary {
  id: string;
  name: string;
  createdAt: string;
  fields: TableField[];
  _count: { rows: number };
}

export interface TableRowData {
  id: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface TableDetail {
  id: string;
  name: string;
  createdAt: string;
  fields: TableField[];
  rows: TableRowData[];
}

/** Forme brute renvoyée par GET /api/tables/[tableId] (data = chaîne JSON). */
export interface TableDetailRaw {
  id: string;
  name: string;
  createdAt: string;
  fields: TableField[];
  rows: { id: string; data: string; createdAt: string }[];
}

// ─── Workflows ──────────────────────────────────────────────────────────────

export type NodeType =
  | "webhook"
  | "timer"
  | "http"
  | "condition"
  | "code"
  | "email"
  | "db"
  | "notify"
  | "log";
export type WorkflowStatus = "draft" | "active" | "paused";

export interface WorkflowNodeConfig {
  path?: string;
  method?: string;
  cron?: string;
  url?: string;
  expression?: string;
  code?: string;
  to?: string;
  subject?: string;
  body?: string;
  /** nœud db : find | create | update | delete. */
  operation?: string;
  /** nœud db : nom de la table visuelle (DataTable.name). */
  table?: string;
  /** nœud db : données JSON de l'enregistrement (create/update). */
  data?: string;
  /** nœud db : id de ligne cible (update/delete). */
  rowId?: string;
  /** nœuds notify / log : message affiché/journalisé. */
  message?: string;
  /** nœud log : info | warn | error. */
  level?: string;
  /** Nœuds catalogués IA : consigne / prompt principal. */
  prompt?: string;
  /** Nœuds catalogués génériques : paramètres JSON libres (config avancée). */
  params?: string;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: WorkflowNodeConfig;
  /**
   * Code du nœud catalogué (ex. « data.create », « ai.rag_answer ») —
   * la palette du studio ajoute des nœuds catalogués dont « type » reste
   * l'un des 9 exécuteurs de base (webhook, timer, http, condition, code,
   * email, db, notify, log). Absent pour les nœuds créés avant Task 19.
   */
  catalogCode?: string;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  _count: { runs: number };
  lastRun: { status: string; createdAt: string } | null;
}

export interface WorkflowDetail {
  id: string;
  name: string;
  status: string;
  nodesJson: string;
}

export interface RunLog {
  nodeId: string;
  type: string;
  title: string;
  status: string;
  message: string;
  at: string;
  durationMs: number;
}

export interface WorkflowRunResult {
  id: string;
  status: string;
  durationMs: number;
  logs: RunLog[];
}

/** Exécution de l'historique (logsJson parsé côté client). */
export interface WorkflowRunRecord {
  id: string;
  status: string;
  durationMs: number;
  createdAt: string;
  logs: RunLog[];
}

/** Forme brute de GET /api/workflows/[workflowId]/runs. */
export interface WorkflowRunRaw {
  id: string;
  status: string;
  durationMs: number;
  logsJson: string;
  createdAt: string;
}

// ─── Design System (checklist PRD §8) ───────────────────────────────────

/** Case cochée de la checklist design system (clé « componentId:check »). */
export interface DesignCheckItem {
  key: string;
  done: boolean;
  updatedAt: string;
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface AnalyticsTotals {
  pages: number;
  tables: number;
  fields: number;
  rows: number;
  workflows: number;
  runs: number;
  runsSuccess: number;
  runsError: number;
  tasksDone: number;
  tasksTotal: number;
}

export interface RunsByWorkflow {
  name: string;
  success: number;
  error: number;
}

export interface ActivityDay {
  date: string;
  runs: number;
}

export interface AnalyticsData {
  totals: AnalyticsTotals;
  runsByWorkflow: RunsByWorkflow[];
  activityByDay: ActivityDay[];
  planUsage: { pages: number; tables: number; rows: number; workflows: number };
}

// ─── Billing ────────────────────────────────────────────────────────────────

export interface SubscriptionInfo {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

export interface BillingLimits {
  projects: number | null;
  pages: number | null;
  tables: number | null;
  rows: number | null;
  workflows: number | null;
}

export interface BillingUsage {
  pages: number;
  tables: number;
  rows: number;
  workflows: number;
}

export interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  meta: string | null;
  createdAt: string;
}

export interface BillingData {
  subscription: SubscriptionInfo;
  limits: BillingLimits;
  usage: BillingUsage;
  audit: AuditEntry[];
}

// ─── Projets (« Lanceur de projets ») ───────────────────────────────────────

/** Pack PRD d'origine d'un projet (exposé par GET /api/projects). */
export interface ProjectPackInfo {
  id: string;
  label: string;
  modules: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  type: ProjectType;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  /** Projet lancé depuis un Pack PRD (null sinon). */
  pack: ProjectPackInfo | null;
  counts: { pages: number; tables: number; workflows: number; rows: number };
  /** Avancement global de la feuille de route du projet (tâches + livrables). */
  roadmap: { done: number; total: number };
}

/** Statistiques de la feuille de route générée à la création d'un projet. */
export interface CreatedRoadmap {
  phases: number;
  sprints: number;
  tasks: number;
  deliverables: number;
}

export interface ProjectsData {
  projects: ProjectSummary[];
  stats: { active: number; archived: number; pages: number; tables: number; workflows: number; rows: number };
  limits: { plan: string; used: number; max: number | null };
}
