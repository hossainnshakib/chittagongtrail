"use client";

import { useState, useMemo } from "react";
import { isSiteUrlConfigured, getSiteUrl, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo-client";

interface OnPageSeoWorkspaceProps {
  contentType: "trail" | "story" | "food";
  contentTitle: string;
  contentSlug: string;
  contentExcerpt?: string;
  initialMetaTitle?: string | null;
  initialMetaDescription?: string | null;
  coverUrl?: string | null;
  status?: string;
}

export default function OnPageSeoWorkspace({
  contentType,
  contentTitle,
  contentSlug,
  contentExcerpt = "",
  initialMetaTitle = "",
  initialMetaDescription = "",
  coverUrl,
  status = "DRAFT",
}: OnPageSeoWorkspaceProps) {
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription || "");
  const [previewsOpen, setPreviewsOpen] = useState(true);

  const slugPreview = contentSlug
    ? `/${contentType === "trail" ? "trails" : contentType === "food" ? "food" : "journal"}/${contentSlug}`
    : "";

  const effectiveTitle = metaTitle.trim() || contentTitle || SITE_NAME;
  const effectiveDescription = metaDescription.trim() || contentExcerpt || SITE_DESCRIPTION;

  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;

  const titleStatus =
    titleLen === 0
      ? { label: "Fallback: title", style: "text-[#8D6E63]" }
      : titleLen >= 45 && titleLen <= 65
      ? { label: `Recommended (${titleLen}/60)`, style: "text-green-700" }
      : titleLen < 45
      ? { label: `Short (${titleLen}/60)`, style: "text-amber-700" }
      : { label: `Long (${titleLen}/60)`, style: "text-red-600" };

  const descStatus =
    descLen === 0
      ? { label: "Fallback: excerpt", style: "text-[#8D6E63]" }
      : descLen >= 120 && descLen <= 165
      ? { label: `Recommended (${descLen}/160)`, style: "text-green-700" }
      : descLen < 120
      ? { label: `Short (${descLen}/160)`, style: "text-amber-700" }
      : { label: `Long (${descLen}/160)`, style: "text-red-600" };

  const canonicalUrl = slugPreview && isSiteUrlConfigured ? getSiteUrl(slugPreview) : "";

  const seoChecks = useMemo(() => {
    const checks: { ok: boolean; label: string }[] = [];
    checks.push({ ok: !!contentTitle.trim(), label: "Title present" });
    checks.push({ ok: !!contentSlug, label: "Slug present" });
    checks.push({ ok: !!(metaDescription.trim() || contentExcerpt), label: "Description/excerpt present" });
    checks.push({ ok: !!coverUrl, label: "Cover image present" });
    checks.push({ ok: status === "PUBLISHED", label: status === "PUBLISHED" ? "Published (indexable)" : status === "ARCHIVED" ? "Archived (excluded)" : "Draft (not indexable)" });
    checks.push({ ok: !!slugPreview, label: "Canonical route valid" });
    return checks;
  }, [contentTitle, contentSlug, metaDescription, contentExcerpt, coverUrl, status, slugPreview]);

  return (
    <div className="bg-white rounded-lg border border-[#E8DCC8] p-4 space-y-4">
      <h3 className="text-xs font-semibold text-[#5D4037] uppercase tracking-wide">On-page SEO</h3>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: SEO fields */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#5D4037]">Meta Title</label>
              <span className={`text-[10px] ${titleStatus.style}`}>{titleStatus.label}</span>
            </div>
            <input
              type="text"
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={contentTitle || "Page title..."}
              className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#5D4037]">Meta Description</label>
              <span className={`text-[10px] ${descStatus.style}`}>{descStatus.label}</span>
            </div>
            <textarea
              name="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder={contentExcerpt || "Describe this page..."}
              rows={3}
              className="w-full px-2.5 py-1.5 text-sm border border-[#D7C9B8] rounded bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-xs font-medium text-[#5D4037] mb-1">Canonical URL</label>
            {slugPreview ? (
              isSiteUrlConfigured ? (
                <p className="px-2.5 py-1.5 text-xs bg-[#FAF6F0] border border-[#D7C9B8] rounded text-[#5D4037] truncate">
                  {canonicalUrl}
                </p>
              ) : (
                <p className="px-2.5 py-1.5 text-xs bg-[#FAF6F0] border border-[#D7C9B8] rounded text-amber-700 italic">
                  Site URL not configured
                </p>
              )
            ) : (
              <p className="px-2.5 py-1.5 text-xs bg-[#FAF6F0] border border-[#D7C9B8] rounded text-[#8D6E63] italic">
                Enter a slug to preview the canonical URL
              </p>
            )}
          </div>

          {/* Indexing status */}
          <div>
            <label className="block text-xs font-medium text-[#5D4037] mb-1">Indexing</label>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium ${
              status === "PUBLISHED"
                ? "bg-green-50 text-green-700 border border-green-200"
                : status === "ARCHIVED"
                ? "bg-gray-50 text-gray-600 border border-gray-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                status === "PUBLISHED" ? "bg-green-500" : status === "ARCHIVED" ? "bg-gray-400" : "bg-amber-500"
              }`} />
              {status === "PUBLISHED" ? "Eligible for indexing" : status === "ARCHIVED" ? "Excluded from listings" : "Not publicly indexable"}
            </div>
          </div>

          {/* SEO checks */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[#5D4037]">SEO checks</label>
            <div className="grid grid-cols-2 gap-1">
              {seoChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-1.5 text-[10px]">
                  <span className={`w-3 h-3 rounded-full flex items-center justify-center text-white ${check.ok ? "bg-green-500" : "bg-amber-400"}`}>
                    {check.ok ? "✓" : "!"}
                  </span>
                  <span className="text-[#5D4037]">{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Previews */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Google Search Preview */}
          <div className="p-3 bg-[#FAF6F0] rounded border border-[#E8DCC8] space-y-1">
            <p className="text-[10px] font-semibold text-[#8D6E63] uppercase tracking-wide">Google Search Preview</p>
            <div className="bg-white p-2.5 rounded border border-[#D7C9B8] space-y-0.5">
              <p className="text-sm text-[#1a0dab] truncate font-medium">{effectiveTitle}</p>
              <p className="text-[11px] text-[#006621] truncate">
                {canonicalUrl || (slugPreview ? "Site URL not configured" : "https://example.com/...")}
              </p>
              <p className="text-xs text-[#545454] line-clamp-2">{effectiveDescription}</p>
            </div>
            <p className="text-[9px] text-[#8D6E63]">Search engines may rewrite title and snippet.</p>
          </div>

          {/* Social/OG Preview */}
          <div className="p-3 bg-[#FAF6F0] rounded border border-[#E8DCC8] space-y-1.5">
            <p className="text-[10px] font-semibold text-[#8D6E63] uppercase tracking-wide">Social Sharing (OG)</p>
            <div className="bg-white rounded border border-[#D7C9B8] overflow-hidden flex">
              {coverUrl ? (
                <div className="w-28 h-20 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-28 h-20 bg-[#E8DCC8] flex-shrink-0 flex items-center justify-center text-[10px] text-[#5D4037]">
                  No Cover
                </div>
              )}
              <div className="p-2.5 flex flex-col justify-center min-w-0">
                <p className="text-[10px] text-[#8D6E63] uppercase truncate">{SITE_NAME}</p>
                <p className="text-xs font-semibold text-[#5D4037] truncate">{effectiveTitle}</p>
                <p className="text-[11px] text-[#6d4c41] line-clamp-1">{effectiveDescription}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPreviewsOpen(!previewsOpen)}
            className="text-[10px] text-[#8D6E63] hover:text-[#5D4037] cursor-pointer lg:hidden"
          >
            {previewsOpen ? "Hide previews" : "Show previews"}
          </button>
        </div>
      </div>
    </div>
  );
}
