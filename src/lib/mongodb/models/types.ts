/**
 * TypeScript document shapes for MongoDB application collections.
 * BSON Date fields are UTC instants; ObjectId is internal — public APIs use string IDs.
 */

import type { EnquiryNormalizedInput } from "@/lib/enquiries/input";
import type { EnquiryNotificationIntent } from "@/lib/enquiries/notification-intent";
import type { PublicationState, WorkStatus, MediaAlt } from "@/types/content";
import type {
  StoryContentBlock,
  ProjectStoryGalleryItem,
  ProjectStoryTestimonial,
} from "@/content/projects";
import type {
  EnquiryWorkflowStatus,
  MediaProcessingState,
  MediaVisibility,
  ContentJobState,
  AuditOutcome,
  SiteSettingsKey,
  ProjectRevisionKind,
} from "@/lib/mongodb/enums";

export type ObjectIdLike = { readonly _bsontype?: "ObjectId" } | string;

export type EnquiryDocument = {
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
  status: EnquiryWorkflowStatus;
  /** Opaque visitor-facing reference when acceptance is confirmed. */
  publicReference: string;
  /** SHA-256 hex (or similar) of the idempotency key material — unique ordinary index. */
  idempotencyDigest: string;
  fingerprintVersion: number;
  keyVersion: number;
  /** Keyed HMAC digest of the normalized payload — not unique alone. */
  payloadFingerprint: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  message: string;
  timeline: string | null;
  requestType: string;
  preferredContact: string;
  phone: string | null;
  /**
   * Durable team notification intent (Step 51).
   * Required on newly accepted enquiries; absent on legacy pre-51 rows.
   */
  notificationIntent?: EnquiryNotificationIntent;
};

/** Visitor-writable fields only — server metadata must never come from the client. */
export type EnquiryVisitorFields = EnquiryNormalizedInput;

export type ProjectSummarySnapshot = {
  title: string;
  summary: string;
  workStatus: WorkStatus;
  serviceIds: string[];
  contributors: string[];
  zatrozContribution: string;
  problem: string;
  approach: string;
  deliverables: string[];
  verifiedOutcomes: string[];
  mediaIds: string[];
  publicLinks: { label: string; href: string }[];
  editorialOrder: number | null;
};

export type ProjectStorySnapshot = {
  title: string;
  intro: string;
  context: StoryContentBlock[];
  contribution: StoryContentBlock[];
  solution: StoryContentBlock[];
  features: string[];
  processNotes: StoryContentBlock[];
  gallery: ProjectStoryGalleryItem[];
  technologies: string[];
  outcomes: string[];
  lessons: StoryContentBlock[];
  testimonial: ProjectStoryTestimonial | null;
  /** Never projected publicly. */
  reviewNotes?: string;
};

export type ProjectDocument = {
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
  /** Stable editorial identity (e.g. proj-flowpilot-ai). Retained even with ObjectId _id. */
  editorialId: string;
  /** Desired draft slug — must not replace live slug before publish. */
  draftSlug: string;
  draftTitle: string;
  /** Canonical published slug; null until a summary is published. */
  canonicalPublishedSlug: string | null;
  workStatus: WorkStatus;
  /** Pointer to editable draft revision (revisionId string). */
  draftRevisionId: string | null;
  /** Published summary revision pointer. */
  publishedSummaryRevisionId: string | null;
  /** Published story revision pointer (independent of summary). */
  publishedStoryRevisionId: string | null;
  /** Optimistic concurrency token. */
  concurrencyVersion: number;
};

export type ProjectRevisionDocument = {
  schemaVersion: number;
  createdAt: Date;
  revisionId: string;
  projectId: string;
  revisionNumber: number;
  kind: ProjectRevisionKind;
  summary: ProjectSummarySnapshot | null;
  story: ProjectStorySnapshot | null;
  /** Stable media identity references used by this revision. */
  mediaRefs: string[];
  createdByActorId: string;
};

export type MediaAssetDocument = {
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
  mediaId: string;
  /** Immutable version identity — replacing an asset creates a new version. */
  versionId: string;
  provider: string;
  providerAssetId: string;
  providerVersionId: string;
  width: number | null;
  height: number | null;
  mimeType: string;
  byteSize: number;
  alt: MediaAlt;
  caption: string | null;
  provenance: string | null;
  licence: string | null;
  generationBrief: string | null;
  processingState: MediaProcessingState;
  visibility: MediaVisibility;
  /** Folder/path hints are not access control. */
  storageHint: string | null;
};

export type SiteContentSettingsDocument = {
  schemaVersion: number;
  updatedAt: Date;
  settingsKey: SiteSettingsKey;
  featuredProjectIds: string[];
  concurrencyVersion: number;
};

export type AdminAuditEventDocument = {
  schemaVersion: number;
  createdAt: Date;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: AuditOutcome;
};

export type ContentJobDocument = {
  schemaVersion: number;
  createdAt: Date;
  updatedAt: Date;
  jobId: string;
  dedupeKey: string;
  state: ContentJobState;
  attempts: number;
  nextRunAt: Date | null;
  leaseOwner: string | null;
  leaseExpiresAt: Date | null;
};

export type RateLimitBucketDocument = {
  schemaVersion: number;
  bucketId: string;
  count: number;
  windowStart: Date;
  windowEnd: Date;
  expiresAt: Date;
};

export type SchemaMigrationLedgerDocument = {
  migrationId: string;
  checksum: string;
  appliedAt: Date;
  status: "applied" | "in_progress";
  targetLabel: string;
};

/** Fields excluded from any public DTO / response. */
export const ENQUIRY_PRIVATE_FIELDS = [
  "idempotencyDigest",
  "payloadFingerprint",
  "fingerprintVersion",
  "keyVersion",
  "status",
  "_id",
] as const;

export const PROJECT_PRIVATE_FIELDS = [
  "draftRevisionId",
  "draftSlug",
  "draftTitle",
  "concurrencyVersion",
  "reviewNotes",
] as const;

export type PublicationStateDoc = PublicationState;
