import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  decodeHtmlEntities,
  normalizePlainText,
} from "../lib/html-entities";
import {
  TITLE_SEPARATOR,
  withSiteName,
  withoutSiteNamePrefix,
  withoutSiteNameSuffix,
} from "../lib/title-formatting";
import { META_DESCRIPTION_MAX_LENGTH } from "../lib/meta-description";
import { selectHomepageStorySections } from "../lib/homepage-story-selection";

function read(rel: string) {
  return fs.readFileSync(rel, "utf8");
}

describe("Phase 5 — public polish and SEO", () => {
  it("CT-19 normalizes CMS plain copy into real DOM whitespace", () => {
    assert.equal(normalizePlainText("Stories  &amp;\n  Journeys"), "Stories & Journeys");
    assert.equal(normalizePlainText("  Five   districts&nbsp;·&nbsp;One trail  "), "Five districts · One trail");
    const settingsSource = read("lib/settings-service.ts");
    assert.ok(settingsSource.includes("siteName: z.string().min(1, \"Site name is required\").max(100).transform(cleanPlainText)"));
    assert.ok(settingsSource.includes("heroSubtitle: z.string().max(500).optional().nullable().transform(cleanPlainText)"));
    assert.ok(settingsSource.includes("footerText: z.string().max(500).optional().nullable().transform(cleanPlainText)"));
    assert.ok(settingsSource.includes("decodePlainSettingFields(await initializeSiteSettingsIfMissing())"));
  });

  it("CT-29 renders ampersands once from the storage/render boundary", () => {
    assert.equal(decodeHtmlEntities("STORIES &AMP; JOURNEYS"), "STORIES & JOURNEYS");
    assert.equal(decodeHtmlEntities("Story &amp;amp; craft"), "Story & craft");
    assert.equal(decodeHtmlEntities("Chittagong&#x27;s coast"), "Chittagong's coast");

    const content = read("lib/public-content.ts");
    assert.ok(content.includes("decodeHtmlEntities(sanitizeContent(value)"));
    assert.ok(read("lib/public-content-definitions.ts").includes('fallbackEyebrow: "Stories & Journeys"'));
    assert.ok(read("components/home/Journeys.tsx").includes('"Stories & Journeys"'));
  });

  it("CT-22 gives article H2s a larger display treatment without changing sanitization", () => {
    const css = read("app/globals.css");
    assert.ok(css.includes(".article-body.prose h2"));
    assert.match(css, /\.article-body\.prose h2\s*{[\s\S]*font-size: 1\.75rem/);
    assert.match(css, /\.article-body\.prose h2\s*{[\s\S]*font-family: var\(--font-display\)/);

    for (const file of [
      "app/journal/[slug]/page.tsx",
      "app/food/[slug]/page.tsx",
      "app/trails/[slug]/page.tsx",
      "app/about/page.tsx",
    ]) {
      assert.ok(read(file).includes("article-body prose"), `${file} should use article-body styling`);
    }
    assert.ok(read("lib/validation.ts").includes('"h2"'));
  });

  it("CT-31 appends the site name once with one consistent separator", () => {
    const site = "Chittagong Trail";
    assert.equal(TITLE_SEPARATOR, " | ");
    assert.equal(
      withSiteName("Morning beside the Karnaphuli | Chittagong Trail", site),
      `Morning beside the Karnaphuli${TITLE_SEPARATOR}${site}`
    );
    assert.equal(
      withSiteName("Five Districts. Hills to the Sea. One Chittagong.", site),
      `Five Districts. Hills to the Sea. One Chittagong.${TITLE_SEPARATOR}${site}`
    );
    assert.equal(withSiteName(site, site), site);
    assert.equal(
      withSiteName("Chittagong Trail — Places", site),
      `Places${TITLE_SEPARATOR}${site}`
    );
    assert.equal(withoutSiteNameSuffix("Story — Chittagong Trail", site), "Story");
    assert.equal(withoutSiteNamePrefix("Chittagong Trail — Places", site), "Places");

    const seo = read("lib/seo.ts");
    assert.ok(seo.includes("title: withoutSiteNameSuffix(title, siteName)"));
    assert.ok(seo.includes('title: { absolute: withSiteName(title, settings.siteName) }'));
    assert.ok(seo.includes("`%s | ${settings.siteName}`"));
  });

  it("CT-30 keeps consecutive homepage story sections disjoint", () => {
    const featured = [
      { id: 1, slug: "featured" },
      { id: 2, slug: "also-featured" },
    ];
    const published = [
      { id: 1, slug: "featured" },
      { id: 3, slug: "latest" },
    ];
    const { highlights, journeys } = selectHomepageStorySections(featured, published);
    assert.deepEqual(highlights.map((s) => s.slug), ["featured", "also-featured"]);
    assert.deepEqual(journeys.map((s) => s.slug), ["latest"]);
    assert.ok(!journeys.some((s) => highlights.some((h) => h.id === s.id || h.slug === s.slug)));
  });

  it("CT-21 keeps the V1 no-search decision without adding a fake search page", () => {
    assert.equal(fs.existsSync("app/search"), false);
    for (const file of ["components/layout/Header.tsx", "components/layout/Footer.tsx", "components/layout/MobileMenu.tsx"]) {
      assert.ok(!read(file).includes('href="/search"'), `${file} should not advertise fake search`);
    }
  });

  it("CT-35 keeps one 160-character meta-description rule", () => {
    assert.equal(META_DESCRIPTION_MAX_LENGTH, 160);
    for (const file of [
      "lib/validation.ts",
      "lib/settings-service.ts",
      "lib/public-content.ts",
      "components/admin/OnPageSeoWorkspace.tsx",
      "components/admin/SeoPanel.tsx",
    ]) {
      assert.ok(read(file).includes("metaDescriptionSchema") || read(file).includes("160"), `${file} uses shared limit`);
    }
  });

  it("CT-33 has no corrupt phrase in tracked copy; production data remains an editorial fix", () => {
    const sources = [
      "app/about/page.tsx",
      "app/page.tsx",
      "components/home/Journeys.tsx",
      "lib/demo-data.ts",
      "lib/public-content.ts",
      "lib/public-content-definitions.ts",
      ".local-qa/http-home.txt",
      ".local-qa/http-_about.txt",
    ];
    for (const file of sources) {
      if (!fs.existsSync(file)) continue;
      assert.ok(!read(file).includes("40 story stories"), `${file} must not contain the corrupt phrase`);
    }
  });
});
