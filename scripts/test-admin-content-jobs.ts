/**
 * Unit tests for A11 content-job scheduling and media usage helpers.
 */

import assert from "node:assert/strict";
import {
  buildPublishRefreshDedupeKey,
  CONTENT_JOB_MAX_ATTEMPTS,
  formatRefreshPendingLabel,
  isRefreshPendingJobState,
  nextRetryDelayMs,
  parsePublishRefreshDedupeKey,
  planContentJobEnqueue,
  shouldRetryAfterFailure,
} from "../src/lib/admin/content-jobs";
import {
  assessPermanentDeleteEligibility,
  classifyCleanupCandidate,
  collectMediaIdsFromRevisionPayload,
  isDurablePublicDeliveryPath,
  publicDeliveryPublicId,
} from "../src/lib/admin/media-usage";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function testDedupeAndPlan() {
  const key = buildPublishRefreshDedupeKey({
    editorialId: "proj-1",
    action: "summary-publish",
  });
  assert.equal(key, "publish-refresh:proj-1:summary-publish");
  const parsed = parsePublishRefreshDedupeKey(key);
  assert.equal(parsed.kind, "publish-refresh");
  assert.equal(parsed.editorialId, "proj-1");
  assert.equal(parsed.action, "summary-publish");

  assert.equal(planContentJobEnqueue(null), "insert");
  assert.equal(planContentJobEnqueue({ state: "queued" }), "noop");
  assert.equal(planContentJobEnqueue({ state: "leased" }), "noop");
  assert.equal(planContentJobEnqueue({ state: "succeeded" }), "requeue");
  assert.equal(planContentJobEnqueue({ state: "failed" }), "requeue");
  assert.equal(planContentJobEnqueue({ state: "cancelled" }), "requeue");
  pass("dedupe parse + enqueue plan (no duplicate rows)");
}

function testRetryBackoff() {
  assert.equal(shouldRetryAfterFailure(1), true);
  assert.equal(shouldRetryAfterFailure(CONTENT_JOB_MAX_ATTEMPTS), false);
  assert.equal(nextRetryDelayMs(1), 30_000);
  assert.equal(nextRetryDelayMs(2), 60_000);
  assert.equal(nextRetryDelayMs(3), 120_000);
  pass("retry backoff and max attempts");
}

function testRefreshPendingLabel() {
  assert.equal(isRefreshPendingJobState("queued"), true);
  assert.equal(isRefreshPendingJobState("succeeded"), false);
  assert.equal(
    formatRefreshPendingLabel({
      summaryPublished: true,
      hasOpenRefreshJob: true,
    }),
    "Published, refresh pending",
  );
  assert.equal(
    formatRefreshPendingLabel({
      summaryPublished: true,
      hasOpenRefreshJob: false,
    }),
    null,
  );
  assert.equal(
    formatRefreshPendingLabel({
      summaryPublished: false,
      hasOpenRefreshJob: true,
    }),
    null,
  );
  pass("published, refresh pending label");
}

function testMediaUsageHelpers() {
  assert.equal(isDurablePublicDeliveryPath("/images/a.jpg"), true);
  assert.equal(
    isDurablePublicDeliveryPath("https://res.cloudinary.com/x/image/upload/a"),
    true,
  );
  assert.equal(isDurablePublicDeliveryPath("http://insecure.example/a"), false);
  assert.equal(isDurablePublicDeliveryPath(""), false);

  assert.equal(
    publicDeliveryPublicId("folder/media/m1/v1"),
    "folder/media/m1/v1__pub",
  );

  const ids = collectMediaIdsFromRevisionPayload({
    mediaRefs: ["a", "b"],
    summaryMediaIds: ["a", "c"],
    galleryMediaIds: ["d", ""],
  });
  assert.deepEqual(ids.sort(), ["a", "b", "c", "d"]);

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
      usageCount: 2,
    }).ok,
    false,
  );
  assert.equal(
    assessPermanentDeleteEligibility({
      exists: true,
      processingState: "failed",
      usageCount: 0,
    }).ok,
    true,
  );

  assert.equal(
    classifyCleanupCandidate({
      processingState: "failed",
      usageCount: 0,
    }),
    "failed-orphan",
  );
  assert.equal(
    classifyCleanupCandidate({
      processingState: "archived",
      usageCount: 0,
    }),
    "archived-unused",
  );
  assert.equal(
    classifyCleanupCandidate({
      processingState: "archived",
      usageCount: 1,
    }),
    "in-use",
  );
  pass("media usage + permanent delete eligibility");
}

testDedupeAndPlan();
testRetryBackoff();
testRefreshPendingLabel();
testMediaUsageHelpers();

console.log(`\n${passed} passed`);
