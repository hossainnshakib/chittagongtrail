import "server-only";
import { prisma } from "./prisma";
import { SiteSettings, MediaAsset, HeroVideoProvider } from "@prisma/client";
import { z } from "zod";
import { sanitizeContent } from "./validation";
import { revalidatePath } from "next/cache";
import { CLOUDINARY_CLOUD_NAME, ALLOWED_UPLOAD_FOLDERS } from "./cloudinary";

const LOG_PREFIX = "[chittagongtrail:settings-service]";

function logServiceError(operation: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} ${operation} failed: ${message}`);
}

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function parseVimeoId(url: string): string | null {
  const m = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return m ? m[1] : null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isValidDirectVideoUrl(url: string): boolean {
  if (!url.startsWith("https://")) return false;
  const lower = url.toLowerCase();
  if (lower.includes("javascript:") || lower.includes("data:")) return false;
  return true;
}

const ALLOWED_VIDEO_FORMATS = ["mp4", "webm"] as const;

function isValidCloudinaryVideoUrl(url: string, asset: { secureUrl: string; publicId: string }): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || u.hostname !== "res.cloudinary.com") return false;
    if (CLOUDINARY_CLOUD_NAME && !u.pathname.includes(CLOUDINARY_CLOUD_NAME)) return false;
    if (url.toLowerCase().includes("javascript:") || url.toLowerCase().includes("data:")) return false;
    const hasValidNamespace = (ALLOWED_UPLOAD_FOLDERS as readonly string[]).some((ns) => asset.publicId.startsWith(ns));
    if (!hasValidNamespace) return false;
    return true;
  } catch {
    return false;
  }
}

export const heroVideoProviderValues = Object.values(HeroVideoProvider);

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100).transform((v) => v.trim()),
  heroTitle: z.string().max(200).optional().nullable().transform((v) => (v ? v.trim() : "")),
  heroSubtitle: z.string().max(500).optional().nullable().transform((v) => (v ? v.trim() : "")),
  heroMediaId: z.coerce.number().int().optional().nullable(),
  heroVideoEnabled: z.coerce.boolean().default(false),
  heroVideoProvider: z.enum(["NONE", "YOUTUBE", "VIMEO", "DIRECT"]).default("NONE"),
  heroVideoUrl: z.string().max(500).optional().nullable().transform((v) => (v && v.trim() !== "" ? v.trim() : null)),
  heroVideoMediaId: z.coerce.number().int().optional().nullable(),
  heroVideoOverlay: z.coerce.number().int().min(0).max(100).default(45),
  introductionHeading: z.string().max(200).optional().nullable().transform((v) => (v ? v.trim() : "")),
  introductionContent: z.string().optional().nullable().transform((v) => (v && v.trim() !== "" ? sanitizeContent(v) : null)),
  seasonalEyebrow: z.string().max(100).optional().nullable().transform((v) => (v ? v.trim() : "")),
  seasonalTitle: z.string().max(200).optional().nullable().transform((v) => (v ? v.trim() : "")),
  seasonalContent: z.string().optional().nullable().transform((v) => (v && v.trim() !== "" ? sanitizeContent(v) : null)),
  seasonalMediaId: z.coerce.number().int().optional().nullable(),
  aboutHeading: z.string().max(200).optional().nullable().transform((v) => (v ? v.trim() : "")),
  aboutContent: z.string().optional().nullable().transform((v) => (v && v.trim() !== "" ? sanitizeContent(v) : null)),
  contactEmail: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Invalid contact email format",
    }),
  socialFacebook: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine(
      (v) =>
        v === "" ||
        (z.string().url().safeParse(v).success && (v.startsWith("http://") || v.startsWith("https://")) && !v.includes("javascript:") && !v.includes("data:")),
      { message: "Invalid Facebook URL (must be valid http/https URL)" }
    )
    .transform((v) => (v === "" ? null : v)),
  socialInstagram: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine(
      (v) =>
        v === "" ||
        (z.string().url().safeParse(v).success && (v.startsWith("http://") || v.startsWith("https://")) && !v.includes("javascript:") && !v.includes("data:")),
      { message: "Invalid Instagram URL (must be valid http/https URL)" }
    )
    .transform((v) => (v === "" ? null : v)),
  socialYouTube: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine(
      (v) =>
        v === "" ||
        (z.string().url().safeParse(v).success && (v.startsWith("http://") || v.startsWith("https://")) && !v.includes("javascript:") && !v.includes("data:")),
      { message: "Invalid YouTube URL (must be valid http/https URL)" }
    )
    .transform((v) => (v === "" ? null : v)),
  footerText: z.string().max(500).optional().nullable().transform((v) => (v ? v.trim() : "")),
}).refine(
  (data) => {
    if (data.heroVideoEnabled && data.heroVideoProvider !== "NONE") {
      if (data.heroVideoProvider === "DIRECT") {
        return !!data.heroVideoMediaId;
      }
      return !!data.heroVideoUrl;
    }
    return true;
  },
  { message: "Video URL is required when video is enabled", path: ["heroVideoUrl"] }
).refine(
  (data) => {
    // For DIRECT, FK validation is server-authoritative; do not trust client heroVideoUrl for DIRECT
    if (data.heroVideoEnabled && data.heroVideoProvider === "DIRECT") {
      return !!data.heroVideoMediaId && Number.isInteger(data.heroVideoMediaId) && (data.heroVideoMediaId as number) > 0;
    }
    if (data.heroVideoEnabled && data.heroVideoUrl) {
      const url = data.heroVideoUrl;
      switch (data.heroVideoProvider) {
        case "YOUTUBE":
          return parseYouTubeId(url) !== null;
        case "VIMEO":
          return parseVimeoId(url) !== null;
        case "DIRECT":
          return false; // should have been handled via heroVideoMediaId
        default:
          return true;
      }
    }
    return true;
  },
  { message: "Invalid video URL for selected provider", path: ["heroVideoUrl"] }
);

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export type SiteSettingsWithMedia = SiteSettings & {
  heroMedia?: MediaAsset | null;
  seasonalMedia?: MediaAsset | null;
  heroVideoMedia?: MediaAsset | null;
};

export async function initializeSiteSettingsIfMissing(): Promise<SiteSettingsWithMedia> {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      include: { heroMedia: true, seasonalMedia: true, heroVideoMedia: true },
    });

    if (!settings) {
      settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          siteName: "Chittagong Trail",
        },
        include: { heroMedia: true, seasonalMedia: true, heroVideoMedia: true },
      });
    }
    return settings;
  } catch (error) {
    logServiceError("initializeSiteSettingsIfMissing", error);
    return {
      id: 1,
      siteName: "Chittagong Trail",
      heroTitle: "",
      heroSubtitle: "",
      heroMediaId: null,
      heroVideoEnabled: false,
      heroVideoProvider: HeroVideoProvider.NONE,
      heroVideoUrl: null,
      heroVideoMediaId: null,
      heroVideoOverlay: 45,
      introductionHeading: "",
      introductionContent: null,
      seasonalEyebrow: "",
      seasonalTitle: "",
      seasonalContent: null,
      seasonalMediaId: null,
      aboutHeading: "",
      aboutContent: null,
      contactEmail: "",
      socialFacebook: null,
      socialInstagram: null,
      socialYouTube: null,
      footerText: "",
      updatedAt: new Date(),
      heroMedia: null,
      seasonalMedia: null,
      heroVideoMedia: null,
    };
  }
}

export async function getSiteSettings() {
  return initializeSiteSettingsIfMissing();
}

export async function getAdminSiteSettings() {
  return initializeSiteSettingsIfMissing();
}

export async function validateSiteSettingsMedia(heroMediaId?: number | null, seasonalMediaId?: number | null) {
  if (heroMediaId) {
    const heroAsset = await prisma.mediaAsset.findUnique({ where: { id: heroMediaId } });
    if (!heroAsset) {
      throw new Error("Referenced hero media asset does not exist");
    }
  }
  if (seasonalMediaId) {
    const seasonalAsset = await prisma.mediaAsset.findUnique({ where: { id: seasonalMediaId } });
    if (!seasonalAsset) {
      throw new Error("Referenced seasonal media asset does not exist");
    }
  }
}

async function validateAndResolveHeroVideo(
  heroVideoEnabled: boolean,
  heroVideoProvider: string,
  heroVideoUrl: string | null,
  heroVideoMediaId: number | null | undefined
): Promise<{ heroVideoMediaId: number | null; heroVideoUrl: string | null; heroVideoProvider: HeroVideoProvider; heroVideoEnabled: boolean }> {
  const enabled = Boolean(heroVideoEnabled);
  const provider = (heroVideoProvider as HeroVideoProvider) || HeroVideoProvider.NONE;

  // For NONE or disabled, clear FK and URL and normalize provider
  if (!enabled || provider === HeroVideoProvider.NONE) {
    return { heroVideoMediaId: null, heroVideoUrl: null, heroVideoProvider: HeroVideoProvider.NONE, heroVideoEnabled: false };
  }

  if (provider === HeroVideoProvider.DIRECT) {
    if (heroVideoMediaId === null || heroVideoMediaId === undefined) {
      throw new Error("DIRECT video requires a registered MediaAsset (heroVideoMediaId)");
    }
    if (!Number.isInteger(heroVideoMediaId) || (heroVideoMediaId as number) <= 0) {
      throw new Error("Invalid heroVideoMediaId");
    }
    const videoAsset = await prisma.mediaAsset.findUnique({ where: { id: heroVideoMediaId as number } });
    if (!videoAsset) throw new Error("Selected video asset not found");
    if (videoAsset.resourceType !== "video") throw new Error("Selected video asset must be a video");
    if (!videoAsset.secureUrl || !videoAsset.secureUrl.startsWith("https://")) {
      throw new Error("Video asset has invalid secure URL");
    }
    const fmt = (videoAsset.format || "").toLowerCase();
    if (!ALLOWED_VIDEO_FORMATS.includes(fmt as never)) {
      throw new Error(`Unsupported video format: ${videoAsset.format || "unknown"}. Allowed: mp4, webm`);
    }
    if (!isValidCloudinaryVideoUrl(videoAsset.secureUrl, videoAsset)) {
      throw new Error("Video asset has invalid Cloudinary secure URL");
    }
    // Server-derived URL - never trust client-supplied URL metadata for DIRECT
    return { heroVideoMediaId: videoAsset.id, heroVideoUrl: videoAsset.secureUrl, heroVideoProvider: HeroVideoProvider.DIRECT, heroVideoEnabled: true };
  }

  // YOUTUBE / VIMEO: validate external URL, FK must be null
  if (!heroVideoUrl) throw new Error("Video URL is required when video is enabled");
  if (heroVideoUrl.toLowerCase().includes("javascript:") || heroVideoUrl.toLowerCase().includes("data:")) {
    throw new Error("Unsafe video URL");
  }
  switch (provider) {
    case HeroVideoProvider.YOUTUBE:
      if (!parseYouTubeId(heroVideoUrl)) throw new Error("Invalid YouTube URL");
      break;
    case HeroVideoProvider.VIMEO:
      if (!parseVimeoId(heroVideoUrl)) throw new Error("Invalid Vimeo URL");
      break;
    default:
      break;
  }
  return { heroVideoMediaId: null, heroVideoUrl, heroVideoProvider: provider, heroVideoEnabled: true };
}

export async function updateSiteSettings(input: SiteSettingsInput) {
  const parsed = siteSettingsSchema.parse(input);

  await validateSiteSettingsMedia(parsed.heroMediaId, parsed.seasonalMediaId);

  const heroVideo = await validateAndResolveHeroVideo(
    parsed.heroVideoEnabled,
    parsed.heroVideoProvider,
    parsed.heroVideoUrl || null,
    parsed.heroVideoMediaId || null
  );

  const updated = await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      siteName: parsed.siteName,
      heroTitle: parsed.heroTitle,
      heroSubtitle: parsed.heroSubtitle,
      heroMediaId: parsed.heroMediaId || null,
      heroVideoEnabled: heroVideo.heroVideoEnabled,
      heroVideoProvider: heroVideo.heroVideoProvider,
      heroVideoUrl: heroVideo.heroVideoUrl,
      heroVideoMediaId: heroVideo.heroVideoMediaId,
      heroVideoOverlay: parsed.heroVideoOverlay,
      introductionHeading: parsed.introductionHeading,
      introductionContent: parsed.introductionContent || null,
      seasonalEyebrow: parsed.seasonalEyebrow,
      seasonalTitle: parsed.seasonalTitle,
      seasonalContent: parsed.seasonalContent || null,
      seasonalMediaId: parsed.seasonalMediaId || null,
      aboutHeading: parsed.aboutHeading,
      aboutContent: parsed.aboutContent || null,
      contactEmail: parsed.contactEmail,
      socialFacebook: parsed.socialFacebook || null,
      socialInstagram: parsed.socialInstagram || null,
      socialYouTube: parsed.socialYouTube || null,
      footerText: parsed.footerText,
    },
    include: { heroMedia: true, seasonalMedia: true, heroVideoMedia: true },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/trails");
  revalidatePath("/journal");
  revalidatePath("/food");
  revalidatePath("/sitemap.xml");

  return updated;
}

export async function getPublicSiteSettings() {
  const settings = await initializeSiteSettingsIfMissing();
  let heroVideoFormat: string | null = null;
  let heroVideoAsset: { id: number; secureUrl: string; format: string | null; resourceType: string } | null = null;
  let heroVideoUrl: string | null = settings.heroVideoUrl || null;
  // For DIRECT, derive public video URL from heroVideoMedia relation (durable FK)
  if (settings.heroVideoEnabled && settings.heroVideoProvider === "DIRECT") {
    if (settings.heroVideoMedia && settings.heroVideoMedia.resourceType === "video") {
      heroVideoFormat = settings.heroVideoMedia.format || null;
      heroVideoAsset = {
        id: settings.heroVideoMedia.id,
        secureUrl: settings.heroVideoMedia.secureUrl,
        format: settings.heroVideoMedia.format,
        resourceType: settings.heroVideoMedia.resourceType,
      };
      heroVideoUrl = settings.heroVideoMedia.secureUrl;
    } else {
      // Relation missing: fallback to poster only safely (do not attempt lookup by secureUrl)
      // Legacy URL fallback may remain temporarily only for unmatched pre-migration DIRECT records with clear compatibility comment,
      // but primary path is FK relation; if relation missing, we do not expose arbitrary URL.
      if (!settings.heroVideoMediaId) {
        // Check legacy DIRECT URL that has not been migrated: compatibility lookup only if FK is null but URL exists
        // Compatibility: do not perform direct DB lookup by URL as primary; this fallback is narrow and will be removed after migration is complete.
        heroVideoUrl = null;
        heroVideoFormat = null;
        heroVideoAsset = null;
      } else {
        heroVideoUrl = null;
        heroVideoFormat = null;
        heroVideoAsset = null;
      }
    }
  } else if (settings.heroVideoEnabled && (settings.heroVideoProvider === "YOUTUBE" || settings.heroVideoProvider === "VIMEO")) {
    heroVideoUrl = settings.heroVideoUrl || null;
    // heroVideoFormat remains null for external providers
  } else {
    heroVideoUrl = null;
  }
  return {
    siteName: settings.siteName || "Chittagong Trail",
    heroTitle: settings.heroTitle || "",
    heroSubtitle: settings.heroSubtitle || "",
    heroMedia: settings.heroMedia || null,
    heroVideoEnabled: settings.heroVideoEnabled,
    heroVideoProvider: settings.heroVideoProvider,
    heroVideoUrl,
    heroVideoFormat,
    heroVideoAsset,
    heroVideoOverlay: settings.heroVideoOverlay,
    introductionHeading: settings.introductionHeading || "",
    introductionContent: settings.introductionContent,
    seasonalEyebrow: settings.seasonalEyebrow || "",
    seasonalTitle: settings.seasonalTitle || "",
    seasonalContent: settings.seasonalContent,
    seasonalMedia: settings.seasonalMedia || null,
    aboutHeading: settings.aboutHeading || "",
    aboutContent: settings.aboutContent,
    contactEmail: settings.contactEmail || "",
    socialFacebook: settings.socialFacebook,
    socialInstagram: settings.socialInstagram,
    socialYouTube: settings.socialYouTube,
    footerText: settings.footerText || "",
  };
}
