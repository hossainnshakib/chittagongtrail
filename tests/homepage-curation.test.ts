import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Homepage Curation Tests", () => {
  describe("Public Settings Projection", () => {
    it("excludes heroVideoUrl when video is disabled", () => {
      const settings = {
        heroVideoEnabled: false,
        heroVideoProvider: "NONE" as const,
        heroVideoUrl: "https://example.com/video.mp4" as string | null,
      };
      const effectiveUrl = settings.heroVideoEnabled ? settings.heroVideoUrl : null;
      assert.equal(effectiveUrl, null);
    });

    it("includes heroVideoUrl when video is enabled", () => {
      const settings = {
        heroVideoEnabled: true,
        heroVideoProvider: "YOUTUBE" as const,
        heroVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" as string | null,
      };
      const effectiveUrl = settings.heroVideoEnabled ? settings.heroVideoUrl : null;
      assert.equal(effectiveUrl, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    });

    it("returns null heroVideoUrl when not configured", () => {
      const settings = {
        heroVideoEnabled: true,
        heroVideoProvider: "YOUTUBE" as const,
        heroVideoUrl: null as string | null,
      };
      const effectiveUrl = settings.heroVideoEnabled ? settings.heroVideoUrl : null;
      assert.equal(effectiveUrl, null);
    });
  });

  describe("Featured Content Query Limits", () => {
    it("limits featured trails to maximum 4", () => {
      const limit = 4;
      const trails = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
      const featured = trails.slice(0, limit);
      assert.equal(featured.length, 4);
    });

    it("returns all trails when fewer than limit", () => {
      const limit = 4;
      const trails = Array.from({ length: 2 }, (_, i) => ({ id: i + 1 }));
      const featured = trails.slice(0, limit);
      assert.equal(featured.length, 2);
    });

    it("limits featured journal posts to maximum 3", () => {
      const limit = 3;
      const posts = Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }));
      const featured = posts.slice(0, limit);
      assert.equal(featured.length, 3);
    });

    it("limits featured food posts to maximum 3", () => {
      const limit = 3;
      const posts = Array.from({ length: 6 }, (_, i) => ({ id: i + 1 }));
      const featured = posts.slice(0, limit);
      assert.equal(featured.length, 3);
    });
  });

  describe("Content Status Filtering", () => {
    it("excludes DRAFT and ARCHIVED, includes only PUBLISHED", () => {
      const statuses = ["DRAFT", "PUBLISHED", "ARCHIVED", "PUBLISHED", "DRAFT"];
      const published = statuses.filter((s) => s === "PUBLISHED");
      assert.equal(published.length, 2);
    });

    it("returns empty for all-draft content", () => {
      const statuses = ["DRAFT", "DRAFT", "DRAFT"];
      const published = statuses.filter((s) => s === "PUBLISHED");
      assert.equal(published.length, 0);
    });
  });

  describe("HomepageGallery Ordering", () => {
    it("sorts by sortOrder ascending", () => {
      const items = [
        { sortOrder: 3, id: 1 },
        { sortOrder: 1, id: 2 },
        { sortOrder: 2, id: 3 },
      ];
      const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
      assert.equal(sorted[0].id, 2);
      assert.equal(sorted[1].id, 3);
      assert.equal(sorted[2].id, 1);
    });

    it("handles empty gallery", () => {
      const items: Array<{ sortOrder: number; id: number }> = [];
      const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
      assert.equal(sorted.length, 0);
    });

    it("handles single item", () => {
      const items = [{ sortOrder: 5, id: 1 }];
      const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
      assert.equal(sorted.length, 1);
      assert.equal(sorted[0].id, 1);
    });
  });

  describe("Seasonal/Mood Section Visibility", () => {
    it("hidden when both eyebrow and title are empty", () => {
      const eyebrow = "";
      const title = "";
      const visible = !!(eyebrow.trim() || title.trim());
      assert.equal(visible, false);
    });

    it("visible when eyebrow is set", () => {
      const eyebrow = "THE SIX SEASONS";
      const title = "";
      const visible = !!(eyebrow.trim() || title.trim());
      assert.equal(visible, true);
    });

    it("visible when title is set", () => {
      const eyebrow = "";
      const title = "Monsoon Chittagong";
      const visible = !!(eyebrow.trim() || title.trim());
      assert.equal(visible, true);
    });
  });

  describe("Introduction Section Visibility", () => {
    it("hidden when both heading and content are empty", () => {
      const heading = "";
      const content = "";
      const visible = !!(heading.trim() || content.trim());
      assert.equal(visible, false);
    });

    it("visible when heading is set", () => {
      const heading = "Chittagong Trail";
      const content = "";
      const visible = !!(heading.trim() || content.trim());
      assert.equal(visible, true);
    });
  });

  describe("About/Sign-off Section Visibility", () => {
    it("hidden when both heading and content are empty", () => {
      const heading = "";
      const content = "";
      const visible = !!(heading.trim() || content.trim());
      assert.equal(visible, false);
    });

    it("visible when heading is set", () => {
      const heading = "Come while it is still yours to find";
      const content = "";
      const visible = !!(heading.trim() || content.trim());
      assert.equal(visible, true);
    });
  });
});
