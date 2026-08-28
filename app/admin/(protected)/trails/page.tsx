import Link from "next/link";
import { listAdminTrails } from "@/lib/trail-service";
import { District, ContentStatus } from "@prisma/client";

interface AdminTrailsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    district?: string;
    status?: string;
    isFeatured?: string;
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
  const sortBy = (params.sortBy as "updatedAt" | "createdAt" | "publishedAt" | "name") || "updatedAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  const { trails, total, totalPages } = await listAdminTrails({
    page,
    pageSize: 20,
    search,
    district,
    status,
    isFeatured,
    sortBy,
    sortOrder,
  });

  const districtsList = [
    { value: "ALL", label: "All Districts" },
    { value: "CHITTAGONG", label: "Chittagong" },
    { value: "COX_BAZAR", label: "Cox's Bazar" },
    { value: "RANGAMATI", label: "Rangamati" },
    { value: "BANDARBAN", label: "Bandarban" },
    { value: "KHAGRACHARI", label: "Khagrachari" },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-1">
            Trails Management
          </h1>
          <p className="text-[#8D6E63] text-sm">
            {total} total trail{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <Link
          href="/admin/trails/new"
          className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded-md transition-colors text-sm text-center"
        >
          + New Trail
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <form method="GET" className="bg-white rounded-lg border border-[#E8DCC8] p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#5D4037] mb-1">Search Name / Slug</label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search trails..."
              className="w-full px-3 py-1.5 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5D4037] mb-1">District</label>
            <select
              name="district"
              defaultValue={district}
              className="w-full px-3 py-1.5 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]"
            >
              {districtsList.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5D4037] mb-1">Status</label>
            <select
              name="status"
              defaultValue={status}
              className="w-full px-3 py-1.5 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5D4037] mb-1">Featured</label>
            <select
              name="isFeatured"
              defaultValue={isFeatured}
              className="w-full px-3 py-1.5 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]"
            >
              <option value="ALL">All Featured States</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-[#F5E6D3]">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-[#5D4037]">Sort By:</label>
            <select
              name="sortBy"
              defaultValue={sortBy}
              className="px-2 py-1 text-xs border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]"
            >
              <option value="updatedAt">Updated Date</option>
              <option value="createdAt">Created Date</option>
              <option value="publishedAt">Published Date</option>
              <option value="name">Name</option>
            </select>
            <select
              name="sortOrder"
              defaultValue={sortOrder}
              className="px-2 py-1 text-xs border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#5D4037] hover:bg-[#3E2723] text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors"
            >
              Filter & Sort
            </button>
            <Link
              href="/admin/trails"
              className="bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] text-xs font-medium px-4 py-1.5 rounded-md transition-colors"
            >
              Reset
            </Link>
          </div>
        </div>
      </form>

      {trails.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E8DCC8] p-12 text-center">
          <p className="text-[#A1887F] mb-4">No trails found matching your criteria.</p>
          <Link
            href="/admin/trails"
            className="text-sm text-[#C9A882] hover:underline font-medium"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-lg border border-[#E8DCC8] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5E6D3] border-b border-[#E8DCC8]">
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider">Name / Slug</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider">District</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider">Featured</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider">Journal</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider">Updated</th>
                  <th className="px-4 py-3 text-xs font-medium text-[#5D4037] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCC8]">
                {trails.map((trail) => {
                  const districtLabel =
                    trail.district === "COX_BAZAR"
                      ? "Cox’s Bazar"
                      : trail.district.charAt(0) + trail.district.slice(1).toLowerCase();

                  const statusBadgeClass =
                    trail.status === "PUBLISHED"
                      ? "bg-emerald-100 text-emerald-800"
                      : trail.status === "ARCHIVED"
                      ? "bg-stone-200 text-stone-700"
                      : "bg-amber-100 text-amber-800";

                  return (
                    <tr key={trail.id} className="hover:bg-[#FDF5E6] transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/trails/${trail.id}/edit`}
                          className="font-medium text-[#5D4037] hover:text-[#C9A882] block"
                        >
                          {trail.name}
                        </Link>
                        <span className="text-xs font-mono text-[#8D6E63]">/{trail.slug}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8D6E63]">{districtLabel}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadgeClass}`}>
                          {trail.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {trail.isFeatured ? (
                          <span className="text-amber-700 font-medium">★ Featured ({trail.featuredOrder ?? 0})</span>
                        ) : (
                          <span className="text-[#A1887F]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8D6E63]">{trail._count.journalPosts}</td>
                      <td className="px-4 py-3 text-xs text-[#8D6E63]">{trail.updatedAt.toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <Link
                          href={`/admin/trails/${trail.id}/edit`}
                          className="text-xs font-medium text-[#5D4037] hover:text-[#C9A882]"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/trails/${trail.id}/preview`}
                          target="_blank"
                          className="text-xs font-medium text-[#7FB5C4] hover:underline"
                        >
                          Preview
                        </Link>
                        {trail.status === "PUBLISHED" && (
                          <Link
                            href={`/trails/${trail.slug}`}
                            target="_blank"
                            className="text-xs font-medium text-emerald-700 hover:underline"
                          >
                            View Public
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {trails.map((trail) => {
              const districtLabel =
                trail.district === "COX_BAZAR"
                  ? "Cox’s Bazar"
                  : trail.district.charAt(0) + trail.district.slice(1).toLowerCase();

              const statusBadgeClass =
                trail.status === "PUBLISHED"
                  ? "bg-emerald-100 text-emerald-800"
                  : trail.status === "ARCHIVED"
                  ? "bg-stone-200 text-stone-700"
                  : "bg-amber-100 text-amber-800";

              return (
                <div key={trail.id} className="bg-white rounded-lg border border-[#E8DCC8] p-4 shadow-sm space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/admin/trails/${trail.id}/edit`} className="font-medium text-[#5D4037] text-base block">
                        {trail.name}
                      </Link>
                      <p className="text-xs font-mono text-[#8D6E63]">/{trail.slug}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadgeClass}`}>
                      {trail.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#8D6E63] pt-2 border-t border-[#F5E6D3]">
                    <span>{districtLabel}</span>
                    <span>{trail._count.journalPosts} journal posts</span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                      href={`/admin/trails/${trail.id}/edit`}
                      className="text-xs font-medium text-[#5D4037] hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/trails/${trail.id}/preview`}
                      target="_blank"
                      className="text-xs font-medium text-[#7FB5C4] hover:underline"
                    >
                      Preview
                    </Link>
                    {trail.status === "PUBLISHED" && (
                      <Link
                        href={`/trails/${trail.slug}`}
                        target="_blank"
                        className="text-xs font-medium text-emerald-700 hover:underline"
                      >
                        Public
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-lg border border-[#E8DCC8]">
              <p className="text-xs text-[#8D6E63]">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link
                    href={`/admin/trails?page=${page - 1}&search=${encodeURIComponent(search)}&district=${district}&status=${status}&isFeatured=${isFeatured}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
                    className="px-3 py-1 text-xs font-medium bg-[#E8DCC8] text-[#5D4037] rounded hover:bg-[#D7C9B8]"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="px-3 py-1 text-xs font-medium bg-stone-100 text-stone-400 rounded cursor-not-allowed">
                    Previous
                  </span>
                )}

                {page < totalPages ? (
                  <Link
                    href={`/admin/trails?page=${page + 1}&search=${encodeURIComponent(search)}&district=${district}&status=${status}&isFeatured=${isFeatured}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
                    className="px-3 py-1 text-xs font-medium bg-[#E8DCC8] text-[#5D4037] rounded hover:bg-[#D7C9B8]"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="px-3 py-1 text-xs font-medium bg-stone-100 text-stone-400 rounded cursor-not-allowed">
                    Next
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
