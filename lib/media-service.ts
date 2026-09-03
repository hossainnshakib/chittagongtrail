import "server-only";
import { prisma } from "./prisma";
import { getCloudinaryClient, ALLOWED_UPLOAD_FOLDERS } from "./cloudinary";

export interface MediaAssetListOptions {
  page?: number;
  limit?: number;
  search?: string;
  format?: string;
  folder?: string;
  resourceType?: "image" | "video";
  sortBy?: "createdAt" | "publicId" | "format";
  sortOrder?: "asc" | "desc";
}

export interface MediaAssetReferenceSummary {
  trailCovers: Array<{ id: number; name: string; slug: string }>;
  trailOgMedias: Array<{ id: number; name: string; slug: string }>;
  trailGalleries: Array<{ trailId: number; trailName: string; trailSlug: string }>;
  journalCovers: Array<{ id: number; title: string; slug: string }>;
  journalOgMedias: Array<{ id: number; title: string; slug: string }>;
  homepageGalleries: Array<{ id: number; sortOrder: number }>;
  siteHeroMedias: Array<{ id: number; siteName: string }>;
  siteSeasonalMedias: Array<{ id: number; siteName: string }>;
  siteHeroVideos: Array<{ id: number; siteName: string }>;
  inlineHtmlReferences: Array<{ type: string; id: number; title: string; slug?: string }>;
}

export async function countMediaAssets(): Promise<number> {
  return prisma.mediaAsset.count();
}

export async function listAdminMediaAssets(options: MediaAssetListOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 24));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (options.search) {
    where.publicId = {
      contains: options.search,
    };
  }

  if (options.format) {
    where.format = options.format;
  }

  if (options.resourceType) {
    where.resourceType = options.resourceType;
  }

  if (options.folder) {
    where.publicId = {
      ...(where.publicId as object),
      startsWith: options.folder,
    };
  }

  const orderBy: Record<string, string> = {};
  const sortField = options.sortBy || "createdAt";
  const sortDir = options.sortOrder || "desc";
  orderBy[sortField] = sortDir;
  if (sortField !== "createdAt") {
    orderBy.createdAt = "desc";
  }

  const [total, items] = await Promise.all([
    prisma.mediaAsset.count({ where }),
    prisma.mediaAsset.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            trailCovers: true,
            trailOgMedias: true,
            trailGalleries: true,
            journalCovers: true,
            journalOgMedias: true,
            homepageGalleries: true,
            siteHeroMedias: true,
            siteSeasonalMedias: true,
          },
        },
      },
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAdminMediaAssetById(id: number) {
  return prisma.mediaAsset.findUnique({
    where: { id },
    include: {
      trailCovers: { select: { id: true, name: true, slug: true } },
      trailOgMedias: { select: { id: true, name: true, slug: true } },
      trailGalleries: {
        include: {
          trail: { select: { id: true, name: true, slug: true } },
        },
      },
      journalCovers: { select: { id: true, title: true, slug: true } },
      journalOgMedias: { select: { id: true, title: true, slug: true } },
      homepageGalleries: true,
      siteHeroMedias: { select: { id: true, siteName: true } },
      siteSeasonalMedias: { select: { id: true, siteName: true } },
    },
  });
}

export async function registerUploadedAsset(data: {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  altText?: string;
}) {
  if (!data.publicId || !data.secureUrl) {
    throw new Error("publicId and secureUrl are required");
  }

  try {
    const urlObj = new URL(data.secureUrl);
    if (urlObj.protocol !== "https:" || urlObj.hostname !== "res.cloudinary.com") {
      throw new Error("Invalid Cloudinary secure URL");
    }
  } catch {
    throw new Error("Invalid secureUrl format");
  }

  const existing = await prisma.mediaAsset.findUnique({
    where: { publicId: data.publicId },
  });

  if (existing) {
    return existing;
  }

  return prisma.mediaAsset.create({
    data: {
      publicId: data.publicId,
      secureUrl: data.secureUrl,
      width: data.width || null,
      height: data.height || null,
      format: data.format || null,
      resourceType: data.resourceType || "image",
      altText: data.altText ? data.altText.trim() : null,
    },
  });
}

const ALLOWED_NAMESPACES = [
  "chittagong-trail/trails",
  "chittagong-trail/journal",
  "chittagong-trail/food",
  "chittagong-trail/homepage",
  "chittagong-trail/general",
  "chittagong-trail/video",
] as const;

