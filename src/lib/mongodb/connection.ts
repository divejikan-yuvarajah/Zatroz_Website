/**
 * MongoDB connection helper — Node-compatible (no server-only marker).
 * Next.js app code should import via `@/server/mongodb` instead.
 *
 * Importing this module does not connect and does not require credentials.
 */

import { MongoClient, type Db, type MongoClientOptions } from "mongodb";
import {
  mongoConfigLabel,
  resolveMongoRuntimeConfig,
  sanitizeMongoError,
  type MongoRuntimeConfig,
} from "@/lib/mongodb/config";

/** Conservative pool for a small marketing site + later enquiries. */
export const MONGODB_POOL = {
  minPoolSize: 0,
  /** Per process — multiply by instance count against Atlas connection limits. */
  maxPoolSize: 5,
} as const;

export const MONGODB_TIMEOUTS_MS = {
  /** Server selection / initial connect budget. */
  serverSelectionTimeoutMS: 8_000,
  /** Wait for a pool connection under load. */
  waitQueueTimeoutMS: 5_000,
  connectTimeoutMS: 8_000,
} as const;

type GlobalMongoState = {
  clientPromise?: Promise<MongoClient>;
  configKey?: string;
};

const globalForMongo = globalThis as typeof globalThis & {
  __zatrozMongo?: GlobalMongoState;
};

function getGlobalState(): GlobalMongoState {
  if (!globalForMongo.__zatrozMongo) {
    globalForMongo.__zatrozMongo = {};
  }
  return globalForMongo.__zatrozMongo;
}

function configKey(config: MongoRuntimeConfig): string {
  // Fingerprint without embedding the secret URI in long-lived debug strings.
  return `${config.appEnv}|${config.dbName}|${config.uri.length}`;
}

function buildClientOptions(): MongoClientOptions {
  return {
    minPoolSize: MONGODB_POOL.minPoolSize,
    maxPoolSize: MONGODB_POOL.maxPoolSize,
    serverSelectionTimeoutMS: MONGODB_TIMEOUTS_MS.serverSelectionTimeoutMS,
    waitQueueTimeoutMS: MONGODB_TIMEOUTS_MS.waitQueueTimeoutMS,
    connectTimeoutMS: MONGODB_TIMEOUTS_MS.connectTimeoutMS,
    // Keep TLS verification on (driver default for mongodb+srv / TLS URIs).
  };
}

async function connectWithConfig(
  config: MongoRuntimeConfig,
): Promise<MongoClient> {
  const client = new MongoClient(config.uri, buildClientOptions());
  try {
    await client.connect();
    return client;
  } catch (error) {
    await client.close().catch(() => undefined);
    throw error;
  }
}

/**
 * Lazy shared client for the current process.
 * Resets after a rejected init so a transient first failure can retry.
 */
export function getMongoClient(): Promise<MongoClient> {
  const resolved = resolveMongoRuntimeConfig();
  if (!resolved.ok) {
    const detail = resolved.issues.map((issue) => issue.message).join(" ");
    return Promise.reject(new Error(`MongoDB is not configured. ${detail}`));
  }

  const state = getGlobalState();
  const key = configKey(resolved.config);

  if (state.clientPromise && state.configKey === key) {
    return state.clientPromise;
  }

  const promise = connectWithConfig(resolved.config).catch((error) => {
    const current = getGlobalState();
    if (current.clientPromise === promise) {
      current.clientPromise = undefined;
      current.configKey = undefined;
    }
    throw error;
  });

  state.clientPromise = promise;
  state.configKey = key;
  return promise;
}

export async function getDb(dbName?: string): Promise<Db> {
  const resolved = resolveMongoRuntimeConfig();
  if (!resolved.ok) {
    const detail = resolved.issues.map((issue) => issue.message).join(" ");
    throw new Error(`MongoDB is not configured. ${detail}`);
  }
  const client = await getMongoClient();
  return client.db(dbName ?? resolved.config.dbName);
}

export type MongoPingResult =
  | {
      ok: true;
      label: string;
    }
  | {
      ok: false;
      reason: string;
      label?: string;
    };

/**
 * Minimal connectivity check (ping). Proves reachability/auth only —
 * not collection privileges, schema, durable writes, or app security.
 */
export async function pingMongo(): Promise<MongoPingResult> {
  const resolved = resolveMongoRuntimeConfig();
  if (!resolved.ok) {
    return {
      ok: false,
      reason: resolved.issues.map((issue) => issue.message).join(" "),
    };
  }

  const label = mongoConfigLabel(resolved.config);

  try {
    const client = await getMongoClient();
    const db = client.db(resolved.config.dbName);
    const result = await db.command({ ping: 1 });
    if (!result || result.ok !== 1) {
      return {
        ok: false,
        reason: "Ping completed without an ok acknowledgement.",
        label,
      };
    }
    return { ok: true, label };
  } catch (error) {
    return {
      ok: false,
      reason: sanitizeMongoError(error),
      label,
    };
  }
}

/**
 * Close the process client. Use from standalone scripts after work finishes.
 * Do not call from ordinary web request handlers.
 */
export async function closeMongoClient(): Promise<void> {
  const state = getGlobalState();
  const promise = state.clientPromise;
  state.clientPromise = undefined;
  state.configKey = undefined;
  if (!promise) return;
  try {
    const client = await promise;
    await client.close();
  } catch {
    // Ignore close after a failed connect.
  }
}

/** Test-only: clear singleton state without closing (unit tests). */
export function resetMongoClientStateForTests(): void {
  const state = getGlobalState();
  state.clientPromise = undefined;
  state.configKey = undefined;
}
