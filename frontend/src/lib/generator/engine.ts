/**
 * Moteur de génération du Générateur (Sprints G1+G2+G3 + correctif 502).
 *
 * Le pipeline complet (IA → réparation → secours déterministe) est exécuté
 * sois de façon SYNCHRONE (mode historique, sans run) ou en file d'attente :
 * POST /generate démarre la tâche en arrière-plan et renvoie immédiatement,
 * le client interroge GET /status toutes les 2 s. Aucune requête HTTP longue
 * → la passerelle ne peut plus renvoyer 502 pendant une génération lente.
 * L'état vit dans la table GeneratorPage (status generating → done | failed).
 */

import { createHash } from "node:crypto";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { safeParseJson } from "@/lib/api-utils";
import { scanFiles } from "@/lib/generator/blueprint";
import { htmlToFallbackComponents } from "@/lib/generator/html-to-components";
import {
  buildGenerationSystemPrompt,
  buildGenerationUserPrompt,
  buildRepairUserPrompt,
  type PromptInteraction,
  type PromptRoute,
} from "@/lib/generator/prompts";
import { buildCoverage, extractJson, validateAiOutput } from "@/lib/generator/validate";
import type { BuilderComponent } from "@/components/studio/types";

/** Délai maximal d'un appel LLM (mode arrière-plan : pas de limite HTTP). */
export const LLM_TIMEOUT_QUEUED_MS = 90_000;
/** Délai maximal d'un appel LLM en mode synchrone (rester sous le délai passerelle). */
export const LLM_TIMEOUT_SYNC_MS = 18_000;
/** Une page « generating » sans mise à jour depuis ce délai = tâche orpheline. */
export const STALE_GENERATING_MS = 3 * 60_000;

export type Timings = { llmMs: number; repairMs: number; validateMs: number; fallbackMs: number };
const EMPTY_TIMINGS: Timings = { llmMs: 0, repairMs: 0, validateMs: 0, fallbackMs: 0 };

export interface GenerateSuccess {
  components: BuilderComponent[];
  decisions: { interactionId: string; componentId: string; event: string; action: string }[];
  warnings: string[];
  engine: "ia" | "secours";
  coverage: ReturnType<typeof buildCoverage>;
  durationMs: number;
  timings: Timings;
  promptTokens: number;
  completionTokens: number;
  cached?: boolean;
  attempts: number;
}

export interface DbPageRow {
  id: string;
  fileName: string;
  contentHash: string;
  status: string;
  engine: string | null;
  componentsJson: string | null;
  decisionsJson: string | null;
  warningsJson: string | null;
  coverageJson: string | null;
  timingsJson: string | null;
  durationMs: number;
  promptTokens: number;
  completionTokens: number;
  attempts: number;
  error: string | null;
  updatedAt: Date;
}

/** Hash stable du contenu d'une page (cache : ne jamais régénérer une page inchangée). */
export function contentHashOf(source: string, html: string): string {
  return createHash("sha256").update(`${source}\u0000${html}`).digest("hex");
}

/** Reconstruit un résultat complet depuis une ligne GeneratorPage persistée. */
export function rowToResult(row: DbPageRow): GenerateSuccess {
  return {
    components: safeParseJson<BuilderComponent[]>(row.componentsJson ?? "[]", []),
    decisions: safeParseJson<GenerateSuccess["decisions"]>(row.decisionsJson ?? "[]", []),
    warnings: safeParseJson<string[]>(row.warningsJson ?? "[]", []),
    engine: row.engine === "ia" ? "ia" : "secours",
    coverage: safeParseJson<ReturnType<typeof buildCoverage>>(row.coverageJson ?? "[]", []),
    durationMs: row.durationMs,
    timings: safeParseJson<Timings>(row.timingsJson ?? "{}", EMPTY_TIMINGS),
    promptTokens: row.promptTokens,
    completionTokens: row.completionTokens,
    attempts: row.attempts,
  };
}

/** Recherche cache : d'abord dans le run courant, puis tous runs confondus
 * (même fichier + même hash = même résultat, la page inchangée n'est jamais régénérée). */
export async function findCachedPage(
  hash: string,
  source: string,
  runId: string | undefined,
): Promise<DbPageRow | null> {
  if (runId) {
    const inRun = await db.generatorPage.findUnique({
      where: { runId_fileName: { runId, fileName: source } },
    });
    if (inRun && inRun.status === "done" && inRun.contentHash === hash && inRun.componentsJson) {
      return inRun;
    }
  }
  const crossRun = await db.generatorPage.findFirst({
    where: { fileName: source, contentHash: hash, status: "done" },
    orderBy: { updatedAt: "desc" },
  });
  if (crossRun?.componentsJson) return crossRun;
  return null;
}

