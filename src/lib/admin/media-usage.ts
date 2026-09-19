/**
 * Pure helpers for A11 media usage dependency checks and cleanup eligibility.
 */

export type MediaUsageRef = Readonly<{
  editorialId: string;
  revisionId: string;
  kind: "summary" | "story" | "revision-ref";
}>;

export type PermanentDeleteAssessment =
  | { ok: true }
  | {
      ok: false;
      code: "in-use" | "not-archived-or-failed" | "missing";
      message: string;
    };

/**
 * Durable public delivery paths allowed in anonymous HTML.
 * Site-relative paths (migration / static) or absolute https Cloudinary URLs.
 */
export function isDurablePublicDeliveryPath(
  value: string | null | undefined,
): boolean {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) return true;
  if (trimmed.startsWith("https://")) return true;
  return false;
}

export function publicDeliveryPublicId(authenticatedPublicId: string): string {
  return `${authenticatedPublicId}__pub`;
}

/**
 * Permanent delete is allowed only for archived or failed versions that
 * are not referenced by any project revision.
 */
export function assessPermanentDeleteEligibility(input: {
  exists: boolean;
  processingState: string;
  usageCount: number;
}): PermanentDeleteAssessment {
  if (!input.exists) {
    return {
      ok: false,
      code: "missing",
      message: "Media version was not found.",
    };
  }
  if (
    input.processingState !== "archived" &&
    input.processingState !== "failed"
  ) {
    return {
      ok: false,
      code: "not-archived-or-failed",
      message:
        "Archive or mark failed before permanent delete. Ready or pending media cannot be destroyed.",
    };
  }
  if (input.usageCount > 0) {
    return {
      ok: false,
      code: "in-use",
      message: `Media is still referenced by ${input.usageCount} revision(s). Remove references first.`,
    };
  }
  return { ok: true };
}

export function collectMediaIdsFromRevisionPayload(input: {
  mediaRefs?: readonly string[] | null;
  summaryMediaIds?: readonly string[] | null;
  galleryMediaIds?: readonly string[] | null;
}): string[] {
  const ids = new Set<string>();
  for (const id of input.mediaRefs ?? []) {
    if (id.trim()) ids.add(id.trim());
  }
  for (const id of input.summaryMediaIds ?? []) {
    if (id.trim()) ids.add(id.trim());
  }
  for (const id of input.galleryMediaIds ?? []) {
    if (id.trim()) ids.add(id.trim());
  }
  return [...ids];
}

export function classifyCleanupCandidate(input: {
  processingState: string;
  usageCount: number;
}): "failed-orphan" | "archived-unused" | "in-use" | "active" {
  if (input.usageCount > 0) return "in-use";
  if (input.processingState === "failed") return "failed-orphan";
  if (input.processingState === "archived") return "archived-unused";
  return "active";
}
