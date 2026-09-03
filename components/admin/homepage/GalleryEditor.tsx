"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";
import MediaPicker from "@/components/admin/media/MediaPicker";
import type { MediaAssetData } from "@/components/admin/media/types";

interface GalleryItem {
  id: number;
  sortOrder: number;
  mediaAsset: MediaAssetData;
  mediaAssetId: number;
}

export default function GalleryEditor() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = () => {
    fetch("/api/admin/homepage/gallery")
      .then((r) => r.json())
      .then((j) => setItems((j.items || []).sort((a: GalleryItem, b: GalleryItem) => a.sortOrder - b.sortOrder)))
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const move = (idx: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]; const tgt = idx + dir; if (tgt < 0 || tgt >= next.length) return prev; const tmp = next[idx]; next[idx] = next[tgt]; next[tgt] = tmp; return next.map((it, i) => ({ ...it, sortOrder: i }));
    });
  };
  const remove = (idx: number) => { setItems((prev) => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sortOrder: i }))); };
  const add = (asset: MediaAssetData) => {
    if (items.some((it) => it.mediaAssetId === asset.id)) { setError(`Duplicate asset ${asset.publicId} already in gallery.`); return; }
    if (items.length >= 12) { setError("Maximum 12 gallery images allowed."); return; }
    if (asset.resourceType !== "image") { setError("Only images allowed in homepage gallery."); return; }
    setItems((prev) => [...prev, { id: Date.now() + Math.random(), sortOrder: prev.length, mediaAsset: asset, mediaAssetId: asset.id }]);
    setError(null);
  };
  const save = async () => {
    setSaving(true); setError(null); setMsg(null);
    try {
      const res = await fetch("/api/admin/homepage/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: items.map((it) => it.mediaAssetId) }) });
      const j = await res.json(); if (!res.ok) throw new Error(j.error); setMsg("Gallery saved and homepage revalidated."); setTimeout(() => setMsg(null), 3000); load();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-muted)" }}>Loading gallery…</div>;
  const count = items.length;
  const warningLow = count < 6;
  const warningHigh = count > 8;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <AdminPageHeader title="Homepage Gallery" description={`Image-only · ${count} images · recommended 6–8 · max 12 · duplicate blocked`} primaryAction={<AdminButton href="/admin/homepage" variant="ghost" size="sm">Back</AdminButton>} />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{msg}</div>}
      {warningLow && <div className="mb-4 p-3 rounded text-sm" style={{ background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E" }}>Editorial warning: only {count} image(s) — add at least {6 - count} more for ideal 6–8 curation (allow fewer but not ideal).</div>}
      {warningHigh && <div className="mb-4 p-3 rounded text-sm" style={{ background: "#FDF5E6", border: "1px solid #FDE68A", color: "#92400E" }}>Editorial note: {count} images exceeds recommended 6–8 — consider trimming.</div>}

      <AdminSectionCard title={`Gallery · ${count} images`} description="Compact responsive thumbnail grid · persisted ordering · Move Up/Down · remove without deleting asset.">
        {items.length === 0 ? <p className="text-sm py-8 text-center" style={{ color: "var(--admin-text-muted)" }}>No gallery images. Use Add images to curate.</p> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((it, idx) => (
              <div key={it.mediaAssetId} className="border rounded overflow-hidden" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}>
                <div className="relative aspect-square">
                  <Image src={it.mediaAsset.secureUrl} alt={it.mediaAsset.altText || it.mediaAsset.publicId} fill className="object-cover" sizes="160px" />
                </div>
                <div className="p-2 space-y-2">
                  <p className="text-xs truncate" style={{ color: "var(--admin-text-secondary)" }}>{it.mediaAsset.publicId.split("/").pop()}</p>
                  {!it.mediaAsset.altText ? <p className="text-xs px-1 py-0.5 rounded" style={{ background: "#FEF3C7", color: "#92400E" }}>Missing alt — warn</p> : <p className="text-xs truncate" style={{ color: "var(--admin-text-muted)" }}>Alt: {it.mediaAsset.altText}</p>}
                  <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>{it.mediaAsset.width}×{it.mediaAsset.height} · {it.mediaAsset.format}</p>
                  <div className="flex gap-1">
                    <button disabled={idx === 0} onClick={() => move(idx, -1)} className="admin-btn admin-btn-ghost admin-btn-sm flex-1" style={{ minHeight: "44px" }}>↑</button>
                    <button disabled={idx === items.length - 1} onClick={() => move(idx, 1)} className="admin-btn admin-btn-ghost admin-btn-sm flex-1" style={{ minHeight: "44px" }}>↓</button>
                  </div>
                  <button onClick={() => remove(idx)} className="w-full admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", color: "var(--admin-error)" }}>Remove</button>
                  <a href={`/admin/media`} className="block text-xs text-center underline" style={{ color: "var(--admin-text-secondary)" }}>Edit alt via Media workflow</a>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <button onClick={() => setPickerOpen(true)} className="admin-btn admin-btn-primary admin-btn-md" style={{ minHeight: "44px" }}>Add images</button>
          <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary admin-btn-md" style={{ minHeight: "44px" }}>{saving ? "Saving…" : "Save gallery"}</button>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--admin-text-muted)" }}>Removal does not delete the MediaAsset; referenced assets remain protected from deletion via Restrict. Transaction-safe persistence; no client-supplied ownership trusted.</p>
      </AdminSectionCard>

      <MediaPicker open={pickerOpen} mode="image" selected={null} onSelect={(a) => { add(a); }} onClose={() => setPickerOpen(false)} title="Select gallery image" description="Image-only · duplicate blocked" folder="chittagong-trail/homepage" />
    </div>
  );
}
