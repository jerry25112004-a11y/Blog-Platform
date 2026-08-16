import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AuthorSidebar from "@/components/AuthorSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Author Dashboard" };

export default async function AuthorDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/author/dashboard");
  }

  if (session.role !== "AUTHOR") {
    redirect("/login?next=/author/dashboard");
  }

  const author = await prisma.author.findUnique({ where: { userId: session.userId } });
  if (!author) redirect("/login?next=/author/dashboard");

  const [draft, pending, approved, rejected, recent] = await Promise.all([
    prisma.blog.count({ where: { authorId: author.id, status: "DRAFT" } }),
    prisma.blog.count({ where: { authorId: author.id, status: "PENDING" } }),
    prisma.blog.count({ where: { authorId: author.id, status: "PUBLISHED" } }),
    prisma.blog.count({ where: { authorId: author.id, status: "REJECTED" } }),
    prisma.blog.findMany({
      where: { authorId: author.id },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { category: true },
    }),
  ]);

  const stats = [
    { label: "Drafts", value: draft },
    { label: "Pending review", value: pending },
    { label: "Published", value: approved },
    { label: "Rejected", value: rejected },
  ];

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/dashboard" />

      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="eyebrow">Welcome back</span>
            <h1 className="mt-1 font-display text-2xl font-medium text-ink">{session?.name}</h1>
          </div>
          <Link href="/author/blogs/create" className="btn-primary">New blog</Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5">
              <div className="font-display text-2xl font-semibold text-ink">{s.value}</div>
              <div className="mt-1 text-xs text-ink2">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-medium text-ink">Recent activity</h2>
          <div className="glass-card divide-y divide-hairline">
            {recent.length === 0 && (
              <p className="p-6 text-sm text-ink2">No blogs yet. Create your first one to get started.</p>
            )}
            {recent.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="truncate font-medium text-ink">{b.title}</div>
                  <div className="text-xs text-ink2">{b.category.name} · Updated {formatDate(b.updatedAt)}</div>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
