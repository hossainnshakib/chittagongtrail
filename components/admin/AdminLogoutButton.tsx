"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/app/admin/(auth)/login/actions";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm hover:text-[#C9A882] transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
}
