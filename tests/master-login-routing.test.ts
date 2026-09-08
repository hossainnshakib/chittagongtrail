import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

function readFile(rel: string) {
  return fs.readFileSync(rel, "utf-8");
}

describe("Master Login Routing Tests", () => {
  describe("Unauthenticated /admin -> /", () => {
    it("protected layout redirects unauthenticated users to /", () => {
      const content = readFile("app/admin/(protected)/layout.tsx");
      assert.ok(content.includes('redirect("/")'), "Protected layout redirects to /");
      assert.ok(!content.includes('redirect("/admin/login")'), "No redirect to /admin/login");
    });

    it("proxy redirects unauthenticated /admin to /", () => {
      const content = readFile("proxy.ts");
      assert.ok(content.includes('new URL("/", request.url)'), "Proxy redirects to /");
      assert.ok(!content.includes('/admin/login'), "Proxy has no /admin/login reference");
    });
  });

  describe("Unauthenticated protected /admin child route -> /", () => {
    it("protected layout applies to all /admin/* children via route group", () => {
      const content = readFile("app/admin/(protected)/layout.tsx");
      assert.ok(content.includes("getSession"), "Layout checks session");
      assert.ok(content.includes('redirect("/")'), "Layout redirects to /");
    });

    it("proxy matcher covers all /admin subroutes", () => {
      const content = readFile("proxy.ts");
      assert.ok(content.includes('"/admin/:path*"'), "Proxy matches /admin/:path*");
    });
  });

  describe("/master is accessible while logged out", () => {
    it("master page exists", () => {
      assert.ok(fs.existsSync("app/master/page.tsx"), "Master page exists");
    });

    it("master page is a server component (no use client)", () => {
      const content = readFile("app/master/page.tsx");
      assert.ok(!content.includes('"use client"'), "Master page is server component");
    });

    it("master page renders login form for unauthenticated users", () => {
      const content = readFile("app/master/page.tsx");
      assert.ok(content.includes("MasterLoginPage"), "Renders login form component");
    });

    it("master login form component exists and has login UI", () => {
      const content = readFile("app/master/MasterLoginForm.tsx");
      assert.ok(content.includes('"use client"'), "Login form is client component");
      assert.ok(content.includes("Sign In"), "Has Sign In text");
      assert.ok(content.includes("Chittagong Trail"), "Has brand name");
    });

    it("master page has noindex metadata", () => {
      const content = readFile("app/master/page.tsx");
      assert.ok(content.includes("index: false"), "Has noindex");
      assert.ok(content.includes("follow: false"), "Has nofollow");
    });
  });

  describe("Authenticated /master -> /admin", () => {
    it("master page checks session and redirects authenticated users", () => {
      const content = readFile("app/master/page.tsx");
      assert.ok(content.includes("getSession"), "Checks session");
      assert.ok(content.includes('redirect("/admin")'), "Redirects authenticated to /admin");
    });
  });

  describe("Successful login still -> /admin", () => {
    it("login server action redirects to /admin", () => {
      const content = readFile("app/admin/(auth)/login/actions.ts");
      assert.ok(content.includes('redirect("/admin")'), "Login redirects to /admin");
    });

    it("master login form redirects to /admin on success", () => {
      const content = readFile("app/master/MasterLoginForm.tsx");
      assert.ok(content.includes('router.push("/admin")'), "Client redirects to /admin");
    });
  });

  describe("Logout -> /master", () => {
    it("logout action redirects to /master", () => {
      const content = readFile("app/admin/(auth)/login/actions.ts");
      assert.ok(content.includes('redirect("/master")'), "Logout redirects to /master");
    });

    it("logout button navigates to /master", () => {
      const content = readFile("components/admin/AdminLogoutButton.tsx");
      assert.ok(content.includes('router.push("/master")'), "Logout button goes to /master");
      assert.ok(!content.includes('/admin/login'), "No /admin/login reference");
    });
  });

  describe("/admin/login no longer exposes login page", () => {
    it("/admin/login page returns notFound", () => {
      const content = readFile("app/admin/(auth)/login/page.tsx");
      assert.ok(content.includes("notFound()"), "Calls notFound()");
    });

    it("/admin/login does not render login form", () => {
      const content = readFile("app/admin/(auth)/login/page.tsx");
      assert.ok(!content.includes("Sign In"), "No Sign In form");
      assert.ok(!content.includes("use client"), "Not a client component");
      assert.ok(!content.includes("Chittagong Trail"), "No brand text");
    });

    it("/admin/login does not redirect to /master", () => {
      const content = readFile("app/admin/(auth)/login/page.tsx");
      assert.ok(!content.includes("/master"), "Does not reference /master");
    });
  });

  describe("Existing authenticated /admin access still works", () => {
    it("protected layout renders AdminShell for authenticated users", () => {
      const content = readFile("app/admin/(protected)/layout.tsx");
      assert.ok(content.includes("AdminShell"), "Renders AdminShell");
      assert.ok(content.includes("children"), "Passes children");
    });

    it("admin dashboard page exists", () => {
      assert.ok(fs.existsSync("app/admin/(protected)/page.tsx"), "Dashboard exists");
    });

    it("admin trails page exists", () => {
      assert.ok(fs.existsSync("app/admin/(protected)/trails/page.tsx"), "Trails page exists");
    });

    it("admin settings page exists", () => {
      assert.ok(fs.existsSync("app/admin/(protected)/settings/page.tsx"), "Settings page exists");
    });

    it("admin media page exists", () => {
      assert.ok(fs.existsSync("app/admin/(protected)/media/page.tsx"), "Media page exists");
    });
  });

  describe("No /admin/login references remain in auth-critical paths", () => {
    it("protected layout has no /admin/login reference", () => {
      const content = readFile("app/admin/(protected)/layout.tsx");
      assert.ok(!content.includes("/admin/login"), "No /admin/login in protected layout");
    });

    it("proxy has no /admin/login reference", () => {
      const content = readFile("proxy.ts");
      assert.ok(!content.includes("/admin/login"), "No /admin/login in proxy");
    });

    it("logout button has no /admin/login reference", () => {
      const content = readFile("components/admin/AdminLogoutButton.tsx");
      assert.ok(!content.includes("/admin/login"), "No /admin/login in logout button");
    });

    it("logout action has no /admin/login reference", () => {
      const content = readFile("app/admin/(auth)/login/actions.ts");
      assert.ok(!content.includes("/admin/login"), "No /admin/login in logout action");
    });
  });

  describe("Sitemap and SEO", () => {
    it("/master is not in sitemap generation", () => {
      const content = readFile("app/sitemap.ts");
      assert.ok(!content.includes("/master"), "Sitemap does not include /master");
    });

    it("robots.ts disallows /admin but not /master", () => {
      const content = readFile("app/robots.ts");
      assert.ok(content.includes("/admin"), "Robots disallows /admin");
    });
  });

  describe("API routes unaffected", () => {
    it("API admin settings route unchanged", () => {
      const content = readFile("app/api/admin/settings/route.ts");
      assert.ok(content.includes("verifySession"), "API still verifies session");
    });

    it("API admin media route unchanged", () => {
      const content = readFile("app/api/admin/media/route.ts");
      assert.ok(content.includes("verifySession"), "API still verifies session");
    });
  });
});
