"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  createJournalPost,
  updateJournalPost,
  type JournalActionResult,
} from "@/app/admin/(protected)/journal/actions";
import {
  createFoodPost,
  updateFoodPost,
} from "@/app/admin/(protected)/food/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import GalleryManager from "@/components/admin/media/GalleryManager";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import CoverImageModule from "@/components/admin/CoverImageModule";
import OnPageSeoWorkspace from "@/components/admin/OnPageSeoWorkspace";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import type { MediaAssetData } from "@/components/admin/media/types";

interface JournalFormProps {
  post?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    status: string;
    coverMediaId: number | null;
    ogMediaId: number | null;
    metaTitle: string | null;
    metaDescription: string | null;
    publishedAt: string | Date | null;
    createdAt: string | Date;
    trailId: number | null;
    [key: string]: unknown;
  };
  trails: { id: number; name: string }[];
  mode: "create" | "edit";
  contentType: "STORY" | "FOOD";
  initialCover?: MediaAssetData | null;
  initialOg?: MediaAssetData | null;
  initialGallery?: MediaAssetData[];
  returnTo?: string;
}

const initialState: JournalActionResult = { success: false };

export default function JournalForm({
  post,
  trails,
  mode,
  contentType,
  initialCover,
  initialOg,
  initialGallery,
  returnTo,
}: JournalFormProps) {
  const router = useRouter();

  const action = useMemo(() => {
    if (mode === "create") {
      return contentType === "FOOD" ? createFoodPost : createJournalPost;
    }
    if (contentType === "FOOD") {
      return (prev: JournalActionResult, fd: FormData) => updateFoodPost(post!.id, prev, fd);
    }
    return (prev: JournalActionResult, fd: FormData) => updateJournalPost(post!.id, prev, fd);
  }, [mode, contentType, post]);

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
  const [galleryAssets, setGalleryAssets] = useState<MediaAssetData[]>(initialGallery || []);
  const [status, setStatus] = useState<string>(post?.status ?? "DRAFT");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [trailId, setTrailId] = useState<number | null>(post?.trailId ?? null);
  const [isDirty, setIsDirty] = useState(false);
  const saveFailed = !state.success && Boolean(state.error || state.errors);

  useUnsavedChangesWarning(isDirty || saveFailed);

  const handleSlugGenerate = () => {
    if (title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(newSlug);
    }
  };

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const effectiveOgId = useCoverForOg ? (coverAsset?.id ?? "") : (ogAsset?.id ?? "");
  const seoContentType = contentType === "FOOD" ? "food" as const : "story" as const;

  return (
    <form
      action={formAction}
      className="space-y-0"
      onChange={() => setIsDirty(true)}
      onSubmit={() => setIsDirty(false)}
    >
      <input type="hidden" name="returnTo" value={returnTo || ""} />
      <input type="hidden" name="currentStatus" value={post?.status ?? "DRAFT"} />
      <input type="hidden" name="coverMediaId" value={coverAsset?.id || ""} />
      <input type="hidden" name="ogMediaId" value={effectiveOgId} />
      <input type="hidden" name="galleryIds" value={galleryAssets.map((a) => a.id).join(",")} />

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">
          {state.error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Column */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-xs font-medium text-[#5D4037] mb-1">Title <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                  {state.errors?.title && <p className="text-red-600 text-xs mt-0.5">{state.errors.title}</p>}
                </div>
                <div>
                  <label htmlFor="slug" className="block text-xs font-medium text-[#5D4037] mb-1">Slug <span className="text-red-600">*</span></label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
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
                <div>
                  <label htmlFor="trailId" className="block text-xs font-medium text-[#5D4037] mb-1">Associated Trail</label>
                  <select
                    id="trailId"
                    name="trailId"
                    value={trailId || ""}
                    onChange={(e) => setTrailId(e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  >
                    <option value="">No trail association</option>
                    {trails.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="excerpt" className="block text-xs font-medium text-[#5D4037] mb-1">Excerpt</label>
                  <input
                    type="text"
                    id="excerpt"
                    name="excerpt"
                    defaultValue={post?.excerpt ?? ""}
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                </div>
              </div>
              <AdminRichTextEditor
                initialContent={post?.content ?? ""}
                name="content"
                label="Content"
                placeholder={contentType === "FOOD" ? "Describe the food, experience, and local context..." : "Write your story..."}
                required
              />
              {state.errors?.content && <p className="text-red-600 text-xs mt-0.5">{state.errors.content}</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#5D4037] uppercase tracking-wide">Gallery</h3>
              <span className="text-[11px] text-[#8D6E63]">{galleryAssets.length} image{galleryAssets.length !== 1 ? "s" : ""}</span>
            </div>
            <GalleryManager
              assets={galleryAssets}
              onChange={setGalleryAssets}
              folder="chittagong-trail/journal"
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4 lg:sticky lg:top-16 lg:self-start">
          {/* Publish */}
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Publish</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="status" className="block text-xs font-medium text-[#5D4037] mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label htmlFor="publishedAt" className="block text-xs font-medium text-[#5D4037] mb-1">
                  Published Date
                  {status !== "PUBLISHED" && <span className="text-[#8D6E63] font-normal ml-1">(auto-set on publish)</span>}
                </label>
                <input
                  type="date"
                  id="publishedAt"
                  name="publishedAt"
                  defaultValue={mode === "edit" && post?.publishedAt ? formatDateForInput(post.publishedAt) : ""}
                  disabled={status !== "PUBLISHED"}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent disabled:bg-[#F5F0EB] disabled:opacity-60"
                />
              </div>
              <p className="text-[11px] leading-relaxed text-[#8D6E63]">
                Homepage placement is managed in the {contentType === "FOOD" ? "Featured Food" : "Featured Stories"} workspace.
              </p>
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  name="intent"
                  value="save-draft"
                  disabled={isPending}
                  onClick={() => setStatus("DRAFT")}
                  className="w-full bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="publish"
                  disabled={isPending}
                  onClick={() => setStatus("PUBLISHED")}
                  className="w-full bg-[#3E2723] hover:bg-[#5D4037] text-[#FDF5E6] font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Publishing..." : "Publish"}
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="archive"
                  disabled={isPending}
                  onClick={() => setStatus("ARCHIVED")}
                  className="w-full bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-2 px-4 rounded text-sm border border-[#D7C9B8] transition-colors cursor-pointer"
                >
                  Archive
                </button>
                <p className="text-[11px] leading-relaxed text-[#8D6E63]">Current status: {status}</p>
                <button
                  type="button"
                  onClick={() => {
                    if ((isDirty || saveFailed) && !window.confirm("Discard unsaved changes?")) return;
                    router.push(returnTo || (contentType === "FOOD" ? "/admin/food" : "/admin/journal"));
                  }}
                  className="w-full bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-2 px-4 rounded text-sm border border-[#D7C9B8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              {mode === "edit" && post && (
                <div className="pt-2">
                  <DeleteButton id={post.id} name={post.title} scope={contentType === "FOOD" ? "food" : "story"} />
                </div>
              )}
            </div>
          </div>

          {/* Cover Image & Image SEO */}
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <CoverImageModule
              asset={coverAsset}
              onAssetChange={setCoverAsset}
              useCoverForOg={useCoverForOg}
              onUseCoverForOgChange={setUseCoverForOg}
              ogAsset={ogAsset}
              onOgAssetChange={setOgAsset}
              folder="chittagong-trail/journal"
            />
          </div>
        </div>
      </div>

      {/* Full-width SEO workspace */}
      <div className="mt-6">
        <OnPageSeoWorkspace
          contentType={seoContentType as "story" | "food"}
          contentTitle={title}
          contentSlug={slug}
          contentExcerpt={post?.excerpt ?? ""}
          initialMetaTitle={post?.metaTitle}
          initialMetaDescription={post?.metaDescription}
          coverUrl={coverAsset?.secureUrl}
          status={status}
          metaTitleError={state.errors?.metaTitle}
          metaDescriptionError={state.errors?.metaDescription}
        />
      </div>
    </form>
  );
}
