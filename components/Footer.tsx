import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Service details" },
  { href: "/restricted-items", label: "Restricted items" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/cart", label: "Cart" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]/50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-semibold">ShadowSend</p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#6b7280]">
              ShadowSend is a service handled by Xtinadom LLC.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ShadowSend. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-default">Privacy policy (placeholder)</span>
            <span className="cursor-default">Terms (placeholder)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
