import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogGrid from "@/components/BlogGrid";
import type { Metadata } from "next";
import type { BlogCardData } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category not found" };
  return { title: category.name, description: category.description || `Browse ${category.name} articles on Inkwell.` };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const blogsRaw = await prisma.blog.findMany({
    where: { categoryId: category.id, status: "PUBLISHED" },
    include: { category: true, author: { include: { user: { select: { name: true } } } } },
    orderBy: { publishedAt: "desc" },
  });

  const blogs: BlogCardData[] = blogsRaw.map((b) => ({
    id: b.id, title: b.title, slug: b.slug, description: b.description,
    featuredImage: b.featuredImage, readingTime: b.readingTime, publishedAt: b.publishedAt,
    status: b.status, category: { name: b.category.name, slug: b.category.slug },
    author: { name: b.author.user.name },
  }));

  return (
    <div className="container-page py-14">
      <span className="eyebrow">Category</span>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">{category.name}</h1>
      {category.description && <p className="mt-2 max-w-xl text-ink2">{category.description}</p>}
      <div className="mt-8">
        <BlogGrid blogs={blogs} emptyTitle="No articles yet" emptyDescription={`Nothing published in ${category.name} yet.`} />
      </div>
    </div>
  );
}
