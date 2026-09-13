"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Database, Lock, Pencil, Plus, Trash2, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiFetch, formatDateFr, parseJsonSafe, SCROLLBAR_Y } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import type {
  FieldType,
  TableDetail,
  TableDetailRaw,
  TableField,
  TableRowData,
  TableSummary,
} from "./types";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "string", label: "Texte" },
  { value: "number", label: "Nombre" },
  { value: "boolean", label: "Booléen" },
  { value: "datetime", label: "Date-Heure" },
  { value: "json", label: "JSON" },
];

function typeLabel(t: string): string {
  return FIELD_TYPES.find((o) => o.value === t)?.label ?? t;
}

interface FieldDraft {
  name: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  defaultValue: string;
}

const emptyDraft = (): FieldDraft => ({
  name: "",
  type: "string",
  required: false,
  unique: false,
  defaultValue: "",
});

/** Cellule de la grille de données selon le type de champ. */
function renderCell(field: TableField, value: unknown) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-muted-foreground">—</span>;
  }
  if (field.type === "boolean") {
    return value === true ? (
      <Check className="size-4 text-emerald-600" aria-label="Vrai" />
    ) : (
      <X className="size-4 text-zinc-400" aria-label="Faux" />
    );
  }
  if (field.type === "json") {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return (
      <code className="block max-w-[220px] truncate font-mono text-xs" title={text}>
        {text}
      </code>
    );
  }
  if (field.type === "datetime") {
    const d = new Date(String(value));
    return (
      <span className="whitespace-nowrap">
        {Number.isNaN(d.getTime()) ? String(value) : formatDateFr(d)}
      </span>
    );
  }
  const text = String(value);
  return (
    <span className="block max-w-[220px] truncate" title={text}>
      {text}
    </span>
  );
}

