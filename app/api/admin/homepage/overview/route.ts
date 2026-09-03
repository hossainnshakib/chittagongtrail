import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getHomepageOverview } from "@/lib/homepage-service";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const overview = await getHomepageOverview();
    // Additional admin-published counts for warning display
    const trailWarnings = await prisma.trailLocation.findMany({
      where: { isFeatured: true, status: { not: "PUBLISHED" as never } },
      select: { id: true, name: true, status: true },
    });
    const storyWarnings = await prisma.journalPost.findMany({
      where: { isFeatured: true, type: "STORY" as never, status: { not: "PUBLISHED" as never } },
      select: { id: true, title: true, status: true },
    });
    const foodWarnings = await prisma.journalPost.findMany({
      where: { isFeatured: true, type: "FOOD" as never, status: { not: "PUBLISHED" as never } },
      select: { id: true, title: true, status: true },
    });
    return NextResponse.json({ overview, warnings: { trailWarnings, storyWarnings, foodWarnings } });
  } catch {
    return NextResponse.json({ error: "Failed to load overview" }, { status: 500 });
  }
}
