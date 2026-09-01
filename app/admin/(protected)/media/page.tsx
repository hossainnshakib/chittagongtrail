"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface MediaAssetItem {
  id: number;
  publicId: string;
  secureUrl: string;
  width: number | null;
  height: number | null;
  format: string | null;
  resourceType: string;
  altText: string | null;
  createdAt: string;
  _count?: {
    trailCovers: number;
    trailOgMedias: number;
    trailGalleries: number;
    journalCovers: number;
    journalOgMedias: number;
    homepageGalleries: number;
    siteHeroMedias: number;
    siteSeasonalMedias: number;
  };
}

interface ReferenceSummaryItem {
  name?: string;
  title?: string;
  trailName?: string;
  sortOrder?: number;
  type?: string;
}

interface ReferenceSummary {
  trailCovers: ReferenceSummaryItem[];
  trailOgMedias: ReferenceSummaryItem[];
  trailGalleries: ReferenceSummaryItem[];
  journalCovers: ReferenceSummaryItem[];
  journalOgMedias: ReferenceSummaryItem[];
  homepageGalleries: ReferenceSummaryItem[];
  siteHeroMedias: ReferenceSummaryItem[];
  siteSeasonalMedias: ReferenceSummaryItem[];
  inlineHtmlReferences: ReferenceSummaryItem[];
}

interface SignedUploadParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: string;
}

const ALLOWED_UPLOAD_FOLDERS = [
  "chittagong-trail/trails",
  "chittagong-trail/journal",
  "chittagong-trail/food",
  "chittagong-trail/general",
] as const;

const RESOURCE_TYPES = ["all", "images", "videos"] as const;
type ResourceTypeFilter = (typeof RESOURCE_TYPES)[number];

type UploadState = "idle" | "signing" | "uploading" | "registering" | "success" | "error";

