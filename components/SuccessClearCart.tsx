"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export function SuccessClearCart({ sessionId }: { sessionId?: string }) {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (sessionId) clear();
  }, [sessionId, clear]);

  return null;
}
