"use client";

import React, { useState, useEffect } from "react";

export default function AdminContactSettingsPage() {
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");

  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialYouTube, setSocialYouTube] = useState("");
  const [socialX, setSocialX] = useState("");
  const [socialThreads, setSocialThreads] = useState("");
  const [socialLinkedIn, setSocialLinkedIn] = useState("");
  const [socialTikTok, setSocialTikTok] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setContactEmail(data.contactEmail || "");
        setContactPhone(data.contactPhone || "");
        setWhatsappUrl(data.whatsappUrl || "");
        setContactAddress(data.contactAddress || "");
        setMapUrl(data.mapUrl || "");
        setSocialFacebook(data.socialFacebook || "");
        setSocialInstagram(data.socialInstagram || "");
        setSocialYouTube(data.socialYouTube || "");
        setSocialX(data.socialX || "");
        setSocialThreads(data.socialThreads || "");
        setSocialLinkedIn(data.socialLinkedIn || "");
        setSocialTikTok(data.socialTikTok || "");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading contact settings");
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
      const currentRes = await fetch("/api/admin/settings");
      const currentData = await currentRes.json();

      const payload = {
        ...currentData,
        contactEmail,
        contactPhone,
        whatsappUrl,
        contactAddress,
        mapUrl,
        socialFacebook,
        socialInstagram,
        socialYouTube,
        socialX,
        socialThreads,
        socialLinkedIn,
        socialTikTok,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save contact settings");

      setSuccess("Contact & Social settings updated successfully.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#5D4037]">Loading contact and social settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">
            Contact &amp; Social Settings
          </h1>
          <p className="text-sm text-[#5D4037]/70 mt-1">
            Configure public communication channels, location details, and validated social media profiles.
          </p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            Public Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-[#5D4037] mb-1">
                Public Email Address
              </label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="info@chittagongtrail.com"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-[#5D4037] mb-1">
                Telephone Number
              </label>
              <input
                type="text"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+880 1800 000000"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="whatsappUrl" className="block text-sm font-medium text-[#5D4037] mb-1">
                WhatsApp Chat URL / Number Link
              </label>
              <input
                type="url"
                id="whatsappUrl"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://wa.me/8801800000000"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="mapUrl" className="block text-sm font-medium text-[#5D4037] mb-1">
                Map / Directions URL
              </label>
              <input
                type="url"
                id="mapUrl"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactAddress" className="block text-sm font-medium text-[#5D4037] mb-1">
              Address / Location Text
            </label>
            <textarea
              id="contactAddress"
              rows={2}
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="Chittagong, Bangladesh"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
        </section>

        {/* Social Platforms */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            Social Media Profiles (HTTPS Only)
          </h2>
          <p className="text-xs text-[#5D4037]/70">
            Accepts valid HTTPS URLs for verified platform profiles. JavaScript or unsafe scheme links are automatically rejected.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="socialFacebook" className="block text-sm font-medium text-[#5D4037] mb-1">Facebook URL</label>
              <input
                type="url"
                id="socialFacebook"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                placeholder="https://facebook.com/chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialInstagram" className="block text-sm font-medium text-[#5D4037] mb-1">Instagram URL</label>
              <input
                type="url"
                id="socialInstagram"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                placeholder="https://instagram.com/chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialYouTube" className="block text-sm font-medium text-[#5D4037] mb-1">YouTube URL</label>
              <input
                type="url"
                id="socialYouTube"
                value={socialYouTube}
                onChange={(e) => setSocialYouTube(e.target.value)}
                placeholder="https://youtube.com/@chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialX" className="block text-sm font-medium text-[#5D4037] mb-1">X / Twitter URL</label>
              <input
                type="url"
                id="socialX"
                value={socialX}
                onChange={(e) => setSocialX(e.target.value)}
                placeholder="https://x.com/chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialThreads" className="block text-sm font-medium text-[#5D4037] mb-1">Threads URL</label>
              <input
                type="url"
                id="socialThreads"
                value={socialThreads}
                onChange={(e) => setSocialThreads(e.target.value)}
                placeholder="https://threads.net/@chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialLinkedIn" className="block text-sm font-medium text-[#5D4037] mb-1">LinkedIn URL</label>
              <input
                type="url"
                id="socialLinkedIn"
                value={socialLinkedIn}
                onChange={(e) => setSocialLinkedIn(e.target.value)}
                placeholder="https://linkedin.com/company/chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
            <div>
              <label htmlFor="socialTikTok" className="block text-sm font-medium text-[#5D4037] mb-1">TikTok URL</label>
              <input
                type="url"
                id="socialTikTok"
                value={socialTikTok}
                onChange={(e) => setSocialTikTok(e.target.value)}
                placeholder="https://tiktok.com/@chittagongtrail"
                className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] text-sm focus:ring-2 focus:ring-[#C9A882]"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save Contact & Social"}
          </button>
        </div>
      </form>
    </div>
  );
}
