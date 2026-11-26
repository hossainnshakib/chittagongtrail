import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const pages = [
  "app/admin/(protected)/trails/page.tsx",
  "app/admin/(protected)/journal/page.tsx",
  "app/admin/(protected)/food/page.tsx",
];

describe("CT-17 — admin Clear resets list state", () => {
  it("counts non-default sorting as an active filter", () => {
    for (const file of pages) {
      const source = fs.readFileSync(file, "utf8");
      assert.ok(/hasFilters[\s\S]{0,260}sortBy !== "updatedAt"/.test(source), `${file} should count sortBy`);
      assert.ok(/hasFilters[\s\S]{0,300}sortOrder !== "desc"/.test(source), `${file} should count sortOrder`);
    }
  });

  it("Clear links point at the bare list so URL, search, filters, and sort reset", () => {
    for (const file of pages) {
      const source = fs.readFileSync(file, "utf8");
      assert.ok(/const clearHref = "\/admin\//.test(source), `${file} should define a reset href`);
      assert.equal((source.match(/href=\{clearHref\}/g) || []).length, 2, `${file} toolbar and empty state should both reset`);
      assert.ok(!/href="\/admin\/(trails|journal|food)"/.test(source), `${file} should not hardcode reset links`);
    }
  });

  it("keys the uncontrolled toolbar so visible controls remount after reset", () => {
    for (const file of pages) {
      const source = fs.readFileSync(file, "utf8");
      assert.ok(/<AdminContentToolbar key=\{JSON\.stringify\(params\)\}>/.test(source), `${file} should remount toolbar controls`);
    }
  });

  it("trails and journal/food build list URLs consistently", () => {
    for (const file of pages) {
      const source = fs.readFileSync(file, "utf8");
      assert.ok(!/return s \? `\?\$\{s\}`/.test(source), `${file} should return an absolute admin list path`);
    }
  });
});
