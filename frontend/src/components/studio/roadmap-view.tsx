"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiFetch, formatWeeks } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import type {
  RoadmapData,
  RoadmapDeliverable,
  RoadmapPhase,
  RoadmapSprint,
  RoadmapStats,
  RoadmapTask,
} from "./types";

/** Filtre d'affichage des éléments (tâches + livrables). */
type RoadmapFilter = "all" | "todo" | "doing" | "done";

const FILTER_OPTIONS: { value: RoadmapFilter; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "todo", label: "À faire" },
  { value: "doing", label: "En cours" },
  { value: "done", label: "Terminées" },
];

/** En-tête par défaut : feuille de route de la plateforme (OmniBuild). */
const PLATFORM_HEADER_PROPS = {
  title: "Feuille de route",
  description:
    "Le plan complet des 12 sprints du MVP, coché au fil de l'avancement réel.",
} as const;

/** Forme brute de GET /api/roadmap (champs optionnels + livrables anciens tolérés). */
interface RoadmapResponse {
  phases?: {
    phase: number;
    title: string;
    objective?: string;
    sprints?: {
      sprint: number;
      title: string;
      weeks?: string | string[];
      objective?: string;
      deliverables?: (string | {
        id?: string;
        title?: string;
        done?: boolean;
        status?: "todo" | "doing" | "done";
      })[];
      tasks?: {
        id: string;
        title: string;
        category?: string;
        done?: boolean;
        status?: "todo" | "doing" | "done";
      }[];
    }[];
  }[];
  stats?: RoadmapStats;
  deliverableStats?: RoadmapStats;
}

/** Tolère l'ancienne forme string[] des livrables (→ objet sans état fait). */
function normalizeDeliverable(
  raw: string | {
    id?: string;
    title?: string;
    done?: boolean;
    status?: "todo" | "doing" | "done";
  },
  sprint: number,
  index: number
): RoadmapDeliverable {
  if (typeof raw === "string") {
    return { id: `d-${sprint}-${index}`, title: raw, done: false };
  }
  return {
    id: raw.id ?? `d-${sprint}-${index}`,
    title: raw.title ?? "",
    done: Boolean(raw.done),
    status: raw.status,
  };
}

/** Recompte des livrables (repli si l'API n'envoie pas deliverableStats). */
function computeDeliverableStats(phases: RoadmapPhase[]): RoadmapStats {
  let done = 0;
  let total = 0;
  for (const p of phases) {
    for (const s of p.sprints) {
      for (const d of s.deliverables) {
        total += 1;
        if (d.done) done += 1;
      }
    }
  }
  return { done, total };
}

function normalizeRoadmap(raw: RoadmapResponse): RoadmapData {
  const phases: RoadmapPhase[] = (raw.phases ?? []).map((p) => ({
    phase: p.phase,
    title: p.title,
    objective: p.objective ?? "",
    sprints: (p.sprints ?? []).map((s) => ({
      sprint: s.sprint,
      title: s.title,
      weeks: formatWeeks(s.weeks),
      objective: s.objective ?? "",
      deliverables: (s.deliverables ?? []).map((d, i) =>
        normalizeDeliverable(d, s.sprint, i)
      ),
      tasks: (s.tasks ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category ?? "Dev",
        done: Boolean(t.done),
        status: t.status,
      })),
    })),
  }));
  return {
    phases,
    stats: {
      done: raw.stats?.done ?? 0,
      total: raw.stats?.total ?? 0,
    },
    deliverableStats: raw.deliverableStats ?? computeDeliverableStats(phases),
  };
}

/** Nombre total d'éléments (tâches + livrables) et combien sont faits. */
function sprintItemStats(sprint: RoadmapSprint): RoadmapStats {
  const done =
    sprint.tasks.filter((t) => t.done).length +
    sprint.deliverables.filter((d) => d.done).length;
  return { done, total: sprint.tasks.length + sprint.deliverables.length };
}

