import { prisma } from "@/lib/db";
import Hero from "@/components/Hero";
import BlogGrid from "@/components/BlogGrid";
import CategoryList from "@/components/CategoryList";
import AuthorCard from "@/components/AuthorCard";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import type { BlogCardData } from "@/types";

export const revalidate = 60;

function toCardData(blog: any): BlogCardData {
  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    featuredImage: blog.featuredImage,
    readingTime: blog.readingTime,
    publishedAt: blog.publishedAt,
    status: blog.status,
    category: { name: blog.category.name, slug: blog.category.slug },
    author: { name: blog.author.user.name },
  };
}

export default async function HomePage() {
  const publishedWhere = { status: "PUBLISHED" as const };
  const include = {
    category: true,
    author: { include: { user: { select: { name: true } } } },
  };

  const [featuredRaw, latestRaw, trendingRaw, categories, authorsRaw] = await Promise.all([
    prisma.blog.findFirst({ where: publishedWhere, include, orderBy: { publishedAt: "desc" } }),
    prisma.blog.findMany({ where: publishedWhere, include, orderBy: { publishedAt: "desc" }, take: 6 }),
    prisma.blog.findMany({ where: publishedWhere, include, orderBy: { viewCount: "desc" }, take: 4 }),
    prisma.category.findMany({ include: { _count: { select: { blogs: true } } }, take: 8 }),
    prisma.author.findMany({
      include: { user: { select: { name: true } }, _count: { select: { blogs: true } } },
      orderBy: { blogs: { _count: "desc" } },
      take: 4,
    }),
  ]);

  const featured = featuredRaw ? toCardData(featuredRaw) : null;
  const latest = latestRaw.filter((b) => b.id !== featured?.id).slice(0, 5).map(toCardData);
  const trending = trendingRaw.map(toCardData);
  const authors = authorsRaw.map((a) => ({
    name: a.user.name,
    bio: a.bio,
    avatarUrl: a.avatarUrl,
    blogCount: a._count.blogs,
  }));

  return (
    <>
      <Hero featured={featured} />

      <section className="container-page py-16">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <span className="eyebrow">Fresh off the press</span>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink">Latest blogs</h2>
          </div>
          <Link href="/blogs" className="text-sm font-medium text-forest-dark hover:underline">
            View all →
          </Link>
        </div>
        <BlogGrid blogs={latest} emptyTitle="No published blogs yet" emptyDescription="Approved articles will appear here." />
      </section>

      {categories.length > 0 && (
        <section className="border-y border-hairline bg-white/40">
          <div className="container-page py-14">
            <span className="eyebrow">Explore</span>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink">Popular categories</h2>
            <div className="mt-6">
              <CategoryList categories={categories} />
            </div>
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="container-page py-16">
          <span className="eyebrow">Reader favorites</span>
          <h2 className="mt-1 font-display text-2xl font-medium text-ink">Trending blogs</h2>
          <div className="mt-6">
            <BlogGrid blogs={trending} />
          </div>
        </section>
      )}

      {authors.length > 0 && (
        <section className="border-t border-hairline bg-white/40">
          <div className="container-page py-14">
            <span className="eyebrow">The writers</span>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink">Featured authors</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {authors.map((a, i) => <AuthorCard key={i} author={a} />)}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </>
  );
}
