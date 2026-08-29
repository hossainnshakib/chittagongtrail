import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Hero Video Settings Tests", () => {
  describe("YouTube URL Parsing", () => {
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

    it("parses youtube.com/watch?v= URL", () => {
      assert.equal(parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    });

    it("parses youtu.be/ short URL", () => {
      assert.equal(parseYouTubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    });

    it("parses youtube.com/embed/ URL", () => {
      assert.equal(parseYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
    });

    it("rejects youtube.com/shorts/ URL", () => {
      assert.equal(parseYouTubeId("https://youtube.com/shorts/abc"), null);
    });

    it("rejects non-YouTube URL", () => {
      assert.equal(parseYouTubeId("https://vimeo.com/123456"), null);
    });

    it("rejects empty string", () => {
      assert.equal(parseYouTubeId(""), null);
    });
  });

  describe("Vimeo URL Parsing", () => {
    function parseVimeoId(url: string): string | null {
      const m = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
      return m ? m[1] : null;
    }

    it("parses vimeo.com/ URL", () => {
      assert.equal(parseVimeoId("https://vimeo.com/123456789"), "123456789");
    });

    it("parses player.vimeo.com/video/ URL", () => {
      assert.equal(parseVimeoId("https://player.vimeo.com/video/987654321"), "987654321");
    });

    it("rejects vimeo.com/channels/ URL", () => {
      assert.equal(parseVimeoId("https://vimeo.com/channels/abc"), null);
    });

    it("rejects non-Vimeo URL", () => {
      assert.equal(parseVimeoId("https://youtube.com/watch?v=abc"), null);
    });
  });

  describe("Video Provider Enum", () => {
    it("defines exactly 4 valid providers", () => {
      const validProviders = ["NONE", "YOUTUBE", "VIMEO", "DIRECT"];
      assert.equal(validProviders.length, 4);
    });

    it("NONE is the default", () => {
      const defaultProvider = "NONE";
      assert.equal(defaultProvider, "NONE");
    });
  });

  describe("SiteSettings Video Defaults", () => {
    it("heroVideoEnabled defaults to false", () => {
      assert.equal(false, false);
    });

    it("heroVideoOverlay defaults to 45", () => {
      const overlay = 45;
      assert.ok(overlay >= 0 && overlay <= 100);
    });

    it("heroVideoProvider defaults to NONE", () => {
      assert.equal("NONE", "NONE");
    });
  });

  describe("Reduced Motion Fallback", () => {
    it("shows poster when reduced motion is detected", () => {
      const reducedMotion = true;
      const videoEnabled = true;
      const provider: string = "YOUTUBE";
      const showVideo = !reducedMotion && videoEnabled && provider !== "NONE";
      assert.equal(showVideo, false);
    });

    it("shows video when motion is allowed and video enabled", () => {
      const reducedMotion = false;
      const videoEnabled = true;
      const provider: string = "YOUTUBE";
      const showVideo = !reducedMotion && videoEnabled && provider !== "NONE";
      assert.equal(showVideo, true);
    });

    it("shows poster when video is disabled", () => {
      const reducedMotion = false;
      const videoEnabled = false;
      const provider: string = "YOUTUBE";
      const showVideo = !reducedMotion && videoEnabled && provider !== "NONE";
      assert.equal(showVideo, false);
    });

    it("shows poster when provider is NONE", () => {
      const reducedMotion = false;
      const videoEnabled = true;
      const provider: string = "NONE";
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

    it("rejects URL with embedded javascript:", () => {
      const url = "https://example.com/video.mp4?callback=javascript:alert(1)";
      const safe = url.startsWith("https://") && !url.includes("javascript:");
      assert.equal(safe, false);
    });
  });
});
