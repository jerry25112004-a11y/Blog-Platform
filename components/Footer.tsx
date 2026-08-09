import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-white/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-semibold text-ink">Inkwell</div>
          <p className="mt-2 max-w-xs text-sm text-ink2">
            A publishing platform for writers who care about their craft — every
            piece reviewed before it reaches readers.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-3">Read</div>
          <ul className="space-y-2 text-sm text-ink2">
            <li><Link href="/blogs" className="hover:text-ink">All blogs</Link></li>
            <li><Link href="/categories" className="hover:text-ink">Categories</Link></li>
            <li><Link href="/search" className="hover:text-ink">Search</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">Write</div>
          <ul className="space-y-2 text-sm text-ink2">
            <li><Link href="/register" className="hover:text-ink">Become an author</Link></li>
            <li><Link href="/login" className="hover:text-ink">Author log in</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-3">Platform</div>
          <ul className="space-y-2 text-sm text-ink2">
            <li><Link href="/sitemap.xml" className="hover:text-ink">Sitemap</Link></li>
            <li><Link href="/robots.txt" className="hover:text-ink">Robots</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline py-6">
        <p className="container-page text-xs text-ink2">
          © {new Date().getFullYear()} Inkwell. Built with Next.js, Prisma &amp; SQL Server.
        </p>
      </div>
    </footer>
  );
}
