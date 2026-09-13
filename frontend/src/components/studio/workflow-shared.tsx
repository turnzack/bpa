"use client";

/**
 * Atomes partagés de l'éditeur de workflows.
 * Utilisés par la vue Workflows ET par l'éditeur en dialog du Builder UI
 * (panneau Propriétés → Actions & Workflows).
 */

import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  CircleCheck,
  CircleX,
  Clock,
  CodeXml,
  Database,
  GitFork,
  Globe,
  Mail,
  ScrollText,
  SkipForward,
  Trash2,
  Webhook,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { categoryById, nodeSpecByCode, type NodeConfigFieldKey, type WorkflowNodeSpec } from "@/lib/workflow-nodes";
import type { NodeType, RunLog, WorkflowNode, WorkflowNodeConfig, WorkflowStatus } from "./types";

export const NODE_TYPES: { type: NodeType; label: string; icon: LucideIcon; chip: string; border: string }[] = [
  { type: "webhook", label: "Webhook", icon: Webhook, chip: "bg-emerald-500", border: "border-l-emerald-500" },
  { type: "timer", label: "Minuteur", icon: Clock, chip: "bg-amber-500", border: "border-l-amber-500" },
  { type: "http", label: "Requête HTTP", icon: Globe, chip: "bg-stone-500", border: "border-l-stone-400" },
  { type: "condition", label: "Condition", icon: GitFork, chip: "bg-rose-500", border: "border-l-rose-500" },
  { type: "code", label: "Code", icon: CodeXml, chip: "bg-zinc-500", border: "border-l-zinc-400" },
  { type: "email", label: "E-mail", icon: Mail, chip: "bg-emerald-700", border: "border-l-emerald-700" },
  { type: "db", label: "Base de données", icon: Database, chip: "bg-teal-600", border: "border-l-teal-600" },
  { type: "notify", label: "Notification", icon: Bell, chip: "bg-orange-500", border: "border-l-orange-500" },
  { type: "log", label: "Journal", icon: ScrollText, chip: "bg-yellow-600", border: "border-l-yellow-600" },
];

export function nodeMeta(type: string) {
  return (
    NODE_TYPES.find((n) => n.type === type) ?? {
      type: "code" as NodeType,
      label: type,
      icon: CodeXml,
      chip: "bg-zinc-400",
      border: "border-l-zinc-300",
    }
  );
}

export const METHODS = ["GET", "POST", "PUT", "DELETE"];

export const STATUS_OPTIONS: { value: WorkflowStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "active", label: "Actif" },
  { value: "paused", label: "En pause" },
];

export function statusBadge(status: string) {
  if (status === "active") {
    return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Actif</Badge>;
  }
  if (status === "paused") {
    return <Badge className="bg-amber-500 text-white hover:bg-amber-500">En pause</Badge>;
  }
  return <Badge variant="secondary">Brouillon</Badge>;
}

export function defaultNode(type: NodeType): WorkflowNode {
  const id = crypto.randomUUID();
  switch (type) {
    case "webhook":
      return { id, type, name: "Webhook", config: { path: "/mon-webhook", method: "POST" } };
    case "timer":
      return { id, type, name: "Minuteur", config: { cron: "*/15 * * * *" } };
    case "http":
      return {
        id,
        type,
        name: "Requête HTTP",
        config: { url: "https://api.exemple.com/ressource", method: "GET" },
      };
    case "condition":
      return { id, type, name: "Condition", config: { expression: "plan != free" } };
    case "code":
      return { id, type, name: "Code", config: { code: "return { ok: true }" } };
    case "email":
      return {
        id,
        type,
        name: "E-mail",
        config: {
          to: "destinataire@exemple.com",
          subject: "Notification Forge Studio",
          body: "Bonjour,\n\nVoici votre notification.",
        },
      };
    case "db":
      return {
        id,
        type,
        name: "Base de données",
        config: { operation: "find", table: "", data: "{}", rowId: "" },
      };
    case "notify":
      return {
        id,
        type,
        name: "Notification",
        config: { message: "Notification importante", to: "" },
      };
    case "log":
      return {
        id,
        type,
        name: "Journal",
        config: { message: "Étape journalisée", level: "info" },
      };
  }
}

