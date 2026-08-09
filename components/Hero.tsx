import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { BlogCardData } from "@/types";

export default function Hero({ featured }: { featured: BlogCardData | null }) {
  return (
    <section className="border-b border-hairline bg-grain">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:py-20">
        <div className="flex flex-col justify-center">
          <span className="eyebrow">The Inkwell Journal</span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl">
            Writing worth
            <br /> your attention.
          </h1>
          <p className="mt-5 max-w-md text-base text-ink2">
            Every story on Inkwell is read and approved by an editor before it
            reaches you — no noise, no drafts, just finished work from writers
            who take the craft seriously.
          </p>
          <div className="mt-7 flex items-center gap-4">
            <Link href="/blogs" className="btn-primary">Start reading</Link>
            <Link href="/register" className="btn-secondary">Write on Inkwell</Link>
          </div>
        </div>

        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-glass"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-ink/5">
              {featured.featuredImage ? (
                <Image
                  src={featured.featuredImage}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-3xl text-ink/20">
                  Featured
                </div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">
                Featured
              </span>
            </div>
            <div className="p-6">
              <span className="eyebrow">{featured.category.name}</span>
              <h2 className="mt-2 font-display text-xl font-medium text-ink">{featured.title}</h2>
              <p className="mt-2 text-sm text-ink2 line-clamp-2">{featured.description}</p>
              <div className="mt-4 text-xs text-ink2">
                {featured.author.name} · {featured.publishedAt ? formatDate(featured.publishedAt) : ""} · {featured.readingTime} min read
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
