/**
 * Email address and header helpers — pure, no secrets.
 */

const SIMPLE_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/** Strip CR/LF and other control characters from header values. */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\0-\x1f\x7f]+/g, " ").trim();
}

/** Validate a single mailbox address (no display-name wrapping). */
export function isValidMailbox(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  if (trimmed.includes("\n") || trimmed.includes("\r")) return false;
  return SIMPLE_EMAIL.test(trimmed);
}

/** Parse "Name <email@domain>" or bare email into parts. */
export function parseSenderIdentity(value: string): {
  email: string;
  displayName: string | null;
} | null {
  const trimmed = sanitizeHeaderValue(value);
  if (!trimmed) return null;

  const angled = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
  if (angled) {
    const displayName = sanitizeHeaderValue(angled[1] ?? "").replace(
      /^"|"$/g,
      "",
    );
    const email = (angled[2] ?? "").trim().toLowerCase();
    if (!isValidMailbox(email)) return null;
    return { email, displayName: displayName || null };
  }

  if (!isValidMailbox(trimmed)) return null;
  return { email: trimmed.toLowerCase(), displayName: null };
}

/** Format a From/Reply-To header safely. */
export function formatMailboxHeader(
  email: string,
  displayName?: string | null,
): string {
  const safeEmail = email.trim().toLowerCase();
  if (!isValidMailbox(safeEmail)) {
    throw new Error("invalid-mailbox");
  }
  if (!displayName?.trim()) return safeEmail;
  const safeName = sanitizeHeaderValue(displayName).replace(/[<>"]/g, "");
  return `${safeName} <${safeEmail}>`;
}
