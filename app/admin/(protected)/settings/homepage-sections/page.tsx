"use client";

import { useEffect, useState } from "react";

interface HomepageSectionEditorRecord {
  sectionKey: string;
  label: string;
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  enabled: boolean;
}

export default function AdminHomepageSectionsSettingsPage() {
  const [sections, setSections] = useState<HomepageSectionEditorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/homepage/sections")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load homepage sections");
        const data = await response.json();
        setSections(data.sections || []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load homepage sections"))
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (sectionKey: string, patch: Partial<HomepageSectionEditorRecord>) => {
    setSections((current) => current.map((section) => section.sectionKey === sectionKey ? { ...section, ...patch } : section));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/homepage/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save homepage sections");
      setSuccess("Homepage section copy saved.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save homepage sections");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#5D4037]">Loading homepage sections...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="border-b border-[#E8DCC8] pb-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">Homepage Sections</h1>
        <p className="text-sm text-[#5D4037]/70 mt-1">Edit copy for the existing homepage order. Hero, Introduction, Seasonal / Mood, and the closing invitation continue to use their existing CMS editors.</p>
      </div>
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm" role="alert">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm" role="status">{success}</div>}
      <form onSubmit={save} className="space-y-5">
        {sections.map((section) => (
          <section key={section.sectionKey} className="bg-white rounded-lg border border-[#E8DCC8] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-[#E8DCC8] pb-3">
              <div><h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037]">{section.label}</h2><p className="text-xs text-[#5D4037]/60 mt-1">Section key: <code>{section.sectionKey}</code></p></div>
              <label className="flex items-center gap-2 text-sm text-[#5D4037]"><input type="checkbox" checked={section.enabled} onChange={(e) => updateSection(section.sectionKey, { enabled: e.target.checked })} /> Enabled</label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor={`${section.sectionKey}-eyebrow`} className="block text-sm font-medium text-[#5D4037] mb-1">Eyebrow</label><input id={`${section.sectionKey}-eyebrow`} maxLength={100} value={section.eyebrow} onChange={(e) => updateSection(section.sectionKey, { eyebrow: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" /></div>
              <div><label htmlFor={`${section.sectionKey}-heading`} className="block text-sm font-medium text-[#5D4037] mb-1">Heading</label><input id={`${section.sectionKey}-heading`} maxLength={200} value={section.heading} onChange={(e) => updateSection(section.sectionKey, { heading: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" /></div>
              <div className="sm:col-span-2"><label htmlFor={`${section.sectionKey}-description`} className="block text-sm font-medium text-[#5D4037] mb-1">Description</label><textarea id={`${section.sectionKey}-description`} rows={3} maxLength={500} value={section.description} onChange={(e) => updateSection(section.sectionKey, { description: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" /><p className="text-xs text-[#5D4037]/60 mt-1">{section.description.length}/500. Stored as safe plain text.</p></div>
              <div><label htmlFor={`${section.sectionKey}-cta-label`} className="block text-sm font-medium text-[#5D4037] mb-1">CTA label</label><input id={`${section.sectionKey}-cta-label`} maxLength={100} value={section.ctaLabel} onChange={(e) => updateSection(section.sectionKey, { ctaLabel: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" /></div>
              <div><label htmlFor={`${section.sectionKey}-cta-href`} className="block text-sm font-medium text-[#5D4037] mb-1">CTA internal path</label><input id={`${section.sectionKey}-cta-href`} maxLength={200} value={section.ctaHref} onChange={(e) => updateSection(section.sectionKey, { ctaHref: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" /><p className="text-xs text-[#5D4037]/60 mt-1">Use a path such as /journal or /food.</p></div>
            </div>
          </section>
        ))}
        <div className="flex justify-end"><button type="submit" disabled={saving} className="px-5 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : "Save homepage sections"}</button></div>
      </form>
    </div>
  );
}
