import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import AuthorSidebar from "@/components/AuthorSidebar";
import AuthorBlogTable from "@/components/AuthorBlogTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rejected" };

export default async function RejectedPage() {
  const session = await getSession();
  const author = await prisma.author.findUnique({ where: { userId: session!.userId } });
  const blogs = await prisma.blog.findMany({
    where: { authorId: author!.id, status: "REJECTED" },
    include: { category: true },
    orderBy: { reviewedAt: "desc" },
  });

  return (
    <div className="container-page flex flex-col gap-8 py-10 md:flex-row">
      <AuthorSidebar active="/author/blogs/rejected" />
      <div className="flex-1">
        <h1 className="mb-6 font-display text-2xl font-medium text-ink">Rejected</h1>
        <AuthorBlogTable
          blogs={blogs}
          emptyTitle="Nothing rejected"
          emptyDescription="If an admin sends a blog back for changes, you'll see the reason here and can edit and resubmit it."
          showEdit
        />
      </div>
    </div>
  );
}
