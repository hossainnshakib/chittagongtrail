import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { registerDirectUpload } from "@/lib/media-service";
import { getCloudinaryClient } from "@/lib/cloudinary";

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

    try {
      const urlObj = new URL(secureUrl);
      if (urlObj.protocol !== "https:" || urlObj.hostname !== "res.cloudinary.com") {
        return NextResponse.json({ error: "Invalid secure URL" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid secure URL format" }, { status: 400 });
    }

    try {
      const cloudinary = getCloudinaryClient();
      const resource = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
      });

      if (!resource || resource.public_id !== publicId) {
        return NextResponse.json({ error: "Resource verification failed" }, { status: 400 });
      }

      if (resource.resource_type !== resourceType) {
        return NextResponse.json({ error: "Resource type mismatch" }, { status: 400 });
      }
    } catch (verifyError: unknown) {
      const msg = verifyError instanceof Error ? verifyError.message : "Verification failed";
      console.error("[api:media:register] Cloudinary resource verification failed:", msg);
      return NextResponse.json({ error: "Could not verify upload with Cloudinary" }, { status: 400 });
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
