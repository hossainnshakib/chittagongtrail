import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { listAdminMediaAssets } from "@/lib/media-service";

export async function GET(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const search = searchParams.get("search") || undefined;
  const format = searchParams.get("format") || undefined;
  const folder = searchParams.get("folder") || undefined;
  const resourceType = searchParams.get("resourceType") || undefined;

  try {
    const result = await listAdminMediaAssets({
      page,
      limit,
      search,
      format,
      folder,
      resourceType: resourceType === "image" || resourceType === "video" ? resourceType : undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to list media assets";
    console.error("[media-list-api]", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
