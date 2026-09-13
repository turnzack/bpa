/**
 * Gestion serveur des feuilles de route de projets.
 *
 * Chaque projet possède sa propre roadmap (SprintTask.projectId) instanciée
 * depuis le catalogue src/lib/project-roadmap-templates.ts :
 * - POST /api/projects  → generateProjectRoadmap() lors du « lancement » ;
 * - GET /api/projects/[projectId]/roadmap → ensureProjectRoadmap() (compatibilité
 *   avec les projets créés avant cette fonctionnalité) + buildProjectRoadmap().
 *
 * Les métadonnées (titres, objectifs) restent dans le template : la base ne
 * stocke que l'état persisté (id, title, category, kind, done, ordre).
 */

import type { Project } from '@prisma/client'
import { db } from '@/lib/db'
import { getProjectRoadmapTemplate, type ProjectRoadmapTemplate } from '@/lib/project-roadmap-templates'
import { getPack, parsePackRef } from '@/lib/project-packs'
import { buildPackRoadmapTemplate } from '@/lib/pack-roadmap'

/**
 * Résout le plan (phases → sprints → tâches) d'un projet :
 * - projet lancé depuis un Pack PRD (packJson) → plan spiralaire du pack,
 *   reconstruit de façon déterministe pour la sélection de modules stockée ;
 * - sinon → plan du type de projet (repli générique si type inconnu).
 */
export function resolveProjectRoadmapTemplate(project: Pick<Project, 'type' | 'packJson'>): ProjectRoadmapTemplate {
  const ref = parsePackRef(project.packJson)
  if (ref) {
    const pack = getPack(ref.packId)
    if (pack) return buildPackRoadmapTemplate(pack, ref.modules)
  }
  return getProjectRoadmapTemplate(project.type)
}

/** Génère (non idempotent) les tâches + livrables d'un plan déjà résolu. */
export async function generateProjectRoadmapFromTemplate(
  projectId: string,
  template: ProjectRoadmapTemplate,
): Promise<{ phases: number; sprints: number; tasks: number; deliverables: number }> {
  let sprintNumber = 0
  let nTasks = 0
  let nDeliverables = 0

  for (let phaseIndex = 0; phaseIndex < template.length; phaseIndex++) {
    const phase = template[phaseIndex]
    for (const sprint of phase.sprints) {
      sprintNumber += 1

      if (sprint.tasks.length > 0) {
        await db.sprintTask.createMany({
          data: sprint.tasks.map((task) => ({
            sprintNumber,
            phase: phaseIndex + 1,
            title: task.title,
            category: task.category,
            kind: 'task',
            projectId,
          })),
        })
        nTasks += sprint.tasks.length
      }

      if (sprint.deliverables.length > 0) {
        await db.sprintTask.createMany({
          data: sprint.deliverables.map((title) => ({
            sprintNumber,
            phase: phaseIndex + 1,
            title,
            category: 'Livrable',
            kind: 'deliverable',
            projectId,
          })),
        })
        nDeliverables += sprint.deliverables.length
      }
    }
  }

  return { phases: template.length, sprints: sprintNumber, tasks: nTasks, deliverables: nDeliverables }
}

/** Génère (non idempotent) les tâches + livrables du plan d'un type de projet. */
export async function generateProjectRoadmap(
  projectId: string,
  type: string,
): Promise<{ phases: number; sprints: number; tasks: number; deliverables: number }> {
  return generateProjectRoadmapFromTemplate(projectId, getProjectRoadmapTemplate(type))
}

/** Requêtes ensure déjà en cours (anti-doublon sur appels concurrents). */
const inFlight = new Map<string, Promise<void>>()

/**
 * Garantit qu'un projet possède sa feuille de route : si aucune ligne
 * SprintTask ne lui est rattachée, le plan est instancié depuis le template.
 * Idempotent + protégé contre les appels concurrents (même process).
 */
export async function ensureProjectRoadmap(project: Project): Promise<void> {
  const existing = await db.sprintTask.count({ where: { projectId: project.id } })
  if (existing > 0) return

  const pending = inFlight.get(project.id)
  if (pending) return pending

  const promise = (async () => {
    try {
      // Re-vérification à l'intérieur (course entre deux requêtes très proches).
      const again = await db.sprintTask.count({ where: { projectId: project.id } })
      if (again > 0) return
      await generateProjectRoadmapFromTemplate(project.id, resolveProjectRoadmapTemplate(project))
    } finally {
      inFlight.delete(project.id)
    }
  })()
  inFlight.set(project.id, promise)
  return promise
}

/** Formes de la réponse (identiques à GET /api/roadmap + bloc project). */
interface ProjectRoadmapResponse {
  project: { id: string; name: string; type: string }
  phases: {
    phase: number
    title: string
    objective: string
    sprints: {
      sprint: number
      title: string
      weeks: string
      objective: string
      deliverables: { id: string; title: string; done: boolean }[]
      tasks: { id: string; title: string; category: string; done: boolean }[]
    }[]
  }[]
  stats: { done: number; total: number }
  deliverableStats: { done: number; total: number }
}

/**
 * Construit la réponse normalisée de la feuille de route d'un projet :
 * métadonnées depuis le template, état (done/id) depuis la base.
 */
export async function buildProjectRoadmap(project: Project): Promise<ProjectRoadmapResponse> {
  await ensureProjectRoadmap(project)

  const [rows, template] = await Promise.all([
    db.sprintTask.findMany({
      where: { projectId: project.id },
      orderBy: [{ sprintNumber: 'asc' }, { createdAt: 'asc' }],
    }),
    Promise.resolve(resolveProjectRoadmapTemplate(project)),
  ])

  const tasksBySprint = new Map<number, { id: string; title: string; category: string; done: boolean; status: string }[]>()
  const deliverablesBySprint = new Map<number, { id: string; title: string; done: boolean; status: string }[]>()
  for (const row of rows) {
    if (row.kind === 'deliverable') {
      const list = deliverablesBySprint.get(row.sprintNumber) ?? []
      list.push({ id: row.id, title: row.title, done: row.done, status: row.status })
      deliverablesBySprint.set(row.sprintNumber, list)
    } else {
      const list = tasksBySprint.get(row.sprintNumber) ?? []
      list.push({ id: row.id, title: row.title, category: row.category, done: row.done, status: row.status })
      tasksBySprint.set(row.sprintNumber, list)
    }
  }

  let sprintNumber = 0
  let tasksDone = 0
  let tasksTotal = 0
  let deliverablesDone = 0
  let deliverablesTotal = 0

  const phases = template.map((phase, phaseIndex) => ({
    phase: phaseIndex + 1,
    title: phase.title,
    objective: phase.objective,
    sprints: phase.sprints.map((sprint) => {
      sprintNumber += 1
      const tasks = tasksBySprint.get(sprintNumber) ?? []
      const deliverables = deliverablesBySprint.get(sprintNumber) ?? []
      tasksTotal += tasks.length
      tasksDone += tasks.filter((t) => t.done).length
      deliverablesTotal += deliverables.length
      deliverablesDone += deliverables.filter((d) => d.done).length
      return {
        sprint: sprintNumber,
        title: sprint.title,
        weeks: sprint.weeks,
        objective: sprint.objective,
        deliverables,
        tasks,
      }
    }),
  }))

  return {
    project: { id: project.id, name: project.name, type: project.type },
    phases,
    stats: { done: tasksDone, total: tasksTotal },
    deliverableStats: { done: deliverablesDone, total: deliverablesTotal },
  }
}
