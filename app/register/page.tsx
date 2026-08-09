"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      router.push("/author/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="glass-card w-full max-w-sm p-8">
        <span className="eyebrow">Join Inkwell</span>
        <h1 className="mt-1 font-display text-2xl font-medium text-ink">Create your author account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="name">Full name</label>
            <input id="name" required className="input-field" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="email">Email</label>
            <input id="email" type="email" required className="input-field" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8} className="input-field" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <p className="mt-1 text-xs text-ink2">At least 8 characters.</p>
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink2">
          Already have an account? <Link href="/login" className="text-forest-dark hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
