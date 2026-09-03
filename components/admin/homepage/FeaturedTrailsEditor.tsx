"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";

interface Trail {
  id: number;
  name: string;
  slug: string;
  district: string;
  status: string;
  coverMedia?: { secureUrl: string; altText: string | null } | null;
  featuredOrder?: number | null;
  isFeatured?: boolean;
}

export default function FeaturedTrailsEditor() {
  const [featured, setFeatured] = useState<Trail[]>([]);
  const [published, setPublished] = useState<Trail[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/homepage/featured-trails?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((j) => { setFeatured(j.featured || []); setPublished(j.published || []); })
      .catch(() => setError("Failed to load"));
  }, [search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [load]);

  const isSelected = (id: number) => featured.some((f) => f.id === id);
  const toggleSelect = (trail: Trail) => {
    setError(null);
    if (isSelected(trail.id)) {
      setFeatured((prev) => prev.filter((p) => p.id !== trail.id));
    } else {
      if (featured.length >= 4) { setError("Maximum 4 featured trails allowed."); return; }
      setFeatured((prev) => [...prev, { ...trail, featuredOrder: prev.length }]);
    }
  };
  const move = (idx: number, dir: -1 | 1) => {
    setFeatured((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      const tmp = next[idx]; next[idx] = next[target]; next[target] = tmp;
      return next;
    });
  };
  const save = async () => {
    setSaving(true); setError(null); setMsg(null);
    try {
      const res = await fetch("/api/admin/homepage/featured-trails", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: featured.map((f) => f.id) }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed");
      setMsg("Featured trails saved and homepage revalidated.");
      load();
      setTimeout(() => setMsg(null), 3000);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <AdminPageHeader title="Featured Trails" description="Select up to 4 published trails. Ordering persists server-side." primaryAction={<AdminButton href="/admin/homepage" variant="ghost" size="sm">Back</AdminButton>} />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{msg}</div>}

      <AdminSectionCard title={`Selected: ${featured.length} / 4`} description="Use Move Up/Down to order. Unpublished trails cannot be selected; public homepage excludes unpublished already-selected items with Admin warning.">
        {featured.length === 0 ? <p className="text-sm py-4 text-center" style={{ color: "var(--admin-text-muted)" }}>No featured trails selected.</p> : (
          <div className="space-y-2">
            {featured.map((t, idx) => (
              <div key={t.id} className="flex items-center gap-3 p-3 border rounded" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}>
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border relative" style={{ borderColor: "var(--admin-border)" }}>
                  {t.coverMedia?.secureUrl ? <Image src={t.coverMedia.secureUrl} alt={t.coverMedia.altText || t.name} fill className="object-cover" sizes="48px" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs" style={{ color: "var(--admin-text-muted)" }}>No cover</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--admin-text-secondary)" }}>{t.district} · {t.status} · /trails/{t.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button disabled={idx === 0} onClick={() => move(idx, -1)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", minWidth: "44px" }} aria-label="Move up">↑</button>
                  <button disabled={idx === featured.length - 1} onClick={() => move(idx, 1)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", minWidth: "44px" }} aria-label="Move down">↓</button>
                  <button onClick={() => toggleSelect(t)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px" }}>Remove</button>
                  <Link href={`/admin/trails/${t.id}/edit`} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px" }}>Edit</Link>
                  <Link href={`/trails/${t.slug}`} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px" }} target="_blank">Preview</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary admin-btn-md" style={{ minHeight: "44px" }}>{saving ? "Saving…" : "Save order"}</button>
          <span className="ml-3 text-xs" style={{ color: "var(--admin-text-muted)" }}>Deterministic ordering via featuredOrder sequential values; server-side limit 4.</span>
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Published trails" description="Search and select — unpublished/archived cannot be selected. Duplicate records not created.">
        <div className="mb-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or slug…" className="w-full px-3 py-2 border rounded text-sm" style={{ borderColor: "var(--admin-border)", minHeight: "44px" }} />
        </div>
        <div className="grid gap-2">
          {published.map((t) => {
            const selected = isSelected(t.id);
            return (
              <div key={t.id} className="flex items-center gap-3 p-3 border rounded" style={{ borderColor: selected ? "var(--admin-brand-accent)" : "var(--admin-border)", background: selected ? "#FDF5E6" : "var(--admin-surface)" }}>
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border relative" style={{ borderColor: "var(--admin-border)" }}>
                  {t.coverMedia?.secureUrl ? <Image src={t.coverMedia.secureUrl} alt={t.coverMedia.altText || t.name} fill className="object-cover" sizes="48px" /> : <div className="w-full h-full bg-gray-100" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--admin-text-secondary)" }}>{t.district} · {t.status}</p>
                </div>
                <button onClick={() => toggleSelect(t)} disabled={!selected && featured.length >= 4} className={`admin-btn admin-btn-sm ${selected ? "admin-btn-ghost" : "admin-btn-primary"}`} style={{ minHeight: "44px", minWidth: "88px" }}>{selected ? "Selected" : "Select"}</button>
              </div>
            );
          })}
          {published.length === 0 && <p className="text-sm py-6 text-center" style={{ color: "var(--admin-text-muted)" }}>No published trails found.</p>}
        </div>
      </AdminSectionCard>
    </div>
  );
}
