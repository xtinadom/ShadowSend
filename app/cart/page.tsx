import Link from "next/link";
import { CartClient } from "@/components/CartClient";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
      <p className="mt-2 text-[var(--muted)]">
        Please double check{" "}
        <Link href="/restricted-items" className="text-[var(--accent)] hover:underline">
          restricted items
        </Link>{" "}
        before purchasing.
      </p>
      <CartClient />
    </div>
  );
}
