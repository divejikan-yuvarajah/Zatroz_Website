/**
 * Named collection validators and indexes for Step 45 migrations.
 * Validators reject invalid new writes; indexes have stable descriptive names.
 */

import type { CreateIndexesOptions, IndexSpecification } from "mongodb";
import {
  APPLICATION_COLLECTION_NAMES,
  COLLECTION_NAMES,
} from "@/lib/mongodb/collections";
import {
  DB_ARRAY_LIMITS,
  DB_STRING_LIMITS,
  ENQUIRY_LIMITS,
  SCHEMA_VERSION_CURRENT,
} from "@/lib/mongodb/limits";
import {
  AUDIT_OUTCOMES,
  CONTENT_JOB_STATES,
  ENQUIRY_WORKFLOW_STATUSES,
  MEDIA_PROCESSING_STATES,
  MEDIA_VISIBILITY_VALUES,
  PROJECT_REVISION_KINDS,
  SITE_SETTINGS_KEYS,
} from "@/lib/mongodb/enums";
import {
  ENQUIRY_PREFERRED_CONTACT_VALUES,
  ENQUIRY_REQUEST_TYPE_VALUES,
  ENQUIRY_SERVICE_VALUES,
  ENQUIRY_TIMELINE_VALUES,
} from "@/lib/enquiries/input";
import { WORK_STATUS_VALUES } from "@/content/projects";

export type NamedIndex = Readonly<{
  name: string;
  key: IndexSpecification;
  options?: Omit<CreateIndexesOptions, "name">;
  /** Why this index exists (query or uniqueness). */
  rationale: string;
  /** Optional recovery note if the index must be removed later. */
  rollbackNote: string;
}>;

export type CollectionSchemaSpec = Readonly<{
  name: string;
  validator: Record<string, unknown>;
  validationLevel: "strict";
  validationAction: "error";
  indexes: readonly NamedIndex[];
  rollbackNote: string;
}>;

const schemaVersionProp = {
  bsonType: "int",
  minimum: SCHEMA_VERSION_CURRENT,
  maximum: SCHEMA_VERSION_CURRENT,
};

function enumString(values: readonly string[]) {
  return { bsonType: "string", enum: [...values] };
}

function boundedString(max: number, min = 1) {
  return { bsonType: "string", minLength: min, maxLength: max };
}

function nullableString(max: number) {
  return {
    oneOf: [{ bsonType: "null" }, { bsonType: "string", maxLength: max }],
  };
}

function dateProp() {
  return { bsonType: "date" };
}

const storyBlockSchema = {
  oneOf: [
    {
      bsonType: "object",
      required: ["type", "text"],
      additionalProperties: false,
      properties: {
        type: { enum: ["paragraph"] },
        text: boundedString(DB_STRING_LIMITS.blockTextMax, 1),
      },
    },
    {
      bsonType: "object",
      required: ["type", "style", "items"],
      additionalProperties: false,
      properties: {
        type: { enum: ["list"] },
        style: { enum: ["bulleted", "numbered"] },
        items: {
          bsonType: "array",
          minItems: 1,
          maxItems: DB_ARRAY_LIMITS.maxListItems,
          items: boundedString(DB_STRING_LIMITS.listItemMax, 1),
        },
      },
    },
  ],
};

const summarySnapshotSchema = {
  bsonType: "object",
  required: [
    "title",
    "summary",
    "workStatus",
    "serviceIds",
    "contributors",
    "zatrozContribution",
    "problem",
    "approach",
    "deliverables",
    "verifiedOutcomes",
    "mediaIds",
    "publicLinks",
    "editorialOrder",
  ],
  additionalProperties: false,
  properties: {
    title: boundedString(DB_STRING_LIMITS.titleMax),
    summary: boundedString(DB_STRING_LIMITS.summaryMax),
    workStatus: enumString(WORK_STATUS_VALUES),
    serviceIds: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxServiceIds,
      items: boundedString(DB_STRING_LIMITS.serviceIdMax),
    },
    contributors: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxContributors,
      items: boundedString(DB_STRING_LIMITS.contributorMax),
    },
    zatrozContribution: boundedString(DB_STRING_LIMITS.contributionMax),
    problem: boundedString(DB_STRING_LIMITS.problemMax),
    approach: boundedString(DB_STRING_LIMITS.approachMax),
    deliverables: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxDeliverables,
      items: boundedString(DB_STRING_LIMITS.deliverableMax),
    },
    verifiedOutcomes: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxVerifiedOutcomes,
      items: boundedString(DB_STRING_LIMITS.outcomeMax),
    },
    mediaIds: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxMediaIds,
      items: boundedString(DB_STRING_LIMITS.mediaIdMax),
    },
    publicLinks: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxPublicLinks,
      items: {
        bsonType: "object",
        required: ["label", "href"],
        additionalProperties: false,
        properties: {
          label: boundedString(DB_STRING_LIMITS.linkLabelMax),
          href: boundedString(DB_STRING_LIMITS.hrefMax),
        },
      },
    },
    editorialOrder: {
      oneOf: [{ bsonType: "null" }, { bsonType: "int", minimum: 0 }],
    },
  },
};

