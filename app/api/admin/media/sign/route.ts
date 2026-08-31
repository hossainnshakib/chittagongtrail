import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getCloudinaryClient, ALLOWED_UPLOAD_FOLDERS, CLOUDINARY_CLOUD_NAME } from "@/lib/cloudinary";

const VALID_RESOURCE_TYPES = ["image", "video"] as const;

export async function POST(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { folder, resourceType } = body;

    if (typeof folder !== "string" || !ALLOWED_UPLOAD_FOLDERS.includes(folder as typeof ALLOWED_UPLOAD_FOLDERS[number])) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    if (typeof resourceType !== "string" || !VALID_RESOURCE_TYPES.includes(resourceType as typeof VALID_RESOURCE_TYPES[number])) {
      return NextResponse.json({ error: "Invalid resource type" }, { status: 400 });
    }

    const cloudinary = getCloudinaryClient();
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign: Record<string, string | number> = {
      folder,
      timestamp,
      resource_type: resourceType,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET!);

    return new NextResponse(JSON.stringify({
      signature,
      timestamp,
      cloudName: CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
      resourceType,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[api:media:sign]", error);
    return NextResponse.json({ error: "Failed to generate upload signature" }, { status: 500 });
  }
}
