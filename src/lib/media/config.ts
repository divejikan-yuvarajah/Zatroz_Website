/**
 * Cloudinary environment resolution (pure — no server-only).
 * Marketing builds may leave these blank; connect lazily when media ops run.
 */

export type CloudinaryRuntimeConfig = Readonly<{
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  /** Folder prefix hint only — not an access-control boundary. */
  folderPrefix: string;
}>;

export type CloudinaryConfigIssue = Readonly<{
  code: string;
  message: string;
}>;

export type CloudinaryConfigResult =
  | { ok: true; config: CloudinaryRuntimeConfig }
  | { ok: false; issues: readonly CloudinaryConfigIssue[] };

function readTrimmed(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key];
  if (value == null) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function resolveCloudinaryRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
): CloudinaryConfigResult {
  const issues: CloudinaryConfigIssue[] = [];

  const cloudName = readTrimmed(env, "CLOUDINARY_CLOUD_NAME");
  const apiKey = readTrimmed(env, "CLOUDINARY_API_KEY");
  const apiSecret = readTrimmed(env, "CLOUDINARY_API_SECRET");
  const folderPrefix = readTrimmed(env, "CLOUDINARY_FOLDER_PREFIX") ?? "zatroz";
  const appEnv = readTrimmed(env, "APP_ENV") ?? "development";

  if (!cloudName) {
    issues.push({
      code: "missing-cloudinary-cloud-name",
      message: "CLOUDINARY_CLOUD_NAME is not set.",
    });
  }
  if (!apiKey) {
    issues.push({
      code: "missing-cloudinary-api-key",
      message: "CLOUDINARY_API_KEY is not set.",
    });
  }
  if (!apiSecret) {
    issues.push({
      code: "missing-cloudinary-api-secret",
      message: "CLOUDINARY_API_SECRET is not set.",
    });
  }

  if (issues.length > 0 || !cloudName || !apiKey || !apiSecret) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    config: {
      cloudName,
      apiKey,
      apiSecret,
      folderPrefix: `${folderPrefix}/${appEnv}`,
    },
  };
}

export function isCloudinaryConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return resolveCloudinaryRuntimeConfig(env).ok;
}

/** Non-secret label for diagnostics. */
export function cloudinaryConfigLabel(config: CloudinaryRuntimeConfig): string {
  return `cloud=${config.cloudName}; folder=${config.folderPrefix}`;
}
