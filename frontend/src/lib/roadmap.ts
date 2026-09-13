/**
 * Métadonnées statiques de la roadmap Forge Studio.
 * Source de vérité des phases / sprints (titres, objectifs, semaines, livrables).
 * Les tâches (SprintTask) viennent de la base et sont rattachées par sprintNumber.
 */

export interface SprintMeta {
  sprint: number
  title: string
  weeks: string
  objective: string
  deliverables: string[]
}

export interface PhaseMeta {
  phase: number
  title: string
  objective: string
  sprints: SprintMeta[]
}

export const ROADMAP_PHASES: PhaseMeta[] = [
  {
    phase: 1,
    title: 'Architecture & Fondations',
    objective: 'PRD, stack technique, repo, CI/CD, auth multi-tenant',
    sprints: [
      {
        sprint: 1,
        title: 'PRD & Architecture',
        weeks: 'S1-S2',
        objective: 'Définir le périmètre fonctionnel, la stack et valider l’architecture multi-tenant',
        deliverables: ['PRD complet', 'Schéma d’architecture', 'Contrat JSON (API)', 'Repo Git + CI/CD'],
      },
      {
        sprint: 2,
        title: 'Infrastructure & Auth',
        weeks: 'S3-S4',
        objective: 'Déployer l’infra de base, l’auth multi-tenant et la DB',
        deliverables: ['Env dev/staging/prod', 'Auth email + OAuth', 'Schéma DB initial', 'Emails transactionnels'],
      },
    ],
  },
  {
    phase: 2,
    title: 'Core Platform',
    objective: 'Auth, DB, builder visuel, workflows de base',
    sprints: [
      {
        sprint: 3,
        title: 'Builder Visuel',
        weeks: 'S5-S6',
        objective: 'Éditeur visuel type Bubble/WeWeb avec canvas drag-and-drop',
        deliverables: ['Canvas interactif', 'Bibliothèque de composants', 'Export layout JSON', 'Sauvegarde auto'],
      },
      {
        sprint: 4,
        title: 'Base de Données Visuelle',
        weeks: 'S7-S8',
        objective: 'Créer tables/champs via UI, migrations auto, CRUD API',
        deliverables: ['UI de modélisation', 'Migrations auto-générées', 'API CRUD auto'],
      },
      {
        sprint: 5,
        title: 'Workflows Visuels',
        weeks: 'S9-S10',
        objective: 'Éditeur de workflows type n8n/Zapier avec moteur d’exécution',
        deliverables: ['Canvas nodes + edges', 'Nodes de base', 'Moteur d’exécution', 'Logs + retries'],
      },
    ],
  },
  {
    phase: 3,
    title: 'Workflows & Automatisation',
    objective: 'Intégrations, éditeur de code, dashboards',
    sprints: [
      {
        sprint: 6,
        title: 'Intégrations & APIs',
        weeks: 'S11-S12',
        objective: 'Connecteurs pré-construits et documentation API',
        deliverables: ['10+ connecteurs natifs', 'Import OpenAPI', 'Docs Swagger'],
      },
      {
        sprint: 7,
        title: 'Éditeur de Code & Extensions',
        weeks: 'S13-S14',
        objective: 'Code personnalisé dans les workflows + système de plugins',
        deliverables: ['Éditeur Monaco', 'Sandbox sécurisée', 'Marketplace plugins'],
      },
      {
        sprint: 8,
        title: 'Dashboard & Analytics',
        weeks: 'S15-S16',
        objective: 'Dashboards type Retool avec widgets temps réel',
        deliverables: ['Dashboard builder', 'Widgets Chart/Table/Metric', 'Real-time'],
      },
    ],
  },
  {
    phase: 4,
    title: 'Paiements & Production',
    objective: 'Stripe, monitoring, sécurité, backups',
    sprints: [
      {
        sprint: 9,
        title: 'Stripe & Billing',
        weeks: 'S17-S18',
        objective: 'Abonnements Free/Pro/Enterprise + webhooks',
        deliverables: ['Checkout fonctionnel', 'Portail client', 'Webhooks sécurisés'],
      },
      {
        sprint: 10,
        title: 'Sécurité & Monitoring',
        weeks: 'S19-S20',
        objective: 'HTTPS, rate limiting, audit logs, backups',
        deliverables: ['HTTPS + HSTS', 'Logs centralisés', 'Backups quotidiens'],
      },
    ],
  },
  {
    phase: 5,
    title: 'Scale & Lancement',
    objective: 'Performance, docs, beta, launch',
    sprints: [
      {
        sprint: 11,
        title: 'Performance & Optimisation',
        weeks: 'S21-S22',
        objective: 'Caching, load testing, scalabilité',
        deliverables: ['Lighthouse > 90', 'Cache Redis', 'Load test 1000 users'],
      },
      {
        sprint: 12,
        title: 'Docs, Beta & Launch',
        weeks: 'S23-S24',
        objective: 'Documentation, beta privée, lancement public',
        deliverables: ['Docs users + devs', 'Beta 50-100 users', 'Landing page'],
      },
    ],
  },
]
