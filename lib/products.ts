export type ProductId = "standard" | "paperOnly" | "tracked" | "testZero";

export type Product = {
  id: ProductId;
  name: string;
  shortDescription: string;
  /** Display price when Stripe Price ID is not configured */
  priceCentsFallback: number;
  /** Stripe Price ID — set in .env */
  priceIdEnv:
    | "NEXT_PUBLIC_STRIPE_PRICE_STANDARD"
    | "NEXT_PUBLIC_STRIPE_PRICE_PAPER_ONLY"
    | "NEXT_PUBLIC_STRIPE_PRICE_TRACKED"
    | "NEXT_PUBLIC_STRIPE_PRICE_TEST_ZERO";
  features: string[];
  tracking: boolean;
};

export const PRODUCTS: Record<ProductId, Product> = {
  standard: {
    id: "standard",
    name: "Small Parcel Forward (Untracked)",
    shortDescription:
      "Large cardboard envelope up to 4 oz. No tracking.",
    priceCentsFallback: 3500,
    priceIdEnv: "NEXT_PUBLIC_STRIPE_PRICE_STANDARD",
    features: [
      "Processing time 1-5 days",
      "USPS Ground Advantage delivery in 2-5 days",
      "USPS Cardboard envelope dimensions 15x12 in",
      "Total weight must be below 4 oz",
      "No Tracking included on the outbound shipment",
    ],
    tracking: false,
  },
  paperOnly: {
    id: "paperOnly",
    name: "Paper Business Envelope",
    shortDescription: "Standard 4.2x9.5 in envelope, no tracking.",
    priceCentsFallback: 1500,
    priceIdEnv: "NEXT_PUBLIC_STRIPE_PRICE_PAPER_ONLY",
    features: [
      "Processing time 1-5 days",
      "USPS delivery in 1-5 days",
      "Includes up to 5 pieces of paper per forward",
      "No tracking included on the outbound shipment",
    ],
    tracking: false,
  },
  tracked: {
    id: "tracked",
    name: "Small Parcel Forward (Tracking)",
    shortDescription: "Small parcel forwarding with full digital tracking.",
    priceCentsFallback: 4500,
    priceIdEnv: "NEXT_PUBLIC_STRIPE_PRICE_TRACKED",
    features: [
      "Processing time 1-5 days",
      "UPS Delivery 1-5 days",
      "Items must fit inside 100 cubic inch box (4x4x4 in / 6x4x4 in / 8x6x2 in)",
      "Outbound shipment includes carrier tracking",
      "Delivery scan updates where the carrier supports them",
    ],
    tracking: true,
  },
  testZero: {
    id: "testZero",
    name: "$0 test checkout",
    shortDescription:
      "Internal testing only — completes without payment (no Stripe session).",
    priceCentsFallback: 0,
    priceIdEnv: "NEXT_PUBLIC_STRIPE_PRICE_TEST_ZERO",
    features: [
      "No charge; confirms cart and success flow only",
      "Do not mix with paid services in the same cart",
    ],
    tracking: false,
  },
};

/** Server and client: read Stripe Price ID from env when configured. */
export function getStripePriceId(product: Product): string | undefined {
  return process.env[product.priceIdEnv];
}

/** Display price (fallback); live Stripe Checkout uses Price IDs from the Dashboard. */
export function getDisplayPriceCents(product: Product): number {
  return product.priceCentsFallback;
}
