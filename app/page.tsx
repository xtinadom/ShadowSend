import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { formatUsd } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export default function HomePage() {
  const standard = PRODUCTS.standard;
  const paperOnly = PRODUCTS.paperOnly;
  const tracked = PRODUCTS.tracked;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <section className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
          Private forwarding
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Send your mail. Protect your location.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-[var(--muted)]">
          ShadowSend is a mail forwarding service that keeps your home address
          and post office location off the outgoing package.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/services"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Details
          </Link>
          <Link
            href="/faq"
            className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium transition hover:bg-[var(--card)]"
          >
            FAQs
          </Link>
        </div>
      </section>

      <section className="mt-24">
        <h2 className="text-center text-2xl font-semibold">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">
          Three simple steps from you to your recipient -- without giving away
          your location on the final delivery.
        </p>
        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "You mail to us",
              body: "Address your envelope or package to our secure facility. Only we see that link in the chain.",
            },
            {
              step: "2",
              title: "We process & forward",
              body: "We prepare outbound postage to your recipient using our service address as the ship-from point.",
            },
            {
              step: "3",
              title: "Recipient gets the mail",
              body: "Delivery completes without exposing your personal location on the outgoing label.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
            >
              <span className="text-3xl font-bold text-[var(--accent)]/40">
                {item.step}
              </span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24">
        <h2 className="text-center text-2xl font-semibold">Choose a service</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[var(--muted)]">
          Pick from paper envelope, Small Parcel Forward (Untracked), or Small
          Parcel Forward (Tracking).
        </p>
        <div className="mt-12 grid gap-8">
          <article className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-8">
            <h3 className="text-xl font-semibold">{paperOnly.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {paperOnly.shortDescription}
            </p>
            <p className="mt-6 text-3xl font-semibold">
              {formatUsd(paperOnly.priceCentsFallback)}
              <span className="text-base font-normal text-[var(--muted)]">
                {" "}
                / forward
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-[var(--muted)]">
              {paperOnly.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-[var(--accent)]">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <AddToCartButton productId="paperOnly" className="mt-8" />
          </article>
          <article className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-8">
            <h3 className="text-xl font-semibold">{standard.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {standard.shortDescription}
            </p>
            <p className="mt-6 text-3xl font-semibold">
              {formatUsd(standard.priceCentsFallback)}
              <span className="text-base font-normal text-[var(--muted)]">
                {" "}
                / forward
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-[var(--muted)]">
              {standard.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-[var(--accent)]">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <AddToCartButton productId="standard" className="mt-8" />
          </article>
          <article className="flex flex-col rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-dim)]/30 p-8">
            <h3 className="text-xl font-semibold">{tracked.name}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {tracked.shortDescription}
            </p>
            <p className="mt-6 text-3xl font-semibold">
              {formatUsd(tracked.priceCentsFallback)}
              <span className="text-base font-normal text-[var(--muted)]">
                {" "}
                / forward
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-[var(--muted)]">
              {tracked.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-[var(--accent)]">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <AddToCartButton productId="tracked" className="mt-8" />
          </article>
        </div>
      </section>
    </div>
  );
}
