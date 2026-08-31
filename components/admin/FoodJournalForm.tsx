"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { JournalPost, TrailLocation } from "@prisma/client";
import {
  createJournalPost,
  updateJournalPost,
  type JournalActionResult,
} from "@/app/admin/(protected)/journal/actions";
import DeleteButton from "@/components/admin/DeleteButton";

interface FoodJournalFormProps {
  post?: JournalPost;
  trails: Pick<TrailLocation, "id" | "name">[];
  mode: "create" | "edit";
}

const initialState: JournalActionResult = { success: false };

export default function FoodJournalForm({ post, trails, mode }: FoodJournalFormProps) {
  const router = useRouter();
  const action =
    mode === "create"
      ? createJournalPost.bind(null)
      : updateJournalPost.bind(null, post!.id);

  const [state, formAction, isPending] = useActionState(action, initialState);

  function handleSlugGenerate() {
    const titleInput = document.getElementById("food-title") as HTMLInputElement;
    if (titleInput?.value) {
      const slug = titleInput.value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      const slugInput = document.getElementById("food-slug") as HTMLInputElement;
      if (slugInput) slugInput.value = slug;
    }
  }

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="type" value="FOOD" />

      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <section className="bg-white rounded-lg border border-[#E8DCC8] p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#5D4037] mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="food-title" className="block text-sm font-medium text-[#5D4037] mb-1">
              Title *
            </label>
            <input
              type="text"
              id="food-title"
              name="title"
              defaultValue={post?.title}
              required
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
            {state.errors?.title && (
              <p className="text-red-600 text-xs mt-1">{state.errors.title}</p>
            )}
          </div>
          <div>
            <label htmlFor="food-slug" className="block text-sm font-medium text-[#5D4037] mb-1">
              Slug *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="food-slug"
                name="slug"
                defaultValue={post?.slug}
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                className="flex-1 px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleSlugGenerate}
                className="px-3 py-2 text-sm bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded-md transition-colors cursor-pointer"
              >
                Generate
              </button>
            </div>
            {state.errors?.slug && (
              <p className="text-red-600 text-xs mt-1">{state.errors.slug}</p>
            )}
          </div>
          <div>
            <label htmlFor="food-status" className="block text-sm font-medium text-[#5D4037] mb-1">
              Status *
            </label>
            <select
              id="food-status"
              name="status"
              defaultValue={post?.status ?? "DRAFT"}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label htmlFor="food-publishedAt" className="block text-sm font-medium text-[#5D4037] mb-1">
              Published Date
            </label>
            <input
              type="date"
              id="food-publishedAt"
              name="publishedAt"
              defaultValue={formatDateForInput(post?.publishedAt ?? new Date())}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="food-trailId" className="block text-sm font-medium text-[#5D4037] mb-1">
              Related Trail
            </label>
            <select
              id="food-trailId"
              name="trailId"
              defaultValue={post?.trailId ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            >
              <option value="">None</option>
              {trails.map((trail) => (
                <option key={trail.id} value={trail.id}>
                  {trail.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="food-excerpt" className="block text-sm font-medium text-[#5D4037] mb-1">
              Excerpt
            </label>
            <input
              type="text"
              id="food-excerpt"
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="food-content" className="block text-sm font-medium text-[#5D4037] mb-1">
              Content * (HTML supported)
            </label>
            <textarea
              id="food-content"
              name="content"
              defaultValue={post?.content}
              required
              rows={12}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
              placeholder="<p>Your food story content here...</p>"
            />
            {state.errors?.content && (
              <p className="text-red-600 text-xs mt-1">{state.errors.content}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-[#E8DCC8] p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#5D4037] mb-4">
          Media & Curation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="food-coverMediaId" className="block text-sm font-medium text-[#5D4037] mb-1">
              Cover Media ID
            </label>
            <input
              type="number"
              id="food-coverMediaId"
              name="coverMediaId"
              defaultValue={post?.coverMediaId ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="food-ogMediaId" className="block text-sm font-medium text-[#5D4037] mb-1">
              OG Media ID
            </label>
            <input
              type="number"
              id="food-ogMediaId"
              name="ogMediaId"
              defaultValue={post?.ogMediaId ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="food-isFeatured"
              name="isFeatured"
              defaultChecked={post?.isFeatured ?? false}
              value="true"
              className="w-4 h-4 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882]"
            />
            <label htmlFor="food-isFeatured" className="text-sm font-medium text-[#5D4037]">
              Feature on Homepage
            </label>
          </div>
          <div>
            <label htmlFor="food-featuredOrder" className="block text-sm font-medium text-[#5D4037] mb-1">
              Featured Order
            </label>
            <input
              type="number"
              id="food-featuredOrder"
              name="featuredOrder"
              defaultValue={post?.featuredOrder ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-[#E8DCC8] p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#5D4037] mb-4">
          SEO
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="food-metaTitle" className="block text-sm font-medium text-[#5D4037] mb-1">
              Meta Title
            </label>
            <input
              type="text"
              id="food-metaTitle"
              name="metaTitle"
              defaultValue={post?.metaTitle ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="food-metaDescription" className="block text-sm font-medium text-[#5D4037] mb-1">
              Meta Description
            </label>
            <textarea
              id="food-metaDescription"
              name="metaDescription"
              defaultValue={post?.metaDescription ?? ""}
              rows={2}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending
              ? mode === "create" ? "Creating..." : "Saving..."
              : mode === "create" ? "Create Food Post" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/food")}
            className="bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-2 px-6 rounded-md border border-[#D7C9B8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && post && (
          <DeleteButton id={post.id} name={post.title} type="journal" />
        )}
      </div>
    </form>
  );
}
