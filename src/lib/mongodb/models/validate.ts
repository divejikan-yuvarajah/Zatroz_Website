/**
 * Application-level validation for documents about to be written.
 * Complements MongoDB $jsonSchema — not interchangeable (dates, lengths, integers).
 */

import {
  ENQUIRY_LIMITS,
  ENQUIRY_PREFERRED_CONTACT_VALUES,
  ENQUIRY_REQUEST_TYPE_VALUES,
  ENQUIRY_SERVICE_VALUES,
  ENQUIRY_TIMELINE_VALUES,
  type EnquiryNormalizedInput,
} from "@/lib/enquiries/input";
import {
  DB_ARRAY_LIMITS,
  DB_STRING_LIMITS,
  EDITORIAL_ID_PATTERN,
  HEX_DIGEST_PATTERN,
  PUBLIC_REFERENCE_PATTERN,
  SCHEMA_VERSION_CURRENT,
  SLUG_PATTERN,
} from "@/lib/mongodb/limits";
import {
  ENQUIRY_STATUS_TRANSITIONS,
  ENQUIRY_WORKFLOW_STATUSES,
  type EnquiryWorkflowStatus,
} from "@/lib/mongodb/enums";
import type { EnquiryDocument } from "@/lib/mongodb/models/types";

export type AppValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
}>;

export type AppValidationResult =
  { ok: true } | { ok: false; issues: readonly AppValidationIssue[] };

function fail(
  issues: AppValidationIssue[],
): Extract<AppValidationResult, { ok: false }> {
  return { ok: false, issues };
}

function strLen(value: string): number {
  return value.trim().length;
}

/**
 * Ensure a visitor payload cannot set server-owned enquiry metadata.
 * Returns issues when forbidden keys are present on a raw object.
 */
export function rejectServerOwnedEnquiryFields(
  raw: Record<string, unknown>,
): AppValidationResult {
  const forbidden = [
    "schemaVersion",
    "createdAt",
    "updatedAt",
    "status",
    "publicReference",
    "idempotencyDigest",
    "fingerprintVersion",
    "keyVersion",
    "payloadFingerprint",
    "notificationIntent",
    "_id",
  ] as const;

  const issues: AppValidationIssue[] = [];
  for (const key of forbidden) {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      issues.push({
        code: "server-owned-field",
        field: key,
        message: `Visitor input must not set server-owned field "${key}".`,
      });
    }
  }
  return issues.length > 0 ? fail(issues) : { ok: true };
}

