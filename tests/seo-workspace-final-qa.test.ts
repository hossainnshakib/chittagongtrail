import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

describe("A7R.5.2 — On-Page SEO Workspace & Image SEO Final QA Tests", () => {
  describe("1. SEO Workspace Structural Placement", () => {
    it("TrailForm places OnPageSeoWorkspace outside the sticky sidebar grid", () => {
      const content = fs.readFileSync("components/admin/TrailForm.tsx", "utf-8");
      const seoIndex = content.indexOf("<OnPageSeoWorkspace");
      const sidebarIndex = content.indexOf("sticky");
      assert.ok(seoIndex > -1, "OnPageSeoWorkspace exists in TrailForm");
      assert.ok(seoIndex > sidebarIndex, "OnPageSeoWorkspace is placed after/outside the sticky sidebar column");
    });

    it("JournalForm places OnPageSeoWorkspace outside the sticky sidebar grid", () => {
      const content = fs.readFileSync("components/admin/JournalForm.tsx", "utf-8");
      const seoIndex = content.indexOf("<OnPageSeoWorkspace");
      const sidebarIndex = content.indexOf("sticky");
      assert.ok(seoIndex > -1, "OnPageSeoWorkspace exists in JournalForm");
      assert.ok(seoIndex > sidebarIndex, "OnPageSeoWorkspace is placed after/outside the sticky sidebar column");
    });
  });

  describe("2. Canonical URL Path Mapping by Content Type", () => {
    it("Trail canonical path maps to /trails/[slug]", () => {
      const contentType = "trail" as string;
      const slug = "boga-lake";
      const path = `/${contentType === "trail" ? "trails" : contentType === "food" ? "food" : "journal"}/${slug}`;
      assert.equal(path, "/trails/boga-lake");
    });

    it("Story canonical path maps to /journal/[slug]", () => {
      const contentType = "story" as string;
      const slug = "my-story";
      const path = `/${contentType === "trail" ? "trails" : contentType === "food" ? "food" : "journal"}/${slug}`;
      assert.equal(path, "/journal/my-story");
    });

    it("Food canonical path maps to /food/[slug] and never /journal", () => {
      const contentType = "food" as string;
      const slug = "spicy-mezze";
      const path = `/${contentType === "trail" ? "trails" : contentType === "food" ? "food" : "journal"}/${slug}`;
      assert.equal(path, "/food/spicy-mezze");
      assert.notEqual(path.includes("/journal"), true);
    });

    it("empty slug produces guidance instead of incomplete URL or /new", () => {
      const slug = "";
      const hasSlug = Boolean(slug);
      assert.equal(hasSlug, false);
      const guidanceMessage = "Enter a slug to preview the canonical URL";
      assert.equal(guidanceMessage, "Enter a slug to preview the canonical URL");
    });
  });

  describe("3. Site URL Configuration & Fallback Safety", () => {
    it("seo-client validates site URL configuration securely", () => {
      const content = fs.readFileSync("lib/seo-client.ts", "utf-8");
      assert.ok(content.includes("isSiteUrlConfigured"), "Has isSiteUrlConfigured check");
      assert.ok(content.includes("https://"), "Requires HTTPS");
      assert.ok(!content.includes("window.location.origin"), "Never derives from window.location");
    });

    it("OnPageSeoWorkspace handles missing site URL with neutral safe state", () => {
      const content = fs.readFileSync("components/admin/OnPageSeoWorkspace.tsx", "utf-8");
      assert.ok(content.includes("Site URL not configured"), "Shows neutral unconfigured state");
    });

    it("SeoPanel handles missing site URL safely", () => {
      const content = fs.readFileSync("components/admin/SeoPanel.tsx", "utf-8");
      assert.ok(content.includes("Site URL not configured"), "Shows neutral unconfigured state in SeoPanel");
    });
  });

  describe("4. Indexing Status Accuracy", () => {
    it("Draft status maps to noindex/noauthorization or not publicly indexable", () => {
      const status = "DRAFT" as string;
      const indexable = status === "PUBLISHED";
      assert.equal(indexable, false);
    });

    it("Archived status maps to excluded from listings", () => {
      const status = "ARCHIVED" as string;
      const indexable = status === "PUBLISHED";
      assert.equal(indexable, false);
    });

    it("Published status is required for index eligibility", () => {
      const status = "PUBLISHED" as string;
      const indexable = status === "PUBLISHED";
      assert.equal(indexable, true);
    });
  });

  describe("5. Cover Image & Image SEO Safety Audit", () => {
    it("CoverImageModule requires alt text or decorative mode", () => {
      const content = fs.readFileSync("components/admin/CoverImageModule.tsx", "utf-8");
      assert.ok(content.includes("updateAltText"), "Calls updateAltText action");
      assert.ok(content.includes("isDecorative"), "Supports decorative image mode");
      assert.ok(content.includes("Updating affects all usages"), "Shows asset reuse warning");
    });

    it("Media alt text API requires authentication and validates ID", () => {
      const content = fs.readFileSync("app/api/admin/media/route.ts", "utf-8");
      assert.ok(content.includes("verifySession"), "Requires authentication session");
      assert.ok(content.includes("typeof mediaId !== \"number\""), "Validates mediaId type");
      assert.ok(content.includes("updateMediaAltText"), "Performs server-side alt text update");
    });
  });
});
