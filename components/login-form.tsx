"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(json?.message ?? "Login failed");
        return;
      }

      router.push("/publish");
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-[#d4d9dd] bg-white px-4 py-3 outline-none transition focus:border-[#cb6b3d] focus:ring-4 focus:ring-[#cb6b3d]/10"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-2xl border border-[#d4d9dd] bg-white px-4 py-3 outline-none transition focus:border-[#cb6b3d] focus:ring-4 focus:ring-[#cb6b3d]/10"
        />
      </div>
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[#0f3d55] px-5 py-3 font-semibold text-white transition hover:bg-[#15536f] disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
