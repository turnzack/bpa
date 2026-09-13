"use client";

/**
 * Module « PRD » — vue documentation de Forge Studio.
 * Rend le PRD OmniBuild (données statiques de @/lib/prd-data) avec :
 * - une carte méta document + export Markdown téléchargeable ;
 * - un sommaire cliquable (aside sticky sur desktop, chips horizontales sur mobile) ;
 * - un scrollspy via IntersectionObserver.
 * Données 100 % statiques : chargement instantané (aucun fetch, aucun skeleton).
 */

import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Download, FileText, Info, TriangleAlert, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PRD_DATA, prdToMarkdown } from "@/lib/prd-data";
import type { PrdBlock, PrdDoc, PrdImpact, PrdSection } from "@/lib/prd-data";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./shared";
import { SCROLLBAR_X } from "./use-studio";

// ─── Types & constantes internes ────────────────────────────────────────────

type PrdCalloutBlock = Extract<PrdBlock, { type: "callout" }>;
type PrdRiskRow = Extract<PrdBlock, { type: "risk-table" }>["rows"][number];

/** Callouts : conteneur + icône selon le ton. */
const CALLOUT_TONES: Record<
  PrdCalloutBlock["tone"],
  { box: string; icon: LucideIcon; iconClass?: string }
> = {
  info: { box: "border-zinc-200 bg-zinc-50 text-zinc-700", icon: Info },
  success: {
    box: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  warn: {
    box: "border-amber-200 bg-amber-50 text-amber-800",
    icon: TriangleAlert,
    iconClass: "text-amber-600",
  },
};

/** Badges d'impact (risk-table) : fond + texte uniquement, sans bordure colorée. */
const IMPACT_STYLES: Record<PrdImpact, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-zinc-100 text-zinc-600",
  Low: "bg-emerald-100 text-emerald-700",
};

/** Badge coloré d'impact pour la table des risques. */
function ImpactBadge({ impact }: { impact: PrdImpact }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent text-[10px] uppercase", IMPACT_STYLES[impact])}
    >
      {impact}
    </Badge>
  );
}

// ─── Carte méta document + export Markdown ──────────────────────────────────

function PrdMetaCard({ doc }: { doc: PrdDoc }) {
  const { toast } = useToast();

  /** Génère le Markdown et déclenche le téléchargement du fichier .md. */
  const handleExport = useCallback(() => {
    const markdown = prdToMarkdown(doc);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "PRD-OmniBuild-Platform.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast({
      title: "PRD exporté",
      description: "Le document a été téléchargé au format Markdown.",
    });
  }, [doc, toast]);

  return (
    <div className="mb-6 rounded-xl border bg-white p-4">
      {/* Rangée 1 : badge produit + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-emerald-600" aria-hidden="true" />
          <span className="font-semibold">{doc.tagline}</span>
        </div>
        <Button size="sm" variant="outline" onClick={handleExport}>
          <Download className="size-4" aria-hidden="true" /> Télécharger (.md)
        </Button>
      </div>
      {/* Rangée 2 : métadonnées */}
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-zinc-600">
          Version : {doc.version}
        </Badge>
        <Badge variant="outline" className="text-zinc-600">
          Statut : {doc.status}
        </Badge>
        <Badge variant="outline" className="text-zinc-600">
          Date : {doc.date}
        </Badge>
        <Badge variant="outline" className="text-zinc-600">
          MAJ : {doc.updated}
        </Badge>
      </div>
      {/* Rangée 3 : équipe */}
      <p className="mt-1 text-xs text-muted-foreground">Équipe : {doc.team}</p>
    </div>
  );
}

// ─── Sommaire (desktop sticky + mobile chips) ───────────────────────────────

type TocProps = {
  sections: PrdSection[];
  active: string;
  onSelect: (id: string) => void;
};