/** Validate normalized visitor fields using the shared Step 43 contract lengths. */
export function validateEnquiryVisitorFields(
  value: EnquiryNormalizedInput,
): AppValidationResult {
  const issues: AppValidationIssue[] = [];

  if (strLen(value.name) < ENQUIRY_LIMITS.nameMin) {
    issues.push({
      code: "name-too-short",
      field: "name",
      message: "Name is required.",
    });
  }
  if (value.name.trim().length > ENQUIRY_LIMITS.nameMax) {
    issues.push({
      code: "name-too-long",
      field: "name",
      message: `Name must be at most ${ENQUIRY_LIMITS.nameMax} characters.`,
    });
  }
  if (value.email.trim().length > ENQUIRY_LIMITS.emailMax) {
    issues.push({
      code: "email-too-long",
      field: "email",
      message: `Email must be at most ${ENQUIRY_LIMITS.emailMax} characters.`,
    });
  }
  if (
    value.company != null &&
    value.company.trim().length > ENQUIRY_LIMITS.companyMax
  ) {
    issues.push({
      code: "company-too-long",
      field: "company",
      message: `Company must be at most ${ENQUIRY_LIMITS.companyMax} characters.`,
    });
  }
  if (!(ENQUIRY_SERVICE_VALUES as readonly string[]).includes(value.service)) {
    issues.push({
      code: "service-invalid",
      field: "service",
      message: "Service is not in the allowlist.",
    });
  }
  const messageLen = value.message.trim().length;
  if (messageLen < ENQUIRY_LIMITS.messageMin) {
    issues.push({
      code: "message-too-short",
      field: "message",
      message: `Message must be at least ${ENQUIRY_LIMITS.messageMin} characters.`,
    });
  }
  if (messageLen > ENQUIRY_LIMITS.messageMax) {
    issues.push({
      code: "message-too-long",
      field: "message",
      message: `Message must be at most ${ENQUIRY_LIMITS.messageMax} characters.`,
    });
  }
  if (
    value.timeline != null &&
    !(ENQUIRY_TIMELINE_VALUES as readonly string[]).includes(value.timeline)
  ) {
    issues.push({
      code: "timeline-invalid",
      field: "timeline",
      message: "Timeline is not in the allowlist.",
    });
  }
  if (
    !(ENQUIRY_REQUEST_TYPE_VALUES as readonly string[]).includes(
      value.requestType,
    )
  ) {
    issues.push({
      code: "request-type-invalid",
      field: "requestType",
      message: "Request type is not in the allowlist.",
    });
  }
  if (
    !(ENQUIRY_PREFERRED_CONTACT_VALUES as readonly string[]).includes(
      value.preferredContact,
    )
  ) {
    issues.push({
      code: "preferred-contact-invalid",
      field: "preferredContact",
      message: "Preferred contact is not in the allowlist.",
    });
  }
  if (
    value.preferredContact !== "email" &&
    (value.phone == null || value.phone.trim().length === 0)
  ) {
    issues.push({
      code: "phone-required",
      field: "phone",
      message: "Phone is required for WhatsApp or phone preference.",
    });
  }
  if (
    value.phone != null &&
    value.phone.trim().length > ENQUIRY_LIMITS.phoneMax
  ) {
    issues.push({
      code: "phone-too-long",
      field: "phone",
      message: `Phone must be at most ${ENQUIRY_LIMITS.phoneMax} characters.`,
    });
  }

  return issues.length > 0 ? fail(issues) : { ok: true };
}

export function validateEnquiryDocument(
  doc: EnquiryDocument,
): AppValidationResult {
  const issues: AppValidationIssue[] = [];

  if (doc.schemaVersion !== SCHEMA_VERSION_CURRENT) {
    issues.push({
      code: "schema-version",
      field: "schemaVersion",
      message: `schemaVersion must be ${SCHEMA_VERSION_CURRENT}.`,
    });
  }
  if (
    !(doc.createdAt instanceof Date) ||
    Number.isNaN(doc.createdAt.getTime())
  ) {
    issues.push({
      code: "created-at-type",
      field: "createdAt",
      message: "createdAt must be a valid Date (UTC instant).",
    });
  }
  if (
    !(doc.updatedAt instanceof Date) ||
    Number.isNaN(doc.updatedAt.getTime())
  ) {
    issues.push({
      code: "updated-at-type",
      field: "updatedAt",
      message: "updatedAt must be a valid Date (UTC instant).",
    });
  }
  if (!(ENQUIRY_WORKFLOW_STATUSES as readonly string[]).includes(doc.status)) {
    issues.push({
      code: "status-invalid",
      field: "status",
      message: "status is not an allowed workflow value.",
    });
  }
  if (!PUBLIC_REFERENCE_PATTERN.test(doc.publicReference)) {
    issues.push({
      code: "public-reference-format",
      field: "publicReference",
      message: "publicReference must be an opaque 12–32 character token.",
    });
  }
  if (!HEX_DIGEST_PATTERN.test(doc.idempotencyDigest)) {
    issues.push({
      code: "idempotency-digest-format",
      field: "idempotencyDigest",
      message: "idempotencyDigest must be a hex digest.",
    });
  }
  if (!HEX_DIGEST_PATTERN.test(doc.payloadFingerprint)) {
    issues.push({
      code: "payload-fingerprint-format",
      field: "payloadFingerprint",
      message: "payloadFingerprint must be a hex digest.",
    });
  }
  if (!Number.isInteger(doc.fingerprintVersion) || doc.fingerprintVersion < 1) {
    issues.push({
      code: "fingerprint-version",
      field: "fingerprintVersion",
      message: "fingerprintVersion must be a positive integer.",
    });
  }
  if (!Number.isInteger(doc.keyVersion) || doc.keyVersion < 1) {
    issues.push({
      code: "key-version",
      field: "keyVersion",
      message: "keyVersion must be a positive integer.",
    });
  }

  const visitor = validateEnquiryVisitorFields({
    name: doc.name,
    email: doc.email,
    company: doc.company,
    service: doc.service as EnquiryNormalizedInput["service"],
    message: doc.message,
    timeline: doc.timeline as EnquiryNormalizedInput["timeline"],
    requestType: doc.requestType as EnquiryNormalizedInput["requestType"],
    preferredContact:
      doc.preferredContact as EnquiryNormalizedInput["preferredContact"],
    phone: doc.phone,
  });
  if (!visitor.ok) {
    issues.push(...visitor.issues);
  }

  return issues.length > 0 ? fail(issues) : { ok: true };
}

