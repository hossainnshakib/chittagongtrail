import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminTrailsPage() {
  const trails = await prisma.trailLocation.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { journalPosts: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
            Trails
          </h1>
          <p className="text-[#8D6E63] text-sm">
            {trails.length} trail{trails.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/trails/new"
          className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          + New Trail
        </Link>
      </div>

      {trails.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E8DCC8] p-12 text-center">
          <p className="text-[#A1887F] mb-4">No trails yet.</p>
          <Link
            href="/admin/trails/new"
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-6 rounded-md transition-colors inline-block"
          >
            Create Your First Trail
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
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Slug
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-[#5D4037]">
                    Journal
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
                {trails.map((trail) => (
                  <tr key={trail.id} className="hover:bg-[#FDF5E6]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/trails/${trail.id}/edit`}
                        className="font-medium text-[#5D4037] hover:text-[#C9A882]"
                      >
                        {trail.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8D6E63]">
                      /{trail.slug}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8D6E63]">
                      {trail._count.journalPosts}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8D6E63]">
                      {trail.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/trails/${trail.id}/edit`}
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
            {trails.map((trail) => (
              <Link
                key={trail.id}
                href={`/admin/trails/${trail.id}/edit`}
                className="block bg-white rounded-lg border border-[#E8DCC8] p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#5D4037]">{trail.name}</p>
                    <p className="text-xs text-[#A1887F]">/{trail.slug}</p>
                  </div>
                  <span className="text-xs text-[#A1887F]">
                    {trail._count.journalPosts} posts
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
