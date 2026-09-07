import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  generateMetadata as generateRootMetadata,
  safeJsonLd,
} from "@/lib/seo";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return generateRootMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [organizationJsonLd, webSiteJsonLd] = await Promise.all([
    buildOrganizationJsonLd(),
    buildWebSiteJsonLd(),
  ]);

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-dark-bg focus:text-dark-text focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
