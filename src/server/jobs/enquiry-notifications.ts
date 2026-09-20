/**
 * Protected enquiry-notification dispatcher (Step 51).
 * Claims leased intents, freezes provider identity, then calls the Step 50 adapter.
 * Never changes enquiry acceptance status.
 */

import "server-only";

import { randomBytes } from "node:crypto";
import type { Db } from "mongodb";
import { resolveEmailConfig } from "@/lib/email/config";
import {
  buildTeamNotificationRequest,
  sendNotification,
  type SendNotificationOptions,
} from "@/lib/email/send-notification";
import { renderEnquiryInternalNotification } from "@/lib/email/templates/enquiry-internal";
import type { EnquiryNormalizedInput } from "@/lib/enquiries/input";
import {
  buildNotificationFreeze,
  ENQUIRY_NOTIFICATION_DISPATCH_BATCH_MAX,
  ENQUIRY_NOTIFICATION_LEASE_MS,
  ENQUIRY_NOTIFICATION_PROVIDER_BUDGET_MS,
  decideNotificationRetry,
  formatReceivedAtDisplay,
  mapSendResultToIntentOutcome,
} from "@/lib/enquiries/notification-intent";
import {
  claimNextNotificationIntent,
  finalizeNotificationIntentClaim,
  type ClaimedNotificationWork,
} from "@/server/repositories/enquiries";

export type NotificationDispatchCounts = Readonly<{
  claimed: number;
  providerAccepted: number;
  rejected: number;
  uncertain: number;
  retryScheduled: number;
  needsReview: number;
  permanentlyFailed: number;
  paused: number;
  leaseLost: number;
  skipped: number;
}>;

export type DispatchNotificationBatchOptions = Readonly<{
  db: Db;
  env?: NodeJS.ProcessEnv;
  limit?: number;
  leaseOwner?: string;
  now?: Date;
  sendOptions?: SendNotificationOptions;
}>;

function toEnquiryInput(work: ClaimedNotificationWork): EnquiryNormalizedInput {
  return {
    name: work.name,
    email: work.email,
    company: work.company,
    service: work.service as EnquiryNormalizedInput["service"],
    message: work.message,
    timeline: work.timeline as EnquiryNormalizedInput["timeline"],
    requestType: work.requestType as EnquiryNormalizedInput["requestType"],
    preferredContact:
      work.preferredContact as EnquiryNormalizedInput["preferredContact"],
    phone: work.phone,
  };
}

function emptyCounts(): NotificationDispatchCounts {
  return {
    claimed: 0,
    providerAccepted: 0,
    rejected: 0,
    uncertain: 0,
    retryScheduled: 0,
    needsReview: 0,
    permanentlyFailed: 0,
    paused: 0,
    leaseLost: 0,
    skipped: 0,
  };
}

