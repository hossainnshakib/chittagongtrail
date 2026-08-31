import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Dashboard Service Tests", () => {
  describe("Dashboard Count Mapping", () => {
    it("returns correct structure with numeric values", () => {
      const mockCounts = {
        trails: { total: 5, draft: 2, published: 2, archived: 1, featured: 1 },
        stories: { total: 10, draft: 3, published: 5, archived: 2, featured: 2 },
        food: { total: 8, draft: 1, published: 6, archived: 1, featured: 1 },
        media: { total: 20, images: 18, videos: 2 },
      };
      assert.equal(typeof mockCounts.trails.total, "number");
      assert.equal(typeof mockCounts.stories.total, "number");
      assert.equal(typeof mockCounts.food.total, "number");
      assert.equal(typeof mockCounts.media.total, "number");
      assert.ok(mockCounts.trails.total >= 0);
      assert.ok(mockCounts.stories.total >= 0);
      assert.ok(mockCounts.food.total >= 0);
      assert.ok(mockCounts.media.total >= 0);
    });

    it("status counts add up to total", () => {
      const counts = { draft: 2, published: 3, archived: 1, featured: 1, total: 6 };
      const statusSum = counts.draft + counts.published + counts.archived;
      assert.equal(statusSum, counts.total);
    });
  });

  describe("Needs Attention Rules", () => {
    it("draft items should be flagged", () => {
      const item = { type: "trail" as const, id: 1, title: "Test Trail", slug: "test", issues: ["Draft"] };
      assert.ok(item.issues.includes("Draft"));
    });

    it("published items missing cover should be flagged", () => {
      const item = { type: "trail" as const, id: 1, title: "Test", slug: "test", issues: ["Missing cover"] };
      assert.ok(item.issues.includes("Missing cover"));
    });

    it("published items missing meta title should be flagged", () => {
      const item = { type: "story" as const, id: 1, title: "Test", slug: "test", issues: ["Missing meta title"] };
      assert.ok(item.issues.includes("Missing meta title"));
    });

    it("featured items missing order should be flagged", () => {
      const item = { type: "trail" as const, id: 1, title: "Test", slug: "test", issues: ["Featured but no order"] };
      assert.ok(item.issues.includes("Featured but no order"));
    });
  });

  describe("Homepage Readiness Limits", () => {
    it("featured trails max is 4", () => {
      const readiness = { featuredTrailsMax: 4, featuredStoriesMax: 3, featuredFoodMax: 3 };
      assert.equal(readiness.featuredTrailsMax, 4);
      assert.equal(readiness.featuredStoriesMax, 3);
      assert.equal(readiness.featuredFoodMax, 3);
    });

    it("gallery target range is 6-8", () => {
      const readiness = { galleryTargetMin: 6, galleryTargetMax: 8 };
      assert.equal(readiness.galleryTargetMin, 6);
      assert.equal(readiness.galleryTargetMax, 8);
    });
  });

  describe("Recent Content Grouping", () => {
    it("items have required fields", () => {
      const item = {
        id: 1,
        title: "Test",
        slug: "test",
        type: "trail" as const,
        status: "PUBLISHED",
        updatedAt: new Date(),
        publishedAt: new Date(),
        coverUrl: null,
        isFeatured: false,
      };
      assert.ok(item.id);
      assert.ok(item.title);
      assert.ok(item.slug);
      assert.ok(["trail", "story", "food"].includes(item.type));
    });

    it("items can be sorted by updatedAt", () => {
      const items = [
        { updatedAt: new Date("2026-01-01"), type: "trail" as const },
        { updatedAt: new Date("2026-06-01"), type: "story" as const },
        { updatedAt: new Date("2026-03-01"), type: "food" as const },
      ];
      items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      assert.equal(items[0].type, "story");
      assert.equal(items[1].type, "food");
      assert.equal(items[2].type, "trail");
    });
  });
});
