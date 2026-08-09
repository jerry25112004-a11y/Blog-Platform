import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import AuthorSidebar from "@/components/AuthorSidebar";
import BlogEditorForm from "@/components/BlogEditorForm";
import StatusBadge from "@/components/StatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Blog" };

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  const author = await prisma.author.findUnique({ where: { userId: session!.userId } });
  const [blog, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id: Number(id) } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!blog || !author || blog.authorId !== author.id) notFound();
  if (!["DRAFT", "REJECTED"].includes(blog.status)) {
    return (
      <div className="container-page py-10">
        <p className="text-sm text-ink2">This blog can no longer be edited — it&apos;s already {blog.status.toLowerCase()}.</p>
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs" />
      <div className="flex-1 max-w-3xl">
        <div className="mb-1 flex items-center gap-3">
          <h1 className="font-display text-2xl font-medium text-ink">Edit blog</h1>
          <StatusBadge status={blog.status} />
        </div>
        {blog.status === "REJECTED" && blog.rejectReason && (
          <p className="mb-4 rounded-lg bg-clay/10 px-4 py-2.5 text-sm text-clay">
            Rejection reason: {blog.rejectReason}
          </p>
        )}
        <BlogEditorForm
          categories={categories}
          initial={{
            id: blog.id,
            title: blog.title,
            description: blog.description,
            content: blog.content,
            categoryId: blog.categoryId,
            featuredImage: blog.featuredImage || "",
            references: blog.references || "",
          }}
        />
      </div>
    </div>
  );
}
