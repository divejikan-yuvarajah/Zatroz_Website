/**
 * Unit tests for A02 staff auth gates and config (no live Mongo / Better Auth).
 */

import assert from "node:assert/strict";
import {
  BETTER_AUTH_SECRET_MIN_LENGTH,
  isAuthRuntimeConfigured,
  resolveAuthRuntimeConfig,
} from "../src/lib/auth/config";
import {
  isStaffRole,
  permissionsForStaffRole,
} from "../src/lib/auth/staff-role";
import {
  buildAuthContext,
  requireAdmin,
  requirePermission,
  UNAUTHENTICATED_AUTH_CONTEXT,
  UNAVAILABLE_AUTH_CONTEXT,
} from "../src/lib/security/auth-gate";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function runRoleTests() {
  assert.equal(isStaffRole("owner"), true);
  assert.equal(isStaffRole("editor"), true);
  assert.equal(isStaffRole("admin"), false);
  assert.equal(isStaffRole(null), false);

  const editor = permissionsForStaffRole("editor");
  assert.ok(editor.includes("admin.content.write"));
  assert.ok(!editor.includes("enquiries.read"));
  assert.ok(!editor.includes("admin.content.publish"));

  const owner = permissionsForStaffRole("owner");
  assert.ok(owner.includes("enquiries.read"));
  assert.ok(owner.includes("admin.content.publish"));

  assert.deepEqual(permissionsForStaffRole(null), []);
  pass("staff-role-permissions");
}

function runGateTests() {
  assert.equal(requireAdmin().ok, false);
  assert.equal(requireAdmin(UNAVAILABLE_AUTH_CONTEXT).ok, false);
  if (!requireAdmin(UNAVAILABLE_AUTH_CONTEXT).ok) {
    assert.equal(
      requireAdmin(UNAVAILABLE_AUTH_CONTEXT).reason,
      "auth-unavailable",
    );
  }

  assert.equal(requireAdmin(UNAUTHENTICATED_AUTH_CONTEXT).ok, false);
  if (!requireAdmin(UNAUTHENTICATED_AUTH_CONTEXT).ok) {
    assert.equal(
      requireAdmin(UNAUTHENTICATED_AUTH_CONTEXT).reason,
      "unauthenticated",
    );
  }

  const noMfa = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: false,
    staffRole: "owner",
    userId: "u1",
    email: "owner@example.com",
  });
  assert.equal(requireAdmin(noMfa).ok, false);
  if (!requireAdmin(noMfa).ok) {
    assert.equal(requireAdmin(noMfa).reason, "mfa-required");
  }
  assert.equal(noMfa.permissions.length, 0);

  const editorReady = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "editor",
    userId: "u2",
    email: "editor@example.com",
  });
  assert.equal(requireAdmin(editorReady).ok, true);
  assert.equal(requirePermission("admin.content.write", editorReady).ok, true);
  assert.equal(requirePermission("enquiries.read", editorReady).ok, false);
  if (!requirePermission("enquiries.read", editorReady).ok) {
    assert.equal(
      requirePermission("enquiries.read", editorReady).reason,
      "denied",
    );
  }

  const ownerReady = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "owner",
    userId: "u3",
    email: "owner@example.com",
  });
  assert.equal(requireAdmin(ownerReady).ok, true);
  assert.equal(requirePermission("enquiries.manage", ownerReady).ok, true);
  assert.equal(requirePermission("admin.content.publish", ownerReady).ok, true);

  const unknownRole = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: null,
    userId: "u4",
    email: "x@example.com",
  });
  assert.equal(requireAdmin(unknownRole).ok, false);
  if (!requireAdmin(unknownRole).ok) {
    assert.equal(requireAdmin(unknownRole).reason, "denied");
  }

  pass("auth-gates-mfa-and-roles");
}

function runConfigTests() {
  const missing = resolveAuthRuntimeConfig({});
  assert.equal(missing.ok, false);
  assert.equal(isAuthRuntimeConfigured({}), false);

  const short = resolveAuthRuntimeConfig({
    BETTER_AUTH_SECRET: "too-short",
    SITE_URL: "http://localhost:3000",
  });
  assert.equal(short.ok, false);

  const secret = "a".repeat(BETTER_AUTH_SECRET_MIN_LENGTH);
  const ok = resolveAuthRuntimeConfig({
    BETTER_AUTH_SECRET: secret,
    SITE_URL: "http://localhost:3000",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.config.baseURL, "http://localhost:3000");
    assert.equal(ok.config.secret.length, BETTER_AUTH_SECRET_MIN_LENGTH);
  }

  const explicit = resolveAuthRuntimeConfig({
    BETTER_AUTH_SECRET: secret,
    BETTER_AUTH_URL: "https://admin.example.com",
    BETTER_AUTH_APP_NAME: "Zatroz Staff",
  });
  assert.equal(explicit.ok, true);
  if (explicit.ok) {
    assert.equal(explicit.config.baseURL, "https://admin.example.com");
    assert.equal(explicit.config.appName, "Zatroz Staff");
  }

  pass("auth-runtime-config");
}

runRoleTests();
runGateTests();
runConfigTests();
console.log(`\n${passed} checks passed`);
