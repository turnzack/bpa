"use client";

/**
 * Couche d'accès données du frontend Forge Studio.
 * fetch() simple + helpers de parsing/normalisation (aucun provider externe).
 */

import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

/** Styles de scrollbar fine (zinc) à appliquer aux zones défilantes. */
export const SCROLLBAR_Y =
  "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent";
export const SCROLLBAR_X =
  "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent";

/**
 * Parse une valeur potentiellement sérialisée en JSON (layoutJson, nodesJson,
 * logsJson, data…). Tolère les chaînes invalides et les objets déjà parsés.
 */
export function parseJsonSafe<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  if (typeof raw !== "string") return raw as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Wrapper fetch : lève une Error lisible si la réponse n'est pas 2xx. */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!res.ok) {
    const payload = body as { error?: string; message?: string } | null;
    throw new Error(payload?.error || payload?.message || `Erreur ${res.status}`);
  }
  return body as T;
}

/** Formatage de date en français (dd/MM/yyyy HH:mm par défaut). */
export function formatDateFr(value: string | Date, pattern = "dd/MM/yyyy HH:mm"): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    return format(d, pattern, { locale: fr });
  } catch {
    return d.toISOString();
  }
}

/** Date relative en français (« il y a 3 minutes »). */
export function timeAgoFr(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    return formatDistanceToNow(d, { addSuffix: true, locale: fr });
  } catch {
    return d.toISOString();
  }
}

/** Normalise le champ `weeks` des sprints (chaîne ou tableau) en chaîne. */
export function formatWeeks(value: unknown): string {
  if (Array.isArray(value)) return value.map((v) => String(v)).join(" · ");
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
}
