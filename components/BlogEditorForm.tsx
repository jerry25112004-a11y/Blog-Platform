"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };

type InitialBlog = {
  id?: number;
  title: string;
  description: string;
  content: string;
  categoryId: number | "";
  featuredImage: string;
  references: string;
};

export default function BlogEditorForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: InitialBlog;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<InitialBlog>(
    initial || {
      title: "",
      description: "",
      content: "",
      categoryId: categories[0]?.id || "",
      featuredImage: "",
      references: "",
    }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"draft" | "submit" | null>(null);

  async function handleSave(action: "draft" | "submit") {
    setError("");
    if (!form.title || !form.description || !form.content || !form.categoryId) {
      setError("Please fill in title, description, category, and content.");
      return;
    }
    setLoading(action);
    try {
      const payload = { ...form, categoryId: Number(form.categoryId), action };
      const res = await fetch(isEdit ? `/api/blogs/${initial!.id}` : "/api/blogs", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      router.push(action === "submit" ? "/author/blogs/pending" : "/author/blogs/drafts");
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="title">Title</label>
        <input id="title" className="input-field" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="How I redesigned our onboarding flow" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="description">Short description</label>
        <textarea id="description" className="input-field" rows={2} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="A one or two sentence summary shown on blog cards and search results." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="category">Category</label>
          <select id="category" className="input-field" value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink" htmlFor="image">Featured image URL</label>
          <input id="image" className="input-field" value={form.featuredImage}
            onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://…" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="content">Article content (HTML)</label>
        <textarea id="content" className="input-field font-mono text-xs" rows={16} value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="<p>Write your article here. Basic HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; are supported.</p>" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink" htmlFor="references">References (optional)</label>
        <textarea id="references" className="input-field" rows={3} value={form.references}
          onChange={(e) => setForm({ ...form, references: e.target.value })}
          placeholder="One source per line" />
      </div>

      {error && <p className="text-sm text-clay">{error}</p>}

      <div className="flex gap-3 border-t border-hairline pt-5">
        <button type="button" disabled={loading !== null} className="btn-secondary" onClick={() => handleSave("draft")}>
          {loading === "draft" ? "Saving…" : "Save draft"}
        </button>
        <button type="button" disabled={loading !== null} className="btn-primary" onClick={() => handleSave("submit")}>
          {loading === "submit" ? "Submitting…" : "Submit for review"}
        </button>
      </div>
    </div>
  );
}
