import { test, describe } from "node:test";
import assert from "node:assert";
import { trailSchema, sanitizeContent } from "@/lib/validation";

describe("Trail Management Validation & Sanitization Tests", () => {
  test("trailSchema validates valid complete trail", () => {
    const validData = {
      name: "Boga Lake Trail",
      slug: "boga-lake-trail",
      district: "BANDARBAN",
      description: "<p>Amazing trail description with safe tags</p>",
      placeType: "NATURAL_FEATURE",
      status: "DRAFT",
      latitude: 22.0123,
      longitude: 92.3456,
    };
    const result = trailSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
    if (result.success) {
      assert.strictEqual(result.data.name, "Boga Lake Trail");
      assert.strictEqual(result.data.district, "BANDARBAN");
      assert.strictEqual(result.data.latitude, 22.0123);
    }
  });

  test("trailSchema rejects missing required fields", () => {
    const invalidData = {
      slug: "invalid-trail",
    };
    const result = trailSchema.safeParse(invalidData);
    assert.strictEqual(result.success, false);
  });

  test("trailSchema rejects invalid slug format", () => {
    const invalidSlug = {
      name: "Bad Slug Trail",
      slug: "Bad Slug Trail!",
      district: "CHITTAGONG",
      description: "<p>Description</p>",
    };
    const result = trailSchema.safeParse(invalidSlug);
    assert.strictEqual(result.success, false);
  });

  test("sanitizeContent removes unsafe script and event handlers", () => {
    const dirty = '<p onclick="alert(1)">Hello <script>alert("hack")</script><a href="javascript:alert(1)">Click</a></p>';
    const clean = sanitizeContent(dirty);
    assert.strictEqual(clean.includes("script"), false);
    assert.strictEqual(clean.includes("onclick"), false);
    assert.strictEqual(clean.includes("javascript:"), false);
    assert.strictEqual(clean.includes("<p>Hello"), true);
  });
});
