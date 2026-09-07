import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import ts from "typescript";
import * as definitions from "../lib/public-content-definitions";
import { demoPages, demoSections } from "../lib/demo-data";
import { sanitizeContent } from "../lib/validation";

// Execute the actual server modules with isolated persistence/cache boundaries.
// No live database or environment mutation is involved in these regression tests.
function load(file: string, dependencies: Record<string, unknown>) {
  const output = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const loadedModule = { exports: {} };
  const realRequire = createRequire(resolve(file));
  const require = (id: string) => id in dependencies ? dependencies[id] : realRequire(id);
  new Function("require", "module", "exports", output)(require, loadedModule, loadedModule.exports);
  // Runtime-loaded modules retain their actual exported contracts at the assertions below.
  return loadedModule.exports as Record<string, (...args: unknown[]) => unknown>;
}
const origin = "https://example.com";
const siteUrl = { getConfiguredSiteOrigin: () => origin, getConfiguredSiteUrl: (path = "") => origin + path };

describe("Public content and indexing runtime audit", () => {
  it("saves and reloads visible page content and empty explicit SEO overrides", async () => {
    const records = demoPages.map(p => ({ ...p, metaTitle: "", metaDescription: "", ogTitle: "", ogDescription: "", updatedAt: new Date(0), ogMedia: null }));
    const tx = {
      pageSeoSetting: {
        upsert: async ({ where, update }: { where: { pageKey: string }; update: object }) => Object.assign(records.find(p => p.pageKey === where.pageKey)!, update),
        findUnique: async ({ where }: { where: { pageKey: string } }) => records.find(p => p.pageKey === where.pageKey),
      },
      siteSettings: { update: async () => ({}), findUnique: async () => null },
    };
    const loadedModule = load("lib/public-content.ts", {
      "server-only": {}, "./public-content-definitions": definitions, "./validation": { sanitizeContent },
      "./media-validation": {}, "next/cache": { revalidatePath: () => {} },
      "./prisma": { prisma: { ...tx, $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(tx) } },
    });
    const changed = records.map(p => ({ ...p, visibleTitle: `Edited ${p.pageKey}`, visibleDescription: `Saved description for ${p.pageKey}`, useVisibleTitleAsMetaTitle: false, useVisibleDescriptionAsMetaDescription: false }));
    await loadedModule.updatePageSeoSettings(changed);
    const page = await loadedModule.getPublicPageSeo("trails") as typeof changed[number];
    assert.equal(page.visibleTitle, "Edited trails");
    assert.equal(page.visibleDescription, "Saved description for trails");
    assert.equal(page.metaTitle, "");
    assert.equal(page.metaDescription, "");
  });
  it("loads every section heading and description from saved settings", async () => {
    const rows = demoSections.map(p => ({ ...p, heading: `Saved ${p.sectionKey}`, description: `Saved description ${p.sectionKey}` }));
    const loadedModule = load("lib/public-content.ts", {
      "server-only": {}, "./public-content-definitions": definitions, "./validation": { sanitizeContent },
      "./media-validation": {}, "next/cache": {},
      "./prisma": { prisma: { homepageSectionSetting: { findMany: async () => rows } } },
    });
    const sections = await loadedModule.getHomepageSectionSettings() as typeof rows;
    assert.equal(sections.length, 5);
    for (const section of sections) {
      assert.equal(section.heading, `Saved ${section.sectionKey}`);
      assert.equal(section.description, `Saved description ${section.sectionKey}`);
    }
  });
  it("uses page overrides, then global SEO, then visible copy", async () => {
    const page = { ...demoPages[1], metaTitle: "", metaDescription: "", ogMedia: null };
    const settings = { defaultMetaTitle: "Global title", defaultMetaDescription: "Global description", siteName: "Chittagong Trail", allowIndexing: true };
    const loadedModule = load("lib/seo.ts", { "./settings-service": { getPublicSiteSettings: async () => settings }, "./public-content": { getPublicPageSeo: async () => page }, "./site-url": siteUrl });
    let result = await loadedModule.buildPublicPageMetadata("trails") as { title: string; description: string };
    assert.equal(result.title, "Global title"); assert.equal(result.description, "Global description");
    page.metaTitle = "Page title"; page.metaDescription = "Page description";
    result = await loadedModule.buildPublicPageMetadata("trails") as typeof result;
    assert.equal(result.title, "Page title"); assert.equal(result.description, "Page description");
    page.metaTitle = ""; page.metaDescription = ""; settings.defaultMetaTitle = ""; settings.defaultMetaDescription = "";
    result = await loadedModule.buildPublicPageMetadata("trails") as typeof result;
    assert.equal(result.title, page.visibleTitle); assert.equal(result.description, page.visibleDescription);
  });
  it("excludes a noindex homepage, honours page exclusions and keeps food canonical paths", async () => {
    const rows = demoPages.map(p => ({ ...p, updatedAt: new Date(0), robotsIndex: p.pageKey !== "home", includeInSitemap: p.pageKey !== "about" }));
    const loadedModule = load("app/sitemap.ts", {
      "@/lib/site-url": siteUrl, "@/lib/public-content": definitions,
      "@/lib/prisma": { prisma: {
        siteSettings: { findUnique: async () => ({ allowIndexing: true }) },
        pageSeoSetting: { findMany: async () => rows },
        trailLocation: { findMany: async ({ where }: { where: { status: string } }) => { assert.equal(where.status, "PUBLISHED"); return [{ slug: "demo-trail" }]; } },
        journalPost: { findMany: async ({ where }: { where: { status: string; type: string } }) => { assert.equal(where.status, "PUBLISHED"); return [{ slug: where.type === "FOOD" ? "demo-food" : "demo-story" }]; } },
      } },
    });
    const entries = await loadedModule.default() as { url: string }[];
    const urls = entries.map(e => e.url);
    assert.ok(!urls.includes(origin + "/")); assert.ok(!urls.includes(origin + "/about"));
    assert.ok(urls.includes(origin + "/food/demo-food"));
    assert.ok(urls.includes(origin + "/journal/demo-story"));
    assert.ok(!urls.includes(origin + "/journal/demo-food"));
    assert.ok(urls.every(url => !/localhost|\/admin|\/api|\/preview|\/new/.test(url)));
  });
  it("robots disallows private routes and references the configured sitemap", () => {
    const loadedModule = load("app/robots.ts", { "@/lib/site-url": siteUrl });
    const result = loadedModule.default() as { rules: { disallow: string[] }; sitemap: string };
    for (const route of ["/admin", "/api", "/preview"]) assert.ok(result.rules.disallow.includes(route));
    assert.equal(result.sitemap, origin + "/sitemap.xml");
  });
  it("serializes JSON-LD safely and preserves stable detail canonicals", () => {
    const loadedModule = load("lib/seo.ts", { "./settings-service": {}, "./public-content": {}, "./site-url": siteUrl });
    const input = { headline: "</script><script>alert(1)</script>\u2028" };
    const output = loadedModule.safeJsonLd(input) as string;
    assert.ok(!output.includes("<")); assert.deepEqual(JSON.parse(output), input);
    for (const path of ["/trails/demo-trail", "/journal/demo-story", "/food/demo-food"]) {
      const result = loadedModule.buildMetadata({ title: "Demo", path }) as { alternates: { canonical: string } };
      assert.equal(result.alternates.canonical, origin + path);
    }
  });
});
