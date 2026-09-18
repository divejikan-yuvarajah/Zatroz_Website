"use client";

import { HomeLink } from "@/components/layout/home-link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import {
  getDesktopNavSpecimen,
  getHomeDestination,
  getMobileNavSpecimen,
} from "@/config/navigation";

export function MobileNavigationSpecimen() {
  const full = getDesktopNavSpecimen();
  const long = getMobileNavSpecimen();
  const home = getHomeDestination();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3>Full intended mobile panel</h3>
        <p className="ds-support mt-2 max-w-reading">
          This Menu control is always visible so you can open it on a desktop
          gallery view. The live header still hides Menu from 1024px. Planned
          destinations are not links.
        </p>
        <div className="mt-4 rounded-md border border-border-subtle bg-canvas px-4 py-3">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3">
            <HomeLink id="gallery-mobile-home" />
            <MobileNavigation
              idPrefix="gallery-mobile"
              home={home}
              fallbackFocusId="gallery-mobile-home"
              hideTriggerOnDesktop={false}
              {...full}
            />
          </div>
        </div>
      </div>

      <div>
        <h3>Long content</h3>
        <p className="ds-support mt-2 max-w-reading">
          Extra wrapping labels force the panel to scroll inside the dialog.
          Interactive examples still use Home or in-page ids.
        </p>
        <div className="mt-4 rounded-md border border-border-subtle bg-canvas px-4 py-3">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3">
            <HomeLink id="gallery-mobile-long-home" />
            <MobileNavigation
              idPrefix="gallery-mobile-long"
              home={home}
              fallbackFocusId="gallery-mobile-long-home"
              hideTriggerOnDesktop={false}
              {...long}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
