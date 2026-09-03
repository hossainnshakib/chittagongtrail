import "server-only";
import { prisma } from "./prisma";
import { ContentStatus, JournalType } from "@prisma/client";
import { sanitizeContent } from "./validation";
import { revalidatePath } from "next/cache";

const LOG_PREFIX = "[chittagongtrail:homepage-service]";

function logError(op: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`${LOG_PREFIX} ${op} failed: ${msg}`);
}

// --- Overview ---

export interface HomepageOverviewPayload {
  hero: {
    enabled: boolean;
    posterPresent: boolean;
    videoPresent: boolean;
    videoProvider: string;
    titlePresent: boolean;
    subtitlePresent: boolean;
  };
  featuredTrails: { count: number; limit: number; complete: boolean };
  featuredStories: { count: number; limit: number; complete: boolean };
  featuredFood: { count: number; limit: number; complete: boolean };
  seasonal: { configured: boolean; eyebrow: string; title: string; mediaPresent: boolean };
  gallery: { count: number; recommendedMin: number; recommendedMax: number; warning: boolean };
}

export async function getHomepageOverview(): Promise<HomepageOverviewPayload> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      include: { heroMedia: true, seasonalMedia: true },
    });
    const trails = await prisma.trailLocation.count({
      where: { status: ContentStatus.PUBLISHED, isFeatured: true },
    });
    const stories = await prisma.journalPost.count({
      where: { status: ContentStatus.PUBLISHED, type: JournalType.STORY, isFeatured: true },
    });
    const food = await prisma.journalPost.count({
      where: { status: ContentStatus.PUBLISHED, type: JournalType.FOOD, isFeatured: true },
    });
    const galleryCount = await prisma.homepageGallery.count();

    const heroEnabled = settings?.heroVideoEnabled ?? false;
    const heroProvider = settings?.heroVideoProvider ?? "NONE";
    const posterPresent = !!settings?.heroMediaId;
    const videoPresent = !!settings?.heroVideoUrl && heroProvider !== "NONE" && heroEnabled;
    const heroTitlePresent = !!settings?.heroTitle?.trim();
    const heroSubtitlePresent = !!settings?.heroSubtitle?.trim();

    // seasonal configured if heading or content present plus media? spec says heading and supporting content
    const seasonalConfigured = !!(
      (settings?.seasonalTitle?.trim() || settings?.seasonalEyebrow?.trim()) &&
      (settings?.seasonalContent?.trim() || settings?.seasonalMediaId)
    );
    const seasonalEyebrow = settings?.seasonalEyebrow || "";
    const seasonalTitle = settings?.seasonalTitle || "";
    const seasonalMediaPresent = !!settings?.seasonalMediaId;

    const recommendedMin = 6;
    const recommendedMax = 8;

    return {
      hero: {
        enabled: heroEnabled,
        posterPresent,
        videoPresent,
        videoProvider: heroProvider,
        titlePresent: heroTitlePresent,
        subtitlePresent: heroSubtitlePresent,
      },
      featuredTrails: { count: trails, limit: 4, complete: trails > 0 },
      featuredStories: { count: stories, limit: 3, complete: stories > 0 },
      featuredFood: { count: food, limit: 3, complete: food > 0 },
      seasonal: { configured: seasonalConfigured, eyebrow: seasonalEyebrow, title: seasonalTitle, mediaPresent: seasonalMediaPresent },
      gallery: {
        count: galleryCount,
        recommendedMin,
        recommendedMax,
        warning: galleryCount < recommendedMin || galleryCount > recommendedMax,
      },
    };
  } catch (e) {
    logError("getHomepageOverview", e);
    return {
      hero: { enabled: false, posterPresent: false, videoPresent: false, videoProvider: "NONE", titlePresent: false, subtitlePresent: false },
      featuredTrails: { count: 0, limit: 4, complete: false },
      featuredStories: { count: 0, limit: 3, complete: false },
      featuredFood: { count: 0, limit: 3, complete: false },
      seasonal: { configured: false, eyebrow: "", title: "", mediaPresent: false },
      gallery: { count: 0, recommendedMin: 6, recommendedMax: 8, warning: true },
    };
  }
}

// --- Featured Trails ---

