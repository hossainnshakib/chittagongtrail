import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType } from "@prisma/client";

const LOG_PREFIX = "[chittagongtrail:dashboard-service]";

function logServiceError(operation: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} ${operation} failed: ${message}`);
}

export interface DashboardCounts {
  trails: { total: number; draft: number; published: number; archived: number; featured: number };
  stories: { total: number; draft: number; published: number; archived: number; featured: number };
  food: { total: number; draft: number; published: number; archived: number; featured: number };
  media: { total: number; images: number; videos: number };
}

export interface NeedsAttentionItem {
  type: "trail" | "story" | "food";
  id: number;
  title: string;
  slug: string;
  issues: string[];
}

export interface HomepageReadiness {
  featuredTrailsCount: number;
  featuredTrailsMax: number;
  featuredStoriesCount: number;
  featuredStoriesMax: number;
  featuredFoodCount: number;
  featuredFoodMax: number;
  galleryCount: number;
  galleryTargetMin: number;
  galleryTargetMax: number;
  heroPosterConfigured: boolean;
  heroVideoEnabled: boolean;
}

export interface RecentContentItem {
  id: number;
  title: string;
  slug: string;
  type: "trail" | "story" | "food";
  status: ContentStatus;
  updatedAt: Date;
  publishedAt: Date | null;
  coverUrl: string | null;
  isFeatured: boolean;
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [
      trailTotal, trailDraft, trailPublished, trailArchived, trailFeatured,
      storyTotal, storyDraft, storyPublished, storyArchived, storyFeatured,
      foodTotal, foodDraft, foodPublished, foodArchived, foodFeatured,
      mediaTotal, mediaImages, mediaVideos,
    ] = await Promise.all([
      prisma.trailLocation.count(),
      prisma.trailLocation.count({ where: { status: ContentStatus.DRAFT } }),
      prisma.trailLocation.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.trailLocation.count({ where: { status: ContentStatus.ARCHIVED } }),
      prisma.trailLocation.count({ where: { isFeatured: true } }),
      prisma.journalPost.count({ where: { type: JournalType.STORY } }),
      prisma.journalPost.count({ where: { type: JournalType.STORY, status: ContentStatus.DRAFT } }),
      prisma.journalPost.count({ where: { type: JournalType.STORY, status: ContentStatus.PUBLISHED } }),
      prisma.journalPost.count({ where: { type: JournalType.STORY, status: ContentStatus.ARCHIVED } }),
      prisma.journalPost.count({ where: { type: JournalType.STORY, isFeatured: true } }),
      prisma.journalPost.count({ where: { type: JournalType.FOOD } }),
      prisma.journalPost.count({ where: { type: JournalType.FOOD, status: ContentStatus.DRAFT } }),
      prisma.journalPost.count({ where: { type: JournalType.FOOD, status: ContentStatus.PUBLISHED } }),
      prisma.journalPost.count({ where: { type: JournalType.FOOD, status: ContentStatus.ARCHIVED } }),
      prisma.journalPost.count({ where: { type: JournalType.FOOD, isFeatured: true } }),
      prisma.mediaAsset.count(),
      prisma.mediaAsset.count({ where: { resourceType: "image" } }),
      prisma.mediaAsset.count({ where: { resourceType: "video" } }),
    ]);

    return {
      trails: { total: trailTotal, draft: trailDraft, published: trailPublished, archived: trailArchived, featured: trailFeatured },
      stories: { total: storyTotal, draft: storyDraft, published: storyPublished, archived: storyArchived, featured: storyFeatured },
      food: { total: foodTotal, draft: foodDraft, published: foodPublished, archived: foodArchived, featured: foodFeatured },
      media: { total: mediaTotal, images: mediaImages, videos: mediaVideos },
    };
  } catch (error) {
    logServiceError("getDashboardCounts", error);
    return {
      trails: { total: 0, draft: 0, published: 0, archived: 0, featured: 0 },
      stories: { total: 0, draft: 0, published: 0, archived: 0, featured: 0 },
      food: { total: 0, draft: 0, published: 0, archived: 0, featured: 0 },
      media: { total: 0, images: 0, videos: 0 },
    };
  }
}

export async function getNeedsAttention(): Promise<NeedsAttentionItem[]> {
  try {
    const items: NeedsAttentionItem[] = [];

    const draftTrails = await prisma.trailLocation.findMany({
      where: { status: ContentStatus.DRAFT },
      select: { id: true, name: true, slug: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    for (const t of draftTrails) {
      items.push({ type: "trail", id: t.id, title: t.name, slug: t.slug, issues: ["Draft"] });
    }

    const draftStories = await prisma.journalPost.findMany({
      where: { type: JournalType.STORY, status: ContentStatus.DRAFT },
      select: { id: true, title: true, slug: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    for (const s of draftStories) {
      items.push({ type: "story", id: s.id, title: s.title, slug: s.slug, issues: ["Draft"] });
    }

    const draftFood = await prisma.journalPost.findMany({
      where: { type: JournalType.FOOD, status: ContentStatus.DRAFT },
      select: { id: true, title: true, slug: true },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    for (const f of draftFood) {
      items.push({ type: "food", id: f.id, title: f.title, slug: f.slug, issues: ["Draft"] });
    }

    const publishedTrailsMissingMedia = await prisma.trailLocation.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        coverMediaId: null,
      },
      select: { id: true, name: true, slug: true },
      take: 5,
    });
    for (const t of publishedTrailsMissingMedia) {
      const existing = items.find((i) => i.type === "trail" && i.id === t.id);
      if (existing) {
        existing.issues.push("Missing cover");
      } else {
        items.push({ type: "trail", id: t.id, title: t.name, slug: t.slug, issues: ["Missing cover"] });
      }
    }

    const publishedTrailsMissingMeta = await prisma.trailLocation.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { metaTitle: null },
          { metaTitle: "" },
          { metaDescription: null },
          { metaDescription: "" },
        ],
      },
      select: { id: true, name: true, slug: true, metaTitle: true, metaDescription: true },
      take: 5,
    });
    for (const t of publishedTrailsMissingMeta) {
      const existing = items.find((i) => i.type === "trail" && i.id === t.id);
      const missing: string[] = [];
      if (!t.metaTitle) missing.push("Missing meta title");
      if (!t.metaDescription) missing.push("Missing meta description");
      if (existing) {
        existing.issues.push(...missing);
      } else {
        items.push({ type: "trail", id: t.id, title: t.name, slug: t.slug, issues: missing });
      }
    }

    const publishedTrailsMissingExcerpt = await prisma.trailLocation.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { excerpt: null },
          { excerpt: "" },
        ],
      },
      select: { id: true, name: true, slug: true },
      take: 5,
    });
    for (const t of publishedTrailsMissingExcerpt) {
      const existing = items.find((i) => i.type === "trail" && i.id === t.id);
      if (existing) {
        if (!existing.issues.includes("Missing excerpt")) existing.issues.push("Missing excerpt");
      } else {
        items.push({ type: "trail", id: t.id, title: t.name, slug: t.slug, issues: ["Missing excerpt"] });
      }
    }

    const featuredTrailsMissingOrder = await prisma.trailLocation.findMany({
      where: { isFeatured: true, featuredOrder: null },
      select: { id: true, name: true, slug: true },
      take: 5,
    });
    for (const t of featuredTrailsMissingOrder) {
      const existing = items.find((i) => i.type === "trail" && i.id === t.id);
      if (existing) {
        if (!existing.issues.includes("Featured but no order")) existing.issues.push("Featured but no order");
      } else {
        items.push({ type: "trail", id: t.id, title: t.name, slug: t.slug, issues: ["Featured but no order"] });
      }
    }

    const trailsMissingCoords = await prisma.trailLocation.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [
          { latitude: null },
          { longitude: null },
        ],
      },
      select: { id: true, name: true, slug: true },
      take: 5,
    });
    for (const t of trailsMissingCoords) {
      const existing = items.find((i) => i.type === "trail" && i.id === t.id);
      if (existing) {
        if (!existing.issues.includes("Missing coordinates")) existing.issues.push("Missing coordinates");
      } else {
        items.push({ type: "trail", id: t.id, title: t.name, slug: t.slug, issues: ["Missing coordinates"] });
      }
    }

    return items.slice(0, 15);
  } catch (error) {
    logServiceError("getNeedsAttention", error);
    return [];
  }
}

export async function getHomepageReadiness(): Promise<HomepageReadiness> {
  try {
    const [featuredTrailsCount, featuredStoriesCount, featuredFoodCount, galleryCount, settings] =
      await Promise.all([
        prisma.trailLocation.count({ where: { isFeatured: true, status: ContentStatus.PUBLISHED } }),
        prisma.journalPost.count({ where: { isFeatured: true, type: JournalType.STORY, status: ContentStatus.PUBLISHED } }),
        prisma.journalPost.count({ where: { isFeatured: true, type: JournalType.FOOD, status: ContentStatus.PUBLISHED } }),
        prisma.homepageGallery.count(),
        prisma.siteSettings.findUnique({ where: { id: 1 }, select: { heroMediaId: true, heroVideoEnabled: true } }),
      ]);

    return {
      featuredTrailsCount,
      featuredTrailsMax: 4,
      featuredStoriesCount,
      featuredStoriesMax: 3,
      featuredFoodCount,
      featuredFoodMax: 3,
      galleryCount,
      galleryTargetMin: 6,
      galleryTargetMax: 8,
      heroPosterConfigured: !!settings?.heroMediaId,
      heroVideoEnabled: settings?.heroVideoEnabled ?? false,
    };
  } catch (error) {
    logServiceError("getHomepageReadiness", error);
    return {
      featuredTrailsCount: 0, featuredTrailsMax: 4,
      featuredStoriesCount: 0, featuredStoriesMax: 3,
      featuredFoodCount: 0, featuredFoodMax: 3,
      galleryCount: 0, galleryTargetMin: 6, galleryTargetMax: 8,
      heroPosterConfigured: false, heroVideoEnabled: false,
    };
  }
}

export async function getRecentContent(): Promise<RecentContentItem[]> {
  try {
    const [recentTrails, recentStories, recentFood] = await Promise.all([
      prisma.trailLocation.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true, name: true, slug: true, status: true,
          updatedAt: true, publishedAt: true, isFeatured: true,
          coverMedia: { select: { secureUrl: true } },
        },
      }),
      prisma.journalPost.findMany({
        where: { type: JournalType.STORY },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true, title: true, slug: true, status: true,
          updatedAt: true, publishedAt: true, isFeatured: true,
          coverMedia: { select: { secureUrl: true } },
        },
      }),
      prisma.journalPost.findMany({
        where: { type: JournalType.FOOD },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true, title: true, slug: true, status: true,
          updatedAt: true, publishedAt: true, isFeatured: true,
          coverMedia: { select: { secureUrl: true } },
        },
      }),
    ]);

    const items: RecentContentItem[] = [
      ...recentTrails.map((t) => ({
        id: t.id, title: t.name, slug: t.slug, type: "trail" as const,
        status: t.status, updatedAt: t.updatedAt, publishedAt: t.publishedAt,
        coverUrl: t.coverMedia?.secureUrl ?? null, isFeatured: t.isFeatured,
      })),
      ...recentStories.map((s) => ({
        id: s.id, title: s.title, slug: s.slug, type: "story" as const,
        status: s.status, updatedAt: s.updatedAt, publishedAt: s.publishedAt,
        coverUrl: s.coverMedia?.secureUrl ?? null, isFeatured: s.isFeatured,
      })),
      ...recentFood.map((f) => ({
        id: f.id, title: f.title, slug: f.slug, type: "food" as const,
        status: f.status, updatedAt: f.updatedAt, publishedAt: f.publishedAt,
        coverUrl: f.coverMedia?.secureUrl ?? null, isFeatured: f.isFeatured,
      })),
    ];

    items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return items.slice(0, 10);
  } catch (error) {
    logServiceError("getRecentContent", error);
    return [];
  }
}
