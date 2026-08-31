import Link from "next/link";
import { listAdminTrails } from "@/lib/trail-service";
import { evaluateTrailSeoReadiness } from "@/lib/seo-readiness";
import { District, ContentStatus } from "@prisma/client";
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

interface AdminTrailsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    district?: string;
    status?: string;
    isFeatured?: string;
    terrainType?: string;
    placeType?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminTrailsPage({ searchParams }: AdminTrailsPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const search = params.search || "";
  const district = (params.district as District | "ALL") || "ALL";
  const status = (params.status as ContentStatus | "ALL") || "ALL";
  const isFeatured = params.isFeatured || "ALL";
  const terrainType = params.terrainType || "ALL";
  const placeType = params.placeType || "ALL";
  const sortBy = (params.sortBy as "updatedAt" | "createdAt" | "publishedAt" | "name" | "featuredOrder") || "updatedAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  const { trails, total, totalPages } = await listAdminTrails({
    page, pageSize: 20, search, district, status, isFeatured, terrainType, placeType, sortBy, sortOrder,
  });

  const buildQueryString = (overrides: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (search) sp.set("search", search);
    if (district !== "ALL") sp.set("district", district);
    if (status !== "ALL") sp.set("status", status);
    if (isFeatured !== "ALL") sp.set("isFeatured", isFeatured);
    if (terrainType !== "ALL") sp.set("terrainType", terrainType);
    if (placeType !== "ALL") sp.set("placeType", placeType);
    if (sortBy !== "updatedAt") sp.set("sortBy", sortBy);
    if (sortOrder !== "desc") sp.set("sortOrder", sortOrder);
    for (const [k, v] of Object.entries(overrides)) {
      if (!v || v === "ALL" || v === "") sp.delete(k); else sp.set(k, v);
    }
    const s = sp.toString();
    return s ? `?${s}` : "/admin/trails";
  };

  const buildPageUrl = (p: number) => buildQueryString({ page: p > 1 ? String(p) : "" });

  const hasFilters = search || district !== "ALL" || status !== "ALL" || isFeatured !== "ALL" || terrainType !== "ALL" || placeType !== "ALL";

  return (
    <div style={{ "--admin-content-max-width": "1400px" } as React.CSSProperties}>
      <AdminPageHeader
        title="Trails"
        description={`${total} trail${total !== 1 ? "s" : ""}`}
        primaryAction={<AdminButton href="/admin/trails/new" variant="primary" size="sm">New Trail</AdminButton>}
      />

      <AdminContentToolbar>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <AdminSearchInput defaultValue={search} placeholder="Search name, slug, area..." />
        </div>
        <AdminFilterGroup
          name="district"
          label="District"
          defaultValue={district}
          options={[
            { value: "ALL", label: "All Districts" },
            { value: "CHITTAGONG", label: "Chittagong" },
            { value: "COX_BAZAR", label: "Cox's Bazar" },
            { value: "RANGAMATI", label: "Rangamati" },
            { value: "BANDARBAN", label: "Bandarban" },
            { value: "KHAGRACHARI", label: "Khagrachari" },
          ]}
        />
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
          name="terrainType"
          label="Terrain"
          defaultValue={terrainType}
          options={[
            { value: "ALL", label: "All Terrain" },
            { value: "COAST", label: "Coast" },
            { value: "HILLS", label: "Hills" },
            { value: "RIVER", label: "River" },
            { value: "CITY", label: "City" },
            { value: "RURAL", label: "Rural" },
          ]}
        />
        <AdminFilterGroup
          name="placeType"
          label="Place Type"
          defaultValue={placeType}
          options={[
            { value: "ALL", label: "All Places" },
            { value: "TOURIST_ATTRACTION", label: "Tourist Attraction" },
            { value: "PLACE", label: "Place" },
            { value: "NATURAL_FEATURE", label: "Natural Feature" },
            { value: "PARK", label: "Park" },
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
              { value: "name", label: "Name" },
              { value: "featuredOrder", label: "Featured Order" },
            ]}
          />
          <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">Apply</button>
          {hasFilters && (
            <Link href="/admin/trails" className="admin-btn admin-btn-secondary admin-btn-sm">Clear</Link>
          )}
        </div>
      </AdminContentToolbar>

      <div style={{ marginTop: "16px" }}>
        <AdminResultSummary total={total} page={page} totalPages={totalPages} label="trails" />
      </div>

      {trails.length === 0 ? (
        <AdminListEmptyState
          title={hasFilters ? "No trails match your filters" : "No trails yet"}
          description={hasFilters ? "Try adjusting your search or filters." : "Create your first trail to get started."}
          action={
            hasFilters ? (
              <Link href="/admin/trails" className="admin-btn admin-btn-secondary admin-btn-sm">Clear Filters</Link>
            ) : (
              <AdminButton href="/admin/trails/new" variant="primary" size="sm">Create First Trail</AdminButton>
            )
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: "var(--admin-radius-lg)", overflow: "hidden", boxShadow: "var(--admin-shadow)" }}>
            <table className="admin-content-table" aria-label="Trails">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "44px" }}><span className="sr-only">Cover</span></th>
                  <th scope="col">Name</th>
                  <th scope="col">Slug</th>
                  <th scope="col">District</th>
                  <th scope="col">Status</th>
                  <th scope="col">Featured</th>
                  <th scope="col">SEO</th>
                  <th scope="col">Updated</th>
                  <th scope="col" className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trails.map((trail) => {
                  const districtLabel = trail.district === "COX_BAZAR" ? "Cox's Bazar" : trail.district.charAt(0) + trail.district.slice(1).toLowerCase();
                  const seo = evaluateTrailSeoReadiness({
                    slug: trail.slug, metaTitle: trail.metaTitle, metaDescription: trail.metaDescription,
                    excerpt: trail.excerpt, coverMedia: trail.coverMedia, ogMedia: trail.ogMedia, status: trail.status,
                  });

                  return (
                    <tr key={trail.id}>
                      <td>
                        <AdminMediaThumbnail url={trail.coverMedia?.secureUrl ?? null} alt={trail.name} size={40} />
                      </td>
                      <td>
                        <Link href={`/admin/trails/${trail.id}/edit`} className="font-medium hover:underline" style={{ color: "var(--admin-text-primary)" }}>
                          {trail.name}
                        </Link>
                      </td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--admin-text-muted)" }}>/{trail.slug}</span>
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--admin-text-secondary)" }}>{districtLabel}</td>
                      <td>
                        <span className={`admin-content-status-badge admin-content-status-${trail.status.toLowerCase()}`}>
                          {trail.status}
                        </span>
                      </td>
                      <td>
                        {trail.isFeatured ? (
                          <span style={{ fontSize: "0.75rem", color: "#92400E", fontWeight: 500 }}>
                            Featured {trail.featuredOrder != null ? `#${trail.featuredOrder}` : ""}
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <AdminSeoStatus status={seo.status} missingFields={seo.missingFields} />
                      </td>
                      <td style={{ fontSize: "0.75rem", color: "var(--admin-text-secondary)" }}>
                        {trail.updatedAt.toLocaleDateString()}
                      </td>
                      <td>
                        <AdminRowActions actions={[
                          { label: "Edit", href: `/admin/trails/${trail.id}/edit` },
                          { label: "Preview", href: `/admin/trails/${trail.id}/preview` },
                          ...(trail.status === "PUBLISHED" ? [{ label: "View", href: `/trails/${trail.slug}` }] : []),
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
            {trails.map((trail) => {
              const districtLabel = trail.district === "COX_BAZAR" ? "Cox's Bazar" : trail.district.charAt(0) + trail.district.slice(1).toLowerCase();
              const seo = evaluateTrailSeoReadiness({
                slug: trail.slug, metaTitle: trail.metaTitle, metaDescription: trail.metaDescription,
                excerpt: trail.excerpt, coverMedia: trail.coverMedia, ogMedia: trail.ogMedia, status: trail.status,
              });

              return (
                <AdminMobileContentCard
                  key={trail.id}
                  title={trail.name}
                  slug={trail.slug}
                  status={trail.status}
                  coverUrl={trail.coverMedia?.secureUrl ?? null}
                  metaInfo={districtLabel}
                  updatedAt={trail.updatedAt}
                  seoStatus={<AdminSeoStatus status={seo.status} missingFields={seo.missingFields} />}
                  actions={[
                    { label: "Edit", href: `/admin/trails/${trail.id}/edit` },
                    { label: "Preview", href: `/admin/trails/${trail.id}/preview` },
                    ...(trail.status === "PUBLISHED" ? [{ label: "View", href: `/trails/${trail.slug}` }] : []),
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
