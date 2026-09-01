"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { MediaAssetData, MediaPickerProps } from "./types";
import DirectUpload from "./DirectUpload";

interface MediaListResponse {
  items: MediaAssetData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function MediaPickerInner({
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async (p: number, q: string, ft?: "all" | "image" | "video") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", "24");
      if (q) params.set("search", q);
      const effectiveFilter = ft ?? filterType;
      if (effectiveFilter !== "all") params.set("resourceType", effectiveFilter);
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
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.showModal();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional dialog data fetch on open
      fetchAssets(1, "", mode === "video" ? "video" : mode === "image" ? "image" : "all");
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      dialogRef.current?.close();
      previousFocusRef.current?.focus();
    }
  }, [open, fetchAssets, mode]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional pagination/filter data fetch
      fetchAssets(page, search);
    }
  }, [page, filterType, open, fetchAssets, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAssets(1, search);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
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

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="backdrop:bg-black/50 rounded-lg border border-[#E8DCC8] shadow-xl w-full mx-auto p-0 max-w-3xl"
      style={{ maxWidth: "64rem" }}
      aria-labelledby="media-picker-title"
      aria-describedby={description ? "media-picker-desc" : undefined}
    >
      <div className="flex flex-col h-[80vh] max-h-[600px] sm:h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#E8DCC8]">
          <div>
            <h2 id="media-picker-title" className="text-sm font-semibold text-[#5D4037]">
              {title}
            </h2>
            {description && (
              <p id="media-picker-desc" className="text-[10px] text-[#5D4037]/60">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowUpload(!showUpload)}
              className="px-2 py-1 text-[11px] bg-[#3E2723] text-[#FDF5E6] rounded hover:bg-[#5D4037] transition-colors cursor-pointer"
            >
              {showUpload ? "Library" : "Upload"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#5D4037] hover:text-[#3E2723] cursor-pointer"
              aria-label="Close media picker"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {showUpload ? (
          /* Upload Panel */
          <div className="flex-1 overflow-auto p-3">
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
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E8DCC8]">
              <form onSubmit={handleSearch} className="flex-1 flex gap-1.5">
                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-2 py-1 text-xs border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
                />
                <button type="submit" className="px-2 py-1 text-[11px] bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded cursor-pointer">
                  Search
                </button>
              </form>
              <div className="flex gap-0.5">
                {(["all", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setFilterType(t); setPage(1); }}
                    className={`px-1.5 py-0.5 text-[10px] rounded capitalize cursor-pointer ${
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
            <div className="flex-1 overflow-auto p-3">
              {loading ? (
                <div className="flex items-center justify-center h-24 text-[#5D4037]" role="status" aria-live="polite">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-[#C9A882] border-t-transparent rounded-full mr-1.5" />
                  <span className="text-xs">Loading...</span>
                </div>
              ) : assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-[#5D4037]/60">
                  <p className="text-xs">No media found</p>
                  <button
                    type="button"
                    onClick={() => setShowUpload(true)}
                    className="mt-1 text-[11px] text-[#C9A882] hover:underline cursor-pointer"
                  >
                    Upload new
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => matchesMode(asset) ? handleSelect(asset) : undefined}
                      className={`group relative aspect-square rounded overflow-hidden border-2 transition-all ${
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
                          <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : (
                        <Image
                          src={asset.secureUrl}
                          alt={asset.altText || asset.publicId.split("/").pop() || "Media"}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      )}
                      {selected?.id === asset.id && (
                        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C9A882] rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-0.5">
                        <p className="text-[8px] text-white truncate">
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
              <div className="flex items-center justify-center gap-1.5 py-1.5 border-t border-[#E8DCC8]">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-2 py-0.5 text-[11px] border border-[#D7C9B8] rounded disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>
                <span className="text-[11px] text-[#5D4037]">
                  {page}/{totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="px-2 py-0.5 text-[11px] border border-[#D7C9B8] rounded disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}

            {/* Selected asset actions */}
            {selected && (
              <div className="flex items-center justify-between px-3 py-1.5 border-t border-[#E8DCC8] bg-[#FDF5E6]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded overflow-hidden border border-[#D7C9B8] flex-shrink-0">
                    {selected.resourceType === "video" ? (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <Image src={selected.secureUrl} alt="" fill className="object-cover" sizes="32px" />
                    )}
                  </div>
                  <div className="text-[11px]">
                    <p className="text-[#5D4037] truncate max-w-[150px]">{selected.publicId.split("/").pop()}</p>
                    {selected.altText && <p className="text-[#5D4037]/60 truncate max-w-[150px]">{selected.altText}</p>}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => { onRemove(); onClose(); }}
                      className="px-2 py-1 text-[11px] text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSelect(selected)}
                    className="px-2.5 py-1 text-[11px] bg-[#C9A882] text-[#3E2723] rounded hover:bg-[#D4956A] transition-colors cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}

export default function MediaPicker(props: MediaPickerProps) {
  if (!props.open) return null;
  return <MediaPickerInner {...props} />;
}
