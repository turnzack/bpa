"use client";

/**
 * Module « Design System » (PRD §8) — galerie interactive des composants.
 *
 * - Desktop (≥ lg, mouvement autorisé) : galerie 3D en CSS pur
 *   (perspective + rotateY + translateZ, ZÉRO dépendance 3D) — chaque
 *   catégorie est un panneau du carrousel, pilotable à la souris
 *   (glisser), aux boutons ‹ ›, au clavier (flèches) ou via les points.
 * - Mobile ou prefers-reduced-motion : la 3D se désactive et le contenu
 *   tombe en grille 2D par catégorie (même données, même dialog).
 * - Doc par composant : variantes, états, ARIA, WCAG, responsive +
 *   checklist de conformité persistée (PATCH /api/design-checklist,
 *   mise à jour optimiste avec rollback + toast en cas d'erreur).
 *
 * NOTE : la checklist est GLOBALE (clé « componentId:check » en base),
 * pas scopée par projet — la conformité est une propriété du design
 * system. `projectId` est accepté pour la signature homogène avec les
 * autres vues mais volontairement ignoré ici.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MonitorSmartphone,
  MousePointer2,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import {
  CHECK_KEYS,
  DESIGN_CATEGORIES,
  DS_CHECK_TOTAL,
  DS_COMPONENT_COUNT,
  STATUS_META,
} from "@/lib/design-system-spec";
import type { DesignCategory, DesignComponentSpec } from "@/lib/design-system-spec";
import { apiFetch, SCROLLBAR_Y } from "./use-studio";
import { SectionHeader } from "./shared";
import { useToast } from "@/hooks/use-toast";
import type { DesignCheckItem } from "./types";

type StatusFilter = "all" | "design" | "dev" | "doc";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "design", label: "Design" },
  { value: "dev", label: "Dev" },
  { value: "doc", label: "Doc" },
];

/** Rayon (px) du cylindre 3D et largeur d'un panneau. */
const RADIUS = 420;
const PANEL_W = 360;

/** Normalise une chaîne pour une recherche insensible à la casse et aux accents. */
function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Détecte la coupure desktop (≥ lg) pour activer/désactiver la 3D. */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

/** Case de checklist d'un composant : clé complète « componentId:check ». */
function checkKeyOf(componentId: string, checkKey: string): string {
  return `${componentId}:${checkKey}`;
}

