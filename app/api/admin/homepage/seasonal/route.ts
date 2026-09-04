import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSeasonal } from "@/lib/homepage-service";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      include: { seasonalMedia: true },
    });
    return NextResponse.json({
      seasonalEyebrow: settings?.seasonalEyebrow || "",
      seasonalTitle: settings?.seasonalTitle || "",
      seasonalContent: settings?.seasonalContent || "",
      seasonalMediaId: settings?.seasonalMediaId || null,
      seasonalMedia: settings?.seasonalMedia || null,
    });
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
    // Validate URL safety for content: sanitize handled in service
    // Validate no javascript/data schemes leaked via seasonalContent (sanitizeContent strips)
    await updateSeasonal({
      seasonalEyebrow: body.seasonalEyebrow,
      seasonalTitle: body.seasonalTitle,
      seasonalContent: body.seasonalContent,
      seasonalMediaId: body.seasonalMediaId,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to save";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
