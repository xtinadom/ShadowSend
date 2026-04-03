import { NextResponse } from "next/server";

import { createSiteLockCookieValue } from "@/lib/site-lock";

export const runtime = "nodejs";

const MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!password) {
    return NextResponse.json({
      ok: true,
      message: "Site lock is not configured.",
    });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password !== password) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const value = createSiteLockCookieValue(password, MAX_AGE);
  const secure = process.env.NODE_ENV === "production";

  const res = NextResponse.json({ ok: true });
  res.cookies.set("site_lock", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure,
  });
  return res;
}
