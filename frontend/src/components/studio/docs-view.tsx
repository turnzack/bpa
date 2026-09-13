"use client";

/**
 * Module « Docs » — documentation réelle de Forge Studio :
 * - onglet Guides : guides pas-à-pas des fonctionnalités (dont la liaison
 *   composant → workflow du Builder) ;
 * - onglet Référence API : catalogue complet des endpoints réels, exemples
 *   curl copiables, exécution en direct des GET, export OpenAPI téléchargeable.
 */

import { useCallback, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Braces,
  ChartColumn,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Download,
  LayoutDashboard,
  Loader2,
  Map,
  MousePointerClick,
  Play,
  Rocket,
  ShieldCheck,
  Workflow as WorkflowIcon,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINT_COUNT, API_GROUPS } from "@/lib/api-catalog";
import type { ApiEndpointDoc, ApiMethod } from "@/lib/api-catalog";
import { cn } from "@/lib/utils";
import { apiFetch, SCROLLBAR_X, SCROLLBAR_Y } from "./use-studio";
import { SectionHeader } from "./shared";

// ─── Guides ─────────────────────────────────────────────────────────────────

interface Guide {
  id: string;
  title: string;
  icon: LucideIcon;
  intro: string;
  steps: string[];
  tip?: string;
  highlight?: boolean;
}

const GUIDES: Guide[] = [
  {
    id: "workflow-binding",
    title: "Lier un workflow à un bouton",
    icon: MousePointerClick,
    highlight: true,
    intro:
      "Rendez vos pages interactives : chaque élément du Builder peut déclencher un workflow réel.",
    steps: [
      "Ouvrez « Builder UI » et sélectionnez un élément interactif (bouton, champ de saisie…).",
      "Dans le panneau Propriétés, section « Actions & Workflows », cliquez sur « Ajouter ».",
      "Choisissez l'événement (Au clic, À la modification) puis l'action « Exécuter un workflow ».",
      "Sélectionnez un workflow existant, ou « Nouveau » pour le créer et le lier en une fois (l'éditeur complet s'ouvre dans une fenêtre).",
      "« Tester » exécute le workflow immédiatement ; en mode Aperçu, un clic sur l'élément déclenche réellement l'action (résultat affiché en notification).",
    ],
    tip: "Le badge ⚡ signale les éléments interactifs. Les liaisons sont enregistrées automatiquement dans le layout de la page.",
  },
  {
    id: "demarrer",
    title: "Bien démarrer",
    icon: Rocket,
    intro: "De l'idée au projet outillé en quatre étapes.",
    steps: [
      "Créez un projet dans « Projets » : SaaS, application, site web, jeu vidéo…",
      "Sa feuille de route (phases, sprints, tâches, livrables) est générée automatiquement selon le type.",
      "Construisez l'interface dans « Builder UI », le modèle de données dans « Données », les automatisations dans « Workflows ».",
      "Suivez l'avancement global dans « Analytics » et gérez votre plan dans « Billing ».",
    ],
  },
  {
    id: "projets-roadmap",
    title: "Projets & feuilles de route",
    icon: Map,
    intro: "Chaque projet naît avec son plan d'exécution cochable.",
    steps: [
      "« Projets » : créez, ouvrez dans le Builder, archivez ou supprimez un projet.",
      "À la création, la feuille de route du projet est générée (4 à 8 sprints, tâches + livrables adaptés au domaine).",
      "Dans « Feuille de route », basculez entre le périmètre Plateforme et le projet actif.",
      "Filtrez (Tout / À faire / Terminées), cochez les éléments : chaque coche est persistée via l'API.",
    ],
    tip: "Les tâches cochées correspondent à des fonctionnalités réellement implémentées : la feuille de route reflète l'état réel du produit.",
  },
  {
    id: "builder",
    title: "Builder UI",
    icon: LayoutDashboard,
    intro: "Composez vos pages visuellement, sans code.",
    steps: [
      "Ajoutez des composants depuis la bibliothèque : titre, texte, bouton, champ, carte, image, table.",
      "Sélectionnez un élément : le panneau Propriétés édite le texte, la couleur, la taille et les actions.",
      "Réorganisez avec les flèches, dupliquez ou supprimez en un clic.",
      "Basculez en mode Aperçu pour tester les interactions réelles (workflows, liens, messages).",
    ],
    tip: "« Exporter JSON » affiche et copie le layout complet ; la sauvegarde automatique intervient 2 s après chaque modification.",
  },
  {
    id: "donnees",
    title: "Données",
    icon: Database,
    intro: "Une base de données visuelle directement dans le studio.",
    steps: [
      "Créez une table et ses champs typés : string, number, boolean, datetime, json.",
      "Appliquez les contraintes : requis, unique, valeur par défaut.",
      "Ajoutez, modifiez et supprimez les lignes directement dans la vue.",
      "Les tables peuvent être rattachées à un projet actif.",
    ],
  },
  {
    id: "workflows",
    title: "Workflows",
    icon: WorkflowIcon,
    intro: "Automatisez : nœuds visuels + moteur d'exécution avec logs.",
    steps: [
      "Un workflow est une séquence de nœuds : Webhook, Timer, HTTP, Condition, Code, Email.",
      "Ordonnez les nœuds, configurez chacun (URL, expression, code, destinataire…).",
      "Exécutez depuis la liste, ou via un bouton du Builder (voir le guide « Lier un workflow à un bouton »).",
      "Chaque exécution produit des logs détaillés : durée par nœud, statut, conditions évaluées.",
    ],
    tip: "Une condition fausse court-circuite les actions suivantes : visible dans les logs du run.",
  },
  {
    id: "analytics-billing",
    title: "Analytics & Billing",
    icon: ChartColumn,
    intro: "Pilotez l'usage et l'abonnement.",
    steps: [
      "« Analytics » : totaux (pages, tables, workflows, runs), runs par workflow, activité 14 jours, usage du plan.",
      "« Billing » : plans Free / Pro / Enterprise, limites associées et journal d'audit.",
      "Toutes ces métriques sont exposées par l'API : voir l'onglet « Référence API ».",
    ],
  },
];

