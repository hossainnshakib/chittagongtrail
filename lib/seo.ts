import type { Metadata } from "next";
import { getPublicSiteSettings } from "./settings-service";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://chittagongtrail.com";

const SITE_NAME = "Chittagong Trail";
const SITE_DESCRIPTION =
  "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people through genuine discovery.";
const SITE_LOCALE = "en_US";

const DEFAULT_OG_IMAGE = `${SITE_URL}/images/chittagongtrail_logo.png`;
const DEFAULT_OG_IMAGE_WIDTH = 792;
const DEFAULT_OG_IMAGE_HEIGHT = 800;

export function getSiteUrl(path?: string): string {
  if (!path) return SITE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function getAbsoluteImageUrl(imagePath?: string | null): string {
  if (!imagePath) return DEFAULT_OG_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${SITE_URL}${cleanPath}`;
}

interface BaseMetadataOptions {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
}

export function buildMetadata(options: BaseMetadataOptions): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    path,
    image,
    imageWidth = DEFAULT_OG_IMAGE_WIDTH,
    imageHeight = DEFAULT_OG_IMAGE_HEIGHT,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    noindex = false,
  } = options;

  const url = getSiteUrl(path);
  const imageUrl = getAbsoluteImageUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: [
        {
          url: imageUrl,
          width: imageWidth,
          height: imageHeight,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const url = getSiteUrl();
  const ogImageUrl = settings.defaultOgMedia ? settings.defaultOgMedia.secureUrl : DEFAULT_OG_IMAGE;
  const ogWidth = settings.defaultOgMedia?.width || DEFAULT_OG_IMAGE_WIDTH;
  const ogHeight = settings.defaultOgMedia?.height || DEFAULT_OG_IMAGE_HEIGHT;
  const defaultTitle = settings.defaultMetaTitle || `${settings.siteName} — Places, Stories, Food & Journeys from Chittagong`;
  const defaultDesc = settings.defaultMetaDescription || settings.siteTagline || SITE_DESCRIPTION;

  return {
    metadataBase: new URL(url),
    title: {
      default: defaultTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: defaultDesc,
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
    authors: [{ name: settings.siteName }],
    creator: settings.siteName,
    publisher: settings.siteName,
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      url,
      siteName: settings.siteName,
      title: defaultTitle,
      description: defaultDesc,
      images: [
        {
          url: ogImageUrl,
          width: ogWidth,
          height: ogHeight,
          alt: settings.defaultOgMedia?.altText || `${settings.siteName} — Exploring Chittagong`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDesc,
      images: [ogImageUrl],
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
}

export function buildPageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string | null
): Metadata {
  return buildMetadata({
    title,
    description,
    path,
    image,
  });
}

// Structured Data Types
interface JsonLdBase {
  "@context": string;
  "@type": string;
}

interface OrganizationJsonLd extends JsonLdBase {
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

interface WebSiteJsonLd extends JsonLdBase {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
}

interface ArticleJsonLd extends JsonLdBase {
  "@type": "Article" | "BlogPosting";
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
}

interface TouristAttractionJsonLd extends JsonLdBase {
  "@type": "TouristAttraction";
  name: string;
  description: string;
  url: string;
  image?: string;
  geo?: {
    "@type": "GeoCoordinates";
    latitude?: number;
    longitude?: number;
  };
  containedInPlace?: {
    "@type": "City";
    name: string;
    containedInPlace?: {
      "@type": "Country";
      name: string;
    };
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLd extends JsonLdBase {
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export async function buildOrganizationJsonLd(): Promise<OrganizationJsonLd> {
  const { getPublicSiteSettings } = await import("./settings-service");
  const settings = await getPublicSiteSettings();
  const sameAs = [
    settings.socialFacebook,
    settings.socialInstagram,
    settings.socialYouTube,
    settings.socialX,
    settings.socialThreads,
    settings.socialLinkedIn,
    settings.socialTikTok,
  ].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: SITE_URL,
    logo: settings.defaultOgMedia ? settings.defaultOgMedia.secureUrl : DEFAULT_OG_IMAGE,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export async function buildWebSiteJsonLd(): Promise<WebSiteJsonLd> {
  const { getPublicSiteSettings } = await import("./settings-service");
  const settings = await getPublicSiteSettings();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: SITE_URL,
    description: settings.defaultMetaDescription || settings.siteTagline || SITE_DESCRIPTION,
  };
}

export function buildArticleJsonLd(options: {
  title: string;
  description: string;
  image?: string | null;
  datePublished: string;
  dateModified?: string;
  url: string;
  type?: string;
}): ArticleJsonLd {
  const imageUrl = getAbsoluteImageUrl(options.image);
  const jsonLdType = options.type === "FOOD" ? "Article" : "BlogPosting";

  return {
    "@context": "https://schema.org",
    "@type": jsonLdType,
    headline: options.title,
    description: options.description,
    image: imageUrl,
    datePublished: options.datePublished,
    ...(options.dateModified && { dateModified: options.dateModified }),
    author: {
      "@type": "Person",
      name: "Chittagong Trail",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": options.url,
    },
  };
}

export function buildTouristAttractionJsonLd(options: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}): TouristAttractionJsonLd {
  const result: TouristAttractionJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: options.name,
    description: options.description,
    url: options.url,
    containedInPlace: {
      "@type": "City",
      name: "Chittagong",
      containedInPlace: {
        "@type": "Country",
        name: "Bangladesh",
      },
    },
  };

  if (options.image) {
    result.image = getAbsoluteImageUrl(options.image);
  }

  if (options.latitude != null && options.longitude != null) {
    result.geo = {
      "@type": "GeoCoordinates",
      latitude: options.latitude,
      longitude: options.longitude,
    };
  }

  return result;
}

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): BreadcrumbJsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE };
