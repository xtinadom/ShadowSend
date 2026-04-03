import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Site lock: password is verified in Node (`/api/site-auth/check`) so it works
 * on Vercel Edge + local dev (including Turbopack), where middleware may not
 * see `SITE_ACCESS_PASSWORD`.
 *
 * Allowed without check: Stripe webhooks, auth routes, login page, Next assets,
 * favicon, /email/* (order email images).
 */

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/api/webhooks/stripe")) return true;
  if (pathname.startsWith("/api/site-auth/")) return true;
  if (pathname === "/site-lock" || pathname.startsWith("/site-lock/"))
    return true;
  if (pathname.startsWith("/_next/static")) return true;
  if (pathname.startsWith("/_next/image")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname.startsWith("/email/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const checkUrl = new URL("/api/site-auth/check", request.url);
  let res: Response;
  try {
    res = await fetch(checkUrl, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
        authorization: request.headers.get("authorization") ?? "",
      },
      cache: "no-store",
    });
  } catch (e) {
    console.error("[middleware] site-auth check fetch failed", e);
    return new NextResponse("Service unavailable", { status: 503 });
  }

  if (res.ok) {
    try {
      const data = (await res.json()) as { allow?: boolean };
      if (data.allow) {
        return NextResponse.next();
      }
    } catch {
      /* fall through */
    }
  }

  const isApi = pathname.startsWith("/api/");
  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL("/site-lock", request.url);
  url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico).+)",
  ],
};
