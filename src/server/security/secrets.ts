/**
 * HMAC helpers for abuse identifiers and future enquiry fingerprints.
 * Server-only — requires secrets from env.
 */

import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export type AbuseHashSecretSet = Readonly<{
  /** Current signing key version (positive integer). */
  currentVersion: number;
  /** Map of version → secret material. */
  secretsByVersion: Readonly<Record<number, string>>;
}>;

function readSecret(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Resolve abuse HMAC secrets.
 * Supports ABUSE_HASH_SECRET (v1) and optional ABUSE_HASH_SECRET_V2 during rotation.
 */
export function resolveAbuseHashSecrets(
  env: NodeJS.ProcessEnv = process.env,
): AbuseHashSecretSet | null {
  const v1 = readSecret(env, "ABUSE_HASH_SECRET");
  if (!v1) return null;

  const secretsByVersion: Record<number, string> = { 1: v1 };
  const v2 = readSecret(env, "ABUSE_HASH_SECRET_V2");
  if (v2) {
    secretsByVersion[2] = v2;
  }

  const currentVersion = v2 ? 2 : 1;
  return { currentVersion, secretsByVersion };
}

export function hmacHex(
  secret: string,
  message: string,
  algorithm: string = "sha256",
): string {
  return createHmac(algorithm, secret).update(message, "utf8").digest("hex");
}

export function hmacEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Pseudonymize a trusted client identity for rate-limit buckets.
 * Hashing is not a claim of anonymity.
 */
export function hashTrustedIdentity(
  trustedIdentity: string,
  secrets: AbuseHashSecretSet,
): { keyVersion: number; identityHash: string } {
  const secret = secrets.secretsByVersion[secrets.currentVersion];
  if (!secret) {
    throw new Error("Abuse hash secret version missing.");
  }
  return {
    keyVersion: secrets.currentVersion,
    identityHash: hmacHex(secret, `identity:v1:${trustedIdentity}`),
  };
}

/**
 * Resolve enquiry idempotency fingerprint secrets (separate from abuse).
 */
export function resolveIdempotencySecrets(
  env: NodeJS.ProcessEnv = process.env,
): AbuseHashSecretSet | null {
  const v1 = readSecret(env, "ENQUIRY_IDEMPOTENCY_SECRET");
  if (!v1) return null;
  const secretsByVersion: Record<number, string> = { 1: v1 };
  const v2 = readSecret(env, "ENQUIRY_IDEMPOTENCY_SECRET_V2");
  if (v2) secretsByVersion[2] = v2;
  return { currentVersion: v2 ? 2 : 1, secretsByVersion };
}
