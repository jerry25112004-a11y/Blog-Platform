import Link from "next/link";

const LINKS = [
  { href: "/author/dashboard", label: "Dashboard" },
  { href: "/author/blogs", label: "My Blogs" },
  { href: "/author/blogs/create", label: "Create Blog" },
  { href: "/author/blogs/drafts", label: "Drafts" },
  { href: "/author/blogs/pending", label: "Pending" },
  { href: "/author/blogs/approved", label: "Approved" },
  { href: "/author/blogs/rejected", label: "Rejected" },
];

export default function AuthorSidebar({ active }: { active: string }) {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
              active === link.href
                ? "bg-ink text-paper"
                : "text-ink2 hover:bg-white hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
