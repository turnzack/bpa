"use client";

/**
 * Interface complète d'un Pack PRD (« Pack Studio »).
 *
 * Ouverte en plein écran dès qu'un pack est sélectionné dans le lanceur de
 * projets : elle regroupe TOUT ce que le pack va générer —
 * - colonne de gauche : configuration du projet (nom, description), sélection
 *   des modules PRD en direct et résumé « ce qui sera créé » ;
 * - onglet Modules : les modules PRD détaillés (MISSION / STYLE & DESIGN /
 *   MAPPING VFS), avec le sprint de la spirale 2 où chacun atterrit ;
 * - onglet Starter : aperçu fidèle des pages (mini-wireframe), des tables
 *   (champs + lignes d'exemple) et des workflows (chaîne de nœuds) ;
 * - onglet Feuille de route : plan spiralaire complet, recalculé en direct
 *   selon les modules cochés.
 *
 * Composant 100 % présentationnel : l'état (nom, description, modules, création)
 * reste la propriété du lanceur de projets (projects-view.tsx), qui réutilise
 * le même POST /api/projects que le wizard classique.
 */

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Braces,
  CheckCircle2,
  Clock,
  Database,
  FileCode2,
  GitBranch,
  Globe,
  Info,
  LayoutPanelTop,
  Loader2,
  Mail,
  Map as MapIcon,
  Package,
  Palette,
  Plus,
  Target,
  Webhook,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ProjectPack } from "@/lib/project-packs";
import type {
  TemplateComponent,
  TemplatePage,
  TemplateTable,
  TemplateWorkflow,
} from "@/lib/project-templates";
import {
  buildPackRoadmapTemplate,
  getPackRoadmapStats,
  PACK_MODULES_PER_SPRINT,
} from "@/lib/pack-roadmap";

// ─── Helpers d'affichage ────────────────────────────────────────────────────

function pl(n: number, s: string): string {
  return `${n} ${s}${n > 1 ? "s" : ""}`;
}

/** Couleurs (sans bleu/indigo) des catégories de tâches. */
const CATEGORY_BADGES: Record<string, string> = {
  Frontend: "bg-emerald-100 text-emerald-800",
  Design: "bg-rose-100 text-rose-800",
  Docs: "bg-zinc-100 text-zinc-700",
  Data: "bg-amber-100 text-amber-800",
  Archio: "bg-violet-100 text-violet-800",
  QA: "bg-teal-100 text-teal-800",
  Dev: "bg-lime-100 text-lime-800",
  Infra: "bg-orange-100 text-orange-800",
  Launch: "bg-fuchsia-100 text-fuchsia-800",
};

const NODE_ICONS: Record<TemplateWorkflow["nodes"][number]["type"], LucideIcon> = {
  webhook: Webhook,
  timer: Clock,
  http: Globe,
  condition: GitBranch,
  code: Braces,
  email: Mail,
};

// ─── Mini-wireframe d'une page du starter ───────────────────────────────────

function WireframeBlock({ comp }: { comp: TemplateComponent }) {
  switch (comp.type) {
    case "heading":
      return (
        <p
          className={cn(
            "font-semibold leading-tight",
            comp.props.level === "h1" ? "text-sm" : "text-xs"
          )}
        >
          {String(comp.props.text ?? "Titre")}
        </p>
      );
    case "text":
      return (
        <p className="text-[11px] leading-snug text-zinc-500">
          {String(comp.props.text ?? "Paragraphe")}
        </p>
      );
    case "button":
      return (
        <span className="inline-flex w-fit items-center rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white">
          {String(comp.props.text ?? comp.props.label ?? "Bouton")}
        </span>
      );
    case "input":
      return (
        <span className="block truncate rounded-md border bg-white px-2 py-1 text-[10px] text-zinc-400">
          {String(comp.props.placeholder ?? comp.props.label ?? "Champ de saisie")}
        </span>
      );
    case "card":
      return (
        <span className="block rounded-lg border bg-white px-2 py-1.5 text-[10px] leading-snug text-zinc-600">
          {String(comp.props.text ?? comp.props.title ?? "Carte")}
        </span>
      );
    case "image":
      return (
        <span className="flex h-12 items-center justify-center rounded-md border border-dashed bg-zinc-100 text-[10px] text-zinc-400">
          Image
        </span>
      );
    case "table": {
      const cols = Math.min(Math.max(Number(comp.props.columns ?? 3), 1), 6);
      return (
        <span className="block space-y-1 rounded-md border bg-white p-1.5">
          <span className="flex gap-1">
            {Array.from({ length: cols }).map((_, i) => (
              <span key={i} className="h-2 flex-1 rounded-sm bg-zinc-300" />
            ))}
          </span>
          <span className="flex gap-1">
            {Array.from({ length: cols }).map((_, i) => (
              <span key={i} className="h-2 flex-1 rounded-sm bg-zinc-200" />
            ))}
          </span>
          <span className="flex gap-1">
            {Array.from({ length: cols }).map((_, i) => (
              <span key={i} className="h-2 flex-1 rounded-sm bg-zinc-100" />
            ))}
          </span>
        </span>
      );
    }
    default:
      return null;
  }
}

