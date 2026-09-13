"use client";

/**
 * Section « Actions & Workflows » du panneau Propriétés du Builder UI.
 * Permet de lier des actions (workflow, lien, message, ouverture de page,
 * copie presse-papiers) aux événements d'un composant sélectionné — ex. un
 * bouton « Cliquez ici » déclenche un workflow au clic. Les 13 événements UI
 * universels (PRD) génèrent chacun un nœud déclencheur trigger.ui.* ; les
 * événements disponibles dépendent du type de composant (whitelist partagée
 * avec le Générateur, src/lib/builder-events.ts) et les actions sont
 * persistées dans le layoutJson de la page.
 */

import type { LucideIcon } from "lucide-react";
import {
  ClipboardCopy,
  ExternalLink,
  FileInput,
  LoaderCircle,
  MessageSquare,
  Play,
  Plus,
  Settings2,
  Trash2,
  Workflow as WorkflowIcon,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BUILDER_EVENTS, allowedEventsFor } from "@/lib/builder-events";
import { COMPONENT_NODE_HINTS, nodeSpecByCode } from "@/lib/workflow-nodes";
import type {
  BuilderAction,
  BuilderActionKind,
  BuilderComponent,
  BuilderEvent,
  BuilderEventType,
  BuilderType,
  PageSummary,
  WorkflowSummary,
} from "./types";

const ACTION_KINDS: { kind: BuilderActionKind; label: string; icon: LucideIcon }[] = [
  { kind: "workflow", label: "Exécuter un workflow", icon: WorkflowIcon },
  { kind: "link", label: "Ouvrir un lien", icon: ExternalLink },
  { kind: "toast", label: "Afficher un message", icon: MessageSquare },
  { kind: "page", label: "Ouvrir une page", icon: FileInput },
  { kind: "copy", label: "Copier dans le presse-papiers", icon: ClipboardCopy },
];

export interface ActionsEditorProps {
  comp: BuilderComponent;
  workflows: WorkflowSummary[];
  workflowsLoading: boolean;
  /** Pages du projet (action « Ouvrir une page »). */
  pages: PageSummary[];
  onEventsChange: (events: BuilderEvent[]) => void;
  /** Ouvre l'éditeur de workflow (dialog) pour configurer les nœuds du flux. */
  onEditWorkflow: (workflowId: string | null) => void;
  /** Ouvre la création inline d'un workflow puis le lie à l'action « eventId:actionId ». */
  onCreateWorkflow: (actionKey: string) => void;
  /** Teste immédiatement l'exécution du workflow lié à l'action. */
  onTestAction: (action: BuilderAction) => void;
  testingActionId: string | null;
}

