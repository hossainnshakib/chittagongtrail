"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";
import { isSiteUrlConfigured } from "@/lib/seo-client";

export default function AdminGeneralSettingsPage() {
  const [siteName, setSiteName] = useState("Chittagong Trail");
  const [siteTagline, setSiteTagline] = useState("");
  const [defaultMetaTitle, setDefaultMetaTitle] = useState("");
  const [defaultMetaDescription, setDefaultMetaDescription] = useState("");
  const [defaultOgMedia, setDefaultOgMedia] = useState<MediaAssetData | null>(null);
  const [defaultOgMediaId, setDefaultOgMediaId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSiteName(data.siteName || "Chittagong Trail");
        setSiteTagline(data.siteTagline || "");
        setDefaultMetaTitle(data.defaultMetaTitle || "");
        setDefaultMetaDescription(data.defaultMetaDescription || "");
        setDefaultOgMediaId(data.defaultOgMediaId || null);
        if (data.defaultOgMedia) setDefaultOgMedia(data.defaultOgMedia);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Fetch current full settings first so we don't wipe out other sections (About, Contact, Footer, Hero)
      const currentRes = await fetch("/api/admin/settings");
      const currentData = await currentRes.json();

      const payload = {
        ...currentData,
        siteName,
        siteTagline,
        defaultMetaTitle,
        defaultMetaDescription,
        defaultOgMediaId,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSuccess("General identity and global SEO settings saved successfully.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#5D4037]">Loading general settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">
            General Identity &amp; Global SEO
          </h1>
          <p className="text-sm text-[#5D4037]/70 mt-1">
            Manage platform identity, canonical configuration, and default meta tags for Chittagong&apos;s five districts.
          </p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Identity */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            General Identity
          </h2>
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-[#5D4037] mb-1">
              Site Name *
            </label>
            <input
              type="text"
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              maxLength={100}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
            <p className="text-xs text-[#5D4037]/60 mt-1">Appears in header, footer, page titles, and structured data.</p>
          </div>

          <div>
            <label htmlFor="siteTagline" className="block text-sm font-medium text-[#5D4037] mb-1">
              Site Tagline / Short Description
            </label>
            <input
              type="text"
              id="siteTagline"
              value={siteTagline}
              onChange={(e) => setSiteTagline(e.target.value)}
              maxLength={255}
              placeholder="Places, stories, food and landscapes across Chittagong's five districts"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
            <p className="text-xs text-[#5D4037]/60 mt-1">Concise platform summary used in metadata fallbacks.</p>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-md border border-[#E8DCC8] space-y-1">
            <span className="text-xs font-semibold text-[#5D4037]">Canonical Site Origin Status:</span>
            {isSiteUrlConfigured ? (
              <p className="text-xs text-green-700">
                Configured securely: <code>{process.env.NEXT_PUBLIC_SITE_URL || "https://chittagongtrail.com"}</code>
              </p>
            ) : (
              <p className="text-xs text-amber-800">
                Site URL not configured or evaluates to localhost/development origin. Production metadata will use safe fallback behavior.
              </p>
            )}
          </div>
        </section>

        {/* Global SEO */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            Global SEO &amp; Social Sharing
          </h2>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="defaultMetaTitle" className="block text-sm font-medium text-[#5D4037]">
                Default Meta Title
              </label>
              <span className={`text-xs ${defaultMetaTitle.length > 60 ? "text-amber-600 font-semibold" : "text-[#5D4037]/60"}`}>
                {defaultMetaTitle.length}/60 chars {defaultMetaTitle.length > 60 && "(recommend ≤ 60)"}
              </span>
            </div>
            <input
              type="text"
              id="defaultMetaTitle"
              value={defaultMetaTitle}
              onChange={(e) => setDefaultMetaTitle(e.target.value)}
              maxLength={255}
              placeholder="Chittagong Trail — Places, Stories, Food & Journeys"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="defaultMetaDescription" className="block text-sm font-medium text-[#5D4037]">
                Default Meta Description
              </label>
              <span className={`text-xs ${defaultMetaDescription.length > 160 ? "text-amber-600 font-semibold" : "text-[#5D4037]/60"}`}>
                {defaultMetaDescription.length}/160 chars {defaultMetaDescription.length > 160 && "(recommend ≤ 160)"}
              </span>
            </div>
            <textarea
              id="defaultMetaDescription"
              rows={3}
              value={defaultMetaDescription}
              onChange={(e) => setDefaultMetaDescription(e.target.value)}
              placeholder="Explore places, stories, food and landscapes across Chittagong's five districts through genuine discovery."
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] text-sm"
            />
            <p className="text-xs text-[#5D4037]/60 mt-1">
              Fallback summary across Chittagong&apos;s five districts (Chittagong, Cox&apos;s Bazar, Rangamati, Bandarban, Khagrachari).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-2">Default Social / Open Graph Image</label>
            <div className="flex items-center gap-4">
              {defaultOgMedia ? (
                <div className="relative w-36 h-20 rounded-md overflow-hidden border border-[#D7C9B8]">
                  <Image src={defaultOgMedia.secureUrl} alt={defaultOgMedia.altText || "Default OG Image"} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-36 h-20 rounded-md bg-[#FDF5E6] border border-dashed border-[#D7C9B8] flex items-center justify-center text-xs text-[#5D4037]/60">
                  No OG image selected
                </div>
              )}
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="px-3 py-2 text-sm bg-[#3E2723] text-[#FDF5E6] rounded-md hover:bg-[#5D4037] transition-colors cursor-pointer"
                >
                  {defaultOgMedia ? "Change Image" : "Select Image"}
                </button>
                {defaultOgMedia && (
                  <button
                    type="button"
                    onClick={() => {
                      setDefaultOgMedia(null);
                      setDefaultOgMediaId(null);
                    }}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {defaultOgMedia && (
              <div className="text-xs text-[#5D4037]/70 mt-2 space-y-0.5">
                <div>Dimensions: {defaultOgMedia.width ?? "—"} × {defaultOgMedia.height ?? "—"} (Recommended: 1200×630)</div>
                <div>Format: {defaultOgMedia.format || "unknown"} · Alt text: {defaultOgMedia.altText ? `"${defaultOgMedia.altText}"` : <span className="text-amber-700">Missing alt text</span>}</div>
              </div>
            )}
            <p className="text-xs text-[#5D4037]/60 mt-1">Image-only asset picker. Used when shared content lacks a dedicated cover or OG image.</p>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save General & SEO Settings"}
          </button>
        </div>
      </form>

      <MediaPicker
        open={mediaPickerOpen}
        mode="image"
        selected={defaultOgMedia}
        onSelect={(asset) => {
          setDefaultOgMedia(asset);
          setDefaultOgMediaId(asset.id);
          setMediaPickerOpen(false);
        }}
        onRemove={() => {
          setDefaultOgMedia(null);
          setDefaultOgMediaId(null);
        }}
        onClose={() => setMediaPickerOpen(false)}
        title="Select Default OG / Social Sharing Image"
        description="Recommended 1200×630px image-only."
        folder="chittagong-trail/general"
      />
    </div>
  );
}