/** Marque la page « generating » (création si absente) — reprise : la page apparaît en cours. */
export async function markPageGenerating(
  runId: string,
  fileName: string,
  hash: string,
): Promise<void> {
  const existing = await db.generatorPage.findUnique({
    where: { runId_fileName: { runId, fileName } },
  });
  if (existing) {
    await db.generatorPage.update({
      where: { id: existing.id },
      data: { status: "generating", contentHash: hash, error: null },
    });
  } else {
    await db.generatorPage.create({
      data: { runId, fileName, contentHash: hash, status: "generating" },
    });
  }
}

/** Persiste un résultat terminé (status done) pour la reprise et le rapport. */
export async function persistPageDone(
  runId: string,
  fileName: string,
  hash: string,
  result: GenerateSuccess,
  timings: Timings,
  promptTokens: number,
  completionTokens: number,
): Promise<void> {
  const existing = await db.generatorPage.findUnique({
    where: { runId_fileName: { runId, fileName } },
  });
  const data = {
    status: "done",
    engine: result.engine,
    componentsJson: JSON.stringify(result.components),
    decisionsJson: JSON.stringify(result.decisions),
    warningsJson: JSON.stringify(result.warnings),
    coverageJson: JSON.stringify(result.coverage),
    timingsJson: JSON.stringify(timings),
    durationMs: result.durationMs,
    promptTokens,
    completionTokens,
    attempts: result.attempts,
    error: null,
    contentHash: hash,
  };
  if (existing) await db.generatorPage.update({ where: { id: existing.id }, data });
  else await db.generatorPage.create({ data: { runId, fileName, ...data } });
}

interface LlmCall {
  raw: string;
  promptTokens: number;
  completionTokens: number;
}

