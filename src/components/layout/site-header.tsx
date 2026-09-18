import { Container } from "@/components/ui/container";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HomeLink } from "@/components/layout/home-link";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import {
  getHeaderNavigation,
  getHomeDestination,
  getImplementedNavDestinations,
} from "@/config/navigation";

export function SiteHeader() {
  const navigation = getHeaderNavigation();
  const noscriptItems = getImplementedNavDestinations(navigation);

  return (
    <header className="sticky top-0 z-[40] border-b border-border-subtle bg-canvas">
      <Container>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 lg:min-h-[4.5rem]">
          <HomeLink id="site-home-link" />
          <DesktopNavigation
            className="hidden lg:block"
            idPrefix="site"
            {...navigation}
          />
          <MobileNavigation
            idPrefix="site"
            home={getHomeDestination()}
            fallbackFocusId="site-home-link"
            {...navigation}
          />
        </div>
        {noscriptItems.length > 0 ? (
          <noscript>
            <nav
              aria-label="Primary"
              className="border-t border-border-subtle py-3 lg:hidden"
            >
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {noscriptItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.path}
                      className="inline-flex min-h-11 items-center text-base font-medium text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </noscript>
        ) : null}
      </Container>
    </header>
  );
}
