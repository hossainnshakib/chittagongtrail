"use client";

import { useState } from "react";

interface SeoPanelProps {
  initialMetaTitle?: string | null;
  initialMetaDescription?: string | null;
  defaultTitle?: string;
  defaultDescription?: string;
  canonicalPath: string;
  coverUrl?: string | null;
}

export default function SeoPanel({
  initialMetaTitle = "",
  initialMetaDescription = "",
  defaultTitle = "",
  defaultDescription = "",
  canonicalPath,
  coverUrl,
}: SeoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription || "");

  const effectiveTitle = metaTitle.trim() || defaultTitle || "Chittagong Trail";
  const effectiveDescription = metaDescription.trim() || defaultDescription || "Explore scenic trails and stories across the Chittagong Hill Tracts.";

  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  const titleStatus =
    titleLen === 0
      ? { text: "Will fallback to title", color: "text-[#8D6E63]" }
      : titleLen >= 45 && titleLen <= 65
      ? { text: `Optimal (${titleLen}/60)`, color: "text-green-700" }
      : titleLen < 45
      ? { text: `Too short (${titleLen}/60 recommended)`, color: "text-amber-700" }
      : { text: `Too long (${titleLen}/60 recommended)`, color: "text-red-700" };

  const descStatus =
    descLen === 0
      ? { text: "Will fallback to excerpt", color: "text-[#8D6E63]" }
      : descLen >= 120 && descLen <= 165
      ? { text: `Optimal (${descLen}/160)`, color: "text-green-700" }
      : descLen < 120
      ? { text: `Too short (${descLen}/160 recommended)`, color: "text-amber-700" }
      : { text: `Too long (${descLen}/160 recommended)`, color: "text-red-700" };

  const origin = typeof window !== "undefined" ? window.location.origin : "https://chittagongtrail.com";
  const fullCanonicalUrl = `${origin}${canonicalPath}`;

  return (
    <div className="bg-white rounded-lg border border-[#E8DCC8] p-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs font-semibold text-[#5D4037] uppercase tracking-wide cursor-pointer"
      >
        <span>On-Page SEO &amp; Preview</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-4 pt-3 border-t border-[#FAF6F0]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="metaTitle" className="block text-xs font-medium text-[#5D4037]">Meta Title</label>
              <span className={`text-[11px] ${titleStatus.color}`}>{titleStatus.text}</span>
            </div>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={defaultTitle}
              className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="metaDescription" className="block text-xs font-medium text-[#5D4037]">Meta Description</label>
              <span className={`text-[11px] ${descStatus.color}`}>{descStatus.text}</span>
            </div>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder={defaultDescription}
              rows={3}
              className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>

          {/* Search Result Preview */}
          <div className="p-3 bg-[#FAF6F0] rounded border border-[#E8DCC8] space-y-1">
            <p className="text-[11px] font-semibold text-[#8D6E63] uppercase tracking-wide">Google Search Snippet Preview</p>
            <div className="bg-white p-2.5 rounded border border-[#D7C9B8] space-y-0.5">
              <p className="text-xs text-[#1a0dab] truncate font-medium">{effectiveTitle}</p>
              <p className="text-[11px] text-[#006621] truncate">{fullCanonicalUrl}</p>
              <p className="text-xs text-[#545454] line-clamp-2">{effectiveDescription}</p>
            </div>
          </div>

          {/* Social / OG Preview */}
          <div className="p-3 bg-[#FAF6F0] rounded border border-[#E8DCC8] space-y-1.5">
            <p className="text-[11px] font-semibold text-[#8D6E63] uppercase tracking-wide">Social Sharing Preview (OG)</p>
            <div className="bg-white rounded border border-[#D7C9B8] overflow-hidden flex flex-col sm:flex-row">
              {coverUrl ? (
                <div className="w-full sm:w-28 h-20 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full sm:w-28 h-20 bg-[#E8DCC8] flex-shrink-0 flex items-center justify-center text-[10px] text-[#5D4037]">
                  No Cover
                </div>
              )}
              <div className="p-2.5 flex flex-col justify-center min-w-0">
                <p className="text-[10px] text-[#8D6E63] uppercase truncate">{new URL(fullCanonicalUrl).hostname}</p>
                <p className="text-xs font-semibold text-[#5D4037] truncate">{effectiveTitle}</p>
                <p className="text-[11px] text-[#6d4c41] line-clamp-1">{effectiveDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
