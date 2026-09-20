/**
 * Local maintenance command: dispatch pending enquiry notification intents.
 * Requires MongoDB + email env. Does not print personal data.
 *
 * Usage: npx tsx scripts/dispatch-enquiry-notifications.ts
 */

import { getDb } from "../src/lib/mongodb/connection";
import { dispatchEnquiryNotificationBatch } from "../src/server/jobs/enquiry-notifications";

async function main() {
  const db = await getDb();
  const counts = await dispatchEnquiryNotificationBatch({
    db,
    limit: 10,
    leaseOwner: `cli_${process.pid}`,
  });
  console.log(JSON.stringify({ ok: true, ...counts }));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "dispatch-failed";
  console.error(JSON.stringify({ ok: false, error: message }));
  process.exitCode = 1;
});
