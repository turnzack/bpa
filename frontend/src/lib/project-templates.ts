/**
 * Catalogue des modèles de projets Forge Studio (« Lanceur de projets »).
 *
 * - Côté frontend : PROJECT_TEMPLATES alimente la galerie du wizard de création
 *   (label, tagline, icône, couleur, highlights, aperçu des ressources).
 * - Côté backend : POST /api/projects lit le même catalogue pour « lancer » le
 *   projet (scaffolding des pages / tables / lignes / workflows en base).
 *
 * Les composants de pages respectent le format du builder :
 *   { type: 'heading'|'text'|'button'|'input'|'card'|'image'|'table', props }
 * Les nœuds de workflows respectent le moteur d'exécution :
 *   { type: 'webhook'|'timer'|'http'|'condition'|'code'|'email', name, config }
 * Les champs de tables respectent l'éditeur visuel :
 *   { name, type: 'string'|'number'|'boolean'|'datetime'|'json', required?, unique?, defaultValue? }
 *
 * Les `id` des composants / nœuds sont générés par l'API au moment du
 * scaffolding (ce fichier ne contient que le plan des ressources).
 */

export type ProjectType =
  | 'saas'
  | 'website'
  | 'game'
  | 'dashboard'
  | 'ecommerce'
  | 'blog'
  | 'api'
  | 'blank'

export type ProjectStatus = 'active' | 'archived'

// ─── Formes des blueprints ──────────────────────────────────────────────────

export interface TemplateComponent {
  type: 'heading' | 'text' | 'button' | 'input' | 'card' | 'image' | 'table'
  props: Record<string, string | number>
}

export interface TemplateField {
  name: string
  type: 'string' | 'number' | 'boolean' | 'datetime' | 'json'
  required?: boolean
  unique?: boolean
  defaultValue?: string
}

export interface TemplateRow {
  [fieldName: string]: string | number | boolean | null
}

export interface TemplateTable {
  name: string
  fields: TemplateField[]
  rows: TemplateRow[]
}

export interface TemplatePage {
  name: string
  components: TemplateComponent[]
}

export interface TemplateNode {
  type: 'webhook' | 'timer' | 'http' | 'condition' | 'code' | 'email'
  name: string
  config: Record<string, string | number>
}

export interface TemplateWorkflow {
  name: string
  nodes: TemplateNode[]
}

export interface ProjectTemplate {
  id: ProjectType
  label: string
  /** Phrase d'accroche affichée dans la galerie. */
  tagline: string
  /** Description pré-remplie du projet créé (modifiable ensuite). */
  description: string
  /** Clé d'icône lucide résolue côté frontend. */
  icon: string
  /** Clé de couleur Tailwind (sans bleu/indigo) : emerald, amber, rose… */
  color: string
  /** 3 puces « ce que contient le starter ». */
  highlights: string[]
  pages: TemplatePage[]
  tables: TemplateTable[]
  workflows: TemplateWorkflow[]
}

