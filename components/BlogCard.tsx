import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { BlogCardData } from "@/types";

export default function BlogCard({ blog, priority = false }: { blog: BlogCardData; priority?: boolean }) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group glass-card flex flex-col overflow-hidden transition hover:shadow-glass"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
        {blog.featuredImage ? (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-ink/20">
            Inkwell
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="eyebrow">{blog.category.name}</span>
        <h3 className="mt-2 font-display text-lg font-medium leading-snug text-ink group-hover:text-forest-dark">
          {blog.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink2">{blog.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs text-ink2">
          <span>{blog.author.name}</span>
          <span>
            {blog.publishedAt ? formatDate(blog.publishedAt) : "Draft"} · {blog.readingTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
