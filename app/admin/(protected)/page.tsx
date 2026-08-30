import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JournalType } from "@prisma/client";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";
import AdminButton from "@/components/admin/ui/AdminButton";

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
      color: "var(--admin-type-trail)",
    },
    {
      label: "Journal Posts",
      value: totalJournal,
      href: "/admin/journal",
      color: "var(--admin-type-story)",
    },
    {
      label: "Food Posts",
      value: totalFood,
      href: "/admin/journal",
      color: "var(--admin-type-food)",
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Welcome back. Here's your content overview."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block rounded-lg border p-6 transition-shadow admin-focus-ring"
            style={{
              backgroundColor: "var(--admin-surface)",
              borderColor: "var(--admin-border)",
              boxShadow: "var(--admin-shadow)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: stat.color }}
              >
                {stat.value}
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminSectionCard
          title="Recent Trails"
          noPadding
        >
          <div className="px-6 pb-4 flex justify-end">
            <AdminButton href="/admin/trails/new" variant="primary" size="sm">
              + New Trail
            </AdminButton>
          </div>
          {recentTrails.length === 0 ? (
            <p
              className="text-sm py-8 text-center"
              style={{ color: "var(--admin-text-muted)" }}
            >
              No trails yet. Create your first trail.
            </p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {recentTrails.map((trail) => (
                <li key={trail.id}>
                  <Link
                    href={`/admin/trails/${trail.id}/edit`}
                    className="flex items-center justify-between px-6 py-3 transition-colors admin-focus-ring"
                    style={{ color: "var(--admin-text-primary)" }}
                  >
                    <div>
                      <p className="font-medium text-sm">{trail.name}</p>
                      <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                        /{trail.slug}
                      </p>
                    </div>
                    <span className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      {trail.updatedAt.toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title="Recent Journal Posts"
          noPadding
        >
          <div className="px-6 pb-4 flex justify-end">
            <AdminButton href="/admin/journal/new" variant="primary" size="sm">
              + New Post
            </AdminButton>
          </div>
          {recentJournal.length === 0 ? (
            <p
              className="text-sm py-8 text-center"
              style={{ color: "var(--admin-text-muted)" }}
            >
              No journal posts yet. Create your first post.
            </p>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {recentJournal.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/admin/journal/${post.id}/edit`}
                    className="flex items-center justify-between px-6 py-3 transition-colors admin-focus-ring"
                    style={{ color: "var(--admin-text-primary)" }}
                  >
                    <div>
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                        {post.type === JournalType.FOOD ? "Food" : "Journal"} · /
                        {post.slug}
                      </p>
                    </div>
                    <span className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      {post.updatedAt.toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminSectionCard>
      </div>
    </div>
  );
}
