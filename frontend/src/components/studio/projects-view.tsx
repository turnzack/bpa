"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ArchiveRestore,
  AudioLines,
  Box,
  Braces,
  CheckCircle2,
  Component,
  CreditCard,
  Database,
  FolderKanban,
  Gamepad2,
  Gem,
  Globe,
  Info,
  LayoutDashboard,
  LayoutPanelTop,
  Loader2,
  Map,
  MessagesSquare,
  MoreHorizontal,
  Newspaper,
  Package,
  PenTool,
  Pencil,
  Plus,
  Rocket,
  ShoppingBag,
  Sparkles,
  Trash2,
  Workflow,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DEFAULT_TEMPLATE_ID,
  PROJECT_TEMPLATES,
  getTemplate,
} from "@/lib/project-templates";
import type { ProjectTemplate, ProjectType } from "@/lib/project-templates";
import { getProjectRoadmapStats } from "@/lib/project-roadmap-templates";
import { PROJECT_PACKS, getPack } from "@/lib/project-packs";
import type { ProjectPack } from "@/lib/project-packs";
import { getPackRoadmapStats } from "@/lib/pack-roadmap";
import PackStudio from "@/components/studio/pack-studio";
import { apiFetch, formatDateFr } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import type { CreatedRoadmap, ProjectSummary, ProjectsData } from "./types";

// ─── Maps d'affichage des modèles (clés string → classes/icônes littérales) ──

const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  rocket: Rocket,
  globe: Globe,
  gamepad: Gamepad2,
  dashboard: LayoutDashboard,
  "shopping-bag": ShoppingBag,
  newspaper: Newspaper,
  braces: Braces,
  box: Box,
  // Packs PRD
  "layout-panel-top": LayoutPanelTop,
  "audio-lines": AudioLines,
  "messages-square": MessagesSquare,
  "credit-card": CreditCard,
  component: Component,
  sparkles: Sparkles,
  "pen-tool": PenTool,
  gem: Gem,
};

const TEMPLATE_COLORS: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  stone: "bg-stone-100 text-stone-700",
  amber: "bg-amber-100 text-amber-700",
  zinc: "bg-zinc-100 text-zinc-700",
  rose: "bg-rose-100 text-rose-700",
  orange: "bg-orange-100 text-orange-700",
  teal: "bg-teal-100 text-teal-700",
  neutral: "bg-neutral-100 text-neutral-700",
  // Packs PRD
  red: "bg-red-100 text-red-700",
  lime: "bg-lime-100 text-lime-700",
  yellow: "bg-yellow-100 text-yellow-700",
};

/** Pluriel français simple : pl(1, "page") → « 1 page », pl(3, "page") → « 3 pages ». */
function pl(n: number, word: string): string {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

/** Métadonnées d'affichage d'un type de projet (label + icône + couleurs). */
export function projectTypeMeta(type: string): {
  label: string;
  icon: LucideIcon;
  colorClass: string;
} {
  const template = getTemplate(type);
  return {
    label: template?.label ?? type,
    icon: (template && TEMPLATE_ICONS[template.icon]) || Box,
    colorClass: (template && TEMPLATE_COLORS[template.color]) || TEMPLATE_COLORS.zinc,
  };
}

/** Suggestions de nom pour l'étape 2 du wizard. */
const NAME_SUGGESTIONS: Record<string, string> = {
  saas: "Mon SaaS",
  website: "Mon site",
  game: "Mon jeu",
  dashboard: "Mon back-office",
  ecommerce: "Ma boutique",
  blog: "Mon blog",
  api: "Mon API",
  blank: "Mon projet",
};

const SECTION_HEADER_PROPS = {
  title: "Projets",
  description:
    "Créez n'importe quel type de projet (SaaS, site web, jeu vidéo…) et basculez le studio sur le projet actif.",
} as const;

type ProjectFilter = "all" | "active" | "archived";

const PROJECT_FILTERS: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "active", label: "Actifs" },
  { value: "archived", label: "Archivés" },
];

// ─── Carte projet ────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ProjectSummary;
  isActive: boolean;
  onOpen: (id: string) => void;
  onOpenRoadmap: (id: string) => void;
  onActivate: (id: string) => void;
  onRename: (project: ProjectSummary) => void;
  onToggleArchive: (project: ProjectSummary) => void;
  onDelete: (project: ProjectSummary) => void;
}