export function ActionsEditor({
  comp,
  workflows,
  workflowsLoading,
  pages,
  onEventsChange,
  onEditWorkflow,
  onCreateWorkflow,
  onTestAction,
  testingActionId,
}: ActionsEditorProps) {
  const events = comp.events ?? [];
  const allowed = allowedEventsFor(comp.type);
  const hints = COMPONENT_NODE_HINTS[comp.type];

  const newAction = (): BuilderAction => {
    const first = workflows[0];
    return {
      id: crypto.randomUUID(),
      kind: "workflow",
      workflowId: first?.id ?? "",
      workflowName: first?.name,
    };
  };

  const addEvent = () => {
    const ev: BuilderEvent = {
      id: crypto.randomUUID(),
      event: allowed[0] ?? "click",
      actions: [newAction()],
    };
    onEventsChange([...events, ev]);
  };

  const patchEvent = (eventId: string, patch: Partial<BuilderEvent>) => {
    onEventsChange(events.map((e) => (e.id === eventId ? { ...e, ...patch } : e)));
  };

  const removeEvent = (eventId: string) => {
    onEventsChange(events.filter((e) => e.id !== eventId));
  };

  const patchAction = (eventId: string, actionId: string, patch: Partial<BuilderAction>) => {
    onEventsChange(
      events.map((e) =>
        e.id !== eventId
          ? e
          : { ...e, actions: e.actions.map((a) => (a.id === actionId ? { ...a, ...patch } : a)) }
      )
    );
  };

  const removeAction = (eventId: string, actionId: string) => {
    onEventsChange(
      events.map((e) =>
        e.id !== eventId ? e : { ...e, actions: e.actions.filter((a) => a.id !== actionId) }
      )
    );
  };

  const addAction = (eventId: string) => {
    onEventsChange(
      events.map((e) => (e.id !== eventId ? e : { ...e, actions: [...e.actions, newAction()] }))
    );
  };

  const selectCls = "h-8 text-xs";

  return (
    <div className="mt-4 space-y-2.5 border-t pt-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="flex items-center gap-1.5 text-sm">
          <Zap className="size-4 text-amber-500" aria-hidden="true" />
          Actions &amp; Workflows
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 min-h-8 px-2.5 text-xs"
          onClick={addEvent}
          aria-label="Ajouter un déclencheur d'action"
        >
          <Plus className="size-3.5" aria-hidden="true" /> Ajouter
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Aucune action liée. Ajoutez un déclencheur pour exécuter un workflow —
          {comp.type === "input" ? " quand l'utilisateur valide sa saisie." : " par exemple au clic sur cet élément."}
        </p>
      ) : (
        events.map((ev) => (
          <div key={ev.id} className="space-y-2.5 rounded-lg border bg-zinc-50/70 p-3">
            {/* Déclencheur : 13 événements UI universels (trigger.ui.*) */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <BadgeTrigger />
                <Label htmlFor={`evt-${ev.id}`} className="sr-only">
                  Déclencheur
                </Label>
                <Select
                  value={ev.event}
                  onValueChange={(v) => patchEvent(ev.id, { event: v as BuilderEventType })}
                >
                  <SelectTrigger id={`evt-${ev.id}`} className={cn(selectCls, "flex-1")} aria-label="Déclencheur">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allowed.map((e) => (
                      <SelectItem key={e} value={e}>
                        {BUILDER_EVENTS[e].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  aria-label="Supprimer ce déclencheur"
                  onClick={() => removeEvent(ev.id)}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
              {/* Nœud déclencheur généré + périmètre d'exécution. */}
              <div className="flex flex-wrap items-center gap-1.5 pl-8">
                <code
                  className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700"
                  title={BUILDER_EVENTS[ev.event].when}
                >
                  {BUILDER_EVENTS[ev.event].triggerCode}
                </code>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] uppercase tracking-wide",
                    BUILDER_EVENTS[ev.event].scope === "serveur"
                      ? "border-amber-300 bg-amber-50 text-amber-700"
                      : "text-zinc-400"
                  )}
                >
                  {BUILDER_EVENTS[ev.event].scope === "serveur"
                    ? "déclenché côté serveur"
                    : "aperçu"}
                </Badge>
              </div>
            </div>

            {/* Actions de l'événement */}
            {ev.actions.map((action) => {
              const bound = workflows.find((w) => w.id === action.workflowId);
              return (
                <div key={action.id} className="space-y-2 rounded-md border bg-white p-2.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`kind-${action.id}`} className="sr-only">
                      Type d&apos;action
                    </Label>
                    <Select
                      value={action.kind}
                      onValueChange={(v) => patchAction(ev.id, action.id, { kind: v as BuilderActionKind })}
                    >
                      <SelectTrigger id={`kind-${action.id}`} className={cn(selectCls, "flex-1")} aria-label="Type d'action">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_KINDS.map((k) => (
                          <SelectItem key={k.kind} value={k.kind}>
                            {k.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      aria-label="Supprimer cette action"
                      onClick={() => removeAction(ev.id, action.id)}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>

                  {action.kind === "workflow" && (
                    <>
                      <Label htmlFor={`wf-${action.id}`} className="sr-only">
                        Workflow à exécuter
                      </Label>
                      <Select
                        value={action.workflowId ?? ""}
                        onValueChange={(id) => {
                          const wf = workflows.find((w) => w.id === id);
                          patchAction(ev.id, action.id, { workflowId: id, workflowName: wf?.name });
                        }}
                      >
                        <SelectTrigger
                          id={`wf-${action.id}`}
                          className={selectCls}
                          aria-label="Workflow à exécuter"
                        >
                          <SelectValue
                            placeholder={
                              workflowsLoading
                                ? "Chargement…"
                                : workflows.length === 0
                                  ? "Aucun workflow"
                                  : "Choisir un workflow"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {workflows.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {bound && (
                        <p className="text-[11px] text-muted-foreground">
                          {bound.status === "active"
                            ? "Workflow actif"
                            : bound.status === "paused"
                              ? "Workflow en pause"
                              : "Workflow en brouillon"}{" "}
                          · {bound._count?.runs ?? 0} exécution(s)
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 min-h-7 px-2 text-xs"
                          disabled={!action.workflowId}
                          onClick={() => onEditWorkflow(action.workflowId ?? null)}
                        >
                          <Settings2 className="size-3.5" aria-hidden="true" /> Configurer
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 min-h-7 px-2 text-xs"
                          disabled={!action.workflowId || testingActionId === action.id}
                          onClick={() => onTestAction(action)}
                        >
                          {testingActionId === action.id ? (
                            <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
                          ) : (
                            <Play />
                          )}
                          Tester
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 min-h-7 px-2 text-xs"
                          onClick={() => onCreateWorkflow(`${ev.id}:${action.id}`)}
                        >
                          <Plus className="size-3.5" aria-hidden="true" /> Nouveau
                        </Button>
                      </div>
                    </>
                  )}

                  {action.kind === "link" && (
                    <>
                      <Label htmlFor={`url-${action.id}`} className="sr-only">
                        URL à ouvrir
                      </Label>
                      <Input
                        id={`url-${action.id}`}
                        className="h-8 text-xs"
                        value={action.url ?? ""}
                        onChange={(e) => patchAction(ev.id, action.id, { url: e.target.value })}
                        placeholder="https://…"
                      />
                    </>
                  )}

                  {action.kind === "toast" && (
                    <>
                      <Label htmlFor={`msg-${action.id}`} className="sr-only">
                        Message à afficher
                      </Label>
                      <Input
                        id={`msg-${action.id}`}
                        className="h-8 text-xs"
                        value={action.message ?? ""}
                        onChange={(e) => patchAction(ev.id, action.id, { message: e.target.value })}
                        placeholder="Message affiché à l'utilisateur…"
                      />
                    </>
                  )}

                  {action.kind === "page" && (
                    <>
                      <Label htmlFor={`page-${action.id}`} className="sr-only">
                        Page à ouvrir
                      </Label>
                      <Select
                        value={action.pageId ?? ""}
                        onValueChange={(id) => {
                          const page = pages.find((pg) => pg.id === id);
                          patchAction(ev.id, action.id, { pageId: id, pageName: page?.name });
                        }}
                      >
                        <SelectTrigger
                          id={`page-${action.id}`}
                          className={selectCls}
                          aria-label="Page à ouvrir"
                        >
                          <SelectValue
                            placeholder={pages.length === 0 ? "Aucune page" : "Choisir une page"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {pages.map((pg) => (
                            <SelectItem key={pg.id} value={pg.id}>
                              {pg.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  {action.kind === "copy" && (
                    <>
                      <Label htmlFor={`copy-${action.id}`} className="sr-only">
                        Contenu à copier
                      </Label>
                      <Input
                        id={`copy-${action.id}`}
                        className="h-8 text-xs"
                        value={action.message ?? ""}
                        onChange={(e) => patchAction(ev.id, action.id, { message: e.target.value })}
                        placeholder="Texte copié au clic…"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}

      {!workflowsLoading && workflows.length === 0 && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Astuce : créez votre premier workflow avec le bouton « Nouveau » d&apos;une action
          workflow — il sera configurable directement ici.
        </p>
      )}

      {/* Nœuds serveur/données recommandés pour ce composant (PRD « Nœuds par palette UI »). */}
      {hints && hints.serverNodes.length > 0 && (
        <details className="mt-1 rounded-lg border bg-zinc-50/70 p-2.5">
          <summary className="cursor-pointer select-none text-[11px] font-medium text-zinc-600">
            Nœuds recommandés pour ce composant
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hints.serverNodes.map((code) => {
              const specItem = nodeSpecByCode(code);
              return (
                <Badge
                  key={code}
                  variant="outline"
                  className="font-mono text-[10px]"
                  title={specItem ? `${specItem.label} — ${specItem.description}` : code}
                >
                  {code}
                </Badge>
              );
            })}
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
            À ajouter au workflow lié (éditeur « Configurer ») — les données circulent en JSON entre les nœuds.
          </p>
        </details>
      )}
    </div>
  );
}

function BadgeTrigger() {
  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700"
      aria-hidden="true"
    >
      <Zap className="size-3.5" />
    </span>
  );
}
