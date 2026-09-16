import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zatroz",
  description:
    "Zatroz website — development starter. Public pages and enquiry flow come in later steps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
