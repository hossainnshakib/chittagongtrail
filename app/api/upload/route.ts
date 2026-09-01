// @internal Legacy server-proxied upload route. Not called by any current Admin UI.
// Active admin workflows use DirectUpload (sign -> Cloudinary -> register).
// Retained for backward compatibility only. Do not use for new admin upload flows.
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getCloudinaryClient, ALLOWED_UPLOAD_FOLDERS, UploadFolder, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/cloudinary";
import { registerUploadedAsset, cleanupOrphanCloudinaryAsset } from "@/lib/media-service";

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES];

const MAX_SIZE = MAX_IMAGE_SIZE;

export async function POST(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uploadedPublicId: string | null = null;
  let uploadedResourceType = "image";

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = (formData.get("folder") as string) || "chittagong-trail/general";
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 10MB" },
        { status: 400 }
      );
    }

    const folder: UploadFolder = ALLOWED_UPLOAD_FOLDERS.includes(requestedFolder as UploadFolder)
      ? (requestedFolder as UploadFolder)
      : "chittagong-trail/general";

    const cloudinary = getCloudinaryClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const res = uploadResult as {
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
      resource_type: string;
    };

    uploadedPublicId = res.public_id;
    uploadedResourceType = res.resource_type || "image";

    // Register MediaAsset record in DB with partial failure handling
    let mediaAsset;
    try {
      mediaAsset = await registerUploadedAsset({
        publicId: res.public_id,
        secureUrl: res.secure_url,
        width: res.width,
        height: res.height,
        format: res.format,
        resourceType: res.resource_type,
        altText: altText || undefined,
      });
    } catch (dbError) {
      console.error("[upload] Database registration failed after Cloudinary upload. Cleaning up Cloudinary asset...", dbError);
      if (uploadedPublicId) {
        await cleanupOrphanCloudinaryAsset(uploadedPublicId, uploadedResourceType);
      }
      return NextResponse.json(
        { error: "Failed to persist media asset record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: mediaAsset.id,
      url: mediaAsset.secureUrl,
      publicId: mediaAsset.publicId,
      width: mediaAsset.width,
      height: mediaAsset.height,
      format: mediaAsset.format,
      resourceType: mediaAsset.resourceType,
      altText: mediaAsset.altText,
    });
  } catch (error) {
    console.error("[upload] Upload error:", error);
    if (uploadedPublicId) {
      await cleanupOrphanCloudinaryAsset(uploadedPublicId, uploadedResourceType);
    }
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
