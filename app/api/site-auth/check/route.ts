import { NextResponse } from "next/server";

import {
  getCookieFromHeader,
  verifyBasicAuthHeader,
  verifySiteLockCookieValue,
} from "@/lib/site-lock";

export const runtime = "nodejs";

/** Internal: Edge middleware calls this; password is read here (Node), not in middleware. */
export async function GET(request: Request) {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  const expectedUser = (process.env.SITE_ACCESS_USER ?? "").trim();

  if (!password) {
    return NextResponse.json({ allow: true });
  }

  if (
    verifyBasicAuthHeader(
      request.headers.get("authorization"),
      password,
      expectedUser,
    )
  ) {
    return NextResponse.json({ allow: true });
  }

  const raw = getCookieFromHeader(request.headers.get("cookie"), "site_lock");
  if (raw && verifySiteLockCookieValue(raw, password)) {
    return NextResponse.json({ allow: true });
  }

  return NextResponse.json({ allow: false }, { status: 401 });
}
