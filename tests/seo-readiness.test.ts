import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateTrailSeoReadiness,
  evaluateJournalSeoReadiness,
} from "../lib/seo-readiness";

describe("SEO Readiness Evaluation Tests", () => {
  describe("Trail SEO Readiness", () => {
    it("returns ready when all fields present and published", () => {
      const result = evaluateTrailSeoReadiness({
        slug: "boga-lake",
        metaTitle: "Boga Lake Trail",
        metaDescription: "A beautiful trail",
        excerpt: "Amazing trail",
        coverMedia: { secureUrl: "https://res.cloudinary.com/test/image.jpg" },
        ogMedia: null,
        status: "PUBLISHED",
      });
      assert.equal(result.status, "ready");
      assert.equal(result.missingFields.length, 0);
    });

    it("returns needs-attention when 1-2 fields missing and published", () => {
      const result = evaluateTrailSeoReadiness({
        slug: "boga-lake",
        metaTitle: "Boga Lake Trail",
        metaDescription: "A beautiful trail",
        excerpt: null,
        coverMedia: null,
        ogMedia: null,
        status: "PUBLISHED",
      });
      assert.equal(result.status, "needs-attention");
      assert.ok(result.missingFields.includes("Excerpt"));
      assert.ok(result.missingFields.includes("Cover image"));
    });

    it("returns incomplete when 3+ fields missing and published", () => {
      const result = evaluateTrailSeoReadiness({
        slug: "boga-lake",
        metaTitle: null,
        metaDescription: null,
        excerpt: null,
        coverMedia: null,
        ogMedia: null,
        status: "PUBLISHED",
      });
      assert.equal(result.status, "incomplete");
      assert.equal(result.missingFields.length, 4);
    });

    it("returns incomplete when draft regardless of fields", () => {
      const result = evaluateTrailSeoReadiness({
        slug: "boga-lake",
        metaTitle: "Boga Lake Trail",
        metaDescription: "A beautiful trail",
        excerpt: "Amazing trail",
        coverMedia: { secureUrl: "https://res.cloudinary.com/test/image.jpg" },
        ogMedia: null,
        status: "DRAFT",
      });
      assert.equal(result.status, "incomplete");
    });

    it("uses ogMedia as cover fallback", () => {
      const result = evaluateTrailSeoReadiness({
        slug: "boga-lake",
        metaTitle: "Boga Lake Trail",
        metaDescription: "A beautiful trail",
        excerpt: "Amazing trail",
        coverMedia: null,
        ogMedia: { secureUrl: "https://res.cloudinary.com/test/og.jpg" },
        status: "PUBLISHED",
      });
      assert.equal(result.status, "ready");
      assert.ok(!result.missingFields.includes("Cover image"));
    });
  });

  describe("Journal SEO Readiness", () => {
    it("returns ready when all fields present and published", () => {
      const result = evaluateJournalSeoReadiness({
        slug: "boga-lake-story",
        metaTitle: "Boga Lake Story",
        metaDescription: "A wonderful story",
        excerpt: "Great excerpt",
        coverMedia: { secureUrl: "https://res.cloudinary.com/test/image.jpg" },
        ogMedia: null,
        status: "PUBLISHED",
        publishedAt: new Date(),
      });
      assert.equal(result.status, "ready");
    });

    it("returns incomplete when draft", () => {
      const result = evaluateJournalSeoReadiness({
        slug: "test-story",
        metaTitle: null,
        metaDescription: null,
        excerpt: null,
        coverMedia: null,
        ogMedia: null,
        status: "DRAFT",
        publishedAt: null,
      });
      assert.equal(result.status, "incomplete");
    });

    it("returns needs-attention when missing 1-2 fields", () => {
      const result = evaluateJournalSeoReadiness({
        slug: "test-story",
        metaTitle: "Test",
        metaDescription: null,
        excerpt: null,
        coverMedia: { secureUrl: "https://res.cloudinary.com/test/image.jpg" },
        ogMedia: null,
        status: "PUBLISHED",
        publishedAt: new Date(),
      });
      assert.equal(result.status, "needs-attention");
    });
  });
});
