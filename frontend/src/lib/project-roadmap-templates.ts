/**
 * Feuilles de route par type de projet Forge Studio.
 *
 * Quand un projet est créé (« Lanceur de projets »), sa feuille de route est
 * générée depuis ce catalogue : chaque type de projet dispose d'un plan en
 * phases → sprints → tâches + livrables, cohérent avec la vue « Feuille de
 * route » du studio (filtres Tout / À faire / Terminées, cases à cocher
 * persistées en base via SprintTask.projectId).
 *
 * - Côté backend : POST /api/projects et GET /api/projects/[projectId]/roadmap
 *   lisent ce catalogue pour instancier / décrire la roadmap du projet.
 * - Côté frontend : le wizard de création affiche les statistiques du plan
 *   (phases, sprints, tâches, livrables) via getProjectRoadmapStats().
 *
 * Les métadonnées (titres, objectifs, semaines) restent ici : seuls l'état
 * `done`, l'id et l'ordre sont persistés en base.
 */

import type { ProjectType } from '@/lib/project-templates'

export interface RoadmapTemplateTask {
  title: string
  category: string
}

export interface RoadmapTemplateSprint {
  title: string
  /** Libellé de période affiché (« Sem. 1-2 »). */
  weeks: string
  objective: string
  tasks: RoadmapTemplateTask[]
  deliverables: string[]
}

export interface RoadmapTemplatePhase {
  title: string
  objective: string
  sprints: RoadmapTemplateSprint[]
}

/** Plan complet d'un type de projet (liste ordonnée de phases). */
export type ProjectRoadmapTemplate = RoadmapTemplatePhase[]

// ─── Catalogue ──────────────────────────────────────────────────────────────

