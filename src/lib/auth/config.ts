/**
 * Better Auth environment resolution (pure — no server-only).
 * Importing this module does not require secrets or MongoDB.
 */

import { resolveSiteUrl } from "@/server/resolve-site-url";

export const BETTER_AUTH_SECRET_MIN_LENGTH = 32;

export type AuthRuntimeConfig = Readonly<{
  secret: string;
  baseURL: string;
  appName: string;
}>;

export type AuthConfigIssue = Readonly<{
  code: string;
  message: string;
}>;

export type AuthConfigResult =
  | { ok: true; config: AuthRuntimeConfig }
  | { ok: false; issues: readonly AuthConfigIssue[] };

function readTrimmed(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Validate Better Auth runtime settings.
 * Missing secret is expected for marketing-only builds — call only when auth is needed.
 */
export function resolveAuthRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
): AuthConfigResult {
  const issues: AuthConfigIssue[] = [];

  const secret =
    readTrimmed(env, "BETTER_AUTH_SECRET") ?? readTrimmed(env, "AUTH_SECRET");
  const explicitBase = readTrimmed(env, "BETTER_AUTH_URL");
  const appName = readTrimmed(env, "BETTER_AUTH_APP_NAME") ?? "Zatroz Admin";

  if (!secret) {
    issues.push({
      code: "missing-better-auth-secret",
      message:
        "BETTER_AUTH_SECRET is not set (generate with openssl rand -base64 32).",
    });
  } else if (secret.length < BETTER_AUTH_SECRET_MIN_LENGTH) {
    issues.push({
      code: "short-better-auth-secret",
      message: `BETTER_AUTH_SECRET must be at least ${BETTER_AUTH_SECRET_MIN_LENGTH} characters.`,
    });
  }

  let baseURL: string | undefined;
  try {
    baseURL = explicitBase ?? resolveSiteUrl(env.SITE_URL);
  } catch {
    issues.push({
      code: "invalid-better-auth-url",
      message:
        "BETTER_AUTH_URL / SITE_URL must be an absolute http(s) origin for Better Auth.",
    });
  }

  if (issues.length > 0 || !secret || !baseURL) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    config: {
      secret,
      baseURL,
      appName,
    },
  };
}

export function isAuthRuntimeConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return resolveAuthRuntimeConfig(env).ok;
}

/** Non-secret label for diagnostics. */
export function authConfigLabel(config: AuthRuntimeConfig): string {
  return `app=${config.appName}; baseURL=${config.baseURL}`;
}
