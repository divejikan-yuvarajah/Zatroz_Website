/**
 * npm run db:apply -- --target <development|test|preview>
 * Applies schema/index migrations using the maintenance credential.
 * Refuses production. Never prints credentials or documents.
 */

import { loadEnvFiles } from "../src/lib/mongodb/scripts-env";
import { applyMigration } from "../src/lib/mongodb/migrations/apply";
import { formatPlanForCli } from "../src/lib/mongodb/migrations/plan";

loadEnvFiles();

function readTarget(argv: string[]): string | null {
  const idx = argv.indexOf("--target");
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  const eq = argv.find((arg) => arg.startsWith("--target="));
  if (eq) return eq.slice("--target=".length);
  return null;
}

async function main() {
  const target = readTarget(process.argv.slice(2));
  if (!target) {
    console.log(
      "Failed — pass an explicit approved target: --target development|test|preview",
    );
    process.exitCode = 1;
    return;
  }

  const result = await applyMigration({ target });
  if (!result.ok) {
    console.log(`Failed — ${result.message}`);
    if (result.plan) {
      console.log(formatPlanForCli(result.plan));
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Passed — ${result.message} (mode=${result.mode}).`);
  console.log(formatPlanForCli(result.plan));
}

main().catch(() => {
  console.log("Failed — unexpected apply error (details omitted).");
  process.exitCode = 1;
});
