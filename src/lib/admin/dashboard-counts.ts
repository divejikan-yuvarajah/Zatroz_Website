/**
 * Pure helpers for admin dashboard count definitions (unit-testable).
 */

export type AdminDashboardCounts = Readonly<{
  /** Projects with no published summary revision. */
  drafts: number;
  /** Projects with a published summary revision. */
  published: number;
  /**
   * Operational attention: content jobs queued, leased, or failed.
   * Not a marketing “review queue” invention.
   */
  needingReview: number;
}>;

export type AdminRecentEdit = Readonly<{
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: string;
  createdAtIso: string;
}>;

export function classifyProjectPublication(pointers: {
  publishedSummaryRevisionId: string | null;
}): "draft" | "published" {
  return pointers.publishedSummaryRevisionId ? "published" : "draft";
}

export function isAttentionContentJobState(state: string): boolean {
  return state === "queued" || state === "leased" || state === "failed";
}

export function summarizePublicationCounts(
  projects: readonly { publishedSummaryRevisionId: string | null }[],
): Pick<AdminDashboardCounts, "drafts" | "published"> {
  let drafts = 0;
  let published = 0;
  for (const project of projects) {
    if (classifyProjectPublication(project) === "published") {
      published += 1;
    } else {
      drafts += 1;
    }
  }
  return { drafts, published };
}
