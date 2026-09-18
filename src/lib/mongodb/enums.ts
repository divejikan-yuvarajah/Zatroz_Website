/**
 * Server-owned and shared enumeration values for MongoDB documents.
 */

export const ENQUIRY_WORKFLOW_STATUSES = [
  "new",
  "reviewed",
  "archived",
] as const;

export type EnquiryWorkflowStatus = (typeof ENQUIRY_WORKFLOW_STATUSES)[number];

export const MEDIA_PROCESSING_STATES = [
  "pending",
  "ready",
  "failed",
  "archived",
] as const;

export type MediaProcessingState = (typeof MEDIA_PROCESSING_STATES)[number];

export const MEDIA_VISIBILITY_VALUES = ["private", "public"] as const;

export type MediaVisibility = (typeof MEDIA_VISIBILITY_VALUES)[number];

export const CONTENT_JOB_STATES = [
  "queued",
  "leased",
  "succeeded",
  "failed",
  "cancelled",
] as const;

export type ContentJobState = (typeof CONTENT_JOB_STATES)[number];

export const AUDIT_OUTCOMES = ["succeeded", "failed", "denied"] as const;

export type AuditOutcome = (typeof AUDIT_OUTCOMES)[number];

export const SITE_SETTINGS_KEYS = ["featured_projects"] as const;

export type SiteSettingsKey = (typeof SITE_SETTINGS_KEYS)[number];

export const PROJECT_REVISION_KINDS = [
  "summary",
  "story",
  "summary_and_story",
] as const;

export type ProjectRevisionKind = (typeof PROJECT_REVISION_KINDS)[number];

/** Allowed enquiry → next workflow transitions (server-owned). */
export const ENQUIRY_STATUS_TRANSITIONS: Readonly<
  Record<EnquiryWorkflowStatus, readonly EnquiryWorkflowStatus[]>
> = {
  new: ["reviewed", "archived"],
  reviewed: ["archived", "new"],
  archived: ["reviewed"],
};

/**
 * Project publication pointer transitions are application-enforced.
 * Draft slug/title never overwrite canonicalPublishedSlug until publish.
 */
export const PROJECT_POINTER_RULES = {
  draftDoesNotReplaceLiveSlug: true,
  summaryAndStoryIndependent: true,
} as const;
