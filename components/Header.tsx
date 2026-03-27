"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

const nav = [
  { href: "/services", label: "Service Details" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalQty = useCartStore((s) => s.totalQuantity());

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ShadowSend
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="text-sm font-medium text-[var(--accent)] transition hover:underline"
          >
            Cart
            {mounted && totalQty > 0 ? (
              <span className="ml-1.5 rounded-full bg-[var(--accent-dim)] px-2 py-0.5 text-xs text-[var(--accent)]">
                {totalQty}
              </span>
            ) : null}
          </Link>
        </nav>
        <div className="flex items-center gap-3 sm:hidden">
          <Link
            href="/cart"
            className="text-sm font-medium text-[var(--accent)]"
            aria-label="Shopping cart"
          >
            Cart
            {mounted && totalQty > 0 ? ` (${totalQty})` : ""}
          </Link>
        </div>
      </div>
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-[var(--border)] px-4 py-2 sm:hidden">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs text-[var(--muted)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
