import Link from "next/link";

type CategoryWithCount = { name: string; slug: string; _count: { blogs: number } };

export default function CategoryList({ categories }: { categories: CategoryWithCount[] }) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className="glass-card flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink transition hover:border-forest/40 hover:text-forest-dark"
        >
          {cat.name}
          <span className="text-xs text-ink2">{cat._count.blogs}</span>
        </Link>
      ))}
    </div>
  );
}
