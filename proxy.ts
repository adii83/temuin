import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_ROLE,
  adminProtectedPrefixes,
  AUTH_COOKIE,
  publicPaths,
  USER_ROLE,
  userProtectedPrefixes,
} from "./src/lib/auth";

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(AUTH_COOKIE)?.value;

  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (matchesPrefix(pathname, userProtectedPrefixes)) {
    if (role !== USER_ROLE) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  if (matchesPrefix(pathname, adminProtectedPrefixes)) {
    if (role !== ADMIN_ROLE) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
