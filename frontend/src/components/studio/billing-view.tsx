"use client";

import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Check,
  CreditCard,
  Database,
  LayoutDashboard,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiFetch, SCROLLBAR_Y, timeAgoFr } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import type { BillingData } from "./types";

const PLAN_LABELS: Record<string, string> = { free: "Free", pro: "Pro", enterprise: "Enterprise" };

const planLabel = (p: string) => PLAN_LABELS[p] ?? p;

const PLANS: {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  extras: string;
}[] = [
  { id: "free", name: "Free", price: "0€", period: "pour toujours", extras: "Support communauté" },
  { id: "pro", name: "Pro", price: "29€", period: "/mois", popular: true, extras: "Support prioritaire, webhooks" },
  { id: "enterprise", name: "Enterprise", price: "Sur devis", period: "engagement annuel", extras: "SSO, SLA, support dédié" },
];

function fmtLimit(v: number | null): string {
  return v === null ? "∞" : String(v);
}

function limitOf(limits: BillingData["limits"], key: keyof BillingData["limits"]): number | null {
  const v: number | null = limits[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Limites affichées par carte de plan (indépendantes du plan courant). */
const PLAN_LIMITS_DISPLAY: Record<string, BillingData["limits"]> = {
  free: { projects: 3, pages: 3, tables: 5, rows: 100, workflows: 3 },
  pro: { projects: 25, pages: 50, tables: 50, rows: 50000, workflows: 50 },
  enterprise: { projects: null, pages: null, tables: null, rows: null, workflows: null },
};

function planFeatures(limits: BillingData["limits"]): string[] {
  return [
    `${fmtLimit(limitOf(limits, "projects"))} projets`,
    `${fmtLimit(limitOf(limits, "pages"))} pages`,
    `${fmtLimit(limitOf(limits, "tables"))} tables`,
    `${fmtLimit(limitOf(limits, "rows"))} lignes de données`,
    `${fmtLimit(limitOf(limits, "workflows"))} workflows`,
  ];
}

function planBadge(plan: string) {
  if (plan === "pro") {
    return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Plan Pro</Badge>;
  }
  if (plan === "enterprise") {
    return <Badge className="bg-amber-500 text-white hover:bg-amber-500">Plan Enterprise</Badge>;
  }
  return <Badge variant="secondary">Plan Free</Badge>;
}

function UsageRow({ label, value, limit }: { label: string; value: number; limit: number | null }) {
  const pct = limit !== null && limit > 0 ? Math.min(100, Math.round((value / limit) * 100)) : 0;
  const barCls =
    pct >= 95 ? "[&>div]:bg-rose-500" : pct >= 80 ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-600";
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600">{label}</span>
        <span className="tabular-nums text-zinc-500">
          {value} / {limit === null ? "∞" : limit}
        </span>
      </div>
      {limit === null ? (
        <p className="mt-1 text-xs text-emerald-700">Ressource illimitée</p>
      ) : (
        <Progress value={pct} aria-label={`Utilisation ${label}`} className={cn("mt-1.5 h-2", barCls)} />
      )}
    </div>
  );
}

function auditIcon(action: string): LucideIcon {
  if (action.startsWith("billing")) return CreditCard;
  if (action.startsWith("workflow")) return WorkflowIcon;
  if (action.startsWith("page")) return LayoutDashboard;
  if (action.startsWith("table") || action.startsWith("row")) return Database;
  return Activity;
}

export default function BillingView({ onPlanChange }: { onPlanChange: (plan: string) => void }) {
  const { toast } = useToast();

  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await apiFetch<BillingData>("/api/billing");
      setData(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmCheckout = async () => {
    if (!checkoutPlan) return;
    setProcessing(true);
    try {
      await apiFetch<{ subscription: BillingData["subscription"] }>("/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ plan: checkoutPlan }),
      });
      toast({
        title: "Abonnement mis à jour",
        description: `Vous êtes maintenant sur le plan ${planLabel(checkoutPlan)}.`,
      });
      const chosen = checkoutPlan;
      setCheckoutPlan(null);
      await load();
      onPlanChange(chosen);
    } catch (e) {
      toast({
        title: "Le changement de plan a échoué",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading && !data) {
    return (
      <div>
        <SectionHeader
          title="Billing"
          description="Plan d'abonnement, consommation des quotas et journal d'audit de l'organisation."
        />
        <Skeleton className="h-44 w-full rounded-xl" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div>
        <SectionHeader
          title="Billing"
          description="Plan d'abonnement, consommation des quotas et journal d'audit de l'organisation."
        />
        <ErrorState message={error} onRetry={() => void load()} />
      </div>
    );
  }

  if (!data) return null;

  const currentPlan = data.subscription.plan;
  const periodEnd = data.subscription.currentPeriodEnd
    ? new Date(data.subscription.currentPeriodEnd)
    : null;

  return (
    <div>
      <SectionHeader
        title="Billing"
        description="Plan d'abonnement, consommation des quotas et journal d'audit de l'organisation."
      />

      {/* ─── Plan actuel + utilisation ───────────────────────────────────── */}
      <Card className="gap-0 py-0">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            {planBadge(currentPlan)}
            <Badge variant="outline">
              {data.subscription.status === "active" ? "Actif" : data.subscription.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {periodEnd && !Number.isNaN(periodEnd.getTime())
                ? `Renouvellement le ${format(periodEnd, "d MMMM yyyy", { locale: fr })}`
                : "Sans engagement"}
            </span>
          </div>
          <Separator className="my-5" />
          <p className="mb-3 text-sm font-medium">Utilisation</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UsageRow label="Pages" value={Number(data.usage?.pages ?? 0)} limit={limitOf(data.limits, "pages")} />
            <UsageRow label="Tables" value={Number(data.usage?.tables ?? 0)} limit={limitOf(data.limits, "tables")} />
            <UsageRow label="Lignes" value={Number(data.usage?.rows ?? 0)} limit={limitOf(data.limits, "rows")} />
            <UsageRow label="Workflows" value={Number(data.usage?.workflows ?? 0)} limit={limitOf(data.limits, "workflows")} />
          </div>
        </CardContent>
      </Card>

      {/* ─── Grille des plans ────────────────────────────────────────────── */}
      <h3 className="mb-3 mt-8 text-base font-semibold">Changer de plan</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = currentPlan === p.id;
          return (
            <Card key={p.id} className={cn("gap-0 py-0", p.popular && "border-amber-300 shadow-sm")}>
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    {p.name}
                  </h4>
                  {p.popular && (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-500">Populaire</Badge>
                  )}
                </div>
                <div>
                  <span className="text-3xl font-bold tracking-tight">{p.price}</span>
                  {p.period && (
                    <span className="ml-1 text-xs text-muted-foreground">{p.period}</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm">
                  {planFeatures(PLAN_LIMITS_DISPLAY[p.id] ?? data.limits).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                  <li className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    {p.extras}
                  </li>
                </ul>
                <div className="mt-auto pt-2">
                  {isCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Plan actuel
                    </Button>
                  ) : (
                    <Button
                      variant={p.popular ? "default" : "outline"}
                      className={cn("w-full", p.popular && "bg-emerald-600 text-white hover:bg-emerald-700")}
                      onClick={() => setCheckoutPlan(p.id)}
                    >
                      Passer au plan {p.name}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ─── Journal d'audit ─────────────────────────────────────────────── */}
      <Card className="mt-8 gap-0 py-0">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-sm">Journal d&apos;audit</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {data.audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune activité enregistrée.</p>
          ) : (
            <ul className={cn("max-h-72 space-y-1 overflow-y-auto pr-1", SCROLLBAR_Y)}>
              {data.audit.map((a) => {
                const Icon = auditIcon(a.action);
                return (
                  <li
                    key={a.id}
                    className="flex items-start gap-2.5 rounded-md px-1 py-1.5 hover:bg-zinc-50"
                  >
                    <span
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-500"
                      aria-hidden="true"
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-zinc-700">{a.action}</p>
                      {a.meta && <p className="truncate text-xs text-muted-foreground">{a.meta}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgoFr(a.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* ─── Dialog : checkout simulé ─────────────────────────────────── */}
      <Dialog
        open={Boolean(checkoutPlan)}
        onOpenChange={(open) => {
          if (!open) setCheckoutPlan(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Simuler le checkout Stripe</DialogTitle>
            <DialogDescription>Récapitulatif de votre changement d&apos;abonnement.</DialogDescription>
          </DialogHeader>
          {checkoutPlan && (
            <div className="space-y-2 rounded-lg border bg-zinc-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{planLabel(checkoutPlan)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tarif</span>
                <span className="font-medium">
                  {PLANS.find((p) => p.id === checkoutPlan)?.price ?? "—"}
                  {checkoutPlan === "pro" ? " / mois" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organisation</span>
                <span className="font-medium">Atelier Démo</span>
              </div>
              <p className="pt-1 text-xs text-muted-foreground">
                Paiement simulé — aucun encaissement réel.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutPlan(null)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void confirmCheckout()}
              disabled={processing}
            >
              {processing ? "Traitement…" : "Confirmer l'abonnement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
