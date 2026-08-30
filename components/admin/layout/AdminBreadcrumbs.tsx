"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface BreadcrumbSegment {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  admin: "Dashboard",
  trails: "Trails",
  journal: "Journal",
  food: "Food",
  media: "Media",
  settings: "Settings",
  homepage: "Homepage",
  hero: "Hero",
  "featured-trails": "Featured Trails",
  "featured-stories": "Featured Stories",
  "featured-food": "Featured Food",
  seasonal: "Seasonal / Mood",
  gallery: "Gallery",
  about: "Introduction / About",
  contact: "Contact & Social",
  footer: "Footer",
  new: "New",
  edit: "Edit",
  preview: "Preview",
};

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: BreadcrumbSegment[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = routeLabels[segment] || segment;

      if (segment === "admin" && i === 0) {
        continue;
      }

    if (/^[a-f0-9-]{20,}$/.test(segment) || /^\d+$/.test(segment)) {
      continue;
    }

    crumbs.push({ label, href });
  }

  if (crumbs.length === 0) {
    crumbs.push({ label: "Dashboard", href: "/admin" });
  }

  return crumbs;
}

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) {
    return (
      <nav aria-label="Breadcrumb" className="text-sm" style={{ color: "var(--admin-text-muted)" }}>
        <span>{breadcrumbs[0]?.label}</span>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 text-sm list-none m-0 p-0" style={{ color: "var(--admin-text-muted)" }}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, flexShrink: 0 }}>
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              )}
              {isLast ? (
                <span style={{ color: "var(--admin-text-primary)", fontWeight: 500 }}>
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="admin-focus-ring"
                  style={{ color: "var(--admin-text-muted)", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--admin-text-primary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--admin-text-muted)"; }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
