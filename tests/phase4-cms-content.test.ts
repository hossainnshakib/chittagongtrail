import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { selectHomepageStorySections } from "../lib/homepage-story-selection";

function read(rel: string) {
  return fs.readFileSync(rel, "utf8");
}

describe("Phase 4 — CMS and content management", () => {
  it("CT-11/14/30 assigns curated stories first and never repeats story content", () => {
    const featured = [
      { id: 3, slug: "featured-a" },
      { id: 1, slug: "featured-b" },
      { id: 3, slug: "featured-a" },
    ];
    const published = [
      { id: 3, slug: "featured-a" },
      { id: 5, slug: "latest-a" },
      { id: 2, slug: "latest-b" },
      { id: 7, slug: "latest-c" },
      { id: 9, slug: "latest-d" },
    ];

    const { highlights, journeys } = selectHomepageStorySections(featured, published);

    assert.deepEqual(highlights.map((s) => s.id), [3, 1]);
    assert.deepEqual(journeys.map((s) => s.id), [5, 2, 7]);
    const ids = [...highlights, ...journeys].map((s) => s.id);
    const slugs = [...highlights, ...journeys].map((s) => s.slug);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it("CT-11/14 hides curated homepage sections that have no content", () => {
    const page = read("app/page.tsx");
    for (const condition of [
      "featuredTrails.length > 0",
      "journalHighlights.length > 0",
      "featuredFood.length > 0",
      "journeys.length > 0",
      "homepageGallery.length > 0",
    ]) {
      assert.ok(page.includes(condition), `homepage should require ${condition}`);
    }
    assert.match(page, /selectHomepageStorySections\(\s*featuredStories,\s*publishedStories\s*\)/);
    assert.ok(page.includes("stories={journalHighlights}"));
    assert.ok(page.includes("stories={journeys}"));
    assert.ok(!page.includes("stories={featuredStories}"));
  });

  it("CT-23 keeps one authoritative trail association field and only STORY related posts", () => {
    const form = read("components/admin/JournalForm.tsx");
    assert.equal((form.match(/name="trailId"/g) || []).length, 1);
    assert.match(form, /<select\s+id="trailId"\s+name="trailId"/);

    const data = read("lib/data.ts");
    assert.ok(data.includes("where: { status: ContentStatus.PUBLISHED, type: JournalType.STORY }"));
    assert.ok(data.includes("type: JournalType.STORY,\n        id: excludeIds.length > 0"));

    for (const file of ["app/admin/(protected)/journal/actions.ts", "app/admin/(protected)/food/actions.ts"]) {
      const source = read(file);
      assert.ok(source.includes('trailId: formData.get("trailId")'), `${file} should parse trailId once`);
    }
  });

  it("CT-09 defers bulk operations and category/tag taxonomy instead of redesigning the schema", () => {
    const schema = read("prisma/schema.prisma");
    assert.ok(!/model (Tag|Category)\b/.test(schema));
    assert.ok(!/\b(tags|categories)\s+/.test(schema));
    for (const file of ["app/admin/(protected)/trails/actions.ts", "app/admin/(protected)/journal/actions.ts", "app/admin/(protected)/food/actions.ts"]) {
      assert.ok(!read(file).includes("bulkDelete"), `${file} should not add unreviewed bulk deletion`);
    }
  });

  it("CT-10 uses existing settings for logo, favicon, and social links without a visual redesign", () => {
    const settings = read("lib/settings-service.ts");
    for (const field of ["footerLogoMediaId", "socialFacebook", "socialInstagram", "socialYouTube", "siteName"]) {
      assert.ok(settings.includes(field), `settings should retain ${field}`);
    }
    assert.ok(!/fontFamily|fontChoice|faviconMediaId/.test(settings));
    assert.ok(fs.existsSync("public/images/chittagongtrail-favicon.png"));
    assert.ok(!fs.existsSync("app/favicon.ico"));
  });

  it("CT-24 does not introduce multi-user administration or RBAC", () => {
    const schema = read("prisma/schema.prisma");
    assert.ok(!/model (User|Account|Session|Role)\b/.test(schema));
    assert.ok(!/\brole\s+/.test(schema));

    const footer = read("app/admin/(protected)/settings/footer/page.tsx");
    assert.ok(footer.includes('fetch("/api/admin/settings")'));
    assert.ok(footer.includes("setFooterLogoMedia(data.footerLogoMedia || null)"));
  });

  it("CT-26 uploads persist through the existing Cloudinary-backed MediaAsset path", () => {
    const media = read("lib/media-service.ts");
    assert.ok(media.includes('urlObj.hostname !== "res.cloudinary.com"'));
    assert.ok(media.includes("prisma.mediaAsset.create"));
    assert.ok(media.includes("where: { publicId: data.publicId }"));
    const seed = read("lib/demo-seed.ts");
    assert.ok(!/mediaAsset\.create/.test(seed));
  });

  it("CT-34 no longer promises an /about body editor in the settings page", () => {
    const about = read("app/admin/(protected)/settings/about/page.tsx");
    assert.ok(!about.includes("full /about editorial content"));
    assert.ok(about.includes("closing invitation sign-off"));
    assert.ok(about.includes("Page SEO settings"));
  });
});