/** Course promesse / minuteur : garantit qu'un appel ne dépasse jamais le délai imparti. */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} (délai ${Math.round(ms / 1000)} s dépassé)`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Appel LLM avec gestion d'erreurs + capture des jetons (observabilité). */
async function callLlm(system: string, user: string, timeoutMs: number): Promise<LlmCall> {
  const zai = await ZAI.create();
  const completion = await withTimeout(
    zai.chat.completions.create({
      messages: [
        { role: "assistant", content: system },
        { role: "user", content: user },
      ],
      thinking: { type: "disabled" },
    }),
    timeoutMs,
    "Service IA trop lent",
  );
  const content = completion.choices[0]?.message?.content;
  if (!content || !content.trim()) throw new Error("Réponse IA vide.");
  const usage = (
    completion as unknown as { usage?: { prompt_tokens?: unknown; completion_tokens?: unknown } }
  ).usage;
  return {
    raw: content,
    promptTokens: Math.max(0, Math.round(Number(usage?.prompt_tokens ?? 0)) || 0),
    completionTokens: Math.max(0, Math.round(Number(usage?.completion_tokens ?? 0)) || 0),
  };
}

export interface RunGenerationInput {
  source: string;
  html: string;
  routes: PromptRoute[];
  interactions: PromptInteraction[];
  /** Délai imparti à chaque appel LLM. */
  llmTimeoutMs: number;
  /** Tentative de réparation IA (désactivée en mode synchrone pour limiter la durée totale). */
  repairEnabled: boolean;
}

/** Pipeline de conversion d'une page : IA → réparation → secours déterministe.
 * Ne lève jamais : renvoie toujours un résultat exploitable (bouclier final). */
export async function runPageGeneration(
  input: RunGenerationInput,
  startedAt: number,
): Promise<{ result: GenerateSuccess; timings: Timings; promptTokens: number; completionTokens: number }> {
  const { source, html, interactions, llmTimeoutMs, repairEnabled } = input;
  const allWarnings: string[] = [];
  const timings: Timings = { ...EMPTY_TIMINGS };
  let promptTokens = 0;
  let completionTokens = 0;
  let attempts = 0;
  let result: GenerateSuccess | null = null;

  // ── Tentative 1 : IA ─────────────────────────────────────────────────────
  try {
    attempts = 1;
    const system = buildGenerationSystemPrompt();
    const user = buildGenerationUserPrompt({
      pageSource: source,
      html,
      routes: input.routes,
      interactions,
    });
    const tLlm = Date.now();
    const call = await callLlm(system, user, llmTimeoutMs);
    timings.llmMs = Date.now() - tLlm;
    promptTokens += call.promptTokens;
    completionTokens += call.completionTokens;

    const tVal = Date.now();
    let parsed = validateAiOutput(extractJson(call.raw), interactions);
    timings.validateMs = Date.now() - tVal;

    // ── Tentative 2 : réparation ciblée ──────────────────────────────────
    if (!parsed.ok && repairEnabled) {
      allWarnings.push("Sortie IA invalide → tentative de réparation.");
      attempts = 2;
      const tRep = Date.now();
      const repairCall = await callLlm(system, buildRepairUserPrompt(parsed.errors, call.raw), llmTimeoutMs);
      timings.repairMs = Date.now() - tRep;
      promptTokens += repairCall.promptTokens;
      completionTokens += repairCall.completionTokens;
      const tVal2 = Date.now();
      const repaired = validateAiOutput(extractJson(repairCall.raw), interactions);
      timings.validateMs += Date.now() - tVal2;
      if (repaired.ok) {
        parsed = repaired;
        allWarnings.push("Réparation IA réussie (tentative 2).");
      } else {
        allWarnings.push(...parsed.errors.slice(0, 5));
      }
    } else if (!parsed.ok) {
      allWarnings.push(...parsed.errors.slice(0, 5));
    }

    if (parsed.ok) {
      const coveredIds = new Set(
        parsed.decisions
          .filter((d) => parsed!.components.some((c) => c.id === d.componentId))
          .map((d) => d.interactionId)
      );
      result = {
        components: parsed.components,
        decisions: parsed.decisions,
        warnings: [...parsed.warnings, ...allWarnings],
        engine: "ia",
        coverage: buildCoverage(interactions, parsed.components, coveredIds),
        durationMs: Date.now() - startedAt,
        timings,
        promptTokens,
        completionTokens,
        attempts,
      };
    }
  } catch (aiErr) {
    const message = aiErr instanceof Error ? aiErr.message.slice(0, 160) : "erreur";
    allWarnings.push(`IA indisponible : ${message}.`);
  }

  // ── Bouclier final : conversion déterministe (zéro page vide) ────────────
  if (!result) {
    const tFb = Date.now();
    const knownRoutes = input.routes.map((r) => r.route);
    const fb = htmlToFallbackComponents(html, interactions, knownRoutes);
    timings.fallbackMs = Date.now() - tFb;
    const coveredIds = new Set(fb.covered.keys());
    result = {
      components: fb.components,
      decisions: [],
      warnings: [...fb.warnings, ...allWarnings, "Converti avec le moteur de secours déterministe."],
      engine: "secours",
      coverage: buildCoverage(interactions, fb.components, coveredIds),
      durationMs: Date.now() - startedAt,
      timings,
      promptTokens,
      completionTokens,
      attempts,
    };
  }

  return { result, timings, promptTokens, completionTokens };
}

/** Reconstruit les interactions d'une source depuis le scanner (source de vérité). */
export function interactionsForSource(
  source: string,
  html: string,
): PromptInteraction[] {
  const blueprint = scanFiles([{ name: source, content: html }]);
  return blueprint.interactions.filter((i) => i.source === source);
}

/* ── File d'attente en arrière-plan (correctif 502) ─────────────────────────── */

interface QueuedTask {
  runId: string;
  source: string;
  html: string;
  hash: string;
  routes: PromptRoute[];
}

/** Tâches en cours (clé runId+source) : évite deux générations concurrentes
 * de la même page et permet d'enchaîner une réparation après la tâche active. */
const inFlight = new Map<string, Promise<void>>();

/** Démarre une génération en arrière-plan (sans jamais bloquer l'appelant).
 * Statuts persistés : generating → done | failed ; le client interroge /status. */
export function startQueuedGeneration(task: QueuedTask): void {
  const key = `${task.runId}\u0000${task.source}`;
  const previous = inFlight.get(key);
  const run = (async () => {
    if (previous) {
      try {
        await previous;
      } catch {
        /* la tâche précédente gère ses propres erreurs */
      }
    }
    const startedAt = Date.now();
    try {
      await markPageGenerating(task.runId, task.source, task.hash);
      const { result, timings, promptTokens, completionTokens } = await runPageGeneration(
        {
          source: task.source,
          html: task.html,
          routes: task.routes,
          interactions: interactionsForSource(task.source, task.html),
          llmTimeoutMs: LLM_TIMEOUT_QUEUED_MS,
          repairEnabled: true,
        },
        startedAt,
      );
      await persistPageDone(task.runId, task.source, task.hash, result, timings, promptTokens, completionTokens);
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 300) : "Erreur inconnue";
      console.error("[generator] queued generation failed:", message);
      try {
        const existing = await db.generatorPage.findUnique({
          where: { runId_fileName: { runId: task.runId, fileName: task.source } },
        });
        const data = { status: "failed", error: message, contentHash: task.hash };
        if (existing) await db.generatorPage.update({ where: { id: existing.id }, data });
        else await db.generatorPage.create({ data: { runId: task.runId, fileName: task.source, ...data } });
      } catch (dbErr) {
        console.error("[generator] failed to persist error state:", dbErr);
      }
    }
  })().finally(() => {
    if (inFlight.get(key) === run) inFlight.delete(key);
  });
  inFlight.set(key, run);
}

/** Le run a-t-il une génération actuellement en cours pour cette page ? */
export function isGenerationInFlight(runId: string, source: string): boolean {
  return inFlight.has(`${runId}\u0000${source}`);
}
