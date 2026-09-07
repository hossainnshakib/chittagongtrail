"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";

interface PublicPageEditorRecord {
  pageKey: string;
  routePath: string;
  adminLabel: string;
  visibleTitle: string;
  visibleDescription: string;
  metaTitle: string;
  metaDescription: string;
  useVisibleTitleAsMetaTitle: boolean;
  useVisibleDescriptionAsMetaDescription: boolean;
  ogTitle: string;
  ogDescription: string;
  ogMediaId: number | null;
  ogMedia: { id: number; secureUrl: string; width: number | null; height: number | null; altText: string | null } | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  includeInSitemap: boolean;
}

function completeness(page: PublicPageEditorRecord) {
  const required = [page.visibleTitle, page.visibleDescription, page.metaTitle, page.metaDescription];
  const complete = required.filter((value) => value.trim()).length;
  if (complete === required.length && page.robotsIndex && page.robotsFollow) return "Ready";
  if (complete >= 2) return "Needs attention";
  return "Incomplete";
}

export default function AdminPublicPagesSettingsPage() {
  const [pages, setPages] = useState<PublicPageEditorRecord[]>([]);
  const [siteOrigin, setSiteOrigin] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pickerPageKey, setPickerPageKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [pagesResponse, settingsResponse] = await Promise.all([
          fetch("/api/admin/page-seo"),
          fetch("/api/admin/settings"),
        ]);
        if (!pagesResponse.ok || !settingsResponse.ok) throw new Error("Failed to load public page settings");
        const pagesData = await pagesResponse.json();
        const settingsData = await settingsResponse.json();
        setPages(pagesData.pages || []);
        setSiteOrigin(settingsData.siteOrigin || "");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load public page settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updatePage = (pageKey: string, patch: Partial<PublicPageEditorRecord>) => {
    setPages((current) => current.map((page) => page.pageKey === pageKey ? { ...page, ...patch } : page));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/page-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pages: pages.map((page) => ({
            pageKey: page.pageKey,
            routePath: page.routePath,
            adminLabel: page.adminLabel,
            visibleTitle: page.visibleTitle,
            visibleDescription: page.visibleDescription,
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
            useVisibleTitleAsMetaTitle: page.useVisibleTitleAsMetaTitle,
            useVisibleDescriptionAsMetaDescription: page.useVisibleDescriptionAsMetaDescription,
            ogTitle: page.ogTitle,
            ogDescription: page.ogDescription,
            ogMediaId: page.ogMediaId,
            robotsIndex: page.robotsIndex,
            robotsFollow: page.robotsFollow,
            includeInSitemap: page.includeInSitemap,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save public page settings");
      setSuccess("Public page SEO settings saved.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save public page settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#5D4037]">Loading public page settings...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div className="border-b border-[#E8DCC8] pb-4">
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#5D4037]">Public Pages</h1>
        <p className="text-sm text-[#5D4037]/70 mt-1">Edit the visible heading, intro copy, search metadata, indexing state, and social preview for each fixed public page.</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm" role="alert">{error}</div>}
      {success && <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm" role="status">{success}</div>}

      <form onSubmit={save} className="space-y-6">
        {pages.map((page) => {
          return (
            <section key={page.pageKey} className="bg-white rounded-lg border border-[#E8DCC8] p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E8DCC8] pb-4">
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-[#5D4037]">{page.adminLabel}</h2>
                  <p className="text-xs text-[#5D4037]/65 mt-1">Fixed route: <code>{page.routePath}</code></p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-[#FAF6F0] text-[#5D4037]">SEO: {completeness(page)}</span>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label htmlFor={`${page.pageKey}-visible-title`} className="block text-sm font-medium text-[#5D4037] mb-1">Visible page title / H1</label>
                  <input id={`${page.pageKey}-visible-title`} type="text" maxLength={200} value={page.visibleTitle} onChange={(e) => updatePage(page.pageKey, { visibleTitle: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" />
                  <p className="text-xs text-[#5D4037]/60 mt-1">Exactly one H1 is rendered from this value.</p>
                </div>
                <div>
                  <label htmlFor={`${page.pageKey}-visible-description`} className="block text-sm font-medium text-[#5D4037] mb-1">Visible page description</label>
                  <textarea id={`${page.pageKey}-visible-description`} rows={4} maxLength={500} value={page.visibleDescription} onChange={(e) => updatePage(page.pageKey, { visibleDescription: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" />
                  <p className="text-xs text-[#5D4037]/60 mt-1">{page.visibleDescription.length}/500. Plain text is stored safely.</p>
                </div>
                <div>
                  <div className="flex justify-between gap-2 mb-1"><label htmlFor={`${page.pageKey}-meta-title`} className="block text-sm font-medium text-[#5D4037]">Meta title</label><span className="text-xs text-[#5D4037]/60">{page.metaTitle.length}/60</span></div>
                  <input id={`${page.pageKey}-meta-title`} type="text" maxLength={255} disabled={page.useVisibleTitleAsMetaTitle} value={page.metaTitle} onChange={(e) => updatePage(page.pageKey, { metaTitle: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] disabled:bg-[#FAF6F0]" />
                  <label className="flex items-center gap-2 text-xs text-[#5D4037]/75 mt-2"><input type="checkbox" checked={page.useVisibleTitleAsMetaTitle} onChange={(e) => updatePage(page.pageKey, { useVisibleTitleAsMetaTitle: e.target.checked, metaTitle: e.target.checked ? page.visibleTitle : page.metaTitle })} /> Use visible title as fallback</label>
                </div>
                <div>
                  <div className="flex justify-between gap-2 mb-1"><label htmlFor={`${page.pageKey}-meta-description`} className="block text-sm font-medium text-[#5D4037]">Meta description</label><span className="text-xs text-[#5D4037]/60">{page.metaDescription.length}/160</span></div>
                  <textarea id={`${page.pageKey}-meta-description`} rows={4} maxLength={500} disabled={page.useVisibleDescriptionAsMetaDescription} value={page.metaDescription} onChange={(e) => updatePage(page.pageKey, { metaDescription: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037] disabled:bg-[#FAF6F0]" />
                  <label className="flex items-center gap-2 text-xs text-[#5D4037]/75 mt-2"><input type="checkbox" checked={page.useVisibleDescriptionAsMetaDescription} onChange={(e) => updatePage(page.pageKey, { useVisibleDescriptionAsMetaDescription: e.target.checked, metaDescription: e.target.checked ? page.visibleDescription : page.metaDescription })} /> Use visible description as fallback</label>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2 border-t border-[#E8DCC8] pt-5">
                <div>
                  <label htmlFor={`${page.pageKey}-og-title`} className="block text-sm font-medium text-[#5D4037] mb-1">OG title override</label>
                  <input id={`${page.pageKey}-og-title`} type="text" maxLength={255} value={page.ogTitle} onChange={(e) => updatePage(page.pageKey, { ogTitle: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" />
                </div>
                <div>
                  <label htmlFor={`${page.pageKey}-og-description`} className="block text-sm font-medium text-[#5D4037] mb-1">OG description override</label>
                  <textarea id={`${page.pageKey}-og-description`} rows={3} maxLength={500} value={page.ogDescription} onChange={(e) => updatePage(page.pageKey, { ogDescription: e.target.value })} className="w-full px-3 py-2 border border-[#D7C9B8] rounded-md bg-white text-[#5D4037]" />
                </div>
                <div className="lg:col-span-2">
                  <p className="block text-sm font-medium text-[#5D4037] mb-2">OG image</p>
                  <div className="flex flex-wrap items-center gap-4">
                    {page.ogMedia ? <div className="relative w-40 h-20 rounded border border-[#D7C9B8] overflow-hidden"><Image src={page.ogMedia.secureUrl} alt={page.ogMedia.altText || "Selected OG image"} fill className="object-cover" /></div> : <div className="w-40 h-20 rounded border border-dashed border-[#D7C9B8] bg-[#FAF6F0] flex items-center justify-center text-xs text-[#5D4037]/60">Uses global image</div>}
                    <button type="button" onClick={() => setPickerPageKey(page.pageKey)} className="px-3 py-2 text-sm bg-[#3E2723] text-[#FDF5E6] rounded-md hover:bg-[#5D4037] cursor-pointer">{page.ogMedia ? "Change image" : "Select image"}</button>
                    {page.ogMedia && <button type="button" onClick={() => updatePage(page.pageKey, { ogMediaId: null, ogMedia: null })} className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 cursor-pointer">Use global image</button>}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 border-t border-[#E8DCC8] pt-5">
                <label className="flex items-center gap-2 text-sm text-[#5D4037]"><input type="checkbox" checked={page.robotsIndex} onChange={(e) => updatePage(page.pageKey, { robotsIndex: e.target.checked })} /> Allow indexing</label>
                <label className="flex items-center gap-2 text-sm text-[#5D4037]"><input type="checkbox" checked={page.robotsFollow} onChange={(e) => updatePage(page.pageKey, { robotsFollow: e.target.checked })} /> Allow following</label>
                <label className="flex items-center gap-2 text-sm text-[#5D4037]"><input type="checkbox" checked={page.includeInSitemap} onChange={(e) => updatePage(page.pageKey, { includeInSitemap: e.target.checked })} /> Include in sitemap</label>
              </div>

              <div className="grid gap-4 md:grid-cols-2 border-t border-[#E8DCC8] pt-5">
                <div className="rounded border border-[#E8DCC8] bg-[#FAF6F0] p-4"><p className="text-xs uppercase tracking-wide text-[#5D4037]/60 mb-2">Google Search preview</p><p className="text-base font-medium text-[#315F9B]">{page.metaTitle || page.visibleTitle}</p><p className="text-xs text-[#5D4037]/70 mt-1">{siteOrigin ? `${siteOrigin}${page.routePath}` : "Site URL not configured"}</p><p className="text-sm text-[#5D4037]/75 mt-2 line-clamp-2">{page.metaDescription || page.visibleDescription}</p></div>
                <div className="rounded border border-[#E8DCC8] bg-[#FAF6F0] p-4"><p className="text-xs uppercase tracking-wide text-[#5D4037]/60 mb-2">Social / OG preview</p><p className="text-base font-medium text-[#5D4037]">{page.ogTitle || page.metaTitle || page.visibleTitle}</p><p className="text-sm text-[#5D4037]/75 mt-2 line-clamp-3">{page.ogDescription || page.metaDescription || page.visibleDescription}</p></div>
              </div>
            </section>
          );
        })}

        <div className="flex justify-end"><button type="submit" disabled={saving} className="px-5 py-3 bg-[#3E2723] text-[#FDF5E6] font-medium rounded-md hover:bg-[#5D4037] disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : "Save public page settings"}</button></div>
      </form>

      <MediaPicker
        open={pickerPageKey !== null}
        mode="image"
        folder="chittagong-trail/general"
        selected={pickerPageKey ? ((pages.find((page) => page.pageKey === pickerPageKey)?.ogMedia || null) as unknown as MediaAssetData | null) : null}
        onSelect={(asset) => { if (pickerPageKey) updatePage(pickerPageKey, { ogMediaId: asset.id, ogMedia: asset as PublicPageEditorRecord["ogMedia"] }); setPickerPageKey(null); }}
        onRemove={() => { if (pickerPageKey) updatePage(pickerPageKey, { ogMediaId: null, ogMedia: null }); setPickerPageKey(null); }}
        onClose={() => setPickerPageKey(null)}
        title="Select page OG image"
        description="Image-only social sharing asset"
      />
    </div>
  );
}