export default function AdminMediaLibraryPage() {
  const [items, setItems] = useState<MediaAssetItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [resourceFilter, setResourceFilter] = useState<ResourceTypeFilter>("all");
  const [formatFilter, setFormatFilter] = useState("");
  const [folderFilter, setFolderFilter] = useState("");

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResourceType, setUploadResourceType] = useState<"image" | "video">("image");
  const [uploadFolder, setUploadFolder] = useState<string>(ALLOWED_UPLOAD_FOLDERS[0]);
  const [uploadAlt, setUploadAlt] = useState("");
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const [activeAsset, setActiveAsset] = useState<MediaAssetItem | null>(null);
  const [references, setReferences] = useState<ReferenceSummary | null>(null);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [editingAlt, setEditingAlt] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAssets = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", p.toString());
      params.set("limit", "24");
      if (search) params.set("search", search);
      if (formatFilter) params.set("format", formatFilter);
      if (folderFilter) params.set("folder", folderFilter);
      if (resourceFilter === "images") params.set("resourceType", "image");
      if (resourceFilter === "videos") params.set("resourceType", "video");

      const res = await fetch(`/api/admin/media/list?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load media assets");
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading media");
    } finally {
      setLoading(false);
    }
  }, [search, formatFilter, folderFilter, resourceFilter]);

  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchAssets(1);
      return;
    }
    fetchAssets(1);
  }, [resourceFilter, folderFilter, fetchAssets]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets(1);
  };

  const resetUploadForm = useCallback(() => {
    setUploadState("idle");
    setUploadProgress(0);
    setUploadError(null);
    setSelectedFile(null);
    setUploadAlt("");
    xhrRef.current?.abort();
  }, []);

  const handleUploadDirect = useCallback(async (file: File) => {
    setUploadState("signing");
    setUploadError(null);
    try {
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: uploadFolder, resourceType: uploadResourceType }),
      });
      if (!signRes.ok) {
        const errData = await signRes.json();
        throw new Error(errData.error || "Failed to get upload signature");
      }
      const params: SignedUploadParams = await signRes.json();

      setUploadState("uploading");
      setUploadProgress(0);

      const asset = await new Promise<Record<string, unknown>>((resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", params.apiKey);
        formData.append("timestamp", String(params.timestamp));
        formData.append("signature", params.signature);
        formData.append("folder", params.folder);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        });
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
          else {
            try {
              const errData = JSON.parse(xhr.responseText);
              const msg = errData?.error?.message || errData?.error || `Cloudinary rejected the upload (${xhr.status})`;
              reject(new Error(msg));
            } catch {
              reject(new Error(`Cloudinary upload failed (HTTP ${xhr.status})`));
            }
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${params.cloudName}/${params.resourceType}/upload`);
        xhr.send(formData);
      });

      setUploadState("registering");

      const registerRes = await fetch("/api/admin/media/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicId: asset.public_id,
          secureUrl: asset.secure_url,
          resourceType: asset.resource_type,
          format: asset.format,
          width: asset.width,
          height: asset.height,
          altText: uploadAlt || undefined,
        }),
      });
      if (!registerRes.ok) {
        const errData = await registerRes.json();
        throw new Error(errData.error || "Failed to register media");
      }

      setUploadState("success");
      setActionMessage("Media uploaded successfully!");
      setTimeout(() => {
        setActionMessage(null);
        setShowUploadDialog(false);
        resetUploadForm();
        fetchAssets(1);
      }, 1200);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  }, [uploadFolder, uploadResourceType, uploadAlt, fetchAssets, resetUploadForm]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    handleUploadDirect(selectedFile);
  };

  const openAssetDetail = async (asset: MediaAssetItem) => {
    setActiveAsset(asset);
    setEditingAlt(asset.altText || "");
    setLoadingRefs(true);
    setReferences(null);
    try {
      const refRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getReferences", mediaId: asset.id }),
      });
      if (refRes.ok) {
        setReferences(await refRes.json());
      }
    } catch {
      // silent
    } finally {
      setLoadingRefs(false);
    }
  };

  const handleUpdateAlt = async () => {
    if (!activeAsset) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateAltText", mediaId: activeAsset.id, altText: editingAlt }),
      });
      if (!res.ok) throw new Error("Failed to update alt text");
      const data = await res.json();
      setActiveAsset({ ...activeAsset, altText: data.updated.altText });
      setActionMessage("Alt text updated successfully!");
      setTimeout(() => setActionMessage(null), 3000);
      fetchAssets(page);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update alt text");
    }
  };

  const handleDeleteAsset = async () => {
    if (!activeAsset) return;
    if (!confirm("Delete this media asset? This will permanently destroy the file on Cloudinary if unreferenced.")) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", mediaId: activeAsset.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Deletion failed");
      setActiveAsset(null);
      setActionMessage("Media asset deleted successfully!");
      setTimeout(() => setActionMessage(null), 4000);
      fetchAssets(page);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Deletion blocked or failed");
    }
  };

  const refCount = (asset: MediaAssetItem) =>
    (asset._count?.trailCovers || 0) +
    (asset._count?.trailOgMedias || 0) +
    (asset._count?.trailGalleries || 0) +
    (asset._count?.journalCovers || 0) +
    (asset._count?.journalOgMedias || 0) +
    (asset._count?.homepageGalleries || 0) +
    (asset._count?.siteHeroMedias || 0) +
    (asset._count?.siteSeasonalMedias || 0);

  const folderLabel = (publicId: string) => {
    const parts = publicId.split("/");
    return parts.length > 1 ? parts.slice(0, -1).join("/") : publicId;
  };

  return (
    <div className="space-y-5" style={{ '--admin-content-max-width': '1400px' } as React.CSSProperties}>
      {actionMessage && (
        <div className="bg-[#4E342E] text-[#FDF5E6] px-4 py-2 rounded-md text-sm font-medium" role="status" aria-live="polite">
          {actionMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#3E2723]" style={{ fontFamily: "var(--font-body)" }}>
            Media Library
          </h1>
          <p className="text-sm text-[#8D6E63] mt-0.5">
            Manage Cloudinary assets and references. {total > 0 && <span className="font-medium">{total} asset{total !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { resetUploadForm(); setShowUploadDialog(true); }}
          className="px-3 py-1.5 bg-[#3E2723] text-[#FDF5E6] text-sm font-medium rounded hover:bg-[#4E342E] transition-colors cursor-pointer flex-shrink-0"
        >
          Upload Media
        </button>
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-label="Upload media">
          <div className="bg-[#FDF5E6] rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4 border border-[#D7CCC8]">
            <div className="flex items-center justify-between border-b border-[#D7CCC8] pb-3">
              <h2 className="text-base font-semibold text-[#3E2723]" style={{ fontFamily: "var(--font-body)" }}>Upload Media</h2>
              <button
                type="button"
                onClick={() => { resetUploadForm(); setShowUploadDialog(false); }}
                className="text-[#5D4037] hover:text-[#3E2723] text-lg cursor-pointer"
                aria-label="Close upload dialog"
              >
                &#x2715;
              </button>
            </div>

            {uploadState === "success" ? (
              <div className="text-center py-6">
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3" role="status">Upload complete</div>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#5D4037] mb-1">Resource Type</label>
                    <div className="flex gap-1">
                      {(["image", "video"] as const).map((rt) => (
                        <button
                          key={rt}
                          type="button"
                          onClick={() => setUploadResourceType(rt)}
                          className={`flex-1 px-2 py-1.5 text-xs rounded capitalize cursor-pointer transition-colors ${
                            uploadResourceType === rt
                              ? "bg-[#3E2723] text-[#FDF5E6]"
                              : "bg-[#E8DCC8] text-[#5D4037] hover:bg-[#D7C9B8]"
                          }`}
                        >
                          {rt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5D4037] mb-1">Folder</label>
                    <select
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                      className="w-full px-2 py-1.5 border border-[#D7C9B8] rounded text-xs text-[#5D4037] bg-white"
                    >
                      {ALLOWED_UPLOAD_FOLDERS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5D4037] mb-1">
                    Select File
                    <span className="text-[#8D6E63] font-normal ml-1">
                      {uploadResourceType === "image" ? "— JPEG, PNG, WebP, GIF (max 10 MB)" : "— MP4, WebM (max 100 MB)"}
                    </span>
                  </label>
                  <input
                    type="file"
                    accept={uploadResourceType === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/gif"}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-[#5D4037] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#3E2723] file:text-[#FDF5E6] hover:file:bg-[#4E342E] file:cursor-pointer cursor-pointer"
                    required
                  />
                  {selectedFile && (
                    <p className="text-[11px] text-[#8D6E63] mt-1">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5D4037] mb-1">Alt Text (Optional)</label>
                  <input
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Describe for accessibility"
                    className="w-full px-2 py-1.5 border border-[#D7C9B8] rounded text-xs text-[#5D4037] bg-white"
                  />
                </div>

                {uploadError && (
                  <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2" role="alert">
                    {uploadError}
                  </div>
                )}

                {uploadState === "signing" && (
                  <div className="flex items-center gap-2 text-xs text-[#5D4037]" role="status" aria-live="polite">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-[#C9A882] border-t-transparent rounded-full" />
                    Preparing upload...
                  </div>
                )}

                {uploadState === "uploading" && (
                  <div role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Upload progress" className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#5D4037]">
                      <span>Uploading... {uploadProgress}%</span>
                      <button type="button" onClick={() => { xhrRef.current?.abort(); resetUploadForm(); }} className="text-red-600 hover:text-red-800 text-[11px] cursor-pointer">Cancel</button>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8DCC8] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A882] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                {uploadState === "registering" && (
                  <div className="flex items-center gap-2 text-xs text-[#5D4037]" role="status" aria-live="polite">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-[#C9A882] border-t-transparent rounded-full" />
                    Saving record...
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { resetUploadForm(); setShowUploadDialog(false); }}
                    className="px-3 py-1.5 text-xs text-[#5D4037] bg-white border border-[#D7C9B8] rounded hover:bg-[#E8DCC8] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || uploadState === "signing" || uploadState === "uploading" || uploadState === "registering"}
                    className="px-3 py-1.5 text-xs bg-[#3E2723] text-[#FDF5E6] font-medium rounded hover:bg-[#4E342E] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {uploadState === "uploading" ? `Uploading ${uploadProgress}%` : uploadState === "signing" ? "Signing..." : uploadState === "registering" ? "Saving..." : "Upload"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-[#D7CCC8] flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by public ID..."
            className="w-full px-2.5 py-1.5 border border-[#D7CCC8] rounded text-xs text-[#5D4037]"
          />
          <button type="submit" className="px-2.5 py-1.5 bg-[#3E2723] text-[#FDF5E6] text-xs font-medium rounded hover:bg-[#4E342E] cursor-pointer">
            Search
          </button>
        </form>

        <div className="flex items-center gap-1">
          {RESOURCE_TYPES.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => setResourceFilter(rt)}
              className={`px-2 py-1 text-[11px] rounded capitalize cursor-pointer transition-colors ${
                resourceFilter === rt
                  ? "bg-[#3E2723] text-[#FDF5E6]"
                  : "bg-[#E8DCC8] text-[#5D4037] hover:bg-[#D7C9B8]"
              }`}
              aria-pressed={resourceFilter === rt}
            >
              {rt === "images" ? "Images" : rt === "videos" ? "Videos" : "All"}
            </button>
          ))}
        </div>

        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
          className="px-2 py-1 border border-[#D7C9B8] rounded text-[11px] text-[#5D4037] bg-white"
        >
          <option value="">All Formats</option>
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
          <option value="gif">GIF</option>
          <option value="mp4">MP4</option>
          <option value="webm">WebM</option>
        </select>

        <select
          value={folderFilter}
          onChange={(e) => setFolderFilter(e.target.value)}
          className="px-2 py-1 border border-[#D7C9B8] rounded text-[11px] text-[#5D4037] bg-white"
        >
          <option value="">All Folders</option>
          {ALLOWED_UPLOAD_FOLDERS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {(resourceFilter !== "all" || formatFilter || folderFilter || search) && (
          <button
            type="button"
            onClick={() => { setResourceFilter("all"); setFormatFilter(""); setFolderFilter(""); setSearch(""); }}
            className="px-2 py-1 text-[11px] text-[#8D6E63] hover:text-[#3E2723] underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#8D6E63] text-sm">Loading media assets...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#D7CCC8]">
          <p className="text-sm text-[#8D6E63] mb-2">No media assets found.</p>
          <button
            type="button"
            onClick={() => { resetUploadForm(); setShowUploadDialog(true); }}
            className="text-sm text-[#3E2723] font-medium underline cursor-pointer"
          >
            Upload first asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {items.map((asset) => {
            const refs = refCount(asset);
            return (
              <div
                key={asset.id}
                onClick={() => openAssetDetail(asset)}
                className="bg-white rounded-lg shadow-sm border border-[#D7CCC8] overflow-hidden cursor-pointer hover:border-[#3E2723] transition-all flex flex-col"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAssetDetail(asset); } }}
                aria-label={`${asset.publicId.split("/").pop()} ${asset.resourceType}${refs > 0 ? `, ${refs} reference${refs > 1 ? "s" : ""}` : ""}`}
              >
                <div className="aspect-square bg-[#FDF5E6] relative flex items-center justify-center overflow-hidden">
                  {asset.resourceType === "video" ? (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center relative">
                      <Image
                        src={asset.secureUrl}
                        alt={asset.altText || asset.publicId}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={asset.secureUrl}
                      alt={asset.altText || asset.publicId}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                  )}
                  {refs > 0 && (
                    <span className="absolute top-1 right-1 bg-[#3E2723] text-[#FDF5E6] text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                      {refs} ref{refs > 1 ? "s" : ""}
                    </span>
                  )}
                  {asset.resourceType === "video" && (
                    <span className="absolute top-1 left-1 bg-[#1a1a1a]/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10 uppercase">
                      {asset.format || "video"}
                    </span>
                  )}
                </div>
                <div className="p-2 flex-1 flex flex-col justify-between">
                  <p className="text-[10px] font-mono text-[#5D4037] truncate" title={asset.publicId}>
                    {asset.publicId.split("/").pop()}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-[#8D6E63] mt-1">
                    <span>{asset.width && asset.height ? `${asset.width}x${asset.height}` : asset.resourceType === "video" ? "video" : "—"}</span>
                    <span className="uppercase font-semibold">{asset.format || "?"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            onClick={() => fetchAssets(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 bg-white border border-[#D7CCC8] rounded text-xs text-[#5D4037] disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span className="text-xs text-[#5D4037]">Page {page} of {totalPages}</span>
          <button
            onClick={() => fetchAssets(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-white border border-[#D7CCC8] rounded text-xs text-[#5D4037] disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {activeAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-label="Media details">
          <div className="bg-[#FDF5E6] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-4 border border-[#3E2723]">
            <div className="flex items-center justify-between border-b border-[#D7CCC8] pb-3">
              <h3 className="text-base font-semibold text-[#3E2723]" style={{ fontFamily: "var(--font-body)" }}>Media Details</h3>
              <button onClick={() => setActiveAsset(null)} className="text-sm text-[#5D4037] hover:text-[#3E2723] font-bold cursor-pointer" aria-label="Close details">
                &#x2715;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-1.5 rounded border border-[#D7C9B8] flex items-center justify-center h-44 relative">
                {activeAsset.resourceType === "video" ? (
                  <video
                    src={activeAsset.secureUrl}
                    controls
                    className="max-h-full max-w-full object-contain"
                    preload="metadata"
                  >
                    Your browser does not support video playback.
                  </video>
                ) : (
                  <Image
                    src={activeAsset.secureUrl}
                    alt={activeAsset.altText || activeAsset.publicId}
                    fill
                    sizes="300px"
                    className="object-contain"
                  />
                )}
              </div>
              <div className="space-y-2 text-xs text-[#5D4037]">
                <div>
                  <span className="font-semibold">Public ID</span>
                  <p className="font-mono text-[10px] break-all bg-white p-1.5 rounded border border-[#D7C9B8] mt-0.5">{activeAsset.publicId}</p>
                </div>
                <div>
                  <span className="font-semibold">Secure URL</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input type="text" readOnly value={activeAsset.secureUrl} className="flex-1 text-[10px] font-mono bg-white p-1.5 rounded border border-[#D7C9B8]" />
                    <button
                      onClick={() => { navigator.clipboard.writeText(activeAsset.secureUrl); setActionMessage("URL copied!"); setTimeout(() => setActionMessage(null), 2000); }}
                      className="px-2 py-1 bg-[#3E2723] text-[#FDF5E6] text-[10px] rounded hover:bg-[#4E342E] cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="font-semibold">Dimensions</span>
                    <p>{activeAsset.width && activeAsset.height ? `${activeAsset.width} x ${activeAsset.height}` : "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Format</span>
                    <p className="uppercase">{activeAsset.format || "Unknown"}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Type</span>
                    <p className="capitalize">{activeAsset.resourceType}</p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold">Folder</span>
                  <p className="text-[10px]">{folderLabel(activeAsset.publicId)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-[#D7CCC8] pt-3">
              <label className="block text-xs font-semibold text-[#3E2723]">Alt Text</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={editingAlt}
                  onChange={(e) => setEditingAlt(e.target.value)}
                  placeholder="Description for accessibility"
                  className="flex-1 px-2 py-1.5 border border-[#D7C9B8] rounded text-xs bg-white text-[#5D4037]"
                />
                <button onClick={handleUpdateAlt} className="px-3 py-1.5 bg-[#3E2723] text-[#FDF5E6] text-xs font-medium rounded hover:bg-[#4E342E] cursor-pointer">
                  Save
                </button>
              </div>
            </div>

            <div className="space-y-2 border-t border-[#D7CCC8] pt-3">
              <h4 className="text-xs font-semibold text-[#3E2723]">References</h4>
              {loadingRefs ? (
                <p className="text-[11px] text-[#8D6E63]">Checking references...</p>
              ) : references ? (
                <div className="space-y-1 text-[11px] bg-white p-2.5 rounded border border-[#D7C9B8]">
                  {references.trailCovers?.length > 0 && <p><span className="font-semibold">Trail Covers:</span> {references.trailCovers.map((t) => t.name).join(", ")}</p>}
                  {references.trailOgMedias?.length > 0 && <p><span className="font-semibold">Trail OG:</span> {references.trailOgMedias.map((t) => t.name).join(", ")}</p>}
                  {references.trailGalleries?.length > 0 && <p><span className="font-semibold">Trail Galleries:</span> {references.trailGalleries.map((g) => g.trailName).join(", ")}</p>}
                  {references.journalCovers?.length > 0 && <p><span className="font-semibold">Journal Covers:</span> {references.journalCovers.map((j) => j.title).join(", ")}</p>}
                  {references.journalOgMedias?.length > 0 && <p><span className="font-semibold">Journal OG:</span> {references.journalOgMedias.map((j) => j.title).join(", ")}</p>}
                  {references.homepageGalleries?.length > 0 && <p><span className="font-semibold">Homepage Galleries:</span> {references.homepageGalleries.length} item(s)</p>}
                  {references.siteHeroMedias?.length > 0 && <p><span className="font-semibold">Site Hero:</span> Yes</p>}
                  {references.siteSeasonalMedias?.length > 0 && <p><span className="font-semibold">Site Seasonal:</span> Yes</p>}
                  {references.inlineHtmlReferences?.length > 0 && (
                    <p className="text-red-700 font-medium"><span className="font-semibold">Inline HTML:</span> {references.inlineHtmlReferences.map((r) => `${r.type} (${r.title})`).join(", ")}</p>
                  )}
                  {references.trailCovers?.length === 0 && references.trailOgMedias?.length === 0 && references.trailGalleries?.length === 0 && references.journalCovers?.length === 0 && references.journalOgMedias?.length === 0 && references.homepageGalleries?.length === 0 && references.siteHeroMedias?.length === 0 && references.siteSeasonalMedias?.length === 0 && references.inlineHtmlReferences?.length === 0 && (
                    <p className="text-green-700 font-medium">No references. Asset is eligible for deletion.</p>
                  )}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-[#D7CCC8] pt-3">
              <a href={activeAsset.secureUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#3E2723] hover:underline">
                View on Cloudinary &#8599;
              </a>
              <div className="flex items-center gap-2">
                <button onClick={handleDeleteAsset} className="px-3 py-1.5 bg-red-700 text-white text-xs font-medium rounded hover:bg-red-800 cursor-pointer">
                  Delete
                </button>
                <button onClick={() => setActiveAsset(null)} className="px-3 py-1.5 bg-[#D7CCC8] text-[#3E2723] text-xs font-medium rounded hover:bg-[#BCAAA4] cursor-pointer">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