const SAAS_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Fondations',
    objective: 'Cadrer le produit, préparer l’architecture et l’authentification',
    sprints: [
      {
        title: 'Cadrage & Architecture',
        weeks: 'Sem. 1-2',
        objective: 'Définir le périmètre, la stack et les maquettes clés',
        tasks: [
          { title: 'Rédiger le PRD et les user stories', category: 'Docs' },
          { title: 'Choisir la stack technique et valider l’architecture', category: 'Archio' },
          { title: 'Concevoir les maquettes des écrans clés', category: 'Design' },
        ],
        deliverables: ['PRD validé', 'Maquettes validées'],
      },
      {
        title: 'Setup & Authentification',
        weeks: 'Sem. 3-4',
        objective: 'Repo, CI/CD, base de données et auth multi-rôles',
        tasks: [
          { title: 'Créer le repo Git + CI/CD', category: 'Infra' },
          { title: 'Configurer la base de données initiale', category: 'Data' },
          { title: 'Implémenter l’authentification (e-mail + OAuth)', category: 'Auth' },
          { title: 'Gérer les rôles et les permissions', category: 'Auth' },
        ],
        deliverables: ['Environnements dev / staging / prod', 'Authentification fonctionnelle'],
      },
    ],
  },
  {
    title: 'Cœur produit',
    objective: 'Construire les fonctionnalités qui font la valeur du SaaS',
    sprints: [
      {
        title: 'Dashboard & Feature cœur',
        weeks: 'Sem. 5-6',
        objective: 'Développer le tableau de bord et la fonctionnalité principale',
        tasks: [
          { title: 'Développer le dashboard principal', category: 'Frontend' },
          { title: 'Implémenter la fonctionnalité cœur du produit', category: 'Backend' },
          { title: 'Connecter les données du dashboard', category: 'Frontend' },
        ],
        deliverables: ['Dashboard interactif', 'Feature cœur de démonstration'],
      },
      {
        title: 'CRUD & Intégrations',
        weeks: 'Sem. 7-8',
        objective: 'Compléter le CRUD métier et les intégrations tierces',
        tasks: [
          { title: 'CRUD complet des entités métier', category: 'Backend' },
          { title: 'Intégrations tierces (paiement, e-mail…)', category: 'Backend' },
          { title: 'Notifications in-app + e-mails transactionnels', category: 'Frontend' },
        ],
        deliverables: ['API métier documentée', 'Notifications actives'],
      },
      {
        title: 'Onboarding & Polish UI',
        weeks: 'Sem. 9-10',
        objective: 'Parcours d’onboarding guidé et finitions de l’interface',
        tasks: [
          { title: 'Parcours d’onboarding guidé', category: 'Frontend' },
          { title: 'Design system + accessibilité', category: 'Design' },
          { title: 'Tests E2E des parcours clés', category: 'QA' },
        ],
        deliverables: ['Onboarding automatisé', 'Suite de tests E2E'],
      },
    ],
  },
  {
    title: 'Monétisation & fiabilité',
    objective: 'Encaisser, sécuriser et superviser la plateforme',
    sprints: [
      {
        title: 'Facturation',
        weeks: 'Sem. 11-12',
        objective: 'Abonnements, essais gratuits et webhooks de facturation',
        tasks: [
          { title: 'Configurer les produits et les prix', category: 'Billing' },
          { title: 'Intégrer le checkout + webhooks signés', category: 'Billing' },
          { title: 'Portail client de gestion d’abonnement', category: 'Billing' },
        ],
        deliverables: ['Checkout fonctionnel', 'Webhooks sécurisés'],
      },
      {
        title: 'Sécurité & Monitoring',
        weeks: 'Sem. 13-14',
        objective: 'Durcir la plateforme et superviser la production',
        tasks: [
          { title: 'HTTPS forcé + rate limiting', category: 'Sécurité' },
          { title: 'Logs centralisés + suivi des erreurs', category: 'Sécurité' },
          { title: 'Backups quotidiens testés (restore)', category: 'Infra' },
        ],
        deliverables: ['Audit sécurité initial', 'Monitoring opérationnel'],
      },
    ],
  },
  {
    title: 'Lancement',
    objective: 'Beta privée, corrections et lancement public',
    sprints: [
      {
        title: 'Beta & Launch',
        weeks: 'Sem. 15-16',
        objective: 'Faire tester par de vrais utilisateurs puis lancer',
        tasks: [
          { title: 'Beta privée (10-30 utilisateurs) + retours', category: 'Launch' },
          { title: 'Corriger les retours prioritaires', category: 'Dev' },
          { title: 'Landing page + annonce publique', category: 'Launch' },
        ],
        deliverables: ['Landing page en ligne', 'Lancement public'],
      },
    ],
  },
]

const WEBSITE_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Conception',
    objective: 'Définir l’arborescence, les contenus et l’identité visuelle',
    sprints: [
      {
        title: 'Stratégie & Maquettes',
        weeks: 'Sem. 1-2',
        objective: 'Arborescence, contenus et charte graphique',
        tasks: [
          { title: 'Définir l’arborescence et les objectifs du site', category: 'Design' },
          { title: 'Rédiger les contenus des pages clés', category: 'Docs' },
          { title: 'Créer la maquette et la charte graphique', category: 'Design' },
        ],
        deliverables: ['Arborescence validée', 'Maquettes validées'],
      },
    ],
  },
  {
    title: 'Développement',
    objective: 'Intégrer les pages et optimiser le référencement',
    sprints: [
      {
        title: 'Intégration des pages',
        weeks: 'Sem. 3-4',
        objective: 'Développer les pages du site avec le builder',
        tasks: [
          { title: 'Intégrer Accueil, À propos, Contact', category: 'Frontend' },
          { title: 'Formulaire de contact + table Messages', category: 'Backend' },
          { title: 'Responsive mobile / tablette', category: 'Frontend' },
        ],
        deliverables: ['Pages intégrées', 'Formulaire fonctionnel'],
      },
      {
        title: 'SEO & Performance',
        weeks: 'Sem. 5-6',
        objective: 'Référencement technique et optimisation des performances',
        tasks: [
          { title: 'Balises SEO + sitemap + robots.txt', category: 'SEO' },
          { title: 'Optimiser images et Core Web Vitals', category: 'Perf' },
          { title: 'Accessibilité (contrastes, focus, navigation)', category: 'Frontend' },
        ],
        deliverables: ['Audit SEO initial', 'Score Lighthouse > 90'],
      },
    ],
  },
  {
    title: 'Mise en ligne',
    objective: 'Déployer, mesurer et maintenir le site',
    sprints: [
      {
        title: 'Déploiement & Suivi',
        weeks: 'Sem. 7-8',
        objective: 'Mettre le site en ligne et suivre l’audience',
        tasks: [
          { title: 'Domaine + HTTPS + déploiement', category: 'Infra' },
          { title: 'Analytics + Search Console', category: 'SEO' },
          { title: 'Maintenance et mises à jour', category: 'Infra' },
        ],
        deliverables: ['Site en ligne', 'Suivi d’audience actif'],
      },
    ],
  },
]

