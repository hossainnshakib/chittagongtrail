import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

// ── WCAG contrast utility ──────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
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
const WCAG_AA_LARGE = 3.0;
const WCAG_FOCUS_MIN = 3.0;

// ── Tests ──────────────────────────────────────────────────────────

describe("WCAG Contrast — Admin Button Colors", () => {
  describe("Utility correctness", () => {
    it("hexToRgb parses 6-digit hex", () => {
      assert.deepStrictEqual(hexToRgb("#FFFFFF"), [255, 255, 255]);
      assert.deepStrictEqual(hexToRgb("#000000"), [0, 0, 0]);
      assert.deepStrictEqual(hexToRgb("#3E2723"), [62, 39, 35]);
    });

    it("relativeLuminance of white is ~1.0", () => {
      const lum = relativeLuminance("#FFFFFF");
      assert.ok(Math.abs(lum - 1.0) < 0.001, `Expected ~1.0, got ${lum}`);
    });

    it("relativeLuminance of black is ~0.0", () => {
      const lum = relativeLuminance("#000000");
      assert.ok(lum < 0.001, `Expected ~0.0, got ${lum}`);
    });

    it("contrastRatio of white on black is 21:1", () => {
      const ratio = contrastRatio("#FFFFFF", "#000000");
      assert.ok(Math.abs(ratio - 21) < 0.1, `Expected ~21, got ${ratio}`);
    });
  });

  describe("Primary button", () => {
    it("default meets WCAG AA (≥4.5:1)", () => {
      const ratio = contrastRatio(COLORS.primaryText, COLORS.primaryBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Primary ${COLORS.primaryText} on ${COLORS.primaryBg} = ${ratio.toFixed(2)}:1, need ≥${WCAG_AA_NORMAL}:1`
      );
    });

    it("hover meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.primaryText, COLORS.primaryHoverBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Primary hover ${COLORS.primaryText} on ${COLORS.primaryHoverBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });

  describe("Secondary button", () => {
    it("default meets WCAG AA (≥4.5:1)", () => {
      const ratio = contrastRatio(COLORS.secondaryText, COLORS.secondaryBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Secondary ${COLORS.secondaryText} on ${COLORS.secondaryBg} = ${ratio.toFixed(2)}:1`
      );
    });

    it("hover meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.secondaryText, COLORS.secondaryHoverBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Secondary hover ${COLORS.secondaryText} on ${COLORS.secondaryHoverBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });

  describe("Ghost button", () => {
    it("text on admin bg meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.ghostText, COLORS.adminBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Ghost ${COLORS.ghostText} on ${COLORS.adminBg} = ${ratio.toFixed(2)}:1`
      );
    });

    it("hover text on hover bg meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.ghostText, COLORS.ghostHoverBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Ghost hover ${COLORS.ghostText} on ${COLORS.ghostHoverBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });

  describe("Danger button", () => {
    it("default meets WCAG AA (≥4.5:1)", () => {
      const ratio = contrastRatio(COLORS.dangerText, COLORS.dangerBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Danger ${COLORS.dangerText} on ${COLORS.dangerBg} = ${ratio.toFixed(2)}:1`
      );
    });

    it("hover meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.dangerText, COLORS.dangerHoverBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Danger hover ${COLORS.dangerText} on ${COLORS.dangerHoverBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });

  describe("Focus indicator", () => {
    it("focus ring on admin background meets WCAG focus minimum (≥3:1)", () => {
      const ratio = contrastRatio(COLORS.focusRing, COLORS.adminBg);
      assert.ok(
        ratio >= WCAG_FOCUS_MIN,
        `Focus ring ${COLORS.focusRing} on ${COLORS.adminBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });

  describe("Breadcrumb & topbar links", () => {
    it("breadcrumb link text on admin bg meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.breadcrumbLinkText, COLORS.adminBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Breadcrumb ${COLORS.breadcrumbLinkText} on ${COLORS.adminBg} = ${ratio.toFixed(2)}:1`
      );
    });

    it("topbar link text on admin bg meets WCAG AA", () => {
      const ratio = contrastRatio(COLORS.topbarLinkText, COLORS.adminBg);
      assert.ok(
        ratio >= WCAG_AA_NORMAL,
        `Topbar link ${COLORS.topbarLinkText} on ${COLORS.adminBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });

  describe("Invalid pairings — must fail", () => {
    it("white text on beige (#C9A882) fails WCAG AA", () => {
      const ratio = contrastRatio("#FFFFFF", "#C9A882");
      assert.ok(
        ratio < WCAG_AA_NORMAL,
        `White on beige = ${ratio.toFixed(2)}:1 — this invalid pairing MUST fail`
      );
    });

    it("beige text (#C9A882) on white fails WCAG AA", () => {
      const ratio = contrastRatio("#C9A882", "#FFFFFF");
      assert.ok(
        ratio < WCAG_AA_NORMAL,
        `Beige on white = ${ratio.toFixed(2)}:1 — this invalid pairing MUST fail`
      );
    });
  });

  describe("Disabled button readability", () => {
    it("disabled primary text at 0.65 opacity on primary bg meets ≥3:1 (large text)", () => {
      const [r, g, b] = hexToRgb(COLORS.primaryText);
      const [br, bg2, bb] = hexToRgb(COLORS.primaryBg);
      const er = Math.round(r * 0.65 + br * 0.35);
      const eg = Math.round(g * 0.65 + bg2 * 0.35);
      const eb = Math.round(b * 0.65 + bb * 0.35);
      const effectiveHex = `#${er.toString(16).padStart(2, "0")}${eg.toString(16).padStart(2, "0")}${eb.toString(16).padStart(2, "0")}`;
      const ratio = contrastRatio(effectiveHex, COLORS.primaryBg);
      assert.ok(
        ratio >= WCAG_AA_LARGE,
        `Disabled primary effective ${effectiveHex} on ${COLORS.primaryBg} = ${ratio.toFixed(2)}:1`
      );
    });
  });
});

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
});
