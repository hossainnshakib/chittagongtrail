import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAdminJournalPosts, countJournalPostsByTypeAndStatus } from "@/lib/journal-service";
import { prisma } from "@/lib/prisma";
import { JournalType, ContentStatus } from "@prisma/client";

interface AdminJournalPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    status?: string;
    isFeatured?: string;
    trailId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function AdminJournalPage({ searchParams }: AdminJournalPageProps) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const type = (params.type as JournalType | "ALL") || "ALL";
  const status = (params.status as ContentStatus | "ALL") || "ALL";
  const isFeatured = params.isFeatured || "ALL";
  const trailIdParam = params.trailId || "ALL";
  const trailId = trailIdParam !== "ALL" ? parseInt(trailIdParam, 10) : "ALL";
  const sortBy = (params.sortBy as "updatedAt" | "createdAt" | "publishedAt" | "title") || "updatedAt";
  const sortOrder = (params.sortOrder as "asc" | "desc") || "desc";

  const [result, counts, trails] = await Promise.all([
    listAdminJournalPosts({
      page,
      pageSize: 20,
      search,
      type,
      status,
      isFeatured,
      trailId,
      sortBy,
      sortOrder,
    }),
    countJournalPostsByTypeAndStatus(),
    prisma.trailLocation.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const { posts, total, totalPages } = result;

  const buildQueryString = (newParams: Record<string, string | undefined>) => {
    const current = new URLSearchParams();
    if (search) current.set("search", search);
    if (type !== "ALL") current.set("type", type);
    if (status !== "ALL") current.set("status", status);
    if (isFeatured !== "ALL") current.set("isFeatured", isFeatured);
    if (trailId !== "ALL") current.set("trailId", String(trailId));
    if (sortBy !== "updatedAt") current.set("sortBy", sortBy);
    if (sortOrder !== "desc") current.set("sortOrder", sortOrder);
    if (page > 1) current.set("page", String(page));

    for (const [key, value] of Object.entries(newParams)) {
      if (value === undefined || value === "" || value === "ALL") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }
    const str = current.toString();
    return str ? `?${str}` : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-1">
            Journal & Food Management
          </h1>
          <p className="text-[#8D6E63] text-sm">
            Total Posts: {counts.total} ({counts.stories} Stories, {counts.food} Food) · Published: {counts.published} · Drafts: {counts.drafts}
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded-md transition-colors text-sm text-center shadow-sm"
        >
          + New Post
        </Link>
      </div>

      {/* Tabs / Filters */}
      <div className="bg-white rounded-lg border border-[#E8DCC8] p-4 shadow-sm space-y-4">
        {/* Type Tabs */}
        <div className="flex border-b border-[#E8DCC8] pb-3 gap-2">
          <Link
            href={`/admin/journal${buildQueryString({ type: "ALL", page: "1" })}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              type === "ALL"
                ? "bg-[#5D4037] text-white"
                : "bg-[#F5E6D3] text-[#5D4037] hover:bg-[#E8DCC8]"
            }`}
          >
            All ({counts.total})
          </Link>
          <Link
            href={`/admin/journal${buildQueryString({ type: "STORY", page: "1" })}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              type === "STORY"
                ? "bg-[#7FB5C4] text-white"
                : "bg-[#F5E6D3] text-[#5D4037] hover:bg-[#E8DCC8]"
            }`}
          >
            Stories ({counts.stories})
          </Link>
          <Link
            href={`/admin/journal${buildQueryString({ type: "FOOD", page: "1" })}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              type === "FOOD"
                ? "bg-[#D4956A] text-white"
                : "bg-[#F5E6D3] text-[#5D4037] hover:bg-[#E8DCC8]"
            }`}
          >
            Food ({counts.food})
          </Link>
        </div>

        {/* Search and Filters Form */}
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input type="hidden" name="type" value={type} />
          <div className="lg:col-span-2">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search title, slug, excerpt..."
              className="w-full px-3 py-2 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
          <div>
            <select
              name="status"
              defaultValue={status}
              className="w-full px-3 py-2 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <select
              name="trailId"
              defaultValue={String(trailId)}
              className="w-full px-3 py-2 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            >
              <option value="ALL">All Trails</option>
              {trails.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded-md text-sm transition-colors cursor-pointer"
            >
              Filter
            </button>
            {(search || status !== "ALL" || isFeatured !== "ALL" || trailId !== "ALL") && (
              <Link
                href={`/admin/journal${type !== "ALL" ? `?type=${type}` : ""}`}
                className="px-3 py-2 bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded-md text-sm transition-colors text-center"
              >
                Reset
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Posts Table / Cards */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E8DCC8] p-12 text-center shadow-sm">
          <p className="text-[#A1887F] mb-4">No journal or food posts found matching your criteria.</p>
          <Link
            href="/admin/journal/new"
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-6 rounded-md transition-colors inline-block text-sm"
          >
            Create New Post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#E8DCC8] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5E6D3] border-b border-[#E8DCC8] text-xs font-semibold text-[#5D4037] uppercase tracking-wider">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Related Trail</th>
                  <th className="px-4 py-3">Updated / Published</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCC8] text-sm">
                {posts.map((post) => {
                  const publicUrl = post.type === "FOOD" ? `/food/${post.slug}` : `/journal/${post.slug}`;
                  return (
                    <tr key={post.id} className="hover:bg-[#FDF5E6] transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/journal/${post.id}/edit`}
                          className="font-medium text-[#5D4037] hover:text-[#C9A882]"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-[#8D6E63] font-mono">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            post.type === JournalType.FOOD
                              ? "bg-[#D4956A] text-white"
                              : "bg-[#7FB5C4] text-white"
                          }`}
                        >
                          {post.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            post.status === ContentStatus.PUBLISHED
                              ? "bg-emerald-100 text-emerald-800"
                              : post.status === ContentStatus.ARCHIVED
                              ? "bg-amber-100 text-amber-800"
                              : "bg-[#E8DCC8] text-[#5D4037]"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {post.isFeatured ? (
                          <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-medium">
                            Featured {post.featuredOrder != null ? `#${post.featuredOrder}` : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-[#A1887F]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8D6E63]">
                        {post.trail ? (
                          <span title={`Trail status: ${post.trail.status}`}>
                            {post.trail.name}
                            {post.trail.status !== ContentStatus.PUBLISHED && (
                              <span className="ml-1 text-amber-600 font-bold">({post.trail.status})</span>
                            )}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8D6E63]">
                        <div>Updated: {post.updatedAt.toLocaleDateString()}</div>
                        <div>Published: {post.publishedAt ? post.publishedAt.toLocaleDateString() : "—"}</div>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/admin/journal/${post.id}/preview`}
                          className="text-xs bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] px-2.5 py-1 rounded transition-colors inline-block"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/admin/journal/${post.id}/edit`}
                          className="text-xs bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] px-2.5 py-1 rounded transition-colors inline-block font-medium"
                        >
                          Edit
                        </Link>
                        {post.status === ContentStatus.PUBLISHED && (
                          <Link
                            href={publicUrl}
                            target="_blank"
                            className="text-xs bg-[#7FB5C4] hover:bg-[#689fb0] text-white px-2.5 py-1 rounded transition-colors inline-block"
                          >
                            View Live
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-[#F5E6D3] px-4 py-3 border-t border-[#E8DCC8] flex items-center justify-between text-sm text-[#5D4037]">
              <div>
                Showing page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span> ({total} total posts)
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`/admin/journal${buildQueryString({ page: String(page - 1) })}`}
                    className="px-3 py-1 bg-white hover:bg-[#E8DCC8] border border-[#D7C9B8] rounded transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/admin/journal${buildQueryString({ page: String(page + 1) })}`}
                    className="px-3 py-1 bg-white hover:bg-[#E8DCC8] border border-[#D7C9B8] rounded transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
