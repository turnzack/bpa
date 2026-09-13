"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  CircleCheck,
  CircleX,
  Clock,
  FileJson,
  LoaderCircle,
  Play,
  Plus,
  Trash2,
  Workflow as WorkflowIcon,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { defaultNodeForCode } from "@/lib/workflow-nodes";
import { apiFetch, parseJsonSafe, SCROLLBAR_Y, timeAgoFr } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import { NodeCatalogDialog, NodeContractDialog } from "./workflow-nodes-ui";
import {
  LogsTimeline,
  NodeCard,
  STATUS_OPTIONS,
  statusBadge,
} from "./workflow-shared";
import ProjectWizard from "./project-wizard";
import type {
  NodeType,
  RunLog,
  WorkflowDetail,
  WorkflowNode,
  WorkflowNodeConfig,
  WorkflowRunRaw,
  WorkflowRunRecord,
  WorkflowRunResult,
  WorkflowStatus,
  WorkflowSummary,
} from "./types";

export default function WorkflowsView({ projectId }: { projectId?: string | null }) {
  const { toast } = useToast();

  // Thread le projet actif dans les URLs de liste/création (?projectId=).
  const qs = useMemo(() => (projectId ? `?projectId=${projectId}` : ""), [projectId]);

  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [wfName, setWfName] = useState("");
  const [wfStatus, setWfStatus] = useState<WorkflowStatus>("draft");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);

  const [runs, setRuns] = useState<WorkflowRunRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const loadList = useCallback(async (preferredId?: string) => {
    setListLoading(true);
    setListError(null);
    try {
      const d = await apiFetch<{ workflows: WorkflowSummary[] }>(`/api/workflows${qs}`);
      setWorkflows(d.workflows);
      setSelectedId((prev) => {
        if (preferredId && d.workflows.some((w) => w.id === preferredId)) return preferredId;
        if (prev && d.workflows.some((w) => w.id === prev)) return prev;
        return d.workflows[0]?.id ?? null;
      });
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setListLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  // Chargement du détail + de l'historique à chaque sélection.
  useEffect(() => {
    if (!selectedId) {
      setWfName("");
      setWfStatus("draft");
      setNodes([]);
      setRuns([]);
      setRunResult(null);
      setExpandedRunId(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    Promise.all([
      apiFetch<{ workflow: WorkflowDetail }>(`/api/workflows/${selectedId}`),
      apiFetch<{ runs: WorkflowRunRaw[] }>(`/api/workflows/${selectedId}/runs`),
    ])
      .then(([wfRes, runsRes]) => {
        if (cancelled) return;
        setWfName(wfRes.workflow.name);
        setWfStatus((wfRes.workflow.status as WorkflowStatus) ?? "draft");
        setNodes(
          parseJsonSafe<WorkflowNode[]>(wfRes.workflow.nodesJson, []).filter(
            (n): n is WorkflowNode =>
              Boolean(n) && typeof n.id === "string" && typeof n.type === "string"
          )
        );
        setRuns(
          (runsRes.runs ?? []).map((r) => ({
            id: r.id,
            status: r.status,
            durationMs: r.durationMs,
            createdAt: r.createdAt,
            logs: parseJsonSafe<RunLog[]>(r.logsJson, []),
          }))
        );
        setRunResult(null);
        setExpandedRunId(null);
      })
      .catch((e) => {
        if (!cancelled) {
          toast({
            title: "Impossible de charger le workflow",
            description: e instanceof Error ? e.message : undefined,
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId, toast]);

  const updateNode = (id: string, patch: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const updateNodeConfig = (id: string, patch: Partial<WorkflowNodeConfig>) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, config: { ...n.config, ...patch } } : n))
    );
  };

  const moveNode = (id: string, dir: "up" | "down") => {
    setNodes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const addNode = () => {
    setCatalogOpen(true);
  };

  /** Ajoute un nœud depuis le catalogue (palette complète, 12 catégories). */
  const addCatalogNode = (code: string) => {
    const node = defaultNodeForCode(code);
    if (!node) return;
    setNodes((prev) => [...prev, node]);
  };

  const saveWorkflow = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await apiFetch(`/api/workflows/${selectedId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: wfName.trim() || "Workflow sans nom",
          status: wfStatus,
          nodesJson: JSON.stringify(nodes),
        }),
      });
      toast({ title: "Workflow enregistré" });
      void loadList(selectedId);
    } catch (e) {
      toast({
        title: "Enregistrement impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const runWorkflow = async () => {
    if (!selectedId) return;
    setRunning(true);
    try {
      const d = await apiFetch<{ run: WorkflowRunResult }>(`/api/workflows/${selectedId}/run`, {
        method: "POST",
      });
      setRunResult(d.run);
      const r = await apiFetch<{ runs: WorkflowRunRaw[] }>(`/api/workflows/${selectedId}/runs`);
      setRuns(
        (r.runs ?? []).map((raw) => ({
          id: raw.id,
          status: raw.status,
          durationMs: raw.durationMs,
          createdAt: raw.createdAt,
          logs: parseJsonSafe<RunLog[]>(raw.logsJson, []),
        }))
      );
      setHistoryOpen(true);
      void loadList(selectedId);
    } catch (e) {
      toast({
        title: "Échec de l'exécution",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const deleteWorkflow = async () => {
    if (!selectedId) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/workflows/${selectedId}`, { method: "DELETE" });
      toast({ title: "Workflow supprimé" });
      setDeleteOpen(false);
      setSelectedId(null);
      await loadList();
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

  const createWorkflow = async () => {
    const name = newName.trim();
    if (!name) {
      toast({ title: "Donnez un nom au workflow", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const d = await apiFetch<{ workflow: { id: string; name: string } }>(`/api/workflows${qs}`, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setNewOpen(false);
      setNewName("");
      toast({ title: "Workflow créé", description: "Ajoutez des nœuds puis exécutez-le." });
      await loadList(d.workflow.id);
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

  return (
    <div>
      <SectionHeader
        title="Workflows"
        description="Automatisez vos processus : nœuds visuels, déclencheurs webhook/CRON, conditions, HTTP, code et e-mails."
      >
        <Button
          variant="outline"
          size="sm"
          className="min-h-11 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 lg:min-h-9"
          onClick={() => setWizardOpen(true)}
          disabled={!projectId}
          title="Lancer le pipeline Zero-Touch (Stitch / Phases 1-5)"
        >
          🚀 Lancer Pipeline Zero-Touch
        </Button>
      </SectionHeader>

      {listError && (
        <div className="mb-4">
          <ErrorState message={listError} onRetry={() => void loadList()} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* ─── Liste des workflows ──────────────────────────────────────── */}
        <Card className="h-fit gap-0 py-0">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <WorkflowIcon className="size-4 text-emerald-600" aria-hidden="true" />
              Workflows
              <Badge variant="secondary" className="ml-auto font-normal">
                {workflows.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className={cn("max-h-[420px] space-y-1 overflow-y-auto pr-1", SCROLLBAR_Y)}>
              {listLoading ? (
                <div className="space-y-2" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : workflows.length === 0 ? (
                <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                  Aucun workflow pour l&apos;instant.
                </p>
              ) : (
                workflows.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedId(w.id)}
                    aria-pressed={selectedId === w.id}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                      selectedId === w.id
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-transparent hover:bg-zinc-100"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{w.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {w._count?.runs ?? 0} exécutions
                      </span>
                    </span>
                    {statusBadge(w.status)}
                  </button>
                ))
              )}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setNewName("");
                setNewOpen(true);
              }}
            >
              <Plus className="size-4" aria-hidden="true" /> Nouveau workflow
            </Button>
          </CardContent>
        </Card>

        {/* ─── Éditeur ──────────────────────────────────────────────────── */}
        {!selectedId ? (
          <Card className="gap-0 py-0">
            <CardContent className="flex min-h-[420px] flex-col items-center justify-center gap-2 p-6 text-center">
              <WorkflowIcon className="size-8 text-zinc-300" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                {workflows.length === 0
                  ? "Créez votre premier workflow pour automatiser un processus."
                  : "Sélectionnez un workflow à gauche."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="gap-0 py-0">
              {detailLoading ? (
                <CardContent className="space-y-3 p-4" aria-hidden="true">
                  <Skeleton className="h-9 w-64 rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                </CardContent>
              ) : (
                <CardContent className="space-y-4 p-4">
                  {/* Barre d'actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      value={wfName}
                      onChange={(e) => setWfName(e.target.value)}
                      className="h-9 w-56 text-sm font-semibold"
                      aria-label="Nom du workflow"
                    />
                    <Select value={wfStatus} onValueChange={(v) => setWfStatus(v as WorkflowStatus)}>
                      <SelectTrigger className="h-9 w-36" aria-label="Statut du workflow">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="ml-auto flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="min-h-11 lg:min-h-9"
                        onClick={() => void saveWorkflow()}
                        disabled={saving}
                      >
                        {saving ? "Enregistrement…" : "Enregistrer"}
                      </Button>
                      <Button
                        size="sm"
                        className="min-h-11 bg-emerald-600 text-white hover:bg-emerald-700 lg:min-h-9"
                        onClick={() => void runWorkflow()}
                        disabled={running}
                      >
                        <Play className="size-4" aria-hidden="true" /> Exécuter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="min-h-11 text-rose-600 hover:bg-rose-50 hover:text-rose-700 lg:min-h-9"
                        aria-label="Supprimer le workflow"
                        onClick={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {/* Flux de nœuds */}
                  {nodes.length === 0 ? (
                    <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed p-6">
                      <p className="text-sm text-muted-foreground">
                        Aucun nœud — ajoutez votre premier nœud pour construire le flux.
                      </p>
                    </div>
                  ) : (
                    <ol className="space-y-0">
                      {nodes.map((node, i) => (
                        <li key={node.id}>
                          <NodeCard
                            node={node}
                            isFirst={i === 0}
                            isLast={i === nodes.length - 1}
                            onPatch={(patch) => updateNode(node.id, patch)}
                            onPatchConfig={(patch) => updateNodeConfig(node.id, patch)}
                            onMove={(dir) => moveNode(node.id, dir)}
                            onRemove={() => removeNode(node.id)}
                          />
                          {i < nodes.length - 1 && (
                            <div aria-hidden="true" className="mx-auto h-4 w-0.5 bg-zinc-200" />
                          )}
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* Ajout de nœud — palette Workflow complète (12 catégories). */}
                  <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                    <Button size="sm" variant="outline" className="min-h-11 lg:min-h-9" onClick={addNode}>
                      <Plus className="size-4" aria-hidden="true" /> Ajouter un nœud
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="min-h-11 text-xs text-zinc-500 lg:min-h-9"
                      onClick={() => setBrowseOpen(true)}
                    >
                      <BookOpen className="size-3.5" aria-hidden="true" /> Catalogue des nœuds
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="min-h-11 ml-auto text-xs text-zinc-500 lg:min-h-9"
                      onClick={() => setContractOpen(true)}
                      disabled={nodes.length === 0}
                    >
                      <FileJson className="size-3.5" aria-hidden="true" /> Contrat JSON
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Panneau d'exécution */}
            <Card className="gap-0 py-0">
              <CardHeader className="border-b px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Play className="size-4 text-emerald-600" aria-hidden="true" /> Exécution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {running ? (
                  <div className="space-y-2" aria-live="polite">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Exécution du workflow…
                    </p>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : runResult ? (
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          runResult.status === "error"
                            ? "bg-rose-600 text-white hover:bg-rose-600"
                            : "bg-emerald-600 text-white hover:bg-emerald-600"
                        }
                      >
                        {runResult.status === "error" ? "Échec" : "Succès"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {runResult.durationMs} ms
                      </span>
                    </div>
                    <div className="mt-3 border-t pt-3">
                      <LogsTimeline logs={runResult.logs ?? []} />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Lancez une exécution pour observer les logs de chaque nœud en direct.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Historique */}
            <Card className="gap-0 py-0">
              <button
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                aria-expanded={historyOpen}
                className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left hover:bg-zinc-50"
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="size-4 text-zinc-400" aria-hidden="true" />
                  Historique d&apos;exécution
                  <Badge variant="secondary" className="font-normal">
                    {runs.length}
                  </Badge>
                </span>
                <ChevronDown
                  className={cn("size-4 text-zinc-500 transition-transform", historyOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              {historyOpen && (
                <div className="border-t">
                  {runs.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">
                      Aucune exécution pour le moment.
                    </p>
                  ) : (
                    <ul className={cn("max-h-80 divide-y overflow-y-auto", SCROLLBAR_Y)}>
                      {runs.map((r) => {
                        const isError = r.status === "error";
                        const open = expandedRunId === r.id;
                        return (
                          <li key={r.id}>
                            <button
                              type="button"
                              onClick={() => setExpandedRunId(open ? null : r.id)}
                              aria-expanded={open}
                              className="flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left hover:bg-zinc-50"
                            >
                              {isError ? (
                                <CircleX className="size-4 shrink-0 text-rose-600" aria-hidden="true" />
                              ) : (
                                <CircleCheck className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                              )}
                              <span className="flex-1 text-sm">{timeAgoFr(r.createdAt)}</span>
                              <span className="text-xs text-muted-foreground">{r.durationMs} ms</span>
                              <ChevronDown
                                className={cn(
                                  "size-3.5 text-zinc-400 transition-transform",
                                  open && "rotate-180"
                                )}
                                aria-hidden="true"
                              />
                            </button>
                            {open && (
                              <div className="border-t bg-zinc-50/60 px-4 py-3">
                                <LogsTimeline logs={r.logs} />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* ─── Dialog : nouveau workflow ─────────────────────────────────── */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau workflow</DialogTitle>
            <DialogDescription>
              Créez un flux d&apos;automatisation puis composez-le avec des nœuds.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="new-workflow-name">Nom du workflow</Label>
            <Input
              id="new-workflow-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ex. Onboarding Client"
              onKeyDown={(e) => {
                if (e.key === "Enter") void createWorkflow();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void createWorkflow()}
              disabled={creating || !newName.trim()}
            >
              {creating ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── AlertDialog : suppression du workflow ─────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce workflow ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive — le workflow et tout son historique d&apos;exécution
              seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={(e) => {
                e.preventDefault();
                void deleteWorkflow();
              }}
              disabled={deleting}
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Palette Workflow complète : ajout (pick) + consultation (browse) ── */}
      <NodeCatalogDialog
        open={catalogOpen}
        onOpenChange={setCatalogOpen}
        mode="pick"
        onPick={addCatalogNode}
      />
      <NodeCatalogDialog
        open={browseOpen}
        onOpenChange={setBrowseOpen}
        mode="browse"
      />
      <NodeContractDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
        nodes={nodes}
      />

      {wizardOpen && projectId && (
        <ProjectWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onFinished={() => setWizardOpen(false)}
          existingProjectId={projectId}
        />
      )}
    </div>
  );
}
