import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

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
  title: {
    default: "Chittagong Trail — Exploring Chittagong's Places, Stories, and Culture",
    template: "%s | Chittagong Trail",
  },
  description:
    "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people through genuine discovery and authentic editorial voice.",
  keywords: [
    "Chittagong",
    "travel",
    "journal",
    "Bangladesh",
    "exploration",
    "places",
    "stories",
    "culture",
    "history",
    "food",
  ],
  authors: [{ name: "Chittagong Trail" }],
  creator: "Chittagong Trail",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chittagongtrail.com",
    siteName: "Chittagong Trail",
    title: "Chittagong Trail — Exploring Chittagong's Places, Stories, and Culture",
    description:
      "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people.",
    images: [
      {
        url: "/images/chittagongtrail_logo.png",
        width: 792,
        height: 800,
        alt: "Chittagong Trail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chittagong Trail — Exploring Chittagong's Places, Stories, and Culture",
    description:
      "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people.",
    images: ["/images/chittagongtrail_logo.png"],
  },
  icons: {
    icon: "/images/chittagongtrail-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
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
