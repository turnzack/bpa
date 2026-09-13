"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CodeXml,
  Copy,
  GripVertical,
  Heading1,
  Image as ImageIcon,
  Info,
  LayoutPanelTop,
  ListChecks,
  List as ListIcon,
  Minus,
  MousePointerClick,
  MoveVertical,
  Paperclip,
  PanelLeft,
  PanelTop,
  PanelsTopLeft,
  Percent,
  Plus,
  Quote,
  Search,
  SlidersHorizontal,
  Sparkles,
  Table2,
  Tag,
  TextCursorInput,
  MonitorPlay,
  ToggleLeft,
  Trash2,
  Type as TypeIcon,
  User,
  Video,
  XCircle,
  Zap,
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiFetch, parseJsonSafe, SCROLLBAR_Y } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import { ActionsEditor } from "./builder-actions";
import { WorkflowEditorDialog } from "./workflow-editor-dialog";
import ProjectWizard from "./project-wizard";
import type {
  BuilderAction,
  BuilderComponent,
  BuilderEvent,
  BuilderEventType,
  BuilderProps,
  BuilderType,
  PageDetail,
  PageSummary,
  WorkflowRunResult,
  WorkflowSummary,
} from "./types";

type SaveState = "idle" | "pending" | "saving" | "saved" | "error";

/** Palette complète — organisée en catégories fonctionnelles (recherche incluse). */
const PALETTE_GROUPS: { id: string; label: string; items: { type: BuilderType; label: string; hint: string; icon: LucideIcon }[] }[] = [
  {
    id: "contenu",
    label: "Contenu",
    items: [
      { type: "heading", label: "Titre", hint: "h1 · h2 · h3", icon: Heading1 },
      { type: "text", label: "Texte", hint: "Paragraphe", icon: TypeIcon },
      { type: "quote", label: "Citation", hint: "Extrait mis en avant", icon: Quote },
      { type: "list", label: "Liste", hint: "Puces", icon: ListIcon },
      { type: "badge", label: "Badge", hint: "Étiquette", icon: Tag },
      { type: "code", label: "Code", hint: "Bloc monospace", icon: CodeXml },
    ],
  },
  {
    id: "layout",
    label: "Mise en page",
    items: [
      { type: "card", label: "Carte", hint: "Conteneur", icon: LayoutPanelTop },
      { type: "divider", label: "Séparateur", hint: "Ligne horizontale", icon: Minus },
      { type: "spacer", label: "Espaceur", hint: "Respirer", icon: MoveVertical },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    items: [
      { type: "navbar", label: "Barre de navigation", hint: "Marque + liens", icon: PanelTop },
      { type: "tabs", label: "Onglets", hint: "Vues actives", icon: PanelsTopLeft },
      { type: "sidebar", label: "Menu latéral", hint: "Liens verticaux", icon: PanelLeft },
    ],
  },
  {
    id: "formulaires",
    label: "Formulaires",
    items: [
      { type: "input", label: "Champ input", hint: "Saisie", icon: TextCursorInput },
      { type: "textarea", label: "Zone de texte", hint: "Multi-lignes", icon: AlignLeft },
      { type: "select", label: "Liste déroulante", hint: "Options", icon: ChevronDown },
      { type: "checkbox", label: "Case à cocher", hint: "Oui / non", icon: ListChecks },
      { type: "switch", label: "Interrupteur", hint: "Toggle", icon: ToggleLeft },
      { type: "slider", label: "Curseur", hint: "0 – 100", icon: SlidersHorizontal },
      { type: "date", label: "Date", hint: "Sélecteur", icon: Calendar },
      { type: "file", label: "Fichier", hint: "Upload", icon: Paperclip },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    items: [{ type: "button", label: "Bouton", hint: "Action", icon: MousePointerClick }],
  },
  {
    id: "donnees",
    label: "Données",
    items: [
      { type: "table", label: "Tableau", hint: "Données", icon: Table2 },
      { type: "stat", label: "KPI", hint: "Chiffre clé", icon: BarChart3 },
      { type: "timeline", label: "Chronologie", hint: "Étapes", icon: Clock },
      { type: "avatar", label: "Avatar", hint: "Photo / initiales", icon: User },
    ],
  },
  {
    id: "medias",
    label: "Médias",
    items: [
      { type: "image", label: "Image", hint: "Média", icon: ImageIcon },
      { type: "video", label: "Vidéo", hint: "Lecteur / embed", icon: Video },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    items: [
      { type: "alert", label: "Alerte", hint: "Info · succès · erreur", icon: Info },
      { type: "progress", label: "Progression", hint: "Barre %", icon: Percent },
      { type: "skeleton", label: "Squelette", hint: "Chargement", icon: ListIcon },
    ],
  },
];

const PALETTE: { type: BuilderType; label: string; hint: string; icon: LucideIcon }[] =
  PALETTE_GROUPS.flatMap((g) => g.items);

const TYPE_LABELS: Record<BuilderType, string> = Object.fromEntries(
  PALETTE.map((p) => [p.type, p.label])
) as Record<BuilderType, string>;

const DEFAULT_PROPS: Record<BuilderType, BuilderProps> = {
  heading: { text: "Titre de section", level: "h2", size: "lg", color: "default" },
  text: {
    text: "Décrivez ici votre produit, votre proposition de valeur ou toute information utile.",
    size: "md",
    color: "default",
  },
  quote: { text: "« La meilleure interface est celle qu'on ne remarque pas. »", size: "md", color: "muted" },
  list: { text: "Premier point\nDeuxième point\nTroisième point", size: "md" },
  badge: { text: "Nouveau", color: "emerald" },
  code: { text: 'const studio = create("forge");' },
  card: { text: "Contenu de la carte", color: "default" },
  divider: {},
  spacer: { size: "md" },
  navbar: { text: "Forge Studio", links: "Accueil\nFonctionnalités\nTarifs\nContact" },
  tabs: { links: "Aperçu\nDétails\nHistorique" },
  sidebar: { text: "Menu", links: "Tableau de bord\nProjets\nParamètres" },
  input: { placeholder: "Saisissez votre texte…" },
  textarea: { placeholder: "Votre message…" },
  select: { placeholder: "Choisir une option…", options: "Option A\nOption B\nOption C" },
  checkbox: { text: "J'accepte les conditions" },
  switch: { text: "Notifications par email" },
  slider: { value: 50 },
  date: {},
  file: {},
  button: { text: "Cliquez ici", variant: "default" },
  table: { columns: 3 },
  stat: { text: "Utilisateurs actifs", value: "1 284", color: "default" },
  timeline: { text: "Inscription de l'utilisateur\nPremière connexion\nInvitation de l'équipe" },
  avatar: { text: "Alex Martin" },
  image: { src: "" },
  video: { src: "" },
  alert: { text: "Information importante pour l'utilisateur.", tone: "default" },
  progress: { text: "Progression", value: 60 },
  skeleton: { size: "md" },
};

const COLOR_CLASSES: Record<string, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
};

const HEADING_SIZES: Record<string, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-5xl",
};

const TEXT_SIZES: Record<string, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const SIZE_OPTIONS: { value: NonNullable<BuilderProps["size"]>; label: string }[] = [
  { value: "sm", label: "Petit" },
  { value: "md", label: "Moyen" },
  { value: "lg", label: "Grand" },
  { value: "xl", label: "Très grand" },
];

const COLOR_OPTIONS: { value: NonNullable<BuilderProps["color"]>; label: string }[] = [
  { value: "default", label: "Défaut" },
  { value: "muted", label: "Atténué" },
  { value: "emerald", label: "Émeraude" },
  { value: "amber", label: "Ambre" },
  { value: "rose", label: "Rose" },
];

const VARIANT_OPTIONS: { value: NonNullable<BuilderProps["variant"]>; label: string }[] = [
  { value: "default", label: "Défaut" },
  { value: "secondary", label: "Secondaire" },
  { value: "outline", label: "Contour" },
  { value: "destructive", label: "Destructif" },
];

const CANVAS_GRID_BG =
  "bg-[radial-gradient(circle,#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]";

function clampColumns(value: number | undefined): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 3;
  return Math.min(6, Math.max(1, n));
}

