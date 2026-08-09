import { prisma } from "@/lib/db";
import BlogGrid from "@/components/BlogGrid";
import Link from "next/link";
import type { Metadata } from "next";
import type { BlogCardData, SortOption } from "@/types";

export const metadata: Metadata = {
  title: "All Blogs",
  description: "Browse every published article on Inkwell.",
};

const SORTS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Popular" },
];

function orderFor(sort: SortOption) {
  if (sort === "oldest") return { publishedAt: "asc" as const };
  if (sort === "popular") return { viewCount: "desc" as const };
  return { publishedAt: "desc" as const };
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const sort = (params.sort as SortOption) || "latest";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 12;

  const where: any = { status: "PUBLISHED" };
  if (params.category) where.category = { slug: params.category };

  const [blogsRaw, total, categories] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: { category: true, author: { include: { user: { select: { name: true } } } } },
      orderBy: orderFor(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const blogs: BlogCardData[] = blogsRaw.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    description: b.description,
    featuredImage: b.featuredImage,
    readingTime: b.readingTime,
    publishedAt: b.publishedAt,
    status: b.status,
    category: { name: b.category.name, slug: b.category.slug },
    author: { name: b.author.user.name },
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container-page py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">Library</span>
          <h1 className="mt-1 font-display text-3xl font-medium text-ink">All blogs</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {SORTS.map((s) => (
            <Link
              key={s.value}
              href={`/blogs?sort=${s.value}${params.category ? `&category=${params.category}` : ""}`}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                sort === s.value ? "border-ink bg-ink text-paper" : "border-hairline text-ink2 hover:border-ink/40"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-48">
          <div className="eyebrow mb-3">Categories</div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href={`/blogs?sort=${sort}`} className={!params.category ? "font-semibold text-ink" : "text-ink2 hover:text-ink"}>
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/blogs?sort=${sort}&category=${c.slug}`}
                  className={params.category === c.slug ? "font-semibold text-ink" : "text-ink2 hover:text-ink"}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1">
          <BlogGrid blogs={blogs} />

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blogs?sort=${sort}${params.category ? `&category=${params.category}` : ""}&page=${p}`}
                  className={`h-8 w-8 rounded-full text-center text-sm leading-8 ${
                    p === page ? "bg-ink text-paper" : "text-ink2 hover:bg-white"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
