/**
 * Tunable starting thresholds. They are not calibrated alerts.
 * A missing email is not treated as a lost enquiry.
 */
export const OPERATIONAL_THRESHOLDS = {
  serverErrorRate: 0.05,
  minimumRequests: 20,
  windowMinutes: 15,
  dbTimeouts: 3,
  challengeFailures: 10,
  oldestPendingNotificationMs: 60 * 60 * 1000,
  leaseFailures: 3,
  exhaustedOrUncertain: 1,
} as const;

export type OperationalSample = Readonly<{
  requests: number;
  serverErrors: number;
  dbTimeouts: number;
  challengeFailures: number;
  oldestPendingNotificationAgeMs: number | null;
  leaseFailures: number;
  exhaustedDeliveries: number;
  uncertainDeliveries: number;
  acceptedEnquiries: number;
  deliveredNotifications: number;
}>;

export type OperationalSignal = Readonly<{
  code: string;
  severity: "page" | "ticket";
  summary: string;
}>;

export function evaluateOperationalSignals(
  sample: OperationalSample,
): OperationalSignal[] {
  const signals: OperationalSignal[] = [];
  const requests = Math.max(0, sample.requests);
  const errors = Math.max(0, sample.serverErrors);

  if (
    requests >= OPERATIONAL_THRESHOLDS.minimumRequests &&
    errors / requests >= OPERATIONAL_THRESHOLDS.serverErrorRate
  ) {
    signals.push({
      code: "server-error-rate",
      severity: "page",
      summary: "Server error rate is above the starting threshold.",
    });
  }

  if (sample.dbTimeouts >= OPERATIONAL_THRESHOLDS.dbTimeouts) {
    signals.push({
      code: "database-timeouts",
      severity: "page",
      summary: "Database timeouts crossed the starting threshold.",
    });
  }

  if (sample.challengeFailures >= OPERATIONAL_THRESHOLDS.challengeFailures) {
    signals.push({
      code: "challenge-failures",
      severity: "ticket",
      summary:
        "Challenge verification failures crossed the starting threshold.",
    });
  }

  if (
    sample.oldestPendingNotificationAgeMs != null &&
    sample.oldestPendingNotificationAgeMs >=
      OPERATIONAL_THRESHOLDS.oldestPendingNotificationMs
  ) {
    signals.push({
      code: "notification-age",
      severity: "ticket",
      summary: "A notification intent has been pending longer than the window.",
    });
  }

  if (sample.leaseFailures >= OPERATIONAL_THRESHOLDS.leaseFailures) {
    signals.push({
      code: "lease-failures",
      severity: "ticket",
      summary: "Notification lease failures crossed the starting threshold.",
    });
  }

  if (
    sample.exhaustedDeliveries + sample.uncertainDeliveries >=
    OPERATIONAL_THRESHOLDS.exhaustedOrUncertain
  ) {
    signals.push({
      code: "delivery-uncertain",
      severity: "ticket",
      summary:
        "Notification delivery is exhausted or uncertain. The enquiry can still be accepted.",
    });
  }

  return signals;
}

export function livenessPayload(): { ok: true } {
  return { ok: true };
}
