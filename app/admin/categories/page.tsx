import Link from "next/link";
import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import NewCategoryForm from "@/components/NewCategoryForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { blogs: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/categories" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Categories</h1>

        <NewCategoryForm />

        <div className="mt-6 glass-card divide-y divide-hairline">
          {categories.map((c) => (
            <Link key={c.id} href={`/admin/categories/${c.slug}`} className="flex items-center justify-between p-4 transition hover:bg-ink/[0.02]">
              <div>
                <div className="font-medium text-ink">{c.name}</div>
                {c.description && <div className="text-xs text-ink2">{c.description}</div>}
              </div>
              <div className="text-sm text-ink2">{c._count.blogs} blogs</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
