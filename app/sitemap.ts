import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType } from "@prisma/client";
import { getConfiguredSiteOrigin } from "@/lib/site-url";
import { PUBLIC_PAGE_DEFINITIONS } from "@/lib/public-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteOrigin = getConfiguredSiteOrigin();
  if (!siteOrigin) return [];

  const settings = await prisma.siteSettings.findUnique({
    where: { id: 1 },
    select: { allowIndexing: true, updatedAt: true },
  });
  if (settings?.allowIndexing === false) return [];

  const pageSettings = await prisma.pageSeoSetting.findMany({
    select: { pageKey: true, updatedAt: true, robotsIndex: true, robotsFollow: true, includeInSitemap: true },
  });
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

  const [trails, stories, foodPosts] = await Promise.all([
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

  const trailPages = trails.map((trail) => ({
    url: `${siteOrigin}/trails/${trail.slug}`,
    lastModified: trail.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const storyPages = stories.map((story) => ({
    url: `${siteOrigin}/journal/${story.slug}`,
    lastModified: story.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const foodPages = foodPosts.map((post) => ({
    url: `${siteOrigin}/food/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...trailPages, ...storyPages, ...foodPages];
}
