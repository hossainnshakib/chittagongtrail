import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { registerDirectUpload, cleanupOrphanCloudinaryAsset } from "@/lib/media-service";

export async function POST(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { publicId, secureUrl, resourceType, format, width, height, altText } = body;

    if (!publicId || !secureUrl || !resourceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let mediaAsset;
    try {
      mediaAsset = await registerDirectUpload({
        publicId,
        secureUrl,
        resourceType,
        format,
        width,
        height,
        altText,
      });
    } catch {
      if (resourceType === "image" || resourceType === "video") {
        await cleanupOrphanCloudinaryAsset(publicId, resourceType);
      }
      return NextResponse.json(
        { error: "Failed to register media asset" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: mediaAsset.id,
      publicId: mediaAsset.publicId,
      secureUrl: mediaAsset.secureUrl,
      resourceType: mediaAsset.resourceType,
      format: mediaAsset.format,
      width: mediaAsset.width,
      height: mediaAsset.height,
      altText: mediaAsset.altText,
    });
  } catch (error) {
    console.error("[api:media:register]", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
