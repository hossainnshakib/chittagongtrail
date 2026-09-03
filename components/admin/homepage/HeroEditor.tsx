"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminSaveStatus from "@/components/admin/ui/AdminSaveStatus";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";

interface HeroData {
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId: number | null;
  heroMedia: MediaAssetData | null;
  heroVideoEnabled: boolean;
  heroVideoProvider: "NONE" | "YOUTUBE" | "VIMEO" | "DIRECT";
  heroVideoUrl: string | null;
  heroVideoOverlay: number;
}

export default function HeroEditor() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroMedia, setHeroMedia] = useState<MediaAssetData | null>(null);
  const [heroMediaId, setHeroMediaId] = useState<number | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoProvider, setVideoProvider] = useState<"NONE" | "YOUTUBE" | "VIMEO" | "DIRECT">("NONE");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoMedia, setVideoMedia] = useState<MediaAssetData | null>(null);
  const [overlay, setOverlay] = useState(45);

  const [posterPickerOpen, setPosterPickerOpen] = useState(false);
  const [videoPickerOpen, setVideoPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/homepage/hero")
      .then((r) => r.json())
      .then((j: HeroData) => {
        setData(j);
        setHeroTitle(j.heroTitle || "");
        setHeroSubtitle(j.heroSubtitle || "");
        setHeroMedia(j.heroMedia || null);
        setHeroMediaId(j.heroMediaId);
        setVideoEnabled(j.heroVideoEnabled);
        setVideoProvider(j.heroVideoProvider);
        setVideoUrl(j.heroVideoUrl || "");
        setOverlay(j.heroVideoOverlay ?? 45);
        if (j.heroVideoProvider === "DIRECT" && j.heroVideoUrl) {
          // try to resolve video media asset by URL later
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Sync videoMedia when videoUrl matches a known asset: fetch asset details if DIRECT?
  // We keep videoMedia separate; validation will handle.

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setValidationMsg(null);
    // Client-side validation
    if (videoEnabled && !heroMediaId) {
      setValidationMsg("Poster image is required whenever Hero is enabled.");
      return;
    }
    if (videoEnabled && videoProvider !== "NONE" && !videoUrl.trim()) {
      setValidationMsg("Video URL is required when video is enabled.");
      return;
    }
    if (heroTitle.includes("<") || heroTitle.includes(">") || heroSubtitle.includes("<") || heroSubtitle.includes(">")) {
      setValidationMsg("Title and subtitle must not contain HTML. Use *text* for italic emphasis.");
      return;
    }
    if (heroTitle.trim().length > 200) {
      setValidationMsg("Hero title must be 200 characters or fewer.");
      return;
    }
    if (heroSubtitle.trim().length > 500) {
      setValidationMsg("Supporting paragraph must be 500 characters or fewer.");
      return;
    }
    if (videoProvider === "YOUTUBE" && videoEnabled && videoUrl) {
      if (!/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/.test(videoUrl)) {
        setValidationMsg("Invalid YouTube URL.");
        return;
      }
    }
    if (videoProvider === "VIMEO" && videoEnabled && videoUrl) {
      if (!/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/.test(videoUrl)) {
        setValidationMsg("Invalid Vimeo URL.");
        return;
      }
    }
    if (videoProvider === "DIRECT" && videoEnabled && videoUrl) {
      if (!videoUrl.startsWith("https://")) {
        setValidationMsg("Direct video URL must be HTTPS.");
        return;
      }
      if (videoUrl.toLowerCase().includes("javascript:") || videoUrl.toLowerCase().includes("data:")) {
        setValidationMsg("Unsafe video URL.");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          heroMediaId,
          heroVideoEnabled: videoEnabled,
          heroVideoProvider: videoProvider,
          heroVideoUrl: videoUrl || null,
          heroVideoOverlay: overlay,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to save");
      setSuccess("Hero saved and public homepage revalidated.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-muted)" }}>Loading hero…</div>;
  if (error && !data) return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>;

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      <AdminPageHeader
        title="Hero"
        description="Configure the public homepage hero — title, supporting text, poster image and Cloudinary-native background video."
        primaryAction={<AdminButton href="/admin/homepage" variant="ghost" size="sm">Back to Overview</AdminButton>}
      />

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm" role="alert">{error}</div>}
      {validationMsg && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-sm" role="alert">{validationMsg}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{success}</div>}

      <div className="space-y-6">
        {/* Enabled toggle */}
        <AdminSectionCard title="Visibility" description="Control whether the hero background video system is active. Poster is required when enabled.">
          <label className="flex items-center gap-3 cursor-pointer" style={{ minHeight: "44px" }}>
            <input type="checkbox" checked={videoEnabled} onChange={(e) => setVideoEnabled(e.target.checked)} className="w-4 h-4 rounded border" style={{ accentColor: "var(--admin-brand-accent)" }} />
            <span className="text-sm font-medium">Hero enabled</span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: videoEnabled ? "#D1FAE5" : "#F3F4F6", color: videoEnabled ? "#065F46" : "#6B7280" }}>{videoEnabled ? "Enabled" : "Disabled"}</span>
          </label>
          {!videoEnabled && <p className="text-xs mt-2" style={{ color: "var(--admin-text-muted)" }}>When disabled, the public hero still shows the poster image (or its fallback) without video logic.</p>}
        </AdminSectionCard>

        {/* Title / Subtitle */}
        <AdminSectionCard title="Copy" description="Hero title and supporting paragraph. The homepage H1 is rendered from this title — exactly one H1 per homepage.">
          <div className="space-y-4">
            <div>
              <label htmlFor="heroTitle" className="block text-xs font-medium mb-1" style={{ color: "var(--admin-text-primary)" }}>Hero title</label>
              <input
                id="heroTitle"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                maxLength={200}
                placeholder="Five Districts. Hills to the Sea. *One Chittagong.*"
                className="w-full px-3 py-2 border rounded text-sm"
                style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)", minHeight: "44px" }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>Use *text* to italicize a phrase. No HTML allowed. {heroTitle.length}/200</p>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>Visible guidance: keep title concise and editorial; *One Chittagong.* will render italic on the public site.</p>
            </div>
            <div>
              <label htmlFor="heroSubtitle" className="block text-xs font-medium mb-1">Supporting paragraph</label>
              <textarea
                id="heroSubtitle"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="From the cloud-piercing peaks of the Chittagong Hill Tracts to the golden sands of Cox's Bazar — five districts, one unbroken trail."
                className="w-full px-3 py-2 border rounded text-sm"
                style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>{heroSubtitle.length}/500 · Remains readable at 390px without clipping or zoom issues.</p>
            </div>
            {/* Preview */}
            <div className="p-4 rounded border" style={{ background: "#3E2723", borderColor: "#5D4037" }}>
              <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: "#8D6E63" }}>Live compact preview</p>
              <h2 className="text-lg font-semibold leading-tight" style={{ color: "#FDF5E6" }} dangerouslySetInnerHTML={{ __html: (heroTitle.trim() || "Five Districts.<br/>Hills to the Sea.<br/><em class='italic font-normal'>One Chittagong.</em>").replace(/\n/g, "<br/>").replace(/\*(.*?)\*/g, "<em class='italic font-normal'>$1</em>") }} />
              <p className="text-sm mt-2" style={{ color: "rgba(253,245,230,0.6)" }}>{heroSubtitle.trim() || "From the cloud-piercing peaks of the Chittagong Hill Tracts to the golden sands of Cox's Bazar — five districts, one unbroken trail."}</p>
            </div>
          </div>
        </AdminSectionCard>

        {/* Poster */}
        <AdminSectionCard title="Poster / Cover image" description="Required when Hero is enabled. Wide landscape image recommended. Used immediately on initial load and as fallback. Image-only.">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {heroMedia ? (
                <div className="relative w-36 h-24 rounded overflow-hidden border" style={{ borderColor: "var(--admin-border)" }}>
                  <Image src={heroMedia.secureUrl} alt={heroMedia.altText || "Hero poster"} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-36 h-24 rounded bg-gray-50 border border-dashed flex items-center justify-center text-xs" style={{ color: "var(--admin-text-muted)", borderColor: "var(--admin-border)" }}>No poster selected</div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPosterPickerOpen(true)}
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  style={{ minHeight: "44px" }}
                >
                  {heroMedia ? "Replace poster" : "Select poster"}
                </button>
                {heroMedia && (
                  <button
                    type="button"
                    onClick={() => { setHeroMedia(null); setHeroMediaId(null); }}
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    style={{ minHeight: "44px", border: "1px solid var(--admin-border)" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {heroMedia && (
              <div className="text-xs p-2 rounded border" style={{ background: "var(--admin-bg)", borderColor: "var(--admin-border)", color: "var(--admin-text-secondary)" }}>
                <div>Dimensions: {heroMedia.width ?? "—"} × {heroMedia.height ?? "—"} · Format: {heroMedia.format || "—"} · Resource: {heroMedia.resourceType || "image"}</div>
                <div>Alt: {heroMedia.altText ? `"${heroMedia.altText}"` : <span style={{ color: "var(--admin-warning)" }}>Missing alt text — edit in Media Library for accessibility</span>}</div>
                <div>Public ID: <code className="text-xs">{heroMedia.publicId}</code></div>
              </div>
            )}
            {!heroMedia && videoEnabled && <p className="text-xs p-2 rounded" style={{ background: "#FEF3C7", color: "#92400E" }}>Poster is required when Hero is enabled.</p>}
            <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Poster remains the accessible visual fallback. If decorative, leave alt empty only when semantically correct.</p>
          </div>
        </AdminSectionCard>

        {/* Video */}
        <AdminSectionCard title="Background video" description="Optional · Cloudinary-native preferred. Video is decorative, muted autoplay, no controls, no keyboard focus. Shows poster until video actually plays.">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="videoProvider" className="block text-xs font-medium mb-1">Provider</label>
                <select
                  id="videoProvider"
                  value={videoProvider}
                  onChange={(e) => setVideoProvider(e.target.value as never)}
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)", minHeight: "44px" }}
                >
                  <option value="NONE">No video / Poster only</option>
                  <option value="DIRECT">Cloudinary / Direct (MP4/WebM) — Recommended</option>
                  <option value="YOUTUBE">YouTube fallback (may show branding)</option>
                  <option value="VIMEO">Vimeo fallback (may show branding)</option>
                </select>
              </div>
              <div>
                <label htmlFor="videoOverlay" className="block text-xs font-medium mb-1">Overlay darkness: {overlay}%</label>
                <input type="range" id="videoOverlay" min={0} max={100} value={overlay} onChange={(e) => setOverlay(Number(e.target.value))} className="w-full" />
                <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Stable gradient ensures contrast over bright and dark media.</p>
              </div>
            </div>

            {videoProvider === "DIRECT" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {videoMedia ? (
                    <div className="w-36 h-24 rounded bg-black flex items-center justify-center border" style={{ borderColor: "var(--admin-border)" }}>
                      <span className="text-white text-xs">▶ {videoMedia.format?.toUpperCase() || "VIDEO"}</span>
                    </div>
                  ) : videoUrl ? (
                    <div className="w-36 h-24 rounded bg-gray-100 flex items-center justify-center border text-xs p-2" style={{ borderColor: "var(--admin-border)" }}>{videoUrl.slice(0, 48)}…</div>
                  ) : (
                    <div className="w-36 h-24 rounded bg-gray-50 border border-dashed flex items-center justify-center text-xs" style={{ color: "var(--admin-text-muted)" }}>No video selected</div>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setVideoPickerOpen(true)} className="admin-btn admin-btn-primary admin-btn-sm" style={{ minHeight: "44px" }}>{videoMedia || videoUrl ? "Replace video" : "Select Cloudinary video"}</button>
                    {(videoMedia || videoUrl) && (
                      <button type="button" onClick={() => { setVideoMedia(null); setVideoUrl(""); setVideoProvider("NONE"); }} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", border: "1px solid var(--admin-border)" }}>Remove</button>
                    )}
                  </div>
                </div>
                {videoMedia && <div className="text-xs p-2 rounded border" style={{ background: "var(--admin-bg)", borderColor: "var(--admin-border)" }}>Selected video: {videoMedia.publicId} · {videoMedia.width ?? "—"}×{videoMedia.height ?? "—"} · {videoMedia.format} · {videoMedia.resourceType}</div>}
                <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Video-only MediaPicker. MP4/WebM via completed media pipeline. Muted autoplay, no native controls, hidden from assistive technology, does not capture focus.</p>
                <p className="text-xs p-2 rounded" style={{ background: "#F3F4F6", color: "#374151", border: "1px solid #E5E7EB" }}>Privacy: Cloudinary video may include automatic optimizations; external iframe is not loaded when Cloudinary video is selected. Never autoplay audible media.</p>
              </div>
            )}

            {(videoProvider === "YOUTUBE" || videoProvider === "VIMEO") && (
              <div className="space-y-2">
                <label htmlFor="videoUrl" className="block text-xs font-medium">External video URL</label>
                <input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder={videoProvider === "YOUTUBE" ? "https://www.youtube.com/watch?v=XXXXXXXXXXX" : "https://vimeo.com/123456789"}
                  className="w-full px-3 py-2 border rounded text-sm"
                  style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)", minHeight: "44px" }}
                />
                <p className="text-xs p-2 rounded" style={{ background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE" }}>YouTube/Vimeo fallback may show provider branding, title, or related UI. We use privacy-enhanced embed where applicable (youtube-nocookie.com for YouTube) and disable controls where supported, but cannot completely remove third-party overlays. Cloudinary-native video is the recommended borderless experience.</p>
                {videoUrl && videoProvider === "YOUTUBE" && <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Uses https://www.youtube-nocookie.com/embed/{`{id}`} with controls=0, modestbranding.</p>}
              </div>
            )}

            {videoProvider === "NONE" && !videoEnabled && <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Select DIRECT for Cloudinary-native background video, or leave as poster-only.</p>}
          </div>
        </AdminSectionCard>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary admin-btn-md"
            style={{ minHeight: "44px" }}
          >
            {saving ? "Saving…" : "Save hero"}
          </button>
          <AdminSaveStatus status={saving ? "saving" : error || validationMsg ? "error" : success ? "saved" : "clean"} />
        </div>

        <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
          Hero copy remains readable at 390px with stable overlay/gradient. Poster remains visible until video emits playing/canplay — no hardcoded timeout. If autoplay fails or video errors, poster persists. Reduced-motion shows poster only.
        </p>
      </div>

      {/* Poster picker */}
      <MediaPicker
        open={posterPickerOpen}
        mode="image"
        selected={heroMedia}
        onSelect={(asset) => { setHeroMedia(asset); setHeroMediaId(asset.id); setPosterPickerOpen(false); }}
        onRemove={() => { setHeroMedia(null); setHeroMediaId(null); }}
        onClose={() => setPosterPickerOpen(false)}
        title="Select poster image"
        description="Wide landscape image recommended (e.g., 1920×1080). Image-only."
        folder="chittagong-trail/homepage"
      />

      {/* Video picker */}
      <MediaPicker
        open={videoPickerOpen}
        mode="video"
        selected={videoMedia}
        onSelect={(asset) => {
          setVideoMedia(asset);
          setVideoUrl(asset.secureUrl);
          setVideoProvider("DIRECT");
          setVideoPickerOpen(false);
        }}
        onRemove={() => { setVideoMedia(null); setVideoUrl(""); }}
        onClose={() => setVideoPickerOpen(false)}
        title="Select Cloudinary video"
        description="MP4/WebM only · Muted autoplay background"
        folder="chittagong-trail/homepage"
      />
    </div>
  );
}
