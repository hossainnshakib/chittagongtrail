import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getHomepageGallery, setHomepageGallery } from "@/lib/homepage-service";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await getHomepageGallery();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const ids: number[] = Array.isArray(body.ids) ? body.ids.map((v: unknown) => Number(v)) : [];
    // also support alternative payload { mediaAssetIds }
    const altIds: number[] = Array.isArray(body.mediaAssetIds) ? body.mediaAssetIds.map((v: unknown) => Number(v)) : [];
    const finalIds = ids.length ? ids : altIds;
    // If body contains gallery ordering with sortOrder? we just use ordered ids
    await setHomepageGallery(finalIds);
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
