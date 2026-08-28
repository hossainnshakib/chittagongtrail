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

interface JournalFormProps {
  post?: JournalPost;
  trails: Pick<TrailLocation, "id" | "name">[];
  mode: "create" | "edit";
}

const initialState: JournalActionResult = { success: false };

export default function JournalForm({ post, trails, mode }: JournalFormProps) {
  const router = useRouter();
  const action =
    mode === "create"
      ? createJournalPost.bind(null)
      : updateJournalPost.bind(null, post!.id);

  const [state, formAction, isPending] = useActionState(action, initialState);

  function handleSlugGenerate() {
    const titleInput = document.getElementById("title") as HTMLInputElement;
    if (titleInput?.value) {
      const slug = titleInput.value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      const slugInput = document.getElementById("slug") as HTMLInputElement;
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
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
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Slug *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="slug"
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
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Category *
            </label>
            <select
              id="category"
              name="category"
              defaultValue={post?.category ?? "story"}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            >
              <option value="story">Journal</option>
              <option value="food">Food</option>
            </select>
            {state.errors?.category && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.category}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="publishedDate"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Published Date
            </label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              defaultValue={formatDateForInput(
                post?.publishedDate ?? new Date()
              )}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
            {state.errors?.publishedDate && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.publishedDate}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="trailId"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Related Trail
            </label>
            <select
              id="trailId"
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
            {state.errors?.trailId && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.trailId}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Excerpt
            </label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Content * (HTML supported)
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content}
              required
              rows={12}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
              placeholder="<p>Your content here...</p>"
            />
            {state.errors?.content && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.content}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-[#E8DCC8] p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#5D4037] mb-4">
          Media
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Cover Image URL
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              defaultValue={post?.coverImage ?? ""}
              placeholder="/uploads/journal/cover.jpg"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="coverImageAlt"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Cover Image Alt Text
            </label>
            <input
              type="text"
              id="coverImageAlt"
              name="coverImageAlt"
              defaultValue={post?.coverImageAlt ?? ""}
              placeholder="Descriptive alt text for the cover image"
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
            <label
              htmlFor="metaTitle"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              defaultValue={post?.metaTitle ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="metaDescription"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Meta Description
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={post?.metaDescription ?? ""}
              rows={2}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="ogImage"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              OG Image URL
            </label>
            <input
              type="text"
              id="ogImage"
              name="ogImage"
              defaultValue={post?.ogImage ?? ""}
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
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
                ? "Create Post"
                : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/journal")}
            className="bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-2 px-6 rounded-md border border-[#D7C9B8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && post && (
          <DeleteButton
            id={post.id}
            name={post.title}
            type="journal"
          />
        )}
      </div>
    </form>
  );
}
