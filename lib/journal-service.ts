import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType, Prisma } from "@prisma/client";

const LOG_PREFIX = "[chittagongtrail:journal-service]";

function logServiceError(operation: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} ${operation} failed: ${message}`);
}

export interface AdminJournalListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: JournalType | "ALL";
  status?: ContentStatus | "ALL";
  isFeatured?: string | "ALL";
  trailId?: number | "ALL";
  sortBy?: "updatedAt" | "createdAt" | "publishedAt" | "title" | "featuredOrder";
  sortOrder?: "asc" | "desc";
}

export async function listAdminJournalPosts(params: AdminJournalListParams = {}) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));
  const skip = (page - 1) * pageSize;

  const where: Prisma.JournalPostWhereInput = {};

  if (params.search && params.search.trim() !== "") {
    const term = params.search.trim();
    where.OR = [
      { title: { contains: term } },
      { slug: { contains: term } },
      { excerpt: { contains: term } },
    ];
  }

  if (params.type && params.type !== "ALL") {
    where.type = params.type as JournalType;
  }

  if (params.status && params.status !== "ALL") {
    where.status = params.status as ContentStatus;
  }

  if (params.isFeatured === "true") {
    where.isFeatured = true;
  } else if (params.isFeatured === "false") {
    where.isFeatured = false;
  }

  if (params.trailId && params.trailId !== "ALL") {
    where.trailId = Number(params.trailId);
  }

  const sortBy = params.sortBy || "updatedAt";
  const sortOrder = params.sortOrder || "desc";
  const orderBy: Prisma.JournalPostOrderByWithRelationInput[] = [
    { [sortBy]: sortOrder },
    { id: "desc" },
  ];

  try {
    const [posts, total] = await Promise.all([
      prisma.journalPost.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          coverMedia: true,
          ogMedia: true,
          trail: { select: { id: true, name: true, slug: true, status: true } },
        },
      }),
      prisma.journalPost.count({ where }),
    ]);

    return {
      posts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    logServiceError("listAdminJournalPosts", error);
    return { posts: [], total: 0, page: 1, pageSize, totalPages: 1 };
  }
}

export async function getAdminJournalPostById(id: number) {
  try {
    const post = await prisma.journalPost.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        ogMedia: true,
        trail: true,
      },
    });
    return post;
  } catch (error) {
    logServiceError(`getAdminJournalPostById(${id})`, error);
    return null;
  }
}

export async function getPublicJournalPosts(type?: JournalType) {
  try {
    const where: Prisma.JournalPostWhereInput = {
      status: ContentStatus.PUBLISHED,
    };
    if (type) {
      where.type = type;
    }
    const posts = await prisma.journalPost.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { publishedAt: "desc" }, { id: "desc" }],
      include: {
        coverMedia: true,
        trail: {
          select: { id: true, name: true, slug: true, status: true },
        },
      },
    });
    return posts;
  } catch (error) {
    logServiceError("getPublicJournalPosts", error);
    return [];
  }
}

export async function getPublicStoryBySlug(slug: string) {
  try {
    const post = await prisma.journalPost.findUnique({
      where: { slug },
      include: {
        coverMedia: true,
        ogMedia: true,
        trail: true,
      },
    });
    if (!post || post.status !== ContentStatus.PUBLISHED || post.type !== JournalType.STORY) {
      return null;
    }
    return post;
  } catch (error) {
    logServiceError(`getPublicStoryBySlug(${slug})`, error);
    return null;
  }
}

export async function getPublicFoodBySlug(slug: string) {
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
    logServiceError(`getPublicFoodBySlug(${slug})`, error);
    return null;
  }
}

export async function getJournalPreviewById(id: number) {
  try {
    const post = await prisma.journalPost.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        ogMedia: true,
        trail: true,
      },
    });
    return post;
  } catch (error) {
    logServiceError(`getJournalPreviewById(${id})`, error);
    return null;
  }
}

export async function getRelatedJournalPosts(postId: number, type: JournalType, trailId?: number | null, limit: number = 3) {
  try {
    const where: Prisma.JournalPostWhereInput = {
      status: ContentStatus.PUBLISHED,
      id: { not: postId },
      type,
    };

    // Prefer same trail if available
    let posts: Awaited<ReturnType<typeof prisma.journalPost.findMany>> = [];
    if (trailId) {
      posts = await prisma.journalPost.findMany({
        where: { ...where, trailId },
        orderBy: { publishedAt: "desc" },
        take: limit,
        include: { coverMedia: true, trail: true },
      });
    }

    if (posts.length < limit) {
      const existingIds = [postId, ...posts.map((p) => p.id)];
      const needed = limit - posts.length;
      const additional = await prisma.journalPost.findMany({
        where: { ...where, id: { notIn: existingIds } },
        orderBy: { publishedAt: "desc" },
        take: needed,
        include: { coverMedia: true, trail: true },
      });
      posts = [...posts, ...additional];
    }

    return posts;
  } catch (error) {
    logServiceError("getRelatedJournalPosts", error);
    return [];
  }
}

export async function countJournalPostsByTypeAndStatus() {
  try {
    const [total, stories, food, published, drafts, archived] = await Promise.all([
      prisma.journalPost.count(),
      prisma.journalPost.count({ where: { type: JournalType.STORY } }),
      prisma.journalPost.count({ where: { type: JournalType.FOOD } }),
      prisma.journalPost.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.journalPost.count({ where: { status: ContentStatus.DRAFT } }),
      prisma.journalPost.count({ where: { status: ContentStatus.ARCHIVED } }),
    ]);
    return { total, stories, food, published, drafts, archived };
  } catch (error) {
    logServiceError("countJournalPostsByTypeAndStatus", error);
    return { total: 0, stories: 0, food: 0, published: 0, drafts: 0, archived: 0 };
  }
}
