import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

describe("CT-08 — warning-only unsaved changes protection", () => {
  it("provides a reusable beforeunload hook without autosave", () => {
    const source = fs.readFileSync("hooks/useUnsavedChangesWarning.ts", "utf8");
    assert.ok(source.includes("beforeunload"));
    assert.ok(source.includes("addEventListener"));
    assert.ok(source.includes("removeEventListener"));
    assert.ok(!/setInterval|save\(/.test(source));
  });

  it("wires dirty tracking and cancel confirmation into both content forms", () => {
    for (const file of ["components/admin/TrailForm.tsx", "components/admin/JournalForm.tsx"]) {
      const source = fs.readFileSync(file, "utf8");
      assert.ok(source.includes("useUnsavedChangesWarning"), `${file} should use the guard`);
      assert.ok(source.includes("setIsDirty(true)"), `${file} should track edits`);
      assert.ok(source.includes("window.confirm"), `${file} should confirm before leaving`);
      assert.ok(!/autosave|autoSave|setInterval/.test(source), `${file} must not autosave`);
    }
  });

  it("keeps the warning active when a save fails without an effect", () => {
    for (const file of ["components/admin/TrailForm.tsx", "components/admin/JournalForm.tsx"]) {
      const source = fs.readFileSync(file, "utf8");
      assert.ok(/const saveFailed = !state\.success[\s\S]{0,80}state\.error[\s\S]{0,40}state\.errors/.test(source), `${file} should derive failed-save state`);
      assert.ok(source.includes("useUnsavedChangesWarning(isDirty || saveFailed)"), `${file} should warn after failed saves`);
      assert.ok(source.includes("(isDirty || saveFailed) && !window.confirm"), `${file} should confirm cancel after failed saves`);
      assert.ok(!source.includes("useEffect"), `${file} should avoid cascading state updates in effects`);
    }
  });
});
