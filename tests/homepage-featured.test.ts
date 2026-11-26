import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  HOMEPAGE_FEATURED_LIMITS,
  HOMEPAGE_GALLERY_LIMITS,
  sortFeaturedItems,
  limitFeaturedItems,
} from "../lib/homepage-featured";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

interface Item {
  id: number;
  featuredOrder: number | null;
  publishedAt: Date | null;
}

describe("CT-02/27/28 — canonical featured ordering", () => {
  it("exposes one set of limits shared by public and admin surfaces", () => {
    assert.deepEqual(HOMEPAGE_FEATURED_LIMITS, { trails: 4, stories: 3, food: 3 });
    assert.deepEqual(HOMEPAGE_GALLERY_LIMITS, { recommendedMin: 6, recommendedMax: 8, hardMax: 12 });
  });

  it("orders lower featuredOrder first and pushes NULL orders last", () => {
    const input: Item[] = [
      { id: 5, featuredOrder: null, publishedAt: new Date("2026-01-05") },
      { id: 2, featuredOrder: 1, publishedAt: new Date("2026-01-02") },
      { id: 1, featuredOrder: 0, publishedAt: new Date("2026-01-01") },
      { id: 4, featuredOrder: null, publishedAt: new Date("2026-01-04") },
    ];
    assert.deepEqual(
      sortFeaturedItems(input).map((item) => item.id),
      [1, 2, 5, 4]
    );
    assert.deepEqual(input.map((item) => item.id), [5, 2, 1, 4], "sort must not mutate source");
  });

  it("breaks duplicate and NULL-order ties deterministically", () => {
    const input: Item[] = [
      { id: 3, featuredOrder: 0, publishedAt: new Date("2026-01-01") },
      { id: 1, featuredOrder: 0, publishedAt: new Date("2026-01-03") },
      { id: 2, featuredOrder: 0, publishedAt: new Date("2026-01-03") },
      { id: 5, featuredOrder: null, publishedAt: null },
      { id: 4, featuredOrder: null, publishedAt: new Date("2026-01-04") },
    ];
    assert.deepEqual(
      sortFeaturedItems(input).map((item) => item.id),
      [1, 2, 3, 4, 5]
    );
    assert.deepEqual(
      limitFeaturedItems(sortFeaturedItems(input), HOMEPAGE_FEATURED_LIMITS.stories).map((item) => item.id),
      [1, 2, 3]
    );
  });

  it("public homepage uses the shared read helper, not competing queries", () => {
    const page = readFile("app/page.tsx");
    assert.ok(page.includes("getPublicHomepageFeatured()"));
    assert.ok(!page.includes("prisma.trailLocation.findMany"));
    assert.ok(!page.includes("prisma.journalPost.findMany"));
    assert.ok(!page.includes("orderBy: [{ featuredOrder"));
  });

  it("admin editors use the same ordering helper", () => {
    assert.ok(readFile("app/api/admin/homepage/featured-trails/route.ts").includes("getAdminFeaturedTrails()"));
    const stories = readFile("app/api/admin/homepage/featured-stories/route.ts");
    const food = readFile("app/api/admin/homepage/featured-food/route.ts");
    assert.ok(stories.includes("getAdminFeaturedPosts(JournalType.STORY)"));
    assert.ok(food.includes("getAdminFeaturedPosts(JournalType.FOOD)"));
    assert.ok(!stories.includes('orderBy: [{ featuredOrder: "asc" }, { id: "asc" }]'));
    assert.ok(!food.includes('orderBy: [{ featuredOrder: "asc" }, { id: "asc" }]'));
  });

  it("ordinary content forms and actions no longer write featured fields", () => {
    for (const file of [
      "app/admin/(protected)/trails/actions.ts",
      "app/admin/(protected)/journal/actions.ts",
      "app/admin/(protected)/food/actions.ts",
      "components/admin/TrailForm.tsx",
      "components/admin/JournalForm.tsx",
    ]) {
      const source = readFile(file);
      assert.ok(!source.includes("isFeatured"), `${file} must leave curation to the homepage workspace`);
      assert.ok(!source.includes("featuredOrder"), `${file} must leave curation to the homepage workspace`);
    }
  });

  it("homepage curation remains the only featured write path", () => {
    const svc = readFile("lib/homepage-service.ts");
    assert.ok(svc.includes("updateFeaturedTrails"));
    assert.ok(svc.includes("updateFeaturedStories"));
    assert.ok(svc.includes("updateFeaturedFood"));
    assert.ok(svc.includes("featuredOrder: i"));
  });
});
