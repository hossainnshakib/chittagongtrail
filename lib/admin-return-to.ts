/**
 * Admin list URLs are safe post-save destinations only when they stay on an
 * allow-listed content list. Query strings are preserved so editing from a
 * filtered list returns to that exact list.
 */
const ALLOWED_LIST_PATHS = ["/admin/trails", "/admin/journal", "/admin/food"] as const;

export function safeAdminReturnTo(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  const path = value.split("?", 1)[0];
  const isAllowed = ALLOWED_LIST_PATHS.some((allowed) => path === allowed);
  return isAllowed ? value : fallback;
}