function PrdTocDesktop({ sections, active, onSelect }: TocProps) {
  return (
    <aside
      aria-label="Sommaire du document"
      className={cn(
        "sticky top-[4.5rem] hidden max-h-[calc(100vh-5.5rem)] shrink-0 self-start overflow-y-auto lg:block lg:w-60",
        SCROLLBAR_X
      )}
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
        Sommaire
      </p>
      <div>
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-2 rounded-md border-l-2 px-2.5 py-2 text-left text-sm transition-colors",
                isActive
                  ? "border-emerald-600 bg-emerald-50 font-medium text-emerald-700"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100"
              )}
            >
              <span className="w-5 shrink-0 text-right text-[11px] font-semibold">{s.number}</span>
              <span className="truncate">{s.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function PrdTocMobile({ sections, active, onSelect }: TocProps) {
  return (
    <nav aria-label="Sommaire du document (mobile)" className="mb-5 lg:hidden">
      <div className={cn("flex gap-1.5 overflow-x-auto pb-1", SCROLLBAR_X)}>
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "flex min-h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition-colors",
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-transparent text-zinc-600 hover:bg-zinc-100"
              )}
            >
              <span className="font-semibold">{s.number}</span>
              {s.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Rendu des blocs ────────────────────────────────────────────────────────

function CalloutBlock({ block }: { block: PrdCalloutBlock }) {
  const tone = CALLOUT_TONES[block.tone];
  const Icon = tone.icon;
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-4", tone.box)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone.iconClass)} aria-hidden="true" />
      <div>
        {block.title && <p className="text-sm font-semibold">{block.title}</p>}
        <p className="mt-0.5 text-sm leading-relaxed">{block.text}</p>
      </div>
    </div>
  );
}

/** Table générique (headers + rows) : scroll horizontal, 1re colonne en font-medium. */
function PrdTableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border bg-white", SCROLLBAR_X)}>
      <table className="w-full text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {headers.map((header, i) => (
              <th
                key={`${header}-${i}`}
                className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-zinc-50/60">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn("border-t px-3 py-2.5 align-top text-zinc-700", ci === 0 && "font-medium")}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Table des risques : colonne Impact en badge coloré, atténuation avec wrap normal. */
function PrdRiskTableBlock({ rows }: { rows: PrdRiskRow[] }) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border bg-white", SCROLLBAR_X)}>
      <table className="w-full text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {["Risque", "Impact", "Probabilité", "Atténuation"].map((header) => (
              <th
                key={header}
                className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.risk} className="hover:bg-zinc-50/60">
              <td className="border-t px-3 py-2.5 align-top font-medium text-zinc-700">{row.risk}</td>
              <td className="border-t px-3 py-2.5 align-top">
                <ImpactBadge impact={row.impact} />
              </td>
              <td className="border-t px-3 py-2.5 align-top text-zinc-700">{row.probability}</td>
              <td className="border-t px-3 py-2.5 align-top text-zinc-700">{row.mitigation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Renderer principal : un composant par type de bloc PrdBlock. */
function PrdBlockRenderer({ block }: { block: PrdBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-sm leading-relaxed text-zinc-700">{block.text}</p>;

    case "callout":
      return <CalloutBlock block={block} />;

    case "kpi-grid":
      return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {block.items.map((item, i) => (
            <div key={`${item.label}-${i}`} className="rounded-xl border bg-white p-4">
              <p className="text-2xl font-bold tracking-tight">{item.value}</p>
              <p className="mt-1 text-xs font-medium text-zinc-600">{item.label}</p>
              {item.hint && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">{item.hint}</p>
              )}
            </div>
          ))}
        </div>
      );

    case "table":
      return <PrdTableBlock headers={block.headers} rows={block.rows} />;

    case "risk-table":
      return <PrdRiskTableBlock rows={block.rows} />;

    case "checklist":
      return (
        <ul className="space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              {item.ok ? (
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0 text-zinc-400" aria-hidden="true" />
              )}
              <span className={cn("text-sm", item.ok ? "text-zinc-700" : "text-zinc-500")}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );

    case "list":
      return (
        <ul
          className={cn(
            "space-y-1.5 pl-5 text-sm text-zinc-700",
            block.ordered ? "list-decimal" : "list-disc"
          )}
        >
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "persona-grid":
      return (
        <div className="grid gap-4 md:grid-cols-3">
          {block.personas.map((persona) => (
            <div key={persona.name} className="rounded-xl border bg-white p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
                  aria-hidden="true"
                >
                  {persona.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{persona.name}</p>
                  <p className="text-xs text-muted-foreground">{persona.role}</p>
                </div>
              </div>
              <dl className="mt-3 space-y-2.5">
                {persona.rows.map((row) => (
                  <div key={row.label} className="border-t pt-2.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {row.label}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-zinc-700">{row.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      );

    case "feature-grid":
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {block.features.map((feature) => (
            <div key={feature.code} className="rounded-xl border bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-50 text-emerald-700"
                >
                  {feature.code}
                </Badge>
                <span className="text-sm font-semibold">{feature.title}</span>
                {feature.source !== "—" && (
                  <Badge variant="secondary">inspiré {feature.source}</Badge>
                )}
              </div>
              <ul className="mt-2.5 space-y-1.5 list-disc pl-5 text-sm text-zinc-700">
                {feature.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
  }
}

// ─── Section du document ────────────────────────────────────────────────────

function PrdSectionBlock({ section }: { section: PrdSection }) {
  return (
    <section id={`prd-${section.id}`} className="scroll-mt-28">
      <header className="mb-3 flex items-center gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"
          aria-hidden="true"
        >
          {section.number}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3>
      </header>
      {section.blocks.length > 0 && (
        <div className={cn(section.blocks.length > 1 && "space-y-4")}>
          {section.blocks.map((block, i) => (
            <PrdBlockRenderer key={`${block.type}-${i}`} block={block} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Vue principale ─────────────────────────────────────────────────────────

export default function PrdView() {
  // Première section active par défaut (et repli si IntersectionObserver est indisponible).
  const [active, setActive] = useState<string>(PRD_DATA.sections[0]?.id ?? "");

  // Scrollspy : chaque section entrant dans la bande de détection devient active.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id.replace(/^prd-/, ""));
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );
    const nodes = document.querySelectorAll<HTMLElement>('section[id^="prd-"]');
    nodes.forEach((node) => observer.observe(node));
    // Repli : tout en bas de page, la dernière section devient active
    // (elle peut être trop courte pour entrer seule dans la bande de détection).
    const lastId = PRD_DATA.sections[PRD_DATA.sections.length - 1]?.id;
    const onScroll = () => {
      const bottomReached =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (bottomReached && lastId) setActive(lastId);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /** Clic dans le sommaire : défilement fluide vers la section (scroll-mt-28 gère l'offset). */
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(`prd-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const tocProps: TocProps = {
    sections: PRD_DATA.sections,
    active,
    onSelect: scrollToSection,
  };

  return (
    <div>
      <SectionHeader
        title="PRD — OmniBuild Platform"
        description="Document produit : objectifs, personas, fonctionnalités, périmètre et critères d'acceptation."
      />

      <PrdMetaCard doc={PRD_DATA} />

      <div className="lg:flex lg:gap-6">
        {/* Sommaire mobile : chips horizontales scrollables au-dessus du contenu */}
        <PrdTocMobile {...tocProps} />

        {/* Sommaire desktop : aside sticky */}
        <PrdTocDesktop {...tocProps} />

        {/* Contenu du document */}
        <article className="min-w-0 flex-1">
          <div className="space-y-8">
            {PRD_DATA.sections.map((section) => (
              <PrdSectionBlock key={section.id} section={section} />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
