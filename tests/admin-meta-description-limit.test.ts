import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { META_DESCRIPTION_MAX_ERROR, metaDescriptionSchema } from "../lib/meta-description";

function read(rel: string) {
  return fs.readFileSync(rel, "utf8");
}

describe("CT-06 — one visible and enforced meta-description limit", () => {
  it("accepts 160 characters and rejects 161 with the exact field error", () => {
    assert.equal(metaDescriptionSchema.safeParse("a".repeat(160)).success, true);
    const over = metaDescriptionSchema.safeParse("a".repeat(161));
    assert.equal(over.success, false);
    if (!over.success) {
      assert.equal(over.error.issues[0].message, META_DESCRIPTION_MAX_ERROR);
    }
  });

  it("reuses the shared rule in content, site, and page SEO schemas", () => {
    const files = [
      "lib/validation.ts",
      "lib/settings-service.ts",
      "lib/public-content.ts",
    ];
    for (const file of files) {
      assert.ok(read(file).includes("metaDescriptionSchema"), `${file} should use the shared limit`);
    }
  });

  it("marks over-limit values and caps every meta-description editor at 160", () => {
    const ui = [
      "components/admin/OnPageSeoWorkspace.tsx",
      "components/admin/SeoPanel.tsx",
      "app/admin/(protected)/settings/page.tsx",
      "app/admin/(protected)/settings/pages/page.tsx",
    ];
    for (const file of ui) {
      const source = read(file);
      assert.ok(source.includes("maxLength={160}"), `${file} should cap input at 160`);
      assert.ok(source.includes("> 160"), `${file} should mark over-limit values`);
    }
    assert.ok(read("components/admin/OnPageSeoWorkspace.tsx").includes("Over limit (${descLen}/160)"));
    assert.ok(read("components/admin/SeoPanel.tsx").includes("Over limit (${descLen}/160)"));
    assert.ok(read("app/admin/(protected)/settings/page.tsx").includes("Over limit (${defaultMetaDescription.length}/160)"));
    assert.ok(read("app/admin/(protected)/settings/pages/page.tsx").includes("Over limit (${page.metaDescription.length}/160)"));
  });

  it("returns field-keyed validation errors from content save actions", () => {
    for (const file of [
      "app/admin/(protected)/trails/actions.ts",
      "app/admin/(protected)/journal/actions.ts",
      "app/admin/(protected)/food/actions.ts",
    ]) {
      const source = read(file);
      assert.ok(source.includes("errors[field] = err.message"), `${file} should report the exact field`);
    }
  });

  it("validates fallback descriptions and formats page/site errors with field names", () => {
    const pageSource = read("lib/public-content.ts");
    assert.ok(pageSource.includes("page.useVisibleDescriptionAsMetaDescription"));
    assert.ok(pageSource.includes("visibleDescription.trim().length > 160"));
    assert.ok(pageSource.includes("Meta description fallback must be 160 characters or fewer"));
    assert.ok(pageSource.includes("firstZodFieldError"));

    const settingsSource = read("lib/settings-service.ts");
    assert.ok(settingsSource.includes("firstZodFieldError(error, \"Invalid site settings\")"));
  });
});
