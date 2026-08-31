"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { MediaAssetData, MediaPickerMode, MediaPickerProps } from "./types";
import DirectUpload from "./DirectUpload";

interface MediaListResponse {
  items: MediaAssetData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MediaPicker({
  open,
  mode,
  folder,
  selected,
  onSelect,
  onRemove,
  onClose,
  title = "Select Media",
  description,
}: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAssetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">(
    mode === "video" ? "video" : mode === "image" ? "image" : "all"
  );
  const [showUpload, setShowUpload] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAssetData | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.showModal();
      setPage(1);
      setSearch("");
      fetchAssets(1, "");
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      dialogRef.current?.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  const fetchAssets = useCallback(async (p: number, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "24");
      if (q) params.set("search", q);
      if (filterType !== "all") params.set("resourceType", filterType);
      if (folder) params.set("folder", folder);

      const res = await fetch(`/api/admin/media/list?${params.toString()}`);
      if (res.ok) {
        const data: MediaListResponse = await res.json();
        setAssets(data.items);
        setTotalPages(data.totalPages);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [filterType, folder]);

  useEffect(() => {
    if (open) {
      fetchAssets(page, search);
    }
  }, [page, filterType, open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAssets(1, search);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (previewAsset) {
        setPreviewAsset(null);
      } else {
        onClose();
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const matchesMode = (asset: MediaAssetData) => {
    if (mode === "image") return asset.resourceType === "image";
    if (mode === "video") return asset.resourceType === "video";
    return true;
  };

  const handleSelect = (asset: MediaAssetData) => {
    if (!matchesMode(asset)) return;
    onSelect(asset);
    onClose();
  };

  const handleUploadComplete = (asset: MediaAssetData) => {
    setShowUpload(false);
    onSelect(asset);
    onClose();
  };

  const formatDimensions = (asset: MediaAssetData) => {
    if (asset.width && asset.height) return `${asset.width}×${asset.height}`;
    return null;
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="backdrop:bg-black/50 rounded-lg border border-[#E8DCC8] shadow-xl max-w-4xl w-full mx-auto p-0"
      aria-labelledby="media-picker-title"
      aria-describedby={description ? "media-picker-desc" : undefined}
    >
      <div className="flex flex-col h-[80vh] max-h-[700px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8DCC8]">
          <div>
            <h2 id="media-picker-title" className="text-lg font-semibold text-[#5D4037]">
              {title}
            </h2>
            {description && (
              <p id="media-picker-desc" className="text-sm text-[#5D4037]/60">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUpload(!showUpload)}
              className="px-3 py-1.5 text-sm bg-[#3E2723] text-[#FDF5E6] rounded-md hover:bg-[#5D4037] transition-colors cursor-pointer"
            >
              {showUpload ? "Library" : "Upload New"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#5D4037] hover:text-[#3E2723] cursor-pointer"
              aria-label="Close media picker"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {showUpload ? (
          /* Upload Panel */
          <div className="flex-1 overflow-auto p-4">
            <DirectUpload
              folder={folder || "chittagong-trail/general"}
              resourceType={mode === "video" ? "video" : "image"}
              onUploadComplete={handleUploadComplete}
              label={`Drop ${mode === "video" ? "video" : "image"} here or click to select`}
            />
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="flex items-center gap-3 p-4 border-b border-[#E8DCC8]">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by filename..."
                  className="flex-1 px-3 py-1.5 text-sm border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
                />
                <button type="submit" className="px-3 py-1.5 text-sm bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded-md cursor-pointer">
                  Search
                </button>
              </form>
              <div className="flex gap-1">
                {(["all", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setFilterType(t); setPage(1); }}
                    className={`px-2 py-1 text-xs rounded-md capitalize cursor-pointer ${
                      filterType === t
                        ? "bg-[#3E2723] text-[#FDF5E6]"
                        : "bg-[#E8DCC8] text-[#5D4037] hover:bg-[#D7C9B8]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-32 text-[#5D4037]" role="status" aria-live="polite">
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-[#C9A882] border-t-transparent rounded-full mr-2" />
                  Loading media...
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-[#5D4037]/60">
                  <p>No media found</p>
                  <button
                    type="button"
                    onClick={() => setShowUpload(true)}
                    className="mt-2 text-sm text-[#C9A882] hover:underline cursor-pointer"
                  >
                    Upload new media
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => matchesMode(asset) ? setPreviewAsset(asset) : undefined}
                      className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selected?.id === asset.id
                          ? "border-[#C9A882] ring-2 ring-[#C9A882]/50"
                          : matchesMode(asset)
                          ? "border-[#E8DCC8] hover:border-[#C9A882] cursor-pointer"
                          : "border-[#E8DCC8] opacity-50 cursor-not-allowed"
                      }`}
                      aria-label={`${asset.publicId.split("/").pop()} - ${asset.resourceType}${selected?.id === asset.id ? " (selected)" : ""}`}
                      disabled={!matchesMode(asset)}
                    >
                      {asset.resourceType === "video" ? (
                        <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                          <svg className="w-8 h-8 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={asset.secureUrl}
                          alt={asset.altText || asset.publicId.split("/").pop() || "Media"}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      )}
                      {selected?.id === asset.id && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-[#C9A882] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                        <p className="text-[10px] text-white truncate">
                          {asset.publicId.split("/").pop()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-3 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm border border-[#D7C9B8] rounded-md disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm text-[#5D4037]">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-sm border border-[#D7C9B8] rounded-md disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}

            {/* Selected asset actions */}
            {selected && (
              <div className="flex items-center justify-between p-3 border-t border-[#E8DCC8] bg-[#FDF5E6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded overflow-hidden border border-[#D7C9B8] flex-shrink-0">
                    {selected.resourceType === "video" ? (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <Image src={selected.secureUrl} alt="" fill className="object-cover" sizes="40px" />
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="text-[#5D4037] truncate max-w-[200px]">{selected.publicId.split("/").pop()}</p>
                    {selected.altText && <p className="text-[#5D4037]/60 text-xs truncate max-w-[200px]">{selected.altText}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => { onRemove(); onClose(); }}
                      className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelect(selected)}
                    className="px-3 py-1.5 text-sm bg-[#C9A882] text-[#3E2723] rounded-md hover:bg-[#D4956A] transition-colors cursor-pointer"
                  >
                    Use Selected
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Preview Modal */}
        {previewAsset && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setPreviewAsset(null)}
            role="dialog"
            aria-label="Media preview"
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-[#5D4037]">Preview</h3>
                  <button type="button" onClick={() => setPreviewAsset(null)} className="text-[#5D4037] hover:text-[#3E2723] cursor-pointer" aria-label="Close preview">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#1a1a1a] mb-3">
                  {previewAsset.resourceType === "video" ? (
                    <video
                      src={previewAsset.secureUrl}
                      controls
                      preload="metadata"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image src={previewAsset.secureUrl} alt={previewAsset.altText || ""} fill className="object-contain" sizes="(max-width: 768px) 100vw, 672px" />
                  )}
                </div>
                <div className="space-y-1 text-sm text-[#5D4037]">
                  <p><span className="font-medium">File:</span> {previewAsset.publicId.split("/").pop()}</p>
                  <p><span className="font-medium">Type:</span> {previewAsset.resourceType}</p>
                  {previewAsset.format && <p><span className="font-medium">Format:</span> {previewAsset.format}</p>}
                  {formatDimensions(previewAsset) && <p><span className="font-medium">Dimensions:</span> {formatDimensions(previewAsset)}</p>}
                  {previewAsset.altText && <p><span className="font-medium">Alt:</span> {previewAsset.altText}</p>}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => { handleSelect(previewAsset); }}
                    className={`flex-1 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                      matchesMode(previewAsset)
                        ? "bg-[#C9A882] text-[#3E2723] hover:bg-[#D4956A]"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!matchesMode(previewAsset)}
                  >
                    {matchesMode(previewAsset) ? "Select This" : `Cannot select (${previewAsset.resourceType})`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
