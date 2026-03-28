import { getStripe } from "@/lib/stripe";

export type CheckoutVerification =
  | { kind: "free_test"; clearCart: true }
  | { kind: "mock"; clearCart: true }
  | { kind: "no_session"; clearCart: false }
  | { kind: "invalid_session_id"; clearCart: false }
  | {
      kind: "stripe_paid";
      clearCart: true;
      sessionId: string;
      amountTotal: number | null;
      currency: string | null;
    }
  | { kind: "stripe_unpaid"; clearCart: false; paymentStatus: string }
  | { kind: "verification_failed"; clearCart: false; message: string };

/**
 * Confirms success using Stripe’s API for real Checkout sessions (`cs_…`).
 * Mock / in-app flows use query flags only (no Stripe call).
 */
export async function verifyCheckoutSession(input: {
  sessionId: string | undefined;
  isMock: boolean;
  isFreeTest: boolean;
}): Promise<CheckoutVerification> {
  if (input.isFreeTest) {
    return { kind: "free_test", clearCart: true };
  }
  if (input.isMock) {
    return { kind: "mock", clearCart: true };
  }

  const raw = input.sessionId?.trim();
  if (!raw) {
    return { kind: "no_session", clearCart: false };
  }

  if (raw.startsWith("mock_") || raw.startsWith("free_test_")) {
    return { kind: "invalid_session_id", clearCart: false };
  }

  if (!raw.startsWith("cs_")) {
    return { kind: "invalid_session_id", clearCart: false };
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(raw);

    if (
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required"
    ) {
      return {
        kind: "stripe_paid",
        clearCart: true,
        sessionId: raw,
        amountTotal: session.amount_total,
        currency: session.currency,
      };
    }

    return {
      kind: "stripe_unpaid",
      clearCart: false,
      paymentStatus: session.payment_status,
    };
  } catch (e) {
    const message =
      e && typeof e === "object" && "message" in e
        ? String((e as { message: unknown }).message)
        : "Could not verify this checkout with Stripe.";
    return { kind: "verification_failed", clearCart: false, message };
  }
}
