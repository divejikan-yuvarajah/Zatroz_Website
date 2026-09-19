/**
 * Unit tests for A03 admin nav filtering and dashboard count helpers.
 */

import assert from "node:assert/strict";
import {
  classifyProjectPublication,
  isAttentionContentJobState,
  summarizePublicationCounts,
} from "../src/lib/admin/dashboard-counts";
import {
  canSeeAdminNavItem,
  visibleAdminNav,
  visibleAdminShortcuts,
} from "../src/lib/admin/nav";
import {
  buildAuthContext,
  UNAUTHENTICATED_AUTH_CONTEXT,
} from "../src/lib/security/auth-gate";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function runCountHelpers() {
  assert.equal(
    classifyProjectPublication({ publishedSummaryRevisionId: null }),
    "draft",
  );
  assert.equal(
    classifyProjectPublication({ publishedSummaryRevisionId: "rev-1" }),
    "published",
  );

  const summary = summarizePublicationCounts([
    { publishedSummaryRevisionId: null },
    { publishedSummaryRevisionId: "a" },
    { publishedSummaryRevisionId: null },
  ]);
  assert.equal(summary.drafts, 2);
  assert.equal(summary.published, 1);

  assert.equal(isAttentionContentJobState("queued"), true);
  assert.equal(isAttentionContentJobState("failed"), true);
  assert.equal(isAttentionContentJobState("succeeded"), false);
  pass("dashboard-count-helpers");
}

function runNavVisibility() {
  const editor = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "editor",
    userId: "e1",
    email: "editor@example.com",
  });
  const owner = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "owner",
    userId: "o1",
    email: "owner@example.com",
  });

  const editorNav = visibleAdminNav(editor);
  assert.ok(editorNav.some((item) => item.id === "dashboard"));
  assert.ok(!editorNav.some((item) => item.id === "staff"));
  assert.ok(!editorNav.some((item) => item.id === "featured"));

  const ownerNav = visibleAdminNav(owner);
  assert.ok(ownerNav.some((item) => item.id === "staff"));
  assert.ok(ownerNav.some((item) => item.id === "featured"));

  const staffItem = ownerNav.find((item) => item.id === "staff");
  assert.ok(staffItem);
  if (staffItem) {
    assert.equal(canSeeAdminNavItem(staffItem, editor), false);
    assert.equal(canSeeAdminNavItem(staffItem, owner), true);
  }

  const editorShortcuts = visibleAdminShortcuts(editor);
  assert.ok(!editorShortcuts.some((item) => item.id === "manage-staff"));
  const ownerShortcuts = visibleAdminShortcuts(owner);
  assert.ok(ownerShortcuts.some((item) => item.id === "manage-staff"));

  assert.deepEqual(visibleAdminNav(UNAUTHENTICATED_AUTH_CONTEXT), []);
  pass("admin-nav-role-enforcement");
}

runCountHelpers();
runNavVisibility();
console.log(`\n${passed} checks passed`);
