/**
 * Step 50 — transactional email unit tests (capture mode + templates).
 * No live Resend calls; provider path uses a mock client.
 */

import assert from "node:assert/strict";
import {
  formatMailboxHeader,
  isValidMailbox,
  sanitizeHeaderValue,
} from "../src/lib/email/addresses";
import { createCaptureSink } from "../src/lib/email/capture-sink";
import { resolveEmailConfig } from "../src/lib/email/config";
import {
  isRecipientAllowedForProvider,
  isResendTestDestination,
} from "../src/lib/email/resend-destinations";
import { EMAIL_TEMPLATE_CATALOG } from "../src/lib/email/templates/catalog";
import {
  ENQUIRY_INTERNAL_TEMPLATE_VERSION,
  buildEnquiryInternalSubject,
  renderEnquiryInternalNotification,
} from "../src/lib/email/templates/enquiry-internal";
import { RESEND_IDEMPOTENCY_WINDOW_HOURS } from "../src/lib/email/types";
import type { EnquiryNormalizedInput } from "../src/lib/enquiries/input";
import {
  buildTeamNotificationRequest,
  sendNotification,
} from "../src/lib/email/send-notification";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function sampleEnquiry(
  overrides: Partial<EnquiryNormalizedInput> = {},
): EnquiryNormalizedInput {
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
    ...overrides,
  };
}

function baseEnv(
  overrides: Record<string, string | undefined> = {},
): NodeJS.ProcessEnv {
  return {
    APP_ENV: "development",
    EMAIL_TRANSPORT: "capture",
    EMAIL_NOTIFICATIONS_ENABLED: "true",
    ENQUIRY_FROM_EMAIL: "Zatroz <notifications@updates.example.com>",
    ENQUIRY_NOTIFICATION_EMAIL: "delivered@resend.dev",
    RESEND_API_KEY: "",
    ...overrides,
  };
}

function testAddressHelpers() {
  assert.equal(isValidMailbox("team@example.com"), true);
  assert.equal(isValidMailbox("bad"), false);
  assert.equal(sanitizeHeaderValue("a\r\nb"), "a b");
  assert.equal(
    formatMailboxHeader("notifications@updates.example.com", "Zatroz"),
    "Zatroz <notifications@updates.example.com>",
  );
  pass("address-helpers");
}

function testConfigResolution() {
  const ok = resolveEmailConfig(baseEnv());
  assert.ok(ok);
  assert.equal(ok!.transport, "capture");
  assert.equal(ok!.notificationsEnabled, true);

  assert.equal(
    resolveEmailConfig(baseEnv({ ENQUIRY_FROM_EMAIL: undefined })),
    null,
  );
  assert.equal(
    resolveEmailConfig(
      baseEnv({ EMAIL_TRANSPORT: "provider", RESEND_API_KEY: undefined }),
    ),
    null,
  );

  const providerOk = resolveEmailConfig(
    baseEnv({
      EMAIL_TRANSPORT: "provider",
      RESEND_API_KEY: "re_test_placeholder",
      ENQUIRY_NOTIFICATION_EMAIL: "delivered@resend.dev",
    }),
  );
  assert.ok(providerOk);
  assert.equal(providerOk!.transport, "provider");
  pass("config-resolution");
}

function testRecipientPolicy() {
  assert.equal(isResendTestDestination("delivered@resend.dev"), true);
  assert.equal(isResendTestDestination("delivered+label@resend.dev"), true);
  assert.equal(isResendTestDestination("team@gmail.com"), false);

  assert.equal(
    isRecipientAllowedForProvider({
      recipient: "delivered@resend.dev",
      appEnv: "development",
      teamAllowlist: ["team@example.com"],
      authorizedTestInbox: null,
    }),
    true,
  );
  assert.equal(
    isRecipientAllowedForProvider({
      recipient: "team@example.com",
      appEnv: "development",
      teamAllowlist: ["team@example.com"],
      authorizedTestInbox: null,
    }),
    false,
  );
  assert.equal(
    isRecipientAllowedForProvider({
      recipient: "team@example.com",
      appEnv: "production",
      teamAllowlist: ["team@example.com"],
      authorizedTestInbox: null,
    }),
    true,
  );
  pass("recipient-policy");
}

function testTemplateEscapingAndStability() {
  const enquiry = sampleEnquiry({
    name: '<script>alert("x")</script>',
    message: "Line one\nLine two & more",
  });

  const first = renderEnquiryInternalNotification({
    reference: "ZQ-TEST-001",
    receivedAtDisplay: "2026-09-20T12:00:00.000Z",
    enquiry,
  });
  const second = renderEnquiryInternalNotification({
    reference: "ZQ-TEST-001",
    receivedAtDisplay: "2026-09-20T12:00:00.000Z",
    enquiry,
  });

  assert.equal(first.templateVersion, ENQUIRY_INTERNAL_TEMPLATE_VERSION);
  assert.equal(first.subject, second.subject);
  assert.equal(first.html, second.html);
  assert.equal(first.text, second.text);
  assert.equal(first.html.includes("<script>"), false);
  assert.equal(first.html.includes("&lt;script&gt;"), true);
  assert.equal(first.text.includes("Line one\nLine two & more"), true);
  assert.equal(first.subject.includes("\n"), false);
  assert.match(first.subject, /^Zatroz enquiry ZQ-TEST-001/);

  const injected = buildEnquiryInternalSubject({
    reference: "ZQ-1\r\nBcc: evil@example.com",
    service: "websites-ecommerce",
  });
  assert.equal(injected.includes("\n"), false);
  assert.equal(injected.includes("\r"), false);

  assert.ok(
    EMAIL_TEMPLATE_CATALOG.some(
      (entry) => entry.version === ENQUIRY_INTERNAL_TEMPLATE_VERSION,
    ),
  );
  assert.equal(RESEND_IDEMPOTENCY_WINDOW_HOURS, 24);
  pass("template-escaping-and-stability");
}

