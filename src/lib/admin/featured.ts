/**
 * Pure helpers for A09 featured-project settings (owner-only order).
 */

import { DB_ARRAY_LIMITS } from "@/lib/mongodb/limits";
import { validateFeaturedProjectIds } from "@/lib/mongodb/models/validate";

export const FEATURED_SETTINGS_KEY = "featured_projects" as const;
export const FEATURED_PUBLIC_LIMIT = 3;

export type FeaturedCandidate = Readonly<{
  editorialId: string;
  title: string;
  slug: string;
  summaryPublished: boolean;
}>;

export type FeaturedFormParseResult =
  | { ok: true; featuredProjectIds: readonly string[] }
  | { ok: false; message: string };

/**
 * Parse ordered editorial IDs from a multiline / comma-separated form field,
 * or from repeated `featuredProjectIds` checkbox values.
 */
export function parseFeaturedProjectIdsForm(
  formData: FormData,
): FeaturedFormParseResult {
  const repeated = formData
    .getAll("featuredProjectIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  let ids: string[];
  if (repeated.length > 0) {
    ids = repeated;
  } else {
    const raw = String(formData.get("featuredProjectIdsText") ?? "").trim();
    if (!raw) {
      ids = [];
    } else {
      ids = raw
        .split(/[\n,]+/)
        .map((part) => part.trim())
        .filter(Boolean);
    }
  }

  const validated = validateFeaturedProjectIds(ids);
  if (!validated.ok) {
    return {
      ok: false,
      message: validated.issues[0]?.message ?? "Invalid featured project list.",
    };
  }

  return { ok: true, featuredProjectIds: ids };
}

export function assertFeaturedIdsArePublicReady(input: {
  featuredProjectIds: readonly string[];
  publicReadyIds: ReadonlySet<string>;
}): FeaturedFormParseResult {
  for (const id of input.featuredProjectIds) {
    if (!input.publicReadyIds.has(id)) {
      return {
        ok: false,
        message: `Project "${id}" is not published and cannot be featured.`,
      };
    }
  }
  if (input.featuredProjectIds.length > DB_ARRAY_LIMITS.maxFeaturedProjectIds) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxFeaturedProjectIds} featured IDs.`,
    };
  }
  return { ok: true, featuredProjectIds: input.featuredProjectIds };
}

/** Drop IDs that are not currently public-ready (honest empty public behaviour). */
export function filterPublicReadyFeaturedIds(input: {
  featuredProjectIds: readonly string[];
  publicReadyIds: ReadonlySet<string>;
}): string[] {
  return input.featuredProjectIds.filter((id) => input.publicReadyIds.has(id));
}

export function orderCandidatesByFeatured(
  candidates: readonly FeaturedCandidate[],
  featuredProjectIds: readonly string[],
): {
  featured: FeaturedCandidate[];
  available: FeaturedCandidate[];
} {
  const byId = new Map(candidates.map((c) => [c.editorialId, c]));
  const featured: FeaturedCandidate[] = [];
  const used = new Set<string>();
  for (const id of featuredProjectIds) {
    const row = byId.get(id);
    if (!row) continue;
    featured.push(row);
    used.add(id);
  }
  const available = candidates.filter((c) => !used.has(c.editorialId));
  return { featured, available };
}
