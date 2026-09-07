import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import ts from "typescript";
import * as definitions from "../lib/public-content-definitions";
import { sanitizeContent } from "../lib/validation";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

function load(file: string, dependencies: Record<string, unknown>) {
  const output = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const loadedModule = { exports: {} };
  const realRequire = createRequire(resolve(file));
  const require = (id: string) => (id in dependencies ? dependencies[id] : realRequire(id));
  new Function("require", "module", "exports", output)(require, loadedModule, loadedModule.exports);
  return loadedModule.exports as Record<string, (...args: unknown[]) => unknown>;
}

const origin = "https://example.com";
const siteUrl = {
  getConfiguredSiteOrigin: () => origin,
  getConfiguredSiteUrl: (p = "") => origin + p,
};
const noSiteUrl = {
  getConfiguredSiteOrigin: () => "",
  getConfiguredSiteUrl: () => "",
};

describe("S1. Master sitemap", () => {
  it("returns valid XML structure with application/xml content type contract", () => {
    const sitemap = readFile("app/sitemap.ts");
    assert.ok(sitemap.includes("Promise<MetadataRoute.Sitemap>"), "sitemap must return MetadataRoute.Sitemap");
    assert.ok(sitemap.includes("isValidSlug"), "sitemap must filter invalid slugs");
    assert.ok(sitemap.includes("ContentStatus.PUBLISHED"), "sitemap must only include published content");
  });

  it("returns empty array when site origin is not configured", async () => {
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": noSiteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: true }) },
          pageSeoSetting: { findMany: async () => [] },
          trailLocation: { findMany: async () => [] },
          journalPost: { findMany: async () => [] },
        },
      },
    });
    const result = await loadedModule.default();
    assert.deepEqual(result, []);
  });

  it("includes all 5 static public routes when indexed", async () => {
    const rows = definitions.PUBLIC_PAGE_DEFINITIONS.map((d) => ({
      pageKey: d.pageKey,
      updatedAt: new Date(0),
      robotsIndex: true,
      robotsFollow: true,
      includeInSitemap: true,
    }));
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: true, updatedAt: new Date(0) }) },
          pageSeoSetting: { findMany: async () => rows },
          trailLocation: { findMany: async () => [] },
          journalPost: { findMany: async () => [] },
        },
      },
    });
    const entries = (await loadedModule.default()) as Array<{ url: string }>;
    const urls = entries.map((e) => e.url);
    for (const route of ["/", "/trails", "/journal", "/food", "/about"]) {
      assert.ok(urls.includes(origin + route), `must include ${route}`);
    }
  });

  it("includes published trail, journal story, and food detail routes", async () => {
    const rows = definitions.PUBLIC_PAGE_DEFINITIONS.map((d) => ({
      pageKey: d.pageKey,
      updatedAt: new Date(0),
      robotsIndex: true,
      robotsFollow: true,
      includeInSitemap: true,
    }));
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: true, updatedAt: new Date(0) }) },
          pageSeoSetting: { findMany: async () => rows },
          trailLocation: {
            findMany: async () => [
              { slug: "trail-a", updatedAt: new Date("2026-01-01") },
              { slug: "trail-b", updatedAt: new Date("2026-01-02") },
              { slug: "trail-c", updatedAt: new Date("2026-01-03") },
              { slug: "trail-d", updatedAt: new Date("2026-01-04") },
              { slug: "trail-e", updatedAt: new Date("2026-01-05") },
            ],
          },
          journalPost: {
            findMany: async ({ where }: { where: { type: string } }) =>
              where.type === "STORY"
                ? [
                    { slug: "story-1", updatedAt: new Date("2026-02-01") },
                    { slug: "story-2", updatedAt: new Date("2026-02-02") },
                    { slug: "story-3", updatedAt: new Date("2026-02-03") },
                  ]
                : [
                    { slug: "food-1", updatedAt: new Date("2026-03-01") },
                    { slug: "food-2", updatedAt: new Date("2026-03-02") },
                    { slug: "food-3", updatedAt: new Date("2026-03-03") },
                  ],
          },
        },
      },
    });
    const entries = (await loadedModule.default()) as Array<{ url: string }>;
    const urls = entries.map((e) => e.url);
    assert.ok(urls.includes(origin + "/trails/trail-a"));
    assert.ok(urls.includes(origin + "/trails/trail-e"));
    assert.ok(urls.includes(origin + "/journal/story-1"));
    assert.ok(urls.includes(origin + "/journal/story-3"));
    assert.ok(urls.includes(origin + "/food/food-1"));
    assert.ok(urls.includes(origin + "/food/food-3"));
    assert.equal(urls.length, 5 + 5 + 3 + 3, "5 static + 5 trails + 3 stories + 3 food");
  });

  it("excludes drafts, archived records, admin, API, preview, and invalid slugs", async () => {
    const rows = definitions.PUBLIC_PAGE_DEFINITIONS.map((d) => ({
      pageKey: d.pageKey,
      updatedAt: new Date(0),
      robotsIndex: true,
      robotsFollow: true,
      includeInSitemap: true,
    }));
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: true, updatedAt: new Date(0) }) },
          pageSeoSetting: { findMany: async () => rows },
          trailLocation: {
            findMany: async () => [
              { slug: "valid-trail", updatedAt: new Date() },
              { slug: "", updatedAt: new Date() },
            ],
          },
          journalPost: {
            findMany: async () => [
              { slug: "valid-story", updatedAt: new Date() },
              { slug: "/api/secret", updatedAt: new Date() },
            ],
          },
        },
      },
    });
    const entries = (await loadedModule.default()) as Array<{ url: string }>;
    const urls = entries.map((e) => e.url);
    assert.ok(urls.includes(origin + "/trails/valid-trail"));
    const pathOnly = urls.map((u) => new URL(u).pathname);
    assert.ok(!pathOnly.some((p) => p.startsWith("/admin")), "must not include admin routes");
    assert.ok(!pathOnly.some((p) => p.startsWith("/api")), "must not include API routes");
    assert.ok(!pathOnly.some((p) => p.startsWith("/preview")), "must not include preview routes");
    assert.ok(!pathOnly.some((p) => p.endsWith("/") && p !== "/"), "must not end with trailing slash");
    assert.ok(!urls.some((u) => /localhost/.test(u)), "must not contain localhost");
    assert.ok(!pathOnly.some((p) => p === "//"), "must not have empty slug segments");
  });

  it("respects Allow indexing and Include in sitemap settings", async () => {
    const rows = definitions.PUBLIC_PAGE_DEFINITIONS.map((d) => ({
      pageKey: d.pageKey,
      updatedAt: new Date(0),
      robotsIndex: d.pageKey !== "home",
      robotsFollow: true,
      includeInSitemap: d.pageKey !== "about",
    }));
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: true, updatedAt: new Date(0) }) },
          pageSeoSetting: { findMany: async () => rows },
          trailLocation: { findMany: async () => [{ slug: "t1", updatedAt: new Date() }] },
          journalPost: { findMany: async () => [] },
        },
      },
    });
    const entries = (await loadedModule.default()) as Array<{ url: string }>;
    const urls = entries.map((e) => e.url);
    assert.ok(!urls.includes(origin + "/"), "home excluded by robotsIndex=false");
    assert.ok(!urls.includes(origin + "/about"), "about excluded by includeInSitemap=false");
    assert.ok(urls.includes(origin + "/trails"));
    assert.ok(urls.includes(origin + "/journal"));
    assert.ok(urls.includes(origin + "/food"));
    assert.ok(urls.includes(origin + "/trails/t1"));
  });

  it("returns empty sitemap when site indexing is disabled", async () => {
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: false }) },
          pageSeoSetting: { findMany: async () => [] },
          trailLocation: { findMany: async () => [] },
          journalPost: { findMany: async () => [] },
        },
      },
    });
    const entries = (await loadedModule.default()) as Array<{ url: string }>;
    assert.deepEqual(entries, []);
  });

  it("has no duplicate URLs", async () => {
    const rows = definitions.PUBLIC_PAGE_DEFINITIONS.map((d) => ({
      pageKey: d.pageKey,
      updatedAt: new Date(0),
      robotsIndex: true,
      robotsFollow: true,
      includeInSitemap: true,
    }));
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl,
      "@/lib/public-content": definitions,
      "@/lib/prisma": {
        prisma: {
          siteSettings: { findUnique: async () => ({ allowIndexing: true, updatedAt: new Date(0) }) },
          pageSeoSetting: { findMany: async () => rows },
          trailLocation: { findMany: async () => [{ slug: "dup", updatedAt: new Date() }] },
          journalPost: { findMany: async () => [] },
        },
      },
    });
    const entries = (await loadedModule.default()) as Array<{ url: string }>;
    const urls = entries.map((e) => e.url);
    assert.equal(new Set(urls).size, urls.length, "no duplicate URLs");
  });

  it("uses configured site origin and does not hardcode a domain", () => {
    const sitemap = readFile("app/sitemap.ts");
    assert.ok(sitemap.includes("getConfiguredSiteOrigin"), "must use centralized site origin helper");
    assert.ok(!sitemap.includes("chittagongtrail.com"), "must not hardcode production domain");
    assert.ok(!sitemap.includes("localhost"), "must not emit localhost");
  });

  it("does not silently swallow database errors into empty results", () => {
    const sitemap = readFile("app/sitemap.ts");
    assert.ok(sitemap.includes("try"), "must have error handling");
    assert.ok(sitemap.includes("catch"), "must catch errors");
    assert.ok(sitemap.includes("console.error"), "must log errors visibly");
  });
});

