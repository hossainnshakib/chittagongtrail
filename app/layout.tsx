import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chittagongtrail.com";
const ogImage = `${siteUrl}/images/chittagongtrail_logo.png`;

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chittagong Trail — Places, Stories, Food & Journeys from Chittagong",
    template: "%s | Chittagong Trail",
  },
  description:
    "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people through genuine discovery.",
  keywords: [
    "Chittagong",
    "Chittagong travel",
    "Chittagong journal",
    "Bangladesh",
    "exploration",
    "places",
    "stories",
    "culture",
    "history",
    "food",
    "trails",
  ],
  authors: [{ name: "Chittagong Trail" }],
  creator: "Chittagong Trail",
  publisher: "Chittagong Trail",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Chittagong Trail",
    title: "Chittagong Trail — Places, Stories, Food & Journeys from Chittagong",
    description:
      "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people.",
    images: [
      {
        url: ogImage,
        width: 792,
        height: 800,
        alt: "Chittagong Trail — Exploring Chittagong",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chittagong Trail — Places, Stories, Food & Journeys from Chittagong",
    description:
      "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people.",
    images: [ogImage],
  },
  icons: {
    icon: "/images/chittagongtrail-favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
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
