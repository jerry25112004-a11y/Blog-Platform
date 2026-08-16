"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { BlogStatus } from "@/types";

type Row = {
  id: number;
  title: string;
  slug: string;
  status: BlogStatus;
  updatedAt: string;
  category: { name: string; slug: string };
  author: {
    name: string;
    email?: string | null;
    bio?: string | null;
    website?: string | null;
    twitter?: string | null;
  };
};

export default function AdminBlogRow({ blog }: { blog: Row }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blog.id }),
      });
      if (!res.ok) throw new Error("Unable to toggle blog status.");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const canToggle = blog.status === "PUBLISHED" || blog.status === "UNPUBLISHED";

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="truncate font-medium text-ink">{blog.title}</div>
          <div className="text-xs text-ink2">
            <span>{blog.author.name}</span>
            <span className="mx-1.5">·</span>
            <Link href={`/admin/categories/${blog.category.slug}`} className="hover:text-ink hover:underline">
              {blog.category.name}
            </Link>
            <span className="mx-1.5">·</span>
            <span>Updated {formatDate(blog.updatedAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge status={blog.status} />
          {blog.status === "PUBLISHED" && (
            <Link href={`/blogs/${blog.slug}`} className="text-sm font-medium text-forest-dark hover:underline">
              View
            </Link>
          )}
          {canToggle && (
            <button
              onClick={toggle}
              disabled={loading}
              className="text-sm font-medium text-ink2 hover:text-ink disabled:opacity-50"
            >
              {loading ? "…" : blog.status === "PUBLISHED" ? "Deactivate" : "Activate"}
            </button>
          )}
        </div>
      </div>

      <div className="rounded-md border border-hairline bg-ink/[0.02] px-3 py-2 text-[11px] text-ink2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-medium text-ink">Author details</span>
          <span>{blog.author.name}</span>
          {blog.author.email && <span>{blog.author.email}</span>}
          {blog.author.website && (
            <a href={blog.author.website} target="_blank" rel="noreferrer" className="text-forest-dark hover:underline">
              Website
            </a>
          )}
          {blog.author.twitter && (
            <a href={blog.author.twitter} target="_blank" rel="noreferrer" className="text-forest-dark hover:underline">
              Twitter
            </a>
          )}
        </div>
        {blog.author.bio && <div className="mt-1 text-[11px] text-ink2">{blog.author.bio}</div>}
      </div>
    </div>
  );
}