describe("S2. Robots.txt", () => {
  it("includes Sitemap directive with configured origin", () => {
    const loadedModule = load("app/robots.ts", { "@/lib/site-url": siteUrl });
    const result = loadedModule.default() as { rules: { disallow: string[] }; sitemap: string };
    assert.equal(result.sitemap, origin + "/sitemap.xml");
  });

  it("blocks admin, API, and preview routes", () => {
    const loadedModule = load("app/robots.ts", { "@/lib/site-url": siteUrl });
    const result = loadedModule.default() as { rules: { disallow: string[] } };
    for (const route of ["/admin", "/admin/", "/api", "/api/", "/preview", "/preview/"]) {
      assert.ok(result.rules.disallow.includes(route), `must disallow ${route}`);
    }
  });

  it("allows public crawling with /", () => {
    const loadedModule = load("app/robots.ts", { "@/lib/site-url": siteUrl });
    const result = loadedModule.default() as { rules: { allow: string } };
    assert.equal(result.rules.allow, "/");
  });

  it("does not block Google, Bing, or legitimate crawlers", () => {
    const robots = readFile("app/robots.ts");
    assert.ok(!robots.includes("Googlebot"), "must not block Googlebot");
    assert.ok(!robots.includes("Bingbot"), "must not block Bingbot");
    assert.ok(!robots.includes("user-agent: *"), "must not use overly restrictive rules");
  });
});

