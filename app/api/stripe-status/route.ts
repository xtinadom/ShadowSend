import { NextResponse } from "next/server";
import {
  stripeEnvReady,
  stripeTestCheckoutReady,
} from "@/lib/stripe-env";

export const dynamic = "force-dynamic";

/** GET — open in browser to see if Stripe env is ready (no secrets). */
export async function GET() {
  const { ok, missing } = stripeEnvReady();
  return NextResponse.json({
    stripeReady: ok,
    missing,
    testStripeReady: stripeTestCheckoutReady(),
  });
}
