import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getAdminPageSeoSettings, updatePageSeoSettings } from "@/lib/public-content";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json({ pages: await getAdminPageSeoSettings() });
  } catch {
    return NextResponse.json({ error: "Failed to load public page settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfErr = validateSameOrigin(request);
  if (csrfErr) return csrfErr;

  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const pages = await updatePageSeoSettings(body.pages);
    return NextResponse.json({ success: true, pages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update public page settings";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
