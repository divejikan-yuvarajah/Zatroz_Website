import assert from "node:assert/strict";
import {
  captureBrowserEvent,
  capturePublicEvent,
} from "../src/lib/observability/capture";
import { noteEnquiryAccepted } from "../src/lib/observability/enquiry-acceptance";
import {
  redactDiagnosticText,
  safeBoundaryFields,
} from "../src/lib/observability/redact";
import {
  readObservabilitySink,
  resetObservabilitySink,
} from "../src/lib/observability/sink";
import {
  evaluateOperationalSignals,
  livenessPayload,
} from "../src/lib/observability/signals";

const canary = "user-canary-secret@example.com";

resetObservabilitySink();
const rejected = capturePublicEvent("local", {
  name: "contact_started",
  properties: {
    routeTemplate: "/contact",
    placement: "contact",
    outcome: "started",
    email: canary,
    message: "hello canary",
    referrer: "https://evil.example/?token=canary",
  },
});
assert.equal(rejected.stored, true);
const stored = readObservabilitySink()[0];
assert.ok(stored);
assert.equal(JSON.stringify(stored).includes("canary"), false);
assert.equal(JSON.stringify(stored).includes("@"), false);
assert.equal(stored.properties.routeTemplate, "/contact");

const admin = capturePublicEvent("local", {
  name: "service_cta_clicked",
  routePath: "/admin/projects",
  properties: { serviceKey: "custom-software", outcome: "click" },
});
assert.equal(admin.reason, "rejected");

const disabled = capturePublicEvent("disabled", {
  name: "contact_started",
  properties: { routeTemplate: "/contact", outcome: "started" },
});
assert.equal(disabled.reason, "disabled");

resetObservabilitySink();
const browser = captureBrowserEvent({
  name: "contact_accepted",
  properties: {
    message: canary,
    routeTemplate: "/contact",
    outcome: "accepted",
  },
});
assert.equal(browser.reason, "browser-disabled");
assert.equal(readObservabilitySink().length, 0);

resetObservabilitySink();
const first = capturePublicEvent(
  "local",
  {
    name: "work_detail_viewed",
    properties: { routeTemplate: "/work/[slug]", outcome: "view" },
  },
  "work-once",
);
const second = capturePublicEvent(
  "local",
  {
    name: "work_detail_viewed",
    properties: { routeTemplate: "/work/[slug]", outcome: "view" },
  },
  "work-once",
);
assert.equal(first.stored, true);
assert.equal(second.reason, "duplicate");
assert.equal(readObservabilitySink().length, 1);

const quiet: string[] = [];
const original = console.info;
console.info = (line: unknown) => {
  quiet.push(String(line));
};
noteEnquiryAccepted({
  duplicated: true,
  service: "custom-software",
  correlationId: "z-0123456789abcdef",
  elapsedMs: 4,
  analyticsSink: "local",
});
assert.equal(quiet.length, 0);
noteEnquiryAccepted({
  duplicated: false,
  service: "custom-software",
  correlationId: "z-0123456789abcdef",
  elapsedMs: 4,
  analyticsSink: "local",
});
noteEnquiryAccepted({
  duplicated: false,
  service: canary,
  correlationId: "not-a-safe-id",
  elapsedMs: 4,
  analyticsSink: "local",
});
console.info = original;
assert.equal(quiet.length, 2);
assert.equal(quiet.join(" ").includes(canary), false);
assert.equal(quiet[1]?.includes("service=not-sure"), true);
assert.equal(quiet[1]?.includes("correlationId=redacted"), true);

assert.equal(redactDiagnosticText(`boom ${canary}`), "redacted");
const boundary = safeBoundaryFields({
  scope: "app/error",
  name: "Error",
  digest: "abc",
});
assert.equal(boundary.scope, "app/error");
assert.equal(livenessPayload().ok, true);
assert.equal("database" in livenessPayload(), false);

const signals = evaluateOperationalSignals({
  requests: 100,
  serverErrors: 10,
  dbTimeouts: 0,
  challengeFailures: 0,
  oldestPendingNotificationAgeMs: null,
  leaseFailures: 0,
  exhaustedDeliveries: 0,
  uncertainDeliveries: 1,
  acceptedEnquiries: 4,
  deliveredNotifications: 1,
});
assert.ok(signals.some((signal) => signal.code === "server-error-rate"));
assert.ok(signals.some((signal) => signal.code === "delivery-uncertain"));
const below = evaluateOperationalSignals({
  requests: 5,
  serverErrors: 5,
  dbTimeouts: 0,
  challengeFailures: 0,
  oldestPendingNotificationAgeMs: null,
  leaseFailures: 0,
  exhaustedDeliveries: 0,
  uncertainDeliveries: 0,
  acceptedEnquiries: 1,
  deliveredNotifications: 0,
});
assert.equal(below.length, 0);

console.log("All Step 62 observability checks passed.");
