import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { registerDirectUpload } from "@/lib/media-service";

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

    if (typeof publicId !== "string" || typeof secureUrl !== "string" || typeof resourceType !== "string") {
      return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
    }

    if (resourceType !== "image" && resourceType !== "video") {
      return NextResponse.json({ error: "resourceType must be image or video" }, { status: 400 });
    }

    let mediaAsset;
    try {
      mediaAsset = await registerDirectUpload({
        publicId,
        secureUrl,
        resourceType,
        format,
        width: typeof width === "number" ? width : undefined,
        height: typeof height === "number" ? height : undefined,
        altText,
      });
    } catch {
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
