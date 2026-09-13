import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { Project } from '@prisma/client'
import { db } from '@/lib/db'

/**
 * Helpers partagés pour les routes API Forge Studio :
 * - récupération (avec création à la volée) de l'organisation / du projet uniques
 * - réponses d'erreur homogènes
 * - parsing + validation zod du corps des requêtes
 * - JSON.parse tolérant
 * - journal d'audit
 */

/** Récupère l'organisation unique (la crée à la volée si absente). */
export async function ensureOrg() {
  const existing = await db.organization.findFirst()
  if (existing) return existing
  try {
    return await db.organization.create({
      data: { name: 'Atelier Démo', slug: 'atelier-demo', plan: 'free' },
    })
  } catch {
    // Slug déjà pris (création concurrente) : simple relecture.
    const org = await db.organization.findFirst()
    if (!org) throw new Error("Impossible de créer ou retrouver l'organisation")
    return org
  }
}

/** Récupère le projet unique (le crée à la volée si absent). */
export async function ensureProject() {
  const existing = await db.project.findFirst()
  if (existing) return existing
  const org = await ensureOrg()
  try {
    return await db.project.create({
      data: { orgId: org.id, name: 'Mon Premier Produit', slug: 'mon-premier-produit' },
    })
  } catch {
    const project = await db.project.findFirst()
    if (!project) throw new Error('Impossible de créer ou retrouver le projet')
    return project
  }
}

/**
 * Résout le projet ciblé par une requête multi-projets :
 * - `?projectId=` présent + trouvé → { ok: true, project }
 * - `?projectId=` présent + introuvable → { ok: false, response } (404 « Projet introuvable. »)
 * - absent → repli sur le projet par défaut (ensureProject, compatibilité).
 */
export async function resolveProject(
  req: NextRequest,
): Promise<{ ok: true; project: Project } | { ok: false; response: NextResponse }> {
  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) {
    return { ok: true, project: await ensureProject() }
  }
  const project = await db.project.findUnique({ where: { id: projectId } })
  if (!project) {
    return { ok: false, response: apiError('Projet introuvable.', 404) }
  }
  return { ok: true, project }
}

/** Réponse d'erreur JSON homogène. */
export function apiError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

/** Erreur serveur 500 standard (log côté serveur + message générique en français). */
export function serverError(scope: string, err: unknown): NextResponse {
  console.error(`[api:${scope}]`, err)
  return apiError('Erreur serveur interne.', 500)
}

/**
 * Parse + valide le corps JSON de la requête avec zod.
 * Retourne soit `{ success: true, data }`, soit `{ success: false, response }` (400 prêt à renvoyer).
 */
export async function parseJsonBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>,
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return { success: false, response: apiError('Corps de requête invalide : JSON attendu.', 400) }
  }
  const result = schema.safeParse(raw)
  if (!result.success) {
    const first = result.error.issues[0]
    const field = first && first.path.length > 0 ? first.path.map(String).join('.') : undefined
    return {
      success: false,
      response: apiError(field ? `Données invalides (champ : ${field}).` : 'Données invalides.', 400),
    }
  }
  return { success: true, data: result.data }
}

/** JSON.parse tolérant : renvoie `fallback` si le contenu n'est pas du JSON valide. */
export function safeParseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Enregistre une entrée du journal d'audit. */
export async function logAudit(
  orgId: string,
  action: string,
  entity: string,
  entityId: string | null,
  meta: string | null,
): Promise<void> {
  await db.auditLog.create({ data: { orgId, action, entity, entityId, meta } })
}

/** Entrée de log d'exécution d'un workflow (moteur d'exécution). */
export interface RunLog {
  nodeId: string
  type: string
  title: string
  status: 'success' | 'skipped' | 'error'
  message: string
  at: number
  durationMs: number
}
