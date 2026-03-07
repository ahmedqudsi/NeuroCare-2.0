import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const protectedRoutes = [
    "/fast-test",
    "/hospital-locator",
    "/rehabilitation",
    "/healthcare-services",
  ];

  const authRoutes = [
    "/login",
    "/signup",
    "/verify",
    "/forgot-password",
  ];

  const { pathname } = req.nextUrl;

  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    // return NextResponse.redirect(new URL("/login", req.url));
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirected", "true");
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/fast-test/:path*",
    "/hospital-locator/:path*",
    "/rehabilitation/:path*",
    "/healthcare-services/:path*",
    "/login",
    "/signup",
    "/verify/:path*",
    "/forgot-password",
  ],
};