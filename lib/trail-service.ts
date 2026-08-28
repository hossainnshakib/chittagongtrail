import { prisma } from "@/lib/prisma";
import { ContentStatus, District, Prisma } from "@prisma/client";

const LOG_PREFIX = "[chittagongtrail:trail-service]";

function logServiceError(operation: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} ${operation} failed: ${message}`);
}

export interface AdminTrailListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  district?: District | "ALL";
  status?: ContentStatus | "ALL";
  isFeatured?: string | "ALL";
  sortBy?: "updatedAt" | "createdAt" | "publishedAt" | "name";
  sortOrder?: "asc" | "desc";
}

export async function listAdminTrails(params: AdminTrailListParams = {}) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));
  const skip = (page - 1) * pageSize;

  const where: Prisma.TrailLocationWhereInput = {};

  if (params.search && params.search.trim() !== "") {
    const term = params.search.trim();
    where.OR = [
      { name: { contains: term } },
      { slug: { contains: term } },
      { administrativeArea: { contains: term } },
      { localArea: { contains: term } },
    ];
  }

  if (params.district && params.district !== "ALL") {
    where.district = params.district as District;
  }

  if (params.status && params.status !== "ALL") {
    where.status = params.status as ContentStatus;
  }

  if (params.isFeatured === "true") {
    where.isFeatured = true;
  } else if (params.isFeatured === "false") {
    where.isFeatured = false;
  }

  const sortBy = params.sortBy || "updatedAt";
  const sortOrder = params.sortOrder || "desc";
  const orderBy: Prisma.TrailLocationOrderByWithRelationInput[] = [
    { [sortBy]: sortOrder },
    { id: "desc" }, // deterministic secondary ordering
  ];

  try {
    const [trails, total] = await Promise.all([
      prisma.trailLocation.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
        include: {
          coverMedia: true,
          _count: {
            select: { journalPosts: true, gallery: true },
          },
        },
      }),
      prisma.trailLocation.count({ where }),
    ]);

    return {
      trails,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    logServiceError("listAdminTrails", error);
    return { trails: [], total: 0, page: 1, pageSize, totalPages: 1 };
  }
}

export async function getAdminTrailById(id: number) {
  try {
    const trail = await prisma.trailLocation.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        ogMedia: true,
        gallery: {
          include: { mediaAsset: true },
          orderBy: { sortOrder: "asc" },
        },
        journalPosts: {
          select: { id: true, title: true, slug: true, status: true },
        },
        _count: {
          select: { journalPosts: true },
        },
      },
    });
    return trail;
  } catch (error) {
    logServiceError(`getAdminTrailById(${id})`, error);
    return null;
  }
}

export async function getPublicTrails() {
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
    logServiceError("getPublicTrails", error);
    return [];
  }
}

export async function getPublicTrailBySlug(slug: string) {
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
    logServiceError(`getPublicTrailBySlug(${slug})`, error);
    return null;
  }
}

export async function getTrailPreviewById(id: number) {
  try {
    const trail = await prisma.trailLocation.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        ogMedia: true,
        gallery: {
          include: { mediaAsset: true },
          orderBy: { sortOrder: "asc" },
        },
        journalPosts: {
          orderBy: { publishedAt: "desc" },
          include: { coverMedia: true },
          take: 5,
        },
      },
    });
    return trail;
  } catch (error) {
    logServiceError(`getTrailPreviewById(${id})`, error);
    return null;
  }
}

export async function countTrailRelations(id: number) {
  try {
    const trail = await prisma.trailLocation.findUnique({
      where: { id },
      select: {
        _count: {
          select: { journalPosts: true, gallery: true },
        },
      },
    });
    return trail?._count || { journalPosts: 0, gallery: 0 };
  } catch (error) {
    logServiceError(`countTrailRelations(${id})`, error);
    return { journalPosts: 0, gallery: 0 };
  }
}

export async function manageTrailGallery(
  trailId: number,
  action: "add" | "remove" | "reorder",
  mediaAssetId?: number,
  newSortOrder?: number,
  items?: { mediaAssetId: number; sortOrder: number }[]
) {
  try {
    if (action === "add" && mediaAssetId) {
      // Check if already in gallery
      const existing = await prisma.trailGallery.findUnique({
        where: { trailId_mediaAssetId: { trailId, mediaAssetId } },
      });
      if (!existing) {
        // get max sortOrder
        const maxItem = await prisma.trailGallery.findFirst({
          where: { trailId },
          orderBy: { sortOrder: "desc" },
        });
        const sortOrder = (maxItem?.sortOrder ?? -1) + 1;
        await prisma.trailGallery.create({
          data: { trailId, mediaAssetId, sortOrder },
        });
      }
    } else if (action === "remove" && mediaAssetId) {
      await prisma.trailGallery.delete({
        where: { trailId_mediaAssetId: { trailId, mediaAssetId } },
      });
    } else if (action === "reorder" && items) {
      await prisma.$transaction(
        items.map((item) =>
          prisma.trailGallery.update({
            where: {
              trailId_mediaAssetId: {
                trailId,
                mediaAssetId: item.mediaAssetId,
              },
            },
            data: { sortOrder: item.sortOrder },
          })
        )
      );
    }
    return { success: true };
  } catch (error) {
    logServiceError("manageTrailGallery", error);
    return { success: false, error: "Failed to manage gallery" };
  }
}
