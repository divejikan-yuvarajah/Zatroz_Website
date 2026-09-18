import { HomeAutomationExample } from "@/components/sections/home-automation-example";
import { getAutomationExampleSpecimen } from "@/server/home";

/**
 * Gallery specimen for the charcoal automation example.
 * Draft copy for review — not published on public `/` until approved.
 */
export function HomeAutomationExampleSpecimen() {
  const example = getAutomationExampleSpecimen();
  const withAction = getAutomationExampleSpecimen({
    action: {
      label: "In-page colour target (specimen)",
      href: "#colour-heading",
    },
  });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Draft automation example</h3>
        <p className="ds-support mt-2 max-w-reading">
          Full illustrative workflow with sample invoice and optional manual
          walkthrough. No upload, OCR, or network processing.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeAutomationExample
            example={example}
            headingLevel={2}
            idPrefix="gallery-automation-default-"
          />
        </div>
      </div>

      <div>
        <h3>With specimen action</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeAutomationExample
            example={withAction}
            headingLevel={2}
            idPrefix="gallery-automation-action-"
          />
        </div>
      </div>
    </div>
  );
}
