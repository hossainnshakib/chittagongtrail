"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await login({ success: false }, formData);
      if (result.success) {
        router.push("/admin");
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      router.push("/admin");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#3E2723] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#FDF5E6] mb-2">
            Chittagong Trail
          </h1>
          <p className="text-[#C9A882] text-sm">Admin Dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#FDF5E6] rounded-lg p-8 shadow-lg"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#5D4037] mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
              placeholder="admin@chittagongtrail.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
