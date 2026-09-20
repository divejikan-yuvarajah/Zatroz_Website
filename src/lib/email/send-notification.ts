/**
 * Transactional notification sender — pure adapter (injectable Resend client).
 * Safe for unit tests; app code should prefer the server-only re-export.
 */

import { isValidMailbox } from "@/lib/email/addresses";
import type { CaptureSink } from "@/lib/email/capture-sink";
import { resolveEmailConfig, type EmailConfig } from "@/lib/email/config";
import { isRecipientAllowedForProvider } from "@/lib/email/resend-destinations";
import type {
  NotificationSendRequest,
  NotificationSendResult,
} from "@/lib/email/types";

export type ResendEmailsClient = {
  emails: {
    send: (
      payload: Record<string, unknown>,
      options?: { idempotencyKey?: string },
    ) => Promise<{ data: { id?: string } | null; error: unknown }>;
  };
};

export type SendNotificationOptions = Readonly<{
  env?: NodeJS.ProcessEnv;
  /** Required when transport is capture. */
  captureSink?: CaptureSink;
  nowIso?: () => string;
  createCaptureId?: () => string;
  /** Injected Resend-compatible client (tests / server wrapper). */
  resendClient?: ResendEmailsClient;
  /** Factory used when transport is provider and no client is injected. */
  createResendClient?: (apiKey: string) => ResendEmailsClient;
}>;

function extractMailbox(fromHeader: string): string {
  const angled = fromHeader.match(/<([^>]+)>/);
  return (angled?.[1] ?? fromHeader).trim();
}

function mapProviderError(error: unknown): NotificationSendResult {
  const transport = "provider" as const;
  if (!error || typeof error !== "object") {
    return {
      status: "transient-failure",
      reason: "provider-unavailable",
      transport,
    };
  }

  const record = error as {
    name?: string;
    message?: string;
    statusCode?: number;
  };
  const statusCode =
    typeof record.statusCode === "number" ? record.statusCode : undefined;
  const message = (record.message ?? "").toLowerCase();
  const name = (record.name ?? "").toLowerCase();

  if (statusCode === 429 || message.includes("rate") || name.includes("rate")) {
    return {
      status: "transient-failure",
      reason: "rate-limited",
      transport,
      providerCode: statusCode ? String(statusCode) : undefined,
    };
  }

  if (
    statusCode === 408 ||
    statusCode === 504 ||
    message.includes("timeout") ||
    name.includes("timeout")
  ) {
    return {
      status: "transient-failure",
      reason: "timeout",
      transport,
      providerCode: statusCode ? String(statusCode) : undefined,
    };
  }

  if (statusCode !== undefined && statusCode >= 500) {
    return {
      status: "transient-failure",
      reason: "provider-unavailable",
      transport,
      providerCode: String(statusCode),
    };
  }

  if (statusCode !== undefined && statusCode >= 400 && statusCode < 500) {
    return {
      status: "rejected",
      reason: "provider-rejected",
      transport,
      providerCode: String(statusCode),
    };
  }

  return {
    status: "transient-failure",
    reason: "provider-unavailable",
    transport,
  };
}

function validateRequest(
  request: NotificationSendRequest,
  transport: EmailConfig["transport"],
): NotificationSendResult | null {
  if (!isValidMailbox(extractMailbox(request.from))) {
    return { status: "rejected", reason: "invalid-sender", transport };
  }

  if (request.to.length === 0) {
    return { status: "rejected", reason: "invalid-recipient", transport };
  }

  for (const recipient of request.to) {
    if (!isValidMailbox(recipient)) {
      return { status: "rejected", reason: "invalid-recipient", transport };
    }
  }

  if (!request.subject.trim() || !request.html.trim() || !request.text.trim()) {
    return { status: "rejected", reason: "invalid-payload", transport };
  }

  if (request.subject.includes("\n") || request.subject.includes("\r")) {
    return { status: "rejected", reason: "invalid-payload", transport };
  }

  return null;
}

