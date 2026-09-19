import "server-only";

import { Int32 } from "mongodb";
import {
  FEATURED_SETTINGS_KEY,
  type FeaturedCandidate,
} from "@/lib/admin/featured";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import { validateFeaturedProjectIds } from "@/lib/mongodb/models/validate";
import { listArchivedEditorialIds } from "@/server/projects/admin-state";

export type FeaturedSettingsLoad =
  | {
      ok: true;
      featuredProjectIds: readonly string[];
      concurrencyVersion: number;
      candidates: readonly FeaturedCandidate[];
    }
  | { ok: false; reason: "unavailable"; detail: string };

export type FeaturedSettingsSaveResult =
  | {
      ok: true;
      featuredProjectIds: readonly string[];
      concurrencyVersion: number;
      message: string;
    }
  | {
      ok: false;
      reason: "unavailable" | "conflict" | "validation";
      detail: string;
    };

export async function loadFeaturedProjectIds(): Promise<readonly string[]> {
  if (!isMongoRuntimeConfigured()) return [];
  try {
    const db = await getDb();
    const row = await db
      .collection(COLLECTION_NAMES.siteContentSettings)
      .findOne({ settingsKey: FEATURED_SETTINGS_KEY });
    if (!row || !Array.isArray(row.featuredProjectIds)) return [];
    return row.featuredProjectIds.filter(
      (id): id is string => typeof id === "string",
    );
  } catch {
    return [];
  }
}

async function listPublicReadyCandidates(): Promise<
  readonly FeaturedCandidate[]
> {
  if (!isMongoRuntimeConfigured()) return [];
  try {
    const db = await getDb();
    const archived = new Set(await listArchivedEditorialIds());
    const docs = await db
      .collection(COLLECTION_NAMES.projects)
      .find({
        publishedSummaryRevisionId: { $ne: null },
        canonicalPublishedSlug: { $ne: null },
      })
      .project({
        editorialId: 1,
        draftTitle: 1,
        canonicalPublishedSlug: 1,
        publishedSummaryRevisionId: 1,
      })
      .toArray();

    return docs
      .filter(
        (doc) =>
          typeof doc.editorialId === "string" &&
          !archived.has(doc.editorialId) &&
          typeof doc.canonicalPublishedSlug === "string",
      )
      .map((doc) => ({
        editorialId: doc.editorialId as string,
        title:
          typeof doc.draftTitle === "string" && doc.draftTitle.trim()
            ? doc.draftTitle
            : (doc.editorialId as string),
        slug: doc.canonicalPublishedSlug as string,
        summaryPublished: Boolean(doc.publishedSummaryRevisionId),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    return [];
  }
}

export async function loadFeaturedSettings(): Promise<FeaturedSettingsLoad> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const db = await getDb();
    const row = await db
      .collection(COLLECTION_NAMES.siteContentSettings)
      .findOne({ settingsKey: FEATURED_SETTINGS_KEY });

    const featuredProjectIds =
      row && Array.isArray(row.featuredProjectIds)
        ? row.featuredProjectIds.filter(
            (id): id is string => typeof id === "string",
          )
        : [];
    const concurrencyVersion =
      row && typeof row.concurrencyVersion === "number"
        ? Number(row.concurrencyVersion)
        : row && row.concurrencyVersion != null
          ? Number(row.concurrencyVersion)
          : 0;

    const candidates = await listPublicReadyCandidates();

    return {
      ok: true,
      featuredProjectIds,
      concurrencyVersion,
      candidates,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function saveFeaturedProjectIds(input: {
  featuredProjectIds: readonly string[];
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<FeaturedSettingsSaveResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  const validated = validateFeaturedProjectIds(input.featuredProjectIds);
  if (!validated.ok) {
    return {
      ok: false,
      reason: "validation",
      detail: validated.issues[0]?.message ?? "Invalid featured list.",
    };
  }

  try {
    const candidates = await listPublicReadyCandidates();
    const ready = new Set(candidates.map((c) => c.editorialId));
    for (const id of input.featuredProjectIds) {
      if (!ready.has(id)) {
        return {
          ok: false,
          reason: "validation",
          detail: `Project "${id}" is not published and cannot be featured.`,
        };
      }
    }

    const db = await getDb();
    const existing = await db
      .collection(COLLECTION_NAMES.siteContentSettings)
      .findOne({ settingsKey: FEATURED_SETTINGS_KEY });

    const currentVersion =
      existing && existing.concurrencyVersion != null
        ? Number(existing.concurrencyVersion)
        : 0;

    if (currentVersion !== input.expectedConcurrencyVersion) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "Featured settings were changed by someone else. Reload, then save again.",
      };
    }

    const nextVersion = currentVersion + 1;
    const now = new Date();
    const ids = [...input.featuredProjectIds];

    if (!existing) {
      await db.collection(COLLECTION_NAMES.siteContentSettings).insertOne({
        schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
        updatedAt: now,
        settingsKey: FEATURED_SETTINGS_KEY,
        featuredProjectIds: ids,
        concurrencyVersion: new Int32(nextVersion),
      });
    } else {
      const update = await db
        .collection(COLLECTION_NAMES.siteContentSettings)
        .updateOne(
          {
            settingsKey: FEATURED_SETTINGS_KEY,
            concurrencyVersion: input.expectedConcurrencyVersion,
          },
          {
            $set: {
              featuredProjectIds: ids,
              updatedAt: now,
              concurrencyVersion: new Int32(nextVersion),
            },
          },
        );
      if (update.matchedCount === 0) {
        return {
          ok: false,
          reason: "conflict",
          detail:
            "Featured settings were changed by someone else. Reload, then save again.",
        };
      }
    }

    void input.actorId;

    return {
      ok: true,
      featuredProjectIds: ids,
      concurrencyVersion: nextVersion,
      message:
        ids.length === 0
          ? "Featured list cleared. Homepage selected work stays hidden until IDs are set."
          : `Saved ${ids.length} featured project(s) for the homepage.`,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}
