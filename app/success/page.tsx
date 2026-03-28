import Link from "next/link";

import { SuccessClearCart } from "@/components/SuccessClearCart";
import { verifyCheckoutSession } from "@/lib/verify-checkout-session";
import { formatUsd } from "@/lib/format";

type Props = {
  searchParams: Promise<{
    session_id?: string;
    mock?: string;
    free_test?: string;
  }>;
};

export const metadata = {
  title: "Order confirmed",
};

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const isMock = params.mock === "true" || params.mock === "1";
  const isFreeTest = params.free_test === "true" || params.free_test === "1";

  const result = await verifyCheckoutSession({
    sessionId,
    isMock,
    isFreeTest,
  });

  const title =
    result.kind === "stripe_paid" ||
    result.kind === "free_test" ||
    result.kind === "mock"
      ? "Thank you"
      : result.kind === "stripe_unpaid" ||
          result.kind === "no_session" ||
          result.kind === "invalid_session_id"
        ? "Payment not completed"
        : "Could not verify payment";

  const body = (() => {
    switch (result.kind) {
      case "stripe_paid": {
        const total =
          result.amountTotal != null && result.currency === "usd"
            ? formatUsd(result.amountTotal)
            : result.amountTotal != null && result.currency
              ? `${(result.amountTotal / 100).toFixed(2)} ${result.currency.toUpperCase()}`
              : null;
        return (
          <>
            <p className="mt-4 text-[var(--muted)]">
              Your payment was confirmed with Stripe.{" "}
              {total ? `Total charged: ${total}. ` : null}
              You will receive a receipt by email if you provided one at
              checkout.
            </p>
            <p className="mt-3 text-xs text-green-400/90">
              Checkout verified successfully.
            </p>
          </>
        );
      }
      case "free_test":
        return (
          <p className="mt-4 text-[var(--muted)]">
            Test checkout completed. No payment was processed.
          </p>
        );
      case "mock":
        return (
          <p className="mt-4 text-[var(--muted)]">
            Your order was confirmed in demo mode (Stripe is not configured on
            this deployment). Configure STRIPE_SECRET_KEY and the three Price ID
            variables in Vercel, then redeploy.
          </p>
        );
      case "stripe_unpaid":
        return (
          <p className="mt-4 text-[var(--muted)]">
            This checkout session is not paid yet (status:{" "}
            {result.paymentStatus}). If you still need to pay, return to your
            cart and try checkout again.
          </p>
        );
      case "no_session":
        return (
          <p className="mt-4 text-[var(--muted)]">
            No checkout session was found. If you were paying for an order,
            please go back to your cart and complete checkout.
          </p>
        );
      case "invalid_session_id":
        return (
          <p className="mt-4 text-[var(--muted)]">
            This link does not match a valid Stripe checkout. Use the button on
            the cart page after a successful payment, or contact us if you need
            help.
          </p>
        );
      case "verification_failed":
        return (
          <p className="mt-4 text-[var(--muted)]">
            We could not confirm this payment with Stripe. Your card may not
            have been charged. Please try again from the cart, or contact us with
            this page&apos;s session reference if the problem continues.
          </p>
        );
      default:
        return null;
    }
  })();

  const showSessionLine =
    sessionId &&
    (result.kind === "stripe_paid" ||
      result.kind === "verification_failed" ||
      result.kind === "stripe_unpaid");

  return (
    <div className="mx-auto max-w-lg px-4 py-14 text-center sm:px-6">
      <SuccessClearCart enabled={result.clearCart} />
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {body}
      {showSessionLine ? (
        <p className="mt-4 font-mono text-xs text-[var(--muted)]">
          Session: {sessionId}
        </p>
      ) : sessionId &&
        (result.kind === "free_test" || result.kind === "mock") ? (
        <p className="mt-4 font-mono text-xs text-[var(--muted)]">
          Reference: {sessionId}
        </p>
      ) : null}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Back to home
        </Link>
        {result.kind === "stripe_unpaid" ||
        result.kind === "no_session" ||
        result.kind === "invalid_session_id" ||
        result.kind === "verification_failed" ? (
          <Link
            href="/cart"
            className="inline-block rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card)]"
          >
            View cart
          </Link>
        ) : null}
      </div>
    </div>
  );
}
