import "server-only";

import { resolveSiteUrl } from "@/server/resolve-site-url";

/**
 * Returns the normalised public site origin from SITE_URL.
 * Falls back to http://localhost:3000 when unset (local setup / blank builds).
 * Production domain must be set and verified before public release (planned Step 67).
 *
 * Does not load or require Supabase, Resend, Turnstile, or cron credentials.
 */
export function getSiteUrl(): string {
  return resolveSiteUrl(process.env.SITE_URL);
}
