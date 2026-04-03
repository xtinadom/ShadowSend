import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Whole-site password when SITE_ACCESS_PASSWORD is set (HTTP Basic Auth).
 * Omit the variable locally or in production to leave the site public.
 *
 * Excluded paths: Stripe webhooks, Next assets, favicon, /email/* (images in purchaser emails).
 */

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/api/webhooks/stripe")) return true;
  if (pathname.startsWith("/_next/static")) return true;
  if (pathname.startsWith("/_next/image")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/email/")) return true;
  return false;
}

function checkBasicAuth(
  request: NextRequest,
  expectedUser: string,
  expectedPassword: string,
): boolean {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return false;
  }

  const colon = decoded.indexOf(":");
  const user = colon >= 0 ? decoded.slice(0, colon) : "";
  const pass = colon >= 0 ? decoded.slice(colon + 1) : decoded;

  if (pass !== expectedPassword) return false;
  if (expectedUser === "") return true;
  return user === expectedUser;
}

/** Runtime env read — avoids build-time inlining so Vercel injects values per deployment. */
function siteAccessPassword(): string | undefined {
  const k = "SITE_ACCESS_" + "PASSWORD";
  const v = process.env[k];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

function siteAccessUser(): string {
  const k = "SITE_ACCESS_" + "USER";
  const v = process.env[k];
  return typeof v === "string" ? v.trim() : "";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const password = siteAccessPassword();
  if (!password) {
    return NextResponse.next();
  }

  const expectedUser = siteAccessUser();

  if (checkBasicAuth(request, expectedUser, password)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ShadowSend"',
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico).+)",
  ],
};
