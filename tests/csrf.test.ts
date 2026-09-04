import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest } from "next/server";

describe("CSRF & Same-Origin Protection Tests", () => {
  it("allows GET, HEAD, and OPTIONS requests without origin", () => {
    for (const method of ["GET", "HEAD", "OPTIONS"]) {
      const req = new NextRequest("https://example.com/api/admin/hero", {
        method,
      });
      const res = validateSameOrigin(req);
      assert.equal(res, null, `${method} should pass without origin`);
    }
  });

  it("accepts valid same-origin POST with configured origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://chittagongtrail.org",
        "sec-fetch-site": "same-origin",
      },
    });
    const res = validateSameOrigin(req);
    assert.equal(res, null, "valid same-origin request should pass");
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects cross-site sec-fetch-site", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://evil.com",
        "sec-fetch-site": "cross-site",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null, "cross-site request must be rejected");
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.error, "Forbidden - Cross-Site Request Prohibited");
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects origin mismatch", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://malicious-origin.com",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null);
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.error, "Forbidden - Origin Mismatch");
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects malformed origin header", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "not-a-valid-url",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null);
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.error, "Forbidden - Malformed Origin Header");
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects hostname suffix attack", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://evil-chittagongtrail.org",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null, "suffix attack must be rejected");
    assert.equal(res.status, 403);
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects protocol mismatch", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "http://chittagongtrail.org",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null, "protocol mismatch must be rejected");
    assert.equal(res.status, 403);
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects port mismatch", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://chittagongtrail.org:8080",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null, "port mismatch must be rejected");
    assert.equal(res.status, 403);
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects missing origin in production mode", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://chittagongtrail.org";
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null, "missing origin in production must be rejected");
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.error, "Forbidden - Missing Origin Header in Production");
    (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("rejects missing site configuration in production", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.SITE_URL;
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as Record<string, string>).NODE_ENV = "production";
    const req = new NextRequest("https://example.com/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://example.com",
      },
    });
    const res = validateSameOrigin(req);
    assert.ok(res !== null, "missing config in production must be rejected");
    assert.equal(res.status, 403);
    const json = await res.json();
    assert.equal(json.error, "Forbidden - Site URL not configured");
    (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
  });

  it("does not contain hardcoded invented domain", () => {
    const csrfCode = fs.readFileSync("lib/csrf.ts", "utf-8");
    assert.ok(!csrfCode.includes("chittagongtrail.org"), "csrf.ts must not contain hardcoded domain");
  });
});
