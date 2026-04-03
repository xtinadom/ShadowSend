"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SiteLockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/site-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? "Could not sign in");
        return;
      }
      const nextRaw = searchParams.get("next");
      const next =
        nextRaw &&
        nextRaw.startsWith("/") &&
        !nextRaw.startsWith("//") &&
        !nextRaw.includes(":")
          ? nextRaw
          : "/";
      router.push(next);
      router.refresh();
    } catch {
      setStatus("err");
      setMessage("Network error. Try again.");
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label htmlFor="site-lock-pw" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="site-lock-pw"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none ring-[var(--accent)] focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[var(--accent)] py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Signing in…" : "Continue"}
      </button>
      {message ? (
        <p className="text-sm text-red-400" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
