import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#FDF5E6]">
      <nav className="bg-[#3E2723] text-[#FDF5E6] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="font-[family-name:var(--font-playfair)] text-lg font-semibold hover:text-[#C9A882] transition-colors"
            >
              CT Admin
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/admin/trails"
                className="text-sm hover:text-[#C9A882] transition-colors"
              >
                Trails
              </Link>
              <Link
                href="/admin/journal"
                className="text-sm hover:text-[#C9A882] transition-colors"
              >
                Journal
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm hover:text-[#C9A882] transition-colors"
            >
              View Site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
