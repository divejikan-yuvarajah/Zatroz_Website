/**
 * Capture-mode sink for deterministic local tests.
 * Records synthetic messages only — never application logs with real PII.
 */

import type {
  CapturedNotification,
  NotificationSendRequest,
} from "@/lib/email/types";

export type CaptureSink = {
  readonly records: CapturedNotification[];
  clear(): void;
  record(
    request: NotificationSendRequest,
    id: string,
    capturedAt: string,
  ): void;
};

export function createCaptureSink(): CaptureSink {
  const records: CapturedNotification[] = [];
  return {
    get records() {
      return records;
    },
    clear() {
      records.length = 0;
    },
    record(request, id, capturedAt) {
      records.push({
        id,
        capturedAt,
        transport: "capture",
        from: request.from,
        to: [...request.to],
        subject: request.subject,
        html: request.html,
        text: request.text,
        replyTo: request.replyTo,
        providerIdempotencyKey: request.providerIdempotencyKey,
        templateVersion: request.templateVersion,
      });
    },
  };
}
