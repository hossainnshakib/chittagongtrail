import { District, TerrainType, type Prisma } from "@prisma/client";
import { sanitizeContent } from "./validation";
import { PUBLIC_PAGE_DEFINITIONS, HOMEPAGE_SECTION_DEFINITIONS } from "./public-content-definitions";

export const DEMO_PREFIX = "demo-a7r93-";
export const DEMO_MARKER = "<p><em>Local demonstration content: A7R.9.3.</em></p>";
const publishedAt = new Date("2026-09-01T06:00:00.000Z");
const body = (heading: string, text: string) => sanitizeContent(`<h2>${heading}</h2><p>${text}</p>${DEMO_MARKER}`);

export function assertLocalDemoEnvironment(env: NodeJS.ProcessEnv) {
  if (env.NODE_ENV === "production") throw new Error("Demo seed refuses NODE_ENV=production");
  let url: URL;
  try { url = new URL(env.DATABASE_URL || ""); } catch { throw new Error("A local MySQL DATABASE_URL is required"); }
  if (url.protocol !== "mysql:" || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    || url.pathname !== "/chittagong_trail" || url.search || url.hash) {
    throw new Error("Demo seed requires the local chittagong_trail MySQL database; remote targets are refused");
  }
}

export function ownsDemoRecord(record: { slug: string; description?: string; content?: string }) {
  return record.slug.startsWith(DEMO_PREFIX) && (record.description ?? record.content ?? "").includes(DEMO_MARKER);
}

const places = [
  ["Patenga waterfront", "patenga-waterfront", District.CHITTAGONG, "Patenga", "Karnaphuli estuary", TerrainType.COAST, 22.235, 91.791, "Watch the river meet the sea from the waterfront, with fishing boats on the horizon and tea stalls nearby."],
  ["Inani shoreline", "inani-shoreline", District.COX_BAZAR, "Ukhiya", "Inani", TerrainType.COAST, 21.229, 92.049, "Walk beside tidal rock pools and open sand, leaving shells and coastal plants where you find them."],
  ["Kaptai lakeside", "kaptai-lakeside", District.RANGAMATI, "Kaptai", "Lakeside", TerrainType.RIVER, 22.494, 92.222, "Spend a quiet morning beside the lake, watching small boats travel between green slopes and waterside settlements."],
  ["Nilachal hillside", "nilachal-hillside", District.BANDARBAN, "Bandarban Sadar", "Tigerpara", TerrainType.HILLS, 22.164, 92.221, "Follow the hillside paths for broad valley views and changing clouds above Bandarban."],
  ["Alutila woodland", "alutila-woodland", District.KHAGRACHARI, "Matiranga", "Alutila", TerrainType.HILLS, 23.043, 91.95, "Take a slow woodland walk near Alutila, with shaded paths and views toward Khagrachari."],
] as const;

export const demoTrails: Prisma.TrailLocationCreateInput[] = places.map(([name, slug, district, administrativeArea, localArea, terrainType, latitude, longitude, excerpt], i) => ({
  name, slug: DEMO_PREFIX + slug, district, administrativeArea, localArea, terrainType, latitude, longitude,
  placeType: "PLACE", excerpt, description: body("A slower way to explore", `${excerpt} These approximate map points are for a local demo. Confirm access and conditions locally, ask before photographing people, and carry litter home.`),
  status: "PUBLISHED", publishedAt, isFeatured: i < 4, featuredOrder: i < 4 ? i + 1 : null,
  metaTitle: `${name} | Chittagong Trail`, metaDescription: excerpt,
}));

const stories = [
  ["Morning beside the Karnaphuli", "morning-karnaphuli", "At the waterfront, the day begins with boat engines, tea glasses, and conversations carried on the breeze."],
  ["A quiet day by Kaptai Lake", "quiet-kaptai", "A lakeside notebook about unhurried walks, changing light, and listening before taking a photograph."],
  ["Clouds above Bandarban", "clouds-bandarban", "An afternoon of hillside views and roadside tea, with plenty of time to stop and watch the weather change."],
] as const;
const foods = [
  ["A Chittagong mezban table", "mezban-table", "A shared table of rice, richly spiced beef, and warm conversation offers a starting point for exploring Chittagong food."],
  ["Coastal fish and a simple lunch", "coastal-fish-lunch", "A coastal lunch notebook: freshly cooked fish, rice, vegetables, and time to ask what is in season."],
  ["Tea after the trail", "tea-after-trail", "Small tea stalls offer a welcome pause after a walk, with hot tea and locally prepared snacks to share."],
] as const;
export const demoPosts: Prisma.JournalPostCreateInput[] = [stories, foods].flatMap((items, group) => items.map(([title, slug, excerpt], i) => ({
  title, slug: DEMO_PREFIX + slug, excerpt, content: body("Notes from the table and trail", `${excerpt} This sample editorial entry invites visitors to explore thoughtfully and speak with local hosts about their own traditions.`),
  type: group === 0 ? "STORY" : "FOOD", status: "PUBLISHED", publishedAt, isFeatured: true, featuredOrder: i + 1,
  metaTitle: `${title} | Chittagong Trail`, metaDescription: excerpt,
})));

