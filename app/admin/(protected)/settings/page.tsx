"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface MediaAsset {
  id: number;
  publicId: string;
  secureUrl: string;
  altText: string | null;
}

interface SiteSettingsFormState {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaId: number | null;
  heroVideoUrl: string;
  introductionHeading: string;
  introductionContent: string;
  seasonalEyebrow: string;
  seasonalTitle: string;
  seasonalContent: string;
  seasonalMediaId: number | null;
  aboutHeading: string;
  aboutContent: string;
  contactEmail: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYouTube: string;
  footerText: string;
}

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SiteSettingsFormState>({
    siteName: "Chittagong Trail",
    heroTitle: "",
    heroSubtitle: "",
    heroMediaId: null,
    heroVideoUrl: "",
    introductionHeading: "",
    introductionContent: "",
    seasonalEyebrow: "",
    seasonalTitle: "",
    seasonalContent: "",
    seasonalMediaId: null,
    aboutHeading: "",
    aboutContent: "",
    contactEmail: "",
    socialFacebook: "",
    socialInstagram: "",
    socialYouTube: "",
    footerText: "",
  });

  const [heroMedia, setHeroMedia] = useState<MediaAsset | null>(null);
  const [seasonalMedia, setSeasonalMedia] = useState<MediaAsset | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Media selector modal state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"hero" | "seasonal" | null>(null);
  const [availableMedia, setAvailableMedia] = useState<MediaAsset[]>([]);
  const [mediaSearch, setMediaSearch] = useState("");
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setFormData({
          siteName: data.siteName || "Chittagong Trail",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroMediaId: data.heroMediaId || null,
          heroVideoUrl: data.heroVideoUrl || "",
          introductionHeading: data.introductionHeading || "",
          introductionContent: data.introductionContent || "",
          seasonalEyebrow: data.seasonalEyebrow || "",
          seasonalTitle: data.seasonalTitle || "",
          seasonalContent: data.seasonalContent || "",
          seasonalMediaId: data.seasonalMediaId || null,
          aboutHeading: data.aboutHeading || "",
          aboutContent: data.aboutContent || "",
          contactEmail: data.contactEmail || "",
          socialFacebook: data.socialFacebook || "",
          socialInstagram: data.socialInstagram || "",
          socialYouTube: data.socialYouTube || "",
          footerText: data.footerText || "",
        });
        if (data.heroMedia) setHeroMedia(data.heroMedia);
        if (data.seasonalMedia) setSeasonalMedia(data.seasonalMedia);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess("Site settings updated successfully and routes revalidated.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const openMediaPicker = async (target: "hero" | "seasonal") => {
    setMediaPickerTarget(target);
    setMediaPickerOpen(true);
    await fetchAvailableMedia();
  };

  const fetchAvailableMedia = async (searchQuery = "") => {
    setLoadingMedia(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/media/list?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableMedia(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load media assets", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const selectMediaAsset = (asset: MediaAsset) => {
    if (mediaPickerTarget === "hero") {
      setFormData((prev) => ({ ...prev, heroMediaId: asset.id }));
      setHeroMedia(asset);
    } else if (mediaPickerTarget === "seasonal") {
      setFormData((prev) => ({ ...prev, seasonalMediaId: asset.id }));
      setSeasonalMedia(asset);
    }
    setMediaPickerOpen(false);
  };

  const unlinkMedia = (target: "hero" | "seasonal") => {
    if (target === "hero") {
      setFormData((prev) => ({ ...prev, heroMediaId: null }));
      setHeroMedia(null);
    } else {
      setFormData((prev) => ({ ...prev, seasonalMediaId: null }));
      setSeasonalMedia(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#5D4037]">Loading site settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">
            Site Settings Management
          </h1>
          <p className="text-sm text-[#5D4037]/70 mt-1">
            Configure singleton brand identity, hero section, editorial content, and footer settings.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. General */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            1. General Identity
          </h2>
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-[#5D4037] mb-1">
              Site Name *
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
        </section>

        {/* 2. Hero */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            2. Hero Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="heroTitle" className="block text-sm font-medium text-[#5D4037] mb-1">
                Hero Title
              </label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="heroSubtitle" className="block text-sm font-medium text-[#5D4037] mb-1">
                Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                id="heroSubtitle"
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-2">Hero Background Media Asset</label>
            <div className="flex items-center gap-4">
              {heroMedia ? (
                <div className="relative w-32 h-20 rounded-md overflow-hidden border border-[#D7C9B8]">
                  <Image src={heroMedia.secureUrl} alt={heroMedia.altText || "Hero Media"} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-32 h-20 rounded-md bg-[#FDF5E6] border border-dashed border-[#D7C9B8] flex items-center justify-center text-xs text-[#5D4037]/60">
                  No media selected
                </div>
              )}
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => openMediaPicker("hero")}
                  className="px-3 py-2 text-sm bg-[#3E2723] text-[#FDF5E6] rounded-md hover:bg-[#5D4037] transition-colors"
                >
                  {heroMedia ? "Change Media" : "Select Media"}
                </button>
                {heroMedia && (
                  <button
                    type="button"
                    onClick={() => unlinkMedia("hero")}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Unlink
                  </button>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="heroVideoUrl" className="block text-sm font-medium text-[#5D4037] mb-1">
              Hero Video URL (MP4)
            </label>
            <input
              type="url"
              id="heroVideoUrl"
              name="heroVideoUrl"
              value={formData.heroVideoUrl}
              onChange={handleChange}
              placeholder="https://example.com/video.mp4"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
            <p className="text-xs text-[#5D4037]/60 mt-1">Video takes priority over the image. The poster image is shown while video loads.</p>
          </div>
        </section>

        {/* 3. Introduction */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            3. Introduction Section
          </h2>
          <div>
            <label htmlFor="introductionHeading" className="block text-sm font-medium text-[#5D4037] mb-1">
              Introduction Heading
            </label>
            <input
              type="text"
              id="introductionHeading"
              name="introductionHeading"
              value={formData.introductionHeading}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
          <div>
            <label htmlFor="introductionContent" className="block text-sm font-medium text-[#5D4037] mb-1">
              Introduction Content (HTML allowed & sanitized)
            </label>
            <textarea
              id="introductionContent"
              name="introductionContent"
              rows={5}
              value={formData.introductionContent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] font-mono text-sm"
            />
          </div>
        </section>

        {/* 4. Seasonal / Mood */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            4. Seasonal / Mood Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="seasonalEyebrow" className="block text-sm font-medium text-[#5D4037] mb-1">
                Eyebrow
              </label>
              <input
                type="text"
                id="seasonalEyebrow"
                name="seasonalEyebrow"
                value={formData.seasonalEyebrow}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="seasonalTitle" className="block text-sm font-medium text-[#5D4037] mb-1">
                Seasonal Title
              </label>
              <input
                type="text"
                id="seasonalTitle"
                name="seasonalTitle"
                value={formData.seasonalTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="seasonalContent" className="block text-sm font-medium text-[#5D4037] mb-1">
              Seasonal Content (HTML allowed & sanitized)
            </label>
            <textarea
              id="seasonalContent"
              name="seasonalContent"
              rows={4}
              value={formData.seasonalContent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-2">Seasonal Media Asset</label>
            <div className="flex items-center gap-4">
              {seasonalMedia ? (
                <div className="relative w-32 h-20 rounded-md overflow-hidden border border-[#D7C9B8]">
                  <Image src={seasonalMedia.secureUrl} alt={seasonalMedia.altText || "Seasonal Media"} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-32 h-20 rounded-md bg-[#FDF5E6] border border-dashed border-[#D7C9B8] flex items-center justify-center text-xs text-[#5D4037]/60">
                  No media selected
                </div>
              )}
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => openMediaPicker("seasonal")}
                  className="px-3 py-2 text-sm bg-[#3E2723] text-[#FDF5E6] rounded-md hover:bg-[#5D4037] transition-colors"
                >
                  {seasonalMedia ? "Change Media" : "Select Media"}
                </button>
                {seasonalMedia && (
                  <button
                    type="button"
                    onClick={() => unlinkMedia("seasonal")}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Unlink
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. About / Sign-off */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            5. About / Sign-off Section
          </h2>
          <div>
            <label htmlFor="aboutHeading" className="block text-sm font-medium text-[#5D4037] mb-1">
              About Quote / Heading
            </label>
            <input
              type="text"
              id="aboutHeading"
              name="aboutHeading"
              value={formData.aboutHeading}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
          <div>
            <label htmlFor="aboutContent" className="block text-sm font-medium text-[#5D4037] mb-1">
              About Sign-off Content (HTML allowed & sanitized)
            </label>
            <textarea
              id="aboutContent"
              name="aboutContent"
              rows={4}
              value={formData.aboutContent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] font-mono text-sm"
            />
          </div>
        </section>

        {/* 6. Contact and Social */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            6. Contact and Social Links
          </h2>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-[#5D4037] mb-1">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="socialFacebook" className="block text-sm font-medium text-[#5D4037] mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                id="socialFacebook"
                name="socialFacebook"
                value={formData.socialFacebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialInstagram" className="block text-sm font-medium text-[#5D4037] mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                id="socialInstagram"
                name="socialInstagram"
                value={formData.socialInstagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialYouTube" className="block text-sm font-medium text-[#5D4037] mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                id="socialYouTube"
                name="socialYouTube"
                value={formData.socialYouTube}
                onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
          </div>
        </section>

        {/* 7. Footer */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            7. Footer Section
          </h2>
          <div>
            <label htmlFor="footerText" className="block text-sm font-medium text-[#5D4037] mb-1">
              Footer Description / Bio Text
            </label>
            <textarea
              id="footerText"
              name="footerText"
              rows={3}
              value={formData.footerText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save Site Settings"}
          </button>
        </div>
      </form>

      {/* Media Picker Modal */}
      {mediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col p-6 border border-[#E8DCC8]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCC8]">
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037]">
                Select Media Asset for {mediaPickerTarget === "hero" ? "Hero" : "Seasonal"} Section
              </h3>
              <button
                onClick={() => setMediaPickerOpen(false)}
                className="text-[#5D4037] hover:text-black font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <div className="py-4">
              <input
                type="text"
                placeholder="Search media by public ID..."
                value={mediaSearch}
                onChange={(e) => {
                  setMediaSearch(e.target.value);
                  fetchAvailableMedia(e.target.value);
                }}
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md text-sm text-[#5D4037]"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              {loadingMedia ? (
                <div className="col-span-full py-8 text-center text-sm text-[#5D4037]/60">Loading media library...</div>
              ) : availableMedia.length === 0 ? (
                <div className="col-span-full py-8 text-center text-sm text-[#5D4037]/60">No media assets found.</div>
              ) : (
                availableMedia.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => selectMediaAsset(asset)}
                    className="group relative aspect-square rounded-md overflow-hidden border border-[#D7C9B8] cursor-pointer hover:border-[#3E2723] transition-all bg-[#FDF5E6]"
                  >
                    <Image src={asset.secureUrl} alt={asset.altText || asset.publicId} fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-1 truncate">
                      {asset.publicId}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-[#E8DCC8] flex justify-end">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
