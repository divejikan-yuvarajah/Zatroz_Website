/**
 * Deterministic unit tests for MongoDB models, validators, and migration policy.
 * Live Atlas integration is optional — recorded as Not run when credentials absent.
 */

import assert from "node:assert/strict";
import {
  rejectServerOwnedEnquiryFields,
  validateEnquiryDocument,
  validateEnquiryVisitorFields,
  canTransitionEnquiryStatus,
  validateFeaturedProjectIds,
  isRateLimitBucketActive,
  toPublicEnquiryAcceptance,
} from "../src/lib/mongodb/models/validate";
import {
  COLLECTION_SCHEMAS,
  MIGRATION_ID,
  schemaPlanChecksum,
} from "../src/lib/mongodb/schema/definitions";
import {
  assertNonProductionApply,
  isApplyTargetAllowed,
  resolveMigrationEnv,
} from "../src/lib/mongodb/migrations/env";
import { APPLICATION_COLLECTION_NAMES } from "../src/lib/mongodb/collections";
import { ENQUIRY_PRIVATE_FIELDS } from "../src/lib/mongodb/models/types";

function pass(label: string) {
  console.log(`PASS ${label}`);
}

function runValidationTests() {
  const forbidden = rejectServerOwnedEnquiryFields({
    name: "Ada",
    status: "new",
    schemaVersion: 1,
  });
  assert.equal(forbidden.ok, false);
  pass("rejects-server-owned-enquiry-fields");

  const visitorOk = validateEnquiryVisitorFields({
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: null,
    service: "not-sure",
    message: "x".repeat(40),
    timeline: null,
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: null,
  });
  assert.equal(visitorOk.ok, true);
  pass("valid-visitor-fields");

  const visitorBad = validateEnquiryVisitorFields({
    name: "",
    email: "ada@example.com",
    company: null,
    service: "not-sure",
    message: "short",
    timeline: null,
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: null,
  });
  assert.equal(visitorBad.ok, false);
  pass("invalid-visitor-fields");

  const now = new Date();
  const docOk = validateEnquiryDocument({
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    status: "new",
    publicReference: "ref_ABCDEF123456",
    idempotencyDigest: "a".repeat(64),
    fingerprintVersion: 1,
    keyVersion: 1,
    payloadFingerprint: "b".repeat(64),
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: null,
    service: "not-sure",
    message: "x".repeat(40),
    timeline: null,
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: null,
  });
  assert.equal(docOk.ok, true);
  pass("valid-enquiry-document");

  const docBadDate = validateEnquiryDocument({
    schemaVersion: 1,
    createdAt: "not-a-date" as unknown as Date,
    updatedAt: now,
    status: "new",
    publicReference: "ref_ABCDEF123456",
    idempotencyDigest: "a".repeat(64),
    fingerprintVersion: 1,
    keyVersion: 1,
    payloadFingerprint: "b".repeat(64),
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: null,
    service: "not-sure",
    message: "x".repeat(40),
    timeline: null,
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: null,
  });
  assert.equal(docBadDate.ok, false);
  pass("rejects-non-date-timestamps");

  assert.equal(canTransitionEnquiryStatus("new", "reviewed"), true);
  assert.equal(canTransitionEnquiryStatus("archived", "new"), false);
  pass("enquiry-status-transitions");

  assert.equal(validateFeaturedProjectIds(["proj-a", "proj-a"]).ok, false);
  assert.equal(validateFeaturedProjectIds(["proj-flowpilot-ai"]).ok, true);
  pass("featured-ids-unique");

  const windowStart = new Date(now.getTime() - 60_000);
  const windowEnd = new Date(now.getTime() + 60_000);
  const expiresAt = new Date(now.getTime() + 120_000);
  assert.equal(
    isRateLimitBucketActive({ windowStart, windowEnd, expiresAt }, now),
    true,
  );
  assert.equal(
    isRateLimitBucketActive(
      {
        windowStart,
        windowEnd: new Date(now.getTime() - 1_000),
        expiresAt,
      },
      now,
    ),
    false,
  );
  assert.equal(
    isRateLimitBucketActive(
      {
        windowStart,
        windowEnd,
        expiresAt: new Date(now.getTime() - 1),
      },
      now,
    ),
    false,
  );
  pass("rate-limit-window-enforcement-independent-of-ttl");

  const publicAcceptance = toPublicEnquiryAcceptance({
    publicReference: "ref_ABCDEF123456",
  });
  assert.deepEqual(publicAcceptance, { reference: "ref_ABCDEF123456" });
  for (const field of ENQUIRY_PRIVATE_FIELDS) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(publicAcceptance, field),
      false,
    );
  }
  pass("public-enquiry-projection-excludes-private-fields");
}

function runSchemaRegistryTests() {
  assert.equal(COLLECTION_SCHEMAS.length, APPLICATION_COLLECTION_NAMES.length);
  const names = new Set(COLLECTION_SCHEMAS.map((spec) => spec.name));
  for (const name of APPLICATION_COLLECTION_NAMES) {
    assert.equal(names.has(name), true);
  }
  pass("all-application-collections-defined");

  const indexNames = new Set<string>();
  for (const spec of COLLECTION_SCHEMAS) {
    for (const index of spec.indexes) {
      assert.equal(indexNames.has(index.name), false);
      indexNames.add(index.name);
      assert.ok(index.rationale.length > 0);
      assert.ok(index.rollbackNote.length > 0);
    }
  }
  pass("index-names-unique-and-justified");

  const enquiry = COLLECTION_SCHEMAS.find((spec) => spec.name === "enquiries");
  assert.ok(enquiry);
  assert.ok(
    enquiry.indexes.some(
      (index) => index.name === "uniq_enquiries_idempotency_digest",
    ),
  );
  assert.equal(
    enquiry.indexes.find(
      (index) => index.name === "uniq_enquiries_idempotency_digest",
    )?.options?.unique,
    true,
  );
  pass("enquiry-idempotency-ordinary-unique-index");

  const counters = COLLECTION_SCHEMAS.find(
    (spec) => spec.name === "rate_limit_buckets",
  );
  assert.ok(counters);
  const ttl = counters.indexes.find(
    (index) => index.name === "ttl_rate_limit_buckets_expiresAt",
  );
  assert.equal(ttl?.options?.expireAfterSeconds, 0);
  pass("rate-limit-ttl-index-present");

  assert.ok(/step-\d+/.test(MIGRATION_ID));
  assert.ok(MIGRATION_ID.includes("step-51"));
  assert.ok(schemaPlanChecksum().startsWith("s45-"));
  pass("migration-id-and-checksum");
}

function runMigrationPolicyTests() {
  const missing = resolveMigrationEnv({});
  assert.equal(missing.ok, false);
  pass("migration-env-requires-maintenance-uri");

  assert.equal(isApplyTargetAllowed("development"), true);
  assert.equal(isApplyTargetAllowed("production"), false);
  assert.ok(assertNonProductionApply("production", "development") !== null);
  assert.ok(assertNonProductionApply("development", "production") !== null);
  assert.equal(assertNonProductionApply("development", "development"), null);
  assert.ok(assertNonProductionApply("test", "development") !== null);
  pass("production-apply-refused");
}

function main() {
  runValidationTests();
  runSchemaRegistryTests();
  runMigrationPolicyTests();
  console.log("All mongodb model unit tests passed.");
  console.log(
    "INTEGRATION: npm run db:plan / db:apply and live insert tests — Not run until MONGODB_MIGRATION_URI + disposable DB exist.",
  );
}

main();
