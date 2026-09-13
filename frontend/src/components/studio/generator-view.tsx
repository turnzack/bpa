"use client";

/**
 * Module « Générateur » — interface de création de Builder UIs inspirée du
 * moteur KIROV5 : Import HTML → Scan Blueprint (routes + interactions) →
 * Génération IA avec règles strictes + boucliers → Import dans le Builder.
 *
 * Sprint G2 — Industrialisation : éditeur de Blueprint (renommer / fusionner /
 * réordonner), traitement par lots avec progression, reliaison auto bouton →
 * workflow (mapping par nom), persistance des runs (reprise après interruption).
 * Sprint G3 — Niveau Gold : réparation ciblée page par page, cache par hash
 * (page inchangée jamais régénérée), observabilité (durées par phase, jetons,
 * rapport exportable), sécurité ZIP serveur (zip slip, tailles, chemins).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Database,
  Download,
  FileCode2,
  FileText,
  GitMerge,
  History,
  LayoutDashboard,
  Link2,
  Loader2,
  MousePointerClick,
  Play,
  Plus,
  RefreshCw,
  ScanLine,
  Sparkles,
  Square,
  TextCursorInput,
  Trash2,
  TriangleAlert,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiFetch, SCROLLBAR_Y, timeAgoFr } from "./use-studio";
import { SectionHeader } from "./shared";
import type { BuilderComponent, WorkflowSummary } from "./types";
import { fileNameToRoute, normalizeEditedRoute } from "@/lib/generator/blueprint";

// ─── Types ──────────────────────────────────────────────────────────────────

interface SourceFile {
  name: string;
  content: string;
}

interface RouteInfo {
  route: string;
  source: string;
  title: string;
}

interface Blueprint {
  routes: RouteInfo[];
  interactions: { id: string; source: string; kind: "button" | "link" | "input" | "form"; label: string; href?: string }[];
  collisions: string[];
  warnings: string[];
}

interface CoverageItem {
  interactionId: string;
  label: string;
  kind: string;
  status: "covered" | "missing";
}

interface Timings {
  llmMs: number;
  repairMs: number;
  validateMs: number;
  fallbackMs: number;
}

interface GenerateResult {
  components: BuilderComponent[];
  decisions: { interactionId: string; componentId: string; event: string; action: string }[];
  warnings: string[];
  engine: "ia" | "secours";
  coverage: CoverageItem[];
  durationMs: number;
  error?: string;
  /** Observabilité (Sprint G3). */
  timings?: Partial<Timings>;
  promptTokens?: number;
  completionTokens?: number;
  cached?: boolean;
  attempts?: number;
}

interface RunSummary {
  id: string;
  projectId: string | null;
  status: string;
  totalFiles: number;
  counts: { done: number; failed: number; pending: number };
  createdAt: string;
  updatedAt: string;
}

interface RunPage {
  fileName: string;
  status: string;
  engine: string | null;
  components: BuilderComponent[];
  decisions: GenerateResult["decisions"];
  warnings: string[];
  coverage: CoverageItem[];
  timings: Partial<Timings>;
  durationMs: number;
  promptTokens: number;
  completionTokens: number;
  attempts: number;
  error: string | null;
}

interface RunDetail {
  id: string;
  projectId: string | null;
  status: string;
  totalFiles: number;
  blueprint: Blueprint;
  files: SourceFile[];
  pages: RunPage[];
}

interface WorkflowMapping {
  source: string;
  componentId: string;
  buttonText: string;
  workflowId: string;
  workflowName: string;
}

type Step = "import" | "blueprint" | "generate" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "import", label: "1 · Import" },
  { id: "blueprint", label: "2 · Blueprint" },
  { id: "generate", label: "3 · Génération" },
  { id: "done", label: "4 · Import Builder" },
];

const KIND_META: Record<string, { icon: LucideIcon; label: string; badge: string }> = {
  button: { icon: MousePointerClick, label: "Bouton", badge: "bg-emerald-100 text-emerald-700" },
  link: { icon: Link2, label: "Lien", badge: "bg-amber-100 text-amber-700" },
  input: { icon: TextCursorInput, label: "Champ", badge: "bg-zinc-200 text-zinc-700" },
  form: { icon: FileText, label: "Formulaire", badge: "bg-zinc-200 text-zinc-700" },
};

/** Taille d'un lot de génération (pages traitées par vague). */
const LOT_SIZE = 3;
/** Parallélisme dans un lot (restreint par le rate limiting de l'API). */
const CONCURRENCY = 2;
const MAX_CONTENT_CHARS = 400_000;
/** Suivi d'une génération en file d'attente (correctif 502). */
const POLL_INTERVAL_MS = 2_500;
/** ≈ 9 min : deux appels IA de 90 s + réparation + relance, avec marge. */
const POLL_MAX_TRIES = 220;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Pool simple : exécute `worker` sur chaque item avec `limit` concurrences. */
async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current]!);
    }
  });
  await Promise.all(runners);
}

const RUN_STATUS_META: Record<string, { label: string; badge: string }> = {
  running: { label: "En cours", badge: "bg-emerald-100 text-emerald-700" },
  done: { label: "Terminé", badge: "bg-zinc-200 text-zinc-700" },
  interrupted: { label: "Interrompu", badge: "bg-amber-100 text-amber-700" },
  failed: { label: "Échec", badge: "bg-rose-100 text-rose-700" },
};

function resultOfRunPage(p: RunPage): GenerateResult {
  return {
    components: p.components,
    decisions: p.decisions,
    warnings: p.warnings,
    engine: p.engine === "ia" ? "ia" : "secours",
    coverage: p.coverage,
    durationMs: p.durationMs,
    timings: p.timings,
    promptTokens: p.promptTokens,
    completionTokens: p.completionTokens,
    attempts: p.attempts,
    cached: false,
  };
}

// ─── Vue principale ─────────────────────────────────────────────────────────