export default function DataView({ projectId }: { projectId?: string | null }) {
  const { toast } = useToast();

  // Thread le projet actif dans les URLs de liste/création (?projectId=).
  const qs = useMemo(() => (projectId ? `?projectId=${projectId}` : ""), [projectId]);

  const [tables, setTables] = useState<TableSummary[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [tablesError, setTablesError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detail, setDetail] = useState<TableDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Dialog création de table
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [drafts, setDrafts] = useState<FieldDraft[]>([emptyDraft()]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Dialog ajout/édition de ligne
  const [rowDialogOpen, setRowDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TableRowData | null>(null);
  const [rowValues, setRowValues] = useState<Record<string, string>>({});
  const [rowError, setRowError] = useState<string | null>(null);
  const [rowSaving, setRowSaving] = useState(false);

  // Suppression de ligne
  const [rowToDelete, setRowToDelete] = useState<TableRowData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Suppression de table
  const [tableToDelete, setTableToDelete] = useState<TableSummary | null>(null);
  const [deletingTable, setDeletingTable] = useState(false);

  const loadTables = useCallback(async (preferredId?: string) => {
    setTablesLoading(true);
    setTablesError(null);
    try {
      const d = await apiFetch<{ tables: TableSummary[] }>(`/api/tables${qs}`);
      setTables(d.tables);
      setSelectedId((prev) => {
        if (preferredId && d.tables.some((t) => t.id === preferredId)) return preferredId;
        if (prev && d.tables.some((t) => t.id === prev)) return prev;
        return d.tables[0]?.id ?? null;
      });
    } catch (e) {
      setTablesError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setTablesLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    void loadTables();
  }, [loadTables]);

  const loadDetail = useCallback(
    async (id: string) => {
      setDetailLoading(true);
      try {
        const d = await apiFetch<{ table: TableDetailRaw }>(`/api/tables/${id}`);
        setDetail({
          id: d.table.id,
          name: d.table.name,
          createdAt: d.table.createdAt,
          fields: d.table.fields ?? [],
          rows: (d.table.rows ?? []).map((r) => ({
            id: r.id,
            data: parseJsonSafe<Record<string, unknown>>(r.data, {}),
            createdAt: r.createdAt,
          })),
        });
      } catch (e) {
        toast({
          title: "Impossible de charger la table",
          description: e instanceof Error ? e.message : undefined,
          variant: "destructive",
        });
      } finally {
        setDetailLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  const updateDraft = (index: number, patch: Partial<FieldDraft>) => {
    setDrafts((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const submitCreateTable = async () => {
    const name = newName.trim();
    const fields = drafts.filter((f) => f.name.trim().length > 0);
    if (!name) {
      setCreateError("Le nom de la table est requis.");
      return;
    }
    if (fields.length === 0) {
      setCreateError("Ajoutez au moins un champ avec un nom.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const d = await apiFetch<{ table: { id: string; name: string } }>(`/api/tables${qs}`, {
        method: "POST",
        body: JSON.stringify({
          name,
          fields: fields.map((f) => ({
            name: f.name.trim(),
            type: f.type,
            required: f.required,
            unique: f.unique,
            defaultValue: f.defaultValue.trim() || undefined,
          })),
        }),
      });
      setCreateOpen(false);
      setNewName("");
      setDrafts([emptyDraft()]);
      toast({ title: "Table créée", description: `« ${name} » est prête à recevoir des lignes.` });
      void loadTables(d.table.id);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Création impossible");
    } finally {
      setCreating(false);
    }
  };

  const openCreateRow = () => {
    if (!detail) return;
    const init: Record<string, string> = {};
    detail.fields.forEach((f) => {
      const def = f.defaultValue ?? "";
      if (f.type === "boolean") {
        init[f.name] = def === "true" ? "true" : "false";
      } else {
        init[f.name] = def;
      }
    });
    setRowValues(init);
    setEditingRow(null);
    setRowError(null);
    setRowDialogOpen(true);
  };

  const openEditRow = (row: TableRowData) => {
    if (!detail) return;
    const init: Record<string, string> = {};
    detail.fields.forEach((f) => {
      const v = row.data[f.name];
      if (f.type === "boolean") {
        init[f.name] = v === true ? "true" : "false";
      } else if (v === null || v === undefined) {
        init[f.name] = "";
      } else if (f.type === "json") {
        init[f.name] = typeof v === "string" ? v : JSON.stringify(v, null, 2);
      } else {
        init[f.name] = String(v);
      }
    });
    setRowValues(init);
    setEditingRow(row);
    setRowError(null);
    setRowDialogOpen(true);
  };

  const submitRow = async () => {
    if (!detail) return;
    const missing = detail.fields.filter((f) => {
      if (!f.required) return false;
      if (f.type === "boolean") return false;
      return (rowValues[f.name] ?? "").trim() === "";
    });
    if (missing.length > 0) {
      setRowError(`Champs requis manquants : ${missing.map((f) => f.name).join(", ")}`);
      return;
    }
    const payload: Record<string, unknown> = {};
    detail.fields.forEach((f) => {
      const v = (rowValues[f.name] ?? "").trim();
      if (f.type === "boolean") {
        payload[f.name] = rowValues[f.name] === "true";
        return;
      }
      if (v === "") return;
      if (f.type === "number") {
        const n = Number(v);
        payload[f.name] = Number.isFinite(n) ? n : v;
        return;
      }
      if (f.type === "json") {
        try {
          payload[f.name] = JSON.parse(v);
        } catch {
          payload[f.name] = v;
        }
        return;
      }
      payload[f.name] = v;
    });

    setRowSaving(true);
    try {
      if (editingRow) {
        await apiFetch(`/api/tables/${detail.id}/rows/${editingRow.id}`, {
          method: "PATCH",
          body: JSON.stringify({ data: payload }),
        });
        toast({ title: "Ligne modifiée" });
      } else {
        await apiFetch(`/api/tables/${detail.id}/rows`, {
          method: "POST",
          body: JSON.stringify({ data: payload }),
        });
        toast({ title: "Ligne ajoutée" });
      }
      setRowDialogOpen(false);
      await loadDetail(detail.id);
      void loadTables();
    } catch (e) {
      setRowError(e instanceof Error ? e.message : "Erreur lors de l'enregistrement");
    } finally {
      setRowSaving(false);
    }
  };

  const confirmDeleteRow = async () => {
    if (!detail || !rowToDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/tables/${detail.id}/rows/${rowToDelete.id}`, { method: "DELETE" });
      toast({ title: "Ligne supprimée" });
      setRowToDelete(null);
      await loadDetail(detail.id);
      void loadTables();
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

  const confirmDeleteTable = async () => {
    if (!tableToDelete) return;
    setDeletingTable(true);
    const target = tableToDelete;
    try {
      await apiFetch(`/api/tables/${target.id}`, { method: "DELETE" });
      toast({ title: "Table supprimée", description: `« ${target.name} » a été supprimée.` });
      setTableToDelete(null);
      if (target.id === selectedId) setDetail(null);
      await loadTables();
    } catch (e) {
      toast({
        title: "Suppression impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setDeletingTable(false);
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedId) ?? null;

  return (
    <div>
      <SectionHeader
        title="Données"
        description="Votre base de données visuelle : créez des tables, définissez les champs et manipulez les lignes."
      />

      {tablesError && (
        <div className="mb-4">
          <ErrorState message={tablesError} onRetry={() => void loadTables()} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* ─── Liste des tables ─────────────────────────────────────────── */}
        <Card className="h-fit gap-0 py-0">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="size-4 text-emerald-600" aria-hidden="true" />
              Tables
              <Badge variant="secondary" className="ml-auto font-normal">
                {tables.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className={cn("max-h-[420px] space-y-1 overflow-y-auto pr-1", SCROLLBAR_Y)}>
              {tablesLoading ? (
                <div className="space-y-2" aria-hidden="true">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-11 w-full rounded-lg" />
                  ))}
                </div>
              ) : tables.length === 0 ? (
                <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                  Aucune table pour l&apos;instant.
                </p>
              ) : (
                tables.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    aria-pressed={selectedId === t.id}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                      selectedId === t.id
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-transparent hover:bg-zinc-100"
                    )}
                  >
                    <span className="truncate text-sm font-medium">{t.name}</span>
                    <Badge variant="secondary" className="shrink-0 font-normal">
                      {t._count?.rows ?? 0} lignes
                    </Badge>
                  </button>
                ))
              )}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setNewName("");
                setDrafts([emptyDraft()]);
                setCreateError(null);
                setCreateOpen(true);
              }}
            >
              <Plus className="size-4" aria-hidden="true" /> Nouvelle table
            </Button>
          </CardContent>
        </Card>

        {/* ─── Grille de la table sélectionnée ──────────────────────────── */}
        {!detail && !detailLoading ? (
          <Card className="gap-0 py-0">
            <CardContent className="flex min-h-[420px] flex-col items-center justify-center gap-2 p-6 text-center">
              <Database className="size-8 text-zinc-300" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                {tables.length === 0
                  ? "Créez votre première table pour commencer."
                  : selectedTable
                    ? `Chargement de « ${selectedTable.name} »…`
                    : "Sélectionnez une table à gauche."}
              </p>
            </CardContent>
          </Card>
        ) : detail ? (
          <Card className="gap-0 py-0">
            <CardHeader className="border-b px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-lg">{detail.name}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {detail.fields.map((f) => (
                      <Badge key={f.id} variant="secondary" className="font-normal">
                        {f.name} : {typeLabel(f.type)}
                        {f.required && (
                          <span className="font-semibold text-rose-600" title="Champ requis">
                            *
                          </span>
                        )}
                        {f.unique && (
                          <span title="Valeur unique" aria-label="Valeur unique">
                            <Lock className="size-3" aria-hidden="true" />
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-11 text-rose-600 hover:bg-rose-50 hover:text-rose-700 lg:min-h-9"
                    aria-label={`Supprimer la table ${detail.name}`}
                    onClick={() => setTableToDelete(selectedTable)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Supprimer la table</span>
                  </Button>
                  <Button
                    size="sm"
                    className="min-h-11 bg-emerald-600 text-white hover:bg-emerald-700 lg:min-h-9"
                    onClick={openCreateRow}
                  >
                    <Plus className="size-4" aria-hidden="true" /> Ajouter une ligne
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {detailLoading ? (
                <div className="space-y-2" aria-hidden="true">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : detail.rows.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
                  <Database className="size-7 text-zinc-300" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">
                    Aucune ligne. Ajoutez votre première ligne.
                  </p>
                </div>
              ) : (
                <div className={cn("max-h-[520px] overflow-auto rounded-md border", SCROLLBAR_Y)}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {detail.fields.map((f) => (
                          <TableHead key={f.id} className="whitespace-nowrap">
                            {f.name}
                            {f.required && <span className="text-rose-600"> *</span>}
                          </TableHead>
                        ))}
                        <TableHead className="whitespace-nowrap">Créé le</TableHead>
                        <TableHead className="w-20 text-right">
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.rows.map((row) => (
                        <TableRow key={row.id}>
                          {detail.fields.map((f) => (
                            <TableCell key={f.id}>{renderCell(f, row.data[f.name])}</TableCell>
                          ))}
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatDateFr(row.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label={`Modifier la ligne du ${formatDateFr(row.createdAt)}`}
                                onClick={() => openEditRow(row)}
                              >
                                <Pencil className="size-3.5" aria-hidden="true" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                aria-label={`Supprimer la ligne du ${formatDateFr(row.createdAt)}`}
                                onClick={() => setRowToDelete(row)}
                              >
                                <Trash2 className="size-3.5" aria-hidden="true" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="gap-0 py-0">
            <CardContent className="p-4" aria-hidden="true">
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Dialog : nouvelle table ──────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className={cn("max-h-[85vh] overflow-y-auto sm:max-w-lg", SCROLLBAR_Y)}>
          <DialogHeader>
            <DialogTitle>Nouvelle table</DialogTitle>
            <DialogDescription>
              Nommez la table puis définissez ses champs (type, contraintes, valeur par défaut).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="table-name">Nom de la table</Label>
              <Input
                id="table-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ex. Clients"
              />
            </div>
            <div className="space-y-2">
              <Label>Champs</Label>
              {drafts.map((d, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-3">
                  <div className="flex gap-2">
                    <Input
                      value={d.name}
                      onChange={(e) => updateDraft(i, { name: e.target.value })}
                      placeholder="Nom du champ"
                      aria-label={`Nom du champ ${i + 1}`}
                    />
                    <Select value={d.type} onValueChange={(v) => updateDraft(i, { type: v as FieldType })}>
                      <SelectTrigger className="w-32 shrink-0" aria-label="Type du champ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={d.required}
                        onCheckedChange={(v) => updateDraft(i, { required: v })}
                        aria-label="Champ requis"
                      />
                      Requis
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={d.unique}
                        onCheckedChange={(v) => updateDraft(i, { unique: v })}
                        aria-label="Valeur unique"
                      />
                      Unique
                    </label>
                    <Input
                      className="h-8 min-w-[140px] flex-1 text-sm"
                      value={d.defaultValue}
                      onChange={(e) => updateDraft(i, { defaultValue: e.target.value })}
                      placeholder="Valeur par défaut"
                      aria-label="Valeur par défaut"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      aria-label="Retirer le champ"
                      onClick={() => setDrafts((prev) => prev.filter((_, j) => j !== i))}
                      disabled={drafts.length === 1}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={() => setDrafts((prev) => [...prev, emptyDraft()])}
              >
                <Plus className="size-4" aria-hidden="true" /> Ajouter un champ
              </Button>
            </div>
            {createError && (
              <p className="text-sm text-rose-600" role="alert">
                {createError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void submitCreateTable()}
              disabled={creating}
            >
              {creating ? "Création…" : "Créer la table"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog : ajouter / modifier une ligne ────────────────────────── */}
      <Dialog open={rowDialogOpen} onOpenChange={setRowDialogOpen}>
        <DialogContent className={cn("max-h-[85vh] overflow-y-auto sm:max-w-lg", SCROLLBAR_Y)}>
          <DialogHeader>
            <DialogTitle>{editingRow ? "Modifier la ligne" : "Ajouter une ligne"}</DialogTitle>
            <DialogDescription>
              Table « {detail?.name ?? ""} » — remplissez les champs puis enregistrez.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {detail?.fields.map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={`row-${f.id}`}>
                  {f.name}
                  {f.required && <span className="text-rose-600"> *</span>}
                </Label>
                {f.type === "boolean" ? (
                  <Select
                    value={rowValues[f.name] ?? "false"}
                    onValueChange={(v) => setRowValues((prev) => ({ ...prev, [f.name]: v }))}
                  >
                    <SelectTrigger id={`row-${f.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Oui</SelectItem>
                      <SelectItem value="false">Non</SelectItem>
                    </SelectContent>
                  </Select>
                ) : f.type === "json" ? (
                  <Textarea
                    id={`row-${f.id}`}
                    rows={3}
                    className="font-mono text-xs"
                    value={rowValues[f.name] ?? ""}
                    onChange={(e) => setRowValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    placeholder='{ "clé": "valeur" }'
                  />
                ) : (
                  <Input
                    id={`row-${f.id}`}
                    type={f.type === "number" ? "number" : f.type === "datetime" ? "datetime-local" : "text"}
                    value={rowValues[f.name] ?? ""}
                    onChange={(e) => setRowValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            {rowError && (
              <p className="text-sm text-rose-600" role="alert">
                {rowError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRowDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void submitRow()}
              disabled={rowSaving}
            >
              {rowSaving ? "Enregistrement…" : editingRow ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── AlertDialog : suppression de ligne ───────────────────────────── */}
      <AlertDialog
        open={Boolean(tableToDelete)}
        onOpenChange={(open) => {
          if (!open) setTableToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette table ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive — la table « {tableToDelete?.name ?? ""} » et toutes ses
              lignes seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={(e) => {
                e.preventDefault();
                void confirmDeleteTable();
              }}
              disabled={deletingTable}
            >
              {deletingTable ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(rowToDelete)}
        onOpenChange={(open) => {
          if (!open) setRowToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette ligne ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive — la ligne sera retirée de la table « {detail?.name ?? ""} ».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={(e) => {
                e.preventDefault();
                void confirmDeleteRow();
              }}
              disabled={deleting}
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
