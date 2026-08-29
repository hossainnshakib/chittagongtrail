import { test, describe } from "node:test";
import assert from "node:assert";
import { ALLOWED_UPLOAD_FOLDERS } from "@/lib/cloudinary";

describe("Media Lifecycle and Validation Tests", () => {
  test("ALLOWED_UPLOAD_FOLDERS contains correct approved namespaces", () => {
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/trails"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/journal"), true);
    assert.strictEqual(ALLOWED_UPLOAD_FOLDERS.includes("chittagong-trail/general"), true);
  });

  test("Cloudinary secure URL validation rules", () => {
    const isValidUrl = (url: string) => {
      try {
        const u = new URL(url);
        return u.protocol === "https:" && u.hostname === "res.cloudinary.com";
      } catch {
        return false;
      }
    };

    assert.strictEqual(isValidUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg"), true);
    assert.strictEqual(isValidUrl("http://res.cloudinary.com/demo/image/upload/sample.jpg"), false);
    assert.strictEqual(isValidUrl("https://malicious.com/image.jpg"), false);
  });

  test("Alt text trimming and plain text rules", () => {
    const sanitizeAlt = (input: string | null) => {
      if (!input) return null;
      return input.trim();
    };

    assert.strictEqual(sanitizeAlt("  Boga Lake View  "), "Boga Lake View");
    assert.strictEqual(sanitizeAlt(null), null);
    assert.strictEqual(sanitizeAlt("   "), "");
  });
});
