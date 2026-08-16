import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/admin/dashboard");
  }

  if (session.role !== "ADMIN") {
    redirect("/login?next=/admin/dashboard");
  }

  const [
    totalBlogs, published, pending, rejected,
    users, authors, categories, recentSubmissions,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.blog.count({ where: { status: "PENDING" } }),
    prisma.blog.count({ where: { status: "REJECTED" } }),
    prisma.user.count(),
    prisma.author.count(),
    prisma.category.count(),
    prisma.blog.findMany({
      where: { status: "PENDING" },
      include: { category: true, author: { include: { user: { select: { name: true } } } } },
      orderBy: { submittedAt: "desc" },
      take: 6,
    }),
  ]);

  const stats = [
    { label: "Total blogs", value: totalBlogs },
    { label: "Published", value: published },
    { label: "Pending review", value: pending },
    { label: "Rejected", value: rejected },
    { label: "Users", value: users },
    { label: "Authors", value: authors },
    { label: "Categories", value: categories },
  ];

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/dashboard" />

      <div className="flex-1">
        <span className="eyebrow">Overview</span>
        <h1 className="mt-1 font-display text-2xl font-medium text-ink">Admin dashboard</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-5">
              <div className="font-display text-2xl font-semibold text-ink">{s.value}</div>
              <div className="mt-1 text-xs text-ink2">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Recent submissions</h2>
            <Link href="/admin/pending" className="text-sm font-medium text-forest-dark hover:underline">
              Review all →
            </Link>
          </div>
          <div className="glass-card divide-y divide-hairline">
            {recentSubmissions.length === 0 && (
              <p className="p-6 text-sm text-ink2">Nothing pending review right now.</p>
            )}
            {recentSubmissions.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="truncate font-medium text-ink">{b.title}</div>
                  <div className="text-xs text-ink2">
                    {b.author.user.name} · {b.category.name} · {b.submittedAt && formatDate(b.submittedAt)}
                  </div>
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
