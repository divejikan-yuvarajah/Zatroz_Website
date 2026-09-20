/**
 * Resend documented test destinations (safe for non-production provider sends).
 * @see https://resend.com/docs/dashboard/emails/send-test-emails
 */

const RESEND_TEST_LOCAL_PARTS = new Set([
  "delivered",
  "bounced",
  "complained",
  "suppressed",
]);

/**
 * Accepts `delivered@resend.dev` and labelled forms like `delivered+label@resend.dev`.
 */
export function isResendTestDestination(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0) return false;
  const domain = normalized.slice(at + 1);
  if (domain !== "resend.dev") return false;
  const local = normalized.slice(0, at);
  const base = local.split("+")[0] ?? "";
  return RESEND_TEST_LOCAL_PARTS.has(base);
}

/**
 * Whether a recipient may receive a provider send.
 *
 * - Production: only the configured team allowlist.
 * - Non-production: Resend @resend.dev test addresses, or an explicitly
 *   authorized test inbox. Team Gmail is not automatically eligible.
 */
export function isRecipientAllowedForProvider(options: {
  recipient: string;
  appEnv: string;
  teamAllowlist: readonly string[];
  authorizedTestInbox: string | null;
}): boolean {
  const recipient = options.recipient.trim().toLowerCase();
  const allowlist = options.teamAllowlist.map((entry) => entry.toLowerCase());

  if (options.appEnv === "production") {
    return allowlist.includes(recipient);
  }

  if (isResendTestDestination(recipient)) return true;
  if (
    options.authorizedTestInbox &&
    recipient === options.authorizedTestInbox.toLowerCase()
  ) {
    return true;
  }
  return false;
}
