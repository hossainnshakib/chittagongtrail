"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";

interface CoverImageModuleProps {
  asset: MediaAssetData | null;
  onAssetChange: (asset: MediaAssetData | null) => void;
  useCoverForOg: boolean;
  onUseCoverForOgChange: (value: boolean) => void;
  ogAsset: MediaAssetData | null;
  onOgAssetChange: (asset: MediaAssetData | null) => void;
  folder?: string;
}

export default function CoverImageModule({
  asset,
  onAssetChange,
  useCoverForOg,
  onUseCoverForOgChange,
  ogAsset,
  onOgAssetChange,
  folder = "chittagong-trail/general",
}: CoverImageModuleProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [ogPickerOpen, setOgPickerOpen] = useState(false);
  const [altText, setAltText] = useState(asset?.altText || "");
  const [savingAlt, setSavingAlt] = useState(false);
  const [altSaved, setAltSaved] = useState(false);
  const [isDecorative, setIsDecorative] = useState(!asset?.altText);
  const [showDetails, setShowDetails] = useState(false);

  const saveAltText = useCallback(async () => {
    if (!asset) return;
    setSavingAlt(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateAltText",
          mediaId: asset.id,
          altText: isDecorative ? "" : altText.trim(),
        }),
      });
      if (res.ok) {
        onAssetChange({ ...asset, altText: isDecorative ? null : altText.trim() || null });
        setAltSaved(true);
        setTimeout(() => setAltSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSavingAlt(false);
    }
  }, [asset, altText, isDecorative, onAssetChange]);

  const handleSelect = (a: MediaAssetData) => {
    onAssetChange(a);
    setAltText(a.altText || "");
    setIsDecorative(!a.altText);
    setPickerOpen(false);
  };

  const handleRemove = () => {
    onAssetChange(null);
    setAltText("");
    setIsDecorative(true);
  };

  const handleOgSelect = (a: MediaAssetData) => {
    onOgAssetChange(a);
    setOgPickerOpen(false);
  };

  const aspectRatio = asset?.width && asset?.height
    ? (asset.width / asset.height).toFixed(2)
    : null;
  const isSmall = asset?.width != null && asset.width < 1200;

  return (
    <div className="space-y-3">
      {/* Cover image header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#5D4037] uppercase tracking-wide">Cover Image &amp; Image SEO</h3>
        {asset && (
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] text-[#8D6E63] hover:text-[#5D4037] cursor-pointer"
          >
            {showDetails ? "Hide" : "Details"}
          </button>
        )}
      </div>

      {/* Image preview / select */}
      {asset ? (
        <div className="space-y-1.5">
          <div className="relative w-full aspect-video rounded-md overflow-hidden border border-[#D7C9B8] bg-[#FDF5E6]">
            {asset.resourceType === "video" ? (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            ) : (
              <Image src={asset.secureUrl} alt={asset.altText || "Cover"} fill className="object-cover" sizes="300px" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex-1 px-2 py-1 text-xs bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded transition-colors cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full h-20 border border-dashed border-[#D7C9B8] rounded bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors flex flex-col items-center justify-center cursor-pointer"
        >
          <svg className="w-5 h-5 text-[#5D4037]/40 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
          </svg>
          <span className="text-[11px] text-[#5D4037]">Select cover image</span>
        </button>
      )}

      {/* Alt text */}
      {asset && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-[#5D4037]">Alt Text</label>
            <span className="text-[10px] text-[#8D6E63]">{altText.length} chars</span>
          </div>
          <input
            type="text"
            value={isDecorative ? "" : altText}
            onChange={(e) => { setAltText(e.target.value); setIsDecorative(false); }}
            disabled={isDecorative}
            placeholder="Describe this image for accessibility..."
            className="w-full px-2 py-1.5 text-xs border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] disabled:bg-[#F5F0EB] disabled:opacity-60"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="coverIsDecorative"
              checked={isDecorative}
              onChange={(e) => { setIsDecorative(e.target.checked); if (e.target.checked) setAltText(""); }}
              className="w-3 h-3 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882]"
            />
            <label htmlFor="coverIsDecorative" className="text-[11px] text-[#8D6E63]">Decorative image</label>
          </div>
          {!isDecorative && !altText.trim() && (
            <p className="text-[10px] text-amber-700">Add alt text for accessibility and SEO.</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveAltText}
              disabled={savingAlt || (!isDecorative && !altText.trim())}
              className="px-2.5 py-1 text-[11px] bg-[#5D4037] hover:bg-[#4E342E] text-white rounded transition-colors cursor-pointer disabled:opacity-50"
            >
              {savingAlt ? "Saving..." : altSaved ? "Saved" : "Save Alt Text"}
            </button>
            {asset && (
              <p className="text-[10px] text-[#8D6E63] italic">
                Updating affects all usages of this media asset.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Technical details (collapsible) */}
      {asset && showDetails && (
        <div className="p-2 bg-[#FAF6F0] rounded border border-[#E8DCC8] space-y-1 text-[10px] text-[#5D4037]">
          {asset.width && asset.height && (
            <p>{asset.width} × {asset.height}px {aspectRatio && `(${aspectRatio})`}</p>
          )}
          {asset.format && <p>Format: {asset.format.toUpperCase()}</p>}
          <p>Type: {asset.resourceType}</p>
          {isSmall && <p className="text-amber-700">Image may be small for cover use (recommended ≥ 1200px wide).</p>}
        </div>
      )}

      {/* OG / Social sharing */}
      <div className="space-y-1.5 pt-2 border-t border-[#FAF6F0]">
        <h4 className="text-[11px] font-semibold text-[#5D4037] uppercase tracking-wide">Social Sharing (OG)</h4>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useCoverForOg"
            checked={useCoverForOg}
            onChange={(e) => {
              onUseCoverForOgChange(e.target.checked);
              if (e.target.checked) onOgAssetChange(null);
            }}
            className="w-3 h-3 text-[#C9A882] border-[#D7C9B8] rounded focus:ring-[#C9A882]"
          />
          <label htmlFor="useCoverForOg" className="text-[11px] text-[#5D4037]">Use cover image for social sharing</label>
        </div>
        {useCoverForOg ? (
          <p className="text-[10px] text-[#8D6E63]">OG image falls back to cover.</p>
        ) : ogAsset ? (
          <div className="space-y-1.5">
            <div className="relative w-full h-24 rounded overflow-hidden border border-[#D7C9B8] bg-[#FDF5E6]">
              <Image src={ogAsset.secureUrl} alt="OG" fill className="object-cover" sizes="200px" />
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setOgPickerOpen(true)} className="flex-1 px-2 py-1 text-[11px] bg-[#E8DCC8] hover:bg-[#D7C9B8] text-[#5D4037] rounded cursor-pointer">Replace</button>
              <button type="button" onClick={() => onOgAssetChange(null)} className="px-2 py-1 text-[11px] text-red-600 hover:text-red-800 cursor-pointer">Remove</button>
            </div>
            <p className="text-[10px] text-[#8D6E63]">1200 × 630 recommended for social sharing.</p>
          </div>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setOgPickerOpen(true)}
              className="w-full h-14 border border-dashed border-[#D7C9B8] rounded bg-[#FDF5E6] hover:bg-[#F5E6D0] transition-colors flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-[11px] text-[#5D4037]">Select custom social image</span>
            </button>
            <p className="text-[10px] text-[#8D6E63]">1200 × 630 recommended.</p>
          </div>
        )}
      </div>

      <MediaPicker open={pickerOpen} mode="image" selected={asset} folder={folder} onSelect={handleSelect} onClose={() => setPickerOpen(false)} title="Select Cover Image" />
      <MediaPicker open={ogPickerOpen} mode="image" selected={ogAsset} folder={folder} onSelect={handleOgSelect} onClose={() => setOgPickerOpen(false)} title="Select Social Image (OG)" />
    </div>
  );
}