const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "gif"];
const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"];

export async function registerDirectUpload(data: {
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format?: string;
  width?: number;
  height?: number;
  altText?: string;
}) {
  if (!data.publicId || !data.secureUrl) {
    throw new Error("publicId and secureUrl are required");
  }

  const urlObj = new URL(data.secureUrl);
  if (urlObj.protocol !== "https:" || urlObj.hostname !== "res.cloudinary.com") {
    throw new Error("Invalid Cloudinary secure URL");
  }

  const hasValidNamespace = ALLOWED_NAMESPACES.some((ns) => data.publicId.startsWith(ns));
  if (!hasValidNamespace) {
    throw new Error("publicId does not belong to approved namespace");
  }

  const rt = data.resourceType;
  if (rt !== "image" && rt !== "video") {
    throw new Error("resourceType must be image or video");
  }

  if (rt === "image" && data.format && !ALLOWED_IMAGE_FORMATS.includes(data.format)) {
    throw new Error("Unsupported image format");
  }
  if (rt === "video" && data.format && !ALLOWED_VIDEO_FORMATS.includes(data.format)) {
    throw new Error("Unsupported video format");
  }

  if (data.width !== undefined && (data.width < 0 || !Number.isInteger(data.width))) {
    throw new Error("width must be a non-negative integer");
  }
  if (data.height !== undefined && (data.height < 0 || !Number.isInteger(data.height))) {
    throw new Error("height must be a non-negative integer");
  }

  const existing = await prisma.mediaAsset.findUnique({
    where: { publicId: data.publicId },
  });

  if (existing) {
    return existing;
  }

  return prisma.mediaAsset.create({
    data: {
      publicId: data.publicId,
      secureUrl: data.secureUrl,
      resourceType: rt,
      format: data.format || null,
      width: data.width || null,
      height: data.height || null,
      altText: data.altText ? data.altText.trim() : null,
    },
  });
}

export async function updateMediaAltText(id: number, altText: string | null) {
  const sanitizedAlt = altText ? altText.trim() : null;
  return prisma.mediaAsset.update({
    where: { id },
    data: { altText: sanitizedAlt },
  });
}

export async function getMediaAssetReferences(id: number): Promise<MediaAssetReferenceSummary> {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: {
      trailCovers: { select: { id: true, name: true, slug: true } },
      trailOgMedias: { select: { id: true, name: true, slug: true } },
      trailGalleries: {
        include: {
          trail: { select: { id: true, name: true, slug: true } },
        },
      },
      journalCovers: { select: { id: true, title: true, slug: true } },
      journalOgMedias: { select: { id: true, title: true, slug: true } },
      homepageGalleries: true,
      siteHeroMedias: { select: { id: true, siteName: true } },
      siteSeasonalMedias: { select: { id: true, siteName: true } },
    },
  });

  if (!asset) {
    throw new Error("Media asset not found");
  }

  const inlineHtmlReferences = await searchInlineMediaReferences(asset.secureUrl, asset.publicId);

  // Check hero video usage: SiteSettings.heroVideoUrl when provider DIRECT
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  let siteHeroVideos: Array<{ id: number; siteName: string }> = [];
  if (
    settings &&
    settings.heroVideoEnabled &&
    settings.heroVideoProvider === "DIRECT" &&
    settings.heroVideoUrl &&
    (settings.heroVideoUrl === asset.secureUrl || settings.heroVideoUrl.includes(asset.publicId))
  ) {
    siteHeroVideos = [{ id: settings.id, siteName: settings.siteName }];
  }

  return {
    trailCovers: asset.trailCovers,
    trailOgMedias: asset.trailOgMedias,
    trailGalleries: asset.trailGalleries.map((g) => ({
      trailId: g.trailId,
      trailName: g.trail.name,
      trailSlug: g.trail.slug,
    })),
    journalCovers: asset.journalCovers,
    journalOgMedias: asset.journalOgMedias,
    homepageGalleries: asset.homepageGalleries.map((h) => ({
      id: h.id,
      sortOrder: h.sortOrder,
    })),
    siteHeroMedias: asset.siteHeroMedias,
    siteSeasonalMedias: asset.siteSeasonalMedias,
    siteHeroVideos,
    inlineHtmlReferences,
  };
}