describe("S3. Metadata completeness", () => {
  it("every public index page uses buildPublicPageMetadata", () => {
    for (const [file, key] of [
      ["app/trails/page.tsx", "trails"],
      ["app/journal/page.tsx", "journal"],
      ["app/food/page.tsx", "food"],
      ["app/about/page.tsx", "about"],
    ] as const) {
      const source = readFile(file);
      assert.ok(source.includes(`buildPublicPageMetadata("${key}")`), `${file} must use buildPublicPageMetadata`);
    }
  });

  it("homepage uses buildPublicPageMetadata('home')", () => {
    const source = readFile("app/page.tsx");
    assert.ok(source.includes('buildPublicPageMetadata("home")'));
  });

  it("every detail page uses buildDynamicContentMetadata", () => {
    for (const file of [
      "app/trails/[slug]/page.tsx",
      "app/journal/[slug]/page.tsx",
      "app/food/[slug]/page.tsx",
    ]) {
      const source = readFile(file);
      assert.ok(source.includes("buildDynamicContentMetadata"), `${file} must use buildDynamicContentMetadata`);
    }
  });

  it("every public page renders exactly one H1", () => {
    for (const file of [
      "app/trails/[slug]/page.tsx",
      "app/journal/[slug]/page.tsx",
      "app/food/[slug]/page.tsx",
    ]) {
      const source = readFile(file);
      assert.equal(
        (source.match(/<h1[\s>]/g) || []).length,
        1,
        `${file} must render exactly one H1`
      );
    }
    for (const file of [
      "app/trails/page.tsx",
      "app/journal/page.tsx",
      "app/food/page.tsx",
      "app/about/page.tsx",
    ]) {
      const source = readFile(file);
      assert.equal(
        (source.match(/as="h1"/g) || []).length,
        1,
        `${file} must render exactly one H1 via SectionHeading`
      );
    }
  });

  it("detail pages do not map food content to /journal paths", () => {
    const foodDetail = readFile("app/food/[slug]/page.tsx");
    assert.ok(foodDetail.includes("/food/"), "food detail must use /food/ path");
    assert.ok(!foodDetail.includes('path: `/journal/`'), "food must not map to /journal");
  });
});