async function dispatchOne(
  work: ClaimedNotificationWork,
  options: DispatchNotificationBatchOptions,
  counts: { value: NotificationDispatchCounts },
): Promise<void> {
  const env = options.env ?? process.env;
  const now = options.now ?? new Date();
  const config = resolveEmailConfig(env);

  if (!config) {
    const decision = decideNotificationRetry({
      intentId: work.notificationIntent.intentId,
      attempts: work.notificationIntent.attempts,
      createdAt: work.notificationIntent.createdAt,
      firstProviderAttemptAt: work.notificationIntent.firstProviderAttemptAt,
      now,
      errorCategory: "missing-config",
      kind: "retryable",
    });
    const finalized = await finalizeNotificationIntentClaim(options.db, {
      publicReference: work.publicReference,
      leaseOwner: work.leaseOwner,
      leaseToken: work.leaseToken,
      state: decision.state,
      lastErrorCategory: decision.errorCategory,
      nextAttemptAt: decision.nextAttemptAt ?? undefined,
      now,
    });
    if (!finalized.ok || !finalized.matched) {
      counts.value = {
        ...counts.value,
        leaseLost: counts.value.leaseLost + 1,
      };
      return;
    }
    if (decision.state === "retry-scheduled") {
      counts.value = {
        ...counts.value,
        retryScheduled: counts.value.retryScheduled + 1,
        uncertain: counts.value.uncertain + 1,
      };
    } else if (decision.state === "needs-review") {
      counts.value = {
        ...counts.value,
        needsReview: counts.value.needsReview + 1,
        uncertain: counts.value.uncertain + 1,
      };
    } else {
      counts.value = {
        ...counts.value,
        uncertain: counts.value.uncertain + 1,
      };
    }
    return;
  }

  if (!config.notificationsEnabled) {
    const finalized = await finalizeNotificationIntentClaim(options.db, {
      publicReference: work.publicReference,
      leaseOwner: work.leaseOwner,
      leaseToken: work.leaseToken,
      state: "paused",
      lastErrorCategory: "notifications-disabled",
      now,
    });
    if (!finalized.ok || !finalized.matched) {
      counts.value = {
        ...counts.value,
        leaseLost: counts.value.leaseLost + 1,
      };
      return;
    }
    counts.value = { ...counts.value, paused: counts.value.paused + 1 };
    return;
  }

  const enquiry = toEnquiryInput(work);
  const intent = work.notificationIntent;
  const freeze =
    intent.freeze ??
    buildNotificationFreeze({
      config,
      enquiry,
      publicReference: work.publicReference,
      payloadFingerprint: work.payloadFingerprint,
      receivedAtDisplay: formatReceivedAtDisplay(work.createdAt),
      templateVersion: intent.templateVersion,
    });

  const rendered = renderEnquiryInternalNotification({
    reference: work.publicReference,
    receivedAtDisplay: freeze.receivedAtDisplay,
    enquiry,
  });

  const request = buildTeamNotificationRequest({
    config,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    templateVersion: freeze.templateVersion,
    replyTo: freeze.replyTo,
    providerIdempotencyKey: intent.providerIdempotencyKey,
    to: freeze.to,
  });

  const sendResult = await sendNotification(request, {
    ...options.sendOptions,
    env,
  });

  const outcome = mapSendResultToIntentOutcome(
    sendResult.status,
    "reason" in sendResult ? sendResult.reason : undefined,
  );

  let finalState:
    | "provider-accepted"
    | "rejected"
    | "uncertain"
    | "paused"
    | "retry-scheduled"
    | "permanently-failed"
    | "needs-review" =
    outcome.state === "rejected" ? "permanently-failed" : outcome.state;
  let nextAttemptAt: Date | undefined;
  let errorCategory = outcome.errorCategory;

  if (outcome.state === "uncertain") {
    const decision = decideNotificationRetry({
      intentId: intent.intentId,
      attempts: intent.attempts,
      createdAt: intent.createdAt,
      firstProviderAttemptAt: intent.firstProviderAttemptAt,
      now,
      errorCategory: outcome.errorCategory,
      kind: "retryable",
    });
    finalState = decision.state;
    nextAttemptAt = decision.nextAttemptAt ?? undefined;
    errorCategory = decision.errorCategory;
  } else if (
    outcome.state === "permanently-failed" ||
    outcome.state === "rejected"
  ) {
    finalState = "permanently-failed";
  }

  const finalized = await finalizeNotificationIntentClaim(options.db, {
    publicReference: work.publicReference,
    leaseOwner: work.leaseOwner,
    leaseToken: work.leaseToken,
    state: finalState as
      | "provider-accepted"
      | "rejected"
      | "uncertain"
      | "paused"
      | "retry-scheduled"
      | "permanently-failed"
      | "needs-review",
    providerMessageId:
      sendResult.status === "accepted" ? sendResult.messageId : null,
    lastErrorCategory: errorCategory,
    nextAttemptAt,
    freeze,
    now,
  });

  if (!finalized.ok || !finalized.matched) {
    counts.value = { ...counts.value, leaseLost: counts.value.leaseLost + 1 };
    return;
  }

  if (finalState === "provider-accepted") {
    counts.value = {
      ...counts.value,
      providerAccepted: counts.value.providerAccepted + 1,
    };
  } else if (finalState === "permanently-failed") {
    counts.value = {
      ...counts.value,
      permanentlyFailed: counts.value.permanentlyFailed + 1,
      rejected: counts.value.rejected + 1,
    };
  } else if (finalState === "retry-scheduled") {
    counts.value = {
      ...counts.value,
      retryScheduled: counts.value.retryScheduled + 1,
      uncertain: counts.value.uncertain + 1,
    };
  } else if (finalState === "needs-review") {
    counts.value = {
      ...counts.value,
      needsReview: counts.value.needsReview + 1,
      uncertain: counts.value.uncertain + 1,
    };
  } else if (finalState === "paused") {
    counts.value = { ...counts.value, paused: counts.value.paused + 1 };
  } else {
    counts.value = { ...counts.value, uncertain: counts.value.uncertain + 1 };
  }
}

/**
 * Claim and dispatch up to `limit` eligible notification intents.
 * Returns aggregate counts only — never enquiry bodies or addresses.
 */
export async function dispatchEnquiryNotificationBatch(
  options: DispatchNotificationBatchOptions,
): Promise<NotificationDispatchCounts> {
  const limit = Math.min(
    Math.max(1, options.limit ?? ENQUIRY_NOTIFICATION_DISPATCH_BATCH_MAX),
    ENQUIRY_NOTIFICATION_DISPATCH_BATCH_MAX,
  );
  const leaseOwner =
    options.leaseOwner?.trim() || `notify_${randomBytes(4).toString("hex")}`;
  const counts = { value: emptyCounts() };

  for (let i = 0; i < limit; i += 1) {
    const work = await claimNextNotificationIntent(options.db, {
      leaseOwner,
      now: options.now,
      leaseMs: ENQUIRY_NOTIFICATION_LEASE_MS,
    });
    if (!work) {
      counts.value = { ...counts.value, skipped: counts.value.skipped + 1 };
      break;
    }
    counts.value = { ...counts.value, claimed: counts.value.claimed + 1 };

    const started = Date.now();
    await dispatchOne(work, options, counts);
    if (Date.now() - started > ENQUIRY_NOTIFICATION_PROVIDER_BUDGET_MS) {
      // Soft budget exceeded — lease fencing still protects concurrent workers.
    }
  }

  return counts.value;
}
