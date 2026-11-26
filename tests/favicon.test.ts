import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

function readFile(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("CT-03 — single Chittagong Trail favicon declaration", () => {
  it("keeps the custom PNG asset", () => {
    assert.ok(fs.existsSync(path.join(process.cwd(), "public/images/chittagongtrail-favicon.png")));
  });

  it("removes the starter favicon.ico file convention", () => {
    assert.ok(!fs.existsSync(path.join(process.cwd(), "app/favicon.ico")));
  });

  it("declares the custom icon exactly once in metadata", () => {
    const seo = readFile("lib/seo.ts");
    const iconDeclarations = seo.match(/icon:\s*"\/images\/chittagongtrail-favicon\.png"/g) || [];
    assert.equal(iconDeclarations.length, 1);
    assert.ok(seo.includes("icons: {"));
    const layout = readFile("app/layout.tsx");
    assert.ok(!layout.includes("rel=\"icon\""));
  });

  it("does not invent a CMS favicon field", () => {
    const schema = readFile("prisma/schema.prisma");
    assert.ok(!schema.includes("favicon"));
    const settings = readFile("lib/settings-service.ts");
    assert.ok(!settings.includes("favicon"));
  });
});
