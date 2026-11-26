import { HOMEPAGE_FEATURED_LIMITS } from "./homepage-featured";

interface HomepageStoryIdentity {
  id: number;
  slug?: string | null;
}

/**
 * Keeps the two consecutive homepage story sections distinct and predictable.
 * Featured stories are curated once in the admin curation workspace; the
 * second section only uses non-featured published stories after the curated
 * set has been assigned.
 */
export function selectHomepageStorySections<T extends HomepageStoryIdentity>(
  featuredStories: T[],
  additionalStories: T[],
  limit: number = HOMEPAGE_FEATURED_LIMITS.stories
) {
  const highlights: T[] = [];
  const usedIds = new Set<number>();
  const usedSlugs = new Set<string>();

  for (const story of featuredStories) {
    if (usedIds.has(story.id) || (story.slug && usedSlugs.has(story.slug))) continue;
    if (highlights.length >= limit) break;
    highlights.push(story);
    usedIds.add(story.id);
    if (story.slug) usedSlugs.add(story.slug);
  }

  const journeys: T[] = [];
  for (const story of additionalStories) {
    if (usedIds.has(story.id) || (story.slug && usedSlugs.has(story.slug))) continue;
    if (journeys.length >= limit) break;
    journeys.push(story);
    usedIds.add(story.id);
    if (story.slug) usedSlugs.add(story.slug);
  }

  return { highlights, journeys };
}
