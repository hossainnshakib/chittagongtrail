import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminJournalPage() {
  const posts = await prisma.journalPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      trail: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
            Journal
          </h1>
          <p className="text-[#8D6E63] text-sm">
            {posts.length} post{posts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E8DCC8] p-12 text-center">
          <p className="text-[#A1887F] mb-4">No journal posts yet.</p>
          <Link
            href="/admin/journal/new"
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-6 rounded-md transition-colors inline-block"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg border border-[#E8DCC8] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5E6D3] border-b border-[#E8DCC8]">
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Trail
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Published
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Updated
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCC8]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#FDF5E6]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/journal/${post.id}/edit`}
                        className="font-medium text-[#5D4037] hover:text-[#C9A882]"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          post.category === "food"
                            ? "bg-[#D4956A] text-white"
                            : "bg-[#7FB5C4] text-white"
                        }`}
                      >
                        {post.category === "food" ? "Food" : "Journal"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8D6E63]">
                      {post.trail?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8D6E63]">
                      {post.publishedDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8D6E63]">
                      {post.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/journal/${post.id}/edit`}
                        className="text-sm text-[#5D4037] hover:text-[#C9A882]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/journal/${post.id}/edit`}
                className="block bg-white rounded-lg border border-[#E8DCC8] p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[#5D4037]">{post.title}</p>
                    <p className="text-xs text-[#A1887F]">
                      {post.category === "food" ? "Food" : "Journal"} ·{" "}
                      {post.publishedDate.toLocaleDateString()}
                    </p>
                    {post.trail && (
                      <p className="text-xs text-[#A1887F]">
                        Trail: {post.trail.name}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.category === "food"
                        ? "bg-[#D4956A] text-white"
                        : "bg-[#7FB5C4] text-white"
                    }`}
                  >
                    {post.category === "food" ? "Food" : "Journal"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
