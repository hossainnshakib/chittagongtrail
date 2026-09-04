import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

function changedFiles() {
  const output = execSync("git -c safe.directory=G:/ctgtrail diff --name-only HEAD", {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  return output.split(/\r?\n/).filter(Boolean);
}

describe("A7R.9 Public Layout, Contrast, and Empty-State Polish", () => {
  it("uses one centered public container contract", () => {
    const container = readFile("components/ui/Container.tsx");
    const css = readFile("app/globals.css");

    assert.ok(container.includes("ct-container"));
    assert.ok(container.includes('data-public-container="true"'));
    assert.match(css, /\.ct-container\s*{[\s\S]*max-width: var\(--ct-content-max-width\)/);
    assert.match(css, /\.ct-container\s*{[\s\S]*margin-inline: auto/);
    assert.match(css, /\.ct-container\s*{[\s\S]*padding-left: var\(--ct-container-padding\)/);
  });

  it("keeps list and about page headers on the shared spacing contract", () => {
    const pages = [
      "app/trails/page.tsx",
      "app/journal/page.tsx",
      "app/food/page.tsx",
      "app/about/page.tsx",
    ];
    const css = readFile("app/globals.css");

    assert.ok(css.includes(".ct-page-header"));
    assert.ok(css.includes("calc(var(--ct-header-height) + 1.75rem)"));
    assert.ok(css.includes(".ct-page-body"));

    for (const page of pages) {
      const source = readFile(page);
      assert.ok(source.includes('className="ct-page-header ct-cream"'), `${page} should use shared page header`);
      assert.ok(source.includes('className="ct-page-body ct-warm"'), `${page} should use shared page body`);
      assert.ok(source.includes('className="ct-page-heading"'), `${page} should use shared heading width`);
      assert.ok(source.includes('as="h1"'), `${page} should render the page heading as h1`);
      assert.ok(!source.includes("pt-32"), `${page} should not use the old oversized top padding`);
    }
  });

  it("exposes footer contrast, hierarchy, and focus classes", () => {
    const footer = readFile("components/layout/Footer.tsx");
    const css = readFile("app/globals.css");

    assert.ok(footer.includes('className="ct-footer"'));
    assert.ok(footer.includes("ct-footer-heading"));
    assert.ok(footer.includes("ct-footer-brand-name"));
    assert.ok(footer.includes("ct-footer-link"));
    assert.ok(footer.includes("new Date().getFullYear()"));
    assert.ok(!footer.includes("text-dark-text/50"));
    assert.ok(!footer.includes("configured"));
    assert.match(css, /\.ct-footer-link\s*{[\s\S]*min-height: 44px/);
    assert.ok(css.includes(".ct-footer-link:focus-visible"));
    assert.ok(css.includes(".ct-footer-grid"));
  });

  it("uses compact editorial empty states without public admin wording", () => {
    const emptyState = readFile("components/ui/PublicEmptyState.tsx");
    const css = readFile("app/globals.css");
    const publicFiles = [
      "app/trails/page.tsx",
      "app/journal/page.tsx",
      "app/food/page.tsx",
      "components/home/DestinationsGrid.tsx",
      "components/home/ExperiencesGrid.tsx",
      "components/home/FoodGallery.tsx",
      "components/home/Journeys.tsx",
      "components/home/UneditedGallery.tsx",
    ];

    assert.ok(emptyState.includes('data-public-empty-state="compact"'));
    assert.match(css, /\.ct-empty-state\s*{[\s\S]*min-height: 0/);
    assert.match(css, /\.ct-empty-state\s*{[\s\S]*padding: 1\.25rem/);

    for (const file of publicFiles) {
      const source = readFile(file);
      assert.ok(source.includes("PublicEmptyState"), `${file} should use the shared empty state`);
      assert.ok(!source.includes("configured in Admin"), `${file} should avoid admin setup wording`);
      assert.ok(!source.includes("Featured Trails)"), `${file} should avoid internal CMS labels`);
    }
  });

  it("keeps public navigation readable and accessible", () => {
    const header = readFile("components/layout/Header.tsx");
    const menu = readFile("components/layout/MobileMenu.tsx");
    const css = readFile("app/globals.css");

    assert.ok(header.includes('aria-controls="public-mobile-menu"'));
    assert.ok(header.includes("aria-expanded={isMobileMenuOpen}"));
    assert.ok(menu.includes('id="public-mobile-menu"'));
    assert.ok(menu.includes('role="dialog"'));
    assert.ok(menu.includes('aria-modal="true"'));
    assert.match(css, /\.ct-nav\s*{[\s\S]*background: rgba\(44, 26, 18, 0\.82\)/);
    assert.match(css, /\.ct-nav-link\s*{[\s\S]*min-height: 44px/);
    assert.match(css, /\.ct-nav-burger\s*{[\s\S]*width: 44px/);
    assert.match(css, /\.ct-nav-burger\s*{[\s\S]*height: 44px/);
  });

  it("keeps hero media behavior intact while improving readability", () => {
    const hero = readFile("components/home/Hero.tsx");
    const css = readFile("app/globals.css");

    assert.ok(hero.includes("<video"));
    assert.ok(hero.includes('resolved.provider === "DIRECT"'));
    assert.ok(hero.includes("posterSrc"));
    assert.ok(hero.includes("prefers-reduced-motion"));
    assert.ok(hero.includes("Math.max(0.65"));
    assert.ok(!hero.includes("youtube.com/embed") || hero.includes('resolved.provider === "YOUTUBE"'));
    assert.match(css, /\.hero-title\s*{[\s\S]*letter-spacing: 0/);
    assert.match(css, /\.hero-subtitle\s*{[\s\S]*color: #F7EBD8/);
  });

  it("does not hide the Next.js development indicator in application UI", () => {
    const css = readFile("app/globals.css");
    const publicLayout = readFile("components/layout/PublicLayout.tsx");

    assert.equal(/nextjs|__next|data-nextjs|dev-indicator/i.test(css), false);
    assert.equal(/nextjs|__next|data-nextjs|dev-indicator/i.test(publicLayout), false);
  });

  it("preserves public metadata and JSON-LD behavior", () => {
    const routes = [
      "app/page.tsx",
      "app/trails/page.tsx",
      "app/journal/page.tsx",
      "app/food/page.tsx",
      "app/about/page.tsx",
      "app/trails/[slug]/page.tsx",
      "app/journal/[slug]/page.tsx",
      "app/food/[slug]/page.tsx",
    ];

    for (const route of routes) {
      const source = readFile(route);
      assert.ok(source.includes("generateMetadata") || source.includes("metadata:"), `${route} should keep metadata`);
    }

    for (const route of routes.filter((route) => route !== "app/page.tsx")) {
      const source = readFile(route);
      assert.ok(source.includes('type="application/ld+json"'), `${route} should keep JSON-LD script`);
    }
  });

  it("does not change admin, Prisma, API, Cloudinary, or dependency surfaces", () => {
    const forbidden = [
      /^app\/admin\//,
      /^app\/api\//,
      /^components\/admin\//,
      /^prisma\//,
      /^lib\/cloudinary\.ts$/,
      /^package(-lock)?\.json$/,
    ];

    for (const file of changedFiles()) {
      assert.equal(forbidden.some((pattern) => pattern.test(file)), false, `${file} is outside A7R.9 scope`);
    }
  });
});
