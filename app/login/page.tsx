"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      const next = searchParams.get("next");
      router.push(next || (data.role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard"));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card w-full max-w-sm p-8">
      <span className="eyebrow">Welcome back</span>
      <h1 className="mt-1 font-display text-2xl font-medium text-ink">Log in to Inkwell</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="password">Password</label>
          <input id="password" type="password" required className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink2">
        New to Inkwell? <Link href="/register" className="text-forest-dark hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
