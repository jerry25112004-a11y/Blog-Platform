import { prisma } from "@/lib/db";
import SearchBar from "@/components/SearchBar";
import BlogGrid from "@/components/BlogGrid";
import type { Metadata } from "next";
import type { BlogCardData } from "@/types";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let blogs: BlogCardData[] = [];
  if (query) {
    const blogsRaw = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { content: { contains: query } },
          { category: { name: { contains: query } } },
          { author: { user: { name: { contains: query } } } },
          { tags: { some: { tag: { name: { contains: query } } } } },
        ],
      },
      include: { category: true, author: { include: { user: { select: { name: true } } } } },
      orderBy: { publishedAt: "desc" },
      take: 30,
    });

    blogs = blogsRaw.map((b) => ({
      id: b.id, title: b.title, slug: b.slug, description: b.description,
      featuredImage: b.featuredImage, readingTime: b.readingTime, publishedAt: b.publishedAt,
      status: b.status, category: { name: b.category.name, slug: b.category.slug },
      author: { name: b.author.user.name },
    }));
  }

  return (
    <div className="container-page py-14">
      <span className="eyebrow">Find something to read</span>
      <h1 className="mt-1 font-display text-3xl font-medium text-ink">Search</h1>
      <div className="mt-6">
        <SearchBar initialQuery={query} />
      </div>

      <div className="mt-10">
        {query ? (
          <>
            <p className="mb-6 text-sm text-ink2">
              {blogs.length} result{blogs.length === 1 ? "" : "s"} for &quot;{query}&quot;
            </p>
            <BlogGrid blogs={blogs} emptyTitle="No results" emptyDescription="Try a different title, category, or author name." />
          </>
        ) : (
          <p className="text-sm text-ink2">Start typing to search published articles.</p>
        )}
      </div>
    </div>
  );
}
