import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { deleteUnreferencedMediaAsset, updateMediaAltText, getMediaAssetReferences, getAdminMediaAssetById } from "@/lib/media-service";

export async function POST(request: NextRequest) {
  const csrfErr = validateSameOrigin(request);
  if (csrfErr) return csrfErr;

  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, mediaId, altText } = body;

    if (!mediaId || typeof mediaId !== "number") {
      return NextResponse.json({ error: "Valid mediaId is required" }, { status: 400 });
    }

    if (action === "delete") {
      const result = await deleteUnreferencedMediaAsset(mediaId);
      return NextResponse.json(result);
    }

    if (action === "updateAltText") {
      const updated = await updateMediaAltText(mediaId, altText);
      return NextResponse.json({ success: true, updated });
    }

    if (action === "getReferences") {
      const references = await getMediaAssetReferences(mediaId);
      return NextResponse.json(references);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Media action failed";
    console.error("[admin-media-action]", error);
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const idStr = searchParams.get("id");

  if (idStr) {
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const asset = await getAdminMediaAssetById(id);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }
    return NextResponse.json(asset);
  }

  return NextResponse.json({ error: "Missing ID" }, { status: 400 });
}