function ProjectCard({
  project,
  isActive,
  onOpen,
  onOpenRoadmap,
  onActivate,
  onRename,
  onToggleArchive,
  onDelete,
}: ProjectCardProps) {
  const meta = projectTypeMeta(project.type);
  const Icon = meta.icon;
  const archived = project.status === "archived";

  return (
    <Card className={cn("gap-0 py-0", archived && "opacity-75")}>
      <CardContent className="flex h-full flex-col p-4">
        {/* Chips type + pack, puis menu d'actions */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                meta.colorClass
              )}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{meta.label}</span>
            </span>
            {project.pack && (
              <Badge
                variant="outline"
                className="min-w-0 shrink border-amber-300 bg-amber-50 text-amber-800"
                title={`Lancé depuis le pack PRD « ${project.pack.label} » (${project.pack.modules} modules)`}
              >
                <Package className="size-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{project.pack.label}</span>
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-1 size-9 shrink-0 text-zinc-500 hover:text-zinc-900"
                aria-haspopup="menu"
                aria-label={`Actions du projet ${project.name}`}
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem
                disabled={isActive || archived}
                onSelect={() => onActivate(project.id)}
              >
                <CheckCircle2 className="text-emerald-600" aria-hidden="true" />
                Définir comme projet actif
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onRename(project)}>
                <Pencil aria-hidden="true" />
                Renommer…
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onToggleArchive(project)}>
                {archived ? (
                  <ArchiveRestore aria-hidden="true" />
                ) : (
                  <Archive aria-hidden="true" />
                )}
                {archived ? "Restaurer" : "Archiver"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                onSelect={() => onDelete(project)}
              >
                <Trash2 aria-hidden="true" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Nom + badge d'état */}
        <div className="mt-2.5 flex items-center gap-2">
          <h3 className="min-w-0 truncate text-sm font-semibold" title={project.name}>
            {project.name}
          </h3>
          {isActive ? (
            <Badge className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-600">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Projet actif
            </Badge>
          ) : archived ? (
            <Badge variant="outline" className="shrink-0 border-zinc-200 text-zinc-400">
              Archivé
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 text-zinc-600">
              Actif
            </Badge>
          )}
        </div>

        {/* Description */}
        {project.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        ) : (
          <p className="mt-1 line-clamp-2 text-sm italic text-muted-foreground/70">
            Aucune description.
          </p>
        )}

        {/* Avancement de la feuille de route du projet */}
        {(project.roadmap?.total ?? 0) > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex min-w-0 items-center gap-1 text-zinc-500">
                <Map className="size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                Feuille de route
              </span>
              <span className="tabular-nums text-zinc-500">
                {project.roadmap.done}/{project.roadmap.total}
              </span>
            </div>
            <Progress
              value={Math.round((project.roadmap.done / project.roadmap.total) * 100)}
              aria-label={`Avancement de la feuille de route du projet ${project.name}`}
              className="mt-1.5 h-1.5 [&>div]:bg-emerald-600"
            />
          </div>
        )}

        {/* Compteurs + date de création */}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1" title={pl(project.counts.pages, "page")}>
            <LayoutPanelTop className="size-3.5" aria-hidden="true" />
            {project.counts.pages}
          </span>
          <span className="inline-flex items-center gap-1" title={pl(project.counts.tables, "table")}>
            <Database className="size-3.5" aria-hidden="true" />
            {project.counts.tables}
          </span>
          <span
            className="inline-flex items-center gap-1"
            title={pl(project.counts.workflows, "workflow")}
          >
            <Workflow className="size-3.5" aria-hidden="true" />
            {project.counts.workflows}
          </span>
          <span className="ml-auto whitespace-nowrap">
            créé le {formatDateFr(project.createdAt, "dd/MM/yyyy")}
          </span>
        </div>

        {/* Actions principales */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
          {archived ? (
            <Button size="sm" variant="outline" disabled title="Restaurez le projet pour l'ouvrir">
              Ouvrir
            </Button>
          ) : (
            <Button
              size="sm"
              variant={isActive ? "outline" : "default"}
              className={cn(!isActive && "bg-emerald-600 text-white hover:bg-emerald-700")}
              onClick={() => onOpen(project.id)}
            >
              Ouvrir
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={archived}
            title="Voir la feuille de route du projet"
            onClick={() => onOpenRoadmap(project.id)}
          >
            <Map className="size-4" aria-hidden="true" />
            Feuille de route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Vue principale ──────────────────────────────────────────────────────────

interface ProjectsViewProps {
  activeProjectId: string | null;
  onActivate: (id: string) => void;
  onOpenProject: (id: string) => void;
  /** Ouvre la feuille de route du projet (active le projet + bascule la section). */
  onOpenRoadmap: (id: string) => void;
  onChanged: () => void;
}

export default function ProjectsView({
  activeProjectId,
  onActivate,
  onOpenProject,
  onOpenRoadmap,
  onChanged,
}: ProjectsViewProps) {
  const { toast } = useToast();

  const [data, setData] = useState<ProjectsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectFilter>("all");

  // Wizard de création
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectType>(DEFAULT_TEMPLATE_ID);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [packModules, setPackModules] = useState<string[]>([]);
  const [packStudioOpen, setPackStudioOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Renommage
  const [renameTarget, setRenameTarget] = useState<ProjectSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);

  // Suppression
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await apiFetch<ProjectsData>("/api/projects");
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visibleProjects = useMemo(() => {
    if (!data) return [];
    if (filter === "all") return data.projects;
    return data.projects.filter((p) => p.status === filter);
  }, [data, filter]);

  const wizardTemplate: ProjectTemplate =
    getTemplate(selectedTemplate) ?? PROJECT_TEMPLATES[0];

  /** Mode actuel du wizard : pack PRD si un pack est sélectionné, sinon modèle. */
  const wizardPack: ProjectPack | null = selectedPack ? (getPack(selectedPack) ?? null) : null;
  const packMode = wizardPack !== null;

  /**
   * Ouvre l'interface complète du pack (Pack Studio) : modules détaillés,
   * starter et feuille de route en direct. Au premier passage, tous les
   * modules sont cochés et la description est pré-remplie avec celle du pack.
   */
  const openPackStudio = (pack: ProjectPack) => {
    if (selectedPack !== pack.id) {
      setSelectedPack(pack.id);
      setPackModules(pack.modules.map((m) => m.key));
      setNewName("");
      setNewDesc(pack.description);
    }
    setWizardOpen(false);
    setPackStudioOpen(true);
  };

  const togglePackModule = (key: string) => {
    setPackModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const handleToggleArchive = useCallback(
    async (project: ProjectSummary) => {
      const nextStatus = project.status === "active" ? "archived" : "active";
      try {
        await apiFetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus }),
        });
        toast({
          title: nextStatus === "archived" ? "Projet archivé" : "Projet restauré",
          description: `« ${project.name} » est désormais ${
            nextStatus === "archived" ? "archivé" : "actif"
          }.`,
        });
        void load();
        onChanged();
      } catch (e) {
        toast({
          title: "Action impossible",
          description: e instanceof Error ? e.message : undefined,
          variant: "destructive",
        });
      }
    },
    [load, onChanged, toast]
  );

  const submitRename = async () => {
    if (!renameTarget) return;
    const name = renameValue.trim();
    if (name.length < 2 || renaming) return;
    setRenaming(true);
    try {
      await apiFetch(`/api/projects/${renameTarget.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      });
      toast({
        title: "Projet renommé",
        description: `« ${renameTarget.name} » s'appelle désormais « ${name} ».`,
      });
      setRenameTarget(null);
      void load();
      onChanged();
    } catch (e) {
      toast({
        title: "Renommage impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setRenaming(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      const d = await apiFetch<{ ok: boolean; replacement?: { id: string; name: string } }>(
        `/api/projects/${deleteTarget.id}`,
        { method: "DELETE" },
      );
      toast({
        title: "Projet supprimé",
        description: d.replacement
          ? `« ${deleteTarget.name} » a été supprimé. Un projet vierge « ${d.replacement.name} » a été créé pour remplacer le dernier projet.`
          : `« ${deleteTarget.name} » et ses ressources associées ont été supprimés.`,
      });
      setDeleteTarget(null);
      void load();
      onChanged();
    } catch (e) {
      toast({
        title: "Suppression impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // ─── Wizard ────────────────────────────────────────────────────────────────

  const resetWizard = useCallback(() => {
    setWizardStep(1);
    setSelectedTemplate(DEFAULT_TEMPLATE_ID);
    setSelectedPack(null);
    setPackModules([]);
    setNewName("");
    setNewDesc("");
  }, []);

  const openWizard = useCallback(() => {
    resetWizard();
    setWizardOpen(true);
  }, [resetWizard]);

  const closeWizard = useCallback(() => {
    if (creating) return;
    setWizardOpen(false);
    resetWizard();
  }, [creating, resetWizard]);

  const submitCreate = async () => {
    const name = newName.trim();
    if (name.length < 2 || creating) return;
    setCreating(true);
    try {
      const d = await apiFetch<{
        project: ProjectSummary;
        created: {
          pages: number;
          tables: number;
          workflows: number;
          rows: number;
          roadmap: CreatedRoadmap;
        };
      }>("/api/projects", {
        method: "POST",
        body: JSON.stringify(
          packMode && wizardPack
            ? {
                name,
                type: wizardPack.baseType,
                packId: wizardPack.id,
                modules: packModules,
                description: newDesc.trim() ? newDesc.trim() : undefined,
              }
            : {
                name,
                type: selectedTemplate,
                description: newDesc.trim() ? newDesc.trim() : undefined,
              }
        ),
      });
      toast({
        title: "Projet créé",
        description: packMode && wizardPack
          ? `« ${name} » a été lancé depuis le pack « ${wizardPack.label} » : ${pl(d.created.pages, "page")}, ${pl(d.created.tables, "table")}, ${pl(d.created.workflows, "workflow")} et une feuille de route de ${d.created.roadmap.sprints} sprints.`
          : `${pl(d.created.pages, "page")}, ${pl(d.created.tables, "table")}, ${pl(d.created.workflows, "workflow")} et une feuille de route de ${d.created.roadmap.sprints} sprints ont été générés.`,
      });
      setWizardOpen(false);
      setPackStudioOpen(false);
      resetWizard();
      void load();
      onChanged();
      // La création se poursuit dans la feuille de route du nouveau projet.
      onOpenRoadmap(d.project.id);
    } catch (e) {
      toast({
        title: "Création impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  // ─── États dérivés d'affichage ─────────────────────────────────────────────

  if (loading) {
    return (
      <div>
        <SectionHeader {...SECTION_HEADER_PROPS} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-xl" />
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SectionHeader {...SECTION_HEADER_PROPS} />
        <ErrorState message={error} onRetry={() => void load()} />
      </div>
    );
  }

  if (!data) return null;

  const emptyMessage =
    filter === "archived"
      ? "Aucun projet archivé."
      : filter === "active"
        ? "Aucun projet actif — créez-en un avec « Nouveau projet »."
        : "Aucun projet pour le moment — lancez-en un avec « Nouveau projet ».";

  return (
    <div>
      {/* ─── En-tête + action ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionHeader {...SECTION_HEADER_PROPS} />
        <Button
          onClick={openWizard}
          className="mt-1 bg-emerald-600 text-white hover:bg-emerald-700"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nouveau projet
        </Button>
      </div>

      {/* ─── Cartes stats ──────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <FolderKanban className="size-3.5 text-emerald-600" aria-hidden="true" />
            Projets actifs
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {data.limits.used} / {data.limits.max === null ? "∞" : data.limits.max}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {data.stats.archived} archivé(s)
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <LayoutPanelTop className="size-3.5 text-emerald-600" aria-hidden="true" />
            Pages
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {data.stats.pages}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">tous projets confondus</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Database className="size-3.5 text-emerald-600" aria-hidden="true" />
            Tables
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {data.stats.tables}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">tous projets confondus</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Workflow className="size-3.5 text-emerald-600" aria-hidden="true" />
            Workflows
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">
            {data.stats.workflows}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">tous projets confondus</p>
        </div>
      </div>

      {/* ─── Filtres segmentés ─────────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filtrer les projets"
          className="inline-flex rounded-lg border bg-white p-1"
        >
          {PROJECT_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "min-h-9 cursor-pointer rounded-md px-3 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          {visibleProjects.length} projet{visibleProjects.length > 1 ? "s" : ""} affiché
          {visibleProjects.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* ─── Grille des projets ────────────────────────────────────────────── */}
      {visibleProjects.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              isActive={p.id === activeProjectId}
              onOpen={onOpenProject}
              onOpenRoadmap={onOpenRoadmap}
              onActivate={onActivate}
              onRename={(project) => {
                setRenameTarget(project);
                setRenameValue(project.name);
              }}
              onToggleArchive={(project) => void handleToggleArchive(project)}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}

      {/* ─── Dialog : wizard de création ──────────────────────────────────── */}
      <Dialog open={wizardOpen} onOpenChange={(open) => !open && closeWizard()}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <Badge
              variant="outline"
              className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              Étape {wizardStep} sur 2
            </Badge>
            <DialogTitle>
              {wizardStep === 1 ? "Créer un nouveau projet" : "Configurer votre projet"}
            </DialogTitle>
            <DialogDescription>
              {wizardStep === 1
                ? "Choisissez un point de départ — un modèle ou un Pack PRD — Forge Studio génère automatiquement les pages, tables, workflows et la feuille de route du starter."
                : "Donnez un nom à votre projet et ajustez sa description. Tout restera modifiable ensuite."}
            </DialogDescription>
          </DialogHeader>

          {wizardStep === 1 ? (
            <div className="space-y-5">
              {/* ── Modèles classiques ─────────────────────────────────── */}
              <div
                role="radiogroup"
                aria-label="Type de projet"
                className="grid grid-cols-2 gap-3 lg:grid-cols-3"
              >
                {PROJECT_TEMPLATES.map((t) => {
                  const Icon = TEMPLATE_ICONS[t.icon] ?? Box;
                  const selected = !packMode && selectedTemplate === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setSelectedTemplate(t.id);
                        setSelectedPack(null);
                        setPackModules([]);
                      }}
                      className={cn(
                        "flex min-h-11 cursor-pointer flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                        selected
                          ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600"
                          : "hover:border-emerald-300 hover:bg-emerald-50/40"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          TEMPLATE_COLORS[t.color] ?? TEMPLATE_COLORS.zinc
                        )}
                      >
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        {t.label}
                      </span>
                      <span className="line-clamp-2 text-xs leading-snug text-zinc-500">
                        {t.tagline}
                      </span>
                      <span className="mt-auto text-[11px] text-zinc-400">
                        {pl(t.pages.length, "page")} · {pl(t.tables.length, "table")}{" "}
                        · {pl(t.workflows.length, "workflow")} · {" "}
                        {getProjectRoadmapStats(t.id).sprints} sprints
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ── Packs PRD ─────────────────────────────────────── */}
              <div className="border-t pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <Package className="size-3.5" aria-hidden="true" />
                    Packs PRD
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Cliquez sur un pack pour ouvrir l'interface complète : modules PRD
                    détaillés, starter (pages, tables, workflows) et feuille de route
                    spiralaire en direct.
                  </p>
                </div>
                <div
                  role="group"
                  aria-label="Packs PRD — cliquer ouvre l'interface complète du pack"
                  className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3"
                >
                  {PROJECT_PACKS.map((pack) => {
                    const Icon = TEMPLATE_ICONS[pack.icon] ?? Package;
                    const baseLabel = getTemplate(pack.baseType)?.label ?? pack.baseType;
                    return (
                      <button
                        key={pack.id}
                        type="button"
                        aria-haspopup="dialog"
                        onClick={() => openPackStudio(pack)}
                        className={cn(
                          "flex min-h-11 cursor-pointer flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 hover:border-amber-300 hover:bg-amber-50/40"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            TEMPLATE_COLORS[pack.color] ?? TEMPLATE_COLORS.amber
                          )}
                        >
                          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                          {pack.label}
                        </span>
                        <span className="line-clamp-2 text-xs leading-snug text-zinc-500">
                          {pack.tagline}
                        </span>
                        <span className="mt-auto text-[11px] text-zinc-400">
                          {pack.modules.length} modules · socle {baseLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-project-name">Nom du projet</Label>
                <Input
                  id="new-project-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={
                    packMode && wizardPack
                      ? wizardPack.nameSuggestion
                      : (NAME_SUGGESTIONS[selectedTemplate] ?? "Mon projet")
                  }
                  maxLength={80}
                  autoFocus
                />
                {newName.trim().length > 0 && newName.trim().length < 2 && (
                  <p className="text-xs text-red-600">
                    Le nom doit contenir au moins 2 caractères.
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-project-description">Description (facultative)</Label>
                  <span className="text-xs tabular-nums text-zinc-400">
                    {newDesc.length}/300
                  </span>
                </div>
                <Textarea
                  id="new-project-description"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  maxLength={300}
                  rows={3}
                  placeholder="Décrivez brièvement votre projet…"
                />
              </div>
              {packMode && wizardPack ? (
                <>
                  {/* ── Mode pack : sélection des modules PRD ─────────── */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="inline-flex items-center gap-1.5 text-sm font-medium">
                        <Package className="size-4 text-amber-600" aria-hidden="true" />
                        Modules du pack « {wizardPack.label} »
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-amber-300 text-amber-800">
                          {packModules.length}/{wizardPack.modules.length} sélectionné
                          {packModules.length > 1 ? "s" : ""}
                        </Badge>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => setPackModules(wizardPack.modules.map((m) => m.key))}
                          disabled={packModules.length === wizardPack.modules.length}
                        >
                          Tout cocher
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => setPackModules([])}
                          disabled={packModules.length === 0}
                        >
                          Tout décocher
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Chaque module coché devient une tâche de la spirale 2 de la feuille de route (4 modules par sprint).
                    </p>
                    <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
                      {wizardPack.modules.map((module) => (
                        <label
                          key={module.key}
                          className="flex cursor-pointer items-start gap-2.5 rounded-lg border bg-white p-3 transition-colors hover:border-amber-300"
                        >
                          <Checkbox
                            checked={packModules.includes(module.key)}
                            onCheckedChange={() => togglePackModule(module.key)}
                            className="mt-0.5"
                            aria-label={`Inclure le module ${module.title}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{module.title}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                              {module.mission} {module.style ? `— ${module.style}` : ""}
                            </span>
                            {module.mapping.length > 0 && (
                              <span className="mt-1.5 flex flex-wrap gap-1">
                                {module.mapping.map((file) => (
                                  <code
                                    key={file}
                                    className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600"
                                  >
                                    {file}
                                  </code>
                                ))}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* ── Mode pack : résumé du starter + roadmap spiralaire ── */}
                  <div className="rounded-xl border bg-zinc-50 p-4">
                    <p className="text-sm font-medium">Ce que contient le starter</p>
                    <ul className="mt-2 space-y-1.5">
                      {wizardPack.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-zinc-700">
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="outline">{pl(wizardPack.pages.length, "page")}</Badge>
                      <Badge variant="outline">{pl(wizardPack.tables.length, "table")}</Badge>
                      <Badge variant="outline">
                        {pl(wizardPack.workflows.length, "workflow")}
                      </Badge>
                      <Badge variant="outline" className="border-amber-300 text-amber-800">
                        {packModules.length} module{packModules.length > 1 ? "s" : ""} PRD
                      </Badge>
                    </div>
                    {(() => {
                      const stats = getPackRoadmapStats(
                        wizardPack,
                        packModules.length > 0 ? packModules : [],
                      );
                      return (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3">
                          <p className="flex items-center gap-1.5 text-sm font-medium text-amber-900">
                            <Map className="size-4" aria-hidden="true" />
                            Feuille de route spiralaire incluse
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-amber-900/80">
                            {stats.phases} spirales · {stats.sprints} sprints · {stats.tasks} tâches +{" "}
                            {stats.deliverables} livrables : squelette viable, modules du pack (spirale
                            2), puis durcissement et lancement.
                          </p>
                        </div>
                      );
                    })()}
                    {packModules.length === 0 && (
                      <p className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        Sélectionnez au moins un module pour lancer le projet depuis ce pack.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
              <div className="rounded-xl border bg-zinc-50 p-4">
                <p className="text-sm font-medium">Ce que contient le starter</p>
                {wizardTemplate.id === "blank" ? (
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span>
                      Ce projet démarre vide : créez vos pages, tables et workflows ensuite.
                    </span>
                  </p>
                ) : (
                  <>
                    <ul className="mt-2 space-y-1.5">
                      {wizardTemplate.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-zinc-700">
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="outline">{pl(wizardTemplate.pages.length, "page")}</Badge>
                      <Badge variant="outline">{pl(wizardTemplate.tables.length, "table")}</Badge>
                      <Badge variant="outline">
                        {pl(wizardTemplate.workflows.length, "workflow")}
                      </Badge>
                    </div>
                  </>
                )}
                {(() => {
                  const roadmapStats = getProjectRoadmapStats(wizardTemplate.id);
                  return (
                    <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-800">
                        <Map className="size-4" aria-hidden="true" />
                        Feuille de route incluse
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-emerald-900/80">
                        {roadmapStats.phases} phases · {roadmapStats.sprints} sprints ·{" "}
                        {roadmapStats.tasks} tâches + {roadmapStats.deliverables} livrables à cocher,
                        générés automatiquement pour construire le projet étape par étape.
                      </p>
                    </div>
                  );
                })()}
              </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className={cn(wizardStep === 2 && "sm:justify-between")}>
            {wizardStep === 1 ? (
              <>
                <Button variant="outline" onClick={closeWizard}>
                  Annuler
                </Button>
                <Button
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => {
                    setNewDesc(packMode && wizardPack ? wizardPack.description : wizardTemplate.description);
                    setWizardStep(2);
                  }}
                >
                  Continuer
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setWizardStep(1)}
                  disabled={creating}
                >
                  Retour
                </Button>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button variant="outline" onClick={closeWizard} disabled={creating}>
                    Annuler
                  </Button>
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => void submitCreate()}
                    disabled={
                      creating ||
                      newName.trim().length < 2 ||
                      (packMode && packModules.length === 0)
                    }
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
                </div>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Interface complète du pack sélectionné (Plein écran) ───────── */}
      {wizardPack && (
        <PackStudio
          key={wizardPack.id}
          open={packStudioOpen}
          pack={wizardPack}
          icon={TEMPLATE_ICONS[wizardPack.icon] ?? Package}
          selectedModules={packModules}
          name={newName}
          description={newDesc}
          creating={creating}
          onNameChange={setNewName}
          onDescriptionChange={setNewDesc}
          onToggleModule={togglePackModule}
          onSetModules={setPackModules}
          onCreate={() => void submitCreate()}
          onBack={() => {
            setPackStudioOpen(false);
            setWizardOpen(true);
          }}
          onClose={() => {
            if (creating) return;
            setPackStudioOpen(false);
            resetWizard();
          }}
        />
      )}

      {/* ─── Dialog : renommage ───────────────────────────────────────────── */}
      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Renommer le projet</DialogTitle>
            <DialogDescription>
              Le nom apparaît dans le sélecteur de projets et dans la navigation.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitRename();
            }}
            className="space-y-1.5"
          >
            <Label htmlFor="project-rename-input">Nom du projet</Label>
            <Input
              id="project-rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
              maxLength={80}
            />
            {renameValue.trim().length > 0 && renameValue.trim().length < 2 && (
              <p className="text-xs text-red-600">
                Le nom doit contenir au moins 2 caractères.
              </p>
            )}
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setRenameTarget(null)}>
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={renaming || renameValue.trim().length < 2}
              >
                {renaming ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Enregistrement…
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── AlertDialog : suppression ────────────────────────────────────── */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer « {deleteTarget?.name} » ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les pages, tables et workflows associés seront
              supprimés définitivement, ainsi que toutes leurs données.
              {data?.projects.length === 1 && (
                <>
                  {" "}
                  <span className="mt-2 block rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    C'est votre dernier projet : un projet vierge « Nouveau projet » sera créé
                    automatiquement après la suppression pour que le studio reste opérationnel.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-200"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
            >
              {deleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Suppression…
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
