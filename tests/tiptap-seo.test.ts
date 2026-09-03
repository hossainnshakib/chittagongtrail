import { test, describe } from "node:test";
import assert from "node:assert";
import { sanitizeContent, trailSchema, journalSchema } from "@/lib/validation";

describe("Tiptap Rich Text Editor & On-Page SEO Polish Tests", () => {
  test("sanitizeContent allows safe Tiptap HTML elements (p, h2, h3, strong, em, u, ul, ol, li, blockquote, hr)", () => {
    const html = `
      <h2>Section Heading</h2>
      <p>This is a <strong>bold</strong>, <em>italic</em>, and <u>underlined</u> paragraph with a <a href="https://example.com">safe link</a>.</p>
      <ul>
        <li>Bullet item 1</li>
        <li>Bullet item 2</li>
      </ul>
      <ol>
        <li>Ordered item 1</li>
      </ol>
      <blockquote>A thoughtful blockquote.</blockquote>
      <hr/>
      <img src="https://res.cloudinary.com/demo/image/upload/sample.jpg" alt="Cloudinary sample image" title="Sample Title" />
    `;
    const clean = sanitizeContent(html);
    assert.strictEqual(clean.includes("<h2>Section Heading</h2>"), true);
    assert.strictEqual(clean.includes("<strong>bold</strong>"), true);
    assert.strictEqual(clean.includes("<em>italic</em>"), true);
    assert.strictEqual(clean.includes("<u>underlined</u>"), true);
    assert.strictEqual(clean.includes('href="https://example.com"'), true);
    assert.strictEqual(clean.includes('rel="noopener noreferrer"'), true);
    assert.strictEqual(clean.includes('target="_blank"'), true);
    assert.strictEqual(clean.includes("<blockquote>"), true);
    assert.strictEqual(clean.includes("<hr />"), true);
    assert.strictEqual(clean.includes('src="https://res.cloudinary.com/demo/image/upload/sample.jpg"'), true);
    assert.strictEqual(clean.includes('alt="Cloudinary sample image"'), true);
  });

  test("sanitizeContent strips scripts, iframes, event handlers, and javascript schemes", () => {
    const dirty = `
      <p onclick="alert('hack')">Malicious Paragraph</p>
      <script>alert('xss')</script>
      <iframe src="https://evil.com"></iframe>
      <a href="javascript:alert('xss')">Evil Link</a>
      <img src="https://untrusted.com/image.jpg" onerror="alert(1)" />
    `;
    const clean = sanitizeContent(dirty);
    assert.strictEqual(clean.includes("<script>"), false);
    assert.strictEqual(clean.includes("<iframe"), false);
    assert.strictEqual(clean.includes("onclick"), false);
    assert.strictEqual(clean.includes("onerror"), false);
    assert.strictEqual(clean.includes("javascript:"), false);
  });

  test("sanitizeContent rejects visually empty HTML such as <p></p>, <p><br></p>, whitespace only", () => {
    assert.strictEqual(sanitizeContent("<p></p>"), "");
    assert.strictEqual(sanitizeContent("<p><br></p>"), "");
    assert.strictEqual(sanitizeContent("   \n  "), "");
  });

  test("trailSchema and journalSchema validate rich content correctly", () => {
    const validTrail = {
      name: "Boga Lake Trail",
      slug: "boga-lake-trail",
      description: "<p>Rich editorial description of Boga Lake.</p>",
      district: "BANDARBAN",
    };
    const parsedTrail = trailSchema.safeParse(validTrail);
    assert.strictEqual(parsedTrail.success, true);
    if (parsedTrail.success) {
      assert.strictEqual(parsedTrail.data.description, "<p>Rich editorial description of Boga Lake.</p>");
    }

    const validJournal = {
      title: "Hill Tracts Story",
      slug: "hill-tracts-story",
      content: "<h2>Journey</h2><p>Rich story content.</p>",
      type: "STORY",
    };
    const parsedJournal = journalSchema.safeParse(validJournal);
    assert.strictEqual(parsedJournal.success, true);
    if (parsedJournal.success) {
      assert.strictEqual(parsedJournal.data.content, "<h2>Journey</h2><p>Rich story content.</p>");
    }
  });
});
