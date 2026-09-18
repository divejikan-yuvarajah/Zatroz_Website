/**
 * Stable MongoDB collection names for the Zatroz application database.
 * Do not rename lightly — migrations and privileges key off these strings.
 */

export const COLLECTION_NAMES = {
  enquiries: "enquiries",
  projects: "projects",
  projectRevisions: "project_revisions",
  mediaAssets: "media_assets",
  siteContentSettings: "site_content_settings",
  adminAuditEvents: "admin_audit_events",
  contentJobs: "content_jobs",
  rateLimitBuckets: "rate_limit_buckets",
  schemaMigrations: "_schema_migrations",
  schemaMigrationLock: "_schema_migration_lock",
} as const;

export type CollectionName =
  (typeof COLLECTION_NAMES)[keyof typeof COLLECTION_NAMES];

/** Application collections that receive validators/indexes in Step 45. */
export const APPLICATION_COLLECTION_NAMES = [
  COLLECTION_NAMES.enquiries,
  COLLECTION_NAMES.projects,
  COLLECTION_NAMES.projectRevisions,
  COLLECTION_NAMES.mediaAssets,
  COLLECTION_NAMES.siteContentSettings,
  COLLECTION_NAMES.adminAuditEvents,
  COLLECTION_NAMES.contentJobs,
  COLLECTION_NAMES.rateLimitBuckets,
] as const;

/** Ledger/lock collections managed by migration tooling only. */
export const MIGRATION_META_COLLECTION_NAMES = [
  COLLECTION_NAMES.schemaMigrations,
  COLLECTION_NAMES.schemaMigrationLock,
] as const;
