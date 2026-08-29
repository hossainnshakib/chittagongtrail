import { test, describe } from "node:test";
import assert from "node:assert";
import { journalSchema, sanitizeContent, slugSchema } from "@/lib/validation";
import { ContentStatus, JournalType } from "@prisma/client";

describe("Journal & Food Management Validation & Sanitization Tests", () => {
  test("journalSchema validates valid STORY and FOOD posts", () => {
    const validStory = {
      title: "Exploring Boga Lake",
      slug: "exploring-boga-lake",
      content: "<p>A wonderful journey into the hills.</p>",
      type: "STORY",
      status: "PUBLISHED",
    };
    const resultStory = journalSchema.safeParse(validStory);
    assert.strictEqual(resultStory.success, true);
    if (resultStory.success) {
      assert.strictEqual(resultStory.data.type, JournalType.STORY);
      assert.strictEqual(resultStory.data.status, ContentStatus.PUBLISHED);
    }

    const validFood = {
      title: "Traditional Mezbani Beef",
      slug: "traditional-mezbani-beef",
      content: "<p>The signature spice blend of Chittagong.</p>",
      type: "FOOD",
      status: "DRAFT",
    };
    const resultFood = journalSchema.safeParse(validFood);
    assert.strictEqual(resultFood.success, true);
    if (resultFood.success) {
      assert.strictEqual(resultFood.data.type, JournalType.FOOD);
      assert.strictEqual(resultFood.data.status, ContentStatus.DRAFT);
    }
  });

  test("journalSchema rejects invalid JournalType and ContentStatus", () => {
    const invalidType = {
      title: "Bad Type",
      slug: "bad-type",
      content: "<p>Content</p>",
      type: "INVALID_TYPE",
    };
    const res1 = journalSchema.safeParse(invalidType);
    assert.strictEqual(res1.success, false);

    const invalidStatus = {
      title: "Bad Status",
      slug: "bad-status",
      content: "<p>Content</p>",
      status: "UNKNOWN",
    };
    const res2 = journalSchema.safeParse(invalidStatus);
    assert.strictEqual(res2.success, false);
  });

  test("slugSchema enforces lowercase alphanumeric hyphens", () => {
    assert.strictEqual(slugSchema.safeParse("valid-slug-123").success, true);
    assert.strictEqual(slugSchema.safeParse("Invalid_Slug").success, false);
    assert.strictEqual(slugSchema.safeParse("has spaces").success, false);
  });

  test("sanitizeContent thoroughly sanitizes HTML for JournalPost", () => {
    const dirty = '<p>Safe paragraph</p><script>alert("evil")</script><img src="x" onerror="alert(1)" alt="test"/><a href="javascript:alert(1)">Bad Link</a>';
    const clean = sanitizeContent(dirty);
    assert.strictEqual(clean.includes("<script>"), false);
    assert.strictEqual(clean.includes("onerror"), false);
    assert.strictEqual(clean.includes("javascript:"), false);
    assert.strictEqual(clean.includes("<p>Safe paragraph</p>"), true);
  });
});
