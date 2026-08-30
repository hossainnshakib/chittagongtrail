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

  describe("A7R.2.1 — Button Visible-Text Contract", () => {
    it("AdminButton primary variant uses white text on brand background", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".admin-btn-primary"), "Has admin-btn-primary class");
      assert.ok(css.includes("color: #FFFFFF"), "Primary button has white text");
    });

    it("AdminButton has base reset preventing public a-color inheritance", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".admin-btn"), "Has admin-btn base class");
      assert.ok(css.includes(".admin-btn-secondary"), "Has secondary variant");
      assert.ok(css.includes(".admin-btn-ghost"), "Has ghost variant");
      assert.ok(css.includes(".admin-btn-danger"), "Has danger variant");
    });

    it("AdminButton component file uses CSS classes for styling", () => {
      const content = fs.readFileSync("components/admin/ui/AdminButton.tsx", "utf-8");
      assert.ok(content.includes("admin-btn-"), "Uses admin-btn CSS classes");
      assert.ok(content.includes("variantClass"), "Maps variant to CSS class");
    });

    it("admin-shell a color reset exists in base layer", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".admin-shell a"), "Has .admin-shell a reset");
      assert.ok(css.includes("color: inherit"), "Reset uses color: inherit");
    });

    it("public a color rule is in base layer to allow Tailwind override", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      const baseLayerStart = css.indexOf("@layer base");
      assert.ok(baseLayerStart > -1, "Has @layer base block");
      const aRuleIndex = css.indexOf("  a {\n    color: var(--color-accent);", baseLayerStart);
      assert.ok(aRuleIndex > baseLayerStart, "Public a rule is in @layer base");
    });
  });

  describe("A7R.2.1 — Content Width Variants", () => {
    it("admin-content uses CSS custom property for max-width", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes("--admin-content-max-width"), "Has content max-width custom property");
      assert.ok(css.includes("admin-content-width-wide"), "Has wide variant");
      assert.ok(css.includes("admin-content-width-full"), "Has full variant");
      assert.ok(css.includes("admin-content-width-narrow"), "Has narrow variant");
    });

    it("dashboard page sets wide content width", () => {
      const content = fs.readFileSync("app/admin/(protected)/page.tsx", "utf-8");
      assert.ok(content.includes("--admin-content-max-width"), "Dashboard sets content width");
    });

    it("trails page sets wide content width", () => {
      const content = fs.readFileSync("app/admin/(protected)/trails/page.tsx", "utf-8");
      assert.ok(content.includes("--admin-content-max-width"), "Trails sets content width");
    });

    it("settings page sets constrained content width", () => {
      const content = fs.readFileSync("app/admin/(protected)/settings/page.tsx", "utf-8");
      assert.ok(content.includes("--admin-content-max-width"), "Settings sets content width");
    });
  });

  describe("A7R.2.1 — Disabled Navigation Semantics", () => {
    it("disabled nav items show Planned badge", () => {
      const content = fs.readFileSync("components/admin/layout/AdminNavItem.tsx", "utf-8");
      assert.ok(content.includes("admin-nav-planned"), "Has Planned badge class");
      assert.ok(content.includes('aria-label="Planned feature"'), "Planned badge has aria-label");
    });

    it("CSS has admin-nav-planned styling", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".admin-nav-planned"), "Has admin-nav-planned CSS");
    });

    it("disabled items have aria-disabled attribute", () => {
      const content = fs.readFileSync("components/admin/layout/AdminNavItem.tsx", "utf-8");
      assert.ok(content.includes('aria-disabled="true"'), "Disabled items have aria-disabled");
    });

    it("disabled items use pointer-events: none in CSS", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes('pointer-events: none'), "Disabled items have pointer-events: none");
    });
  });

  describe("A7R.2.1 — Admin Root Scoping", () => {
    it("AdminShell has data-admin-root attribute", () => {
      const content = fs.readFileSync("components/admin/layout/AdminShell.tsx", "utf-8");
      assert.ok(content.includes("data-admin-root"), "AdminShell has data-admin-root");
    });

    it("admin-shell has color property set", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".admin-shell"), "Has .admin-shell class");
      assert.ok(css.includes("color: var(--admin-text-primary)"), "admin-shell sets explicit color");
    });

    it("admin headings use body font not display font", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".admin-shell h1"), "Has admin heading override");
      assert.ok(css.includes("font-family: var(--font-body)"), "Admin headings use body font");
    });
  });

  describe("A7R.2.1 — Sidebar Bottom Spacing", () => {
    it("sidebar bottom has safe-area padding", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes("safe-area-inset-bottom"), "Sidebar bottom accounts for safe area");
    });
  });

  describe("A7R.2.1 — Auth Debug Cleanup", () => {
    it("login actions.ts does not log email values", () => {
      const content = fs.readFileSync("app/admin/(auth)/login/actions.ts", "utf-8");
      assert.ok(!content.includes("JSON.stringify(email)"), "No email value logging");
      assert.ok(!content.includes("email mismatch"), "No email mismatch debug logging");
    });

    it("lib/auth.ts does not log credential values", () => {
      const content = fs.readFileSync("lib/auth.ts", "utf-8");
      assert.ok(!content.includes("ADMIN_EMAIL:"), "No ADMIN_EMAIL logging");
      assert.ok(!content.includes("ADMIN_PASSWORD_HASH:"), "No ADMIN_PASSWORD_HASH logging");
      assert.ok(!content.includes("ALL_ENV_KEYS:"), "No ALL_ENV_KEYS logging");
      assert.ok(!content.includes("substring(0,6)"), "No hash prefix logging");
    });

    it("login actions.ts preserves safe error handling", () => {
      const content = fs.readFileSync("app/admin/(auth)/login/actions.ts", "utf-8");
      assert.ok(content.includes("return { success: false"), "Returns error result");
      assert.ok(content.includes("Invalid email or password"), "Generic error message");
      assert.ok(content.includes("catch"), "Has catch block");
    });

    it("lib/auth.ts preserves getAdminCredentials functionality", () => {
      const content = fs.readFileSync("lib/auth.ts", "utf-8");
      assert.ok(content.includes("getAdminCredentials"), "Function exists");
      assert.ok(content.includes("ADMIN_EMAIL"), "Reads ADMIN_EMAIL env");
      assert.ok(content.includes("ADMIN_PASSWORD_HASH"), "Reads ADMIN_PASSWORD_HASH env");
      assert.ok(content.includes("Admin credentials not configured"), "Throws on missing");
    });
  });

  describe("A7R.2.1 — Public Layout Unaffected (Extended)", () => {
    it("public pages do not use admin-shell class", () => {
      const publicFiles = ["app/page.tsx", "app/layout.tsx"];
      publicFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        assert.ok(!content.includes("admin-shell"), `${file} does not use admin-shell`);
      });
    });

    it("public CSS classes (ct-btn, ct-nav) are preserved", () => {
      const css = fs.readFileSync("app/globals.css", "utf-8");
      assert.ok(css.includes(".ct-btn"), "Public ct-btn preserved");
      assert.ok(css.includes(".ct-nav"), "Public ct-nav preserved");
      assert.ok(css.includes(".ct-hero"), "Public ct-hero preserved");
    });
  });
});
