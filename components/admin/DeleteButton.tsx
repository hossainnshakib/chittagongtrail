"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  id: number;
  name: string;
  scope: "trail" | "story" | "food";
}

export default function DeleteButton({
  id,
  name,
  scope,
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, scope }),
      });

      const result = await response.json();

      if (result.success) {
        if (scope === "trail") {
          router.push("/admin/trails");
        } else if (scope === "food") {
          router.push("/admin/food");
        } else {
          router.push("/admin/journal");
        }
        router.refresh();
      } else {
        setError(result.error || "Delete failed");
        setIsDeleting(false);
      }
    } catch {
      setError("An unexpected error occurred");
      setIsDeleting(false);
    }
  }

  if (!showConfirm) {
    return (
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#5D4037]">
        Delete &ldquo;{name}&rdquo;?
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isDeleting ? "Deleting..." : "Confirm Delete"}
      </button>
      <button
        type="button"
        onClick={() => {
          setShowConfirm(false);
          setError(null);
        }}
        disabled={isDeleting}
        className="text-sm text-[#8D6E63] hover:text-[#5D4037] cursor-pointer"
      >
        Cancel
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}
