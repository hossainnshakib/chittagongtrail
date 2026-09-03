export interface AdminNavItemDef {
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  tooltip?: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItemDef[];
}

export const adminNavigation: AdminNavGroup[] = [
  {
    label: "",
    items: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Trails", href: "/admin/trails", icon: "trails" },
      { label: "Journal", href: "/admin/journal", icon: "journal" },
      { label: "Food", href: "/admin/food", icon: "food" },
    ],
  },
  {
    label: "Media",
    items: [
      { label: "Media Library", href: "/admin/media", icon: "media" },
    ],
  },
  {
    label: "Homepage",
    items: [
      { label: "Overview", href: "/admin/homepage", icon: "overview" },
      { label: "Hero", href: "/admin/homepage/hero", icon: "hero" },
      { label: "Featured Trails", href: "/admin/homepage/featured-trails", icon: "featured" },
      { label: "Featured Stories", href: "/admin/homepage/featured-stories", icon: "featured" },
      { label: "Featured Food", href: "/admin/homepage/featured-food", icon: "featured" },
      { label: "Seasonal / Mood", href: "/admin/homepage/seasonal", icon: "seasonal" },
      { label: "Gallery", href: "/admin/homepage/gallery", icon: "gallery" },
    ],
  },
  {
    label: "Site Settings",
    items: [
      { label: "General", href: "/admin/settings", icon: "settings" },
      { label: "Introduction / About", href: "/admin/settings/about", icon: "settings" },
      { label: "Contact & Social", href: "/admin/settings/contact", icon: "settings" },
      { label: "Footer", href: "/admin/settings/footer", icon: "settings" },
    ],
  },
];

export const adminUtilityItems: AdminNavItemDef[] = [
  { label: "View Site", href: "/", icon: "external" },
  { label: "Logout", icon: "logout" },
];
