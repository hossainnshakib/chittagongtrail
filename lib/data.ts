import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType } from "@prisma/client";

const LOG_PREFIX = "[chittagongtrail:data]";

function logQueryError(operation: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} ${operation} failed: ${message}`);
}

export async function getTrails() {
  try {
    const trails = await prisma.trailLocation.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }],
      include: {
        coverMedia: true,
        _count: {
          select: { journalPosts: true },
        },
      },
    });
    return trails;
  } catch (error) {
    logQueryError("getTrails", error);
    return [];
  }
}

export async function getTrailBySlug(slug: string) {
  try {
    const trail = await prisma.trailLocation.findUnique({
      where: { slug },
      include: {
        coverMedia: true,
        ogMedia: true,
        gallery: {
          include: { mediaAsset: true },
          orderBy: { sortOrder: "asc" },
        },
        journalPosts: {
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { publishedAt: "desc" },
          include: { coverMedia: true },
          take: 5,
        },
      },
    });
    if (!trail || trail.status !== ContentStatus.PUBLISHED) {
      return null;
    }
    return trail;
  } catch (error) {
    logQueryError(`getTrailBySlug(${slug})`, error);
    return null;
  }
}

export async function getJournalPosts() {
  try {
    const posts = await prisma.journalPost.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }],
      include: {
        coverMedia: true,
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    logQueryError("getJournalPosts", error);
    return [];
  }
}

export async function getJournalPostBySlug(slug: string) {
  try {
    const post = await prisma.journalPost.findUnique({
      where: { slug },
      include: {
        coverMedia: true,
        ogMedia: true,
        trail: true,
      },
    });
    if (!post || post.status !== ContentStatus.PUBLISHED) {
      return null;
    }
    return post;
  } catch (error) {
    logQueryError(`getJournalPostBySlug(${slug})`, error);
    return null;
  }
}

export async function getFoodPosts() {
  try {
    const posts = await prisma.journalPost.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        type: JournalType.FOOD,
      },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }],
      include: {
        coverMedia: true,
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    logQueryError("getFoodPosts", error);
    return [];
  }
}

export async function getFoodPostBySlug(slug: string) {
  try {
    const post = await prisma.journalPost.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
        type: JournalType.FOOD,
      },
      include: {
        coverMedia: true,
        ogMedia: true,
        trail: true,
      },
    });
    return post;
  } catch (error) {
    logQueryError(`getFoodPostBySlug(${slug})`, error);
    return null;
  }
}

export async function getTrailsWithCoordinates() {
  try {
    const trails = await prisma.trailLocation.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        latitude: true,
        longitude: true,
      },
    });
    return trails;
  } catch (error) {
    logQueryError("getTrailsWithCoordinates", error);
    return [];
  }
}

export async function getLatestJournalPosts(limit: number = 3) {
  try {
    const posts = await prisma.journalPost.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        type: JournalType.STORY,
      },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: limit,
      include: {
        coverMedia: true,
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    logQueryError("getLatestJournalPosts", error);
    return [];
  }
}

export async function getLatestFoodPosts(limit: number = 3) {
  try {
    const posts = await prisma.journalPost.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        type: JournalType.FOOD,
      },
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }],
      take: limit,
      include: {
        coverMedia: true,
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    logQueryError("getLatestFoodPosts", error);
    return [];
  }
}
