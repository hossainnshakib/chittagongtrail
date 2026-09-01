"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { JournalPost, TrailLocation } from "@prisma/client";
import DeleteButton from "@/components/admin/DeleteButton";
import MediaField from "@/components/admin/media/MediaField";
import type { MediaAssetData } from "@/components/admin/media/types";

type FormActionResult = {
  success: boolean;
  error?: string;
  errors?: Record<string, string>;
};

interface JournalFormProps {
  post?: JournalPost;
  trails: Pick<TrailLocation, "id" | "name">[];
  mode: "create" | "edit";
  contentType: "STORY" | "FOOD";
  createAction: (prevState: FormActionResult, formData: FormData) => Promise<FormActionResult>;
  updateAction: (id: number, prevState: FormActionResult, formData: FormData) => Promise<FormActionResult>;
  initialCover?: MediaAssetData | null;
  initialOg?: MediaAssetData | null;
}

const initialState: FormActionResult = { success: false };

export default function JournalForm({
  post,
  trails,
  mode,
  contentType,
  createAction,
  updateAction,
  initialCover,
  initialOg,
}: JournalFormProps) {
  const router = useRouter();
  const action =
    mode === "create"
      ? createAction.bind(null)
      : updateAction.bind(null, post!.id);

  const [state, formAction, isPending] = useActionState(action, initialState);

  const [coverAsset, setCoverAsset] = useState<MediaAssetData | null>(initialCover || null);
  const [useCoverForOg, setUseCoverForOg] = useState<boolean>(() => {
    if (initialOg && initialCover && initialOg.id === initialCover.id) return true;
    if (!initialOg) return true;
    return false;
  });
  const [ogAsset, setOgAsset] = useState<MediaAssetData | null>(() => {
    if (initialOg && initialCover && initialOg.id === initialCover.id) return null;
    return initialOg || null;
  });
  const [seoExpanded, setSeoExpanded] = useState(false);

  const isFood = contentType === "FOOD";
  const idPrefix = isFood ? "food-" : "";
  const cancelUrl = isFood ? "/admin/food" : "/admin/journal";
  const createLabel = isFood ? "Create Food Post" : "Create Story";
  const editLabel = "Save Changes";
  const creatingLabel = "Creating...";
  const contentPlaceholder = isFood
    ? "<p>Your food story content here...</p>"
    : "<p>Your content here...</p>";
  const mediaFolder = isFood ? "chittagong-trail/food" : "chittagong-trail/journal";

  function handleSlugGenerate() {
    const titleInput = document.getElementById(`${idPrefix}title`) as HTMLInputElement;
    if (titleInput?.value) {
      const slug = titleInput.value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      const slugInput = document.getElementById(`${idPrefix}slug`) as HTMLInputElement;
      if (slugInput) slugInput.value = slug;
    }
  }

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const effectiveOgId = useCoverForOg ? (coverAsset?.id ?? "") : (ogAsset?.id ?? "");

  return (
    <form action={formAction} className="space-y-0">
      <input type="hidden" name="coverMediaId" value={coverAsset?.id || ""} />
      <input type="hidden" name="ogMediaId" value={effectiveOgId} />

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">
          {state.error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Column */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label htmlFor={`${idPrefix}title`} className="block text-xs font-medium text-[#5D4037] mb-1">Title *</label>
                <input
                  type="text"
                  id={`${idPrefix}title`}
                  name="title"
                  defaultValue={post?.title}
                  required
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
                {state.errors?.title && <p className="text-red-600 text-xs mt-0.5">{state.errors.title}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`${idPrefix}slug`} className="block text-xs font-medium text-[#5D4037] mb-1">Slug *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    id={`${idPrefix}slug`}
                    name="slug"
                    defaultValue={post?.slug}
                    required
                    pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                    className="flex-1 px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleSlugGenerate}
                    className="px-2.5 py-1.5 text-xs bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded transition-colors cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
                {state.errors?.slug && <p className="text-red-600 text-xs mt-0.5">{state.errors.slug}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`${idPrefix}excerpt`} className="block text-xs font-medium text-[#5D4037] mb-1">Excerpt</label>
                <input
                  type="text"
                  id={`${idPrefix}excerpt`}
                  name="excerpt"
                  defaultValue={post?.excerpt ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor={`${idPrefix}content`} className="block text-xs font-medium text-[#5D4037] mb-1">Content * (HTML)</label>
                <textarea
                  id={`${idPrefix}content`}
                  name="content"
                  defaultValue={post?.content}
                  required
                  rows={12}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] font-mono focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  placeholder={contentPlaceholder}
                />
                {state.errors?.content && <p className="text-red-600 text-xs mt-0.5">{state.errors.content}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Publish</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor={`${idPrefix}status`} className="block text-xs font-medium text-[#5D4037] mb-1">Status</label>
                <select
                  id={`${idPrefix}status`}
                  name="status"
                  defaultValue={post?.status ?? "DRAFT"}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${idPrefix}publishedAt`} className="block text-xs font-medium text-[#5D4037] mb-1">Published Date</label>
                <input
                  type="date"
                  id={`${idPrefix}publishedAt`}
                  name="publishedAt"
                  defaultValue={formatDateForInput(post?.publishedAt ?? new Date())}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor={`${idPrefix}trailId`} className="block text-xs font-medium text-[#5D4037] mb-1">Related Trail</label>
                <select
                  id={`${idPrefix}trailId`}
                  name="trailId"
                  defaultValue={post?.trailId ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="">None</option>
                  {trails.map((trail) => (
                    <option key={trail.id} value={trail.id}>{trail.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${idPrefix}isFeatured`}
                  name="isFeatured"
                  defaultChecked={post?.isFeatured ?? false}
                  value="true"
                  className="w-3.5 h-3.5 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882]"
                />
                <label htmlFor={`${idPrefix}isFeatured`} className="text-xs text-[#5D4037]">
                  {isFood ? "Featured" : "Featured on section"}
                </label>
              </div>
              <div>
                <label htmlFor={`${idPrefix}featuredOrder`} className="block text-xs font-medium text-[#5D4037] mb-1">Featured Order</label>
                <input
                  type="number"
                  id={`${idPrefix}featuredOrder`}
                  name="featuredOrder"
                  defaultValue={post?.featuredOrder ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Cover Image</h3>
            <MediaField
              label="Cover"
              value={coverAsset}
              onChange={setCoverAsset}
              folder={mediaFolder}
              recommendedDimensions="1200×630"
            />
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-2 uppercase tracking-wide">Social Sharing</h3>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id={`${idPrefix}useCoverForOg`}
                checked={useCoverForOg}
                onChange={(e) => {
                  setUseCoverForOg(e.target.checked);
                  if (e.target.checked) setOgAsset(null);
                }}
                className="w-3.5 h-3.5 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882] cursor-pointer"
              />
              <label htmlFor={`${idPrefix}useCoverForOg`} className="text-xs text-[#5D4037] cursor-pointer">Use cover image</label>
            </div>
            {!useCoverForOg && (
              <MediaField
                label="OG Image"
                value={ogAsset}
                onChange={setOgAsset}
                folder={mediaFolder}
                recommendedDimensions="1200×630"
              />
            )}
            {useCoverForOg && coverAsset && (
              <div className="flex items-center gap-2 mt-1">
                <div className="relative w-10 h-6 rounded overflow-hidden border border-[#D7C9B8]">
                  <Image src={coverAsset.secureUrl} alt="" fill className="object-cover" sizes="40px" />
                </div>
                <span className="text-[10px] text-[#5D4037]/60">Will use cover</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="flex items-center justify-between w-full text-xs font-semibold text-[#5D4037] uppercase tracking-wide cursor-pointer"
            >
              <span>SEO</span>
              <svg className={`w-3 h-3 transition-transform ${seoExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {seoExpanded && (
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor={`${idPrefix}metaTitle`} className="block text-xs font-medium text-[#5D4037] mb-1">Meta Title</label>
                  <input
                    type="text"
                    id={`${idPrefix}metaTitle`}
                    name="metaTitle"
                    defaultValue={post?.metaTitle ?? ""}
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor={`${idPrefix}metaDescription`} className="block text-xs font-medium text-[#5D4037] mb-1">Meta Description</label>
                  <textarea
                    id={`${idPrefix}metaDescription`}
                    name="metaDescription"
                    defaultValue={post?.metaDescription ?? ""}
                    rows={2}
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E8DCC8]">
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-1.5 px-5 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending
              ? creatingLabel
              : mode === "create"
                ? createLabel
                : editLabel}
          </button>
          <button
            type="button"
            onClick={() => router.push(cancelUrl)}
            className="bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-1.5 px-5 rounded text-sm border border-[#D7C9B8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && post && (
          <DeleteButton
            id={post.id}
            name={post.title}
            scope={contentType === "FOOD" ? "food" : "story"}
          />
        )}
      </div>
    </form>
  );
}
