import type { ProductId } from "@/lib/products";

/**
 * Stripe Price IDs must be read with explicit `process.env.NAME` access.
 * Dynamic `process.env[name]` is not reliably populated in Next.js server bundles.
 */

function str(v: string | undefined): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Prefer STRIPE_PRICE_* (server-only); NEXT_PUBLIC_* kept for compatibility. */
function priceIds(): Record<ProductId, string | undefined> {
  return {
    standard:
      str(process.env.STRIPE_PRICE_STANDARD) ??
      str(process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD),
    paperOnly:
      str(process.env.STRIPE_PRICE_PAPER_ONLY) ??
      str(process.env.NEXT_PUBLIC_STRIPE_PRICE_PAPER_ONLY),
    tracked:
      str(process.env.STRIPE_PRICE_TRACKED) ??
      str(process.env.NEXT_PUBLIC_STRIPE_PRICE_TRACKED),
    testZero:
      str(process.env.STRIPE_PRICE_TEST_ZERO) ??
      str(process.env.NEXT_PUBLIC_STRIPE_PRICE_TEST_ZERO),
  };
}

/** Secret key present (server-side checkout possible). */
export function stripeSecretConfigured(): boolean {
  return Boolean(str(process.env.STRIPE_SECRET_KEY));
}

/** Real Stripe Checkout for the test product only (secret + test Price ID). */
export function stripeTestCheckoutReady(): boolean {
  return stripeSecretConfigured() && Boolean(priceIds().testZero);
}

/** Non-empty secret + three price IDs (empty strings count as missing). */
export function stripeEnvReady(): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!str(process.env.STRIPE_SECRET_KEY)) {
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
