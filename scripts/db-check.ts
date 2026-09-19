/**
 * Safe MongoDB connectivity diagnostic.
 * Prints Passed/Failed and a non-secret label only — never URI or passwords.
 *
 * Usage: npm run db:check
 */

import { closeMongoClient, pingMongo } from "../src/lib/mongodb/connection";
import { resolveMongoRuntimeConfig } from "../src/lib/mongodb/config";
import { loadEnvFiles } from "../src/lib/mongodb/scripts-env";

loadEnvFiles();

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
