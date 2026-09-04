import { validateSameOrigin } from "@/lib/csrf";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getAdminSiteSettings, updateSiteSettings } from "@/lib/settings-service";

export async function GET(request: NextRequest) {
  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getAdminSiteSettings();
    return NextResponse.json(settings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load settings";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfErr = validateSameOrigin(request);
  if (csrfErr) return csrfErr;

  const session = await verifySession(request.cookies.get("ct_admin_session")?.value || "");
  if (!session?.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update settings";
    console.error("[api:admin:settings] Update failed:", error);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
