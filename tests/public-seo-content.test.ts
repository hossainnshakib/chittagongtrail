import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8") + (rel === "lib/public-content.ts"
    ? fs.readFileSync(path.join(process.cwd(), "lib/public-content-definitions.ts"), "utf8") : "");
}

describe("A7R.9.2 Public content, SEO, indexing, and footer brand", () => {
  it("defines editable public page content separately from metadata", () => {
    const content = readFile("lib/public-content.ts");
    const schema = readFile("prisma/schema.prisma");
    const pages = [
      ["app/trails/page.tsx", "trails"],
      ["app/journal/page.tsx", "journal"],
      ["app/food/page.tsx", "food"],
      ["app/about/page.tsx", "about"],
    ] as const;

    assert.ok(schema.includes("model PageSeoSetting"));
    assert.ok(schema.includes("model HomepageSectionSetting"));
    assert.match(content, /visibleTitle: string/);
    assert.match(content, /visibleDescription: string/);
    assert.match(content, /metaTitle: string/);
    assert.match(content, /metaDescription: string/);
    assert.ok(content.includes("useVisibleTitleAsMetaTitle"));
    assert.ok(content.includes("useVisibleDescriptionAsMetaDescription"));
    assert.ok(content.includes("siteSettings.update"));

    for (const [file, pageKey] of pages) {
      const source = readFile(file);
      assert.ok(source.includes(`buildPublicPageMetadata("${pageKey}")`), `${file} should use page metadata`);
      assert.ok(source.includes(`getPublicPageSeo("${pageKey}")`), `${file} should use editable page content`);
      assert.equal((source.match(/as="h1"/g) || []).length, 1, `${file} should render one page H1`);
    }

    const homepage = readFile("app/page.tsx");
    const hero = readFile("components/home/Hero.tsx");
    assert.ok(homepage.includes('buildPublicPageMetadata("home")'));
    assert.ok(homepage.includes("getPublicSiteSettings"));
    assert.equal((hero.match(/<h1/g) || []).length, 1, "Homepage Hero should render one H1");
  });

  it("keeps the Hero title contract and media behavior intact", () => {
    const hero = readFile("components/home/Hero.tsx");
    const css = readFile("app/globals.css");

    assert.equal((hero.match(/<h1/g) || []).length, 1);
    assert.ok(hero.includes("One Chittagong."));
    assert.equal(hero.includes('className="hero-title opacity-0"'), false);
    assert.ok(hero.includes("poster={posterSrc}"));
    assert.ok(hero.includes("showDirectVideo = !reducedMotion"));
    assert.ok(hero.includes("showKenBurns = reducedMotion"));
    assert.ok(hero.includes('transition: directReady ? "opacity 700ms ease" : "none"'));
    assert.match(css, /\.hero-title\s*{[\s\S]*font-size: clamp\(2\.5rem, calc\(1\.75rem \+ 3\.5vw\), 6\.25rem\)/);
    assert.match(css, /\.hero-title\s*{[\s\S]*width: 100%/);
    assert.match(css, /\.hero-title\s*{[\s\S]*max-width: min\(100%, 56rem\)/);
    assert.match(css, /\.ct-hero-content\s*{[\s\S]*--ct-hero-top-safe: calc\(var\(--ct-header-height\)/);
  });

  it("provides global SEO defaults, verification, and indexing controls", () => {
    const settings = readFile("lib/settings-service.ts");
    const seo = readFile("lib/seo.ts");
    const layout = readFile("app/layout.tsx");

    for (const field of ["defaultOgTitle", "defaultOgDescription", "publisherName", "googleSiteVerification", "bingSiteVerification", "allowIndexing"]) {
      assert.ok(settings.includes(field), `${field} should be a Site Settings field`);
    }
    assert.ok(seo.includes("settings.defaultOgTitle"));
    assert.ok(seo.includes("settings.defaultOgDescription"));
    assert.ok(seo.includes("settings.allowIndexing"));
    assert.ok(seo.includes("googleSiteVerification"));
    assert.ok(seo.includes("bingSiteVerification"));
    assert.ok(seo.includes("safeJsonLd"));
    assert.ok(layout.includes("generateRootMetadata"));
    assert.ok(layout.includes("safeJsonLd(organizationJsonLd)"));
    assert.ok(layout.includes("safeJsonLd(webSiteJsonLd)"));
  });

  it("keeps public origin, robots, sitemap, and page indexing safe", () => {
    const siteUrl = readFile("lib/site-url.ts");
    const robots = readFile("app/robots.ts");
    const sitemap = readFile("app/sitemap.ts");
    const seo = readFile("lib/seo.ts");

    assert.ok(siteUrl.includes("NEXT_PUBLIC_SITE_URL"));
    assert.ok(siteUrl.includes("SITE_URL"));
    assert.ok(siteUrl.includes("url.protocol !== \"https:\""));
    assert.equal(siteUrl.includes("chittagongtrail.com"), false);
    assert.ok(robots.includes("/preview"));
    assert.ok(robots.includes("getConfiguredSiteOrigin"));
    assert.ok(sitemap.includes("includeInSitemap: true"));
    assert.ok(sitemap.includes("PUBLIC_PAGE_DEFINITIONS"));
    assert.ok(seo.includes("index: !noindex"));
    assert.ok(seo.includes("buildPublicPageMetadata"));
  });

  it("protects new admin content endpoints and validates fixed routes", () => {
    const pageApi = readFile("app/api/admin/page-seo/route.ts");
    const sectionApi = readFile("app/api/admin/homepage/sections/route.ts");
    const content = readFile("lib/public-content.ts");

    for (const source of [pageApi, sectionApi]) {
      assert.ok(source.includes("verifySession"));
      assert.ok(source.includes("validateSameOrigin"));
    }
    assert.ok(content.includes("definition.routePath"));
    assert.ok(content.includes("validateInternalHref"));
    assert.ok(content.includes("validateImageMediaId"));
    assert.ok(content.includes("prisma.$transaction"));
  });

  it("uses CMS-selected footer branding without a duplicate wordmark heading", () => {
    const footer = readFile("components/layout/Footer.tsx");
    const settings = readFile("lib/settings-service.ts");
    const media = readFile("lib/media-service.ts");
    const admin = readFile("app/admin/(protected)/settings/footer/page.tsx");

    assert.ok(footer.includes("settings.footerLogoMedia?.secureUrl"));
    assert.ok(footer.includes("footerLogoIncludesWordmark"));
    assert.ok(footer.includes("!footerLogoIncludesWordmark"));
    assert.ok(settings.includes("footerLogoMedia"));
    assert.ok(settings.includes("footerLogoMediaId"));
    assert.ok(media.includes("siteFooterLogoMedias"));
    assert.ok(media.includes("pageSeoOgMedias"));
    assert.ok(admin.includes("MediaPicker"));
    assert.ok(admin.includes("footerLogoDecorative"));
    assert.ok(admin.includes("footerLogoIncludesWordmark"));
  });

  it("keeps homepage section editing bounded to existing public sections", () => {
    const content = readFile("lib/public-content.ts");
    const homepage = readFile("app/page.tsx");
    const editor = readFile("app/admin/(protected)/settings/homepage-sections/page.tsx");

    for (const key of ["destinations", "experiences", "food", "stories", "gallery"]) {
      assert.ok(content.includes(`sectionKey: "${key}"`));
      assert.ok(homepage.includes(`section("${key}")`));
      assert.ok(editor.includes(`sectionKey: string`));
    }
    assert.ok(content.includes("ctaHref"));
    assert.ok(content.includes("validateInternalHref"));
  });
});
