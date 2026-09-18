import {
  ServiceBrowserFrame,
  ServicePhoneFrame,
} from "@/components/sections/service-browser-frame";

/**
 * Static comparison: browser workspace vs phone task for a fictional request.
 * Sample data only — no signup, login, credentials, or submitted booking.
 */
export function WebMobileTaskComparison() {
  return (
    <div className="mt-8">
      <p className="m-0 text-sm text-text-muted">
        Sample booking or request flow — not a live account, notification, or
        submitted booking.
      </p>
      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <figure className="m-0 min-w-0">
          <p className="m-0 mb-2 text-sm font-semibold text-ink">
            Browser workspace
          </p>
          <ServiceBrowserFrame title="requests.example">
            <p className="m-0 text-xs font-medium text-text-muted">
              Staff view · sample data
            </p>
            <p className="mt-2 m-0 font-semibold text-ink">Open requests</p>
            <ul className="mt-2 list-none space-y-2 p-0 text-text-body">
              <li className="border-b border-border-subtle pb-2">
                Sample request A — Room for Thursday
              </li>
              <li className="border-b border-border-subtle pb-2">
                Sample request B — Equipment pickup
              </li>
            </ul>
            <p className="mt-3 m-0 text-sm font-medium text-ink">
              Review details →
            </p>
            <p className="mt-1 m-0 text-xs text-text-muted">
              Deciding here does not change a real calendar or notify anyone.
            </p>
          </ServiceBrowserFrame>
          <figcaption className="mt-2 m-0 text-xs text-text-muted">
            Desk workflow for reviewing and deciding on requests.
          </figcaption>
        </figure>

        <figure className="m-0 min-w-0">
          <p className="m-0 mb-2 text-sm font-semibold text-ink">
            Phone task screen
          </p>
          <ServicePhoneFrame title="Request · sample">
            <p className="m-0 text-xs font-medium text-text-muted">
              Customer or staff · sample
            </p>
            <p className="mt-2 m-0 font-semibold text-ink">New request</p>
            <ul className="mt-2 list-none space-y-2 p-0 text-xs text-text-body">
              <li className="rounded-sm border border-border-subtle px-2 py-1.5">
                What do you need?
              </li>
              <li className="rounded-sm border border-border-subtle px-2 py-1.5">
                Preferred day
              </li>
            </ul>
            <p className="mt-3 m-0 text-sm font-medium text-ink">
              Send request →
            </p>
            <p className="mt-1 m-0 text-xs text-text-muted">
              Sample action only. Nothing is submitted or stored.
            </p>
          </ServicePhoneFrame>
          <figcaption className="mt-2 m-0 text-xs text-text-muted">
            Short capture on a phone — no credentials or permissions requested.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