const GAME_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Concept',
    objective: 'Définir le concept, la boucle de jeu et le document de design',
    sprints: [
      {
        title: 'Game Design',
        weeks: 'Sem. 1-2',
        objective: 'Concept, pitch et boucle de jeu',
        tasks: [
          { title: 'Pitch + concept du jeu', category: 'Design' },
          { title: 'Game Design Document (GDD)', category: 'Docs' },
          { title: 'Prototyper la boucle de jeu sur papier', category: 'Design' },
        ],
        deliverables: ['GDD v1', 'Pitch deck'],
      },
    ],
  },
  {
    title: 'Prototype',
    objective: 'Prouver que le jeu est fun avant de produire le contenu',
    sprints: [
      {
        title: 'Prototype jouable',
        weeks: 'Sem. 3-4',
        objective: 'Mécaniques cœur et grey-boxing',
        tasks: [
          { title: 'Grey-box du niveau de test', category: 'Dev' },
          { title: 'Implémenter les mécaniques cœur', category: 'Dev' },
          { title: 'Tester et itérer la boucle de jeu', category: 'QA' },
        ],
        deliverables: ['Prototype jouable', 'Retours de playtest v1'],
      },
      {
        title: 'Direction artistique',
        weeks: 'Sem. 5-6',
        objective: 'Valider le style visuel et l’ambiance sonore',
        tasks: [
          { title: 'Style visuel + moodboard', category: 'Design' },
          { title: 'Produire les assets de base', category: 'Design' },
          { title: 'Esquisse audio (SFX / musique)', category: 'Audio' },
        ],
        deliverables: ['Direction artistique validée', 'Pack d’assets v1'],
      },
    ],
  },
  {
    title: 'Production',
    objective: 'Produire les niveaux, l’interface et les fonctionnalités en ligne',
    sprints: [
      {
        title: 'Contenu & Niveaux',
        weeks: 'Sem. 7-9',
        objective: 'Niveaux, ennemis et progression du joueur',
        tasks: [
          { title: 'Créer les niveaux (objectif : 10)', category: 'Dev' },
          { title: 'Ennemis + équilibrage v1', category: 'Dev' },
          { title: 'Sauvegarde + système de progression', category: 'Dev' },
        ],
        deliverables: ['10 niveaux jouables', 'Système de progression'],
      },
      {
        title: 'UI / UX & Interface',
        weeks: 'Sem. 10-11',
        objective: 'Menus, HUD et écrans de fin de partie',
        tasks: [
          { title: 'Menu principal + options', category: 'Frontend' },
          { title: 'HUD en jeu', category: 'Frontend' },
          { title: 'Écrans de fin / game over', category: 'Frontend' },
        ],
        deliverables: ['Interface complète'],
      },
      {
        title: 'Classement & Social',
        weeks: 'Sem. 12-13',
        objective: 'Scores en ligne et partage entre joueurs',
        tasks: [
          { title: 'Table Scores + API', category: 'Backend' },
          { title: 'Page classement mondial', category: 'Frontend' },
          { title: 'Workflow « Nouveau record »', category: 'Backend' },
        ],
        deliverables: ['Classement en ligne'],
      },
    ],
  },
  {
    title: 'Polish & Lancement',
    objective: 'Équilibrer, optimiser, tester puis publier le jeu',
    sprints: [
      {
        title: 'Équilibrage & Performance',
        weeks: 'Sem. 14-15',
        objective: 'Ajuster la difficulté et tenir le frame budget',
        tasks: [
          { title: 'Équilibrage de la difficulté', category: 'QA' },
          { title: 'Optimisation (60 FPS)', category: 'Perf' },
          { title: 'Corrections des bugs critiques', category: 'Dev' },
        ],
        deliverables: ['Build release candidate'],
      },
      {
        title: 'Playtests & Lancement',
        weeks: 'Sem. 16',
        objective: 'Tests joueurs fermés puis mise en ligne',
        tasks: [
          { title: 'Playtests fermés + collecte des retours', category: 'Launch' },
          { title: 'Corriger le top 10 des retours', category: 'Dev' },
          { title: 'Publication (web / stores)', category: 'Launch' },
        ],
        deliverables: ['Jeu publié'],
      },
    ],
  },
]

