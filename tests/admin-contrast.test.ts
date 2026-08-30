import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// ── WCAG contrast utility ──────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  if (!/^[0-9A-Fa-f]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function compositeOver(fgHex: string, bgHex: string, opacity: number): string {
  const [fr, fg, fb] = hexToRgb(fgHex);
  const [br, bg, bb] = hexToRgb(bgHex);
  const r = Math.round(fr * opacity + br * (1 - opacity));
  const g = Math.round(fg * opacity + bg * (1 - opacity));
  const b = Math.round(fb * opacity + bb * (1 - opacity));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ── Admin color tokens ─────────────────────────────────────────────

const COLORS = {
  primaryBg: "#3E2723",
  primaryText: "#FFFFFF",
  primaryHoverBg: "#2C1A12",
  secondaryBg: "#C9A882",
  secondaryText: "#3E2723",
  secondaryHoverBg: "#D4956A",
  ghostBg: "transparent",
  ghostText: "#1A1614",
  ghostHoverBg: "#F6F4F1",
  dangerBg: "#DC2626",
  dangerText: "#FFFFFF",
  dangerHoverBg: "#B91C1C",
  adminBg: "#F8F6F3",
  focusRing: "#3E2723",
  sidebarActiveIndicator: "#C9A882",
  sidebarBg: "#1A1614",
  breadcrumbLinkText: "#6B5E54",
  topbarLinkText: "#6B5E54",
  disabledBg: "#C9A882",
} as const;

const WCAG_AA_NORMAL = 4.5;
const WCAG_AAA_NORMAL = 7.0;
const WCAG_FOCUS_MIN = 3.0;

// ── Known fixture assertions ───────────────────────────────────────

describe("WCAG Contrast — Calculator Fixture Validation", () => {
  it("hexToRgb parses 6-digit hex", () => {
    assert.deepStrictEqual(hexToRgb("#FFFFFF"), [255, 255, 255]);
    assert.deepStrictEqual(hexToRgb("#000000"), [0, 0, 0]);
    assert.deepStrictEqual(hexToRgb("#3E2723"), [62, 39, 35]);
  });

  it("hexToRgb rejects invalid hex", () => {
    assert.throws(() => hexToRgb("#GGG"), /Invalid hex/);
    assert.throws(() => hexToRgb("#123"), /Invalid hex/);
    assert.throws(() => hexToRgb("#12"), /Invalid hex/);
    assert.throws(() => hexToRgb("xyza56"), /Invalid hex/);
  });

  it("relativeLuminance of white is ~1.0", () => {
    const lum = relativeLuminance("#FFFFFF");
    assert.ok(Math.abs(lum - 1.0) < 0.001, `Expected ~1.0, got ${lum}`);
  });

  it("relativeLuminance of black is ~0.0", () => {
    const lum = relativeLuminance("#000000");
    assert.ok(lum < 0.001, `Expected ~0.0, got ${lum}`);
  });

  it("black on white is 21:1", () => {
    const ratio = contrastRatio("#000000", "#FFFFFF");
    assert.ok(Math.abs(ratio - 21) < 0.01, `Expected ~21, got ${ratio}`);
  });

  it("identical colors produce 1:1", () => {
    const ratio = contrastRatio("#3E2723", "#3E2723");
    assert.ok(Math.abs(ratio - 1.0) < 0.001, `Expected ~1.0, got ${ratio}`);
  });

  it("foreground/background order does not matter", () => {
    const ab = contrastRatio("#FFFFFF", "#000000");
    const ba = contrastRatio("#000000", "#FFFFFF");
    assert.ok(Math.abs(ab - ba) < 0.001, `Order should not matter: ${ab} vs ${ba}`);
  });
});

// ── Corrected color-pair ratios ────────────────────────────────────

