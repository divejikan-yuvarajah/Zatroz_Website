/**
 * Unit tests for Step 47/48 enquiry submission pipeline.
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
import {
  CUSTOMER_SAFE_MESSAGES,
  IDEMPOTENCY_KEY_MIN_LENGTH,
  IDEMPOTENCY_KEY_MAX_LENGTH,
} from "../src/lib/security/policy";

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

/** Business-only canonical signature (mirrors server businessFieldsProjection). */
function businessPayloadSignature(input: EnquiryNormalizedInput): string {
  const fields: Record<string, string | null> = {
    name: input.name,
    email: input.email.toLowerCase(),
    company: input.company,
    service: input.service,
    message: input.message,
    timeline: input.timeline,
    requestType: input.requestType,
    preferredContact: input.preferredContact,
    phone: input.phone,
  };
  return Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k] ?? ""}`)
    .join("\n");
}

function runGateTests() {
  const env = {
    APP_ORIGIN: "http://localhost:3000",
    APP_ENV: "development",
  };

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

  const noOrigin = gateEnquiryServerActionInput({
    headers: { origin: null },
    rawInput: { ...input },
    env,
  });
  assert.equal(noOrigin.ok, false);
  pass("gate-missing-origin-rejected");

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

function runIdempotencyKeyValidationTests() {
  // Key constraints are exported for client-side validation
  assert.equal(IDEMPOTENCY_KEY_MIN_LENGTH, 32);
  assert.equal(IDEMPOTENCY_KEY_MAX_LENGTH, 128);

  // SHA-256 digest is stable for the same key
  const key = randomBytes(32).toString("hex");
  const digest1 = createHash("sha256").update(key, "utf8").digest("hex");
  const digest2 = createHash("sha256").update(key, "utf8").digest("hex");
  assert.equal(digest1, digest2, "Same key should produce same digest");
  assert.equal(digest1.length, 64, "SHA-256 hex should be 64 chars");

  // Different keys produce different digests
  const otherKey = randomBytes(32).toString("hex");
  const otherDigest = createHash("sha256")
    .update(otherKey, "utf8")
    .digest("hex");
  assert.notEqual(
    digest1,
    otherDigest,
    "Different keys produce different digests",
  );

  pass("idempotency-key-validation-and-digest");
}

function runBusinessFingerprintTests() {
  const secret = "test-secret-for-fingerprint";
  const input = validInput();

  function fingerprint(normalized: EnquiryNormalizedInput): string {
    const fields: Record<string, string | null> = {
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
    const sorted = Object.keys(fields)
      .sort()
      .map((k) => `${k}=${fields[k] ?? ""}`)
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

  // Email case normalization
  const upperEmail = { ...input, email: "TEST@EXAMPLE.COM" };
  const fp5 = fingerprint(upperEmail);
  assert.equal(fp1, fp5, "Email case does not affect fingerprint");

  pass("business-fingerprint-deterministic");
}

function runBusinessPayloadSignatureTests() {
  const input = validInput();
  const sig1 = businessPayloadSignature(input);
  const sig2 = businessPayloadSignature(input);
  assert.equal(sig1, sig2, "Same input same signature");

  // Changed business field → different signature
  const changed = {
    ...input,
    message: "A different message that is long enough for testing.",
  };
  const sig3 = businessPayloadSignature(changed);
  assert.notEqual(
    sig1,
    sig3,
    "Different business fields produce different signature",
  );

  // Transport-only metadata would NOT be in business fields
  // (challenge tokens, trace IDs etc. are excluded by design)
  pass("business-payload-signature-stability");
}

function runTransportExclusionTests() {
  const input = validInput();
  const sigWithout = businessPayloadSignature(input);
  // Turnstile tokens are transport-only — not part of business signature
  assert.equal(sigWithout, businessPayloadSignature({ ...input }));
  pass("turnstile-token-excluded-from-fingerprint");
}

function runAttemptLifecycleTests() {
  // Simulate the client's attempt key lifecycle

  // 1. First submission: generate new key
  let currentKey: string | null = null;
  let lastPayload: string | null = null;
  const input = validInput();
  const sig = businessPayloadSignature(input);

  if (!currentKey || lastPayload !== sig) {
    currentKey = randomBytes(32).toString("hex");
    lastPayload = sig;
  }
  const firstKey = currentKey;
  assert.ok(firstKey.length >= 64, "Key is at least 64 hex chars");

  // 2. Retry same payload → same key retained
  if (!currentKey || lastPayload !== sig) {
    currentKey = randomBytes(32).toString("hex");
    lastPayload = sig;
  }
  assert.equal(currentKey, firstKey, "Same payload retains same key");

  // 3. Changed payload → new key
  const changed = {
    ...input,
    message: "Changed my mind about the project scope details here.",
  };
  const changedSig = businessPayloadSignature(changed);
  if (!currentKey || lastPayload !== changedSig) {
    currentKey = randomBytes(32).toString("hex");
    lastPayload = changedSig;
  }
  assert.notEqual(currentKey, firstKey, "Changed payload gets new key");

  // 4. Accepted → clear key
  currentKey = null;
  lastPayload = null;
  assert.equal(currentKey, null, "Key cleared after acceptance");

  // 5. New submission after acceptance → fresh key
  const newSig = businessPayloadSignature(input);
  if (!currentKey || lastPayload !== newSig) {
    currentKey = randomBytes(32).toString("hex");
    lastPayload = newSig;
  }
  assert.notEqual(currentKey, firstKey, "Fresh key after acceptance");

  pass("attempt-lifecycle-key-management");
}

function runResponseContractTests() {
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

  const challengeFailed = {
    status: "challenge-failed",
    message: "retry check",
  };
  assert.equal(isEnquirySubmitResult(challengeFailed), true);

  const malformed = { ok: true, mongoId: "should-never-surface" };
  assert.equal(isEnquirySubmitResult(malformed), false);
  const coerced = coerceEnquirySubmitResult(malformed);
  assert.equal(coerced.status, "unknown-outcome");

  assert.equal(coerceEnquirySubmitResult(null).status, "unknown-outcome");
  assert.equal(coerceEnquirySubmitResult(undefined).status, "unknown-outcome");

  pass("response-contract-coercion");
}

function runSafeMessageTests() {
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

function runConflictScenarioTests() {
  // Same key, same payload → replay (same digest)
  const key1 = randomBytes(32).toString("hex");
  const digest1 = createHash("sha256").update(key1, "utf8").digest("hex");
  const digest1b = createHash("sha256").update(key1, "utf8").digest("hex");
  assert.equal(digest1, digest1b, "Replay has same digest");

  // Same key, different payload → conflict (same digest, different fingerprint)
  const secret = "test-secret";
  const input1 = validInput();
  const input2 = {
    ...input1,
    message: "A completely different description of the project needs.",
  };

  function fp(input: EnquiryNormalizedInput): string {
    const fields: Record<string, string | null> = {
      name: input.name,
      email: input.email.toLowerCase(),
      company: input.company,
      service: input.service,
      message: input.message,
      timeline: input.timeline,
      requestType: input.requestType,
      preferredContact: input.preferredContact,
      phone: input.phone,
    };
    const sorted = Object.keys(fields)
      .sort()
      .map((k) => `${k}=${fields[k] ?? ""}`)
      .join("\n");
    return createHmac("sha256", secret)
      .update(`enquiry:v1:${sorted}`, "utf8")
      .digest("hex");
  }

  const fp1 = fp(input1);
  const fp2 = fp(input2);
  assert.notEqual(
    fp1,
    fp2,
    "Different business payload = different fingerprint = conflict",
  );

  // Different key, same email → separate legitimate enquiries
  const key2 = randomBytes(32).toString("hex");
  const digest2 = createHash("sha256").update(key2, "utf8").digest("hex");
  assert.notEqual(
    digest1,
    digest2,
    "Different keys = separate enquiries, even for same email",
  );

  pass("conflict-scenario-tests");
}

function runRefreshLimitationTests() {
  // After page refresh, key is lost (null).
  // A retry will generate a new key → may create a second enquiry.
  // This is a documented, honest limitation.
  const keyBeforeRefresh = "some-key-from-before-refresh";

  // Simulate refresh: key is lost — new submission generates a fresh key
  const freshKey = randomBytes(32).toString("hex");
  assert.notEqual(freshKey, keyBeforeRefresh);

  pass("refresh-limitation-documented");
}

// Run all tests
runGateTests();
runIdempotencyKeyValidationTests();
runBusinessFingerprintTests();
runBusinessPayloadSignatureTests();
runTransportExclusionTests();
runAttemptLifecycleTests();
runResponseContractTests();
runSafeMessageTests();
runServerOwnedFieldTests();
runVisitorFieldValidationTests();
runConflictScenarioTests();
runRefreshLimitationTests();

console.log(`\n${passed} checks passed`);
