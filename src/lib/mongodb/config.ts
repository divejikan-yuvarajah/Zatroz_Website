/**
 * MongoDB environment configuration — pure Node module (no server-only).
 * Safe for scripts and for Next.js server wrappers.
 * Never log URI, password, or full driver error messages.
 */

export const APP_ENV_VALUES = [
  "development",
  "test",
  "preview",
  "production",
] as const;

export type AppEnv = (typeof APP_ENV_VALUES)[number];

/**
 * Allowed database name pattern: zatroz_<env-label>, lowercase, digits, underscore.
 * Rejects bare `test` and accidental production names in local configs.
 */
export const MONGODB_DB_NAME_PATTERN = /^zatroz_[a-z0-9_]+$/;

export type MongoRuntimeConfig = Readonly<{
  uri: string;
  dbName: string;
  appEnv: AppEnv;
}>;

export type MongoConfigIssue = Readonly<{
  code: string;
  message: string;
}>;

export type MongoConfigResult =
  | { ok: true; config: MongoRuntimeConfig }
  | { ok: false; issues: readonly MongoConfigIssue[] };

function readTrimmed(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isAllowedAppEnv(value: string): value is AppEnv {
  return (APP_ENV_VALUES as readonly string[]).includes(value);
}

export function isAllowedMongoDbName(name: string): boolean {
  if (name === "test" || name === "admin" || name === "local") {
    return false;
  }
  return MONGODB_DB_NAME_PATTERN.test(name);
}

export function isMongoUriScheme(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

/**
 * Validate runtime application MongoDB settings.
 * Does not connect. Missing URI is a soft miss for marketing builds —
 * call only when a database operation is expected.
 */
export function resolveMongoRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
): MongoConfigResult {
  const issues: MongoConfigIssue[] = [];

  const uri = readTrimmed(env, "MONGODB_URI");
  const dbName = readTrimmed(env, "MONGODB_DB_NAME");
  const appEnvRaw = readTrimmed(env, "APP_ENV") ?? "development";

  if (!uri) {
    issues.push({
      code: "missing-mongodb-uri",
      message: "MONGODB_URI is not set.",
    });
  } else if (!isMongoUriScheme(uri)) {
    issues.push({
      code: "invalid-mongodb-uri-scheme",
      message: "MONGODB_URI must start with mongodb:// or mongodb+srv://.",
    });
  }

  if (!dbName) {
    issues.push({
      code: "missing-mongodb-db-name",
      message: "MONGODB_DB_NAME is not set.",
    });
  } else if (!isAllowedMongoDbName(dbName)) {
    issues.push({
      code: "invalid-mongodb-db-name",
      message:
        "MONGODB_DB_NAME must match zatroz_<label> (lowercase). Do not use bare names like test.",
    });
  }

  if (!isAllowedAppEnv(appEnvRaw)) {
    issues.push({
      code: "invalid-app-env",
      message:
        "APP_ENV must be development, test, preview, or production when set.",
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    config: {
      uri: uri as string,
      dbName: dbName as string,
      appEnv: appEnvRaw as AppEnv,
    },
  };
}

/** Whether runtime Mongo config is present and structurally valid. */
export function isMongoRuntimeConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return resolveMongoRuntimeConfig(env).ok;
}

/**
 * Non-secret label for diagnostics (never includes URI or credentials).
 */
export function mongoConfigLabel(config: MongoRuntimeConfig): string {
  return `appEnv=${config.appEnv}; db=${config.dbName}`;
}

/**
 * Sanitize an unknown connection failure for logs/CLI.
 * Never includes the original message (may contain host/user details).
 */
export function sanitizeMongoError(error: unknown): string {
  const name =
    error && typeof error === "object" && "name" in error
      ? String((error as { name: unknown }).name)
      : "Error";

  if (name === "MongoServerSelectionError") {
    return "Could not select a MongoDB server (network, DNS/SRV, TLS, or IP access list).";
  }
  if (name === "MongoAuthenticationError" || name === "MongoError") {
    return "MongoDB authentication or server error (check user, password encoding, and database name).";
  }
  if (name === "MongoParseError") {
    return "MongoDB connection string could not be parsed.";
  }
  if (name === "MongoNetworkError" || name === "MongoNetworkTimeoutError") {
    return "MongoDB network error or timeout.";
  }
  return `MongoDB connection failed (${name}).`;
}
