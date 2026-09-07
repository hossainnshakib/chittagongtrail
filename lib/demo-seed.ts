import type { PrismaClient, Prisma } from "@prisma/client";
import { ALLOWED_UPLOAD_FOLDERS } from "./cloudinary";
import { assertLocalDemoEnvironment, demoTrails, demoPosts, demoSite, demoPages, demoSections, ownsDemoRecord } from "./demo-data";

export type SeedCounts = Record<string, { created: number; updated: number; skipped: number }>;

// Shared settings have no ownership column. Only initialize empty fields; never replace owner values.
export function emptyFieldPatch(existing: Record<string, unknown>, desired: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(desired).filter(([key, value]) =>
    key !== "id" && value != null && value !== "" && (existing[key] == null || existing[key] === "")
  ));
}

export async function seedDemo(prisma: PrismaClient, env: NodeJS.ProcessEnv = process.env) {
  assertLocalDemoEnvironment(env);
  return prisma.$transaction(async tx => {
    const counts: SeedCounts = {};
    const count = (model: string, result: "created" | "updated" | "skipped") => {
      counts[model] ??= { created: 0, updated: 0, skipped: 0 };
      counts[model][result]++;
    };
    // Check every collision before writing; a matching slug alone never establishes ownership.
    for (const data of demoTrails) {
      const existing = await tx.trailLocation.findUnique({ where: { slug: data.slug } });
      if (existing && !ownsDemoRecord(existing)) throw new Error(`Reserved demo slug is owner content: ${data.slug}`);
    }
    for (const data of demoPosts) {
      const existing = await tx.journalPost.findUnique({ where: { slug: data.slug } });
      if (existing && !ownsDemoRecord(existing)) throw new Error(`Reserved demo slug is owner content: ${data.slug}`);
    }
    const cloud = env.CLOUDINARY_CLOUD_NAME;
    const media = (await tx.mediaAsset.findMany({ where: { resourceType: "image" }, orderBy: { id: "asc" } })).filter(asset => {
      try {
        const url = new URL(asset.secureUrl);
        return !!cloud && url.protocol === "https:" && url.hostname === "res.cloudinary.com"
          && !url.username && !url.password && url.pathname.startsWith(`/${cloud}/image/upload/`)
          && ALLOWED_UPLOAD_FOLDERS.some(folder => asset.publicId.startsWith(`${folder}/`));
      } catch { return false; }
    }).slice(0, 8);
    const cover = media[0] ? { connect: { id: media[0].id } } : undefined;
    const trails = [];
    let trailSlots = Math.max(0, 4 - await tx.trailLocation.count({ where: { isFeatured: true, NOT: { slug: { in: demoTrails.map(d => d.slug) } } } }));
    for (const data of demoTrails) {
      const exists = await tx.trailLocation.findUnique({ where: { slug: data.slug } });
      const featured = !!data.isFeatured && trailSlots-- > 0;
      const value = { ...data, isFeatured: featured, featuredOrder: featured ? data.featuredOrder : null, coverMedia: cover };
      const trail = await tx.trailLocation.upsert({ where: { slug: data.slug }, create: value, update: value });
      trails.push(trail);
      count("trails", exists ? "updated" : "created");
      for (const asset of media) {
        const where = { trailId_mediaAssetId: { trailId: trail.id, mediaAssetId: asset.id } };
        const prior = await tx.trailGallery.findUnique({ where });
        await tx.trailGallery.upsert({ where, create: { trailId: trail.id, mediaAssetId: asset.id, sortOrder: media.indexOf(asset) }, update: {} });
        count("trailGallery", prior ? "skipped" : "created");
      }
    }
    for (const type of ["STORY", "FOOD"] as const) {
      let slots = Math.max(0, 3 - await tx.journalPost.count({ where: { type, isFeatured: true, NOT: { slug: { in: demoPosts.map(d => d.slug) } } } }));
      for (const data of demoPosts.filter(d => d.type === type)) {
        const exists = await tx.journalPost.findUnique({ where: { slug: data.slug } });
        const featured = slots-- > 0;
        const value = { ...data, isFeatured: featured, featuredOrder: featured ? data.featuredOrder : null, coverMedia: cover, trail: { connect: { id: trails[(Number(data.featuredOrder) - 1) % trails.length].id } } };
        await tx.journalPost.upsert({ where: { slug: data.slug }, create: value, update: value });
        count(type === "FOOD" ? "food" : "stories", exists ? "updated" : "created");
      }
    }
    const settings = await tx.siteSettings.findUnique({ where: { id: 1 } });
    const patch = settings ? emptyFieldPatch(settings, demoSite) : {};
    await tx.siteSettings.upsert({ where: { id: 1 }, create: demoSite, update: patch as Prisma.SiteSettingsUpdateInput });
    count("siteSettings", !settings ? "created" : Object.keys(patch).length ? "updated" : "skipped");
    for (const data of demoPages) {
      const existing = await tx.pageSeoSetting.findUnique({ where: { pageKey: data.pageKey } });
      const patch = existing ? emptyFieldPatch(existing, data) : {};
      await tx.pageSeoSetting.upsert({ where: { pageKey: data.pageKey }, create: data, update: patch });
      count("publicPages", !existing ? "created" : Object.keys(patch).length ? "updated" : "skipped");
    }
    for (const data of demoSections) {
      const existing = await tx.homepageSectionSetting.findUnique({ where: { sectionKey: data.sectionKey } });
      const patch = existing ? emptyFieldPatch(existing, data) : {};
      await tx.homepageSectionSetting.upsert({ where: { sectionKey: data.sectionKey }, create: data, update: patch });
      count("homepageSections", !existing ? "created" : Object.keys(patch).length ? "updated" : "skipped");
    }
    const galleryCount = await tx.homepageGallery.count();
    for (const asset of media.slice(0, Math.max(0, 8 - galleryCount))) {
      const where = { mediaAssetId: asset.id };
      const prior = await tx.homepageGallery.findUnique({ where });
      await tx.homepageGallery.upsert({ where, create: { mediaAssetId: asset.id, sortOrder: galleryCount + media.indexOf(asset) }, update: {} });
      count("homepageGallery", prior ? "skipped" : "created");
    }
    for (const key of ["trailGallery", "homepageGallery"]) counts[key] ??= { created: 0, updated: 0, skipped: 0 };
    return { counts, validMedia: media.length, mediaAction: media.length ? "Reused existing assets; no uploads." : "Owner media upload required; image galleries remain empty.", settingsPolicy: "Only empty shared settings fields initialized. Existing owner values retained.", contactAction: "Replace example email, fictional phone/WhatsApp and platform-homepage social links before publishing." };
  }, { timeout: 30000 });
}
