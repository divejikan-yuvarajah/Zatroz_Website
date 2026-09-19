/**
 * Better Auth factory — Node-compatible (no server-only marker).
 * Next.js app code should import via `@/server/auth` instead.
 * Scripts may import this module directly.
 */

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import {
  isAuthRuntimeConfigured,
  resolveAuthRuntimeConfig,
} from "@/lib/auth/config";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import { getDb, getMongoClient } from "@/lib/mongodb/connection";

export type StaffAuth = Awaited<ReturnType<typeof createStaffAuth>>;

type AuthSingleton = {
  promise?: Promise<StaffAuth>;
  key?: string;
};

const globalForAuth = globalThis as typeof globalThis & {
  __zatrozStaffAuth?: AuthSingleton;
};

function getAuthState(): AuthSingleton {
  if (!globalForAuth.__zatrozStaffAuth) {
    globalForAuth.__zatrozStaffAuth = {};
  }
  return globalForAuth.__zatrozStaffAuth;
}

function authCacheKey(secret: string, baseURL: string, dbName: string): string {
  return `${baseURL}|${dbName}|${secret.length}`;
}

export type CreateStaffAuthOptions = Readonly<{
  /** Bootstrap script only — never enable for the public API route. */
  allowSignUp?: boolean;
  /** Include nextCookies plugin (Next.js runtime). Scripts can omit. */
  withNextCookies?: boolean;
}>;

export async function createStaffAuth(options: CreateStaffAuthOptions = {}) {
  const authResolved = resolveAuthRuntimeConfig();
  if (!authResolved.ok) {
    const detail = authResolved.issues.map((issue) => issue.message).join(" ");
    throw new Error(`Better Auth is not configured. ${detail}`);
  }

  if (!isMongoRuntimeConfigured()) {
    throw new Error(
      "Better Auth requires MongoDB. Set MONGODB_URI and MONGODB_DB_NAME.",
    );
  }

  const client = await getMongoClient();
  const db = await getDb();
  const { secret, baseURL, appName } = authResolved.config;
  const allowSignUp = options.allowSignUp === true;
  const withNextCookies = options.withNextCookies !== false;

  const plugins = [
    twoFactor({
      issuer: appName,
    }),
    ...(withNextCookies ? [nextCookies()] : []),
  ];

  return betterAuth({
    appName,
    secret,
    baseURL,
    database: mongodbAdapter(db, {
      client,
      transaction: true,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !allowSignUp,
      minPasswordLength: 12,
      revokeSessionsOnPasswordReset: true,
    },
    user: {
      additionalFields: {
        staffRole: {
          type: "string",
          required: false,
          defaultValue: "editor",
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 30,
    },
    trustedOrigins: [baseURL],
    plugins,
  });
}

/**
 * Lazy Better Auth instance for the web runtime (public sign-up disabled).
 * Does not connect at import time — safe for marketing builds without secrets.
 */
export function getAuth(): Promise<StaffAuth> {
  const authResolved = resolveAuthRuntimeConfig();
  if (!authResolved.ok) {
    return Promise.reject(
      new Error(
        `Better Auth is not configured. ${authResolved.issues
          .map((issue) => issue.message)
          .join(" ")}`,
      ),
    );
  }
  if (!isMongoRuntimeConfigured()) {
    return Promise.reject(
      new Error(
        "Better Auth requires MongoDB. Set MONGODB_URI and MONGODB_DB_NAME.",
      ),
    );
  }

  const state = getAuthState();
  const key = authCacheKey(
    authResolved.config.secret,
    authResolved.config.baseURL,
    process.env.MONGODB_DB_NAME?.trim() ?? "",
  );

  if (state.promise && state.key === key) {
    return state.promise;
  }

  const promise = createStaffAuth({
    allowSignUp: false,
    withNextCookies: true,
  }).catch((error) => {
    const current = getAuthState();
    if (current.promise === promise) {
      current.promise = undefined;
      current.key = undefined;
    }
    throw error;
  });

  state.promise = promise;
  state.key = key;
  return promise;
}

/**
 * One-shot auth instance that allows email sign-up.
 * Use only from the owner bootstrap script — never from HTTP handlers.
 */
export function createBootstrapAuth(): Promise<StaffAuth> {
  return createStaffAuth({ allowSignUp: true, withNextCookies: false });
}

export function isStaffAuthReady(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return isAuthRuntimeConfigured(env) && isMongoRuntimeConfigured(env);
}

/** Test helper: clear cached auth instance. */
export function resetStaffAuthStateForTests(): void {
  const state = getAuthState();
  state.promise = undefined;
  state.key = undefined;
}
