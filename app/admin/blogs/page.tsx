import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import AdminBlogRow from "@/components/AdminBlogRow";
import EmptyState from "@/components/EmptyState";
import type { BlogStatus } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog Management" };

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "PUBLISHED", label: "Published" },
  { value: "PENDING", label: "Pending" },
  { value: "DRAFT", label: "Draft" },
  { value: "REJECTED", label: "Rejected" },
  { value: "UNPUBLISHED", label: "Unpublished" },
];

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status ? { status: status as BlogStatus } : {};

  const blogsRaw = await prisma.blog.findMany({
    where,
    include: { category: true, author: { include: { user: { select: { name: true } } } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  const blogs = blogsRaw.map((b) => ({
    id: b.id, title: b.title, slug: b.slug, status: b.status,
    updatedAt: b.updatedAt.toISOString(),
    category: { name: b.category.name },
    author: { user: { name: b.author.user.name } },
  }));

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/blogs" />
      <div className="flex-1">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h1 className="font-display text-2xl font-medium text-ink">Blog management</h1>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <a
                key={f.value}
                href={f.value ? `/admin/blogs?status=${f.value}` : "/admin/blogs"}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  (status || "") === f.value ? "border-ink bg-ink text-paper" : "border-hairline text-ink2 hover:border-ink/40"
                }`}
              >
                {f.label}
              </a>
            ))}
          </div>
        </div>

        {blogs.length === 0 ? (
          <EmptyState title="No blogs" description="No blogs match this filter yet." />
        ) : (
          <div className="glass-card divide-y divide-hairline">
            {blogs.map((b) => <AdminBlogRow key={b.id} blog={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
