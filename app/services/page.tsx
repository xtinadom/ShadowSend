import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { formatUsd } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export const metadata = {
  title: "Service details",
};

export default function ServicesPage() {
  const standard = PRODUCTS.standard;
  const paperOnly = PRODUCTS.paperOnly;
  const tracked = PRODUCTS.tracked;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Service details</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        ShadowSend receives mail at our facility and reships to your recipient
        using our service identity on the outbound label. You can choose
        Paper Business Envelope (up to 5 pieces), Small Parcel Forward
        (Untracked), or Small Parcel Forward (Tracking).
      </p>

      <section className="mt-12 space-y-6 text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          What you get
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            A masked return address (our office) to maintain your privacy on
            final delivery.
          </li>
          <li>
            Package is postmarked in our office location instead of your home
            city.
          </li>
          <li>
            Peace of mind. Protect your location from online fans and strangers
            buying your items.
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-3 text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Disclaimer
        </h2>
        <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed">
          <li>
            Prohibited items (hazardous, illegal, cash, etc.) are not
            accepted—see{" "}
            <Link
              href="/restricted-items"
              className="text-[var(--accent)] hover:underline"
            >
              Restricted Items
            </Link>
            .
          </li>
          <li>
            ShadowSend intends to protect sellers&apos; safety, but does not
            condone harassment. See{" "}
            <Link href="/faq" className="text-[var(--accent)] hover:underline">
              FAQs
            </Link>{" "}
            and Privacy Policy.
          </li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Turnaround</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Typical processing is 1–2 business days after we receive your inbound
          item, excluding carrier time. Peak periods may vary.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="font-semibold">{paperOnly.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {paperOnly.shortDescription}
            </p>
            <p className="mt-4 text-2xl font-semibold">
              {formatUsd(paperOnly.priceCentsFallback)} / forward
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {paperOnly.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <AddToCartButton productId="paperOnly" className="mt-6" />
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="font-semibold">{standard.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {standard.shortDescription}
            </p>
            <p className="mt-4 text-2xl font-semibold">
              {formatUsd(standard.priceCentsFallback)} / forward
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {standard.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <AddToCartButton productId="standard" className="mt-6" />
          </article>
          <article className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-dim)]/30 p-6">
            <h3 className="font-semibold">{tracked.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {tracked.shortDescription}
            </p>
            <p className="mt-4 text-2xl font-semibold">
              {formatUsd(tracked.priceCentsFallback)} / forward
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              {tracked.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <AddToCartButton productId="tracked" className="mt-6" />
          </article>
        </div>
      </section>
    </div>
  );
}
