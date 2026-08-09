import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";
import type { Blog, Category } from "@prisma/client";

type Row = Blog & { category: Category };

export default function AuthorBlogTable({
  blogs,
  emptyTitle,
  emptyDescription,
  showEdit = false,
  showSubmit = false,
}: {
  blogs: Row[];
  emptyTitle: string;
  emptyDescription: string;
  showEdit?: boolean;
  showSubmit?: boolean;
}) {
  if (blogs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={<Link href="/author/blogs/create" className="btn-primary">Create a blog</Link>}
      />
    );
  }

  return (
    <div className="glass-card divide-y divide-hairline">
      {blogs.map((b) => (
        <div key={b.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="truncate font-medium text-ink">{b.title}</div>
            <div className="mt-0.5 text-xs text-ink2">
              {b.category.name} · Updated {formatDate(b.updatedAt)}
            </div>
            {b.status === "REJECTED" && b.rejectReason && (
              <p className="mt-1 text-xs text-clay">Reason: {b.rejectReason}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <StatusBadge status={b.status} />
            {showEdit && (
              <Link href={`/author/blogs/${b.id}/edit`} className="text-sm font-medium text-forest-dark hover:underline">
                Edit
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
