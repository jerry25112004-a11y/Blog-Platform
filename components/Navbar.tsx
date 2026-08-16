import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getSession();

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

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link
                href={session.role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard"}
                className="btn-primary"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-primary">
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Start writing
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
