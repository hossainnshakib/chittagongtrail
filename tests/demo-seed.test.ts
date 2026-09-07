import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { assertLocalDemoEnvironment, DEMO_MARKER, DEMO_PREFIX, demoTrails, demoPosts, demoSite, demoPages, demoSections, ownsDemoRecord } from "../lib/demo-data";
import { emptyFieldPatch, seedDemo } from "../lib/demo-seed";

const env: NodeJS.ProcessEnv = { NODE_ENV: "development", DATABASE_URL: "mysql://demo:demo@localhost:3306/chittagong_trail" };
function memoryDb() {
  const models = Object.fromEntries(["trailLocation", "journalPost", "siteSettings", "pageSeoSetting", "homepageSectionSetting", "mediaAsset", "trailGallery", "homepageGallery"].map(name => {
    const rows: Record<string, unknown>[] = [];
    const find = (where: Record<string, unknown>) => rows.find(row => Object.entries(where).every(([k, v]) => row[k] === v)) ?? null;
    return [name, {
      rows,
      findUnique: async ({ where }: { where: Record<string, unknown> }) => find(where),
      findMany: async () => rows,
      count: async () => name === "homepageGallery" ? rows.length : 0,
      upsert: async ({ where, create, update }: { where: Record<string, unknown>; create: Record<string, unknown>; update: Record<string, unknown> }) => {
        const prior = find(where);
        if (prior) { Object.assign(prior, update); return prior; }
        const row = { id: rows.length + 1, ...create };
        rows.push(row); return row;
      },
    }];
  }));
  return { models, client: { $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(models) } as unknown as PrismaClient };
}

describe("Local demo data safety and completeness", () => {
  it("refuses production before database access", async () => {
    await assert.rejects(seedDemo({} as PrismaClient, { ...env, NODE_ENV: "production" }), /production/);
  });
  it("refuses remote, ambiguous and different database targets", () => {
    for (const url of ["mysql://example.com/chittagong_trail", "mysql://localhost/production", "mysql://localhost/chittagong_trail?host=example.com", "file:demo.db", ""]) {
      assert.throws(() => assertLocalDemoEnvironment({ ...env, DATABASE_URL: url }));
    }
    assert.doesNotThrow(() => assertLocalDemoEnvironment(env));
  });
  it("requires both reserved prefix and dataset marker", () => {
    assert.equal(ownsDemoRecord({ slug: DEMO_PREFIX + "owner", content: "Owner content" }), false);
    assert.equal(ownsDemoRecord({ slug: "owner", content: DEMO_MARKER }), false);
    assert.equal(ownsDemoRecord({ slug: DEMO_PREFIX + "sample", content: DEMO_MARKER }), true);
  });
  it("runs twice with stable counts and no duplicate records", async () => {
    const db = memoryDb();
    const first = await seedDemo(db.client, env);
    const second = await seedDemo(db.client, env);
    assert.equal(first.counts.trails.created, 5);
    assert.equal(first.counts.stories.created, 3);
    assert.equal(first.counts.food.created, 3);
    assert.equal(second.counts.trails.updated, 5);
    assert.equal(second.counts.stories.updated, 3);
    assert.equal(second.counts.food.updated, 3);
    assert.equal(second.counts.publicPages.skipped, 5);
    assert.equal(second.counts.homepageSections.skipped, 5);
    assert.equal(db.models.trailLocation.rows.length, 5);
    assert.equal(db.models.journalPost.rows.length, 6);
    assert.equal(first.validMedia, 0);
  });
  it("rejects an owner slug collision before any writes", async () => {
    const db = memoryDb();
    db.models.journalPost.rows.push({ slug: demoPosts[0].slug, content: "Owner story" });
    await assert.rejects(seedDemo(db.client, env), /owner content/);
    assert.equal(db.models.trailLocation.rows.length, 0);
  });
  it("preserves existing shared values, disabled flags and media", () => {
    assert.deepEqual(emptyFieldPatch({ heading: "Owner heading", description: "", enabled: false, mediaId: 7 },
      { heading: "Demo", description: "Demo description", enabled: true, mediaId: 8 }), { description: "Demo description" });
  });
  it("covers five districts, correct content types, curated limits and sanitized HTML", () => {
    assert.equal(new Set(demoTrails.map(d => d.district)).size, 5);
    assert.equal(demoTrails.filter(d => d.isFeatured).length, 4);
    for (const type of ["STORY", "FOOD"]) assert.equal(demoPosts.filter(d => d.type === type).length, 3);
    for (const record of [...demoTrails, ...demoPosts]) {
      assert.equal(record.status, "PUBLISHED");
      assert.ok(record.slug.startsWith(DEMO_PREFIX));
      assert.ok(record.excerpt);
    }
    assert.equal(demoPages.length, 5);
    assert.equal(demoSections.length, 5);
    assert.ok(demoSections.every(d => d.heading && d.description));
    const copy = JSON.stringify([demoTrails, demoPosts, demoSite, demoPages, demoSections]);
    assert.doesNotMatch(copy, /<script|onerror=|javascript:/i);
    assert.equal(copy.includes(["Chittagong", "Hill", "Tracts"].join(" ")), false);
    assert.equal(copy.includes("Chattogram"), false);
  });
  it("keeps a compact high-contrast footer and existing official mark", () => {
    const footer = readFileSync("components/layout/Footer.tsx", "utf8");
    const css = readFileSync("app/globals.css", "utf8");
    assert.match(footer, /py-8 md:py-10/);
    assert.match(footer, /mt-6 pt-4/);
    assert.match(footer, /\/images\/chittagongtrail_logo.png/);
    assert.match(footer, /!footerLogoIncludesWordmark/);
    assert.match(css, /\.ct-footer-mark\s*\{[^}]*width: 44px;[^}]*height: 44px;/);
    assert.match(css, /\.ct-footer-brand-name\s*\{[^}]*color: #FFF8EC;/);
    assert.match(css, /\.ct-footer-link\s*\{[^}]*min-height: 44px;/);
  });
});