function StarterPageCard({ page }: { page: TemplatePage }) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium">{page.name}</p>
        <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
          {pl(page.components.length, "composant")}
        </Badge>
      </div>
      <div className="mt-2 space-y-1.5 rounded-lg bg-zinc-50 p-3" aria-hidden="true">
        {page.components.map((comp, i) => (
          <WireframeBlock key={i} comp={comp} />
        ))}
      </div>
    </article>
  );
}

function StarterTableCard({ table }: { table: TemplateTable }) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium">{table.name}</p>
        <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
          {pl(table.rows.length, "ligne d'exemple")}
        </Badge>
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-wide text-zinc-400">
              <th scope="col" className="py-1.5 pr-3 font-medium">Champ</th>
              <th scope="col" className="py-1.5 pr-3 font-medium">Type</th>
              <th scope="col" className="py-1.5 font-medium">Contraintes</th>
            </tr>
          </thead>
          <tbody>
            {table.fields.map((field) => (
              <tr key={field.name} className="border-b last:border-0">
                <td className="py-1.5 pr-3 font-medium text-zinc-700">{field.name}</td>
                <td className="py-1.5 pr-3 text-zinc-500">{field.type}</td>
                <td className="py-1.5 text-zinc-500">
                  {[
                    field.required ? "requis" : null,
                    field.unique ? "unique" : null,
                    field.defaultValue ? `défaut : ${field.defaultValue}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function StarterWorkflowCard({ workflow }: { workflow: TemplateWorkflow }) {
  return (
    <article className="rounded-xl border bg-white p-4">
      <p className="text-sm font-medium">{workflow.name}</p>
      <ol className="mt-3">
        {workflow.nodes.map((node, i) => {
          const Icon = NODE_ICONS[node.type] ?? Braces;
          return (
            <li key={i} className="relative flex items-start gap-2.5 pb-3 last:pb-0">
              {i < workflow.nodes.length - 1 && (
                <span
                  className="absolute left-[13px] top-8 h-[calc(100%-2rem)] w-px bg-zinc-200"
                  aria-hidden="true"
                />
              )}
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-zinc-50 text-zinc-500">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 pt-0.5">
                <span className="block truncate text-xs font-medium text-zinc-700">
                  {node.name}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-zinc-400">
                  {node.type}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </article>
  );
}

// ─── Carte d'un module PRD ──────────────────────────────────────────────────

function ModuleCard({
  module,
  checked,
  sprint,
  onToggle,
}: {
  module: ProjectPack["modules"][number];
  checked: boolean;
  sprint: number | null;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 transition-colors hover:border-amber-300",
        checked ? "border-amber-300" : "opacity-70"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5"
        aria-label={`Inclure le module ${module.title}`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium">{module.title}</span>
          <Badge
            variant="outline"
            className={cn(
              "border-transparent text-[10px]",
              CATEGORY_BADGES[module.category] ?? "bg-zinc-100 text-zinc-700"
            )}
          >
            {module.category}
          </Badge>
          {checked && sprint !== null ? (
            <Badge
              variant="outline"
              className="border-amber-300 bg-amber-50 text-[10px] text-amber-800"
            >
              Spirale 2 · Sprint {sprint}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] font-normal text-zinc-400">
              Hors sélection
            </Badge>
          )}
        </div>
        <div className="mt-2 space-y-1.5 text-xs leading-snug">
          <p className="flex items-start gap-1.5">
            <Target className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span className="min-w-0 text-zinc-600">
              <span className="font-semibold text-zinc-500">Mission — </span>
              {module.mission}
            </span>
          </p>
          {module.style && (
            <p className="flex items-start gap-1.5">
              <Palette className="mt-0.5 size-3.5 shrink-0 text-rose-500" aria-hidden="true" />
              <span className="min-w-0 text-zinc-600">
                <span className="font-semibold text-zinc-500">Style & design — </span>
                {module.style}
              </span>
            </p>
          )}
          {module.mapping.length > 0 && (
            <p className="flex items-start gap-1.5">
              <FileCode2 className="mt-0.5 size-3.5 shrink-0 text-violet-500" aria-hidden="true" />
              <span className="flex min-w-0 flex-wrap gap-1">
                {module.mapping.map((file) => (
                  <code
                    key={file}
                    className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600"
                  >
                    {file}
                  </code>
                ))}
              </span>
            </p>
          )}
        </div>
      </div>
    </label>
  );
}

// ─── Résumé des ressources dans la colonne de gauche ────────────────────────

function ResourceChips({
  icon: Icon,
  label,
  names,
}: {
  icon: LucideIcon;
  label: string;
  names: string[];
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {names.map((name) => (
          <Badge
            key={name}
            variant="outline"
            className="max-w-full bg-white px-1.5 text-[10px] font-normal"
          >
            <span className="truncate">{name}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}

// ─── Interface principale ───────────────────────────────────────────────────

export interface PackStudioProps {
  open: boolean;
  pack: ProjectPack;
  icon: LucideIcon;
  /** Modules retenus (état possédé par le lanceur de projets). */
  selectedModules: string[];
  name: string;
  description: string;
  creating: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onToggleModule: (key: string) => void;
  onSetModules: (keys: string[]) => void;
  onCreate: () => void;
  /** Revenir à la galerie modèles / packs. */
  onBack: () => void;
  /** Fermer sans créer. */
  onClose: () => void;
}

type StudioTab = "modules" | "starter" | "roadmap";

export default function PackStudio({
  open,
  pack,
  icon: Icon,
  selectedModules,
  name,
  description,
  creating,
  onNameChange,
  onDescriptionChange,
  onToggleModule,
  onSetModules,
  onCreate,
  onBack,
  onClose,
}: PackStudioProps) {
  const [tab, setTab] = useState<StudioTab>("modules");

  const allKeys = useMemo(() => pack.modules.map((m) => m.key), [pack]);
  const selectedCount = selectedModules.length;
  const progress = allKeys.length > 0 ? (selectedCount / allKeys.length) * 100 : 0;

  /** Sprint de la spirale 2 où atterrit chaque module coché (ordre du pack). */
  const sprintByKey = useMemo(() => {
    const map = new Map<string, number>();
    let count = 0;
    for (const mod of pack.modules) {
      if (selectedModules.includes(mod.key)) {
        map.set(mod.key, Math.floor(count / PACK_MODULES_PER_SPRINT) + 1);
        count += 1;
      }
    }
    return map;
  }, [pack, selectedModules]);

  const roadmapTemplate = useMemo(
    () => buildPackRoadmapTemplate(pack, selectedModules),
    [pack, selectedModules]
  );
  const stats = useMemo(
    () => getPackRoadmapStats(pack, selectedModules),
    [pack, selectedModules]
  );

  const canCreate = !creating && name.trim().length >= 2 && selectedCount > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-[1440px] sm:rounded-2xl">
        {/* ── En-tête ─────────────────────────────────────────────────────── */}
        <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b px-4 py-3 pr-14 text-left sm:px-5">
          <Button
            variant="outline"
            size="icon"
            className="size-8 shrink-0"
            onClick={onBack}
            aria-label="Retour au choix des modèles et packs"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-base">
              Pack « {pack.label} »
            </DialogTitle>
            <DialogDescription className="truncate text-xs font-normal">
              {pack.tagline}
            </DialogDescription>
          </div>
          <div className="hidden shrink-0 items-center gap-1.5 md:flex">
            <Badge variant="outline" className="border-amber-300 text-amber-800">
              {selectedCount}/{allKeys.length} modules
            </Badge>
            <Badge variant="outline">{pl(pack.pages.length, "page")}</Badge>
            <Badge variant="outline">{pl(pack.tables.length, "table")}</Badge>
            <Badge variant="outline">{pl(pack.workflows.length, "workflow")}</Badge>
          </div>
        </DialogHeader>

        {/* ── Corps : configuration + onglets ─────────────────────────────── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* Colonne de gauche : configuration du projet */}
          <aside className="shrink-0 space-y-4 border-b bg-zinc-50/70 p-4 sm:p-5 lg:w-[350px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="space-y-1.5">
              <Label htmlFor="pack-studio-name">Nom du projet</Label>
              <Input
                id="pack-studio-name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder={pack.nameSuggestion}
                maxLength={80}
                autoFocus
              />
              {name.trim().length > 0 && name.trim().length < 2 && (
                <p className="text-xs text-red-600">
                  Le nom doit contenir au moins 2 caractères.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pack-studio-description">Description</Label>
                <span className="text-xs tabular-nums text-zinc-400">
                  {description.length}/300
                </span>
              </div>
              <Textarea
                id="pack-studio-description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                maxLength={300}
                rows={3}
              />
            </div>

            <div className="space-y-2 rounded-xl border border-amber-200 bg-white p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Package className="size-4 text-amber-600" aria-hidden="true" />
                  Modules PRD
                </p>
                <Badge variant="outline" className="border-amber-300 text-amber-800">
                  {selectedCount}/{allKeys.length}
                </Badge>
              </div>
              <Progress
                value={progress}
                className="h-1.5"
                aria-label={`${selectedCount} modules sur ${allKeys.length} sélectionnés`}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 flex-1 px-2 text-xs"
                  onClick={() => onSetModules(allKeys)}
                  disabled={selectedCount === allKeys.length}
                >
                  Tout cocher
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 flex-1 px-2 text-xs"
                  onClick={() => onSetModules([])}
                  disabled={selectedCount === 0}
                >
                  Tout décocher
                </Button>
              </div>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Les modules cochés, pris dans l'ordre du pack, sont regroupés par{" "}
                {PACK_MODULES_PER_SPRINT} dans les sprints de la spirale 2.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border bg-white p-3.5">
              <p className="text-sm font-medium">Ce qui sera créé</p>
              <ResourceChips
                icon={LayoutPanelTop}
                label="Pages"
                names={pack.pages.map((p) => p.name)}
              />
              <ResourceChips
                icon={Database}
                label="Tables"
                names={pack.tables.map((t) => t.name)}
              />
              <ResourceChips
                icon={Workflow}
                label="Workflows"
                names={pack.workflows.map((w) => w.name)}
              />
              <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2.5">
                <p className="flex items-center gap-1.5 text-xs font-medium text-amber-900">
                  <MapIcon className="size-3.5" aria-hidden="true" />
                  Feuille de route spiralaire
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-amber-900/80">
                  {stats.phases} spirales · {stats.sprints} sprints · {stats.tasks} tâches ·{" "}
                  {stats.deliverables} livrables
                </p>
              </div>
              {selectedCount === 0 && (
                <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Sélectionnez au moins un module pour lancer le projet.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={onCreate}
                disabled={!canCreate}
              >
                {creating ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Création…
                  </>
                ) : (
                  <>
                    <Plus className="size-4" aria-hidden="true" />
                    Créer le projet
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] leading-snug text-muted-foreground">
                Pages, tables, workflows et feuille de route seront générés
                immédiatement — tout reste modifiable ensuite.
              </p>
            </div>
          </aside>

          {/* Zone principale : 3 onglets */}
          <section className="flex min-w-0 flex-1 flex-col">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as StudioTab)}
              className="gap-0 lg:min-h-0 lg:flex-1"
            >
              <div className="shrink-0 border-b px-4 pt-3 sm:px-5">
                <TabsList className="h-9 w-full justify-start overflow-x-auto bg-zinc-100">
                  <TabsTrigger value="modules" className="flex-none gap-1.5">
                    Modules
                    <span className="rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-800">
                      {selectedCount}/{allKeys.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="starter" className="flex-none">
                    Starter
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="flex-none gap-1.5">
                    Feuille de route
                    <span className="rounded-full bg-emerald-100 px-1.5 text-[10px] font-semibold text-emerald-800">
                      {stats.sprints} sprints
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ── Onglet Modules ─────────────────────────────────────────── */}
              <TabsContent value="modules" className="flex-1 p-4 sm:p-5 lg:overflow-y-auto">
                <div className="space-y-3">
                  <p className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-900">
                    Chaque module PRD détaillé ci-dessous devient une tâche de la feuille de
                    route. Les badges « Spirale 2 · Sprint X » se recalculent en direct selon
                    votre sélection.
                  </p>
                  {pack.modules.map((module) => (
                    <ModuleCard
                      key={module.key}
                      module={module}
                      checked={selectedModules.includes(module.key)}
                      sprint={sprintByKey.get(module.key) ?? null}
                      onToggle={() => onToggleModule(module.key)}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* ── Onglet Starter ─────────────────────────────────────────── */}
              <TabsContent value="starter" className="flex-1 p-4 sm:p-5 lg:overflow-y-auto">
                <div className="space-y-6">
                  <p className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 text-xs leading-relaxed text-emerald-900">
                    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    Le starter complet est créé quelle que soit la sélection : ces pages,
                    tables et workflows arrivent prêts à l'emploi. Les modules cochés, eux,
                    pilotent la feuille de route.
                  </p>

                  <section aria-labelledby="pack-starter-pages" className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3
                        id="pack-starter-pages"
                        className="flex items-center gap-1.5 text-sm font-semibold"
                      >
                        <LayoutPanelTop
                          className="size-4 text-emerald-600"
                          aria-hidden="true"
                        />
                        Pages
                      </h3>
                      <Badge variant="outline">{pack.pages.length}</Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {pack.pages.map((page) => (
                        <StarterPageCard key={page.name} page={page} />
                      ))}
                    </div>
                  </section>

                  <section aria-labelledby="pack-starter-tables" className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3
                        id="pack-starter-tables"
                        className="flex items-center gap-1.5 text-sm font-semibold"
                      >
                        <Database className="size-4 text-emerald-600" aria-hidden="true" />
                        Tables
                      </h3>
                      <Badge variant="outline">{pack.tables.length}</Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {pack.tables.map((table) => (
                        <StarterTableCard key={table.name} table={table} />
                      ))}
                    </div>
                  </section>

                  <section aria-labelledby="pack-starter-workflows" className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3
                        id="pack-starter-workflows"
                        className="flex items-center gap-1.5 text-sm font-semibold"
                      >
                        <Workflow className="size-4 text-emerald-600" aria-hidden="true" />
                        Workflows
                      </h3>
                      <Badge variant="outline">{pack.workflows.length}</Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {pack.workflows.map((workflow) => (
                        <StarterWorkflowCard key={workflow.name} workflow={workflow} />
                      ))}
                    </div>
                  </section>
                </div>
              </TabsContent>

              {/* ── Onglet Feuille de route ────────────────────────────────── */}
              <TabsContent value="roadmap" className="flex-1 p-4 sm:p-5 lg:overflow-y-auto">
                <div className="space-y-6">
                  <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-900">
                    <MapIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                    Aperçu en direct — ce plan spiralaire se régénère selon les{" "}
                    {selectedCount} module{selectedCount > 1 ? "s" : ""} coché
                    {selectedCount > 1 ? "s" : ""} ({stats.sprints} sprints, {stats.tasks}{" "}
                    tâches, {stats.deliverables} livrables).
                  </p>

                  {roadmapTemplate.map((phase) => (
                    <section
                      key={phase.title}
                      aria-labelledby={`pack-roadmap-${phase.title.slice(0, 12).replace(/\W+/g, "-").toLowerCase()}`}
                      className="space-y-3"
                    >
                      <div>
                        <h3 className="text-sm font-semibold">{phase.title}</h3>
                        <p className="text-xs text-muted-foreground">{phase.objective}</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {phase.sprints.map((sprint, i) => (
                          <article
                            key={`${phase.title}-${i}`}
                            className="rounded-xl border bg-white p-4"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">{sprint.title}</p>
                              <Badge
                                variant="outline"
                                className="shrink-0 text-[10px] font-normal"
                              >
                                {sprint.weeks}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs leading-snug text-zinc-500">
                              {sprint.objective}
                            </p>
                            <ul className="mt-2.5 space-y-1.5">
                              {sprint.tasks.map((task, j) => (
                                <li key={j} className="flex items-start gap-2 text-xs">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "mt-0 shrink-0 border-transparent text-[9px]",
                                      CATEGORY_BADGES[task.category] ??
                                        "bg-zinc-100 text-zinc-600"
                                    )}
                                  >
                                    {task.category}
                                  </Badge>
                                  <span className="min-w-0 text-zinc-600">{task.title}</span>
                                </li>
                              ))}
                            </ul>
                            {sprint.deliverables.length > 0 && (
                              <div className="mt-2.5 space-y-1 border-t pt-2">
                                {sprint.deliverables.map((deliverable, j) => (
                                  <p
                                    key={j}
                                    className="flex items-start gap-1.5 text-xs text-zinc-600"
                                  >
                                    <CheckCircle2
                                      className="mt-0.5 size-3.5 shrink-0 text-emerald-600"
                                      aria-hidden="true"
                                    />
                                    {deliverable}
                                  </p>
                                ))}
                              </div>
                            )}
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
