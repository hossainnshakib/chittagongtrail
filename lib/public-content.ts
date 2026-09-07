import "server-only";

import { PageSeoSetting, HomepageSectionSetting } from "@prisma/client";
import { z } from "zod";
import { prisma } from "./prisma";
import { sanitizeContent } from "./validation";
import { validateImageMediaId } from "./media-validation";
import { revalidatePath } from "next/cache";

import { PUBLIC_PAGE_DEFINITIONS, HOMEPAGE_SECTION_DEFINITIONS, type PublicPageKey, type HomepageSectionKey } from "./public-content-definitions";
export { PUBLIC_PAGE_DEFINITIONS, HOMEPAGE_SECTION_DEFINITIONS, type PublicPageKey, type HomepageSectionKey } from "./public-content-definitions";

export type PublicPageSeo = {
  pageKey: PublicPageKey;
  routePath: string;
  adminLabel: string;
  visibleTitle: string;
  visibleDescription: string;
  metaTitle: string;
  metaDescription: string;
  useVisibleTitleAsMetaTitle: boolean;
  useVisibleDescriptionAsMetaDescription: boolean;
  ogTitle: string;
  ogDescription: string;
  ogMediaId: number | null;
  ogMedia: { id: number; secureUrl: string; width: number | null; height: number | null; altText: string | null } | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  includeInSitemap: boolean;
  updatedAt: Date;
};

type PageSeoWithMedia = PageSeoSetting & {
  ogMedia: { id: number; secureUrl: string; width: number | null; height: number | null; altText: string | null } | null;
};

function getPageDefinition(pageKey: string) {
  return PUBLIC_PAGE_DEFINITIONS.find((definition) => definition.pageKey === pageKey);
}

