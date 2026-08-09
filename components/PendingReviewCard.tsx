"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type PendingBlog = {
  id: number;
  title: string;
  description: string;
  slug: string;
  submittedAt: string | null;
  category: { name: string };
  author: { user: { name: string } };
};

export default function PendingReviewCard({ blog }: { blog: PendingBlog }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function approve() {
    setLoading("approve");
    setError("");
    try {
      const res = await fetch(`/api/blogs/${blog.id}/approve`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not approve this blog.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function reject() {
    if (!reason.trim()) {
      setError("Please explain why this blog is being rejected.");
      return;
    }
    setLoading("reject");
    setError("");
    try {
      const res = await fetch(`/api/blogs/${blog.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Could not reject this blog.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-medium text-ink">{blog.title}</div>
          <p className="mt-1 line-clamp-2 text-sm text-ink2">{blog.description}</p>
          <div className="mt-2 text-xs text-ink2">
            {blog.author.user.name} · {blog.category.name} · Submitted {blog.submittedAt ? formatDate(blog.submittedAt) : ""}
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-clay">{error}</p>}

      {!showReject ? (
        <div className="mt-4 flex gap-3">
          <button className="btn-primary" disabled={loading !== null} onClick={approve}>
            {loading === "approve" ? "Approving…" : "Approve"}
          </button>
          <button className="btn-secondary" disabled={loading !== null} onClick={() => setShowReject(true)}>
            Reject
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <textarea
            className="input-field"
            rows={2}
            placeholder="Explain what needs to change…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-3">
            <button className="btn-primary !bg-clay hover:!bg-clay/90" disabled={loading !== null} onClick={reject}>
              {loading === "reject" ? "Rejecting…" : "Confirm rejection"}
            </button>
            <button className="btn-secondary" onClick={() => setShowReject(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
