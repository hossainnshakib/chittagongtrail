import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType } from "@prisma/client";
import { getConfiguredSiteOrigin } from "@/lib/site-url";
import { PUBLIC_PAGE_DEFINITIONS } from "@/lib/public-content";

const LOG_PREFIX = "[sitemap]";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isValidSlug(slug: string): boolean {
  return typeof slug === "string" && slug.length > 0 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

async function deriveOriginFromHeaders(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-host");
    const host = forwarded || h.get("host");
    if (!host) return "";
    const hostname = host.split(":")[0];
    if (LOCAL_HOSTS.has(hostname)) return "";
    return `https://${hostname}`;
  } catch {
    return "";
  }
}

async function resolveSiteOrigin(): Promise<string> {
  const configured = getConfiguredSiteOrigin();
  if (configured) return configured;
  const fromHeaders = deriveOriginFromHeaders();
  if (fromHeaders) return fromHeaders;
  return "";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteOrigin = await resolveSiteOrigin();

  if (!siteOrigin) {
    try {
      const siteSettings = await prisma.siteSettings.findUnique({
        where: { id: 1 },
        select: { allowIndexing: true },
      });
      if (siteSettings && !siteSettings.allowIndexing) {
        console.warn(`${LOG_PREFIX} Site URL not configured and indexing disabled; returning empty sitemap`);
        return [];
      }
    } catch {
      // DB unavailable, cannot derive fallback
    }
    console.error(
      `${LOG_PREFIX} NEXT_PUBLIC_SITE_URL or SITE_URL must be configured with a production HTTPS origin. ` +
      `The sitemap cannot emit URLs without a site origin.`
    );
    return [];
  }

  let settings: { allowIndexing: boolean; updatedAt: Date } | null = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      select: { allowIndexing: true, updatedAt: true },
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to read site settings:`, error);
  }

  if (settings?.allowIndexing === false) {
    console.warn(`${LOG_PREFIX} Site indexing is disabled in SiteSettings; returning empty sitemap`);
    return [];
  }

  let pageSettings: Array<{
    pageKey: string;
    updatedAt: Date;
    robotsIndex: boolean;
    robotsFollow: boolean;
    includeInSitemap: boolean;
  }> = [];
  try {
    pageSettings = await prisma.pageSeoSetting.findMany({
      select: { pageKey: true, updatedAt: true, robotsIndex: true, robotsFollow: true, includeInSitemap: true },
    });
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to read page SEO settings:`, error);
  }
  const pageSettingsByKey = new Map(pageSettings.map((page) => [page.pageKey, page]));

  const staticPages: MetadataRoute.Sitemap = PUBLIC_PAGE_DEFINITIONS.flatMap((page) => {
    const setting = pageSettingsByKey.get(page.pageKey);
    if (setting && (!setting.robotsIndex || !setting.robotsFollow || !setting.includeInSitemap)) return [];
    return [{
      url: `${siteOrigin}${page.routePath}`,
      lastModified: setting?.updatedAt || settings?.updatedAt || new Date(),
      changeFrequency: page.pageKey === "about" ? "monthly" as const : "weekly" as const,
      priority: page.pageKey === "home" ? 1 : page.pageKey === "about" ? 0.6 : 0.9,
    }];
  });

  let trails: Array<{ slug: string; updatedAt: Date }> = [];
  let stories: Array<{ slug: string; updatedAt: Date }> = [];
  let foodPosts: Array<{ slug: string; updatedAt: Date }> = [];

  try {
    [trails, stories, foodPosts] = await Promise.all([
      prisma.trailLocation.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.journalPost.findMany({
        where: { status: ContentStatus.PUBLISHED, type: JournalType.STORY },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.journalPost.findMany({
        where: { status: ContentStatus.PUBLISHED, type: JournalType.FOOD },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);
  } catch (error) {
    console.error(`${LOG_PREFIX} Failed to query published content:`, error);
  }

  const trailPages = trails
    .filter((trail) => isValidSlug(trail.slug))
    .map((trail) => ({
      url: `${siteOrigin}/trails/${trail.slug}`,
      lastModified: trail.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  const storyPages = stories
    .filter((story) => isValidSlug(story.slug))
    .map((story) => ({
      url: `${siteOrigin}/journal/${story.slug}`,
      lastModified: story.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  const foodPages = foodPosts
    .filter((post) => isValidSlug(post.slug))
    .map((post) => ({
      url: `${siteOrigin}/food/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...trailPages, ...storyPages, ...foodPages];
}