export async function canDeleteMediaAsset(id: number): Promise<{ canDelete: boolean; summary: MediaAssetReferenceSummary }> {
  const summary = await getMediaAssetReferences(id);
  
  const hasStructured =
    summary.trailCovers.length > 0 ||
    summary.trailOgMedias.length > 0 ||
    summary.trailGalleries.length > 0 ||
    summary.journalCovers.length > 0 ||
    summary.journalOgMedias.length > 0 ||
    summary.homepageGalleries.length > 0 ||
    summary.siteHeroMedias.length > 0 ||
    summary.siteSeasonalMedias.length > 0 ||
    summary.siteHeroVideos.length > 0;

  const hasInline = summary.inlineHtmlReferences.length > 0;

  return {
    canDelete: !hasStructured && !hasInline,
    summary,
  };
}

export async function searchInlineMediaReferences(secureUrl: string, publicId: string) {
  const results: Array<{ type: string; id: number; title: string; slug?: string }> = [];

  const trails = await prisma.trailLocation.findMany({
    select: { id: true, name: true, slug: true, description: true },
  });
  for (const trail of trails) {
    if (trail.description && (trail.description.includes(secureUrl) || trail.description.includes(publicId))) {
      results.push({ type: "TrailLocation", id: trail.id, title: trail.name, slug: trail.slug });
    }
  }

  const journals = await prisma.journalPost.findMany({
    select: { id: true, title: true, slug: true, content: true },
  });
  for (const journal of journals) {
    if (journal.content && (journal.content.includes(secureUrl) || journal.content.includes(publicId))) {
      results.push({ type: "JournalPost", id: journal.id, title: journal.title, slug: journal.slug });
    }
  }

  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    const combinedSettingsText = `${settings.introductionContent || ""} ${settings.seasonalContent || ""} ${settings.aboutContent || ""}`;
    if (combinedSettingsText.includes(secureUrl) || combinedSettingsText.includes(publicId)) {
      results.push({ type: "SiteSettings", id: settings.id, title: settings.siteName });
    }
    // Include hero video URL in inline reference detection for audit completeness
    const heroVideoText = `${settings.heroVideoUrl || ""}`;
    if (heroVideoText && (heroVideoText.includes(secureUrl) || heroVideoText.includes(publicId))) {
      if (!results.some((r) => r.type === "SiteSettings" && r.id === settings.id)) {
        results.push({ type: "SiteSettings:heroVideo", id: settings.id, title: settings.siteName });
      }
    }
  }

  return results;
}

export async function deleteUnreferencedMediaAsset(id: number) {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error("Media asset not found");
  }

  const allowedNamespaces = ALLOWED_UPLOAD_FOLDERS as readonly string[];
  const isValidNamespace = allowedNamespaces.some((ns) => asset.publicId.startsWith(ns));
  if (!isValidNamespace) {
    console.error(`[media-service] Refusing deletion of asset outside allowed namespace: ${asset.publicId}`);
    throw new Error("Asset publicId does not belong to approved namespace");
  }

  const { canDelete } = await canDeleteMediaAsset(id);
  if (!canDelete) {
    throw new Error("Cannot delete media asset because it is referenced elsewhere");
  }

  const cloudinary = getCloudinaryClient();
  try {
    const destroyResult = await cloudinary.uploader.destroy(asset.publicId, {
      resource_type: asset.resourceType || "image",
    });
    console.info(`[media-service] Cloudinary destroy result for ${asset.publicId}:`, destroyResult);
  } catch (cloudinaryError) {
    console.error(`[media-service] Cloudinary destroy failed for ${asset.publicId}:`, cloudinaryError);
    throw new Error("Failed to delete asset from Cloudinary");
  }

  await prisma.mediaAsset.delete({
    where: { id },
  });

  return { success: true, id };
}

export async function cleanupOrphanCloudinaryAsset(publicId: string, resourceType: string = "image") {
  try {
    const cloudinary = getCloudinaryClient();
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.info(`[media-service] Successfully cleaned up orphan Cloudinary asset: ${publicId}`);
  } catch (err) {
    console.error(`[orphan-warning] CRITICAL: Failed to clean up orphaned Cloudinary asset [${publicId}]:`, err);
  }
}
