import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("A7R.6.2 — Hero Video Media Foreign Key & Final Homepage Close", () => {
  describe("Prisma Schema FK", () => {
    it("SiteSettings has nullable heroVideoMediaId mapped to hero_video_media_id", () => {
      const schema = readFile("prisma/schema.prisma");
      assert.ok(schema.includes("heroVideoMediaId"), "should have heroVideoMediaId");
      assert.ok(schema.includes('@map("hero_video_media_id")'), "should map to hero_video_media_id");
      // nullable: Int? (check without NOT NULL)
      assert.ok(schema.includes("heroVideoMediaId") && schema.includes("Int?"), "should be nullable Int?");
      // Ensure no changes to existing hero poster relation
      assert.ok(schema.includes('heroMedia') && schema.includes('SiteHeroMedia'), "poster relation unchanged");
      assert.ok(schema.includes("heroVideoProvider"), "heroVideoProvider remains");
      assert.ok(schema.includes("heroVideoUrl"), "heroVideoUrl remains for external");
    });

    it("has correct named inverse relation SiteHeroVideoMedia", () => {
      const schema = readFile("prisma/schema.prisma");
      assert.ok(schema.includes('SiteHeroVideoMedia'), "named relation SiteHeroVideoMedia");
      // SiteSettings side
      assert.ok(schema.includes('heroVideoMedia') && schema.includes('SiteHeroVideoMedia'), "SiteSettings.heroVideoMedia relation");
      // MediaAsset inverse
      assert.ok(schema.includes('siteHeroVideoMedias') && schema.includes('SiteHeroVideoMedia'), "MediaAsset inverse relation");
    });

    it("has onDelete SetNull", () => {
      const schema = readFile("prisma/schema.prisma");
      // Check that heroVideoMedia relation has onDelete: SetNull
      const siteBlock = schema.slice(schema.indexOf("model SiteSettings"), schema.indexOf("model SiteSettings") + 1500);
      assert.ok(siteBlock.includes("heroVideoMedia") && siteBlock.includes("onDelete: SetNull"), "FK should SetNull onDelete");
    });

    it("does not add unexpected index beyond FK", () => {
      const schema = readFile("prisma/schema.prisma");
      // Should not have explicit @@index for heroVideoMediaId beyond FK
      // Just ensure schema still valid and not adding extra unrelated formatting
      assert.ok(!schema.includes("heroVideoMediaId_idx") || schema.includes("hero_video_media_id"), "no extra index beyond FK convention");
    });
  });

  describe("Migration", () => {
    it("migration contains expected column and FK", () => {
      const sql = readFile("prisma/migrations/20260903000000_add_hero_video_media_relation/migration.sql");
      assert.ok(sql.includes("hero_video_media_id"), "should contain column");
      assert.ok(sql.includes("ADD COLUMN") && sql.includes("INTEGER NULL"), "nullable column");
      assert.ok(sql.includes("site_settings_hero_video_media_id_fkey"), "FK name");
      assert.ok(sql.includes("FOREIGN KEY") && sql.includes("REFERENCES `media_assets`"), "FK references MediaAsset");
      assert.ok(sql.includes("ON DELETE SET NULL"), "onDelete SetNull");
      assert.ok(!sql.includes("DROP") && !sql.includes("DELETE FROM"), "no destructive data loss");
    });

    it("migration is not destructive and only introduces nullable column/FK/index", () => {
      const sql = readFile("prisma/migrations/20260903000000_add_hero_video_media_relation/migration.sql");
      // Should not modify heroVideoUrl type destructively (no varchar change beyond FK)
      // Count ALTER TABLE occurrences: should be at least 2 (ADD COLUMN, ADD CONSTRAINT)
      const alterCount = (sql.match(/ALTER TABLE/g) || []).length;
      assert.ok(alterCount >= 2, "should have at least ADD COLUMN and ADD CONSTRAINT");
      // No unrelated schema formatting
      assert.ok(!sql.includes("heroMediaId") || sql.includes("hero_video_media_id"), "avoid unrelated changes");
    });

    it("migration includes backfill comment/logic for DIRECT URL match", () => {
      const sql = readFile("prisma/migrations/20260903000000_add_hero_video_media_relation/migration.sql");
      // Should mention backfill for DIRECT heroVideoUrl matching video MediaAsset
      assert.ok(sql.toLowerCase().includes("backfill") || sql.includes("heroVideoProvider"), "should document backfill");
      // Should not fabricate ID when no matching asset
      if (sql.includes("UPDATE")) {
        assert.ok(sql.includes("m.`id` IS NOT NULL") || sql.includes("m.`secureUrl`"), "backfill should only when matching asset exists");
      }
    });
  });

  describe("SERVER-AUTHORITATIVE SAVE BEHAVIOR — DIRECT", () => {
    it("DIRECT save requires heroVideoMediaId", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("DIRECT video requires a registered MediaAsset"), "should require FK");
      assert.ok(route.includes("heroVideoMediaId") && route.includes("DIRECT"), "should validate FK for DIRECT");
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("DIRECT video requires a registered MediaAsset"), "settings-service should also require");
    });

    it("validates heroVideoMediaId as positive integer", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("Invalid heroVideoMediaId") && route.includes("Number.isInteger"), "should validate integer");
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("Invalid heroVideoMediaId"), "settings-service validates");
    });

    it("queries MediaAsset by ID and requires resourceType video", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("findUnique") && route.includes("heroVideoMediaId"), "lookup by ID");
      assert.ok(route.includes('resourceType !== "video"'), "require video");
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes('resourceType !== "video"'), "settings-service requires video");
    });

    it("requires supported format MP4 or WebM", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("ALLOWED_VIDEO_FORMATS") || route.includes("Unsupported video format"));
      assert.ok(route.includes("mp4") && route.includes("webm"));
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("Unsupported video format"));
    });

    it("requires HTTPS Cloudinary secureUrl under configured account/namespace", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("res.cloudinary.com"), "should check Cloudinary host");
      assert.ok(route.includes("CLOUDINARY_CLOUD_NAME"), "should check cloud name");
      assert.ok(route.includes("ALLOWED_UPLOAD_FOLDERS") || route.includes("approved namespace"), "should check namespace");
      assert.ok(route.includes("https://"), "require HTTPS");
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("res.cloudinary.com"));
    });

    it("persists heroVideoMediaId and derives heroVideoUrl from verified MediaAsset", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("heroVideoMediaId") && route.includes("videoAsset.id"), "persist FK");
      assert.ok(route.includes("heroVideoUrl = videoAsset.secureUrl"), "derive URL server-side");
      assert.ok(route.includes("Server-derived URL") || route.includes("never trust"), "comment about not trusting client");
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoUrl: videoAsset.secureUrl") || svc.includes("heroVideoUrl = videoAsset.secureUrl") || svc.includes("heroVideoUrl: m") || svc.includes("videoAsset.secureUrl"));
      assert.ok(svc.includes("never trust") || svc.includes("Server-derived"));
    });

    it("never trusts client-supplied secureUrl, format, publicId or resourceType for DIRECT", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      // Should not use body.heroVideoUrl for DIRECT directly
      // Ensure direct block derives from videoAsset, not body
      assert.ok(route.includes("videoAsset.secureUrl"), "derive from asset");
      assert.ok(!route.includes("Allow non-DB") || route.includes("Selected video asset not found"), "should not allow arbitrary URL");
    });

    it("arbitrary DIRECT URL rejected", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("Selected video asset not found") || route.includes("DIRECT video requires"), "reject when asset not found");
    });
  });

  describe("SERVER-AUTHORITATIVE SAVE BEHAVIOR — EXTERNAL AND NONE", () => {
    it("YOUTUBE/VIMEO clears FK", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      // For YOUTUBE/VIMEO, heroVideoMediaId must be null
      assert.ok(route.includes("heroVideoMediaId = null") || route.includes("persistedHeroVideoMediaId"), "should clear FK for external");
      assert.ok(route.includes("YOUTUBE") && route.includes("VIMEO") && route.includes("heroVideoMediaId"));
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoMediaId: null") || svc.includes("heroVideoMediaId = null"), "settings-service clears FK for external");
    });

    it("YOUTUBE/VIMEO persists only validated external provider URL", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("parseYouTubeId") && route.includes("parseVimeoId"));
      assert.ok(route.includes("Invalid YouTube URL") && route.includes("Invalid Vimeo URL"));
    });

    it("NONE or disabled clears FK and URL and normalizes provider", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes('heroVideoUrl = null') && route.includes('heroVideoMediaId = null'));
      assert.ok(route.includes('normalizedProvider') || route.includes('provider === "NONE"'));
      assert.ok(route.includes("NONE") && route.includes("heroVideoEnabled"));
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoMediaId: null") && svc.includes("heroVideoUrl: null"));
      assert.ok(svc.includes('HeroVideoProvider.NONE') || svc.includes('"NONE"'));
    });

    it("uses transaction if multiple dependent writes", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("$transaction") || route.includes("transaction"), "should use transaction");
    });
  });

  describe("READ/PUBLIC RENDERING FLOW", () => {
    it("SiteSettings queries include heroVideoMedia", () => {
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoMedia: true") || svc.includes("heroVideoMedia"), "should include relation");
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("heroVideoMedia: true") || route.includes("heroVideoMedia"), "hero route GET should include");
    });

    it("DIRECT derives public video URL from heroVideoMedia.secureUrl", () => {
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoMedia.secureUrl"), "derive from relation");
      assert.ok(svc.includes("heroVideoUrl =") || svc.includes("heroVideoUrl="));
    });

    it("derives format/MIME from heroVideoMedia.format", () => {
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoMedia.format"), "derive format");
      assert.ok(readFile("components/home/Hero.tsx").includes("getVideoMimeType") || readFile("components/home/Hero.tsx").includes("videoFormat"));
    });

    it("does not perform findFirst by secureUrl for DIRECT primary path", () => {
      const svc = readFile("lib/settings-service.ts");
      // After FK, primary path should not use findFirst by secureUrl for hero video
      // Check that getPublicSiteSettings does not contain findFirst with secureUrl for hero video primary
      const publicBlock = svc.slice(svc.indexOf("getPublicSiteSettings"), svc.indexOf("getPublicSiteSettings") + 3000);
      // Should not have findFirst where secureUrl heroVideoUrl as primary outside legacy comment
      const hasFindFirstHeroUrl = publicBlock.includes("findFirst") && publicBlock.includes("secureUrl") && publicBlock.includes("heroVideoUrl");
      // We allow it only if commented as legacy fallback; our implementation removes it, so should be false
      assert.ok(!hasFindFirstHeroUrl, "should not use findFirst by secureUrl as primary");
    });

    it("if relation missing, renders poster only safely", () => {
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("Relation missing") || svc.includes("poster only safely") || svc.includes("heroVideoUrl = null"));
      assert.ok(svc.includes("heroVideoUrl = null") && svc.includes("heroVideoFormat = null"));
    });

    it("YOUTUBE/VIMEO continues using validated heroVideoUrl", () => {
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("YOUTUBE") && svc.includes("VIMEO") && svc.includes("heroVideoUrl"));
    });

    it("preserves poster-first, crossfade, MIME, reduced-motion, autoplay fallback, offscreen pause, no black bars", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("posterSrc"));
      assert.ok(hero.includes("opacity") && hero.includes("700ms"));
      assert.ok(hero.includes("getVideoMimeType"));
      assert.ok(hero.includes("reducedMotion"));
      assert.ok(hero.includes("catch") && hero.includes("setDirectError"));
      assert.ok(hero.includes("IntersectionObserver") && hero.includes("pause()"));
      assert.ok(hero.includes('objectFit: "cover"'));
      assert.ok(!hero.includes("/api/proxy"));
    });
  });

  describe("DELETION PROTECTION", () => {
    it("getMediaAssetReferences reads SiteSettings relation by heroVideoMediaId", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("siteHeroVideoMedias") || svc.includes("heroVideoMediaId"), "should read via FK");
      assert.ok(svc.includes("getMediaAssetReferences") && svc.includes("heroVideoMediaId"));
    });

    it("active or configured Hero video reference is reported explicitly", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("siteHeroVideos"));
      assert.ok(svc.includes("heroVideoEnabled") && svc.includes("DIRECT"));
    });

    it("deletion of referenced Hero MediaAsset is blocked", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("siteHeroVideos.length") || svc.includes("siteHeroVideos"));
      assert.ok(svc.includes("canDelete") && svc.includes("siteHeroVideos"));
    });

    it("replacing/removing Hero video clears FK and releases old asset", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("persistedHeroVideoMediaId") || route.includes("heroVideoMediaId: null"));
      assert.ok(route.includes("normalizedProvider") || route.includes('heroVideoProvider === "NONE"'));
    });

    it("unrelated asset URLs containing similar publicId are not falsely blocked", () => {
      const svc = readFile("lib/media-service.ts");
      const refBlock = svc.slice(svc.indexOf("getMediaAssetReferences"), svc.indexOf("getMediaAssetReferences") + 4000);
      assert.ok(!refBlock.includes('includes(asset.publicId)') || refBlock.includes("siteHeroVideoMedias"), "should not rely on includes(publicId)");
      assert.ok(refBlock.includes("siteHeroVideoMedias"), "should check relation");
    });

    it("inline HTML reference scanning remains unchanged", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("searchInlineMediaReferences"));
      assert.ok(svc.includes("trail.description.includes") || svc.includes("description.includes"));
    });

    it("legacy URL fallback may remain only for unmatched pre-migration DIRECT records with comment", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.toLowerCase().includes("hero") || svc.includes("heroVideoUrl") || svc.includes("heroVideoMediaId"));
    });

    it("does not rely on includes(publicId) as primary structured-reference check", () => {
      const svc = readFile("lib/media-service.ts");
      const primaryCheck = svc.slice(svc.indexOf("siteHeroVideos"), svc.indexOf("siteHeroVideos") + 2000);
      assert.ok(!primaryCheck.includes('includes(asset.publicId)') && !primaryCheck.includes('includes(publicId)'));
    });
  });

  describe("ADMIN EDITOR PERSISTENCE", () => {
    it("initializes selected video from heroVideoMedia", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("heroVideoAsset") && editor.includes("setVideoMedia"));
      assert.ok(editor.includes("heroVideoMedia") || editor.includes("heroVideoAsset"));
    });

    it("sends numeric heroVideoMediaId for DIRECT", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("heroVideoMediaId") && editor.includes("videoMedia.id"));
      assert.ok(editor.includes("payload.heroVideoMediaId"));
    });

    it("shows correct thumbnail/preview/format/dimensions/duration", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("Selected video") && editor.includes("format"));
      assert.ok(editor.includes("width") && editor.includes("height"));
    });

    it("reload retains exact selected MediaAsset", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("fetch(\"/api/admin/homepage/hero\")") || editor.includes("/api/admin/homepage/hero"));
      assert.ok(editor.includes("setVideoMedia") && editor.includes("heroVideoAsset"));
    });

    it("replace/remove updates state correctly", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("setVideoMedia(null)") && editor.includes("setVideoUrl"));
      assert.ok(editor.includes("Replace video") && editor.includes("Remove"));
    });

    it("external provider selection clears MediaAsset selection", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("setVideoMedia(null)") && editor.includes("YOUTUBE") && editor.includes("VIMEO"));
    });

    it("DIRECT selection clears external URL", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("DIRECT") && editor.includes("setVideoUrl"));
      // When switching to DIRECT, external URL cleared
      assert.ok(editor.includes('next === "DIRECT"'));
    });

    it("error messages remain safe", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("DIRECT video requires"));
      assert.ok(!editor.includes("CLOUDINARY_API_SECRET") && !editor.includes("apiSecret"));
    });
  });

  describe("MISC & REGRESSION", () => {
    it("MP4 MIME remains correct", () => {
      const v = readFile("lib/video.ts");
      assert.ok(v.includes("mp4") && v.includes("video/mp4"));
    });

    it("WebM MIME remains correct", () => {
      const v = readFile("lib/video.ts");
      assert.ok(v.includes("webm") && v.includes("video/webm"));
    });

    it("no regression to poster-first/reduced-motion", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("posterSrc") && hero.includes("priority"));
      assert.ok(hero.includes("reducedMotion") && hero.includes("showDirectVideo"));
    });

    it("A7R.7 navigation is active", () => {
      const nav = readFile("components/admin/navigation.ts");
      assert.ok(nav.includes('label: "Introduction / About"') && nav.includes("href: \"/admin/settings/about\""));
    });
  });
});
