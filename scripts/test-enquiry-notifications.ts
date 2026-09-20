/**
 * Step 51 — enquiry notification intent unit tests (no live Mongo / Resend).
 */

import assert from "node:assert/strict";
import {
  buildInitialNotificationIntent,
  buildNotificationFreeze,
  buildProviderIdempotencyKey,
  buildRequestFingerprint,
  formatReceivedAtDisplay,
  mapSendResultToIntentOutcome,
} from "../src/lib/enquiries/notification-intent";
import { ENQUIRY_INTERNAL_TEMPLATE_VERSION } from "../src/lib/email/templates/enquiry-internal";
import type { EmailConfig } from "../src/lib/email/config";
import type { EnquiryNormalizedInput } from "../src/lib/enquiries/input";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function sampleEnquiry(): EnquiryNormalizedInput {
  return {
    name: "Alex Example",
    email: "alex@example.com",
    company: "Example Co",
    service: "websites-ecommerce",
    message:
      "We need a brochure site with a simple contact form and clear service pages.",
    timeline: "within-month",
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: null,
  };
}

function sampleConfig(): EmailConfig {
  return {
    transport: "capture",
    notificationsEnabled: true,
    apiKey: null,
    fromHeader: "Zatroz <notifications@updates.example.com>",
    fromEmail: "notifications@updates.example.com",
    notificationRecipients: ["delivered@resend.dev"],
    authorizedTestInbox: null,
    appEnv: "development",
  };
}

function testInitialIntentStates() {
  const now = new Date("2026-09-21T12:00:00.000Z");
  const enabled = buildInitialNotificationIntent({
    now,
    notificationsEnabled: true,
    intentId: "eni_fixed_1",
  });
  assert.equal(enabled.state, "pending");
  assert.equal(enabled.freeze, null);
  assert.equal(enabled.templateVersion, ENQUIRY_INTERNAL_TEMPLATE_VERSION);
  assert.equal(
    enabled.providerIdempotencyKey,
    buildProviderIdempotencyKey({
      intentId: "eni_fixed_1",
      templateVersion: ENQUIRY_INTERNAL_TEMPLATE_VERSION,
    }),
  );
  assert.equal(enabled.providerIdempotencyKey.includes("@"), false);
  assert.equal(enabled.providerIdempotencyKey.includes("alex"), false);

  const paused = buildInitialNotificationIntent({
    now,
    notificationsEnabled: false,
  });
  assert.equal(paused.state, "paused");
  assert.equal(paused.lastErrorCategory, "notifications-disabled");
  pass("initial-intent-states");
}

function testFreezeStability() {
  const config = sampleConfig();
  const enquiry = sampleEnquiry();
  const first = buildNotificationFreeze({
    config,
    enquiry,
    publicReference: "ZQ-TEST-001",
    payloadFingerprint: "a".repeat(64),
    receivedAtDisplay: formatReceivedAtDisplay(
      new Date("2026-09-21T12:00:00.000Z"),
    ),
  });
  const second = buildNotificationFreeze({
    config,
    enquiry,
    publicReference: "ZQ-TEST-001",
    payloadFingerprint: "a".repeat(64),
    receivedAtDisplay: formatReceivedAtDisplay(
      new Date("2026-09-21T12:00:00.000Z"),
    ),
  });
  assert.equal(first.requestFingerprint, second.requestFingerprint);
  assert.equal(first.to[0], "delivered@resend.dev");
  assert.equal(first.replyTo, "alex@example.com");

  const changedRecipient = buildNotificationFreeze({
    config: {
      ...config,
      notificationRecipients: ["bounced@resend.dev"],
    },
    enquiry,
    publicReference: "ZQ-TEST-001",
    payloadFingerprint: "a".repeat(64),
    receivedAtDisplay: first.receivedAtDisplay,
  });
  assert.notEqual(
    first.requestFingerprint,
    changedRecipient.requestFingerprint,
  );
  pass("freeze-stability-and-recipient-sensitivity");
}

function testProviderKeyExcludesBrowserMaterial() {
  const key = buildProviderIdempotencyKey({
    intentId: "eni_abc",
    templateVersion: ENQUIRY_INTERNAL_TEMPLATE_VERSION,
  });
  assert.match(key, /^enquiry-notice\/eni_abc\//);
  assert.equal(key.includes(" "), false);
  pass("provider-key-excludes-browser-material");
}

function testSendOutcomeMapping() {
  assert.equal(
    mapSendResultToIntentOutcome("accepted").state,
    "provider-accepted",
  );
  assert.equal(
    mapSendResultToIntentOutcome("rejected", "provider-rejected").state,
    "rejected",
  );
  assert.equal(
    mapSendResultToIntentOutcome("transient-failure", "rate-limited").state,
    "uncertain",
  );
  assert.equal(
    mapSendResultToIntentOutcome("uncertain", "network-loss").errorCategory,
    "network-loss",
  );
  pass("send-outcome-mapping");
}

function testFingerprintCanonicalOrder() {
  const a = buildRequestFingerprint({
    fromHeader: "Zatroz <a@example.com>",
    to: ["b@example.com", "a@example.com"],
    replyTo: "visitor@example.com",
    templateVersion: ENQUIRY_INTERNAL_TEMPLATE_VERSION,
    receivedAtDisplay: "2026-09-21T12:00:00Z",
    publicReference: "ZQ-1",
    payloadFingerprint: "fp",
  });
  const b = buildRequestFingerprint({
    fromHeader: "Zatroz <a@example.com>",
    to: ["a@example.com", "b@example.com"],
    replyTo: "visitor@example.com",
    templateVersion: ENQUIRY_INTERNAL_TEMPLATE_VERSION,
    receivedAtDisplay: "2026-09-21T12:00:00Z",
    publicReference: "ZQ-1",
    payloadFingerprint: "fp",
  });
  assert.equal(a, b);
  pass("fingerprint-canonical-recipient-order");
}

function main() {
  testInitialIntentStates();
  testFreezeStability();
  testProviderKeyExcludesBrowserMaterial();
  testSendOutcomeMapping();
  testFingerprintCanonicalOrder();
  console.log(`\n${passed} checks passed`);
}

main();
