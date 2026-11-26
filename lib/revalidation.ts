import "server-only";

import { revalidatePath } from "next/cache";

/**
 * Invalidate every public surface that CMS content can affect.
 *
 * Detail routes are invalidated by route pattern (not by a known slug) because
 * a mutation can rename or delete a record, so the old slug is no longer
 * available to the caller. This complements the request-time database reads on
 * public pages and keeps the client router cache consistent after a save.
 */
export function revalidatePublicContent() {
  const pagePaths = [
    "/",
    "/trails",
    "/journal",
    "/food",
    "/about",
    "/sitemap.xml",
  ];

  for (const path of pagePaths) {
    revalidatePath(path);
  }

  revalidatePath("/trails/[slug]", "page");
  revalidatePath("/journal/[slug]", "page");
  revalidatePath("/food/[slug]", "page");
}