async function testCaptureSend() {
  const sink = createCaptureSink();
  const config = resolveEmailConfig(baseEnv())!;
  const rendered = renderEnquiryInternalNotification({
    reference: "ZQ-CAP-1",
    receivedAtDisplay: "2026-09-20T12:00:00.000Z",
    enquiry: sampleEnquiry(),
  });

  const request = buildTeamNotificationRequest({
    config,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    templateVersion: rendered.templateVersion,
    providerIdempotencyKey: "enquiry-notice/ZQ-CAP-1/v1",
  });

  const result = await sendNotification(request, {
    env: baseEnv(),
    captureSink: sink,
    createCaptureId: () => "capture_fixed_1",
    nowIso: () => "2026-09-20T12:00:00.000Z",
  });

  assert.equal(result.status, "accepted");
  if (result.status === "accepted") {
    assert.equal(result.transport, "capture");
    assert.equal(result.messageId, "capture_fixed_1");
  }
  assert.equal(sink.records.length, 1);
  assert.equal(sink.records[0]?.subject, rendered.subject);
  pass("capture-send");
}

async function testNotificationsDisabled() {
  const sink = createCaptureSink();
  const env = baseEnv({ EMAIL_NOTIFICATIONS_ENABLED: "false" });
  const config = resolveEmailConfig(env)!;
  const rendered = renderEnquiryInternalNotification({
    reference: "ZQ-OFF-1",
    receivedAtDisplay: "2026-09-20T12:00:00.000Z",
    enquiry: sampleEnquiry(),
  });
  const request = buildTeamNotificationRequest({
    config,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    templateVersion: rendered.templateVersion,
  });

  const result = await sendNotification(request, { env, captureSink: sink });
  assert.equal(result.status, "rejected");
  if (result.status === "rejected") {
    assert.equal(result.reason, "notifications-disabled");
  }
  assert.equal(sink.records.length, 0);
  pass("notifications-disabled");
}

async function testProviderMockAccept() {
  const env = baseEnv({
    EMAIL_TRANSPORT: "provider",
    RESEND_API_KEY: "re_test_placeholder",
    ENQUIRY_NOTIFICATION_EMAIL: "delivered@resend.dev",
  });
  const config = resolveEmailConfig(env)!;
  const rendered = renderEnquiryInternalNotification({
    reference: "ZQ-PROV-1",
    receivedAtDisplay: "2026-09-20T12:00:00.000Z",
    enquiry: sampleEnquiry(),
  });
  const request = buildTeamNotificationRequest({
    config,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    templateVersion: rendered.templateVersion,
    providerIdempotencyKey: "enquiry-notice/ZQ-PROV-1/v1",
  });

  const result = await sendNotification(request, {
    env,
    resendClient: {
      emails: {
        send: async () => ({ data: { id: "msg_test_1" }, error: null }),
      },
    },
  });

  assert.equal(result.status, "accepted");
  if (result.status === "accepted") {
    assert.equal(result.transport, "provider");
    assert.equal(result.messageId, "msg_test_1");
  }
  pass("provider-mock-accept");
}

async function testProviderRejectsTeamGmailInDev() {
  const env = baseEnv({
    EMAIL_TRANSPORT: "provider",
    RESEND_API_KEY: "re_test_placeholder",
    ENQUIRY_NOTIFICATION_EMAIL: "zatroz.co@gmail.com",
  });
  const config = resolveEmailConfig(env)!;
  const rendered = renderEnquiryInternalNotification({
    reference: "ZQ-BLOCK-1",
    receivedAtDisplay: "2026-09-20T12:00:00.000Z",
    enquiry: sampleEnquiry(),
  });
  const request = buildTeamNotificationRequest({
    config,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    templateVersion: rendered.templateVersion,
  });

  let called = false;
  const result = await sendNotification(request, {
    env,
    resendClient: {
      emails: {
        send: async () => {
          called = true;
          return { data: { id: "should-not-send" }, error: null };
        },
      },
    },
  });

  assert.equal(called, false);
  assert.equal(result.status, "rejected");
  if (result.status === "rejected") {
    assert.equal(result.reason, "recipient-not-allowed");
  }
  pass("provider-blocks-team-gmail-in-dev");
}

async function main() {
  testAddressHelpers();
  testConfigResolution();
  testRecipientPolicy();
  testTemplateEscapingAndStability();
  await testCaptureSend();
  await testNotificationsDisabled();
  await testProviderMockAccept();
  await testProviderRejectsTeamGmailInDev();
  console.log(`\n${passed} checks passed`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
