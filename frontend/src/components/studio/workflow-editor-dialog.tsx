"use client";

/**
 * Dialog d'édition complet d'un workflow, ouvert depuis le panneau Propriétés
 * du Builder UI (section « Actions & Workflows »). Permet de configurer le nom,
 * le statut et les nœuds du flux, d'enregistrer et de tester l'exécution —
 * sans quitter le builder.
 */

import { useCallback, useEffect, useState } from "react";
import { FileJson, Play, Plus, Workflow as WorkflowIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { apiFetch, parseJsonSafe, SCROLLBAR_Y } from "./use-studio";
import { NodeCatalogDialog, NodeContractDialog } from "./workflow-nodes-ui";
import { LogsTimeline, NodeCard, STATUS_OPTIONS } from "./workflow-shared";
import type {
  RunLog,
  WorkflowDetail,
  WorkflowNode,
  WorkflowNodeConfig,
  WorkflowRunResult,
  WorkflowStatus,
} from "./types";

export function WorkflowEditorDialog({
  workflowId,
  open,
  onOpenChange,
  onSaved,
}: {
  workflowId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Appelé après un enregistrement réussi (rafraîchissement des listes). */
  onSaved?: (workflowId: string) => void;
}) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<WorkflowStatus>("draft");
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<WorkflowRunResult | null>(null);

  // Chargement du workflow à chaque ouverture.
  useEffect(() => {
    if (!open || !workflowId) return;
    let cancelled = false;
    setLoading(true);
    setRunResult(null);
    apiFetch<{ workflow: WorkflowDetail }>(`/api/workflows/${workflowId}`)
      .then((d) => {
        if (cancelled) return;
        setName(d.workflow.name);
        setStatus((d.workflow.status as WorkflowStatus) ?? "draft");
        setNodes(
          parseJsonSafe<WorkflowNode[]>(d.workflow.nodesJson, []).filter(
            (n): n is WorkflowNode =>
              Boolean(n) && typeof n.id === "string" && typeof n.type === "string"
          )
        );
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
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, workflowId, toast]);

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

  const handleSave = useCallback(async () => {
    if (!workflowId) return;
    setSaving(true);
    try {
      await apiFetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim() || "Workflow sans nom",
          status,
          nodesJson: JSON.stringify(nodes),
        }),
      });
      toast({ title: "Workflow enregistré" });
      onSaved?.(workflowId);
    } catch (e) {
      toast({
        title: "Enregistrement impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [name, nodes, onSaved, status, toast, workflowId]);

  const handleRun = useCallback(async () => {
    if (!workflowId) return;
    setRunning(true);
    try {
      const d = await apiFetch<{ run: WorkflowRunResult }>(`/api/workflows/${workflowId}/run`, {
        method: "POST",
      });
      setRunResult(d.run);
    } catch (e) {
      toast({
        title: "Échec de l'exécution",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  }, [toast, workflowId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <WorkflowIcon className="size-4 text-emerald-600" aria-hidden="true" />
            Configurer le workflow
          </DialogTitle>
          <DialogDescription>
            Éditez le nom, le statut et les nœuds du flux — puis enregistrez pour lier ce
            workflow à votre élément.
          </DialogDescription>
        </DialogHeader>

        <div className={cn("min-h-0 flex-1 space-y-4 overflow-y-auto pr-1", SCROLLBAR_Y)}>
          {loading ? (
            <div className="space-y-3" aria-hidden="true">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 min-w-[160px] flex-1 text-sm font-semibold"
                  aria-label="Nom du workflow"
                />
                <Select value={status} onValueChange={(v) => setStatus(v as WorkflowStatus)}>
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
              </div>

              {nodes.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed p-6">
                  <p className="text-center text-sm text-muted-foreground">
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

              <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                <Button size="sm" variant="outline" className="min-h-11 lg:min-h-9" onClick={addNode}>
                  <Plus className="size-4" aria-hidden="true" /> Ajouter un nœud
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11 text-xs text-zinc-500 lg:min-h-9"
                  onClick={() => setCatalogOpen(true)}
                >
                  Catalogue des nœuds
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

              {runResult && (
                <div className="rounded-lg border bg-zinc-50/60 p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        runResult.status === "error" ? "text-rose-600" : "text-emerald-600"
                      )}
                    >
                      {runResult.status === "error" ? "Échec de l'exécution" : "Exécution réussie"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {runResult.durationMs} ms · {runResult.logs.length} étape(s)
                    </span>
                  </div>
                  <LogsTimeline logs={(runResult.logs ?? []) as RunLog[]} />
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="shrink-0 gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="min-h-11 lg:min-h-9"
            onClick={() => void handleRun()}
            disabled={running || loading || !workflowId}
          >
            <Play className="size-4" aria-hidden="true" /> {running ? "Exécution…" : "Exécuter"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button
            className="min-h-11 bg-emerald-600 text-white hover:bg-emerald-700 lg:min-h-9"
            onClick={() => void handleSave()}
            disabled={saving || loading || !workflowId}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Palette Workflow complète (12 catégories, recherche) — mode « pick ». */}
      <NodeCatalogDialog
        open={catalogOpen}
        onOpenChange={setCatalogOpen}
        mode="pick"
        onPick={addCatalogNode}
      />

      {/* Contrat JSON exportable (structure commune, validable, marketplace-ready). */}
      <NodeContractDialog
        open={contractOpen}
        onOpenChange={setContractOpen}
        nodes={nodes}
      />
    </Dialog>
  );
}
