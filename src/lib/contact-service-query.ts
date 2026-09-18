/**
 * Pure contact `?service=` parser — safe for scripts and server routes.
 * Never echoes arbitrary query text; only exact allowlisted slugs.
 */
import { SERVICE_SLUGS, type ServiceSlug } from "@/types/content";

/** Reject oversized values before allowlist checks (DoS / injection hygiene). */
export const CONTACT_SERVICE_QUERY_MAX_LENGTH = 64;

export type ContactServiceQueryResult = Readonly<{
  service: ServiceSlug | null;
}>;

function getAll(
  raw: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
): string[] {
  if (raw instanceof URLSearchParams) {
    return raw.getAll(key);
  }
  const value = raw[key];
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

/**
 * Accept exactly one allowlisted service slug.
 * Missing, repeated, unknown, or oversized values → no preselection.
 */
export function parseContactServiceParam(
  raw: URLSearchParams | Record<string, string | string[] | undefined>,
): ContactServiceQueryResult {
  const values = getAll(raw, "service").map((value) => value.trim());

  if (values.length !== 1) {
    return { service: null };
  }

  const candidate = values[0];
  if (
    !candidate ||
    candidate.length > CONTACT_SERVICE_QUERY_MAX_LENGTH ||
    !(SERVICE_SLUGS as readonly string[]).includes(candidate)
  ) {
    return { service: null };
  }

  return { service: candidate as ServiceSlug };
}
