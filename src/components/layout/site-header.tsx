import { Container } from "@/components/ui/container";
import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { HomeLink } from "@/components/layout/home-link";
import { getHeaderNavigation } from "@/config/navigation";

export function SiteHeader() {
  const navigation = getHeaderNavigation();

  return (
    <header className="sticky top-0 z-[40] border-b border-border-subtle bg-canvas">
      <Container>
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 lg:min-h-[4.5rem]">
          <HomeLink />
          <DesktopNavigation
            className="hidden lg:block"
            idPrefix="site"
            {...navigation}
          />
        </div>
      </Container>
    </header>
  );
}
