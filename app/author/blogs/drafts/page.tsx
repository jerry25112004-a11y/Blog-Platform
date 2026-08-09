import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AuthorSidebar from "@/components/AuthorSidebar";
import AuthorBlogTable from "@/components/AuthorBlogTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Drafts" };

export default async function DraftsPage() {
  const session = await getSession();
  const author = await prisma.author.findUnique({ where: { userId: session!.userId } });
  const blogs = await prisma.blog.findMany({
    where: { authorId: author!.id, status: "DRAFT" },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs/drafts" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Drafts</h1>
        <AuthorBlogTable
          blogs={blogs}
          emptyTitle="No drafts"
          emptyDescription="Unfinished blogs you're still writing will show up here."
          showEdit
        />
      </div>
    </div>
  );
}
