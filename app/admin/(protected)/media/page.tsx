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

const ALLOWED_UPLOAD_FOLDERS = [
  "chittagong-trail/trails",
  "chittagong-trail/journal",
  "chittagong-trail/general",
] as const;

export default function AdminMediaLibraryPage() {
  const [items, setItems] = useState<MediaAssetItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [folderFilter, setFolderFilter] = useState("");

  // Upload modal / state
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState<string>(ALLOWED_UPLOAD_FOLDERS[0]);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Detail / modal state
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

      const res = await fetch(`/api/admin/media/list?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load media assets");
      }
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading media";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [search, formatFilter, folderFilter]);

  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      fetchAssets(1);
      return;
    }
    fetchAssets(1);
  }, [formatFilter, folderFilter, fetchAssets]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets(1);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", uploadFolder);
      if (uploadAlt) formData.append("altText", uploadAlt);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSelectedFile(null);
      setUploadAlt("");
      fetchAssets(1);
      setActionMessage("Media uploaded successfully!");
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
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
        const refData = await refRes.json();
        setReferences(refData);
      }
    } catch (err) {
      console.error("Failed to load references", err);
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
      const msg = err instanceof Error ? err.message : "Failed to update alt text";
      alert(msg);
    }
  };

  const handleDeleteAsset = async () => {
    if (!activeAsset) return;
    if (!confirm("Are you sure you want to delete this media asset? This will permanently destroy the file on Cloudinary if unreferenced.")) {
      return;
    }

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", mediaId: activeAsset.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Deletion failed");
      }
      setActiveAsset(null);
      setActionMessage("Media asset deleted successfully!");
      setTimeout(() => setActionMessage(null), 4000);
      fetchAssets(page);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Deletion blocked or failed";
      alert(msg);
    }
  };

  return (
    <div className="space-y-6" style={{ '--admin-content-max-width': '1400px' } as React.CSSProperties}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[family-name:var(--font-playfair)] font-bold text-[#3E2723]">
            Media Library
          </h1>
          <p className="text-sm text-[#5D4037] mt-1">
            Manage Cloudinary assets, alt texts, and verify structured or inline references. Total: {total}
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-[#4E342E] text-[#FDF5E6] px-4 py-3 rounded-md text-sm font-medium">
          {actionMessage}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D7CCC8]">
        <h2 className="text-lg font-semibold text-[#3E2723] mb-4">Upload New Media Asset</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Select File (Max 5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-[#3E2723] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#3E2723] file:text-[#FDF5E6] hover:file:bg-[#4E342E]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Upload Folder</label>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-md text-sm text-[#3E2723] bg-[#FDF5E6]"
              >
                {ALLOWED_UPLOAD_FOLDERS.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Alt Text (Optional)</label>
              <input
                type="text"
                value={uploadAlt}
                onChange={(e) => setUploadAlt(e.target.value)}
                placeholder="Describe image for accessibility"
                className="w-full px-3 py-2 border border-[#D7CCC8] rounded-md text-sm text-[#3E2723]"
              />
            </div>
          </div>
          {uploadError && <p className="text-red-600 text-xs">{uploadError}</p>}
          <div>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-4 py-2 bg-[#3E2723] text-[#FDF5E6] text-sm font-medium rounded-md hover:bg-[#4E342E] transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading to Cloudinary..." : "Upload Asset"}
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-[#D7CCC8] flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by public ID..."
            className="w-full px-3 py-2 border border-[#D7CCC8] rounded-md text-sm text-[#3E2723]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#3E2723] text-[#FDF5E6] text-sm font-medium rounded-md hover:bg-[#4E342E] transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-4">
          <div>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="px-3 py-2 border border-[#D7CCC8] rounded-md text-sm text-[#3E2723] bg-[#FDF5E6]"
            >
              <option value="">All Formats</option>
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
              <option value="gif">GIF</option>
            </select>
          </div>
          <div>
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="px-3 py-2 border border-[#D7CCC8] rounded-md text-sm text-[#3E2723] bg-[#FDF5E6]"
            >
              <option value="">All Folders</option>
              {ALLOWED_UPLOAD_FOLDERS.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="text-center py-12 text-[#5D4037]">Loading media assets...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#D7CCC8] text-[#5D4037]">
          No media assets found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((asset) => {
            const refCount =
              (asset._count?.trailCovers || 0) +
              (asset._count?.trailOgMedias || 0) +
              (asset._count?.trailGalleries || 0) +
              (asset._count?.journalCovers || 0) +
              (asset._count?.journalOgMedias || 0) +
              (asset._count?.homepageGalleries || 0) +
              (asset._count?.siteHeroMedias || 0) +
              (asset._count?.siteSeasonalMedias || 0);

            return (
              <div
                key={asset.id}
                onClick={() => openAssetDetail(asset)}
                className="bg-white rounded-lg shadow-sm border border-[#D7CCC8] overflow-hidden cursor-pointer hover:border-[#3E2723] transition-all flex flex-col"
              >
                <div className="h-40 bg-[#FDF5E6] relative flex items-center justify-center overflow-hidden border-b border-[#D7CCC8]">
                  <Image
                    src={asset.secureUrl}
                    alt={asset.altText || asset.publicId}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {refCount > 0 && (
                    <span className="absolute top-2 right-2 bg-[#3E2723] text-[#FDF5E6] text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      {refCount} ref{refCount > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-xs font-mono text-[#5D4037] truncate" title={asset.publicId}>
                      {asset.publicId}
                    </p>
                    <p className="text-xs text-[#3E2723] mt-1 line-clamp-1">
                      {asset.altText ? asset.altText : <span className="italic opacity-60">No alt text</span>}
                    </p>
                  </div>
                  <div className="text-[11px] text-[#5D4037] flex justify-between items-center pt-2 border-t border-[#EFEBE9]">
                    <span>{asset.width && asset.height ? `${asset.width}x${asset.height}` : "Unknown dim"}</span>
                    <span className="uppercase font-semibold">{asset.format || "img"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => fetchAssets(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 bg-white border border-[#D7CCC8] rounded text-sm text-[#3E2723] disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[#3E2723]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchAssets(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 bg-white border border-[#D7CCC8] rounded text-sm text-[#3E2723] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {activeAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FDF5E6] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 border border-[#3E2723]">
            <div className="flex items-center justify-between border-b border-[#D7CCC8] pb-4">
              <h3 className="text-xl font-[family-name:var(--font-playfair)] font-bold text-[#3E2723]">
                Media Details
              </h3>
              <button
                onClick={() => setActiveAsset(null)}
                className="text-sm text-[#5D4037] hover:text-[#3E2723] font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-2 rounded border border-[#D7CCC8] flex items-center justify-center h-48 relative">
                <Image
                  src={activeAsset.secureUrl}
                  alt={activeAsset.altText || activeAsset.publicId}
                  fill
                  sizes="300px"
                  className="object-contain"
                />
              </div>
              <div className="space-y-3 text-sm text-[#3E2723]">
                <div>
                  <span className="font-semibold text-[#5D4037]">Public ID:</span>
                  <p className="font-mono text-xs break-all bg-white p-1.5 rounded border border-[#D7CCC8] mt-0.5">
                    {activeAsset.publicId}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#5D4037]">Secure URL:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      type="text"
                      readOnly
                      value={activeAsset.secureUrl}
                      className="w-full text-xs font-mono bg-white p-1.5 rounded border border-[#D7CCC8]"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeAsset.secureUrl);
                        alert("Secure URL copied to clipboard!");
                      }}
                      className="px-2.5 py-1 bg-[#3E2723] text-[#FDF5E6] text-xs rounded hover:bg-[#4E342E]"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="font-semibold text-[#5D4037]">Dimensions:</span>
                    <p>{activeAsset.width && activeAsset.height ? `${activeAsset.width} × ${activeAsset.height}` : "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#5D4037]">Format:</span>
                    <p className="uppercase">{activeAsset.format || "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alt Text Management */}
            <div className="space-y-2 border-t border-[#D7CCC8] pt-4">
              <label className="block text-sm font-semibold text-[#3E2723]">Alt Text (Accessibility)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingAlt}
                  onChange={(e) => setEditingAlt(e.target.value)}
                  placeholder="Meaningful description or leave empty for decorative"
                  className="w-full px-3 py-2 border border-[#D7CCC8] rounded-md text-sm bg-white text-[#3E2723]"
                />
                <button
                  onClick={handleUpdateAlt}
                  className="px-4 py-2 bg-[#3E2723] text-[#FDF5E6] text-sm font-medium rounded-md hover:bg-[#4E342E]"
                >
                  Save Alt
                </button>
              </div>
              <p className="text-xs text-[#5D4037]">
                Meaningful images should have descriptive alt text; decorative images may intentionally remain empty.
              </p>
            </div>

            {/* Reference Summary */}
            <div className="space-y-2 border-t border-[#D7CCC8] pt-4">
              <h4 className="text-sm font-semibold text-[#3E2723]">Reference Summary</h4>
              {loadingRefs ? (
                <p className="text-xs text-[#5D4037]">Checking structured & inline references...</p>
              ) : references ? (
                <div className="space-y-2 text-xs bg-white p-3 rounded border border-[#D7CCC8]">
                  {references.trailCovers?.length > 0 && (
                    <p><span className="font-semibold">Trail Covers:</span> {references.trailCovers.map((t) => t.name).join(", ")}</p>
                  )}
                  {references.trailOgMedias?.length > 0 && (
                    <p><span className="font-semibold">Trail OG:</span> {references.trailOgMedias.map((t) => t.name).join(", ")}</p>
                  )}
                  {references.trailGalleries?.length > 0 && (
                    <p><span className="font-semibold">Trail Galleries:</span> {references.trailGalleries.map((g) => g.trailName).join(", ")}</p>
                  )}
                  {references.journalCovers?.length > 0 && (
                    <p><span className="font-semibold">Journal Covers:</span> {references.journalCovers.map((j) => j.title).join(", ")}</p>
                  )}
                  {references.journalOgMedias?.length > 0 && (
                    <p><span className="font-semibold">Journal OG:</span> {references.journalOgMedias.map((j) => j.title).join(", ")}</p>
                  )}
                  {references.homepageGalleries?.length > 0 && (
                    <p><span className="font-semibold">Homepage Galleries:</span> {references.homepageGalleries.length} item(s)</p>
                  )}
                  {references.siteHeroMedias?.length > 0 && (
                    <p><span className="font-semibold">Site Hero Media:</span> Yes</p>
                  )}
                  {references.siteSeasonalMedias?.length > 0 && (
                    <p><span className="font-semibold">Site Seasonal Media:</span> Yes</p>
                  )}
                  {references.inlineHtmlReferences?.length > 0 && (
                    <p className="text-red-700 font-medium">
                      <span className="font-semibold">Inline HTML References:</span> {references.inlineHtmlReferences.map((r) => `${r.type} (${r.title})`).join(", ")}
                    </p>
                  )}
                  {(!references.trailCovers?.length &&
                    !references.trailOgMedias?.length &&
                    !references.trailGalleries?.length &&
                    !references.journalCovers?.length &&
                    !references.journalOgMedias?.length &&
                    !references.homepageGalleries?.length &&
                    !references.siteHeroMedias?.length &&
                    !references.siteSeasonalMedias?.length &&
                    !references.inlineHtmlReferences?.length) && (
                    <p className="text-green-700 font-medium">No references found. Asset is eligible for deletion.</p>
                  )}
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-[#D7CCC8] pt-4">
              <a
                href={activeAsset.secureUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-[#3E2723] hover:underline"
              >
                View on Cloudinary ↗
              </a>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteAsset}
                  className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded-md hover:bg-red-800 transition-colors"
                >
                  Delete Asset
                </button>
                <button
                  onClick={() => setActiveAsset(null)}
                  className="px-4 py-2 bg-[#D7CCC8] text-[#3E2723] text-sm font-medium rounded-md hover:bg-[#BCAAA4]"
                >
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
