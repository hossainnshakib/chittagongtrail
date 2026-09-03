"use client";

import React, { useState, useEffect } from "react";

export default function AdminFooterSettingsPage() {
  const [footerText, setFooterText] = useState("");

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
        setFooterText(data.footerText || "");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading footer settings");
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
        footerText,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save footer settings");

      setSuccess("Footer settings updated successfully.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-[#5D4037]">Loading footer settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-[#E8DCC8] pb-4">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">
            Footer Settings
          </h1>
          <p className="text-sm text-[#5D4037]/70 mt-1">
            Manage footer editorial description text, dynamic copyright strategy, and public section inclusion.
          </p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-lg border border-[#E8DCC8] p-6 shadow-sm space-y-4">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037] border-b border-[#E8DCC8] pb-2">
            Footer Content &amp; Copyright
          </h2>

          <div>
            <label htmlFor="footerText" className="block text-sm font-medium text-[#5D4037] mb-1">
              Footer Description / Bio Text
            </label>
            <textarea
              id="footerText"
              rows={4}
              maxLength={500}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="An independent exploration and storytelling platform documenting Chittagong's places, people, food, and landscapes."
              className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] focus:outline-none focus:ring-2 focus:ring-[#C9A882] text-sm"
            />
            <p className="text-xs text-[#5D4037]/60 mt-1">
              Displays beneath the brand wordmark in the site footer across all public views.
            </p>
          </div>

          <div className="p-4 bg-[#FAF6F0] rounded-md border border-[#E8DCC8] space-y-2">
            <h3 className="text-xs font-semibold text-[#5D4037] uppercase tracking-wider">Dynamic Copyright &amp; Navigation Strategy</h3>
            <p className="text-xs text-[#5D4037]/70">
              Copyright year automatically renders dynamically (e.g., &copy; {new Date().getFullYear()}) alongside the site name. Navigation links (Trails, Journal, Food, About) and configured contact/social channels are automatically included.
            </p>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving Changes..." : "Save Footer Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
