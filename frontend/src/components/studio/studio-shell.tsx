"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChartColumn,
  Check,
  ChevronDown,
  CreditCard,
  Database,
  FileText,
  FolderKanban,
  Hammer,
  LayoutDashboard,
  Map,
  Palette,
  Rocket,
  Sparkles,
  Workflow,
  MonitorPlay,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { apiFetch, SCROLLBAR_X } from "./use-studio";
import type { BillingData, ProjectSummary, ProjectsData } from "./types";
import RoadmapView from "./roadmap-view";
import PrdView from "./prd-view";
import ProjectsView, { projectTypeMeta } from "./projects-view";
import BuilderView from "./builder-view";
import DataView from "./data-view";
import WorkflowsView from "./workflows-view";
import GeneratorView from "./generator-view";
import DesignSystemView from "./design-system-view";
import AnalyticsView from "./analytics-view";
import BillingView from "./billing-view";
import DocsView from "./docs-view";
import ApercuView from "./apercu-view";

type SectionId =
  | "projets"
  | "roadmap"
  | "prd"
  | "builder"
  | "data"
  | "workflows"
  | "generator"
  | "design"
  | "analytics"
  | "billing"
  | "apercu"
  | "docs";

type DocsTab = "guides" | "api";

/** Périmètre affiché dans la section « Feuille de route ». */
type RoadmapScope = "platform" | "project";

const SECTIONS: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: "projets", label: "Projets", icon: Rocket },
  { id: "roadmap", label: "Feuille de route", icon: Map },
  { id: "prd", label: "PRD", icon: FileText },
  { id: "builder", label: "Builder UI", icon: LayoutDashboard },
  { id: "data", label: "Données", icon: Database },
  { id: "workflows", label: "Workflows", icon: Workflow },
  { id: "generator", label: "Générateur", icon: Sparkles },
  { id: "design", label: "Design System", icon: Palette },
  { id: "analytics", label: "Analytics", icon: ChartColumn },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "apercu", label: "Aperçu Live", icon: MonitorPlay },
  { id: "docs", label: "Docs", icon: BookOpen },
];

/** Clé localStorage du projet actif. */
const ACTIVE_PROJECT_KEY = "forge-studio.activeProjectId";

/**
 * Résout le projet actif : id mémorisé s'il existe encore ET est actif,
 * sinon premier projet actif, sinon premier projet, sinon null.
 */
function resolveActiveProject(list: ProjectSummary[], storedId: string | null): string | null {
  if (list.length === 0) return null;
  if (storedId) {
    const stored = list.find((p) => p.id === storedId);
    if (stored && stored.status === "active") return stored.id;
  }
  const firstActive = list.find((p) => p.status === "active");
  return (firstActive ?? list[0]).id;
}

function PlanBadge({ plan }: { plan: string | null }) {
  if (plan === "pro") {
    return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Plan Pro</Badge>;
  }
  if (plan === "enterprise") {
    return <Badge className="bg-amber-500 text-white hover:bg-amber-500">Plan Enterprise</Badge>;
  }
  if (plan === "free") {
    return <Badge variant="secondary">Plan Free</Badge>;
  }
  return null;
}

function NavButton({
  section,
  active,
  onSelect,
}: {
  section: (typeof SECTIONS)[number];
  active: boolean;
  onSelect: (id: SectionId) => void;
}) {
  const Icon = section.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(section.id)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      )}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-emerald-600"
        />
      )}
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {section.label}
    </button>
  );
}

function SectionMotion({ children }: { children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

/** Petit chip coloré (icône du type de projet) pour le switcher du header. */
function ProjectChip({ type }: { type: string }) {
  const meta = projectTypeMeta(type);
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded",
        meta.colorClass
      )}
      aria-hidden="true"
    >
      <Icon className="size-2.5" />
    </span>
  );
}

