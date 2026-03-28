import type Stripe from "stripe";

import type { CartLine } from "@/lib/cart-store";
import { PRODUCTS, type ProductId } from "@/lib/products";

/**
 * Stripe rejects line items with a missing `price` / `price_data`.
 * Use Dashboard Price IDs when they look valid; otherwise inline `price_data`
 * from catalog (same amounts as the site).
 */
export function buildCheckoutLineItems(
  lines: CartLine[],
  priceByProduct: Record<ProductId, string | undefined>,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return lines.map((line) => {
    const raw = priceByProduct[line.productId]?.trim();
    if (raw?.startsWith("price_")) {
      return { price: raw, quantity: line.quantity };
    }

    const p = PRODUCTS[line.productId];
    return {
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        product_data: { name: p.name },
        unit_amount: p.priceCentsFallback,
      },
    };
  });
}
