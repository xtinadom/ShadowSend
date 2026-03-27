import type { ProductId } from "@/lib/products";

/**
 * Read env at runtime (avoids Next.js inlining NEXT_PUBLIC_* at build with stale/empty values).
 * Vercel injects vars when the function runs — dynamic lookup keeps that working.
 */
function env(name: string): string | undefined {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Prefer STRIPE_PRICE_* (server-only); NEXT_PUBLIC_* kept for compatibility. */
function priceIds(): Record<ProductId, string | undefined> {
  return {
    standard:
      env("STRIPE_PRICE_STANDARD") ?? env("NEXT_PUBLIC_STRIPE_PRICE_STANDARD"),
    paperOnly:
      env("STRIPE_PRICE_PAPER_ONLY") ??
      env("NEXT_PUBLIC_STRIPE_PRICE_PAPER_ONLY"),
    tracked:
      env("STRIPE_PRICE_TRACKED") ?? env("NEXT_PUBLIC_STRIPE_PRICE_TRACKED"),
  };
}

/** Non-empty secret + three price IDs (empty strings count as missing). */
export function stripeEnvReady(): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!env("STRIPE_SECRET_KEY")) {
    missing.push("STRIPE_SECRET_KEY");
  }
  const p = priceIds();
  if (!p.standard) {
    missing.push(
      "STRIPE_PRICE_STANDARD or NEXT_PUBLIC_STRIPE_PRICE_STANDARD",
    );
  }
  if (!p.paperOnly) {
    missing.push(
      "STRIPE_PRICE_PAPER_ONLY or NEXT_PUBLIC_STRIPE_PRICE_PAPER_ONLY",
    );
  }
  if (!p.tracked) {
    missing.push(
      "STRIPE_PRICE_TRACKED or NEXT_PUBLIC_STRIPE_PRICE_TRACKED",
    );
  }
  return { ok: missing.length === 0, missing };
}

export function getStripePriceIds(): Record<ProductId, string | undefined> {
  return priceIds();
}
