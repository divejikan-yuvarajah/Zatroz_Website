/**
 * Public indexing eligibility — production APP_ENV only.
 * Preview / staging production builds stay non-indexable.
 * Never treat NODE_ENV=production alone as proof of the live site.
 */

import { APP_ENV_VALUES, type AppEnv } from "@/lib/mongodb/config";

function resolveAppEnv(raw: string | undefined): AppEnv {
  if (raw && (APP_ENV_VALUES as readonly string[]).includes(raw)) {
    return raw as AppEnv;
  }
  return "development";
}

export type IndexingPolicyEnv = Readonly<{
  APP_ENV?: string;
  VERCEL_ENV?: string;
  NODE_ENV?: string;
}>;

/**
 * True only when this deployment may be indexed.
 * Requires APP_ENV=production and, when Vercel sets VERCEL_ENV, that value
 * must also be "production".
 */
export function isPublicIndexingEnabled(
  env: IndexingPolicyEnv = process.env,
): boolean {
  const appEnv = resolveAppEnv(env.APP_ENV);
  if (appEnv !== "production") {
    return false;
  }

  const vercelEnv = env.VERCEL_ENV?.trim();
  if (vercelEnv && vercelEnv !== "production") {
    return false;
  }

  return true;
}

/** Robots metadata for HTML when the environment must not be indexed. */
export function environmentRobotsDirective(
  env: IndexingPolicyEnv = process.env,
): { index: boolean; follow: boolean } {
  if (isPublicIndexingEnabled(env)) {
    return { index: true, follow: true };
  }
  return { index: false, follow: false };
}