const DASHBOARD_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Données',
    objective: 'Connecter et modéliser les données sources',
    sprints: [
      {
        title: 'Sources & Modélisation',
        weeks: 'Sem. 1-2',
        objective: 'Sources fiables et modèle de données clair',
        tasks: [
          { title: 'Connecter les sources (tables, API)', category: 'Data' },
          { title: 'Modéliser les entités clés', category: 'Data' },
          { title: 'Nettoyer et dédupliquer les données', category: 'Data' },
        ],
        deliverables: ['Modèle de données validé'],
      },
    ],
  },
  {
    title: 'Visualisation',
    objective: 'Construire widgets, filtres et navigation',
    sprints: [
      {
        title: 'Widgets & Vues',
        weeks: 'Sem. 3-4',
        objective: 'Indicateurs et graphiques essentiels',
        tasks: [
          { title: 'Widgets Metric + Chart', category: 'Frontend' },
          { title: 'Widgets Table + List', category: 'Frontend' },
          { title: 'Filtres globaux (période, équipe…)', category: 'Frontend' },
        ],
        deliverables: ['Dashboard v1'],
      },
      {
        title: 'Layout & Navigation',
        weeks: 'Sem. 5-6',
        objective: 'Grille organisée et navigation multi-vues',
        tasks: [
          { title: 'Grid layout + réorganisation', category: 'Frontend' },
          { title: 'Multi-vues (onglets)', category: 'Frontend' },
          { title: 'Responsive (mobile / tablette)', category: 'Frontend' },
        ],
        deliverables: ['Layout final'],
      },
    ],
  },
  {
    title: 'Diffusion',
    objective: 'Temps réel, alertes, rapports et partage',
    sprints: [
      {
        title: 'Alertes & Rapports',
        weeks: 'Sem. 7-8',
        objective: 'Données en temps réel et rapports automatisés',
        tasks: [
          { title: 'Temps réel (WebSocket / SSE)', category: 'Backend' },
          { title: 'Alertes sur seuils', category: 'Backend' },
          { title: 'Rapport quotidien (cron → e-mail)', category: 'Backend' },
        ],
        deliverables: ['Alertes actives', 'Rapport automatique'],
      },
      {
        title: 'Accès & Partage',
        weeks: 'Sem. 9',
        objective: 'Rôles et partage sécurisé du dashboard',
        tasks: [
          { title: 'Rôles (admin / viewer)', category: 'Sécurité' },
          { title: 'Partage du dashboard', category: 'Frontend' },
        ],
        deliverables: ['Dashboard partagé'],
      },
    ],
  },
]

