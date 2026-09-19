/**
 * CLI runner for A11 content job worker.
 * Usage: npm run jobs:content-refresh -- [--limit 10]
 */

import { runContentJobWorker } from "../src/server/jobs/content-jobs";

async function main() {
  const args = process.argv.slice(2);
  let limit = 10;
  const limitIdx = args.indexOf("--limit");
  if (limitIdx >= 0) {
    const raw = Number.parseInt(args[limitIdx + 1] ?? "", 10);
    if (Number.isFinite(raw)) limit = raw;
  }

  const result = await runContentJobWorker({ limit });
  console.log(JSON.stringify(result, null, 2));
  if (result.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Worker failed.");
  process.exitCode = 1;
});
