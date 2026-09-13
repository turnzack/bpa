/**
 * Création de projet — logique partagée entre :
 * - POST /api/projects (wizard de création utilisateur) :
 *     • depuis un modèle classique (createProjectFromTemplate)
 *     • depuis un Pack PRD (createProjectFromPack, cf. src/lib/project-packs.ts)
 * - DELETE /api/projects/[projectId] (projet de remplacement automatique
 *   quand l'utilisateur supprime le dernier projet : le studio reste
 *   opérationnel avec un projet vierge).
 */

import type { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { getTemplate, type TemplateTable, type TemplateWorkflow, type TemplatePage } from '@/lib/project-templates'
import { getPack, serializePackRef } from '@/lib/project-packs'
import { generateProjectRoadmap, generateProjectRoadmapFromTemplate } from '@/lib/project-roadmap'
import { buildPackRoadmapTemplate } from '@/lib/pack-roadmap'

/** Slugify : minuscules, accents supprimés, non-alphanumériques → « - », collapse + trim. */
export function slugify(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'projet'
}

/** Retourne un slug unique : base, puis base-2, base-3… si déjà pris. */
export async function uniqueSlug(base: string): Promise<string> {
  let candidate = base
  let n = 2
  while (await db.project.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${n}`
    n++
  }
  return candidate
}

export interface CreatedProjectSummary {
  project: {
    id: string
    name: string
    slug: string
    type: string
    description: string | null
    status: string
    createdAt: Date
    updatedAt: Date
  }
  created: {
    pages: number
    tables: number
    workflows: number
    rows: number
    roadmap: Awaited<ReturnType<typeof generateProjectRoadmap>>
  }
}

interface ScaffoldResources {
  pages: TemplatePage[]
  tables: TemplateTable[]
  workflows: TemplateWorkflow[]
}

/**
 * Scaffolding commun (dans la transaction de création) : pages du builder,
 * tables + champs + lignes d'exemple, workflows. Retourne les compteurs.
 */
async function scaffoldProjectResources(
  tx: Prisma.TransactionClient,
  projectId: string,
  resources: ScaffoldResources,
): Promise<{ pages: number; tables: number; workflows: number; rows: number }> {
  // Pages (composants du builder, ids générés au moment du scaffolding).
  let nPages = 0
  for (const page of resources.pages) {
    await tx.page.create({
      data: {
        projectId,
        name: page.name,
        layoutJson: JSON.stringify(
          page.components.map((component) => ({
            id: crypto.randomUUID(),
            type: component.type,
            props: component.props,
          })),
        ),
      },
    })
    nPages++
  }

  // Tables + champs + lignes d'exemple.
  let nTables = 0
  let nRows = 0
  for (const table of resources.tables) {
    const created = await tx.dataTable.create({
      data: { projectId, name: table.name },
    })
    await tx.dataField.createMany({
      data: table.fields.map((field) => ({
        tableId: created.id,
        name: field.name,
        type: field.type,
        required: field.required ?? false,
        unique: field.unique ?? false,
        defaultValue: field.defaultValue ?? null,
      })),
    })
    for (const row of table.rows) {
      await tx.dataRow.create({
        data: { tableId: created.id, dataJson: JSON.stringify(row) },
      })
      nRows++
    }
    nTables++
  }

  // Workflows (statut actif, ids de nœuds générés).
  let nWorkflows = 0
  for (const workflow of resources.workflows) {
    await tx.workflow.create({
      data: {
        projectId,
        name: workflow.name,
        status: 'active',
        nodesJson: JSON.stringify(
          workflow.nodes.map((node) => ({
            id: crypto.randomUUID(),
            type: node.type,
            name: node.name,
            config: node.config,
          })),
        ),
      },
    })
    nWorkflows++
  }

  return { pages: nPages, tables: nTables, workflows: nWorkflows, rows: nRows }
}

/**
 * Crée un projet complet depuis un modèle : scaffolding des pages / tables /
 * lignes / workflows + génération de sa feuille de route (phases → sprints →
 * tâches + livrables). Lève une erreur si le type de projet est inconnu.
 */
export async function createProjectFromTemplate(input: {
  orgId: string
  name: string
  type: string
  description?: string | null
}): Promise<CreatedProjectSummary> {
  const template = getTemplate(input.type)
  if (!template) throw new Error('Type de projet inconnu.')

  const slug = await uniqueSlug(slugify(input.name))

  const result = await db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        orgId: input.orgId,
        name: input.name,
        slug,
        type: template.id,
        description: input.description ?? template.description,
        status: 'active',
      },
    })

    const counts = await scaffoldProjectResources(tx, project.id, {
      pages: template.pages,
      tables: template.tables,
      workflows: template.workflows,
    })

    return { project, counts }
  })

  // Feuille de route du projet : instanciée depuis le plan du type
  // (phases → sprints → tâches + livrables, cochables dans la vue dédiée).
  const roadmap = await generateProjectRoadmap(result.project.id, template.id)

  return {
    project: result.project,
    created: {
      pages: result.counts.pages,
      tables: result.counts.tables,
      workflows: result.counts.workflows,
      rows: result.counts.rows,
      roadmap,
    },
  }
}

/**
 * Crée un projet depuis un Pack PRD : scaffolding des ressources du pack +
 * feuille de route spiralaire (spirale 1 fondations, spirale 2 modules du
 * pack — 4 par sprint, spirale 3 durcissement). La référence du pack et la
 * sélection de modules sont persistées dans Project.packJson pour que la
 * roadmap reste consultable fidèlement (buildProjectRoadmap).
 */
export async function createProjectFromPack(input: {
  orgId: string
  name: string
  packId: string
  /** Clés des modules retenus (tous si absent). */
  modules?: string[]
  description?: string | null
}): Promise<CreatedProjectSummary> {
  const pack = getPack(input.packId)
  if (!pack) throw new Error('Pack PRD inconnu.')

  const validKeys = new Set(pack.modules.map((m) => m.key))
  const selected = input.modules
    ? Array.from(new Set(input.modules.filter((k) => validKeys.has(k))))
    : pack.modules.map((m) => m.key)
  if (selected.length === 0) {
    throw new Error('Sélectionnez au moins un module du pack pour lancer le projet.')
  }

  const slug = await uniqueSlug(slugify(input.name))

  const result = await db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        orgId: input.orgId,
        name: input.name,
        slug,
        type: pack.baseType,
        description: input.description ?? pack.description,
        status: 'active',
        packJson: serializePackRef(pack, selected),
      },
    })

    const counts = await scaffoldProjectResources(tx, project.id, {
      pages: pack.pages,
      tables: pack.tables,
      workflows: pack.workflows,
    })

    return { project, counts }
  })

  // Feuille de route spiralaire du pack, pour la sélection de modules.
  const roadmap = await generateProjectRoadmapFromTemplate(
    result.project.id,
    buildPackRoadmapTemplate(pack, selected),
  )

  return {
    project: result.project,
    created: {
      pages: result.counts.pages,
      tables: result.counts.tables,
      workflows: result.counts.workflows,
      rows: result.counts.rows,
      roadmap,
    },
  }
}
