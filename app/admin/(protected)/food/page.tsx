import Link from "next/link";
import { listAdminJournalPosts } from "@/lib/journal-service";
import { prisma } from "@/lib/prisma";
import { JournalType, ContentStatus } from "@prisma/client";
import { evaluateJournalSeoReadiness } from "@/lib/seo-readiness";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminContentToolbar from "@/components/admin/content/AdminContentToolbar";
import AdminSearchInput from "@/components/admin/content/AdminSearchInput";
import AdminFilterGroup from "@/components/admin/content/AdminFilterGroup";
import AdminSortControl from "@/components/admin/content/AdminSortControl";
import AdminPagination from "@/components/admin/content/AdminPagination";
import AdminResultSummary from "@/components/admin/content/AdminResultSummary";
import AdminSeoStatus from "@/components/admin/content/AdminSeoStatus";
import AdminMediaThumbnail from "@/components/admin/content/AdminMediaThumbnail";
import AdminRowActions from "@/components/admin/content/AdminRowActions";
import AdminListEmptyState from "@/components/admin/content/AdminListEmptyState";
import AdminMobileContentCard from "@/components/admin/content/AdminMobileContentCard";

interface AdminFoodPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    isFeatured?: string;
    trailId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminFoodPage({ searchParams }: AdminFoodPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const status = (params.status as ContentStatus | "ALL") || "ALL";
  const isFeatured = params.isFeatured || "ALL";
  const trailIdParam = params.trailId || "ALL";
  const trailId = trailIdParam !== "ALL" ? parseInt(trailIdParam, 10) : "ALL";
  const sortBy = (params.sortBy as "updatedAt" | "createdAt" | "publishedAt" | "title" | "featuredOrder") || "updatedAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  const [result, trails] = await Promise.all([
    listAdminJournalPosts({
      page, pageSize: 20, search, type: JournalType.FOOD, status, isFeatured, trailId, sortBy, sortOrder,
    }),
    prisma.trailLocation.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const { posts, total, totalPages } = result;

  const buildQueryString = (overrides: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (status !== "ALL") sp.set("status", status);
    if (isFeatured !== "ALL") sp.set("isFeatured", isFeatured);
    if (trailId !== "ALL") sp.set("trailId", String(trailId));
    if (sortBy !== "updatedAt") sp.set("sortBy", sortBy);
    if (sortOrder !== "desc") sp.set("sortOrder", sortOrder);
    for (const [k, v] of Object.entries(overrides)) {
      if (!v || v === "ALL" || v === "") sp.delete(k); else sp.set(k, v);
    }
    const s = sp.toString();
    return s ? `/admin/food?${s}` : "/admin/food";
  };

  const buildPageUrl = (p: number) => buildQueryString({ page: p > 1 ? String(p) : "" });

  const hasFilters = search || status !== "ALL" || isFeatured !== "ALL" || trailId !== "ALL";

  return (
    <div style={{ "--admin-content-max-width": "1400px" } as React.CSSProperties}>
      <AdminPageHeader
        title="Food Posts"
        description={`${total} food post${total !== 1 ? "s" : ""}`}
        primaryAction={<AdminButton href="/admin/food/new" variant="primary" size="sm">New Food Post</AdminButton>}
      />

      <AdminContentToolbar>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <AdminSearchInput defaultValue={search} placeholder="Search title, slug, excerpt..." />
        </div>
        <AdminFilterGroup
          name="status"
          label="Status"
          defaultValue={status}
          options={[
            { value: "ALL", label: "All Statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "PUBLISHED", label: "Published" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
        <AdminFilterGroup
          name="isFeatured"
          label="Featured"
          defaultValue={isFeatured}
          options={[
            { value: "ALL", label: "All" },
            { value: "true", label: "Featured" },
            { value: "false", label: "Not Featured" },
          ]}
        />
        <AdminFilterGroup
          name="trailId"
          label="Trail"
          defaultValue={String(trailId)}
          options={[
            { value: "ALL", label: "All Trails" },
            ...trails.map((t) => ({ value: String(t.id), label: t.name })),
          ]}
        />
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
          <AdminSortControl
            sortBy={sortBy}
            sortOrder={sortOrder}
            options={[
              { value: "updatedAt", label: "Updated Date" },
              { value: "createdAt", label: "Created Date" },
              { value: "publishedAt", label: "Published Date" },
              { value: "title", label: "Title" },
              { value: "featuredOrder", label: "Featured Order" },
            ]}
          />
          <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">Apply</button>
          {hasFilters && (
            <Link href="/admin/food" className="admin-btn admin-btn-secondary admin-btn-sm">Clear</Link>
          )}
        </div>
      </AdminContentToolbar>

      <div style={{ marginTop: "16px" }}>
        <AdminResultSummary total={total} page={page} totalPages={totalPages} label="food posts" />
      </div>

      {posts.length === 0 ? (
        <AdminListEmptyState
          title={hasFilters ? "No food posts match your filters" : "No food posts yet"}
          description={hasFilters ? "Try adjusting your search or filters." : "Create your first food post to get started."}
          action={
            hasFilters ? (
              <Link href="/admin/food" className="admin-btn admin-btn-secondary admin-btn-sm">Clear Filters</Link>
            ) : (
              <AdminButton href="/admin/food/new" variant="primary" size="sm">Create First Food Post</AdminButton>
            )
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: "var(--admin-radius-lg)", overflow: "hidden", boxShadow: "var(--admin-shadow)" }}>
            <table className="admin-content-table" aria-label="Food posts">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "44px" }}><span className="sr-only">Cover</span></th>
                  <th scope="col">Title</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Trail</th>
                  <th scope="col">Status</th>
                  <th scope="col">Featured</th>
                  <th scope="col">SEO</th>
                  <th scope="col">Updated</th>
                  <th scope="col" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const seo = evaluateJournalSeoReadiness({
                    slug: post.slug, metaTitle: post.metaTitle, metaDescription: post.metaDescription,
                    excerpt: post.excerpt, coverMedia: post.coverMedia, ogMedia: post.ogMedia,
                    status: post.status, publishedAt: post.publishedAt,
                  });

                  return (
                    <tr key={post.id}>
                      <td>
                        <AdminMediaThumbnail url={post.coverMedia?.secureUrl ?? null} alt={post.title} size={40} />
                      </td>
                      <td>
                        <Link href={`/admin/food/${post.id}/edit`} className="font-medium hover:underline" style={{ color: "var(--admin-text-primary)" }}>
                          {post.title}
                        </Link>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--admin-text-muted)" }}>/{post.slug}</span>
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--admin-text-secondary)" }}>
                        {post.trail ? (
                          <span title={`Trail status: ${post.trail.status}`}>
                            {post.trail.name}
                            {post.trail.status !== ContentStatus.PUBLISHED && (
                              <span style={{ color: "var(--admin-warning)", fontWeight: 600, marginLeft: "4px" }}>({post.trail.status})</span>
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span className={`admin-content-status-badge admin-content-status-${post.status.toLowerCase()}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>
                        {post.isFeatured ? (
                          <span style={{ fontSize: "0.75rem", color: "#92400E", fontWeight: 500 }}>
                            Featured {post.featuredOrder != null ? `#${post.featuredOrder}` : ""}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <AdminSeoStatus status={seo.status} missingFields={seo.missingFields} />
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "var(--admin-text-secondary)" }}>
                        {post.updatedAt.toLocaleDateString()}
                      </td>
                      <td>
                        <AdminRowActions actions={[
                          { label: "Edit", href: `/admin/food/${post.id}/edit` },
                          ...(post.status === "PUBLISHED" ? [{ label: "View", href: `/food/${post.slug}` }] : []),
                        ]} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {posts.map((post) => {
              const seo = evaluateJournalSeoReadiness({
                slug: post.slug, metaTitle: post.metaTitle, metaDescription: post.metaDescription,
                excerpt: post.excerpt, coverMedia: post.coverMedia, ogMedia: post.ogMedia,
                status: post.status, publishedAt: post.publishedAt,
              });

              return (
                <AdminMobileContentCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  status={post.status}
                  coverUrl={post.coverMedia?.secureUrl ?? null}
                  metaInfo={post.trail?.name ?? undefined}
                  updatedAt={post.updatedAt}
                  seoStatus={<AdminSeoStatus status={seo.status} missingFields={seo.missingFields} />}
                  actions={[
                    { label: "Edit", href: `/admin/food/${post.id}/edit` },
                    ...(post.status === "PUBLISHED" ? [{ label: "View", href: `/food/${post.slug}` }] : []),
                  ]}
                />
              );
            })}
          </div>

          <AdminPagination page={page} totalPages={totalPages} total={total} buildPageUrl={buildPageUrl} />
        </>
      )}
    </div>
  );
}