/** Timeline de logs d'exécution (partagée entre run direct et historique). */
export function LogsTimeline({ logs }: { logs: RunLog[] }) {
  if (logs.length === 0) {
    return <p className="text-xs text-muted-foreground">Aucun log pour cette exécution.</p>;
  }
  return (
    <ol className="space-y-2.5">
      {logs.map((log, i) => {
        const isError = log.status === "error";
        const isSkipped = log.status === "skipped";
        const meta = nodeMeta(log.type);
        const LogIcon = isError ? CircleX : isSkipped ? SkipForward : CircleCheck;
        return (
          <li key={`${log.nodeId}-${i}`} className="flex items-start gap-2.5">
            <LogIcon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isError ? "text-rose-600" : isSkipped ? "text-zinc-400" : "text-emerald-600"
              )}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide text-zinc-500">
                  {meta.label}
                </Badge>
                <span className="text-sm font-medium">{log.title || meta.label}</span>
                {typeof log.durationMs === "number" && (
                  <span className="text-xs text-muted-foreground">{log.durationMs} ms</span>
                )}
              </div>
              {log.message && (
                <p className="mt-0.5 break-words font-mono text-xs text-muted-foreground">{log.message}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Champs de configuration propres à chaque type de nœud. */
export function NodeConfig({
  node,
  onConfig,
}: {
  node: WorkflowNode;
  onConfig: (patch: Partial<WorkflowNodeConfig>) => void;
}) {
  const c = node.config;
  const inputCls = "h-8 text-sm";

  // Nœud catalogué (Task 19) : les champs suivent la spec du catalogue.
  const specItem = nodeSpecByCode(node.catalogCode);
  if (specItem) {
    return <CatalogConfigFields specItem={specItem} node={node} onConfig={onConfig} />;
  }

  if (node.type === "webhook") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Chemin</Label>
          <Input
            className={inputCls}
            value={c.path ?? ""}
            onChange={(e) => onConfig({ path: e.target.value })}
            placeholder="/mon-webhook"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Méthode</Label>
          <Select value={c.method ?? "POST"} onValueChange={(v) => onConfig({ method: v })}>
            <SelectTrigger className={inputCls} aria-label="Méthode HTTP du webhook">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (node.type === "timer") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Expression CRON</Label>
          <Input
            className={cn(inputCls, "font-mono")}
            value={c.cron ?? ""}
            onChange={(e) => onConfig({ cron: e.target.value })}
            placeholder="*/15 * * * *"
          />
        </div>
      </div>
    );
  }

  if (node.type === "http") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px]">
        <div className="space-y-1.5">
          <Label className="text-xs">URL</Label>
          <Input
            className={inputCls}
            value={c.url ?? ""}
            onChange={(e) => onConfig({ url: e.target.value })}
            placeholder="https://…"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Méthode</Label>
          <Select value={c.method ?? "GET"} onValueChange={(v) => onConfig({ method: v })}>
            <SelectTrigger className={inputCls} aria-label="Méthode HTTP">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (node.type === "condition") {
    return (
      <div className="mt-3 space-y-1.5">
        <Label className="text-xs">Expression</Label>
        <Input
          className={cn(inputCls, "font-mono")}
          value={c.expression ?? ""}
          onChange={(e) => onConfig({ expression: e.target.value })}
          placeholder="plan != free"
        />
        <p className="text-xs text-muted-foreground">
          ex. plan != free — contient « false » → condition fausse.
        </p>
      </div>
    );
  }

  if (node.type === "code") {
    return (
      <div className="mt-3 space-y-1.5">
        <Label className="text-xs">Code JavaScript</Label>
        <Textarea
          rows={4}
          className="font-mono text-xs"
          value={c.code ?? ""}
          onChange={(e) => onConfig({ code: e.target.value })}
          placeholder="return { ok: true }"
        />
      </div>
    );
  }

  if (node.type === "db") {
    const op = c.operation ?? "find";
    return (
      <div className="mt-3 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Opération</Label>
            <Select value={op} onValueChange={(v) => onConfig({ operation: v })}>
              <SelectTrigger className={inputCls} aria-label="Opération sur la base de données">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="find">Rechercher des lignes</SelectItem>
                <SelectItem value="create">Créer une ligne</SelectItem>
                <SelectItem value="update">Mettre à jour une ligne</SelectItem>
                <SelectItem value="delete">Supprimer une ligne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Table</Label>
            <Input
              className={inputCls}
              value={c.table ?? ""}
              onChange={(e) => onConfig({ table: e.target.value })}
              placeholder="Nom exact de la table (écran Données)"
            />
          </div>
        </div>
        {(op === "create" || op === "update") && (
          <div className="space-y-1.5">
            <Label className="text-xs">Données (JSON)</Label>
            <Textarea
              rows={3}
              className="font-mono text-xs"
              value={c.data ?? "{}"}
              onChange={(e) => onConfig({ data: e.target.value })}
              placeholder='{"champ": "valeur"}'
            />
          </div>
        )}
        {(op === "update" || op === "delete") && (
          <div className="space-y-1.5">
            <Label className="text-xs">ID de la ligne</Label>
            <Input
              className={cn(inputCls, "font-mono")}
              value={c.rowId ?? ""}
              onChange={(e) => onConfig({ rowId: e.target.value })}
              placeholder="ID de la ligne"
            />
          </div>
        )}
      </div>
    );
  }

  if (node.type === "notify") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Destinataire</Label>
          <Input
            className={inputCls}
            value={c.to ?? ""}
            onChange={(e) => onConfig({ to: e.target.value })}
            placeholder="Destinataire (optionnel)"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Message</Label>
          <Input
            className={inputCls}
            value={c.message ?? ""}
            onChange={(e) => onConfig({ message: e.target.value })}
            placeholder="Notification importante"
          />
        </div>
      </div>
    );
  }

  if (node.type === "log") {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
        <div className="space-y-1.5">
          <Label className="text-xs">Niveau</Label>
          <Select value={c.level ?? "info"} onValueChange={(v) => onConfig({ level: v })}>
            <SelectTrigger className={inputCls} aria-label="Niveau de journalisation">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warn">Attention</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Message</Label>
          <Input
            className={inputCls}
            value={c.message ?? ""}
            onChange={(e) => onConfig({ message: e.target.value })}
            placeholder="Étape journalisée"
          />
        </div>
      </div>
    );
  }

  // email
  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label className="text-xs">Destinataire</Label>
        <Input
          className={inputCls}
          value={c.to ?? ""}
          onChange={(e) => onConfig({ to: e.target.value })}
          placeholder="destinataire@exemple.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Sujet</Label>
        <Input className={inputCls} value={c.subject ?? ""} onChange={(e) => onConfig({ subject: e.target.value })} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label className="text-xs">Corps du message</Label>
        <Textarea
          rows={3}
          className="text-sm"
          value={c.body ?? ""}
          onChange={(e) => onConfig({ body: e.target.value })}
        />
      </div>
    </div>
  );
}

