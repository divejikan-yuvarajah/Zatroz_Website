/**
 * Shared field bounds for application validation and MongoDB $jsonSchema.
 * Keep in sync with docs/backend/data-model.md and enquiry-contract.md.
 */

import { ENQUIRY_LIMITS } from "@/lib/enquiries/input";
import { PROJECT_STORY_LIMITS } from "@/content/projects";

export const SCHEMA_VERSION_CURRENT = 1 as const;

export const DB_STRING_LIMITS = {
  editorialIdMax: 64,
  slugMax: 80,
  mediaIdMax: 80,
  versionIdMax: 80,
  providerIdMax: 200,
  mimeTypeMax: 100,
  captionMax: PROJECT_STORY_LIMITS.captionMax,
  altMax: 300,
  provenanceMax: 1000,
  licenceMax: 500,
  generationBriefMax: 2000,
  actorIdMax: 128,
  actionMax: 80,
  targetTypeMax: 64,
  targetIdMax: 128,
  auditOutcomeMax: 40,
  jobIdMax: 80,
  dedupeKeyMax: 160,
  settingsKeyMax: 64,
  publicReferenceMax: 32,
  idempotencyDigestMax: 128,
  payloadFingerprintMax: 128,
  revisionIdMax: 80,
  titleMax: PROJECT_STORY_LIMITS.titleMax,
  summaryMax: 400,
  introMax: PROJECT_STORY_LIMITS.introMax,
  blockTextMax: PROJECT_STORY_LIMITS.blockTextMax,
  listItemMax: PROJECT_STORY_LIMITS.listItemMax,
  featureMax: 200,
  technologyMax: 80,
  outcomeMax: 400,
  reviewNotesMax: 2000,
  hrefMax: 500,
  linkLabelMax: 80,
  contributionMax: 2000,
  problemMax: 2000,
  approachMax: 2000,
  deliverableMax: 400,
  contributorMax: 120,
  serviceIdMax: 80,
  bucketIdMax: 200,
} as const;

export const DB_ARRAY_LIMITS = {
  maxServiceIds: 6,
  maxContributors: 12,
  maxDeliverables: 12,
  maxVerifiedOutcomes: 12,
  maxMediaIds: 24,
  maxPublicLinks: 8,
  maxFeaturedProjectIds: 12,
  maxBlocksPerSection: PROJECT_STORY_LIMITS.maxBlocksPerSection,
  maxListItems: PROJECT_STORY_LIMITS.maxListItems,
  maxFeatures: PROJECT_STORY_LIMITS.maxFeatures,
  maxTechnologies: PROJECT_STORY_LIMITS.maxTechnologies,
  maxOutcomes: PROJECT_STORY_LIMITS.maxOutcomes,
  maxGalleryItems: PROJECT_STORY_LIMITS.maxGalleryItems,
} as const;

export { ENQUIRY_LIMITS, PROJECT_STORY_LIMITS };

/** Opaque public enquiry reference: URL-safe alphabet, fixed length. */
export const PUBLIC_REFERENCE_PATTERN = /^[A-Za-z0-9_-]{12,32}$/;

/** Editorial / media identity: lowercase kebab or prefixed ids. */
export const EDITORIAL_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{1,62}$/;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const HEX_DIGEST_PATTERN = /^[a-f0-9]{32,128}$/;
