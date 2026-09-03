import "server-only";
import { prisma } from "./prisma";
import { SiteSettings, MediaAsset, HeroVideoProvider } from "@prisma/client";
import { z } from "zod";
import { sanitizeContent } from "./validation";
import { revalidatePath } from "next/cache";

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

function isValidDirectVideoUrl(url: string): boolean {
  if (!url.startsWith("https://")) return false;
  const lower = url.toLowerCase();
  if (lower.includes("javascript:") || lower.includes("data:")) return false;
  return true;
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
      return !!data.heroVideoUrl;
    }
    return true;
  },
  { message: "Video URL is required when video is enabled", path: ["heroVideoUrl"] }
).refine(
  (data) => {
    if (data.heroVideoEnabled && data.heroVideoUrl) {
      const url = data.heroVideoUrl;
      switch (data.heroVideoProvider) {
        case "YOUTUBE":
          return parseYouTubeId(url) !== null;
        case "VIMEO":
          return parseVimeoId(url) !== null;
        case "DIRECT":
          return isValidDirectVideoUrl(url);
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
};

export async function initializeSiteSettingsIfMissing(): Promise<SiteSettingsWithMedia> {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      include: { heroMedia: true, seasonalMedia: true },
    });

    if (!settings) {
      settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        update: {},
        create: {
          id: 1,
          siteName: "Chittagong Trail",
        },
        include: { heroMedia: true, seasonalMedia: true },
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

export async function updateSiteSettings(input: SiteSettingsInput) {
  const parsed = siteSettingsSchema.parse(input);

  await validateSiteSettingsMedia(parsed.heroMediaId, parsed.seasonalMediaId);

  const updated = await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      siteName: parsed.siteName,
      heroTitle: parsed.heroTitle,
      heroSubtitle: parsed.heroSubtitle,
      heroMediaId: parsed.heroMediaId || null,
      heroVideoEnabled: parsed.heroVideoEnabled,
      heroVideoProvider: parsed.heroVideoProvider as HeroVideoProvider,
      heroVideoUrl: parsed.heroVideoUrl || null,
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
    include: { heroMedia: true, seasonalMedia: true },
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
  if (settings.heroVideoEnabled && settings.heroVideoProvider === "DIRECT" && settings.heroVideoUrl) {
    try {
      const asset = await prisma.mediaAsset.findFirst({ where: { secureUrl: settings.heroVideoUrl } });
      if (asset && asset.resourceType === "video") {
        heroVideoFormat = asset.format || null;
        heroVideoAsset = { id: asset.id, secureUrl: asset.secureUrl, format: asset.format, resourceType: asset.resourceType };
      } else {
        // Try lookup by publicId contained in URL as fallback
        const fallback = await prisma.mediaAsset.findFirst({ where: { secureUrl: settings.heroVideoUrl } });
        if (fallback) heroVideoFormat = fallback.format || null;
      }
    } catch {
      // fail silently, leave format null
    }
  }
  return {
    siteName: settings.siteName || "Chittagong Trail",
    heroTitle: settings.heroTitle || "",
    heroSubtitle: settings.heroSubtitle || "",
    heroMedia: settings.heroMedia || null,
    heroVideoEnabled: settings.heroVideoEnabled,
    heroVideoProvider: settings.heroVideoProvider,
    heroVideoUrl: settings.heroVideoUrl || null,
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
