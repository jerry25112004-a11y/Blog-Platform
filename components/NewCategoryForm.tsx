"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create category.");
        return;
      }
      setName("");
      setDescription("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="cat-name">Category name</label>
        <input id="cat-name" className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Design" />
      </div>
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="cat-desc">Description (optional)</label>
        <input id="cat-desc" className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product & UX design writing" />
      </div>
      <button type="submit" disabled={loading || !name} className="btn-primary shrink-0">
        {loading ? "Adding…" : "Add category"}
      </button>
      {error && <p className="text-sm text-clay sm:basis-full">{error}</p>}
    </form>
  );
}