const ECOMMERCE_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Catalogue',
    objective: 'Structurer produits, stocks et pages de vente',
    sprints: [
      {
        title: 'Produits & Stocks',
        weeks: 'Sem. 1-2',
        objective: 'Catalogue structuré avec gestion des stocks',
        tasks: [
          { title: 'Tables Produits + Catégories', category: 'Data' },
          { title: 'Gestion des stocks', category: 'Backend' },
          { title: 'Photos + fiches produits', category: 'Design' },
        ],
        deliverables: ['Catalogue en ligne'],
      },
      {
        title: 'Boutique & Recherche',
        weeks: 'Sem. 3',
        objective: 'Pages de vente et découverte des produits',
        tasks: [
          { title: 'Page boutique + fiches produit', category: 'Frontend' },
          { title: 'Recherche + filtres', category: 'Frontend' },
        ],
        deliverables: ['Boutique navigable'],
      },
    ],
  },
  {
    title: 'Tunnel d’achat',
    objective: 'Panier, paiement et suivi des commandes',
    sprints: [
      {
        title: 'Panier & Paiement',
        weeks: 'Sem. 4-5',
        objective: 'Checkout complet avec confirmation',
        tasks: [
          { title: 'Panier + gestion des quantités', category: 'Frontend' },
          { title: 'Paiement en ligne', category: 'Billing' },
          { title: 'E-mail de confirmation', category: 'Backend' },
        ],
        deliverables: ['Checkout fonctionnel'],
      },
      {
        title: 'Commandes & Expédition',
        weeks: 'Sem. 6',
        objective: 'Suivi des commandes jusqu’à l’expédition',
        tasks: [
          { title: 'Table Commandes + statuts', category: 'Backend' },
          { title: 'Page de suivi client', category: 'Frontend' },
          { title: 'Workflow d’expédition', category: 'Backend' },
        ],
        deliverables: ['Suivi de commandes'],
      },
    ],
  },
  {
    title: 'Expérience client',
    objective: 'Fidéliser et accompagner les clients',
    sprints: [
      {
        title: 'Comptes & Fidélité',
        weeks: 'Sem. 7-8',
        objective: 'Comptes clients, promos et avis',
        tasks: [
          { title: 'Comptes clients + historique', category: 'Backend' },
          { title: 'Codes promo', category: 'Billing' },
          { title: 'Avis produits', category: 'Frontend' },
        ],
        deliverables: ['Programme de fidélité'],
      },
      {
        title: 'Support & Retours',
        weeks: 'Sem. 9',
        objective: 'Service client et politique de retour',
        tasks: [
          { title: 'Formulaire support + table Tickets', category: 'Frontend' },
          { title: 'Politique de retour', category: 'Docs' },
        ],
        deliverables: ['Support opérationnel'],
      },
    ],
  },
  {
    title: 'Lancement',
    objective: 'Attirer les premiers clients',
    sprints: [
      {
        title: 'Marketing & Lancement',
        weeks: 'Sem. 10',
        objective: 'SEO, campagne et mesure de conversion',
        tasks: [
          { title: 'SEO produits + blog', category: 'SEO' },
          { title: 'Campagne de lancement', category: 'Marketing' },
          { title: 'Analytics + taux de conversion', category: 'SEO' },
        ],
        deliverables: ['Boutique lancée'],
      },
    ],
  },
]

