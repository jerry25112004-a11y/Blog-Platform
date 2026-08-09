import { prisma } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories", description: "Browse Inkwell articles by category." };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { blogs: { where: { status: "PUBLISHED" } } } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-page py-14">
      <span className="eyebrow">Browse</span>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Categories</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.slug} href={`/categories/${c.slug}`} className="glass-card p-5 transition hover:shadow-glass">
            <h2 className="font-display text-lg font-medium text-ink">{c.name}</h2>
            {c.description && <p className="mt-1 line-clamp-2 text-sm text-ink2">{c.description}</p>}
            <p className="mt-3 text-xs text-forest-dark">{c._count.blogs} articles</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
