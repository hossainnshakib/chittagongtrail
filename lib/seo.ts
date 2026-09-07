import type { Metadata } from "next";
import { getPublicSiteSettings } from "./settings-service";
import { getPublicPageSeo, type PublicPageKey } from "./public-content";
import { getConfiguredSiteOrigin, getConfiguredSiteUrl } from "./site-url";

const SITE_URL = getConfiguredSiteOrigin();

const SITE_NAME = "Chittagong Trail";
const SITE_DESCRIPTION =
  "An independent exploration and storytelling platform documenting Chittagong's places, culture, history, food, and people through genuine discovery.";
const SITE_LOCALE = "en_US";

const DEFAULT_OG_IMAGE = "/images/chittagongtrail_logo.png";
const DEFAULT_OG_IMAGE_WIDTH = 792;
const DEFAULT_OG_IMAGE_HEIGHT = 800;

export function getSiteUrl(path?: string): string {
  return getConfiguredSiteUrl(path);
}

export function getAbsoluteImageUrl(imagePath?: string | null): string {
  if (!imagePath) return DEFAULT_OG_IMAGE;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  if (!SITE_URL) return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
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
  nofollow?: boolean;
  siteName?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageAlt?: string;
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
    nofollow = false,
    siteName = SITE_NAME,
    ogTitle = title,
    ogDescription = description,
    ogImageAlt = title,
  } = options;

  const url = getSiteUrl(path);
  const imageUrl = getAbsoluteImageUrl(image);
  const shareImage = imageUrl.startsWith("http://") || imageUrl.startsWith("https://")
    ? [{ url: imageUrl, width: imageWidth, height: imageHeight, alt: ogImageAlt }]
    : undefined;

  return {
    title,
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(url ? { url } : {}),
      siteName,
      locale: SITE_LOCALE,
      type,
      ...(shareImage ? { images: shareImage } : {}),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(shareImage ? { images: shareImage.map((item) => item.url) } : {}),
    },
    ...((noindex || nofollow) && {
      robots: {
        index: !noindex,
        follow: !nofollow,
        googleBot: {
          index: !noindex,
          follow: !nofollow,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    }),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const url = getSiteUrl();
  const ogImageUrl = settings.defaultOgMedia?.secureUrl || (SITE_URL ? DEFAULT_OG_IMAGE : "");
  const ogWidth = settings.defaultOgMedia?.width || DEFAULT_OG_IMAGE_WIDTH;
  const ogHeight = settings.defaultOgMedia?.height || DEFAULT_OG_IMAGE_HEIGHT;
  const defaultTitle = settings.defaultMetaTitle || `${settings.siteName} — Places, Stories, Food & Journeys from Chittagong`;
  const defaultDesc = settings.defaultMetaDescription || settings.siteTagline || SITE_DESCRIPTION;
  const defaultOgTitle = settings.defaultOgTitle || defaultTitle;
  const defaultOgDescription = settings.defaultOgDescription || defaultDesc;
  const publisher = settings.publisherName || settings.siteName;

  return {
    ...(url ? { metadataBase: new URL(url) } : {}),
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
    authors: [{ name: publisher }],
    creator: settings.siteName,
    publisher,
    openGraph: {
      type: "website",
      locale: SITE_LOCALE,
      ...(url ? { url } : {}),
      siteName: settings.siteName,
      title: defaultOgTitle,
      description: defaultOgDescription,
      ...(ogImageUrl ? { images: [
        {
          url: ogImageUrl,
          width: ogWidth,
          height: ogHeight,
          alt: settings.defaultOgMedia?.altText || `${settings.siteName} — Exploring Chittagong`,
        },
      ] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: defaultOgTitle,
      description: defaultOgDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
    icons: {
      icon: "/images/chittagongtrail-favicon.png",
    },
    robots: {
      index: settings.allowIndexing,
      follow: settings.allowIndexing,
      googleBot: {
        index: settings.allowIndexing,
        follow: settings.allowIndexing,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(settings.googleSiteVerification || settings.bingSiteVerification
      ? {
          verification: {
            ...(settings.googleSiteVerification ? { google: settings.googleSiteVerification } : {}),
            ...(settings.bingSiteVerification ? { other: { "msvalidate.01": settings.bingSiteVerification } } : {}),
          },
        }
      : {}),
  };
}

export async function buildPublicPageMetadata(pageKey: PublicPageKey): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPublicPageSeo(pageKey),
    getPublicSiteSettings(),
  ]);
  const title = page.metaTitle || settings.defaultMetaTitle || page.visibleTitle;
  const description = page.metaDescription || settings.defaultMetaDescription || page.visibleDescription;
  const ogImage = page.ogMedia || settings.defaultOgMedia;

  return buildMetadata({
    title,
    description,
    path: page.routePath,
    image: ogImage?.secureUrl || null,
    imageWidth: ogImage?.width || DEFAULT_OG_IMAGE_WIDTH,
    imageHeight: ogImage?.height || DEFAULT_OG_IMAGE_HEIGHT,
    siteName: settings.siteName,
    ogTitle: page.ogTitle || settings.defaultOgTitle || title,
    ogDescription: page.ogDescription || settings.defaultOgDescription || description,
    ogImageAlt: ogImage?.altText || title,
    noindex: !settings.allowIndexing || !page.robotsIndex,
    nofollow: !settings.allowIndexing || !page.robotsFollow,
  });
}

export async function buildDynamicContentMetadata(options: BaseMetadataOptions): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const ogImage = options.image || settings.defaultOgMedia?.secureUrl || null;
  return buildMetadata({
    ...options,
    image: ogImage,
    siteName: settings.siteName,
    ogTitle: options.ogTitle || options.title,
    ogDescription: options.ogDescription || options.description,
    noindex: options.noindex || !settings.allowIndexing,
    nofollow: options.nofollow || !settings.allowIndexing,
  });
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

export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE };
