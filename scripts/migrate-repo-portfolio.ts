/**
 * npm run migrate:repo-portfolio -- --target <development|test|preview> [--apply]
 * One-time A10 import of approved repository portfolio records into MongoDB.
 * Default is dry-run. Never prints credentials or document bodies.
 */

import { loadEnvFiles } from "../src/lib/mongodb/scripts-env";
import {
  formatRepoPortfolioPlan,
  runRepoPortfolioMigration,
} from "../src/lib/mongodb/repo-portfolio-migration";

loadEnvFiles();

function readTarget(argv: string[]): string | null {
  const idx = argv.indexOf("--target");
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  const eq = argv.find((arg) => arg.startsWith("--target="));
  if (eq) return eq.slice("--target=".length);
  return null;
}

async function main() {
  const argv = process.argv.slice(2);
  const target = readTarget(argv);
  const apply = argv.includes("--apply");

  if (!target) {
    console.log(
      "Failed — pass an explicit approved target: --target development|test|preview",
    );
    console.log(
      "Default is dry-run. Add --apply only after reviewing the plan.",
    );
    process.exitCode = 1;
    return;
  }

  const result = await runRepoPortfolioMigration({ target, apply });
  if (!result.ok) {
    console.log(`Failed — ${result.message}`);
    if (result.plan) {
      console.log(formatRepoPortfolioPlan(result.plan));
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Passed — mode=${result.mode}. ${result.message}`);
}

main().catch(() => {
  console.log("Failed — unexpected migration error (details omitted).");
  process.exitCode = 1;
});
