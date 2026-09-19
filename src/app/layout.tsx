import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Zatroz",
  description:
    "Zatroz website — development starter. Public pages and enquiry flow come in later steps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans">
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
