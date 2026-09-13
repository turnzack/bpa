/**
 * Sécurité ZIP serveur (Sprint G3 — « Niveau Gold »).
 * Extraction d'archives .zip entièrement côté serveur avec boucliers :
 * - Zip Slip : refus des chemins absolus, remontées « .. », lettres de lecteur, NUL
 * - Limites : taille de l'archive, taille décompressée totale, taille par entrée,
 *   nombre d'entrées, profondeur de chemins
 * - Filtres : seuls les fichiers .html/.htm/.txt sont retenus, dossiers & doublons ignorés
 * Aucune écriture disque : les entrées sont lues en mémoire (JSZip) après validation,
 * ce qui élimine structurellement le risque d'extraction hors dossier.
 */

import JSZip from "jszip";

export interface ExtractedFile {
  name: string;
  content: string;
}

export interface RejectedEntry {
  name: string;
  reason: string;
}

export interface SafeZipResult {
  files: ExtractedFile[];
  rejected: RejectedEntry[];
  warnings: string[];
}

// ─── Limites (babouche de sécurité, alignées sur le scanner Blueprint) ──────
export const ZIP_LIMITS = {
  /** Taille maximale de l'archive téléversée (10 Mo). */
  MAX_ZIP_BYTES: 10 * 1024 * 1024,
  /** Taille maximale cumulée du contenu décompressé (20 Mo). */
  MAX_TOTAL_UNCOMPRESSED: 20 * 1024 * 1024,
  /** Taille maximale d'un fichier extrait (500 000 caractères, aligné sur l'API). */
  MAX_FILE_CHARS: 500_000,
  /** Nombre maximal de fichiers HTML retenus (aligné sur le scanner). */
  MAX_FILES: 50,
  /** Nombre maximal d'entrées examinées dans l'archive. */
  MAX_ENTRIES: 300,
  /** Profondeur maximale d'un chemin d'entrée. */
  MAX_DEPTH: 8,
} as const;

export class ZipSecurityError extends Error {}

/**
 * Valide et normalise le nom d'une entrée d'archive.
 * Lève ZipSecurityError si le chemin est dangereux (zip slip).
 * Retourne le nom normalisé (slashes « / », sans segments vides ni « . »).
 */
export function assertSafeEntryName(rawName: string): string {
  if (!rawName || rawName.includes("\0")) {
    throw new ZipSecurityError("Nom d'entrée vide ou invalide.");
  }
  const normalized = rawName.replace(/\\/g, "/");
  if (normalized.startsWith("/")) {
    throw new ZipSecurityError("Chemin absolu refusé (zip slip).");
  }
  if (/^[a-zA-Z]:/.test(normalized)) {
    throw new ZipSecurityError("Lettre de lecteur refusée (zip slip).");
  }
  const parts = normalized.split("/").filter((p) => p.length > 0 && p !== ".");
  if (parts.length === 0) {
    throw new ZipSecurityError("Chemin d'entrée vide.");
  }
  if (parts.some((p) => p === "..")) {
    throw new ZipSecurityError("Remontée de chemin « .. » refusée (zip slip).");
  }
  if (parts.length > ZIP_LIMITS.MAX_DEPTH) {
    throw new ZipSecurityError(`Profondeur de chemin > ${ZIP_LIMITS.MAX_DEPTH} refusée.`);
  }
  // Contrôle final par canonisation : le nom doit rester un chemin relatif propre.
  const joined = parts.join("/");
  if (joined.startsWith("/") || joined.includes("//")) {
    throw new ZipSecurityError("Chemin d'entrée anormal.");
  }
  return joined;
}

/** Fichiers conservés par l'extraction (pages HTML + txt pour collage). */
function isUsableEntry(name: string): boolean {
  return /\.(html?|htm|txt)$/i.test(name);
}

/**
 * Extrait une archive ZIP (buffer) en liste de fichiers texte sûrs.
 * Tolérante : les entrées problématiques sont signalées (rejected), pas fatales,
 * sauf pour les limites globales (archive illisible, trop volumineuse).
 */
export async function extractZipSafe(buffer: Buffer): Promise<SafeZipResult> {
  if (buffer.length === 0) throw new ZipSecurityError("Archive vide.");
  if (buffer.length > ZIP_LIMITS.MAX_ZIP_BYTES) {
    throw new ZipSecurityError(
      `Archive trop volumineuse (${(buffer.length / 1024 / 1024).toFixed(1)} Mo) — maximum ${ZIP_LIMITS.MAX_ZIP_BYTES / 1024 / 1024} Mo.`,
    );
  }

  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new ZipSecurityError("Archive illisible ou corrompue (ZIP attendu).");
  }

  const files: ExtractedFile[] = [];
  const rejected: RejectedEntry[] = [];
  const warnings: string[] = [];
  const seenNames = new Set<string>();
  let totalChars = 0;
  let entries = 0;

  const entriesList = Object.values(zip.files);
  for (const entry of entriesList) {
    entries += 1;
    if (entries > ZIP_LIMITS.MAX_ENTRIES) {
      warnings.push(`Archive très dense : examinées limitées aux ${ZIP_LIMITS.MAX_ENTRIES} premières entrées.`);
      break;
    }
    if (entry.dir) continue;
    if (entry.name.includes("__MACOSX") || entry.name.split("/").some((p) => p.startsWith("."))) continue;

    // 1) Zip Slip : validation stricte du chemin (peut lever → rejeté, non fatal).
    let safeName: string;
    try {
      safeName = assertSafeEntryName(entry.name);
    } catch (err) {
      rejected.push({
        name: entry.name.slice(0, 120),
        reason: err instanceof ZipSecurityError ? err.message : "Chemin dangereux refusé.",
      });
      continue;
    }

    // 2) Filtrage par type.
    if (!isUsableEntry(safeName)) {
      rejected.push({ name: safeName.slice(0, 120), reason: "Type non supporté (HTML attendu)." });
      continue;
    }

    // 3) Nom lisible : on conserve les deux derniers segments (dossier parent + fichier),
    //    comme le faisait l'extraction client — index.html/code.html restent traçables.
    const display = safeName.split("/").slice(-2).join("/");
    if (seenNames.has(display)) {
      rejected.push({ name: safeName.slice(0, 120), reason: "Doublon de nom (premier fichier conservé)." });
      continue;
    }

    // 4) Limites de taille.
    const content = await entry.async("string");
    if (content.length > ZIP_LIMITS.MAX_FILE_CHARS) {
      rejected.push({ name: display, reason: `Fichier trop volumineux (> ${ZIP_LIMITS.MAX_FILE_CHARS} caractères).` });
      continue;
    }
    totalChars += content.length;
    if (totalChars > ZIP_LIMITS.MAX_TOTAL_UNCOMPRESSED) {
      warnings.push(`Contenu décompressé limité à ${ZIP_LIMITS.MAX_TOTAL_UNCOMPRESSED / 1024 / 1024} Mo.`);
      break;
    }
    if (files.length >= ZIP_LIMITS.MAX_FILES) {
      warnings.push(`Limité aux ${ZIP_LIMITS.MAX_FILES} premiers fichiers HTML.`);
      break;
    }

    seenNames.add(display);
    files.push({ name: display, content });
  }

  if (files.length === 0 && rejected.length === 0) {
    warnings.push("Aucun fichier exploitable trouvé dans l'archive.");
  }

  return { files, rejected: rejected.slice(0, 20), warnings };
}
