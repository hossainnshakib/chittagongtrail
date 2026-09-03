"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";
import AdminButton from "@/components/admin/ui/AdminButton";

interface OverviewData {
  overview: {
    hero: { enabled: boolean; posterPresent: boolean; videoPresent: boolean; videoProvider: string; titlePresent: boolean; subtitlePresent: boolean };
    featuredTrails: { count: number; limit: number };
    featuredStories: { count: number; limit: number };
    featuredFood: { count: number; limit: number };
    seasonal: { configured: boolean; eyebrow: string; title: string; mediaPresent: boolean };
    gallery: { count: number; recommendedMin: number; recommendedMax: number; warning: boolean };
  };
  warnings: {
    trailWarnings: Array<{ id: number; name: string; status: string }>;
    storyWarnings: Array<{ id: number; title: string; status: string }>;
    foodWarnings: Array<{ id: number; title: string; status: string }>;
  };
}

export default function HomepageOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/homepage/overview")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load overview");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-muted)" }}>Loading homepage overview…</div>;
  if (error) return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>;
  if (!data) return null;

  const { overview, warnings } = data;
  const heroComplete = overview.hero.posterPresent && overview.hero.titlePresent;
  const heroStatus = overview.hero.enabled ? (heroComplete ? "Configured" : "Incomplete") : "Disabled";

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <AdminPageHeader
        title="Homepage"
        description="Editorial control center — overview of all homepage modules"
        primaryAction={<AdminButton href="/" variant="ghost" size="sm">View public homepage</AdminButton>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Hero */}
        <AdminSectionCard
          title="Hero"
          description={heroStatus + (overview.hero.videoPresent ? ` · Video: ${overview.hero.videoProvider}` : overview.hero.enabled ? " · Video missing" : "")}
          action={<Link href="/admin/homepage/hero" className="admin-btn admin-btn-primary admin-btn-sm">Edit Hero</Link>}
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--admin-text-secondary)" }}>Enabled</span>
              <span style={{ fontWeight: 500, color: overview.hero.enabled ? "var(--admin-published)" : "var(--admin-text-muted)" }}>{overview.hero.enabled ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--admin-text-secondary)" }}>Poster</span>
              <span style={{ fontWeight: 500, color: overview.hero.posterPresent ? "var(--admin-published)" : "var(--admin-warning)" }}>{overview.hero.posterPresent ? "Selected" : "Missing"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--admin-text-secondary)" }}>Video</span>
              <span style={{ fontWeight: 500, color: overview.hero.videoPresent ? "var(--admin-published)" : "var(--admin-text-muted)" }}>{overview.hero.videoPresent ? "Selected" : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--admin-text-secondary)" }}>Title</span>
              <span style={{ color: overview.hero.titlePresent ? "var(--admin-published)" : "var(--admin-warning)" }}>{overview.hero.titlePresent ? "Present" : "Missing"}</span>
            </div>
            {!heroComplete && overview.hero.enabled && <p className="text-xs p-2 rounded" style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}>Hero is enabled but poster or title is missing — public hero will fall back to defaults.</p>}
          </div>
        </AdminSectionCard>

        {/* Featured Trails */}
        <AdminSectionCard
          title="Featured Trails"
          description={`${overview.featuredTrails.count} / ${overview.featuredTrails.limit} selected`}
          action={<Link href="/admin/homepage/featured-trails" className="admin-btn admin-btn-primary admin-btn-sm">Edit Trails</Link>}
        >
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Selected</span><span style={{ fontWeight: 600 }}>{overview.featuredTrails.count} / {overview.featuredTrails.limit}</span></div>
            {warnings.trailWarnings.length > 0 && <p className="text-xs p-2 rounded" style={{ background: "#FEF3C7", color: "#92400E" }}>{warnings.trailWarnings.length} featured trail(s) are unpublished and hidden from public homepage.</p>}
            {overview.featuredTrails.count === 0 && <p className="text-xs" style={{ color: "var(--admin-warning)" }}>No featured trails — public Featured section will show placeholder.</p>}
          </div>
        </AdminSectionCard>

        {/* Featured Stories */}
        <AdminSectionCard
          title="Featured Stories"
          description={`${overview.featuredStories.count} / ${overview.featuredStories.limit} selected`}
          action={<Link href="/admin/homepage/featured-stories" className="admin-btn admin-btn-primary admin-btn-sm">Edit Stories</Link>}
        >
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Selected</span><span style={{ fontWeight: 600 }}>{overview.featuredStories.count} / {overview.featuredStories.limit}</span></div>
            {warnings.storyWarnings.length > 0 && <p className="text-xs p-2 rounded" style={{ background: "#FEF3C7", color: "#92400E" }}>{warnings.storyWarnings.length} featured story(s) are not published and hidden publicly.</p>}
            {overview.featuredStories.count === 0 && <p className="text-xs" style={{ color: "var(--admin-warning)" }}>No featured stories selected.</p>}
          </div>
        </AdminSectionCard>

        {/* Featured Food */}
        <AdminSectionCard
          title="Featured Food"
          description={`${overview.featuredFood.count} / ${overview.featuredFood.limit} selected`}
          action={<Link href="/admin/homepage/featured-food" className="admin-btn admin-btn-primary admin-btn-sm">Edit Food</Link>}
        >
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Selected</span><span style={{ fontWeight: 600 }}>{overview.featuredFood.count} / {overview.featuredFood.limit}</span></div>
            {warnings.foodWarnings.length > 0 && <p className="text-xs p-2 rounded" style={{ background: "#FEF3C7", color: "#92400E" }}>{warnings.foodWarnings.length} featured food post(s) are not published and hidden publicly.</p>}
            {overview.featuredFood.count === 0 && <p className="text-xs" style={{ color: "var(--admin-warning)" }}>No featured food selected.</p>}
          </div>
        </AdminSectionCard>

        {/* Seasonal / Mood */}
        <AdminSectionCard
          title="Seasonal / Mood"
          description={overview.seasonal.configured ? "Configured" : "Incomplete"}
          action={<Link href="/admin/homepage/seasonal" className="admin-btn admin-btn-primary admin-btn-sm">Edit Seasonal</Link>}
        >
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Heading</span><span style={{ color: overview.seasonal.title ? "var(--admin-published)" : "var(--admin-text-muted)" }}>{overview.seasonal.title || "—"}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Eyebrow</span><span style={{ color: overview.seasonal.eyebrow ? "var(--admin-published)" : "var(--admin-text-muted)" }}>{overview.seasonal.eyebrow || "—"}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Image</span><span style={{ color: overview.seasonal.mediaPresent ? "var(--admin-published)" : "var(--admin-text-muted)" }}>{overview.seasonal.mediaPresent ? "Selected" : "Missing"}</span></div>
            {!overview.seasonal.configured && <p className="text-xs" style={{ color: "var(--admin-warning)" }}>Add an eyebrow or title with supporting content to publish this section.</p>}
          </div>
        </AdminSectionCard>

        {/* Gallery */}
        <AdminSectionCard
          title="Homepage Gallery"
          description={`${overview.gallery.count} images · recommended ${overview.gallery.recommendedMin}–${overview.gallery.recommendedMax}`}
          action={<Link href="/admin/homepage/gallery" className="admin-btn admin-btn-primary admin-btn-sm">Edit Gallery</Link>}
        >
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span style={{ color: "var(--admin-text-secondary)" }}>Count</span><span style={{ fontWeight: 600, color: overview.gallery.warning ? "var(--admin-warning)" : "var(--admin-published)" }}>{overview.gallery.count}</span></div>
            {overview.gallery.warning && <p className="text-xs p-2 rounded" style={{ background: overview.gallery.count < overview.gallery.recommendedMin ? "#FEF3C7" : "#FDF5E6", color: "#92400E", border: "1px solid #FDE68A" }}>{overview.gallery.count < overview.gallery.recommendedMin ? `Editorial warning: add at least ${overview.gallery.recommendedMin - overview.gallery.count} more image(s) for ideal curation (6–8 recommended).` : `Editorial note: ${overview.gallery.count} images exceeds the recommended 6–8 — consider trimming for layout balance.`}</p>}
            {!overview.gallery.warning && <p className="text-xs" style={{ color: "var(--admin-published)" }}>Gallery within recommended range.</p>}
          </div>
        </AdminSectionCard>
      </div>

      <div className="mt-6 p-4 rounded-lg border" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
        <p className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>Quick links:
          <Link href="/admin/homepage/hero" className="ml-2 underline">Hero</Link>
          <Link href="/admin/homepage/featured-trails" className="ml-3 underline">Trails</Link>
          <Link href="/admin/homepage/featured-stories" className="ml-3 underline">Stories</Link>
          <Link href="/admin/homepage/featured-food" className="ml-3 underline">Food</Link>
          <Link href="/admin/homepage/seasonal" className="ml-3 underline">Seasonal</Link>
          <Link href="/admin/homepage/gallery" className="ml-3 underline">Gallery</Link>
          <Link href="/" className="ml-3 underline" target="_blank" rel="noopener">Public homepage ↗</Link>
        </p>
      </div>
    </div>
  );
}
