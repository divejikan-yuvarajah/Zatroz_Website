/**
 * Step 53 — enquiry journey matrix (composition tests; no live Mongo / Resend).
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  CRON_PROTECTED_SURFACES,
  STAFF_PROTECTED_SURFACES,
  WEBHOOK_PROTECTED_SURFACES,
  editorForbiddenPermissions,
  evaluateOperationAccess,
  sampleEditorContext,
  sampleOwnerContext,
} from "../src/lib/admin/authz-matrix";
import { publicRoutes } from "../src/config/routes";
import { contactPageRecord } from "../src/content/contact-page";
import { parseContactServiceParam } from "../src/lib/contact-service-query";
import { resolveEmailConfig } from "../src/lib/email/config";
import { validateEnquiryInput } from "../src/lib/enquiries/input";
import {
  ENQUIRY_NOTIFICATION_IDEMPOTENCY_MARGIN_MS,
  RESEND_IDEMPOTENCY_WINDOW_MS,
  buildInitialNotificationIntent,
  decideNotificationRetry,
  deliveryFactFromResendEvent,
  isWithinProviderIdempotencyWindow,
  mergeDeliveryFact,
} from "../src/lib/enquiries/notification-intent";
import { requirePermission } from "../src/lib/security/auth-gate";
import { gateEnquiryServerActionInput } from "../src/lib/security/enquiry-gate";
import { evaluateEnquiryEnvReadiness } from "../src/lib/security/readiness-env";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function validFormValues() {
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
    phone: "",
  };
}

function testServiceContextCtas() {
  assert.equal(publicRoutes.contact.path, "/contact");
  assert.equal(publicRoutes.contact.implemented, true);
  assert.equal(
    parseContactServiceParam({ service: "websites-ecommerce" }).service,
    "websites-ecommerce",
  );
  assert.equal(
    parseContactServiceParam({ service: "not-a-real-service<script>" }).service,
    null,
  );
  assert.equal(
    parseContactServiceParam({
      service: ["websites-ecommerce", "ai-automation"],
    }).service,
    null,
  );
  pass("service-context-ctas-and-query-allowlist");
}

function testPublicFormStillGated() {
  assert.equal(contactPageRecord.formSubmissionReady, false);
  const contactPage = readFileSync(resolve("src/app/contact/page.tsx"), "utf8");
  assert.match(contactPage, /formSubmissionReady/);
  assert.match(contactPage, /LiveEnquiryForm/);
  assert.match(contactPage, /getEnquiryMailtoHref/);
  pass("public-form-gated-channels-available");
}

function testValidationAndGateFailures() {
  const invalid = validateEnquiryInput({
    name: "",
    email: "not-an-email",
    company: "",
    service: "",
    message: "short",
    timeline: "",
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: "",
  });
  assert.equal(invalid.ok, false);

  const valid = validateEnquiryInput(validFormValues());
  assert.equal(valid.ok, true);

  const originDenied = gateEnquiryServerActionInput({
    headers: { origin: "https://evil.example" },
    rawInput: { ...validFormValues() },
    env: {
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
  });
  assert.equal(originDenied.ok, false);

  const originOk = gateEnquiryServerActionInput({
    headers: { origin: "http://localhost:3000" },
    rawInput: { ...validFormValues() },
    env: {
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
  });
  assert.equal(originOk.ok, true);
  pass("validation-and-origin-gate-failures");
}

function testAcceptanceIndependentOfEmail() {
  const now = new Date("2026-09-22T12:00:00.000Z");
  const paused = buildInitialNotificationIntent({
    now,
    notificationsEnabled: false,
  });
  assert.equal(paused.state, "paused");
  assert.equal(paused.lastErrorCategory, "notifications-disabled");

  const pending = buildInitialNotificationIntent({
    now,
    notificationsEnabled: true,
  });
  assert.equal(pending.state, "pending");

  const config = resolveEmailConfig({
    EMAIL_TRANSPORT: "capture",
    EMAIL_NOTIFICATIONS_ENABLED: "false",
    ENQUIRY_FROM_EMAIL: "Zatroz <notifications@updates.example.com>",
    ENQUIRY_NOTIFICATION_EMAIL: "delivered@resend.dev",
    APP_ENV: "development",
  });
  assert.ok(config === null || config.notificationsEnabled === false);
  pass("acceptance-independent-of-email-config");
}

function testRetryAndIdempotencyHorizon() {
  const first = new Date("2026-09-22T00:00:00.000Z");
  const inside = new Date(
    first.getTime() +
      RESEND_IDEMPOTENCY_WINDOW_MS -
      ENQUIRY_NOTIFICATION_IDEMPOTENCY_MARGIN_MS -
      60_000,
  );
  assert.equal(
    isWithinProviderIdempotencyWindow({
      firstProviderAttemptAt: first,
      now: inside,
    }),
    true,
  );

  const outside = new Date(
    first.getTime() + RESEND_IDEMPOTENCY_WINDOW_MS + 60_000,
  );
  assert.equal(
    isWithinProviderIdempotencyWindow({
      firstProviderAttemptAt: first,
      now: outside,
    }),
    false,
  );

  const retry = decideNotificationRetry({
    intentId: "eni_journey_1",
    attempts: 2,
    createdAt: first,
    firstProviderAttemptAt: first,
    now: inside,
    errorCategory: "provider-unavailable",
    kind: "retryable",
  });
  assert.equal(retry.state, "retry-scheduled");
  assert.ok(retry.nextAttemptAt);

  const review = decideNotificationRetry({
    intentId: "eni_journey_2",
    attempts: 2,
    createdAt: first,
    firstProviderAttemptAt: first,
    now: outside,
    errorCategory: "network-loss",
    kind: "retryable",
  });
  assert.equal(review.state, "needs-review");
  assert.equal(review.nextAttemptAt, null);
  pass("retry-and-idempotency-horizon");
}

function testDeliveryEventOrdering() {
  assert.equal(deliveryFactFromResendEvent("email.delivered"), "delivered");
  assert.equal(deliveryFactFromResendEvent("email.bounced"), "bounced");
  assert.equal(mergeDeliveryFact("delivered", "bounced"), "bounced");
  assert.equal(mergeDeliveryFact("bounced", "delivered"), "bounced");
  assert.equal(mergeDeliveryFact(null, "delivered"), "delivered");
  pass("delivery-event-ordering");
}

function testOwnerVersusEditorRecoveryAuthz() {
  const editor = sampleEditorContext();
  const owner = sampleOwnerContext();

  for (const permission of editorForbiddenPermissions()) {
    if (!permission.startsWith("enquiries.")) continue;
    assert.equal(requirePermission(permission, editor).ok, false);
    assert.equal(requirePermission(permission, owner).ok, true);
  }

  assert.equal(evaluateOperationAccess("enquiries.read", editor).ok, false);
  assert.equal(evaluateOperationAccess("enquiries.manage", editor).ok, false);
  assert.equal(evaluateOperationAccess("enquiries.read", owner).ok, true);
  assert.equal(evaluateOperationAccess("enquiries.manage", owner).ok, true);

  assert.ok(STAFF_PROTECTED_SURFACES.includes("/admin/notifications"));
  assert.ok(STAFF_PROTECTED_SURFACES.includes("notificationRecoveryAction"));
  assert.ok(
    CRON_PROTECTED_SURFACES.includes("POST /api/jobs/enquiry-notifications"),
  );
  assert.ok(WEBHOOK_PROTECTED_SURFACES.includes("POST /api/webhooks/resend"));
  pass("owner-versus-editor-recovery-authz");
}

function testReadinessDistinguishesLayers() {
  const blank = evaluateEnquiryEnvReadiness({});
  assert.equal(
    blank.find((item) => item.id === "enquiries-enabled-flag")?.ok,
    false,
  );

  const enabledMissingSecrets = evaluateEnquiryEnvReadiness({
    ENQUIRIES_ENABLED: "true",
  });
  assert.equal(
    enabledMissingSecrets.find((item) => item.id === "enquiries-enabled-flag")
      ?.ok,
    true,
  );
  assert.equal(
    enabledMissingSecrets.find((item) => item.id === "env-mongodb")?.ok,
    false,
  );
  pass("readiness-distinguishes-layers");
}

function testSourceWiringInventory() {
  const submit = readFileSync(
    resolve("src/server/actions/submit-enquiry.ts"),
    "utf8",
  );
  assert.match(submit, /buildInitialNotificationIntent/);
  assert.match(submit, /notificationIntent/);
  assert.match(submit, /ENQUIRIES_ENABLED/);

  const worker = readFileSync(
    resolve("src/app/api/jobs/enquiry-notifications/route.ts"),
    "utf8",
  );
  assert.match(worker, /CRON_SECRET/);
  assert.match(worker, /dispatchEnquiryNotificationBatch/);

  const webhook = readFileSync(
    resolve("src/app/api/webhooks/resend/route.ts"),
    "utf8",
  );
  assert.match(webhook, /verifyResendWebhookPayload|RESEND_WEBHOOK/);
  assert.match(webhook, /processVerifiedResendDeliveryEvent/);

  const recovery = readFileSync(
    resolve("src/app/admin/(console)/notifications/page.tsx"),
    "utf8",
  );
  assert.match(recovery, /enquiries\.read/);
  assert.match(recovery, /enquiries\.manage/);
  pass("source-wiring-inventory");
}

function main() {
  testServiceContextCtas();
  testPublicFormStillGated();
  testValidationAndGateFailures();
  testAcceptanceIndependentOfEmail();
  testRetryAndIdempotencyHorizon();
  testDeliveryEventOrdering();
  testOwnerVersusEditorRecoveryAuthz();
  testReadinessDistinguishesLayers();
  testSourceWiringInventory();
  console.log(`\n${passed} journey checks passed`);
}

main();
