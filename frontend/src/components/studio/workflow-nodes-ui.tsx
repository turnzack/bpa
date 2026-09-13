"use client";

/**
 * Dialog « Catalogue des nœuds » — palette Workflow complète d'OmniBuild.
 *
 * Deux modes :
 * - « pick » : cliquer un nœud l'ajoute au flux en cours d'édition
 *   (utilisé par l'éditeur de workflows et la vue Workflows) ;
 * - « browse » : consultation seule — événements UI universels, 12 catégories
 *   de nœuds, exemple métier industriel et contrat JSON d'un nœud.
 */

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ClipboardCopy, FileJson, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BUILDER_UNIVERSAL_EVENTS,
} from "@/lib/builder-events";
import {
  INDUSTRIAL_EXAMPLE,
  NODE_CONTRACT_VERSION,
  WORKFLOW_NODE_CONTRACT_EXAMPLE,
  WORKFLOW_NODE_CATEGORIES,
  WORKFLOW_NODE_COUNT,
  countByCategory,
  nodeContractSchema,
  searchNodeSpecs,
  toNodeContract,
  type WorkflowNodeCategoryId,
} from "@/lib/workflow-nodes";
import { SCROLLBAR_Y } from "./use-studio";
import type { WorkflowNode } from "./types";

export type NodeCatalogMode = "pick" | "browse";

