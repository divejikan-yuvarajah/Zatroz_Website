/**
 * Pure rate-limit window / bucket key helpers (no DB, no secrets).
 */

import {
  RATE_LIMIT_POLICIES,
  RATE_LIMIT_POLICY_VERSION,
  type RateLimitPolicyId,
} from "@/lib/security/policy";

export function windowBounds(
  now: Date,
  windowMs: number,
): { windowStart: Date; windowEnd: Date; expiresAt: Date } {
  const startMs = Math.floor(now.getTime() / windowMs) * windowMs;
  const windowStart = new Date(startMs);
  const windowEnd = new Date(startMs + windowMs);
  const expiresAt = new Date(startMs + windowMs * 2);
  return { windowStart, windowEnd, expiresAt };
}

export function buildRateLimitBucketId(parts: {
  policyId: RateLimitPolicyId;
  identityHash: string;
  windowStart: Date;
}): string {
  return [
    `v${RATE_LIMIT_POLICY_VERSION}`,
    parts.policyId,
    parts.identityHash,
    String(parts.windowStart.getTime()),
  ].join(":");
}

export function getRateLimitPolicy(policyId: RateLimitPolicyId) {
  const found = Object.values(RATE_LIMIT_POLICIES).find(
    (p) => p.id === policyId,
  );
  if (!found) {
    throw new Error(`Unknown rate limit policy: ${policyId}`);
  }
  return found;
}