export async function updateFeaturedTrails(ids: number[]) {
  if (!Array.isArray(ids)) throw new Error("ids must be array");
  if (ids.length > 4) throw new Error("Maximum 4 featured trails allowed");
  const unique = new Set(ids);
  if (unique.size !== ids.length) throw new Error("Duplicate trail IDs not allowed");
  for (const id of ids) {
    if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid trail ID: ${id}`);
  }

  if (ids.length > 0) {
    const trails = await prisma.trailLocation.findMany({ where: { id: { in: ids } } });
    if (trails.length !== ids.length) throw new Error("One or more trails not found");
    for (const t of trails) {
      if (t.status !== ContentStatus.PUBLISHED) throw new Error(`Trail ${t.id} is not published`);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.trailLocation.updateMany({ where: { isFeatured: true }, data: { isFeatured: false, featuredOrder: null } });
    for (let i = 0; i < ids.length; i++) {
      await tx.trailLocation.update({ where: { id: ids[i] }, data: { isFeatured: true, featuredOrder: i } });
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/featured-trails");
}

export async function updateFeaturedStories(ids: number[]) {
  if (!Array.isArray(ids)) throw new Error("ids must be array");
  if (ids.length > 3) throw new Error("Maximum 3 featured stories allowed");
  const unique = new Set(ids);
  if (unique.size !== ids.length) throw new Error("Duplicate story IDs not allowed");
  for (const id of ids) {
    if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid story ID: ${id}`);
  }
  if (ids.length > 0) {
    const posts = await prisma.journalPost.findMany({ where: { id: { in: ids } } });
    if (posts.length !== ids.length) throw new Error("One or more stories not found");
    for (const p of posts) {
      if (p.type !== JournalType.STORY) throw new Error(`Post ${p.id} is not a STORY`);
      if (p.status !== ContentStatus.PUBLISHED) throw new Error(`Story ${p.id} is not published`);
    }
  }
  await prisma.$transaction(async (tx) => {
    await tx.journalPost.updateMany({ where: { type: JournalType.STORY, isFeatured: true }, data: { isFeatured: false, featuredOrder: null } });
    for (let i = 0; i < ids.length; i++) {
      await tx.journalPost.update({ where: { id: ids[i] }, data: { isFeatured: true, featuredOrder: i } });
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/featured-stories");
}

export async function updateFeaturedFood(ids: number[]) {
  if (!Array.isArray(ids)) throw new Error("ids must be array");
  if (ids.length > 3) throw new Error("Maximum 3 featured food posts allowed");
  const unique = new Set(ids);
  if (unique.size !== ids.length) throw new Error("Duplicate food IDs not allowed");
  for (const id of ids) {
    if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid food ID: ${id}`);
  }
  if (ids.length > 0) {
    const posts = await prisma.journalPost.findMany({ where: { id: { in: ids } } });
    if (posts.length !== ids.length) throw new Error("One or more food posts not found");
    for (const p of posts) {
      if (p.type !== JournalType.FOOD) throw new Error(`Post ${p.id} is not FOOD`);
      if (p.status !== ContentStatus.PUBLISHED) throw new Error(`Food post ${p.id} is not published`);
    }
  }
  await prisma.$transaction(async (tx) => {
    await tx.journalPost.updateMany({ where: { type: JournalType.FOOD, isFeatured: true }, data: { isFeatured: false, featuredOrder: null } });
    for (let i = 0; i < ids.length; i++) {
      await tx.journalPost.update({ where: { id: ids[i] }, data: { isFeatured: true, featuredOrder: i } });
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/featured-food");
}

// --- Gallery ---

export async function getHomepageGallery() {
  return prisma.homepageGallery.findMany({
    orderBy: { sortOrder: "asc" },
    include: { mediaAsset: true },
  });
}

export async function setHomepageGallery(mediaAssetIds: number[]) {
  if (!Array.isArray(mediaAssetIds)) throw new Error("mediaAssetIds must be array");
  if (mediaAssetIds.length > 12) throw new Error("Maximum 12 gallery images allowed");
  const unique = new Set(mediaAssetIds);
  if (unique.size !== mediaAssetIds.length) throw new Error("Duplicate media IDs not allowed");
  for (const id of mediaAssetIds) {
    if (!Number.isInteger(id) || id <= 0) throw new Error(`Invalid media ID: ${id}`);
  }
  if (mediaAssetIds.length > 0) {
    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaAssetIds } } });
    if (assets.length !== mediaAssetIds.length) throw new Error("One or more media assets not found");
    for (const a of assets) {
      if (a.resourceType !== "image") throw new Error(`Media asset ${a.id} is not an image`);
    }
  }
  await prisma.$transaction(async (tx) => {
    await tx.homepageGallery.deleteMany({});
    for (let i = 0; i < mediaAssetIds.length; i++) {
      await tx.homepageGallery.create({ data: { mediaAssetId: mediaAssetIds[i], sortOrder: i } });
    }
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/gallery");
}

// --- Seasonal ---

export async function updateSeasonal(input: {
  seasonalEyebrow?: string | null;
  seasonalTitle?: string | null;
  seasonalContent?: string | null;
  seasonalMediaId?: number | null;
}) {
  const eyebrow = typeof input.seasonalEyebrow === "string" ? input.seasonalEyebrow.trim().slice(0, 100) : "";
  const title = typeof input.seasonalTitle === "string" ? input.seasonalTitle.trim().slice(0, 200) : "";
  let content: string | null = null;
  if (typeof input.seasonalContent === "string" && input.seasonalContent.trim() !== "") {
    content = sanitizeContent(input.seasonalContent);
  }

  let mediaId: number | null = null;
  if (input.seasonalMediaId !== null && input.seasonalMediaId !== undefined) {
    const num = Number(input.seasonalMediaId);
    if (!Number.isInteger(num) || num <= 0) throw new Error("Invalid seasonal media ID");
    const asset = await prisma.mediaAsset.findUnique({ where: { id: num } });
    if (!asset) throw new Error("Seasonal media asset not found");
    if (asset.resourceType !== "image") throw new Error("Seasonal media must be an image");
    mediaId = num;
  }

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      seasonalEyebrow: eyebrow,
      seasonalTitle: title,
      seasonalContent: content,
      seasonalMediaId: mediaId,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/homepage/seasonal");
}

// --- Hero helpers reused from settings-service but isolated ---
export function validateHeroInput(input: {
  heroTitle?: string;
  heroSubtitle?: string;
  heroMediaId?: number | null;
  heroVideoEnabled?: boolean;
  heroVideoProvider?: string;
  heroVideoUrl?: string | null;
  heroVideoOverlay?: number;
}) {
  const title = typeof input.heroTitle === "string" ? input.heroTitle.trim().slice(0, 200) : "";
  const subtitle = typeof input.heroSubtitle === "string" ? input.heroSubtitle.trim().slice(0, 500) : "";
  const enabled = Boolean(input.heroVideoEnabled);
  const provider = (input.heroVideoProvider as string) || "NONE";
  const overlay = Number.isInteger(input.heroVideoOverlay) ? Math.max(0, Math.min(100, input.heroVideoOverlay as number)) : 45;
  let url: string | null = null;
  if (typeof input.heroVideoUrl === "string" && input.heroVideoUrl.trim() !== "") url = input.heroVideoUrl.trim();

  // poster required when enabled
  // validated outside via DB check for image type
  // provider url validation similar to settings-service
  function parseYouTubeId(u: string): string | null {
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/];
    for (const p of patterns) {
      const m = u.match(p);
      if (m) return m[1];
    }
    return null;
  }
  function parseVimeoId(u: string): string | null {
    const m = u.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    return m ? m[1] : null;
  }

  if (enabled && provider !== "NONE" && !url) throw new Error("Video URL is required when video is enabled");
  if (enabled && url) {
    switch (provider) {
      case "YOUTUBE":
        if (!parseYouTubeId(url)) throw new Error("Invalid YouTube URL");
        break;
      case "VIMEO":
        if (!parseVimeoId(url)) throw new Error("Invalid Vimeo URL");
        break;
      case "DIRECT":
        if (!url.startsWith("https://") || url.toLowerCase().includes("javascript:") || url.toLowerCase().includes("data:")) throw new Error("Invalid direct video URL");
        break;
      default:
        break;
    }
    if (url.toLowerCase().includes("javascript:") || url.toLowerCase().includes("data:")) throw new Error("Unsafe URL");
  }
  return { title, subtitle, enabled, provider, url, overlay };
}