function assertRecipientsAllowed(
  config: EmailConfig,
  recipients: readonly string[],
): NotificationSendResult | null {
  if (config.transport === "capture") {
    return null;
  }

  for (const recipient of recipients) {
    if (
      !isRecipientAllowedForProvider({
        recipient,
        appEnv: config.appEnv,
        teamAllowlist: config.notificationRecipients,
        authorizedTestInbox: config.authorizedTestInbox,
      })
    ) {
      return {
        status: "rejected",
        reason: "recipient-not-allowed",
        transport: "provider",
      };
    }
  }
  return null;
}

/**
 * Send one internal notification through capture or Resend.
 * Callers must supply a fully rendered, allowlisted request.
 */
export async function sendNotification(
  request: NotificationSendRequest,
  options: SendNotificationOptions = {},
): Promise<NotificationSendResult> {
  const env = options.env ?? process.env;
  const config = resolveEmailConfig(env);

  if (!config) {
    return {
      status: "rejected",
      reason: "missing-config",
      transport: "capture",
    };
  }

  if (!config.notificationsEnabled) {
    return {
      status: "rejected",
      reason: "notifications-disabled",
      transport: config.transport,
    };
  }

  const invalid = validateRequest(request, config.transport);
  if (invalid) {
    return invalid;
  }

  const recipientGate = assertRecipientsAllowed(config, request.to);
  if (recipientGate) {
    return recipientGate;
  }

  if (config.transport === "capture") {
    if (!options.captureSink) {
      return {
        status: "rejected",
        reason: "missing-config",
        transport: "capture",
      };
    }
    const id =
      options.createCaptureId?.() ??
      `capture_${Math.random().toString(36).slice(2, 12)}`;
    const capturedAt = options.nowIso?.() ?? new Date().toISOString();
    options.captureSink.record(request, id, capturedAt);
    return { status: "accepted", messageId: id, transport: "capture" };
  }

  if (!config.apiKey) {
    return {
      status: "rejected",
      reason: "missing-config",
      transport: "provider",
    };
  }

  const client =
    options.resendClient ?? options.createResendClient?.(config.apiKey);

  if (!client) {
    return {
      status: "rejected",
      reason: "missing-config",
      transport: "provider",
    };
  }

  const payload: Record<string, unknown> = {
    from: request.from,
    to: [...request.to],
    subject: request.subject,
    html: request.html,
    text: request.text,
  };
  if (request.replyTo) {
    payload.replyTo = request.replyTo;
  }

  const sendOptions = request.providerIdempotencyKey
    ? { idempotencyKey: request.providerIdempotencyKey }
    : undefined;

  let response: { data: { id?: string } | null; error: unknown };
  try {
    response = await client.emails.send(payload, sendOptions);
  } catch {
    return {
      status: "uncertain",
      reason: "network-loss",
      transport: "provider",
    };
  }

  if (response.error) {
    return mapProviderError(response.error);
  }

  const messageId = response.data?.id;
  if (!messageId || typeof messageId !== "string") {
    return {
      status: "uncertain",
      reason: "ambiguous-response",
      transport: "provider",
    };
  }

  return {
    status: "accepted",
    messageId,
    transport: "provider",
  };
}

/**
 * Assemble a team notification request from resolved config + rendered template.
 * Keeps template rendering separate from provider dispatch.
 */
export function buildTeamNotificationRequest(options: {
  config: EmailConfig;
  subject: string;
  html: string;
  text: string;
  templateVersion: string;
  replyTo?: string;
  providerIdempotencyKey?: string;
  to?: readonly string[];
}): NotificationSendRequest {
  return {
    from: options.config.fromHeader,
    to: options.to ?? options.config.notificationRecipients,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
    providerIdempotencyKey: options.providerIdempotencyKey,
    templateVersion: options.templateVersion,
  };
}
