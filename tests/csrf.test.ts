import { describe, it } from "node:test";
import assert from "node:assert/strict";
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

  it("accepts valid same-origin POST requests", () => {
    const req = new NextRequest("https://chittagongtrail.org/api/admin/hero", {
      method: "POST",
      headers: {
        origin: "https://chittagongtrail.org",
        "sec-fetch-site": "same-origin",
      },
    });
    const res = validateSameOrigin(req);
    assert.equal(res, null, "valid same-origin request should pass");
  });

  it("rejects cross-site sec-fetch-site", async () => {
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
  });

  it("rejects origin mismatch", async () => {
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
  });

  it("rejects malformed origin header", async () => {
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
  });
});