export function NodeCatalogDialog({
  open,
  onOpenChange,
  mode,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: NodeCatalogMode;
  /** Mode « pick » : appelé avec le code du nœud choisi. */
  onPick?: (code: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WorkflowNodeCategoryId | "all">("all");

  const counts = useMemo(() => countByCategory(), []);
  const specs = useMemo(() => searchNodeSpecs(query, category), [query, category]);
  const isPick = mode === "pick";

  // Regroupement par catégorie dans l'ordre canonique.
  const grouped = useMemo(() => {
    return WORKFLOW_NODE_CATEGORIES.map((c) => ({
      category: c,
      items: specs.filter((s) => s.category === c.id),
    })).filter((g) => g.items.length > 0);
  }, [specs]);

  const contractJson = useMemo(
    () => JSON.stringify(WORKFLOW_NODE_CONTRACT_EXAMPLE, null, 2),
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] flex-col overflow-hidden sm:max-w-3xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex flex-col gap-2 text-base sm:flex-row sm:flex-wrap sm:items-center sm:text-lg">
            <span className="flex items-center gap-2">
              Catalogue des nœuds
              <Badge variant="outline" className="font-mono text-[10px]">
                {WORKFLOW_NODE_COUNT} nœuds
              </Badge>
            </span>
            <span className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-[10px]">
                {WORKFLOW_NODE_CATEGORIES.length} catégories
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                13 événements UI
              </Badge>
            </span>
          </DialogTitle>
          <DialogDescription>
            {isPick
              ? "Choisissez un nœud à ajouter au flux — les données circulent sous forme d'objets JSON entre les nœuds."
              : "Palette Workflow complète : déclencheurs, logique, données, transformations, intégrations, IA, sécurité et opérations."}
          </DialogDescription>
        </DialogHeader>

        {/* Recherche + filtres catégorie */}
        <div className="shrink-0 space-y-2.5 border-b pb-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un nœud (ex. « stripe », « donne », « webhook »)…"
              className="h-9 pl-8 text-sm"
              aria-label="Rechercher un nœud dans le catalogue"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                aria-label="Effacer la recherche"
                onClick={() => setQuery("")}
              >
                <X className="size-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filtrer par catégorie"
          >
            <Button
              type="button"
              variant={category === "all" ? "default" : "outline"}
              size="sm"
              className="h-7 min-h-7 px-2.5 text-xs"
              onClick={() => setCategory("all")}
            >
              Tous
            </Button>
            {WORKFLOW_NODE_CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Button
                  key={c.id}
                  type="button"
                  variant={category === c.id ? "default" : "outline"}
                  size="sm"
                  className="h-7 min-h-7 px-2.5 text-xs"
                  onClick={() => setCategory(c.id)}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {c.label}
                  <span className="text-[10px] opacity-70">{counts[c.id]}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Corps scrollable */}
        <div className={cn("min-h-0 flex-1 overflow-y-auto pr-1", SCROLLBAR_Y)}>
          {/* Événements UI universels (consultation uniquement) */}
          {!isPick && (
            <section className="mb-5" aria-labelledby="ui-events-title">
              <h3
                id="ui-events-title"
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
              >
                Événements UI universels
                <span className="text-xs font-normal text-muted-foreground">
                  générés par le panneau « Actions &amp; Workflows » du Builder
                </span>
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {BUILDER_UNIVERSAL_EVENTS.map((ev) => (
                  <div
                    key={ev.key}
                    className="rounded-lg border bg-zinc-50/60 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{ev.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          ev.scope === "serveur" ? "border-amber-300 bg-amber-50 text-amber-700" : "text-zinc-500"
                        )}
                      >
                        {ev.scope}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-muted-foreground">{ev.when}</p>
                    <code className="mt-1 block font-mono text-[10px] text-emerald-700">
                      {ev.triggerCode}
                    </code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Groupes par catégorie */}
          {grouped.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun nœud ne correspond à « {query} ».
            </p>
          ) : (
            grouped.map(({ category: cat, items }) => {
              const CatIcon = cat.icon;
              return (
                <section
                  key={cat.id}
                  className="mb-5"
                  aria-labelledby={`cat-${cat.id}`}
                >
                  <h3
                    id={`cat-${cat.id}`}
                    className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold"
                  >
                    <span
                      className={cn(
                        "flex size-6 items-center justify-center rounded-md text-white",
                        cat.chip
                      )}
                      aria-hidden="true"
                    >
                      <CatIcon className="size-3.5" />
                    </span>
                    {cat.label}
                    <span className="text-xs font-normal text-muted-foreground">
                      {cat.role} · {items.length} nœud{items.length > 1 ? "s" : ""}
                    </span>
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {items.map((s) => {
                      const Icon = s.icon;
                      const body = (
                        <>
                          <span
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-lg text-white",
                              cat.chip
                            )}
                            aria-hidden="true"
                          >
                            <Icon className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-1.5">
                              <span className="truncate text-sm font-medium">{s.label}</span>
                              <Badge
                                variant="outline"
                                className="font-mono text-[10px] text-zinc-500"
                              >
                                {s.code}
                              </Badge>
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                              {s.description}
                            </span>
                          </span>
                        </>
                      );
                      if (isPick) {
                        return (
                          <button
                            key={s.code}
                            type="button"
                            className={cn(
                              "flex min-h-11 w-full items-start gap-2.5 rounded-lg border bg-white p-2.5 text-left transition-colors hover:border-emerald-400 hover:bg-emerald-50/50",
                              cat.border
                            )}
                            onClick={() => {
                              onPick?.(s.code);
                              onOpenChange(false);
                            }}
                          >
                            {body}
                          </button>
                        );
                      }
                      return (
                        <div
                          key={s.code}
                          className={cn(
                            "flex min-h-11 items-start gap-2.5 rounded-lg border bg-white p-2.5",
                            cat.border
                          )}
                        >
                          {body}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}

          {/* Exemple métier industriel + contrat JSON (consultation uniquement) */}
          {!isPick && (
            <>
              <section className="mb-5" aria-labelledby="industrial-example-title">
                <h3 id="industrial-example-title" className="mb-2 text-sm font-semibold">
                  Exemple métier industriel
                </h3>
                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                  <p className="text-xs leading-relaxed text-zinc-700">
                    <span className="font-semibold">{INDUSTRIAL_EXAMPLE.title}</span>{" "}
                    — {INDUSTRIAL_EXAMPLE.scenario}
                  </p>
                  <ol className="mt-2.5 space-y-1.5">
                    {INDUSTRIAL_EXAMPLE.steps.map((step, i) => (
                      <li key={step.code} className="flex items-start gap-2 text-xs">
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-semibold text-amber-800"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="font-medium">{step.name}</span>{" "}
                          <code className="font-mono text-[10px] text-emerald-700">
                            {step.code}
                          </code>
                          <span className="block text-[11px] text-muted-foreground">
                            {step.note}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              <section className="mb-2" aria-labelledby="node-contract-title">
                <h3 id="node-contract-title" className="mb-2 text-sm font-semibold">
                  Contrat JSON d&apos;un nœud
                </h3>
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                  Chaque nœud respecte une structure commune (version{" "}
                  {NODE_CONTRACT_VERSION}) : extensible, exportable, validable —
                  compatible avec une future marketplace. L&apos;éditeur de workflow
                  exporte vos flux dans ce format via « Contrat JSON ».
                </p>
                <details className="rounded-lg border bg-zinc-50/60">
                  <summary className="flex cursor-pointer items-center gap-1.5 p-2.5 text-xs font-medium select-none">
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                    Voir l&apos;exemple de contrat (data.create)
                  </summary>
                  <pre className="overflow-x-auto p-3 pt-0 font-mono text-[11px] leading-relaxed text-zinc-700">
                    {contractJson}
                  </pre>
                </details>
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Badge compact du code catalogué d'un nœud (cartes de flux). */
export function NodeCodeBadge({ code }: { code: string }) {
  return (
    <Badge
      variant="outline"
      className="font-mono text-[10px] text-zinc-500"
      title="Code du nœud catalogué"
    >
      {code}
    </Badge>
  );
}

/**
 * Contrat JSON exportable du flux : génère le contrat (structure commune v1.0.0)
 * de chaque nœud, vérifie la conformité via le schéma zod et permet la copie.
 * Partagé par l'éditeur du Builder et la vue Workflows.
 */
export function NodeContractDialog({
  open,
  onOpenChange,
  nodes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: WorkflowNode[];
}) {
  const { toast } = useToast();

  const contracts = useMemo(() => nodes.map((n, i) => toNodeContract(n, i)), [nodes]);
  const contractsValid = useMemo(
    () => contracts.every((c) => nodeContractSchema.safeParse(c).success),
    [contracts]
  );
  const contractsJson = useMemo(
    () => (contracts.length === 0 ? "[]" : JSON.stringify(contracts, null, 2)),
    [contracts]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="size-4 text-emerald-600" aria-hidden="true" />
            Contrat JSON des nœuds
          </DialogTitle>
          <DialogDescription>
            Structure commune exportable et validable (version {NODE_CONTRACT_VERSION}) —
            compatible marketplace. {contracts.length} nœud(s) généré(s).
          </DialogDescription>
        </DialogHeader>
        <div className={cn("min-h-0 flex-1 overflow-y-auto pr-1", SCROLLBAR_Y)}>
          <pre className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] leading-relaxed text-zinc-100">
            {contractsJson}
          </pre>
        </div>
        <DialogFooter className="shrink-0 gap-2 sm:gap-0">
          <span
            className={cn(
              "mr-auto flex items-center gap-1.5 text-xs font-medium",
              contractsValid ? "text-emerald-600" : "text-rose-600"
            )}
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            {contractsValid ? "Contrat valide (schéma zod vérifié)" : "Contrat invalide"}
          </span>
          <Button
            variant="outline"
            className="min-h-11 lg:min-h-9"
            onClick={() => {
              void navigator.clipboard
                .writeText(contractsJson)
                .then(() => toast({ title: "Contrat JSON copié" }))
                .catch(() =>
                  toast({ title: "Copie impossible", variant: "destructive" })
                );
            }}
          >
            <ClipboardCopy className="size-4" aria-hidden="true" /> Copier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