/** Garde seulement les éléments correspondant au filtre actif.
 * « En cours » = statut doing ET pas fait ; « À faire » exclut les éléments
 * en cours ; sans status (anciens payloads) l'élément est traité comme à faire. */
function filterByState<
  T extends { done: boolean; status?: "todo" | "doing" | "done" }
>(items: T[], filter: RoadmapFilter): T[] {
  if (filter === "todo")
    return items.filter((i) => !i.done && i.status !== "doing");
  if (filter === "doing")
    return items.filter((i) => i.status === "doing" && !i.done);
  if (filter === "done") return items.filter((i) => i.done);
  return items;
}

function safePct(done: number, total: number): number {
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

interface SprintCardProps {
  sprint: RoadmapSprint;
  /** Tâches déjà filtrées selon l'état actif. */
  tasks: RoadmapTask[];
  /** Livrables déjà filtrés selon l'état actif. */
  deliverables: RoadmapDeliverable[];
  isComplete: boolean;
  isCurrent: boolean;
  onToggle: (id: string, kind: "task" | "deliverable", wasDone: boolean) => void;
  onToggleStatus: (
    id: string,
    kind: "task" | "deliverable",
    nextStatus: "todo" | "doing"
  ) => void;
}

/** Petit bouton bascule « En cours » (statut doing), désactivé quand c'est fait. */
function DoingToggle({
  title,
  isDoing,
  disabled,
  onToggle,
}: {
  title: string;
  isDoing: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isDoing}
      aria-label={`Marquer « ${title} » en cours`}
      title="En cours"
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 lg:min-h-6 lg:min-w-6",
        disabled
          ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-300 opacity-60"
          : isDoing
            ? "border-amber-300 bg-amber-100 text-amber-700"
            : "border-zinc-200 bg-white text-zinc-400 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600"
      )}
    >
      <Clock className="size-3.5" aria-hidden="true" />
    </button>
  );
}