const storySnapshotSchema = {
  bsonType: "object",
  required: [
    "title",
    "intro",
    "context",
    "contribution",
    "solution",
    "features",
    "processNotes",
    "gallery",
    "technologies",
    "outcomes",
    "lessons",
    "testimonial",
  ],
  additionalProperties: false,
  properties: {
    title: boundedString(DB_STRING_LIMITS.titleMax),
    intro: boundedString(DB_STRING_LIMITS.introMax),
    context: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxBlocksPerSection,
      items: storyBlockSchema,
    },
    contribution: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxBlocksPerSection,
      items: storyBlockSchema,
    },
    solution: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxBlocksPerSection,
      items: storyBlockSchema,
    },
    features: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxFeatures,
      items: boundedString(DB_STRING_LIMITS.featureMax),
    },
    processNotes: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxBlocksPerSection,
      items: storyBlockSchema,
    },
    gallery: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxGalleryItems,
      items: {
        bsonType: "object",
        required: ["mediaId", "caption"],
        additionalProperties: false,
        properties: {
          mediaId: boundedString(DB_STRING_LIMITS.mediaIdMax),
          caption: boundedString(DB_STRING_LIMITS.captionMax),
          conceptLabel: nullableString(120),
        },
      },
    },
    technologies: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxTechnologies,
      items: boundedString(DB_STRING_LIMITS.technologyMax),
    },
    outcomes: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxOutcomes,
      items: boundedString(DB_STRING_LIMITS.outcomeMax),
    },
    lessons: {
      bsonType: "array",
      maxItems: DB_ARRAY_LIMITS.maxBlocksPerSection,
      items: storyBlockSchema,
    },
    testimonial: {
      oneOf: [
        { bsonType: "null" },
        {
          bsonType: "object",
          required: ["quote", "attribution", "publicationState"],
          additionalProperties: false,
          properties: {
            quote: boundedString(600),
            attribution: boundedString(160),
            publicationState: enumString(["draft", "approved", "archived"]),
          },
        },
      ],
    },
    reviewNotes: {
      bsonType: "string",
      maxLength: DB_STRING_LIMITS.reviewNotesMax,
    },
  },
};

