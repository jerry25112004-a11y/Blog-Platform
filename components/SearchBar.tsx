"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    router.push(`/search?${next.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title, keyword, category, or author…"
        className="input-field"
      />
      <button type="submit" className="btn-primary shrink-0">Search</button>
    </form>
  );
}
