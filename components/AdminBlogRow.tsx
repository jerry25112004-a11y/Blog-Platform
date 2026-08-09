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
  category: { name: string };
  author: { user: { name: string } };
};

export default function AdminBlogRow({ blog }: { blog: Row }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      await fetch("/api/blogs/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blog.id }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const canToggle = blog.status === "PUBLISHED" || blog.status === "UNPUBLISHED";

  return (
    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="truncate font-medium text-ink">{blog.title}</div>
        <div className="text-xs text-ink2">
          {blog.author.user.name} · {blog.category.name} · Updated {formatDate(blog.updatedAt)}
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
            {loading ? "…" : blog.status === "PUBLISHED" ? "Unpublish" : "Republish"}
          </button>
        )}
      </div>
    </div>
  );
}