function SprintCard({
  sprint,
  tasks,
  deliverables,
  isComplete,
  isCurrent,
  onToggle,
  onToggleStatus,
}: SprintCardProps) {
  const items = sprintItemStats(sprint);
  const pct = safePct(items.done, items.total);
  const doingCount =
    sprint.tasks.filter((t) => !t.done && t.status === "doing").length +
    sprint.deliverables.filter((d) => !d.done && d.status === "doing").length;

  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-50 text-emerald-700"
          >
            Sprint {sprint.sprint}
          </Badge>
          {sprint.weeks && <Badge variant="secondary">{sprint.weeks}</Badge>}
          {isComplete && (
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="size-3" aria-hidden="true" />
              Terminé
            </Badge>
          )}
          {!isComplete && isCurrent && (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700">
              En cours
            </Badge>
          )}
          {doingCount > 0 && (
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-50 font-normal text-amber-700"
            >
              <Clock className="size-3" aria-hidden="true" />
              {doingCount} en cours
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {items.done}/{items.total}
          </span>
        </div>
        <h4 className="mt-2 text-sm font-semibold">{sprint.title}</h4>
        {sprint.objective && (
          <p className="mt-0.5 text-xs text-muted-foreground">{sprint.objective}</p>
        )}
        <Progress
          value={pct}
          aria-label={`Avancement du sprint ${sprint.sprint}`}
          className="mt-2 h-1.5 [&>div]:bg-emerald-600"
        />

        {deliverables.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Livrables
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {deliverables.map((d) => {
                const isDoing = !d.done && d.status === "doing";
                return (
                  <div key={d.id} className="flex items-center gap-1">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={d.done}
                      aria-label={d.title}
                      onClick={() => onToggle(d.id, "deliverable", d.done)}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                        d.done
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : isDoing
                            ? "border-amber-300 bg-amber-50 text-amber-700"
                            : "border-dashed border-zinc-300 text-zinc-600 hover:border-emerald-300 hover:bg-emerald-50/60"
                      )}
                    >
                      {d.done ? (
                        <CheckCircle2
                          className="size-3.5 shrink-0 text-emerald-600"
                          aria-hidden="true"
                        />
                      ) : isDoing ? (
                        <Clock
                          className="size-3.5 shrink-0 text-amber-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                      )}
                      <span className="min-w-0">{d.title}</span>
                    </button>
                    <DoingToggle
                      title={d.title}
                      isDoing={isDoing}
                      disabled={d.done}
                      onToggle={() =>
                        onToggleStatus(d.id, "deliverable", isDoing ? "todo" : "doing")
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tasks.length > 0 && (
          <ul className="mt-3 space-y-1 border-t pt-3">
            {tasks.map((t) => {
              const checkboxId = `task-${t.id}`;
              const isDoing = !t.done && t.status === "doing";
              return (
                <li key={t.id} className="flex items-center gap-1.5">
                  <label
                    htmlFor={checkboxId}
                    className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg px-2 transition-colors hover:bg-zinc-50"
                  >
                    <Checkbox
                      id={checkboxId}
                      checked={t.done}
                      onCheckedChange={() => onToggle(t.id, "task", t.done)}
                      aria-label={t.title}
                      className="shrink-0"
                    />
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-sm",
                        t.done && "text-muted-foreground line-through"
                      )}
                    >
                      {t.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] font-normal uppercase tracking-wide text-zinc-500"
                    >
                      {t.category}
                    </Badge>
                  </label>
                  <DoingToggle
                    title={t.title}
                    isDoing={isDoing}
                    disabled={t.done}
                    onToggle={() =>
                      onToggleStatus(t.id, "task", isDoing ? "todo" : "doing")
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function RoadmapView({
  projectId,
  projectName,
}: {
  /** Présent → feuille de route du projet ; absent → plateforme (OmniBuild). */
  projectId?: string;
  projectName?: string;
}) {
  const { toast } = useToast();
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RoadmapFilter>("all");

  const headerProps = projectId
    ? {
        title: `Feuille de route — ${projectName ?? "projet"}`,
        description:
          "Le plan de construction du projet (phases, sprints, tâches et livrables), coché au fil de l'avancement.",
      }
    : PLATFORM_HEADER_PROPS;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await apiFetch<RoadmapResponse>(
        projectId ? `/api/projects/${projectId}/roadmap` : "/api/roadmap"
      );
      setData(normalizeRoadmap(raw));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  /**
   * Bascule optimiste d'une tâche OU d'un livrable (même endpoint PATCH),
   * avec rollback complet + toast destructif en cas d'échec.
   */
  const toggleItem = useCallback(
    (id: string, kind: "task" | "deliverable", wasDone: boolean) => {
      if (!data) return;
      const previous = data;
      const nextDone = !wasDone;
      const nextStats = (
        stats: RoadmapStats,
        affected: boolean
      ): RoadmapStats =>
        affected
          ? {
              ...stats,
              done: Math.max(0, Math.min(stats.total, stats.done + (wasDone ? -1 : 1))),
            }
          : stats;
      const next: RoadmapData = {
        phases: previous.phases.map((p) => ({
          ...p,
          sprints: p.sprints.map((s) => ({
            ...s,
            tasks:
              kind === "task"
                ? s.tasks.map((t) =>
                    t.id === id ? { ...t, done: nextDone } : t
                  )
                : s.tasks,
            deliverables:
              kind === "deliverable"
                ? s.deliverables.map((d) =>
                    d.id === id ? { ...d, done: nextDone } : d
                  )
                : s.deliverables,
          })),
        })),
        stats: nextStats(previous.stats, kind === "task"),
        deliverableStats: nextStats(previous.deliverableStats, kind === "deliverable"),
      };
      setData(next);
      apiFetch<{ task: RoadmapTask }>(`/api/roadmap/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: nextDone }),
      }).catch(() => {
        setData(previous);
        toast({
          title: "Mise à jour impossible",
          description: "L'élément n'a pas pu être enregistré. Réessayez.",
          variant: "destructive",
        });
      });
    },
    [data, toast]
  );

  /**
   * Bascule optimiste du statut tri-state d'une tâche OU d'un livrable
   * (« En cours » ⇄ « À faire », done inchangé — le serveur synchronise),
   * avec rollback complet + toast destructif en cas d'échec.
   */
  const toggleStatus = useCallback(
    (id: string, kind: "task" | "deliverable", nextStatus: "todo" | "doing") => {
      if (!data) return;
      const previous = data;
      const next: RoadmapData = {
        phases: previous.phases.map((p) => ({
          ...p,
          sprints: p.sprints.map((s) => ({
            ...s,
            tasks:
              kind === "task"
                ? s.tasks.map((t) =>
                    t.id === id ? { ...t, status: nextStatus } : t
                  )
                : s.tasks,
            deliverables:
              kind === "deliverable"
                ? s.deliverables.map((d) =>
                    d.id === id ? { ...d, status: nextStatus } : d
                  )
                : s.deliverables,
          })),
        })),
        stats: previous.stats,
        deliverableStats: previous.deliverableStats,
      };
      setData(next);
      apiFetch<{ task: RoadmapTask }>(`/api/roadmap/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => {
        setData(previous);
        toast({
          title: "Mise à jour impossible",
          description: "Le statut n'a pas pu être enregistré. Réessayez.",
          variant: "destructive",
        });
      });
    },
    [data, toast]
  );

  /** Avancement des TÂCHES par phase (chips + en-têtes de phase). */
  const phaseStats = useMemo(() => {
    const map = new Map<number, { done: number; total: number }>();
    data?.phases.forEach((p) => {
      let done = 0;
      let total = 0;
      p.sprints.forEach((s) =>
        s.tasks.forEach((t) => {
          total += 1;
          if (t.done) done += 1;
        })
      );
      map.set(p.phase, { done, total });
    });
    return map;
  }, [data]);

  /** Premier sprint (par numéro) ayant au moins 1 élément non fait. */
  const currentSprint = useMemo(() => {
    const sprints = (data?.phases.flatMap((p) => p.sprints) ?? []).sort(
      (a, b) => a.sprint - b.sprint
    );
    const found = sprints.find((s) => {
      const st = sprintItemStats(s);
      return st.total > 0 && st.done < st.total;
    });
    return found ? found.sprint : null;
  }, [data]);

  /** Sprints dont TOUTES les tâches ET tous les livrables sont faits. */
  const sprintsDone = useMemo(() => {
    const sprints = data?.phases.flatMap((p) => p.sprints) ?? [];
    return sprints.filter((s) => {
      const st = sprintItemStats(s);
      return st.total > 0 && st.done === st.total;
    }).length;
  }, [data]);

  if (loading) {
    return (
      <div>
        <SectionHeader {...headerProps} />
        <Skeleton className="h-36 w-full rounded-xl" />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SectionHeader {...headerProps} />
        <ErrorState message={error} onRetry={() => void load()} />
      </div>
    );
  }

  if (!data) return null;

  const sprintsTotal = data.phases.reduce((acc, p) => acc + p.sprints.length, 0);
  const pct = safePct(data.stats.done, data.stats.total);
  const deliverablePct = safePct(
    data.deliverableStats.done,
    data.deliverableStats.total
  );
  const sprintsPct = safePct(sprintsDone, sprintsTotal);

  return (
    <div>
      <SectionHeader {...headerProps} />

      {/* Avancement global */}
      <Card className="gap-0 py-0">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Avancement global</p>
              <p className="mt-1 text-3xl font-bold tracking-tight">
                {data.stats.done}{" "}
                <span className="text-lg font-medium text-muted-foreground">
                  / {data.stats.total} tâches
                </span>
              </p>
            </div>
            <Badge variant="secondary">{pct} % complété</Badge>
          </div>
          <Progress
            value={pct}
            aria-label="Avancement global"
            className="mt-4 h-2.5 [&>div]:bg-emerald-600"
          />
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Livrables validés</p>
              <p className="text-sm font-semibold">
                {data.deliverableStats.done} / {data.deliverableStats.total}
              </p>
              <Progress
                value={deliverablePct}
                aria-label="Livrables validés"
                className="mt-1.5 h-1.5 w-28 [&>div]:bg-emerald-600"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sprints terminés</p>
              <p className="text-sm font-semibold">
                {sprintsDone} / {sprintsTotal}
              </p>
              <Progress
                value={sprintsPct}
                aria-label="Sprints terminés"
                className="mt-1.5 h-1.5 w-28 [&>div]:bg-emerald-600"
              />
            </div>
          </div>
          <div
            role="group"
            aria-label="Avancement par phase"
            className="mt-4 flex flex-wrap gap-2"
          >
            {data.phases.map((p) => {
              const st = phaseStats.get(p.phase) ?? { done: 0, total: 0 };
              const complete = st.total > 0 && st.done === st.total;
              return (
                <button
                  key={p.phase}
                  type="button"
                  title={`Aller à la phase ${p.phase}`}
                  onClick={() =>
                    document
                      .getElementById(`phase-${p.phase}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className={cn(
                    badgeVariants({ variant: "outline" }),
                    "cursor-pointer hover:border-emerald-300",
                    complete
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "text-zinc-600"
                  )}
                >
                  Phase {p.phase} · {st.done}/{st.total}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Barre d'outils : filtres */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filtrer la feuille de route"
          className="inline-flex rounded-lg border bg-white p-1"
        >
          {FILTER_OPTIONS.map((f) => (
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
          Cochez les tâches et les livrables au fil de l'avancement.
        </p>
      </div>

      {/* Phases & sprints */}
      <div className="mt-8 space-y-8">
        {data.phases.map((p) => {
          const st = phaseStats.get(p.phase) ?? { done: 0, total: 0 };
          const phasePct = safePct(st.done, st.total);
          const visibleSprints = p.sprints
            .map((s) => ({
              sprint: s,
              tasks: filterByState(s.tasks, filter),
              deliverables: filterByState(s.deliverables, filter),
            }))
            .filter((v) => v.tasks.length > 0 || v.deliverables.length > 0);

          return (
            <section
              key={p.phase}
              id={`phase-${p.phase}`}
              aria-labelledby={`phase-title-${p.phase}`}
              className="scroll-mt-28"
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Badge variant="secondary">Phase {p.phase}</Badge>
                <h3 id={`phase-title-${p.phase}`} className="text-base font-semibold">
                  {p.title}
                </h3>
                <span className="text-xs text-muted-foreground">{p.objective}</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {st.done}/{st.total}
                  </span>
                  <Progress
                    value={phasePct}
                    aria-label={`Avancement des tâches de la phase ${p.phase}`}
                    className="h-1.5 w-24 [&>div]:bg-emerald-600"
                  />
                </div>
              </div>
              {visibleSprints.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleSprints.map((v) => {
                    const items = sprintItemStats(v.sprint);
                    return (
                      <SprintCard
                        key={v.sprint.sprint}
                        sprint={v.sprint}
                        tasks={v.tasks}
                        deliverables={v.deliverables}
                        isComplete={items.total > 0 && items.done === items.total}
                        isCurrent={v.sprint.sprint === currentSprint}
                        onToggle={toggleItem}
                        onToggleStatus={toggleStatus}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  {filter === "todo"
                    ? "Aucun élément à faire dans cette phase."
                    : filter === "doing"
                      ? "Aucun élément en cours dans cette phase."
                      : filter === "done"
                        ? "Aucun élément terminé dans cette phase."
                        : "Aucun sprint dans cette phase."}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
