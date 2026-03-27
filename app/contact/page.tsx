import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact us",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Contact us</h1>
      <p className="mt-4 text-[var(--muted)]">
        Questions about forwarding, your order, or partnerships—send a message
        and we will get back to you.
      </p>
      <ContactForm />
    </div>
  );
}
