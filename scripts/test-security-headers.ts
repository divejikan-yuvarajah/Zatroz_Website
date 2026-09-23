/**
 * Step 61 — security response headers (no network).
 */

import assert from "node:assert/strict";
import {
  ENFORCED_CSP,
  REPORT_ONLY_CSP,
  securityHeaderList,
} from "../src/lib/security/response-headers";

function pass(label: string) {
  console.log(`PASS ${label}`);
}

function main() {
  const headers = securityHeaderList();
  const byName = new Map(headers.map((header) => [header.key, header.value]));

  assert.equal(byName.get("X-Content-Type-Options"), "nosniff");
  assert.equal(
    byName.get("Referrer-Policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(byName.get("X-Frame-Options"), "DENY");
  assert.match(byName.get("Permissions-Policy") ?? "", /camera=\(\)/);
  assert.equal(byName.get("Content-Security-Policy"), ENFORCED_CSP);
  assert.equal(
    byName.get("Content-Security-Policy-Report-Only"),
    REPORT_ONLY_CSP,
  );

  assert.equal(ENFORCED_CSP.includes("unsafe-inline"), false);
  assert.equal(ENFORCED_CSP.includes("unsafe-eval"), false);
  assert.equal(REPORT_ONLY_CSP.includes("*"), false);
  assert.equal(REPORT_ONLY_CSP.includes("unsafe-inline"), false);
  assert.equal(REPORT_ONLY_CSP.includes("unsafe-eval"), false);
  assert.match(ENFORCED_CSP, /frame-ancestors 'none'/);
  assert.match(ENFORCED_CSP, /object-src 'none'/);

  pass("security headers omit unsafe script allowances");
  console.log("All Step 61 header checks passed.");
}

main();
