import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const COOKIE_NAME = "session_token";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAuthorRoute = pathname.startsWith("/author");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAuthorRoute && !isAdminRoute) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session.role !== "ADMIN") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthorRoute && session.role !== "AUTHOR") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/author/:path*", "/admin/:path*"],
};