export const COLLECTION_SCHEMAS: readonly CollectionSchemaSpec[] = [
  {
    name: COLLECTION_NAMES.enquiries,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Reverting the validator does not delete stored enquiries. Dropping unique indexes risks duplicate idempotency accepts — do not drop casually.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "createdAt",
          "updatedAt",
          "status",
          "publicReference",
          "idempotencyDigest",
          "fingerprintVersion",
          "keyVersion",
          "payloadFingerprint",
          "name",
          "email",
          "company",
          "service",
          "message",
          "timeline",
          "requestType",
          "preferredContact",
          "phone",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          createdAt: dateProp(),
          updatedAt: dateProp(),
          status: enumString(ENQUIRY_WORKFLOW_STATUSES),
          publicReference: boundedString(
            DB_STRING_LIMITS.publicReferenceMax,
            12,
          ),
          idempotencyDigest: boundedString(
            DB_STRING_LIMITS.idempotencyDigestMax,
            32,
          ),
          fingerprintVersion: { bsonType: "int", minimum: 1 },
          keyVersion: { bsonType: "int", minimum: 1 },
          payloadFingerprint: boundedString(
            DB_STRING_LIMITS.payloadFingerprintMax,
            32,
          ),
          name: boundedString(ENQUIRY_LIMITS.nameMax),
          email: boundedString(ENQUIRY_LIMITS.emailMax),
          company: nullableString(ENQUIRY_LIMITS.companyMax),
          service: enumString(ENQUIRY_SERVICE_VALUES),
          message: boundedString(
            ENQUIRY_LIMITS.messageMax,
            ENQUIRY_LIMITS.messageMin,
          ),
          timeline: {
            oneOf: [{ bsonType: "null" }, enumString(ENQUIRY_TIMELINE_VALUES)],
          },
          requestType: enumString(ENQUIRY_REQUEST_TYPE_VALUES),
          preferredContact: enumString(ENQUIRY_PREFERRED_CONTACT_VALUES),
          phone: nullableString(ENQUIRY_LIMITS.phoneMax),
        },
      },
    },
    indexes: [
      {
        name: "uniq_enquiries_idempotency_digest",
        key: { idempotencyDigest: 1 },
        options: { unique: true },
        rationale:
          "Idempotent enquiry acceptance — ordinary unique string index (not hashed).",
        rollbackNote:
          "Removing uniqueness can allow duplicate visitor accepts for the same key.",
      },
      {
        name: "uniq_enquiries_public_reference",
        key: { publicReference: 1 },
        options: { unique: true },
        rationale: "Opaque public confirmation reference lookup.",
        rollbackNote: "Safe to remove only if public references are retired.",
      },
      {
        name: "idx_enquiries_status_createdAt",
        key: { status: 1, createdAt: -1 },
        rationale: "Owner workflow inbox ordering by status then recency.",
        rollbackNote: "Non-unique; safe to drop if the owner workflow changes.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.projects,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Reverting the validator does not restore pointer history. Do not drop unique editorialId/slug indexes while admin is live.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "createdAt",
          "updatedAt",
          "editorialId",
          "draftSlug",
          "draftTitle",
          "canonicalPublishedSlug",
          "workStatus",
          "draftRevisionId",
          "publishedSummaryRevisionId",
          "publishedStoryRevisionId",
          "concurrencyVersion",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          createdAt: dateProp(),
          updatedAt: dateProp(),
          editorialId: boundedString(DB_STRING_LIMITS.editorialIdMax),
          draftSlug: boundedString(DB_STRING_LIMITS.slugMax),
          draftTitle: boundedString(DB_STRING_LIMITS.titleMax),
          canonicalPublishedSlug: nullableString(DB_STRING_LIMITS.slugMax),
          workStatus: enumString(WORK_STATUS_VALUES),
          draftRevisionId: nullableString(DB_STRING_LIMITS.revisionIdMax),
          publishedSummaryRevisionId: nullableString(
            DB_STRING_LIMITS.revisionIdMax,
          ),
          publishedStoryRevisionId: nullableString(
            DB_STRING_LIMITS.revisionIdMax,
          ),
          concurrencyVersion: { bsonType: "int", minimum: 0 },
        },
      },
    },
    indexes: [
      {
        name: "uniq_projects_editorialId",
        key: { editorialId: 1 },
        options: { unique: true },
        rationale: "Stable project identity across revisions and ObjectIds.",
        rollbackNote: "Do not drop while content references editorialId.",
      },
      {
        name: "uniq_projects_canonicalPublishedSlug",
        key: { canonicalPublishedSlug: 1 },
        options: {
          unique: true,
          partialFilterExpression: {
            canonicalPublishedSlug: { $type: "string" },
          },
        },
        rationale:
          "Unique live slug among published projects; null drafts may repeat until publish.",
        rollbackNote:
          "Partial unique index — dropping it allows colliding live slugs.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.projectRevisions,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Revisions are immutable history. Reverting validators does not rewrite bodies. Never delete revisions to force a migration.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "createdAt",
          "revisionId",
          "projectId",
          "revisionNumber",
          "kind",
          "summary",
          "story",
          "mediaRefs",
          "createdByActorId",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          createdAt: dateProp(),
          revisionId: boundedString(DB_STRING_LIMITS.revisionIdMax),
          projectId: boundedString(DB_STRING_LIMITS.editorialIdMax),
          revisionNumber: { bsonType: "int", minimum: 1 },
          kind: enumString(PROJECT_REVISION_KINDS),
          summary: {
            oneOf: [{ bsonType: "null" }, summarySnapshotSchema],
          },
          story: {
            oneOf: [{ bsonType: "null" }, storySnapshotSchema],
          },
          mediaRefs: {
            bsonType: "array",
            maxItems: DB_ARRAY_LIMITS.maxMediaIds,
            items: boundedString(DB_STRING_LIMITS.mediaIdMax),
          },
          createdByActorId: boundedString(DB_STRING_LIMITS.actorIdMax),
        },
      },
    },
    indexes: [
      {
        name: "uniq_project_revisions_revisionId",
        key: { revisionId: 1 },
        options: { unique: true },
        rationale: "Immutable revision identity for publish pointers.",
        rollbackNote: "Do not drop while projects point at revisionId values.",
      },
      {
        name: "uniq_project_revisions_project_number",
        key: { projectId: 1, revisionNumber: 1 },
        options: { unique: true },
        rationale: "Monotonic revision numbers per project.",
        rollbackNote:
          "Conflicts mean history already exists — stop and inspect.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.mediaAssets,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Media versions are append-only. Do not delete versions to satisfy uniqueness — create a new versionId instead.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "createdAt",
          "updatedAt",
          "mediaId",
          "versionId",
          "provider",
          "providerAssetId",
          "providerVersionId",
          "width",
          "height",
          "mimeType",
          "byteSize",
          "alt",
          "caption",
          "provenance",
          "licence",
          "generationBrief",
          "processingState",
          "visibility",
          "storageHint",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          createdAt: dateProp(),
          updatedAt: dateProp(),
          mediaId: boundedString(DB_STRING_LIMITS.mediaIdMax),
          versionId: boundedString(DB_STRING_LIMITS.versionIdMax),
          provider: boundedString(40),
          providerAssetId: boundedString(DB_STRING_LIMITS.providerIdMax),
          providerVersionId: boundedString(DB_STRING_LIMITS.providerIdMax),
          width: {
            oneOf: [{ bsonType: "null" }, { bsonType: "int", minimum: 1 }],
          },
          height: {
            oneOf: [{ bsonType: "null" }, { bsonType: "int", minimum: 1 }],
          },
          mimeType: boundedString(DB_STRING_LIMITS.mimeTypeMax),
          byteSize: {
            bsonType: ["int", "long"],
            minimum: 0,
          },
          alt: {
            oneOf: [
              {
                bsonType: "object",
                required: ["decorative", "alt"],
                additionalProperties: false,
                properties: {
                  decorative: { enum: [true] },
                  alt: { enum: [""] },
                },
              },
              {
                bsonType: "object",
                required: ["decorative", "alt"],
                additionalProperties: false,
                properties: {
                  decorative: { enum: [false] },
                  alt: boundedString(DB_STRING_LIMITS.altMax),
                },
              },
            ],
          },
          caption: nullableString(DB_STRING_LIMITS.captionMax),
          provenance: nullableString(DB_STRING_LIMITS.provenanceMax),
          licence: nullableString(DB_STRING_LIMITS.licenceMax),
          generationBrief: nullableString(DB_STRING_LIMITS.generationBriefMax),
          processingState: enumString(MEDIA_PROCESSING_STATES),
          visibility: enumString(MEDIA_VISIBILITY_VALUES),
          storageHint: nullableString(300),
        },
      },
    },
    indexes: [
      {
        name: "uniq_media_assets_media_version",
        key: { mediaId: 1, versionId: 1 },
        options: { unique: true },
        rationale: "Immutable media version identity.",
        rollbackNote:
          "Conflicts mean a version already exists — do not overwrite.",
      },
      {
        name: "idx_media_assets_visibility_processing",
        key: { visibility: 1, processingState: 1 },
        rationale: "Admin media queues by visibility and processing state.",
        rollbackNote: "Non-unique; safe to drop if queues change.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.siteContentSettings,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Settings are narrow allowlisted keys only. Do not introduce arbitrary KV documents.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "updatedAt",
          "settingsKey",
          "featuredProjectIds",
          "concurrencyVersion",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          updatedAt: dateProp(),
          settingsKey: enumString(SITE_SETTINGS_KEYS),
          featuredProjectIds: {
            bsonType: "array",
            maxItems: DB_ARRAY_LIMITS.maxFeaturedProjectIds,
            items: boundedString(DB_STRING_LIMITS.editorialIdMax),
          },
          concurrencyVersion: { bsonType: "int", minimum: 0 },
        },
      },
    },
    indexes: [
      {
        name: "uniq_site_content_settings_key",
        key: { settingsKey: 1 },
        options: { unique: true },
        rationale: "One document per allowlisted settings key.",
        rollbackNote: "Do not allow duplicate featured_projects rows.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.adminAuditEvents,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Audit events are append-only. Never TTL-delete or bulk-erase to force migrations.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "createdAt",
          "actorId",
          "action",
          "targetType",
          "targetId",
          "outcome",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          createdAt: dateProp(),
          actorId: boundedString(DB_STRING_LIMITS.actorIdMax),
          action: boundedString(DB_STRING_LIMITS.actionMax),
          targetType: boundedString(DB_STRING_LIMITS.targetTypeMax),
          targetId: boundedString(DB_STRING_LIMITS.targetIdMax),
          outcome: enumString(AUDIT_OUTCOMES),
        },
      },
    },
    indexes: [
      {
        name: "idx_admin_audit_createdAt",
        key: { createdAt: -1 },
        rationale: "Recent audit review by time.",
        rollbackNote: "Non-unique; safe to drop if review UX changes.",
      },
      {
        name: "idx_admin_audit_target",
        key: { targetType: 1, targetId: 1, createdAt: -1 },
        rationale: "Per-record audit history.",
        rollbackNote: "Non-unique; safe to drop if unused.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.contentJobs,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "Jobs support later admin recovery. Do not implement a worker in Step 45.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "createdAt",
          "updatedAt",
          "jobId",
          "dedupeKey",
          "state",
          "attempts",
          "nextRunAt",
          "leaseOwner",
          "leaseExpiresAt",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          createdAt: dateProp(),
          updatedAt: dateProp(),
          jobId: boundedString(DB_STRING_LIMITS.jobIdMax),
          dedupeKey: boundedString(DB_STRING_LIMITS.dedupeKeyMax),
          state: enumString(CONTENT_JOB_STATES),
          attempts: { bsonType: "int", minimum: 0 },
          nextRunAt: {
            oneOf: [{ bsonType: "null" }, dateProp()],
          },
          leaseOwner: nullableString(DB_STRING_LIMITS.actorIdMax),
          leaseExpiresAt: {
            oneOf: [{ bsonType: "null" }, dateProp()],
          },
        },
      },
    },
    indexes: [
      {
        name: "uniq_content_jobs_jobId",
        key: { jobId: 1 },
        options: { unique: true },
        rationale: "Stable job identity.",
        rollbackNote: "Do not drop while recovery tooling references jobId.",
      },
      {
        name: "uniq_content_jobs_dedupeKey",
        key: { dedupeKey: 1 },
        options: { unique: true },
        rationale: "Prevent duplicate queued work for the same logical task.",
        rollbackNote: "Conflicts mean the job already exists — resume it.",
      },
      {
        name: "idx_content_jobs_state_nextRunAt",
        key: { state: 1, nextRunAt: 1 },
        rationale: "Later worker polling by state and schedule.",
        rollbackNote: "Non-unique; safe before a worker exists.",
      },
    ],
  },
  {
    name: COLLECTION_NAMES.rateLimitBuckets,
    validationLevel: "strict",
    validationAction: "error",
    rollbackNote:
      "TTL cleanup is async. Application must still enforce windowStart/windowEnd. Do not add TTL to enquiries or audits.",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          "schemaVersion",
          "bucketId",
          "count",
          "windowStart",
          "windowEnd",
          "expiresAt",
        ],
        additionalProperties: false,
        properties: {
          _id: {},
          schemaVersion: schemaVersionProp,
          bucketId: boundedString(DB_STRING_LIMITS.bucketIdMax),
          count: { bsonType: "int", minimum: 0 },
          windowStart: dateProp(),
          windowEnd: dateProp(),
          expiresAt: dateProp(),
        },
      },
    },
    indexes: [
      {
        name: "uniq_rate_limit_buckets_bucketId",
        key: { bucketId: 1 },
        options: { unique: true },
        rationale:
          "Deterministic bucket ID (policy/version + keyed id + window).",
        rollbackNote: "Required for atomic counter upserts in Step 46.",
      },
      {
        name: "ttl_rate_limit_buckets_expiresAt",
        key: { expiresAt: 1 },
        options: { expireAfterSeconds: 0 },
        rationale:
          "Background cleanup of expired counters only — not the security clock.",
        rollbackNote:
          "Removing TTL leaves stale counters; app must still check window times.",
      },
    ],
  },
];

export const MIGRATION_ID = "2026-09-18-step-45-application-collections";

export function listApplicationCollectionNames(): readonly string[] {
  return APPLICATION_COLLECTION_NAMES;
}

/** Stable checksum of planned schema/index names for the migration ledger. */
export function schemaPlanChecksum(): string {
  const parts: string[] = [];
  for (const spec of COLLECTION_SCHEMAS) {
    parts.push(spec.name);
    for (const index of spec.indexes) {
      parts.push(`${spec.name}:${index.name}:${JSON.stringify(index.key)}`);
    }
  }
  // Simple non-crypto fingerprint for operator display (not a secret).
  let hash = 0;
  const joined = parts.join("|");
  for (let i = 0; i < joined.length; i += 1) {
    hash = (hash * 31 + joined.charCodeAt(i)) >>> 0;
  }
  return `s45-${hash.toString(16).padStart(8, "0")}`;
}
