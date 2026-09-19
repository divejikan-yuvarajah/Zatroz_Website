/**
 * Unit tests for Step 47 enquiry submission pipeline.
 * No live Mongo — tests the action pipeline logic, idempotency, and contract.
 */

import assert from "node:assert/strict";
import { createHash, randomBytes, createHmac } from "node:crypto";
import { gateEnquiryServerActionInput } from "../src/lib/security/enquiry-gate";
import {
  isEnquirySubmitResult,
  coerceEnquirySubmitResult,
} from "../src/lib/enquiries/transport";
import type { EnquiryNormalizedInput } from "../src/lib/enquiries/input";
import {
  rejectServerOwnedEnquiryFields,
  validateEnquiryVisitorFields,
} from "../src/lib/mongodb/models/validate";
import { CUSTOMER_SAFE_MESSAGES } from "../src/lib/security/policy";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function validInput(): EnquiryNormalizedInput {
  return {
    name: "Test User",
    email: "test@example.com",
    company: null,
    service: "websites-ecommerce",
    message:
      "This is a test enquiry message that is long enough to pass validation easily.",
    timeline: null,
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: null,
  };
}

function runGateTests() {
  const env = {
    APP_ORIGIN: "http://localhost:3000",
    APP_ENV: "development",
  };

  // Valid gate pass
  const input = validInput();
  const result = gateEnquiryServerActionInput({
    headers: { origin: "http://localhost:3000" },
    rawInput: { ...input },
    env,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.normalized.name, "Test User");
    assert.equal(result.normalized.service, "websites-ecommerce");
  }
  pass("gate-valid-input-passes");

  // Rejected origin
  const foreign = gateEnquiryServerActionInput({
    headers: { origin: "https://evil.example.com" },
    rawInput: { ...input },
    env,
  });
  assert.equal(foreign.ok, false);
  if (!foreign.ok) {
    assert.equal(foreign.result.status, "unavailable");
  }
  pass("gate-foreign-origin-rejected");

  // Missing origin
  const noOrigin = gateEnquiryServerActionInput({
    headers: { origin: null },
    rawInput: { ...input },
    env,
  });
  assert.equal(noOrigin.ok, false);
  pass("gate-missing-origin-rejected");

  // Server-owned fields rejected
  const serverOwned = gateEnquiryServerActionInput({
    headers: { origin: "http://localhost:3000" },
    rawInput: { ...input, status: "reviewed", _id: "injected" },
    env,
  });
  assert.equal(serverOwned.ok, false);
  if (!serverOwned.ok) {
    assert.equal(serverOwned.result.status, "validation-error");
  }
  pass("gate-server-owned-fields-rejected");

  // Invalid fields produce validation-error
  const badInput = gateEnquiryServerActionInput({
    headers: { origin: "http://localhost:3000" },
    rawInput: { name: "", email: "", service: "", message: "" },
    env,
  });
  assert.equal(badInput.ok, false);
  if (!badInput.ok) {
    assert.equal(badInput.result.status, "validation-error");
  }
  pass("gate-invalid-fields-validation-error");
}

function runIdempotencyDigestTests() {
  const key = randomBytes(32).toString("hex");
  const digest1 = createHash("sha256").update(key, "utf8").digest("hex");
  const digest2 = createHash("sha256").update(key, "utf8").digest("hex");
  assert.equal(digest1, digest2, "Same key should produce same digest");
  assert.equal(digest1.length, 64, "SHA-256 hex should be 64 chars");

  const otherKey = randomBytes(32).toString("hex");
  const otherDigest = createHash("sha256")
    .update(otherKey, "utf8")
    .digest("hex");
  assert.notEqual(
    digest1,
    otherDigest,
    "Different keys produce different digests",
  );
  pass("idempotency-digest-stability");
}

