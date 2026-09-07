const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function getConfiguredSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || "";
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || LOCAL_HOSTS.has(url.hostname) || url.username || url.password) return "";
    return url.origin;
  } catch {
    return "";
  }
}

export function getConfiguredSiteUrl(path?: string): string {
  const origin = getConfiguredSiteOrigin();
  if (!origin) return "";
  if (!path) return origin;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}
