/**
 * Feuille de route « spiralaire » des Packs PRD.
 *
 * Méthodologie inspirée du CTO Core Engine fourni dans prd_packs.zip :
 * - Spirale 1 — Squelette viable (cadrage, architecture, socle) ;
 * - Spirale 2 — Enrichissement métier : chaque sprint livre un groupe de
 *   modules PRD du pack (4 modules par sprint) ;
 * - Spirale 3 — Durcissement (QA, accessibilité, lancement).
 *
 * Fonctions pures (aucun import serveur) : utilisées côté API pour instancier
 * la roadmap en base ET côté wizard pour afficher les statistiques du plan.
 */

import type { ProjectRoadmapTemplate, RoadmapTemplateSprint } from '@/lib/project-roadmap-templates'
import type { ProjectPack } from '@/lib/project-packs'

/** Nombre de modules PRD livrés par sprint de la spirale 2. */
export const PACK_MODULES_PER_SPRINT = 4

/** Semaines par sprint (affichage « Sem. X-Y »). */
const WEEKS_PER_SPRINT = 2

/** Retourne les modules retenus (tous si aucune sélection). */
export function resolvePackModules(pack: ProjectPack, selectedKeys?: string[]): ProjectPack['modules'] {
  if (!selectedKeys) return pack.modules
  const set = new Set(selectedKeys)
  return pack.modules.filter((m) => set.has(m.key))
}

/**
 * Construit le plan complet (phases → sprints → tâches + livrables) d'un pack
 * pour la sélection de modules donnée. Déterministe : la même entrée produit
 * le même plan (les titres/objectifs restent hors base, cf. project-roadmap.ts).
 */
export function buildPackRoadmapTemplate(
  pack: ProjectPack,
  selectedKeys?: string[],
): ProjectRoadmapTemplate {
  const modules = resolvePackModules(pack, selectedKeys)

  // ── Spirale 2 : sprints de modules (groupes de 4, dans l'ordre du pack) ──
  const moduleSprints: RoadmapTemplateSprint[] = []
  for (let i = 0; i < modules.length; i += PACK_MODULES_PER_SPRINT) {
    const chunk = modules.slice(i, i + PACK_MODULES_PER_SPRINT)
    moduleSprints.push({
      title: `Modules ${i + 1}–${i + chunk.length}`,
      weeks: '', // affecté ci-dessous (numérotation continue)
      objective: `Livrer : ${chunk.map((m) => m.title).join(', ')}`,
      tasks: chunk.map((m) => ({ title: `${m.title} — ${m.mission}`, category: m.category })),
      deliverables: [`${chunk.length} module${chunk.length > 1 ? 's' : ''} du pack livré${chunk.length > 1 ? 's' : ''}`],
    })
  }

  // ── Spirale 1 — Squelette viable ─────────────────────────────────────────
  const phase1Sprints: RoadmapTemplateSprint[] = [
    {
      title: 'Cadrage du pack',
      weeks: '',
      objective: `Importer le pack « ${pack.label} », prioriser les modules retenus`,
      tasks: [
        { title: `Importer le pack « ${pack.label} » et cadrer le périmètre`, category: 'Docs' },
        { title: 'Prioriser les modules et planifier les spirales', category: 'Docs' },
        { title: 'Concevoir les maquettes des écrans clés', category: 'Design' },
      ],
      deliverables: ['Périmètre du pack validé'],
    },
    {
      title: 'Squelette viable',
      weeks: '',
      objective: 'Socle technique compilable et déployable du premier coup',
      tasks: [
        { title: 'Initialiser le repo, la CI et l’architecture', category: 'Archio' },
        { title: 'Configurer la base de données initiale', category: 'Data' },
        { title: 'Mettre en place le squelette applicatif (layout + routing)', category: 'Frontend' },
      ],
      deliverables: ['Squelette compilable et déployable'],
    },
  ]

  // ── Spirale 3 — Durcissement ─────────────────────────────────────────────
  const phase3Sprints: RoadmapTemplateSprint[] = [
    {
      title: 'Qualité & Accessibilité',
      weeks: '',
      objective: 'Fiabiliser l’ensemble : tests, accessibilité, performance',
      tasks: [
        { title: 'Tests E2E des parcours clés', category: 'QA' },
        { title: 'Accessibilité WCAG 2.1 AA (clavier, lecteur d’écran)', category: 'Design' },
        { title: 'Performance et optimisation (lazy loading, bundle)', category: 'Dev' },
      ],
      deliverables: ['Suite de tests verte'],
    },
    {
      title: 'Lancement',
      weeks: '',
      objective: 'Déployer, documenter et recueillir les retours',
      tasks: [
        { title: 'Déploiement en production', category: 'Infra' },
        { title: 'Documentation utilisateur', category: 'Docs' },
        { title: 'Recueillir les retours utilisateurs', category: 'Launch' },
      ],
      deliverables: ['Version 1 en ligne'],
    },
  ]

  // Numérotation continue des semaines sur tous les sprints (2 sem. / sprint).
  const allSprints = [...phase1Sprints, ...moduleSprints, ...phase3Sprints]
  allSprints.forEach((sprint, index) => {
    const start = index * WEEKS_PER_SPRINT + 1
    const end = start + WEEKS_PER_SPRINT - 1
    sprint.weeks = start === end ? `Sem. ${start}` : `Sem. ${start}-${end}`
  })

  const phases = [
    {
      title: 'Spirale 1 — Squelette viable',
      objective: 'Cadrer le pack et poser un socle technique solide',
      sprints: phase1Sprints,
    },
    ...(moduleSprints.length > 0
      ? [
          {
            title: 'Spirale 2 — Enrichissement métier',
            objective: `Livrer les ${modules.length} module${modules.length > 1 ? 's' : ''} PRD du pack, sprint après sprint`,
            sprints: moduleSprints,
          },
        ]
      : []),
    {
      title: 'Spirale 3 — Durcissement',
      objective: 'Fiabiliser, déployer et lancer',
      sprints: phase3Sprints,
    },
  ]

  return phases
}

export interface PackRoadmapStats {
  phases: number
  sprints: number
  tasks: number
  deliverables: number
}

/** Statistiques agrégées du plan d'un pack (affichage wizard). */
export function getPackRoadmapStats(
  pack: ProjectPack,
  selectedKeys?: string[],
): PackRoadmapStats {
  const template = buildPackRoadmapTemplate(pack, selectedKeys)
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
