import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";
import { sendOrderConfirmationEmail } from "@/lib/send-order-confirmation-email";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (process.env.NODE_ENV === "development") {
        console.info("[stripe] checkout.session.completed", session.id);
      }

      const paid =
        session.payment_status === "paid" ||
        session.payment_status === "no_payment_required";
      const to =
        session.customer_details?.email ?? session.customer_email ?? null;
      if (paid && to) {
        const result = await sendOrderConfirmationEmail({
          to,
          customerName: session.customer_details?.name ?? null,
          sessionId: session.id,
          amountTotal: session.amount_total,
          currency: session.currency,
        });
        if (!result.ok) {
          console.warn("[stripe] order confirmation email skipped:", result.reason);
        }
      } else if (paid && !to) {
        console.warn(
          "[stripe] checkout.session.completed without customer email",
          session.id,
        );
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
