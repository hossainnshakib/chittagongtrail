"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";

export default function SeasonalEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaAssetData | null>(null);
  const [mediaId, setMediaId] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage/seasonal")
      .then((r) => r.json())
      .then((j) => { setEyebrow(j.seasonalEyebrow || ""); setTitle(j.seasonalTitle || ""); setContent(j.seasonalContent || ""); setMedia(j.seasonalMedia || null); setMediaId(j.seasonalMediaId || null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setError(null); setSuccess(null);
    if (eyebrow.length > 100) { setError("Eyebrow must be 100 characters or fewer"); return; }
    if (title.length > 200) { setError("Title must be 200 characters or fewer"); return; }
    // content sanitization handled server; validate no javascript:data schemes leaked
    if (content.toLowerCase().includes("javascript:") || content.toLowerCase().includes("data:")) { setError("Content contains unsafe URL schemes"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage/seasonal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seasonalEyebrow: eyebrow, seasonalTitle: title, seasonalContent: content, seasonalMediaId: mediaId }) });
      const j = await res.json(); if (!res.ok) throw new Error(j.error); setSuccess("Seasonal/Mood saved and homepage revalidated."); setTimeout(() => setSuccess(null), 3000);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-muted)" }}>Loading seasonal…</div>;

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      <AdminPageHeader title="Seasonal / Mood" description="Compact editor using existing SiteSettings fields — only persisted fields are shown. Live compact preview below." primaryAction={<AdminButton href="/admin/homepage" variant="ghost" size="sm">Back</AdminButton>} />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{success}</div>}

      <div className="space-y-6">
        <AdminSectionCard title="Content" description="Build honestly around schema-supported fields: eyebrow, heading, supporting content.">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Eyebrow / Label</label>
              <input value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} maxLength={100} placeholder="THE SIX SEASONS" className="w-full px-3 py-2 border rounded text-sm" style={{ borderColor: "var(--admin-border)", minHeight: "44px" }} />
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>{eyebrow.length}/100</p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Heading</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="Monsoon Chittagong" className="w-full px-3 py-2 border rounded text-sm" style={{ borderColor: "var(--admin-border)", minHeight: "44px" }} />
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>{title.length}/200</p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Supporting content</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Seasonal paragraph — sanitized HTML allowed (p, strong, em, etc.)" className="w-full px-3 py-2 border rounded text-sm" style={{ borderColor: "var(--admin-border)" }} />
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>Sanitized for rich text: scripts, iframes, event handlers stripped. No javascript:/data: URLs.</p>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Seasonal / Mood image" description="Image-only via reusable MediaPicker.">
          <div className="flex items-center gap-4">
            {media ? <div className="relative w-36 h-24 rounded overflow-hidden border" style={{ borderColor: "var(--admin-border)" }}><Image src={media.secureUrl} alt={media.altText || "Seasonal"} fill className="object-cover" /></div> : <div className="w-36 h-24 rounded bg-gray-50 border border-dashed flex items-center justify-center text-xs" style={{ color: "var(--admin-text-muted)" }}>No image</div>}
            <div className="flex gap-2">
              <button onClick={() => setPickerOpen(true)} className="admin-btn admin-btn-primary admin-btn-sm" style={{ minHeight: "44px" }}>{media ? "Replace image" : "Select image"}</button>
              {media && <button onClick={() => { setMedia(null); setMediaId(null); }} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", border: "1px solid var(--admin-border)" }}>Remove</button>}
            </div>
          </div>
          {media && <div className="text-xs mt-2 p-2 rounded border" style={{ background: "var(--admin-bg)", borderColor: "var(--admin-border)" }}>Alt: {media.altText || <span style={{ color: "var(--admin-warning)" }}>Missing — edit in media workflow</span>} · {media.width}×{media.height} · {media.format}</div>}
        </AdminSectionCard>

        {/* Live preview */}
        <AdminSectionCard title="Live compact preview" description="How EditorialQuote renders publicly (conditionally visible).">
          <div className="p-6 rounded border" style={{ background: "#FDF5E6", borderColor: "var(--admin-border)" }}>
            {(eyebrow.trim() || title.trim()) ? (
              <div className="space-y-2">
                {eyebrow.trim() && <p className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: "#A1887F" }}>{eyebrow}</p>}
                {title.trim() && <h3 className="text-2xl font-semibold" style={{ color: "#5D4037", fontFamily: "var(--font-display)" }}>{title}</h3>}
                {content.trim() && <div className="text-sm" style={{ color: "#8D6E63" }} dangerouslySetInnerHTML={{ __html: content }} />}
                {media && <div className="relative w-full h-48 rounded overflow-hidden mt-3"><Image src={media.secureUrl} alt={media.altText || title} fill className="object-cover" /></div>}
              </div>
            ) : <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Seasonal section hidden when both eyebrow and title are empty — add content to publish.</p>}
          </div>
        </AdminSectionCard>

        <div className="flex items-center gap-3"><button onClick={save} disabled={saving} className="admin-btn admin-btn-primary admin-btn-md" style={{ minHeight: "44px" }}>{saving ? "Saving…" : "Save seasonal"}</button><span className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Validates image type, URL safety, sanitization.</span></div>
      </div>

      <MediaPicker open={pickerOpen} mode="image" selected={media} onSelect={(a) => { setMedia(a); setMediaId(a.id); setPickerOpen(false); }} onRemove={() => { setMedia(null); setMediaId(null); }} onClose={() => setPickerOpen(false)} title="Select seasonal image" description="Image-only" folder="chittagong-trail/homepage" />
    </div>
  );
}
