import Link from "next/link";

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Inkwell
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink2 md:flex">
          <Link href="/blogs" className="hover:text-ink">Blogs</Link>
          <Link href="/categories" className="hover:text-ink">Categories</Link>
          <Link href="/search" className="hover:text-ink">Search</Link>
        </nav>

        <div className="flex items-center gap-3" />
      </div>
    </header>
  );
}
