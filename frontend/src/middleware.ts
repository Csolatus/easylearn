import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwtPayload } from "@/lib/auth";

const ROLE_DASHBOARDS: Record<string, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  school_admin: "/school_admin/dashboard",
  super_admin: "/super_admin/dashboard",
};

const ROLE_PREFIXES: Record<string, string> = {
  student: "/student",
  teacher: "/teacher",
  school_admin: "/school_admin",
  super_admin: "/super_admin",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isProtected = Object.values(ROLE_PREFIXES).some((p) => pathname.startsWith(p));
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Auth pages: redirect to dashboard if already logged in
  if (isAuthPage) {
    if (token) {
      const payload = decodeJwtPayload(token);
      const dashboard = payload?.role ? ROLE_DASHBOARDS[payload.role] : null;
      if (dashboard) return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  // Protected pages: redirect to login if no token
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = decodeJwtPayload(token);
    const role = payload?.role;

    // Redirect to correct dashboard if wrong section
    if (!role || !ROLE_PREFIXES[role] || !pathname.startsWith(ROLE_PREFIXES[role])) {
      const dashboard = role ? ROLE_DASHBOARDS[role] : "/login";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/school_admin/:path*",
    "/super_admin/:path*",
    "/login",
    "/register",
  ],
};
