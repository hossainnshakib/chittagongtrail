import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import MasterLoginPage from "./MasterLoginForm";

export const metadata: Metadata = {
  title: "Admin Login — Chittagong Trail",
  robots: { index: false, follow: false },
};

export default async function MasterPage() {
  const session = await getSession();
  if (session?.authenticated) {
    redirect("/admin");
  }

  return <MasterLoginPage />;
}
