/**
 * Enquiry transport contract tests — simulation only, no network.
 */
import {
  coerceEnquirySubmitResult,
  isEnquirySubmitResult,
} from "../src/lib/enquiries/transport";
import {
  createMalformedSubmitEnquiry,
  createSimulatedSubmitEnquiry,
} from "../src/lib/enquiries/simulate";
import {
  createEmptyEnquiryValues,
  validateEnquiryInput,
} from "../src/lib/enquiries/input";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
  console.log(`PASS ${message}`);
}

async function run() {
  const valid = validateEnquiryInput({
    ...createEmptyEnquiryValues("ui-ux-design"),
    name: "Alex Reviewer",
    email: "review@example.com",
    message:
      "We need a clearer enquiry path for customers who browse the catalogue.",
  });
  assert(valid.ok === true, "fixture-valid");
  if (!valid.ok) return;

  const accepted = await createSimulatedSubmitEnquiry({
    scenario: "accepted",
    delayMs: 0,
  })(valid.value);
  assert(accepted.status === "accepted", "simulate-accepted");
  assert(isEnquirySubmitResult(accepted), "accepted-shape");

  const rate = await createSimulatedSubmitEnquiry({
    scenario: "rate-limited",
    delayMs: 0,
  })(valid.value);
  assert(rate.status === "rate-limited", "simulate-rate-limited");

  const unknown = await createSimulatedSubmitEnquiry({
    scenario: "unknown-outcome",
    delayMs: 0,
  })(valid.value);
  assert(unknown.status === "unknown-outcome", "simulate-unknown");

  const malformedRaw = await createMalformedSubmitEnquiry(0)();
  assert(isEnquirySubmitResult(malformedRaw) === false, "malformed-raw");
  const coerced = coerceEnquirySubmitResult(malformedRaw);
  assert(coerced.status === "unknown-outcome", "malformed-coerced");

  assert(
    coerceEnquirySubmitResult(null).status === "unknown-outcome",
    "null-coerced",
  );
  assert(
    coerceEnquirySubmitResult({ status: "accepted", message: "ok" }).status ===
      "accepted",
    "valid-passthrough",
  );

  // Double-submit guard is UI-level; simulation still returns one result per call.
  let calls = 0;
  const delayed = createSimulatedSubmitEnquiry({
    scenario: "delayed",
    delayMs: 30,
  });
  const wrapped: typeof delayed = async (input) => {
    calls += 1;
    return delayed(input);
  };
  const [a, b] = await Promise.all([
    wrapped(valid.value),
    wrapped(valid.value),
  ]);
  assert(calls === 2, "two-calls-when-invoked-twice");
  assert(a.status === "accepted" && b.status === "accepted", "both-accepted");

  console.log("Enquiry transport tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
