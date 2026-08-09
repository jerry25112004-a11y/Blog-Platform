import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AuthorSidebar from "@/components/AuthorSidebar";
import AuthorBlogTable from "@/components/AuthorBlogTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pending" };

export default async function PendingPage() {
  const session = await getSession();
  const author = await prisma.author.findUnique({ where: { userId: session!.userId } });
  const blogs = await prisma.blog.findMany({
    where: { authorId: author!.id, status: "PENDING" },
    include: { category: true },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs/pending" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Pending review</h1>
        <AuthorBlogTable
          blogs={blogs}
          emptyTitle="Nothing pending"
          emptyDescription="Blogs you submit for review will wait here until an admin approves or rejects them."
        />
      </div>
    </div>
  );
}
