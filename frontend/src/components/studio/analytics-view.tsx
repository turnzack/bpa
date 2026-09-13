"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Database,
  FileText,
  ListChecks,
  Play,
  RefreshCw,
  Rows3,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { apiFetch } from "./use-studio";
import { ErrorState, GridSkeleton, SectionHeader } from "./shared";
import type { AnalyticsData } from "./types";

/** Date courte « JJ/MM » pour l'axe X de la courbe d'activité. */
function shortDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw.slice(5, 10);
  try {
    return format(d, "dd/MM", { locale: fr });
  } catch {
    return raw;
  }
}

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e4e4e7",
  fontSize: 12,
  background: "#fff",
} as const;

export default function AnalyticsView({ projectId }: { projectId?: string | null }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // Thread le projet actif dans l'URL (?projectId=).
  const qs = useMemo(() => (projectId ? `?projectId=${projectId}` : ""), [projectId]);

  const load = useCallback(async (silent: boolean) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const d = await apiFetch<AnalyticsData>(`/api/analytics${qs}`);
      setData(d);
      setError(null);
      setUpdatedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [qs]);

  // Premier chargement + polling toutes les 20 s.
  useEffect(() => {
    void load(false);
  }, [load]);

  useEffect(() => {
    const t = setInterval(() => {
      void load(true);
    }, 20000);
    return () => clearInterval(t);
  }, [load]);

  const activity = useMemo(
    () =>
      (data?.activityByDay ?? []).map((d) => ({
        date: d.date,
        runs: d.runs,
        label: shortDate(d.date),
      })),
    [data]
  );

  const metrics: { label: string; value: number; icon: LucideIcon }[] = data
    ? [
        { label: "Pages", value: data.totals.pages, icon: FileText },
        { label: "Tables", value: data.totals.tables, icon: Database },
        { label: "Lignes", value: data.totals.rows, icon: Rows3 },
        { label: "Workflows", value: data.totals.workflows, icon: WorkflowIcon },
        { label: "Exécutions", value: data.totals.runs, icon: Play },
      ]
    : [];

  const taskPct =
    data && data.totals.tasksTotal > 0
      ? Math.round((data.totals.tasksDone / data.totals.tasksTotal) * 100)
      : 0;

  if (loading && !data) {
    return (
      <div>
        <SectionHeader
          title="Analytics"
          description="Vue d'ensemble temps réel de votre atelier : ressources, exécutions et activité."
        />
        <GridSkeleton />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div>
        <SectionHeader
          title="Analytics"
          description="Vue d'ensemble temps réel de votre atelier : ressources, exécutions et activité."
        />
        <ErrorState message={error} onRetry={() => void load(false)} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <SectionHeader
        title="Analytics"
        description="Vue d'ensemble temps réel de votre atelier : ressources, exécutions et activité."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Actualisé toutes les 20 s (polling temps réel)
          {updatedAt
            ? ` · dernière mise à jour ${updatedAt.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}`
            : ""}
        </p>
        <Button
          size="sm"
          variant="outline"
          className="min-h-11 lg:min-h-9"
          onClick={() => void load(false)}
          disabled={loading}
        >
          <RefreshCw className={cn("size-4", refreshing && "animate-spin")} aria-hidden="true" />
          Actualiser
        </Button>
      </div>

      {/* ─── 6 cartes de métriques ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <Card key={m.label} className="gap-0 py-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">{m.label}</span>
                <m.icon className="size-4 text-zinc-400" aria-hidden="true" />
              </div>
              <p className="mt-1 text-2xl font-bold tabular-nums">{m.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card className="gap-0 py-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">Tâches roadmap</span>
              <ListChecks className="size-4 text-zinc-400" aria-hidden="true" />
            </div>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {data.totals.tasksDone}
              <span className="text-sm font-medium text-muted-foreground">
                /{data.totals.tasksTotal}
              </span>
            </p>
            <Progress
              value={taskPct}
              aria-label="Tâches roadmap terminées"
              className="mt-2 h-1.5 [&>div]:bg-emerald-600"
            />
          </CardContent>
        </Card>
      </div>

      {/* ─── Graphiques ─────────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-0 py-0">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-sm">Exécutions par workflow</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {data.runsByWorkflow.length === 0 ? (
              <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Aucune exécution enregistrée pour le moment.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.runsByWorkflow} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="success"
                    name="Succès"
                    stackId="runs"
                    fill="#10b981"
                    maxBarSize={44}
                  />
                  <Bar
                    dataKey="error"
                    name="Erreurs"
                    stackId="runs"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-sm">Activité — 14 derniers jours</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {activity.length === 0 ? (
              <p className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Aucune activité sur la période.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={activity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="runsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#71717a" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Area
                    type="monotone"
                    dataKey="runs"
                    name="Exécutions"
                    stroke="#059669"
                    strokeWidth={2}
                    fill="url(#runsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
