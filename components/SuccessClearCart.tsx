"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export function SuccessClearCart({ enabled }: { enabled: boolean }) {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (enabled) clear();
  }, [enabled, clear]);

  return null;
}
