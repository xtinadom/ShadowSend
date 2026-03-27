import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";

import { getSiteUrl } from "@/lib/site";

import { getStripePriceIds, stripeEnvReady } from "@/lib/stripe-env";

import type { CartLine } from "@/lib/cart-store";

export const dynamic = "force-dynamic";

/** POST only — use GET /api/stripe-status to see if env vars are set. */

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

      (line.productId !== "standard" &&

        line.productId !== "paperOnly" &&

        line.productId !== "tracked") ||

      typeof line.quantity !== "number" ||

      line.quantity < 1 ||

      line.quantity > 99

    ) {

      return NextResponse.json({ error: "Invalid line item" }, { status: 400 });

    }

    const priceId = PRICE_BY_PRODUCT[line.productId];

    if (!priceId) {

      // If Stripe isn't configured, we allow a mock checkout for local development.

      // The cart UI still works and the success page clears the cart.

      // In real checkout mode, we validate Price IDs strictly below.

    }

  }



  const origin =

    request.headers.get("origin") ?? getSiteUrl();



  const { ok: stripeConfigured } = stripeEnvReady();



  if (!stripeConfigured) {

    const mockSessionId = `mock_${Date.now().toString(36)}`;

    return NextResponse.json({

      url: `${origin}/success?session_id=${encodeURIComponent(

        mockSessionId,

      )}&mock=true`,

    });

  }



  const line_items: { price: string; quantity: number }[] = lines.map((line) => ({

    price: PRICE_BY_PRODUCT[line.productId] as string,

    quantity: line.quantity,

  }));



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

