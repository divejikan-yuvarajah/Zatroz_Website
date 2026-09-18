import { ServiceBrowserFrame } from "@/components/sections/service-browser-frame";

/**
 * Static comparison: business website vs catalogue / assisted ordering.
 * Sample data only — no cart, payment, or live order actions.
 */
export function WebsitesCatalogueComparison() {
  return (
    <div className="mt-8">
      <p className="m-0 text-sm text-text-muted">
        Sample comparison — not a shop, checkout, or portfolio screenshot.
      </p>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <figure className="m-0 min-w-0">
          <p className="m-0 mb-2 text-sm font-semibold text-ink">
            Business website
          </p>
          <ServiceBrowserFrame title="business.example">
            <p className="m-0 font-semibold text-ink">About our services</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-text-body">
              <li>What we do</li>
              <li>Who it helps</li>
              <li>How to enquire</li>
            </ul>
            <p className="mt-3 m-0 text-sm font-medium text-ink">
              Send an enquiry →
            </p>
          </ServiceBrowserFrame>
          <figcaption className="mt-2 m-0 text-xs text-text-muted">
            Visitor understands the offer, then contacts you.
          </figcaption>
        </figure>

        <figure className="m-0 min-w-0">
          <p className="m-0 mb-2 text-sm font-semibold text-ink">
            Catalogue / assisted ordering
          </p>
          <ServiceBrowserFrame title="catalogue.example">
            <p className="m-0 font-semibold text-ink">Browse items</p>
            <ul className="mt-2 list-none space-y-2 p-0 text-text-body">
              <li className="border-b border-border-subtle pb-2">
                Sample item A — ask about availability
              </li>
              <li className="border-b border-border-subtle pb-2">
                Sample item B — ask about delivery
              </li>
            </ul>
            <p className="mt-3 m-0 text-sm font-medium text-ink">
              Ask about an order →
            </p>
            <p className="mt-1 m-0 text-xs text-text-muted">
              Message starts a conversation. Your team confirms the order.
            </p>
          </ServiceBrowserFrame>
          <figcaption className="mt-2 m-0 text-xs text-text-muted">
            No automatic sale, cart, or payment on this illustration.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
