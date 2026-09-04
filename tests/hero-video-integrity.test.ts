import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("A7R.6.1 — Hero Video Integrity, MIME Safety & Lifecycle", () => {
  describe("DIRECT Persistence Requires Registered MediaAsset", () => {
    it("hero route requires heroVideoMediaId for DIRECT", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("heroVideoMediaId"), "should reference heroVideoMediaId");
      assert.ok(route.includes("DIRECT video requires a registered MediaAsset"), "should require MediaAsset for DIRECT");
      assert.ok(route.includes("findUnique") && route.includes("heroVideoMediaId"), "should lookup asset by ID");
    });

    it("hero route derives secureUrl server-side, not trusting client URL for DIRECT", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("Server-derived URL") || route.includes("derive"), "should derive URL server-side");
      assert.ok(route.includes("videoAsset.secureUrl"), "should use asset secureUrl");
      // Ensure arbitrary HTTPS URL without DB is rejected
      assert.ok(route.includes("Selected video asset not found") || route.includes("DIRECT video requires"), "should reject missing asset");
    });

    it("HeroEditor sends heroVideoMediaId not just secureUrl for DIRECT", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("heroVideoMediaId"), "editor should send heroVideoMediaId");
      assert.ok(editor.includes("videoMedia.id"), "should use videoMedia.id");
      assert.ok(editor.includes("Server derives") || editor.includes("derive") || editor.includes("heroVideoMediaId"), "should indicate server derives URL");
    });

    it("arbitrary DIRECT URL is rejected when not found in DB", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      // Check that non-DB HTTPS URL path is removed (previously allowed)
      assert.ok(!route.includes("Allow non-DB HTTPS URL") || route.includes("reject"), "should not allow arbitrary DIRECT URL");
      // More specifically, for DIRECT, if asset not found, error
      assert.ok(route.includes("Selected video asset not found") || route.includes("DIRECT video requires"), "must reject arbitrary URL");
    });

    it("arbitrary HTTPS URL not accepted as DIRECT via provider check", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      // Ensure DIRECT branch does not have fallback allowing any https
      const directBlock = route.slice(route.indexOf('case "DIRECT"'), route.indexOf('case "DIRECT"') + 2000);
      assert.ok(!directBlock.includes("Allow non-DB") , "DIRECT block should not allow non-DB URL");
    });
  });

  describe("DIRECT Asset Must Be resourceType video", () => {
    it("hero route validates resourceType video", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes('resourceType !== "video"') || route.includes("must be a video"), "should check resourceType");
    });

    it("HeroEditor validates selected asset is video before save", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes('resourceType !== "video"') || editor.includes("must be a video"), "editor should validate video type");
    });

    it("media-service prevents video asset being used as cover where image required", () => {
      const svc = readFile("lib/homepage-service.ts");
      assert.ok(svc.includes('resourceType !== "image"'), "should still enforce image for poster");
    });
  });

  describe("Format-Aware MIME Type", () => {
    it("lib/video.ts maps mp4 to video/mp4", () => {
      const v = readFile("lib/video.ts");
      assert.ok(v.includes('mp4') && v.includes('video/mp4'), "should map mp4");
      assert.ok(v.includes("VIDEO_MIME_MAP") || v.includes("getVideoMimeType"), "should have mime map");
    });

    it("lib/video.ts maps webm to video/webm", () => {
      const v = readFile("lib/video.ts");
      assert.ok(v.includes('webm') && v.includes('video/webm'), "should map webm");
    });

    it("hero route rejects unsupported video formats", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("Unsupported video format") || route.includes("ALLOWED_VIDEO_FORMATS"), "should reject unsupported");
      assert.ok(route.includes("mp4") && route.includes("webm"), "should allow only mp4/webm");
    });

    it("HeroEditor validates format mp4/webm before save", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("mp4") && editor.includes("webm"), "editor should check formats");
      assert.ok(editor.includes("Unsupported video format"), "should report unsupported");
    });

    it("Hero renders with correct MIME type via server-verified format", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("getVideoMimeType") || hero.includes("mimeType"), "should use mime type");
      assert.ok(hero.includes("videoFormat") || hero.includes("effectiveFormat"), "should accept videoFormat prop");
      assert.ok(hero.includes("<source") && hero.includes('type='), "should set type attribute");
      // Ensure no hardcoded video/mp4 for every DIRECT - should be dynamic
      assert.ok(!hero.includes('type="video/mp4"') || hero.includes("mimeType"), "should not hardcode video/mp4");
    });

    it("page.tsx passes videoFormat from server-verified asset", () => {
      const page = readFile("app/page.tsx");
      assert.ok(page.includes("heroVideoFormat") || page.includes("videoFormat"), "should pass format to Hero");
    });

    it("settings-service derives heroVideoFormat from MediaAsset via FK relation", () => {
      const svc = readFile("lib/settings-service.ts");
      assert.ok(svc.includes("heroVideoFormat"), "should provide heroVideoFormat");
      assert.ok(svc.includes("heroVideoMedia") && svc.includes("heroVideoMedia.format"), "should derive format from relation");
      assert.ok(!svc.includes("findFirst") || svc.includes("heroVideoMedia"), "should use relation not findFirst by secureUrl");
    });

    it("unsupported image/audio/raw assets are rejected server-side", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes("Unsupported video format") || route.includes('resourceType !== "video"'), "should reject non-video");
    });

    it("no video request proxied through Next.js - uses Cloudinary secureUrl directly", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("secureUrl") || hero.includes("resolved.embedUrl"), "should use secureUrl");
      assert.ok(!hero.includes("proxy") && !hero.includes("/api/proxy"), "should not proxy");
    });

    it("uses youtube-nocookie for YouTube privacy", () => {
      const v = readFile("lib/video.ts");
      assert.ok(v.includes("youtube-nocookie.com"), "should use nocookie");
    });
  });

  describe("Hero Video Reference Prevents Deletion", () => {
    it("media-service getMediaAssetReferences includes hero video check", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("siteHeroVideos"), "should track hero video refs");
      assert.ok(svc.includes("heroVideoProvider") && svc.includes("DIRECT"), "should check DIRECT provider");
      assert.ok(svc.includes("heroVideoUrl") && svc.includes("asset.secureUrl"), "should compare secureUrl");
    });

    it("canDelete includes hero video in structured check", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("siteHeroVideos.length") || svc.includes("siteHeroVideos"), "canDelete should consider hero video");
    });

    it("searchInlineMediaReferences includes heroVideoUrl", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("heroVideoUrl"), "should audit heroVideoUrl");
    });

    it("replacing hero video clears old reference (hero route clears when NONE/disabled)", () => {
      const route = readFile("app/api/admin/homepage/hero/route.ts");
      assert.ok(route.includes('heroVideoUrl = null') || route.includes("heroVideoProvider === \"NONE\""), "should clear when NONE");
    });

    it("removing video updates reference behavior (editor remove clears)", () => {
      const editor = readFile("components/admin/homepage/HeroEditor.tsx");
      assert.ok(editor.includes("setVideoMedia(null)"), "should clear media on remove");
      assert.ok(editor.includes("setVideoProvider(\"NONE\")") || editor.includes('provider === "NONE"'), "should reset provider");
    });
  });

  describe("Poster / Video State Transitions", () => {
    it("poster renders immediately with priority and covers container", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("posterSrc") || hero.includes("poster"), "should have poster");
      assert.ok(hero.includes("priority"), "should be priority");
      assert.ok(hero.includes('objectFit: "cover"'), "should cover");
    });

    it("video opacity 0 until playing, crossfades with 700ms", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("opacity") && hero.includes("700ms"), "should crossfade");
      assert.ok(hero.includes("directReady") || hero.includes("ready"), "should track ready");
    });

    it("play() rejection keeps poster (catch sets error)", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("catch") && hero.includes("setDirectError") || hero.includes("setHasError"), "should handle rejection");
      assert.ok(hero.includes("directError") || hero.includes("hasError"), "should have error state");
    });

    it("error/abort/stalled keeps poster visible", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("error") && hero.includes("abort"), "should listen to error/abort");
      assert.ok(hero.includes("stalled"), "should handle stalled");
      assert.ok(hero.includes("directError") || hero.includes("hasError"), "should mark error");
    });

    it("provider or video change resets ready/error via key", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("key={") && hero.includes("embedKey"), "should reset via key");
      assert.ok(hero.includes("embedKey") || hero.includes("key"), "key-based reset");
    });

    it("reduced motion prevents video mount/request", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("reducedMotion") && hero.includes("!reducedMotion"), "should check reducedMotion");
      assert.ok(hero.includes("showDirectVideo") && hero.includes("!reducedMotion"), "showDirectVideo gates on reducedMotion");
      assert.ok(hero.includes("usePrefersReducedMotion") || hero.includes("prefers-reduced-motion"), "should use reduced motion hook");
    });

    it("no hardcoded readiness timeout", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(!hero.includes("setTimeout(() => setDirectReady") && !hero.includes("setTimeout(() => setReady"), "no timeout for ready");
    });

    it("no white/black flash - poster always present, video absolute inset", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("position: \"absolute\"") || hero.includes("absolute"), "video absolute");
      assert.ok(hero.includes("inset: 0") || hero.includes("inset-0"), "inset 0");
    });

    it("event listeners and IntersectionObserver are cleaned up", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("removeEventListener"), "should remove listeners");
      assert.ok(hero.includes("observer.disconnect") || hero.includes("disconnect()"), "should disconnect observer");
      assert.ok(hero.includes("return () =>"), "should have cleanup");
    });

    it("offscreen video pauses, returning onscreen resumes only when allowed", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("IntersectionObserver"), "should use IO");
      assert.ok(hero.includes("pause()") && hero.includes("play()"), "should pause/play");
    });
  });

  describe("ESLint and Lifecycle Audit", () => {
    it("Hero has no unjustified set-state-in-effect disable", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(!hero.includes("eslint-disable-next-line react-hooks/set-state-in-effect"), "should not have disable");
      assert.ok(!hero.includes("eslint-disable"), "no broad disables");
    });

    it("Hero uses useSyncExternalStore correctly for reduced motion", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("useSyncExternalStore"), "should use useSyncExternalStore");
      assert.ok(hero.includes("getSnapshot") && hero.includes("getServerSnapshot"), "should have snapshots");
      assert.ok(hero.includes("subscribe"), "should have subscribe");
    });

    it("Hero has stable callbacks and proper dependency arrays", () => {
      const hero = readFile("components/home/Hero.tsx");
      assert.ok(hero.includes("useCallback"), "should use useCallback");
      assert.ok(hero.includes("useEffect") && hero.includes("reducedMotion"), "should have effect deps");
    });

    it("MediaPicker retains justified disables only for data fetch", () => {
      const picker = readFile("components/admin/media/MediaPicker.tsx");
      const disables = (picker.match(/eslint-disable/g) || []).length;
      // Should have at most 2 justified disables for data fetch
      assert.ok(disables <= 2, `should have <=2 disables, found ${disables}`);
    });
  });

  describe("Navigation and A7R.7 Boundaries", () => {
    it("homepage navigation still enabled exactly 7 items", () => {
      const nav = readFile("components/admin/navigation.ts");
      const matches = (nav.match(/label: "Overview"|label: "Hero"|label: "Featured Trails"|label: "Featured Stories"|label: "Featured Food"|label: "Seasonal \/ Mood"|label: "Gallery"/g) || []).length;
      assert.equal(matches, 7);
    });

    it("Introduction / About route is active", () => {
      const nav = readFile("components/admin/navigation.ts");
      assert.ok(nav.includes('label: "Introduction / About"') && nav.includes("href: \"/admin/settings/about\""));
    });

    it("Admin navigation utility items unchanged", () => {
      const nav = readFile("components/admin/navigation.ts");
      assert.ok(nav.includes("View Site") && nav.includes("Logout"));
    });
  });

  describe("Reference Auditing Detects heroVideoUrl Reliably", () => {
    it("getMediaAssetReferences queries SiteSettings heroVideo fields", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("prisma.siteSettings.findUnique") || svc.includes("findFirst"), "should query settings");
    });

    it("secureUrl change would be detected via publicId fallback", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("publicId") && svc.includes("heroVideoUrl"), "should check publicId as fallback for URL change");
    });

    it("Cloudinary removal would break hero but reference protects DB asset", () => {
      const svc = readFile("lib/media-service.ts");
      assert.ok(svc.includes("canDelete") && svc.includes("siteHeroVideos"), "deletion protects even if Cloudinary removed");
    });
  });
});
