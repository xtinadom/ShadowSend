import { Suspense } from "react";

export default function SiteLockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-14 text-center text-[var(--muted)]">Loading…</div>}>
      {children}
    </Suspense>
  );
}
