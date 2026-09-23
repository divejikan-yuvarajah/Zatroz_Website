import { Manrope } from "next/font/google";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { AppChrome } from "@/components/layout/app-chrome";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buildRootMetadata } from "@/server/seo/metadata";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata = buildRootMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans">
        <SiteJsonLd />
        <AppChrome
          marketingHeader={<SiteHeader />}
          marketingFooter={<SiteFooter />}
        >
          {children}
        </AppChrome>
      </body>
    </html>
  );
}
