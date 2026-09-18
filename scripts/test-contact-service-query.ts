/**
 * Focused tests for contact `?service=` parsing.
 */
import {
  CONTACT_SERVICE_QUERY_MAX_LENGTH,
  parseContactServiceParam,
} from "../src/lib/contact-service-query";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
  console.log(`PASS ${message}`);
}

function run() {
  assert(
    parseContactServiceParam({}).service === null,
    "missing-service-returns-null",
  );

  assert(
    parseContactServiceParam({ service: "ui-ux-design" }).service ===
      "ui-ux-design",
    "valid-slug-accepted",
  );

  assert(
    parseContactServiceParam({ service: "not-a-real-service" }).service ===
      null,
    "unknown-slug-rejected",
  );

  assert(
    parseContactServiceParam({ service: ["ui-ux-design", "ai-automation"] })
      .service === null,
    "repeated-values-rejected",
  );

  assert(
    parseContactServiceParam({
      service: "x".repeat(CONTACT_SERVICE_QUERY_MAX_LENGTH + 1),
    }).service === null,
    "oversized-value-rejected",
  );

  assert(
    parseContactServiceParam({ service: "  custom-software  " }).service ===
      "custom-software",
    "trimmed-valid-slug-accepted",
  );

  const params = new URLSearchParams();
  params.append("service", "websites-ecommerce");
  assert(
    parseContactServiceParam(params).service === "websites-ecommerce",
    "urlsearchparams-valid",
  );

  const repeated = new URLSearchParams();
  repeated.append("service", "websites-ecommerce");
  repeated.append("service", "ai-automation");
  assert(
    parseContactServiceParam(repeated).service === null,
    "urlsearchparams-repeated-rejected",
  );

  console.log("Contact service query tests passed.");
}

run();