function plainText(value: string | null | undefined): string {
  if (!value) return "";
  return sanitizeContent(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackPageSeo(pageKey: PublicPageKey): PublicPageSeo {
  const definition = getPageDefinition(pageKey)!;
  const updatedAt = new Date(0);
  return {
    pageKey,
    routePath: definition.routePath,
    adminLabel: definition.adminLabel,
    visibleTitle: definition.fallbackTitle,
    visibleDescription: definition.fallbackDescription,
    metaTitle: definition.fallbackTitle,
    metaDescription: definition.fallbackDescription,
    useVisibleTitleAsMetaTitle: true,
    useVisibleDescriptionAsMetaDescription: true,
    ogTitle: "",
    ogDescription: "",
    ogMediaId: null,
    ogMedia: null,
    robotsIndex: true,
    robotsFollow: true,
    includeInSitemap: true,
    updatedAt,
  };
}

function normalizePageSeo(
  record: PageSeoWithMedia | null,
  pageKey: PublicPageKey,
  homeCopy?: { heroTitle: string; heroSubtitle: string }
): PublicPageSeo {
  const fallback = fallbackPageSeo(pageKey);
  if (!record) {
    if (pageKey !== "home" || !homeCopy) return fallback;
    return {
      ...fallback,
      visibleTitle: homeCopy.heroTitle.trim() || fallback.visibleTitle,
      visibleDescription: plainText(homeCopy.heroSubtitle) || fallback.visibleDescription,
      metaTitle: homeCopy.heroTitle.trim() || fallback.metaTitle,
      metaDescription: plainText(homeCopy.heroSubtitle) || fallback.metaDescription,
    };
  }

  const visibleTitle = (pageKey === "home" ? homeCopy?.heroTitle : record.visibleTitle)?.trim() || fallback.visibleTitle;
  const visibleDescription = plainText(
    pageKey === "home" ? homeCopy?.heroSubtitle : record.visibleDescription
  ) || fallback.visibleDescription;
  return {
    pageKey,
    routePath: fallback.routePath,
    adminLabel: fallback.adminLabel,
    visibleTitle,
    visibleDescription,
    metaTitle: (record.useVisibleTitleAsMetaTitle ? visibleTitle : record.metaTitle?.trim()) || "",
    metaDescription:
      (record.useVisibleDescriptionAsMetaDescription ? visibleDescription : plainText(record.metaDescription)) ||
      "",
    useVisibleTitleAsMetaTitle: record.useVisibleTitleAsMetaTitle,
    useVisibleDescriptionAsMetaDescription: record.useVisibleDescriptionAsMetaDescription,
    ogTitle: record.ogTitle?.trim() || "",
    ogDescription: plainText(record.ogDescription),
    ogMediaId: record.ogMediaId,
    ogMedia: record.ogMedia,
    robotsIndex: record.robotsIndex,
    robotsFollow: record.robotsFollow,
    includeInSitemap: record.includeInSitemap,
    updatedAt: record.updatedAt,
  };
}

export async function getPublicPageSeo(pageKey: PublicPageKey): Promise<PublicPageSeo> {
  const definition = getPageDefinition(pageKey);
  if (!definition) throw new Error(`Unknown public page key: ${pageKey}`);

  try {
    const [record, siteSettings] = await Promise.all([
      prisma.pageSeoSetting.findUnique({
        where: { pageKey },
        include: {
          ogMedia: {
            select: { id: true, secureUrl: true, width: true, height: true, altText: true },
          },
        },
      }),
      pageKey === "home"
        ? prisma.siteSettings.findUnique({ where: { id: 1 }, select: { heroTitle: true, heroSubtitle: true } })
        : Promise.resolve(null),
    ]);
    return normalizePageSeo(record, pageKey, siteSettings || undefined);
  } catch {
    return fallbackPageSeo(pageKey);
  }
}

export async function getAdminPageSeoSettings(): Promise<PublicPageSeo[]> {
  const [records, siteSettings] = await Promise.all([
    prisma.pageSeoSetting.findMany({
      orderBy: { id: "asc" },
      include: {
        ogMedia: {
          select: { id: true, secureUrl: true, width: true, height: true, altText: true },
        },
      },
    }),
    prisma.siteSettings.findUnique({ where: { id: 1 }, select: { heroTitle: true, heroSubtitle: true } }),
  ]);
  const byKey = new Map(records.map((record) => [record.pageKey, record as PageSeoWithMedia]));
  return PUBLIC_PAGE_DEFINITIONS.map((definition) =>
    normalizePageSeo(byKey.get(definition.pageKey) || null, definition.pageKey, siteSettings || undefined)
  );
}

const noHtml = (value: string) => !/[<>]/.test(value);

const pageSeoUpdateSchema = z.object({
  pageKey: z.string(),
  visibleTitle: z.string().trim().min(1).max(200),
  visibleDescription: z.string().trim().min(1).max(500),
  metaTitle: z.string().trim().max(255).refine(noHtml, "HTML is not allowed in meta titles"),
  metaDescription: z.string().trim().max(500).refine(noHtml, "HTML is not allowed in meta descriptions"),
  useVisibleTitleAsMetaTitle: z.boolean(),
  useVisibleDescriptionAsMetaDescription: z.boolean(),
  ogTitle: z.string().trim().max(255).refine(noHtml, "HTML is not allowed in OG titles"),
  ogDescription: z.string().trim().max(500).refine(noHtml, "HTML is not allowed in OG descriptions"),
  ogMediaId: z.number().int().positive().nullable(),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
  includeInSitemap: z.boolean(),
});

export async function updatePageSeoSettings(input: unknown) {
  if (!Array.isArray(input)) throw new Error("Page SEO settings must be an array");
  const parsed = input.map((item) => pageSeoUpdateSchema.parse(item));
  const seen = new Set<string>();
  if (parsed.length !== PUBLIC_PAGE_DEFINITIONS.length) throw new Error("All public pages must be supplied");

  for (const page of parsed) {
    if (seen.has(page.pageKey)) throw new Error("Duplicate public page key");
    seen.add(page.pageKey);
    const definition = getPageDefinition(page.pageKey);
    if (!definition) throw new Error("Unknown public page key");
    if (page.ogMediaId !== null) {
      const validation = await validateImageMediaId(page.ogMediaId, "OG media");
      if (!validation.valid) throw new Error(validation.error);
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const results: PageSeoSetting[] = [];
    for (const page of parsed) {
      const definition = getPageDefinition(page.pageKey)!;
      results.push(await tx.pageSeoSetting.upsert({
        where: { pageKey: page.pageKey },
        update: {
          routePath: definition.routePath,
          adminLabel: definition.adminLabel,
          visibleTitle: page.visibleTitle,
          visibleDescription: plainText(page.visibleDescription),
          metaTitle: page.metaTitle || null,
          metaDescription: page.metaDescription || null,
          useVisibleTitleAsMetaTitle: page.useVisibleTitleAsMetaTitle,
          useVisibleDescriptionAsMetaDescription: page.useVisibleDescriptionAsMetaDescription,
          ogTitle: page.ogTitle || null,
          ogDescription: plainText(page.ogDescription) || null,
          ogMediaId: page.ogMediaId,
          robotsIndex: page.robotsIndex,
          robotsFollow: page.robotsFollow,
          includeInSitemap: page.includeInSitemap,
        },
        create: {
          pageKey: page.pageKey,
          routePath: definition.routePath,
          adminLabel: definition.adminLabel,
          visibleTitle: page.visibleTitle,
          visibleDescription: plainText(page.visibleDescription),
          metaTitle: page.metaTitle || null,
          metaDescription: page.metaDescription || null,
          useVisibleTitleAsMetaTitle: page.useVisibleTitleAsMetaTitle,
          useVisibleDescriptionAsMetaDescription: page.useVisibleDescriptionAsMetaDescription,
          ogTitle: page.ogTitle || null,
          ogDescription: plainText(page.ogDescription) || null,
          ogMediaId: page.ogMediaId,
          robotsIndex: page.robotsIndex,
          robotsFollow: page.robotsFollow,
          includeInSitemap: page.includeInSitemap,
        },
      }));

      if (page.pageKey === "home") {
        await tx.siteSettings.update({
          where: { id: 1 },
          data: {
            heroTitle: page.visibleTitle,
            heroSubtitle: plainText(page.visibleDescription),
          },
        });
      }
    }
    return results;
  });

  for (const definition of PUBLIC_PAGE_DEFINITIONS) revalidatePath(definition.routePath);
  revalidatePath("/sitemap.xml");
  return updated;
}

export type HomepageSectionCopy = {
  sectionKey: HomepageSectionKey;
  label: string;
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  enabled: boolean;
  displayOrder: number;
};

type HomepageSectionRecord = HomepageSectionSetting;

function normalizeHomepageSection(record: HomepageSectionRecord | null, sectionKey: HomepageSectionKey): HomepageSectionCopy {
  const fallback = HOMEPAGE_SECTION_DEFINITIONS.find((definition) => definition.sectionKey === sectionKey)!;
  return {
    sectionKey,
    label: fallback.label,
    eyebrow: record?.eyebrow.trim() || fallback.fallbackEyebrow,
    heading: record?.heading.trim() || fallback.fallbackHeading,
    description: plainText(record?.description) || fallback.fallbackDescription,
    ctaLabel: record?.ctaLabel?.trim() || fallback.fallbackCtaLabel,
    ctaHref: record?.ctaHref?.trim() || fallback.fallbackCtaHref,
    enabled: record?.enabled ?? true,
    displayOrder: record?.displayOrder ?? fallback.displayOrder,
  };
}

export async function getHomepageSectionSettings(): Promise<HomepageSectionCopy[]> {
  try {
    const records = await prisma.homepageSectionSetting.findMany({ orderBy: { displayOrder: "asc" } });
    const byKey = new Map(records.map((record) => [record.sectionKey, record]));
    return HOMEPAGE_SECTION_DEFINITIONS.map((definition) =>
      normalizeHomepageSection(byKey.get(definition.sectionKey) || null, definition.sectionKey)
    ).sort((a, b) => a.displayOrder - b.displayOrder);
  } catch {
    return HOMEPAGE_SECTION_DEFINITIONS.map((definition) => normalizeHomepageSection(null, definition.sectionKey));
  }
}

const homepageSectionUpdateSchema = z.object({
  sectionKey: z.string(),
  eyebrow: z.string().trim().max(100),
  heading: z.string().trim().max(200),
  description: z.string().trim().max(500),
  ctaLabel: z.string().trim().max(100),
  ctaHref: z.string().trim().max(200),
  enabled: z.boolean(),
});

function validateInternalHref(href: string) {
  if (!href) return;
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/admin") || href.startsWith("/api")) {
    throw new Error("Homepage CTA links must be safe internal paths");
  }
}

export async function updateHomepageSectionSettings(input: unknown) {
  if (!Array.isArray(input)) throw new Error("Homepage section settings must be an array");
  const parsed = input.map((item) => homepageSectionUpdateSchema.parse(item));
  if (parsed.length !== HOMEPAGE_SECTION_DEFINITIONS.length) throw new Error("All homepage sections must be supplied");
  const seen = new Set<string>();

  for (const section of parsed) {
    if (seen.has(section.sectionKey)) throw new Error("Duplicate homepage section key");
    seen.add(section.sectionKey);
    const definition = HOMEPAGE_SECTION_DEFINITIONS.find((item) => item.sectionKey === section.sectionKey);
    if (!definition) throw new Error("Unknown homepage section key");
    validateInternalHref(section.ctaHref);
  }

  const updated = await prisma.$transaction(
    parsed.map((section) => {
      const definition = HOMEPAGE_SECTION_DEFINITIONS.find((item) => item.sectionKey === section.sectionKey)!;
      return prisma.homepageSectionSetting.upsert({
        where: { sectionKey: section.sectionKey },
        update: {
          eyebrow: plainText(section.eyebrow),
          heading: plainText(section.heading),
          description: plainText(section.description) || null,
          ctaLabel: plainText(section.ctaLabel) || null,
          ctaHref: section.ctaHref || null,
          enabled: section.enabled,
          displayOrder: definition.displayOrder,
        },
        create: {
          sectionKey: section.sectionKey,
          eyebrow: plainText(section.eyebrow),
          heading: plainText(section.heading),
          description: plainText(section.description) || null,
          ctaLabel: plainText(section.ctaLabel) || null,
          ctaHref: section.ctaHref || null,
          enabled: section.enabled,
          displayOrder: definition.displayOrder,
        },
      });
    })
  );

  revalidatePath("/");
  revalidatePath("/admin/homepage/sections");
  return updated;
}
