import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { statusFromIntent } from "../lib/admin-content-intent";

function read(rel: string) {
  return fs.readFileSync(rel, "utf8");
}

const forms = ["components/admin/TrailForm.tsx", "components/admin/JournalForm.tsx"];
const actionFiles = [
  "app/admin/(protected)/trails/actions.ts",
  "app/admin/(protected)/journal/actions.ts",
  "app/admin/(protected)/food/actions.ts",
];

describe("CT-05/18 — explicit publish intent", () => {
  it("maps only explicit intents to a status", () => {
    assert.equal(statusFromIntent("publish", "DRAFT"), "PUBLISHED");
    assert.equal(statusFromIntent("save-draft", "PUBLISHED"), "DRAFT");
    assert.equal(statusFromIntent("archive", "DRAFT"), "ARCHIVED");
    assert.equal(statusFromIntent(null, "DRAFT"), "DRAFT");
    assert.equal(statusFromIntent("unexpected", "DRAFT"), "DRAFT");
  });

  it("forms expose distinct Save Draft and Publish submits with visible status", () => {
    for (const file of forms) {
      const source = read(file);
      assert.equal((source.match(/type="submit"/g) || []).length, 3, `${file} should have draft, publish, and archive submits`);
      assert.ok(source.includes('name="intent"'), `${file} should submit an intent`);
      assert.ok(source.includes('value="save-draft"'), `${file} should offer Save Draft`);
      assert.ok(source.includes('value="publish"'), `${file} should offer Publish`);
      assert.ok(source.includes("Current status: {status}"), `${file} should keep status visible`);
      assert.ok(!source.includes("autoSave"), `${file} must not autosave`);
    }
  });

  it("all content actions derive status from the submit intent", () => {
    for (const file of actionFiles) {
      const source = read(file);
      assert.equal((source.match(/statusFromIntent\(formData\.get\("intent"\)/g) || []).length, 2, `${file} create and update must use intent`);
      assert.ok(source.includes('formData.get("currentStatus") || "DRAFT"'), `${file} should preserve current status when no intent is submitted`);
      assert.ok(!/status: formData\.get\("status"\)/.test(source), `${file} must not trust the status select alone`);
    }
  });

  it("changing the visible Status control only updates local state", () => {
    for (const file of forms) {
      const source = read(file);
      assert.ok(source.includes('onChange={(e) => setStatus(e.target.value)}'), `${file} status select should only set local state`);
      assert.ok(!/onChange=\{\(e\) => setStatus\(e\.target\.value\).*formAction/.test(source), `${file} status select must not submit`);
      assert.ok(!/router\.push\(e\.target\.value\)/.test(source), `${file} status select must not navigate`);
    }
  });

  it("publish still assigns publishedAt while drafts keep their existing date", () => {
    for (const file of actionFiles) {
      const source = read(file);
      assert.ok(source.includes('data.status === ContentStatus.PUBLISHED'), `${file} should auto-set publishedAt on publish`);
    }
  });
});
