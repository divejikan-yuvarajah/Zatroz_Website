/**
 * Deterministic tests for Step 46 request/abuse safeguards.
 * Live Mongo privilege / cross-process limiter proofs — Not run without disposable DB.
 */

import assert from "node:assert/strict";
import {
  buildAllowedOrigins,
  checkEnquiryOrigin,
  checkFetchMetadataSupplement,
  isUntrustedOriginSourceHeader,
} from "../src/lib/security/origins";
import {
  checkContentLengthBudget,
  checkJsonContentType,
  parseJsonObjectRoot,
  readBodyWithBudget,
  isWithinEnquiryPayloadBudget,
} from "../src/lib/security/request-body";
import {
  assertNoForbiddenLogFields,
  createCorrelationId,
  formatSafeLogLine,
  mapFailureToEnquiryResult,
} from "../src/lib/security/errors";
import {
  buildRateLimitBucketId,
  windowBounds,
} from "../src/lib/security/rate-limit-keys";
import {
  ENQUIRY_REQUEST_BODY_BUDGET_BYTES,
  RATE_LIMIT_POLICIES,
} from "../src/lib/security/policy";
import { isRateLimitBucketActive } from "../src/lib/mongodb/models/validate";
import { gateEnquiryServerActionInput } from "../src/lib/security/enquiry-gate";
import { requireAdmin, requirePermission } from "../src/lib/security/auth-gate";
import {
  MISSING_IDENTITY_FALLBACK,
  resolveTrustedClientIdentity,
} from "../src/lib/security/trusted-identity";
import { evaluateEnquiryEnvReadiness } from "../src/lib/security/readiness-env";

const BUDGET = ENQUIRY_REQUEST_BODY_BUDGET_BYTES;

function pass(label: string) {
  console.log(`PASS ${label}`);
}

function runOriginTests() {
  const prod = {
    appOrigin: "https://zatroz.example",
    appEnv: "production" as const,
  };
  assert.deepEqual(buildAllowedOrigins(prod), ["https://zatroz.example"]);
  assert.equal(checkEnquiryOrigin(null, prod).ok, false);
  assert.equal(checkEnquiryOrigin("null", prod).ok, false);
  assert.equal(checkEnquiryOrigin("https://evil.example", prod).ok, false);
  assert.equal(checkEnquiryOrigin("https://zatroz.example", prod).ok, true);

  const dev = {
    appOrigin: "https://zatroz.example",
    appEnv: "development" as const,
  };
  const allowed = buildAllowedOrigins(dev);
  assert.ok(allowed.includes("http://localhost:3000"));
  assert.equal(checkEnquiryOrigin("http://localhost:3000", dev).ok, true);

  assert.equal(isUntrustedOriginSourceHeader("Host"), true);
  assert.equal(isUntrustedOriginSourceHeader("X-Forwarded-Host"), true);
  assert.equal(isUntrustedOriginSourceHeader("Origin"), false);

  // Spoofed Host must not expand allowlist — allowlist ignores it by design.
  const withSpoofedHost = buildAllowedOrigins({
    appOrigin: "https://zatroz.example",
    appEnv: "production",
    extraDevOrigins: ["https://spoofed-via-host.example"],
  });
  assert.equal(
    withSpoofedHost.includes("https://spoofed-via-host.example"),
    false,
  );

  pass("origin-allowlist-and-spoof-host-ignored");
}

function runFetchMetadataTests() {
  assert.equal(checkFetchMetadataSupplement({}).ok, true);
  assert.equal(
    checkFetchMetadataSupplement({ secFetchSite: "cross-site" }).ok,
    false,
  );
  pass("fetch-metadata-supplement");
}

async function runBodyTests() {
  assert.equal(checkJsonContentType("application/json").ok, true);
  assert.equal(
    checkJsonContentType("application/json; charset=utf-8").ok,
    true,
  );
  assert.equal(checkJsonContentType("text/plain").ok, false);
  assert.equal(checkContentLengthBudget(String(BUDGET + 1)).ok, false);
  assert.equal(checkContentLengthBudget("12").ok, true);

  const over = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(BUDGET + 1));
      controller.close();
    },
  });
  const overResult = await readBodyWithBudget(over, BUDGET);
  assert.equal(overResult.ok, false);

  const okBytes = new TextEncoder().encode('{"a":1}');
  const okStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(okBytes);
      controller.close();
    },
  });
  const okResult = await readBodyWithBudget(okStream);
  assert.equal(okResult.ok, true);

  assert.equal(parseJsonObjectRoot(okBytes).ok, true);
  assert.equal(
    parseJsonObjectRoot(new TextEncoder().encode("[1,2]")).ok,
    false,
  );
  assert.equal(
    parseJsonObjectRoot(new TextEncoder().encode("not-json")).ok,
    false,
  );

  assert.equal(isWithinEnquiryPayloadBudget({ message: "x".repeat(10) }), true);
  assert.equal(
    isWithinEnquiryPayloadBudget({
      message: "x".repeat(ENQUIRY_REQUEST_BODY_BUDGET_BYTES),
    }),
    false,
  );
  pass("body-budget-content-type-json-root");
}

