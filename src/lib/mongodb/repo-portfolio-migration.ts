/**
 * A10 repository → Mongo portfolio migration apply (maintenance CLI only).
 * Not imported by the web runtime.
 */

import { randomBytes } from "node:crypto";
import { Int32, MongoClient, type Db } from "mongodb";
import { contentCatalog } from "@/content/catalog";
import { FEATURED_SETTINGS_KEY } from "@/lib/admin/featured";
import {
  formatRepoPortfolioPlan,
  planRepoPortfolioMigration,
  REPO_MIGRATION_ACTOR_ID,
  REPO_PORTFOLIO_MIGRATION_ID,
  type RepoPortfolioMigrationPlan,
} from "@/lib/admin/repo-migration";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import {
  assertNonProductionApply,
  resolveMigrationEnv,
} from "@/lib/mongodb/migrations/env";

export type RepoPortfolioApplyResult =
  | {
      ok: true;
      mode: "dry-run" | "applied" | "no-op";
      plan: RepoPortfolioMigrationPlan;
      message: string;
    }
  | {
      ok: false;
      plan?: RepoPortfolioMigrationPlan;
      message: string;
    };

async function loadExistingIds(db: Db): Promise<{
  editorialIds: Set<string>;
  mediaIds: Set<string>;
}> {
  const [projects, media] = await Promise.all([
    db
      .collection(COLLECTION_NAMES.projects)
      .find({}, { projection: { editorialId: 1 } })
      .toArray(),
    db
      .collection(COLLECTION_NAMES.mediaAssets)
      .find({}, { projection: { mediaId: 1 } })
      .toArray(),
  ]);

  return {
    editorialIds: new Set(
      projects
        .map((row) =>
          typeof row.editorialId === "string" ? row.editorialId : null,
        )
        .filter((id): id is string => Boolean(id)),
    ),
    mediaIds: new Set(
      media
        .map((row) => (typeof row.mediaId === "string" ? row.mediaId : null))
        .filter((id): id is string => Boolean(id)),
    ),
  };
}

function createRevisionId(editorialId: string, revisionNumber: number): string {
  return `rev_${editorialId}_${revisionNumber}_${randomBytes(4).toString("hex")}`.slice(
    0,
    80,
  );
}

export function buildCatalogRepoPortfolioPlan(input?: {
  existingEditorialIds?: ReadonlySet<string>;
  existingMediaIds?: ReadonlySet<string>;
}): RepoPortfolioMigrationPlan {
  return planRepoPortfolioMigration({
    projects: contentCatalog.projects,
    media: contentCatalog.media,
    featuredProjectIds: contentCatalog.featuredProjectIds,
    existingEditorialIds: input?.existingEditorialIds,
    existingMediaIds: input?.existingMediaIds,
  });
}

async function applyPlan(
  db: Db,
  plan: RepoPortfolioMigrationPlan,
): Promise<void> {
  const now = new Date();

  for (const item of plan.media) {
    if (item.action !== "insert") continue;
    await db.collection(COLLECTION_NAMES.mediaAssets).insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: now,
      updatedAt: now,
      mediaId: item.mediaId,
      versionId: item.versionId,
      provider: "repository",
      providerAssetId: item.mediaId,
      providerVersionId: item.versionId,
      width: item.width == null ? null : new Int32(item.width),
      height: item.height == null ? null : new Int32(item.height),
      mimeType: "image/webp",
      byteSize: new Int32(0),
      alt: item.alt,
      caption: item.caption,
      provenance: "Imported from repository catalog (A10).",
      licence: null,
      generationBrief: null,
      processingState: item.processingState,
      visibility: item.visibility,
      storageHint: item.publicPath || null,
    });
  }

  for (const item of plan.projects) {
    if (item.action !== "insert") continue;

    const revisionNumber = 1;
    const revisionId = createRevisionId(item.editorialId, revisionNumber);
    const kind = item.story ? "summary_and_story" : "summary";

    const mediaRefs = [
      ...new Set([
        ...item.summary.mediaIds,
        ...(item.story?.gallery.map((g) => g.mediaId) ?? []),
      ]),
    ];

    await db.collection(COLLECTION_NAMES.projectRevisions).insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: now,
      revisionId,
      projectId: item.editorialId,
      revisionNumber: new Int32(revisionNumber),
      kind,
      summary: item.summary,
      story: item.story,
      mediaRefs,
      createdByActorId: REPO_MIGRATION_ACTOR_ID,
    });

    await db.collection(COLLECTION_NAMES.projects).insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: now,
      updatedAt: now,
      editorialId: item.editorialId,
      draftSlug: item.slug,
      draftTitle: item.title,
      canonicalPublishedSlug: item.publishSummary ? item.slug : null,
      workStatus: item.workStatus,
      draftRevisionId: revisionId,
      publishedSummaryRevisionId: item.publishSummary ? revisionId : null,
      publishedStoryRevisionId: item.publishStory ? revisionId : null,
      concurrencyVersion: new Int32(1),
    });
  }

  if (plan.featuredToWrite.length > 0) {
    await db.collection(COLLECTION_NAMES.siteContentSettings).updateOne(
      { settingsKey: FEATURED_SETTINGS_KEY },
      {
        $set: {
          schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
          updatedAt: now,
          settingsKey: FEATURED_SETTINGS_KEY,
          featuredProjectIds: [...plan.featuredToWrite],
          concurrencyVersion: new Int32(1),
        },
      },
      { upsert: true },
    );
  }

  await db.collection(COLLECTION_NAMES.adminAuditEvents).insertOne({
    schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
    createdAt: now,
    actorId: REPO_MIGRATION_ACTOR_ID,
    action: "migration.repo_portfolio_apply",
    targetType: "migration",
    targetId: REPO_PORTFOLIO_MIGRATION_ID,
    outcome: "succeeded",
  });
}

export async function runRepoPortfolioMigration(input: {
  target: string;
  apply: boolean;
}): Promise<RepoPortfolioApplyResult> {
  const env = resolveMigrationEnv();
  if (!env.ok) {
    return {
      ok: false,
      message: env.issues.join(" "),
    };
  }

  const refuse = assertNonProductionApply(input.target, env.config.appEnv);
  if (refuse) {
    return { ok: false, message: refuse };
  }

  const client = new MongoClient(env.config.uri);
  try {
    await client.connect();
    const db = client.db(env.config.dbName);
    const existing = await loadExistingIds(db);
    const plan = buildCatalogRepoPortfolioPlan({
      existingEditorialIds: existing.editorialIds,
      existingMediaIds: existing.mediaIds,
    });

    if (!input.apply) {
      return {
        ok: true,
        mode: "dry-run",
        plan,
        message: `Dry-run only. ${formatRepoPortfolioPlan(plan)}`,
      };
    }

    const toInsert =
      plan.counts.mediaInsert +
      plan.counts.projectInsert +
      (plan.featuredToWrite.length > 0 ? 1 : 0);

    if (toInsert === 0) {
      return {
        ok: true,
        mode: "no-op",
        plan,
        message: `Nothing to insert (idempotent). ${formatRepoPortfolioPlan(plan)}`,
      };
    }

    await applyPlan(db, plan);

    return {
      ok: true,
      mode: "applied",
      plan,
      message: `Applied ${REPO_PORTFOLIO_MIGRATION_ID}. ${formatRepoPortfolioPlan(plan)}`,
    };
  } catch {
    return {
      ok: false,
      message: "Repository portfolio migration failed (details omitted).",
    };
  } finally {
    await client.close().catch(() => undefined);
  }
}

export { formatRepoPortfolioPlan };
