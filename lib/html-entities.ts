const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

const ENTITY_PATTERN = /&(#x[\da-f]+|#\d+|[a-z][a-z0-9]+);/gi;

function entityValue(name: string, original: string): string {
  if (name.startsWith("#")) {
    const isHex = name[1]?.toLowerCase() === "x";
    const codePoint = isHex ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return original;
    return String.fromCodePoint(codePoint);
  }
  return NAMED_ENTITIES[name.toLowerCase()] ?? original;
}

/**
 * Decodes entities that sanitize-html escapes in plain-text fields. React will
 * escape the resulting text again, so no HTML is introduced into the DOM.
 */
export function decodeHtmlEntities(value: string): string {
  let output = value;
  for (let pass = 0; pass < 5; pass += 1) {
    const next = output.replace(ENTITY_PATTERN, (original, name: string) => entityValue(name, original));
    if (next === output) break;
    output = next;
  }
  return output;
}

/** Normalizes CMS plain copy to real whitespace and real punctuation. */
export function normalizePlainText(value: string | null | undefined): string {
  if (!value) return "";
  return decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
}
