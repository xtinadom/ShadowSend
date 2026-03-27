import Link from "next/link";

export const metadata = {
  title: "Restricted items",
};

export default function RestrictedItemsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Restricted items policy
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        ShadowSend may refuse or dispose of inbound or outbound items that
        violate this policy, carrier rules, or law. Refunds are not available for
        restricted items.
      </p>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Not accepted
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>Hazardous materials (as defined by USPS, UPS, or applicable law)</li>
          <li>Illegal items or content</li>
          <li>
            Currency, cash, or cash equivalents sent in violation of carrier
            rules. (Checks are ok.)
          </li>
          <li>Items you are not lawfully permitted to ship</li>
          <li>
            Unsure about your package? Ask us! We&apos;re happy to help.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Enforcement
        </h2>
        <p>
          We may refuse service on restricted items without refund. We will
          dispose of and report any illegal content and comply with carriers and
          law enforcement. Use of this service for harassment, misuse, or illegal
          activity is prohibited.
        </p>
      </section>

      <p className="mt-10 text-sm">
        <Link href="/services" className="text-[var(--accent)] hover:underline">
          ← Back to service details
        </Link>
      </p>
    </div>
  );
}
