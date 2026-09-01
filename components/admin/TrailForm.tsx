"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { TrailLocation } from "@prisma/client";
import {
  createTrail,
  updateTrail,
  type TrailActionResult,
} from "@/app/admin/(protected)/trails/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import MediaField from "@/components/admin/media/MediaField";
import GalleryManager from "@/components/admin/media/GalleryManager";
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
  const [seoExpanded, setSeoExpanded] = useState(false);

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
                <label htmlFor="description" className="block text-xs font-medium text-[#5D4037] mb-1">Description * (HTML)</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={trail?.description}
                  required
                  rows={8}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] font-mono focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
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
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Trail Gallery</h3>
            <GalleryManager
              assets={galleryAssets}
              onChange={setGalleryAssets}
              folder="chittagong-trail/trails"
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-3 uppercase tracking-wide">Publish</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="status" className="block text-xs font-medium text-[#5D4037] mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={trail?.status ?? "DRAFT"}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label htmlFor="publishedAt" className="block text-xs font-medium text-[#5D4037] mb-1">Published Date</label>
                <input
                  type="date"
                  id="publishedAt"
                  name="publishedAt"
                  defaultValue={formatDateForInput(trail?.publishedAt ?? new Date())}
                  className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={trail?.isFeatured ?? false}
                  value="true"
                  className="w-3.5 h-3.5 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882]"
                />
                <label htmlFor="isFeatured" className="text-xs text-[#5D4037]">Featured on homepage</label>
              </div>
              <div>
                <label htmlFor="featuredOrder" className="block text-xs font-medium text-[#5D4037] mb-1">Featured Order</label>
                <input
                  type="number"
                  id="featuredOrder"
                  name="featuredOrder"
                  defaultValue={trail?.featuredOrder ?? ""}
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
              folder="chittagong-trail/trails"
              recommendedDimensions="1200×630"
            />
          </div>

          <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
            <h3 className="text-xs font-semibold text-[#5D4037] mb-2 uppercase tracking-wide">Social Sharing</h3>
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
            {!useCoverForOg && (
              <MediaField
                label="OG Image"
                value={ogAsset}
                onChange={setOgAsset}
                folder="chittagong-trail/trails"
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
                  <label htmlFor="metaTitle" className="block text-xs font-medium text-[#5D4037] mb-1">Meta Title</label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    defaultValue={trail?.metaTitle ?? ""}
                    className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="block text-xs font-medium text-[#5D4037] mb-1">Meta Description</label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    defaultValue={trail?.metaDescription ?? ""}
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
              ? mode === "create" ? "Creating..." : "Saving..."
              : mode === "create" ? "Create Trail" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/trails")}
            className="bg-white hover:bg-[#E8DCC8] text-[#5D4037] font-medium py-1.5 px-5 rounded text-sm border border-[#D7C9B8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
        {mode === "edit" && trail && (
          <DeleteButton
            id={trail.id}
            name={trail.name}
            scope="trail"
          />
        )}
      </div>
    </form>
  );
}
