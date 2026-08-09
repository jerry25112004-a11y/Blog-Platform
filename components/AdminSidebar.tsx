import Link from "next/link";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/blogs", label: "Blog Management" },
  { href: "/admin/pending", label: "Pending Reviews" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/authors", label: "Authors" },
];

export default function AdminSidebar({ active }: { active: string }) {
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
