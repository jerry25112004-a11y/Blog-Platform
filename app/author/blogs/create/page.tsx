import { prisma } from "@/lib/db";
import AuthorSidebar from "@/components/AuthorSidebar";
import BlogEditorForm from "@/components/BlogEditorForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Blog" };

export default async function CreateBlogPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs/create" />
      <div className="flex-1 max-w-3xl">
        <h1 className="mb-1 font-display text-2xl font-medium text-ink">Create a new blog</h1>
        <p className="mb-6 text-sm text-ink2">
          Save it as a draft, or submit it straight away for admin review.
        </p>
        <BlogEditorForm categories={categories} />
      </div>
    </div>
  );
}
