import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { safeAdminReturnTo } from "../lib/admin-return-to";

function read(rel: string) {
  return fs.readFileSync(rel, "utf8");
}

const listPages = [
  "app/admin/(protected)/trails/page.tsx",
  "app/admin/(protected)/journal/page.tsx",
  "app/admin/(protected)/food/page.tsx",
];

describe("CT-04 — admin edit flow", () => {
  it("allows only allow-listed admin list URLs as return destinations", () => {
    assert.equal(safeAdminReturnTo("/admin/trails?search=kaptai&status=DRAFT", "/admin/journal"), "/admin/trails?search=kaptai&status=DRAFT");
    assert.equal(safeAdminReturnTo("/admin/journal", "/admin/food"), "/admin/journal");
    assert.equal(safeAdminReturnTo("/admin/food", "/admin/trails"), "/admin/food");
    assert.equal(safeAdminReturnTo("//evil.example", "/admin/trails"), "/admin/trails");
    assert.equal(safeAdminReturnTo("/admin/settings", "/admin/trails"), "/admin/trails");
    assert.equal(safeAdminReturnTo(undefined, "/admin/trails"), "/admin/trails");
  });

  it("opens row-action links in the same tab unless explicitly marked newTab", () => {
    const source = read("components/admin/content/AdminRowActions.tsx");
    assert.ok(source.includes("newTab?: boolean"));
    assert.ok(source.includes('target={action.newTab ? "_blank" : undefined}'));
    assert.ok(!source.includes('target="_blank"'));

    const mobile = read("components/admin/content/AdminMobileContentCard.tsx");
    assert.ok(mobile.includes("newTab?: boolean"));
    assert.ok(mobile.includes('target={a.newTab ? "_blank" : undefined}'));
  });

  it("edit links stay in tab and carry the filtered list as returnTo", () => {
    for (const file of listPages) {
      const source = read(file);
      assert.ok(source.includes("const editHref"), `${file} should build safe edit links`);
      assert.ok(source.includes("returnTo=${encodeURIComponent(listHref)}"), `${file} should carry returnTo`);
      assert.ok(/label: "Edit", href: editHref\(/.test(source), `${file} Edit must use editHref`);
    }
  });

  it("preview and public view links keep their dedicated new tab", () => {
    for (const file of [listPages[0], listPages[1]]) {
      const source = read(file);
      assert.ok(source.includes('label: "Preview", href:'), `${file} should expose Preview`);
      assert.ok(/label: "Preview", href:.*newTab: true/.test(source), `${file} Preview should open in a new tab`);
    }
    for (const file of listPages) {
      const source = read(file);
      assert.ok(/label: "View", href:.*newTab: true/.test(source), `${file} View should open in a new tab`);
    }
  });

  it("post-save redirects use the validated return destination", () => {
    for (const file of [
      "app/admin/(protected)/trails/actions.ts",
      "app/admin/(protected)/journal/actions.ts",
      "app/admin/(protected)/food/actions.ts",
    ]) {
      const source = read(file);
      assert.equal((source.match(/safeAdminReturnTo\(formData\.get\("returnTo"\)/g) || []).length, 2, `${file} should redirect create and update`);
    }
  });
});
