"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "shadowsend_construction_dismissed";

export function UnderConstructionPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* private mode etc. */
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="construction-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={dismiss}
      />
      <div className="relative z-[201] max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-10 text-center shadow-xl">
        <p
          id="construction-title"
          className="text-xl font-semibold tracking-tight text-[var(--foreground)]"
        >
          Website under construction!
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          We&apos;re still putting things in place. Thanks for your patience.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-8 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          OK
        </button>
      </div>
    </div>
  );
}