function clampPercent(value: number | string | undefined, fallback: number): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

const SPACER_HEIGHTS: Record<string, string> = { sm: "h-4", md: "h-10", lg: "h-20", xl: "h-40" };
const SKELETON_HEIGHTS: Record<string, string> = { sm: "h-4", md: "h-12", lg: "h-24", xl: "h-40" };

const TONE_META: Record<string, { wrap: string; icon: LucideIcon; iconCls: string }> = {
  default: { wrap: "border-zinc-300 bg-zinc-50 text-zinc-800", icon: Info, iconCls: "text-zinc-500" },
  success: { wrap: "border-emerald-300 bg-emerald-50 text-emerald-900", icon: CheckCircle2, iconCls: "text-emerald-600" },
  warning: { wrap: "border-amber-300 bg-amber-50 text-amber-900", icon: Info, iconCls: "text-amber-600" },
  error: { wrap: "border-rose-300 bg-rose-50 text-rose-900", icon: XCircle, iconCls: "text-rose-600" },
};

const BADGE_CLASSES: Record<string, string> = {
  default: "bg-zinc-900 text-white",
  muted: "bg-zinc-200 text-zinc-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
};

/** Convertit une URL YouTube/Vimeo en URL d'embed (lecteur intégré). */
function videoEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i.exec(url);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = /vimeo\.com\/(\d+)/i.exec(url);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (/^https?:\/\/.+\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return url;
  return null;
}

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

/** Signature commune du déclencheur d'actions en mode Aperçu. */
export type RendererTrigger = (comp: BuilderComponent, event: BuilderEventType) => void;

/** Rendu visuel d'un composant du builder (partagé édition / aperçu). */
function ComponentRenderer({
  comp,
  mode = "preview",
  onTrigger,
}: {
  comp: BuilderComponent;
  mode?: "edit" | "preview";
  /** Aperçu uniquement : déclenche les actions liées (liens de navigation…). */
  onTrigger?: RendererTrigger;
}) {
  const p = comp.props;
  const colorCls = COLOR_CLASSES[p.color ?? "default"] ?? "text-foreground";

  switch (comp.type) {
    case "heading": {
      const Tag = (p.level ?? "h2") as "h1" | "h2" | "h3";
      const sizeCls = HEADING_SIZES[p.size ?? "lg"] ?? "text-3xl";
      return <Tag className={cn("font-semibold tracking-tight", sizeCls, colorCls)}>{p.text || "Titre"}</Tag>;
    }
    case "text":
      return (
        <p className={cn("leading-relaxed", TEXT_SIZES[p.size ?? "md"] ?? "text-sm", colorCls)}>
          {p.text || "Texte…"}
        </p>
      );
    case "button":
      return (
        <Button variant={p.variant ?? "default"} className="pointer-events-none" tabIndex={-1}>
          {p.text || "Bouton"}
        </Button>
      );
    case "input":
      return <Input placeholder={p.placeholder || "Placeholder…"} disabled tabIndex={-1} />;
    case "card":
      return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className={cn("text-sm", colorCls)}>{p.text || "Contenu de la carte"}</p>
        </div>
      );
    case "image":
      return p.src ? (
        <img src={p.src} alt="Image du composant" className="aspect-video w-full rounded-lg object-cover" />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg bg-zinc-100 text-zinc-400">
          <ImageIcon className="size-6" aria-hidden="true" />
          <span className="text-xs">Image</span>
        </div>
      );
    case "quote":
      return (
        <blockquote className={cn("border-l-4 border-emerald-500/60 pl-4 italic", TEXT_SIZES[p.size ?? "md"] ?? "text-sm", colorCls)}>
          {p.text || "Citation…"}
        </blockquote>
      );
    case "list": {
      const items = (p.text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
      return (
        <ul className={cn("list-disc space-y-1 pl-5", TEXT_SIZES[p.size ?? "md"] ?? "text-sm", colorCls)}>
          {items.length > 0 ? (
            items.map((item, i) => <li key={i}>{item}</li>)
          ) : (
            <li>Liste vide</li>
          )}
        </ul>
      );
    }
    case "badge":
      return (
        <span className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium", BADGE_CLASSES[p.color ?? "default"])}>
          {p.text || "Badge"}
        </span>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-100">
          {p.text || "// code…"}
        </pre>
      );
    case "divider":
      return <div className="border-t border-zinc-200" role="separator" aria-label="Séparateur" />;
    case "spacer":
      return mode === "edit" ? (
        <div
          className={cn("rounded-lg border border-dashed border-zinc-300 bg-zinc-50/60", SPACER_HEIGHTS[p.size ?? "md"] ?? "h-10")}
          aria-label="Espaceur"
        />
      ) : (
        <div className={SPACER_HEIGHTS[p.size ?? "md"] ?? "h-10"} aria-hidden="true" />
      );
    case "navbar": {
      const links = (p.links ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
      return (
        <nav
          role="navigation"
          aria-label="Barre de navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border bg-white px-4 py-3"
        >
          <span className="font-semibold">{p.text || "Marque"}</span>
          {links.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              {links.map((label, i) =>
                mode === "preview" ? (
                  <button
                    key={i}
                    type="button"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTrigger?.(comp, "click");
                    }}
                  >
                    {label}
                  </button>
                ) : (
                  <span key={i} className="text-sm text-muted-foreground">
                    {label}
                  </span>
                )
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Aucun lien</span>
          )}
        </nav>
      );
    }
    case "tabs":
      return <TabsView comp={comp} mode={mode} onTrigger={onTrigger} />;
    case "sidebar":
      return <SidebarView comp={comp} mode={mode} onTrigger={onTrigger} />;
    case "textarea":
      return <Textarea placeholder={p.placeholder || "Votre message…"} disabled tabIndex={-1} rows={3} />;
    case "select":
      return (
        <div
          className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 text-sm text-muted-foreground"
          aria-label="Liste déroulante"
        >
          <span>{p.placeholder || "Choisir…"}</span>
          <ChevronDown className="size-4 text-zinc-400" aria-hidden="true" />
        </div>
      );
    case "checkbox":
      return (
        <label className="flex w-fit items-center gap-2 text-sm">
          <input type="checkbox" disabled tabIndex={-1} className="size-4 accent-emerald-600" aria-hidden="true" />
          {p.text || "Option"}
        </label>
      );
    case "switch":
      return (
        <label className="flex w-fit items-center gap-2 text-sm">
          <Switch disabled tabIndex={-1} aria-hidden="true" />
          {p.text || "Option"}
        </label>
      );
    case "slider":
      return (
        <div className="flex w-full items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={clampPercent(p.value, 50)}
            disabled
            tabIndex={-1}
            aria-label="Curseur"
            className="w-full accent-emerald-600"
          />
          <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{clampPercent(p.value, 50)}</span>
        </div>
      );
    case "date":
      return <Input type="date" disabled tabIndex={-1} aria-label="Champ date" />;
    case "file":
      return (
        <div className="flex h-9 w-full items-center gap-2 rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 text-sm text-muted-foreground">
          <Paperclip className="size-4 text-zinc-400" aria-hidden="true" />
          Choisir un fichier…
        </div>
      );
    case "stat":
      return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{p.text || "Indicateur"}</p>
          <p className={cn("mt-1 text-3xl font-bold tabular-nums tracking-tight", colorCls)}>{p.value !== undefined && p.value !== "" ? p.value : "0"}</p>
        </div>
      );
    case "timeline": {
      const items = (p.text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
      return (
        <ol className="space-y-3 border-l-2 border-zinc-200 pl-5">
          {items.length > 0 ? (
            items.map((item, i) => (
              <li key={i} className="relative text-sm">
                <span className="absolute -left-[26px] top-1 size-2.5 rounded-full border-2 border-emerald-500 bg-white" aria-hidden="true" />
                {item}
              </li>
            ))
          ) : (
            <li className="relative text-sm text-muted-foreground">Chronologie vide</li>
          )}
        </ol>
      );
    }
    case "avatar":
      return p.src ? (
        <img src={p.src} alt={`Avatar de ${p.text || "utilisateur"}`} className="size-12 rounded-full object-cover" />
      ) : (
        <span
          className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700"
          role="img"
          aria-label={`Avatar de ${p.text || "utilisateur"}`}
        >
          {initialsOf(p.text || "")}
        </span>
      );
    case "video": {
      const embed = videoEmbedUrl(p.src ?? "");
      if (!embed) {
        return (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg bg-zinc-100 text-zinc-400">
            <Video className="size-6" aria-hidden="true" />
            <span className="text-xs">Vidéo — collez une URL YouTube, Vimeo ou MP4</span>
          </div>
        );
      }
      return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(embed) ? (
        <video src={embed} controls className="aspect-video w-full rounded-lg bg-black" />
      ) : (
        <iframe
          src={embed}
          title="Lecteur vidéo intégré"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full rounded-lg"
        />
      );
    }
    case "alert": {
      const tone = TONE_META[p.tone ?? "default"] ?? TONE_META.default!;
      const Icon = tone.icon;
      return (
        <div className={cn("flex items-start gap-2.5 rounded-lg border p-3 text-sm", tone.wrap)} role="alert">
          <Icon className={cn("mt-0.5 size-4 shrink-0", tone.iconCls)} aria-hidden="true" />
          <span>{p.text || "Message d'alerte."}</span>
        </div>
      );
    }
    case "progress":
      return (
        <div className="w-full">
          {p.text && <p className="mb-1.5 text-xs font-medium text-muted-foreground">{p.text}</p>}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100" role="progressbar" aria-valuenow={clampPercent(p.value, 0)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${clampPercent(p.value, 0)}%` }} />
          </div>
          <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">{clampPercent(p.value, 0)} %</p>
        </div>
      );
    case "skeleton":
      return <Skeleton className={cn("w-full rounded-lg", SKELETON_HEIGHTS[p.size ?? "md"] ?? "h-12")} aria-hidden="true" />;
  }
}