/**
 * Champs de configuration d'un nœud catalogué (clés déclarées par la spec).
 * Le nœud conserve un exécuteur de base (9 types du moteur) mais la config
 * affichée suit le code du catalogue (data.create, ai.rag_answer…).
 */
export function CatalogConfigFields({
  specItem,
  node,
  onConfig,
}: {
  specItem: WorkflowNodeSpec;
  node: WorkflowNode;
  onConfig: (patch: Partial<WorkflowNodeConfig>) => void;
}) {
  const c = node.config;
  const inputCls = "h-8 text-sm";
  const renderField = (key: NodeConfigFieldKey) => {
    switch (key) {
      case "path":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Chemin</Label>
            <Input
              className={inputCls}
              value={c.path ?? ""}
              onChange={(e) => onConfig({ path: e.target.value })}
              placeholder="/mon-webhook"
            />
          </div>
        );
      case "method":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Méthode</Label>
            <Select value={c.method ?? "POST"} onValueChange={(v) => onConfig({ method: v })}>
              <SelectTrigger className={inputCls} aria-label="Méthode HTTP">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "cron":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Expression CRON</Label>
            <Input
              className={cn(inputCls, "font-mono")}
              value={c.cron ?? ""}
              onChange={(e) => onConfig({ cron: e.target.value })}
              placeholder="*/15 * * * *"
            />
          </div>
        );
      case "url":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input
              className={inputCls}
              value={c.url ?? ""}
              onChange={(e) => onConfig({ url: e.target.value })}
              placeholder="https://…"
            />
          </div>
        );
      case "expression":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Expression</Label>
            <Input
              className={cn(inputCls, "font-mono")}
              value={c.expression ?? ""}
              onChange={(e) => onConfig({ expression: e.target.value })}
              placeholder="total > 100"
            />
            <p className="text-xs text-muted-foreground">
              contient « false » ou « faux » → condition fausse.
            </p>
          </div>
        );
      case "code":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Transformation (JavaScript)</Label>
            <Textarea
              rows={4}
              className="font-mono text-xs"
              value={c.code ?? ""}
              onChange={(e) => onConfig({ code: e.target.value })}
              placeholder="return { …input, statut: 'actif' }"
            />
          </div>
        );
      case "to":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Destinataire</Label>
            <Input
              className={inputCls}
              value={c.to ?? ""}
              onChange={(e) => onConfig({ to: e.target.value })}
              placeholder="destinataire@exemple.com"
            />
          </div>
        );
      case "subject":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Sujet</Label>
            <Input className={inputCls} value={c.subject ?? ""} onChange={(e) => onConfig({ subject: e.target.value })} />
          </div>
        );
      case "body":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Corps du message</Label>
            <Textarea
              rows={3}
              className="text-sm"
              value={c.body ?? ""}
              onChange={(e) => onConfig({ body: e.target.value })}
            />
          </div>
        );
      case "operation":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Opération</Label>
            <Select value={c.operation ?? "find"} onValueChange={(v) => onConfig({ operation: v })}>
              <SelectTrigger className={inputCls} aria-label="Opération sur la base de données">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="find">Rechercher des lignes</SelectItem>
                <SelectItem value="create">Créer une ligne</SelectItem>
                <SelectItem value="update">Mettre à jour une ligne</SelectItem>
                <SelectItem value="delete">Supprimer une ligne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "table":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Table</Label>
            <Input
              className={inputCls}
              value={c.table ?? ""}
              onChange={(e) => onConfig({ table: e.target.value })}
              placeholder="Nom exact de la table (écran Données)"
            />
          </div>
        );
      case "data":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Données (JSON)</Label>
            <Textarea
              rows={3}
              className="font-mono text-xs"
              value={c.data ?? "{}"}
              onChange={(e) => onConfig({ data: e.target.value })}
              placeholder='{"champ": "valeur"}'
            />
          </div>
        );
      case "rowId":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">ID de la ligne</Label>
            <Input
              className={cn(inputCls, "font-mono")}
              value={c.rowId ?? ""}
              onChange={(e) => onConfig({ rowId: e.target.value })}
              placeholder="ID de la ligne"
            />
          </div>
        );
      case "message":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Message</Label>
            <Input
              className={inputCls}
              value={c.message ?? ""}
              onChange={(e) => onConfig({ message: e.target.value })}
              placeholder="Message du nœud…"
            />
          </div>
        );
      case "level":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Niveau</Label>
            <Select value={c.level ?? "info"} onValueChange={(v) => onConfig({ level: v })}>
              <SelectTrigger className={inputCls} aria-label="Niveau de journalisation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Attention</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "prompt":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Consigne (prompt)</Label>
            <Textarea
              rows={3}
              className="text-sm"
              value={c.prompt ?? ""}
              onChange={(e) => onConfig({ prompt: e.target.value })}
              placeholder="Décrivez la tâche du modèle…"
            />
          </div>
        );
      case "params":
        return (
          <div key={key} className="space-y-1.5">
            <Label className="text-xs">Paramètres (JSON)</Label>
            <Textarea
              rows={3}
              className="font-mono text-xs"
              value={c.params ?? "{}"}
              onChange={(e) => onConfig({ params: e.target.value })}
              placeholder='{"clé": "valeur"}'
            />
            <p className="text-xs text-muted-foreground">
              Variables autorisées : {"{{trigger.body.champ}}"} — les données circulent en JSON entre nœuds.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="mt-3 grid gap-3 sm:grid-cols-2">{specItem.fields.map(renderField)}</div>;
}