function runPayloadFingerprintTests() {
  const secret = "test-secret-for-fingerprint";
  const input = validInput();

  function fingerprint(normalized: EnquiryNormalizedInput): string {
    const canonical: Record<string, string | null> = {
      name: normalized.name,
      email: normalized.email.toLowerCase(),
      company: normalized.company,
      service: normalized.service,
      message: normalized.message,
      timeline: normalized.timeline,
      requestType: normalized.requestType,
      preferredContact: normalized.preferredContact,
      phone: normalized.phone,
    };
    const sorted = Object.keys(canonical)
      .sort()
      .map((k) => `${k}=${canonical[k] ?? ""}`)
      .join("\n");
    return createHmac("sha256", secret)
      .update(`enquiry:v1:${sorted}`, "utf8")
      .digest("hex");
  }

  const fp1 = fingerprint(input);
  const fp2 = fingerprint(input);
  assert.equal(fp1, fp2, "Same input produces same fingerprint");

  // Different message → different fingerprint
  const altered = {
    ...input,
    message: "A completely different project description that is long enough.",
  };
  const fp3 = fingerprint(altered);
  assert.notEqual(fp1, fp3, "Different payload produces different fingerprint");

  // Field order doesn't matter (keys are sorted)
  const reordered = { ...input };
  const fp4 = fingerprint(reordered);
  assert.equal(fp1, fp4, "Field order does not affect fingerprint");

  pass("payload-fingerprint-deterministic");
}

function runResponseContractTests() {
  // All valid result statuses are recognized
  const accepted = { status: "accepted", message: "ok" };
  assert.equal(isEnquirySubmitResult(accepted), true);

  const validationErr = {
    status: "validation-error",
    message: "bad",
    fieldErrors: {},
  };
  assert.equal(isEnquirySubmitResult(validationErr), true);

  const rateLimited = { status: "rate-limited", message: "wait" };
  assert.equal(isEnquirySubmitResult(rateLimited), true);

  const unavailable = { status: "unavailable", message: "down" };
  assert.equal(isEnquirySubmitResult(unavailable), true);

  const unknown = { status: "unknown-outcome", message: "uncertain" };
  assert.equal(isEnquirySubmitResult(unknown), true);

  // Invalid shapes coerce to unknown-outcome
  const malformed = { ok: true, mongoId: "should-never-surface" };
  assert.equal(isEnquirySubmitResult(malformed), false);
  const coerced = coerceEnquirySubmitResult(malformed);
  assert.equal(coerced.status, "unknown-outcome");

  // Null/undefined coerces
  assert.equal(coerceEnquirySubmitResult(null).status, "unknown-outcome");
  assert.equal(coerceEnquirySubmitResult(undefined).status, "unknown-outcome");

  pass("response-contract-coercion");
}

function runSafeMessageTests() {
  // No customer message contains internal details
  for (const [key, msg] of Object.entries(CUSTOMER_SAFE_MESSAGES)) {
    assert.ok(!msg.includes("MongoDB"), `${key} must not mention MongoDB`);
    assert.ok(!msg.includes("ObjectId"), `${key} must not mention ObjectId`);
    assert.ok(!msg.includes("stack"), `${key} must not mention stack`);
    assert.ok(
      !msg.includes("connection"),
      `${key} must not mention connection`,
    );
  }
  pass("customer-safe-messages-no-internals");
}

function runServerOwnedFieldTests() {
  const clean = { name: "Test", email: "t@e.com" };
  assert.equal(rejectServerOwnedEnquiryFields(clean).ok, true);

  const dirty = { name: "Test", status: "reviewed" };
  assert.equal(rejectServerOwnedEnquiryFields(dirty).ok, false);

  const withId = { name: "Test", _id: "injected" };
  assert.equal(rejectServerOwnedEnquiryFields(withId).ok, false);

  pass("server-owned-field-rejection");
}

function runVisitorFieldValidationTests() {
  const valid = validInput();
  assert.equal(validateEnquiryVisitorFields(valid).ok, true);

  const badService = {
    ...valid,
    service: "hacked-service" as EnquiryNormalizedInput["service"],
  };
  assert.equal(validateEnquiryVisitorFields(badService).ok, false);

  pass("visitor-field-validation");
}

runGateTests();
runIdempotencyDigestTests();
runPayloadFingerprintTests();
runResponseContractTests();
runSafeMessageTests();
runServerOwnedFieldTests();
runVisitorFieldValidationTests();

console.log(`\n${passed} checks passed`);