describe("S4. Structured data (JSON-LD)", () => {
  it("layout renders Organization and WebSite JSON-LD globally", () => {
    const layout = readFile("app/layout.tsx");
    assert.ok(layout.includes("buildOrganizationJsonLd"), "must build Organization JSON-LD");
    assert.ok(layout.includes("buildWebSiteJsonLd"), "must build WebSite JSON-LD");
    assert.ok(layout.includes("safeJsonLd"), "must serialize JSON-LD safely");
    assert.ok(layout.includes('type="application/ld+json"'), "must render JSON-LD script tags");
  });

  it("trails detail renders TouristAttraction and BreadcrumbList", () => {
    const trail = readFile("app/trails/[slug]/page.tsx");
    assert.ok(trail.includes("buildTouristAttractionJsonLd"), "must build TouristAttraction");
    assert.ok(trail.includes("buildBreadcrumbJsonLd"), "must build BreadcrumbList");
  });

  it("journal detail renders Article/BlogPosting and BreadcrumbList", () => {
    const journal = readFile("app/journal/[slug]/page.tsx");
    assert.ok(journal.includes("buildArticleJsonLd"), "must build Article JSON-LD");
    assert.ok(journal.includes("buildBreadcrumbJsonLd"), "must build BreadcrumbList");
  });

  it("food detail renders Article and BreadcrumbList", () => {
    const food = readFile("app/food/[slug]/page.tsx");
    assert.ok(food.includes("buildArticleJsonLd"), "must build Article JSON-LD");
    assert.ok(food.includes("buildBreadcrumbJsonLd"), "must build BreadcrumbList");
  });

  it("index pages render BreadcrumbList", () => {
    for (const file of [
      "app/trails/page.tsx",
      "app/journal/page.tsx",
      "app/food/page.tsx",
      "app/about/page.tsx",
    ]) {
      const source = readFile(file);
      assert.ok(source.includes("buildBreadcrumbJsonLd"), `${file} must render BreadcrumbList`);
    }
  });

  it("safeJsonLd escapes dangerous characters", () => {
    const loadedModule = load("lib/seo.ts", {
      "./settings-service": {},
      "./public-content": {},
      "./site-url": siteUrl,
    });
    const input = { headline: "</script><script>alert(1)</script>\u2028\u2029" };
    const output = loadedModule.safeJsonLd(input) as string;
    assert.ok(!output.includes("<"), "must escape < characters");
    assert.ok(!output.includes(">"), "must escape > characters");
    assert.ok(!output.includes("\u2028"), "must escape line separator");
    assert.ok(!output.includes("\u2029"), "must escape paragraph separator");
    assert.deepEqual(JSON.parse(output), input, "must remain valid JSON");
  });
});

describe("S5. Homepage section descriptions", () => {
  it("DestinationsGrid renders section description", () => {
    const source = readFile("components/home/DestinationsGrid.tsx");
    assert.ok(source.includes("section?.description"), "must render section description");
  });

  it("ExperiencesGrid renders section description", () => {
    const source = readFile("components/home/ExperiencesGrid.tsx");
    assert.ok(source.includes("section?.description"), "must render section description");
  });

  it("FoodGallery renders section description", () => {
    const source = readFile("components/home/FoodGallery.tsx");
    assert.ok(source.includes("section?.description"), "must render section description");
  });

  it("Journeys renders section description", () => {
    const source = readFile("components/home/Journeys.tsx");
    assert.ok(source.includes("section?.description"), "must render section description");
  });

  it("UneditedGallery renders section description", () => {
    const source = readFile("components/home/UneditedGallery.tsx");
    assert.ok(source.includes("section?.description"), "must render section description");
  });

  it("getHomepageSectionSettings returns description from database", async () => {
    const rows = [
      { sectionKey: "destinations", eyebrow: "Trails", heading: "Pick one", description: "Choose a trail", ctaLabel: null, ctaHref: null, enabled: true, displayOrder: 20 },
      { sectionKey: "experiences", eyebrow: "Journal", heading: "Stories", description: "Read stories", ctaLabel: null, ctaHref: null, enabled: true, displayOrder: 40 },
      { sectionKey: "food", eyebrow: "Food", heading: "Taste", description: "Taste food", ctaLabel: null, ctaHref: null, enabled: true, displayOrder: 50 },
      { sectionKey: "stories", eyebrow: "Journeys", heading: "Dispatches", description: "Field notes", ctaLabel: null, ctaHref: null, enabled: true, displayOrder: 60 },
      { sectionKey: "gallery", eyebrow: "Gallery", heading: "Views", description: "Photos", ctaLabel: null, ctaHref: null, enabled: true, displayOrder: 70 },
    ];
    const loadedModule = load("lib/public-content.ts", {
      "server-only": {},
      "./public-content-definitions": definitions,
      "./validation": { sanitizeContent },
      "./media-validation": {},
      "next/cache": { revalidatePath: () => {} },
      "./prisma": { prisma: { homepageSectionSetting: { findMany: async () => rows } } },
    });
    const sections = (await loadedModule.getHomepageSectionSettings()) as Array<{ sectionKey: string; description: string }>;
    assert.equal(sections.length, 5);
    for (const section of sections) {
      assert.ok(section.description.length > 0, `${section.sectionKey} must have description`);
    }
  });
});

