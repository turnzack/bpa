/**
 * PRD — OmniBuild Platform : document produit complet, structuré pour le module
 * « PRD » de Forge Studio. Source de vérité du contenu (Task 7-a).
 * Le rendu est assuré par src/components/studio/prd-view.tsx ; l'export
 * Markdown par prdToMarkdown().
 */

// ─── Types de blocs ─────────────────────────────────────────────────────────

export type PrdImpact = "Critical" | "High" | "Medium" | "Low";

export type PrdBlock =
  | { type: "paragraph"; text: string }
  | { type: "callout"; tone: "info" | "success" | "warn"; title?: string; text: string }
  | { type: "kpi-grid"; items: { value: string; label: string; hint?: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | {
      type: "risk-table";
      rows: { risk: string; impact: PrdImpact; probability: string; mitigation: string }[];
    }
  | { type: "checklist"; items: { text: string; ok: boolean }[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "persona-grid";
      personas: { name: string; role: string; rows: { label: string; text: string }[] }[];
    }
  | {
      type: "feature-grid";
      features: { code: string; title: string; source: string; items: string[] }[];
    };

export interface PrdSection {
  id: string;
  number: string;
  title: string;
  blocks: PrdBlock[];
}

export interface PrdDoc {
  product: string;
  tagline: string;
  version: string;
  date: string;
  status: string;
  team: string;
  updated: string;
  sections: PrdSection[];
}

// ─── Contenu ────────────────────────────────────────────────────────────────

export const PRD_DATA: PrdDoc = {
  product: "OmniBuild Platform",
  tagline: "Plateforme SaaS unifiée (No-Code + Low-Code + Automation)",
  version: "1.0 (Draft)",
  date: "09/09/2026",
  status: "Discovery",
  team: "PM : [Votre nom] · Design : à définir · Eng Lead : à définir",
  updated: "09/09/2026",
  sections: [
    {
      id: "description",
      number: "1",
      title: "Description",
      blocks: [
        {
          type: "callout",
          tone: "info",
          title: "En une phrase",
          text: "OmniBuild est une plateforme SaaS tout-en-un qui combine les fonctionnalités de Bubble (builder visuel + DB), WeWeb (design pixel-perfect), Supabase (backend PostgreSQL), Clerk (auth multi-tenant), Stripe (paiements), n8n (workflows d'automatisation) et Retool (dashboards internes) dans un seul outil open-source et auto-hébergeable.",
        },
      ],
    },
    {
      id: "probleme",
      number: "2",
      title: "Problème & Opportunité",
      blocks: [
        {
          type: "paragraph",
          text: "Problème : les développeurs et entrepreneurs doivent utiliser 5-10 outils différents (Bubble + Supabase + Clerk + Stripe + n8n + Retool) pour construire un SaaS complet, ce qui crée de la fragmentation, des coûts élevés (200-500 €/mois) et de la complexité d'intégration.",
        },
        {
          type: "paragraph",
          text: "Opportunité : centraliser toutes ces fonctionnalités dans une seule plateforme unifiée, open-source, avec un modèle de pricing transparent (Free → Pro → Enterprise) et la possibilité d'auto-hébergement pour les entreprises.",
        },
      ],
    },
    {
      id: "objectifs",
      number: "3",
      title: "Objectifs & Succès Metrics",
      blocks: [
        { type: "paragraph", text: "Objectifs (3 mois post-launch)" },
        {
          type: "kpi-grid",
          items: [
            { value: "1 000", label: "Utilisateurs inscrits", hint: "500 Free · 400 Pro · 100 Enterprise" },
            { value: "5 890 €", label: "MRR cible", hint: "100 Pro à 29 € + 10 Enterprise à 299 €" },
            { value: "95 %", label: "Uptime", hint: "SLA Pro/Enterprise" },
            { value: "> 50", label: "NPS", hint: "Satisfaction utilisateurs" },
          ],
        },
        { type: "paragraph", text: "KPIs de succès" },
        {
          type: "table",
          headers: ["KPI", "Cible"],
          rows: [
            ["Activation", "% utilisateurs créant leur 1er projet dans les 24 h (> 60 %)"],
            ["Rétention", "% utilisateurs actifs à J7 (> 40 %), J30 (> 25 %)"],
            ["Conversion", "Free → Pro (> 8 %), Pro → Enterprise (> 2 %)"],
            ["Performance", "p95 API response time < 500 ms, score Lighthouse > 90"],
          ],
        },
      ],
    },
    {
      id: "personas",
      number: "4",
      title: "Personas & Cas d'Usage",
      blocks: [
        {
          type: "persona-grid",
          personas: [
            {
              name: "Thomas",
              role: "Développeur indépendant (25-35 ans)",
              rows: [
                { label: "Profil", text: "Créateur de SaaS, freelance, cherche à aller vite sans sacrifier la qualité." },
                { label: "Frustrations", text: "Perdre du temps à intégrer 10 outils, coûts élevés, vendor lock-in." },
                { label: "Objectifs", text: "Prototyper en jours, scaler en semaines, garder le contrôle." },
                { label: "Usage OmniBuild", text: "Builder visuel + workflows + DB + auth → lance son SaaS en 2 semaines." },
              ],
            },
            {
              name: "Sarah",
              role: "CTO startup B2B (30-45 ans)",
              rows: [
                { label: "Profil", text: "Startup 10-50 employés, besoin d'outils internes et portails clients." },
                { label: "Frustrations", text: "Outils trop simples (Bubble) ou trop complexes (OutSystems), pas de milieu de gamme." },
                { label: "Objectifs", text: "Outils internes puissants, conformité RGPD/SOC 2, coûts maîtrisés." },
                { label: "Usage OmniBuild", text: "Dashboards Retool-like + workflows automatisés + auth SSO." },
              ],
            },
            {
              name: "Entreprise Industrielle",
              role: "DSI (500+ employés)",
              rows: [
                { label: "Profil", text: "Industrie 4.0, besoins de workflows complexes, conformité stricte." },
                { label: "Frustrations", text: "Solutions enterprise trop lourdes (Mendix, OutSystems à 50 k€/an)." },
                { label: "Objectifs", text: "Auto-hébergement, contrôle total, intégrations legacy." },
                { label: "Usage OmniBuild", text: "Déploiement on-premise, workflows BPM-like, audit logs." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "fonctionnalites",
      number: "5",
      title: "Fonctionnalités Principales",
      blocks: [
        {
          type: "feature-grid",
          features: [
            {
              code: "5.1",
              title: "UI Builder",
              source: "Bubble / WeWeb",
              items: [
                "Canvas drag-and-drop (grille 12 colonnes, responsive)",
                "Bibliothèque de composants (30+ : Text, Input, Button, Table, Chart, Form…)",
                "Propriétés configurables (style, data binding, événements)",
                "Export layout JSON (schéma de page)",
                "Prévisualisation temps réel (desktop, mobile, tablette)",
              ],
            },
            {
              code: "5.2",
              title: "Database Builder",
              source: "Bubble DB / Airtable",
              items: [
                "Création visuelle de tables (nom, champs, types)",
                "Types : string, number, boolean, datetime, relation, json, array",
                "Contraintes : required, unique, default, min/max",
                "Migrations auto-générées (Prisma/Drizzle)",
                "CRUD API auto (REST + GraphQL optionnel)",
                "Row Level Security (RLS) pour les permissions",
              ],
            },
            {
              code: "5.3",
              title: "Workflow Automation",
              source: "n8n / Zapier",
              items: [
                "Éditeur de workflows (nodes + edges, React Flow)",
                "Nodes : Webhook, Timer, HTTP Request, Condition, Code JS, Loop, Merge",
                "50+ connecteurs natifs (Stripe, Resend, Slack, Notion, Google Sheets…)",
                "Exécution asynchrone (queue BullMQ + workers)",
                "Logs d'exécution, retries, error handling",
                "Import OpenAPI (génération auto de nodes)",
              ],
            },
            {
              code: "5.4",
              title: "Dashboard Builder",
              source: "Retool / ToolJet",
              items: [
                "Widgets drag-and-drop (Chart, Table, Metric, List, Form)",
                "Connexion aux DBs (PostgreSQL, MySQL, MongoDB, APIs REST/GraphQL)",
                "Temps réel (WebSockets ou polling)",
                "Filtres, tri, pagination",
                "Export CSV/PDF",
              ],
            },
            {
              code: "5.5",
              title: "Auth & Multi-Tenancy",
              source: "Clerk",
              items: [
                "Email/password, OAuth (Google, GitHub, Microsoft), magic links, passkeys",
                "Organisations multi-tenant (illimitées en Pro/Enterprise)",
                "Rôles : admin, member, viewer (personnalisables)",
                "SSO (SAML, OIDC) en Enterprise",
                "Audit logs (qui a fait quoi, quand, depuis où)",
              ],
            },
            {
              code: "5.6",
              title: "Payments & Billing",
              source: "Stripe",
              items: [
                "Plans : Free (0 €), Pro (29 €/mois), Enterprise (299 €/mois+)",
                "Checkout Stripe (one-time + subscriptions)",
                "Portail client (gestion abonnement, factures)",
                "Webhooks : checkout.session.completed, invoice.paid, customer.subscription.*",
                "Métriques : MRR, churn, LTV (dashboard admin)",
              ],
            },
            {
              code: "5.7",
              title: "Code & Extensions",
              source: "WeWeb / n8n",
              items: [
                "Éditeur de code (Monaco Editor, type VS Code)",
                "Sandbox sécurisée (vm2 / isolated-vm)",
                "Plugins marketplace (interne)",
                "API personnalisées (endpoints custom)",
                "Webhooks entrants/sortants",
              ],
            },
            {
              code: "5.8",
              title: "Sécurité & Conformité",
              source: "—",
              items: [
                "HTTPS (Let's Encrypt), HSTS",
                "Rate limiting (API, auth)",
                "Chiffrement : TLS 1.3, AES-256 (DB)",
                "Backups auto (quotidiens, rétention 7-30 j)",
                "RGPD : export/suppression données, DPA",
                "SOC 2 Type II (objectif : 12 mois post-launch)",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "perimetre",
      number: "6",
      title: "Périmètre (Scope)",
      blocks: [
        {
          type: "checklist",
          items: [
            { text: "UI Builder (canvas, composants, propriétés) — v1.0, 6 mois", ok: true },
            { text: "Database Builder (tables, migrations, CRUD) — v1.0, 6 mois", ok: true },
            { text: "Workflow Automation (20 nodes de base, 10 connecteurs) — v1.0, 6 mois", ok: true },
            { text: "Dashboard Builder (10 widgets, 5 DB connectors) — v1.0, 6 mois", ok: true },
            { text: "Auth multi-tenant (Clerk-like, organisations, rôles) — v1.0, 6 mois", ok: true },
            { text: "Payments (Stripe, 3 plans, webhooks) — v1.0, 6 mois", ok: true },
            { text: "Email (Resend, templates, DNS) — v1.0, 6 mois", ok: true },
            { text: "Déploiement (Vercel + Railway, Docker) — v1.0, 6 mois", ok: true },
            { text: "Mobile apps natives (iOS/Android) — v2.0 (12+ mois), web responsive uniquement", ok: false },
            { text: "Marketplace publique de plugins — v2.0, interne d'abord", ok: false },
            { text: "AI code generation — v2.0 (intégration future OpenAI API)", ok: false },
            { text: "On-premise deployment — v2.0 Enterprise", ok: false },
            { text: "White-labeling — v2.0 Enterprise", ok: false },
          ],
        },
      ],
    },
    {
      id: "technique",
      number: "7",
      title: "Spécifications Techniques",
      blocks: [
        { type: "paragraph", text: "Stack technique" },
        {
          type: "table",
          headers: ["Couche", "Technologie"],
          rows: [
            ["Frontend", "Next.js 16.3+ (React 19, TypeScript, Server Components)"],
            ["Backend", "NestJS (Node.js 20, TypeScript, DI)"],
            ["Database", "PostgreSQL 17 (Supabase self-hosted ou Neon)"],
            ["Auth", "Clerk (multi-tenant natif) ou Supabase Auth + RLS"],
            ["Queue", "BullMQ + Redis (workflows async)"],
            ["Storage", "S3-compatible (AWS S3, Cloudflare R2)"],
            ["Email", "Resend (transactionnel)"],
            ["Payments", "Stripe (abonnements)"],
            ["Hébergement", "Vercel (front) + Railway/Render (back) ou Docker sur VPS"],
            ["Monitoring", "Sentry (erreurs), LogRocket (sessions), Prometheus/Grafana (infra)"],
          ],
        },
        { type: "paragraph", text: "Architecture multi-tenant" },
        {
          type: "list",
          items: [
            "Modèle : database shared, schema per tenant (isolation logique)",
            "Tenant ID : colonne tenant_id sur toutes les tables, indexée",
            "RLS : Row Level Security policies (PostgreSQL 15+)",
            "Quotas : par plan (ex. Free = 3 projets, 1 000 workflows/mois)",
          ],
        },
        { type: "paragraph", text: "Performance targets" },
        {
          type: "kpi-grid",
          items: [
            { value: "> 90", label: "Lighthouse", hint: "Performance · Accessibility · SEO" },
            { value: "< 500 ms", label: "p95 API", hint: "p99 < 1 s" },
            { value: "< 100 ms", label: "Queries DB", hint: "95 % indexées" },
            { value: "< 5 s", label: "Workflows", hint: "95 % · uptime 99,9 % (SLA Pro)" },
          ],
        },
      ],
    },
    {
      id: "risques",
      number: "8",
      title: "Contraintes & Risques",
      blocks: [
        { type: "paragraph", text: "Contraintes" },
        {
          type: "list",
          items: [
            "Budget : 0-500 €/mois (infra + outils) pour les 6 premiers mois",
            "Temps : 6 mois (12 sprints de 2 semaines) pour la v1.0",
            "Équipe : 1-2 développeurs full-stack (+ éventuellement 1 freelance)",
            "Conformité : RGPD obligatoire, SOC 2 optionnel (v2)",
          ],
        },
        { type: "paragraph", text: "Risques & atténuation" },
        {
          type: "risk-table",
          rows: [
            { risk: "Complexité technique sous-estimée", impact: "High", probability: "Medium", mitigation: "MVP réduit (5 fonctionnalités core d'abord)" },
            { risk: "Performance workflows (queue)", impact: "High", probability: "Medium", mitigation: "BullMQ + Redis, load testing dès le Sprint 5" },
            { risk: "Sécurité multi-tenant (fuite de données)", impact: "Critical", probability: "Low", mitigation: "RLS PostgreSQL, audits code, pentest v1" },
            { risk: "Coûts infra > budget", impact: "Medium", probability: "Medium", mitigation: "Vercel Free + Railway Free, optimiser DB" },
            { risk: "Adoption lente (marketing)", impact: "High", probability: "Medium", mitigation: "Beta privée (50 users), contenu (blog, Twitter)" },
          ],
        },
      ],
    },
    {
      id: "roadmap",
      number: "9",
      title: "Roadmap & Milestones",
      blocks: [
        {
          type: "table",
          headers: ["Phase", "Sprints", "Semaines", "Livrables"],
          rows: [
            ["Phase 1", "Sprint 1-2", "S1-4", "PRD, architecture, auth, DB setup"],
            ["Phase 2", "Sprint 3-5", "S5-10", "UI Builder, DB Builder, Workflows"],
            ["Phase 3", "Sprint 6-8", "S11-16", "Dashboards, Payments, Email"],
            ["Phase 4", "Sprint 9-10", "S17-20", "Sécurité, monitoring, backups"],
            ["Phase 5", "Sprint 11-12", "S21-24", "Performance, docs, beta, launch"],
          ],
        },
        {
          type: "callout",
          tone: "success",
          title: "Jalons clés",
          text: "Beta privée : semaine 20 (50-100 utilisateurs) · Launch public : semaine 24 (landing page, blog, réseaux sociaux).",
        },
      ],
    },
    {
      id: "annexes",
      number: "10",
      title: "Annexes",
      blocks: [
        { type: "paragraph", text: "Annexe A — User Stories (exemples)" },
        {
          type: "list",
          ordered: true,
          items: [
            "US-1 : en tant qu'utilisateur, je veux créer un compte avec email/password pour accéder à la plateforme.",
            "US-2 : en tant qu'admin d'organisation, je veux inviter des membres par email pour collaborer sur un projet.",
            "US-3 : en tant que développeur, je veux créer une table via l'UI pour stocker des données sans écrire de SQL.",
            "US-4 : en tant qu'utilisateur, je veux créer un workflow avec un webhook pour automatiser une tâche.",
            "US-5 : en tant qu'admin, je veux voir les logs d'audit pour tracker les actions des utilisateurs.",
          ],
        },
        { type: "paragraph", text: "Annexe B — Wireframes (liens Figma)" },
        {
          type: "checklist",
          items: [
            { text: "Landing page — à créer", ok: false },
            { text: "Dashboard principal — à créer", ok: false },
            { text: "UI Builder — à créer", ok: false },
            { text: "Workflow Editor — à créer", ok: false },
          ],
        },
        { type: "paragraph", text: "Annexe C — Glossaire" },
        {
          type: "table",
          headers: ["Terme", "Définition"],
          rows: [
            ["Tenant", "Organisation/client dans la plateforme (multi-tenant)"],
            ["Workflow", "Séquence de nodes (triggers, actions, conditions) exécutée de manière asynchrone"],
            ["Node", "Unité de base d'un workflow (ex. Webhook, HTTP Request, Condition)"],
            ["RLS", "Row Level Security (PostgreSQL), politiques d'accès par ligne"],
            ["MAU", "Monthly Active Users (métrique de facturation Clerk/Stripe)"],
          ],
        },
      ],
    },
    {
      id: "acceptation",
      number: "11",
      title: "Critères d'Acceptation (v1.0)",
      blocks: [
        {
          type: "checklist",
          items: [
            { text: "Un utilisateur peut s'inscrire, créer une organisation et inviter 2 membres", ok: true },
            { text: "Un utilisateur peut créer une page avec 5 composants (Text, Button, Input, Table, Chart)", ok: true },
            { text: "Un utilisateur peut créer une table avec 5 champs et faire du CRUD via API", ok: true },
            { text: "Un utilisateur peut créer un workflow avec 3 nodes (Webhook → Condition → HTTP Request)", ok: true },
            { text: "Un utilisateur peut payer un abonnement Pro via Stripe et accéder aux fonctionnalités Pro", ok: true },
            { text: "Un admin peut voir les logs d'audit et exporter les données (RGPD)", ok: true },
            { text: "La plateforme atteint 99,9 % d'uptime sur 1 mois (SLA Pro)", ok: true },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Statut du document",
          text: "Version 1.0 (Draft) — statut Discovery. Dernière mise à jour : 09/09/2026. À valider avant le lancement du Sprint 1.",
        },
      ],
    },
  ],
};

// ─── Export Markdown ────────────────────────────────────────────────────────

function blockToMarkdown(block: PrdBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "callout":
      return `> **${block.title ?? "Note"}** — ${block.text}`;
    case "kpi-grid":
      return block.items.map((i) => `- **${i.value}** ${i.label}${i.hint ? ` (${i.hint})` : ""}`).join("\n");
    case "table": {
      const header = `| ${block.headers.join(" | ")} |`;
      const divider = `| ${block.headers.map(() => "---").join(" | ")} |`;
      const rows = block.rows.map((r) => `| ${r.join(" | ")} |`);
      return [header, divider, ...rows].join("\n");
    }
    case "risk-table":
      return [
        "| Risque | Impact | Probabilité | Atténuation |",
        "| --- | --- | --- | --- |",
        ...block.rows.map((r) => `| ${r.risk} | ${r.impact} | ${r.probability} | ${r.mitigation} |`),
      ].join("\n");
    case "checklist":
      return block.items.map((i) => `- [${i.ok ? "x" : " "}] ${i.text}`).join("\n");
    case "list":
      return block.items.map((i, idx) => (block.ordered ? `${idx + 1}. ${i}` : `- ${i}`)).join("\n");
    case "persona-grid":
      return block.personas
        .map(
          (p) =>
            `### ${p.name} — ${p.role}\n${p.rows.map((r) => `- **${r.label}** : ${r.text}`).join("\n")}`
        )
        .join("\n\n");
    case "feature-grid":
      return block.features
        .map(
          (f) =>
            `### ${f.code} ${f.title} (inspiré ${f.source})\n${f.items.map((i) => `- ${i}`).join("\n")}`
        )
        .join("\n\n");
  }
}

/** Génère le PRD complet au format Markdown (pour le bouton de téléchargement). */
export function prdToMarkdown(doc: PrdDoc = PRD_DATA): string {
  const head = [
    `# PRD — ${doc.product}`,
    "",
    `**${doc.tagline}**`,
    "",
    `- Version : ${doc.version}`,
    `- Date : ${doc.date}`,
    `- Statut : ${doc.status}`,
    `- Équipe : ${doc.team}`,
    `- Dernière mise à jour : ${doc.updated}`,
    "",
  ];
  const body = doc.sections.map((s) => {
    const title = `## ${s.number}. ${s.title}`;
    const blocks = s.blocks.map(blockToMarkdown).join("\n\n");
    return `${title}\n\n${blocks}`;
  });
  return [...head, ...body].join("\n\n") + "\n";
}