export default function GeneratorView({
  projectId,
  onOpenBuilder,
}: {
  projectId?: string;
  onOpenBuilder: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);

  const [step, setStep] = useState<Step>("import");
  const [files, setFiles] = useState<SourceFile[]>([]);
  const [pasteName, setPasteName] = useState("");
  const [pasteHtml, setPasteHtml] = useState("");
  const [reading, setReading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  // Éditeur de Blueprint (G2) : routes renommées + sélection de fusion.
  const [routeEdits, setRouteEdits] = useState<Record<string, string>>({});
  const [mergeSelection, setMergeSelection] = useState<Set<string>>(new Set());

  // Génération par lots (G2) + interruption / reprise.
  const [results, setResults] = useState<Record<string, GenerateResult>>({});
  const [genCurrent, setGenCurrent] = useState<string | null>(null);
  const [genElapsed, setGenElapsed] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [lotIndex, setLotIndex] = useState(0);
  const [lotCount, setLotCount] = useState(0);
  const [interrupted, setInterrupted] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [runStatus, setRunStatus] = useState<string>("running");

  // Runs persistants (G2) : historique + reprise.
  const [runsList, setRunsList] = useState<RunSummary[]>([]);

  // Reliaison auto bouton → workflow (G2).
  const [workflowsCount, setWorkflowsCount] = useState(0);
  const [autoLink, setAutoLink] = useState(true);

  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [linkedCount, setLinkedCount] = useState<number | null>(null);

  // ── Chargements initiaux (runs + workflows du projet) ────────────────────
  const loadRuns = useCallback(async () => {
    try {
      const d = await apiFetch<{ runs: RunSummary[] }>("/api/generator/runs");
      setRunsList(d.runs);
    } catch {
      /* silencieux : l'historique est optionnel */
    }
  }, []);

  useEffect(() => {
    void loadRuns();
  }, [loadRuns]);

  useEffect(() => {
    if (!projectId) {
      setWorkflowsCount(0);
      return;
    }
    let alive = true;
    apiFetch<{ workflows: WorkflowSummary[] }>(`/api/workflows?projectId=${projectId}`)
      .then((d) => {
        if (alive) setWorkflowsCount(d.workflows.length);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [projectId]);

  // ── Routes effectives (éditeur de Blueprint → contexte IA + import) ──────
  const effectiveRouteOf = useCallback(
    (name: string): string => {
      const edited = routeEdits[name]?.trim() ? normalizeEditedRoute(routeEdits[name]) : null;
      if (edited) return edited;
      return blueprint?.routes.find((r) => r.source === name)?.route ?? fileNameToRoute(name);
    },
    [routeEdits, blueprint],
  );

  const buildRoutes = useCallback((): RouteInfo[] => {
    return files.map((f) => {
      const scanned = blueprint?.routes.find((r) => r.source === f.name);
      const edited = routeEdits[f.name]?.trim() ? normalizeEditedRoute(routeEdits[f.name]) : null;
      return { route: edited ?? scanned?.route ?? fileNameToRoute(f.name), source: f.name, title: scanned?.title ?? "" };
    });
  }, [files, blueprint, routeEdits]);

  /** Collisions de routes recalculées en direct après édition. */
  const liveCollisions = useMemo(() => {
    if (files.length === 0) return [];
    const byRoute = new Map<string, string[]>();
    for (const f of files) {
      const route = effectiveRouteOf(f.name);
      byRoute.set(route, [...(byRoute.get(route) ?? []), f.name]);
    }
    return [...byRoute.entries()].filter(([, srcs]) => srcs.length > 1).map(([route, srcs]) => `${route} ← ${srcs.join(", ")}`);
  }, [files, effectiveRouteOf]);

  // ── Import des fichiers ──────────────────────────────────────────────────
  const handleFiles = useCallback(
    async (list: FileList | null) => {
      if (!list || list.length === 0) return;
      setReading(true);
      const added: SourceFile[] = [];
      let zipInfo: { files: number; rejected: number } | null = null;
      try {
        for (const file of Array.from(list).slice(0, 20)) {
          if (/\.zip$/i.test(file.name)) {
            // Sécurité ZIP serveur (G3) : l'archive est extraite via l'API,
            // avec boucliers zip slip / tailles / chemins.
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result ?? ""));
              reader.onerror = () => reject(new Error("lecture impossible"));
              reader.readAsDataURL(file);
            });
            const zipBase64 = dataUrl.split(",")[1] ?? "";
            const d = await apiFetch<{
              files: SourceFile[];
              rejected: { name: string; reason: string }[];
              warnings: string[];
            }>("/api/generator/extract", {
              method: "POST",
              body: JSON.stringify({ zipBase64 }),
            });
            added.push(...d.files);
            zipInfo = { files: d.files.length, rejected: d.rejected.length };
            if (d.rejected.length > 0) {
              toast({
                title: `${d.rejected.length} entrée(s) rejetée(s) dans l'archive`,
                description: d.rejected
                  .slice(0, 3)
                  .map((r) => `${r.name} — ${r.reason}`)
                  .join(" · "),
              });
            }
            for (const w of d.warnings.slice(0, 2)) {
              toast({ title: "Archive ZIP", description: w });
            }
          } else if (/\.(html?|htm|txt)$/i.test(file.name)) {
            added.push({ name: file.name, content: (await file.text()).slice(0, MAX_CONTENT_CHARS) });
          }
        }
        if (added.length === 0) {
          toast({
            title: "Aucun fichier HTML",
            description: "Formats acceptés : .html, .htm, .txt et .zip (extraction sécurisée côté serveur).",
            variant: "destructive",
          });
        } else {
          setFiles((prev) => {
            const names = new Set(prev.map((f) => f.name));
            const merged = [...prev, ...added.filter((f) => !names.has(f.name))];
            return merged.slice(0, 50);
          });
          toast({
            title: `${added.length} page(s) ajoutée(s)`,
            description: zipInfo
              ? `Archive ZIP extraite côté serveur (${zipInfo.files} page(s), ${zipInfo.rejected} rejet(s)).`
              : "Lancez l'analyse pour générer le Blueprint.",
          });
        }
      } catch (e) {
        toast({
          title: "Lecture impossible",
          description: e instanceof Error ? e.message : "Le fichier est illisible ou corrompu.",
          variant: "destructive",
        });
      } finally {
        setReading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [toast],
  );

  const addPasted = useCallback(() => {
    if (!pasteHtml.trim()) return;
    const name = pasteName.trim()
      ? pasteName.trim().endsWith(".html")
        ? pasteName.trim()
        : `${pasteName.trim()}.html`
      : "page-collee.html";
    setFiles((prev) => [...prev.filter((f) => f.name !== name), { name, content: pasteHtml.trim() }]);
    setPasteHtml("");
    setPasteName("");
    toast({ title: "Page collée ajoutée", description: name });
  }, [pasteHtml, pasteName, toast]);

  // ── Phase 0 — scan Blueprint ─────────────────────────────────────────────
  const runScan = useCallback(
    async (fileList?: SourceFile[], targetStep: Step = "blueprint") => {
      const source = fileList ?? files;
      if (source.length === 0) return;
      setScanning(true);
      try {
        const data = await apiFetch<{ blueprint: Blueprint }>("/api/generator/scan", {
          method: "POST",
          body: JSON.stringify({ files: source }),
        });
        setBlueprint(data.blueprint);
        setRouteEdits(Object.fromEntries(data.blueprint.routes.map((r) => [r.source, r.route])));
        setResults({});
        setGeneratedCount(0);
        setImportedCount(0);
        setLinkedCount(null);
        setRunId(null);
        setRunStatus("running");
        setInterrupted(false);
        setMergeSelection(new Set());
        setStep(targetStep);
      } catch (e) {
        toast({ title: "Analyse impossible", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
      } finally {
        setScanning(false);
      }
    },
    [files, toast],
  );

  // ── Éditeur de Blueprint : fusion & réordonnancement ─────────────────────
  const moveFile = useCallback((index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      const a = next[index]!;
      next[index] = next[j]!;
      next[j] = a;
      return next;
    });
  }, []);

  const toggleMerge = useCallback((name: string, checked: boolean) => {
    setMergeSelection((prev) => {
      const next = new Set(prev);
      if (checked) next.add(name);
      else next.delete(name);
      return next;
    });
  }, []);

  const mergeSelected = useCallback(async () => {
    const selected = files.filter((f) => mergeSelection.has(f.name));
    if (selected.length < 2) return;
    const first = selected[0]!;
    const mergedContent = selected.map((f) => `<!-- PAGE: ${f.name} -->\n${f.content}`).join("\n\n");
    const merged: SourceFile = { name: first.name, content: mergedContent.slice(0, MAX_CONTENT_CHARS) };
    const newFiles: SourceFile[] = [];
    let inserted = false;
    for (const f of files) {
      if (mergeSelection.has(f.name)) {
        if (!inserted) {
          newFiles.push(merged);
          inserted = true;
        }
        continue;
      }
      newFiles.push(f);
    }
    setFiles(newFiles);
    setMergeSelection(new Set());
    setRouteEdits((prev) => Object.fromEntries(Object.entries(prev).filter(([src]) => newFiles.some((f) => f.name === src))));
    await runScan(newFiles);
    toast({
      title: `${selected.length} pages fusionnées en « ${first.name} »`,
      description: "Le Blueprint a été rescanné avec le contenu fusionné.",
    });
  }, [files, mergeSelection, runScan, toast]);

  // ── Génération (lots + persistance runId + file d'attente anti-502) ──────
  const sleep = useCallback((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)), []);

  const generatePage = useCallback(
    async (file: SourceFile, opts?: { force?: boolean; activeRunId?: string | null }): Promise<GenerateResult | null> => {
      const startTask = (): Promise<{ page?: GenerateResult; queued?: boolean; runId?: string; fileName?: string }> =>
        apiFetch("/api/generator/generate", {
          method: "POST",
          body: JSON.stringify({
            source: file.name,
            html: file.content,
            runId: opts?.activeRunId ?? undefined,
            routes: buildRoutes(),
            force: opts?.force ?? false,
            // File d'attente (correctif 502) : dès qu'un run persiste les
            // résultats, la conversion tourne en arrière-plan et la route
            // répond en < 1 s ; le suivi se fait via /api/generator/status.
            mode: opts?.activeRunId ? "queued" : "sync",
          }),
        });

      /** Interroge le statut jusqu'à done / failed / annulation (~9 min max). */
      const pollStatus = async (
        runId: string,
        fileName: string,
      ): Promise<GenerateResult | "failed" | "cancelled"> => {
        for (let i = 0; i < POLL_MAX_TRIES; i++) {
          if (cancelRef.current) return "cancelled";
          await sleep(POLL_INTERVAL_MS);
          if (cancelRef.current) return "cancelled";
          try {
            const s = await apiFetch<{ status: string; page?: GenerateResult; error?: string }>(
              `/api/generator/status?runId=${encodeURIComponent(runId)}&fileName=${encodeURIComponent(fileName)}`,
            );
            setGenElapsed(Math.round(((i + 1) * POLL_INTERVAL_MS) / 1000));
            if (s.status === "done" && s.page) return s.page;
            if (s.status === "failed") return "failed";
          } catch {
            /* erreur réseau passagère : nouveau cycle */
          }
        }
        return "failed";
      };

      try {
        // Tentative + relance automatique unique en cas d'échec transitoire.
        for (let attempt = 1; attempt <= 2; attempt++) {
          const data = await startTask();
          if (data.page) return data.page;
          if (data.queued && data.runId && data.fileName) {
            const outcome = await pollStatus(data.runId, data.fileName);
            if (outcome === "cancelled") return null;
            if (outcome !== "failed") return outcome;
          } else if (!data.queued) {
            return null; // réponse inattendue du serveur
          }
          if (attempt < 2 && !cancelRef.current) await sleep(1_200);
        }
        return null;
      } catch (e) {
        toast({
          title: `Échec : ${file.name}`,
          description: e instanceof Error ? e.message : undefined,
          variant: "destructive",
        });
        return null;
      }
    },
    [buildRoutes, toast, sleep],
  );

  const errorResult = (message: string): GenerateResult => ({
    components: [],
    decisions: [],
    warnings: [],
    engine: "secours",
    coverage: [],
    durationMs: 0,
    error: message,
  });

  /** Traite les pages cibles en lots (progression par lot + annulation).
   * Retourne le nombre de pages réellement traitées et si une annulation a eu lieu. */
  const processLots = useCallback(
    async (
      targets: SourceFile[],
      activeRunId: string | null,
    ): Promise<{ cancelled: boolean; completed: number }> => {
      const lots = chunk(targets, LOT_SIZE);
      setLotCount(lots.length);
      setLotIndex(0);
      let done = 0;
      let cancelled = false;
      for (let li = 0; li < lots.length; li++) {
        if (cancelRef.current) {
          cancelled = true;
          break;
        }
        setLotIndex(li);
        await runPool(lots[li]!, CONCURRENCY, async (file) => {
          if (cancelRef.current) {
            cancelled = true;
            return;
          }
          setGenCurrent(file.name);
          setGenElapsed(0);
          const result = await generatePage(file, { activeRunId });
          // Interruption en cours de suivi : la page se termine en arrière-plan
          // (résultat en cache pour la reprise) → pas de badge d'erreur.
          if (!result && cancelRef.current) return;
          setResults((prev) => ({ ...prev, [file.name]: result ?? errorResult("Échec de génération") }));
          done += 1;
          setGeneratedCount((n) => n + 1);
        });
      }
      if (cancelRef.current) cancelled = true;
      setGenCurrent(null);
      setGenElapsed(0);
      return { cancelled, completed: done };
    },
    [generatePage],
  );

  const runGenerateAll = useCallback(async () => {
    if (!blueprint || files.length === 0) return;
    setStep("generate");
    setResults({});
    setGeneratedCount(0);
    setInterrupted(false);
    cancelRef.current = false;
    setRunStatus("running");

    // Persistance du run (G2) : reprise après interruption + rapport.
    let activeRunId: string | null = null;
    try {
      const d = await apiFetch<{ run: { id: string } }>("/api/generator/runs", {
        method: "POST",
        body: JSON.stringify({
          projectId: projectId ?? null,
          blueprint: { ...blueprint, routes: buildRoutes() },
          files,
        }),
      });
      activeRunId = d.run.id;
      setRunId(d.run.id);
    } catch {
      toast({ title: "Persistance du run impossible", description: "La génération continue sans reprise." });
    }

    const outcome = await processLots(files, activeRunId);
    // Annulation tardive (tout s'est déjà traité) → le run est considéré comme terminé.
    const finished = !outcome.cancelled || outcome.completed >= files.length;
    const finalStatus = finished ? "done" : "interrupted";
    setRunStatus(finalStatus);
    setInterrupted(!finished);
    if (activeRunId) {
      void apiFetch(`/api/generator/runs/${activeRunId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: finalStatus }),
      }).catch(() => {});
    }
    void loadRuns();
  }, [blueprint, files, projectId, buildRoutes, processLots, toast, loadRuns]);

  /** Reprise : régénère uniquement les pages manquantes ou en échec. */
  const resumeGeneration = useCallback(async () => {
    if (!runId) return;
    cancelRef.current = false;
    setInterrupted(false);
    setRunStatus("running");
    void apiFetch(`/api/generator/runs/${runId}`, { method: "PATCH", body: JSON.stringify({ status: "running" }) }).catch(() => {});
    const targets = files.filter((f) => {
      const r = results[f.name];
      return !r || r.error;
    });
    if (targets.length === 0) {
      setRunStatus("done");
      return;
    }
    const outcome = await processLots(targets, runId);
    const finished = !outcome.cancelled || outcome.completed >= targets.length;
    const finalStatus = finished ? "done" : "interrupted";
    setRunStatus(finalStatus);
    setInterrupted(!finished);
    void apiFetch(`/api/generator/runs/${runId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: finalStatus }),
    }).catch(() => {});
    void loadRuns();
  }, [runId, files, results, processLots, loadRuns]);

  /** Réparation ciblée page par page (G3) : force = ignore le cache. */
  const repairPage = useCallback(
    async (file: SourceFile) => {
      setGenCurrent(file.name);
      setGenElapsed(0);
      const result = await generatePage(file, { force: true, activeRunId: runId });
      if (result) setResults((prev) => ({ ...prev, [file.name]: result }));
      else if (!cancelRef.current)
        setResults((prev) => ({ ...prev, [file.name]: errorResult("Échec de génération — réessayez ou importez à nouveau.") }));
      setGenCurrent(null);
      setGenElapsed(0);
    },
    [generatePage, runId],
  );

  const cancelGeneration = useCallback(() => {
    cancelRef.current = true;
    toast({ title: "Interruption demandée", description: "La génération s'arrête après la page en cours." });
  }, [toast]);

  // ── Runs persistants : reprendre / voir / supprimer ──────────────────────
  const loadRun = useCallback(async (runIdToLoad: string, mode: "resume" | "view") => {
    try {
      const d = await apiFetch<{ run: RunDetail }>(`/api/generator/runs/${runIdToLoad}`);
      const run = d.run;
      setFiles(run.files);
      setBlueprint(run.blueprint);
      setRouteEdits(Object.fromEntries(run.blueprint.routes.map((r) => [r.source, r.route])));
      setRunId(run.id);
      setRunStatus(run.status);
      setGeneratedCount(run.pages.filter((p) => p.status === "done").length);
      setResults(Object.fromEntries(run.pages.filter((p) => p.status === "done").map((p) => [p.fileName, resultOfRunPage(p)])));
      setImportedCount(0);
      setLinkedCount(null);
      setStep("generate");
      setInterrupted(run.status === "interrupted");
      if (mode === "resume") void resumeRunAfterLoad(run);
    } catch (e) {
      toast({ title: "Run introuvable", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  }, [toast]);

  /** Reprise effective après hydratation d'un run (génère le reste). */
  const resumeRunAfterLoad = useCallback(
    async (run: RunDetail) => {
      cancelRef.current = false;
      setRunStatus("running");
      void apiFetch(`/api/generator/runs/${run.id}`, { method: "PATCH", body: JSON.stringify({ status: "running" }) }).catch(() => {});
      const doneNames = new Set(run.pages.filter((p) => p.status === "done").map((p) => p.fileName));
      const targets = run.files.filter((f) => !doneNames.has(f.name));
      if (targets.length === 0) {
        setRunStatus("done");
        return;
      }
      const outcome = await processLots(targets, run.id);
      const finished = !outcome.cancelled || outcome.completed >= targets.length;
      const finalStatus = finished ? "done" : "interrupted";
      setRunStatus(finalStatus);
      setInterrupted(!finished);
      void apiFetch(`/api/generator/runs/${run.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: finalStatus }),
      }).catch(() => {});
      void loadRuns();
    },
    [processLots, loadRuns],
  );

  const deleteRun = useCallback(
    async (id: string) => {
      try {
        await apiFetch(`/api/generator/runs/${id}`, { method: "DELETE" });
        setRunsList((prev) => prev.filter((r) => r.id !== id));
        toast({ title: "Run supprimé" });
      } catch (e) {
        toast({ title: "Suppression impossible", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
      }
    },
    [toast],
  );

  // ── Reliaison auto + import Builder ──────────────────────────────────────
  const importToBuilder = useCallback(async () => {
    if (!blueprint) return;
    const ok = files.filter((f) => results[f.name] && !results[f.name].error && results[f.name].components.length > 0);
    if (ok.length === 0) return;
    setImporting(true);
    let count = 0;
    let linked = 0;
    try {
      // 1. Reliaison auto bouton → workflow (mapping par nom, G2).
      let finalComponents = ok.map((f) => ({ source: f.name, components: results[f.name]!.components }));
      if (autoLink && projectId && workflowsCount > 0) {
        try {
          const d = await apiFetch<{ pages: { source: string; components: BuilderComponent[] }[]; linkedCount: number; mappings: WorkflowMapping[] }>(
            "/api/generator/auto-link",
            {
              method: "POST",
              body: JSON.stringify({
                projectId,
                pages: ok.map((f) => ({ source: f.name, components: results[f.name]!.components })),
              }),
            },
          );
          finalComponents = d.pages;
          linked = d.linkedCount;
          if (d.mappings.length > 0) {
            toast({
              title: `${d.linkedCount} bouton(s) relié(s) à des workflows`,
              description: d.mappings
                .slice(0, 3)
                .map((m) => `« ${m.buttonText} » → ${m.workflowName}`)
                .join(" · "),
            });
          }
        } catch {
          toast({ title: "Reliaison auto indisponible", description: "L'import continue avec les actions d'origine." });
        }
      }

      // 2. Import des pages dans le projet actif (noms uniques garantis :
      // deux pages avec le même <title> → suffixe par route).
      const routes = buildRoutes();
      const usedNames = new Set<string>();
      const query = projectId ? `?projectId=${projectId}` : "";
      for (const file of ok) {
        const route = routes.find((r) => r.source === file.name);
        const baseName = ((route?.title || file.name.replace(/\.(html?|htm)$/i, "")).trim() || "Page").slice(0, 60);
        let name = baseName;
        if (usedNames.has(name)) {
          name = `${baseName} · ${route?.route ?? "page"}`.slice(0, 80);
          let n = 2;
          while (usedNames.has(name)) name = `${baseName} (${n++})`.slice(0, 80);
        }
        usedNames.add(name);
        const components = finalComponents.find((p) => p.source === file.name)?.components ?? results[file.name]!.components;
        const created = await apiFetch<{ page: { id: string } }>(`/api/pages${query}`, {
          method: "POST",
          body: JSON.stringify({ name }),
        });
        await apiFetch(`/api/pages/${created.page.id}`, {
          method: "PUT",
          body: JSON.stringify({ layoutJson: JSON.stringify(components) }),
        });
        count += 1;
        setImportedCount(count);
      }
      setLinkedCount(linked > 0 ? linked : null);
      toast({
        title: `${count} page(s) importée(s)`,
        description:
          linked > 0
            ? `${linked} bouton(s) déjà relié(s) à vos workflows — ouvertures dans le Builder UI.`
            : "Ouvrez le Builder UI pour les personnaliser.",
      });
      setStep("done");
    } catch (e) {
      toast({ title: "Import interrompu", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }, [blueprint, files, results, projectId, autoLink, workflowsCount, buildRoutes, toast]);

  // ── Observabilité (G3) ───────────────────────────────────────────────────
  const obs = useMemo(() => {
    const done = Object.values(results).filter((r) => !r.error);
    const ia = done.filter((r) => r.engine === "ia" && !r.cached).length;
    const cached = done.filter((r) => r.cached).length;
    const secours = done.filter((r) => r.engine === "secours" && !r.cached).length;
    const repaired = done.filter((r) => (r.attempts ?? 0) > 1).length;
    const totalMs = done.reduce((acc, r) => acc + r.durationMs, 0);
    const tokens = done.reduce((acc, r) => acc + (r.promptTokens ?? 0) + (r.completionTokens ?? 0), 0);
    const coverage = done.reduce(
      (acc, r) => {
        acc.covered += r.coverage.filter((c) => c.status === "covered").length;
        acc.total += r.coverage.length;
        return acc;
      },
      { covered: 0, total: 0 },
    );
    return { done: done.length, ia, cached, secours, repaired, totalMs, tokens, coverage };
  }, [results]);

  const downloadReport = useCallback(async () => {
    if (!runId) return;
    try {
      const d = await apiFetch<{ report: unknown }>(`/api/generator/runs/${runId}/report`);
      const blob = new Blob([JSON.stringify(d.report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `forge-generateur-rapport-${runId.slice(-6)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Rapport téléchargé", description: "Observabilité complète : durées, jetons, couverture." });
    } catch (e) {
      toast({ title: "Rapport indisponible", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  }, [runId, toast]);

  const reset = useCallback(() => {
    setStep("import");
    setFiles([]);
    setBlueprint(null);
    setResults({});
    setGeneratedCount(0);
    setImportedCount(0);
    setLinkedCount(null);
    setRunId(null);
    setRunStatus("running");
    setInterrupted(false);
    setRouteEdits({});
    setMergeSelection(new Set());
    cancelRef.current = false;
    void loadRuns();
  }, [loadRuns]);

  const totalInteractions = blueprint?.interactions.length ?? 0;
  const generatedResults = files.map((f) => ({ file: f, result: results[f.name] })).filter((r) => r.result);
  const importable = generatedResults.filter((r) => !r.result!.error && r.result!.components.length > 0);
  const allGenerated = files.length > 0 && generatedCount >= files.length;
  const generating = genCurrent !== null;

  const ObsCard = (
    <Card>
      <CardContent className="p-4">
        <p className="mb-2.5 flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Database className="size-4 text-emerald-600" aria-hidden="true" /> Observabilité
          {runId && (
            <Button size="sm" variant="outline" className="ml-auto gap-1.5 text-xs" onClick={() => void downloadReport()}>
              <Download className="size-3.5" aria-hidden="true" /> Rapport JSON
            </Button>
          )}
        </p>
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          {[
            { label: "IA", value: obs.ia },
            { label: "Cache", value: obs.cached },
            { label: "Secours", value: obs.secours },
            { label: "Réparées", value: obs.repaired },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-zinc-50/60 px-2 py-2">
              <p className="text-lg font-bold tracking-tight">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            Durée : <strong className="font-medium text-foreground">{(obs.totalMs / 1000).toFixed(1)} s</strong>
            {obs.done > 0 && <> (moy. {Math.round(obs.totalMs / obs.done / 100) / 10} s/page)</>}
          </span>
          {obs.tokens > 0 && (
            <span>
              Jetons : <strong className="font-medium text-foreground">{obs.tokens.toLocaleString("fr-FR")}</strong>
            </span>
          )}
          {obs.coverage.total > 0 && (
            <span>
              Couverture :{" "}
              <strong className="font-medium text-foreground">
                {obs.coverage.covered}/{obs.coverage.total}
              </strong>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <SectionHeader
        title="Générateur"
        description="Importez des pages HTML : le Blueprint est scanné, l'IA convertit chaque page en composants du Builder avec toutes les interactions câblées (zéro bouton mort). Éditez le Blueprint, générez par lots, reprenez après interruption, reliez vos workflows — rapport d'observabilité inclus."
      />

      {/* Fil d'étapes */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5" role="group" aria-label="Étapes du générateur">
        {STEPS.map((s, i) => {
          const index = STEPS.findIndex((x) => x.id === step);
          const reached = i <= Math.max(index, step === "done" ? 3 : i);
          const isActive = s.id === step;
          return (
            <span
              key={s.id}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : reached ? "border-zinc-200 bg-white text-zinc-600" : "border-zinc-200 bg-zinc-50 text-zinc-400",
              )}
            >
              {i > 0 && <ArrowRight className="hidden size-3 sm:block" aria-hidden="true" />}
              {s.label}
            </span>
          );
        })}
      </div>

      {/* ─── Étape 1 : Import ─────────────────────────────────────────────── */}
      {step === "import" && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white" aria-hidden="true">
                    <Upload className="size-4" />
                  </span>
                  <h3 className="font-semibold tracking-tight">Fichiers</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Sélectionnez des pages <code className="rounded bg-zinc-100 px-1 font-mono text-xs">.html</code> ou une archive{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono text-xs">.zip</code> — extraite côté serveur avec boucliers
                  de sécurité (zip slip, tailles, chemins).
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".html,.htm,.zip,.txt"
                  className="hidden"
                  onChange={(e) => void handleFiles(e.target.files)}
                />
                <Button className="gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={reading}>
                  {reading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                  {reading ? "Lecture…" : "Choisir des fichiers"}
                </Button>

                {files.length > 0 && (
                  <div className={cn("mt-4 max-h-56 space-y-1.5 overflow-y-auto pr-1", SCROLLBAR_Y)}>
                    {files.map((f) => (
                      <div key={f.name} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm">
                        <FileCode2 className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate font-mono text-xs">{f.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(f.content.length)}</span>
                        <button
                          type="button"
                          aria-label={`Retirer ${f.name}`}
                          className="rounded p-1 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => setFiles((prev) => prev.filter((x) => x.name !== f.name))}
                        >
                          <X className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Separator className="my-4" />
                <Button className="w-full gap-1.5" onClick={() => void runScan()} disabled={files.length === 0 || scanning}>
                  {scanning ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ScanLine className="size-4" aria-hidden="true" />}
                  {scanning ? "Analyse…" : `Analyser ${files.length} page(s) → Blueprint`}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white" aria-hidden="true">
                    <FileCode2 className="size-4" />
                  </span>
                  <h3 className="font-semibold tracking-tight">Coller du HTML</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="paste-name">Nom de la page (optionnel)</Label>
                    <Input id="paste-name" placeholder="dashboard.html" value={pasteName} onChange={(e) => setPasteName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="paste-html">Code source HTML</Label>
                    <Textarea
                      id="paste-html"
                      placeholder="<!DOCTYPE html> …"
                      className="min-h-40 font-mono text-xs"
                      value={pasteHtml}
                      onChange={(e) => setPasteHtml(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="gap-1.5" onClick={addPasted} disabled={!pasteHtml.trim()}>
                    <Plus className="size-4" aria-hidden="true" /> Ajouter la page collée
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Runs persistants (G2) : reprise après interruption */}
          {runsList.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2 font-semibold tracking-tight">
                  <History className="size-4 text-emerald-600" aria-hidden="true" /> Runs récents
                  <span className="text-xs font-normal text-muted-foreground">— reprenez une génération interrompue</span>
                </h3>
                <div className={cn("max-h-64 space-y-2 overflow-y-auto pr-1", SCROLLBAR_Y)}>
                  {runsList.map((r) => {
                    const meta = RUN_STATUS_META[r.status] ?? RUN_STATUS_META.done!;
                    const processed = r.counts.done + r.counts.failed;
                    return (
                      <div key={r.id} className="flex flex-wrap items-center gap-2 rounded-lg border bg-white px-3 py-2">
                        <Badge className={cn("hover:bg-inherit", meta.badge)}>{meta.label}</Badge>
                        <span className="text-sm">
                          {processed}/{r.totalFiles} page(s)
                          {r.counts.failed > 0 && <span className="text-rose-600"> · {r.counts.failed} échec(s)</span>}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">{timeAgoFr(r.updatedAt)}</span>
                        {r.status !== "done" && r.counts.pending + r.counts.failed > 0 && (
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => void loadRun(r.id, "resume")}>
                            <Play className="size-3.5" aria-hidden="true" /> Reprendre
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-1.5 text-xs" onClick={() => void loadRun(r.id, "view")}>
                          Voir
                        </Button>
                        <button
                          type="button"
                          aria-label={`Supprimer le run du ${timeAgoFr(r.updatedAt)}`}
                          className="rounded p-1 text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                          onClick={() => void deleteRun(r.id)}
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ─── Étape 2 : Blueprint + éditeur (G2) ───────────────────────────── */}
      {step === "blueprint" && blueprint && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pages", value: files.length },
              { label: "Interactions", value: totalInteractions },
              { label: "Boutons", value: blueprint.interactions.filter((i) => i.kind === "button").length },
              { label: "Champs", value: blueprint.interactions.filter((i) => i.kind === "input").length },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {(liveCollisions.length > 0 || blueprint.warnings.length > 0) && (
            <div className="space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {[...liveCollisions.map((c) => `Collision de routes : ${c}`), ...blueprint.warnings].map((w, i) => (
                <p key={i} className="flex items-start gap-2">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {w}
                </p>
              ))}
            </div>
          )}

          {/* Éditeur : renommer les routes, fusionner, réordonner */}
          <Card>
            <CardContent className="p-5">
              <h3 className="mb-1 flex flex-wrap items-center gap-2 font-semibold tracking-tight">
                <ScanLine className="size-4 text-emerald-600" aria-hidden="true" /> Éditeur de Blueprint
                {mergeSelection.size >= 2 && (
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => void mergeSelected()} disabled={scanning}>
                    <GitMerge className="size-3.5" aria-hidden="true" /> Fusionner la sélection ({mergeSelection.size})
                  </Button>
                )}
              </h3>
              <p className="mb-3 text-xs text-muted-foreground">
                Renommez les routes (c&apos;est cette carte que l&apos;IA recevra), cochez deux pages ou plus pour les fusionner,
                réordonnez avec les flèches.
              </p>
              <div className={cn("max-h-96 space-y-3 overflow-y-auto pr-1", SCROLLBAR_Y)}>
                {files.map((f, index) => {
                  const items = blueprint.interactions.filter((i) => i.source === f.name);
                  return (
                    <div key={f.name} className="rounded-lg border bg-white">
                      <div className="flex flex-wrap items-center gap-2 border-b bg-zinc-50/60 px-3 py-2">
                        <Checkbox
                          aria-label={`Sélectionner ${f.name} pour fusion`}
                          checked={mergeSelection.has(f.name)}
                          onCheckedChange={(checked) => toggleMerge(f.name, checked === true)}
                        />
                        <span className="flex items-center rounded-md border bg-white pl-2 font-mono text-xs text-zinc-500">/</span>
                        <Input
                          aria-label={`Route de ${f.name}`}
                          className="h-8 w-36 font-mono text-xs"
                          value={routeEdits[f.name] ?? blueprint.routes.find((r) => r.source === f.name)?.route ?? ""}
                          onChange={(e) => setRouteEdits((prev) => ({ ...prev, [f.name]: e.target.value }))}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {blueprint.routes.find((r) => r.source === f.name)?.title || f.name}
                        </span>
                        <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{f.name}</span>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            aria-label={`Monter ${f.name}`}
                            disabled={index === 0}
                            className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                            onClick={() => moveFile(index, -1)}
                          >
                            <ArrowUp className="size-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Descendre ${f.name}`}
                            disabled={index === files.length - 1}
                            className="rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30"
                            onClick={() => moveFile(index, 1)}
                          >
                            <ArrowDown className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      {items.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 p-3">
                          {items.map((it) => {
                            const meta = KIND_META[it.kind]!;
                            const Icon = meta.icon;
                            return (
                              <span key={it.id} className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-xs" title={it.id}>
                                <Icon className="size-3 text-zinc-500" aria-hidden="true" />
                                <span className="max-w-52 truncate">{it.label}</span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="px-3 py-3 text-xs text-muted-foreground">Aucune interaction détectée.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="gap-1.5" onClick={() => setStep("import")}>
              <ArrowLeft className="size-4" aria-hidden="true" /> Retour
            </Button>
            <Button className="gap-1.5" onClick={() => void runGenerateAll()} disabled={files.length === 0 || scanning}>
              <Sparkles className="size-4" aria-hidden="true" /> Générer les {files.length} page(s) avec l&apos;IA
            </Button>
          </div>
        </div>
      )}

      {/* ─── Étape 3 : Génération par lots ────────────────────────────────── */}
      {step === "generate" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  {generating ? (
                    <Loader2 className="size-4 animate-spin text-emerald-600" aria-hidden="true" />
                  ) : interrupted ? (
                    <TriangleAlert className="size-4 text-amber-500" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                  )}
                  {generating
                    ? `Conversion : ${genCurrent}${genElapsed > 0 ? ` · ${genElapsed} s` : ""}`
                    : interrupted
                      ? "Génération interrompue"
                      : "Conversion terminée"}
                  {lotCount > 1 && (
                    <Badge variant="secondary" className="text-[11px]">
                      Lot {Math.min(lotIndex + 1, lotCount)}/{lotCount} · {LOT_SIZE} pages par lot
                    </Badge>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">{generatedCount}/{files.length}</span>
                  {generating && (
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={cancelGeneration}>
                      <Square className="size-3.5" aria-hidden="true" /> Interrompre
                    </Button>
                  )}
                  {!generating && interrupted && (
                    <Button size="sm" className="gap-1.5 text-xs" onClick={() => void resumeGeneration()}>
                      <Play className="size-3.5" aria-hidden="true" /> Reprendre
                    </Button>
                  )}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${Math.round((generatedCount / Math.max(1, files.length)) * 100)}%` }} />
              </div>
              {runId && (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Run persistant <span className="font-mono">#{runId.slice(-6)}</span> — statut : {RUN_STATUS_META[runStatus]?.label ?? runStatus}.
                  Vous pouvez fermer l&apos;onglet et reprendre depuis l&apos;accueil du Générateur.
                </p>
              )}
            </CardContent>
          </Card>

          {generatedResults.map(({ file, result }) => {
            const coveredCount = result!.coverage.filter((c) => c.status === "covered").length;
            const attempts = result!.attempts ?? 0;
            const tokens = (result!.promptTokens ?? 0) + (result!.completionTokens ?? 0);
            return (
              <Card key={file.name}>
                <CardContent className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <FileCode2 className="size-4 text-emerald-600" aria-hidden="true" />
                    <span className="font-mono text-xs text-muted-foreground">{file.name}</span>
                    {result!.error ? (
                      <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Échec</Badge>
                    ) : result!.cached ? (
                      <Badge className="bg-zinc-200 text-zinc-700 hover:bg-zinc-200">
                        <Database className="size-3" aria-hidden="true" /> Cache
                      </Badge>
                    ) : result!.engine === "ia" ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <Zap className="size-3" aria-hidden="true" /> IA
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Moteur de secours</Badge>
                    )}
                    {attempts > 1 && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Réparée ({attempts} tentatives)</Badge>
                    )}
                    {!result!.error && (
                      <span className="text-xs text-muted-foreground">
                        {result!.components.length} composants · {(result!.durationMs / 1000).toFixed(1)} s
                        {tokens > 0 && ` · ${tokens.toLocaleString("fr-FR")} jetons`}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto gap-1.5 text-xs"
                      disabled={generating}
                      onClick={() => void repairPage(file)}
                    >
                      <RefreshCw className="size-3.5" aria-hidden="true" /> Réparer
                    </Button>
                  </div>

                  {result!.error ? (
                    <p className="text-sm text-rose-600">{result!.error}</p>
                  ) : (
                    <>
                      {result!.coverage.length > 0 && (
                        <div className="mb-3">
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            Couverture des interactions — {coveredCount}/{result!.coverage.length}
                          </p>
                          <div className={cn("max-h-28 space-y-1 overflow-y-auto pr-1", SCROLLBAR_Y)}>
                            {result!.coverage.map((c) => (
                              <p key={c.interactionId} className="flex items-center gap-2 text-xs">
                                {c.status === "covered" ? (
                                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                                ) : (
                                  <TriangleAlert className="size-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                                )}
                                <span className={cn(c.status === "missing" && "text-muted-foreground")}>
                                  {c.label} <span className="text-zinc-400">({c.kind})</span>
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {result!.components.slice(0, 12).map((c) => (
                          <span key={c.id} className="rounded border bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600">
                            {c.type}
                            {c.props.text ? ` · ${c.props.text.slice(0, 18)}` : c.props.placeholder ? ` · ${c.props.placeholder.slice(0, 18)}` : ""}
                          </span>
                        ))}
                        {result!.components.length > 12 && (
                          <span className="rounded border bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-500">+{result!.components.length - 12}</span>
                        )}
                      </div>

                      {result!.warnings.length > 0 && (
                        <div className={cn("max-h-24 space-y-1 overflow-y-auto rounded-lg border border-amber-200 bg-amber-50 p-3 pr-2 text-xs text-amber-800", SCROLLBAR_Y)}>
                          {result!.warnings.slice(0, 8).map((w, i) => (
                            <p key={i} className="flex items-start gap-1.5">
                              <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden="true" /> {w}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {allGenerated && !interrupted && ObsCard}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox id="auto-link" checked={autoLink} onCheckedChange={(checked) => setAutoLink(checked === true)} />
                <div>
                  <Label htmlFor="auto-link" className="cursor-pointer text-sm font-medium">
                    Relier automatiquement les boutons aux workflows existants
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {projectId
                      ? workflowsCount > 0
                        ? `Mapping par nom — ${workflowsCount} workflow(s) dans le projet. Les boutons dont le libellé correspond à un workflow exécuteront ce workflow réellement.`
                        : "Aucun workflow dans le projet actif : créez-en dans le module Workflows pour activer la reliaison."
                      : "Activez un projet pour activer la reliaison automatique."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="gap-1.5" onClick={() => setStep("blueprint")}>
              <ArrowLeft className="size-4" aria-hidden="true" /> Blueprint
            </Button>
            <Button className="gap-1.5" disabled={!allGenerated || importable.length === 0 || importing || interrupted} onClick={() => void importToBuilder()}>
              {importing ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LayoutDashboard className="size-4" aria-hidden="true" />}
              {importing
                ? `Import… ${importedCount}/${importable.length}`
                : `Importer ${importable.length} page(s) dans le Builder`}
            </Button>
          </div>
          {allGenerated && interrupted && (
            <p className="text-xs text-muted-foreground">Reprenez la génération pour débloquer l&apos;import des pages restantes.</p>
          )}
        </div>
      )}

      {/* ─── Étape 4 : Terminé ────────────────────────────────────────────── */}
      {step === "done" && (
        <div className="space-y-4">
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="p-8 text-center">
              <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white" aria-hidden="true">
                <CheckCircle2 className="size-6" />
              </span>
              <h3 className="mb-1 text-lg font-semibold tracking-tight">{importedCount} page(s) importée(s) dans le Builder</h3>
              <p className="mx-auto mb-1 max-w-md text-sm text-muted-foreground">
                Les composants, textes et actions sont déjà en place. Ouvrez le Builder UI pour ajuster le design et lier
                les boutons à vos workflows (panneau Propriétés → Actions &amp; Workflows).
              </p>
              {linkedCount !== null && linkedCount > 0 && (
                <p className="mx-auto mb-5 max-w-md text-sm font-medium text-emerald-700">
                  {linkedCount} bouton(s) ont été reliés automatiquement à vos workflows (mapping par nom).
                </p>
              )}
              {linkedCount === null && <div className="mb-5" />}
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Button className="gap-1.5" onClick={onOpenBuilder}>
                  <LayoutDashboard className="size-4" aria-hidden="true" /> Ouvrir le Builder UI
                </Button>
                <Button variant="outline" className="gap-1.5" onClick={reset}>
                  <Plus className="size-4" aria-hidden="true" /> Nouvel import
                </Button>
              </div>
            </CardContent>
          </Card>
          {ObsCard}
        </div>
      )}
    </div>
  );
}