/** Onglets du builder : barre d'onglets + panneau de contenu factice. */
function TabsView({
  comp,
  mode,
  onTrigger,
}: {
  comp: BuilderComponent;
  mode: "edit" | "preview";
  onTrigger?: RendererTrigger;
}) {
  const links = (comp.props.links ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const [active, setActive] = useState(0);
  const current = mode === "preview" ? Math.min(active, Math.max(links.length - 1, 0)) : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 border-b" role="tablist" aria-label="Onglets">
        {links.length > 0 ? (
          links.map((label, i) => {
            const isActive = i === current;
            return mode === "preview" ? (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                  onTrigger?.(comp, "change");
                }}
                className={cn(
                  "-mb-px rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "border-emerald-600 font-medium text-emerald-700"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:underline"
                )}
              >
                {label}
              </button>
            ) : (
              <span
                key={i}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-sm",
                  isActive
                    ? "border-emerald-600 font-medium text-emerald-700"
                    : "border-transparent text-muted-foreground"
                )}
              >
                {label}
              </span>
            );
          })
        ) : (
          <span className="px-1 py-2 text-sm text-muted-foreground">Aucun onglet</span>
        )}
      </div>
      <div className="mt-3 rounded-lg border border-dashed p-4" role="tabpanel">
        <p className="text-sm text-muted-foreground">
          Contenu de l&apos;onglet « {links[current] ?? "…"} »
        </p>
      </div>
    </div>
  );
}

