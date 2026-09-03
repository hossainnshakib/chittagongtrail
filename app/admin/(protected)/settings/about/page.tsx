"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";

export default function AdminAboutSettingsPage() {
  const [introductionHeading, setIntroductionHeading] = useState("");
  const [introductionContent, setIntroductionContent] = useState("");
  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutContent, setAboutContent] = useState("");

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
        setIntroductionHeading(data.introductionHeading || "");
        setIntroductionContent(data.introductionContent || "");
        setAboutHeading(data.aboutHeading || "");
        setAboutContent(data.aboutContent || "");
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
      const currentRes = await fetch("/api/admin/settings");
      const currentData = await currentRes.json();

      const payload = {
        ...currentData,
        introductionHeading,
        introductionContent,
        aboutHeading,
        aboutContent,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setSuccess("Introduction and About settings saved successfully.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#5D4037]">Loading About settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">
            Introduction &amp; About Settings
          </h1>
          <p className="text-sm text-[#5D4037]/70 mt-1">
            Configure homepage introduction statement and full /about editorial content.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/" target="_blank" className="px-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#D7C9B8] rounded text-[#5D4037] hover:bg-[#E8DCC8]">
            View Homepage
          </Link>
          <Link href="/about" target="_blank" className="px-3 py-1.5 text-xs bg-[#FAF6F0] border border-[#D7C9B8] rounded text-[#5D4037] hover:bg-[#E8DCC8]">
            View /about
          </Link>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Homepage Introduction */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            Homepage Introduction Statement
          </h2>
          <div>
            <label htmlFor="introductionHeading" className="block text-sm font-medium text-[#5D4037] mb-1">
              Heading (use *text* for italic accent)
            </label>
            <input
              type="text"
              id="introductionHeading"
              value={introductionHeading}
              onChange={(e) => setIntroductionHeading(e.target.value)}
              maxLength={200}
              placeholder="Five Districts. Hills to the Sea. *One Chittagong.*"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-1">
              Introduction Supporting Content
            </label>
            <AdminRichTextEditor
              initialContent={introductionContent}
              onChange={setIntroductionContent}
              label=""
              placeholder="Write introduction paragraph..."
            />
          </div>
        </section>

        {/* Closing Invitation / About Sign-off */}
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            Closing Invitation / Homepage Sign-off
          </h2>
          <div>
            <label htmlFor="aboutHeading" className="block text-sm font-medium text-[#5D4037] mb-1">
              Sign-off Heading (use *text* for italic)
            </label>
            <input
              type="text"
              id="aboutHeading"
              value={aboutHeading}
              onChange={(e) => setAboutHeading(e.target.value)}
              maxLength={200}
              placeholder="Begin your exploration of *Chittagong today.*"
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5D4037] mb-1">
              Sign-off Description Content
            </label>
            <AdminRichTextEditor
              initialContent={aboutContent}
              onChange={setAboutContent}
              label=""
              placeholder="Write closing invitation narrative..."
            />
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save Introduction & About"}
          </button>
        </div>
      </form>
    </div>
  );
}