// ─── Référence API ──────────────────────────────────────────────────────────

const METHOD_STYLES: Record<ApiMethod, string> = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-amber-100 text-amber-700",
  PUT: "bg-zinc-200 text-zinc-700",
  PATCH: "bg-zinc-200 text-zinc-700",
  DELETE: "bg-rose-100 text-rose-700",
};

function MethodBadge({ method }: { method: ApiMethod }) {
  return (
    <Badge
      className={cn(
        "w-16 justify-center rounded font-mono text-[11px] font-bold",
        METHOD_STYLES[method]
      )}
    >
      {method}
    </Badge>
  );
}

interface RunState {
  loading: boolean;
  result?: string;
  error?: string;
}

function EndpointCard({ ep }: { ep: ApiEndpointDoc }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState<RunState>({ loading: false });
  const [copied, setCopied] = useState(false);

  const key = `${ep.method} ${ep.path}`;

  /** Exemple curl (origin calculé côté client uniquement). */
  const curl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://votre-instance";
    if (ep.method === "GET") return `curl -s "${origin}${ep.path}"`;
    const parts = [`curl -X ${ep.method} "${origin}${ep.path}"`, `  -H "Content-Type: application/json"`];
    if (ep.bodyExample) parts.push(`  -d '${JSON.stringify(ep.bodyExample)}'`);
    return parts.join(" \\\n");
  }, [ep]);

  const copyCurl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast({ title: "Copie impossible", description: "Le presse-papiers n'est pas disponible.", variant: "destructive" });
    }
  }, [curl, toast]);

  /** Exécution en direct des GET : affiche la vraie réponse JSON. */
  const execute = useCallback(async () => {
    setRun({ loading: true });
    try {
      const data = await apiFetch<unknown>(ep.path);
      setRun({ loading: false, result: JSON.stringify(data, null, 2) });
    } catch (e) {
      setRun({ loading: false, error: e instanceof Error ? e.message : "Erreur inconnue" });
    }
  }, [ep.path]);

  const hasDetails =
    ep.description || ep.pathParams || ep.queryParams || ep.bodyExample || ep.responseExample || ep.tryable;
  const params = [...(ep.pathParams ?? []), ...(ep.queryParams ?? [])];

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full min-h-11 items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-zinc-50"
      >
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
        )}
        <MethodBadge method={ep.method} />
        <code className="min-w-0 flex-1 truncate font-mono text-xs sm:text-sm">{ep.path}</code>
        <span className="hidden shrink-0 text-xs text-muted-foreground md:block">{ep.summary}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t bg-zinc-50/60 px-4 py-4">
          <p className="text-sm font-medium">{ep.summary}</p>
          {ep.description && <p className="text-sm text-muted-foreground">{ep.description}</p>}

          {params.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Paramètres
              </p>
              <ul className="space-y-1">
                {params.map((p) => (
                  <li key={p.name} className="text-sm">
                    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">{p.name}</code>{" "}
                    <span className="text-muted-foreground">— {p.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ep.bodyExample && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Corps de la requête (JSON)
              </p>
              <pre
                className={cn(
                  "max-h-52 overflow-auto rounded-lg border bg-white p-3 font-mono text-xs leading-relaxed",
                  SCROLLBAR_Y
                )}
              >
                {JSON.stringify(ep.bodyExample, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Exemple curl</p>
              <Button size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-xs" onClick={() => void copyCurl()}>
                {copied ? (
                  <Check className="size-3.5 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
            <pre
              className={cn(
                "overflow-x-auto rounded-lg border bg-zinc-900 p-3 font-mono text-xs leading-relaxed text-zinc-100",
                SCROLLBAR_X
              )}
            >
              {curl}
            </pre>
          </div>

          {ep.responseExample !== undefined && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Réponse (exemple)
              </p>
              <pre
                className={cn(
                  "max-h-52 overflow-auto rounded-lg border bg-white p-3 font-mono text-xs leading-relaxed",
                  SCROLLBAR_Y
                )}
              >
                {JSON.stringify(ep.responseExample, null, 2)}
              </pre>
            </div>
          )}

          {ep.tryable && (
            <div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5" onClick={() => void execute()} disabled={run.loading}>
                  {run.loading ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Play className="size-3.5" aria-hidden="true" />
                  )}
                  {run.loading ? "Exécution…" : "Exécuter en direct"}
                </Button>
                <span className="text-xs text-muted-foreground">GET réel sur cette instance</span>
              </div>
              {run.result && (
                <pre
                  className={cn(
                    "mt-2 max-h-64 overflow-auto rounded-lg border bg-white p-3 font-mono text-xs leading-relaxed",
                    SCROLLBAR_Y
                  )}
                >
                  {run.result}
                </pre>
              )}
              {run.error && (
                <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                  {run.error}
                </p>
              )}
            </div>
          )}

          {!hasDetails && (
            <p className="text-xs text-muted-foreground">Endpoint sans paramètre — voir l'exemple curl.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Vue principale ─────────────────────────────────────────────────────────

type DocsTab = "guides" | "api";

export default function DocsView({ initialTab = "guides" }: { initialTab?: DocsTab }) {
  const [tab, setTab] = useState<DocsTab>(initialTab);
  const { toast } = useToast();

  /** Télécharge la spécification OpenAPI générée par /api/openapi. */
  const downloadOpenApi = useCallback(async () => {
    try {
      const res = await fetch("/api/openapi");
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const spec = await res.json();
      const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "forge-studio-openapi.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast({ title: "Spécification téléchargée", description: "forge-studio-openapi.json" });
    } catch (e) {
      toast({
        title: "Téléchargement impossible",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div>
      <SectionHeader
        title="Documentation"
        description="Guides d'utilisation et référence complète de l'API Forge Studio."
      />

      {/* Onglets Guides / API */}
      <div
        role="group"
        aria-label="Section de la documentation"
        className="mb-6 inline-flex rounded-lg border bg-white p-1"
      >
        <button
          type="button"
          aria-pressed={tab === "guides"}
          onClick={() => setTab("guides")}
          className={cn(
            "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
            tab === "guides" ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
          )}
        >
          <BookOpen className="size-4" aria-hidden="true" />
          Guides
        </button>
        <button
          type="button"
          aria-pressed={tab === "api"}
          onClick={() => setTab("api")}
          className={cn(
            "inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
            tab === "api" ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
          )}
        >
          <Braces className="size-4" aria-hidden="true" />
          Référence API
        </button>
      </div>

      {tab === "guides" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card
                key={guide.id}
                className={cn(guide.highlight && "border-emerald-200 bg-emerald-50/50")}
              >
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        guide.highlight ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600"
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-4" />
                    </span>
                    <h3 className="font-semibold tracking-tight">{guide.title}</h3>
                    {guide.highlight && (
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                        <Zap className="size-3" aria-hidden="true" /> Populaire
                      </Badge>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{guide.intro}</p>
                  <ol className="space-y-2">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {guide.tip && (
                    <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-relaxed text-emerald-800">
                      💡 {guide.tip}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Bandeau outils API */}
          <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
              <span>
                <strong className="text-foreground">{API_ENDPOINT_COUNT} endpoints</strong> réels ·
                rate limiting 120 req/min · erreurs standard {"{ error }"}
              </span>
            </div>
            <Button variant="outline" className="gap-1.5" onClick={() => void downloadOpenApi()}>
              <Download className="size-4" aria-hidden="true" />
              Télécharger OpenAPI JSON
            </Button>
          </div>

          {/* Groupes d'endpoints */}
          {API_GROUPS.map((group) => (
            <section key={group.id} aria-labelledby={`api-group-${group.id}`}>
              <h3 id={`api-group-${group.id}`} className="text-base font-semibold tracking-tight">
                {group.title}
              </h3>
              <p className="mb-3 mt-0.5 text-sm text-muted-foreground">{group.description}</p>
              <div className="space-y-2">
                {group.endpoints.map((ep) => (
                  <EndpointCard key={`${ep.method} ${ep.path}`} ep={ep} />
                ))}
              </div>
            </section>
          ))}

          <p className="text-xs leading-relaxed text-muted-foreground">
            Spécification complète : <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono">GET /api/openapi</code>{" "}
            (OpenAPI 3.0, importable dans Swagger UI, Postman ou Insomnia). MVP : aucune authentification,
            toutes les routes opèrent sur l&apos;organisation courante.
          </p>
        </div>
      )}
    </div>
  );
}
