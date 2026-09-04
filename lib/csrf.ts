import { NextResponse, type NextRequest } from "next/server";

export function validateSameOrigin(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const originHeader = request.headers.get("origin");
  const secFetchSite = request.headers.get("sec-fetch-site");

  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
    return NextResponse.json(
      { error: "Forbidden - Cross-Site Request Prohibited" },
      { status: 403 }
    );
  }

  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim() || "https://chittagongtrail.org";
  const isProd = process.env.NODE_ENV === "production";

  let expectedOrigin = "";
  if (configuredSiteUrl) {
    try {
      expectedOrigin = new URL(configuredSiteUrl).origin;
    } catch {
      // invalid configured URL
    }
  }

  if (!expectedOrigin) {
    const host = request.headers.get("host") || "";
    const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    if (host) {
      expectedOrigin = `${proto}://${host}`;
    }
  }

  if (!originHeader) {
    if (isProd) {
      return NextResponse.json(
        { error: "Forbidden - Missing Origin Header in Production" },
        { status: 403 }
      );
    }
    return null;
  }

  try {
    const originUrl = new URL(originHeader);
    const expectedUrl = new URL(expectedOrigin);

    if (
      originUrl.protocol !== expectedUrl.protocol ||
      originUrl.hostname !== expectedUrl.hostname ||
      originUrl.port !== expectedUrl.port
    ) {
      return NextResponse.json(
        { error: "Forbidden - Origin Mismatch" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Forbidden - Malformed Origin Header" },
      { status: 403 }
    );
  }

  return null;
}
