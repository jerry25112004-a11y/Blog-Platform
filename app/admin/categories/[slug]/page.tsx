import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/AdminSidebar";
import AdminBlogRow from "@/components/AdminBlogRow";
import EmptyState from "@/components/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Category Details" };

export default async function AdminCategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { blogs: true } } },
  });

  if (!category) notFound();

  const blogsRaw = await prisma.blog.findMany({
    where: { categoryId: category.id },
    include: {
      category: true,
      author: { include: { user: { select: { name: true, email: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const blogs = blogsRaw.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    status: b.status,
    updatedAt: b.updatedAt.toISOString(),
    category: { name: b.category.name, slug: b.category.slug },
    author: {
      name: b.author.user.name,
      email: b.author.user.email,
      bio: b.author.bio,
      website: b.author.website,
      twitter: b.author.twitter,
    },
  }));

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AdminSidebar active="/admin/categories" />
      <div className="flex-1">
        <Link href="/admin/categories" className="mb-4 inline-flex text-sm font-medium text-forest-dark hover:underline">
          ← Back to categories
        </Link>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-medium text-ink">{category.name}</h1>
            {category.description && <p className="mt-1 text-sm text-ink2">{category.description}</p>}
          </div>
          <div className="text-sm text-ink2">{category._count.blogs} blogs</div>
        </div>

        {blogs.length === 0 ? (
          <EmptyState title="No blogs in this category" description="This category does not have any blogs yet." />
        ) : (
          <div className="glass-card divide-y divide-hairline">
            {blogs.map((blog) => <AdminBlogRow key={blog.id} blog={blog} />)}
          </div>
        )}
      </div>
    </div>
  );
}
