import "server-only";

import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import {
  type AdminDashboardCounts,
  type AdminRecentEdit,
} from "@/lib/admin/dashboard-counts";
import { sanitizeMongoError } from "@/lib/mongodb/config";

export type AdminDashboardData =
  | {
      ok: true;
      counts: AdminDashboardCounts;
      recentEdits: readonly AdminRecentEdit[];
      source: "mongodb";
    }
  | {
      ok: false;
      reason: "unavailable";
      detail: string;
    };

const RECENT_EDIT_LIMIT = 8;

/**
 * Real Mongo aggregates for the admin dashboard.
 * Returns unavailable (not invented zeros from a fake store) when Mongo is down.
 * Empty collections correctly report zero.
 */
export async function loadAdminDashboardData(): Promise<AdminDashboardData> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured in this environment.",
    };
  }

  try {
    const db = await getDb();
    const projects = db.collection(COLLECTION_NAMES.projects);
    const jobs = db.collection(COLLECTION_NAMES.contentJobs);
    const audits = db.collection(COLLECTION_NAMES.adminAuditEvents);

    const [drafts, published, needingReview, recentRaw] = await Promise.all([
      projects.countDocuments({ publishedSummaryRevisionId: null }),
      projects.countDocuments({
        publishedSummaryRevisionId: { $ne: null },
      }),
      jobs.countDocuments({
        state: { $in: ["queued", "leased", "failed"] },
      }),
      audits
        .find(
          {},
          {
            projection: {
              _id: 1,
              action: 1,
              targetType: 1,
              targetId: 1,
              outcome: 1,
              createdAt: 1,
            },
          },
        )
        .sort({ createdAt: -1 })
        .limit(RECENT_EDIT_LIMIT)
        .toArray(),
    ]);

    const recentEdits: AdminRecentEdit[] = recentRaw.map((doc) => {
      const createdAt =
        doc.createdAt instanceof Date
          ? doc.createdAt.toISOString()
          : new Date(0).toISOString();
      return {
        id: String(doc._id),
        action: typeof doc.action === "string" ? doc.action : "unknown",
        targetType:
          typeof doc.targetType === "string" ? doc.targetType : "unknown",
        targetId: typeof doc.targetId === "string" ? doc.targetId : "",
        outcome: typeof doc.outcome === "string" ? doc.outcome : "unknown",
        createdAtIso: createdAt,
      };
    });

    return {
      ok: true,
      counts: {
        drafts,
        published,
        needingReview,
      },
      recentEdits,
      source: "mongodb",
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}
