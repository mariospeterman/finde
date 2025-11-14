import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

import { ClientProviders } from "@/components/client-providers";
import { publicEnv } from "@/lib/env";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${publicEnv.brandName} — Search, Decide, Deliver`,
  description:
    "Finde turns scattered knowledge into confident decisions. Launch a pilot in days, keep your teams aligned, and measure the clarity you unlock.",
  metadataBase: new URL("https://finde.info"),
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body className={`${manrope.variable} ${fraunces.variable} antialiased`} suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <ClientProviders />
      </body>
    </html>
  );
}
