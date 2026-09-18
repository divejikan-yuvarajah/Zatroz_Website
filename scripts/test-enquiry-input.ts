/**
 * Enquiry input validation tests — no network, no personal logging.
 */
import {
  ENQUIRY_LIMITS,
  countEnquiryMessage,
  createEmptyEnquiryValues,
  isReasonableEmail,
  isReasonablePhone,
  phoneIsRequired,
  validateEnquiryInput,
  type EnquiryFormValues,
} from "../src/lib/enquiries/input";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
  console.log(`PASS ${message}`);
}

function baseValid(
  overrides: Partial<EnquiryFormValues> = {},
): EnquiryFormValues {
  return {
    ...createEmptyEnquiryValues("ui-ux-design"),
    name: "Alex Reviewer",
    email: "review@example.com",
    company: "",
    message:
      "We need a clearer enquiry path for customers who browse the catalogue.",
    timeline: "",
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: "",
    ...overrides,
  };
}

function run() {
  assert(validateEnquiryInput(baseValid()).ok === true, "valid-baseline");

  const empty = validateEnquiryInput(createEmptyEnquiryValues());
  assert(empty.ok === false, "empty-fails");
  if (!empty.ok) {
    assert(empty.errors.name === "Enter your name.", "empty-name-message");
    assert(
      empty.errors.email === "Enter a valid email address.",
      "empty-email-message",
    );
    assert(
      empty.errors.service === "Choose a service or Not sure yet.",
      "empty-service-message",
    );
    assert(
      empty.errors.message === "Add a little more detail about your project.",
      "empty-message-message",
    );
  }

  const whitespaceName = validateEnquiryInput(baseValid({ name: "   " }));
  assert(whitespaceName.ok === false, "whitespace-name-fails");

  const unicode = validateEnquiryInput(baseValid({ name: "名前 テスト" }));
  assert(unicode.ok === true, "unicode-name-ok");

  assert(isReasonableEmail("not-an-email") === false, "invalid-email");
  assert(isReasonableEmail("a@b.c") === true, "short-email-shape");

  const longName = validateEnquiryInput(
    baseValid({ name: "x".repeat(ENQUIRY_LIMITS.nameMax + 1) }),
  );
  assert(longName.ok === false, "name-max-boundary");

  const shortMessage = validateEnquiryInput(
    baseValid({ message: "too short" }),
  );
  assert(shortMessage.ok === false, "message-min");

  const withBreaks = validateEnquiryInput(
    baseValid({
      message:
        "Line one about the project need.\nLine two with more operational detail.",
    }),
  );
  assert(withBreaks.ok === true, "message-line-breaks");
  if (withBreaks.ok) {
    assert(withBreaks.value.message.includes("\n"), "preserves-line-breaks");
  }

  const blankOptional = validateEnquiryInput(
    baseValid({ company: "  ", timeline: "" }),
  );
  assert(blankOptional.ok === true, "blank-optional-ok");
  if (blankOptional.ok) {
    assert(blankOptional.value.company === null, "company-null");
    assert(blankOptional.value.timeline === null, "timeline-null");
    assert(blankOptional.value.phone === null, "phone-omitted-for-email");
  }

  const unknownService = validateEnquiryInput(
    baseValid({ service: "enterprise-cloud" }),
  );
  assert(unknownService.ok === false, "unknown-service");

  const unknownTimeline = validateEnquiryInput(
    baseValid({ timeline: "yesterday" }),
  );
  assert(unknownTimeline.ok === false, "unknown-timeline");

  const phoneRequired = validateEnquiryInput(
    baseValid({ preferredContact: "whatsapp", phone: "" }),
  );
  assert(phoneRequired.ok === false, "phone-required-for-whatsapp");

  const phoneOk = validateEnquiryInput(
    baseValid({ preferredContact: "phone", phone: "+94 76 809 8068" }),
  );
  assert(phoneOk.ok === true, "phone-accepted");
  if (phoneOk.ok) {
    assert(phoneOk.value.phone === "+94 76 809 8068", "phone-kept");
  }

  assert(phoneIsRequired("email") === false, "email-no-phone");
  assert(isReasonablePhone("123") === false, "phone-too-short");
  assert(isReasonablePhone("+1 (555) 010-2030") === true, "phone-formatted");

  const notSure = validateEnquiryInput(baseValid({ service: "not-sure" }));
  assert(notSure.ok === true, "not-sure-service");

  const preselect = createEmptyEnquiryValues("ai-automation");
  assert(preselect.service === "ai-automation", "initial-service");
  const badPreselect = createEmptyEnquiryValues(null);
  assert(badPreselect.service === "", "null-initial-service");

  assert(
    countEnquiryMessage("  hello world  ") === 11,
    "message-count-edge-trim",
  );

  // Hidden phone must not appear when email is selected, even if filled.
  const hiddenPhone = validateEnquiryInput(
    baseValid({ preferredContact: "email", phone: "+94768098068" }),
  );
  assert(hiddenPhone.ok === true, "hidden-phone-ignored-ok");
  if (hiddenPhone.ok) {
    assert(hiddenPhone.value.phone === null, "hidden-phone-omitted");
  }

  console.log("Enquiry input tests passed.");
}

run();