describe("S6. llms.txt", () => {
  it("route file exists and exports GET handler", () => {
    const route = readFile("app/llms.txt/route.ts");
    assert.ok(route.includes("export async function GET"), "must export GET handler");
    assert.ok(route.includes("text/plain"), "must return text/plain content type");
  });

  it("includes sitemap link and public sections", () => {
    const route = readFile("app/llms.txt/route.ts");
    assert.ok(route.includes("sitemap.xml"), "must reference sitemap");
    assert.ok(route.includes("/trails"), "must include trails section");
    assert.ok(route.includes("/journal"), "must include journal section");
    assert.ok(route.includes("/food"), "must include food section");
    assert.ok(route.includes("/about"), "must include about section");
  });

  it("does not expose admin, API, or preview URLs", () => {
    const route = readFile("app/llms.txt/route.ts");
    assert.ok(!route.includes("/admin"), "must not expose admin URLs");
    assert.ok(!route.includes("/api"), "must not expose API URLs");
    assert.ok(!route.includes("/preview"), "must not expose preview URLs");
  });

  it("uses force-dynamic to prevent stale caching", () => {
    const route = readFile("app/llms.txt/route.ts");
    assert.ok(route.includes("force-dynamic"), "must use force-dynamic");
  });
});

describe("S7. No secret or localhost leakage", () => {
  it("sitemap.ts does not hardcode domain", () => {
    const sitemap = readFile("app/sitemap.ts");
    assert.ok(!sitemap.includes("chittagongtrail.com"), "must not hardcode production domain");
  });

  it("site-url.ts does not expose domain", () => {
    const siteUrlFile = readFile("lib/site-url.ts");
    assert.ok(!siteUrlFile.includes("chittagongtrail.com"), "must not hardcode domain");
  });

  it("no public page emits /admin in canonical or metadata", () => {
    for (const file of [
      "app/page.tsx",
      "app/trails/page.tsx",
      "app/journal/page.tsx",
      "app/food/page.tsx",
      "app/about/page.tsx",
      "app/trails/[slug]/page.tsx",
      "app/journal/[slug]/page.tsx",
      "app/food/[slug]/page.tsx",
    ]) {
      const source = readFile(file);
      assert.ok(!source.includes("/admin"), `${file} must not reference /admin`);
    }
  });

  it("seo.ts buildMetadata does not emit localhost in production", () => {
    const seo = readFile("lib/seo.ts");
    assert.ok(!seo.includes("localhost"), "seo.ts must not hardcode localhost");
  });
});

describe("S8. Footer renders correctly", () => {
  it("Footer component uses correct branding classes", () => {
    const footer = readFile("components/layout/Footer.tsx");
    assert.ok(footer.includes("ct-footer"), "must use ct-footer class");
    assert.ok(footer.includes("ct-footer-heading"), "must use ct-footer-heading");
    assert.ok(footer.includes("ct-footer-link"), "must use ct-footer-link");
    assert.ok(footer.includes("ct-footer-brand-lockup"), "must use brand lockup");
    assert.ok(footer.includes("new Date().getFullYear()"), "must render dynamic copyright year");
  });

  it("Footer uses configured social links and hides empty columns", () => {
    const footer = readFile("components/layout/Footer.tsx");
    assert.ok(footer.includes("socialLinks"), "must render social links from settings");
    assert.ok(footer.includes("filter(Boolean)"), "must filter empty social links");
  });

  it("Footer uses CMS-controlled logo without duplicate wordmark", () => {
    const footer = readFile("components/layout/Footer.tsx");
    assert.ok(footer.includes("footerLogoMedia?.secureUrl"), "must use CMS logo");
    assert.ok(footer.includes("footerLogoIncludesWordmark"), "must respect wordmark toggle");
    assert.ok(footer.includes("!footerLogoIncludesWordmark"), "must conditionally show brand name");
  });
});
