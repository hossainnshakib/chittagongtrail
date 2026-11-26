import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("components/admin/CoverImageModule.tsx", "utf8");

describe("CT-07 — recoverable cover alt-text editing", () => {
  it("surfaces alt-save failures instead of silently discarding the draft", () => {
    assert.ok(source.includes("setAltError(data.error || \"Failed to save alt text\")"));
    assert.ok(source.includes("setAltError(\"Failed to save alt text\")"));
    assert.ok(source.includes('role="alert"'));
    assert.ok(source.includes('{altError ? "Retry"'));
    assert.ok(!/catch\s*\{\s*\/\/\s*silently fail/.test(source));
  });

  it("keeps a drafted alt text when replacing an image with one that has no alt text", () => {
    assert.ok(source.includes("const keptDraft = !a.altText && altText.trim();"));
    assert.ok(source.includes("onAssetChange(keptDraft ? { ...a, altText: altText.trim() } : a);"));
    assert.ok(source.includes("Alt text kept from previous image — review it."));
  });

  it("does not erase alt text when the decorative toggle changes", () => {
    assert.ok(source.includes("onChange={(e) => setIsDecorative(e.target.checked)}"));
    assert.ok(!source.includes("if (e.target.checked) setAltText(\"\")"));
  });
});