// ─── Catalogue ──────────────────────────────────────────────────────────────

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'saas',
    label: 'Application SaaS',
    tagline:
      'Produit SaaS multi-pages avec utilisateurs, abonnements et onboarding automatisé.',
    description:
      'Starter SaaS : pages d’accueil, tableau de bord et connexion, tables Utilisateurs & Abonnements, workflow d’onboarding automatisé.',
    icon: 'rocket',
    color: 'emerald',
    highlights: [
      '3 pages prêtes à personnaliser',
      'Tables Utilisateurs & Abonnements + données d’exemple',
      'Workflow d’onboarding (webhook → condition → e-mail)',
    ],
    pages: [
      {
        name: 'Accueil',
        components: [
          {
            type: 'heading',
            props: { text: 'Lancez votre produit en quelques jours', level: 'h1', size: 'xl', color: 'emerald' },
          },
          {
            type: 'text',
            props: {
              text: 'Créez, publiez et exploitez votre SaaS depuis une seule interface : données, pages, automatisations et facturation.',
              size: 'lg',
              color: 'default',
            },
          },
          { type: 'button', props: { text: 'Commencer gratuitement', variant: 'default' } },
          { type: 'card', props: { text: 'Essai gratuit de 14 jours · Sans carte bancaire', color: 'default' } },
        ],
      },
      {
        name: 'Tableau de bord',
        components: [
          { type: 'heading', props: { text: 'Tableau de bord', level: 'h2', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          {
            type: 'text',
            props: { text: 'Reliez ce tableau à vos tables pour afficher vos vraies données.', size: 'sm', color: 'muted' },
          },
        ],
      },
      {
        name: 'Connexion',
        components: [
          { type: 'heading', props: { text: 'Connexion', level: 'h2', size: 'md', color: 'default' } },
          { type: 'input', props: { placeholder: 'Adresse e-mail' } },
          { type: 'input', props: { placeholder: 'Mot de passe' } },
          { type: 'button', props: { text: 'Se connecter', variant: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Utilisateurs',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'email', type: 'string', required: true, unique: true },
          { name: 'role', type: 'string', defaultValue: 'member' },
          { name: 'actif', type: 'boolean' },
        ],
        rows: [
          { nom: 'Alice Martin', email: 'alice@exemple.com', role: 'admin', actif: true },
          { nom: 'Bob Durand', email: 'bob@exemple.com', role: 'member', actif: true },
          { nom: 'Chloé Petit', email: 'chloe@exemple.com', role: 'viewer', actif: false },
        ],
      },
      {
        name: 'Abonnements',
        fields: [
          { name: 'plan', type: 'string', required: true },
          { name: 'prix', type: 'number', required: true },
          { name: 'statut', type: 'string', defaultValue: 'actif' },
        ],
        rows: [
          { plan: 'Pro', prix: 29, statut: 'actif' },
          { plan: 'Enterprise', prix: 299, statut: 'essai' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Onboarding utilisateur',
        nodes: [
          { type: 'webhook', name: 'Nouvel inscrit', config: { path: '/webhooks/onboarding', method: 'POST' } },
          { type: 'condition', name: 'E-mail présent ?', config: { expression: 'email fourni' } },
          {
            type: 'email',
            name: 'E-mail de bienvenue',
            config: {
              to: '{{client.email}}',
              subject: 'Bienvenue sur notre SaaS !',
              body: 'Bonjour et bienvenue ! Votre compte est prêt. Commencez par créer votre premier projet.',
            },
          },
          { type: 'http', name: 'Synchronisation CRM', config: { url: 'https://api.exemple.com/crm/contacts', method: 'POST' } },
        ],
      },
    ],
  },
  {
    id: 'website',
    label: 'Site web vitrine',
    tagline: 'Site vitrine moderne : accueil, à propos et contact avec collecte de messages.',
    description:
      'Starter site web : pages Accueil / À propos / Contact et table Messages pour le formulaire de contact.',
    icon: 'globe',
    color: 'stone',
    highlights: [
      '3 pages web prêtes à publier',
      'Formulaire de contact (inputs + bouton)',
      'Table Messages pour stocker les demandes',
    ],
    pages: [
      {
        name: 'Accueil',
        components: [
          { type: 'heading', props: { text: 'Bienvenue dans notre studio', level: 'h1', size: 'xl', color: 'default' } },
          {
            type: 'text',
            props: {
              text: 'Nous concevons des expériences digitales qui marquent les esprits. Découvrez nos services et nos réalisations.',
              size: 'lg',
              color: 'default',
            },
          },
          { type: 'button', props: { text: 'Découvrir nos services', variant: 'default' } },
          { type: 'card', props: { text: 'Portfolio · Design · Développement · Stratégie', color: 'default' } },
        ],
      },
      {
        name: 'À propos',
        components: [
          { type: 'heading', props: { text: 'À propos de nous', level: 'h2', size: 'md', color: 'default' } },
          {
            type: 'text',
            props: {
              text: 'Fondée en 2026, notre équipe réunit des passionnés du web et du design autour d’une même conviction : le digital doit rester simple et humain.',
              size: 'md',
              color: 'default',
            },
          },
          {
            type: 'text',
            props: {
              text: 'Notre mission : rendre le web plus accessible, plus rapide et plus beau pour chacun de nos clients.',
              size: 'sm',
              color: 'muted',
            },
          },
        ],
      },
      {
        name: 'Contact',
        components: [
          { type: 'heading', props: { text: 'Contactez-nous', level: 'h2', size: 'md', color: 'default' } },
          { type: 'input', props: { placeholder: 'Votre nom' } },
          { type: 'input', props: { placeholder: 'Votre e-mail' } },
          { type: 'input', props: { placeholder: 'Votre message' } },
          { type: 'button', props: { text: 'Envoyer le message', variant: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Messages',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'email', type: 'string', required: true },
          { name: 'message', type: 'string' },
          { name: 'lu', type: 'boolean' },
        ],
        rows: [
          { nom: 'Marie Lefèvre', email: 'marie@exemple.com', message: 'Bonjour, je souhaite un devis pour refondre notre site.', lu: false },
          { nom: 'Karim Benali', email: 'karim@exemple.com', message: 'Possible d’échanger sur un projet de refonte UX ?', lu: true },
        ],
      },
    ],
    workflows: [],
  },
  {
    id: 'game',
    label: 'Jeu vidéo',
    tagline: 'Jeu web avec page de jeu, classement des scores et notifications de records.',
    description:
      'Starter jeu vidéo : pages Jouer & Classement, table Scores, workflow de record (webhook → condition → e-mail).',
    icon: 'gamepad',
    color: 'amber',
    highlights: [
      'Pages Jouer & Classement',
      'Table Scores avec données d’exemple',
      'Workflow « Nouveau record » automatisé',
    ],
    pages: [
      {
        name: 'Jouer',
        components: [
          { type: 'heading', props: { text: 'Prêt à jouer ?', level: 'h1', size: 'xl', color: 'amber' } },
          {
            type: 'text',
            props: {
              text: 'Affrontez d’autres joueurs et grimpez dans le classement mondial. Chaque partie compte !',
              size: 'lg',
              color: 'default',
            },
          },
          { type: 'button', props: { text: 'Jouer maintenant', variant: 'default' } },
          { type: 'card', props: { text: 'Meilleur score : 1 240 pts — à vous de jouer !', color: 'amber' } },
        ],
      },
      {
        name: 'Classement',
        components: [
          { type: 'heading', props: { text: 'Classement mondial', level: 'h2', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 3 } },
          { type: 'text', props: { text: 'Les 10 meilleurs joueurs de la semaine.', size: 'sm', color: 'muted' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Scores',
        fields: [
          { name: 'joueur', type: 'string', required: true },
          { name: 'score', type: 'number', required: true },
          { name: 'niveau', type: 'string' },
          { name: 'date', type: 'datetime' },
        ],
        rows: [
          { joueur: 'PixelMaster', score: 1240, niveau: 'Niveau 8', date: '2026-09-07T18:30:00.000Z' },
          { joueur: 'SpeedRun42', score: 1105, niveau: 'Niveau 7', date: '2026-09-08T09:15:00.000Z' },
          { joueur: 'Luna', score: 980, niveau: 'Niveau 6', date: '2026-09-08T20:45:00.000Z' },
          { joueur: 'Neo', score: 860, niveau: 'Niveau 5', date: '2026-09-09T07:20:00.000Z' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Nouveau record',
        nodes: [
          { type: 'webhook', name: 'Score soumis', config: { path: '/webhooks/scores', method: 'POST' } },
          { type: 'condition', name: 'Score > 1 000 ?', config: { expression: 'score > 1000' } },
          {
            type: 'email',
            name: 'Félicitations',
            config: {
              to: 'joueur@exemple.com',
              subject: 'Nouveau record personnel !',
              body: 'Bravo ! Votre score entre dans le top du classement mondial. Continuez comme ça !',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dashboard',
    label: 'Back-office & Dashboard',
    tagline: 'Tableau de bord interne façon Retool : KPI, données clients et commandes.',
    description:
      'Starter back-office : page Dashboard, tables Clients & Commandes, rapport quotidien automatisé (cron 8h).',
    icon: 'dashboard',
    color: 'zinc',
    highlights: [
      'Page dashboard avec indicateurs',
      'Tables Clients & Commandes + données d’exemple',
      'Rapport quotidien automatisé (cron → e-mail)',
    ],
    pages: [
      {
        name: 'Tableau de bord',
        components: [
          { type: 'heading', props: { text: 'Pilotage de l’activité', level: 'h2', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          {
            type: 'card',
            props: { text: 'KPI du jour — reliez vos tables pour des indicateurs en temps réel.', color: 'default' },
          },
        ],
      },
    ],
    tables: [
      {
        name: 'Clients',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'email', type: 'string', required: true, unique: true },
          { name: 'societe', type: 'string' },
          { name: 'actif', type: 'boolean' },
        ],
        rows: [
          { nom: 'Alice Martin', email: 'alice@exemple.com', societe: 'Atelier Nord', actif: true },
          { nom: 'Bob Durand', email: 'bob@exemple.com', societe: 'Durand & Fils', actif: true },
          { nom: 'Chloé Petit', email: 'chloe@exemple.com', societe: 'Petit Studio', actif: false },
        ],
      },
      {
        name: 'Commandes',
        fields: [
          { name: 'reference', type: 'string', required: true },
          { name: 'client', type: 'string' },
          { name: 'total', type: 'number' },
          { name: 'statut', type: 'string', defaultValue: 'en cours' },
        ],
        rows: [
          { reference: 'CMD-001', client: 'Alice Martin', total: 249, statut: 'payée' },
          { reference: 'CMD-002', client: 'Bob Durand', total: 89.5, statut: 'en cours' },
          { reference: 'CMD-003', client: 'Chloé Petit', total: 410, statut: 'expédiée' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Rapport quotidien',
        nodes: [
          { type: 'timer', name: 'Déclencheur 8h', config: { cron: '0 8 * * *' } },
          { type: 'http', name: 'Agrégation des ventes', config: { url: 'https://api.exemple.com/stats/ventes', method: 'GET' } },
          {
            type: 'email',
            name: 'E-mail à l’équipe',
            config: {
              to: 'equipe@exemple.com',
              subject: 'Rapport quotidien',
              body: 'Bonjour, voici le rapport quotidien de l’activité : ventes, nouvelles commandes et alertes.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ecommerce',
    label: 'Boutique en ligne',
    tagline: 'E-commerce complet : catalogue produits, suivi des commandes et e-mails de confirmation.',
    description:
      'Starter e-commerce : pages Boutique & Commandes, tables Produits & Commandes, confirmation de commande automatisée.',
    icon: 'shopping-bag',
    color: 'rose',
    highlights: [
      'Pages Boutique & Commandes',
      'Tables Produits & Commandes + stock',
      'E-mail de confirmation automatique',
    ],
    pages: [
      {
        name: 'Boutique',
        components: [
          { type: 'heading', props: { text: 'Notre boutique', level: 'h1', size: 'xl', color: 'default' } },
          { type: 'table', props: { columns: 3 } },
          { type: 'button', props: { text: 'Voir le panier', variant: 'outline' } },
        ],
      },
      {
        name: 'Commandes',
        components: [
          { type: 'heading', props: { text: 'Suivi des commandes', level: 'h2', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
        ],
      },
    ],
    tables: [
      {
        name: 'Produits',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'prix', type: 'number', required: true },
          { name: 'stock', type: 'number' },
          { name: 'actif', type: 'boolean' },
        ],
        rows: [
          { nom: 'T-shirt Forge', prix: 24.9, stock: 120, actif: true },
          { nom: 'Mug OmniBuild', prix: 12.5, stock: 80, actif: true },
          { nom: 'Sweat Développeur', prix: 49, stock: 0, actif: false },
        ],
      },
      {
        name: 'Commandes',
        fields: [
          { name: 'reference', type: 'string', required: true },
          { name: 'client', type: 'string' },
          { name: 'total', type: 'number' },
          { name: 'statut', type: 'string', defaultValue: 'en préparation' },
        ],
        rows: [
          { reference: 'CMD-2041', client: 'Marie Lefèvre', total: 37.4, statut: 'payée' },
          { reference: 'CMD-2042', client: 'Karim Benali', total: 49, statut: 'en préparation' },
          { reference: 'CMD-2043', client: 'Emma Rossi', total: 12.5, statut: 'expédiée' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Confirmation de commande',
        nodes: [
          { type: 'webhook', name: 'Commande créée', config: { path: '/webhooks/orders', method: 'POST' } },
          { type: 'condition', name: 'Paiement validé ?', config: { expression: 'paiement === validé' } },
          {
            type: 'email',
            name: 'E-mail de confirmation',
            config: {
              to: '{{client.email}}',
              subject: 'Merci pour votre commande !',
              body: 'Votre commande est confirmée et en préparation. Vous recevrez un e-mail d’expédition très bientôt.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'blog',
    label: 'Blog & CMS',
    tagline: 'Blog avec liste d’articles, page de lecture et notification aux abonnés.',
    description:
      'Starter blog : pages Articles & Lecture, table Articles (brouillon / publié), notification aux abonnés.',
    icon: 'newspaper',
    color: 'orange',
    highlights: [
      'Pages Articles & Lecture',
      'Table Articles (brouillon / publié)',
      'Workflow de notification aux abonnés',
    ],
    pages: [
      {
        name: 'Articles',
        components: [
          { type: 'heading', props: { text: 'Le blog', level: 'h1', size: 'xl', color: 'default' } },
          { type: 'table', props: { columns: 3 } },
          { type: 'button', props: { text: 'S’abonner à la newsletter', variant: 'outline' } },
        ],
      },
      {
        name: 'Lecture',
        components: [
          { type: 'heading', props: { text: 'Titre de l’article', level: 'h2', size: 'md', color: 'default' } },
          {
            type: 'text',
            props: {
              text: 'Une fois publié, chaque article peut être relié à la table Articles pour alimenter automatiquement cette page de lecture.',
              size: 'md',
              color: 'default',
            },
          },
          {
            type: 'text',
            props: {
              text: 'Astuce : utilisez le data binding du builder pour afficher le contenu de l’article sélectionné.',
              size: 'sm',
              color: 'muted',
            },
          },
        ],
      },
    ],
    tables: [
      {
        name: 'Articles',
        fields: [
          { name: 'titre', type: 'string', required: true },
          { name: 'contenu', type: 'string' },
          { name: 'statut', type: 'string', defaultValue: 'brouillon' },
          { name: 'publie', type: 'boolean' },
        ],
        rows: [
          { titre: 'Bien démarrer avec Forge Studio', contenu: 'Guide de prise en main de l’atelier…', statut: 'publié', publie: true },
          { titre: '10 automatisations qui font gagner du temps', contenu: 'Tour d’horizon des workflows utiles…', statut: 'brouillon', publie: false },
          { titre: 'Annonce de la v1.0', contenu: 'Les nouveautés de la première version majeure…', statut: 'planifié', publie: false },
        ],
      },
    ],
    workflows: [
      {
        name: 'Notifier les abonnés',
        nodes: [
          { type: 'webhook', name: 'Article publié', config: { path: '/webhooks/articles', method: 'POST' } },
          {
            type: 'email',
            name: 'Newsletter abonnés',
            config: {
              to: 'abonnes@exemple.com',
              subject: 'Nouvel article publié',
              body: 'Un nouvel article vient d’être publié sur le blog. Venez le découvrir !',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'api',
    label: 'API & Backend',
    tagline: 'Backend headless : tables exposées en API, webhook entrant et script de traitement.',
    description:
      'Starter API : tables Utilisateurs & Événements, workflow de traitement d’événements (webhook → code → HTTP).',
    icon: 'braces',
    color: 'teal',
    highlights: [
      '2 tables prêtes pour l’exposition API',
      'Webhook entrant + script de traitement',
      'Idéal pour applications mobiles et intégrations',
    ],
    pages: [],
    tables: [
      {
        name: 'Utilisateurs',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'email', type: 'string', required: true, unique: true },
          { name: 'role', type: 'string', defaultValue: 'member' },
        ],
        rows: [
          { nom: 'Alice Martin', email: 'alice@exemple.com', role: 'admin' },
          { nom: 'Bob Durand', email: 'bob@exemple.com', role: 'member' },
        ],
      },
      {
        name: 'Événements',
        fields: [
          { name: 'type', type: 'string', required: true },
          { name: 'payload', type: 'json' },
          { name: 'source', type: 'string' },
        ],
        rows: [
          { type: 'user.created', payload: '{"email":"alice@exemple.com"}', source: 'webhook' },
          { type: 'order.paid', payload: '{"order":"CMD-2041"}', source: 'stripe' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Traitement d’événements',
        nodes: [
          { type: 'webhook', name: 'Événement entrant', config: { path: '/v1/events', method: 'POST' } },
          {
            type: 'code',
            name: 'Préparation du payload',
            config: { code: 'return { ok: true, processedAt: new Date().toISOString() }' },
          },
          { type: 'http', name: 'Transmission au service', config: { url: 'https://api.exemple.com/services/events', method: 'POST' } },
        ],
      },
    ],
  },
  {
    id: 'blank',
    label: 'Projet vierge',
    tagline: 'Partez de zéro : pages, tables et workflows 100 % à construire par vous.',
    description: 'Projet vierge : aucune ressource pré-créée, à vous de composer votre produit.',
    icon: 'box',
    color: 'neutral',
    highlights: [
      'Aucune ressource pré-créée',
      'Liberté totale de structure',
      'Parfait pour les cas d’usage spécifiques',
    ],
    pages: [],
    tables: [],
    workflows: [],
  },
]

/** Le modèle sélectionné par défaut dans la galerie. */
export const DEFAULT_TEMPLATE_ID: ProjectType = 'saas'

/** Retrouve un modèle par son id (tolérant aux ids inconnus). */
export function getTemplate(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((t) => t.id === id)
}

/** Garde de type : la valeur est-elle un id de modèle connu ? */
export function isProjectType(id: string): id is ProjectType {
  return PROJECT_TEMPLATES.some((t) => t.id === id)
}
