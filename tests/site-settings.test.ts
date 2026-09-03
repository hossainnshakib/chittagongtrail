import { test, describe } from "node:test";
import assert from "node:assert";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const sanitizeContent = (dirty: string): string => {
  return sanitizeHtml(dirty, {
    allowedTags: ["p", "h1", "h2", "h3", "strong", "em", "a", "img", "br"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"] },
    allowedSchemes: ["http", "https", "mailto"],
  });
};

const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100).transform((v) => v.trim()),
  introductionContent: z.string().optional().nullable().transform((v) => (v && v.trim() !== "" ? sanitizeContent(v) : null)),
  contactEmail: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => v === "" || z.string().email().safeParse(v).success, { message: "Invalid email" }),
  socialFacebook: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v.trim() : ""))
    .refine((v) => v === "" || (z.string().url().safeParse(v).success && !v.includes("javascript:")), { message: "Invalid URL" })
    .transform((v) => (v === "" ? null : v)),
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
});


