import Link from "next/link";
import { SuccessClearCart } from "@/components/SuccessClearCart";

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

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const isMock = params.mock === "true" || params.mock === "1";
  const isFreeTest = params.free_test === "true" || params.free_test === "1";

  return (
    <div className="mx-auto max-w-lg px-4 py-14 text-center sm:px-6">
      <SuccessClearCart sessionId={sessionId} />
      <h1 className="text-3xl font-semibold tracking-tight">Thank you</h1>
      <p className="mt-4 text-[var(--muted)]">
        {isFreeTest
          ? "Test checkout completed. No payment was processed."
          : isMock
            ? "Your order was confirmed in demo mode (Stripe is not configured on this deployment). Configure STRIPE_SECRET_KEY and the three Price ID variables in Vercel, then redeploy."
            : "Your payment was submitted through Stripe. You will receive a receipt by email if one was provided at checkout."}
      </p>
      {sessionId ? (
        <p className="mt-4 font-mono text-xs text-[var(--muted)]">
          Session: {sessionId}
        </p>
      ) : null}
      <Link
        href="/"
        className="mt-10 inline-block rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