function runErrorLogTests() {
  const id = createCorrelationId();
  assert.ok(id.startsWith("z-"));
  const line = formatSafeLogLine({
    category: "rate-limited",
    operation: "enquiry.test",
    correlationId: id,
    elapsedMs: 12,
  });
  assert.ok(!line.includes("@"));
  assert.ok(!line.includes("password"));
  assert.equal(
    mapFailureToEnquiryResult("rate-limited").status,
    "rate-limited",
  );
  assert.equal(mapFailureToEnquiryResult("network").status, "unavailable");
  assert.deepEqual(
    assertNoForbiddenLogFields({ email: "a@b.c", category: "x" }),
    ["email"],
  );
  pass("safe-errors-and-log-allowlist");
}

function runRateLimitKeyTests() {
  const now = new Date("2026-09-18T12:00:00.000Z");
  const { windowStart, windowEnd, expiresAt } = windowBounds(
    now,
    RATE_LIMIT_POLICIES.enquiryPerSource.windowMs,
  );
  assert.ok(windowStart.getTime() <= now.getTime());
  assert.ok(windowEnd.getTime() > now.getTime());

  const idA = buildRateLimitBucketId({
    policyId: "enquiry-per-source",
    identityHash: "abc",
    windowStart,
  });
  const idB = buildRateLimitBucketId({
    policyId: "enquiry-per-source",
    identityHash: "abc",
    windowStart,
  });
  assert.equal(idA, idB);

  const nextWindow = new Date(windowEnd.getTime() + 1);
  const { windowStart: start2 } = windowBounds(
    nextWindow,
    RATE_LIMIT_POLICIES.enquiryPerSource.windowMs,
  );
  const idC = buildRateLimitBucketId({
    policyId: "enquiry-per-source",
    identityHash: "abc",
    windowStart: start2,
  });
  assert.notEqual(idA, idC);

  // Old document can still exist (TTL delayed) without governing the new window.
  const stale = {
    windowStart,
    windowEnd,
    expiresAt,
  };
  assert.equal(isRateLimitBucketActive(stale, nextWindow), false);
  pass("rate-limit-keys-and-window-rollover");
}

function runIdentityTests() {
  const missing = resolveTrustedClientIdentity({
    headers: {
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
      "x-real-ip": "9.9.9.9",
    },
    platform: "unknown",
  });
  assert.equal(missing.ok, false);

  const vercel = resolveTrustedClientIdentity({
    headers: {
      "x-vercel-forwarded-for": "203.0.113.10",
      "x-forwarded-for": "1.2.3.4",
    },
    platform: "vercel",
  });
  assert.equal(vercel.ok, true);
  if (vercel.ok) {
    assert.equal(vercel.identity, "203.0.113.10");
  }

  const injected = resolveTrustedClientIdentity({
    headers: {},
    testIdentity: "test-client-1",
  });
  assert.equal(injected.ok, true);
  assert.equal(MISSING_IDENTITY_FALLBACK.includes("missing"), true);
  pass("trusted-identity-ignores-spoofed-xff");
}

function runAuthGateTests() {
  assert.equal(requireAdmin().ok, false);
  assert.equal(requirePermission("enquiries.read").ok, false);
  assert.equal(requirePermission("admin.content.write").ok, false);
  pass("auth-gate-always-denies");
}

function runPolicyGateTests() {
  const allowed = gateEnquiryServerActionInput({
    headers: { origin: "http://localhost:3000" },
    rawInput: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "",
      service: "not-sure",
      message: "x".repeat(40),
      timeline: "",
      requestType: "project-enquiry",
      preferredContact: "email",
      phone: "",
    },
    env: {
      APP_ENV: "development",
      SITE_URL: "http://localhost:3000",
    },
  });
  assert.equal(allowed.ok, true);

  const foreign = gateEnquiryServerActionInput({
    headers: { origin: "https://evil.example" },
    rawInput: { name: "Ada" },
    env: {
      APP_ENV: "production",
      APP_ORIGIN: "https://zatroz.example",
    },
  });
  assert.equal(foreign.ok, false);

  const serverOwned = gateEnquiryServerActionInput({
    headers: { origin: "http://localhost:3000" },
    rawInput: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "",
      service: "not-sure",
      message: "x".repeat(40),
      timeline: "",
      requestType: "project-enquiry",
      preferredContact: "email",
      phone: "",
      status: "new",
    },
    env: { APP_ENV: "development", SITE_URL: "http://localhost:3000" },
  });
  assert.equal(serverOwned.ok, false);

  const hostHeaderIgnored = gateEnquiryServerActionInput({
    headers: {
      origin: "https://evil.example",
      host: "zatroz.example",
      xForwardedHost: "zatroz.example",
    },
    rawInput: { name: "x" },
    env: {
      APP_ENV: "production",
      APP_ORIGIN: "https://zatroz.example",
    },
  });
  assert.equal(hostHeaderIgnored.ok, false);
  pass("server-action-policy-gate");
}

async function runReadinessTests() {
  const items = evaluateEnquiryEnvReadiness({});
  assert.ok(items.some((item) => item.id === "env-mongodb" && !item.ok));
  assert.ok(items.every((item) => item.ok === false));
  pass("readiness-env-fails-closed-without-config");
}

async function main() {
  runOriginTests();
  runFetchMetadataTests();
  await runBodyTests();
  runErrorLogTests();
  runRateLimitKeyTests();
  runIdentityTests();
  runAuthGateTests();
  runPolicyGateTests();
  await runReadinessTests();
  console.log("All request-safeguard unit tests passed.");
  console.log(
    "INTEGRATION: Mongo privilege probes + cross-process rate-limit — Not run until disposable DB credentials exist.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
