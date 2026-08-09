import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import BlogGrid from "@/components/BlogGrid";
import type { Metadata } from "next";
import type { BlogCardData } from "@/types";

export const revalidate = 60;

async function getBlog(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      author: { include: { user: { select: { name: true, email: true } } } },
      tags: { include: { tag: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog not found" };

  return {
    title: blog.title,
    description: blog.description,
    alternates: { canonical: `/blogs/${blog.slug}` },
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : undefined,
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [blog.author.user.name],
    },
    twitter: { card: "summary_large_image", title: blog.title, description: blog.description },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  // Fire-and-forget view count increment.
  prisma.blog.update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const [relatedRaw, prev, next] = await Promise.all([
    prisma.blog.findMany({
      where: { status: "PUBLISHED", categoryId: blog.categoryId, id: { not: blog.id } },
      include: { category: true, author: { include: { user: { select: { name: true } } } } },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.blog.findFirst({
      where: { status: "PUBLISHED", publishedAt: { lt: blog.publishedAt ?? new Date() } },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.blog.findFirst({
      where: { status: "PUBLISHED", publishedAt: { gt: blog.publishedAt ?? new Date() } },
      orderBy: { publishedAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  const related: BlogCardData[] = relatedRaw.map((b) => ({
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

  return (
    <article className="py-12">
      <div className="container-page max-w-3xl">
        <Link href={`/categories/${blog.category.slug}`} className="eyebrow">
          {blog.category.name}
        </Link>
        <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
          {blog.title}
        </h1>
        <p className="mt-4 text-lg text-ink2">{blog.description}</p>

        <div className="mt-6 flex items-center gap-3 border-y border-hairline py-4 text-sm text-ink2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest/10 font-display text-forest-dark">
            {blog.author.user.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-ink">{blog.author.user.name}</div>
            <div>{blog.publishedAt && formatDate(blog.publishedAt)} · {blog.readingTime} min read</div>
          </div>
        </div>
      </div>

      {blog.featuredImage && (
        <div className="container-page mt-8 max-w-4xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink/5">
            <Image src={blog.featuredImage} alt={blog.title} fill priority className="object-cover" />
          </div>
        </div>
      )}

      <div className="container-page mt-10 max-w-3xl">
        <div
          className="prose-content max-w-none text-[17px] leading-relaxed text-ink [&>h2]:mt-8 [&>h2]:font-display [&>h2]:text-2xl [&>h3]:mt-6 [&>h3]:font-display [&>h3]:text-xl [&>p]:mt-4 [&>ul]:mt-4 [&>ul]:list-disc [&>ul]:pl-6 [&>a]:text-forest-dark [&>a]:underline"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map(({ tag }) => (
              <span key={tag.id} className="rounded-full bg-white px-3 py-1 text-xs text-ink2 border border-hairline">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {blog.references && (
          <div className="mt-10 border-t border-hairline pt-6">
            <h2 className="font-display text-lg font-medium text-ink">References</h2>
            <div className="mt-2 whitespace-pre-line text-sm text-ink2">{blog.references}</div>
          </div>
        )}

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:justify-between">
          {prev ? (
            <Link href={`/blogs/${prev.slug}`} className="text-sm text-ink2 hover:text-ink">
              ← {prev.title}
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/blogs/${next.slug}`} className="text-sm text-ink2 hover:text-ink sm:text-right">
              {next.title} →
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-page mt-16 max-w-5xl border-t border-hairline pt-12">
          <h2 className="font-display text-xl font-medium text-ink">Related blogs</h2>
          <div className="mt-6">
            <BlogGrid blogs={related} />
          </div>
        </div>
      )}
    </article>
  );
}
