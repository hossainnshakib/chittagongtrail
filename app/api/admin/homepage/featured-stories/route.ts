import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContentStatus, JournalType } from "@prisma/client";
import { updateFeaturedStories } from "@/lib/homepage-service";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const featured = await prisma.journalPost.findMany({
      where: { isFeatured: true, type: JournalType.STORY },
      orderBy: [{ featuredOrder: "asc" }, { id: "asc" }],
      include: { coverMedia: true, trail: { select: { id: true, name: true, slug: true } } },
    });
    const published = await prisma.journalPost.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        type: JournalType.STORY,
        ...(search ? { OR: [{ title: { contains: search } }, { slug: { contains: search } }] } : {}),
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
    await updateFeaturedStories(ids);
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
