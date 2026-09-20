/**
 * Email configuration resolution — pure env parsing, no I/O.
 */

import {
  formatMailboxHeader,
  isValidMailbox,
  parseSenderIdentity,
} from "@/lib/email/addresses";
import {
  EMAIL_TRANSPORT_VALUES,
  type EmailTransportMode,
} from "@/lib/email/types";

export type EmailConfig = Readonly<{
  transport: EmailTransportMode;
  notificationsEnabled: boolean;
  apiKey: string | null;
  fromHeader: string;
  fromEmail: string;
  notificationRecipients: readonly string[];
  authorizedTestInbox: string | null;
  appEnv: string;
}>;

function parseBooleanFlag(raw: string | undefined): boolean {
  return (raw ?? "").trim().toLowerCase() === "true";
}

function parseTransport(raw: string | undefined): EmailTransportMode {
  const value = (raw ?? "capture").trim().toLowerCase();
  if ((EMAIL_TRANSPORT_VALUES as readonly string[]).includes(value)) {
    return value as EmailTransportMode;
  }
  return "capture";
}

function parseRecipientList(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter((part) => part.length > 0 && isValidMailbox(part));
}

/**
 * Resolve transactional email configuration from environment.
 * Incomplete provider config is allowed when transport is `capture`
 * as long as From + recipients parse.
 */
export function resolveEmailConfig(
  env: NodeJS.ProcessEnv = process.env,
): EmailConfig | null {
  const transport = parseTransport(env.EMAIL_TRANSPORT);
  const notificationsEnabled = parseBooleanFlag(
    env.EMAIL_NOTIFICATIONS_ENABLED,
  );
  const appEnv =
    (env.APP_ENV ?? "development").trim().toLowerCase() || "development";

  const fromRaw = (env.ENQUIRY_FROM_EMAIL ?? "").trim();
  const parsedFrom = fromRaw ? parseSenderIdentity(fromRaw) : null;
  if (!parsedFrom) {
    return null;
  }

  let fromHeader: string;
  try {
    fromHeader = formatMailboxHeader(
      parsedFrom.email,
      parsedFrom.displayName ?? "Zatroz",
    );
  } catch {
    return null;
  }

  const notificationRecipients = parseRecipientList(
    env.ENQUIRY_NOTIFICATION_EMAIL,
  );
  if (notificationRecipients.length === 0) {
    return null;
  }

  const apiKey = (env.RESEND_API_KEY ?? "").trim() || null;
  const authorizedTestInboxRaw = (env.EMAIL_AUTHORIZED_TEST_INBOX ?? "").trim();
  const authorizedTestInbox =
    authorizedTestInboxRaw && isValidMailbox(authorizedTestInboxRaw)
      ? authorizedTestInboxRaw.toLowerCase()
      : null;

  if (transport === "provider" && !apiKey) {
    return null;
  }

  return {
    transport,
    notificationsEnabled,
    apiKey,
    fromHeader,
    fromEmail: parsedFrom.email,
    notificationRecipients,
    authorizedTestInbox,
    appEnv,
  };
}
