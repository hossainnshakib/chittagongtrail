import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { trailSchema, journalSchema } from "../lib/validation";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

const validTrail = {
  name: "Kaptai lakeside",
  slug: "kaptai-lakeside",
  district: "CHITTAGONG",
  description: "<p>A lakeside walk.</p>",
};

const validStory = {
  title: "A quiet day by Kaptai Lake",
  slug: "quiet-kaptai",
  content: "<p>Notes from the lake.</p>",
};

describe("CT-01 — cover image remains optional", () => {
  it("content schemas accept omitted and null cover IDs", () => {
    for (const input of [validTrail, { ...validTrail, coverMediaId: null }]) {
      const result = trailSchema.safeParse(input);
      assert.equal(result.success, true, `trailSchema rejected ${JSON.stringify(input)}`);
      if (result.success) assert.equal(result.data.coverMediaId ?? null, null);
    }

    for (const input of [validStory, { ...validStory, coverMediaId: null }]) {
      const result = journalSchema.safeParse(input);
      assert.equal(result.success, true, `journalSchema rejected ${JSON.stringify(input)}`);
      if (result.success) assert.equal(result.data.coverMediaId ?? null, null);
    }
  });

  it("all create/update actions normalize an empty cover field to null", () => {
    for (const file of [
      "app/admin/(protected)/trails/actions.ts",
      "app/admin/(protected)/journal/actions.ts",
      "app/admin/(protected)/food/actions.ts",
    ]) {
      const source = readFile(file);
      const normalized = source.match(/coverMediaId: formData\.get\("coverMediaId"\) !== "" \? formData\.get\("coverMediaId"\) : null/g) || [];
      assert.ok(normalized.length >= 2, `${file} should normalize empty cover IDs on create and update`);
      assert.ok(!source.includes("findUnique(null)"), `${file} must not look up a null cover ID`);
    }
  });

  it("database and media validation keep cover nullable", () => {
    const schema = readFile("prisma/schema.prisma");
    assert.ok(/coverMediaId\s+Int\?/.test(schema));
    assert.ok(schema.includes("onDelete: SetNull"));
    const media = readFile("lib/media-validation.ts");
    assert.ok(media.includes('id === null || id === undefined || id === ""'));
  });

  it("admin, listing, public detail, and homepage fallbacks remain in place", () => {
    assert.ok(readFile("components/admin/CoverImageModule.tsx").includes("Select cover image"));
    assert.ok(readFile("components/admin/content/AdminMediaThumbnail.tsx").includes("placeholder"));
    assert.ok(readFile("components/trails/TrailCard.tsx").includes("bg-[#F5E6D3]"));
    assert.ok(readFile("components/journal/JournalCard.tsx").includes("bg-[#F5E6D3]"));
    assert.ok(readFile("app/trails/[slug]/page.tsx").includes("bg-[#F5E6D3]"));
    assert.ok(readFile("app/journal/[slug]/page.tsx").includes("bg-[#F5E6D3]"));
    assert.ok(readFile("app/food/[slug]/page.tsx").includes("bg-[#F5E6D3]"));
    assert.ok(readFile("components/home/DestinationsGrid.tsx").includes("from-accent/30 to-accent-teal/20"));
    assert.ok(readFile("components/home/ExperiencesGrid.tsx").includes("from-accent/20 to-warm/30"));
    assert.ok(readFile("components/home/FoodGallery.tsx").includes("from-accent-secondary/20 to-accent/10"));
    assert.ok(readFile("lib/seo.ts").includes('if (!imagePath) return DEFAULT_OG_IMAGE'));
  });

  it("documentation no longer marks card covers as required", () => {
    const wireframes = readFile("WIREFRAMES.md");
    assert.ok(!wireframes.includes("coverImage (required)"));
    assert.ok(wireframes.includes("coverImage (optional, fallback state shown when absent)"));
  });
});
