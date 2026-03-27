import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  body?: string;
};

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, subject, body } = data;
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof body !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !subject.trim() ||
    !body.trim()
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Hook: forward to email provider (Resend, etc.) in production.
  if (process.env.NODE_ENV === "development") {
    console.info("[contact]", { name, email, subject, bodyLength: body.length });
  }

  return NextResponse.json({ ok: true });
}
