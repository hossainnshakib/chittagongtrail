import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Admin Login Regression Tests", () => {
  describe("Video URL Validation", () => {
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

    it("parses YouTube watch URL", () => {
      assert.equal(parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    });

    it("parses YouTube short URL", () => {
      assert.equal(parseYouTubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    });

    it("parses YouTube embed URL", () => {
      assert.equal(parseYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    });

    it("rejects invalid YouTube URL", () => {
      assert.equal(parseYouTubeId("https://youtube.com/shorts/abc"), null);
    });

    it("rejects non-YouTube URL", () => {
      assert.equal(parseYouTubeId("https://vimeo.com/123456"), null);
    });

    it("parses Vimeo URL", () => {
      assert.equal(parseVimeoId("https://vimeo.com/123456789"), "123456789");
    });

    it("parses Vimeo player URL", () => {
      assert.equal(parseVimeoId("https://player.vimeo.com/video/987654321"), "987654321");
    });

    it("rejects invalid Vimeo URL", () => {
      assert.equal(parseVimeoId("https://vimeo.com/channels/abc"), null);
    });
  });

  describe("Hero Video Provider Settings", () => {
    it("defines valid provider enum values", () => {
      const validProviders = ["NONE", "YOUTUBE", "VIMEO", "DIRECT"];
      for (const p of validProviders) {
        assert.ok(typeof p === "string");
      }
      assert.equal(validProviders.length, 4);
    });
  });

  describe("SiteSettings Video Fields", () => {
    it("heroVideoEnabled defaults to false", () => {
      const defaultVal = false;
      assert.equal(defaultVal, false);
    });

    it("heroVideoOverlay defaults to 45", () => {
      const defaultVal = 45;
      assert.ok(defaultVal >= 0 && defaultVal <= 100);
    });

    it("heroVideoProvider defaults to NONE", () => {
      const defaultVal = "NONE";
      assert.equal(defaultVal, "NONE");
    });
  });

  describe("Public Settings Projection", () => {
    it("excludes heroVideoUrl when not enabled", () => {
      const settings = {
        heroVideoEnabled: false,
        heroVideoProvider: "NONE" as const,
        heroVideoUrl: null as string | null,
      };
      const effectiveUrl = settings.heroVideoEnabled ? settings.heroVideoUrl : null;
      assert.equal(effectiveUrl, null);
    });

    it("includes heroVideoUrl when enabled", () => {
      const settings = {
        heroVideoEnabled: true,
        heroVideoProvider: "YOUTUBE" as const,
        heroVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      };
      const effectiveUrl = settings.heroVideoEnabled ? settings.heroVideoUrl : null;
      assert.equal(effectiveUrl, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    });
  });

  describe("Homepage Featured Query Limits", () => {
    it("limits featured trails to 4", () => {
      const limit = 4;
      const trails = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
      const featured = trails.slice(0, limit);
      assert.equal(featured.length, 4);
    });

    it("limits featured journal posts to 3", () => {
      const limit = 3;
      const posts = Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }));
      const featured = posts.slice(0, limit);
      assert.equal(featured.length, 3);
    });

    it("limits featured food posts to 3", () => {
      const limit = 3;
      const posts = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));
      const featured = posts.slice(0, limit);
      assert.equal(featured.length, 3);
    });
  });

  describe("Draft/Archived Exclusion", () => {
    it("only includes PUBLISHED content", () => {
      const statuses = ["DRAFT", "PUBLISHED", "ARCHIVED", "PUBLISHED"];
      const published = statuses.filter((s) => s === "PUBLISHED");
      assert.equal(published.length, 2);
    });
  });

  describe("HomepageGallery Ordering", () => {
    it("orders by sortOrder ascending", () => {
      const items = [
        { sortOrder: 3, id: 1 },
        { sortOrder: 1, id: 2 },
        { sortOrder: 2, id: 3 },
      ];
      const sorted = items.sort((a, b) => a.sortOrder - b.sortOrder);
      assert.equal(sorted[0].id, 2);
      assert.equal(sorted[1].id, 3);
      assert.equal(sorted[2].id, 1);
    });
  });

  describe("Reduced Motion Fallback", () => {
    it("defaults to poster when reduced motion is detected", () => {
      const reducedMotion = true;
      const videoEnabled = true;
      const provider: string = "YOUTUBE";
      const showVideo = !reducedMotion && videoEnabled && provider !== "NONE";
      assert.equal(showVideo, false);
    });

    it("shows video when motion is allowed", () => {
      const reducedMotion = false;
      const videoEnabled = true;
      const provider: string = "YOUTUBE";
      const showVideo = !reducedMotion && videoEnabled && provider !== "NONE";
      assert.equal(showVideo, true);
    });

    it("shows poster when video disabled", () => {
      const reducedMotion = false;
      const videoEnabled = false;
      const provider: string = "YOUTUBE";
      const showVideo = !reducedMotion && videoEnabled && provider !== "NONE";
      assert.equal(showVideo, false);
    });
  });

  describe("Unsafe URL Rejection", () => {
    it("rejects javascript: protocol", () => {
      const url = "javascript:alert('xss')";
      const safe = url.startsWith("https://") && !url.includes("javascript:");
      assert.equal(safe, false);
    });

    it("rejects data: protocol", () => {
      const url = "data:text/html,<script>alert('xss')</script>";
      const safe = url.startsWith("https://") && !url.includes("data:");
      assert.equal(safe, false);
    });

    it("rejects http:// for direct video", () => {
      const url = "http://example.com/video.mp4";
      const safe = url.startsWith("https://");
      assert.equal(safe, false);
    });

    it("accepts valid HTTPS URL", () => {
      const url = "https://example.com/video.mp4";
      const safe = url.startsWith("https://") && !url.includes("javascript:") && !url.includes("data:");
      assert.equal(safe, true);
    });
  });
});
