import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "FAQ",
};

type FaqItem = { q: string; a: ReactNode };

const faqs: FaqItem[] = [
  {
    q: "How does ShadowSend protect my address?",
    a: "You send mail to our facility first. We remove your mail from its original packaging, repackage it, and mail it from our location. The return label lists our office, and the location is postmarked from our city.",
  },
  {
    q: "What is the difference between Small Parcel Forward (Untracked) and Small Parcel Forward (Tracking)?",
    a: "Small Parcel Forward (Untracked) uses USPS without tracking. Small Parcel Forward (Tracking) uses UPS with full digital tracking, so you (or your recipient) can see where your package is each stop of the way. See service details for more.",
  },
  {
    q: "Can I send anything?",
    a: "No. Hazardous materials, illegal items/content, currency, and other restricted items are not accepted. We may refuse items that violate law or carrier rules. See item restriction policy for more details. Refunds for restricted items are not possible.",
  },
  {
    q: "How long does forwarding take?",
    a: "We typically process within 4 business days of receipt, plus carrier delivery time. See service details to see how this differs.",
  },
  {
    q: "What is your refund policy?",
    a: "Refunds depend on whether service has been performed. Contact us with your order details and we will respond according to our refund / terms of service. We are unable to provide refunds for restricted items.",
  },
  {
    q: "Do you open my mail?",
    a: "Operational handling is required for compliance, postage, and safety. Do not send contents you are not permitted to ship. See our privacy policy for more details.",
  },
  {
    q: "Can this service be abused / used for harassment?",
    a: "ShadowSend is for legitimate forwarding only. Harassment, stalking, and misuse are not tolerated and may violate our terms and applicable law. We may refuse or stop service and cooperate with law enforcement when required. To protect recipients, inside each package is a paper with our contact information, and instructions on how to report the sender. We can prevent the sender from forwarding mail to them in the future.",
  },
  {
    q: "Are other shipping options available?",
    a: "Our listed services include Small Parcel Forward (Untracked) via USPS without tracking and Small Parcel Forward (Tracking) on UPS with full digital tracking, as described on the Services page. If you need something different, contact us and we’ll let you know what we can offer.",
  },
  {
    q: "Have more Questions?",
    a: (
      <>
        Visit our{" "}
        <Link href="/contact" className="text-[var(--accent)] hover:underline">
          Contact
        </Link>{" "}
        page—we’re happy to help.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Quick answers about private forwarding, tracking, and what we accept.
      </p>
      <dl className="mt-12 space-y-10">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="font-semibold">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
