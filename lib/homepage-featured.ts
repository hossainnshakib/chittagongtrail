/**
 * Single source of truth for homepage curation limits and featured ordering.
 *
 * Lower featuredOrder means earlier. Rows without an order are legacy or
 * uncurated records and always sort after ordered rows. Remaining ties use
 * publication time and id so the public homepage and admin curation list
 * always agree, even when legacy data contains duplicate or NULL orders.
 */
export const HOMEPAGE_FEATURED_LIMITS = {
  trails: 4,
  stories: 3,
  food: 3,
} as const;

export const HOMEPAGE_GALLERY_LIMITS = {
  recommendedMin: 6,
  recommendedMax: 8,
  hardMax: 12,
} as const;

interface FeaturedOrderable {
  id: number;
  featuredOrder: number | null;
  publishedAt: Date | null;
}

const LAST_FEATURED_ORDER = Number.MAX_SAFE_INTEGER;

export function sortFeaturedItems<T extends FeaturedOrderable>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aOrder = a.featuredOrder ?? LAST_FEATURED_ORDER;
    const bOrder = b.featuredOrder ?? LAST_FEATURED_ORDER;
    if (aOrder !== bOrder) return aOrder - bOrder;

    const aPublishedAt = a.publishedAt?.getTime() ?? 0;
    const bPublishedAt = b.publishedAt?.getTime() ?? 0;
    if (aPublishedAt !== bPublishedAt) return bPublishedAt - aPublishedAt;

    return a.id - b.id;
  });
}

export function limitFeaturedItems<T>(items: T[], limit: number): T[] {
  return items.slice(0, limit);
}