/** Carte visuelle d'un nœud du flux (édition inline du nom + config + réordonnancement). */
export function NodeCard({
  node,
  isFirst,
  isLast,
  onPatch,
  onPatchConfig,
  onMove,
  onRemove,
}: {
  node: WorkflowNode;
  isFirst: boolean;
  isLast: boolean;
  onPatch: (patch: Partial<WorkflowNode>) => void;
  onPatchConfig: (patch: Partial<WorkflowNodeConfig>) => void;
  onMove: (dir: "up" | "down") => void;
  onRemove: () => void;
}) {
  const specItem = nodeSpecByCode(node.catalogCode);
  const cat = specItem ? categoryById(specItem.category) : null;
  const meta = specItem && cat
    ? { label: specItem.code, icon: specItem.icon, chip: cat.chip, border: cat.border }
    : nodeMeta(node.type);
  const Icon = meta.icon;

  return (
    <Card className={cn("gap-0 border-l-4 py-0", meta.border)}>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg text-white", meta.chip)}
            aria-hidden="true"
          >
            <Icon className="size-4" />
          </span>
          <Badge
            variant="outline"
            className={cn(
              "uppercase tracking-wide text-zinc-500",
              specItem ? "font-mono text-[10px] normal-case" : "text-[10px]"
            )}
            title={specItem ? `Nœud catalogué (${specItem.description})` : "Type d'exécuteur"}
          >
            {meta.label}
          </Badge>
          <Input
            value={node.name}
            onChange={(e) => onPatch({ name: e.target.value })}
            className="h-8 min-w-[120px] flex-1 text-sm"
            aria-label="Nom du nœud"
          />
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Monter le nœud"
              disabled={isFirst}
              onClick={() => onMove("up")}
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Descendre le nœud"
              disabled={isLast}
              onClick={() => onMove("down")}
            >
              <ArrowDown className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              aria-label="Supprimer le nœud"
              onClick={onRemove}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <NodeConfig node={node} onConfig={onPatchConfig} />
      </CardContent>
    </Card>
  );
}