export const demoSite: Prisma.SiteSettingsCreateInput = {
  id: 1, siteName: "Chittagong Trail", siteTagline: "Five districts, countless stories",
  defaultMetaTitle: "Chittagong Trail | Trails, stories and food",
  defaultMetaDescription: "Explore Chittagong, Cox's Bazar, Rangamati, Bandarban, and Khagrachari through thoughtful trails, stories, and food.",
  defaultOgTitle: "Chittagong Trail", defaultOgDescription: "From coastal mornings to hillside afternoons: discover five districts at your own pace.",
  heroTitle: "Five Districts. Hills to the Sea. One Chittagong.",
  heroSubtitle: "Follow coastal paths, discover hillside views, and share stories and food across five districts.",
  introductionHeading: "Begin with curiosity",
  introductionContent: body("Five districts, many perspectives", "Chittagong Trail brings together places, food, and everyday stories from Chittagong, Cox's Bazar, Rangamati, Bandarban, and Khagrachari."),
  seasonalEyebrow: "A change of season", seasonalTitle: "Slow mornings, softer light",
  seasonalContent: body("Make room for the weather", "Let a cloudy morning become a tea stop, a short walk, or a conversation. Check local conditions before setting out."),
  aboutHeading: "Take the next small journey",
  aboutContent: body("An independent field notebook", "Explore with care, support local hosts, and leave room for discoveries beyond the itinerary. Start with a trail, a story, or a meal."),
  contactEmail: "hello@example.com", contactPhone: "+1 202 555 0147",
  whatsappUrl: "https://wa.me/12025550147", contactAddress: "Demo editorial desk\nChittagong, Bangladesh",
  mapUrl: "https://www.google.com/maps?q=22.3569,91.7832",
  socialFacebook: "https://www.facebook.com/", socialInstagram: "https://www.instagram.com/",
  socialYouTube: "https://www.youtube.com/", socialX: "https://x.com/", socialThreads: "https://www.threads.net/",
  socialLinkedIn: "https://www.linkedin.com/", socialTikTok: "https://www.tiktok.com/",
  footerText: "An independent notebook of trails, food, and everyday stories across Chittagong's five districts.",
  heroVideoEnabled: false, heroVideoProvider: "NONE", allowIndexing: true,
};

export const demoPages = PUBLIC_PAGE_DEFINITIONS.map(d => ({
  pageKey: d.pageKey, routePath: d.routePath, adminLabel: d.adminLabel,
  visibleTitle: d.fallbackTitle, visibleDescription: d.fallbackDescription,
  metaTitle: d.fallbackTitle, metaDescription: d.fallbackDescription,
  useVisibleTitleAsMetaTitle: true, useVisibleDescriptionAsMetaDescription: true,
  ogTitle: null, ogDescription: null, ogMediaId: null,
  robotsIndex: true, robotsFollow: true, includeInSitemap: true,
}));
const sectionDescriptions: Record<string, string> = {
  destinations: "Choose a coastal path, a lakeside pause, or a hillside view across five districts.",
  experiences: "Discover the everyday encounters that give each journey its character.",
  food: "Find shared tables, coastal lunches, and tea stops worth making time for.",
  stories: "Read field notes from the waterfront, the lakeside, and the hills.",
  gallery: "A place for owner photographs of paths, people, and landscapes, shared with permission.",
};
export const demoSections = HOMEPAGE_SECTION_DEFINITIONS.map(d => ({
  sectionKey: d.sectionKey, eyebrow: d.fallbackEyebrow, heading: d.fallbackHeading,
  description: sectionDescriptions[d.sectionKey], ctaLabel: d.fallbackCtaLabel || null,
  ctaHref: d.fallbackCtaHref || null, enabled: true, displayOrder: d.displayOrder,
}));
