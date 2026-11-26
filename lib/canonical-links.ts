import "server-only";
import { ContentStatus } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Legacy public paths that still point at content whose slug was later
 * normalized. Resolve these at request time so existing slugs stay untouched
 * and CMS-authored links keep working without a production data edit.
 */
export const LEGACY_TRAIL_ALIASES: Record<string, string[]> = {
  "kaptai-dam": ["Kaptai Dam", "Kaptai"],
};

export async function resolveLegacyTrailSlug(slug: string): Promise<string | null> {
  const candidateNames = LEGACY_TRAIL_ALIASES[slug];
  if (!candidateNames) return null;

  for (const name of candidateNames) {
    const trail = await prisma.trailLocation.findFirst({
      where: { status: ContentStatus.PUBLISHED, name: { contains: name } },
      select: { slug: true },
      orderBy: { publishedAt: "desc" },
    });
    if (trail) return trail.slug;
  }

  return null;
}
