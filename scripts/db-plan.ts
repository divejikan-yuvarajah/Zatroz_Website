/**
 * npm run db:plan — read-only schema/index plan (maintenance credential).
 */

import { loadEnvFiles } from "../src/lib/mongodb/scripts-env";
import { planMigration } from "../src/lib/mongodb/migrations/apply";

loadEnvFiles();

async function main() {
  const result = await planMigration({});
  if (!result.ok) {
    console.log(`Failed — ${result.message}`);
    console.log("See docs/setup/mongodb-migrations.md.");
    process.exitCode = 1;
    return;
  }

  console.log("Passed — migration plan (read-only).");
  console.log(result.text);
  if (result.plan.ledgerStatus === "applied") {
    console.log(
      "Note: ledger marks this migration applied; re-apply is a no-op when indexes match.",
    );
  }
}

main().catch(() => {
  console.log("Failed — unexpected plan error (details omitted).");
  process.exitCode = 1;
});
