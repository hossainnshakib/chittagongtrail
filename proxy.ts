import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_SESSION_COOKIE = "ct_admin_session";
const LOGIN_PATH = "/admin/login";

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = getAuthSecret();
    if (!secret) return false;
    const { payload } = await jwtVerify(token, secret);
    return (
      typeof payload.email === "string" && payload.authenticated === true
    );
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    pathname.startsWith("/admin") && pathname !== LOGIN_PATH;
  const isAdminApi =
    pathname.startsWith("/api/admin") || pathname.startsWith("/api/upload");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";
  const isAuthenticated = token ? await verifyToken(token) : false;

  if (isAdminPage) {
    if (!isAuthenticated) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminApi) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload"],
};