export default function DesignSystemView({ projectId }: { projectId?: string | null }) {
  // projectId inutilisé : la checklist est globale (voir note d'en-tête).
  void projectId;

  const { toast } = useToast();
  const prefersReduced = useReducedMotion() === true;
  const isDesktop = useIsDesktop();
  const threeDee = isDesktop && !prefersReduced;

  // ── Checklist persistée ───────────────────────────────────────────────
  const [checks, setChecks] = useState<Record<string, DesignCheckItem> | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ checks: DesignCheckItem[] }>("/api/design-checklist")
      .then((d) => {
        if (cancelled) return;
        const map: Record<string, DesignCheckItem> = {};
        for (const c of d.checks) map[c.key] = c;
        setChecks(map);
      })
      .catch(() => {
        // Silencieux : les cases restent décochées, le PATCH réessaiera.
        if (!cancelled) setChecks({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** PATCH optimiste avec rollback + toast destructif en cas d'échec. */
  const toggleCheck = useCallback(
    async (componentId: string, checkKey: string, next: boolean) => {
      const key = checkKeyOf(componentId, checkKey);
      const previous = checks?.[key];
      // Mise à jour optimiste (silencieuse en cas de succès).
      setChecks((m) => ({
        ...(m ?? {}),
        [key]: { key, done: next, updatedAt: new Date().toISOString() },
      }));
      try {
        await apiFetch("/api/design-checklist", {
          method: "PATCH",
          body: JSON.stringify({ key, done: next }),
        });
      } catch {
        // Rollback puis toast destructif.
        setChecks((m) => {
          const copy = { ...(m ?? {}) };
          if (previous) copy[key] = previous;
          else delete copy[key];
          return copy;
        });
        toast({
          title: "Enregistrement impossible",
          description: "La case n'a pas pu être enregistrée. Réessayez.",
          variant: "destructive",
        });
      }
    },
    [checks, toast]
  );

  // ── Filtres ───────────────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [rotation, setRotation] = useState(0);

  const visibleCategories: DesignCategory[] = useMemo(() => {
    const q = normalizeSearch(query.trim());
    return DESIGN_CATEGORIES.map((cat) => ({
      ...cat,
      components: cat.components.filter((c) => {
        if (statusFilter !== "all" && c.status !== statusFilter) return false;
        if (!q) return true;
        return (
          normalizeSearch(c.name).includes(q) ||
          normalizeSearch(c.description).includes(q)
        );
      }),
    })).filter((cat) => cat.components.length > 0);
  }, [query, statusFilter]);

  // ── Galerie 3D (rotation, drag, clavier) ──────────────────────────────
  const [dragging, setDragging] = useState(false);
  // `capture` : le pointeur n'est capturé QU'APRÈS le seuil de drag (> 4 px),
  // sinon la capture au pointerdown retargeterait l'événement click vers le
  // conteneur et les boutons des panneaux ne recevraient jamais le clic.
  const dragState = useRef({ active: false, capture: false, startX: 0, startRotation: 0, moved: 0 });
  const count = visibleCategories.length;
  const step = count > 0 ? 360 / count : 360;

  const frontIndex = count > 0 ? ((Math.round(-rotation / step) % count) + count) % count : 0;

  const rotateTo = useCallback(
    (index: number) => {
      setRotation(-index * step);
    },
    [step]
  );

  const rotatePrev = useCallback(() => setRotation((r) => r + step), [step]);
  const rotateNext = useCallback(() => setRotation((r) => r - step), [step]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    dragState.current = { active: true, capture: false, startX: e.clientX, startRotation: rotation, moved: 0 };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const st = dragState.current;
    if (!st.active) return;
    const dx = e.clientX - st.startX;
    // Intention de drag non établie : on laisse passer les simples clics.
    if (!st.capture) {
      if (Math.abs(dx) < 4) return;
      st.capture = true;
      st.moved = Math.abs(dx);
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    st.moved = Math.max(st.moved, Math.abs(dx));
    setRotation(st.startRotation + dx * 0.25);
  }

  function endDrag() {
    dragState.current.active = false;
    dragState.current.capture = false;
    setDragging(false);
  }

  const [selected, setSelected] = useState<DesignComponentSpec | null>(null);

  /** Ouvre la doc d'un composant (ignore le clic si c'était un drag). */
  const openDoc = useCallback((spec: DesignComponentSpec) => {
    if (dragState.current.moved > 6) return;
    setSelected(spec);
  }, []);

  /** Change un filtre et remet la galerie 3D sur sa face avant. */
  const applyQuery = useCallback((q: string) => {
    setQuery(q);
    setRotation(0);
  }, []);
  const applyStatusFilter = useCallback((s: StatusFilter) => {
    setStatusFilter(s);
    setRotation(0);
  }, []);

  // ── Statistiques du bandeau ───────────────────────────────────────────
  const doneCount = useMemo(
    () => Object.values(checks ?? {}).filter((c) => c.done).length,
    [checks]
  );

  const stats: { label: string; value: string; icon: typeof Boxes }[] = [
    { label: "composants documentés", value: String(DS_COMPONENT_COUNT), icon: Boxes },
    { label: "catégories", value: String(DESIGN_CATEGORIES.length), icon: LayoutGrid },
    {
      label: `conformités cochées sur ${DS_CHECK_TOTAL}`,
      value: String(doneCount),
      icon: CheckCircle2,
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Design System"
        description="Galerie interactive des composants — variantes, états, accessibilité et checklist de conformité."
      />

      {/* ─── Bandeau statistiques ─────────────────────────────────────── */}
      {checks === null ? (
        <div className="mb-5 flex gap-3" aria-hidden="true">
          <Skeleton className="h-14 w-44 rounded-xl" />
          <Skeleton className="h-14 w-36 rounded-xl" />
          <Skeleton className="h-14 w-56 rounded-xl" />
        </div>
      ) : (
        <dl className="mb-5 flex flex-wrap gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2.5 rounded-xl border bg-white px-4 py-2.5"
            >
              <s.icon className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <div className="leading-tight">
                <dd className="text-lg font-semibold tabular-nums">{s.value}</dd>
                <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      )}

      {/* ─── Filtres : recherche + statut ─────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => applyQuery(e.target.value)}
            placeholder="Rechercher un composant (nom ou description)…"
            aria-label="Rechercher un composant"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => applyStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filtrer par statut de maturité">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {count === 0 ? (
        <p
          className="rounded-xl border border-dashed bg-white px-6 py-12 text-center text-sm text-muted-foreground"
          role="status"
        >
          Aucun composant ne correspond à cette recherche.
        </p>
      ) : threeDee ? (
        /* ─── Galerie 3D CSS (desktop ≥ lg, mouvement autorisé) ────────── */
        <div>
          <div
            role="region"
            aria-label="Galerie 3D des catégories"
            aria-describedby="ds-3d-hint"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                rotatePrev();
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                rotateNext();
              }
            }}
            className={cn(
              "relative mb-3 select-none rounded-2xl border bg-zinc-50/60 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600",
              dragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{ perspective: "1200px", touchAction: "pan-y" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {/* Scène : repoussée de -R pour que le panneau avant reste à z=0 */}
            <div
              className={cn(
                "relative mx-auto h-[430px] w-full",
                !dragging && "transition-transform duration-500 ease-out"
              )}
              style={{
                transformStyle: "preserve-3d",
                transform: `translateZ(-${RADIUS}px) rotateY(${rotation}deg)`,
              }}
            >
              {visibleCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  className="absolute left-1/2 top-1/2 flex w-[360px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border bg-white shadow-sm"
                  style={{
                    height: 390,
                    transform: `rotateY(${i * step}deg) translateZ(${RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
                    <h3 className="text-sm font-semibold">{cat.label}</h3>
                    <Badge variant="secondary" className="tabular-nums">
                      {cat.components.length}
                    </Badge>
                  </div>
                  <div
                    className={cn(
                      "flex-1 space-y-1 overflow-y-auto p-2",
                      SCROLLBAR_Y
                    )}
                  >
                    {cat.components.map((spec) => (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => openDoc(spec)}
                        className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm transition-colors hover:bg-emerald-50 focus-visible:bg-emerald-50 focus-visible:outline-none"
                        aria-label={`Voir la documentation du composant ${spec.name}`}
                      >
                        <span
                          className={cn(
                            "size-2 shrink-0 rounded-full",
                            STATUS_META[spec.status].dot
                          )}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1 truncate font-medium">{spec.name}</span>
                        <span
                          className={cn(
                            "shrink-0 text-[11px] font-medium",
                            spec.status === "dev" && "text-emerald-600",
                            spec.status === "doc" && "text-amber-600",
                            spec.status === "design" && "text-zinc-500"
                          )}
                        >
                          {STATUS_META[spec.status].label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p
              id="ds-3d-hint"
              className="flex items-center justify-center gap-1.5 pb-2 pt-1 text-[11px] text-muted-foreground"
            >
              <MousePointer2 className="size-3" aria-hidden="true" />
              Faites glisser pour tourner la galerie · flèches ← → au clavier
            </p>
          </div>

          {/* Commandes : ‹ › + points de navigation */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11"
              onClick={rotatePrev}
              aria-label="Catégorie précédente"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>
            <div className="flex items-center gap-0.5" role="group" aria-label="Choisir une catégorie">
              {visibleCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => rotateTo(i)}
                  aria-label={`Aller à la catégorie ${cat.label}`}
                  aria-current={frontIndex === i ? "true" : undefined}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <span
                    className={cn(
                      "size-2.5 rounded-full border transition-colors",
                      frontIndex === i
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-zinc-300 bg-white hover:bg-zinc-200"
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11"
              onClick={rotateNext}
              aria-label="Catégorie suivante"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : (
        /* ─── Grille 2D (mobile ou prefers-reduced-motion) ─────────────── */
        <div className="mb-6 space-y-6">
          {visibleCategories.map((cat) => (
            <section key={cat.id} aria-labelledby={`ds-cat-${cat.id}`}>
              <div className="mb-2 flex items-center gap-2">
                <h3 id={`ds-cat-${cat.id}`} className="text-sm font-semibold">
                  {cat.label}
                </h3>
                <Badge variant="secondary" className="tabular-nums">
                  {cat.components.length}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cat.components.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setSelected(spec)}
                    className="min-h-11 rounded-xl border bg-white p-4 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    aria-label={`Voir la documentation du composant ${spec.name}`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("size-2 rounded-full", STATUS_META[spec.status].dot)}
                        aria-hidden="true"
                      />
                      <span className="text-sm font-semibold">{spec.name}</span>
                      <span className="ml-auto text-[11px] font-medium text-muted-foreground">
                        {STATUS_META[spec.status].label}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                      {spec.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
          {prefersReduced && (
            <p className="text-center text-[11px] text-muted-foreground" role="note">
              Galerie 3D désactivée : préférence système « réduire les animations » détectée.
            </p>
          )}
        </div>
      )}

      {/* ─── Dialog documentation composant ───────────────────────────── */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent
          className={cn("max-h-[85vh] overflow-y-auto sm:max-w-2xl", SCROLLBAR_Y)}
        >
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 pr-6">
                  <DialogTitle className="text-lg">{selected.name}</DialogTitle>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                      STATUS_META[selected.status].badge
                    )}
                  >
                    <span
                      className={cn("size-1.5 rounded-full", STATUS_META[selected.status].dot)}
                      aria-hidden="true"
                    />
                    {STATUS_META[selected.status].label}
                  </span>
                </div>
                <DialogDescription className="text-left leading-relaxed">
                  {selected.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-1 grid gap-4 sm:grid-cols-2">
                {/* Variantes */}
                <section aria-label={`Variantes de ${selected.name}`} className="rounded-lg border p-4">
                  <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Variantes
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {selected.variants.map((v) => (
                      <li key={v}>
                        <Badge variant="outline">{v}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* États */}
                <section aria-label={`États de ${selected.name}`} className="rounded-lg border p-4">
                  <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    États
                  </h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {selected.states.map((s) => (
                      <li key={s}>
                        <Badge variant="secondary">{s}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Accessibilité (ARIA) */}
                <section aria-label={`Accessibilité ARIA de ${selected.name}`} className="rounded-lg border p-4">
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Accessibility className="size-3.5 text-emerald-600" aria-hidden="true" />
                    Accessibilité (ARIA)
                  </h4>
                  <ul className="space-y-1.5">
                    {selected.aria.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-xs leading-relaxed">
                        <span
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        />
                        {a}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* WCAG */}
                <section aria-label={`Critères WCAG de ${selected.name}`} className="rounded-lg border p-4">
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-emerald-600" aria-hidden="true" />
                    WCAG 2.1
                  </h4>
                  <ul className="space-y-1.5">
                    {selected.wcag.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-xs leading-relaxed">
                        <span
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-500"
                          aria-hidden="true"
                        />
                        {w}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Responsive */}
                <section
                  aria-label={`Comportement responsive de ${selected.name}`}
                  className="rounded-lg border p-4 sm:col-span-2"
                >
                  <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <MonitorSmartphone className="size-3.5 text-amber-600" aria-hidden="true" />
                    Responsive
                  </h4>
                  <p className="text-sm leading-relaxed">{selected.responsive}</p>
                </section>

                {/* Checklist de conformité (persistée, globale) */}
                <section
                  aria-label="Checklist de conformité"
                  className="rounded-lg border bg-emerald-50/40 p-4 sm:col-span-2"
                >
                  <h4 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-emerald-600" aria-hidden="true" />
                    Checklist de conformité
                  </h4>
                  <p className="mb-3 text-[11px] text-muted-foreground">
                    Partagée entre tous les projets : la conformité est une propriété du design
                    system, pas d&apos;un projet.
                  </p>
                  <div className="space-y-1">
                    {CHECK_KEYS.map((ck) => {
                      const key = checkKeyOf(selected.id, ck.key);
                      const checked = checks?.[key]?.done ?? false;
                      return (
                        <label
                          key={ck.key}
                          className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-emerald-50"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => void toggleCheck(selected.id, ck.key, v === true)}
                            className="mt-0.5"
                            aria-label={`${ck.label} — ${selected.name}`}
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium leading-tight">{ck.label}</span>
                            <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                              {ck.hint}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
