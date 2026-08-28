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
    default: "Chittagong Trail — A Personal Journal of Touring Chittagong",
    template: "%s | Chittagong Trail",
  },
  description:
    "A personal journal of touring Chittagong — places I visit, stories I find, and everything in between.",
  keywords: [
    "Chittagong",
    "travel",
    "journal",
    "Bangladesh",
    "exploration",
    "places",
    "stories",
  ],
  authors: [{ name: "Chittagong Trail" }],
  creator: "Chittagong Trail",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chittagongtrail.com",
    siteName: "Chittagong Trail",
    title: "Chittagong Trail — A Personal Journal of Touring Chittagong",
    description:
      "A personal journal of touring Chittagong — places I visit, stories I find, and everything in between.",
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
    title: "Chittagong Trail — A Personal Journal of Touring Chittagong",
    description:
      "A personal journal of touring Chittagong — places I visit, stories I find, and everything in between.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
