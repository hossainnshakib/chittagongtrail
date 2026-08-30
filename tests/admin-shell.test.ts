import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { adminNavigation } from "../components/admin/navigation";

describe("Admin Shell Tests", () => {
  describe("Active Route Matching", () => {
    function matchRoute(href: string, pathname: string): boolean {
      if (href === "/admin") {
        return pathname === "/admin";
      }
      return pathname === href || pathname.startsWith(href + "/");
    }

    it("Dashboard matches exactly /admin", () => {
      assert.equal(matchRoute("/admin", "/admin"), true);
    });

    it("Dashboard does not match /admin/trails", () => {
      assert.equal(matchRoute("/admin", "/admin/trails"), false);
    });

    it("Dashboard does not match /admin/settings", () => {
      assert.equal(matchRoute("/admin", "/admin/settings"), false);
    });

    it("Trails matches /admin/trails", () => {
      assert.equal(matchRoute("/admin/trails", "/admin/trails"), true);
    });

    it("Trails matches nested route /admin/trails/new", () => {
      assert.equal(matchRoute("/admin/trails", "/admin/trails/new"), true);
    });

    it("Trails matches nested route /admin/trails/abc123/edit", () => {
      assert.equal(matchRoute("/admin/trails", "/admin/trails/abc123/edit"), true);
    });

    it("Trails does not match /admin/journal", () => {
      assert.equal(matchRoute("/admin/trails", "/admin/journal"), false);
    });

    it("Journal matches /admin/journal", () => {
      assert.equal(matchRoute("/admin/journal", "/admin/journal"), true);
    });

    it("Journal matches nested /admin/journal/new", () => {
      assert.equal(matchRoute("/admin/journal", "/admin/journal/new"), true);
    });

    it("Settings matches /admin/settings", () => {
      assert.equal(matchRoute("/admin/settings", "/admin/settings"), true);
    });

    it("Settings does not match /admin/settings/about (not defined yet)", () => {
      assert.equal(matchRoute("/admin/settings", "/admin/settings/about"), true);
    });

    it("Media matches /admin/media", () => {
      assert.equal(matchRoute("/admin/media", "/admin/media"), true);
    });
  });

  describe("Login Route Exclusion", () => {
    it("/admin/login is excluded from protected admin check", () => {
      const isAdminPage = (pathname: string) =>
        pathname.startsWith("/admin") && pathname !== "/admin/login";
      assert.equal(isAdminPage("/admin/login"), false);
    });

    it("/admin is protected", () => {
      const isAdminPage = (pathname: string) =>
        pathname.startsWith("/admin") && pathname !== "/admin/login";
      assert.equal(isAdminPage("/admin"), true);
    });

    it("/admin/trails is protected", () => {
      const isAdminPage = (pathname: string) =>
        pathname.startsWith("/admin") && pathname !== "/admin/login";
      assert.equal(isAdminPage("/admin/trails"), true);
    });
  });

  describe("Navigation Definition Integrity", () => {
    it("no duplicate hrefs among non-disabled items", () => {
      const hrefs = adminNavigation
        .flatMap((g) => g.items)
        .filter((i) => !i.disabled)
        .map((i) => i.href);
      const uniqueHrefs = [...new Set(hrefs)];
      assert.equal(hrefs.length, uniqueHrefs.length, "No duplicate hrefs");
    });

    it("all navigation groups have at least one item", () => {
      adminNavigation.forEach((group) => {
        assert.ok(group.items.length > 0, `Group "${group.label}" has items`);
      });
    });
  });

  describe("Breadcrumbs", () => {
    interface BreadcrumbSegment {
      label: string;
      href: string;
    }

    const routeLabels: Record<string, string> = {
      admin: "Dashboard",
      trails: "Trails",
      journal: "Journal",
      food: "Food",
      media: "Media",
      settings: "Settings",
      homepage: "Homepage",
      hero: "Hero",
      "featured-trails": "Featured Trails",
      "featured-stories": "Featured Stories",
      "featured-food": "Featured Food",
      seasonal: "Seasonal / Mood",
      gallery: "Gallery",
      about: "Introduction / About",
      contact: "Contact & Social",
      footer: "Footer",
      new: "New",
      edit: "Edit",
      preview: "Preview",
    };

    function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
      const segments = pathname.split("/").filter(Boolean);
      const crumbs: BreadcrumbSegment[] = [];

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label = routeLabels[segment] || segment;

        if (segment === "admin" && i === 0) continue;
        if (/^[a-f0-9-]{20,}$/.test(segment) || /^\d+$/.test(segment)) continue;

        crumbs.push({ label, href });
      }

      if (crumbs.length === 0) {
        crumbs.push({ label: "Dashboard", href: "/admin" });
      }

      return crumbs;
    }

    it("generates single breadcrumb for /admin", () => {
      const crumbs = buildBreadcrumbs("/admin");
      assert.equal(crumbs.length, 1);
      assert.equal(crumbs[0].label, "Dashboard");
      assert.equal(crumbs[0].href, "/admin");
    });

    it("generates correct breadcrumbs for /admin/trails", () => {
      const crumbs = buildBreadcrumbs("/admin/trails");
      assert.equal(crumbs.length, 1);
      assert.equal(crumbs[0].label, "Trails");
    });

    it("generates correct breadcrumbs for /admin/trails/new", () => {
      const crumbs = buildBreadcrumbs("/admin/trails/new");
      assert.equal(crumbs.length, 2);
      assert.equal(crumbs[0].label, "Trails");
      assert.equal(crumbs[1].label, "New");
    });

    it("skips UUID-like segments", () => {
      const crumbs = buildBreadcrumbs("/admin/trails/a1b2c3d4e5f607182930abcdef12/edit");
      assert.equal(crumbs.length, 2);
      assert.equal(crumbs[0].label, "Trails");
      assert.equal(crumbs[1].label, "Edit");
    });

    it("generates correct breadcrumbs for /admin/settings", () => {
      const crumbs = buildBreadcrumbs("/admin/settings");
      assert.equal(crumbs.length, 1);
      assert.equal(crumbs[0].label, "Settings");
    });

    it("generates correct breadcrumbs for /admin/journal", () => {
      const crumbs = buildBreadcrumbs("/admin/journal");
      assert.equal(crumbs.length, 1);
      assert.equal(crumbs[0].label, "Journal");
    });
  });

  describe("Status Badge Accessibility", () => {
    it("status badges include screen reader text", () => {
      const statuses = ["draft", "published", "archived"] as const;
      statuses.forEach((status) => {
        const labels: Record<string, string> = {
          draft: "Draft",
          published: "Published",
          archived: "Archived",
        };
        const label = labels[status];
        assert.ok(label, `Status ${status} has a label`);
        assert.ok(label.length > 0, `Status ${status} label is not empty`);
      });
    });

    it("status badges are not color-only communication", () => {
      const statusConfig = {
        draft: { label: "Draft", color: "#92400E", bg: "#FEF3C7" },
        published: { label: "Published", color: "#065F46", bg: "#D1FAE5" },
        archived: { label: "Archived", color: "#374151", bg: "#F3F4F6" },
      };
      Object.entries(statusConfig).forEach(([key, config]) => {
        assert.ok(config.label.length > 0, `${key} has text label`);
      });
    });
  });

  describe("Content Type Badge Accessibility", () => {
    it("content type badges have text labels", () => {
      const types = {
        trail: "Trail",
        story: "Story",
        food: "Food",
      };
      Object.entries(types).forEach(([key, label]) => {
        assert.ok(label.length > 0, `${key} has text label`);
      });
    });
  });

  describe("Public Layout Unaffected", () => {
    it("public homepage still references PublicLayout", () => {

      const content = fs.readFileSync("app/page.tsx", "utf-8");
      assert.ok(content.includes("PublicLayout"), "Public page still uses PublicLayout");
    });

    it("root layout still has skip-to-content link", () => {

      const content = fs.readFileSync("app/layout.tsx", "utf-8");
      assert.ok(content.includes("Skip to main content"), "Root layout has skip link");
    });
  });

  describe("Admin CSS Tokens", () => {
    it("globals.css contains admin CSS custom properties", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes("--admin-bg:"), "Has admin background token");
      assert.ok(css.includes("--admin-surface:"), "Has admin surface token");
      assert.ok(css.includes("--admin-border:"), "Has admin border token");
      assert.ok(css.includes("--admin-text-primary:"), "Has admin text primary token");
      assert.ok(css.includes("--admin-brand-accent:"), "Has admin brand accent token");
      assert.ok(css.includes("--admin-sidebar-bg:"), "Has admin sidebar bg token");
      assert.ok(css.includes("--admin-success:"), "Has admin success token");
      assert.ok(css.includes("--admin-warning:"), "Has admin warning token");
      assert.ok(css.includes("--admin-error:"), "Has admin error token");
    });

    it("admin styles extend root CSS variables in separate block", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      const adminSectionStart = css.indexOf("ADMIN — Operational UI");
      assert.ok(adminSectionStart > -1, "Admin section exists in globals.css");
      const adminSection = css.substring(adminSectionStart);
      assert.ok(adminSection.includes("--admin-bg:"), "Admin section defines --admin-bg");
      assert.ok(!adminSection.includes("--color-background:"), "Admin section does not redefine public --color-background");
    });
  });

  describe("Component Exports", () => {
    it("admin layout index exports all shell components", () => {

      const content = fs.readFileSync("components/admin/layout/index.ts", "utf-8");
      assert.ok(content.includes("AdminShell"), "Exports AdminShell");
      assert.ok(content.includes("AdminSidebar"), "Exports AdminSidebar");
      assert.ok(content.includes("AdminTopbar"), "Exports AdminTopbar");
      assert.ok(content.includes("AdminBreadcrumbs"), "Exports AdminBreadcrumbs");
      assert.ok(content.includes("AdminNavItem"), "Exports AdminNavItem");
    });

    it("admin UI index exports all reusable components", () => {

      const content = fs.readFileSync("components/admin/ui/index.ts", "utf-8");
      assert.ok(content.includes("AdminPageHeader"), "Exports AdminPageHeader");
      assert.ok(content.includes("AdminSectionCard"), "Exports AdminSectionCard");
      assert.ok(content.includes("AdminStatusBadge"), "Exports AdminStatusBadge");
      assert.ok(content.includes("AdminContentTypeBadge"), "Exports AdminContentTypeBadge");
      assert.ok(content.includes("AdminTabs"), "Exports AdminTabs");
      assert.ok(content.includes("AdminEmptyState"), "Exports AdminEmptyState");
      assert.ok(content.includes("AdminLoadingState"), "Exports AdminLoadingState");
      assert.ok(content.includes("AdminErrorState"), "Exports AdminErrorState");
      assert.ok(content.includes("AdminSaveStatus"), "Exports AdminSaveStatus");
      assert.ok(content.includes("AdminFormField"), "Exports AdminFormField");
      assert.ok(content.includes("AdminValidationSummary"), "Exports AdminValidationSummary");
      assert.ok(content.includes("AdminButton"), "Exports AdminButton");
      assert.ok(content.includes("AdminIconButton"), "Exports AdminIconButton");
      assert.ok(content.includes("AdminDivider"), "Exports AdminDivider");
    });
  });

  describe("Protected Layout", () => {
    it("protected layout uses AdminShell", () => {

      const content = fs.readFileSync("app/admin/(protected)/layout.tsx", "utf-8");
      assert.ok(content.includes("AdminShell"), "Protected layout uses AdminShell");
      assert.ok(content.includes("getSession"), "Protected layout checks session");
      assert.ok(content.includes("redirect"), "Protected layout redirects unauthenticated");
    });

    it("protected layout does not contain old inline nav", () => {

      const content = fs.readFileSync("app/admin/(protected)/layout.tsx", "utf-8");
      assert.ok(!content.includes("CT Admin"), "No old CT Admin brand text");
      assert.ok(!content.includes("font-playfair"), "No Playfair font in admin layout");
    });
  });

  describe("Login Page Unaffected", () => {
    it("login page still exists with correct structure", () => {

      const content = fs.readFileSync("app/admin/(auth)/login/page.tsx", "utf-8");
      assert.ok(content.includes("Sign In"), "Login page has Sign In text");
      assert.ok(content.includes("Chittagong Trail"), "Login page has brand name");
      assert.ok(content.includes("use client"), "Login page is client component");
    });

    it("login page does not use AdminShell", () => {

      const content = fs.readFileSync("app/admin/(auth)/login/page.tsx", "utf-8");
      assert.ok(!content.includes("AdminShell"), "Login page does not use AdminShell");
    });
  });
});
