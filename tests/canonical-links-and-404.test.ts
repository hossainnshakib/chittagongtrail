import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

const publicLinkBuilders = [
  "components/trails/TrailCard.tsx",
  "components/journal/JournalCard.tsx",
  "components/home/DestinationsGrid.tsx",
  "components/home/ExperiencesGrid.tsx",
  "components/home/FoodGallery.tsx",
  "components/home/Journeys.tsx",
  "components/map/TrailMapInner.tsx",
  "app/trails/[slug]/page.tsx",
  "app/journal/[slug]/page.tsx",
];

describe("CT-32 — canonical links and neutral 404 copy", () => {
  it("shows the exact neutral 404 sentence", () => {
    const notFound = readFile("app/not-found.tsx");
    assert.ok(notFound.includes("This page doesn’t seem to exist."));
    assert.ok(!notFound.includes("This trail"));
    assert.ok(!notFound.includes("lost to time"));
    assert.ok(!notFound.includes("never there at all"));
  });

  it("builds every public detail link from the stored slug", () => {
    for (const file of publicLinkBuilders) {
      const source = readFile(file);
      assert.ok(source.includes(".slug"), `${file} must use the canonical slug`);
      assert.ok(!source.includes("/trails/kaptai-dam"), `${file} must not hardcode a stale slug`);
    }
  });

  it("resolves the legacy Kaptai Dam path to the current published trail", () => {
    const helper = readFile("lib/canonical-links.ts");
    assert.ok(helper.includes('"kaptai-dam": ["Kaptai Dam", "Kaptai"]'));
    assert.ok(helper.includes("prisma.trailLocation.findFirst"));
    assert.ok(helper.includes("select: { slug: true }"));

    const page = readFile("app/trails/[slug]/page.tsx");
    assert.ok(page.includes("resolveLegacyTrailSlug(slug)"));
    assert.ok(page.includes('redirect(`/trails/${canonicalSlug}`)'));
  });

  it("does not rename slugs or add broad redirects", () => {
    const config = readFile("next.config.ts");
    assert.ok(!config.includes("redirects()"));
  });
});
