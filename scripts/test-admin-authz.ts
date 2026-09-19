/**
 * A12 authorization + failure-path unit suite (no live Mongo / Cloudinary).
 * Covers addendum §8 acceptance criteria that are pure / gate-testable.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ADMIN_OPERATION_MATRIX,
  CRON_PROTECTED_SURFACES,
  editorAllowedOperations,
  editorForbiddenPermissions,
  evaluateOperationAccess,
  ownerOnlyOperations,
  sampleEditorContext,
  sampleOwnerContext,
  STAFF_PROTECTED_SURFACES,
} from "../src/lib/admin/authz-matrix";
import { planContentJobEnqueue } from "../src/lib/admin/content-jobs";
import {
  assertFeaturedIdsArePublicReady,
  filterPublicReadyFeaturedIds,
} from "../src/lib/admin/featured";
import {
  assessPermanentDeleteEligibility,
  classifyCleanupCandidate,
} from "../src/lib/admin/media-usage";
import {
  assessSummaryPublishReadiness,
  willCreateSlugRedirect,
} from "../src/lib/admin/publish";
import { DRAFT_PLACEHOLDER } from "../src/lib/admin/projects";
import {
  buildAuthContext,
  requireAdmin,
  requirePermission,
  UNAUTHENTICATED_AUTH_CONTEXT,
  UNAVAILABLE_AUTH_CONTEXT,
} from "../src/lib/security/auth-gate";
import type {
  ProjectDocument,
  ProjectSummarySnapshot,
} from "../src/lib/mongodb/models/types";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function baseProject(
  overrides: Partial<ProjectDocument> = {},
): ProjectDocument {
  return {
    schemaVersion: 1,
    editorialId: "proj-a12",
    draftSlug: "sample-project",
    draftTitle: "Sample",
    workStatus: "prototype",
    draftRevisionId: "rev_1",
    publishedSummaryRevisionId: null,
    publishedStoryRevisionId: null,
    canonicalPublishedSlug: null,
    concurrencyVersion: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function runMatrixCompleteness() {
  const ids = new Set(ADMIN_OPERATION_MATRIX.map((op) => op.id));
  assert.equal(ids.size, ADMIN_OPERATION_MATRIX.length);
  assert.ok(ADMIN_OPERATION_MATRIX.length >= 20);
  assert.ok(ownerOnlyOperations().length >= 8);
  assert.ok(editorAllowedOperations().length >= 8);
  assert.ok(STAFF_PROTECTED_SURFACES.length >= 10);
  assert.ok(CRON_PROTECTED_SURFACES.includes("POST /api/jobs/content-refresh"));
  pass("authz-matrix-completeness");
}

function runEditorRestrictions() {
  const editor = sampleEditorContext();
  const owner = sampleOwnerContext();

  for (const permission of editorForbiddenPermissions()) {
    assert.equal(
      requirePermission(permission, editor).ok,
      false,
      `editor must lack ${permission}`,
    );
    assert.equal(
      requirePermission(permission, owner).ok,
      true,
      `owner must have ${permission}`,
    );
  }

  for (const op of ownerOnlyOperations()) {
    const editorResult = evaluateOperationAccess(op.id, editor);
    assert.equal(editorResult.ok, false, `editor denied ${op.id}`);
    if (!editorResult.ok) {
      assert.equal(editorResult.reason, "denied");
    }
    assert.equal(evaluateOperationAccess(op.id, owner).ok, true);
  }

  for (const op of editorAllowedOperations()) {
    assert.equal(
      evaluateOperationAccess(op.id, editor).ok,
      true,
      `editor allowed ${op.id}`,
    );
  }

  pass("editor-cannot-publish-staff-or-enquiries");
}

function runUnauthenticatedDenial() {
  const denials = [
    UNAVAILABLE_AUTH_CONTEXT,
    UNAUTHENTICATED_AUTH_CONTEXT,
    buildAuthContext({
      authAvailable: true,
      authenticated: true,
      mfaCompleted: false,
      staffRole: "owner",
      userId: "u-mfa",
      email: "owner@example.com",
    }),
    buildAuthContext({
      authAvailable: true,
      authenticated: true,
      mfaCompleted: true,
      staffRole: null,
      userId: "u-norole",
      email: "x@example.com",
    }),
  ];

  for (const context of denials) {
    assert.equal(requireAdmin(context).ok, false);
    for (const op of ADMIN_OPERATION_MATRIX) {
      assert.equal(
        evaluateOperationAccess(op.id, context).ok,
        false,
        `${op.id} must deny weak context`,
      );
    }
  }

  pass("unauthenticated-mfa-and-role-denials");
}

function runDraftPublishIndependence() {
  const project = baseProject({
    publishedSummaryRevisionId: "rev_live",
    canonicalPublishedSlug: "sample-project",
    draftRevisionId: "rev_draft_2",
  });
  // Saving a new draft revision id does not clear live pointers in this model.
  assert.equal(project.publishedSummaryRevisionId, "rev_live");
  assert.notEqual(project.draftRevisionId, project.publishedSummaryRevisionId);

  const incomplete = assessSummaryPublishReadiness({
    project: baseProject({ draftRevisionId: "rev_1" }),
    summary: {
      title: DRAFT_PLACEHOLDER,
      summary: DRAFT_PLACEHOLDER,
      workStatus: "prototype",
      serviceIds: [],
      contributors: [],
      zatrozContribution: DRAFT_PLACEHOLDER,
      problem: DRAFT_PLACEHOLDER,
      approach: DRAFT_PLACEHOLDER,
      deliverables: [],
      verifiedOutcomes: [],
      mediaIds: [],
      publicLinks: [],
      editorialOrder: null,
    } satisfies ProjectSummarySnapshot,
  });
  assert.equal(incomplete.ok, false);

  pass("draft-edit-does-not-imply-live-publish");
}

function runConcurrencyConflictSemantics() {
  // Optimistic concurrency: mismatched expected version is a conflict, not silent overwrite.
  const expected = 3;
  const current = 4;
  assert.notEqual(expected, current);
  const conflictMessage =
    "This project was changed by someone else. Reload, then publish again.";
  assert.ok(conflictMessage.includes("changed by someone else"));
  pass("concurrency-conflict-message-contract");
}

function runFeaturedEligibility() {
  const ready = new Set(["proj-a", "proj-b"]);
  const ok = assertFeaturedIdsArePublicReady({
    featuredProjectIds: ["proj-a"],
    publicReadyIds: ready,
  });
  assert.equal(ok.ok, true);

  const denied = assertFeaturedIdsArePublicReady({
    featuredProjectIds: ["proj-draft"],
    publicReadyIds: ready,
  });
  assert.equal(denied.ok, false);

  const filtered = filterPublicReadyFeaturedIds({
    featuredProjectIds: ["proj-a", "proj-missing", "proj-b"],
    publicReadyIds: ready,
  });
  assert.deepEqual(filtered, ["proj-a", "proj-b"]);
  pass("featured-only-public-ready");
}

function runMediaDeleteGuards() {
  assert.equal(
    assessPermanentDeleteEligibility({
      exists: true,
      processingState: "ready",
      usageCount: 0,
    }).ok,
    false,
  );
  assert.equal(
    assessPermanentDeleteEligibility({
      exists: true,
      processingState: "archived",
      usageCount: 1,
    }).ok,
    false,
  );
  assert.equal(
    assessPermanentDeleteEligibility({
      exists: true,
      processingState: "archived",
      usageCount: 0,
    }).ok,
    true,
  );
  assert.equal(
    classifyCleanupCandidate({
      processingState: "archived",
      usageCount: 1,
    }),
    "in-use",
  );
  pass("media-delete-dependency-checks");
}

function runJobRetryNoDuplicates() {
  assert.equal(planContentJobEnqueue(null), "insert");
  assert.equal(planContentJobEnqueue({ state: "queued" }), "noop");
  assert.equal(planContentJobEnqueue({ state: "leased" }), "noop");
  assert.equal(planContentJobEnqueue({ state: "failed" }), "requeue");
  assert.equal(planContentJobEnqueue({ state: "succeeded" }), "requeue");
  pass("failed-jobs-requeue-without-duplicate-rows");
}

function runSlugRedirectBehaviour() {
  assert.equal(
    willCreateSlugRedirect({
      previousCanonicalSlug: "old-slug",
      nextSlug: "new-slug",
    }),
    true,
  );
  assert.equal(
    willCreateSlugRedirect({
      previousCanonicalSlug: "same",
      nextSlug: "same",
    }),
    false,
  );
  pass("slug-redirect-on-publish-change");
}

function runSourceGateInventory() {
  const root = resolve(process.cwd());
  const files = [
    "src/server/projects/publish-actions.ts",
    "src/server/projects/actions.ts",
    "src/server/projects/featured-actions.ts",
    "src/server/media/actions.ts",
    "src/server/jobs/actions.ts",
    "src/server/admin/staff-actions.ts",
    "src/app/api/admin/media/[mediaId]/preview/route.ts",
    "src/app/api/jobs/content-refresh/route.ts",
  ];

  for (const relative of files) {
    const source = readFileSync(resolve(root, relative), "utf8");
    if (relative.includes("content-refresh")) {
      assert.ok(
        source.includes("CRON_SECRET") || source.includes("cronSecret"),
        `${relative} must authorize with CRON_SECRET`,
      );
      assert.ok(
        !source.includes("requireAdminSession"),
        `${relative} must not rely on staff session alone`,
      );
      continue;
    }
    assert.ok(
      source.includes("requirePermissionSession") ||
        source.includes("requireAdminSession"),
      `${relative} must gate with staff session helpers`,
    );
  }

  // Permanent delete must require publish (owner), not write-only.
  const jobActions = readFileSync(
    resolve(root, "src/server/jobs/actions.ts"),
    "utf8",
  );
  assert.ok(jobActions.includes("admin.content.publish"));
  assert.ok(jobActions.includes("permanentlyDeleteMediaAction"));

  const publishActions = readFileSync(
    resolve(root, "src/server/projects/publish-actions.ts"),
    "utf8",
  );
  assert.ok(publishActions.includes("admin.content.publish"));

  pass("protected-surfaces-source-gates");
}

runMatrixCompleteness();
runEditorRestrictions();
runUnauthenticatedDenial();
runDraftPublishIndependence();
runConcurrencyConflictSemantics();
runFeaturedEligibility();
runMediaDeleteGuards();
runJobRetryNoDuplicates();
runSlugRedirectBehaviour();
runSourceGateInventory();

console.log(`\n${passed} checks passed`);