/** Menu latéral du builder : liste verticale de liens (actif surligné). */
function SidebarView({
  comp,
  mode,
  onTrigger,
}: {
  comp: BuilderComponent;
  mode: "edit" | "preview";
  onTrigger?: RendererTrigger;
}) {
  const links = (comp.props.links ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const [active, setActive] = useState(0);
  const current = mode === "preview" ? Math.min(active, Math.max(links.length - 1, 0)) : 0;

  return (
    <aside
      role="navigation"
      aria-label="Menu latéral"
      className="w-full max-w-[220px] rounded-xl border bg-white p-3"
    >
      {comp.props.text && (
        <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">{comp.props.text}</p>
      )}
      {links.length > 0 ? (
        <ul className="space-y-1">
          {links.map((label, i) => {
            const isActive = i === current;
            return (
              <li key={i}>
                {mode === "preview" ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(i);
                      onTrigger?.(comp, "click");
                    }}
                    className={cn(
                      "w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                      isActive
                        ? "bg-emerald-50 font-medium text-emerald-700"
                        : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                ) : (
                  <span
                    className={cn(
                      "block rounded-md px-2.5 py-2 text-sm",
                      isActive
                        ? "bg-emerald-50 font-medium text-emerald-700"
                        : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="px-2.5 py-1.5 text-sm text-muted-foreground">Aucun lien</p>
      )}
    </aside>
  );
}

/** Bloc du canvas : rendu + chrome de sélection/déplacement en mode édition. */
function CanvasBlock({
  comp,
  selected,
  isFirst,
  isLast,
  onSelect,
  onMove,
  onRemove,
}: {
  comp: BuilderComponent;
  selected: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, dir: "up" | "down") => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Composant ${TYPE_LABELS[comp.type]}`}
      onClick={() => onSelect(comp.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(comp.id);
        }
      }}
      className={cn(
        "group relative cursor-pointer rounded-xl border border-transparent p-3 transition-colors",
        selected ? "bg-emerald-50/50 ring-2 ring-emerald-500" : "hover:border-zinc-200 hover:bg-white"
      )}
    >
      <div
        className={cn(
          "absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-lg border bg-white p-1 shadow-sm",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        )}
      >
        <span
          className="flex cursor-grab items-center px-0.5 text-zinc-400"
          title="Réordonnez avec les flèches"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </span>
        <button
          type="button"
          aria-label="Monter le composant"
          disabled={isFirst}
          onClick={(e) => {
            e.stopPropagation();
            onMove(comp.id, "up");
          }}
          className="flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30"
        >
          <ArrowUp className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Descendre le composant"
          disabled={isLast}
          onClick={(e) => {
            e.stopPropagation();
            onMove(comp.id, "down");
          }}
          className="flex size-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-30"
        >
          <ArrowDown className="size-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Supprimer le composant"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(comp.id);
          }}
          className="flex size-7 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      <ComponentRenderer comp={comp} mode="edit" />
    </div>
  );
}

/** Panneau de propriétés contextuel selon le type du composant sélectionné. */
function PropsPanel({
  comp,
  onPatch,
  actionsSlot,
}: {
  comp: BuilderComponent;
  onPatch: (patch: Partial<BuilderProps>) => void;
  actionsSlot?: ReactNode;
}) {
  const p = comp.props;

  return (
    <div className="space-y-4">
      {(comp.type === "heading" || comp.type === "text" || comp.type === "button" || comp.type === "card" || comp.type === "navbar" || comp.type === "sidebar") && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-text">
            {comp.type === "navbar" ? "Marque" : comp.type === "sidebar" ? "Titre (optionnel)" : "Texte"}
          </Label>
          {comp.type === "card" ? (
            <Textarea
              id="prop-text"
              rows={3}
              value={p.text ?? ""}
              onChange={(e) => onPatch({ text: e.target.value })}
            />
          ) : (
            <Input id="prop-text" value={p.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} />
          )}
        </div>
      )}

      {comp.type === "heading" && (
        <div className="space-y-1.5">
          <Label>Niveau</Label>
          <Select value={p.level ?? "h2"} onValueChange={(v) => onPatch({ level: v as BuilderProps["level"] })}>
            <SelectTrigger aria-label="Niveau de titre">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["h1", "h2", "h3"] as const).map((l) => (
                <SelectItem key={l} value={l}>
                  {l.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(comp.type === "heading" || comp.type === "text") && (
        <div className="space-y-1.5">
          <Label>Taille</Label>
          <Select value={p.size ?? "md"} onValueChange={(v) => onPatch({ size: v as BuilderProps["size"] })}>
            <SelectTrigger aria-label="Taille du texte">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(comp.type === "heading" || comp.type === "text" || comp.type === "card") && (
        <div className="space-y-1.5">
          <Label>Couleur</Label>
          <Select value={p.color ?? "default"} onValueChange={(v) => onPatch({ color: v as BuilderProps["color"] })}>
            <SelectTrigger aria-label="Couleur du texte">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLOR_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {comp.type === "button" && (
        <div className="space-y-1.5">
          <Label>Variante</Label>
          <Select
            value={p.variant ?? "default"}
            onValueChange={(v) => onPatch({ variant: v as BuilderProps["variant"] })}
          >
            <SelectTrigger aria-label="Variante du bouton">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VARIANT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {comp.type === "input" && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-placeholder">Placeholder</Label>
          <Input
            id="prop-placeholder"
            value={p.placeholder ?? ""}
            onChange={(e) => onPatch({ placeholder: e.target.value })}
            placeholder="Texte indicatif"
          />
        </div>
      )}

      {comp.type === "image" && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-src">Source (URL)</Label>
          <Input
            id="prop-src"
            value={p.src ?? ""}
            onChange={(e) => onPatch({ src: e.target.value })}
            placeholder="https://…"
          />
          <p className="text-xs text-muted-foreground">Laissez vide pour afficher un placeholder.</p>
        </div>
      )}

      {comp.type === "table" && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-columns">Colonnes (1–6)</Label>
          <Input
            id="prop-columns"
            type="number"
            min={1}
            max={6}
            value={p.columns ?? 3}
            onChange={(e) => onPatch({ columns: Number(e.target.value) })}
          />
        </div>
      )}

      {/* ── Types multi-lignes : citation, liste, code, chronologie, alerte ── */}
      {(comp.type === "quote" || comp.type === "list" || comp.type === "code" || comp.type === "timeline" || comp.type === "alert") && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-text-multi">
            {comp.type === "list" || comp.type === "timeline" ? "Contenu (une ligne par élément)" : "Contenu"}
          </Label>
          <Textarea
            id="prop-text-multi"
            rows={comp.type === "code" ? 6 : 4}
            value={p.text ?? ""}
            onChange={(e) => onPatch({ text: e.target.value })}
          />
        </div>
      )}

      {(comp.type === "list" || comp.type === "quote") && (
        <div className="space-y-1.5">
          <Label>Taille</Label>
          <Select value={p.size ?? "md"} onValueChange={(v) => onPatch({ size: v as BuilderProps["size"] })}>
            <SelectTrigger aria-label="Taille du texte"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(comp.type === "badge" || comp.type === "stat") && (
        <>
          {comp.type === "badge" ? (
            <div className="space-y-1.5">
              <Label htmlFor="prop-text-badge">Libellé</Label>
              <Input id="prop-text-badge" value={p.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} />
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="prop-stat-label">Libellé</Label>
                <Input id="prop-stat-label" value={p.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prop-stat-value">Valeur</Label>
                <Input
                  id="prop-stat-value"
                  value={String(p.value ?? "")}
                  onChange={(e) => onPatch({ value: e.target.value })}
                  placeholder="ex. 1 284 ou +12 %"
                />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label>Couleur</Label>
            <Select value={p.color ?? "default"} onValueChange={(v) => onPatch({ color: v as BuilderProps["color"] })}>
              <SelectTrigger aria-label="Couleur"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {comp.type === "avatar" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="prop-avatar-name">Nom (initiales si pas d'image)</Label>
            <Input id="prop-avatar-name" value={p.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prop-avatar-src">Image (URL, optionnel)</Label>
            <Input id="prop-avatar-src" value={p.src ?? ""} onChange={(e) => onPatch({ src: e.target.value })} placeholder="https://…" />
          </div>
        </>
      )}

      {(comp.type === "textarea" || comp.type === "select") && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-placeholder-f">Placeholder</Label>
          <Input
            id="prop-placeholder-f"
            value={p.placeholder ?? ""}
            onChange={(e) => onPatch({ placeholder: e.target.value })}
            placeholder="Texte indicatif"
          />
        </div>
      )}

      {comp.type === "select" && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-options">Options (une par ligne)</Label>
          <Textarea
            id="prop-options"
            rows={4}
            value={p.options ?? ""}
            onChange={(e) => onPatch({ options: e.target.value })}
          />
        </div>
      )}

      {(comp.type === "navbar" || comp.type === "tabs" || comp.type === "sidebar") && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-links">Liens (un par ligne)</Label>
          <Textarea
            id="prop-links"
            rows={4}
            value={p.links ?? ""}
            onChange={(e) => onPatch({ links: e.target.value })}
          />
        </div>
      )}

      {(comp.type === "checkbox" || comp.type === "switch") && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-field-label">Libellé du champ</Label>
          <Input id="prop-field-label" value={p.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} />
        </div>
      )}

      {(comp.type === "slider" || comp.type === "progress") && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-value">Valeur (0–100)</Label>
          <Input
            id="prop-value"
            type="number"
            min={0}
            max={100}
            value={p.value ?? (comp.type === "slider" ? 50 : 0)}
            onChange={(e) => onPatch({ value: Number(e.target.value) })}
          />
        </div>
      )}

      {comp.type === "progress" && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-progress-label">Libellé (optionnel)</Label>
          <Input id="prop-progress-label" value={p.text ?? ""} onChange={(e) => onPatch({ text: e.target.value })} />
        </div>
      )}

      {comp.type === "video" && (
        <div className="space-y-1.5">
          <Label htmlFor="prop-video-src">URL vidéo</Label>
          <Input
            id="prop-video-src"
            value={p.src ?? ""}
            onChange={(e) => onPatch({ src: e.target.value })}
            placeholder="https://youtube.com/watch?v=… ou .mp4"
          />
          <p className="text-xs text-muted-foreground">YouTube, Vimeo ou fichier MP4 direct.</p>
        </div>
      )}

      {comp.type === "alert" && (
        <div className="space-y-1.5">
          <Label>Ton de l'alerte</Label>
          <Select value={p.tone ?? "default"} onValueChange={(v) => onPatch({ tone: v as BuilderProps["tone"] })}>
            <SelectTrigger aria-label="Ton de l'alerte"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Information</SelectItem>
              <SelectItem value="success">Succès</SelectItem>
              <SelectItem value="warning">Avertissement</SelectItem>
              <SelectItem value="error">Erreur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {(comp.type === "spacer" || comp.type === "skeleton") && (
        <div className="space-y-1.5">
          <Label>Hauteur</Label>
          <Select value={p.size ?? "md"} onValueChange={(v) => onPatch({ size: v as BuilderProps["size"] })}>
            <SelectTrigger aria-label="Hauteur"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {actionsSlot}
    </div>
  );
}

/** Types de formulaire rendus vivants en mode Aperçu (déclenchent l'event change). */
const LIVE_CHANGE_TYPES = new Set<BuilderType>([
  "input", "textarea", "select", "checkbox", "switch", "slider", "date", "file",
]);

/** Contrôle vivant du mode Aperçu : saisie réelle + déclenchement des actions. */
function LiveControl({
  comp,
  hasChange,
  onFire,
}: {
  comp: BuilderComponent;
  hasChange: boolean;
  onFire: () => void;
}) {
  const p = comp.props;
  switch (comp.type) {
    case "input":
      return (
        <Input
          placeholder={p.placeholder || "Placeholder…"}
          aria-label="Champ de saisie (aperçu)"
          onBlur={hasChange ? onFire : undefined}
          onKeyDown={
            hasChange
              ? (e) => {
                  if (e.key === "Enter") onFire();
                }
              : undefined
          }
        />
      );
    case "textarea":
      return (
        <Textarea
          rows={3}
          placeholder={p.placeholder || "Votre message…"}
          aria-label="Zone de texte (aperçu)"
          onBlur={hasChange ? onFire : undefined}
        />
      );
    case "select": {
      const options = (p.options ?? "").split("\n").map((o) => o.trim()).filter(Boolean);
      return (
        <select
          aria-label="Liste déroulante (aperçu)"
          defaultValue=""
          onChange={hasChange ? onFire : undefined}
          className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"
        >
          <option value="" disabled>
            {p.placeholder || "Choisir…"}
          </option>
          {options.map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    case "checkbox":
      return (
        <label className="flex w-fit items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-emerald-600" onChange={hasChange ? onFire : undefined} />
          {p.text || "Option"}
        </label>
      );
    case "switch":
      return (
        <label className="flex w-fit items-center gap-2 text-sm">
          <Switch onCheckedChange={hasChange ? onFire : undefined} aria-label="Interrupteur (aperçu)" />
          {p.text || "Option"}
        </label>
      );
    case "slider":
      return (
        <div className="flex w-full items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            defaultValue={clampPercent(p.value, 50)}
            aria-label="Curseur (aperçu)"
            className="w-full accent-emerald-600"
            onPointerUp={hasChange ? onFire : undefined}
            onKeyUp={hasChange ? onFire : undefined}
          />
        </div>
      );
    case "date":
      return <Input type="date" aria-label="Champ date (aperçu)" onChange={hasChange ? onFire : undefined} />;
    case "file":
      return <Input type="file" aria-label="Champ fichier (aperçu)" onChange={hasChange ? onFire : undefined} />;
    default:
      return <ComponentRenderer comp={comp} mode="preview" />;
  }
}

/**
 * Bloc interactif du mode Aperçu : déclenche les actions & workflows liés.
 * Événements UI universels câblés au DOM : clic, double-clic, survol entrée/sortie,
 * focus/blur, clavier — et « visible » via IntersectionObserver (une fois par
 * session d'aperçu). Les événements serveur (error, dataloaded, permission) sont
 * déclenchés par le runner, pas par l'aperçu.
 *
 * Exporté : réutilisé par la vue « Aperçu » (preview-view) pour rendre le projet
 * construit comme une vraie application. En mode "app" (aperçu plein écran) les
 * affordances d'édition (badge Action, anneau de survol) sont masquées.
 */
export function PreviewBlock({
  comp,
  onTrigger,
  appMode = false,
}: {
  comp: BuilderComponent;
  onTrigger: RendererTrigger;
  /** true : rendu « application réelle » dans la vue Aperçu (sans chrome d'édition). */
  appMode?: boolean;
}) {
  const events = comp.events ?? [];
  const has = (ev: BuilderEventType) => events.some((e) => e.event === ev && e.actions.length > 0);
  const hasClick = has("click");
  const hasChange = has("change");
  const hasHover = has("hover");
  const hasDblclick = has("dblclick");
  const hasHoverLeave = has("hoverleave");
  const hasFocus = has("focus");
  const hasBlur = has("blur");
  const hasKeydown = has("keydown");
  const hasKeyup = has("keyup");
  const hasVisible = has("visible");
  const interactive =
    hasClick || hasChange || hasHover || hasDblclick || hasHoverLeave || hasFocus || hasBlur || hasKeydown || hasKeyup || hasVisible;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const visibleFiredRef = useRef(false);

  // onVisible : déclenché une seule fois quand le composant entre dans le viewport.
  useEffect(() => {
    if (!hasVisible) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !visibleFiredRef.current) {
            visibleFiredRef.current = true;
            onTrigger(comp, "visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasVisible, comp, onTrigger]);

  return (
    <div
      ref={rootRef}
      role={hasClick ? "button" : undefined}
      tabIndex={hasClick ? 0 : undefined}
      aria-label={hasClick ? `${TYPE_LABELS[comp.type]} — déclenche des actions` : undefined}
      onClick={hasClick ? () => onTrigger(comp, "click") : undefined}
      onDoubleClick={hasDblclick ? () => onTrigger(comp, "dblclick") : undefined}
      onMouseEnter={hasHover ? () => onTrigger(comp, "hover") : undefined}
      onMouseLeave={hasHoverLeave ? () => onTrigger(comp, "hoverleave") : undefined}
      onFocus={hasFocus ? () => onTrigger(comp, "focus") : undefined}
      onBlur={hasBlur ? () => onTrigger(comp, "blur") : undefined}
      onKeyDown={
        hasClick || hasKeydown
          ? (e) => {
              if (hasClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onTrigger(comp, "click");
              } else if (hasKeydown) {
                onTrigger(comp, "keydown");
              }
            }
          : undefined
      }
      onKeyUp={hasKeyup ? () => onTrigger(comp, "keyup") : undefined}
      className={cn(
        "relative rounded-xl p-3 transition-shadow",
        hasClick && !appMode && "cursor-pointer hover:ring-2 hover:ring-emerald-500/50"
      )}
    >
      {interactive && !appMode && (
        <span
          className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"
          title="Actions & workflows configurés"
        >
          <Zap className="size-3" aria-hidden="true" /> Action
        </span>
      )}
      {LIVE_CHANGE_TYPES.has(comp.type) ? (
        <LiveControl comp={comp} hasChange={hasChange} onFire={() => onTrigger(comp, "change")} />
      ) : (
        <ComponentRenderer comp={comp} mode="preview" onTrigger={onTrigger} />
      )}
    </div>
  );
}

export default function BuilderView({
  projectId,
  onOpenPreview,
}: {
  projectId?: string | null;
  /** Ouvre l'aperçu plein écran du projet (vue « Aperçu ») — pageId optionnel. */
  onOpenPreview?: (pageId: string | null) => void;
}) {
  const { toast } = useToast();

  // Thread le projet actif dans les URLs de liste/création (?projectId=).
  const qs = useMemo(() => (projectId ? `?projectId=${projectId}` : ""), [projectId]);

  const [pages, setPages] = useState<PageSummary[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [pagesError, setPagesError] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);

  const [components, setComponents] = useState<BuilderComponent[]>([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Palette : recherche filtrante par nom/catégorie (27 composants).
  const [paletteQuery, setPaletteQuery] = useState("");

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [insertingVitrine, setInsertingVitrine] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingPage, setDeletingPage] = useState(false);

  // ─── Actions & Workflows (panneau Propriétés) ───────────────────────────
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [workflowsLoading, setWorkflowsLoading] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorWorkflowId, setEditorWorkflowId] = useState<string | null>(null);
  const [newWfOpen, setNewWfOpen] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [creatingWf, setCreatingWf] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  /** Action à lier après création inline d'un workflow (« eventId:actionId »). */
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);
  const [testingActionId, setTestingActionId] = useState<string | null>(null);

  const dirtyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Composants dont les actions « load » ont déjà été déclenchées (session d'aperçu). */
  const loadFiredRef = useRef<Set<string>>(new Set());

  const loadPages = useCallback(
    async (selectFirst: boolean) => {
      setPagesLoading(true);
      setPagesError(null);
      try {
        const d = await apiFetch<{ pages: PageSummary[] }>(`/api/pages${qs}`);
        setPages(d.pages);
        if (selectFirst) {
          setPageId((prev) =>
            prev && d.pages.some((p) => p.id === prev) ? prev : (d.pages[0]?.id ?? null)
          );
        }
      } catch (e) {
        setPagesError(e instanceof Error ? e.message : "Erreur inconnue");
      } finally {
        setPagesLoading(false);
      }
    },
    [qs]
  );

  useEffect(() => {
    void loadPages(true);
  }, [loadPages]);

  // Liste des workflows du projet (pour la section « Actions & Workflows »).
  const loadWorkflows = useCallback(async () => {
    setWorkflowsLoading(true);
    try {
      const d = await apiFetch<{ workflows: WorkflowSummary[] }>(`/api/workflows${qs}`);
      setWorkflows(d.workflows);
    } catch {
      // Silencieux : le panneau Propriétés affiche un état vide exploitable.
    } finally {
      setWorkflowsLoading(false);
    }
  }, [qs]);

  useEffect(() => {
    void loadWorkflows();
  }, [loadWorkflows]);

  // Chargement du layout de la page sélectionnée.
  useEffect(() => {
    if (!pageId) {
      setComponents([]);
      setSelectedId(null);
      dirtyRef.current = false;
      return;
    }
    let cancelled = false;
    setPageLoading(true);
    apiFetch<{ page: PageDetail }>(`/api/pages/${pageId}`)
      .then((d) => {
        if (cancelled) return;
        const parsed = parseJsonSafe<BuilderComponent[]>(d.page.layoutJson, []).filter(
          (c): c is BuilderComponent =>
            Boolean(c) && typeof c.id === "string" && typeof c.type === "string"
        );
        setComponents(parsed);
        setSelectedId(null);
        dirtyRef.current = false;
      })
      .catch((e) => {
        if (!cancelled) {
          toast({
            title: "Impossible de charger la page",
            description: e instanceof Error ? e.message : undefined,
            variant: "destructive",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pageId, toast]);

  /** Sauvegarde manuelle ou déclenchée par l'autosave. */
  const savePage = useCallback(async () => {
    if (!pageId) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSaveState("saving");
    try {
      await apiFetch<{ page: PageDetail }>(`/api/pages/${pageId}`, {
        method: "PUT",
        body: JSON.stringify({ layoutJson: JSON.stringify(components) }),
      });
      dirtyRef.current = false;
      setSaveState("saved");
      setSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setSaveState("error");
      toast({
        title: "Échec de la sauvegarde",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    }
  }, [components, pageId, toast]);

  // Autosave : 2 s après la dernière modification.
  useEffect(() => {
    if (!dirtyRef.current || !pageId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveState("pending");
    timerRef.current = setTimeout(() => {
      void savePage();
    }, 2000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [components, pageId, savePage]);

  const mutate = useCallback((updater: (prev: BuilderComponent[]) => BuilderComponent[]) => {
    dirtyRef.current = true;
    setComponents((prev) => updater(prev));
  }, []);

  const addComponent = useCallback(
    (type: BuilderType) => {
      const comp: BuilderComponent = {
        id: crypto.randomUUID(),
        type,
        props: { ...DEFAULT_PROPS[type] },
      };
      mutate((prev) => [...prev, comp]);
      setSelectedId(comp.id);
    },
    [mutate]
  );

  const patchProps = useCallback(
    (id: string, patch: Partial<BuilderProps>) => {
      mutate((prev) =>
        prev.map((c) => (c.id === id ? { ...c, props: { ...c.props, ...patch } } : c))
      );
    },
    [mutate]
  );

  const removeComponent = useCallback(
    (id: string) => {
      mutate((prev) => prev.filter((c) => c.id !== id));
      setSelectedId((prev) => (prev === id ? null : prev));
    },
    [mutate]
  );

  const moveComponent = useCallback(
    (id: string, dir: "up" | "down") => {
      mutate((prev) => {
        const idx = prev.findIndex((c) => c.id === id);
        const target = dir === "up" ? idx - 1 : idx + 1;
        if (idx < 0 || target < 0 || target >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
      });
    },
    [mutate]
  );

  /** Remplace les événements/actions d'un composant (persistés via autosave). */
  const patchEvents = useCallback(
    (id: string, events: BuilderEvent[]) => {
      mutate((prev) => prev.map((c) => (c.id === id ? { ...c, events } : c)));
    },
    [mutate]
  );

  /** Exécute les actions liées à un événement d'un composant (mode Aperçu). */
  const executeActions = useCallback(
    async (comp: BuilderComponent, event: BuilderEventType) => {
      const actions = (comp.events ?? [])
        .filter((e) => e.event === event)
        .flatMap((e) => e.actions);
      if (actions.length === 0) return;
      for (const action of actions) {
        if (action.kind === "workflow") {
          if (!action.workflowId) {
            toast({ title: "Aucun workflow lié à cette action", variant: "destructive" });
            continue;
          }
          try {
            const d = await apiFetch<{ run: WorkflowRunResult }>(
              `/api/workflows/${action.workflowId}/run`,
              { method: "POST" }
            );
            const ok = d.run.status !== "error";
            toast({
              title: ok
                ? `⚡ « ${action.workflowName ?? "Workflow"} » exécuté`
                : `« ${action.workflowName ?? "Workflow"} » en échec`,
              description: `${d.run.durationMs} ms · ${d.run.logs.length} étape(s)`,
              variant: ok ? undefined : "destructive",
            });
          } catch (e) {
            toast({
              title: "Exécution impossible",
              description: e instanceof Error ? e.message : undefined,
              variant: "destructive",
            });
          }
        } else if (action.kind === "link") {
          if (action.url) window.open(action.url, "_blank", "noopener,noreferrer");
        } else if (action.kind === "toast") {
          if (action.message) toast({ title: action.message });
        } else if (action.kind === "page") {
          const target = pages.find((pg) => pg.id === action.pageId);
          if (target) {
            setPageId(target.id);
            toast({ title: `Page « ${action.pageName ?? target.name} » ouverte` });
          } else {
            toast({ title: "Page introuvable", variant: "destructive" });
          }
        } else if (action.kind === "copy") {
          try {
            await navigator.clipboard.writeText(action.message ?? "");
            toast({ title: "Copié dans le presse-papiers" });
          } catch {
            toast({ title: "Copie impossible", variant: "destructive" });
          }
        }
      }
    },
    [pages, toast]
  );

  /**
   * Événement « load » en mode Aperçu : au passage en aperçu, déclenche UNE
   * SEULE FOIS par session les actions « Au chargement » de chaque composant
   * (réinitialisation au retour en édition — garde-fou anti re-déclenchement).
   */
  useEffect(() => {
    if (!preview) {
      loadFiredRef.current = new Set();
      return;
    }
    components.forEach((c) => {
      if (loadFiredRef.current.has(c.id)) return;
      loadFiredRef.current.add(c.id);
      void executeActions(c, "load");
    });
  }, [preview, components, executeActions]);

  /** Teste immédiatement le workflow lié à une action (depuis les Propriétés). */
  const testWorkflow = useCallback(
    async (action: BuilderAction) => {
      if (!action.workflowId) return;
      setTestingActionId(action.id);
      try {
        const d = await apiFetch<{ run: WorkflowRunResult }>(
          `/api/workflows/${action.workflowId}/run`,
          { method: "POST" }
        );
        const ok = d.run.status !== "error";
        toast({
          title: ok ? "Workflow exécuté avec succès" : "Exécution en échec",
          description: `${d.run.durationMs} ms · ${d.run.logs.length} étape(s)`,
          variant: ok ? undefined : "destructive",
        });
      } catch (e) {
        toast({
          title: "Test impossible",
          description: e instanceof Error ? e.message : undefined,
          variant: "destructive",
        });
      } finally {
        setTestingActionId(null);
      }
    },
    [toast]
  );

  /** Création inline d'un workflow puis liaison à l'action à l'origine de la demande. */
  const createWorkflowForAction = useCallback(async () => {
    const name = newWfName.trim();
    if (!name) {
      toast({ title: "Donnez un nom au workflow", variant: "destructive" });
      return;
    }
    setCreatingWf(true);
    try {
      const d = await apiFetch<{
        workflow: { id: string; name: string; status: string; nodesJson: string };
      }>(`/api/workflows${qs}`, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setNewWfOpen(false);
      setNewWfName("");
      toast({
        title: "Workflow créé",
        description: "Configurez ses nœuds puis enregistrez — il reste lié à votre action.",
      });
      await loadWorkflows();
      if (pendingActionKey) {
        const [eventId, actionId] = pendingActionKey.split(":");
        mutate((prev) =>
          prev.map((c) => {
            const evs = c.events ?? [];
            if (!evs.some((e) => e.id === eventId)) return c;
            return {
              ...c,
              events: evs.map((e) =>
                e.id !== eventId
                  ? e
                  : {
                      ...e,
                      actions: e.actions.map((a) =>
                        a.id === actionId
                          ? {
                              ...a,
                              kind: "workflow",
                              workflowId: d.workflow.id,
                              workflowName: d.workflow.name,
                            }
                          : a
                      ),
                    }
              ),
            };
          })
        );
        setPendingActionKey(null);
      }
      // Ouvrir directement l'éditeur pour composer le flux.
      setEditorWorkflowId(d.workflow.id);
      setEditorOpen(true);
    } catch (e) {
      toast({
        title: "Création impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setCreatingWf(false);
    }
  }, [loadWorkflows, mutate, newWfName, pendingActionKey, qs, toast]);

  /** Rafraîchit la liste des workflows + les noms dénormalisés après sauvegarde. */
  const handleEditorSaved = useCallback(
    async (workflowId: string) => {
      try {
        const d = await apiFetch<{ workflows: WorkflowSummary[] }>(`/api/workflows${qs}`);
        setWorkflows(d.workflows);
        const wf = d.workflows.find((w) => w.id === workflowId);
        if (wf) {
          mutate((prev) =>
            prev.map((c) =>
              !c.events
                ? c
                : {
                    ...c,
                    events: c.events.map((e) => ({
                      ...e,
                      actions: e.actions.map((a) =>
                        a.workflowId === wf.id ? { ...a, workflowName: wf.name } : a
                      ),
                    })),
                  }
            )
          );
        }
      } catch {
        // Silencieux : la liste sera rafraîchie au prochain montage.
      }
    },
    [mutate, qs]
  );

  const createPage = useCallback(async () => {
    const name = newName.trim();
    if (!name) {
      toast({ title: "Donnez un nom à la page", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const d = await apiFetch<{ page: PageDetail }>(`/api/pages${qs}`, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setPages((prev) => [
        ...prev,
        { id: d.page.id, name: d.page.name, updatedAt: new Date().toISOString() },
      ]);
      setPageId(d.page.id);
      setNewOpen(false);
      setNewName("");
      toast({ title: "Page créée", description: `« ${d.page.name} » est prête à être composée.` });
    } catch (e) {
      toast({
        title: "Création impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  }, [newName, qs, toast]);

  /**
   * Insère la page « Vitrine palette » (template serveur : les 24 composants
   * de la palette avec un contenu de démonstration) puis la sélectionne.
   * Réinsérable à volonté dans n'importe quel projet — le nom est dédoublonné
   * côté API (« Vitrine palette (2) »…).
   */
  const insertVitrine = useCallback(async () => {
    setInsertingVitrine(true);
    try {
      const d = await apiFetch<{ page: PageDetail }>(`/api/pages${qs}`, {
        method: "POST",
        body: JSON.stringify({ name: "Vitrine palette", template: "palette" }),
      });
      setPages((prev) => [
        ...prev,
        { id: d.page.id, name: d.page.name, updatedAt: new Date().toISOString() },
      ]);
      setPageId(d.page.id);
      toast({
        title: `« ${d.page.name} » insérée`,
        description: "Les 24 composants de la palette sont prêts à explorer — mode Aperçu inclus.",
      });
    } catch (e) {
      toast({
        title: "Insertion de la vitrine impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setInsertingVitrine(false);
    }
  }, [qs, toast]);

  /** Supprime la page sélectionnée (confirmée via AlertDialog) puis sélectionne une autre page. */
  const deletePage = useCallback(async () => {
    if (!pageId) return;
    const target = pages.find((p) => p.id === pageId);
    setDeletingPage(true);
    try {
      await apiFetch(`/api/pages/${pageId}`, { method: "DELETE" });
      const remaining = pages.filter((p) => p.id !== pageId);
      setPages(remaining);
      setPageId(remaining[0]?.id ?? null);
      setDeleteOpen(false);
      toast({
        title: "Page supprimée",
        description: target ? `« ${target.name} » a été définitivement supprimée.` : undefined,
      });
    } catch (e) {
      toast({
        title: "Suppression impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setDeletingPage(false);
    }
  }, [pageId, pages, toast]);

  const copyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(components, null, 2));
      toast({ title: "Copié dans le presse-papiers" });
    } catch {
      toast({ title: "Copie impossible", variant: "destructive" });
    }
  }, [components, toast]);

  const selected = components.find((c) => c.id === selectedId) ?? null;
  /** Nom de la page courante (dialog de suppression, toasts). */
  const currentPageName = pages.find((p) => p.id === pageId)?.name ?? null;

  /** Groupes de palette filtrés par la recherche (insensible à la casse/accents). */
  const filteredPaletteGroups = useMemo(() => {
    const q = paletteQuery
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
    if (!q) return PALETTE_GROUPS;
    return PALETTE_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter(
        (it) =>
          it.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q) ||
          it.hint.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q) ||
          it.type.includes(q)
      ),
    })).filter((g) => g.items.length > 0);
  }, [paletteQuery]);

  return (
    <div>
      <SectionHeader
        title="Builder UI"
        description="Composez vos pages en glissant des composants depuis la palette — sauvegarde automatique incluse."
      />

      {pagesError && (
        <div className="mb-4">
          <ErrorState message={pagesError} onRetry={() => void loadPages(true)} />
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[240px_1fr_280px]">
        {/* ─── Palette (catégories + recherche) ────────────────────────────── */}
        <Card className="h-fit gap-0 py-0 lg:sticky lg:top-20">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-sm">Palette</CardTitle>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
              <Input
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Rechercher un composant…"
                aria-label="Rechercher un composant dans la palette"
                className="h-8 pl-8 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent
            className={cn(
              "flex flex-row flex-wrap gap-2 p-3 lg:flex-col lg:flex-nowrap",
              "lg:max-h-[calc(100vh-260px)] lg:overflow-y-auto",
              SCROLLBAR_Y
            )}
          >
            {filteredPaletteGroups.length === 0 && (
              <p className="px-1 py-2 text-xs text-muted-foreground">
                Aucun composant ne correspond à « {paletteQuery} ».
              </p>
            )}
            {filteredPaletteGroups.map((group) => (
              <div key={group.id} className="w-full space-y-1.5">
                <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {group.label}
                  <span className="ml-1 font-normal text-zinc-300">· {group.items.length}</span>
                </p>
                {group.items.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="h-auto w-full min-h-11 justify-start gap-2.5 py-2 lg:min-h-0"
                    onClick={() => addComponent(item.type)}
                    aria-label={`Ajouter : ${item.label}`}
                  >
                    <item.icon className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span className="flex flex-col items-start leading-tight">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-[10px] font-normal text-muted-foreground">{item.hint}</span>
                    </span>
                  </Button>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ─── Canvas + toolbar ────────────────────────────────────────────── */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Select value={pageId ?? ""} onValueChange={(v) => setPageId(v)} disabled={pages.length === 0}>
              <SelectTrigger className="w-44 sm:w-52" aria-label="Choisir une page">
                <SelectValue placeholder="Choisir une page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 lg:min-h-9"
              onClick={() => setNewOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" /> Nouvelle page
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 lg:min-h-9"
              onClick={() => void insertVitrine()}
              disabled={insertingVitrine}
              aria-label="Insérer la page de démonstration Vitrine palette"
            >
              <Sparkles className="size-4 text-emerald-600" aria-hidden="true" />
              {insertingVitrine ? "Insertion…" : "Vitrine palette"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-11 px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 lg:min-h-9"
              onClick={() => setDeleteOpen(true)}
              disabled={!pageId}
              aria-label="Supprimer la page sélectionnée"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="flex items-center gap-2">
              <Switch
                id="preview-mode"
                checked={preview}
                onCheckedChange={setPreview}
                aria-label="Basculer le mode aperçu"
              />
              <Label htmlFor="preview-mode" className="text-sm font-normal">
                Aperçu
              </Label>
            </div>
            <Button variant="outline" size="sm" className="min-h-11 lg:min-h-9" onClick={() => setExportOpen(true)}>
              <CodeXml className="size-4" aria-hidden="true" /> Exporter JSON
            </Button>
            {onOpenPreview && (
              <Button
                variant="outline"
                size="sm"
                className="min-h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50 lg:min-h-9"
                onClick={() => onOpenPreview(pageId)}
                disabled={pages.length === 0}
                title="Ouvrir le projet comme une application (plein écran)"
                aria-label="Ouvrir l'aperçu plein écran du projet"
              >
                <MonitorPlay className="size-4" aria-hidden="true" /> Aperçu plein écran
              </Button>
            )}
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
            <div className="ml-auto flex items-center gap-3">
              {saveState === "pending" && (
                <span className="text-xs text-muted-foreground" aria-live="polite">
                  Sauvegarde auto…
                </span>
              )}
              {saveState === "saving" && (
                <span className="text-xs text-muted-foreground" aria-live="polite">
                  Enregistrement…
                </span>
              )}
              {saveState === "saved" && savedAt && (
                <span className="text-xs text-emerald-600" aria-live="polite">
                  Enregistré ✓ {savedAt}
                </span>
              )}
              {saveState === "error" && (
                <span className="text-xs text-rose-600" aria-live="polite">
                  Erreur de sauvegarde
                </span>
              )}
              <Button
                size="sm"
                className="min-h-11 bg-emerald-600 text-white hover:bg-emerald-700 lg:min-h-9"
                onClick={() => void savePage()}
                disabled={!pageId || saveState === "saving"}
              >
                Enregistrer
              </Button>
            </div>
          </div>

          <Card className={cn("gap-0 py-0", !preview && CANVAS_GRID_BG)}>
            <CardContent className={cn("min-h-[480px]", preview ? "space-y-5 p-6" : "space-y-3 p-4")}>
              {pageLoading ? (
                <div className="space-y-3" aria-hidden="true">
                  <Skeleton className="h-10 w-2/3 rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-10 w-1/2 rounded-lg" />
                </div>
              ) : components.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-white/60 p-6">
                  <p className="max-w-xs text-center text-sm text-muted-foreground">
                    {preview
                      ? "La page est vide — repassez en mode édition pour la composer."
                      : "Toile vide — ajoutez votre premier composant depuis la palette, ou insérez la page de démonstration."}
                  </p>
                  {!preview && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-11 lg:min-h-9"
                      onClick={() => void insertVitrine()}
                      disabled={insertingVitrine}
                    >
                      <Sparkles className="size-4 text-emerald-600" aria-hidden="true" />
                      {insertingVitrine ? "Insertion…" : "Insérer la vitrine palette"}
                    </Button>
                  )}
                </div>
              ) : (
                components.map((c, i) =>
                  preview ? (
                    <PreviewBlock
                      key={c.id}
                      comp={c}
                      onTrigger={(comp, ev) => void executeActions(comp, ev)}
                    />
                  ) : (
                    <CanvasBlock
                      key={c.id}
                      comp={c}
                      selected={selectedId === c.id}
                      isFirst={i === 0}
                      isLast={i === components.length - 1}
                      onSelect={setSelectedId}
                      onMove={moveComponent}
                      onRemove={removeComponent}
                    />
                  )
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* ─── Propriétés ──────────────────────────────────────────────────── */}
        <Card className="h-fit gap-0 py-0 lg:sticky lg:top-20">
          <CardHeader className="border-b px-4 py-3">
            <CardTitle className="text-sm">
              Propriétés
              {selected && (
                <span className="ml-1.5 font-normal text-muted-foreground">
                  · {TYPE_LABELS[selected.type]}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {selected ? (
              <PropsPanel
                comp={selected}
                onPatch={(patch) => patchProps(selected.id, patch)}
                actionsSlot={
                  <ActionsEditor
                    comp={selected}
                    workflows={workflows}
                    workflowsLoading={workflowsLoading}
                    pages={pages}
                    onEventsChange={(events) => patchEvents(selected.id, events)}
                    onEditWorkflow={(wfId) => {
                      setEditorWorkflowId(wfId);
                      setEditorOpen(true);
                    }}
                    onCreateWorkflow={(actionKey) => {
                      setPendingActionKey(actionKey);
                      setNewWfName("");
                      setNewWfOpen(true);
                    }}
                    onTestAction={(action) => void testWorkflow(action)}
                    testingActionId={testingActionId}
                  />
                }
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Sélectionnez un composant sur la toile pour éditer ses propriétés et
                configurer ses actions &amp; workflows.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── AlertDialog : suppression de page ───────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer la page{currentPageName ? ` « ${currentPageName} »` : ""} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est définitive — le layout de la page (composants, propriétés,
              actions &amp; workflows liés) sera perdu. Les autres pages du projet ne sont
              pas affectées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={(e) => {
                e.preventDefault();
                void deletePage();
              }}
              disabled={deletingPage}
            >
              {deletingPage ? "Suppression…" : "Supprimer définitivement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Dialog : nouvelle page ─────────────────────────────────────── */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle page</DialogTitle>
            <DialogDescription>Créez une page vierge pour la composer dans le builder.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="new-page-name">Nom de la page</Label>
            <Input
              id="new-page-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ex. Page d'accueil"
              onKeyDown={(e) => {
                if (e.key === "Enter") void createPage();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void createPage()}
              disabled={creating || !newName.trim()}
            >
              {creating ? "Création…" : "Créer la page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog : nouveau workflow (liaison d'action) ───────────────── */}
      <Dialog open={newWfOpen} onOpenChange={setNewWfOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau workflow</DialogTitle>
            <DialogDescription>
              Créez un workflow puis configurez ses nœuds directement — il sera lié à
              l&apos;action sélectionnée.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="new-wf-name">Nom du workflow</Label>
            <Input
              id="new-wf-name"
              value={newWfName}
              onChange={(e) => setNewWfName(e.target.value)}
              placeholder="ex. Inscription utilisateur"
              onKeyDown={(e) => {
                if (e.key === "Enter") void createWorkflowForAction();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewWfOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void createWorkflowForAction()}
              disabled={creatingWf || !newWfName.trim()}
            >
              {creatingWf ? "Création…" : "Créer et configurer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog : éditeur de workflow (depuis les Propriétés) ────────── */}
      <WorkflowEditorDialog
        workflowId={editorWorkflowId}
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSaved={(id) => void handleEditorSaved(id)}
      />

      {wizardOpen && projectId && (
        <ProjectWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onFinished={(slug) => {
            setWizardOpen(false);
            // On pourrai rafraichir les projets ici ou changer d'onglet
          }}
          existingProjectId={projectId}
        />
      )}

      {/* ─── Dialog : export JSON ─────────────────────────────────────────── */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter le layout JSON</DialogTitle>
            <DialogDescription>
              Structure sérialisée de la page — réutilisable telle quelle via l&apos;API.
            </DialogDescription>
          </DialogHeader>
          <pre
            className={cn(
              "max-h-80 overflow-auto rounded-md bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-100",
              SCROLLBAR_Y
            )}
          >
            {JSON.stringify(components, null, 2)}
          </pre>
          <DialogFooter>
            <Button variant="outline" onClick={() => void copyJson()}>
              <Copy className="size-4" aria-hidden="true" /> Copier
            </Button>
            <Button onClick={() => setExportOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
