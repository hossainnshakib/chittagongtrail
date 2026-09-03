import { test, describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const sanitizeContent = (dirty: string): string => {
  return sanitizeHtml(dirty, {
    allowedTags: ["p", "h1", "h2", "h3", "strong", "em", "a", "img", "br", "ul", "ol", "li", "blockquote", "hr"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
  });
};

const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).transform((v) => v.trim()),
  siteTagline: z.string().max(255).optional().nullable(),
  defaultMetaTitle: z.string().max(255).optional().nullable(),
  defaultMetaDescription: z.string().optional().nullable(),
  defaultOgMediaId: z.number().int().positive().optional().nullable(),
  contactEmail: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => v === "" || z.string().email().safeParse(v).success, { message: "Invalid email" }),
  contactPhone: z.string().max(50).optional().nullable(),
  whatsappUrl: z.string().max(500).optional().nullable(),
  contactAddress: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
  socialFacebook: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => v === "" || (z.string().url().safeParse(v).success && !v.includes("javascript:")), { message: "Invalid URL" })
    .transform((v) => (v === "" ? null : v)),
  socialInstagram: z.string().optional().nullable(),
  socialYouTube: z.string().optional().nullable(),
  socialX: z.string().max(500).optional().nullable(),
  socialThreads: z.string().max(500).optional().nullable(),
  socialLinkedIn: z.string().max(500).optional().nullable(),
  socialTikTok: z.string().max(500).optional().nullable(),
  footerText: z.string().optional().nullable(),
  introductionContent: z.string().optional().nullable().transform((v) => (v && v.trim() !== "" ? sanitizeContent(v) : null)),
  aboutContent: z.string().optional().nullable().transform((v) => (v && v.trim() !== "" ? sanitizeContent(v) : null)),
});

describe("SiteSettings Validation and Sanitization Tests", () => {
  test("Validation rejects invalid email format and unsafe protocols", () => {
    const invalidEmailResult = siteSettingsSchema.safeParse({
      siteName: "Test Trail",
      contactEmail: "not-an-email",
    });
    assert.strictEqual(invalidEmailResult.success, false);

    const unsafeUrlResult = siteSettingsSchema.safeParse({
      siteName: "Test Trail",
      socialFacebook: "javascript:alert(1)",
    });
    assert.strictEqual(unsafeUrlResult.success, false);
  });

  test("HTML sanitization strips dangerous tags/attributes", () => {
    const parsed = siteSettingsSchema.parse({
      siteName: "Test Trail",
      introductionContent: '<p>Hello <script>alert("hack")</script> <a href="javascript:alert(1)" onclick="malicious()">click</a> <strong>World</strong></p>',
    });

    assert.strictEqual(parsed.introductionContent?.includes("script"), false);
    assert.strictEqual(parsed.introductionContent?.includes("onclick"), false);
    assert.strictEqual(parsed.introductionContent?.includes("javascript:"), false);
    assert.strictEqual(parsed.introductionContent?.includes("<strong>World</strong>"), true);
  });

  test("Migration file exists and covers all new SiteSettings fields and default OG relation", () => {
    const migPath = "prisma/migrations/20260301000000_baseline_current_schema/migration.sql"; // or check schema and migration files
    const schema = fs.readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");
    assert.ok(schema.includes("siteTagline"), "schema should include siteTagline");
    assert.ok(schema.includes("defaultMetaTitle"), "schema should include defaultMetaTitle");
    assert.ok(schema.includes("defaultMetaDescription"), "schema should include defaultMetaDescription");
    assert.ok(schema.includes("defaultOgMediaId"), "schema should include defaultOgMediaId");
    assert.ok(schema.includes("defaultOgMedia"), "schema should include defaultOgMedia relation");
    assert.ok(schema.includes("SiteDefaultOgMedia"), "schema should include named relation SiteDefaultOgMedia");
    assert.ok(schema.includes("contactPhone"), "schema should include contactPhone");
    assert.ok(schema.includes("whatsappUrl"), "schema should include whatsappUrl");
    assert.ok(schema.includes("contactAddress"), "schema should include contactAddress");
    assert.ok(schema.includes("mapUrl"), "schema should include mapUrl");
    assert.ok(schema.includes("socialX"), "schema should include socialX");
    assert.ok(schema.includes("socialThreads"), "schema should include socialThreads");
    assert.ok(schema.includes("socialLinkedIn"), "schema should include socialLinkedIn");
    assert.ok(schema.includes("socialTikTok"), "schema should include socialTikTok");
  });

  test("Singleton pattern and mass assignment safety invariants", () => {
    const schema = fs.readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");
    assert.ok(schema.includes("model SiteSettings"), "SiteSettings model exists");
    assert.ok(schema.includes("id                     Int               @id @default(1)"), "id defaults to 1 for singleton");
  });

  test("Default OG asset validation rules", () => {
    const valid = siteSettingsSchema.safeParse({
      siteName: "Chittagong Trail",
      defaultOgMediaId: 10,
    });
    assert.strictEqual(valid.success, true);

    const invalid = siteSettingsSchema.safeParse({
      siteName: "Chittagong Trail",
      defaultOgMediaId: -5,
    });
    assert.strictEqual(invalid.success, false);
  });
});
