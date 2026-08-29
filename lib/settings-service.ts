import "server-only";
import { prisma } from "./prisma";
import { SiteSettings, MediaAsset } from "@prisma/client";
import { z } from "zod";
import { sanitizeContent } from "./validation";
import { revalidatePath } from "next/cache";

const LOG_PREFIX = "[chittagongtrail:settings-service]";

function logServiceError(operation: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${LOG_PREFIX} ${operation} failed: ${message}`);
}

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100).transform((v) => v.trim()),
  heroTitle: z.string().max(200).optional().nullable().transform((v) => (v ? v.trim() : "")),
  heroSubtitle: z.string().max(500).optional().nullable().transform((v) => (v ? v.trim() : "")),
  heroMediaId: z.coerce.number().int().optional().nullable(),
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
});

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
    // Return safe default fallback object in memory if DB error occurs
    return {
      id: 1,
      siteName: "Chittagong Trail",
      heroTitle: "",
      heroSubtitle: "",
      heroMediaId: null,
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

  // Revalidate public routes affected by site settings
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
  return {
    siteName: settings.siteName || "Chittagong Trail",
    heroTitle: settings.heroTitle || "",
    heroSubtitle: settings.heroSubtitle || "",
    heroMedia: settings.heroMedia || null,
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
