/**
 * Safe MongoDB connectivity diagnostic.
 * Prints Passed/Failed and a non-secret label only — never URI or passwords.
 *
 * Usage: npm run db:check
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { closeMongoClient, pingMongo } from "../src/lib/mongodb/connection";
import { resolveMongoRuntimeConfig } from "../src/lib/mongodb/config";

/** Minimal .env loader — does not print values; skips missing files. */
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

async function main() {
  const resolved = resolveMongoRuntimeConfig();
  if (!resolved.ok) {
    console.log("Failed — MongoDB configuration incomplete.");
    for (const issue of resolved.issues) {
      console.log(`- ${issue.code}: ${issue.message}`);
    }
    console.log(
      "See docs/setup/mongodb-atlas.md. Do not paste connection strings into chat.",
    );
    process.exitCode = 1;
    return;
  }

  const result = await pingMongo();
  if (result.ok) {
    console.log(`Passed — MongoDB ping ok (${result.label}).`);
    console.log(
      "Note: ping proves reachability and authentication only — not schema, privileges, or durable writes.",
    );
  } else {
    console.log(`Failed — ${result.reason}`);
    if (result.label) {
      console.log(`Target label: ${result.label}`);
    }
    process.exitCode = 1;
  }

  await closeMongoClient();
}

main().catch(async () => {
  console.log("Failed — unexpected diagnostic error (details omitted).");
  process.exitCode = 1;
  await closeMongoClient();
});
