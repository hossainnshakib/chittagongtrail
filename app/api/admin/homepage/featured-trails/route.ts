import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@prisma/client";
import { updateFeaturedTrails } from "@/lib/homepage-service";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const featured = await prisma.trailLocation.findMany({
      where: { isFeatured: true },
      orderBy: [{ featuredOrder: "asc" }, { id: "asc" }],
      include: { coverMedia: true },
    });
    const published = await prisma.trailLocation.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(search ? { OR: [{ name: { contains: search } }, { slug: { contains: search } }] } : {}),
      },
      take: 50,
      orderBy: [{ updatedAt: "desc" }],
      include: { coverMedia: true },
    });
    return NextResponse.json({ featured, published });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfErr = validateSameOrigin(request);
  if (csrfErr) return csrfErr;

  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const ids: number[] = Array.isArray(body.ids) ? body.ids.map((v: unknown) => Number(v)) : [];
    await updateFeaturedTrails(ids);
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
