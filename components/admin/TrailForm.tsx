"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { TrailLocation } from "@prisma/client";
import {
  createTrail,
  updateTrail,
  type TrailActionResult,
} from "@/app/admin/trails/actions";
import DeleteButton from "@/components/admin/DeleteButton";

interface TrailFormProps {
  trail?: TrailLocation;
  mode: "create" | "edit";
}

const initialState: TrailActionResult = { success: false };

export default function TrailForm({ trail, mode }: TrailFormProps) {
  const router = useRouter();
  const action =
    mode === "create"
      ? createTrail.bind(null)
      : updateTrail.bind(null, trail!.id);

  const [state, formAction, isPending] = useActionState(action, initialState);

  function handleSlugGenerate() {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    if (nameInput?.value) {
      const slug = nameInput.value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      const slugInput = document.getElementById("slug") as HTMLInputElement;
      if (slugInput) slugInput.value = slug;
    }
  }

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
              htmlFor="name"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={trail?.name}
              required
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
            {state.errors?.name && (
              <p className="text-red-600 text-xs mt-1">{state.errors.name}</p>
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
                defaultValue={trail?.slug}
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
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={trail?.description}
              required
              rows={4}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
            {state.errors?.description && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-[#E8DCC8] p-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#5D4037] mb-4">
          Location
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="any"
              min="-90"
              max="90"
              defaultValue={trail?.latitude ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
            {state.errors?.latitude && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.latitude}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="any"
              min="-180"
              max="180"
              defaultValue={trail?.longitude ?? ""}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
            {state.errors?.longitude && (
              <p className="text-red-600 text-xs mt-1">
                {state.errors.longitude}
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
              htmlFor="photos"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Photo URLs (comma-separated)
            </label>
            <input
              type="text"
              id="photos"
              name="photos"
              defaultValue={trail?.photos ?? ""}
              placeholder="/uploads/trails/photo1.jpg, /uploads/trails/photo2.jpg"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="photoAlt"
              className="block text-sm font-medium text-[#5D4037] mb-1"
            >
              Photo Alt Text
            </label>
            <input
              type="text"
              id="photoAlt"
              name="photoAlt"
              defaultValue={trail?.photoAlt ?? ""}
              placeholder="Descriptive alt text for the trail photos"
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
              defaultValue={trail?.metaTitle ?? ""}
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
              defaultValue={trail?.metaDescription ?? ""}
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
              defaultValue={trail?.ogImage ?? ""}
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
                ? "Create Trail"
                : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/trails")}
            className="bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-2 px-6 rounded-md border border-[#D7C9B8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && trail && (
          <DeleteButton
            id={trail.id}
            name={trail.name}
            type="trail"
          />
        )}
      </div>
    </form>
  );
}
