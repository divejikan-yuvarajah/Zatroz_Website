/**
 * Pure helpers for A11 content job refresh / retry scheduling.
 */

export const CONTENT_JOB_MAX_ATTEMPTS = 5;

/** Base delay (ms) before first retry; doubles each attempt. */
export const CONTENT_JOB_RETRY_BASE_MS = 30_000;

export const CONTENT_JOB_LEASE_MS = 60_000;

export type ContentJobKind = "publish-refresh" | "unknown";

export function parsePublishRefreshDedupeKey(dedupeKey: string): {
  kind: ContentJobKind;
  editorialId: string | null;
  action: string | null;
} {
  const trimmed = dedupeKey.trim();
  if (!trimmed.startsWith("publish-refresh:")) {
    return { kind: "unknown", editorialId: null, action: null };
  }
  const rest = trimmed.slice("publish-refresh:".length);
  const sep = rest.indexOf(":");
  if (sep <= 0) {
    return { kind: "publish-refresh", editorialId: rest || null, action: null };
  }
  return {
    kind: "publish-refresh",
    editorialId: rest.slice(0, sep) || null,
    action: rest.slice(sep + 1) || null,
  };
}

export function buildPublishRefreshDedupeKey(input: {
  editorialId: string;
  action: string;
}): string {
  return `publish-refresh:${input.editorialId}:${input.action}`;
}

export function nextRetryDelayMs(attemptsAfterFailure: number): number {
  const safe = Math.max(
    1,
    Math.min(attemptsAfterFailure, CONTENT_JOB_MAX_ATTEMPTS),
  );
  return CONTENT_JOB_RETRY_BASE_MS * 2 ** (safe - 1);
}

export function shouldRetryAfterFailure(attempts: number): boolean {
  return attempts < CONTENT_JOB_MAX_ATTEMPTS;
}

/**
 * When a publish pointer is live but a refresh job is still open,
 * admin UI can show “published, refresh pending”.
 */
export function isRefreshPendingJobState(state: string): boolean {
  return state === "queued" || state === "leased" || state === "failed";
}

export function formatRefreshPendingLabel(input: {
  summaryPublished: boolean;
  hasOpenRefreshJob: boolean;
}): string | null {
  if (!input.summaryPublished || !input.hasOpenRefreshJob) return null;
  return "Published, refresh pending";
}

/**
 * Decide whether enqueue should insert, reuse, or no-op.
 * Unique dedupeKey spans all states — never insert a second row.
 */
export function planContentJobEnqueue(
  existing: {
    state: string;
  } | null,
): "insert" | "requeue" | "noop" {
  if (!existing) return "insert";
  if (existing.state === "queued" || existing.state === "leased") {
    return "noop";
  }
  // succeeded / failed / cancelled → reuse the same document
  return "requeue";
}
