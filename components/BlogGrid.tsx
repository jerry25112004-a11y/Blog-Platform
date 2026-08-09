import BlogCard from "@/components/BlogCard";
import EmptyState from "@/components/EmptyState";
import type { BlogCardData } from "@/types";

export default function BlogGrid({
  blogs,
  emptyTitle = "No blogs yet",
  emptyDescription = "Check back soon — new stories are on their way.",
}: {
  blogs: BlogCardData[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (blogs.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog, i) => (
        <BlogCard key={blog.id} blog={blog} priority={i < 3} />
      ))}
    </div>
  );
}
