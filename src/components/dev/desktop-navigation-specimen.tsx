"use client";

import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HomeLink } from "@/components/layout/home-link";
import { getDesktopNavSpecimen } from "@/config/navigation";
import { HeaderNavLink } from "@/components/layout/header-nav-link";
import { navLinkClassName } from "@/components/layout/nav-link-styles";

const specimen = getDesktopNavSpecimen();

export function DesktopNavigationSpecimen() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3>Full intended desktop bar</h3>
        <p className="ds-support mt-2 max-w-reading">
          Unavailable destinations are labelled Planned and are not links.
          Interactive examples go to this page or Home.
        </p>
        <div className="mt-4 rounded-md border border-border-subtle bg-canvas px-4 py-3">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3">
            <HomeLink />
            <DesktopNavigation idPrefix="gallery-full" {...specimen} />
          </div>
        </div>
      </div>

      <div>
        <h3>Active states</h3>
        <p className="ds-support mt-2 max-w-reading">
          Current page uses <code>aria-current=&quot;page&quot;</code>. A parent
          section can look active without that attribute. These swatches are not
          extra destinations.
        </p>
        <ul className="mt-4 flex list-none flex-wrap gap-3 p-0">
          <li>
            <HeaderNavLink
              item={{
                id: "state-current",
                label: "Current page example",
                path: "/",
                implemented: true,
              }}
              pathname="/"
            />
          </li>
          <li>
            <span className={navLinkClassName("section")}>
              Section example (not the current page)
            </span>
          </li>
          <li>
            <span className={navLinkClassName("idle")}>Idle example</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
