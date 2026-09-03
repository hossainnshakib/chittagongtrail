"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminSectionCard from "@/components/admin/ui/AdminSectionCard";

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  type: string;
  coverMedia?: { secureUrl: string; altText: string | null } | null;
}

export default function FeaturedFoodEditor() {
  const [featured, setFeatured] = useState<Post[]>([]);
  const [published, setPublished] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/homepage/featured-food?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((j) => { setFeatured(j.featured || []); setPublished(j.published || []); })
      .catch(() => setError("Failed to load"));
  }, [search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setTimeout(load, 400); return () => clearTimeout(t); }, [load]);

  const isSelected = (id: number) => featured.some((f) => f.id === id);
  const toggleSelect = (p: Post) => {
    setError(null);
    if (isSelected(p.id)) setFeatured((prev) => prev.filter((x) => x.id !== p.id));
    else {
      if (featured.length >= 3) { setError("Maximum 3 featured food posts allowed."); return; }
      setFeatured((prev) => [...prev, p]);
    }
  };
  const move = (idx: number, dir: -1 | 1) => {
    setFeatured((prev) => { const next = [...prev]; const tgt = idx + dir; if (tgt < 0 || tgt >= next.length) return prev; const tmp = next[idx]; next[idx] = next[tgt]; next[tgt] = tmp; return next; });
  };
  const save = async () => {
    setSaving(true); setError(null); setMsg(null);
    try {
      const res = await fetch("/api/admin/homepage/featured-food", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: featured.map((f) => f.id) }) });
      const j = await res.json(); if (!res.ok) throw new Error(j.error); setMsg("Featured food saved."); setTimeout(() => setMsg(null), 3000); load();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <AdminPageHeader title="Featured Food" description="FOOD-only · published-only · max 3 · canonical/admin links use /food" primaryAction={<AdminButton href="/admin/homepage" variant="ghost" size="sm">Back</AdminButton>} />
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}
      {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">{msg}</div>}

      <AdminSectionCard title={`Selected: ${featured.length} / 3`} description="FOOD-only server query — never includes STORY.">
        {featured.length === 0 ? <p className="text-sm py-4 text-center" style={{ color: "var(--admin-text-muted)" }}>No featured food posts. Empty state.</p> : (
          <div className="space-y-2">
            {featured.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3 p-3 border rounded" style={{ borderColor: "var(--admin-border)" }}>
                <div className="w-12 h-12 rounded overflow-hidden relative flex-shrink-0 border" style={{ borderColor: "var(--admin-border)" }}>{p.coverMedia?.secureUrl ? <Image src={p.coverMedia.secureUrl} alt={p.coverMedia.altText || p.title} fill className="object-cover" sizes="48px" /> : <div className="w-full h-full bg-gray-100" />}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.title}</p><p className="text-xs truncate" style={{ color: "var(--admin-text-secondary)" }}>{p.type} · {p.status} · /food/{p.slug}</p></div>
                <div className="flex gap-1">
                  <button disabled={idx === 0} onClick={() => move(idx, -1)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", minWidth: "44px" }}>↑</button>
                  <button disabled={idx === featured.length - 1} onClick={() => move(idx, 1)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px", minWidth: "44px" }}>↓</button>
                  <button onClick={() => toggleSelect(p)} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px" }}>Remove</button>
                  <Link href={`/admin/food/${p.id}/edit`} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px" }}>Edit</Link>
                  <Link href={`/food/${p.slug}`} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ minHeight: "44px" }} target="_blank">Preview</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4"><button onClick={save} disabled={saving} className="admin-btn admin-btn-primary admin-btn-md" style={{ minHeight: "44px" }}>{saving ? "Saving…" : "Save order"}</button><span className="ml-3 text-xs" style={{ color: "var(--admin-text-muted)" }}>STORY excluded server-side; /food canonical preserved.</span></div>
      </AdminSectionCard>

      <AdminSectionCard title="Published FOOD posts" description="Search published FOOD posts.">
        <div className="mb-3"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title or slug…" className="w-full px-3 py-2 border rounded text-sm" style={{ borderColor: "var(--admin-border)", minHeight: "44px" }} /></div>
        <div className="grid gap-2">
          {published.map((p) => {
            const selected = isSelected(p.id);
            return (
              <div key={p.id} className="flex items-center gap-3 p-3 border rounded" style={{ borderColor: selected ? "var(--admin-brand-accent)" : "var(--admin-border)", background: selected ? "#FDF5E6" : "var(--admin-surface)" }}>
                <div className="w-12 h-12 rounded overflow-hidden relative flex-shrink-0 border" style={{ borderColor: "var(--admin-border)" }}>{p.coverMedia?.secureUrl ? <Image src={p.coverMedia.secureUrl} alt={p.coverMedia.altText || p.title} fill className="object-cover" sizes="48px" /> : <div className="w-full h-full bg-gray-100" />}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.title}</p><p className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>FOOD · {p.status}</p></div>
                <button onClick={() => toggleSelect(p)} disabled={!selected && featured.length >= 3} className={`admin-btn admin-btn-sm ${selected ? "admin-btn-ghost" : "admin-btn-primary"}`} style={{ minHeight: "44px", minWidth: "88px" }}>{selected ? "Selected" : "Select"}</button>
              </div>
            );
          })}
          {published.length === 0 && <p className="text-sm py-6 text-center" style={{ color: "var(--admin-text-muted)" }}>No published FOOD posts found.</p>}
        </div>
      </AdminSectionCard>
    </div>
  );
}
