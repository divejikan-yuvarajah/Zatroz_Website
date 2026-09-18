/**
 * Migration credential resolution — maintenance only, never web runtime.
 */

import {
  isAllowedMongoDbName,
  isMongoUriScheme,
  type AppEnv,
  APP_ENV_VALUES,
} from "@/lib/mongodb/config";

export type MigrationTarget = Exclude<AppEnv, "production">;

export const APPLY_ALLOWED_TARGETS = [
  "development",
  "test",
  "preview",
] as const satisfies readonly MigrationTarget[];

export type MigrationEnvConfig = Readonly<{
  uri: string;
  dbName: string;
  appEnv: AppEnv;
}>;

export type MigrationEnvResult =
  | { ok: true; config: MigrationEnvConfig }
  | { ok: false; issues: readonly string[] };

function readTrimmed(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Resolve maintenance connection.
 * Prefers MONGODB_MIGRATION_URI; does not fall back to the web runtime URI
 * so operators do not accidentally apply DDL with the app user.
 */
export function resolveMigrationEnv(
  env: NodeJS.ProcessEnv = process.env,
): MigrationEnvResult {
  const issues: string[] = [];
  const uri = readTrimmed(env, "MONGODB_MIGRATION_URI");
  const dbName = readTrimmed(env, "MONGODB_DB_NAME");
  const appEnvRaw = readTrimmed(env, "APP_ENV") ?? "development";

  if (!uri) {
    issues.push("MONGODB_MIGRATION_URI is not set (maintenance credential).");
  } else if (!isMongoUriScheme(uri)) {
    issues.push(
      "MONGODB_MIGRATION_URI must start with mongodb:// or mongodb+srv://.",
    );
  }

  if (!dbName) {
    issues.push("MONGODB_DB_NAME is not set.");
  } else if (!isAllowedMongoDbName(dbName)) {
    issues.push("MONGODB_DB_NAME must match zatroz_<label>.");
  }

  if (!(APP_ENV_VALUES as readonly string[]).includes(appEnvRaw)) {
    issues.push("APP_ENV must be development, test, preview, or production.");
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

export function isApplyTargetAllowed(
  target: string,
): target is MigrationTarget {
  return (APPLY_ALLOWED_TARGETS as readonly string[]).includes(target);
}

/** Refuse production apply from this tooling. */
export function assertNonProductionApply(
  target: string,
  appEnv: AppEnv,
): string | null {
  if (target === "production" || appEnv === "production") {
    return "Refusing to apply schema migrations to a production target from this CLI.";
  }
  if (!isApplyTargetAllowed(target)) {
    return `Target must be one of: ${APPLY_ALLOWED_TARGETS.join(", ")}.`;
  }
  if (target !== appEnv) {
    return `Explicit --target ${target} does not match APP_ENV=${appEnv}.`;
  }
  return null;
}
