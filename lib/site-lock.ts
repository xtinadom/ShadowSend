import { createHmac, timingSafeEqual } from "node:crypto";

const PREFIX = "shadowsend-site-lock";

export function createSiteLockCookieValue(
  password: string,
  maxAgeSec: number,
): string {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec;
  const sig = createHmac("sha256", password)
    .update(`${PREFIX}|${exp}`)
    .digest("hex");
  return `${exp}:${sig}`;
}

export function verifySiteLockCookieValue(
  value: string,
  password: string,
): boolean {
  const i = value.lastIndexOf(":");
  if (i <= 0) return false;
  const expStr = value.slice(0, i);
  const sig = value.slice(i + 1);
  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() / 1000 > exp) return false;
  const expected = createHmac("sha256", password)
    .update(`${PREFIX}|${exp}`)
    .digest("hex");
  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}

export function verifyBasicAuthHeader(
  header: string | null,
  password: string,
  expectedUser: string,
): boolean {
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
  if (pass !== password) return false;
  if (expectedUser === "") return true;
  return user === expectedUser;
}

export function getCookieFromHeader(
  header: string | null,
  name: string,
): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const k = trimmed.slice(0, eq).trim();
    if (k !== name) continue;
    return decodeURIComponent(trimmed.slice(eq + 1).trim());
  }
  return undefined;
}