describe("WCAG Contrast — Admin Button Colors", () => {
  describe("Primary button", () => {
    it("default: #FFFFFF on #3E2723 ≈ 13.82:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.primaryText, COLORS.primaryBg);
      assert.ok(Math.abs(ratio - 13.82) < 0.1, `Expected ~13.82, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });

    it("hover: #FFFFFF on #2C1A12 ≈ 16.62:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.primaryText, COLORS.primaryHoverBg);
      assert.ok(Math.abs(ratio - 16.62) < 0.1, `Expected ~16.62, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });
  });

  describe("Secondary button", () => {
    it("default: #3E2723 on #C9A882 ≈ 6.19:1 (AA pass, AAA fail)", () => {
      const ratio = contrastRatio(COLORS.secondaryText, COLORS.secondaryBg);
      assert.ok(Math.abs(ratio - 6.19) < 0.1, `Expected ~6.19, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
      assert.ok(ratio < WCAG_AAA_NORMAL, "Does NOT pass WCAG AAA normal text (requires 7:1)");
    });

    it("hover: #3E2723 on #D4956A ≈ 5.47:1 (AA pass, AAA fail)", () => {
      const ratio = contrastRatio(COLORS.secondaryText, COLORS.secondaryHoverBg);
      assert.ok(Math.abs(ratio - 5.47) < 0.1, `Expected ~5.47, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
      assert.ok(ratio < WCAG_AAA_NORMAL, "Does NOT pass WCAG AAA normal text");
    });
  });

  describe("Ghost button", () => {
    it("default: #1A1614 on #F8F6F3 ≈ 16.66:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.ghostText, COLORS.adminBg);
      assert.ok(Math.abs(ratio - 16.66) < 0.1, `Expected ~16.66, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });

    it("hover: #1A1614 on #F6F4F1 ≈ 16.37:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.ghostText, COLORS.ghostHoverBg);
      assert.ok(Math.abs(ratio - 16.37) < 0.1, `Expected ~16.37, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });
  });

  describe("Danger button", () => {
    it("default: #FFFFFF on #DC2626 ≈ 4.83:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.dangerText, COLORS.dangerBg);
      assert.ok(Math.abs(ratio - 4.83) < 0.1, `Expected ~4.83, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });

    it("hover: #FFFFFF on #B91C1C ≈ 6.47:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.dangerText, COLORS.dangerHoverBg);
      assert.ok(Math.abs(ratio - 6.47) < 0.1, `Expected ~6.47, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });
  });

  describe("Focus indicator", () => {
    it("focus ring: #3E2723 on #F8F6F3 ≈ 12.81:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.focusRing, COLORS.adminBg);
      assert.ok(Math.abs(ratio - 12.81) < 0.1, `Expected ~12.81, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_FOCUS_MIN, "Passes WCAG non-text focus minimum (3:1)");
    });
  });

  describe("Breadcrumb & topbar links", () => {
    it("breadcrumb: #6B5E54 on #F8F6F3 ≈ 5.80:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.breadcrumbLinkText, COLORS.adminBg);
      assert.ok(Math.abs(ratio - 5.80) < 0.1, `Expected ~5.80, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });

    it("topbar: #6B5E54 on #F8F6F3 ≈ 5.80:1 (AA pass)", () => {
      const ratio = contrastRatio(COLORS.topbarLinkText, COLORS.adminBg);
      assert.ok(Math.abs(ratio - 5.80) < 0.1, `Expected ~5.80, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, "Passes WCAG AA normal text");
    });
  });

  describe("Invalid pairings — must fail", () => {
    it("#FFFFFF on #C9A882 ≈ 2.23:1 (AA fail)", () => {
      const ratio = contrastRatio("#FFFFFF", "#C9A882");
      assert.ok(Math.abs(ratio - 2.23) < 0.1, `Expected ~2.23, got ${ratio.toFixed(2)}`);
      assert.ok(ratio < WCAG_AA_NORMAL, "Fails WCAG AA normal text");
    });

    it("#C9A882 on #FFFFFF ≈ 2.23:1 (AA fail)", () => {
      const ratio = contrastRatio("#C9A882", "#FFFFFF");
      assert.ok(Math.abs(ratio - 2.23) < 0.1, `Expected ~2.23, got ${ratio.toFixed(2)}`);
      assert.ok(ratio < WCAG_AA_NORMAL, "Fails WCAG AA normal text");
    });
  });

  describe("Disabled button readability", () => {
    it("disabled primary at 0.65 opacity against admin surface ≈ 4.67:1 (AA pass)", () => {
      const surface = "#F8F6F3";
      const effectiveBg = compositeOver(COLORS.primaryBg, surface, 0.65);
      const effectiveText = compositeOver(COLORS.primaryText, surface, 0.65);
      const ratio = contrastRatio(effectiveText, effectiveBg);
      assert.ok(Math.abs(ratio - 4.67) < 0.15, `Expected ~4.67, got ${ratio.toFixed(2)}`);
      assert.ok(ratio >= WCAG_AA_NORMAL, `Disabled contrast ${ratio.toFixed(2)} passes WCAG AA`);
    });
  });
});

// ── CSS Source Verification ─────────────────────────────────────────

describe("WCAG Contrast — CSS Source Verification", () => {
  let css: string;

  function loadCss() {
    if (!css) {
      css = fs.readFileSync("app/globals.css", "utf-8");
    }
    return css;
  }

  it("primary button uses dark brown background, not beige", () => {
    const content = loadCss();
    const primaryBlock = content.match(/\.admin-btn-primary\s*\{[^}]+\}/);
    assert.ok(primaryBlock, ".admin-btn-primary block found");
    assert.ok(
      primaryBlock![0].includes("#3E2723"),
      "Primary bg should be #3E2723 (dark brown)"
    );
    assert.ok(
      !primaryBlock![0].includes("var(--admin-brand-accent)"),
      "Primary bg should NOT use --admin-brand-accent (beige)"
    );
  });

  it("primary button uses white text", () => {
    const content = loadCss();
    const primaryBlock = content.match(/\.admin-btn-primary\s*\{[^}]+\}/);
    assert.ok(primaryBlock, ".admin-btn-primary block found");
    assert.ok(
      primaryBlock![0].includes("color: #FFFFFF"),
      "Primary text must be #FFFFFF"
    );
  });

  it("secondary button uses dark text, not white", () => {
    const content = loadCss();
    const secondaryBlock = content.match(/\.admin-btn-secondary\s*\{[^}]+\}/);
    assert.ok(secondaryBlock, ".admin-btn-secondary block found");
    assert.ok(
      secondaryBlock![0].includes("#3E2723"),
      "Secondary text should be #3E2723 (dark brown)"
    );
    assert.ok(
      !secondaryBlock![0].includes("color: #FFFFFF"),
      "Secondary text must NOT be white"
    );
  });

  it("disabled state uses 0.65 opacity (not lower)", () => {
    const content = loadCss();
    const disabledRule = content.match(
      /\.admin-btn:disabled[\s\S]*?\{[^}]*opacity:\s*([\d.]+)/
    );
    assert.ok(disabledRule, "Disabled opacity rule found");
    const opacity = parseFloat(disabledRule![1]);
    assert.ok(
      opacity >= 0.6,
      `Disabled opacity ${opacity} should be ≥0.6 for readability`
    );
  });

  it("focus ring uses dark color, not beige", () => {
    const content = loadCss();
    const match = content.match(/--admin-focus-ring:\s*(#[0-9A-Fa-f]{6})/);
    assert.ok(match, "--admin-focus-ring variable found");
    const focusColor = match![1];
    const ratio = contrastRatio(focusColor, "#F8F6F3");
    assert.ok(
      ratio >= 3.0,
      `Focus ring ${focusColor} on admin bg = ${ratio.toFixed(2)}:1, need ≥3.0`
    );
  });

  it("primary comment reports accurate ratio (~13.82:1, not inflated)", () => {
    const content = loadCss();
    const match = content.match(/\/\*.*?primary.*?(\d+\.?\d*):1.*?\*\//i);
    assert.ok(match, "Primary button comment found with ratio");
    const claimedRatio = parseFloat(match![1]);
    assert.ok(
      claimedRatio >= 13.0 && claimedRatio <= 14.5,
      `Comment claims ${claimedRatio}:1 but actual is ~13.82:1`
    );
  });

  it("secondary comment does not claim AAA for normal text", () => {
    const content = loadCss();
    const match = content.match(/\/\*.*?secondary.*?(\d+\.?\d*):1.*?\*\//i);
    assert.ok(match, "Secondary button comment found with ratio");
    const claimedRatio = parseFloat(match![1]);
    assert.ok(
      claimedRatio < 8.0,
      `Comment claims ${claimedRatio}:1 — secondary is ~6.19:1 and must not be reported as AAA`
    );
  });

  it("--admin-control-height is at least 44px", () => {
    const content = loadCss();
    const match = content.match(/--admin-control-height:\s*(\d+)px/);
    assert.ok(match, "--admin-control-height variable found");
    const height = parseInt(match![1]);
    assert.ok(
      height >= 44,
      `--admin-control-height should be ≥44px, got ${height}px`
    );
  });
});