const BLOG_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Structure',
    objective: 'Identité visuelle et structure éditoriale',
    sprints: [
      {
        title: 'Design & Structure',
        weeks: 'Sem. 1-2',
        objective: 'Charte, catégories et pages de lecture',
        tasks: [
          { title: 'Charte graphique + typographie', category: 'Design' },
          { title: 'Catégories + structure éditoriale', category: 'Design' },
          { title: 'Pages Articles + Lecture', category: 'Frontend' },
        ],
        deliverables: ['Maquette validée'],
      },
    ],
  },
  {
    title: 'Contenu',
    objective: 'Pipeline éditorial et référencement',
    sprints: [
      {
        title: 'Rédaction & Workflow',
        weeks: 'Sem. 3-4',
        objective: 'Articles fondateurs et publication automatisée',
        tasks: [
          { title: 'Rédiger les 5 premiers articles', category: 'Docs' },
          { title: 'Workflow de publication', category: 'Backend' },
          { title: 'Table Articles + statuts', category: 'Data' },
        ],
        deliverables: ['5 articles prêts'],
      },
      {
        title: 'SEO',
        weeks: 'Sem. 5',
        objective: 'Optimiser la découverte du blog',
        tasks: [
          { title: 'Balises SEO + métadonnées', category: 'SEO' },
          { title: 'Sitemap + Search Console', category: 'SEO' },
          { title: 'Newsletter (inscription)', category: 'Frontend' },
        ],
        deliverables: ['SEO actif'],
      },
    ],
  },
  {
    title: 'Audience',
    objective: 'Publier, mesurer et développer l’audience',
    sprints: [
      {
        title: 'Lancement & Croissance',
        weeks: 'Sem. 6',
        objective: 'Mettre le blog en ligne et notifier les abonnés',
        tasks: [
          { title: 'Analytics', category: 'SEO' },
          { title: 'Workflow de notification aux abonnés', category: 'Backend' },
          { title: 'Promotion réseaux sociaux', category: 'Marketing' },
        ],
        deliverables: ['Blog lancé'],
      },
    ],
  },
]

const API_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Conception',
    objective: 'Contrat d’API et modèle de données',
    sprints: [
      {
        title: 'Spec & Modèle',
        weeks: 'Sem. 1-2',
        objective: 'Spécification ouverte et conventions stables',
        tasks: [
          { title: 'Spécification OpenAPI', category: 'Docs' },
          { title: 'Modèle de données', category: 'Data' },
          { title: 'Conventions (versioning, erreurs)', category: 'Archio' },
        ],
        deliverables: ['Spec OpenAPI v1'],
      },
    ],
  },
  {
    title: 'Implémentation',
    objective: 'Endpoints, authentification et fiabilité',
    sprints: [
      {
        title: 'Endpoints & Auth',
        weeks: 'Sem. 3-4',
        objective: 'Endpoints CRUD et accès sécurisé',
        tasks: [
          { title: 'Endpoints CRUD', category: 'Backend' },
          { title: 'Auth (clés API / JWT)', category: 'Sécurité' },
          { title: 'Validation + erreurs homogènes', category: 'Backend' },
        ],
        deliverables: ['API v1 interne'],
      },
      {
        title: 'Tests & Webhooks',
        weeks: 'Sem. 5-6',
        objective: 'Fiabiliser l’API avant exposition',
        tasks: [
          { title: 'Tests d’intégration', category: 'QA' },
          { title: 'Webhooks sortants', category: 'Backend' },
          { title: 'Rate limiting', category: 'Sécurité' },
        ],
        deliverables: ['Suite de tests au vert'],
      },
    ],
  },
  {
    title: 'Production',
    objective: 'Documentation, supervision et ouverture',
    sprints: [
      {
        title: 'Docs & DX',
        weeks: 'Sem. 7-8',
        objective: 'Documentation développeurs de qualité',
        tasks: [
          { title: 'Documentation interactive (Swagger)', category: 'Docs' },
          { title: 'Guides + exemples de code', category: 'Docs' },
          { title: 'SDK client JS', category: 'Frontend' },
        ],
        deliverables: ['Docs publiques'],
      },
      {
        title: 'Monitoring & Go-live',
        weeks: 'Sem. 9',
        objective: 'Superviser puis ouvrir aux consommateurs',
        tasks: [
          { title: 'Monitoring + alertes', category: 'Sécurité' },
          { title: 'Backups', category: 'Infra' },
          { title: 'Ouverture aux partenaires', category: 'Launch' },
        ],
        deliverables: ['API en production'],
      },
    ],
  },
]

