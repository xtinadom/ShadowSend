import { SiteLockForm } from "@/components/SiteLockForm";

export const metadata = {
  title: "Site access",
  robots: { index: false, follow: false },
};

export default function SiteLockPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Site access</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Enter the access password to continue. This site is private.
      </p>
      <SiteLockForm />
    </div>
  );
}
