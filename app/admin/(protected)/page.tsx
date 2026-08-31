import Link from "next/link";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";
import AdminButton from "@/components/admin/ui/AdminButton";
import { getDashboardCounts, getNeedsAttention, getHomepageReadiness, getRecentContent } from "@/lib/dashboard-service";

export default async function AdminDashboard() {
  const [counts, attention, homepage, recent] = await Promise.all([
    getDashboardCounts(),
    getNeedsAttention(),
    getHomepageReadiness(),
    getRecentContent(),
  ]);

  const allEmpty = counts.trails.total === 0 && counts.stories.total === 0 && counts.food.total === 0;

  return (
    <div style={{ "--admin-content-max-width": "1400px" } as React.CSSProperties}>
      <AdminPageHeader
        title="Dashboard"
        description="Operational overview of your content."
        primaryAction={
          <div className="admin-dashboard-quick-actions">
            <AdminButton href="/admin/trails/new" variant="primary" size="sm">New Trail</AdminButton>
            <AdminButton href="/admin/journal/new" variant="secondary" size="sm">New Story</AdminButton>
            <AdminButton href="/admin/food/new" variant="secondary" size="sm">New Food Post</AdminButton>
            <AdminButton href="/admin/media" variant="ghost" size="sm">Upload Media</AdminButton>
          </div>
        }
      />

      {allEmpty ? (
        <AdminSectionCard>
          <div className="admin-content-empty" style={{ padding: "32px 24px" }}>
            <svg className="admin-content-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h3 className="admin-content-empty-title">No content yet</h3>
            <p className="admin-content-empty-desc">
              Create your first trail, story, or food post to get started.
            </p>
            <div className="admin-dashboard-quick-actions" style={{ marginTop: "16px", justifyContent: "center" }}>
              <AdminButton href="/admin/trails/new" variant="primary" size="sm">Create First Trail</AdminButton>
              <AdminButton href="/admin/journal/new" variant="secondary" size="sm">Create First Story</AdminButton>
            </div>
          </div>
        </AdminSectionCard>
      ) : (
        <>
          {/* Content Overview */}
          <section aria-label="Content overview" className="mb-6">
            <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--admin-text-primary)" }}>
              Content Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/admin/trails" className="admin-dashboard-stat-card">
                <span className="admin-dashboard-stat-label">Trails</span>
                <span className="admin-dashboard-stat-value">{counts.trails.total}</span>
                <span className="admin-dashboard-stat-detail">
                  <span className="admin-dashboard-stat-dot" style={{ backgroundColor: "var(--admin-draft)" }} />
                  {counts.trails.draft} draft · {counts.trails.published} published · {counts.trails.archived} archived · {counts.trails.featured} featured
                </span>
              </Link>
              <Link href="/admin/journal" className="admin-dashboard-stat-card">
                <span className="admin-dashboard-stat-label">Stories</span>
                <span className="admin-dashboard-stat-value">{counts.stories.total}</span>
                <span className="admin-dashboard-stat-detail">
                  <span className="admin-dashboard-stat-dot" style={{ backgroundColor: "var(--admin-draft)" }} />
                  {counts.stories.draft} draft · {counts.stories.published} published · {counts.stories.archived} archived · {counts.stories.featured} featured
                </span>
              </Link>
              <Link href="/admin/food" className="admin-dashboard-stat-card">
                <span className="admin-dashboard-stat-label">Food Posts</span>
                <span className="admin-dashboard-stat-value">{counts.food.total}</span>
                <span className="admin-dashboard-stat-detail">
                  <span className="admin-dashboard-stat-dot" style={{ backgroundColor: "var(--admin-draft)" }} />
                  {counts.food.draft} draft · {counts.food.published} published · {counts.food.archived} archived · {counts.food.featured} featured
                </span>
              </Link>
              <Link href="/admin/media" className="admin-dashboard-stat-card">
                <span className="admin-dashboard-stat-label">Media</span>
                <span className="admin-dashboard-stat-value">{counts.media.total}</span>
                <span className="admin-dashboard-stat-detail">
                  <span className="admin-dashboard-stat-dot" style={{ backgroundColor: "var(--admin-info)" }} />
                  {counts.media.images} images · {counts.media.videos} videos
                </span>
              </Link>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Needs Attention */}
            <div className="lg:col-span-2">
              <AdminSectionCard title="Needs Attention" noPadding>
                {attention.length === 0 ? (
                  <p className="text-sm py-6 text-center" style={{ color: "var(--admin-text-muted)" }}>
                    No content needs attention right now.
                  </p>
                ) : (
                  <div className="px-5">
                    {attention.map((item) => {
                      const typeColor =
                        item.type === "trail" ? "var(--admin-type-trail)" :
                        item.type === "food" ? "var(--admin-type-food)" : "var(--admin-type-story)";
                      const typeBg =
                        item.type === "trail" ? "rgba(8,145,178,0.1)" :
                        item.type === "food" ? "rgba(234,88,12,0.1)" : "rgba(37,99,235,0.1)";
                      const editHref =
                        item.type === "trail" ? `/admin/trails/${item.id}/edit` : `/admin/journal/${item.id}/edit`;
                      return (
                        <div key={`${item.type}-${item.id}`} className="admin-dashboard-attention-item">
                          <span
                            className="admin-dashboard-attention-type"
                            style={{ backgroundColor: typeBg, color: typeColor }}
                          >
                            {item.type}
                          </span>
                          <Link href={editHref} className="font-medium hover:underline" style={{ color: "var(--admin-text-primary)" }}>
                            {item.title}
                          </Link>
                          <span className="admin-dashboard-attention-issues">
                            {item.issues.join(", ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AdminSectionCard>
            </div>

            {/* Homepage Readiness */}
            <div>
              <AdminSectionCard title="Homepage Readiness" noPadding>
                <div className="px-5 py-3">
                  <div className="admin-dashboard-readiness-row">
                    <span className="admin-dashboard-readiness-label">Featured Trails</span>
                    <span className={`admin-dashboard-readiness-value ${homepage.featuredTrailsCount > 0 ? "admin-dashboard-readiness-ok" : "admin-dashboard-readiness-missing"}`}>
                      {homepage.featuredTrailsCount} / {homepage.featuredTrailsMax}
                    </span>
                  </div>
                  <div className="admin-dashboard-readiness-row">
                    <span className="admin-dashboard-readiness-label">Featured Stories</span>
                    <span className={`admin-dashboard-readiness-value ${homepage.featuredStoriesCount > 0 ? "admin-dashboard-readiness-ok" : "admin-dashboard-readiness-missing"}`}>
                      {homepage.featuredStoriesCount} / {homepage.featuredStoriesMax}
                    </span>
                  </div>
                  <div className="admin-dashboard-readiness-row">
                    <span className="admin-dashboard-readiness-label">Featured Food</span>
                    <span className={`admin-dashboard-readiness-value ${homepage.featuredFoodCount > 0 ? "admin-dashboard-readiness-ok" : "admin-dashboard-readiness-missing"}`}>
                      {homepage.featuredFoodCount} / {homepage.featuredFoodMax}
                    </span>
                  </div>
                  <div className="admin-dashboard-readiness-row">
                    <span className="admin-dashboard-readiness-label">Gallery</span>
                    <span className={`admin-dashboard-readiness-value ${homepage.galleryCount >= homepage.galleryTargetMin ? "admin-dashboard-readiness-ok" : "admin-dashboard-readiness-missing"}`}>
                      {homepage.galleryCount} / {homepage.galleryTargetMin}–{homepage.galleryTargetMax}
                    </span>
                  </div>
                  <div className="admin-dashboard-readiness-row">
                    <span className="admin-dashboard-readiness-label">Hero Poster</span>
                    <span className={`admin-dashboard-readiness-value ${homepage.heroPosterConfigured ? "admin-dashboard-readiness-ok" : "admin-dashboard-readiness-missing"}`}>
                      {homepage.heroPosterConfigured ? "Configured" : "Missing"}
                    </span>
                  </div>
                  <div className="admin-dashboard-readiness-row">
                    <span className="admin-dashboard-readiness-label">Hero Video</span>
                    <span className="admin-dashboard-readiness-value">
                      {homepage.heroVideoEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </AdminSectionCard>
            </div>
          </div>

          {/* Recent Content */}
          <AdminSectionCard title="Recent Content" noPadding>
            {recent.length === 0 ? (
              <p className="text-sm py-6 text-center" style={{ color: "var(--admin-text-muted)" }}>
                No recent content.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="admin-content-table" aria-label="Recent content">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Type</th>
                      <th scope="col">Status</th>
                      <th scope="col">Updated</th>
                      <th scope="col" className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((item) => {
                      const editHref = item.type === "trail" ? `/admin/trails/${item.id}/edit` : `/admin/journal/${item.id}/edit`;
                      const previewHref = item.type === "trail" ? `/admin/trails/${item.id}/preview` : `/admin/journal/${item.id}/preview`;
                      const publicHref = item.type === "trail" ? `/trails/${item.slug}` :
                        item.type === "food" ? `/food/${item.slug}` : `/journal/${item.slug}`;
                      const typeLabel = item.type === "trail" ? "Trail" : item.type === "food" ? "Food" : "Story";
                      const typeColor = item.type === "trail" ? "var(--admin-type-trail)" :
                        item.type === "food" ? "var(--admin-type-food)" : "var(--admin-type-story)";

                      return (
                        <tr key={`${item.type}-${item.id}`}>
                          <td>
                            <Link href={editHref} className="font-medium hover:underline" style={{ color: "var(--admin-text-primary)" }}>
                              {item.title}
                            </Link>
                            <p className="text-xs" style={{ color: "var(--admin-text-muted)", fontFamily: "monospace" }}>/{item.slug}</p>
                          </td>
                          <td>
                            <span className="admin-content-type-badge" style={{ backgroundColor: typeColor }}>
                              {typeLabel}
                            </span>
                          </td>
                          <td>
                            <span className={`admin-content-status-badge admin-content-status-${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>
                            {item.updatedAt.toLocaleDateString()}
                          </td>
                          <td>
                            <div className="admin-content-row-actions" style={{ justifyContent: "flex-end" }}>
                              <Link href={editHref} className="admin-content-row-action admin-content-row-action-default">Edit</Link>
                              <Link href={previewHref} className="admin-content-row-action admin-content-row-action-default" target="_blank" rel="noopener noreferrer">Preview</Link>
                              {item.status === "PUBLISHED" && (
                                <Link href={publicHref} className="admin-content-row-action admin-content-row-action-primary" target="_blank" rel="noopener noreferrer">View</Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </AdminSectionCard>
        </>
      )}
    </div>
  );
}
