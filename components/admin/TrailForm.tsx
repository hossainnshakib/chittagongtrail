"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { TrailLocation } from "@prisma/client";
import {
  createTrail,
  updateTrail,
  type TrailActionResult,
} from "@/app/admin/(protected)/trails/actions";
import SeoPanel from "@/components/admin/SeoPanel";
import MediaField from "@/components/admin/media/MediaField";
import DeleteButton from "@/components/admin/DeleteButton";
import GalleryManager from "@/components/admin/media/GalleryManager";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import type { MediaAssetData } from "@/components/admin/media/types";

interface TrailFormProps {
  trail?: TrailLocation;
  mode: "create" | "edit";
  initialCover?: MediaAssetData | null;
  initialOg?: MediaAssetData | null;
  initialGallery?: MediaAssetData[];
}

const initialState: TrailActionResult = { success: false };

export default function TrailForm({ trail, mode, initialCover, initialOg, initialGallery }: TrailFormProps) {
  const router = useRouter();
  const action =
    mode === "create"
      ? createTrail.bind(null)
      : updateTrail.bind(null, trail!.id);

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
  const [status, setStatus] = useState<string>(trail?.status ?? "DRAFT");
  const [isFeatured, setIsFeatured] = useState(trail?.isFeatured ?? false);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-xs font-medium text-[#5D4037] mb-1">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={trail?.name}
                  required
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
                {state.errors?.name && <p className="text-red-600 text-xs mt-0.5">{state.errors.name}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="slug" className="block text-xs font-medium text-[#5D4037] mb-1">Slug *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    defaultValue={trail?.slug}
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
                <label htmlFor="excerpt" className="block text-xs font-medium text-[#5D4037] mb-1">Excerpt</label>
                <input
                  type="text"
                  id="excerpt"
                  name="excerpt"
                  defaultValue={trail?.excerpt ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <AdminRichTextEditor
                  initialContent={trail?.description ?? ""}
                  name="description"
                  label="Description *"
                  placeholder="Describe the place, experience, access and context..."
                  required
                />
                {state.errors?.description && <p className="text-red-600 text-xs mt-0.5">{state.errors.description}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Geography</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="district" className="block text-xs font-medium text-[#5D4037] mb-1">District *</label>
                <select
                  id="district"
                  name="district"
                  defaultValue={trail?.district ?? "CHITTAGONG"}
                  required
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="CHITTAGONG">Chittagong District</option>
                  <option value="COX_BAZAR">Cox&apos;s Bazar District</option>
                  <option value="RANGAMATI">Rangamati Hill District</option>
                  <option value="BANDARBAN">Bandarban Hill District</option>
                  <option value="KHAGRACHARI">Khagrachari Hill District</option>
                </select>
              </div>
              <div>
                <label htmlFor="administrativeArea" className="block text-xs font-medium text-[#5D4037] mb-1">Upazila/Thana</label>
                <input
                  type="text"
                  id="administrativeArea"
                  name="administrativeArea"
                  defaultValue={trail?.administrativeArea ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="localArea" className="block text-xs font-medium text-[#5D4037] mb-1">Local Area</label>
                <input
                  type="text"
                  id="localArea"
                  name="localArea"
                  defaultValue={trail?.localArea ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="terrainType" className="block text-xs font-medium text-[#5D4037] mb-1">Terrain</label>
                <select
                  id="terrainType"
                  name="terrainType"
                  defaultValue={trail?.terrainType ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="">Unspecified</option>
                  <option value="COAST">Coast</option>
                  <option value="HILLS">Hills</option>
                  <option value="RIVER">River</option>
                  <option value="CITY">City</option>
                  <option value="RURAL">Rural</option>
                </select>
              </div>
              <div>
                <label htmlFor="placeType" className="block text-xs font-medium text-[#5D4037] mb-1">Place Type *</label>
                <select
                  id="placeType"
                  name="placeType"
                  defaultValue={trail?.placeType ?? "PLACE"}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="PLACE">Place</option>
                  <option value="TOURIST_ATTRACTION">Tourist Attraction</option>
                  <option value="NATURAL_FEATURE">Natural Feature</option>
                  <option value="PARK">Park</option>
                </select>
              </div>
              <div>
                <label htmlFor="latitude" className="block text-xs font-medium text-[#5D4037] mb-1">Latitude</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  step="any"
                  min="-90"
                  max="90"
                  defaultValue={trail?.latitude ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-xs font-medium text-[#5D4037] mb-1">Longitude</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  step="any"
                  min="-180"
                  max="180"
                  defaultValue={trail?.longitude ?? ""}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-[#5D4037] uppercase tracking-wide">Trail Gallery</h3>
              <span className="text-[11px] text-[#8D6E63]">{galleryAssets.length} image{galleryAssets.length !== 1 ? "s" : ""}</span>
            </div>
            <GalleryManager
              assets={galleryAssets}
              onChange={setGalleryAssets}
              folder="chittagong-trail/trails"
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4 lg:sticky lg:top-16 lg:self-start">
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
                  defaultValue={mode === "edit" && trail?.publishedAt ? formatDateForInput(trail.publishedAt) : ""}
                  disabled={status !== "PUBLISHED"}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent disabled:bg-[#F5F0EB] disabled:opacity-60"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  value="true"
                  className="w-3.5 h-3.5 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882]"
                />
                <label htmlFor="isFeatured" className="text-xs text-[#5D4037]">Featured on homepage</label>
              </div>
              {isFeatured && (
                <div>
                  <label htmlFor="featuredOrder" className="block text-xs font-medium text-[#5D4037] mb-1">
                    Featured Order <span className="text-[#8D6E63] font-normal">(lower = first)</span>
                  </label>
                  <input
                    type="number"
                    id="featuredOrder"
                    name="featuredOrder"
                    defaultValue={trail?.featuredOrder ?? ""}
                    min="0"
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                </div>
              )}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#C9A882] hover:bg-[#D4956A] text-[#3E2723] font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending
                    ? mode === "create" ? "Creating..." : "Saving..."
                    : mode === "create" ? "Create Trail" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/trails")}
                  className="w-full mt-2 bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-2 px-4 rounded text-sm border border-[#D7C9B8] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              {mode === "edit" && trail && (
                <div className="pt-2">
                  <DeleteButton id={trail.id} name={trail.name} scope="trail" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Cover Image</h3>
            <MediaField
              label="Cover"
              value={coverAsset}
              onChange={setCoverAsset}
              folder="chittagong-trail/trails"
              recommendedDimensions="Landscape editorial image, min 1200px wide"
            />
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-2 uppercase tracking-wide">Social Sharing (OG)</h3>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useCoverForOg"
                checked={useCoverForOg}
                onChange={(e) => {
                  setUseCoverForOg(e.target.checked);
                  if (e.target.checked) setOgAsset(null);
                }}
                className="w-3.5 h-3.5 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882] cursor-pointer"
              />
              <label htmlFor="useCoverForOg" className="text-xs text-[#5D4037] cursor-pointer">Use cover image</label>
            </div>
            {useCoverForOg ? (
              <p className="text-[11px] text-[#8D6E63]">OG image will use the cover as fallback.</p>
            ) : (
              <MediaField
                label="OG Image"
                value={ogAsset}
                onChange={setOgAsset}
                folder="chittagong-trail/trails"
                recommendedDimensions="1200 x 630 recommended for social sharing"
              />
            )}
          </div>

          <SeoPanel
            initialMetaTitle={trail?.metaTitle}
            initialMetaDescription={trail?.metaDescription}
            defaultTitle={trail?.name}
            defaultDescription={trail?.excerpt ?? undefined}
            canonicalPath={trail ? `/trails/${trail.slug}` : "/trails/new"}
            coverUrl={coverAsset?.secureUrl}
          />
        </div>
      </div>
    </form>
  );
}
