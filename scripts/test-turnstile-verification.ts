/**
 * Turnstile verification unit tests — pure helpers + mocked Siteverify.
 */

import assert from "node:assert/strict";
import {
  TURNSTILE_ENQUIRY_ACTION,
  TURNSTILE_TEST_SECRET_KEYS,
  TURNSTILE_TEST_SITE_KEYS,
  evaluateSiteverifyResponse,
  hostnameFromOrigin,
  isTurnstileTestSecretKey,
  isTurnstileTestSiteKey,
  parseSiteverifyResponse,
  resolveTurnstileConfig,
  turnstileConfigUsesTestKeysInProduction,
  validateTurnstileToken,
} from "../src/lib/security/turnstile";
import { verifyEnquiryTurnstileToken } from "../src/lib/security/turnstile-siteverify";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function testHostnameFromOrigin() {
  assert.equal(hostnameFromOrigin("http://localhost:3000"), "localhost");
  assert.equal(hostnameFromOrigin("https://zatroz.example"), "zatroz.example");
  assert.equal(hostnameFromOrigin("not-a-url"), null);
  pass("hostname-from-origin");
}

function testTestKeyDetection() {
  assert.equal(isTurnstileTestSiteKey(TURNSTILE_TEST_SITE_KEYS[0]), true);
  assert.equal(isTurnstileTestSiteKey("real-site-key"), false);
  assert.equal(isTurnstileTestSecretKey(TURNSTILE_TEST_SECRET_KEYS[0]), true);
  pass("test-key-detection");
}

function testProductionRejectsTestKeys() {
  const config = resolveTurnstileConfig({
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
    TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
    APP_ORIGIN: "http://localhost:3000",
    APP_ENV: "production",
  });
  assert.ok(config);
  assert.equal(turnstileConfigUsesTestKeysInProduction(config!), true);
  pass("production-rejects-test-keys");
}

function testTokenValidation() {
  assert.equal(validateTurnstileToken(null), null);
  assert.equal(validateTurnstileToken(""), null);
  assert.equal(validateTurnstileToken("short"), null);
  assert.equal(
    validateTurnstileToken("0123456789012345678901234567890"),
    "0123456789012345678901234567890",
  );
  pass("token-validation");
}

function testParseAndEvaluateSiteverify() {
  const parsed = parseSiteverifyResponse({
    success: true,
    hostname: "localhost",
    action: TURNSTILE_ENQUIRY_ACTION,
  });
  assert.ok(parsed);
  const ok = evaluateSiteverifyResponse(parsed!, {
    hostname: "localhost",
    action: TURNSTILE_ENQUIRY_ACTION,
  });
  assert.equal(ok.ok, true);

  const wrongHost = evaluateSiteverifyResponse(parsed!, {
    hostname: "evil.example",
    action: TURNSTILE_ENQUIRY_ACTION,
  });
  assert.equal(wrongHost.ok, false);
  if (!wrongHost.ok) {
    assert.equal(wrongHost.reason, "wrong-hostname");
  }

  const rejected = evaluateSiteverifyResponse(
    { success: false, "error-codes": ["invalid-input-response"] },
    { hostname: "localhost", action: TURNSTILE_ENQUIRY_ACTION },
  );
  assert.equal(rejected.ok, false);
  if (!rejected.ok) {
    assert.equal(rejected.reason, "provider-rejected");
  }

  pass("parse-and-evaluate-siteverify");
}

async function testMissingConfig() {
  const result = await verifyEnquiryTurnstileToken({
    token: "0123456789012345678901234567890",
    env: {},
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "missing-config");
  }
  pass("missing-config-fails");
}

async function testMissingToken() {
  const result = await verifyEnquiryTurnstileToken({
    token: undefined,
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "missing-token");
  }
  pass("missing-token-fails");
}

async function testMockedSuccessfulVerify() {
  const mockFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        success: true,
        hostname: "localhost",
        action: TURNSTILE_ENQUIRY_ACTION,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );

  const result = await verifyEnquiryTurnstileToken({
    token: "0123456789012345678901234567890",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
    fetchImpl: mockFetch,
  });

  assert.equal(result.ok, true);
  pass("mocked-successful-verify");
}

async function testMockedWrongAction() {
  const mockFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        success: true,
        hostname: "localhost",
        action: "wrong-action",
      }),
      { status: 200 },
    );

  const result = await verifyEnquiryTurnstileToken({
    token: "0123456789012345678901234567890",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
    fetchImpl: mockFetch,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "wrong-action");
  }
  pass("mocked-wrong-action-rejected");
}

async function testProviderTimeout() {
  const mockFetch: typeof fetch = async (_input, init) =>
    new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"));
      });
    });

  const result = await verifyEnquiryTurnstileToken({
    token: "0123456789012345678901234567890",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
    fetchImpl: mockFetch,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "provider-unavailable");
  }
  pass("provider-timeout-fails-closed");
}

async function testMalformedResponse() {
  const mockFetch: typeof fetch = async () =>
    new Response(JSON.stringify({ ok: true }), { status: 200 });

  const result = await verifyEnquiryTurnstileToken({
    token: "0123456789012345678901234567890",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
    fetchImpl: mockFetch,
  });

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "malformed-response");
  }
  pass("malformed-response-fails");
}

async function testOversizedToken() {
  const huge = "a".repeat(3000);
  const result = await verifyEnquiryTurnstileToken({
    token: huge,
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "http://localhost:3000",
      APP_ENV: "development",
    },
    fetchImpl: async () => {
      throw new Error("Siteverify must not be called for oversized tokens");
    },
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "invalid-token");
  }
  pass("oversized-token-rejected-before-siteverify");
}

async function testProductionVerifyRejectsTestKeys() {
  const result = await verifyEnquiryTurnstileToken({
    token: "0123456789012345678901234567890",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_TEST_SITE_KEYS[0],
      TURNSTILE_SECRET_KEY: TURNSTILE_TEST_SECRET_KEYS[0],
      APP_ORIGIN: "https://zatroz.example",
      APP_ENV: "production",
    },
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.reason, "test-keys-in-production");
  }
  pass("production-verify-rejects-test-keys");
}

async function run() {
  testHostnameFromOrigin();
  testTestKeyDetection();
  testProductionRejectsTestKeys();
  testTokenValidation();
  testParseAndEvaluateSiteverify();
  await testMissingConfig();
  await testMissingToken();
  await testMockedSuccessfulVerify();
  await testMockedWrongAction();
  await testProviderTimeout();
  await testMalformedResponse();
  await testOversizedToken();
  await testProductionVerifyRejectsTestKeys();
  console.log(`\n${passed} checks passed`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
