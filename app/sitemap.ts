import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chittagongtrail.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/trails`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/journal`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/food`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const trails = await prisma.trailLocation.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const trailPages: MetadataRoute.Sitemap = trails.map((trail) => ({
      url: `${SITE_URL}/trails/${trail.slug}`,
      lastModified: trail.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    dynamicPages = [...dynamicPages, ...trailPages];
  } catch (error) {
    console.error("[sitemap] Failed to fetch trails:", error);
  }

  try {
    const journalPosts = await prisma.journalPost.findMany({
      where: { category: { not: "food" } },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { publishedDate: "desc" },
    });

    const journalPages: MetadataRoute.Sitemap = journalPosts.map((post) => ({
      url: `${SITE_URL}/journal/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    dynamicPages = [...dynamicPages, ...journalPages];
  } catch (error) {
    console.error("[sitemap] Failed to fetch journal posts:", error);
  }

  try {
    const foodPosts = await prisma.journalPost.findMany({
      where: { category: "food" },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { publishedDate: "desc" },
    });

    const foodPages: MetadataRoute.Sitemap = foodPosts.map((post) => ({
      url: `${SITE_URL}/food/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    dynamicPages = [...dynamicPages, ...foodPages];
  } catch (error) {
    console.error("[sitemap] Failed to fetch food posts:", error);
  }

  return [...staticPages, ...dynamicPages];
}
