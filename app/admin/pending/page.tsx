import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import PendingReviewCard from "@/components/PendingReviewCard";
import EmptyState from "@/components/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pending Reviews" };

export default async function AdminPendingPage() {
  const blogsRaw = await prisma.blog.findMany({
    where: { status: "PENDING" },
    include: { category: true, author: { include: { user: { select: { name: true } } } } },
    orderBy: { submittedAt: "asc" },
  });

  const blogs = blogsRaw.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    slug: b.slug,
    submittedAt: b.submittedAt ? b.submittedAt.toISOString() : null,
    category: { name: b.category.name },
    author: { user: { name: b.author.user.name } },
  }));

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/pending" />
      <div className="flex-1">
        <h1 className="mb-1 font-display text-2xl font-medium text-ink">Pending reviews</h1>
        <p className="mb-6 text-sm text-ink2">{blogs.length} blog{blogs.length === 1 ? "" : "s"} waiting for a decision.</p>

        {blogs.length === 0 ? (
          <EmptyState title="All caught up" description="There's nothing waiting for review right now." />
        ) : (
          <div className="space-y-4">
            {blogs.map((b) => <PendingReviewCard key={b.id} blog={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
