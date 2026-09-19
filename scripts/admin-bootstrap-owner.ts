/**
 * Create the first owner account from env-only bootstrap values.
 * Never invent passwords. Do not run against production casually.
 *
 * Required env (in .env.local — never commit real values):
 *   MONGODB_URI, MONGODB_DB_NAME
 *   BETTER_AUTH_SECRET (>= 32 chars)
 *   ADMIN_BOOTSTRAP_EMAIL, ADMIN_BOOTSTRAP_PASSWORD (>= 12), ADMIN_BOOTSTRAP_NAME
 *
 * Usage: npm run admin:bootstrap-owner
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createBootstrapAuth } from "../src/lib/auth/create-auth";
import { closeMongoClient } from "../src/lib/mongodb/connection";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

function readRequired(key: string): string {
  const value = process.env[key]?.trim() ?? "";
  if (!value) {
    throw new Error(`${key} is required for owner bootstrap.`);
  }
  return value;
}

async function main() {
  const email = readRequired("ADMIN_BOOTSTRAP_EMAIL").toLowerCase();
  const password = readRequired("ADMIN_BOOTSTRAP_PASSWORD");
  const name = readRequired("ADMIN_BOOTSTRAP_NAME");

  if (password.length < 12) {
    throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters.");
  }

  if (!email.includes("@")) {
    throw new Error("ADMIN_BOOTSTRAP_EMAIL must look like an email address.");
  }

  console.log("Starting owner bootstrap (values not printed)…");

  const auth = await createBootstrapAuth();
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result?.user?.id) {
    throw new Error("Sign-up did not return a user id.");
  }

  const ctx = await auth.$context;
  await ctx.internalAdapter.updateUser(result.user.id, {
    staffRole: "owner",
  });

  console.log("Passed — owner account created or already provisioned.");
  console.log(
    "Next: sign in at /admin/login, enroll MFA at /admin/mfa, then clear ADMIN_BOOTSTRAP_* from the environment.",
  );
  console.log(
    "If the email already existed, update failed safely — check Mongo manually without pasting secrets.",
  );
}

main()
  .catch((error: unknown) => {
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : "bootstrap failed";
    // Never print password or full stack with env dumps.
    console.log(`Failed — ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongoClient();
  });