const BLANK_ROADMAP: ProjectRoadmapTemplate = [
  {
    title: 'Idéation',
    objective: 'Définir l’objectif et le périmètre du projet',
    sprints: [
      {
        title: 'Cadrage',
        weeks: 'Sem. 1-2',
        objective: 'Objectif, utilisateurs cibles et priorités',
        tasks: [
          { title: 'Définir l’objectif et les utilisateurs cibles', category: 'Docs' },
          { title: 'Lister les fonctionnalités prioritaires', category: 'Docs' },
          { title: 'Esquisser les écrans clés', category: 'Design' },
        ],
        deliverables: ['Périmètre validé'],
      },
    ],
  },
  {
    title: 'Construction',
    objective: 'Construire une première version utilisable',
    sprints: [
      {
        title: 'Prototype',
        weeks: 'Sem. 3-4',
        objective: 'Pages, données et premières interactions',
        tasks: [
          { title: 'Créer les pages principales', category: 'Frontend' },
          { title: 'Modéliser les données', category: 'Data' },
          { title: 'Connecter les données aux pages', category: 'Frontend' },
        ],
        deliverables: ['Prototype fonctionnel'],
      },
      {
        title: 'Fonctionnalités',
        weeks: 'Sem. 5-6',
        objective: 'Compléter les fonctionnalités prioritaires',
        tasks: [
          { title: 'Implémenter les fonctionnalités prioritaires', category: 'Dev' },
          { title: 'Automatisations utiles', category: 'Backend' },
          { title: 'Tests des parcours clés', category: 'QA' },
        ],
        deliverables: ['Version bêta interne'],
      },
    ],
  },
  {
    title: 'Lancement',
    objective: 'Finaliser, déployer et recueillir les retours',
    sprints: [
      {
        title: 'Mise en ligne',
        weeks: 'Sem. 7',
        objective: 'Finitions, déploiement et retours',
        tasks: [
          { title: 'Finitions UI + responsive', category: 'Frontend' },
          { title: 'Déploiement', category: 'Infra' },
          { title: 'Retours utilisateurs', category: 'Launch' },
        ],
        deliverables: ['Version 1 en ligne'],
      },
    ],
  },
]

export const PROJECT_ROADMAPS: Record<ProjectType, ProjectRoadmapTemplate> = {
  saas: SAAS_ROADMAP,
  website: WEBSITE_ROADMAP,
  game: GAME_ROADMAP,
  dashboard: DASHBOARD_ROADMAP,
  ecommerce: ECOMMERCE_ROADMAP,
  blog: BLOG_ROADMAP,
  api: API_ROADMAP,
  blank: BLANK_ROADMAP,
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Retrouve le plan d'un type de projet (repli sur le plan générique). */
export function getProjectRoadmapTemplate(type: string): ProjectRoadmapTemplate {
  return PROJECT_ROADMAPS[type as ProjectType] ?? BLANK_ROADMAP
}

export interface RoadmapTemplateStats {
  phases: number
  sprints: number
  tasks: number
  deliverables: number
}

/** Statistiques agrégées d'un plan (affichées dans le wizard de création). */
export function getProjectRoadmapStats(type: string): RoadmapTemplateStats {
  const template = getProjectRoadmapTemplate(type)
  let sprints = 0
  let tasks = 0
  let deliverables = 0
  for (const phase of template) {
    sprints += phase.sprints.length
    for (const sprint of phase.sprints) {
      tasks += sprint.tasks.length
      deliverables += sprint.deliverables.length
    }
  }
  return { phases: template.length, sprints, tasks, deliverables }
}
