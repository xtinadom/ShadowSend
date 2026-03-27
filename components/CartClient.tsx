"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { formatUsd } from "@/lib/format";

function lineTotalCents(productId: ProductId, qty: number): number {
  return PRODUCTS[productId].priceCentsFallback * qty;
}

export function CartClient() {
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<{
    ready: boolean;
    missing: string[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stripe-status")
      .then((res) => res.json() as Promise<{ stripeReady?: boolean; missing?: string[] }>)
      .then((data) => {
        if (cancelled) return;
        setStripeStatus({
          ready: data.stripeReady === true,
          missing: Array.isArray(data.missing) ? data.missing : [],
        });
      })
      .catch(() => {
        if (!cancelled) setStripeStatus({ ready: false, missing: [] });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(() => {
    return lines.reduce(
      (sum, l) => sum + lineTotalCents(l.productId, l.quantity),
      0,
    );
  }, [lines]);

  async function checkout() {
    setCheckoutError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setCheckoutError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setCheckoutError("No checkout URL returned");
    } catch {
      setCheckoutError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <p className="text-[var(--muted)]">Your cart is empty.</p>
        <Link
          href="/services"
          className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Browse services
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-6">
      {stripeStatus && !stripeStatus.ready ? (
        <div
          className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
          role="status"
        >
          <p className="font-medium text-amber-50">
            Checkout is in demo mode — Stripe is not fully configured on this
            server.
          </p>
          {stripeStatus.missing.length > 0 ? (
            <p className="mt-2 text-amber-100/90">
              Missing environment variables:{" "}
              {stripeStatus.missing.join(", ")}.
            </p>
          ) : null}
          <p className="mt-2 text-amber-100/80">
            In Vercel: Project → Settings → Environment Variables (enable{" "}
            <strong className="font-medium">Production</strong>), add the
            secret key and three Price IDs, then{" "}
            <strong className="font-medium">Redeploy</strong>. For local dev,
            copy <code className="rounded bg-black/30 px-1">.env.example</code>{" "}
            to <code className="rounded bg-black/30 px-1">.env.local</code> and
            fill in values.
          </p>
        </div>
      ) : null}

      <ul className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-[var(--card)]">
        {lines.map((line) => {
          const p = PRODUCTS[line.productId];
          const total = lineTotalCents(line.productId, line.quantity);
          return (
            <li
              key={line.productId}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  {formatUsd(p.priceCentsFallback)} each
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--muted)]">Qty</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) => {
                      const n = parseInt(e.target.value, 10);
                      if (Number.isNaN(n)) return;
                      setQuantity(line.productId, n);
                    }}
                    className="w-16 rounded border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm"
                  />
                </label>
                <p className="min-w-[5rem] text-right font-medium">
                  {formatUsd(total)}
                </p>
                <button
                  type="button"
                  onClick={() => remove(line.productId)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col items-end gap-4 border-t border-[var(--border)] pt-6">
        <p className="text-lg">
          Subtotal{" "}
          <span className="font-semibold">{formatUsd(subtotal)}</span>
        </p>
        <p className="max-w-md text-right text-xs text-[var(--muted)]">
          Checkout is handled securely (Stripe when configured). Totals here use
          list prices for reference. Billing statement will show as
          &quot;Xtinadom LLC&quot;.
        </p>
        {checkoutError ? (
          <p className="max-w-md text-left text-sm break-words text-red-400">
            {checkoutError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={checkout}
          disabled={loading}
          className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Processing…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
