/**
 * Parse otpauth TOTP URIs for MFA enrollment UI (no secrets at rest).
 */

export function extractTotpSecretFromUri(uri: string): string | null {
  const trimmed = uri.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "otpauth:") return null;
    const secret = parsed.searchParams.get("secret")?.trim() ?? "";
    return secret.length > 0 ? secret : null;
  } catch {
    // Fallback for environments that reject otpauth: as a URL protocol.
    const match = /[?&]secret=([^&]+)/i.exec(trimmed);
    if (!match?.[1]) return null;
    try {
      return decodeURIComponent(match[1]).trim() || null;
    } catch {
      return match[1].trim() || null;
    }
  }
}