export default function StudioShell() {
  const [active, setActive] = useState<SectionId>("roadmap");
  const [plan, setPlan] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const activeProjectIdRef = useRef<string | null>(null);
  // Feuille de route : plateforme (OmniBuild) ou projet actif.
  const [roadmapScope, setRoadmapScope] = useState<RoadmapScope>("platform");
  // Onglet initial du module Docs (guides ou API) piloté depuis le footer.
  const [docsTab, setDocsTab] = useState<DocsTab>("guides");

  /** Ouvre le module Docs sur l'onglet demandé. */
  const openDocs = useCallback((tab: DocsTab) => {
    setDocsTab(tab);
    setActive("docs");
  }, []);

  // Définit le projet actif + persiste le choix dans localStorage.
  const applyActiveProject = useCallback((id: string | null) => {
    activeProjectIdRef.current = id;
    setActiveProjectIdState(id);
    try {
      if (id) window.localStorage.setItem(ACTIVE_PROJECT_KEY, id);
      else window.localStorage.removeItem(ACTIVE_PROJECT_KEY);
    } catch {
      /* stockage indisponible (navigation privée) : on ignore */
    }
  }, []);

  // Chargement initial : liste des projets + résolution du projet actif.
  useEffect(() => {
    let cancelled = false;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(ACTIVE_PROJECT_KEY);
    } catch {
      /* stockage indisponible */
    }
    apiFetch<ProjectsData>("/api/projects")
      .then((d) => {
        if (cancelled) return;
        setProjects(d.projects);
        const next = resolveActiveProject(d.projects, stored);
        activeProjectIdRef.current = next;
        setActiveProjectIdState(next);
      })
      .catch(() => {
        /* le switcher reste en mode « Chargement… » */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Refetch + réconciliation : si le projet actif a disparu (supprimé,
   * archivé) on replie sur le premier actif ; liste vide → null.
   */
  const refreshProjects = useCallback(async () => {
    try {
      const d = await apiFetch<ProjectsData>("/api/projects");
      setProjects(d.projects);
      const next = resolveActiveProject(d.projects, activeProjectIdRef.current);
      if (next !== activeProjectIdRef.current) applyActiveProject(next);
    } catch {
      /* silencieux : le shell conserve ses données actuelles */
    }
  }, [applyActiveProject]);

  // Plan d'abonnement pour le badge du header (sync via BillingView après checkout).
  useEffect(() => {
    let cancelled = false;
    apiFetch<BillingData>("/api/billing")
      .then((d) => {
        if (!cancelled) setPlan(d.subscription?.plan ?? null);
      })
      .catch(() => {
        /* le badge reste masqué si l'API n'est pas prête */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlanChange = useCallback((nextPlan: string) => setPlan(nextPlan), []);

  const activeProject = projects?.find((p) => p.id === activeProjectId) ?? null;
  const activeProjectsList = projects?.filter((p) => p.status === "active") ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm"
              aria-hidden="true"
            >
              <Hammer className="size-5" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight">Forge Studio</span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                Atelier de création SaaS
              </span>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              MVP
            </Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {projects === null || !activeProject ? (
              <div
                className="hidden items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-medium md:flex"
                title="Projet actif"
              >
                <FolderKanban className="size-3.5 text-emerald-600" aria-hidden="true" />
                {projects === null ? "Chargement…" : "Aucun projet"}
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-50 md:flex"
                    title="Changer de projet actif"
                    aria-haspopup="menu"
                    aria-label="Changer de projet actif"
                  >
                    <ProjectChip type={activeProject.type} />
                    <span className="max-w-[10rem] truncate">{activeProject.name}</span>
                    <ChevronDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Projets actifs</DropdownMenuLabel>
                  {activeProjectsList.length === 0 && (
                    <DropdownMenuItem disabled>Aucun projet actif</DropdownMenuItem>
                  )}
                  {activeProjectsList.map((p) => {
                    const isCurrent = p.id === activeProjectId;
                    return (
                      <DropdownMenuItem
                        key={p.id}
                        onSelect={() => applyActiveProject(p.id)}
                      >
                        <ProjectChip type={p.type} />
                        <span className="min-w-0 flex-1 truncate">{p.name}</span>
                        {isCurrent && (
                          <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setActive("projets")}>
                    <FolderKanban aria-hidden="true" />
                    Gérer les projets
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <PlanBadge plan={plan} />
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white"
              title="Atelier Démo"
              aria-label="Organisation Atelier Démo"
            >
              AD
            </div>
          </div>
        </div>
      </header>

      {/* ─── Corps : sidebar desktop + contenu ────────────────────────────── */}
      <div className="flex flex-1 items-stretch">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 flex-col border-r bg-white lg:flex">
          <nav aria-label="Navigation principale" className="flex-1 space-y-1 overflow-y-auto p-3">
            {SECTIONS.map((s) => (
              <NavButton key={s.id} section={s} active={active === s.id} onSelect={setActive} />
            ))}
          </nav>
          <div className="border-t p-4 text-[11px] leading-relaxed text-muted-foreground">
            Atelier Démo · Forge Studio v0.1
            <br />
            12 sprints · MVP opérationnel
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Nav horizontale mobile */}
          <nav
            aria-label="Navigation mobile"
            className="sticky top-14 z-30 border-b bg-white/90 backdrop-blur lg:hidden"
          >
            <div className={cn("flex gap-1.5 overflow-x-auto px-3 py-2", SCROLLBAR_X)}>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const isActive = active === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActive(s.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
                      isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-transparent text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
            {active === "projets" && (
              <SectionMotion>
                <ProjectsView
                  activeProjectId={activeProjectId}
                  onActivate={applyActiveProject}
                  onOpenProject={(id) => {
                    applyActiveProject(id);
                    setActive("builder");
                  }}
                  onOpenRoadmap={(id) => {
                    applyActiveProject(id);
                    setRoadmapScope("project");
                    setActive("roadmap");
                  }}
                  onChanged={() => void refreshProjects()}
                />
              </SectionMotion>
            )}
            {active === "roadmap" && (
              <SectionMotion>
                {activeProject && (
                  <div
                    role="group"
                    aria-label="Périmètre de la feuille de route"
                    className="mb-5 inline-flex rounded-lg border bg-white p-1"
                  >
                    <button
                      type="button"
                      aria-pressed={roadmapScope === "platform"}
                      onClick={() => setRoadmapScope("platform")}
                      className={cn(
                        "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                        roadmapScope === "platform"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-zinc-600 hover:bg-zinc-100"
                      )}
                    >
                      <Map className="size-4" aria-hidden="true" />
                      Plateforme
                    </button>
                    <button
                      type="button"
                      aria-pressed={roadmapScope === "project"}
                      onClick={() => setRoadmapScope("project")}
                      className={cn(
                        "inline-flex min-h-9 max-w-[16rem] cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                        roadmapScope === "project"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-zinc-600 hover:bg-zinc-100"
                      )}
                    >
                      <ProjectChip type={activeProject.type} />
                      <span className="truncate">{activeProject.name}</span>
                    </button>
                  </div>
                )}
                <RoadmapView
                  key={
                    roadmapScope === "project" && activeProjectId
                      ? activeProjectId
                      : "platform"
                  }
                  projectId={
                    roadmapScope === "project" && activeProjectId
                      ? activeProjectId
                      : undefined
                  }
                  projectName={activeProject?.name}
                />
              </SectionMotion>
            )}
            {active === "prd" && (
              <SectionMotion>
                <PrdView />
              </SectionMotion>
            )}
            {active === "builder" && (
              <SectionMotion>
                <BuilderView projectId={activeProjectId ?? undefined} />
              </SectionMotion>
            )}
            {active === "data" && (
              <SectionMotion>
                <DataView projectId={activeProjectId ?? undefined} />
              </SectionMotion>
            )}
            {active === "workflows" && (
              <SectionMotion>
                <WorkflowsView projectId={activeProjectId ?? undefined} />
              </SectionMotion>
            )}
            {active === "generator" && (
              <SectionMotion>
                <GeneratorView
                  projectId={activeProjectId ?? undefined}
                  onOpenBuilder={() => setActive("builder")}
                />
              </SectionMotion>
            )}
            {active === "design" && (
              <SectionMotion>
                {/* Checklist GLOBALE (table DesignCheck, clé « componentId:check ») : non scopée par projet.
                    projectId est passé pour garder une signature cohérente avec les autres vues. */}
                <DesignSystemView projectId={activeProjectId} />
              </SectionMotion>
            )}
            {active === "analytics" && (
              <SectionMotion>
                <AnalyticsView projectId={activeProjectId ?? undefined} />
              </SectionMotion>
            )}
            {active === "billing" && (
              <SectionMotion>
                <BillingView onPlanChange={handlePlanChange} />
              </SectionMotion>
            )}
            {active === "apercu" && (
              <SectionMotion>
                <ApercuView projectId={activeProjectId ?? undefined} />
              </SectionMotion>
            )}
            {active === "docs" && (
              <SectionMotion>
                <DocsView key={docsTab} initialTab={docsTab} />
              </SectionMotion>
            )}
          </main>

          {/* ─── Footer (sticky : collé en bas quand la page est courte) ──── */}
          <footer
            className="mt-auto border-t bg-white"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Forge Studio — MVP construit en 12 sprints · Prochaine étape : Connecteurs
                &amp; intégrations (Sprint 6)
              </span>
              <span className="flex gap-4">
                <button
                  type="button"
                  onClick={() => openDocs("guides")}
                  className="cursor-pointer transition-colors hover:text-foreground"
                >
                  Docs
                </button>
                <button
                  type="button"
                  onClick={() => openDocs("api")}
                  className="cursor-pointer transition-colors hover:text-foreground"
                >
                  API
                </button>
                <button
                  type="button"
                  onClick={() => openDocs("guides")}
                  className="cursor-pointer transition-colors hover:text-foreground"
                >
                  Support
                </button>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
