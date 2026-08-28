import { prisma } from "@/lib/prisma";

export async function getTrails() {
  try {
    const trails = await prisma.trailLocation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { journalPosts: true },
        },
      },
    });
    return trails;
  } catch (error) {
    console.error("Failed to fetch trails:", error);
    return [];
  }
}

export async function getTrailBySlug(slug: string) {
  try {
    const trail = await prisma.trailLocation.findUnique({
      where: { slug },
      include: {
        journalPosts: {
          orderBy: { publishedDate: "desc" },
          take: 5,
        },
      },
    });
    return trail;
  } catch (error) {
    console.error("Failed to fetch trail:", error);
    return null;
  }
}

export async function getJournalPosts() {
  try {
    const posts = await prisma.journalPost.findMany({
      orderBy: { publishedDate: "desc" },
      include: {
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch journal posts:", error);
    return [];
  }
}

export async function getJournalPostBySlug(slug: string) {
  try {
    const post = await prisma.journalPost.findUnique({
      where: { slug },
      include: {
        trail: true,
      },
    });
    return post;
  } catch (error) {
    console.error("Failed to fetch journal post:", error);
    return null;
  }
}

export async function getFoodPosts() {
  try {
    const posts = await prisma.journalPost.findMany({
      where: { category: "food" },
      orderBy: { publishedDate: "desc" },
      include: {
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch food posts:", error);
    return [];
  }
}

export async function getFoodPostBySlug(slug: string) {
  try {
    const post = await prisma.journalPost.findFirst({
      where: {
        slug,
        category: "food",
      },
      include: {
        trail: true,
      },
    });
    return post;
  } catch (error) {
    console.error("Failed to fetch food post:", error);
    return null;
  }
}

export async function getTrailsWithCoordinates() {
  try {
    const trails = await prisma.trailLocation.findMany({
      where: {
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
    console.error("Failed to fetch trails with coordinates:", error);
    return [];
  }
}

export async function getLatestJournalPosts(limit: number = 3) {
  try {
    const posts = await prisma.journalPost.findMany({
      orderBy: { publishedDate: "desc" },
      take: limit,
      include: {
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch latest journal posts:", error);
    return [];
  }
}

export async function getLatestFoodPosts(limit: number = 3) {
  try {
    const posts = await prisma.journalPost.findMany({
      where: { category: "food" },
      orderBy: { publishedDate: "desc" },
      take: limit,
      include: {
        trail: {
          select: { name: true, slug: true },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error("Failed to fetch latest food posts:", error);
    return [];
  }
}
