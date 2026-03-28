import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

import { getSiteUrl } from "@/lib/site";

import { PRODUCTS } from "@/lib/products";

import { buildCheckoutLineItems } from "@/lib/checkout-line-items";

import { getStripePriceIds, stripeSecretConfigured } from "@/lib/stripe-env";

import type { CartLine } from "@/lib/cart-store";

export const dynamic = "force-dynamic";

/** POST only — use GET /api/stripe-status to see if env vars are set. */

function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce(
    (sum, line) =>
      sum + PRODUCTS[line.productId].priceCentsFallback * line.quantity,
    0,
  );
}

export async function POST(request: Request) {
  let body: { lines?: CartLine[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lines = body.lines;

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const PRICE_BY_PRODUCT = getStripePriceIds();

  for (const line of lines) {
    if (
      !line ||
      !(line.productId in PRODUCTS) ||
      typeof line.quantity !== "number" ||
      line.quantity < 1 ||
      line.quantity > 99
    ) {
      return NextResponse.json({ error: "Invalid line item" }, { status: 400 });
    }

  }

  const hasTestZero = lines.some((l) => l.productId === "testZero");
  const hasPaidCatalogProduct = lines.some((l) => l.productId !== "testZero");

  if (hasTestZero && hasPaidCatalogProduct) {
    return NextResponse.json(
      {
        error:
          "Remove the test checkout item from your cart to pay for services, or check out with only the test item.",
      },
      { status: 400 },
    );
  }

  const origin = request.headers.get("origin") ?? getSiteUrl();

  const subtotalCents = cartSubtotalCents(lines);

  const cartOnlyTestZero =
    lines.length > 0 && lines.every((l) => l.productId === "testZero");

  const canUseStripe = stripeSecretConfigured();

  const useStripeForZeroTest =
    subtotalCents === 0 && stripeSecretConfigured();

  if (subtotalCents === 0 && !useStripeForZeroTest) {
    const sessionId = `free_test_${Date.now().toString(36)}`;
    return NextResponse.json({
      url: `${origin}/success?session_id=${encodeURIComponent(sessionId)}&free_test=1`,
    });
  }

  if (!canUseStripe && subtotalCents > 0) {
    if (cartOnlyTestZero) {
      return NextResponse.json(
        {
          error:
            "Test checkout is not configured. Add STRIPE_SECRET_KEY to your host (e.g. Vercel), then redeploy.",
        },
        { status: 503 },
      );
    }

    const mockSessionId = `mock_${Date.now().toString(36)}`;

    return NextResponse.json({
      url: `${origin}/success?session_id=${encodeURIComponent(
        mockSessionId,
      )}&mock=true`,
    });
  }

  const line_items = buildCheckoutLineItems(lines, PRICE_BY_PRODUCT);

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items,

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/cart`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session" },

        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);

    const message =
      e && typeof e === "object" && "message" in e
        ? String((e as { message: unknown }).message)
        : "Stripe error while creating checkout session";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
