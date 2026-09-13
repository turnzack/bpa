/**
 * Limites des plans Forge Studio (billing simulé).
 * `null` = illimité.
 */

export const PLAN_LIMITS = {
  free: { label: 'Free', price: 0, projects: 3, pages: 3, tables: 5, rows: 100, workflows: 3 },
  pro: { label: 'Pro', price: 29, projects: 25, pages: 50, tables: 50, rows: 50000, workflows: 50 },
  enterprise: { label: 'Enterprise', price: null, projects: null, pages: null, tables: null, rows: null, workflows: null }, // null = illimité
} as const

export type PlanKey = keyof typeof PLAN_LIMITS

export type PlanLimits = (typeof PLAN_LIMITS)[PlanKey]

/** Garde de type : la valeur est-elle une clé de plan valide ? */
export function isPlanKey(plan: string): plan is PlanKey {
  return plan === 'free' || plan === 'pro' || plan === 'enterprise'
}

/** Retourne les limites du plan (repli sur « free » si le plan est inconnu). */
export function getPlanLimits(plan: string): PlanLimits {
  return isPlanKey(plan) ? PLAN_LIMITS[plan] : PLAN_LIMITS.free
}
