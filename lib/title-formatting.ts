export const TITLE_SEPARATOR = " | ";
const TITLE_SEPARATORS = [TITLE_SEPARATOR, "|", " — ", " – ", " - ", ": "];

function titleMatchesSiteName(value: string, siteName: string): boolean {
  return value.toLowerCase() === siteName.trim().toLowerCase();
}

export function withoutSiteNameSuffix(title: string, siteName: string): string {
  let clean = (title || "").trim();
  const name = siteName.trim();
  if (!name) return clean;
  for (const separator of TITLE_SEPARATORS) {
    const suffix = `${separator}${name}`;
    if (clean.toLowerCase().endsWith(suffix.toLowerCase())) {
      clean = clean.slice(0, -suffix.length).trim();
      break;
    }
  }
  return titleMatchesSiteName(clean, name) ? "" : clean;
}

export function withoutSiteNamePrefix(title: string, siteName: string): string {
  const clean = (title || "").trim();
  const name = siteName.trim();
  if (!name) return clean;
  for (const separator of TITLE_SEPARATORS) {
    const prefix = `${name}${separator}`;
    if (clean.toLowerCase().startsWith(prefix.toLowerCase())) {
      return clean.slice(prefix.length).trim();
    }
  }
  return titleMatchesSiteName(clean, name) ? "" : clean;
}

/** Produces exactly one canonical site-name suffix on public page titles. */
export function withSiteName(title: string, siteName: string): string {
  const name = siteName.trim();
  const withoutSuffix = withoutSiteNameSuffix(title, name);
  if (!withoutSuffix || titleMatchesSiteName(withoutSuffix, name)) return name;
  const clean = withoutSiteNamePrefix(withoutSuffix, name);
  if (!clean) return name;
  return `${clean}${TITLE_SEPARATOR}${name}`;
}
