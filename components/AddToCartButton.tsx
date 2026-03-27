"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import type { ProductId } from "@/lib/products";

type Props = {
  productId: ProductId;
  className?: string;
};

const ADDED_MS = 2200;

export function AddToCartButton({ productId, className = "" }: Props) {
  const add = useCartStore((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const handleClick = () => {
    add(productId, 1);
    setJustAdded(true);
    clearTimer();
    timerRef.current = setTimeout(() => {
      setJustAdded(false);
      timerRef.current = null;
    }, ADDED_MS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`w-full rounded-lg py-3 text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
        justAdded
          ? "bg-zinc-200 text-zinc-950 shadow-[0_0_0_3px_rgba(228,228,231,0.7)]"
          : "bg-[var(--accent)] text-white hover:opacity-90"
      } ${className}`}
    >
      {justAdded ? "Added to cart" : "Add to cart"}
    </button>
  );
}
