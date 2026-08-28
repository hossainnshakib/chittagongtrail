import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { verifySession } from "@/lib/auth";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const base = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${base}-${timestamp}-${random}.${ext}`;
}

export async function POST(request: NextRequest) {
  const session = await verifySession(
    request.cookies.get("ct_admin_session")?.value || ""
  );

  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 5MB" },
        { status: 400 }
      );
    }

    const safeFolder = folder
      .replace(/[^a-z0-9/-]/gi, "")
      .replace(/\/+/g, "/")
      .replace(/^\/|\/$/g, "");

    const uploadDir = join(process.cwd(), "public", safeFolder);
    await mkdir(uploadDir, { recursive: true });

    const safeFilename = sanitizeFilename(file.name);
    const filePath = join(uploadDir, safeFilename);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/${safeFolder}/${safeFilename}`;

    return NextResponse.json({ url, filename: safeFilename });
  } catch (error) {
    console.error("[upload]", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
