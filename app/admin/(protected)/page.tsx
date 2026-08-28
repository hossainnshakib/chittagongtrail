import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JournalType } from "@prisma/client";

export default async function AdminDashboard() {
  const [totalTrails, totalJournal, totalFood, recentTrails, recentJournal] =
    await Promise.all([
      prisma.trailLocation.count(),
      prisma.journalPost.count(),
      prisma.journalPost.count({ where: { type: JournalType.FOOD } }),
      prisma.trailLocation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.journalPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        updatedAt: true,
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Trails",
      value: totalTrails,
      href: "/admin/trails",
      color: "bg-[#7FB5C4]",
    },
    {
      label: "Journal Posts",
      value: totalJournal,
      href: "/admin/journal",
      color: "bg-[#C9A882]",
    },
    {
      label: "Food Posts",
      value: totalFood,
      href: "/admin/journal",
      color: "bg-[#D4956A]",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#5D4037] mb-2">
          Dashboard
        </h1>
        <p className="text-[#8D6E63]">
          Welcome back. Here&apos;s your content overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block bg-white rounded-lg border border-[#E8DCC8] p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl font-bold`}
              >
                {stat.value}
              </div>
              <div>
                <p className="text-sm text-[#8D6E63]">{stat.label}</p>
                <p className="text-2xl font-semibold text-[#5D4037]">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-[#E8DCC8] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#5D4037]">
              Recent Trails
            </h2>
            <Link
              href="/admin/trails/new"
              className="text-sm bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] px-3 py-1 rounded-md transition-colors"
            >
              + New Trail
            </Link>
          </div>
          {recentTrails.length === 0 ? (
            <p className="text-[#A1887F] text-sm py-4 text-center">
              No trails yet. Create your first trail.
            </p>
          ) : (
            <ul className="divide-y divide-[#E8DCC8]">
              {recentTrails.map((trail) => (
                <li key={trail.id} className="py-3">
                  <Link
                    href={`/admin/trails/${trail.id}/edit`}
                    className="flex items-center justify-between hover:text-[#C9A882] transition-colors"
                  >
                    <div>
                      <p className="font-medium text-[#5D4037]">{trail.name}</p>
                      <p className="text-xs text-[#A1887F]">/{trail.slug}</p>
                    </div>
                    <span className="text-xs text-[#A1887F]">
                      {trail.updatedAt.toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg border border-[#E8DCC8] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#5D4037]">
              Recent Journal Posts
            </h2>
            <Link
              href="/admin/journal/new"
              className="text-sm bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] px-3 py-1 rounded-md transition-colors"
            >
              + New Post
            </Link>
          </div>
          {recentJournal.length === 0 ? (
            <p className="text-[#A1887F] text-sm py-4 text-center">
              No journal posts yet. Create your first post.
            </p>
          ) : (
            <ul className="divide-y divide-[#E8DCC8]">
              {recentJournal.map((post) => (
                <li key={post.id} className="py-3">
                  <Link
                    href={`/admin/journal/${post.id}/edit`}
                    className="flex items-center justify-between hover:text-[#C9A882] transition-colors"
                  >
                    <div>
                      <p className="font-medium text-[#5D4037]">{post.title}</p>
                      <p className="text-xs text-[#A1887F]">
                        {post.type === JournalType.FOOD ? "Food" : "Journal"} · /
                        {post.slug}
                      </p>
                    </div>
                    <span className="text-xs text-[#A1887F]">
                      {post.updatedAt.toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
