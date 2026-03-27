import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductId } from "@/lib/products";

export type CartLine = {
  productId: ProductId;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  add: (productId: ProductId, qty?: number) => void;
  remove: (productId: ProductId) => void;
  setQuantity: (productId: ProductId, qty: number) => void;
  clear: () => void;
  totalQuantity: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (productId, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId
                  ? { ...l, quantity: l.quantity + qty }
                  : l,
              ),
            };
          }
          return { lines: [...state.lines, { productId, quantity: qty }] };
        }),
      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      setQuantity: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return {
              lines: state.lines.filter((l) => l.productId !== productId),
            };
          }
          return {
            lines: state.lines.map((l) =>
              l.productId === productId ? { ...l, quantity: qty } : l,
            ),
          };
        }),
      clear: () => set({ lines: [] }),
      totalQuantity: () =>
        get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "shadowsend-cart" },
  ),
);
