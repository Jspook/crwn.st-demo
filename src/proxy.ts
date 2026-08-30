import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie = request.cookies.get("crwn_session");
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payloadStr = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    const session = JSON.parse(payloadStr);

    // RBAC logic
    if (pathname.startsWith("/staff/cashier") && session.role !== "CASHIER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/staff/fitting") && session.role !== "FITTING_STAFF") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/customer") && session.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid cookie
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
