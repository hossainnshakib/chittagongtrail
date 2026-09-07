export const PUBLIC_PAGE_DEFINITIONS = [
  {
    pageKey: "home",
    routePath: "/",
    adminLabel: "Homepage",
    fallbackTitle: "Five Districts. Hills to the Sea. One Chittagong.",
    fallbackDescription:
      "Explore Chittagong through trails, stories, food, and lived journeys across five districts.",
  },
  {
    pageKey: "trails",
    routePath: "/trails",
    adminLabel: "Trails index",
    fallbackTitle: "Trails",
    fallbackDescription:
      "Discover coastal shores, misty hills, heritage sites, markets, and hidden places across Chittagong's five districts.",
  },
  {
    pageKey: "journal",
    routePath: "/journal",
    adminLabel: "Journal index",
    fallbackTitle: "Journal",
    fallbackDescription:
      "Stories, observations, and discoveries from across Chittagong's five districts, shaped by place, culture, history, food, and people.",
  },
  {
    pageKey: "food",
    routePath: "/food",
    adminLabel: "Food index",
    fallbackTitle: "Chittagong Food",
    fallbackDescription:
      "Explore Chittagong's culinary traditions, street food, regional flavors, and food culture across five districts.",
  },
  {
    pageKey: "about",
    routePath: "/about",
    adminLabel: "About page",
    fallbackTitle: "About Chittagong Trail",
    fallbackDescription:
      "Learn about Chittagong Trail, an independent platform documenting the places, culture, history, food, and people of Chittagong.",
  },
] as const;

export type PublicPageKey = (typeof PUBLIC_PAGE_DEFINITIONS)[number]["pageKey"];

export const HOMEPAGE_SECTION_DEFINITIONS = [
  {
    sectionKey: "destinations",
    label: "Featured trails",
    fallbackEyebrow: "Explore Trails",
    fallbackHeading: "Pick one.",
    fallbackDescription: "",
    fallbackCtaLabel: "",
    fallbackCtaHref: "",
    displayOrder: 20,
  },
  {
    sectionKey: "experiences",
    label: "Journal highlights",
    fallbackEyebrow: "Journal",
    fallbackHeading: "Stories from the trail",
    fallbackDescription: "",
    fallbackCtaLabel: "Read all stories",
    fallbackCtaHref: "/journal",
    displayOrder: 40,
  },
  {
    sectionKey: "food",
    label: "Food highlights",
    fallbackEyebrow: "Food",
    fallbackHeading: "Taste of Chittagong",
    fallbackDescription:
      "Dishes worth building a trip around. Rice, river fish, slow beef, and a sweet course the city takes seriously.",
    fallbackCtaLabel: "Explore all food",
    fallbackCtaHref: "/food",
    displayOrder: 50,
  },
  {
    sectionKey: "stories",
    label: "Stories and journeys",
    fallbackEyebrow: "Stories & Journeys",
    fallbackHeading: "Journeys and Dispatches",
    fallbackDescription: "",
    fallbackCtaLabel: "View all stories",
    fallbackCtaHref: "/journal",
    displayOrder: 60,
  },
  {
    sectionKey: "gallery",
    label: "Gallery",
    fallbackEyebrow: "Gallery",
    fallbackHeading: "What it actually looks like",
    fallbackDescription: "",
    fallbackCtaLabel: "",
    fallbackCtaHref: "",
    displayOrder: 70,
  },
] as const;

export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_DEFINITIONS)[number]["sectionKey"];

