import Link from "next/link";

export const metadata = {
  title: "Privacy policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Effective date: March 27, 2026. ShadowSend is operated by Xtinadom LLC
        (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). This policy
        describes how we collect, use, and share information when you use this
        website and related services (&quot;Services&quot;).
      </p>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Information we collect
        </h2>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong className="font-medium text-[var(--foreground)]">
              Contact form.
            </strong>{" "}
            If you use our contact form, we receive your name, email address,
            subject line, and message. Today this is processed by our servers;
            you may configure your deployment to forward messages to an email
            provider (for example Resend or similar). We use this information
            only to respond to you and operate the Services.
          </li>
          <li>
            <strong className="font-medium text-[var(--foreground)]">
              Purchases and payments.
            </strong>{" "}
            When you pay for Services, payments are processed by{" "}
            <strong className="font-medium text-[var(--foreground)]">
              Stripe
            </strong>
            . We do not store your full card number on our servers. Stripe
            receives payment details and shares with us what is needed to
            complete the transaction (such as confirmation of payment, amount,
            and limited billing or contact details you provide at checkout).
            Stripe&apos;s privacy policy applies to payment data it processes.
          </li>
          <li>
            <strong className="font-medium text-[var(--foreground)]">
              Cart and device storage.
            </strong>{" "}
            Your shopping cart may be stored locally in your browser (for
            example using local storage) so the site can remember your
            selections until checkout. That data stays on your device unless you
            submit an order or clear your browser data.
          </li>
          <li>
            <strong className="font-medium text-[var(--foreground)]">
              Technical and usage data.
            </strong>{" "}
            Like most websites, our hosting provider and infrastructure may log
            technical information such as IP address, browser type, request
            time, and pages viewed. We use this to run the site securely,
            troubleshoot issues, and understand aggregate usage.
          </li>
          <li>
            <strong className="font-medium text-[var(--foreground)]">
              Mail and forwarding operations.
            </strong>{" "}
            Operating mail forwarding requires handling physical addresses,
            package information, and related correspondence as you or carriers
            provide it to fulfill the Services. Use follows what is needed for
            shipping, customer support, accounting, legal compliance, and
            dispute resolution.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          How we use information
        </h2>
        <p>We use the information above to:</p>
        <ul className="list-inside list-disc space-y-2">
          <li>Provide, bill for, and support the Services</li>
          <li>Communicate with you about orders and inquiries</li>
          <li>Detect, prevent, and address fraud, abuse, or security issues</li>
          <li>Comply with law and enforce our policies</li>
          <li>Improve and maintain the website and infrastructure</li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          How we share information
        </h2>
        <p>
          We share payment-related information with{" "}
          <strong className="font-medium text-[var(--foreground)]">Stripe</strong>{" "}
          to process purchases. We may also disclose information when required
          for legal compliance or to protect rights and safety.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Changes
        </h2>
        <p>
          We may update this policy from time to time. We will post the updated
          version on this page and adjust the effective date when we do.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--muted)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Contact
        </h2>
        <p>
          Questions about this policy or your information: use our{" "}
          <Link href="/contact" className="text-[var(--accent)] hover:underline">
            Contact
          </Link>{" "}
          page. ShadowSend is a service of Xtinadom LLC.
        </p>
      </section>
    </div>
  );
}