export function canTransitionEnquiryStatus(
  from: EnquiryWorkflowStatus,
  to: EnquiryWorkflowStatus,
): boolean {
  return ENQUIRY_STATUS_TRANSITIONS[from].includes(to);
}

export function validateEditorialId(id: string): AppValidationResult {
  if (!EDITORIAL_ID_PATTERN.test(id)) {
    return fail([
      {
        code: "editorial-id-format",
        field: "editorialId",
        message: "editorialId must be a stable lowercase identity string.",
      },
    ]);
  }
  if (id.length > DB_STRING_LIMITS.editorialIdMax) {
    return fail([
      {
        code: "editorial-id-length",
        field: "editorialId",
        message: `editorialId must be at most ${DB_STRING_LIMITS.editorialIdMax} characters.`,
      },
    ]);
  }
  return { ok: true };
}

export function validateSlug(
  slug: string,
  field = "slug",
): AppValidationResult {
  if (!SLUG_PATTERN.test(slug) || slug.length > DB_STRING_LIMITS.slugMax) {
    return fail([
      {
        code: "slug-format",
        field,
        message: `${field} must be a kebab-case slug within length limits.`,
      },
    ]);
  }
  return { ok: true };
}

export function validateFeaturedProjectIds(
  ids: readonly string[],
): AppValidationResult {
  if (ids.length > DB_ARRAY_LIMITS.maxFeaturedProjectIds) {
    return fail([
      {
        code: "featured-too-many",
        field: "featuredProjectIds",
        message: `At most ${DB_ARRAY_LIMITS.maxFeaturedProjectIds} featured IDs.`,
      },
    ]);
  }
  const seen = new Set<string>();
  for (const id of ids) {
    const idCheck = validateEditorialId(id);
    if (!idCheck.ok) return idCheck;
    if (seen.has(id)) {
      return fail([
        {
          code: "featured-duplicate",
          field: "featuredProjectIds",
          message: "featuredProjectIds must be unique.",
        },
      ]);
    }
    seen.add(id);
  }
  return { ok: true };
}

/**
 * Rate-limit window enforcement (application clock).
 * TTL deletion is asynchronous and must not be treated as the security decision.
 */
export function isRateLimitBucketActive(
  bucket: { windowStart: Date; windowEnd: Date; expiresAt: Date },
  now: Date = new Date(),
): boolean {
  return (
    now.getTime() >= bucket.windowStart.getTime() &&
    now.getTime() < bucket.windowEnd.getTime() &&
    now.getTime() < bucket.expiresAt.getTime()
  );
}

/**
 * Project a public enquiry acceptance payload — excludes private server fields.
 */
export function toPublicEnquiryAcceptance(doc: { publicReference: string }): {
  reference: string;
} {
  return { reference: doc.publicReference };
}
